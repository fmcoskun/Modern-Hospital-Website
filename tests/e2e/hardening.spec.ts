import { expect, test, type Page } from "@playwright/test";

/** CSP ihlallerini sayfa yüklenmeden önce dinlemeye başla. */
async function trackCsp(page: Page) {
  const violations: string[] = [];
  page.on("console", (m) => {
    if (/Content Security Policy|Refused to/i.test(m.text()))
      violations.push(m.text().slice(0, 200));
  });
  await page.addInitScript(() => {
    document.addEventListener("securitypolicyviolation", (e) =>
      console.error(`Refused to load (CSP): ${e.violatedDirective} ${e.blockedURI}`),
    );
  });
  return violations;
}

test.describe("güvenlik başlıkları ve CSP", () => {
  test.skip(({ isMobile }) => isMobile, "başlıklar cihazdan bağımsız");

  test("tüm güvenlik başlıkları mevcut", async ({ request }) => {
    const res = await request.get("/");
    const h = res.headers();
    expect(h["content-security-policy"]).toContain("default-src 'self'");
    expect(h["content-security-policy"]).toContain("object-src 'none'");
    expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(h["strict-transport-security"]).toContain("max-age=");
    expect(h["x-content-type-options"]).toBe("nosniff");
    expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(h["x-frame-options"]).toBe("DENY");
    expect(h["cross-origin-opener-policy"]).toBe("same-origin");
    expect(h["permissions-policy"]).toContain("camera=()");
    expect(h["x-powered-by"]).toBeUndefined();
  });

  test("ana akışlarda CSP ihlali yok (3D, harita, randevu)", async ({ page, isMobile }) => {
    const violations = await trackCsp(page);
    await page.goto("/kurumsal/olanaklar");
    // Masaüstünde keşif modu sahneyi kendisi yükler; mobilde kullanıcı butona basar.
    if (isMobile) await page.getByRole("button", { name: "3D görünümü aç" }).click();
    await expect(page.locator('[data-testid="campus-canvas"] canvas')).toBeAttached({
      timeout: 15_000,
    });
    await page.goto("/lokasyonlar/merkez-kampus");
    await page.getByRole("button", { name: "Haritayı yükle" }).click();
    await expect(page.locator("iframe[src*='openstreetmap']")).toBeAttached();
    await page.goto("/randevu/yeni?bolum=kardiyoloji&sube=merkez-kampus");
    await expect(page.getByRole("heading", { name: "Bir doktor seçin" })).toBeVisible();
    await page.goto("/iletisim");
    await page.goto("/doktorlar?bolum=noroloji");
    expect(violations).toEqual([]);
  });
});

test.describe("SEO ve meta veri", () => {
  test.skip(({ isMobile }) => isMobile, "bir kez yeterli");
  test.setTimeout(240_000);

  test("sitemap'teki her sayfa: tek H1, benzersiz başlık ve açıklama, canonical, geçerli JSON-LD", async ({
    request,
  }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]!).pathname);
    expect(paths.length).toBeGreaterThan(120);
    const titles = new Map<string, string>();
    const problems: string[] = [];
    for (const path of paths) {
      const html = await (await request.get(path)).text();
      const h1 = html.match(/<h1[\s>]/g)?.length ?? 0;
      const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
      const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
      const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
      if (h1 !== 1) problems.push(`${path}: ${h1} adet h1`);
      if (!title) problems.push(`${path}: title yok`);
      if (desc.length < 20) problems.push(`${path}: açıklama yok/kısa`);
      if (!canonical) problems.push(`${path}: canonical yok`);
      const dup = titles.get(title);
      if (dup) problems.push(`${path}: başlık ${dup} ile aynı`);
      titles.set(title, path);
      for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
        try {
          const ld = JSON.parse(m[1]!);
          for (const item of Array.isArray(ld) ? ld : [ld])
            if (item["@context"] !== "https://schema.org")
              problems.push(`${path}: JSON-LD @context`);
        } catch {
          problems.push(`${path}: JSON-LD parse edilemedi`);
        }
      }
    }
    expect(problems).toEqual([]);
  });
});
