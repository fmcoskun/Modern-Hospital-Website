// Demo içerik taraması (plan T12/A8): lorem ipsum, gerçek görünen telefon/e-posta kalıpları,
// izin listesi dışındaki dış bağlantılar. Kullanım: node scripts/check-content.mjs
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const roots = ["src/content", "src/i18n", "src/app", "src/components", "src/features"];
const allowedHosts = new Set([
  "www.who.int",
  "www.saglik.gov.tr",
  "www.openstreetmap.org",
  "schema.org",
  "instagram.com",
  "linkedin.com",
  "youtube.com",
  "x.com",
]);

const rules = [
  [/lorem ipsum|dolor sit amet/i, "lorem ipsum"],
  [/@(gmail|hotmail|yahoo|outlook|icloud)\.com/i, "kişisel e-posta sağlayıcısı"],
  // E-posta adresleri yalnız .example alan adında olmalı (RFC 2606)
  [/\b[\w.+-]+@[\w-]+\.(com|net|org|tr|com\.tr|io)\b/i, ".example dışı e-posta"],
  // Türkiye cep (05xx) ve şehir içi (0212/0216/0312...) numaraları; kurgusal 0 (850) 000 ve 0 (500) 000 hariç
  [
    /\b0\s?\(?5(?!00\)?\s?000)\d{2}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}\b/,
    "gerçek görünen cep telefonu",
  ],
  [
    /\b0\s?\(?(2\d\d|3\d\d|4\d\d)\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}\b/,
    "gerçek görünen sabit telefon",
  ],
  [/\b444\s?\d\s?\d{3}\b/, "gerçek görünen 444 numarası"],
  [/\b\d{11}\b(?=[^\n]*(tc|kimlik))/i, "T.C. kimlik numarası kalıbı"],
];

const walk = (dir) =>
  readdirSync(dir).flatMap((f) =>
    statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)],
  );

const findings = [];
for (const file of roots.flatMap(walk).filter((f) => /\.(ts|tsx|json|md)$/.test(f))) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    for (const [re, label] of rules)
      if (re.test(line)) findings.push(`${file}:${i + 1}: ${label} → ${line.trim().slice(0, 90)}`);
    for (const m of line.matchAll(/https?:\/\/([a-z0-9.-]+)/gi)) {
      const host = m[1].toLowerCase();
      if (host !== "localhost" && !allowedHosts.has(host))
        findings.push(`${file}:${i + 1}: izin listesinde olmayan dış bağlantı → ${host}`);
    }
  });
}

if (findings.length) {
  console.error(`İçerik taraması ${findings.length} bulgu:\n${findings.join("\n")}`);
  process.exit(1);
}
console.log(
  "İçerik taraması temiz: lorem ipsum, gerçek telefon/e-posta kalıbı ve izinsiz dış bağlantı yok.",
);
