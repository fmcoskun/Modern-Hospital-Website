# 0001 — MVP'de CMS yok, içerik tipli TS seed dosyalarında

- Durum: Kabul edildi
- Tarih: 2026-10-25

## Bağlam

Demo tek geliştiricili bir portfolyo projesi; editör, onay akışı veya canlı içerik güncellemesi gerekmiyor. Gerçek hastane aşamasında Payload CMS + PostgreSQL öneriliyor (plan 7.1).

## Karar

Katalog verisi (şube, bölüm, doktor, sigorta, duyuru, SSS, makale) `src/content/seed/*.ts` dosyalarında tutulur, Zod şemalarıyla test sırasında doğrulanır ve yalnız `src/lib/data` repository arayüzleri üzerinden okunur. `DATA_SOURCE=mock` dışındaki değerler için `api` uygulaması "not implemented" fırlatan bir stub'dır.

## Sonuçlar

- Git geçmişi içerik sürümü olur; CMS kurulumu ve barındırma maliyeti yok.
- Gerçek backend geldiğinde yalnız repository uygulaması değişir.
- Makaleler MVP'de MDX yerine TS içinde yapılandırılmış bloklar olarak tutulur (MDX pipeline T09'da değerlendirilecek).
