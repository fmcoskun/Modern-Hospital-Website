import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function expectNoSeriousA11y(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  const serious = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  expect(
    serious.map(
      (v) =>
        `${v.id}: ${v.nodes
          .map((n) => n.target.join(" "))
          .slice(0, 3)
          .join(" | ")}`,
    ),
  ).toEqual([]);
}

async function noHorizontalOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
}

test.describe("şablon sayfaları: erişilebilirlik ve taşma", () => {
  for (const path of [
    "/",
    "/tibbi-birimler",
    "/tibbi-birimler/kardiyoloji",
    "/tibbi-birimler/acil-servis",
    "/doktorlar",
    "/doktorlar/sukru-erdem",
    "/randevu/yeni",
    "/kurumsal/hakkimizda",
    "/saglik-rehberi",
    "/saglik-rehberi/check-up-oncesi-hazirlik",
    "/lokasyonlar",
    "/lokasyonlar/merkez-kampus",
    "/demo-hakkinda",
    "/kurumsal/olanaklar",
    "/kurumsal/anlasmali-kurumlar",
    "/hasta-rehberi",
    "/hasta-rehberi/ilk-ziyaret",
    "/hasta-rehberi/ulasim-ve-otopark",
    "/hasta-rehberi/ziyaret-saatleri",
    "/hasta-rehberi/sss",
    "/yasal/kvkk",
    "/duyurular",
    "/duyurular/grip-asisi-donemi",
    "/saglik-rehberi/kategori/hastaliklar",
    "/iletisim",
    "/arama?q=otopark",
  ]) {
    test(`${path}`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expectNoSeriousA11y(page);
      await noHorizontalOverflow(page);
    });
  }
});

test("bilinmeyen yollar gerçek 404 döner", async ({ page }) => {
  expect((await page.goto("/boyle-bir-sayfa-yok"))?.status()).toBe(404);
  expect((await page.goto("/doktorlar/boyle-biri-yok"))?.status()).toBe(404);
  expect((await page.goto("/tibbi-birimler/yok"))?.status()).toBe(404);
});

test("acil hattı her sayfada ilk ekranda ve tel: linki", async ({ page }) => {
  for (const path of ["/", "/doktorlar"]) {
    await page.goto(path);
    const link = page.getByRole("link", { name: /Acil Hattı/ }).first();
    await expect(link).toBeInViewport();
    await expect(link).toHaveAttribute("href", /^tel:/);
  }
});

test("skip link içeriğe atlar", async ({ page, browserName }) => {
  await page.goto("/");
  const skip = page.getByRole("link", { name: "İçeriğe geç" });
  // Safari varsayılanda Tab ile linklere odaklanmaz (kullanıcı ayarı); WebKit'te odak doğrudan verilir.
  if (browserName === "webkit") await skip.focus();
  else await page.keyboard.press("Tab");
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
});

test("ana sayfa: slider okları/noktaları ve sekmeli birimler klavyeyle çalışır", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Sağlığınız güvenli ellerde/);
  const slider = page.getByRole("region", { name: "Öne çıkanlar" });
  await expect(slider.locator("b", { hasText: "güvenli ellerde" })).toBeVisible();
  await slider.getByRole("button", { name: "Sonraki slayt" }).click();
  await expect(slider.locator("b", { hasText: "hekimle tanışın" })).toBeVisible();
  await expect(slider.getByRole("button", { name: "2. slayta git" })).toHaveAttribute(
    "aria-current",
    "true",
  );
  await slider.getByRole("button", { name: "Önceki slayt" }).click();
  await slider.getByRole("button", { name: "Önceki slayt" }).click();
  await expect(slider.locator("b", { hasText: "yirmi dört saat" })).toBeVisible();

  const tabs = page.getByRole("tablist", { name: "Öne çıkan branşlarımız" });
  const first = tabs.getByRole("tab").first();
  await first.focus();
  await first.press("ArrowRight");
  const second = tabs.getByRole("tab").nth(1);
  await expect(second).toBeFocused();
  await expect(second).toHaveAttribute("aria-selected", "true");
  const panel = page.locator(`#${await second.getAttribute("aria-controls")}`);
  await expect(panel).toBeVisible();
  await expect(panel.getByRole("heading", { level: 3 })).toHaveText((await second.textContent())!);
});

test.describe("masaüstü", () => {
  test.skip(({ isMobile }) => isMobile, "mega menü masaüstünde");

  test("aktif bölüm menüde işaretlenir", async ({ page }) => {
    await page.goto("/doktorlar");
    await expect(
      page.getByRole("navigation", { name: "Ana menü" }).getByRole("link", { name: "Doktorlar" }),
    ).toHaveAttribute("aria-current", "page");
  });

  test("açılır menü: hover ve ok butonuyla açılır, Esc kapatır ve odağı ok butonuna döndürür", async ({
    page,
  }) => {
    await page.goto("/");
    const panel = page.locator("#dd-units");
    await expect(panel).toBeHidden();
    // Hover: üst öğe üzerine gelince mega menü açılır (üst öğe sayfaya giden bir linktir)
    await page
      .getByRole("navigation", { name: "Ana menü" })
      .getByRole("link", { name: "Tıbbi Birimler", exact: true })
      .hover();
    await expect(panel.getByRole("link", { name: "Kardiyoloji" })).toBeVisible();
    await page.mouse.move(5, 600);
    await expect(panel).toBeHidden();
    // Klavye: ok butonu aç/kapa, Esc kapatır
    const chevron = page.getByRole("button", { name: "Tıbbi Birimler alt menüsü" });
    await chevron.focus();
    await chevron.press("Enter");
    await expect(chevron).toHaveAttribute("aria-expanded", "true");
    await expect(panel.getByRole("link", { name: "Tüm tıbbi birimler" })).toBeVisible();
    // Odak panel içindeki bir linkteyken de Esc menüyü kapatır (Safari Tab ile linklere gitmediği için doğrudan odak)
    await panel.getByRole("link", { name: "Tüm tıbbi birimler" }).focus();
    await page.keyboard.press("Escape");
    await expect(chevron).toBeFocused();
    await expect(chevron).toHaveAttribute("aria-expanded", "false");
    await expect(panel).toBeHidden();
  });

  test("kaydırınca header sticky görünüme geçer", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("header").first();
    await expect(header).not.toHaveAttribute("data-sticky", "true");
    await page.mouse.wheel(0, 400);
    await expect(header).toHaveAttribute("data-sticky", "true");
  });

  test("global arama: 'migren' → Nöroloji önerisi, klavyeyle seçim", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const box = page
      .getByRole("main")
      .getByRole("combobox", { name: "Doktor, bölüm veya şikayet arayın" });
    await box.fill("migren");
    await expect(page.getByRole("listbox").first()).toBeVisible();
    await box.press("ArrowDown");
    await expect(box).toHaveAttribute("aria-activedescendant", /opt-0/);
    await box.press("Enter");
    await expect(page).toHaveURL(/\/doktorlar\/sukru-erdem$/);
  });
});

test("doktor bul: Nöroloji + İngilizce → profil → Randevu al URL'si doktor+bölüm+şube içerir", async ({
  page,
}) => {
  await page.goto("/doktorlar?bolum=noroloji&dil=en");
  await expect(page.getByRole("status").filter({ hasText: "doktor bulundu" })).toHaveText(
    /^2 doktor bulundu$/,
  );
  await page
    .getByRole("link", { name: /Prof\. Dr\. Şükrü Erdem/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/doktorlar\/sukru-erdem$/);
  const cta = page.getByRole("main").getByRole("link", { name: "Randevu Al", exact: true }).first();
  const href = await cta.getAttribute("href");
  expect(href).toContain("bolum=noroloji");
  expect(href).toContain("doktor=sukru-erdem");
  expect(href).toContain("sube=");
});

test("aksan duyarsız doktor araması ve boş sonuç durumu", async ({ page }) => {
  await page.goto("/doktorlar?q=sukru");
  await expect(page.getByRole("status").filter({ hasText: "doktor bulundu" })).toHaveText(
    "1 doktor bulundu",
  );
  await page.goto("/doktorlar?q=zzzz");
  await expect(page.getByText("Bu filtrelerle doktor bulunamadı")).toBeVisible();
});

async function completeFromDatetime(page: Page) {
  await expect(page.getByRole("heading", { name: "Tarih ve saat seçin" })).toBeVisible();
  const slot = page.locator("fieldset button[aria-pressed]").first();
  await slot.click();
  await expect(slot).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: /Devam/ }).click();

  await expect(page.getByRole("heading", { name: "İletişim bilgileriniz" })).toBeFocused();
  // Önce boş gönderim: hata özeti odak alır
  await page.getByRole("button", { name: /Devam/ }).click();
  await expect(page.locator("#form-errors")).toBeFocused();
  await page.getByLabel("Adınız", { exact: true }).fill("Deniz");
  await page.getByLabel("Soyadınız").fill("Örnek");
  await page.getByLabel("Cep telefonu").fill("0 (532) 111 22 33");
  await page.getByLabel("Doğum yılı").fill("1990");
  await page.getByLabel(/Aydınlatma metnini okudum/).check();
  await page.getByRole("button", { name: /Devam/ }).click();
  await expect(page.getByText("kurgusal bir numara girin").first()).toBeVisible();
  await page.getByLabel("Cep telefonu").fill("0 (500) 000 12 34");
  await page.getByRole("button", { name: /Devam/ }).click();

  await expect(page.getByRole("heading", { name: "Randevu özetiniz" })).toBeVisible();
  await expectNoSeriousA11y(page);
  await page.getByRole("button", { name: /Devam/ }).click();
  await page.getByRole("button", { name: "Randevuyu oluştur" }).click();
  await expect(page.getByRole("heading", { name: "Randevunuz oluşturuldu" })).toBeVisible();
  await expect(page.getByText(/^FMC-[A-Z2-9]{8}$/)).toBeVisible();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Takvime ekle (.ics)" }).click();
  expect((await download).suggestedFilename()).toMatch(/^randevu-FMC-.+\.ics$/);
}

test("randevu: genel giriş (şube → bölüm → fark etmez → saat → bilgiler → onay)", async ({
  page,
}) => {
  await page.goto("/randevu/yeni");
  await page.getByText("Merkez Kampüs").click();
  await page.getByRole("button", { name: /Devam/ }).click();
  await expect(page).toHaveURL(/adim=2/);
  await page.getByLabel("Bölüm ara").fill("kardiyo");
  await page.getByText("Kardiyoloji", { exact: true }).click();
  await page.getByRole("button", { name: /Devam/ }).click();
  await page.getByText("Fark etmez — en erken uygun saat").click();
  await page.getByRole("button", { name: /Devam/ }).click();
  await completeFromDatetime(page);
});

test("randevu: doktor profilinden giriş tarih adımından açılır; geri tuşu ve yenileme durumu korur", async ({
  page,
}) => {
  await page.goto("/doktorlar/sukru-erdem");
  await page
    .getByRole("main")
    .getByRole("link", { name: "Randevu Al", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/\/randevu\/yeni\?adim=4$/);
  await expect(page.getByRole("heading", { name: "Tarih ve saat seçin" })).toBeVisible();
  await page.goBack();
  await expect(
    page.getByRole("heading", { level: 1, name: "Prof. Dr. Şükrü Erdem" }),
  ).toBeVisible();
  await page.goForward();
  await expect(page.getByRole("heading", { name: "Tarih ve saat seçin" })).toBeVisible();
  // Sayfa yenileme: (Firefox'ta reload, istemci navigasyonuyla yarışıp iptal olabildiği için goto)
  await page.goto(page.url());
  await expect(page.getByRole("heading", { name: "Tarih ve saat seçin" })).toBeVisible();
  await completeFromDatetime(page);
});

test("randevu: bölüm sayfasından giriş bölümü ön seçer", async ({ page }) => {
  await page.goto("/tibbi-birimler/goz-hastaliklari");
  await page.getByRole("link", { name: "Bu bölümden randevu al" }).first().click();
  // Göz yalnız Bakırköy'de → şube otomatik seçilir, doktor adımından başlar
  await expect(page).toHaveURL(/adim=3/);
  await expect(page.getByRole("heading", { name: "Bir doktor seçin" })).toBeVisible();
});

test("acil servis sayfasında randevu CTA'sı yok, telefon ve yol tarifi önde", async ({ page }) => {
  await page.goto("/tibbi-birimler/acil-servis");
  const main = page.getByRole("main");
  await expect(main.getByRole("link", { name: /randevu al/i })).toHaveCount(0);
  await expect(main.getByRole("link", { name: /Acil Hattı/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "Yol tarifi al" }).first()).toBeVisible();
});

test("Material ikon fontu kendi sunucumuzdan yüklenir; ikonlar glif olarak çizilir", async ({
  page,
  request,
}) => {
  const font = await request.get("/fonts/material-symbols-rounded.woff2");
  expect(font.status()).toBe(200);
  expect(font.headers()["content-type"]).toContain("font/woff2");
  const external: string[] = [];
  page.on(
    "request",
    (r) => /fonts\.(googleapis|gstatic)\.com/.test(r.url()) && external.push(r.url()),
  );
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const loaded = await page.evaluate(() =>
    document.fonts.check('20px "Material Symbols Rounded"', "search"),
  );
  expect(loaded).toBe(true);
  // Ligatür oluşmazsa "location_on" metni 1em kutusundan taşar (scrollWidth > clientWidth)
  const overflowing = await page.$$eval(".msr", (els) =>
    els.filter((e) => e.scrollWidth > e.clientWidth + 1).map((e) => e.textContent),
  );
  expect(overflowing).toEqual([]);
  expect(external).toEqual([]);
});

test.describe("mobil menü", () => {
  test.skip(({ isMobile }) => !isMobile, "mobil davranış");

  test("hamburger menüyü açar; karartma ve Esc kapatır; alt menü akordeon", async ({ page }) => {
    await page.goto("/");
    const burger = page.getByRole("button", { name: "Menüyü aç" });
    await burger.click();
    const close = page.getByRole("button", { name: "Menüyü kapat" });
    await expect(close).toHaveAttribute("aria-expanded", "true");
    const nav = page.locator("#site-menu");
    await expect(nav).toBeVisible();
    const chevron = nav.getByRole("button", { name: "Hasta Rehberi alt menüsü" });
    await chevron.click();
    await expect(nav.getByRole("link", { name: "Ziyaret saatleri" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(nav).toBeHidden();
    await expect(page.getByRole("button", { name: "Menüyü aç" })).toBeFocused();
    await page.getByRole("button", { name: "Menüyü aç" }).click();
    // Karartma: ekranın alt kısmına (alt eylem çubuğunun üstüne) dokun
    const vp = page.viewportSize()!;
    await page.mouse.click(vp.width / 2, vp.height - 110);
    await expect(nav).toBeHidden();
  });
});
