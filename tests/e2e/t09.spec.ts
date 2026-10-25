import { expect, test } from "@playwright/test";

/** Her test kendi IP'siyle gelir; böylece bellek içi rate limit testler arasında paylaşılmaz. */
const randomIp = () =>
  `10.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}`;

async function fillContact(page: import("@playwright/test").Page) {
  await page.getByLabel("Adınız soyadınız").fill("Deniz Örnek");
  await page.getByLabel("E-posta").fill("deniz@ornek.example");
  await page.getByLabel("Konu", { exact: true }).selectOption("feedback");
  await page.getByLabel(/^Mesajınız/).fill("Otopark yönlendirmeleri için teşekkür ederim.");
}

test.describe("iletişim formu", () => {
  test.beforeEach(async ({ page }) => page.setExtraHTTPHeaders({ "x-forwarded-for": randomIp() }));

  test("boş gönderimde hata özeti odak alır; geçerli gönderim başarı mesajı verir", async ({
    page,
  }) => {
    await page.goto("/iletisim");
    await page.getByRole("button", { name: "Gönder" }).click();
    await expect(page.locator("#contact-errors")).toBeFocused();
    await fillContact(page);
    await expect(page.getByText("hasta hakları birimine iletilir")).toBeVisible();
    await page.waitForTimeout(2600); // minimum doldurma süresi (bot koruması)
    await page.getByRole("button", { name: "Gönder" }).click();
    await expect(page.getByText(/Mesajınız alındı \(demo\)/)).toBeVisible();
  });

  test("e-posta ve telefon boşsa reddeder", async ({ page }) => {
    await page.goto("/iletisim");
    await fillContact(page);
    await page.getByLabel("E-posta").fill("");
    await page.getByRole("button", { name: "Gönder" }).click();
    await expect(
      page.getByText("E-posta veya telefondan en az birini girin.").first(),
    ).toBeVisible();
  });

  test("aynı IP'den 6. mesaj rate limit ile reddedilir", async ({ page }) => {
    await page.goto("/iletisim");
    await fillContact(page);
    await page.waitForTimeout(2600);
    for (let i = 0; i < 5; i++) {
      await page.getByRole("button", { name: "Gönder" }).click();
      await expect(page.getByText(/Mesajınız alındı/)).toBeVisible();
      await page.getByRole("button", { name: "Yeni mesaj" }).click();
      await fillContact(page);
      await page.waitForTimeout(2600);
    }
    await page.getByRole("button", { name: "Gönder" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "çok fazla mesaj" })).toBeVisible();
  });
});

test("site araması farklı içerik türlerini listeler", async ({ page }) => {
  await page.goto("/arama?q=otopark");
  await expect(page.getByRole("status").filter({ hasText: "sonuç" })).toContainText(
    '"otopark" için',
  );
  await expect(
    page
      .getByRole("link", { name: "Ulaşım ve otopark" })
      .or(page.getByRole("link", { name: /Otopark/ }))
      .first(),
  ).toBeVisible();
  await page.goto("/arama?q=zzzzqq");
  await expect(page.getByText(/için sonuç bulunamadı/)).toBeVisible();
});

test.describe("konum", () => {
  test.use({ permissions: ["geolocation"], geolocation: { latitude: 40.98, longitude: 28.88 } }); // Bakırköy yakını

  test("bana en yakın: şubeler mesafeye göre sıralanır", async ({ page }) => {
    await page.goto("/lokasyonlar");
    await page.getByRole("button", { name: "Bana en yakın şubeyi bul" }).click();
    await expect(page.getByText(/^Yaklaşık .* km$/).first()).toBeVisible();
    await expect(page.getByRole("main").getByRole("heading", { level: 3 }).first()).toHaveText(
      "Bakırköy Tıp Merkezi",
    );
  });
});

test("sitemap ve robots", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("/yasal/kvkk");
  expect(sitemap).toContain("/doktorlar/sukru-erdem");
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toMatch(/Disallow: \//);
});

test.describe("kırık link taraması", () => {
  test.skip(({ isMobile }) => isMobile, "bir kez yeterli");
  test.setTimeout(180_000);

  test("ana sayfadan erişilen tüm iç linkler 200 döner", async ({ request }) => {
    const seen = new Set<string>(["/"]);
    const queue = ["/"];
    const broken: string[] = [];
    while (queue.length) {
      const path = queue.shift()!;
      const res = await request.get(path);
      if (res.status() !== 200) {
        broken.push(`${path} → ${res.status()}`);
        continue;
      }
      if (!(res.headers()["content-type"] ?? "").includes("text/html")) continue;
      const hrefs = [...(await res.text()).matchAll(/<a[^>]*?href="([^"]+)"/g)].map((m) =>
        m[1]!.replace(/&amp;/g, "&"),
      );
      for (const href of hrefs) {
        if (!href.startsWith("/") || href.startsWith("//")) continue;
        const clean = href.split("#")[0]!.split("?")[0]!;
        if (clean && !seen.has(clean)) {
          seen.add(clean);
          queue.push(clean);
        }
      }
    }
    expect(broken).toEqual([]);
    expect(seen.size).toBeGreaterThan(100);
  });
});
