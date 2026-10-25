// README ekran görüntüleri ve demo senaryosu videoları (plan T12).
// Kullanım (önce `pnpm build && pnpm start`):
//   node scripts/demo.mjs screenshots   → docs/screenshots/*.png
//   node scripts/demo.mjs videos        → docs/demo/*.webm (git dışı)
// BASE_URL ortam değişkeniyle farklı adres verilebilir (varsayılan http://localhost:3000).
import { mkdirSync, readdirSync, renameSync, rmSync } from "node:fs";
import { chromium, devices } from "@playwright/test";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const mode = process.argv[2] ?? "screenshots";

/** Sihirbazı tarih adımından sonuca kadar tamamlar (kurgusal hasta bilgileriyle). */
async function finishWizard(page) {
  await page.getByRole("heading", { name: "Tarih ve saat seçin" }).waitFor();
  await page.locator("fieldset button[aria-pressed]").first().click();
  await page.getByRole("button", { name: /Devam/ }).click();
  await page.getByLabel("Adınız", { exact: true }).fill("Deniz");
  await page.getByLabel("Soyadınız").fill("Örnek");
  await page.getByLabel("Cep telefonu").fill("0 (500) 000 12 34");
  await page.getByLabel("Doğum yılı").fill("1990");
  await page.getByLabel(/Aydınlatma metnini okudum/).check();
  await page.getByRole("button", { name: /Devam/ }).click();
  await page.getByRole("heading", { name: "Randevu özetiniz" }).waitFor();
  await page.getByRole("button", { name: /Devam/ }).click();
  await page.getByRole("button", { name: "Randevuyu oluştur" }).click();
  await page.getByRole("heading", { name: "Randevunuz oluşturuldu" }).waitFor();
}

async function screenshots() {
  const out = "docs/screenshots";
  mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const desktop = await (
    await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
  ).newPage();
  const shots = [
    ["01-ana-sayfa", "/"],
    ["02-doktorlar", "/doktorlar?bolum=noroloji"],
    ["03-doktor-profili", "/doktorlar/sukru-erdem"],
    ["04-bolum-detay", "/tibbi-birimler/kardiyoloji"],
    ["05-olanaklar-3d", "/kurumsal/olanaklar"],
    ["06-hasta-rehberi", "/hasta-rehberi"],
  ];
  for (const [name, path] of shots) {
    await desktop.goto(BASE + path, { waitUntil: "networkidle" });
    if (path === "/kurumsal/olanaklar") {
      await desktop
        .locator('[data-testid="campus-canvas"] canvas')
        .waitFor({ state: "attached", timeout: 15000 });
      await desktop.getByRole("button", { name: "Acil servis girişi" }).click();
      await desktop.waitForTimeout(1200);
    }
    await desktop.screenshot({ path: `${out}/${name}.png` });
  }
  await desktop.goto(
    `${BASE}/randevu/yeni?bolum=kardiyoloji&sube=merkez-kampus&doktor=ayse-karaca`,
    { waitUntil: "networkidle" },
  );
  await desktop.getByRole("heading", { name: "Tarih ve saat seçin" }).waitFor();
  await desktop.screenshot({ path: `${out}/07-randevu-tarih.png` });
  await finishWizard(desktop);
  await desktop.screenshot({ path: `${out}/08-randevu-sonuc.png` });

  const mobile = await (
    await browser.newContext({ ...devices["Pixel 7"], deviceScaleFactor: 1 })
  ).newPage();
  await mobile.goto(BASE + "/", { waitUntil: "networkidle" });
  await mobile.screenshot({ path: `${out}/09-mobil-ana-sayfa.png` });
  await mobile.goto(BASE + "/lokasyonlar/merkez-kampus", { waitUntil: "networkidle" });
  await mobile.screenshot({ path: `${out}/10-mobil-lokasyon.png` });
  await browser.close();
  console.log(`Ekran görüntüleri: ${out}/`);
}

/** Plan A8'in üç demo senaryosu; her biri ayrı video. */
const scenarios = {
  "1-doktor-bul-ve-randevu": async (page) => {
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    const box = page
      .getByRole("main")
      .getByRole("combobox", { name: "Doktor, bölüm veya şikayet arayın" });
    await box.pressSequentially("migren", { delay: 120 });
    await page.getByRole("option", { name: /Şükrü Erdem/ }).click();
    await page.getByRole("heading", { level: 1, name: /Şükrü Erdem/ }).waitFor();
    await page.waitForTimeout(800);
    await page
      .getByRole("main")
      .getByRole("link", { name: "Randevu Al", exact: true })
      .first()
      .click();
    await finishWizard(page);
    await page.waitForTimeout(1500);
  },
  "2-acil-lokasyon": async (page) => {
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await page
      .getByRole("navigation", { name: "Ana menü" })
      .getByRole("link", { name: "Tıbbi Birimler", exact: true })
      .hover();
    await page.waitForTimeout(600);
    await page.locator("#dd-units").getByRole("link", { name: "Tüm tıbbi birimler" }).click();
    await page.getByRole("link", { name: "Acil Servis" }).first().click();
    await page.getByRole("heading", { level: 1, name: "Acil Servis" }).waitFor();
    await page.waitForTimeout(1200);
    await page.getByRole("link", { name: "Lokasyonlar" }).first().click();
    await page.getByRole("heading", { level: 1, name: "Lokasyonlar" }).waitFor();
    await page.waitForTimeout(800);
    await page.getByRole("link", { name: "Kadıköy Hastanesi" }).first().click();
    await page.getByRole("button", { name: "Haritayı yükle" }).click();
    await page.waitForTimeout(2500);
  },
  "3-makaleden-randevu": async (page) => {
    await page.goto(BASE + "/saglik-rehberi", { waitUntil: "networkidle" });
    await page.getByRole("link", { name: "Kadın Sağlığı" }).click();
    await page.getByRole("link", { name: /Rahim ağzı taraması/ }).click();
    await page.getByRole("heading", { level: 1, name: /Rahim ağzı/ }).waitFor();
    await page.mouse.wheel(0, 900);
    await page.waitForTimeout(1200);
    await page.getByRole("link", { name: "Bu konuda randevu al" }).click();
    await page
      .getByRole("heading", { name: /şubemize|doktor/ })
      .first()
      .waitFor();
    await page.waitForTimeout(1500);
  },
};

async function videos() {
  const out = "docs/demo";
  mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ slowMo: 250 });
  for (const [name, run] of Object.entries(scenarios)) {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      recordVideo: { dir: `${out}/_tmp`, size: { width: 1280, height: 800 } },
    });
    const page = await context.newPage();
    await run(page);
    await context.close();
    const [file] = readdirSync(`${out}/_tmp`);
    renameSync(`${out}/_tmp/${file}`, `${out}/${name}.webm`);
    console.log(`Video: ${out}/${name}.webm`);
  }
  rmSync(`${out}/_tmp`, { recursive: true, force: true });
  await browser.close();
}

await (mode === "videos" ? videos() : screenshots());
