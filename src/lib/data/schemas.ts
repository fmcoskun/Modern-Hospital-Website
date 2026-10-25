import { z } from "@/lib/zod";

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "kebab-case slug");
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "HH:mm");
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD");
/** Kurgusal telefon kalıbı: 0 (850) 000 xx xx — gerçek aboneyle çakışmaz. */
const demoPhone = z.string().regex(/^0 \(850\) 000 \d{2} \d{2}$/, "kurgusal telefon kalıbı");
const demoEmail = z
  .email()
  .refine((v) => v.endsWith(".example"), "e-posta .example alan adında olmalı");

export const localizedText = z.object({ tr: z.string().min(1), en: z.string().min(1).optional() });

const catalog = {
  id: z.string().min(1),
  slug,
  status: z.enum(["draft", "review", "published", "archived"]).default("published"),
  isDemo: z.literal(true).default(true),
};

export const openingHoursSchema = z.object({
  days: z.array(z.number().int().min(1).max(7)).min(1),
  opens: time,
  closes: time,
});

export const hospitalSchema = z.object({
  name: z.string(),
  shortName: z.string(),
  legalName: z.string(),
  callCenterPhone: demoPhone,
  emergencyPhone: demoPhone,
  email: demoEmail,
  kepAddress: z.string(),
  socialLinks: z.array(z.object({ network: z.string(), url: z.url() })),
  stats: z.object({
    beds: z.number(),
    physicians: z.number(),
    founded: z.number(),
    branches: z.number(),
  }),
  /** Ziyaret kuralları tek kaynaktan (plan 13 "Hasta rehberi"). */
  visiting: z.object({ wards: z.string(), icu: z.string(), companionNote: z.string() }),
});

export const branchSchema = z.object({
  ...catalog,
  name: localizedText,
  district: z.string(),
  city: z.string(),
  address: z.string(),
  postalCode: z.string(),
  geo: z.object({ lat: z.number(), lng: z.number() }),
  phone: demoPhone,
  openingHours: z.array(openingHoursSchema),
  hasEmergency: z.boolean(),
  transport: z.array(z.string()),
  parking: z.string(),
  accessibility: z.array(z.string()),
});

export const departmentGroupSchema = z.object({
  id: z.string(),
  name: localizedText,
  order: z.number().int(),
});

export const departmentSchema = z.object({
  ...catalog,
  name: localizedText,
  groupId: z.string(),
  parentId: z.string().optional(),
  kind: z.enum(["clinical", "diagnostic", "emergency", "critical", "checkup"]),
  icon: z.string(),
  summary: localizedText,
  body: z.array(z.string()).default([]),
  conditionsTreated: z.array(z.string()).default([]),
  procedures: z.array(z.string()).default([]),
  technologyIds: z.array(z.string()).default([]),
  /** Şubedeki fiziksel konum. */
  locations: z.array(
    z.object({ branchId: z.string(), building: z.string(), floor: z.string(), hours: z.string() }),
  ),
  keywords: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  fullContent: z.boolean().default(false),
});

export const doctorSchema = z.object({
  ...catalog,
  title: z.enum([
    "Prof. Dr.",
    "Doç. Dr.",
    "Uzm. Dr.",
    "Op. Dr.",
    "Dr. Öğr. Üyesi",
    "Dt.",
    "Uzm. Dt.",
  ]),
  firstName: z.string(),
  lastName: z.string(),
  gender: z.enum(["f", "m"]),
  departmentIds: z.array(z.string()).min(1),
  primaryDepartmentId: z.string(),
  bio: localizedText,
  interests: z.array(z.string()).min(1),
  languages: z.array(z.string().length(2)).min(1),
  education: z.array(
    z.object({ institution: z.string(), degree: z.string(), year: z.number().int() }),
  ),
  experience: z.array(
    z.object({
      institution: z.string(),
      role: z.string(),
      from: z.number().int(),
      to: z.number().int().optional(),
    }),
  ),
  isActive: z.boolean().default(true),
  featured: z.boolean().default(false),
});

export const doctorScheduleSchema = z.object({
  doctorId: z.string(),
  branchId: z.string(),
  departmentId: z.string(),
  weekday: z.number().int().min(1).max(7),
  startTime: time,
  endTime: time,
  slotMinutes: z.number().int().positive(),
});

export const scheduleExceptionSchema = z.object({
  doctorId: z.string(),
  date: isoDate,
  type: z.enum(["leave", "congress", "extra"]),
});

export const technologySchema = z.object({
  id: z.string(),
  name: localizedText,
  description: localizedText,
  category: z.string(),
  icon: z.string(),
});

export const insuranceSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["public", "private", "corporate"]),
  coverageNotes: z.string(),
  branchIds: z.array(z.string()),
});

export const faqSchema = z.object({
  id: z.string(),
  question: localizedText,
  answer: localizedText,
  scope: z.enum(["global", "department", "appointment"]),
  departmentId: z.string().optional(),
  order: z.number().int(),
});

export const announcementSchema = z.object({
  ...catalog,
  title: localizedText,
  excerpt: localizedText,
  type: z.enum(["news", "announcement", "press", "event"]),
  publishedAt: isoDate,
  pinned: z.boolean().default(false),
  body: z.array(z.string()).min(1),
});

export const articleCategorySchema = z.object({ id: z.string(), slug, name: localizedText });

export const articleSchema = z
  .object({
    ...catalog,
    title: localizedText,
    excerpt: localizedText,
    categoryId: z.string(),
    tags: z.array(z.string()),
    departmentIds: z.array(z.string()),
    authorDoctorId: z.string(),
    medicalReviewerDoctorId: z.string().optional(),
    reviewedAt: isoDate.optional(),
    publishedAt: isoDate,
    readingMinutes: z.number().int().positive(),
    sections: z
      .array(z.object({ heading: z.string(), paragraphs: z.array(z.string()).min(1) }))
      .min(1),
    sources: z.array(z.object({ title: z.string(), url: z.url() })),
  })
  // Plan 8.3: yayımlanan her makalede tıbbi gözden geçiren ve tarih zorunlu.
  .refine((a) => a.status !== "published" || (a.medicalReviewerDoctorId && a.reviewedAt), {
    message: "Yayımlanan makalede medicalReviewerDoctorId ve reviewedAt zorunlu",
  });

export const pageSectionSchema = z.object({
  id: slug,
  heading: z.string(),
  paragraphs: z.array(z.string()).default([]),
  items: z.array(z.string()).default([]),
  /** Numaralı adımlar (ör. "ilk ziyaret" akışı). */
  steps: z.array(z.string()).default([]),
});

/** Kurumsal, hasta rehberi ve yasal bilgi sayfaları (plan 8.1 "Page"). */
export const pageSchema = z.object({
  path: z.string().regex(/^\/[a-z0-9-]+\/[a-z0-9-]+$/, "/bolum/slug"),
  section: z.enum(["corporate", "patient", "legal"]),
  /** Hasta rehberi grubu (plan 4.F). */
  group: z.enum(["before", "arriving", "inHospital", "leaving", "rights"]).optional(),
  title: z.string(),
  lead: z.string(),
  sections: z.array(pageSectionSchema).min(1),
  related: z.array(z.object({ label: z.string(), href: z.string().startsWith("/") })).default([]),
  updatedAt: isoDate,
  /** Yasal metinlerde "şablon metin" uyarısı gösterilir. */
  isTemplate: z.boolean().default(false),
});

/** Kampüs maketi: geometri ve bilgi aynı kayıttan (3D sahne + eşdeğer HTML liste). Birim: metre/10. */
export const campusBuildingSchema = z.object({
  id: slug,
  name: z.string(),
  description: z.string(),
  href: z.string().startsWith("/").optional(),
  kind: z.enum(["clinic", "emergency", "parking", "service"]),
  /** Taban merkezi (x, z). */
  position: z.tuple([z.number(), z.number()]),
  /** Genişlik, derinlik, yükseklik. */
  size: z.tuple([z.number().positive(), z.number().positive(), z.number().positive()]),
  floors: z.number().int().nonnegative(),
});

export const checkupPackageSchema = z.object({
  ...catalog,
  name: localizedText,
  summary: localizedText,
  includedTests: z.array(z.string()).min(1),
  durationMinutes: z.number().int(),
  audience: z.string(),
});

export type LocalizedText = z.infer<typeof localizedText>;
export type Hospital = z.infer<typeof hospitalSchema>;
export type Branch = z.infer<typeof branchSchema>;
export type DepartmentGroup = z.infer<typeof departmentGroupSchema>;
export type Department = z.infer<typeof departmentSchema>;
export type Doctor = z.infer<typeof doctorSchema>;
export type DoctorSchedule = z.infer<typeof doctorScheduleSchema>;
export type ScheduleException = z.infer<typeof scheduleExceptionSchema>;
export type Technology = z.infer<typeof technologySchema>;
export type InsuranceProvider = z.infer<typeof insuranceSchema>;
export type Faq = z.infer<typeof faqSchema>;
export type Announcement = z.infer<typeof announcementSchema>;
export type ArticleCategory = z.infer<typeof articleCategorySchema>;
export type Article = z.infer<typeof articleSchema>;
export type CheckupPackage = z.infer<typeof checkupPackageSchema>;
export type Page = z.infer<typeof pageSchema>;
export type CampusBuilding = z.infer<typeof campusBuildingSchema>;
