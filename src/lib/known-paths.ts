import { data } from "@/lib/data";
import { routes } from "@/lib/routes";

/** Veriye bağlı olmayan, elle yazılmış sayfalar. */
export const staticPaths = [
  routes.home,
  routes.units,
  routes.doctors,
  routes.appointment,
  routes.articles,
  routes.announcements,
  routes.locations,
  routes.contact,
  routes.search,
  routes.facilities,
  routes.insurance,
  routes.patientGuide,
  routes.transport,
  routes.visiting,
  routes.faq,
  routes.aboutDemo,
] as const;

/**
 * Sitede gerçekten var olan tüm yollar (sitemap ve proxy için tek liste). proxy bilinmeyen
 * yolları prerender edilmiş 404 sayfasına yönlendirir; böylece ilk istekte de doğru 404 döner.
 */
export async function listKnownPaths(): Promise<string[]> {
  const [departments, doctors, articles, categories, branches, announcements, pages] =
    await Promise.all([
      data.departments.list(),
      data.doctors.list(),
      data.articles.list(),
      data.articles.categories(),
      data.branches.list(),
      data.announcements.list(),
      data.pages.list(),
    ]);
  return [
    ...staticPaths,
    ...pages.map((p) => p.path),
    ...departments.map((d) => routes.unit(d.slug)),
    ...doctors.map((d) => routes.doctor(d.slug)),
    ...articles.map((a) => routes.article(a.slug)),
    ...categories.map((c) => routes.articleCategory(c.slug)),
    ...branches.map((b) => routes.location(b.slug)),
    ...announcements.map((a) => routes.announcement(a.slug)),
  ];
}

let cache: Promise<Set<string>> | undefined;

export async function isKnownPath(pathname: string): Promise<boolean> {
  cache ??= listKnownPaths().then((paths) => new Set(paths));
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return (await cache).has(clean);
}
