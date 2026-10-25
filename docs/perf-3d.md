# 3D kampüs — performans ölçümü (T10)

Ölçüm: 2026-10-25, `pnpm build && pnpm start`, Lighthouse 12 (Playwright Chromium, headless), ana sayfa `/`.
Mobil: Lighthouse varsayılan (Moto G Power emülasyonu, 4× CPU yavaşlatma, yavaş 4G). Masaüstü: `--preset=desktop`.
SEO skoru 66, demo sitenin bilinçli `noindex` ayarından kaynaklanır.

| Senaryo                                                                               | Mobil perf. | Mobil TBT  | Mobil LCP       | Masaüstü perf. | Masaüstü TBT |
| ------------------------------------------------------------------------------------- | ----------- | ---------- | --------------- | -------------- | ------------ |
| Önce (3D yok, SVG poster)                                                             | 83          | 162 ms     | 4,36 s          | 100            | 3 ms         |
| İlk deneme: hero'da boşta otomatik yükleme + hidrasyonda WebGL yoklaması              | 66–69       | 766–999 ms | 3,98 s          | 93–96          | 166–206 ms   |
| **Son: hero varsayılan poster, 3D imleçle/butonla; WebGL yoklaması yalnız yüklemede** | **84–85**   | **181 ms** | **3,94–4,00 s** | **100**        | **1–2 ms**   |
| Keşif sayfası `/kurumsal/olanaklar` (3D boşta otomatik yüklenir)                      | —           | —          | —               | 99             | 78 ms        |

## Bulgular ve karar

- İlk denemede masaüstü düşüşü 4–7 puan, mobil düşüşü 14–17 puan oldu. Mobilde 3D hiç yüklenmediği halde düşüş vardı: yetenek algılamada hidrasyon sırasında `canvas.getContext("webgl2")` açmak 4× CPU yavaşlatmada uzun bir görev oluşturuyordu.
- Plan 9.2/T10 kuralı uygulandı (“düşüş > 5 puan ise hero'da poster-varsayılan moda geç”):
  - Hero'da sahne yalnız fare imleci üzerine gelince (ince imleçli, ≥768 px, yeterli bellek, veri tasarrufu kapalı) veya “3D görünümü aç” ile yüklenir.
  - WebGL yoklaması yalnız yükleme anında yapılır; desteklenmiyorsa bilgi mesajı gösterilir.
  - Keşif sayfasında amaç 3D olduğu için görünür alana girince ve tarayıcı boştayken otomatik yüklenir.
- 3D paket boyutu: ilk yükleme JS ≈ 552 KB (sıkıştırılmamış); three + R3F + drei + sahne yüklendiğinde ≈ +1,1 MB (sıkıştırılmamış). GLB yok: geometri bina verisinden prosedürel üretilir (≈ 1 bin üçgenin altında).

## Kalan iş (T11)

Mobil LCP ~4 s ve performans 84–85, planın ≥ 90 hedefinin altında; 3D'den bağımsız. T11'de LCP öğesi (hero başlığı / web fontu) ve ilk JS boyutu incelenecek.

## T11 sonrası (sertleştirme)

| Değişiklik                                                                                                                          | Etki                                                        |
| ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Otomatik tamamlama indeksi her sayfanın HTML'ine gömülmek yerine `/api/search-index` (statik) üzerinden ilk etkileşimde indiriliyor | Ana sayfa HTML'i 329 KB → 250 KB; mobil perf. 84–85 → 87–88 |
| Lora (yalnız başlıklar) ön yüklenmiyor                                                                                              | Kritik kaynaklarla bant genişliği yarışı azaldı             |
| `/doktorlar` mobil filtre paneli sunucuda da kapalı render ediliyor (JS yoksa `<noscript>` ile açık)                                | CLS 0,27 → 0; perf. 73 → 87–92                              |
| Randevu sihirbazında React Hook Form + Zod yalnız "Bilgileriniz" adımında yükleniyor                                                | `/randevu/yeni` perf. 84 → 91–92                            |
| Zod `jitless`                                                                                                                       | CSP eval ihlali yok                                         |

Denenip geri alınanlar: fontlarda `display: optional` (etkisiz), Inter ön yüklemesini kapatmak (FCP 1,1 s → 2,2 s, daha kötü).

Lighthouse CI (`lighthouserc.json`, mobil, 3 ölçümün medyanı) son ölçüm: `/` 86, `/doktorlar` 87, `/tibbi-birimler/kardiyoloji` 86, `/randevu/yeni` 91; erişilebilirlik ve best practices tümünde 100, CLS 0.

**Hedef notu:** Plan §13 kabul kriteri (ana sayfa mobil ≥ 85, CLS < 0,1) karşılanıyor. T05'teki ≥ 90 hedefi ana sayfa ve bölüm detayı için karşılanmıyor (86–88). Simüle LCP ~3,7 s; kalan maliyet ağırlıkla framework JS'i (React + Next ≈ 120 KB sıkıştırılmış) ve Inter web fontu (~130 KB). Sonraki adaylar: gövde metni için sistem fontu (tasarım kararı gerektirir), ana sayfadaki istemci bileşenlerinin azaltılması.
