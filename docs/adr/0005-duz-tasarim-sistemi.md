# 0005 — Düz tasarım sistemi ve fotoğraflı sayfa gövdesi

- Durum: Kabul edildi (ADR 0004'ü tamamlar; plandaki "soft neumorfizm" görsel dilinin yerine geçer)
- Tarih: 2026-10-25

## Bağlam

ADR 0004 ile tipografi, ikonlar, header ve footer ortak bir tabana taşındı. Proje sahibi, header ile
footer arasındaki tüm bölümlerin de aynı tasarım sistemine geçmesini istedi.
Bu konudaki kararları kullanıcı verdi:

- Marka rengi hastane teal'i (`#0f5961`) olarak kalır.
- Görseller ücretsiz stok fotoğraflardır ve kendi sunucumuzdan sunulur.
- Tasarım düzdür; 3D yalnız `/kurumsal/olanaklar` sayfasında kalır ve ana sayfa hero'su fotoğraf slider'ı olur.
- Hastaneye özgü bölümler (arama, hızlı eylemler, doktorlar, check-up) yeni bölüm kalıplarına uyarlanır ve korunur.

## Karar

- **Token'lar** (`src/styles/tokens.css`):
  - Yüzeyler:
    - beyaz zemin
    - açık dönüşümlü bölüm zemini `--surface-sunken`
    - koyu bant `--surface-dark` (`bg-dark`)
  - Kart radius 8 px, kontrol radius 6 px.
  - Gölgeler ince kenarlık ve hafif gölgedir.
  - `neu-*` yardımcı adları geriye dönük uyum için korunur, ama artık düz yüzey üretir.
- **Header:**
  - `fixed`; banner veya hero üstünde şeffaf zemin ve beyaz metinle görünür.
  - Kaydırınca ya da mobil menü açıkken beyaz zemine geçer.
  - Acil hattı çubuğu header'ın ilk satırıdır, böylece her durumda görünür.
- **Bölüm kalıbı:**
  - `Section` / `SectionHeading`: üstte küçük marka renkli etiket, altında `<b>` vurgulu büyük başlık.
  - Sözlükte vurgu `**…**` ile yazılır ve `Rich` bileşeni `<b>`'ye çevirir.
  - `tone`: `white`, `light` veya `dark`.
- **İç sayfa başlığı:**
  - Tüm iç sayfalar `PageHeader` kullanır: fotoğraflı banner, koyu degrade katman, beyaz başlık.
  - Detay sayfalarında önceki/sonraki gezinmesi vardır (bölüm detayı).
- **Ana sayfa sırası:**
  1. Slider
  2. Hızlı erişim: arama ve ikon kutucukları
  3. Hakkımızda
  4. Sekmeli birimler
  5. Doktorlar
  6. Check-up
  7. Koyu "rakamlarla" bandı
  8. Duyurular: görsel solda liste
  9. Sağlık rehberi ve hasta rehberi
  10. Anlaşmalı kurumlar ızgarası
  11. İletişim kolajı
  12. Sekmeli şubeler
- **İstemci bileşenleri:**
  - `HeroSlider`:
    - WAI-ARIA carousel
    - otomatik geçiş yok (WCAG 2.2.2)
    - ok butonları ve sayfalama noktaları
  - `ScrollTabs`:
    - WAI-ARIA tabs; ok, Home ve End tuşları
    - yatay kaydırma okları
    - panel içerikleri sunucuda üretilir
- **Fotoğraflar:**
  - CC0 / kamu malı görseller Openverse API ile bulunur.
  - Bot korumalı siteler atlatılmaz; Unsplash ve StockSnap siteleri doğrudan kullanılmadı.
  - Dosyalar `public/images` altındadır; meta veri `src/lib/photos.json`'dadır.
  - Kaynakça: [docs/photo-credits.md](../photo-credits.md).

## Sonuçlar

- Görseller aynı kaynaktan (same-origin) ve `next/image` ile sunulur, bu yüzden CSP değişmedi.
- Ana sayfada 3D paketi yüklenmez; `Campus3D`'nin `hero` modu şimdilik kullanılmıyor ama kodda duruyor.
- **Performans:**
  - Lighthouse (mobil, 3 ölçüm medyanı) skorları:

    | Sayfa           | Skor |
    | --------------- | ---- |
    | `/`             | 88   |
    | `/doktorlar`    | 90   |
    | Bölüm detayı    | 90   |
    | `/randevu/yeni` | 93   |

  - Erişilebilirlik ve best practices 100, CLS 0.
  - Fotoğraflı hero ile LCP yaklaşık 3,2–3,9 s. Bu, uyarı eşiği olan 4 s'nin altında, ama sınıra yakın.
- **Çözünürlük:** stok kaynaklarda en fazla yaklaşık 1000 px genişlik bulunuyor. Geniş ekranda hafif yumuşaklık koyu katmanla gizleniyor. Aynı adla daha büyük dosya konursa kod değişmez.
