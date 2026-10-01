import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { logServerError } from "@/lib/server/error-log";

describe("safe server diagnostics", () => {
  it("logs only the operation and code, excluding sensitive details", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      logServerError("requests.create", { code: "PERMISSION_DENIED", message: "secret-key", token: "secret-token", stack: "private-stack" });
      expect(spy).toHaveBeenCalledWith("Server operation failed", { operation: "requests.create", code: "PERMISSION_DENIED" });
      logServerError("requests.create", { code: "Bearer secret-token" });
      expect(spy).toHaveBeenLastCalledWith("Server operation failed", { operation: "requests.create", code: "unknown" });
    } finally { spy.mockRestore(); }
  });
});
