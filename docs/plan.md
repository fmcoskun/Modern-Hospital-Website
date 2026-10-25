# Modern Hastane Web Sitesi — Proje Planı

Oct 25, 2026 · @Fatih Murat

Öneri: Next.js App Router + TypeScript + Tailwind üzerinde, statik örnek veriyle çalışan, tek bir anlamlı 3D sahnesi olan ve randevu akışını uçtan uca simüle eden bir MVP; neumorfizm yalnızca yüzey/kart dilinde, kontrastı WCAG AA'yı geçen metin ve kontrollerle. Gerçek hasta verisi hiçbir aşamada kullanılmaz.

## 1. Proje tanımı

Kurgusal "Özel Şifa Hastanesi" için, portfolyoda sergilenecek ve ileride gerçek bir hastane projesine iskelet olabilecek bir kurumsal web sitesi demosu. Demo; doktor/bölüm keşfi, simüle randevu akışı, hasta rehberi ve sağlık içeriği akışlarını uçtan uca çalışır halde gösterir.

**Değer önerisi:** Hasta tarafında "en fazla 3 tıkla doğru doktora ve randevuya ulaşmak"; geliştirici portfolyosu tarafında "gerçek dünya kısıtlarını (KVKK, erişilebilirlik, performans) bilen, modüler bir Next.js mimarisi".

| Hedef kullanıcı                              | Birincil ihtiyaç                                       | Sitedeki karşılığı                          |
| -------------------------------------------- | ------------------------------------------------------ | ------------------------------------------- |
| Randevu almak isteyen hasta                  | Bölüm/doktor seçip uygun saat bulmak                   | Randevu sihirbazı, doktor arama             |
| Doktor araştıran hasta                       | Uzmanlık, deneyim, dil, lokasyon                       | Doktor listeleme + profil                   |
| Hasta yakını / ziyaretçi                     | Ulaşım, otopark, ziyaret saatleri, refakatçi kuralları | Hasta & ziyaretçi rehberi, lokasyonlar      |
| Acil durumdaki kullanıcı                     | Acil telefon ve en yakın acil servis                   | Kalıcı acil çubuğu, lokasyon kartı          |
| Sağlık bilgisi arayan okur                   | Güvenilir, hekim onaylı içerik                         | Sağlık rehberi                              |
| Aday çalışan, tedarikçi, basın               | İlan, ihale, basın kiti                                | Kurumsal alt sayfalar (düşük öncelik)       |
| Portfolyo değerlendiricisi (işveren/müşteri) | Kod kalitesi, mimari, UX olgunluğu                     | README, demo senaryoları, Lighthouse raporu |

**Kapsam içi (demo):** Kurumsal site, doktor/bölüm kataloğu, simüle randevu, içerik modülü, tek 3D sahne, TR dilinde tam içerik, EN için altyapı.

**Kapsam dışı (demo):** Gerçek randevu/HBYS entegrasyonu, e-Nabız/e-Sonuç erişimi, ödeme, hasta portalı ve kimlik doğrulama, gerçek kişisel veri toplama, canlı yönetim paneli.

**İşaretli varsayımlar:** (V1) Tek geliştirici, Claude Code ile; (V2) barındırma Vercel veya benzeri; (V3) kurgusal tek hastane + 3 şube; (V4) ekran görüntüsündeki marka adı "Özel Şifa Hastanesi" demo adı olarak korunur — gerçek bir kurumla isim çakışması olabileceği için yayından önce kontrol edilmeli (Açık sorular).

## 2. Mevcut dosyaların analizi

Üç dosya da bulundu ve okundu. Ekran görüntüsü bir ana sayfa mock-up'ı; `index.html` + `style.css` ise hastane sitesi değil, bağımsız bir **neumorfik sosyal medya buton demosu**. Yani tasarım yönü görselden, yüzey/gölge tekniği CSS'ten alınacak; HTML yapısı yeni projeye taşınacak bir şey içermiyor.

| Dosya                                          | Durum                     | İçerik (gözlenen)                                                                                                 |
| ---------------------------------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `Gemini_Generated_Image_fdyduffdyduffdyd.jfif` | Okundu, 1984×2154 px JPEG | Yapay zekâ ile üretilmiş tek sayfalık ana sayfa mock-up'ı                                                         |
| `index.html`                                   | Okundu, 850 B             | `<title>replit</title>`, Font Awesome 4.7 CDN, 5 sosyal medya ikonlu `<ul>`; başka içerik yok                     |
| `style.css`                                    | Okundu, 1,1 KB            | `#dedede` zemin, ortalanmış flex `ul`, 60 px dairesel "kabarık" butonlar, hover'da gölge daralması ve marka rengi |

### 2.1 Ekran görüntüsü

Yukarıdan aşağı: logo + 5 öğeli menü + "Randevu Al" butonu + arama ikonu → hero ("Sağlığınız Güvenli Ellerde", serif başlık, lorem ipsum metin, 3 dairesel hızlı eylem: Hızlı Randevu / E-Sonuç / Doktor Bul, sağda 3 dairesel fotoğraf kümesi) → "Öne Çıkan Branşlarımız" (4 ikon kartı) → "Doktorlarımız" (4 dairesel portre) → sağda yapışık "Online Randevu Al" formu → koyu gri footer (İletişim, Hızlı Linkler, sosyal ikonlar).

Örneklenen renkler (piksel ölçümü, yaklaşık): zemin `#dbdbdb`–`#dddddd`, kart yüzeyi `#fcfcfa`, birincil teal gradyan `#69afb7` → `#6a8286`, footer `#4d4c51`.

**Güçlü yönler**

- Sakin, tek vurgulu (teal) palet; sağlık sektöründe güven ve temizlik algısı yaratıyor.
- Birincil eylemler (Randevu Al, Hızlı Randevu, Doktor Bul) ekranın ilk görünümünde; doğru önceliklendirme.
- Serif hero başlığı + sans-serif gövde kombinasyonu kurumsal ve okunaklı.
- Bol boşluk, düşük görsel gürültü; neumorfik yüzeyler kartları gruplamada etkili.

**Eksikler ve riskler**

| Bulgu                                                                             | Etki                                           | Öneri                                                                              |
| --------------------------------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------- |
| Beyaz metin / teal buton kontrastı ≈ 2,5:1; aktif menü (teal / gri zemin) ≈ 1,8:1 | WCAG AA (4,5:1) altında                        | Teal'i `#0f5961`–`#1f6f78` aralığına koyulaştır (beyazla 5,8–8:1)                  |
| Input placeholder'ları açık gri / açık gri zemin (≈ 2,4:1); görünür label yok     | Erişilebilirlik ihlali, form anlaşılmaz        | Kalıcı `<label>`, kenarlı input, placeholder yalnız örnek için                     |
| Form alanları anlamsız ("Yapımala", "E-moil Bamalar", iki "Gönder")               | AI üretimi bozuk metin                         | Randevu formu ayrı sihirbaza taşınır; ana sayfada yalnız bölüm/doktor seçici kalır |
| Doktor adları anlamsız, "Uzmanlık" yer tutucu; fotoğraflar foto-gerçekçi          | Gerçek kişi sanılma riski                      | İllüstrasyon/avatar + "Demo" ibaresi (bkz. 4.D)                                    |
| Acil servis telefonu ve acil erişim yok                                           | Hastane sitesinde kritik eksik                 | Kalıcı üst bilgi çubuğunda acil hattı                                              |
| Menü 5 öğe; Hasta Rehberi, Sağlık Rehberi, Lokasyonlar yok                        | Bilgi mimarisi sığ                             | 6 öğeli mega menü (Bkz. 3)                                                         |
| "E-Sonuç" hızlı eylemi                                                            | Gerçek tahlil sonucu = özel nitelikli veri     | Demoda "harici sisteme yönlendirme" bilgi sayfası; asla sahte sonuç ekranı yok     |
| Google+ ikonu, `info@gmail.com`                                                   | Güncel olmayan/kurumsal olmayan                | Kaldır; kurumsal alan adı örneği (`.example` TLD)                                  |
| Dairesel fotoğraf kümesi ve dairesel hızlı eylemler                               | Mobilde dar alan, dokunma hedefi tutarlı değil | Mobilde yatay kaydırılan pill butonlar, tek görsel                                 |

### 2.2 index.html

- Sayfa içeriği hastane ile ilgili değil; yapısal referans değeri yok.
- `lang` niteliği yok, `<title>` anlamsız, `<main>`/`<nav>` landmark'ı yok.
- İkon linklerinde `aria-hidden` var ama linkin erişilebilir adı (`aria-label`) yok → ekran okuyucu boş link okur.
- Font Awesome 4.7 (2016) harici CDN'den: hem eski hem üçüncü taraf istek (KVKK/çerez ve performans). Yeni projede SVG ikon seti (Lucide) önerilir.

### 2.3 style.css

- Neumorfizm tekniği: `linear-gradient(0deg, #ddd, #fff)` dış + ters gradyan iç daire ile "kabarık" yüzey, tek yönlü `box-shadow`. Klasik çift gölgeli (açık sol-üst, koyu sağ-alt) neumorfizmden daha sade; yüzey token'ına dönüştürülebilir.
- `:focus` / `:focus-visible` stili yok → klavye kullanıcısı odak göremez.
- Sabit px değerleri, CSS değişkeni yok, tip ölçeği yok, media query yok → responsive yaklaşım tanımlanmamış.
- `transition: .5s` tüm özelliklere; `prefers-reduced-motion` dikkate alınmıyor.
- `position:absolute` + `translate(-50%,-50%)` ile ortalama yalnız demo için; layout sistemi olarak taşınmamalı.

**Taşınacaklar:** renk tonu yönü (nötr gri + teal), yüzey gölge tekniği, hero hiyerarşisi ve hızlı eylem fikri. **Taşınmayacaklar:** HTML yapısı, kontrast değerleri, form, ikon kütüphanesi, foto-gerçekçi kişi görselleri.

## 3. Site haritası

Ana menü 6 öğe + kalıcı "Randevu Al" butonu + arama. Öncelik etiketleri: **\[M\]** MVP, **\[G\]** genişletilmiş demo, **\[R\]** gerçek hastane aşaması. URL'ler Türkçe slug; EN sürümde `/en/...` önekiyle eşleşen İngilizce slug.

**Global (her sayfada):** Üst bilgi çubuğu (acil hattı, çağrı merkezi, dil seçici) · Header (logo, mega menü, arama, Randevu Al) · Footer · Çerez banner'ı · Mobilde alt sabit eylem çubuğu (Ara / Randevu / Konum)

- **Ana Sayfa** `/` \[M\]
- **Kurumsal** `/kurumsal`
  - Hakkımızda (tanıtım + tarihçe + misyon/vizyon/değerler tek sayfada, çapa linkli) `/kurumsal/hakkimizda` \[M\]
  - Yönetim `/kurumsal/yonetim` \[G\]
  - Kalite ve Hasta Güvenliği (akreditasyon ve sertifikalar dahil) `/kurumsal/kalite` \[G\]
  - Teknolojik Altyapı `/kurumsal/teknoloji` \[G\]
  - Hastane ve Olanaklar (binalar, fiziksel olanaklar, 3D tanıtım) `/kurumsal/olanaklar` \[M\]
  - Anlaşmalı Kurumlar (sigorta + kurum anlaşmaları) `/kurumsal/anlasmali-kurumlar` \[M\]
  - Kariyer `/kurumsal/kariyer` → ilan detay `/kurumsal/kariyer/[slug]` \[G\]
  - İş Birlikleri `/kurumsal/is-birlikleri` \[R\]
  - Basın Odası (basın bültenleri, basın kiti) `/kurumsal/basin` \[R\]
  - İhale ve Tedarikçi Bilgilendirme `/kurumsal/ihaleler` \[R\]
- **Tıbbi Birimler** `/tibbi-birimler`
  - Bölüm listesi (grup ve A–Z görünümü) \[M\]
  - Bölüm detay `/tibbi-birimler/[slug]` (ortak şablon) \[M\]
  - Tanı ve Destek Hizmetleri: Laboratuvar, Radyoloji ve Görüntüleme (bölüm şablonuyla) \[M\]
  - Acil Servis `/tibbi-birimler/acil-servis` (özel şablon: telefon ve konum önde) \[M\]
  - Check-up Paketleri `/check-up` → paket detay `/check-up/[slug]` \[G\]
  - Sağlık Taramaları ve Özel Hizmetler (check-up altında) \[G\]
- **Doktorlar** `/doktorlar`
  - Doktor listeleme + arama/filtre \[M\]
  - Doktor profil `/doktorlar/[slug]` \[M\]
- **Hasta ve Ziyaretçi Rehberi** `/hasta-rehberi`
  - Randevu ve Muayene: ilk ziyaret, muayene öncesi hazırlık, hasta kabul \[M\]
  - Yatış ve Taburculuk: yatış süreci, refakatçi kuralları, ziyaret saatleri, taburculuk \[G\]
  - Ulaşım ve Hastane İçi: ulaşım, otopark, kat planları/yönlendirme \[M\]
  - Erişilebilirlik Olanakları (engelli ziyaretçiler) \[M\]
  - Hasta Hakları ve Sorumlulukları \[M\]
  - Geri Bildirim, Şikayet ve Memnuniyet Anketi `/hasta-rehberi/geri-bildirim` \[G\]
  - E-Sonuç bilgilendirme (harici sisteme yönlendirme metni, demo içinde işlevsiz) \[M\]
  - SSS `/hasta-rehberi/sss` \[M\]
- **Sağlık Rehberi** `/saglik-rehberi`
  - Makale listesi + kategori `/saglik-rehberi/kategori/[slug]` \[M\]
  - Makale detay `/saglik-rehberi/[slug]` \[M\]
  - Hastalık A–Z `/saglik-rehberi/hastaliklar` \[G\]
  - Videolar \[R\]
  - Haberler ve Duyurular `/duyurular` → detay \[M\]
  - Etkinlikler ve Seminerler `/etkinlikler` (takvim görünümü) \[G\]
- **İletişim** `/iletisim`
  - Genel iletişim + form \[M\]
  - Lokasyonlar `/lokasyonlar` → şube detay `/lokasyonlar/[slug]` \[M\]
- **Randevu** (menüde değil, CTA ile) `/randevu`
  - Randevu sihirbazı `/randevu/yeni` \[M\]
  - Randevu sorgula / iptal / değiştir `/randevu/sorgula` \[G\]
- **Yardımcı ve yasal (footer)**
  - Site içi arama sonuçları `/arama?q=` \[M\]
  - KVKK Aydınlatma Metni, Gizlilik Politikası, Çerez Politikası, Kullanım Koşulları \[M\]
  - Erişilebilirlik Bildirimi \[M\]
  - Demo Bildirimi ("Bu site kurgusaldır") `/demo-hakkinda` \[M\]
  - 404, 500, bakım sayfaları \[M\]
  - Site haritası (HTML) \[G\]

**Birleştirme kararları (tekrarı önlemek için):** Tarihçe + misyon/vizyon + kurumsal tanıtım tek sayfa; akreditasyon kalite sayfasına; sigorta + kurum anlaşmaları tek sayfa; "Hastane binaları" ve "fiziksel olanaklar" tek sayfa; duyuru + haber tek içerik tipi; basın duyuruları duyuruların "basın" kategorisi; hasta memnuniyeti + anket + şikayet tek geri bildirim sayfası; "Sağlık Teknolojileri" kurumsal teknoloji sayfası ile aynı.

## 4. Sayfa bazında gereksinimler

Site 9 sayfa şablonu üzerine kurulur; her yeni bölüm, doktor veya makale yeni kod değil yeni veri kaydıdır. Şablonlar: Ana sayfa · Liste+filtre · Bölüm detay · Doktor profil · Makale detay · Bilgi sayfası (rehber/kurumsal/yasal) · Lokasyon detay · Sihirbaz (randevu) · Hata/boş.

### 4.A Ana sayfa (yukarıdan aşağı)

| #   | Bölüm                     | Amaç ve içerik                                                                      | Bileşenler                                | Kullanıcı faydası                  | Görsel teknoloji                                                     |
| --- | ------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------- | ---------------------------------- | -------------------------------------------------------------------- |
| 1   | Üst bilgi çubuğu          | Acil hattı (tel: link), çağrı merkezi, dil seçici, demo uyarısı                     | `TopBar`, `LanguageSwitcher`              | Acil bilgiye 0 tıkla erişim        | —                                                                    |
| 2   | Header                    | Logo, 6 öğeli mega menü, arama, Randevu Al                                          | `SiteHeader`, `MegaMenu`, `SearchTrigger` | Tüm siteye tek noktadan gezinme    | Neumorfik yüzey, sticky + küçülme                                    |
| 3   | Hero                      | Değer cümlesi, 1 birincil (Randevu Al) + 1 ikincil (Doktor Bul) CTA, sağda 3D sahne | `Hero`, `HeroScene` (lazy)                | Ne yapılacağı ilk 3 saniyede net   | **Three.js** hastane kampüsü maketi; mobil/WebGL yoksa statik görsel |
| 4   | Hızlı eylemler            | Randevu Al, Doktor Bul, Lokasyonlar, E-Sonuç (bilgi), Check-up                      | `QuickActions`                            | En sık 5 işe tek tık               | Neumorfik dairesel butonlar (referanstan)                            |
| 5   | Doktor/bölüm arama kutusu | Tek alan, otomatik tamamlama: doktor, bölüm, hastalık                               | `GlobalSearchBox`                         | Ad bilinmeden doğru doktora ulaşma | —                                                                    |
| 6   | Öne çıkan bölümler        | 8 bölüm kartı + "Tüm birimler"                                                      | `DepartmentCard` grid                     | Kapsamı hızlı tarama               | Hover'da ikon mikro animasyonu (CSS)                                 |
| 7   | Öne çıkan doktorlar       | 4–8 kart, yatay kaydırma                                                            | `DoctorCard`, `Carousel`                  | Güven: yüz ve uzmanlık             | —                                                                    |
| 8   | Hakkımızda özeti          | 2 paragraf + sayılar (yatak, hekim, yıl — kurgusal)                                 | `StatsStrip`                              | Kurumsal ölçek algısı              | Sayı sayacı (reduced-motion'da kapalı)                               |
| 9   | Teknoloji ve olanaklar    | 3–4 teknoloji kartı + olanaklar linki                                               | `FeatureCard`                             | Tedavi kalitesi güvencesi          | İsteğe bağlı: 3D cihaz modeli \[G\]                                  |
| 10  | Check-up paketleri        | 3 paket özeti                                                                       | `PackageCard`                             | Doğrudan dönüşüm                   | —                                                                    |
| 11  | Sağlık rehberi            | Son 3 makale                                                                        | `ArticleCard`                             | SEO + uzmanlık gösterimi           | —                                                                    |
| 12  | Duyurular                 | Son 3 duyuru/etkinlik                                                               | `AnnouncementList`                        | Güncellik                          | —                                                                    |
| 13  | Hasta & ziyaretçi         | 4 kart: ilk ziyaret, ziyaret saatleri, otopark, hasta hakları                       | `InfoTile`                                | Sık soru öncesi bilgi              | —                                                                    |
| 14  | Lokasyonlar               | Şube kartları + statik harita görseli (tıklayınca harita)                           | `BranchCard`, `MapPreview`                | En yakın şubeyi bulma              | Harita onay sonrası yüklenir                                         |
| 15  | Footer                    | İletişim, hızlı linkler, yasal linkler, sosyal, demo bildirimi                      | `SiteFooter`                              | Derin linklere erişim              | —                                                                    |

Referanstaki sağ sütunda yapışık randevu formu ana sayfadan kaldırılır: kişisel veri alanı ana sayfada gereksiz, ve mobilde akışı böler. Yerine hero'da bölüm seçip sihirbaza geçiren mini seçici konur.

### 4.B Kurumsal

| Sayfa                                                 | Gereklilik   | Not                                                                         |
| ----------------------------------------------------- | ------------ | --------------------------------------------------------------------------- |
| Hakkımızda (tanıtım, tarihçe, misyon/vizyon/değerler) | Zorunlu      | Tek uzun sayfa, zaman çizelgesi bileşeni                                    |
| Hastane ve Olanaklar                                  | Zorunlu      | 3D kampüs sahnesinin tam sürümü burada                                      |
| Anlaşmalı Kurumlar                                    | Zorunlu      | Hasta için kritik: aranabilir liste (SGK, özel sigortalar — kurgusal adlar) |
| Kalite ve Hasta Güvenliği + Akreditasyon              | Önerilir     | Sertifika logoları kurgusal; gerçek JCI vb. logo kullanılmaz                |
| Teknolojik Altyapı                                    | Önerilir     | Cihaz kartları, ilgili bölümlere link                                       |
| Yönetim                                               | Önerilir     | Kurgusal isimler, avatar                                                    |
| Kariyer + ilan detay                                  | Önerilir     | Başvuru demoda harici link simülasyonu, CV toplanmaz                        |
| İş birlikleri, Basın, İhale                           | İsteğe bağlı | Gerçek hastane aşamasında                                                   |

### 4.C Tıbbi birimler

Verilen listedeki düzeltmeler: "Üroloji" iki kez geçiyor (tekleştirildi); Laboratuvar ve Radyoloji klinik branş değil "Tanı ve Destek" hizmeti; Acil Servis bir ünite; Check-up bir hizmet paketi; Anestezi "Anesteziyoloji ve Reanimasyon", Yoğun Bakım ayrı ünite.

| Grup                 | Birimler                                                                                                                                                                                 |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dahili bilimler      | İç Hastalıkları (alt: Endokrinoloji, Gastroenteroloji, Nefroloji — \[G\]), Kardiyoloji, Nöroloji, Göğüs Hastalıkları, Dermatoloji, Fizik Tedavi ve Rehabilitasyon, Psikiyatri            |
| Cerrahi bilimler     | Genel Cerrahi, Beyin ve Sinir Cerrahisi, Ortopedi ve Travmatoloji, Kalp ve Damar Cerrahisi, Üroloji, Kulak Burun Boğaz, Göz Hastalıkları, Plastik Cerrahi, Anesteziyoloji ve Reanimasyon |
| Kadın ve çocuk       | Kadın Hastalıkları ve Doğum, Çocuk Sağlığı ve Hastalıkları                                                                                                                               |
| Ağız ve diş          | Ağız ve Diş Sağlığı                                                                                                                                                                      |
| Tanı ve destek       | Laboratuvar (Biyokimya, Mikrobiyoloji, Patoloji), Radyoloji ve Görüntüleme                                                                                                               |
| Acil ve kritik bakım | Acil Servis, Yoğun Bakım Üniteleri                                                                                                                                                       |
| Koruyucu sağlık      | Check-up ve Sağlık Taramaları                                                                                                                                                            |

MVP: 12 birim tam içerikli, kalanlar aynı şablonla kısa içerikli.

**Bölüm detay şablonu (sırasıyla):**

1. Breadcrumb + başlık + kısa tanıtım + "Bu bölümden randevu al" (bölüm ön seçili sihirbaz)
2. Sayfa içi sekme/çapa menüsü: Hizmetler · Doktorlar · Teknoloji · Konum · SSS · Yazılar
3. Tedavi edilen durumlar ve hizmetler (liste, her biri isterse makaleye link)
4. Tanı ve tedavi olanakları
5. Kullanılan teknolojiler (Technology kayıtlarına referans)
6. Bölümün doktorları (DoctorCard grid, şubeye göre filtre)
7. Fiziksel konum: şube + bina + kat + çalışma saatleri; \[G\]'de 3D kat planında vurgulama
8. SSS (accordion, FAQPage yapısal verisi)
9. İlgili sağlık rehberi yazıları (3 kart)
10. Sticky randevu kartı (masaüstü sağ sütun, mobil alt çubuk)

Acil Servis bu şablonun varyantıdır: telefon, adres ve "Yol tarifi al" ilk ekranda, randevu CTA'sı yok.

### 4.D Doktorlar

**Liste sayfası:** Arama (ad-soyad, Türkçe karakter ve aksan duyarsız: "sukru" = "Şükrü"), filtreler: bölüm, uzmanlık/ilgi alanı, şube, yabancı dil, cinsiyet \[G\], "bu hafta uygun" \[G\]. Filtreler URL query'de tutulur (paylaşılabilir, SEO için `noindex` filtre kombinasyonları). Mobilde filtreler alt sayfa (sheet). Sonuç sayısı `aria-live` ile duyurulur. Boş sonuçta filtre temizleme önerisi.

**Doktor kartı:** avatar, unvan + ad soyad, bölüm, 2–3 ilgi alanı etiketi, şube(ler), dil bayrakları yerine dil kodları (TR, EN), "Profili gör" + "Randevu al". Puan/yorum yok: sağlık hizmetinde hasta yorumları yasal ve etik risk taşır (Sağlık Bakanlığı tanıtım mevzuatı — gerçek sürümde hukuk görüşü gerekir).

**Profil sayfası:** Üst blok (avatar, unvan, ad, bölüm, şube, diller, Randevu Al) → sekmeler: Hakkında · Eğitim ve akademik geçmiş (zaman çizelgesi) · Deneyim · İlgi alanları · Yayınlar \[G\] → haftalık çalışma günleri tablosu (şubeye göre) → yazdığı/onayladığı makaleler → aynı bölümden diğer doktorlar. Yapısal veri: `Physician`.

**Gerçek kişilerle karışmayı önleme:** (1) Foto-gerçekçi yüz yerine açıkça illustrasyon olan stilize avatar (AI üretimi foto-gerçekçi yüzler de kullanılmaz, gerçek kişiye benzeyebilir); (2) isimler kurgusal ve listeden üretilmiş, yayın öncesi arama motorunda "isim + branş" kontrolü; (3) diploma kurumları "Örnek Tıp Fakültesi" gibi jenerik; (4) her profilde "Demo profil — gerçek bir hekimi temsil etmez" rozeti; (5) diploma/tescil numarası alanı gösterilmez; (6) sitenin tamamı `noindex` (portfolyo demo) — bkz. Açık sorular.

### 4.E Randevu

Akış adımları 5. bölümde. Demo/gerçek ayrımı:

| İşlev                    | Demoda                                                                                                                            | Gerçek sürümde gereken                                                    |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Bölüm/doktor/şube seçimi | Statik veri                                                                                                                       | CMS/DB                                                                    |
| Uygun saatler            | `DoctorSchedule` kurallarından deterministik üretilen slotlar, tohumlu rastgele "dolu" işaretleme                                 | HBYS/MHRS entegrasyonu, gerçek zamanlı doluluk, slot kilitleme            |
| Hasta bilgileri formu    | İstemci + sunucu doğrulaması, **veri hiçbir yere yazılmaz**; form demo modunda yalnız "Adınız" ve sahte telefon örneği kabul eder | Kimlik doğrulama (TC kimlik/SMS OTP), açık rıza yönetimi, şifreli saklama |
| Özet ve onay             | Çalışır; rastgele demo randevu kodu                                                                                               | DB kaydı, idempotent oluşturma                                            |
| Onay bildirimi           | Ekranda + `.ics` takvim dosyası indirme                                                                                           | SMS/e-posta sağlayıcısı, İYS uyumu                                        |
| Sorgula/iptal/değiştir   | `sessionStorage`'daki demo randevuyla simüle                                                                                      | Kimlik doğrulamalı işlem, işlem kaydı                                     |
| Telefonla randevu        | `tel:` link + çağrı merkezi saatleri                                                                                              | Aynı                                                                      |

### 4.F Hasta ve ziyaretçi rehberi

Kullanıcı ihtiyacına göre 5 grup (site haritasındaki alt başlıklar): **Gelmeden önce** (ilk ziyaret, muayene hazırlığı, randevu bilgisi, e-Sonuç bilgisi) · **Gelirken** (ulaşım, otopark, erişilebilirlik) · **Hastanedeyken** (hasta kabul, yönlendirme/kat planları, ziyaret saatleri, refakatçi) · **Ayrılırken** (taburculuk) · **Haklar ve geri bildirim** (hasta hakları, şikayet, anket, SSS, iletişim kanalları). Hepsi "Bilgi sayfası" şablonu: içindekiler, adım listeleri, ilgili linkler, "Bu sayfa yardımcı oldu mu?" \[G\].

### 4.G Sağlık rehberi

Liste: kategori sekmeleri (Hastalıklar, Koruyucu Sağlık, Beslenme, Çocuk Sağlığı, Kadın Sağlığı…), etiket filtresi, arama, sayfalama. Detay: başlık, **yazar + tıbbi gözden geçiren hekim + son gözden geçirme tarihi**, okuma süresi, içindekiler, gövde, kaynaklar listesi, "Bu içerik bilgilendirme amaçlıdır, tıbbi tavsiye yerine geçmez" kutusu, ilgili bölüm ve doktor kartları, ilgili 3 makale (aynı kategori + etiket kesişimi). İçerik modeli ve onay akışı: 8. bölüm.

Demo içerikleri: her makalenin başında "Kurgusal demo içeriği" rozeti; ilaç/doz önerisi içermeyen genel ve zararsız konular (örn. "Check-up öncesi hazırlık"); metinler kaynak olarak WHO/Sağlık Bakanlığı genel sayfalarına link verebilir ama alıntı yapmaz.

### 4.H İletişim ve lokasyonlar

- **İletişim sayfası:** çağrı merkezi, acil hattı, e-posta, KEP adresi (kurgusal), konu seçmeli form (Genel / Randevu / Geri bildirim / Basın / Kurumsal) → konuya göre ilgili birime yönlendirme metni, SSS.
- **Form:** ad, e-posta veya telefon (biri zorunlu), konu, mesaj (max 2000 karakter), KVKK aydınlatma onay kutusu değil **aydınlatma linki** + gerekiyorsa ayrı açık rıza; mesajda sağlık bilgisi yazmaması uyarısı. Spam: honeypot alan + zaman eşiği + Cloudflare Turnstile \[G\] + IP bazlı rate limit. Demoda Server Action doğrular ve hiçbir yere göndermeden başarı döner.
- **Lokasyon listesi/detay:** adres, telefon, çalışma saatleri (acil 7/24), toplu taşıma, otopark, şubedeki bölümler, statik harita görseli → kullanıcı onayı sonrası OpenStreetMap/Leaflet veya Google Maps iframe, "Yol tarifi" derin linki. Yapısal veri: `Hospital` + `EmergencyService`.

### 4.I Diğer sayfalar — öncelik

| Sayfa / özellik                                                      | Öncelik        | Gerekçe                                                   |
| -------------------------------------------------------------------- | -------------- | --------------------------------------------------------- |
| Laboratuvar, Radyoloji                                               | MVP            | Bölüm şablonuyla sıfır ek maliyet                         |
| Check-up paketleri                                                   | Genişletilmiş  | Karşılaştırma tablosu bileşeni ister                      |
| Sigorta/kurum anlaşmaları                                            | MVP            | Hasta için yüksek kullanım                                |
| Hasta memnuniyeti, anket, şikayet                                    | Genişletilmiş  | Tek form, kategori alanıyla                               |
| Kariyer                                                              | Genişletilmiş  | Basit liste/detay                                         |
| İhale, basın odası, iş birlikleri                                    | Gerçek hastane | Portfolyo değeri düşük                                    |
| Duyurular                                                            | MVP            | Ana sayfayı besler                                        |
| Etkinlik takvimi                                                     | Genişletilmiş  | Takvim bileşeni                                           |
| SSS (global)                                                         | MVP            | Mevcut FAQ verisinden derlenir                            |
| KVKK, gizlilik, çerez, kullanım koşulları, erişilebilirlik bildirimi | MVP            | Şablon metin + "demo" notu; hukuki geçerlilik iddiası yok |
| 404 / 500 / arama sonuçları                                          | MVP            | Kalite göstergesi, düşük maliyet                          |
| Video içerikler                                                      | Gerçek hastane | Medya barındırma ve altyazı maliyeti                      |

## 5. Kullanıcı yolculukları

Dört kritik akışın hedefi: ana sayfadan sonuca en fazla 3 karar adımı, her adımda geri dönülebilirlik, klavye ve ekran okuyucuyla tam tamamlanabilirlik.

### 5.1 Doktor bulma

1. Giriş noktası: ana sayfa arama kutusu, "Doktor Bul" hızlı eylemi, menü veya bölüm sayfası.
2. Arama kutusunda yazarken otomatik tamamlama 3 grup gösterir: Doktorlar · Bölümler · Hastalık/şikayet (örn. "migren" → Nöroloji). Ok tuşlarıyla gezilebilir (ARIA combobox).
3. Doğrudan doktor seçilirse → profil; aksi halde → `/doktorlar?bolum=noroloji` ön filtreli liste.
4. Kullanıcı şube, dil, "bu hafta uygun" filtreleriyle daralır; URL güncellenir, sonuç sayısı duyurulur.
5. Kart → profil; profilde çalışma günleri ve ilgi alanları kontrol edilir.
6. "Randevu al" → sihirbaz doktor + bölüm + şube ön seçili olarak 4. adımdan (tarih) açılır.

Uç durumlar: sonuç yok → filtre gevşetme önerisi + çağrı merkezi; doktor artık çalışmıyor (`isActive=false`) → profil 410 değil, aynı bölüme yönlendiren bilgi sayfası.

### 5.2 Randevu alma (sihirbaz)

Tek sayfa, adım göstergeli, her adım URL'de (`?adim=3`) — tarayıcı geri tuşu çalışır, sayfa yenilenince durum korunur (sessionStorage).

1. **Şube seçimi** — tek şube varsa atlanır; konuma göre sıralama yalnız kullanıcı izin verirse.
2. **Bölüm seçimi** — arama + gruplu liste; "Hangi bölümü seçeceğimi bilmiyorum" → çağrı merkezi bilgisi (semptom değerlendirmesi yapılmaz: tıbbi yönlendirme riski).
3. **Doktor seçimi (isteğe bağlı)** — "Fark etmez, en erken uygun" seçeneği ilk sırada.
4. **Tarih ve saat** — 14 günlük yatay gün şeridi; yalnız uygun slotlar gösterilir; dolu günler devre dışı + nedeni metinle ("Uygun saat yok"). Doktor seçilmediyse slot yanında doktor adı. Slotlar `<button>` grubu, renk tek başına durum taşımaz.
5. **Kişi bilgileri** — ad, soyad, cep telefonu, e-posta (isteğe bağlı), doğum yılı (yaş grubu için, tam tarih değil). TC kimlik, şikayet açıklaması, sigorta numarası **istenmez** (veri minimizasyonu). Aydınlatma metni linki; satır içi hata mesajları + hata özeti.
6. **Özet** — tüm seçimler, her biri "Değiştir" linkiyle ilgili adıma döner.
7. **Onay** — "Randevuyu oluştur"; çift tıklamaya karşı buton kilidi.
8. **Sonuç ekranı** — randevu kodu, tarih/saat/konum, `.ics` indir, yol tarifi, "muayene öncesi hazırlık" linki, demo uyarısı. Odak başlığa taşınır.

Alternatif girişler: doktor profilinden (1–3 ön dolu), bölüm sayfasından (1–2 ön dolu), telefonla (her adımda görünen "Telefonla randevu: 444 X XXX" kurgusal numara).

Hata senaryoları: seçilen slot bu arada doldu (demoda %5 olasılıkla simüle edilir) → 4. adıma dönüş + bilgilendirme; sunucu hatası → girilen bilgiler korunur, tekrar dene; oturum süresi doldu → seçimler korunur.

**Sorgulama/iptal \[G\]:** randevu kodu + telefon son 4 hane → detay → iptal (onay diyaloğu) veya değiştir (4. adıma ön dolu geçiş).

**Erişilebilir akış gereksinimleri:** her adım değişiminde odak adım başlığına, adım göstergesi `aria-current="step"`, zaman aşımı varsa uzatma seçeneği (WCAG 2.2.1), sürükle-bırak veya hover'a dayalı etkileşim yok, 44×44 px minimum dokunma hedefi.

### 5.3 Lokasyon bulma

1. Header "İletişim → Lokasyonlar" veya ana sayfa lokasyon kartı veya mobil alt çubuktaki "Konum".
2. Şube listesi: ad, ilçe, acil servis var/yok rozeti, şu an açık/kapalı (poliklinik saatine göre), telefon.
3. "Bana en yakın" (isteğe bağlı konum izni, konum sunucuya gönderilmez, sıralama istemcide).
4. Şube detayı: adres kopyala, `tel:` link, "Yol tarifi" (Google/Apple/Yandex derin link), toplu taşıma ve otopark, şubedeki bölümler, harita (onay sonrası).
5. Acil senaryo: üst çubuktaki acil linki → yalnız acil servisi olan şubeler + 112 hatırlatması.

### 5.4 Sağlık içeriği keşfetme

1. Giriş: arama motoru (en olası), ana sayfa makale kartları, bölüm sayfasındaki "ilgili yazılar".
2. Makale: başlık altında gözden geçiren hekim ve tarih (güven sinyali), içindekiler.
3. Okuma sonunda: ilgili bölüm kartı + yazar doktor kartı + "Bu konuda randevu al" (bölüm ön seçili).
4. Yan keşif: aynı kategori/etiketten 3 makale, kategori sayfası.

Dönüşüm zinciri (içerik → bölüm → doktor → randevu) portfolyoda "bilgi mimarisi düşüncesi" olarak gösterilebilecek en güçlü örnek.

## 6. Tasarım sistemi

Karar: **"Soft neumorfizm"** — neumorfik kabarık/gömülü yüzey yalnız kart, hızlı eylem butonu, ikon kabı ve navigasyon kabı gibi _dekoratif konteynerlerde_; metin, form alanı, birincil buton ve durum göstergeleri klasik yüksek kontrastlı çizimle. Saf neumorfizmin bilinen sorunu, öğe sınırının yalnız gölgeyle ve zeminle aynı renkte çizilmesidir: kontrol sınırı 1,2–1,3:1 kalır ve WCAG 1.4.11 (UI bileşenleri için 3:1) ihlal edilir; düğmeye basılıp basılmadığı (durum) ayırt edilemez.

### 6.1 Neumorfizm kullanım kuralları

| Kural                                                                                                                | Neden                                            |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Etkileşimli her öğede ≥ 3:1 kontrastlı kenarlık veya dolgu; gölge yalnız ek derinlik                                 | WCAG 1.4.11                                      |
| Odak halkası: 2 px `--color-focus` + 2 px offset, gölge değil                                                        | 2.4.7 / 2.4.11                                   |
| Basılı durum (aktif filtre, seçili slot): gömülü gölge **+** dolgu rengi **+** ikon/metin (✓)                        | Durum renk/gölgeye tek başına dayanmaz (1.4.1)   |
| Form alanları gömülü (inset) yüzey + `#6b7880` kenarlık (3,7:1) + kalıcı label                                       | Referanstaki placeholder-only alanlar kaldırılır |
| İç içe en fazla 2 neumorfik katman                                                                                   | Görsel kalabalık ve paint maliyeti               |
| Uzun listelerde (doktor listesi 50+ kart) gölge sadeleşir: tek `box-shadow`                                          | Mobilde scroll performansı                       |
| `prefers-contrast: more` → gölgeler kapanır, 1 px koyu kenarlık                                                      | Yüksek kontrast kullanıcıları                    |
| Windows High Contrast (`forced-colors: active`) → sistem renkleri, gölgeler zaten düşer; kenarlıklar görünür kalmalı | Kenarlığı yalnız gölgeyle çizilen öğe kaybolur   |

### 6.2 Renk token'ları (açık tema)

Kontrast oranları WCAG 2.x formülüyle hesaplandı (zemin `#e4e8ec`).

| Token                              | Değer                                    | Kullanım                                                   | Kontrast                        |
| ---------------------------------- | ---------------------------------------- | ---------------------------------------------------------- | ------------------------------- |
| `--surface-base`                   | `#e4e8ec`                                | Sayfa zemini (referanstaki `#dbdbdb`'nin hafif soğuk tonu) | —                               |
| `--surface-raised`                 | `#f4f6f8`                                | Kart üst yüzeyi                                            | —                               |
| `--shadow-light` / `--shadow-dark` | `#ffffff` / `#c3cad1`                    | Neumorfik çift gölge                                       | dekoratif                       |
| `--text-primary`                   | `#1a2329`                                | Gövde ve başlık                                            | 12,95:1                         |
| `--text-secondary`                 | `#4b5a63`                                | Yardımcı metin                                             | 5,8:1                           |
| `--border-control`                 | `#6b7880`                                | Input, checkbox kenarı                                     | 3,69:1                          |
| `--brand-600`                      | `#0f5961`                                | Link, birincil buton dolgusu                               | 6,5:1 zemin; beyaz metin 8,01:1 |
| `--brand-500`                      | `#1f6f78`                                | Buton hover                                                | beyaz metin 5,83:1              |
| `--brand-200`                      | `#cfe5e7`                                | Seçili/aktif arka plan (referanstaki açık teal)            | metin `--text-primary` ile      |
| `--danger-600`                     | `#b3261e`                                | Hata metni, acil vurgusu                                   | 5,31:1; beyaz metin 6,54:1      |
| `--success-600`                    | `#1e6b3a`                                | Başarı                                                     | 5,3:1                           |
| `--warning`                        | amber arka plan + `--text-primary` metin | Uyarı kutusu                                               | amber metin olarak kullanılmaz  |
| `--color-focus`                    | `#0f5961`                                | Odak halkası                                               | 6,5:1                           |
| Footer                             | `#2b3238` zemin, `#e6edf2` metin         | Referanstaki koyu footer                                   | > 12:1                          |

**Koyu tema \[G\]:** zemin `#1b2228`, yüzey `#232b32`, metin `#e6edf2` (13,6:1), ikincil `#a9b6bf` (7,76:1), marka `#5fb3bb` (6,62:1; üzerindeki metin `#0b1d20`, 7,15:1), hata `#ff8a80` (7,04:1). Neumorfizm koyu zeminde zayıf görünür; koyu temada gölge yerine 1 px kenarlık + hafif yükselti tonu kullanılır. MVP'de yalnız açık tema; token yapısı koyu temaya hazır kurulur.

### 6.3 Tipografi

- Başlık: serif — **Lora** veya **Source Serif 4** (referanstaki hero hissi, Türkçe glif desteği tam). Gövde/UI: **Inter** veya **Plus Jakarta Sans** (`ğ ş ı İ` dahil latin-ext). `next/font` ile self-host: Google Fonts'a istemci isteği gitmez (KVKK/IP aktarımı ve CLS).
- Ölçek (1,25 oran, `clamp()` ile akışkan): Display 40–56 px · H1 32–40 · H2 26–32 · H3 20–24 · Gövde 16–18 · Küçük 14 · Yardımcı 13 (yalnız etiket). Satır yüksekliği gövde 1,6, başlık 1,2; satır uzunluğu max 72ch.
- Her sayfada tek H1; hiyerarşi atlanmaz (H2 → H4 yok).

### 6.4 Grid, boşluk, kırılımlar

- 4 px taban, ölçek: 4, 8, 12, 16, 24, 32, 48, 64, 96.
- Container max 1280 px; 12 kolon masaüstü (gutter 24), 8 kolon tablet (gutter 20), 4 kolon mobil (gutter 16, kenar 16).
- Kırılımlar (Tailwind ile uyumlu): `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280. Mobil-önce yazılır. 320 px genişlikte yatay kaydırma olmamalı (WCAG 1.4.10).
- Radius: kart 20 px, buton pill (999 px), input 12 px, ikon kabı daire.

### 6.5 Bileşen envanteri

| Grup          | Bileşenler                                                                                                                               | Durumlar                                                              |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Buton         | Primary (dolu brand), Secondary (neumorfik raised + brand metin), Ghost, Danger, Icon button, CTA pill (Randevu Al)                      | default, hover, focus-visible, active/pressed, disabled, loading      |
| Form          | TextField, Select (native), Combobox (arama), Checkbox, Radio card, DatePicker şeridi, Slot grid, Textarea, FieldError, FormSummaryError | boş, dolu, odak, hata, devre dışı, salt okunur                        |
| Kart          | DepartmentCard, DoctorCard, ArticleCard, BranchCard, PackageCard, InfoTile, FeatureCard                                                  | default, hover (yükselme), focus (tüm kart tıklanabilir ise tek link) |
| Navigasyon    | TopBar, SiteHeader, MegaMenu, MobileDrawer, MobileBottomBar, Breadcrumb, Tabs, Pagination, StepIndicator, SkipLink                       | aktif sayfa `aria-current`                                            |
| Geri bildirim | Alert (info/success/warning/error), Toast (yalnız ikincil bilgi), Skeleton, Spinner, EmptyState, ErrorState, DemoBadge                   | —                                                                     |
| İçerik        | Accordion (SSS), Timeline, StatsStrip, RichText, Callout (tıbbi uyarı), TableOfContents                                                  | —                                                                     |
| Overlay       | Dialog, Sheet (mobil filtre), Popover                                                                                                    | odak tuzağı, ESC ile kapanma, odak iadesi                             |

### 6.6 Navigasyon, header, footer

- Masaüstü: sticky header, scroll'da 88 → 64 px; mega menü tıklama ile açılır (hover değil), `Esc` kapatır. Tıbbi Birimler mega menüsü grupları kolon olarak gösterir.
- Mobil: hamburger → tam ekran çekmece (accordion alt menüler) + **alt sabit eylem çubuğu**: Ara · Randevu · Konum (başparmak erişimi).
- Footer 4 kolon: Kurumsal · Hasta Rehberi · Birimler · İletişim; alt satır yasal linkler + demo bildirimi + sosyal ikonlar (`aria-label`'lı, Google+ yok).

### 6.7 İkon ve görsel

- İkonlar: **Lucide** (SVG, tree-shake edilebilir, MIT, 1,5 px çizgi — referanstaki ince çizgi ikonlarla uyumlu). Tıbbi özel ikonlar için Healthicons (CC0). Dekoratif ikon `aria-hidden`, tek başına buton olan ikon `aria-label`'lı.
- Görseller: mekan/teknoloji için lisanslı stok veya AI üretimi (kişi içermeyen), kişiler için illustrasyon. `next/image`, AVIF/WebP, sabit en-boy oranı (CLS 0).

### 6.8 Hareket, yükleme, boş ve hata durumları

- Süreler: mikro 150 ms, panel 250 ms, sayfa içi 300 ms; easing `cubic-bezier(.2,.8,.2,1)`. Yalnız `transform` ve `opacity` animasyonu (referanstaki `transition: .5s` tüm özelliklere uygulanmıyor).
- `prefers-reduced-motion: reduce` → parallax, sayacı animasyonu, 3D otomatik dönme kapanır; geçişler anlık veya yalnız opacity.
- Loading: liste ve kartlarda skeleton (şekli korur), butonlarda inline spinner + metin ("Oluşturuluyor…"), route seviyesinde `loading.tsx`.
- Boş durum: ne oldu + neden + ne yapılabilir (örn. "Bu filtrelerle doktor bulunamadı. Filtreleri temizle / Çağrı merkezini ara").
- Hata: satır içi alan hatası + formun üstünde linkli hata özeti; sayfa hatası `error.tsx` ile tekrar dene + ana sayfa; 404 sayfasında arama kutusu ve popüler linkler.

### 6.9 Sağlık sektörüne uygunluk ilkeleri

- Güven: gerçekçi ama abartısız dil, "en iyi/1 numara" gibi üstünlük iddiası yok (sağlık tanıtım mevzuatı riski).
- Sakinlik: tek vurgu rengi, kırmızı yalnız acil ve hata için.
- Netlik: ilk ekranda Randevu Al ve acil hattı her zaman görünür; menü derinliği en fazla 2 seviye.

## 7. Teknik mimari

Tek Next.js uygulaması (monorepo yok), App Router, ağırlıkla Server Components + statik üretim; veri erişimi bir **repository arayüzü** arkasında, MVP'de TypeScript/MDX dosyalarından okuyan "mock" uygulamayla. Gerçek backend geldiğinde yalnız bu katman değişir; sayfa ve bileşenler değişmez.

### 7.1 Teknoloji seçimi

| Alan                      | Seçim                                                                                            | Çözdüğü sorun                                                                                              | Alternatif                                                                                                                     | Not                                          |
| ------------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- |
| Framework                 | Next.js (güncel kararlı sürüm), App Router                                                       | SSG/ISR ile SEO + hız, dosya tabanlı routing, metadata API, Server Actions                                 | Astro (içerik ağırlıklı sitede daha hafif, ama randevu sihirbazı ve gelecekteki panel için React ekosistemi daha uygun), Remix | Kurulumda sürüm sabitlenir                   |
| Dil                       | TypeScript `strict`                                                                              | Veri modeli sözleşmeleri, refactor güvenliği                                                               | —                                                                                                                              | `noUncheckedIndexedAccess` açık              |
| Stil                      | Tailwind CSS + CSS değişkenleri (token)                                                          | Tutarlı boşluk/renk, ölü CSS yok, neumorfik gölgeler token'dan `shadow-neu-raised` gibi yardımcı sınıflara | CSS Modules + vanilla-extract                                                                                                  | Gölgeler `@theme` / plugin olarak tanımlanır |
| UI primitifleri           | Radix UI (veya shadcn/ui ile kopyalanan bileşenler)                                              | Dialog, Tabs, Accordion, Combobox için hazır ARIA davranışı                                                | React Aria (daha güçlü a11y, daha yüksek öğrenme maliyeti)                                                                     | Stil tamamen projede                         |
| Form                      | React Hook Form + Zod                                                                            | Performanslı kontrol, **aynı şema istemci ve sunucuda**                                                    | Conform (Server Actions odaklı)                                                                                                | Şemalar `features/*/schema.ts`               |
| 3D                        | three + @react-three/fiber + @react-three/drei                                                   | Deklaratif sahne, React yaşam döngüsü, lazy yükleme                                                        | Vanilla three (daha küçük, daha çok elle iş), Spline (hızlı ama ağır runtime ve vendor bağımlılığı)                            | Yalnız `features/scene3d` içinde             |
| İçerik (MVP)              | Typed TS veri dosyaları + MDX (makaleler) — Velite veya content-collections ile şema doğrulamalı | CMS kurmadan tip güvenli içerik, git geçmişi = sürüm                                                       | Contentlayer (bakımsız, önerilmez)                                                                                             | —                                            |
| CMS (gerçek)              | Payload CMS (Next.js içine gömülü, self-host, PostgreSQL)                                        | Rol bazlı editör, taslak/onay, medya                                                                       | Strapi, Sanity (SaaS — veri yurt dışı aktarımı KVKK değerlendirmesi), Directus                                                 | Karar Açık sorularda                         |
| Veritabanı (gerçek)       | PostgreSQL + Drizzle ORM                                                                         | İlişkisel model, tip güvenli sorgu                                                                         | Prisma                                                                                                                         | Demo için gerekmez                           |
| Kimlik doğrulama (gerçek) | Personel: kurumsal IdP (Keycloak / Entra ID) OIDC; Auth.js ile                                   | Rol/SSO, MFA                                                                                               | Clerk (SaaS, veri yerleşimi riski)                                                                                             | Hasta portalı ayrı kapsam                    |
| i18n                      | next-intl                                                                                        | App Router uyumlu, ICU mesaj, `[locale]` segment                                                           | next-i18next (Pages Router odaklı)                                                                                             | Bkz. 11. bölüm                               |
| Test                      | Vitest + Testing Library, Playwright + @axe-core/playwright, Lighthouse CI                       | Birim, bileşen, E2E, a11y, performans bütçesi                                                              | Jest, Cypress                                                                                                                  | Bkz. 10/13                                   |
| Kalite                    | ESLint (next, jsx-a11y), Prettier, TypeScript, Husky + lint-staged, commitlint (isteğe bağlı)    | Tutarlı kod, a11y lint                                                                                     | Biome (tek araç, daha hızlı; jsx-a11y kuralları kısmen)                                                                        | CI'da zorunlu                                |
| Barındırma                | Vercel (demo)                                                                                    | Sıfır yapılandırma, preview URL                                                                            | Netlify, Cloudflare Pages; gerçekte yurt içi bulut/on-prem (KVKK)                                                              | —                                            |

**Bilerek dışarıda bırakılanlar (demo için gereksiz karmaşıklık):** Redux/Zustand (URL state + server state yeterli; sihirbaz için `useReducer`), GraphQL, mikroservis, Storybook (isteğe bağlı \[G\]), Docker (demo için).

### 7.2 Klasör yapısı

```text
src/
  app/
    [locale]/
      (site)/                 # header+footer layout
        page.tsx              # ana sayfa
        kurumsal/[...]
        tibbi-birimler/page.tsx
        tibbi-birimler/[slug]/page.tsx
        doktorlar/page.tsx
        doktorlar/[slug]/page.tsx
        saglik-rehberi/...
        hasta-rehberi/...
        lokasyonlar/...
        iletisim/page.tsx
        arama/page.tsx
        (yasal)/kvkk|gizlilik|cerez|kullanim|erisilebilirlik
      (flow)/                 # sade layout (dikkat dağıtmayan)
        randevu/yeni/page.tsx
        randevu/sorgula/page.tsx
      not-found.tsx  error.tsx  loading.tsx
    sitemap.ts  robots.ts  manifest.ts
  features/                   # dikey dilimler
    doctors/      components/ queries.ts schema.ts
    departments/  ...
    appointments/ components/ actions.ts schema.ts slots.ts
    articles/     ...
    branches/     ...
    contact/      actions.ts schema.ts
    search/       index.ts (build-time arama indeksi)
    scene3d/      HeroScene.tsx CampusModel.tsx fallback/
  components/
    ui/           # Button, TextField, Card, Dialog... (tasarım sistemi)
    layout/       # SiteHeader, Footer, MegaMenu, MobileBottomBar
    seo/          # JsonLd
  lib/
    data/
      types.ts            # domain tipleri (8. bölüm)
      repositories.ts     # arayüzler
      mock/               # MVP uygulaması (seed verisi okur)
      api/                # gelecekteki REST/CMS uygulaması
      index.ts            # env'e göre seçim
    env.ts                # zod ile doğrulanan ortam değişkenleri
    seo.ts  i18n.ts  utils.ts
  content/
    seed/        doctors.ts departments.ts branches.ts ...
    articles/    *.mdx
  messages/      tr.json en.json
  styles/        globals.css tokens.css
public/models/   *.glb (Draco/Meshopt sıkıştırılmış)
tests/  e2e/  unit/
```

### 7.3 Mimari kararlar

| Konu                 | Karar                                                                                                                                                   | Gerekçe                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Route/layout         | `[locale]` kök segment; `(site)` ve `(flow)` route grupları                                                                                             | Randevu akışı sade layout'la dikkat dağıtmaz; URL'e etki etmez                       |
| Render stratejisi    | Liste/detay sayfaları `generateStaticParams` ile SSG; gerçek veride ISR (`revalidate`) veya on-demand revalidation (CMS webhook)                        | En hızlı TTFB, CDN önbelleği                                                         |
| Server/Client sınırı | Varsayılan Server Component; `"use client"` yalnız etkileşim yaprağında (filtre paneli, sihirbaz, 3D, menü)                                             | JS paketini küçük tutar                                                              |
| Filtre durumu        | URL search params (`nuqs` veya native)                                                                                                                  | Paylaşılabilir, geri tuşu çalışır, sunucuda render edilebilir                        |
| Servis katmanı       | `lib/data/repositories.ts` arayüzleri (`DoctorRepository.list(filter)`, `AppointmentService.getSlots(...)`)                                             | Mock ve gerçek kaynak arasında tek noktadan geçiş: `DATA_SOURCE` = `mock` veya `api` |
| API katmanı          | Mutasyonlar Server Actions (form) ; dış tüketici gerekirse `app/api/*` Route Handlers                                                                   | Server Actions CSRF'e karşı origin kontrolü içerir; ayrı API'yi yalnız ihtiyaçta aç  |
| Form                 | Zod şeması → RHF (istemci) + Server Action (sunucu) aynı şema; sonuç tipi başarıda `{ ok: true, data }`, hatada `{ ok: false, fieldErrors, formError }` | Tek doğrulama kaynağı                                                                |
| Hata yönetimi        | Beklenen hatalar sonuç nesnesiyle; beklenmeyenler `error.tsx`; sunucu loglarında PII maskeleme                                                          | Kullanıcıya anlaşılır mesaj, loga kişisel veri düşmez                                |
| SEO metadata         | Her route `generateMetadata`; `lib/seo.ts` ortak şablon (title template, OG, canonical, hreflang)                                                       | Tekrar yok                                                                           |
| Görsel               | `next/image`, `sizes` zorunlu, LCP görseline `priority`                                                                                                 | CLS/LCP                                                                              |
| Ortam değişkenleri   | `lib/env.ts` Zod ile build anında doğrulama; `NEXT_PUBLIC_` yalnız gizli olmayanlar                                                                     | Gizli anahtarın istemciye sızmasını önler; `server-only` paketiyle import koruması   |
| Konfigürasyon        | `site.config.ts`: hastane adı, telefonlar, özellik bayrakları (`features.scene3d`, `features.appointmentCancel`)                                        | Demo/gerçek ayrımı ve aşamalı açma                                                   |
| Kod standartları     | Dosya/bileşen PascalCase, hook `useX`, feature dışına import yalnız `index.ts` üzerinden (ESLint `no-restricted-imports`), mutlak import `@/`           | Modül sınırları korunur                                                              |
| Güvenlik başlıkları  | `next.config` / middleware: CSP (nonce), HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`                                        | Bkz. 10. bölüm                                                                       |

### 7.4 Ortam değişkenleri (planlanan)

| Değişken                                                  | Kapsam                 | MVP           | Not                                  |
| --------------------------------------------------------- | ---------------------- | ------------- | ------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`                                    | public                 | Evet          | canonical, sitemap                   |
| `DATA_SOURCE`                                             | server                 | Evet (`mock`) | `api` gerçek sürümde                 |
| `DEMO_MODE`                                               | server + public bayrak | Evet (`true`) | Demo rozetleri, veri yazmayı kapatır |
| `TURNSTILE_SECRET_KEY` / `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | server / public        | \[G\]         | Spam                                 |
| `RATE_LIMIT_REDIS_URL`                                    | server                 | \[G\]         | Upstash/Redis                        |
| `CMS_API_URL`, `CMS_API_TOKEN`                            | server                 | \[R\]         | —                                    |
| `DATABASE_URL`                                            | server                 | \[R\]         | —                                    |
| `SMS_PROVIDER_KEY`, `SMTP_*`                              | server                 | \[R\]         | —                                    |

## 8. Veri modelleri

Modeller iki sınıfa ayrılır: **katalog** (herkese açık, demo seed verisi gerçek DB'ye aynı şemayla taşınır) ve **işlem** (kişisel veri içerir; demoda yalnız tipi tanımlanır, hiçbir yerde saklanmaz). Tüm çevrilebilir metin alanları `LocalizedText` (`{ tr: string; en?: string }`) tipindedir; her kayıtta `id` (UUID), `slug`, `createdAt`, `updatedAt`, katalogda ayrıca `status` (draft / review / published / archived) ve `isDemo: true` bulunur.

### 8.1 Katalog modelleri

| Model                    | Temel alanlar                                                                                                                                                                                                         | İlişkiler                                                                                                                                           |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hospital                 | name, legalName, logo, callCenterPhone, emergencyPhone, kepAddress, socialLinks                                                                                                                                       | 1–N HospitalBranch                                                                                                                                  |
| HospitalBranch           | name, address (il, ilçe, açık adres, posta kodu), geo (lat, lng), phones, openingHours (OpeningHoursSpec\[\]), hasEmergency, transport, parking, accessibilityFeatures\[\], images                                    | N–1 Hospital; N–N Department (BranchDepartment: kat, bina, telefon dahili); 1–N Building/Floor \[G\]                                                |
| DepartmentGroup          | name, order                                                                                                                                                                                                           | 1–N Department                                                                                                                                      |
| Department               | name, summary, body (MDX/rich text), icon, kind (clinical / diagnostic / emergency / checkup), conditionsTreated\[\], procedures\[\], seo                                                                             | N–1 DepartmentGroup; self-ref parentId (İç Hastalıkları → Endokrinoloji); N–N Technology; N–N Doctor (DoctorDepartment); 1–N FAQ; N–N HealthArticle |
| Specialty                | name, code (TUS/yan dal adı)                                                                                                                                                                                          | N–N Doctor (DoctorSpecialty)                                                                                                                        |
| Doctor                   | title (Prof. Dr., Doç. Dr., Uzm. Dr.), firstName, lastName, avatar, bio, education\[\] (kurum, derece, yıl), experience\[\], interests\[\], languages\[\] (ISO 639-1), publications\[\] \[G\], gender \[G\], isActive | N–N Department (DoctorDepartment: isPrimary); N–N Specialty; N–N HospitalBranch üzerinden DoctorSchedule; 1–N HealthArticle (yazar/gözden geçiren)  |
| DoctorSchedule           | doctorId, branchId, departmentId, weekday (1–7), startTime, endTime, slotMinutes, validFrom, validTo                                                                                                                  | N–1 Doctor, Branch, Department                                                                                                                      |
| ScheduleException        | doctorId, date, type (izin, kongre, ek mesai), startTime?, endTime?                                                                                                                                                   | N–1 Doctor                                                                                                                                          |
| Service / CheckupPackage | name, description, includedTests\[\], durationMinutes, preparationNotes, priceVisible (false varsayılan)                                                                                                              | N–N Department; N–N HospitalBranch                                                                                                                  |
| Technology               | name, description, image, category                                                                                                                                                                                    | N–N Department                                                                                                                                      |
| HealthArticle            | title, excerpt, body (MDX), coverImage, categoryId, tags\[\], authorDoctorId, medicalReviewerDoctorId, reviewedAt, nextReviewDue, sources\[\] (title, url, accessedAt), readingMinutes, disclaimerVariant             | N–1 ArticleCategory; N–N Tag; N–N Department; N–1 Doctor (yazar, gözden geçiren)                                                                    |
| ArticleCategory / Tag    | name, slug, description                                                                                                                                                                                               | 1–N / N–N HealthArticle                                                                                                                             |
| Announcement             | title, body, type (haber / duyuru / basın), publishedAt, expiresAt, pinned                                                                                                                                            | N–N HospitalBranch (opsiyonel)                                                                                                                      |
| Event                    | title, description, startsAt, endsAt, location (branch veya online), registrationUrl, capacity                                                                                                                        | N–1 HospitalBranch                                                                                                                                  |
| InsuranceProvider        | name, type (SGK / özel sigorta / kurum), logo, coverageNotes, validUntil                                                                                                                                              | N–N HospitalBranch                                                                                                                                  |
| FAQ                      | question, answer, scope (global / department / branch / appointment), order                                                                                                                                           | N–1 Department veya Branch (polimorfik yerine nullable FK)                                                                                          |
| CareerPosting            | title, department, branchId, employmentType, description, requirements\[\], applyUrl, closesAt                                                                                                                        | N–1 HospitalBranch                                                                                                                                  |
| Page                     | title, body, template (info / legal), seo                                                                                                                                                                             | Kurumsal, rehber ve yasal sayfalar                                                                                                                  |
| Media \[R\]              | url, alt (LocalizedText, zorunlu), width, height, credit, license                                                                                                                                                     | Her görsel alanı Media referansı                                                                                                                    |

### 8.2 İşlem modelleri (kişisel veri)

| Model                | Alanlar (minimum)                                                                                                                                                                                                                          | Demoda                                       | Gerçekte                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- | ---------------------------------------------------------- |
| Appointment          | id, code (tahmin edilemez, 8+ karakter), doctorId?, departmentId, branchId, startsAt, endsAt, status (requested / confirmed / cancelled / completed / no\_show), channel (web / phone), patientRef, createdAt, cancelledAt?, cancelReason? | Bellekte + sessionStorage, sunucuda yazılmaz | DB, HBYS senkron                                           |
| PatientContact       | firstName, lastName, phone, email?, birthYear, consentRecordIds\[\]                                                                                                                                                                        | Hiç oluşturulmaz                             | Şifreli sütunlar, saklama süresi sonrası anonimleştirme    |
| ConsentRecord        | subjectRef, textVersion, channel, givenAt, withdrawnAt?                                                                                                                                                                                    | —                                            | Açık rıza/İYS ispatı                                       |
| ContactMessage       | topic, name, email/phone, message, status, assignedTo, createdAt                                                                                                                                                                           | Doğrulanır, atılır                           | İlgili birime kuyruk, 6–12 ay saklama (hukukla belirlenir) |
| Feedback / Complaint | type, message, contact?, relatedBranchId, status                                                                                                                                                                                           | Demoda yok/atılır                            | Şikayet yönetim süreci                                     |
| AuditLog \[R\]       | actorId, action, entity, entityId, diff (PII maskeli), at, ip (kısaltılmış)                                                                                                                                                                | —                                            | Panel için zorunlu                                         |
| User / Role \[R\]    | email, name, roles\[\], mfaEnabled, lastLoginAt                                                                                                                                                                                            | —                                            | Personel hesabı, IdP'den                                   |

### 8.3 İlişki kararları

- **Doktor ↔ bölüm:** N–N; bir hekim birden fazla birimde görev alabilir (örn. Kardiyoloji + Check-up). `DoctorDepartment.isPrimary` kart ve URL için birincil bölümü belirler.
- **Doktor ↔ şube:** doğrudan ilişki yok; `DoctorSchedule` üzerinden türetilir. Böylece "hangi gün hangi şubede" tek kaynaktan gelir.
- **Çalışma programı:** haftalık tekrar eden kural (`DoctorSchedule`) + istisnalar (`ScheduleException`). Slotlar saklanmaz, istekte hesaplanır: kural − istisna − dolu randevular. Saatler `Europe/Istanbul` yerel saatiyle saklanır, `startsAt` ise UTC `timestamptz`.
- **Randevu:** `doctorId` nullable ("fark etmez" seçimi gerçek sistemde atama sonrası dolar); `departmentId` + `branchId` zorunlu. Gerçek DB'de çift rezervasyona karşı `(doctorId, startsAt)` üzerinde kısmi unique index (status ≠ cancelled).
- **Makale ↔ hekim:** yazar ve tıbbi gözden geçiren ayrı alanlar; yayın için `medicalReviewerDoctorId` + `reviewedAt` zorunlu (şema seviyesinde kural).

### 8.4 Sağlık içeriği yayın akışı

`draft` (editör) → `review` (branş hekimi tıbbi doğruluk + kaynak kontrolü) → `published` (iletişim/kurumsal onay) → `nextReviewDue` geldiğinde otomatik "gözden geçirme gerekli" uyarısı (önerilen 12 ay). Her geçiş AuditLog'a yazılır. Demoda bu alanlar seed verisinde dolu, akış yalnız görüntülenir.

### 8.5 Seed verisi ilkeleri

- 3 şube, 20 bölüm, 40–60 doktor, 12 makale, 6 duyuru, 8 sigorta kurumu, 3 check-up paketi.
- Doktorlar deterministik üreticiyle (sabit tohumlu `@faker-js/faker` tr locale) bir kez üretilip dosyaya yazılır ve elle gözden geçirilir; her build'de yeniden üretilmez.
- Telefon numaraları gerçek abone numarasına denk gelmeyecek biçimde (örn. `0 (000) ...`) veya açıkça kurgusal; e-posta alan adı `.example` / `.test` (RFC 2606).
- Adresler gerçek bir hastanenin adresiyle çakışmamalı; haritada genel bir semt merkezi kullanılabilir.

## 9. Three.js kullanım planı

MVP'de tek 3D deneyim: **stilize, low-poly hastane kampüsü maketi** (ana sayfa hero'da hafif sürüm, "Hastane ve Olanaklar" sayfasında etkileşimli sürüm, binalara tıklayınca ilgili birim/olanak kartı). Bu, 3D'nin bilgi taşıdığı (bina, giriş, acil kapısı, otopark konumu) ve neumorfik "yumuşak kil" estetiğiyle doğal uyum sağladığı tek yer. Diğer tüm sayfalar 3D'siz.

### 9.1 Fikir değerlendirmesi

| Fikir                                                                                            | Kullanıcı faydası               | Zorluk                                                    | Performans riski                                                 | Karar                                                                             |
| ------------------------------------------------------------------------------------------------ | ------------------------------- | --------------------------------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Ana sayfada stilize kampüs maketi (yavaş dönen, hover'da bina vurgusu)                           | Orta: kimlik + mekan algısı     | Orta (model + sahne)                                      | Orta: \~1,5–2,5 MB toplam (three+r3f+model); LCP'yi etkilememeli | **MVP** — lazy, LCP dışı, statik poster görselle                                  |
| Olanaklar sayfasında etkileşimli kampüs (bina seç → bilgi paneli, giriş/otopark/acil işaretleri) | Yüksek: ulaşım ve yönlendirme   | Orta                                                      | Orta                                                             | **MVP** — aynı model, ek etkileşim                                                |
| Kat planları ve bölüm konumu (izometrik kat, bölüm vurgusu)                                      | Yüksek: hastane içi yönlendirme | Yüksek: her kat için model/veri                           | Orta                                                             | **\[G\]** — önce 2D SVG kat planı (daha erişilebilir), 3D isteğe bağlı üst katman |
| Bina dışı foto-gerçekçi 3D tanıtım / sanal tur                                                   | Orta                            | Çok yüksek (modelleme, doku, ışık)                        | Yüksek: 10+ MB, mobilde ısınma                                   | **Hayır** — gerçek hastanede 360° foto tur daha ucuz ve gerçekçi                  |
| Anatomik model (kalp, beyin, diz) bölüm sayfasında                                               | Orta: eğitici                   | Orta (hazır lisanslı model) ile Yüksek (doğru etiketleme) | Orta                                                             | **\[G\]** — yalnız 1 bölümde (Kardiyoloji), tıbbi doğruluk riski, lisans kontrolü |
| Teknoloji anlatımı (MR/BT cihazı 3D)                                                             | Düşük–orta                      | Orta                                                      | Orta                                                             | **\[G\]** opsiyonel; foto + kısa video çoğu zaman yeterli                         |
| Bölüm başına özel animasyon                                                                      | Düşük                           | Yüksek (20 bölüm × içerik)                                | Orta                                                             | **Hayır** — bölüm ikonlarında CSS mikro animasyon yeterli                         |
| Hafif 3D/partikül arka planlar                                                                   | Yok (dekoratif)                 | Düşük                                                     | Sürekli GPU kullanımı, pil                                       | **Hayır** — yerine CSS gradyan + neumorfik yüzey                                  |
| Mikro etkileşimler (kart eğimi, ikon)                                                            | Düşük–orta                      | Düşük                                                     | Düşük                                                            | **MVP** — CSS/Framer Motion ile, WebGL'siz                                        |

### 9.2 Teknik yaklaşım

- **Entegrasyon:** React Three Fiber + drei (`useGLTF`, `Bounds`, `Html`, `AdaptiveDpr`, `PerformanceMonitor`). Vanilla three'ye göre React durumu (seçili bina → yan panel) doğal bağlanır.
- **Modülerlik:** `features/scene3d` dışında three import edilmez (ESLint kuralı). Dışa açılan API: `<CampusScene mode="hero" | "explore" onSelect={...} />`; bina meta verisi (ad, ilgili sayfa, konum) JSON'dan, model yalnız geometri.
- **Yükleme:** `next/dynamic(() => import(...), { ssr: false })`; Canvas yalnız viewport'a girince (`IntersectionObserver`) ve `requestIdleCallback` sonrası yüklenir. İlk boyamada aynı kadrajdan render edilmiş **AVIF poster** görünür; LCP öğesi poster veya başlık olur, Canvas asla.
- **Model bütçesi:** tek GLB ≤ 800 KB (Draco veya Meshopt), ≤ 50 bin üçgen, doku yerine vertex color / tek 1K doku atlası, ışık bake edilmiş (gerçek zamanlı gölge yok veya `ContactShadows` tek seferlik). Model Blender'da low-poly olarak üretilir veya CC0 asset'lerden birleştirilir; lisans README'de belgelenir.
- **GPU/bellek:** `dpr={[1, 1.5]}`, `frameloop="demand"` (etkileşim yokken render yok), sekme gizliyken dur, unmount'ta `dispose` (drei otomatik + özel materyaller elle). Hedef: orta seviye Android'de 50+ FPS, sahne GPU belleği < 100 MB.
- **Mobil:** < 768 px veya `navigator.deviceMemory < 4` veya `saveData` açık → hero'da 3D yerine poster; "3D görünümü aç" butonuyla isteğe bağlı yükleme. Dokunmatikte tek parmak döndürme sayfa kaydırmayı engellemez (`touch-action: pan-y`, döndürme yalnız explore modunda).
- **Etkileşim:** OrbitControls sınırlı (zoom ve polar açı kısıtlı), bina seçimi tıkla/dokun; aynı seçim sahne yanında **HTML bina listesiyle** de yapılabilir (klavye ve ekran okuyucu için birincil yol).
- **Erişilebilirlik:** Canvas `aria-hidden` + yanında eşdeğer bilgi içeren metin listesi; 3D hiçbir bilgiyi tek başına taşımaz. Otomatik dönme 5 sn'den uzun sürerse duraklat butonu (WCAG 2.2.2).
- **Hareket azaltma:** `prefers-reduced-motion` → otomatik dönme ve kamera geçişleri kapalı, kamera anlık atlar.
- **WebGL yoksa / context lost:** `WebGL2` testi başarısız → poster + bina listesi; `webglcontextlost` olayında poster'a düş; Error Boundary ile sahne hatası sayfayı çökertmez.
- **Ölçüm:** sahne yüklendiğinde `performance.mark`; Lighthouse'ta ana sayfa mobil Performance skoru 3D eklenmeden önce ve sonra karşılaştırılır; düşüş > 5 puan ise poster-varsayılan moda geçilir.

**Gerçekçi olmayan veya gereksiz karmaşıklık:** foto-gerçekçi bina, gerçek zamanlı iç mekan navigasyonu (wayfinding motoru), WebXR/VR tur, scroll'a bağlı sinematik kamera (scrolljacking; erişilebilirlik ve mobil sorunu), her sayfada 3D arka plan.

## 10. Güvenlik, gizlilik ve kalite gereksinimleri

**Demo sürümünde gerçek hasta verisi, gerçek kişisel veri veya sağlık verisi toplanmaz, saklanmaz, üçüncü tarafa gönderilmez.** Formlar sunucu tarafta doğrulanır ve sonuç atılır; analitik kullanılacaksa çerezsiz ve IP saklamayan bir çözüm seçilir. Aşağıdaki mevzuat referansları planlama amaçlıdır; gerçek sürüm öncesi KVKK ve sağlık hukuku uzmanınca doğrulanmalıdır.

### 10.1 KVKK ve sağlık verisi

| Konu                    | Gereksinim                                                                                                                                                                       | Demo                                                                                      | Gerçek hastane                                                                                       |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Hukuki zemin            | 6698 sayılı KVKK; sağlık verisi özel nitelikli kişisel veri (m.6); Kişisel Sağlık Verileri Hakkında Yönetmelik; 2024 değişiklikleri (m.6 işleme şartları, m.9 yurt dışı aktarım) | Bilgilendirme sayfası + demo notu                                                         | Hukuk görüşü, VERBİS kaydı, veri envanteri, işleme faaliyetleri kaydı                                |
| Veri minimizasyonu      | Randevu için yalnız ad, soyad, telefon, doğum yılı; şikayet/semptom metni istenmez                                                                                               | Uygulanır                                                                                 | Her alan için işleme amacı belgelenir                                                                |
| Aydınlatma              | Form yanında katmanlı aydınlatma metni linki; açık rıza yalnız gerektiğinde, ayrı ve koşula bağlanmadan                                                                          | Şablon metin                                                                              | Hukuk onaylı metin, rıza kayıtları (ConsentRecord)                                                   |
| Yurt dışı aktarım       | Vercel, Google Maps, reCAPTCHA, SaaS CMS, e-posta servisleri yurt dışı sunucu kullanır                                                                                           | Kişisel veri geçmediği için düşük risk; harita onay sonrası                               | Yurt içi barındırma veya m.9 mekanizmaları (standart sözleşme), sağlık verisi için tercihen yurt içi |
| Saklama ve imha         | Saklama-imha politikası, periyodik imha, anonimleştirme                                                                                                                          | Veri yok                                                                                  | Politika + zamanlanmış iş + kayıt                                                                    |
| İlgili kişi hakları     | m.11 başvuruları (bilgi, düzeltme, silme) için kanal                                                                                                                             | Sayfa metni                                                                               | Başvuru süreci ve 30 gün yanıt                                                                       |
| İhlal bildirimi         | Kurula en kısa sürede, en geç 72 saat                                                                                                                                            | —                                                                                         | Olay müdahale planı                                                                                  |
| Çerezler                | Zorunlu dışı çerezler önceden onay; "Reddet" "Kabul et" ile eşit görünürlükte (KVKK çerez rehberi)                                                                               | Zorunlu çerez dışında çerez yok; banner yalnız harita/video gibi üçüncü taraf içerik için | Consent Management, kategori bazlı                                                                   |
| Ticari ileti            | SMS/e-posta hatırlatma bilgilendirme amacında; kampanya mesajı İYS onayı ister (6563)                                                                                            | —                                                                                         | İYS entegrasyonu                                                                                     |
| Sağlık tanıtım mevzuatı | Sağlık Bakanlığı tanıtım/reklam kuralları: üstünlük iddiası, hasta yorumu, öncesi-sonrası görseli, fiyat ilanı kısıtları                                                         | İçerik bu kısıtlara göre yazılır                                                          | Hukuk incelemesi                                                                                     |

Hukuki uygunluk bir "KVKK" sayfası eklemekle sağlanmaz: veri envanteri, teknik ve idari tedbirler (erişim yetkisi, loglama, şifreleme, eğitim), veri işleyen sözleşmeleri ve süreçler gerekir.

### 10.2 Uygulama güvenliği

| Risk                        | Önlem                                                                                                                                                                                |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Geçersiz/kötü niyetli girdi | Aynı Zod şemasıyla istemci + **sunucu** doğrulaması; uzunluk sınırları; telefon E.164 normalizasyonu; beklenmeyen alanlar reddedilir (`strict()`)                                    |
| XSS                         | React otomatik kaçış; `dangerouslySetInnerHTML` yalnız MDX derleme çıktısında; CMS rich text'i sanitize (DOMPurify / server-side); CSP nonce tabanlı, `unsafe-inline` script yok     |
| CSRF                        | Server Actions origin/host kontrolü; Route Handler'larda SameSite=Lax/Strict çerez + origin doğrulama; GET ile durum değişikliği yok                                                 |
| Spam/bot                    | Honeypot + minimum doldurma süresi (MVP); Cloudflare Turnstile \[G\] (reCAPTCHA'ya göre daha az izleme); IP + parmak izi bazlı rate limit (ör. 5 istek/10 dk/IP form başına)         |
| Randevu kodu tahmini (IDOR) | Kod en az 8 karakter, rastgele (CSPRNG), sorgu için ikinci faktör (telefon son 4 hane) + deneme sınırlaması                                                                          |
| Gizli anahtar sızıntısı     | `server-only` import koruması, `NEXT_PUBLIC_` disiplini, `.env*` git dışı, `.env.example` şablonu, CI'da gitleaks                                                                    |
| Loglama                     | PII maskeleme (telefon `+90 5** *** **12`), istek gövdesi loglanmaz, hata takibinde (Sentry) `beforeSend` ile temizlik ve EU/TR veri bölgesi                                         |
| Bağımlılık                  | `npm audit` / Dependabot / Renovate, lockfile commit, az bağımlılık                                                                                                                  |
| Başlıklar                   | HSTS, CSP, `X-Frame-Options: DENY` (veya `frame-ancestors`), `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (geolocation yalnız self)                      |
| Kimlik doğrulama (gerçek)   | Personel paneli: OIDC + MFA zorunlu, rol bazlı yetki (RBAC), oturum süresi, admin yüzeyi IP kısıtlı veya VPN arkası; hasta tarafı kimlik doğrulaması (SMS OTP / e-Devlet) ayrı proje |
| Üçüncü taraf                | Harita, video, analitik onay sonrası yüklenir; Google Fonts self-host; Font Awesome CDN kaldırılır                                                                                   |

**Randevunun gerçek ortamda çalışması için gerekenler:** HBYS (hastane bilgi yönetim sistemi) ile entegrasyon ve slot kilitleme; MHRS ile ilişki (kamu/özel durumuna göre); hasta kimlik doğrulama; KVKK risk analizi ve DPIA benzeri değerlendirme; sızma testi; çağrı merkezi iş akışıyla uyum; no-show ve iptal politikası; SMS/e-posta sağlayıcı sözleşmesi; 7/24 izleme ve olay müdahale; yedekleme ve felaket kurtarma.

### 10.3 SEO

| Konu                   | Plan                                                                                                                                                                                                                                |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Başlık/açıklama        | Template `%s · Özel Şifa Hastanesi`; doktor: "Uzm. Dr. Ad Soyad – Kardiyoloji"; bölüm: "Kardiyoloji Bölümü – Tanı ve Tedavi"; açıklama 140–160 karakter, sayfaya özgü                                                               |
| Metadata yönetimi      | `generateMetadata` + `lib/seo.ts`; OG görselleri `opengraph-image.tsx` ile dinamik (doktor adı + bölüm)                                                                                                                             |
| Canonical              | Her sayfada mutlak canonical; filtreli liste URL'leri canonical'ı filtresiz listeye verir; sayfalama self-canonical                                                                                                                 |
| Sitemap/robots         | `app/sitemap.ts` (bölüm, doktor, makale, lokasyon; `lastModified`), `robots.ts`. **Demo yayını `noindex` + robots `Disallow`** (kurgusal hastanenin arama sonuçlarında gerçek sanılmaması için); gerçek sürümde açılır              |
| Yapısal veri (JSON-LD) | `Hospital` (+ `EmergencyService`, `openingHoursSpecification`), `MedicalClinic` / `MedicalSpecialty` (bölüm), `Physician` (doktor), `MedicalWebPage` + `reviewedBy` + `lastReviewed` (makale), `FAQPage`, `BreadcrumbList`, `Event` |
| İndeksleme             | Doktor ve bölüm sayfaları SSG, ince içerikten kaçınmak için minimum metin; pasif doktor sayfası bölüme yönlendirir                                                                                                                  |
| İç bağlantı            | Makale ↔ bölüm ↔ doktor üçgeni; breadcrumb; "ilgili" bloklar                                                                                                                                                                        |
| Görsel alt metin       | Media modelinde `alt` zorunlu; dekoratif görselde `alt=""`                                                                                                                                                                          |
| Yerel SEO              | Her şube için ayrı sayfa ve NAP tutarlılığı (ad, adres, telefon); Google İşletme Profili gerçek sürümde                                                                                                                             |
| Çok dilli              | `hreflang` (tr, en, x-default), dile özgü slug ve metadata                                                                                                                                                                          |

### 10.4 Performans

Hedefler (mobil, 75. persentil): **LCP < 2,5 s, INP < 200 ms, CLS < 0,1**; Lighthouse mobil Performance ≥ 90 (3D'siz sayfalar), ana sayfa ≥ 85; ilk yükleme JS ≤ 170 KB gzip (3D hariç).

- Görsel: `next/image`, AVIF/WebP, doğru `sizes`, hero görseline `priority` + `fetchPriority=high`, diğerleri lazy.
- Kod bölme: route bazında otomatik; 3D, harita, takvim, date-fns locale `next/dynamic`.
- Fontlar: `next/font`, latin + latin-ext subset, en fazla 2 aile × 3 ağırlık, `display: swap`.
- Önbellek: SSG sayfalar CDN'de; statik varlıklar immutable hash'li; gerçekte ISR + on-demand revalidation.
- Bağımlılık disiplini: `@next/bundle-analyzer`, moment.js/lodash tam paket yok, ikonlar tek tek import.
- Neumorfik gölgeler: çok katmanlı `box-shadow` animasyonu yapılmaz; hover'da yalnız `transform`.
- Kontrol: Lighthouse CI bütçeleri (PR'da regresyon = fail), Vercel Speed Insights veya `web-vitals` ile RUM \[G\].

### 10.5 Erişilebilirlik

Hedef: **WCAG 2.2 AA**.

- Klavye: tüm etkileşimler Tab/Shift+Tab/Enter/Space/Esc/ok tuşlarıyla; "İçeriğe atla" linki; odak görünür ve gölgeyle kapanmaz (2.4.11).
- Ekran okuyucu: landmark'lar (`header`, `nav`, `main`, `footer`), `lang="tr"`, dinamik sonuçlarda `aria-live="polite"`, sihirbaz adımlarında odak yönetimi. Test: NVDA + Firefox, VoiceOver + Safari (iOS dahil).
- Formlar: her alana görünür `<label>`, zorunluluk metinle, `autocomplete` (given-name, family-name, tel, email), hata `aria-describedby` ile bağlı ve "Telefon numarası 10 haneli olmalı (örn. 5XX XXX XX XX)" gibi çözüm söyleyen.
- Kontrast: metin ≥ 4,5:1, büyük metin ve UI sınırları ≥ 3:1 (6.2 tablosu).
- Görseller: anlamlı alt metin; doktor avatarında `alt=""` (ad zaten yanında).
- Başlıklar: tek H1, sıralı hiyerarşi.
- Hareket: `prefers-reduced-motion`; otomatik kayan carousel yok (veya duraklat butonlu).
- Dokunma hedefi ≥ 24×24 px (2.5.8), tercihen 44×44.
- Metin %200 büyütüldüğünde ve 320 px genişlikte içerik kaybolmaz.

**Kontrol yöntemi:** eslint-plugin-jsx-a11y (yazarken) → Vitest + jest-axe (bileşen) → Playwright + axe her kritik sayfada (CI) → Lighthouse CI a11y ≥ 95 → her aşama sonunda manuel klavye ve ekran okuyucu turu (otomatik araçlar sorunların yaklaşık üçte birini yakalar).

## 11. MVP ve sonraki sürümler

MVP, "görsel olarak bitmiş + 4 kritik akış çalışıyor + kalite ölçülüyor" demektir; sayfa sayısı değil, akışların eksiksizliği ölçüt.

| Alan         | MVP — ilk çalışan demo                                                                                                                                                                                                                                   | Genişletilmiş demo                                                                                             | Gerçek hastane altyapısı                                                     |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Sayfalar     | Ana sayfa, bölüm liste/detay, doktor liste/profil, randevu sihirbazı, sağlık rehberi liste/detay, duyurular, hasta rehberi (çekirdek 8 sayfa), lokasyon liste/detay, iletişim, hakkımızda, olanaklar, anlaşmalı kurumlar, yasal sayfalar, 404/500, arama | Check-up, etkinlikler, kariyer, kalite, teknoloji, yönetim, geri bildirim, hastalık A–Z, randevu sorgula/iptal | Basın, ihale, iş birlikleri, video, hasta portalı (ayrı proje)               |
| Arama/filtre | Doktor: ad, bölüm, şube, dil; global arama (build-time indeks, örn. FlexSearch/MiniSearch)                                                                                                                                                               | Uygunluğa göre filtre, hastalıktan bölüme eşleme, yazım hatası toleransı                                       | Sunucu tarafı arama (Meilisearch/OpenSearch)                                 |
| Randevu      | 8 adımlı simüle akış, deterministik slotlar, `.ics`                                                                                                                                                                                                      | Sorgula/iptal/değiştir simülasyonu, slot çakışma senaryosu                                                     | HBYS entegrasyonu, kimlik doğrulama, SMS/e-posta, rıza kayıtları             |
| 3D           | Kampüs maketi (hero + olanaklar) + poster fallback                                                                                                                                                                                                       | 2D/3D kat planları, Kardiyoloji anatomik model                                                                 | Gerçek bina verisiyle güncellenen model; wayfinding ancak ayrı ürün olarak   |
| İçerik       | Seed TS + MDX; 12 makale                                                                                                                                                                                                                                 | Daha fazla içerik, ilgili içerik algoritması, yazar sayfaları                                                  | Headless CMS + tıbbi onay iş akışı                                           |
| Dil          | TR tam; i18n altyapısı (`[locale]`, mesaj dosyaları) kurulu                                                                                                                                                                                              | EN çeviri (UI + çekirdek sayfalar)                                                                             | Ek diller (AR dahil RTL), profesyonel tıbbi çeviri                           |
| Tema         | Açık tema, token'lı                                                                                                                                                                                                                                      | Koyu tema                                                                                                      | Kurumsal kimlik kılavuzuna göre token güncellemesi                           |
| Yönetim      | Yok                                                                                                                                                                                                                                                      | Salt-okunur "panel önizleme" ekranları (mock)                                                                  | Gerçek panel/CMS, RBAC, audit log                                            |
| Kalite       | Lint, tip, birim + kritik E2E, axe, Lighthouse CI                                                                                                                                                                                                        | Görsel regresyon, cross-browser matrisi                                                                        | Sızma testi, yük testi, izleme/alarm                                         |
| Altyapı      | Vercel, `DATA_SOURCE=mock`                                                                                                                                                                                                                               | Rate limit (Redis), Turnstile                                                                                  | PostgreSQL, yurt içi barındırma, yedekleme, CI/CD ortamları (dev/stage/prod) |

### 11.1 Çok dilli yapı (aşamalı)

- **Aşama 1 (MVP):** `app/[locale]` segmenti ve next-intl kurulur, yalnız `tr` aktif; tüm UI metinleri `messages/tr.json`'da (hard-coded metin yok); veri modelinde `LocalizedText`. Maliyet düşük, sonradan eklemek pahalı olduğu için şimdi yapılır.
- **Aşama 2 (\[G\]):** `en` açılır. URL: `/` (tr, varsayılan, öneksiz) ve `/en/...`; slug'lar dile özgü (`/en/doctors/[slug]`) ve pathnames eşlemesiyle. Dil seçici aynı sayfanın karşılığına gider; çevirisi yoksa o dilin ana sayfasına değil, sayfayı TR'de gösterip uyarı verir (veya hreflang'ta listelenmez).
- **Doktor alanları:** çevrilebilir = bio, interests, education.degree, experience.role, unvan görünümü ("Uzm. Dr." → "Specialist MD"); çevrilmez = ad, soyad, kurum adı (resmi ad).
- **SEO:** dile özgü title/description, `hreflang` + `x-default`, dil başına sitemap girdileri.
- **RTL (\[R\]):** Arapça/Farsça için Tailwind mantıksal özellikler (`ms-`, `pe-`, `start-`) şimdiden kullanılır; `dir="rtl"` layout'ta; ikon yönleri (ok, breadcrumb) aynalanır; Arapça için uygun font (Noto Naskh/IBM Plex Arabic). Sağlık terminolojisi çevirisi uzman çevirmen gerektirir.
- **Biçimler:** `Intl.DateTimeFormat` / `NumberFormat` ile locale bazlı; saat dilimi her zaman `Europe/Istanbul` gösterilir; telefon `libphonenumber-js`.

### 11.2 Yönetim paneli

MVP'de geliştirilmez. Gerçek sürümde sıfırdan panel yazmak yerine **headless CMS'in admin arayüzü** (Payload) + randevu için HBYS'nin kendi ekranları önerilir; özel panel yalnız boşluklar için.

| İşlev                                   | Demoda gösterilebilir                              | Gerçek backend + yetkilendirme gerektirir                                  |
| --------------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------- |
| Doktor, bölüm, şube, çalışma saati CRUD | Mock verili salt-okunur tablo/form ekranları \[G\] | Evet                                                                       |
| Randevu yönetimi                        | Sahte randevu listesi (tamamen kurgusal) \[G\]     | Evet; özel nitelikli veri, en sıkı erişim kontrolü                         |
| Sağlık içeriği + onay akışı             | Durum geçişlerini gösteren mock ekran \[G\]        | Evet                                                                       |
| Duyuru/etkinlik, medya, kariyer         | —                                                  | Evet                                                                       |
| İletişim talepleri                      | —                                                  | Evet (kişisel veri)                                                        |
| Kullanıcı/rol yönetimi                  | Rol matrisi dokümanı                               | Evet: Admin, Editör, Tıbbi Gözden Geçiren, Hasta İlişkileri, Çağrı Merkezi |
| İşlem kayıtları                         | —                                                  | Evet: değişmez (append-only) audit log                                     |

### 11.3 Portfolyo değeri

| Unsur                                                                                   | Portfolyo katkısı                                                                                     | Gerçek hastane için operasyonel mi? |
| --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------- |
| Etkileyici ana sayfa + 3D kampüs                                                        | İlk izlenim, Three.js yetkinliği + performans disiplini (poster fallback, Lighthouse karşılaştırması) | Kısmen (kimlik)                     |
| Gerçekçi bilgi mimarisi + site haritası                                                 | Alan analizi yetkinliği                                                                               | Evet                                |
| Doktor/bölüm sayfaları, arama/filtre                                                    | URL state, SSG, yapısal veri                                                                          | Evet                                |
| Çalışan randevu sihirbazı                                                               | Karmaşık form, durum makinesi, a11y                                                                   | Akış evet, backend hayır            |
| Repository katmanı + mock/api ayrımı                                                    | Mimari olgunluk                                                                                       | Evet                                |
| Erişilebilirlik ve KVKK farkındalığı                                                    | Kurumsal müşteriler için ayırt edici                                                                  | Evet (zorunlu)                      |
| README, ADR'ler, kurulum, ekran görüntüleri, demo senaryoları, Lighthouse/axe raporları | Değerlendiricinin 5 dakikada anlaması                                                                 | Hayır (yalnız portfolyo)            |
| Test kapsamı + CI rozeti                                                                | Profesyonellik sinyali                                                                                | Evet                                |

Operasyonel olarak gerekli ama portfolyoda görünmeyecek işler (HBYS entegrasyonu, hukuk süreçleri, SLA, izleme) bilinçli olarak README'de "Gerçek üretim için yol haritası" bölümünde listelenir; bu, kapsamı bildiğinizi gösterir.

## 12. Aşamalı geliştirme yol haritası

MVP 9 aşamada (A0–A8) tamamlanır. Önerilen sıradan iki sapma var: (1) veri katmanı ve tasarım sistemi sayfalardan **önce** kurulur, böylece sayfalar ilk günden gerçek bileşen ve seed veriyle yazılır; (2) SEO, a11y ve test son aşamaya bırakılmaz, her aşamanın tamamlanma kriterine girer; A7 yalnız sertleştirme ve denetimdir. Tahmini süre tek kişi + Claude Code ile, günde 2–3 saat çalışmayla 6–9 hafta (varsayım; tempo bilgisi Açık sorularda).

| Aşama                         | Amaç                                                                                          | Bağımlılık | Zorluk      | Tahmini süre |
| ----------------------------- | --------------------------------------------------------------------------------------------- | ---------- | ----------- | ------------ |
| A0 Analiz ve tasarım          | Bu plan + karar kaydı + Açık soruların yanıtları                                              | —          | Düşük       | 1–2 gün      |
| A1 Altyapı ve tasarım sistemi | Proje iskeleti, token'lar, UI primitifleri, kalite araçları, CI                               | A0         | Orta        | 4–5 gün      |
| A2 Veri katmanı ve seed       | Domain tipleri, Zod şemaları, repository arayüzleri, mock uygulama, seed veri                 | A1         | Orta        | 3–4 gün      |
| A3 Layout ve ana sayfa        | Header, mega menü, mobil menü, footer, ana sayfa bölümleri (3D yerine poster)                 | A1, A2     | Orta        | 4–5 gün      |
| A4 Bölümler ve doktorlar      | Liste, filtre, detay, arama                                                                   | A2, A3     | Orta–yüksek | 5–6 gün      |
| A5 Randevu                    | Sihirbaz, slot üretimi, doğrulama, sonuç                                                      | A4         | Yüksek      | 5–7 gün      |
| A6 İçerik ve diğer sayfalar   | Sağlık rehberi, duyurular, hasta rehberi, lokasyon, iletişim, kurumsal, yasal, hata sayfaları | A3         | Orta        | 5–6 gün      |
| A7a 3D kampüs                 | Hero ve olanaklar sahnesi, fallback'ler                                                       | A3         | Yüksek      | 4–6 gün      |
| A7b Sertleştirme              | Güvenlik başlıkları, performans bütçeleri, a11y denetimi, E2E tamamlama                       | A4–A7a     | Orta        | 3–4 gün      |
| A8 Demo sunumu                | README, ekran görüntüleri, demo senaryoları, deploy                                           | A7b        | Düşük       | 2 gün        |

A6 ve A7a, A4/A5 ile paralel yürütülebilir (yalnız A3'e bağlılar).

### A0 — Analiz ve tasarım

- **Kapsam:** Bu doküman; Açık soruların yanıtlanması; `docs/` altında ADR (Architecture Decision Record) şablonu.
- **Çıktılar:** onaylanmış site haritası, tasarım token tablosu, MVP listesi.
- **Geçiş kontrolü:** CMS/i18n/barındırma/marka adı kararları verildi mi?

### A1 — Proje altyapısı ve tasarım sistemi

- **Kapsam:** Next.js + TS strict + Tailwind kurulumu; `tokens.css` (6.2); fontlar; ESLint (jsx-a11y, import sınırları), Prettier, Husky; Vitest + Playwright + axe iskeleti; GitHub Actions (lint, typecheck, test, build); `lib/env.ts`; güvenlik başlıkları temel sürüm; next-intl iskeleti (`tr`).
- **Bileşenler:** Button, IconButton, TextField, Select, Checkbox, RadioCard, Card (raised/inset varyant), Badge, DemoBadge, Alert, Skeleton, Dialog, Sheet, Tabs, Accordion, Breadcrumb, SkipLink, Container/Grid.
- **Teknik bağımlılıklar:** next, react, typescript, tailwindcss, next-intl, zod, react-hook-form, @radix-ui/\*, lucide-react, vitest, @testing-library/react, @playwright/test, @axe-core/playwright.
- **Tamamlanma:** `/_dev/ui` (yalnız dev ortamında) tüm bileşenleri tüm durumlarıyla gösterir; axe ihlali 0; CI yeşil; Vercel preview çalışır.
- **Geçiş kontrolü:** Kontrast oranları ölçüldü; odak halkası her bileşende görünür; neumorfik gölgeler token'dan geliyor (hard-coded yok).

### A2 — Veri katmanı ve seed

- **Kapsam:** `lib/data/types.ts` (8. bölüm), Zod şemaları, repository arayüzleri, mock uygulama, seed dosyaları (3 şube, 20 bölüm, 40–60 doktor, 12 makale), slot üretici saf fonksiyon (`generateSlots(schedule, exceptions, booked, range)`).
- **Tamamlanma:** Seed verisi build sırasında şemaya karşı doğrulanır (hatalı kayıt build'i kırar); slot üretici için birim testleri (hafta sonu, istisna, saat dilimi, geçmiş saat, DST yok varsayımı); referans bütünlüğü testi (her doctor.departmentId mevcut).
- **Geçiş kontrolü:** Sayfa kodu seed dosyasını doğrudan import etmiyor, yalnız repository üzerinden.

### A3 — Layout ve ana sayfa

- **Kapsam:** TopBar, SiteHeader (sticky), MegaMenu, MobileDrawer, MobileBottomBar, SiteFooter, ana sayfa 15 bölümü (4.A), hero'da 3D yerine poster görsel, GlobalSearchBox (bölüm/doktor otomatik tamamlama), çerez/demo banner'ı, `not-found`, `error`.
- **Tamamlanma:** 320 / 768 / 1024 / 1440 px'te görsel kontrol; klavyeyle mega menü ve mobil menü tam kullanılabilir; Lighthouse mobil Performance ≥ 90, a11y ≥ 95; ana sayfa metadata + `Hospital` JSON-LD.
- **Geçiş kontrolü:** Ana sayfadaki tüm linkler var olan veya planlanan route'a gidiyor (kırık link listesi tutulur).

### A4 — Bölümler ve doktorlar

- **Kapsam:** Bölüm listesi (grup + A–Z), bölüm detay şablonu, Acil Servis varyantı; doktor listesi (URL tabanlı filtreler, Türkçe normalize arama), doktor profili; `generateStaticParams`, `generateMetadata`, `Physician`/`MedicalClinic`/`FAQPage` JSON-LD; ilgili içerik blokları.
- **Tamamlanma:** 4.C–4.D gereksinimleri; filtre kombinasyonları URL'den geri yüklenir; boş sonuç durumu; E2E: "Nöroloji + İngilizce bilen doktor bul → profil → Randevu al butonu".
- **Geçiş kontrolü:** Randevu CTA'ları doğru query parametreleriyle `/randevu/yeni`'ye gidiyor.

### A5 — Randevu deneyimi

- **Kapsam:** Sihirbaz (5.2), `useReducer` durum makinesi, URL adım senkronu, sessionStorage kalıcılığı, Server Action (doğrula, demo kod üret, kaydetme), slot çakışma simülasyonu, `.ics` üretimi, sonuç ekranı.
- **Tamamlanma:** 3 giriş yolu (genel, bölümden, doktordan) E2E; tüm doğrulama hataları hem istemcide hem sunucuda test edilir (JS kapalıyken bile sunucu reddeder); klavye + ekran okuyucu ile tamamlanır; ağ sekmesinde kişisel veri içeren üçüncü taraf istek yok.
- **Geçiş kontrolü:** Sunucu loglarında form verisi görünmüyor; çift gönderim tek randevu üretir.

### A6 — İçerik ve diğer sayfalar

- **Kapsam:** Sağlık rehberi (MDX pipeline, kategori, etiket, ilgili makale, tıbbi uyarı, gözden geçiren bilgisi), duyurular, hasta rehberi (5 grup), lokasyon liste/detay (harita onayıyla), iletişim formu (honeypot, rate limit iskeleti), kurumsal sayfalar (MVP olanlar), yasal sayfalar, arama sonuçları.
- **Tamamlanma:** Her sayfa şablonu metadata + breadcrumb + JSON-LD; sitemap tüm SSG sayfaları içeriyor; iletişim formu E2E (başarı, doğrulama, rate limit).

### A7a — Three.js kampüs

- **Kapsam:** GLB model (veya prosedürel low-poly geometri ile başlangıç), `CampusScene` hero ve explore modları, bina listesi eşdeğeri, poster üretimi, cihaz/tercih algılama, Error Boundary.
- **Teknik bağımlılıklar:** three, @react-three/fiber, @react-three/drei; gltf-transform (CLI, build-time sıkıştırma).
- **Tamamlanma:** 9.2 bütçeleri; WebGL kapalı tarayıcıda poster + liste; reduced-motion test edildi; ana sayfa Lighthouse düşüşü ≤ 5 puan.

### A7b — SEO, güvenlik ve kalite sertleştirmesi

- **Kapsam:** CSP nonce, başlık denetimi (securityheaders.com A), Lighthouse CI bütçeleri, tüm route'larda axe taraması, manuel ekran okuyucu turu, cross-browser (Chrome, Firefox, Safari, iOS Safari, Android Chrome), kırık link taraması, `noindex` demo ayarı.
- **Tamamlanma:** 13. bölümdeki tüm kabul kriterleri yeşil.

### A8 — Son kontroller ve demo sunumu

- **Kapsam:** Demo içeriği gözden geçirme (gerçek kişi/kurum adı çakışması, lorem ipsum kalmaması), README (amaç, mimari diyagram, kurulum, komutlar, demo senaryoları, ekran görüntüleri/GIF, Lighthouse/axe sonuçları, "gerçek üretim için yol haritası", lisanslar), `docs/adr/*`, production deploy.
- **Tamamlanma:** Temiz klondan README talimatlarıyla 10 dakikada çalıştırılabiliyor; 3 demo senaryosu (doktor bul + randevu, acil lokasyon, makaleden randevu) 2 dakikalık videoda.

### Sonraki aşamalar (MVP sonrası)

- **G1:** EN dili, koyu tema, randevu sorgula/iptal, check-up, etkinlikler, kariyer, geri bildirim.
- **G2:** 2D/3D kat planları, anatomik model (tek bölüm), panel önizleme ekranları (mock), Turnstile + Redis rate limit.
- **R1 (gerçek hastane):** PostgreSQL + Payload CMS, `api` repository uygulaması, personel kimlik doğrulama, audit log, yurt içi barındırma; ardından HBYS randevu entegrasyonu ayrı proje olarak.

## 13. Kabul kriterleri ve test stratejisi

Bir modül, aşağıdaki **ortak kriterler** + kendi kriterleri sağlandığında tamamlanmış sayılır.

**Ortak kriterler (tüm modüller):** TypeScript ve ESLint hatasız · ilgili testler CI'da yeşil · axe kritik/ciddi ihlal 0 · 320–1440 px arası yatay taşma yok · klavyeyle tamamlanabilir · her sayfada tek H1, `generateMetadata`, canonical · hard-coded UI metni yok (i18n mesajı) · hard-coded renk/gölge yok (token) · loading, boş ve hata durumları tasarlanmış · demo rozetleri yerinde.

| Modül             | Kabul kriterleri                                                                                                                                                                                                                                                                                                                                                |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tasarım sistemi   | Tüm bileşenler tüm durumlarıyla `/_dev/ui`'da; metin kontrastı ≥ 4,5:1, UI sınırı ≥ 3:1 ölçüldü; odak halkası her etkileşimli öğede görünür; `prefers-contrast` ve `forced-colors` modunda kontroller ayırt edilebilir                                                                                                                                          |
| Layout/navigasyon | Mega menü Esc ile kapanır ve odağı tetikleyiciye döndürür; mobil çekmece odak tuzağı; aktif sayfa `aria-current`; acil hattı her sayfada ilk ekranda; skip link çalışır                                                                                                                                                                                         |
| Ana sayfa         | 15 bölüm 4.A'ya uygun; LCP öğesi metin veya poster; mobil Lighthouse Performance ≥ 85, CLS < 0,1; hero CTA'ları doğru hedefe gider                                                                                                                                                                                                                              |
| Bölümler          | MVP'deki 12+ bölüm tam içerikli, diğerleri kısa; detay sayfasında 10 blok (4.C); bölümden randevuya geçişte bölüm ön seçili; `MedicalClinic` + `FAQPage` JSON-LD geçerli (Rich Results Test)                                                                                                                                                                    |
| Doktorlar         | Arama aksan duyarsız; 4 filtre birlikte çalışır ve URL'de korunur; sonuç sayısı duyurulur; profil sekmeleri klavyeyle; her profilde demo rozeti; `Physician` JSON-LD                                                                                                                                                                                            |
| Randevu           | 8 adım tamamlanır; 3 giriş yolu çalışır; yalnız uygun slotlar seçilebilir; geçmiş tarih/saat seçilemez; sunucu doğrulaması istemciden bağımsız reddeder; geri tuşu ve yenileme durumu korur; slot çakışması senaryosu anlaşılır mesajla 4. adıma döner; sonuç ekranında `.ics` geçerli (takvime eklenir); hiçbir kişisel veri sunucuda saklanmaz veya loglanmaz |
| Sağlık rehberi    | Liste filtreleri ve sayfalama; detayda yazar, tıbbi gözden geçiren, tarih, kaynaklar ve tıbbi uyarı kutusu; yayınlanan her makalede reviewer zorunlu (seed doğrulaması); `MedicalWebPage` JSON-LD                                                                                                                                                               |
| Hasta rehberi     | 5 grup, içindekiler; SSS accordion klavyeyle; ulaşım/otopark/ziyaret saatleri lokasyon verisiyle tutarlı (tek kaynak)                                                                                                                                                                                                                                           |
| Lokasyon/iletişim | Harita kullanıcı onayı olmadan yüklenmez; `tel:` ve yol tarifi linkleri çalışır; form: doğrulama, honeypot, rate limit (6. istek reddedilir), başarı mesajı; KVKK aydınlatma linki                                                                                                                                                                              |
| 3D                | 9.2 bütçeleri (GLB ≤ 800 KB, ≤ 50 bin üçgen); WebGL yoksa poster + bina listesi; reduced-motion'da otomatik hareket yok; mobilde varsayılan poster; unmount sonrası bellek sızıntısı yok (3 kez gir-çık, heap sabit)                                                                                                                                            |
| SEO               | Sitemap tüm SSG sayfalarını içerir; demo deploy'da `noindex`; kırık iç link 0; her sayfada benzersiz title/description                                                                                                                                                                                                                                          |
| Güvenlik          | Güvenlik başlıkları mevcut (CSP, HSTS vb.); istemci paketinde gizli anahtar yok (build çıktısı taraması); `npm audit` yüksek/kritik 0; üçüncü taraf istekleri yalnız onay sonrası                                                                                                                                                                               |
| Demo sunumu       | README ile temiz kurulum ≤ 10 dk; ekran görüntüleri güncel; lorem ipsum yok; gerçek kişi/kurum adı çakışması kontrol edildi                                                                                                                                                                                                                                     |

### 13.1 Test stratejisi

| Test türü           | Araç                                                           | MVP önceliği               | Kapsam                                                                                           |
| ------------------- | -------------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------ |
| Birim               | Vitest                                                         | **Yüksek**                 | Slot üretici, filtre/arama normalizasyonu, Zod şemaları, tarih/saat yardımcıları, `.ics` üretici |
| Veri bütünlüğü      | Vitest                                                         | **Yüksek**                 | Seed şema doğrulaması, referans bütünlüğü, slug benzersizliği, her makalede reviewer             |
| Bileşen             | Testing Library + jest-axe                                     | Orta                       | Form alanları (hata bağlama), Combobox, StepIndicator, Dialog odak yönetimi                      |
| Form doğrulama      | Vitest (şema) + Playwright (UI)                                | **Yüksek**                 | Geçerli/geçersiz telefon, boş alan, uzun metin, beklenmeyen alan, JS kapalı sunucu reddi         |
| Entegrasyon         | Vitest                                                         | Orta                       | Repository mock uygulaması + Server Action birlikte                                              |
| Uçtan uca           | Playwright                                                     | **Yüksek** (kritik 4 akış) | Doktor bul → randevu; bölümden randevu; acil lokasyon; makaleden randevu; iletişim formu         |
| Erişilebilirlik     | @axe-core/playwright + manuel NVDA/VoiceOver                   | **Yüksek**                 | Tüm route şablonları, sihirbazın her adımı                                                       |
| Responsive          | Playwright viewport projeleri (iPhone SE, Pixel 7, iPad, 1440) | Orta                       | Ekran görüntüsü + taşma kontrolü                                                                 |
| Görsel regresyon    | Playwright `toHaveScreenshot`                                  | Düşük (\[G\])              | Ana sayfa, kart bileşenleri                                                                      |
| SEO                 | Playwright + özel script                                       | Orta                       | Title/description/canonical varlığı, JSON-LD parse, sitemap                                      |
| Performans          | Lighthouse CI                                                  | **Yüksek**                 | Ana sayfa, doktor listesi, bölüm detay, randevu; bütçe aşımı PR'ı kırar                          |
| Tarayıcı uyumluluğu | Playwright (Chromium, Firefox, WebKit)                         | Orta                       | Kritik E2E'ler üç motorda                                                                        |
| Hata ve boş durum   | Playwright + birim                                             | Orta                       | Boş filtre sonucu, 404, `error.tsx` (zorla hata), WebGL yok simülasyonu                          |

MVP'de kapsama yüzdesi hedefi konmaz; hedef "kritik akışlar ve saf mantık %100 testli" olur. Kapsama sayısı portfolyoda yanıltıcı olabilir.

## 14. Claude Code uygulama talimatları

12 sıralı görev; her biri tek oturumda bitirilebilecek büyüklükte ve kendi tamamlanma kriteriyle. Kullanım: önce T00 ile repoya `CLAUDE.md` + bu planın özetini (`docs/plan.md`) koyun; sonraki her görevde Claude Code bu dosyaları okur. Her görevi ayrı branch'te çalıştırıp PR ile birleştirmek, regresyonu görmeyi kolaylaştırır. Her prompt'un sonunda "Önce planını göster, onayımdan sonra uygula" ifadesi bilinçli olarak var: Claude Code'un plan modunu kullanmak, büyük görevlerde kapsam kaymasını önler.

| Görev | Konu                                                | Bağımlılık | Plan aşaması |
| ----- | --------------------------------------------------- | ---------- | ------------ |
| T00   | CLAUDE.md ve plan dokümanı                          | —          | A0           |
| T01   | Proje iskeleti ve kalite araçları                   | T00        | A1           |
| T02   | Tasarım token'ları ve UI primitifleri               | T01        | A1           |
| T03   | Veri modeli, şemalar, repository, seed              | T01        | A2           |
| T04   | Layout: header, menüler, footer                     | T02        | A3           |
| T05   | Ana sayfa                                           | T03, T04   | A3           |
| T06   | Tıbbi birimler                                      | T03, T04   | A4           |
| T07   | Doktorlar                                           | T03, T04   | A4           |
| T08   | Randevu sihirbazı                                   | T06, T07   | A5           |
| T09   | İçerik, rehber, lokasyon, iletişim, kurumsal, yasal | T03, T04   | A6           |
| T10   | 3D kampüs sahnesi                                   | T05        | A7a          |
| T11   | Sertleştirme: güvenlik, SEO, performans, a11y       | T05–T10    | A7b          |
| T12   | README, dokümantasyon, demo hazırlığı               | T11        | A8           |

### T00 — CLAUDE.md ve plan

```text
HEDEF: Bu repoda çalışan her Claude Code oturumunun uyacağı kuralları ve proje planını dosyalara yaz.
KAPSAM: Yalnız doküman. Kod yazma, paket kurma.
DEĞİŞTİRİLEBİLİR: CLAUDE.md, docs/plan.md, docs/adr/0000-template.md, docs/adr/0001-*.md
CLAUDE.md İÇERİĞİ:
- Proje: kurgusal "Özel Şifa Hastanesi" demo sitesi; gerçek kişisel/sağlık verisi asla toplanmaz, saklanmaz, loglanmaz.
- Stack: Next.js App Router, TypeScript strict, Tailwind + CSS token'ları, next-intl, Zod + React Hook Form, Radix, Lucide, R3F (yalnız features/scene3d).
- Klasör yapısı ve import kuralları (docs/plan.md 7.2).
- Varsayılan Server Component; "use client" yalnız etkileşim yaprağında.
- Sayfalar veriye yalnız lib/data repository'leri üzerinden erişir.
- Renk/gölge/boşluk yalnız token'dan; UI metni yalnız messages/*.json'dan.
- Her değişiklikte: pnpm lint, pnpm typecheck, pnpm test çalıştır, yeşil olmadan bitti deme.
- Erişilebilirlik hedefi WCAG 2.2 AA; neumorfik gölge tek başına sınır/durum taşımaz.
ADR 0001: CMS yok, MVP'de TS/MDX seed (gerekçe: plan 7.1).
TAMAMLANMA: Dosyalar mevcut; docs/plan.md site haritası, MVP listesi ve kabul kriterlerini içeriyor.
```

### T01 — Proje iskeleti ve kalite araçları

```text
HEDEF: Boş ama üretim kalitesinde Next.js iskeleti.
BAĞIMLILIK: T00. CLAUDE.md'yi oku.
KAPSAM:
- create-next-app (TS, App Router, Tailwind, src/, ESLint), paket yöneticisi pnpm, Node LTS sürümü .nvmrc'de.
- tsconfig: strict, noUncheckedIndexedAccess, @/ alias.
- ESLint: next, jsx-a11y, import sınırları (features/* dışarıdan yalnız index.ts; three yalnız features/scene3d). Prettier + tailwind eklentisi.
- Husky + lint-staged.
- Vitest + Testing Library + jest-axe; Playwright + @axe-core/playwright, tek örnek test.
- next-intl: app/[locale] (yalnız "tr"), messages/tr.json, middleware.
- lib/env.ts (Zod; NEXT_PUBLIC_SITE_URL, DATA_SOURCE, DEMO_MODE), .env.example.
- next.config: temel güvenlik başlıkları (HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, frame-ancestors). CSP T11'de.
- GitHub Actions: install, lint, typecheck, test, build, playwright.
- scripts: dev, build, lint, typecheck, test, test:e2e.
DEĞİŞTİRİLEMEZ: CLAUDE.md, docs/.
TAMAMLANMA: pnpm build ve tüm scriptler yeşil; / ve /tr çalışır; CI dosyası hazır; README'de kurulum adımları taslak.
Önce planını göster, onayımdan sonra uygula.
```

### T02 — Tasarım token'ları ve UI primitifleri

```text
HEDEF: Soft-neumorfik tasarım sistemi (docs/plan.md bölüm 6).
BAĞIMLILIK: T01.
KAPSAM:
- src/styles/tokens.css: 6.2 tablosundaki renkler, gölgeler (raised, inset, raised-sm), radius, boşluk, tip ölçeği (clamp), hareket süreleri. Tailwind teması bu değişkenlere bağlı.
- prefers-reduced-motion, prefers-contrast: more, forced-colors kuralları.
- next/font ile başlık serif + gövde sans (latin-ext).
- components/ui: Button (primary, secondary-neu, ghost, danger; loading), IconButton, TextField, Select, Checkbox, RadioCard, Textarea, FieldError, FormErrorSummary, Card (raised|inset), Badge, DemoBadge, Alert, Skeleton, Spinner, Dialog, Sheet, Tabs, Accordion, Breadcrumb, Pagination, StepIndicator, SkipLink, Container. Radix primitifleri kullan.
- app/[locale]/_dev/ui/page.tsx: tüm bileşenler tüm durumlarıyla; production build'de 404.
- Her bileşen için jest-axe testi; Button ve TextField için davranış testi.
KURALLAR: Etkileşimli her öğede ≥3:1 kenarlık veya dolgu; odak halkası 2px + offset; renk değerleri yalnız tokens.css'te.
TAMAMLANMA: _dev/ui sayfasında axe ihlali 0; kontrast oranlarını README'deki tabloda listele; testler yeşil.
Önce planını göster, onayımdan sonra uygula.
```

### T03 — Veri modeli, şemalar, repository, seed

```text
HEDEF: Sayfaların tek veri kaynağı olan tip güvenli katman (docs/plan.md bölüm 8).
BAĞIMLILIK: T01.
KAPSAM:
- src/lib/data/types.ts: 8.1 katalog modelleri + Appointment tipi (yalnız tip). LocalizedText.
- Her model için Zod şeması; seed build anında doğrulanır.
- repositories.ts arayüzleri: BranchRepo, DepartmentRepo, DoctorRepo (list(filter), getBySlug), ArticleRepo, AnnouncementRepo, FaqRepo, InsuranceRepo, AppointmentService (getSlots, createDemo).
- lib/data/mock: seed dosyalarından okuyan uygulama; lib/data/index.ts DATA_SOURCE'a göre seçer (api için boş, "not implemented" fırlatan stub).
- content/seed: 3 şube, 20 bölüm (plan 4.C grupları), 48 doktor, 8 sigorta, 6 duyuru, FAQ'lar. Doktorları sabit tohumlu faker (tr) ile bir kez üretip dosyaya yaz; isimler kurgusal, e-postalar .example alan adında, telefonlar açıkça kurgusal.
- lib/data/slots.ts: generateSlots(schedules, exceptions, booked, from, days) saf fonksiyon, Europe/Istanbul.
- Arama normalizasyonu: normalizeTr("Şükrü") === "sukru".
TESTLER: slot üretici (hafta sonu, istisna, geçmiş saat, dolu slot), referans bütünlüğü, slug benzersizliği, normalizeTr.
DEĞİŞTİRİLEBİLİR: src/lib/data/**, src/content/**, tests/unit/**.
TAMAMLANMA: Testler yeşil; hatalı seed kaydı build'i kırıyor (bir testle kanıtla).
Önce planını göster, onayımdan sonra uygula.
```

### T04 — Layout: header, menüler, footer

```text
HEDEF: Global site kabuğu (plan 6.6, 3 "Global").
BAĞIMLILIK: T02 (T03 varsa menü bölüm listesini repository'den al).
KAPSAM: TopBar (acil hattı tel: link, çağrı merkezi, demo uyarısı), SiteHeader (sticky, scroll'da küçülme), MegaMenu (tıklamayla açılır, Esc, odak iadesi; Tıbbi Birimler gruplu), MobileDrawer, MobileBottomBar (Ara, Randevu, Konum), SiteFooter (4 kolon + yasal + demo bildirimi + sosyal ikonlar aria-label'lı), SkipLink, (site) ve (flow) route grup layout'ları, not-found.tsx, error.tsx, loading.tsx.
TESTLER: Playwright: klavyeyle mega menü aç/kapa, mobil çekmece odak tuzağı, axe.
TAMAMLANMA: 320/768/1024/1440 px ekran görüntüleri (tests/e2e/__screens__); ortak kabul kriterleri (plan 13).
Önce planını göster, onayımdan sonra uygula.
```

### T05 — Ana sayfa

```text
HEDEF: Plan 4.A'daki 15 bölüm.
BAĞIMLILIK: T03, T04.
KAPSAM: Hero (serif başlık, Randevu Al + Doktor Bul, sağda poster görsel; 3D T10'da gelecek, yerini HeroVisual slotu olarak bırak), QuickActions (neumorfik dairesel), GlobalSearchBox (ARIA combobox; doktor/bölüm/hastalık gruplu öneriler, repository'den), öne çıkan bölümler, doktorlar carousel'i (otomatik kayma yok), StatsStrip, teknoloji, check-up özeti (yer tutucu link), makaleler, duyurular, hasta bilgi kartları, lokasyon kartları (statik harita görseli), footer.
KURALLAR: Ana sayfada kişisel veri formu yok. Kişi görselleri illustrasyon/avatar. Hero LCP öğesi priority.
SEO: metadata, Hospital JSON-LD.
TAMAMLANMA: Lighthouse mobil Performance ≥ 90, a11y ≥ 95, CLS < 0,1; tüm linkler var olan route'a veya plan listesinde olan route'a gidiyor (eksikleri docs/missing-routes.md'ye yaz).
Önce planını göster, onayımdan sonra uygula.
```

### T06 — Tıbbi birimler

```text
HEDEF: Bölüm listesi ve ortak bölüm detay şablonu (plan 4.C).
BAĞIMLILIK: T03, T04.
KAPSAM: /tibbi-birimler (grup görünümü + A–Z + arama), /tibbi-birimler/[slug] (10 blok: breadcrumb/başlık/CTA, sayfa içi menü, hizmetler, tanı-tedavi, teknolojiler, doktorlar, konum, SSS, ilgili yazılar, sticky randevu kartı), Acil Servis varyantı (telefon+konum önde, randevu CTA yok). generateStaticParams, generateMetadata, MedicalClinic + FAQPage + BreadcrumbList JSON-LD (components/seo/JsonLd).
Randevu CTA hedefi: /randevu/yeni?bolum=<slug>.
TESTLER: E2E liste→detay→CTA URL; axe; JSON-LD parse testi.
TAMAMLANMA: Plan 13 "Bölümler" satırı.
Önce planını göster, onayımdan sonra uygula.
```

### T07 — Doktorlar

```text
HEDEF: Doktor keşfi (plan 4.D, 5.1).
BAĞIMLILIK: T03, T04.
KAPSAM: /doktorlar: arama (normalizeTr), filtreler bölüm/uzmanlık/şube/dil; URL search params'ta; masaüstü yan panel, mobil Sheet; sonuç sayısı aria-live; boş durum; sayfalama veya "daha fazla". Filtreli URL'lerde canonical filtresiz listeye.
/doktorlar/[slug]: üst blok, sekmeler (Hakkında, Eğitim zaman çizelgesi, Deneyim, İlgi alanları), haftalık çalışma tablosu (DoctorSchedule'dan, şubeye göre), makaleleri, aynı bölümden doktorlar, DemoBadge, Physician JSON-LD. Pasif doktor → bölüme yönlendiren bilgi.
DoctorCard: avatar, unvan+ad, bölüm, 2-3 ilgi alanı, şube, dil kodları, Profil + Randevu linkleri. Puan/yorum YOK.
TESTLER: filtre mantığı birim; E2E "Nöroloji + EN → profil → Randevu al" URL'si doktor+bölüm+şube içeriyor; axe.
TAMAMLANMA: Plan 13 "Doktorlar" satırı.
Önce planını göster, onayımdan sonra uygula.
```

### T08 — Randevu sihirbazı

```text
HEDEF: Plan 5.2'deki 8 adımlı, tamamen simüle randevu akışı.
BAĞIMLILIK: T06, T07.
KAPSAM: app/[locale]/(flow)/randevu/yeni. useReducer durum makinesi; adım ?adim= ile URL'de; sessionStorage kalıcılığı (kişisel alanlar HARİÇ — yalnız seçimler); query ile ön seçim (bolum, doktor, sube). Adımlar: şube → bölüm → doktor ("fark etmez" dahil) → 14 günlük tarih şeridi + slot grid (AppointmentService.getSlots) → kişi bilgileri (ad, soyad, telefon, e-posta opsiyonel, doğum yılı; TC/şikayet YOK) → özet (Değiştir linkleri) → onay → sonuç (demo kodu, .ics indir, yol tarifi).
Sunucu: features/appointments/actions.ts Server Action; aynı Zod şeması; DEMO_MODE'da hiçbir veri saklanmaz/loglanmaz; %5 olasılıkla slot-doldu hatası (test için env ile deterministik kapatılabilir); idempotency anahtarı ile çift gönderim tek sonuç.
A11Y: adım değişiminde odak başlığa; aria-current="step"; hata özeti; autocomplete öznitelikleri; 44px hedefler.
TESTLER: slot/şema birim; E2E 3 giriş yolu, doğrulama hataları, slot çakışması, geri tuşu/yenileme, JS kapalıyken sunucu reddi; axe her adımda; .ics içeriği doğrulaması.
TAMAMLANMA: Plan 13 "Randevu" satırı.
Önce planını göster, onayımdan sonra uygula.
```

### T09 — İçerik ve diğer sayfalar

```text
HEDEF: Plan 3'teki [M] etiketli kalan tüm sayfalar.
BAĞIMLILIK: T03, T04. T08 ile paralel yürütülebilir.
KAPSAM:
- Sağlık rehberi: MDX pipeline (Velite veya content-collections, şema doğrulamalı), liste/kategori/etiket/sayfalama, detay (yazar, tıbbi gözden geçiren, tarih, kaynaklar, tıbbi uyarı Callout, içindekiler, ilgili bölüm/doktor/makale), MedicalWebPage JSON-LD. 12 kurgusal, zararsız, ilaç/doz içermeyen makale.
- Duyurular liste/detay.
- Hasta rehberi: 5 grup (plan 4.F), Bilgi sayfası şablonu, SSS.
- Lokasyonlar liste/detay: "bana en yakın" (izinli, istemcide), harita onay sonrası yüklenir (önce statik görsel), tel: ve yol tarifi derin linkleri.
- İletişim: konu seçmeli form, Server Action, honeypot + min süre + bellek içi rate limit (5/10dk/IP), sağlık bilgisi yazmama uyarısı, KVKK aydınlatma linki.
- Kurumsal: Hakkımızda, Olanaklar (3D slotu), Anlaşmalı Kurumlar (aranabilir).
- Yasal: KVKK, gizlilik, çerez, kullanım koşulları, erişilebilirlik bildirimi, demo hakkında. Her birinde "şablon metin, hukuki geçerliliği yoktur" notu.
- /arama: build-time indeks (MiniSearch) ile doktor/bölüm/makale/sayfa.
- app/sitemap.ts, app/robots.ts (DEMO_MODE'da noindex).
TAMAMLANMA: Plan 13 ilgili satırlar; kırık iç link 0 (script ile).
Önce planını göster, onayımdan sonra uygula.
```

### T10 — 3D kampüs sahnesi

```text
HEDEF: Plan 9'daki tek 3D deneyim.
BAĞIMLILIK: T05 (hero slotu), T09 (olanaklar sayfası).
KAPSAM: features/scene3d. three + @react-three/fiber + @react-three/drei. CampusScene mode="hero"|"explore".
- Model: önce prosedürel low-poly bloklarla (3-5 bina, giriş, acil kapısı, otopark, ağaç) başla; GLB eklenirse gltf-transform ile Draco/Meshopt, ≤800KB, ≤50k üçgen. Neumorfik palete uygun mat materyaller.
- Bina meta verisi JSON (ad, ilgili sayfa, açıklama); explore modunda tıkla→yan panel; aynı seçim HTML bina listesinden de.
- next/dynamic ssr:false + IntersectionObserver + idle yükleme; önce AVIF poster.
- dpr [1,1.5], frameloop="demand", PerformanceMonitor ile kalite düşürme, sekme gizliyken dur, dispose.
- Fallback: <768px, deviceMemory<4, saveData, WebGL2 yok, context lost → poster + liste; "3D'yi aç" butonu.
- reduced-motion: otomatik dönme yok; otomatik dönmede duraklat butonu. Canvas aria-hidden.
- Error Boundary.
TESTLER: Playwright WebGL devre dışı bağlamda fallback; reduced-motion emulation; Lighthouse ana sayfa önce/sonra karşılaştırmasını docs/perf-3d.md'ye yaz.
TAMAMLANMA: Plan 13 "3D" satırı; Lighthouse düşüşü ≤ 5 puan, değilse hero'da varsayılan poster moduna geç.
Önce planını göster, onayımdan sonra uygula.
```

### T11 — Sertleştirme

```text
HEDEF: Güvenlik, SEO, performans ve erişilebilirlik denetimi ve düzeltmeleri (plan 10, 13).
BAĞIMLILIK: T05–T10.
KAPSAM: Middleware ile nonce tabanlı CSP; başlıkların doğrulama testi; build çıktısında gizli anahtar taraması; npm audit; Lighthouse CI (lighthouserc: ana sayfa, doktor listesi, bölüm detay, randevu; bütçeler plan 10.4); tüm route şablonlarında axe; Playwright projeleri Chromium/Firefox/WebKit + mobil viewport; JSON-LD ve metadata varlık testleri; kırık link taraması; bundle analyzer raporu.
MANUEL: NVDA+Firefox ve VoiceOver+Safari ile randevu akışı — bulguları docs/a11y-audit.md'ye yaz.
KURAL: Test atlama/devre dışı bırakma yok; bir hedef tutturulamıyorsa nedenini docs'ta belgele ve bana sor.
TAMAMLANMA: Plan 13'teki tüm satırlar yeşil; rapor dosyaları mevcut.
Önce planını göster, onayımdan sonra uygula.
```

### T12 — Dokümantasyon ve demo

```text
HEDEF: Portfolyoya hazır teslim.
BAĞIMLILIK: T11.
KAPSAM: README (amaç, canlı demo linki, ekran görüntüleri, mimari diyagram (Mermaid), teknoloji kararları ve gerekçeleri, klasör yapısı, kurulum ve komutlar, test ve kalite sonuçları, demo senaryoları, demo/gerçek farkı ve "gerçek üretim için yol haritası", lisanslar ve asset kaynakları, kurgusal içerik bildirimi). docs/adr güncel. Demo içerik taraması: lorem ipsum, gerçek kişi/kurum adı, gerçek telefon/e-posta kalıbı araması (script). Playwright ile ekran görüntüsü üretme scripti.
TAMAMLANMA: Temiz klondan README ile ≤ 10 dk'da çalışıyor; tarama scripti temiz.
Önce planını göster, onayımdan sonra uygula.
```

## Açık sorular

Aşağıdakiler A1'e geçmeden yanıtlanmalı; parantez içindeki, yanıt gelmezse planın varsayılanıdır.

- [ ] **Marka adı:** "Özel Şifa Hastanesi" Türkiye'de gerçek kurumlarca kullanılan bir ad olabilir. Kurgusal ve benzersiz bir ad mı seçelim? (Varsayılan: ad korunur, "Demo" ibaresi her sayfada.)
- [ ] **Yayın ve indeksleme:** Demo herkese açık URL'de mi yayınlanacak, arama motorlarında görünmesi istenir mi? (Varsayılan: açık URL, `noindex`.)
- [ ] **Kişi görselleri:** Doktorlar için illustrasyon/avatar mı, lisanslı stok fotoğraf mı? Referans görseldeki AI üretimi foto-gerçekçi yüzler kullanılacak mı? (Varsayılan: illustrasyon.)
- [ ] **Neumorfizm yoğunluğu:** Plan "soft neumorfizm" öneriyor (6.1). Referanstaki gibi tam neumorfik bir görünüm öncelikliyse erişilebilirlik hedefi (WCAG AA) ile çatışan noktaları hangi tarafta çözelim? (Varsayılan: erişilebilirlik öncelikli.)
- [ ] **İngilizce:** EN MVP'ye mi girsin, genişletilmiş demoya mı? (Varsayılan: altyapı MVP'de, çeviri genişletilmişte.)
- [ ] **3D model kaynağı:** Blender ile model üretebiliyor musunuz, yoksa prosedürel low-poly + CC0 asset mi? (Varsayılan: prosedürel başlangıç.)
- [ ] **Barındırma ve alan adı:** Vercel uygun mu, özel alan adı olacak mı? (Varsayılan: Vercel alt alan adı.)
- [ ] **Çalışma temposu:** Haftada kaç saat ayrılabilecek? Yol haritasındaki 6–9 hafta günde 2–3 saat varsayımına dayanıyor.
- [ ] **Paket yöneticisi ve Node sürümü:** pnpm + Node LTS uygun mu? (Varsayılan: evet.)
- [ ] **Gerçek hastane hedefi:** Gelecekte belirli bir kurum (kamu/özel) için mi düşünülüyor? MHRS, HBYS sağlayıcısı ve barındırma (yurt içi) kararlarını doğrudan etkiler. Demo için karar gerekmez.
- [ ] **E-Sonuç:** Referanstaki "E-Sonuç" butonu kalmalı mı? Plan onu yalnız bilgilendirme sayfasına bağlıyor; sahte sonuç ekranı önerilmiyor.
- [ ] **Hasta yorumları/puanlar:** Portfolyo için istenebilir ama sağlık tanıtım mevzuatı açısından riskli; plan dışında bırakıyor. Onay?

---

Referans: proje klasöründeki `Gemini_Generated_Image_fdyduffdyduffdyd.jfif`, `index.html`, `style.css` (2026-10-25 itibarıyla incelendi). Kontrast oranları WCAG 2.x göreceli parlaklık formülüyle hesaplandı; görselden alınan renkler JPEG sıkıştırması nedeniyle yaklaşıktır. Mevzuat atıfları bu oturumda kaynaktan doğrulanmadı; gerçek sürümde hukuk incelemesi gerekir.
