// Seçilmiş CC0 stok fotoğrafları indirir (Openverse kayıtları; StockSnap/rawpixel CDN, ≤1024 px)
// ve lisans bilgisini src/lib/photos.json'a yazar. Kullanım: node scripts/fetch-photos.mjs <candidates.json>
import { readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const db = JSON.parse(readFileSync(process.argv[2], "utf8"));
const pick = {
  "hero-1": ["doctor", 1, "Aydınlık hastane koridorunda yürüyen sağlık ekibi"],
  "hero-2": ["doctor", 8, "Muayene odasında hastasıyla konuşan hekim"],
  "hero-3": ["hospital corridor", 8, "Modern hastane koridoru"],
  about: ["stethoscope", 8, "Hasta dosyasını birlikte inceleyen sağlık ekibi"],
  "contact-1": ["hospital waiting room", 0, "Bekleme alanında hastasıyla konuşan hemşire"],
  "contact-2": ["nurse", 3, "Tablet üzerinden kayıt inceleyen hemşire"],
  "unit-kardiyoloji": ["stethoscope", 0, "Masa üzerinde stetoskop ve dizüstü bilgisayar"],
  "unit-noroloji": ["doctor", 2, "Görüntüleme sonucunu inceleyen hekimler"],
  "unit-ic-hastaliklari": ["doctor", 6, "Masasında not alan hekim"],
  "unit-genel-cerrahi": ["nurse", 1, "Hastasıyla ameliyat öncesi görüşme yapan hekim"],
  "unit-ortopedi": ["nurse", 2, "Tekerlekli sandalyedeki hastasına destek olan sağlık çalışanı"],
  "unit-goz": ["eye", 6, "İnsan gözü yakın çekim"],
  "unit-kadin-dogum": ["pregnant", 3, "Elleriyle karnında kalp yapan hamile kadın"],
  "unit-cocuk": ["baby", 8, "Huzurla uyuyan bebek"],
  "unit-ek": ["stethoscope", 1, "Akıllı telefon ve stetoskop"],
  "branch-merkez": ["modern building", 4, "Ağaçlar arasında yükselen modern bina"],
  "branch-kadikoy": ["modern building", 11, "Geniş pencereli modern bina cephesi"],
  "branch-bakirkoy": ["modern building", 5, "Modern bina köşesi"],
  "banner-kurumsal": ["modern building", 9, "Modern cam cephe dokusu"],
  "banner-birimler": ["hospital corridor", 9, "Bekleme sandalyeli hastane koridoru"],
  "banner-doktorlar": ["doctor", 3, "Hastasını dinleyen hekim"],
  "banner-hasta": ["nurse", 5, "Hastasıyla gülümseyerek konuşan sağlık çalışanı"],
  "banner-saglik": ["stethoscope", 5, "Hasta formu üzerinde stetoskop ve kalem"],
  "banner-iletisim": ["hospital waiting room", 2, "Hastane odası"],
  "banner-duyurular": ["stethoscope", 4, "Telefon ve mavi stetoskop"],
  "banner-genel": ["hospital corridor", 10, "Uzun hastane koridoru"],
  "news-ilac": ["medicine", 3, "Yaprak üzerinde tabletler"],
  "news-doktor": ["doctor", 0, "Tablet tutan hekim"],
};

const meta = {};
for (const [name, [q, i, alt]] of Object.entries(pick)) {
  const c = db[q]?.[i];
  if (!c) throw new Error(`Aday yok: ${q}[${i}]`);
  const buf = Buffer.from(
    await (await fetch(c.url, { headers: { "User-Agent": "Mozilla/5.0" } })).arrayBuffer(),
  );
  const img = sharp(buf).rotate();
  const out = await img.jpeg({ quality: 82, mozjpeg: true }).toBuffer({ resolveWithObject: true });
  writeFileSync(`public/images/${name}.jpg`, out.data);
  meta[name] = {
    src: `/images/${name}.jpg`,
    width: out.info.width,
    height: out.info.height,
    alt,
    title: c.title,
    creator: c.creator ?? null,
    source: c.source,
    license: c.license.toUpperCase(),
    page: c.page,
  };
  console.log(
    name,
    `${out.info.width}x${out.info.height}`,
    `${Math.round(out.data.length / 1024)}KB`,
  );
}
writeFileSync("src/lib/photos.json", JSON.stringify(meta, null, 2) + "\n");
