# 0004 — Tipografi ve ikonlar: Inter + Material Symbols

- Durum: Kabul edildi
- Tarih: 2026-10-25

## Bağlam

Plan 6.3/6.7, başlıklar için serif (Lora) ve SVG ikon seti (Lucide) öneriyordu. Proje sahibi, diğer projeleriyle ortak bir taban istedi:

- yalnız **Inter** (400/500/700),
- ikonlar Google'ın **Material** ikon fontu (Rounded).

Google Fonts bağlantılarını doğrudan kullanmak, ziyaretçi IP'sini Google'a aktarır (KVKK), CSP'yi `fonts.googleapis.com`/`fonts.gstatic.com` için gevşetmeyi gerektirir ve harici, bloklayan CSS nedeniyle mobil performansı düşürür.

## Karar

- **Yazı tipi:** her yerde Inter (başlıklar dahil, 700 ağırlık). `next/font` ile self-host; Lora kaldırıldı.
- **İkonlar:** Material Symbols Rounded (Material Icons Round'un güncel, aynı görünümlü sürümü). `scripts/fetch-icons.mjs`, Google Fonts'un `icon_names` alt küme API'siyle yalnız `src/components/ui/icon-names.ts` listesindeki glifleri içeren woff2'yi indirir (`public/fonts`, ≈36 KB) ve her adın gerçekten bir glife dönüştüğünü Chromium'da doğrular (Google geçersiz adları sessizce yok sayar).
- İkon fontu **ön yüklenmez**: A/B ölçümünde `<link rel=preload>` ana sayfa mobil TBT'yi ~180 ms'den ~300 ms'ye, Lighthouse skorunu 86–87'den 80–84'e düşürdü; ön yüklemesiz 87 / TBT 183–220 ms (önceki Lucide sürümüyle aynı). Font, CSS'ten erkenden keşfedilir.
- `MaterialIcon` bileşeni varsayılan `aria-hidden`; tek başına anlam taşıyan ikon `label` alır. Kutusu sabit `1em` ve font `font-display: block` olduğundan font yüklenirken ikon adı metin olarak görünmez, kayma olmaz.

## Sonuçlar

- Proje sahibinin diğer projeleriyle aynı yazı tipi ve ikon dili; çalışma anında Google'a istek yok, CSP değişmedi.
- Yeni ikon eklemek bir adım gerektirir: adı listeye ekleyip `pnpm icons:fetch`. Seed'deki ikon adları birim testiyle listeye karşı doğrulanır.
- İkon fontu HTML metninde ikon adını taşır (ör. `location_on`); `translate="no"` ve `aria-hidden` ile çeviri ve ekran okuyucudan korunur.

## Ek: Header ve footer (aynı gün)

Header ve footer da aynı tabana göre yeniden yazıldı:

- **Header:** başta şeffaf; masaüstünde 100 px, mobilde 40 px kaydırınca açık zemin + alt kenarlık (`data-sticky`). Masaüstünde (≥1280 px) üst öğe sayfaya gider, alt menü hover ile açılır; "Tıbbi Birimler" iki sütunlu, ikon kutucuklu mega menü (son öğe "Tüm tıbbi birimler"). Mobilde 4 çizgili, X'e dönüşen hamburger; header açık bir panele dönüşür, öğeler ortalı, alt menüler akordeon, arkada %40 karartma; ≥1280 px'e genişleyince kapanır.
- **Erişilebilirlik ekleri:** alt menü klavye odağında da açılır, her üst öğenin yanında `aria-expanded`'lı ok butonu vardır, Esc kapatır ve odağı ok butonuna döndürür (WCAG 1.4.13, 2.1.1). Mobil menüde Esc ve karartma kapatır, odak hamburgere döner.
- **Footer:** üç bant — açık zeminli 5 sütunlu menü (başlık koyu, linkler gri, iletişim linkleri marka renginde), logo | rozet + telif satırı, kurum unvanı ve noktalı yasal linkler.
- **Hastane gereği korunanlar:** üstteki koyu acil hattı çubuğu (her sayfada ilk ekranda), arama butonu, "Randevu Al" CTA'sı ve mobil alt eylem çubuğu.
