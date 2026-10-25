import { describe, expect, it } from "vitest";
import { distanceKm } from "@/features/branches/NearestBranches";
import { createRateLimiter } from "@/features/contact/rateLimit";
import { contactSchema } from "@/features/contact/schema";
import { searchSite } from "@/features/search/siteSearch";
import { listKnownPaths } from "@/lib/known-paths";

describe("rate limiter", () => {
  it("pencere içinde 6. istek reddedilir, pencere dolunca tekrar izin verilir", () => {
    const allow = createRateLimiter({ limit: 5, windowMs: 600_000 });
    const results = Array.from({ length: 6 }, (_, i) => allow("1.2.3.4", 1000 + i));
    expect(results).toEqual([true, true, true, true, true, false]);
    expect(allow("5.6.7.8", 2000)).toBe(true);
    expect(allow("1.2.3.4", 1000 + 600_001)).toBe(true);
  });
});

describe("contactSchema", () => {
  const ok = {
    name: "Deniz Örnek",
    email: "d@ornek.example",
    phone: "",
    topic: "general",
    message: "Otopark hakkında bir sorum var.",
  };
  it("geçerli mesajı kabul eder", () => expect(contactSchema.safeParse(ok).success).toBe(true));
  it("e-posta ve telefon ikisi de boşsa reddeder", () => {
    const r = contactSchema.safeParse({ ...ok, email: "" });
    expect(r.error?.issues[0]?.message).toBe("contact");
  });
  it("gerçek telefon kalıbını ve 2000 karakteri aşan mesajı reddeder", () => {
    expect(contactSchema.safeParse({ ...ok, phone: "0532 111 22 33" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...ok, message: "a".repeat(2001) }).success).toBe(false);
  });
});

describe("site araması", () => {
  it("aksan duyarsız; başlık eşleşmesi önde; farklı içerik türlerini kapsar", async () => {
    const r = await searchSite("otopark");
    expect(r.length).toBeGreaterThan(0);
    expect(new Set(r.map((x) => x.type)).size).toBeGreaterThan(1);
    expect((await searchSite("sukru"))[0]?.title).toBe("Prof. Dr. Şükrü Erdem");
    expect((await searchSite("kvkk"))[0]?.href).toBe("/yasal/kvkk");
    expect(await searchSite("x")).toEqual([]);
  });
});

describe("bilinen yollar", () => {
  it("benzersiz ve tüm içerik türlerini içerir", async () => {
    const paths = await listKnownPaths();
    expect(new Set(paths).size).toBe(paths.length);
    for (const p of [
      "/",
      "/iletisim",
      "/yasal/kvkk",
      "/hasta-rehberi/sss",
      "/duyurular/grip-asisi-donemi",
      "/saglik-rehberi/kategori/beslenme",
    ])
      expect(paths).toContain(p);
  });
});

it("distanceKm: Ataşehir–Bakırköy ≈ 21 km", () => {
  expect(distanceKm({ lat: 40.9923, lng: 29.1244 }, { lat: 40.9819, lng: 28.8772 })).toBeCloseTo(
    20.8,
    0,
  );
});
