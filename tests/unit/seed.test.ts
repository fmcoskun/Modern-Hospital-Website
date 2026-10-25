import { describe, expect, it } from "vitest";
import { articleCategories, articles } from "@/content/seed/articles";
import {
  announcements,
  checkupPackages,
  faqs,
  insuranceProviders,
  technologies,
} from "@/content/seed/catalog";
import { departmentGroups, departments } from "@/content/seed/departments";
import { doctorSchedules, doctors, scheduleExceptions } from "@/content/seed/doctors";
import { branches, hospital } from "@/content/seed/hospital";
import { pages } from "@/content/seed/pages";
import { campusBuildings } from "@/content/seed/campus";
import * as s from "@/lib/data/schemas";
import { isIconName } from "@/components/ui/Icon";

const ids = <T extends { id: string }>(xs: T[]) => new Set(xs.map((x) => x.id));

describe("seed şema doğrulaması", () => {
  const cases: [string, { parse: (v: unknown) => unknown }, unknown[]][] = [
    ["branches", s.branchSchema, branches],
    ["departmentGroups", s.departmentGroupSchema, departmentGroups],
    ["departments", s.departmentSchema, departments],
    ["doctors", s.doctorSchema, doctors],
    ["schedules", s.doctorScheduleSchema, doctorSchedules],
    ["exceptions", s.scheduleExceptionSchema, scheduleExceptions],
    ["technologies", s.technologySchema, technologies],
    ["insurance", s.insuranceSchema, insuranceProviders],
    ["faqs", s.faqSchema, faqs],
    ["announcements", s.announcementSchema, announcements],
    ["articleCategories", s.articleCategorySchema, articleCategories],
    ["articles", s.articleSchema, articles],
    ["checkups", s.checkupPackageSchema, checkupPackages],
    ["pages", s.pageSchema, pages],
    ["campus", s.campusBuildingSchema, campusBuildings],
  ];
  it.each(cases)("%s şemaya uyar", (_, schema, items) => {
    for (const item of items) expect(() => schema.parse(item)).not.toThrow();
  });
  it("hastane kaydı şemaya uyar", () =>
    expect(() => s.hospitalSchema.parse(hospital)).not.toThrow());

  it("hatalı kayıt reddedilir (gerçek telefon kalıbı, geçersiz slug, reviewer'sız makale)", () => {
    expect(() => s.branchSchema.parse({ ...branches[0], phone: "0 (212) 555 12 34" })).toThrow();
    expect(() =>
      s.departmentSchema.parse({ ...departments[0], slug: "Kardiyoloji Bölümü" }),
    ).toThrow();
    expect(() =>
      s.articleSchema.parse({ ...articles[0], medicalReviewerDoctorId: undefined }),
    ).toThrow();
  });
});

describe("plan 8.5 miktarları", () => {
  it("3 şube, 20+ bölüm, 40–60 doktor, 12 makale, 6 duyuru, 8 sigorta, 3 check-up", () => {
    expect(branches).toHaveLength(3);
    expect(departments.length).toBeGreaterThanOrEqual(20);
    expect(doctors.length).toBeGreaterThanOrEqual(40);
    expect(doctors.length).toBeLessThanOrEqual(60);
    expect(articles).toHaveLength(12);
    expect(announcements).toHaveLength(6);
    expect(insuranceProviders).toHaveLength(8);
    expect(checkupPackages).toHaveLength(3);
    expect(departments.filter((d) => d.fullContent).length).toBeGreaterThanOrEqual(12);
  });
});

describe("referans bütünlüğü", () => {
  const deptIds = ids(departments);
  const branchIds = ids(branches);
  const doctorIds = ids(doctors);
  const techIds = ids(technologies);
  const groupIds = ids(departmentGroups);

  it("bölümlerin grup, teknoloji ve şube referansları mevcut", () => {
    for (const d of departments) {
      expect(groupIds, d.id).toContain(d.groupId);
      for (const t of d.technologyIds) expect(techIds, d.id).toContain(t);
      for (const l of d.locations) expect(branchIds, d.id).toContain(l.branchId);
    }
  });

  it("her doctor.departmentId mevcut ve birincil bölüm listede", () => {
    for (const doc of doctors) {
      for (const id of doc.departmentIds) expect(deptIds, doc.id).toContain(id);
      expect(doc.departmentIds).toContain(doc.primaryDepartmentId);
    }
  });

  it("programlar yalnız bölümün bulunduğu şubelerde", () => {
    for (const sc of doctorSchedules) {
      expect(doctorIds).toContain(sc.doctorId);
      const dept = departments.find((d) => d.id === sc.departmentId)!;
      expect(
        dept.locations.map((l) => l.branchId),
        sc.doctorId,
      ).toContain(sc.branchId);
    }
  });

  it("her doktorun en az bir program kaydı var", () => {
    for (const doc of doctors)
      expect(
        doctorSchedules.some((x) => x.doctorId === doc.id),
        doc.id,
      ).toBe(true);
  });

  it("makale yazarı ve gözden geçireni mevcut ve farklı kişi", () => {
    for (const a of articles) {
      expect(doctorIds).toContain(a.authorDoctorId);
      expect(doctorIds).toContain(a.medicalReviewerDoctorId);
      expect(a.authorDoctorId, a.id).not.toBe(a.medicalReviewerDoctorId);
      for (const d of a.departmentIds) expect(deptIds).toContain(d);
    }
  });

  it("SSS ve sigorta referansları mevcut", () => {
    for (const f of faqs) if (f.departmentId) expect(deptIds).toContain(f.departmentId);
    for (const i of insuranceProviders) for (const b of i.branchIds) expect(branchIds).toContain(b);
  });
});

describe("slug ve id benzersizliği", () => {
  it.each([
    ["departments", departments],
    ["doctors", doctors],
    ["branches", branches],
    ["articles", articles],
    ["announcements", announcements],
  ] as const)("%s", (_, xs) => {
    const list = xs as readonly { id: string; slug: string }[];
    expect(new Set(list.map((x) => x.slug)).size).toBe(list.length);
    expect(new Set(list.map((x) => x.id)).size).toBe(list.length);
  });
});

describe("kurgusal veri güvencesi", () => {
  it("lorem ipsum, gmail ve cep telefonu kalıbı yok", () => {
    const blob = JSON.stringify({ hospital, branches, doctors, articles, announcements });
    expect(blob).not.toMatch(/lorem ipsum/i);
    expect(blob).not.toMatch(/@gmail\.com/i);
    expect(blob).not.toMatch(/\b0?5\d{2}[ -]?\d{3}[ -]?\d{2}[ -]?\d{2}\b/);
  });
});

describe("bilgi sayfaları", () => {
  it("yollar benzersiz; yasal şablonlar işaretli; hasta rehberi sayfalarında grup var", () => {
    expect(new Set(pages.map((p) => p.path)).size).toBe(pages.length);
    for (const p of pages) {
      if (p.section === "patient") expect(p.group, p.path).toBeDefined();
      expect(
        p.path.startsWith(
          { corporate: "/kurumsal/", patient: "/hasta-rehberi/", legal: "/yasal/" }[p.section],
        ),
      ).toBe(true);
    }
    expect(
      pages
        .filter((p) => p.path.startsWith("/yasal/") && p.path !== "/yasal/erisilebilirlik")
        .every((p) => p.isTemplate),
    ).toBe(true);
  });
});

it("seed'deki tüm ikon adları indirilen Material Symbols alt kümesinde", () => {
  for (const x of [...departments, ...technologies])
    expect(isIconName(x.icon), `${x.id}: ${x.icon}`).toBe(true);
});
