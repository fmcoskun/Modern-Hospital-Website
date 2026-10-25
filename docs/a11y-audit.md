# Erişilebilirlik denetimi (T11)

Hedef: WCAG 2.2 AA. Tarih: 2026-10-25.

## Otomatik denetim (her CI çalışmasında)

| Kapsam                                          | Araç                                   | Sonuç                                            |
| ----------------------------------------------- | -------------------------------------- | ------------------------------------------------ |
| 26 sayfa şablonu, masaüstü + Pixel 7            | Playwright + axe (wcag2a/aa, 2.1, 2.2) | Ciddi/kritik ihlal 0                             |
| Randevu sihirbazı özet adımı                    | axe                                    | İhlal 0                                          |
| Ana sayfa, doktor listesi, bölüm detay, randevu | Lighthouse a11y (mobil)                | 100                                              |
| Renk kontrastı (21 token çifti)                 | Vitest, WCAG formülü                   | Metin ≥ 4,5:1, kontrol sınırı ve odak ≥ 3:1      |
| 126 sayfa (sitemap)                             | Playwright                             | Her sayfada tek H1; benzersiz başlık ve açıklama |
| Yatay taşma 320–1440 px                         | Playwright (mobil + masaüstü)          | Taşma yok                                        |

## Klavye ve davranış testleri (E2E)

- Skip link ilk Tab'da odak alır ve içeriğe atlar (Safari'de Tab linklere varsayılan olarak gitmediği için WebKit'te odak doğrudan verilerek test edilir).
- Mega menü tıklamayla açılır, Esc kapatır ve odağı tetikleyiciye döndürür.
- Global arama ARIA combobox: ok tuşları, `aria-activedescendant`, Enter ile seçim.
- Randevu sihirbazı: adım değişiminde odak başlığa; boş gönderimde hata özeti odak alır; geri tuşu ve yenileme durumu korur.
- İletişim formu: hata özeti odak alır.
- 3D: canvas `aria-hidden`; otomatik dönme durdurulabilir (WCAG 2.2.2); hareket azaltmada dönme yok; bina listesi klavyeyle tam kullanılabilir.
- Kritik akışlar Chromium, Firefox, WebKit (masaüstü) ve iPhone 13 (mobil Safari) üzerinde çalışır.

## Manuel ekran okuyucu turu — YAPILMADI

Plan T11, NVDA + Firefox ve VoiceOver + Safari ile randevu akışının manuel denetimini istiyor. Bu oturumda gerçek ekran okuyucu kullanılamadığı için **yapılmadı**. Önerilen kontrol listesi:

1. Ana sayfada başlık gezinmesi (H tuşu): H1 → bölüm başlıkları sırası anlamlı mı?
2. Randevu sihirbazı: her adım değişiminde başlık okunuyor mu; adım göstergesindeki "geçerli adım" duyuruluyor mu?
3. Tarih/saat adımı: gün butonlarında "Uygun saat yok" ve seçili durum (basılı) okunuyor mu?
4. Kişi bilgileri: hata özeti ve satır içi hatalar alanla ilişkili okunuyor mu (`aria-describedby`)?
5. Doktor listesi: filtre değişince "N doktor bulundu" duyuruluyor mu?
6. Global arama: öneri sayısı ve grup başlıkları okunuyor mu?

Bulgular bu dosyaya eklenmelidir.
