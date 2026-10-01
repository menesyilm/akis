import { NextResponse } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_DURATION_MS,
  isConfiguredAdminEmail,
} from "@/lib/server/admin-session";
import { getAdminAuth } from "@/lib/server/firebase-admin";
import { logServerError, serverErrorCode } from "@/lib/server/error-log";
import { readJsonBody, PayloadTooLargeError } from "@/lib/server/json-body";

export const runtime = "nodejs";

function jsonError(message: string, status: number) {
  return NextResponse.json({ success: false, error: message }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const expectedOrigin = new URL(request.url).origin;
  if (request.headers.get("origin") !== expectedOrigin) {
    return jsonError("İstek kaynağı doğrulanamadı.", 403);
  }

  if (!process.env.ADMIN_EMAIL?.trim()) {
    return jsonError("Yönetici hesabı sunucu ortamında yapılandırılmamış.", 503);
  }
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
    return jsonError("Firebase Admin sunucu ayarları tamamlanmamış.", 503);
  }
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return jsonError("İstek JSON biçiminde olmalı.", 415);
  }
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > 16 * 1024) {
    return jsonError("Giriş isteği çok büyük.", 413);
  }

  let body: unknown;
  try {
    body = await readJsonBody(request);
  } catch (error) {
    if (error instanceof PayloadTooLargeError) return jsonError("Giriş isteği çok büyük.", 413);
    return jsonError("Giriş isteği okunamadı.", 400);
  }

  const idToken = typeof body === "object" && body !== null && "idToken" in body && typeof body.idToken === "string"
    ? body.idToken
    : "";
  if (!idToken || idToken.length > 10_000) return jsonError("Giriş bilgileri doğrulanamadı.", 400);

  try {
    const auth = getAdminAuth();
    const decodedToken = await auth.verifyIdToken(idToken, true);
    if (!isConfiguredAdminEmail(decodedToken.email)) {
      return jsonError("Bu hesap yönetici erişkisine sahip değil.", 403);
    }

    const authTime = typeof decodedToken.auth_time === "number" ? decodedToken.auth_time : 0;
    if (!authTime || Date.now() / 1000 - authTime > 5 * 60) {
      return jsonError("Güvenlik için yeniden giriş yapın.", 401);
    }

    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn: ADMIN_SESSION_DURATION_MS });
    const response = NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
    response.cookies.set(ADMIN_SESSION_COOKIE, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_SESSION_DURATION_MS / 1000,
    });
    return response;
  } catch (error) {
    logServerError("auth.session", error);
    const invalidTokenCodes = new Set([
      "auth/argument-error", "auth/invalid-id-token", "auth/id-token-expired",
      "auth/id-token-revoked", "auth/user-disabled", "auth/user-not-found",
    ]);
    if (invalidTokenCodes.has(serverErrorCode(error))) {
      return jsonError("Giriş doğrulanamadı. Bilgilerinizi kontrol edip yeniden deneyin.", 401);
    }
    return jsonError("Oturum hizmetine şu anda ulaşılamıyor. Lütfen daha sonra yeniden deneyin.", 503);
  }
}
