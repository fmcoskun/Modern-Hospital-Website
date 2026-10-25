import type { Article, ArticleCategory } from "@/lib/data/types";

export const articleCategories: ArticleCategory[] = [
  { id: "ac-hastaliklar", slug: "hastaliklar", name: { tr: "Hastalıklar" } },
  { id: "ac-koruyucu", slug: "koruyucu-saglik", name: { tr: "Koruyucu Sağlık" } },
  { id: "ac-beslenme", slug: "beslenme", name: { tr: "Beslenme" } },
  { id: "ac-cocuk", slug: "cocuk-sagligi", name: { tr: "Çocuk Sağlığı" } },
  { id: "ac-kadin", slug: "kadin-sagligi", name: { tr: "Kadın Sağlığı" } },
];

const who = {
  title: "Dünya Sağlık Örgütü — Sağlık konuları",
  url: "https://www.who.int/health-topics",
};
const moh = { title: "T.C. Sağlık Bakanlığı", url: "https://www.saglik.gov.tr" };

type Input = Omit<Article, "status" | "isDemo" | "sources" | "reviewedAt"> &
  Partial<Pick<Article, "sources">>;
const article = (a: Input): Article => ({
  status: "published",
  isDemo: true,
  sources: [who, moh],
  reviewedAt: a.publishedAt,
  ...a,
});

/**
 * Kurgusal, genel ve zararsız içerikler; ilaç/doz önerisi içermez. Her makalede yazar ve
 * tıbbi gözden geçiren hekim ayrı kişidir.
 */
export const articles: Article[] = [
  article({
    id: "ar-01",
    slug: "check-up-oncesi-hazirlik",
    categoryId: "ac-koruyucu",
    tags: ["check-up", "hazırlık"],
    departmentIds: ["d-checkup", "d-ic-hastaliklari"],
    authorDoctorId: "doc-48",
    medicalReviewerDoctorId: "doc-10",
    publishedAt: "2026-10-05",
    readingMinutes: 4,
    title: { tr: "Check-up öncesi nasıl hazırlanmalı?" },
    excerpt: {
      tr: "Açlık süresi, ilaç kullanımı ve yanınıza almanız gerekenlerle check-up gününe hazırlık rehberi.",
    },
    sections: [
      {
        heading: "Açlık süresi",
        paragraphs: [
          "Kan tetkiklerinin doğru sonuç vermesi için genellikle 8–12 saatlik açlık gerekir. Bu sürede su içebilirsiniz; çay, kahve ve sigara önerilmez.",
        ],
      },
      {
        heading: "Düzenli kullandığınız ilaçlar",
        paragraphs: [
          "Düzenli kullandığınız ilaçları kendi kararınızla bırakmayın. Check-up sabahı ilaç alıp almamanız gerektiğini önceden hekiminize veya check-up koordinatörüne sorun.",
        ],
      },
      {
        heading: "Yanınıza alın",
        paragraphs: [
          "Kimlik belgenizi, varsa önceki tahlil sonuçlarınızı ve kullandığınız ilaçların listesini getirin. Rahat kıyafetler ve spor ayakkabı efor testi gibi incelemeleri kolaylaştırır.",
        ],
      },
    ],
  }),
  article({
    id: "ar-02",
    slug: "migren-ve-gerilim-tipi-bas-agrisi",
    categoryId: "ac-hastaliklar",
    tags: ["baş ağrısı", "migren"],
    departmentIds: ["d-noroloji"],
    authorDoctorId: "doc-06",
    medicalReviewerDoctorId: "doc-05",
    publishedAt: "2026-09-28",
    readingMinutes: 5,
    title: { tr: "Migren ile gerilim tipi baş ağrısı arasındaki farklar" },
    excerpt: {
      tr: "En sık görülen iki baş ağrısı türünün belirtileri ve ne zaman hekime başvurmak gerektiği.",
    },
    sections: [
      {
        heading: "Gerilim tipi baş ağrısı",
        paragraphs: [
          "Genellikle başın iki yanında baskı veya sıkışma hissi şeklindedir. Günlük aktivite ile belirgin şekilde artmaz.",
        ],
      },
      {
        heading: "Migren",
        paragraphs: [
          "Çoğunlukla tek taraflı, zonklayıcı karakterdedir; bulantı, ışık ve sese hassasiyet eşlik edebilir. Bazı kişilerde ağrıdan önce görme belirtileri (aura) olur.",
        ],
      },
      {
        heading: "Ne zaman başvurmalı?",
        paragraphs: [
          "Baş ağrınızın karakteri değiştiyse, sıklığı arttıysa veya günlük yaşamınızı etkiliyorsa Nöroloji polikliniğine başvurun. Ani ve hayatınızın en şiddetli baş ağrısı, konuşma bozukluğu veya güç kaybı varsa 112'yi arayın.",
        ],
      },
    ],
  }),
  article({
    id: "ar-03",
    slug: "kalp-sagligi-icin-gunluk-aliskanliklar",
    categoryId: "ac-koruyucu",
    tags: ["kalp", "egzersiz"],
    departmentIds: ["d-kardiyoloji"],
    authorDoctorId: "doc-03",
    medicalReviewerDoctorId: "doc-01",
    publishedAt: "2026-09-20",
    readingMinutes: 4,
    title: { tr: "Kalp sağlığı için 5 günlük alışkanlık" },
    excerpt: {
      tr: "Hareket, uyku, beslenme ve stres yönetimiyle kalp-damar sağlığını desteklemenin yolları.",
    },
    sections: [
      {
        heading: "Düzenli hareket",
        paragraphs: [
          "Haftanın çoğu günü orta tempolu yürüyüş gibi aktiviteler kalp-damar sağlığını destekler. Yeni bir egzersiz programına başlamadan önce hekiminize danışın.",
        ],
      },
      {
        heading: "Uyku ve stres",
        paragraphs: [
          "Düzenli uyku ve stresle baş etme yöntemleri tansiyon ve kalp ritmi üzerinde olumlu etki gösterebilir.",
        ],
      },
      {
        heading: "Düzenli kontrol",
        paragraphs: [
          "Tansiyon, kan şekeri ve kolesterol değerlerinizi bilmek, risklerin erken fark edilmesini sağlar.",
        ],
      },
    ],
  }),
  article({
    id: "ar-04",
    slug: "cocuklarda-ates",
    categoryId: "ac-cocuk",
    tags: ["ateş", "çocuk"],
    departmentIds: ["d-cocuk"],
    authorDoctorId: "doc-44",
    medicalReviewerDoctorId: "doc-43",
    publishedAt: "2026-09-12",
    readingMinutes: 4,
    title: { tr: "Çocuklarda ateş: ebeveynler için genel bilgiler" },
    excerpt: {
      tr: "Ateşin ölçülmesi, çocuğun rahatlatılması ve hangi durumlarda hekime başvurulması gerektiği.",
    },
    sections: [
      {
        heading: "Ateş nasıl ölçülür?",
        paragraphs: [
          "Yaşa uygun bir termometreyle ve aynı yöntemle ölçüm yapmak, değerleri karşılaştırmayı kolaylaştırır.",
        ],
      },
      {
        heading: "Rahatlatma",
        paragraphs: [
          "Çocuğun bol sıvı alması ve hafif giydirilmesi rahatlamasına yardımcı olur. İlaç kullanımı için mutlaka çocuk hekiminize danışın.",
        ],
      },
      {
        heading: "Hemen başvurun",
        paragraphs: [
          "Üç aydan küçük bebekte ateş, nefes almada güçlük, havale, bilinç değişikliği veya döküntü varsa vakit kaybetmeden acil servise başvurun.",
        ],
      },
    ],
  }),
  article({
    id: "ar-05",
    slug: "dengeli-tabak-modeli",
    categoryId: "ac-beslenme",
    tags: ["beslenme"],
    departmentIds: ["d-ic-hastaliklari"],
    authorDoctorId: "doc-09",
    medicalReviewerDoctorId: "doc-11",
    publishedAt: "2026-09-02",
    readingMinutes: 3,
    title: { tr: "Dengeli tabak modeli ile kolay beslenme" },
    excerpt: {
      tr: "Tabağın yarısı sebze, çeyreği protein, çeyreği tam tahıl: pratik bir planlama yöntemi.",
    },
    sections: [
      {
        heading: "Tabağı bölün",
        paragraphs: [
          "Tabağın yarısını sebze ve salata, dörtte birini protein kaynağı, kalan dörtte birini tam tahıllı besinler oluşturabilir.",
        ],
      },
      {
        heading: "Kişiye özel ihtiyaçlar",
        paragraphs: [
          "Diyabet, böbrek hastalığı gibi durumlarda beslenme planınızı hekiminiz ve diyetisyeninizle birlikte oluşturun.",
        ],
      },
    ],
  }),
  article({
    id: "ar-06",
    slug: "rahim-agzi-taramasi",
    categoryId: "ac-kadin",
    tags: ["tarama", "smear"],
    departmentIds: ["d-kadin-dogum"],
    authorDoctorId: "doc-40",
    medicalReviewerDoctorId: "doc-39",
    publishedAt: "2026-08-25",
    readingMinutes: 4,
    title: { tr: "Rahim ağzı taraması neden önemli?" },
    excerpt: { tr: "Smear ve HPV testlerinin amacı ve tarama aralıkları hakkında genel bilgiler." },
    sections: [
      {
        heading: "Taramanın amacı",
        paragraphs: [
          "Tarama testleri, hücre değişikliklerini belirti vermeden önce saptamayı amaçlar.",
        ],
      },
      {
        heading: "Ne sıklıkla?",
        paragraphs: [
          "Tarama aralığı yaşa ve önceki sonuçlara göre değişir; size uygun takvimi hekiminiz belirler.",
        ],
      },
    ],
  }),
  article({
    id: "ar-07",
    slug: "diz-agrisinda-dogru-bilinen-yanlislar",
    categoryId: "ac-hastaliklar",
    tags: ["diz", "eklem"],
    departmentIds: ["d-ortopedi", "d-ftr"],
    authorDoctorId: "doc-27",
    medicalReviewerDoctorId: "doc-26",
    publishedAt: "2026-08-18",
    readingMinutes: 5,
    title: { tr: "Diz ağrısında doğru bilinen yanlışlar" },
    excerpt: { tr: "Merdiven, egzersiz ve dinlenme hakkında yaygın inanışlar ve güncel yaklaşım." },
    sections: [
      {
        heading: '"Ağrıyan diz tamamen dinlendirilmeli"',
        paragraphs: [
          "Uzun süreli hareketsizlik kasları zayıflatabilir. Uygun egzersiz programı çoğu durumda iyileşmeyi destekler; programı hekiminiz veya fizyoterapistiniz belirlemelidir.",
        ],
      },
      {
        heading: "Ne zaman başvurmalı?",
        paragraphs: [
          "Dizde şişlik, kilitlenme, boşalma hissi veya travma sonrası ağrı varsa Ortopedi polikliniğine başvurun.",
        ],
      },
    ],
  }),
  article({
    id: "ar-08",
    slug: "goz-tansiyonu-glokom",
    categoryId: "ac-hastaliklar",
    tags: ["göz", "glokom"],
    departmentIds: ["d-goz"],
    authorDoctorId: "doc-35",
    medicalReviewerDoctorId: "doc-36",
    publishedAt: "2026-08-08",
    readingMinutes: 4,
    title: { tr: "Göz tansiyonu (glokom) sessiz ilerleyebilir" },
    excerpt: { tr: "Belirti vermeden ilerleyebilen glokom için düzenli göz muayenesinin önemi." },
    sections: [
      {
        heading: "Neden sessiz?",
        paragraphs: [
          "Glokom erken dönemde çoğunlukla belirti vermez; görme alanı kaybı fark edildiğinde hastalık ilerlemiş olabilir.",
        ],
      },
      {
        heading: "Kimler risk altında?",
        paragraphs: [
          "Ailesinde glokom bulunanlar, 40 yaş üstü kişiler ve diyabet hastalarının düzenli göz muayenesi yaptırması önerilir.",
        ],
      },
    ],
  }),
  article({
    id: "ar-09",
    slug: "uyku-hijyeni",
    categoryId: "ac-koruyucu",
    tags: ["uyku"],
    departmentIds: ["d-psikiyatri", "d-gogus"],
    authorDoctorId: "doc-19",
    medicalReviewerDoctorId: "doc-13",
    publishedAt: "2026-07-30",
    readingMinutes: 3,
    title: { tr: "Daha iyi uyku için uyku hijyeni önerileri" },
    excerpt: {
      tr: "Düzenli saatler, ekran kullanımı ve yatak odası düzeniyle ilgili pratik öneriler.",
    },
    sections: [
      {
        heading: "Düzenli saatler",
        paragraphs: [
          "Her gün aynı saatte yatıp kalkmak biyolojik saatin düzenlenmesine yardımcı olur.",
        ],
      },
      {
        heading: "Horlama ve nefes durması",
        paragraphs: [
          "Yüksek sesli horlama ve uykuda nefes durması fark ediliyorsa uyku apnesi açısından Göğüs Hastalıkları bölümüne başvurun.",
        ],
      },
    ],
  }),
  article({
    id: "ar-10",
    slug: "diyabette-ayak-bakimi",
    categoryId: "ac-hastaliklar",
    tags: ["diyabet"],
    departmentIds: ["d-ic-hastaliklari"],
    authorDoctorId: "doc-11",
    medicalReviewerDoctorId: "doc-09",
    publishedAt: "2026-07-22",
    readingMinutes: 4,
    title: { tr: "Diyabette günlük ayak bakımı" },
    excerpt: {
      tr: "Diyabetli bireylerin ayak sağlığını korumak için her gün yapabilecekleri kontroller.",
    },
    sections: [
      {
        heading: "Her gün kontrol edin",
        paragraphs: [
          "Ayaklarınızı her gün yara, kızarıklık veya renk değişikliği açısından kontrol edin; gerekirse ayna kullanın.",
        ],
      },
      {
        heading: "Ayakkabı seçimi",
        paragraphs: [
          "Rahat, sıkmayan ve dikişsiz çoraplarla kullanılan ayakkabılar tercih edilmelidir. Fark ettiğiniz değişiklikleri hekiminize bildirin.",
        ],
      },
    ],
  }),
  article({
    id: "ar-11",
    slug: "bebeklerde-asi-takvimi",
    categoryId: "ac-cocuk",
    tags: ["aşı", "bebek"],
    departmentIds: ["d-cocuk"],
    authorDoctorId: "doc-42",
    medicalReviewerDoctorId: "doc-43",
    publishedAt: "2026-07-14",
    readingMinutes: 3,
    title: { tr: "Bebeklerde aşı takibi nasıl yapılır?" },
    excerpt: {
      tr: "Aşı kartının saklanması ve aşı günlerinin planlanması için ebeveynlere öneriler.",
    },
    sections: [
      {
        heading: "Aşı kartı",
        paragraphs: [
          "Aşı kartını saklayın ve her kontrolde yanınızda getirin; e-Nabız üzerinden de aşı geçmişi takip edilebilir.",
        ],
      },
      {
        heading: "Aşı günü",
        paragraphs: [
          "Bebeğinizin o gün ateşi veya hastalığı varsa aşı öncesi hekiminize bilgi verin.",
        ],
      },
    ],
  }),
  article({
    id: "ar-12",
    slug: "mamografi-hakkinda",
    categoryId: "ac-kadin",
    tags: ["tarama", "mamografi"],
    departmentIds: ["d-radyoloji", "d-kadin-dogum"],
    authorDoctorId: "doc-47",
    medicalReviewerDoctorId: "doc-39",
    publishedAt: "2026-07-05",
    readingMinutes: 4,
    title: { tr: "Mamografi çekimi hakkında merak edilenler" },
    excerpt: { tr: "Çekim öncesi hazırlık, çekim süreci ve sonuçların değerlendirilmesi." },
    sections: [
      {
        heading: "Çekim öncesi",
        paragraphs: [
          "Çekim günü koltuk altı ve göğüs bölgesine deodorant, pudra veya krem sürmemeniz önerilir; bu maddeler görüntüde yanıltıcı gölgeler oluşturabilir.",
        ],
      },
      {
        heading: "Önceki görüntüler",
        paragraphs: [
          "Daha önce çekilmiş mamografi görüntüleriniz varsa karşılaştırma için yanınızda getirin.",
        ],
      },
    ],
  }),
];
