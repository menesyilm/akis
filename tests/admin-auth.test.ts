import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  cookieGet: vi.fn(), verifyIdToken: vi.fn(), verifySessionCookie: vi.fn(),
  createSessionCookie: vi.fn(), deleteRequest: vi.fn(),
}));
vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ cookies: async () => ({ get: mocks.cookieGet }) }));
vi.mock("@/lib/server/firebase-admin", () => ({ getAdminAuth: () => mocks }));
vi.mock("@/lib/server/request-repository", () => ({ deleteServiceRequest: mocks.deleteRequest }));

import { POST as sessionPOST } from "@/app/api/auth/session/route";
import { POST as logoutPOST } from "@/app/api/auth/logout/route";
import { DELETE } from "@/app/api/admin/requests/[requestId]/route";
import { getVerifiedAdminSession, isConfiguredAdminEmail } from "@/lib/server/admin-session";

const origin = "https://example.test";
function sessionRequest(body: unknown = { idToken: "test-token" }, requestOrigin = origin) {
  return new Request(`${origin}/api/auth/session`, {
    method: "POST", headers: { origin: requestOrigin, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}
function deleteRequest(id = "test-document", requestOrigin = origin) {
  return DELETE(new Request(`${origin}/api/admin/requests/${id}`, {
    method: "DELETE", headers: { origin: requestOrigin },
  }), { params: Promise.resolve({ requestId: id }) });
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv("ADMIN_EMAIL", "admin@example.com, second@example.com");
  vi.stubEnv("FIREBASE_PROJECT_ID", "test-project");
  vi.stubEnv("FIREBASE_CLIENT_EMAIL", "test-service-account@example.com");
  vi.stubEnv("FIREBASE_PRIVATE_KEY", "mock-key");
  mocks.verifyIdToken.mockResolvedValue({ email: "admin@example.com", auth_time: Math.floor(Date.now() / 1000) });
  mocks.verifySessionCookie.mockResolvedValue({ email: "admin@example.com" });
  mocks.createSessionCookie.mockResolvedValue("mock-session-cookie");
  mocks.deleteRequest.mockResolvedValue(true);
});
afterEach(() => vi.unstubAllEnvs());

describe("admin authentication and authorization", () => {
  it("normalizes the explicit email allowlist", () => {
    expect(isConfiguredAdminEmail(" ADMIN@EXAMPLE.COM ")).toBe(true);
    expect(isConfiguredAdminEmail("second@example.com")).toBe(true);
    expect(isConfiguredAdminEmail("outsider@example.com")).toBe(false);
    expect(isConfiguredAdminEmail(undefined)).toBe(false);
  });
  it("rejects cross-origin session creation before token verification", async () => {
    expect((await sessionPOST(sessionRequest(undefined, "https://other.test"))).status).toBe(403);
    expect(mocks.verifyIdToken).not.toHaveBeenCalled();
  });
  it("rejects missing token", async () => {
    expect((await sessionPOST(sessionRequest({}))).status).toBe(400);
    expect(mocks.verifyIdToken).not.toHaveBeenCalled();
  });
  it("bounds session bodies even without Content-Length", async () => {
    const request = sessionRequest({ idToken: "x".repeat(17_000) });
    expect(request.headers.has("content-length")).toBe(false);
    expect((await sessionPOST(request)).status).toBe(413);
    expect(mocks.verifyIdToken).not.toHaveBeenCalled();
  });
  it("rejects users outside the allowlist", async () => {
    mocks.verifyIdToken.mockResolvedValue({ email: "outsider@example.com" });
    expect((await sessionPOST(sessionRequest())).status).toBe(403);
    expect(mocks.createSessionCookie).not.toHaveBeenCalled();
  });
  it("requires recent authentication", async () => {
    mocks.verifyIdToken.mockResolvedValue({ email: "admin@example.com", auth_time: Date.now() / 1000 - 301 });
    expect((await sessionPOST(sessionRequest())).status).toBe(401);
    expect(mocks.createSessionCookie).not.toHaveBeenCalled();
  });
  it("sets a secure HttpOnly SameSite cookie after verification", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const response = await sessionPOST(sessionRequest());
    expect(response.status).toBe(200);
    const cookie = response.headers.get("set-cookie");
    expect(cookie).toContain("HttpOnly"); expect(cookie).toContain("Secure");
    expect(cookie).toContain("SameSite=lax");
    expect(mocks.verifyIdToken).toHaveBeenCalledWith("test-token", true);
  });
  it("returns 401 for revoked tokens and 503 for service failures", async () => {
    mocks.verifyIdToken.mockRejectedValueOnce({ code: "auth/id-token-revoked" });
    expect((await sessionPOST(sessionRequest())).status).toBe(401);
    mocks.verifyIdToken.mockRejectedValueOnce({ code: "auth/internal-error" });
    expect((await sessionPOST(sessionRequest())).status).toBe(503);
  });
  it("denies anonymous and revoked sessions", async () => {
    expect(await getVerifiedAdminSession()).toBeNull();
    expect(mocks.verifySessionCookie).not.toHaveBeenCalled();
    mocks.cookieGet.mockReturnValue({ value: "expired-cookie" });
    mocks.verifySessionCookie.mockRejectedValue({ code: "auth/session-cookie-revoked" });
    expect(await getVerifiedAdminSession()).toBeNull();
  });
  it("rejects a valid session belonging to another user", async () => {
    mocks.cookieGet.mockReturnValue({ value: "test-cookie" });
    mocks.verifySessionCookie.mockResolvedValue({ email: "outsider@example.com" });
    expect(await getVerifiedAdminSession()).toBeNull();
  });
  it("clears the cookie on same-origin logout", async () => {
    const response = await logoutPOST(new Request(`${origin}/api/auth/logout`, { method: "POST", headers: { origin } }));
    expect(response.status).toBe(303);
    expect(response.headers.get("set-cookie")).toContain("Max-Age=0");
    expect(response.headers.get("location")).toBe(`${origin}/login`);
  });
  it("rejects cross-origin logout", async () => {
    const response = await logoutPOST(new Request(`${origin}/api/auth/logout`, { method: "POST", headers: { origin: "https://other.test" } }));
    expect(response.status).toBe(403);
    expect(response.headers.get("set-cookie")).toBeNull();
  });
});

describe("admin deletion", () => {
  it("requires a same-origin request", async () => {
    expect((await deleteRequest("test-document", "https://other.test")).status).toBe(403);
    expect(mocks.deleteRequest).not.toHaveBeenCalled();
  });
  it("requires a verified session", async () => {
    expect((await deleteRequest()).status).toBe(401);
    expect(mocks.deleteRequest).not.toHaveBeenCalled();
  });
  it("rejects invalid document IDs", async () => {
    mocks.cookieGet.mockReturnValue({ value: "valid-cookie" });
    expect((await deleteRequest("../invalid")).status).toBe(400);
    expect(mocks.deleteRequest).not.toHaveBeenCalled();
  });
  it("deletes only after authorization", async () => {
    mocks.cookieGet.mockReturnValue({ value: "valid-cookie" });
    expect((await deleteRequest()).status).toBe(204);
    expect(mocks.deleteRequest).toHaveBeenCalledWith("test-document");
  });
  it("distinguishes missing documents and storage failures", async () => {
    mocks.cookieGet.mockReturnValue({ value: "valid-cookie" });
    mocks.deleteRequest.mockResolvedValueOnce(false);
    expect((await deleteRequest()).status).toBe(404);
    mocks.deleteRequest.mockRejectedValueOnce(new Error("secret-internal-details"));
    const response = await deleteRequest();
    expect(response.status).toBe(500);
    expect(JSON.stringify(await response.json())).not.toContain("secret-internal-details");
  });
});
