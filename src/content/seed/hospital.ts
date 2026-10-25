import type { Branch, Hospital } from "@/lib/data/types";

export const hospital: Hospital = {
  name: "ÖZEL FMC HASTANESİ",
  shortName: "FMC Hastanesi",
  legalName: "FMC Sağlık Hizmetleri A.Ş. (kurgusal)",
  callCenterPhone: "0 (850) 000 03 62",
  emergencyPhone: "0 (850) 000 01 12",
  email: "iletisim@fmc-hastanesi.example",
  kepAddress: "fmcsaglik@hs01.kep.example",
  socialLinks: [
    { network: "Instagram", url: "https://instagram.com/" },
    { network: "LinkedIn", url: "https://linkedin.com/" },
    { network: "YouTube", url: "https://youtube.com/" },
    { network: "X", url: "https://x.com/" },
  ],
  stats: { beds: 320, physicians: 48, founded: 2004, branches: 3 },
  visiting: {
    wards: "Her gün 13:00–20:00",
    icu: "Her gün 13:00–14:00, aynı anda tek ziyaretçi",
    companionNote:
      "Her hasta için bir refakatçi kabul edilir; refakat kartı hasta kabul biriminden alınır.",
  },
};

const weekdays = [1, 2, 3, 4, 5];

export const branches: Branch[] = [
  {
    id: "br-merkez",
    slug: "merkez-kampus",
    status: "published",
    isDemo: true,
    name: { tr: "Merkez Kampüs", en: "Main Campus" },
    district: "Ataşehir",
    city: "İstanbul",
    address: "Örnek Mah. Şifa Cad. No: 1 (kurgusal adres)",
    postalCode: "34000",
    geo: { lat: 40.9923, lng: 29.1244 },
    phone: "0 (850) 000 10 00",
    openingHours: [
      { days: weekdays, opens: "08:00", closes: "20:00" },
      { days: [6], opens: "09:00", closes: "15:00" },
    ],
    hasEmergency: true,
    transport: [
      "Metro: M4 hattı, Örnek istasyonu (5 dk yürüme)",
      "Otobüs: 14Ö, 19D duraklar ana kapının önünde",
      "Ücretsiz servis: metro istasyonundan her 15 dakikada bir",
    ],
    parking: "Kapalı otopark, 400 araç; ilk 2 saat hasta ve ziyaretçilere ücretsiz.",
    accessibility: [
      "Engelli otopark alanları giriş katında",
      "Tüm katlara asansör ve rampa erişimi",
      "Tekerlekli sandalye ödünç noktası danışmada",
      "İşitme cihazı uyumlu indüksiyon döngüsü vezne ve danışmada",
    ],
  },
  {
    id: "br-kadikoy",
    slug: "kadikoy",
    status: "published",
    isDemo: true,
    name: { tr: "Kadıköy Hastanesi", en: "Kadıköy Hospital" },
    district: "Kadıköy",
    city: "İstanbul",
    address: "Deneme Mah. Sağlık Sok. No: 12 (kurgusal adres)",
    postalCode: "34700",
    geo: { lat: 40.9905, lng: 29.0275 },
    phone: "0 (850) 000 20 00",
    openingHours: [
      { days: weekdays, opens: "08:30", closes: "19:00" },
      { days: [6], opens: "09:00", closes: "14:00" },
    ],
    hasEmergency: true,
    transport: [
      "Marmaray: Örnek durağı (8 dk yürüme)",
      "Vapur: iskeleden 10 dakikalık ücretsiz servis",
    ],
    parking: "Açık otopark, 120 araç; vale hizmeti mevcuttur.",
    accessibility: ["Giriş rampası ve otomatik kapı", "Asansörlerde Braille butonlar"],
  },
  {
    id: "br-bakirkoy",
    slug: "bakirkoy-tip-merkezi",
    status: "published",
    isDemo: true,
    name: { tr: "Bakırköy Tıp Merkezi", en: "Bakırköy Medical Center" },
    district: "Bakırköy",
    city: "İstanbul",
    address: "Model Mah. Kardelen Cad. No: 7 (kurgusal adres)",
    postalCode: "34140",
    geo: { lat: 40.9819, lng: 28.8772 },
    phone: "0 (850) 000 30 00",
    openingHours: [{ days: weekdays, opens: "09:00", closes: "18:00" }],
    hasEmergency: false,
    transport: ["Metro: M1A hattı, Örnek istasyonu (3 dk yürüme)"],
    parking: "Bina altında 60 araçlık otopark.",
    accessibility: ["Giriş katında poliklinikler", "Engelli tuvaleti her katta"],
  },
];
