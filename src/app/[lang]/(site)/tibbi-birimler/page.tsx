import type { Metadata } from "next";
import { JsonLd, breadcrumbLd } from "@/components/seo/JsonLd";
import { Breadcrumb, Container, PageHeader } from "@/components/ui/Layout";
import { UnitDirectory } from "@/features/departments/UnitDirectory";
import { getDictionary } from "@/i18n";
import { data } from "@/lib/data";
import { env } from "@/lib/env";
import { routes } from "@/lib/routes";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    title: t.units.title,
    description: t.units.lead,
    alternates: { canonical: routes.units },
  };
}

export default async function UnitsPage() {
  const t = await getDictionary();
  const [departments, groups] = await Promise.all([
    data.departments.list(),
    data.departments.groups(),
  ]);
  const crumbs = [
    { name: t.common.home, href: routes.home },
    { name: t.units.title, href: routes.units },
  ];
  return (
    <>
      <JsonLd data={breadcrumbLd(env.NEXT_PUBLIC_SITE_URL, crumbs)} />
      <PageHeader
        image="banner-birimler"
        title={t.units.title}
        lead={t.units.lead}
        breadcrumb={<Breadcrumb label={t.common.breadcrumb} items={crumbs} />}
      />
      <Container className="py-10">
        <UnitDirectory
          units={departments.map((d) => ({
            slug: d.slug,
            name: d.name.tr,
            icon: d.icon,
            groupId: d.groupId,
            keywords: d.keywords,
          }))}
          groups={groups.map((g) => ({ id: g.id, name: g.name.tr }))}
          labels={{
            grouped: t.units.viewGrouped,
            az: t.units.viewAz,
            filter: t.units.filterLabel,
            placeholder: t.units.filterPlaceholder,
            noMatch: t.units.noMatch,
            count: t.units.count,
          }}
        />
      </Container>
    </>
  );
}
