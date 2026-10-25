import "server-only";
import { data } from "@/lib/data";
import { routes } from "@/lib/routes";
import { normalizeTr } from "@/lib/text";

export type SiteResultType =
  "doctor" | "department" | "article" | "page" | "announcement" | "location";

export interface SiteResult {
  type: SiteResultType;
  title: string;
  snippet: string;
  href: string;
}

interface Doc extends SiteResult {
  /** Başlık ve gövde ayrı normalize edilir; başlık eşleşmesi daha yüksek puan alır. */
  nTitle: string;
  nBody: string;
}

let index: Promise<Doc[]> | undefined;

async function build(): Promise<Doc[]> {
  const [doctors, departments, articles, pages, announcements, branches] = await Promise.all([
    data.doctors.list(),
    data.departments.list(),
    data.articles.list(),
    data.pages.list(),
    data.announcements.list(),
    data.branches.list(),
  ]);
  const deptName = (id: string) => departments.find((d) => d.id === id)?.name.tr ?? "";
  const docs: (SiteResult & { body: string })[] = [];
  const add = (r: SiteResult, body: string) => docs.push({ ...r, body });

  for (const d of doctors)
    add(
      {
        type: "doctor",
        title: `${d.title} ${d.firstName} ${d.lastName}`,
        snippet: `${deptName(d.primaryDepartmentId)} · ${d.interests.join(", ")}`,
        href: routes.doctor(d.slug),
      },
      `${d.interests.join(" ")} ${deptName(d.primaryDepartmentId)}`,
    );
  for (const d of departments)
    add(
      { type: "department", title: d.name.tr, snippet: d.summary.tr, href: routes.unit(d.slug) },
      [d.summary.tr, ...d.body, ...d.conditionsTreated, ...d.procedures, ...d.keywords].join(" "),
    );
  for (const a of articles)
    add(
      { type: "article", title: a.title.tr, snippet: a.excerpt.tr, href: routes.article(a.slug) },
      [a.excerpt.tr, ...a.tags, ...a.sections.flatMap((s) => [s.heading, ...s.paragraphs])].join(
        " ",
      ),
    );
  for (const p of pages)
    add(
      { type: "page", title: p.title, snippet: p.lead, href: p.path },
      [
        p.lead,
        ...p.sections.flatMap((s) => [s.heading, ...s.paragraphs, ...s.items, ...s.steps]),
      ].join(" "),
    );
  for (const a of announcements)
    add(
      {
        type: "announcement",
        title: a.title.tr,
        snippet: a.excerpt.tr,
        href: routes.announcement(a.slug),
      },
      [a.excerpt.tr, ...a.body].join(" "),
    );
  for (const b of branches)
    add(
      {
        type: "location",
        title: b.name.tr,
        snippet: `${b.address}, ${b.district}`,
        href: routes.location(b.slug),
      },
      [b.district, b.city, ...b.transport, b.parking].join(" "),
    );

  return docs.map(({ body, ...r }) => ({
    ...r,
    nTitle: normalizeTr(r.title),
    nBody: normalizeTr(`${r.snippet} ${body}`),
  }));
}

/** Tüm kelimeleri içeren sonuçlar; başlık eşleşmesi > gövde eşleşmesi. En çok 50 sonuç. */
export async function searchSite(query: string): Promise<SiteResult[]> {
  const q = normalizeTr(query).slice(0, 80);
  if (q.length < 2) return [];
  const tokens = q.split(" ");
  index ??= build();
  return (await index)
    .map((d) => {
      let score = 0;
      for (const tk of tokens) {
        if (d.nTitle.includes(tk)) score += d.nTitle.startsWith(tk) ? 3 : 2;
        else if (d.nBody.includes(tk)) score += 1;
        else return null;
      }
      return { d, score };
    })
    .filter((x) => x !== null)
    .sort((a, b) => b.score - a.score || a.d.title.localeCompare(b.d.title, "tr"))
    .slice(0, 50)
    .map(({ d }) => ({ type: d.type, title: d.title, snippet: d.snippet, href: d.href }));
}
