import "server-only";
import { data } from "@/lib/data";
import { routes } from "@/lib/routes";
import { normalizeTr } from "@/lib/text";
import type { SearchItem } from "./types";

/** Build zamanında üretilen küçük arama indeksi: doktorlar, bölümler, hastalık/şikayet → bölüm. */
export async function buildSearchIndex(): Promise<SearchItem[]> {
  const [doctors, departments] = await Promise.all([data.doctors.list(), data.departments.list()]);
  const deptById = new Map(departments.map((d) => [d.id, d]));
  const items: SearchItem[] = [];

  for (const d of departments) {
    items.push({
      id: `dept-${d.id}`,
      type: "department",
      label: d.name.tr,
      sub: d.summary.tr,
      href: routes.unit(d.slug),
      terms: normalizeTr(d.name.tr),
    });
  }
  for (const doc of doctors) {
    const dept = deptById.get(doc.primaryDepartmentId);
    items.push({
      id: `doc-${doc.id}`,
      type: "doctor",
      label: `${doc.title} ${doc.firstName} ${doc.lastName}`,
      sub: dept?.name.tr ?? "",
      href: routes.doctor(doc.slug),
      terms: normalizeTr(`${doc.firstName} ${doc.lastName} ${doc.interests.join(" ")}`),
    });
  }
  const seen = new Set<string>();
  for (const d of departments) {
    if (d.kind === "emergency") continue;
    for (const term of [...d.conditionsTreated, ...d.keywords]) {
      const key = `${normalizeTr(term)}|${d.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      items.push({
        id: `cond-${key}`,
        type: "condition",
        label: term,
        sub: d.name.tr,
        href: `${routes.doctors}?bolum=${d.slug}`,
        terms: normalizeTr(term),
      });
    }
  }
  return items;
}
