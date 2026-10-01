import { NextResponse } from "next/server";

import { getVerifiedAdminSession } from "@/lib/server/admin-session";
import { deleteServiceRequest } from "@/lib/server/request-repository";

export const runtime = "nodejs";

function jsonError(message: string, status: number) {
  return NextResponse.json(
    { success: false, error: message },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ requestId: string }> },
) {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return jsonError("İstek kaynağı doğrulanamadı.", 403);
  }

  let session = null;
  try {
    session = await getVerifiedAdminSession();
  } catch {
    session = null;
  }
  if (!session) return jsonError("Yönetici oturumu gerekli.", 401);

  const { requestId } = await params;
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(requestId)) {
    return jsonError("Talep numarası geçersiz.", 400);
  }

  try {
    const deleted = await deleteServiceRequest(requestId);
    if (!deleted) return jsonError("Talep bulunamadı.", 404);
    return new NextResponse(null, {
      status: 204,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    console.error("Talep Firestore'dan silinemedi.");
    return jsonError("Talep silinemedi. Lütfen yeniden deneyin.", 500);
  }
}
