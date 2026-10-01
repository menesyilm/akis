import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock server-only and repository before importing the route
vi.mock("server-only", () => ({}));
vi.mock("@/lib/server/request-repository", () => ({
  createServiceRequest: vi.fn(async (input: { name: string }) => {
    if (input.name === "Database Error") {
      throw new Error("Firestore connection failure");
    }
    return "mocked-doc-id-12345";
  }),
}));

import { POST } from "@/app/api/requests/route";
import { createServiceRequest } from "@/lib/server/request-repository";

describe("POST /api/requests route handler", () => {
  beforeEach(() => vi.clearAllMocks());
  function createJsonRequest(body: unknown, headers: Record<string, string> = {}) {
    return new Request("http://localhost:3000/api/requests", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...headers,
      },
      body: typeof body === "string" ? body : JSON.stringify(body),
    });
  }

  it("Content-Type application/json değilse 415 döner", async () => {
    const req = new Request("http://localhost:3000/api/requests", {
      method: "POST",
      headers: { "content-type": "text/plain" },
      body: "plain text",
    });
    const res = await POST(req);
    expect(res.status).toBe(415);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain("JSON");
  });

  it("Bozuk JSON gövdesinde 400 döner", async () => {
    const req = new Request("http://localhost:3000/api/requests", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: '{"invalid": json syntax',
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain("geçerli JSON değil");
  });

  it("Honeypot (companyWebsite) doluysa 400 döner", async () => {
    const req = createJsonRequest({
      name: "Bot Kullanıcı",
      email: "bot@example.com",
      service: "order-tracking",
      description: "Bot tarafından gönderilen talep.",
      companyWebsite: "https://spam.example.com",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
  });

  it("Doğrulama hatasında 400 döner", async () => {
    const req = createJsonRequest({
      name: "A", // Çok kısa
      email: "invalid-email",
      service: "invalid-service",
      description: "Kısa",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain("Form alanlarını");
    expect(createServiceRequest).not.toHaveBeenCalled();
  });

  it("Geçerli veriyle 201 ve requestId döner", async () => {
    const req = createJsonRequest({
      name: "Mehmet Demir",
      email: "mehmet@example.com",
      service: "reporting",
      description: "Otomatik günlük satış raporlaması talebi.",
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.requestId).toBe("mocked-doc-id-12345");
  });

  it("Veritabanı hatasında 500 döner ve iç hata detayını ifşa etmez", async () => {
    const req = createJsonRequest({
      name: "Database Error",
      email: "test@example.com",
      service: "reporting",
      description: "Veritabanı hatasını tetikleyen açıklama.",
    });
    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain("kaydedilemedi");
    expect(data.error).not.toContain("Firestore");
  });

  it("Content-Length boyut sınırını repository'ye ulaşmadan uygular", async () => {
    const response = await POST(createJsonRequest({}, { "content-length": "16385" }));
    expect(response.status).toBe(413);
    expect(createServiceRequest).not.toHaveBeenCalled();
  });

  it("Content-Length olmadan gerçek stream boyutunu sınırlar", async () => {
    const body = new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array(8192));
        controller.enqueue(new Uint8Array(8193));
        controller.close();
      },
    });
    const request = new Request("http://localhost:3000/api/requests", {
      method: "POST", headers: { "content-type": "application/json" }, body, duplex: "half",
    } as RequestInit);
    const response = await POST(request);
    expect(response.status).toBe(413);
    expect(createServiceRequest).not.toHaveBeenCalled();
  });

  it("yazma tamamlanmadan başarı dönmez", async () => {
    let resolveWrite!: (id: string) => void;
    vi.mocked(createServiceRequest).mockImplementationOnce(() => new Promise((resolve) => { resolveWrite = resolve; }));
    let settled = false;
    const pending = POST(createJsonRequest({
      name: "Deneme Kullanıcısı", email: "deneme@example.com", service: "reporting",
      description: "Kalıcı kayıt sözleşmesi için kurgusal test.",
    })).then((response) => { settled = true; return response; });
    await vi.waitFor(() => expect(createServiceRequest).toHaveBeenCalledOnce());
    expect(settled).toBe(false);
    resolveWrite("persisted-test-id");
    const response = await pending;
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ success: true, requestId: "persisted-test-id" });
  });
});
