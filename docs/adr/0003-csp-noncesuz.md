# 0003 — Nonce'suz sıkı CSP (nonce tabanlı CSP yerine)

- Durum: Kabul edildi
- Tarih: 2026-10-25

## Bağlam

Plan T11, proxy ile nonce tabanlı CSP öneriyor. Next.js 16 belgesine göre (`content-security-policy.md`, "Static vs Dynamic Rendering with CSP") nonce kullanımı tüm sayfaları dinamik render'a zorlar ve Partial Prerendering ile uyumsuzdur. Proje Cache Components/PPR üzerine kurulu, 160+ sayfa build sırasında statik üretiliyor. Proxy'deki gerçek 404 mekanizması da prerender edilmiş 404 sayfasına dayanıyor.

## Karar

- CSP `next.config.ts`'te tüm yollara statik başlık olarak verilir: `default-src 'self'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`, `connect-src 'self'`, `frame-src` yalnız OpenStreetMap gömmesi.
- `script-src 'self' 'unsafe-inline'`: Next'in satır içi RSC/bootstrap betikleri için zorunlu. Dış betik kaynağı yok.
- Deneysel SRI (`experimental.sri`) denendi ve **kullanılmadı**: Turbopack derlemesinde yalnız bazı framework parçalarına `integrity` ekliyor, sayfaya özgü ve çalışma anında yüklenen parçaları kapsamıyor. Kısmi kapsam yanlış güven hissi yaratacağı için kapalı tutuldu; Next webpack/Turbopack desteği olgunlaşınca yeniden değerlendirilecek.
- Zod `jitless` modunda çalışır; `'unsafe-eval'` gerekmez ve tarayıcıda eval yoklaması yapılmaz.
- Ek başlıklar: HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options: DENY`, `Cross-Origin-Opener-Policy: same-origin`, `Permissions-Policy`.
- E2E testi, ana şablonlarda CSP ihlali (`securitypolicyviolation`) olmadığını ve başlıkların varlığını doğrular.

## Sonuçlar

- Statik üretim, CDN önbelleği ve PPR korunur.
- `'unsafe-inline'` XSS'e karşı nonce kadar güçlü değildir. Riski azaltmak için: kullanıcı girdisi hiçbir zaman HTML olarak işlenmez (React kaçışlar), JSON-LD `<` karakterini kaçışlar, üçüncü taraf betik yoktur.
- Gerçek hastane aşamasında hasta portalı gibi dinamik ve hassas bölümler ayrı route grubunda nonce'lu CSP ile sunulabilir.
