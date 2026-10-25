import type { Doctor, DoctorSchedule, ScheduleException } from "@/lib/data/types";
import { departments } from "./departments";

/**
 * 48 kurgusal hekim. İsimler yaygın ad/soyad listelerinden elle birleştirildi; gerçek bir hekimi
 * temsil etmez. Biyografi, eğitim ve program alanları aşağıdaki deterministik şablonlardan üretilir.
 */
type Row = [
  title: Doctor["title"],
  firstName: string,
  lastName: string,
  gender: Doctor["gender"],
  departmentId: string,
  languages: string,
  interests: string[],
  featured?: boolean,
];

const rows: Row[] = [
  [
    "Prof. Dr.",
    "Ayşe",
    "Karaca",
    "f",
    "d-kardiyoloji",
    "tr,en",
    ["Kalp yetmezliği", "Ekokardiyografi", "Hipertansiyon"],
    true,
  ],
  [
    "Uzm. Dr.",
    "Mehmet",
    "Yıldırım",
    "m",
    "d-kardiyoloji",
    "tr",
    ["Ritim bozuklukları", "Holter değerlendirmesi"],
  ],
  [
    "Doç. Dr.",
    "Selin",
    "Aydemir",
    "f",
    "d-kardiyoloji",
    "tr,de",
    ["Koruyucu kardiyoloji", "Kolesterol yönetimi"],
  ],
  [
    "Uzm. Dr.",
    "Kerem",
    "Demirtaş",
    "m",
    "d-kardiyoloji",
    "tr,en",
    ["Koroner arter hastalığı", "Efor testi"],
  ],
  [
    "Prof. Dr.",
    "Şükrü",
    "Erdem",
    "m",
    "d-noroloji",
    "tr,en",
    ["Migren", "Baş ağrısı", "Botulinum toksini"],
    true,
  ],
  ["Uzm. Dr.", "Elif", "Kuzu", "f", "d-noroloji", "tr,en", ["Epilepsi", "EEG"]],
  [
    "Doç. Dr.",
    "Burak",
    "Şen",
    "m",
    "d-noroloji",
    "tr",
    ["Parkinson hastalığı", "Hareket bozuklukları"],
  ],
  [
    "Uzm. Dr.",
    "Gülşen",
    "Öztürk",
    "f",
    "d-noroloji",
    "tr,fr",
    ["Multipl skleroz", "Bellek bozuklukları"],
  ],
  ["Uzm. Dr.", "Ahmet", "Çelik", "m", "d-ic-hastaliklari", "tr,en", ["Diyabet", "Obezite"]],
  [
    "Doç. Dr.",
    "Zeynep",
    "Arslan",
    "f",
    "d-ic-hastaliklari",
    "tr,en",
    ["Tiroid hastalıkları", "Check-up değerlendirmesi"],
    true,
  ],
  [
    "Uzm. Dr.",
    "Hakan",
    "Koç",
    "m",
    "d-ic-hastaliklari",
    "tr",
    ["Hipertansiyon", "Kronik böbrek hastalığı"],
  ],
  ["Uzm. Dr.", "Derya", "Polat", "f", "d-ic-hastaliklari", "tr,ar", ["Kansızlık", "Yaşlı sağlığı"]],
  ["Prof. Dr.", "Orhan", "Aksoy", "m", "d-gogus", "tr,en", ["KOAH", "Uyku apnesi"]],
  ["Uzm. Dr.", "Nazlı", "Tekin", "f", "d-gogus", "tr", ["Astım", "Alerjik solunum hastalıkları"]],
  ["Uzm. Dr.", "İpek", "Yalçın", "f", "d-dermatoloji", "tr,en", ["Akne", "Dijital dermatoskopi"]],
  ["Doç. Dr.", "Cem", "Bozkurt", "m", "d-dermatoloji", "tr", ["Sedef hastalığı", "Saç dökülmesi"]],
  [
    "Uzm. Dr.",
    "Esra",
    "Güneş",
    "f",
    "d-ftr",
    "tr,en",
    ["Bel ve boyun ağrısı", "Spor rehabilitasyonu"],
  ],
  [
    "Uzm. Dr.",
    "Murat",
    "Kaplan",
    "m",
    "d-ftr",
    "tr",
    ["İnme rehabilitasyonu", "Ameliyat sonrası rehabilitasyon"],
  ],
  [
    "Uzm. Dr.",
    "Defne",
    "Sarı",
    "f",
    "d-psikiyatri",
    "tr,en",
    ["Kaygı bozuklukları", "Uyku sorunları"],
  ],
  [
    "Doç. Dr.",
    "Tolga",
    "Özkan",
    "m",
    "d-psikiyatri",
    "tr",
    ["Depresyon", "Erişkin dikkat eksikliği"],
  ],
  [
    "Prof. Dr.",
    "Kemal",
    "Doğan",
    "m",
    "d-genel-cerrahi",
    "tr,en",
    ["Laparoskopik cerrahi", "Fıtık cerrahisi"],
    true,
  ],
  [
    "Op. Dr.",
    "Seda",
    "Uçar",
    "f",
    "d-genel-cerrahi",
    "tr",
    ["Tiroid cerrahisi", "Meme hastalıkları"],
  ],
  [
    "Op. Dr.",
    "Emre",
    "Kılıç",
    "m",
    "d-genel-cerrahi",
    "tr,de",
    ["Safra kesesi cerrahisi", "Endoskopi"],
  ],
  [
    "Doç. Dr.",
    "Levent",
    "Acar",
    "m",
    "d-beyin-cerrahi",
    "tr,en",
    ["Bel fıtığı", "Omurga cerrahisi"],
  ],
  [
    "Op. Dr.",
    "Banu",
    "Ekinci",
    "f",
    "d-beyin-cerrahi",
    "tr",
    ["Boyun fıtığı", "Sinir sıkışmaları"],
  ],
  [
    "Prof. Dr.",
    "Serkan",
    "Yavuz",
    "m",
    "d-ortopedi",
    "tr,en",
    ["Diz protezi", "Artroskopik cerrahi"],
    true,
  ],
  [
    "Op. Dr.",
    "Ceren",
    "Aslan",
    "f",
    "d-ortopedi",
    "tr,en",
    ["Spor yaralanmaları", "Omuz cerrahisi"],
  ],
  ["Op. Dr.", "Volkan", "Turan", "m", "d-ortopedi", "tr", ["Kalça protezi", "Kırık tedavisi"]],
  [
    "Prof. Dr.",
    "Nihat",
    "Çakır",
    "m",
    "d-kvc",
    "tr,en",
    ["Koroner bypass", "Kalp kapak cerrahisi"],
  ],
  [
    "Op. Dr.",
    "Aslı",
    "Kurt",
    "f",
    "d-kvc",
    "tr",
    ["Varis tedavisi", "Periferik damar hastalıkları"],
  ],
  ["Doç. Dr.", "Barış", "Özer", "m", "d-uroloji", "tr,en", ["Böbrek taşı", "Endoskopik üroloji"]],
  ["Op. Dr.", "Canan", "Işık", "f", "d-uroloji", "tr", ["Kadın ürolojisi", "İdrar kaçırma"]],
  ["Op. Dr.", "Onur", "Bulut", "m", "d-kbb", "tr,en", ["Sinüs cerrahisi", "Horlama"]],
  ["Uzm. Dr.", "Pınar", "Erdoğan", "f", "d-kbb", "tr,ru", ["İşitme kaybı", "Baş dönmesi"]],
  ["Op. Dr.", "Gökhan", "Taş", "m", "d-goz", "tr,en", ["Katarakt cerrahisi", "Kırma kusurları"]],
  ["Doç. Dr.", "Melis", "Ateş", "f", "d-goz", "tr", ["Glokom", "Diyabetik retinopati"], true],
  ["Op. Dr.", "Tuna", "Keskin", "m", "d-plastik", "tr,en", ["El cerrahisi", "Yanık tedavisi"]],
  [
    "Uzm. Dr.",
    "Hande",
    "Ergin",
    "f",
    "d-anestezi",
    "tr",
    ["Ağrı yönetimi", "Ameliyat öncesi değerlendirme"],
  ],
  [
    "Prof. Dr.",
    "Filiz",
    "Yüksel",
    "f",
    "d-kadin-dogum",
    "tr,en",
    ["Riskli gebelik", "Doğum öncesi tarama"],
    true,
  ],
  [
    "Op. Dr.",
    "Ebru",
    "Coşkun",
    "f",
    "d-kadin-dogum",
    "tr,en",
    ["Laparoskopik jinekoloji", "Miyom tedavisi"],
  ],
  ["Op. Dr.", "Sinan", "Bilgin", "m", "d-kadin-dogum", "tr", ["Menopoz", "Gebelik takibi"]],
  [
    "Uzm. Dr.",
    "Özge",
    "Tunç",
    "f",
    "d-cocuk",
    "tr,en",
    ["Yenidoğan", "Büyüme-gelişme takibi"],
    true,
  ],
  ["Doç. Dr.", "Caner", "Karakaya", "m", "d-cocuk", "tr,en", ["Çocuk alerjisi", "Astım"]],
  ["Uzm. Dr.", "Dilek", "Şimşek", "f", "d-cocuk", "tr,ar", ["Çocuk beslenmesi", "Aşılama"]],
  ["Dt.", "Berk", "Avcı", "m", "d-dis", "tr,en", ["İmplant", "Diş eti tedavisi"]],
  ["Uzm. Dt.", "Yasemin", "Duman", "f", "d-dis", "tr", ["Ortodonti", "Pedodonti"]],
  ["Uzm. Dr.", "Alper", "Eren", "m", "d-radyoloji", "tr,en", ["MR", "Kas-iskelet radyolojisi"]],
  [
    "Uzm. Dr.",
    "Seçil",
    "Yaman",
    "f",
    "d-checkup",
    "tr,en",
    ["Koruyucu sağlık", "Check-up değerlendirmesi"],
  ],
];

const slugify = (s: string) =>
  s
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const universities = [
  "Örnek Üniversitesi Tıp Fakültesi",
  "Demo Üniversitesi Tıp Fakültesi",
  "Kurgu Tıp Fakültesi",
  "Model Üniversitesi Tıp Fakültesi",
];
const trainingHospitals = [
  "Örnek Eğitim ve Araştırma Hastanesi",
  "Demo Şehir Hastanesi",
  "Kurgu Üniversitesi Hastanesi",
];

const deptById = new Map(departments.map((d) => [d.id, d]));

const yearsByTitle: Record<Doctor["title"], number> = {
  "Prof. Dr.": 26,
  "Doç. Dr.": 18,
  "Dr. Öğr. Üyesi": 14,
  "Uzm. Dr.": 10,
  "Op. Dr.": 12,
  "Dt.": 8,
  "Uzm. Dt.": 11,
};

export const doctors: Doctor[] = rows.map(
  ([title, firstName, lastName, gender, departmentId, langs, interests, featured], i) => {
    const dept = deptById.get(departmentId);
    if (!dept) throw new Error(`Bilinmeyen bölüm: ${departmentId}`);
    const deptName = dept.name.tr;
    const years = yearsByTitle[title] + (i % 4);
    const gradYear = 2026 - years - 5;
    const isDentist = title === "Dt." || title === "Uzm. Dt.";
    const uni = universities[i % universities.length]!;
    const training = trainingHospitals[i % trainingHospitals.length]!;
    return {
      id: `doc-${String(i + 1).padStart(2, "0")}`,
      slug: slugify(`${firstName} ${lastName}`),
      status: "published",
      isDemo: true,
      title,
      firstName,
      lastName,
      gender,
      departmentIds: [departmentId],
      primaryDepartmentId: departmentId,
      bio: {
        tr: `${title} ${firstName} ${lastName}, ${uni.replace(" Tıp Fakültesi", "")} mezunudur ve ${years} yılı aşkın süredir ${deptName} alanında çalışmaktadır. Başlıca ilgi alanları ${interests.join(", ").toLocaleLowerCase("tr")} konularıdır. Hastalarıyla tedavi seçeneklerini anlaşılır bir dille paylaşmaya ve ortak karar almaya önem verir.`,
      },
      interests,
      languages: langs.split(","),
      education: [
        {
          institution: isDentist ? uni.replace("Tıp", "Diş Hekimliği") : uni,
          degree: isDentist ? "Diş Hekimliği" : "Tıp Doktorluğu",
          year: gradYear,
        },
        ...(title === "Dt."
          ? []
          : [{ institution: training, degree: `${deptName} Uzmanlığı`, year: gradYear + 5 }]),
      ],
      experience: [
        {
          institution: training,
          role: title === "Dt." ? "Diş hekimi" : "Uzman hekim",
          from: gradYear + 5,
          to: 2015 + (i % 6),
        },
        { institution: "ÖZEL FMC HASTANESİ", role: deptName, from: 2015 + (i % 6) },
      ],
      isActive: true,
      featured: featured ?? false,
    };
  },
);

/** Haftalık gün desenleri; doktor sırasına göre döner. */
const weekdayPatterns = [
  [1, 3, 5],
  [2, 4],
  [1, 2, 4],
  [3, 5],
  [1, 4, 5],
  [2, 3],
];

export const doctorSchedules: DoctorSchedule[] = doctors.flatMap((doc, i) => {
  const dept = deptById.get(doc.primaryDepartmentId)!;
  // Doktor, bölümün bulunduğu şubelerden birinde ya da (çok şubeliyse) ikisinde çalışır.
  const branchIds = dept.locations.map((l) => l.branchId);
  const primaryBranch = branchIds[i % branchIds.length]!;
  const secondBranch =
    branchIds.length > 1 && i % 3 === 0 ? branchIds[(i + 1) % branchIds.length] : undefined;
  const pattern = weekdayPatterns[i % weekdayPatterns.length]!;
  const morning = i % 2 === 0;

  return pattern.flatMap((weekday, j) => {
    const branchId = secondBranch && j === pattern.length - 1 ? secondBranch : primaryBranch;
    const base = { doctorId: doc.id, branchId, departmentId: dept.id, weekday, slotMinutes: 20 };
    return morning
      ? [
          { ...base, startTime: "09:00", endTime: "12:00" },
          { ...base, startTime: "13:00", endTime: "16:00" },
        ]
      : [
          { ...base, startTime: "10:00", endTime: "12:00" },
          { ...base, startTime: "13:30", endTime: "17:00" },
        ];
  });
});

/** Birkaç sabit izin/kongre günü; tarih aralığı demoda her zaman gelecekte kalsın diye yıl 2027. */
export const scheduleExceptions: ScheduleException[] = [
  { doctorId: "doc-01", date: "2027-01-15", type: "congress" },
  { doctorId: "doc-05", date: "2027-01-20", type: "leave" },
];
