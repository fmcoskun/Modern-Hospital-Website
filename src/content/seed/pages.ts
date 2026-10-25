import type { Page } from "@/lib/data/types";

type Input = Omit<Page, "sections" | "related" | "isTemplate"> & {
  sections: (Pick<Page["sections"][number], "id" | "heading"> &
    Partial<Page["sections"][number]>)[];
  related?: Page["related"];
  isTemplate?: boolean;
};

const page = (p: Input): Page => ({
  ...p,
  related: p.related ?? [],
  isTemplate: p.isTemplate ?? false,
  sections: p.sections.map((s) => ({ paragraphs: [], items: [], steps: [], ...s })),
});

const legalNote =
  "Bu metin kurgusal bir demo için hazırlanmış şablondur ve hukuki geçerliliği yoktur. Gerçek bir kurumda KVKK ve sağlık hukuku uzmanı tarafından hazırlanmalıdır.";

export const pages: Page[] = [
  // ——— Kurumsal ———
  page({
    path: "/kurumsal/hakkimizda",
    section: "corporate",
    title: "Hakkımızda",
    lead: "2004'ten bu yana İstanbul'da üç şubesiyle hizmet veren kurgusal bir sağlık kurumu.",
    updatedAt: "2026-10-01",
    sections: [
      {
        id: "tanitim",
        heading: "Kurumumuz",
        paragraphs: [
          "ÖZEL FMC HASTANESİ; Merkez Kampüs, Kadıköy Hastanesi ve Bakırköy Tıp Merkezi'nden oluşan, 24 tıbbi birim ve 48 hekimle hizmet veren kurgusal bir hastanedir.",
          "Bu site, bir hastane web sitesinin bilgi mimarisini, erişilebilirlik ve kişisel veri gereksinimlerini göstermek amacıyla hazırlanmış bir portfolyo demosudur.",
        ],
      },
      {
        id: "tarihce",
        heading: "Tarihçe",
        items: [
          "2004 — Merkez Kampüs 120 yatakla hizmete açıldı.",
          "2011 — Kadıköy Hastanesi ve 7/24 acil servisi açıldı.",
          "2016 — Merkez Kampüs'e C ve D blokları eklendi; yatak sayısı 320'ye ulaştı.",
          "2020 — Bakırköy Tıp Merkezi poliklinik hizmetlerine başladı.",
          "2026 — Online randevu ve dijital hasta rehberi devreye alındı (demo).",
        ],
      },
      {
        id: "misyon-vizyon",
        heading: "Misyon ve vizyon",
        paragraphs: [
          "Misyonumuz: Hastalarımıza kanıta dayalı, güvenli ve erişilebilir sağlık hizmetini anlaşılır bir iletişimle sunmak.",
          "Vizyonumuz: Hasta deneyimini ve hasta güvenliğini her süreçte ölçen, şeffaf ve öğrenen bir sağlık kurumu olmak.",
        ],
      },
      {
        id: "degerler",
        heading: "Değerlerimiz",
        items: [
          "Hasta güvenliği her kararın önündedir.",
          "Bilgiyi açık ve anlaşılır biçimde paylaşırız.",
          "Mahremiyete ve kişisel verilere saygı gösteririz.",
          "Erişilebilirliği tasarımın parçası olarak görürüz.",
          "Ekip çalışmasına ve sürekli öğrenmeye değer veririz.",
        ],
      },
    ],
    related: [
      { label: "Hastane ve Olanaklar", href: "/kurumsal/olanaklar" },
      { label: "Kalite ve Hasta Güvenliği", href: "/kurumsal/kalite" },
      { label: "Lokasyonlar", href: "/lokasyonlar" },
    ],
  }),
  page({
    path: "/kurumsal/kalite",
    section: "corporate",
    title: "Kalite ve Hasta Güvenliği",
    lead: "Hasta güvenliği hedeflerimiz ve kalite yönetim yaklaşımımız.",
    updatedAt: "2026-09-15",
    sections: [
      {
        id: "yaklasim",
        heading: "Kalite yaklaşımımız",
        paragraphs: [
          "Klinik ve idari süreçlerimizi ölçülebilir göstergelerle izler, sonuçları her çeyrekte kalite kurulunda değerlendiririz.",
        ],
      },
      {
        id: "hedefler",
        heading: "Hasta güvenliği hedefleri",
        items: [
          "Her işlemden önce iki ayrı bilgiyle hasta kimliğinin doğrulanması",
          "Yüksek riskli ilaçların çift kontrolle uygulanması",
          "El hijyeni uyumunun düzenli gözlemlenmesi",
          "Düşme riskinin her yatışta değerlendirilmesi",
          "Ameliyat öncesi güvenli cerrahi kontrol listesinin uygulanması",
        ],
      },
      {
        id: "akreditasyon",
        heading: "Belgeler",
        paragraphs: [
          "Bu demoda gösterilen kalite belgeleri kurgusaldır; gerçek bir akreditasyon kuruluşunu veya logosunu temsil etmez.",
        ],
      },
    ],
    related: [{ label: "Hasta hakları ve geri bildirim", href: "/hasta-rehberi/hasta-haklari" }],
  }),

  // ——— Hasta ve ziyaretçi rehberi ———
  page({
    path: "/hasta-rehberi/ilk-ziyaret",
    section: "patient",
    group: "before",
    title: "İlk ziyaret ve muayene hazırlığı",
    lead: "Muayeneye gelmeden önce hazırlamanız gerekenler ve hastanedeki ilk adımlarınız.",
    updatedAt: "2026-10-01",
    sections: [
      {
        id: "gelmeden-once",
        heading: "Gelmeden önce",
        items: [
          "Kimlik belgenizi yanınıza alın.",
          "Varsa önceki tahlil, görüntüleme ve epikriz raporlarınızı getirin.",
          "Kullandığınız ilaçların adlarını ve dozlarını bir listeye yazın.",
          "Sigortanızla ilgili provizyon gerekiyorsa sigorta şirketinizle önceden görüşün.",
        ],
      },
      {
        id: "adimlar",
        heading: "Hastanede adım adım",
        steps: [
          "Randevu saatinizden 15 dakika önce hasta kabul bankosuna başvurun.",
          "Kimlik doğrulaması ve kayıt işlemleri tamamlanır.",
          "Yönlendirme ekranlarından polikliniğinizin kat ve bina bilgisini takip edin.",
          "Muayene sonrası istenen tetkikler için laboratuvar veya radyolojiye yönlendirilirsiniz.",
          "Sonuçlarınız hazır olduğunda kontrol muayenesi için randevu planlanır.",
        ],
      },
      {
        id: "acil",
        heading: "Acil durumda",
        paragraphs: [
          "Hayati tehlike içeren durumlarda randevu beklemeyin; 112'yi arayın veya en yakın acil servise başvurun.",
        ],
      },
    ],
    related: [
      { label: "Online randevu al", href: "/randevu/yeni" },
      { label: "Ulaşım ve otopark", href: "/hasta-rehberi/ulasim-ve-otopark" },
      { label: "Sıkça sorulan sorular", href: "/hasta-rehberi/sss" },
    ],
  }),
  page({
    path: "/hasta-rehberi/e-sonuc",
    section: "patient",
    group: "before",
    title: "E-Sonuç bilgilendirme",
    lead: "Tahlil ve görüntüleme sonuçlarınıza nasıl ulaşabileceğinize dair bilgilendirme.",
    updatedAt: "2026-10-01",
    sections: [
      {
        id: "demo",
        heading: "Bu demoda sonuç ekranı yoktur",
        paragraphs: [
          "Tahlil sonuçları özel nitelikli kişisel veridir. Bu kurgusal sitede sonuç sorgulama ekranı bilinçli olarak bulunmaz ve sahte sonuç gösterilmez.",
        ],
      },
      {
        id: "gercek",
        heading: "Gerçek bir hastanede",
        items: [
          "Sonuçlar, kimlik doğrulaması yapılan güvenli bir hasta portalında veya T.C. Sağlık Bakanlığı'nın e-Nabız uygulamasında görüntülenir.",
          "Sonuçlarınızı hekiminizle birlikte değerlendirmeniz önerilir.",
          "Sonuç bilgisi telefonla veya e-postayla paylaşılmaz.",
        ],
      },
    ],
    related: [{ label: "Sıkça sorulan sorular", href: "/hasta-rehberi/sss" }],
  }),
  page({
    path: "/hasta-rehberi/erisilebilirlik",
    section: "patient",
    group: "arriving",
    title: "Erişilebilirlik olanakları",
    lead: "Engelli hastalarımız ve ziyaretçilerimiz için fiziksel ve iletişim olanakları.",
    updatedAt: "2026-10-01",
    sections: [
      {
        id: "fiziksel",
        heading: "Fiziksel erişim",
        items: [
          "Tüm şubelerde rampa veya asansörle basamaksız giriş",
          "Giriş katlarında engelli otopark alanları",
          "Danışmada ödünç tekerlekli sandalye",
          "Her katta engelli tuvaleti",
        ],
      },
      {
        id: "iletisim",
        heading: "İletişim desteği",
        items: [
          "Vezne ve danışmada işitme cihazı uyumlu indüksiyon döngüsü (Merkez Kampüs)",
          "Asansörlerde Braille butonlar",
          "İstek üzerine refakatçi personel desteği; randevu sırasında belirtebilirsiniz",
        ],
      },
    ],
    related: [
      { label: "Ulaşım ve otopark", href: "/hasta-rehberi/ulasim-ve-otopark" },
      { label: "Web sitesi erişilebilirlik bildirimi", href: "/yasal/erisilebilirlik" },
    ],
  }),
  page({
    path: "/hasta-rehberi/hasta-kabul",
    section: "patient",
    group: "inHospital",
    title: "Hasta kabul ve hastane içi yönlendirme",
    lead: "Kayıt işlemleri, bina ve kat yönlendirmeleri.",
    updatedAt: "2026-10-01",
    sections: [
      {
        id: "kabul",
        heading: "Hasta kabul",
        paragraphs: [
          "Hasta kabul bankoları her binanın giriş katında yer alır. Randevulu hastalar için öncelikli sıra numarası verilir.",
        ],
      },
      {
        id: "yonlendirme",
        heading: "Yönlendirme",
        items: [
          "Bina girişlerinde kat planları ve renk kodlu yönlendirme işaretleri bulunur.",
          'Bölümlerin bina ve kat bilgileri her bölüm sayfasının "Konum" başlığında yer alır.',
          "Danışma personeli tüm katlarda yardımcı olur.",
        ],
      },
    ],
    related: [{ label: "Tıbbi birimler", href: "/tibbi-birimler" }],
  }),
  page({
    path: "/hasta-rehberi/yatis-ve-taburculuk",
    section: "patient",
    group: "leaving",
    title: "Yatış ve taburculuk",
    lead: "Yatışınız sırasında ve taburcu olurken bilmeniz gerekenler.",
    updatedAt: "2026-10-01",
    sections: [
      {
        id: "yatis",
        heading: "Yatış",
        items: [
          "Yatış işlemleri hasta kabul biriminde yapılır.",
          "Kişisel ilaçlarınızı servis hemşiresine teslim edin; ilaçlarınız hekim istemiyle verilir.",
          "Değerli eşyalarınızı yanınızda getirmemeniz önerilir.",
        ],
      },
      {
        id: "taburculuk",
        heading: "Taburculuk",
        steps: [
          "Hekiminiz taburculuk kararını ve evde dikkat etmeniz gerekenleri açıklar.",
          "Epikriz raporunuz ve ilaç listeniz size verilir.",
          "Kontrol randevunuz planlanır.",
          "Hasta kabul biriminde çıkış işlemleri tamamlanır.",
        ],
      },
    ],
    related: [{ label: "Ziyaret saatleri ve refakatçi", href: "/hasta-rehberi/ziyaret-saatleri" }],
  }),
  page({
    path: "/hasta-rehberi/hasta-haklari",
    section: "patient",
    group: "rights",
    title: "Hasta hakları ve sorumlulukları",
    lead: "Haklarınız, sorumluluklarınız ve görüşlerinizi bize iletebileceğiniz kanallar.",
    updatedAt: "2026-10-01",
    sections: [
      {
        id: "haklar",
        heading: "Haklarınız",
        items: [
          "Sağlık durumunuz ve tedavi seçenekleri hakkında anlaşılır bilgi alma",
          "Tedaviyi kabul veya reddetme",
          "Mahremiyetinize ve kişisel verilerinize saygı gösterilmesi",
          "Hekiminizi ve sağlık kuruluşunu seçme",
          "Saygı ve özen gösterilerek hizmet alma",
          "Dilek ve şikayetlerinizi iletme",
        ],
      },
      {
        id: "sorumluluklar",
        heading: "Sorumluluklarınız",
        items: [
          "Sağlık geçmişiniz hakkında doğru bilgi vermek",
          "Hastane kurallarına ve diğer hastaların haklarına saygı göstermek",
          "Randevunuza gelemeyecekseniz önceden haber vermek",
        ],
      },
      {
        id: "geri-bildirim",
        heading: "Geri bildirim",
        paragraphs: [
          'Görüş, öneri ve şikayetlerinizi iletişim formundan "Geri bildirim" konusunu seçerek veya hasta hakları birimine giderek iletebilirsiniz. Formda sağlık bilgisi paylaşmamanızı rica ederiz.',
        ],
      },
    ],
    related: [{ label: "İletişim formu", href: "/iletisim" }],
  }),

  // ——— Yasal ———
  page({
    path: "/yasal/kvkk",
    section: "legal",
    title: "KVKK Aydınlatma Metni",
    lead: "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında bilgilendirme (şablon).",
    updatedAt: "2026-10-01",
    isTemplate: true,
    sections: [
      {
        id: "veri-sorumlusu",
        heading: "Veri sorumlusu",
        paragraphs: [
          "Veri sorumlusu kurgusal FMC Sağlık Hizmetleri A.Ş.'dir. İletişim: kvkk@fmc-hastanesi.example",
        ],
      },
      {
        id: "demo",
        heading: "Bu demo sitede işlenen veriler",
        items: [
          "Randevu formu: ad, soyad, kurgusal telefon, isteğe bağlı e-posta ve doğum yılı yalnız doğrulanır; sunucuda saklanmaz ve loglanmaz.",
          "İletişim formu: girilen bilgiler doğrulanır ve atılır.",
          "Randevu seçimleriniz (şube, bölüm, doktor, saat) yalnız tarayıcınızın oturum belleğinde (sessionStorage) tutulur.",
          "Çerez kullanılmaz; analitik veya reklam aracı yoktur.",
        ],
      },
      {
        id: "haklar",
        heading: "Haklarınız",
        paragraphs: [
          "KVKK'nın 11. maddesi uyarınca verilerinizin işlenip işlenmediğini öğrenme, düzeltilmesini veya silinmesini isteme gibi haklarınız bulunur. Gerçek bir kurumda başvuru yöntemi burada açıklanır.",
        ],
      },
      { id: "not", heading: "Önemli not", paragraphs: [legalNote] },
    ],
  }),
  page({
    path: "/yasal/gizlilik",
    section: "legal",
    title: "Gizlilik Politikası",
    lead: "Sitemizi kullanırken gizliliğinizi nasıl koruduğumuz (şablon).",
    updatedAt: "2026-10-01",
    isTemplate: true,
    sections: [
      {
        id: "ilkeler",
        heading: "İlkeler",
        items: [
          "Veri minimizasyonu: yalnız amaç için gereken en az veri istenir.",
          "Üçüncü taraf istekleri (ör. harita) yalnız açık onayınızla yapılır.",
          "Yazı tipleri sitemizden sunulur; sayfa açılışında dış servislere istek gitmez.",
        ],
      },
      { id: "not", heading: "Önemli not", paragraphs: [legalNote] },
    ],
  }),
  page({
    path: "/yasal/cerez",
    section: "legal",
    title: "Çerez Politikası",
    lead: "Bu demo site çerez kullanmaz.",
    updatedAt: "2026-10-01",
    isTemplate: true,
    sections: [
      {
        id: "cerezler",
        heading: "Kullanılan çerezler",
        paragraphs: [
          "Sitemiz zorunlu, analitik veya pazarlama çerezi kullanmaz; bu nedenle çerez onay bandı gösterilmez. Randevu seçimleri çerez yerine yalnız oturum boyunca saklanan tarayıcı belleğinde tutulur ve sekmeyi kapattığınızda silinir.",
        ],
      },
      { id: "not", heading: "Önemli not", paragraphs: [legalNote] },
    ],
  }),
  page({
    path: "/yasal/kullanim-kosullari",
    section: "legal",
    title: "Kullanım Koşulları",
    lead: "Sitenin kullanımına ilişkin koşullar (şablon).",
    updatedAt: "2026-10-01",
    isTemplate: true,
    sections: [
      {
        id: "kosullar",
        heading: "Koşullar",
        items: [
          "Sitedeki tüm kurum, kişi ve içerikler kurgusaldır.",
          "Sağlık rehberi içerikleri genel bilgilendirme amaçlıdır ve tıbbi tavsiye yerine geçmez.",
          "Online randevu akışı simülasyondur; gerçek bir randevu oluşturmaz.",
        ],
      },
      { id: "not", heading: "Önemli not", paragraphs: [legalNote] },
    ],
  }),
  page({
    path: "/yasal/erisilebilirlik",
    section: "legal",
    title: "Erişilebilirlik Bildirimi",
    lead: "Web sitemizin erişilebilirlik hedefi ve bilinen sınırlamalar.",
    updatedAt: "2026-10-25",
    sections: [
      {
        id: "hedef",
        heading: "Hedefimiz",
        paragraphs: [
          "Sitemizi WCAG 2.2 AA düzeyine uygun olacak şekilde tasarlıyoruz. Tüm sayfa şablonları otomatik erişilebilirlik testleriyle (axe) düzenli olarak denetlenir.",
        ],
      },
      {
        id: "ozellikler",
        heading: "Desteklenen özellikler",
        items: [
          "Tüm işlevler klavyeyle kullanılabilir; odak halkası her zaman görünür.",
          "Metin kontrastı en az 4,5:1, kontrol sınırları en az 3:1.",
          "Yüksek kontrast, Windows Yüksek Karşıtlık ve hareketi azaltma tercihleri desteklenir.",
          "Randevu formunda kalıcı etiketler, satır içi hatalar ve hata özeti bulunur.",
        ],
      },
      {
        id: "sinirlamalar",
        heading: "Bilinen sınırlamalar",
        items: [
          "Ekran okuyucularla manuel denetim henüz tamamlanmadı.",
          "İngilizce içerik henüz yok.",
        ],
      },
      {
        id: "geri-bildirim",
        heading: "Geri bildirim",
        paragraphs: ["Erişilebilirlik sorunlarını iletişim formumuzdan bildirebilirsiniz."],
      },
    ],
    related: [{ label: "İletişim formu", href: "/iletisim" }],
  }),
];
