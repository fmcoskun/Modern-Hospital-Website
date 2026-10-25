# 0002 — i18n için next-intl yerine Next.js yerel sözlük deseni

- Durum: Kabul edildi
- Tarih: 2026-10-25

## Bağlam

Plan 7.1 next-intl öneriyor. Proje Next.js 16.4 ile, `cacheComponents` (Partial Prerendering) açık kuruldu. next-intl'in istek bazlı locale çözümü `headers()` gibi dinamik API'lara dayandığından statik kabuk üretimini bozma riski taşıyor. Next 16, `[lang]` kök segmenti + `next/root-params` ile resmî ve tamamen statik bir sözlük deseni belgeliyor.

## Karar

- `src/app/[lang]` kök segmenti; `generateStaticParams` yalnız `tr` döndürür (EN altyapısı hazır, çeviri genişletilmiş demoda).
- `src/proxy.ts` öneksiz istekleri `/tr/...`'ye **rewrite** eder; kullanıcı URL'si `/doktorlar` kalır. `/en/...` ileride doğrudan çalışır.
- Sözlükler `src/i18n/dictionaries/<locale>.ts` içinde tipli nesne; `tr` kaynak tiptir, diğer diller aynı tipi sağlamak zorundadır.
- Client bileşenler sözlüğü import etmez; ihtiyaç duydukları metinler prop olarak geçer.

## Sonuçlar

- Üçüncü taraf bağımlılık yok, tüm sayfalar statik üretilebilir.
- ICU çoğul biçimleri yok; gerekli yerlerde küçük `format()` yardımcısı ve `Intl.PluralRules` kullanılır.
- Dile özgü slug eşlemesi (`/en/doctors`) EN açılırken `proxy` ve route eşlemesiyle eklenecek.
- Site içi linkler şimdilik öneksiz Türkçe yollarla yazılır (`/doktorlar`); EN açılırken bir `localePath()` yardımcısı ve dile özgü slug eşlemesi eklenecek.
