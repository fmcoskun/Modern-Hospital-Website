import "server-only";
import type { Dictionary } from "@/i18n";
import { data } from "@/lib/data";
import { routes } from "@/lib/routes";

export interface NavLink {
  label: string;
  href: string;
  /** Mega menüde ikon kutucuğu (Material Symbols adı). */
  icon?: string;
}

/**
 * Menü modeli: üst öğe bir sayfaya gider; alt öğeler varsa açılır menüde listelenir.
 * `mega` menü iki sütunlu, ikon kutucuklu grid'dir.
 */
export interface NavEntry {
  id: string;
  label: string;
  href: string;
  links?: NavLink[];
  mega?: boolean;
}

export async function getNavigation(t: Dictionary): Promise<NavEntry[]> {
  const featured = await data.departments.featured();
  const n = t.nav;

  return [
    {
      id: "corporate",
      label: n.corporate,
      href: routes.about,
      links: [
        { label: n.corporateLinks.about, href: routes.about },
        { label: n.corporateLinks.facilities, href: routes.facilities },
        { label: n.corporateLinks.insurance, href: routes.insurance },
        { label: n.corporateLinks.quality, href: routes.quality },
      ],
    },
    {
      id: "units",
      label: n.units,
      href: routes.units,
      mega: true,
      links: [
        ...featured
          .slice(0, 7)
          .map((d) => ({ label: d.name.tr, href: routes.unit(d.slug), icon: d.icon })),
        { label: n.allUnits, href: routes.units, icon: "category" },
      ],
    },
    { id: "doctors", label: n.doctors, href: routes.doctors },
    {
      id: "patient",
      label: n.patientGuide,
      href: routes.patientGuide,
      links: [
        { label: n.patientLinks.firstVisit, href: routes.firstVisit },
        { label: n.patientLinks.transport, href: routes.transport },
        { label: n.patientLinks.visiting, href: routes.visiting },
        { label: n.patientLinks.rights, href: routes.rights },
        { label: n.patientLinks.eResult, href: routes.eResult },
        { label: n.patientLinks.accessibility, href: routes.accessibilityFacilities },
        { label: n.patientLinks.faq, href: routes.faq },
      ],
    },
    {
      id: "health",
      label: n.healthGuide,
      href: routes.articles,
      links: [
        { label: n.healthLinks.articles, href: routes.articles },
        { label: n.healthLinks.announcements, href: routes.announcements },
      ],
    },
    {
      id: "contact",
      label: n.contact,
      href: routes.contact,
      links: [
        { label: n.contactLinks.contact, href: routes.contact },
        { label: n.contactLinks.locations, href: routes.locations },
      ],
    },
  ];
}

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
