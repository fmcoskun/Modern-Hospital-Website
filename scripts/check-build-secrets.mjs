// Build çıktısında (istemciye giden dosyalar) gizli anahtar veya sunucu ortam değişkeni sızıntısı arar.
// Kullanım: node scripts/check-build-secrets.mjs  (pnpm build sonrası)
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = ".next/static";
const patterns = [
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, "özel anahtar"],
  [/\bsk_(live|test)_[0-9a-zA-Z]{10,}/, "Stripe tarzı gizli anahtar"],
  [/\bAKIA[0-9A-Z]{16}\b/, "AWS erişim anahtarı"],
  [/\bghp_[0-9A-Za-z]{30,}/, "GitHub token"],
  [
    /\b(DATA_SOURCE|DEMO_MODE|APPOINTMENT_CONFLICT_RATE|DATABASE_URL|CMS_API_TOKEN)\b/,
    "sunucu ortam değişkeni adı",
  ],
  [/postgres(ql)?:\/\/[^\s"']+/, "veritabanı bağlantı dizesi"],
];

const walk = (dir) =>
  readdirSync(dir).flatMap((f) =>
    statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)],
  );
const findings = [];
for (const file of walk(root).filter((f) => /\.(js|css|json|html)$/.test(f))) {
  const text = readFileSync(file, "utf8");
  for (const [re, label] of patterns) if (re.test(text)) findings.push(`${file}: ${label}`);
}
if (findings.length) {
  console.error("Gizli bilgi sızıntısı şüphesi:\n" + findings.join("\n"));
  process.exit(1);
}
console.log(`Temiz: ${walk(root).length} istemci dosyası tarandı.`);
