import { NextResponse } from "next/server";

import { requestSchema } from "@/lib/request-schema";
import { createServiceRequest } from "@/lib/server/request-repository";
import { logServerError } from "@/lib/server/error-log";

import { MAX_BODY_BYTES, PayloadTooLargeError, readJsonBody } from "@/lib/server/json-body";

export const runtime = "nodejs";

function jsonError(message: string, status: number) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
  if (contentType !== "application/json") {
    return jsonError("İstek JSON biçiminde olmalı.", 415);
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return jsonError("İstek boyutu izin verilen sınırı aşıyor.", 413);
  }

  let body: unknown;
  try {
    body = await readJsonBody(request);
  } catch (error) {
    if (error instanceof PayloadTooLargeError) {
      return jsonError("İstek boyutu izin verilen sınırı aşıyor.", 413);
    }
    if (error instanceof SyntaxError) {
      return jsonError("İstek gövdesi geçerli JSON değil.", 400);
    }
    return jsonError("İstek okunamadı.", 400);
  }

  if (
    typeof body === "object" &&
    body !== null &&
    "companyWebsite" in body &&
    typeof body.companyWebsite === "string" &&
    body.companyWebsite.trim().length > 0
  ) {
    return jsonError("Talep doğrulanamadı. Bilgilerinizi kontrol edip yeniden deneyin.", 400);
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Form alanlarını kontrol edip yeniden deneyin.", 400);
  }

  try {
    const requestId = await createServiceRequest(parsed.data);
    return NextResponse.json({ success: true, requestId }, { status: 201 });
  } catch (error) {
    logServerError("requests.create", error);
    return jsonError("Talebiniz şu anda kaydedilemedi. Lütfen biraz sonra yeniden deneyin.", 500);
  }
}
