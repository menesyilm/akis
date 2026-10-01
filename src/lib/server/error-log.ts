import "server-only";

// Log only a bounded SDK code. Never log messages, tokens, credentials or payloads.
export function serverErrorCode(error: unknown): string {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = error.code;
    if (typeof code === "number" && Number.isInteger(code)) return String(code);
    if (typeof code === "string" && /^[a-zA-Z0-9_/-]{1,80}$/.test(code)) return code;
  }
  return "unknown";
}

export function logServerError(operation: string, error: unknown) {
  console.error("Server operation failed", { operation, code: serverErrorCode(error) });
}
