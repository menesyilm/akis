import "server-only";

import { cookies } from "next/headers";

import { getAdminAuth } from "@/lib/server/firebase-admin";

export const ADMIN_SESSION_COOKIE = "akis_admin_session";
export const ADMIN_SESSION_DURATION_MS = 5 * 24 * 60 * 60 * 1000;

export function isConfiguredAdminEmail(email: string | undefined) {
  const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  return Boolean(configuredEmail && email?.trim().toLowerCase() === configuredEmail);
}

export async function getVerifiedAdminSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!sessionCookie || !process.env.ADMIN_EMAIL?.trim()) return null;

  try {
    const decoded = await getAdminAuth().verifySessionCookie(sessionCookie, true);
    if (!isConfiguredAdminEmail(decoded.email)) return null;
    return { email: decoded.email! };
  } catch {
    return null;
  }
}
