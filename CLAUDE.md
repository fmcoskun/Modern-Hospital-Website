@AGENTS.md

# ÖZEL FMC HASTANESİ — demo web sitesi

Kurgusal bir hastane için portfolyo demosu. Tam plan: `docs/plan.md`. Mimari kararlar: `docs/adr/`.

## Değişmez kurallar

- **Gerçek kişisel/sağlık verisi asla toplanmaz, saklanmaz, loglanmaz.** Randevu ve iletişim formları yalnız doğrular; hiçbir yere yazmaz. `console.log` ile form verisi basılmaz.
- Tüm kişi, kurum, telefon ve e-posta kurgusaldır. E-postalar `.example` alan adında, telefonlar `0 (850) 000 ...` kalıbında.
- Doktor görselleri foto-gerçekçi değil, baş harfli stilize avatar. Puan/yorum yok.
- Her doktor profili ve makalede `DemoBadge`.

## Stack

Next.js 16 App Router (`cacheComponents` açık) · TypeScript strict + `noUncheckedIndexedAccess` · Tailwind v4 + `src/styles/tokens.css` · Zod + React Hook Form · Radix (`radix-ui`) · Material Symbols Rounded (self-host alt küme) · Vitest + Testing Library + jest-axe · Playwright + axe. Paket yöneticisi pnpm.

i18n: next-intl yerine Next'in yerel sözlük deseni (ADR 0002). `src/app/[lang]` kök segmenti, `src/i18n/` altında sözlükler, `src/proxy.ts` öneksiz `/` isteğini `/tr`'ye rewrite eder.

## Klasör yapısı

```text
src/
  app/[lang]/(site)/...   header+footer'lı sayfalar
  app/[lang]/(flow)/...   sade layout'lu akışlar (randevu)
  components/ui/          tasarım sistemi primitifleri (veri bilmez)
  components/layout/      TopBar, SiteHeader, MegaMenu, MobileDrawer, Footer
  components/cards/       DepartmentCard, DoctorCard, ...
  features/<ad>/          özellik modülleri (doctors, appointments, search); dışarıya index.ts
  lib/data/               types, schemas, repository arayüzleri, mock uygulama, slots
  content/seed/           seed verisi (TS)
  i18n/                   sözlükler ve getDictionary
  styles/tokens.css       TEK renk/gölge/radius kaynağı
```

## Kodlama kuralları

- Tipografi: yalnız Inter; ikonlar `MaterialIcon` (Material Symbols Rounded). Yeni ikon için adı `src/components/ui/icon-names.ts`'e ekle ve `pnpm icons:fetch` çalıştır (font alt kümesi `public/fonts`'a iner ve doğrulanır). Google'a çalışma anında istek yok.
- Varsayılan Server Component; `"use client"` yalnız etkileşim yaprağında. Client bileşenlere metinler prop olarak geçer.
- Sayfalar veriye **yalnız** `@/lib/data` üzerinden erişir; `content/seed` doğrudan import edilmez.
- Renk/gölge/radius yalnız token'dan (Tailwind tema sınıfları `bg-surface`, `shadow-neu-raised` vb.). Hex değer yalnız `tokens.css`'te.
- UI metni `src/i18n/dictionaries/tr.ts`'ten. Veri içeriği (bölüm açıklaması vb.) seed'de.
- Erişilebilirlik hedefi WCAG 2.2 AA. Neumorfik gölge tek başına sınır veya durum taşımaz: etkileşimli öğede ≥3:1 kenarlık/dolgu, odak halkası `focus-ring` yardımcı sınıfı.
- `searchParams`/`cookies` okuyan bileşenler `<Suspense>` içinde (cacheComponents).
- Güvenlik: CSP `next.config.ts`'te (nonce'suz, ADR 0003). Yeni bir dış kaynak (iframe, API, font) eklerken CSP'yi güncelle ve `tests/e2e/hardening.spec.ts` ihlal testini çalıştır. Zod'u `@/lib/zod`'dan içe aktar (jitless; eval yok).
- Performans: `pnpm lhci` bütçeleri (`lighthouserc.json`) kırılmamalı; istemciye büyük veri gömme (ör. arama indeksi `/api/search-index`'ten tembel yüklenir).
- 3D: `three`/`@react-three/*` yalnız `src/features/scene3d/CampusScene.tsx` (dinamik import) ve yalnız `/kurumsal/olanaklar` sayfasında; ana sayfaya 3D eklenmez (Lighthouse bütçesi, docs/perf-3d.md). WebGL yoklaması yalnız yükleme anında.
- `notFound()` streaming başlamadan çağrılmalı; aksi halde 404 yerine 200 döner. Bu yüzden `(site)` altında `loading.tsx` yok; slug kontrolü sayfanın en başında, ilk `await params` sonrası yapılır.

## Komutlar

`pnpm dev` · `pnpm build` · `pnpm lint` · `pnpm typecheck` · `pnpm test` · `pnpm test:e2e`

Her değişiklikte `pnpm lint && pnpm typecheck && pnpm test` çalıştır; yeşil olmadan bitti deme.
