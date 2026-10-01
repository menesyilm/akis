import { describe, expect, it } from "vitest";
import { requestSchema } from "@/lib/request-schema";

describe("requestSchema validation", () => {
  const validData = {
    name: "Deneme Kullanıcısı",
    email: "deneme@example.com",
    service: "order-tracking",
    description: "Sipariş takibi için detaylı bir test açıklaması.",
  };

  it("geçerli veriyi başarıyla doğrular", () => {
    const result = requestSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Deneme Kullanıcısı");
      expect(result.data.service).toBe("order-tracking");
    }
  });

  it("boşlukları trim eder", () => {
    const result = requestSchema.safeParse({
      ...validData,
      name: "   Ahmet Yılmaz   ",
      email: "  ahmet@example.com  ",
      description: "   Yeterince uzun bir talep açıklaması.   ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Ahmet Yılmaz");
      expect(result.data.email).toBe("ahmet@example.com");
      expect(result.data.description).toBe("Yeterince uzun bir talep açıklaması.");
    }
  });

  it("kısa ismi reddeder (<2 karakter)", () => {
    const result = requestSchema.safeParse({ ...validData, name: "A" });
    expect(result.success).toBe(false);
  });

  it("aşırı uzun ismi reddeder (>80 karakter)", () => {
    const result = requestSchema.safeParse({ ...validData, name: "A".repeat(81) });
    expect(result.success).toBe(false);
  });

  it("hatalı e-posta biçimini reddeder", () => {
    const result = requestSchema.safeParse({ ...validData, email: "invalid-email" });
    expect(result.success).toBe(false);
  });

  it("tanımsız hizmet seçimini reddeder", () => {
    const result = requestSchema.safeParse({ ...validData, service: "non-existent-service" });
    expect(result.success).toBe(false);
  });

  it("kısa açıklamayı reddeder (<10 karakter)", () => {
    const result = requestSchema.safeParse({ ...validData, description: "Kısa" });
    expect(result.success).toBe(false);
  });

  it("aşırı uzun açıklamayı reddeder (>1000 karakter)", () => {
    const result = requestSchema.safeParse({ ...validData, description: "A".repeat(1001) });
    expect(result.success).toBe(false);
  });
});
