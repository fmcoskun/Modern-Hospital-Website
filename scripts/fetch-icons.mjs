// Material Symbols Rounded alt kümesini indirir ve doğrular (Google'a çalışma anında istek yok:
// KVKK + CSP). Kullanım: pnpm icons:fetch
import { writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";
import { ICON_NAMES } from "../src/components/ui/icon-names.ts";

const OUT = "public/fonts/material-symbols-rounded.woff2";
const names = [...ICON_NAMES].sort(); // API alfabetik sıra ister
// Eksenler: FILL 0..1 (dolu/boş), wght 300..600; GRAD ve opsz sabit (dosya küçük kalsın).
const css = await (
  await fetch(
    `https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,300..600,0..1,0&icon_names=${names.join(",")}&display=block`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
      },
    },
  )
).text();
const url = css.match(/src:\s*url\(([^)]+)\)\s*format\('woff2'\)/)?.[1];
if (!url) throw new Error(`Font URL'si bulunamadı:\n${css.slice(0, 400)}`);
const font = Buffer.from(await (await fetch(url)).arrayBuffer());
writeFileSync(OUT, font);
console.log(`${OUT}: ${(font.length / 1024).toFixed(1)} KB, ${names.length} ikon`);

// Google geçersiz adları sessizce yok sayar: her ad bir ligatüre (tek glif ≈ 1em) dönüşmeli.
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(
  `<style>@font-face{font-family:M;src:url(data:font/woff2;base64,${font.toString("base64")}) format("woff2");font-display:block}
  span{font-family:M;font-size:40px;line-height:1;white-space:nowrap;display:inline-block;font-feature-settings:"liga"}</style>` +
    names.map((n) => `<span data-n="${n}">${n}</span>`).join(""),
);
await page.evaluate(() => document.fonts.ready);
const missing = await page.$$eval("span", (els) =>
  els.filter((e) => e.getBoundingClientRect().width > 48).map((e) => e.dataset.n),
);
await browser.close();
if (missing.length) {
  console.error(`Glif bulunamayan adlar: ${missing.join(", ")}`);
  process.exit(1);
}
console.log("Tüm ikon adları doğrulandı.");
