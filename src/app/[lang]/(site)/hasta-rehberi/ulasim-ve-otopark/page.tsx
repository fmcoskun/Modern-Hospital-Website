import { MaterialIcon } from "@/components/ui/Icon";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb, Card, Container, PageHeader } from "@/components/ui/Layout";
import { getDictionary } from "@/i18n";
import { data } from "@/lib/data";
import { routes } from "@/lib/routes";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    title: t.patientGuide.transportTitle,
    description: t.patientGuide.transportLead,
    alternates: { canonical: routes.transport },
  };
}

/** Ulaşım/otopark bilgisi şube kayıtlarından gelir — lokasyon sayfalarıyla tek kaynak (plan 13). */
export default async function TransportPage() {
  const t = await getDictionary();
  const g = t.patientGuide;
  const branches = await data.branches.list();
  return (
    <>
      <PageHeader
        image="banner-hasta"
        title={g.transportTitle}
        lead={g.transportLead}
        breadcrumb={
          <Breadcrumb
            label={t.common.breadcrumb}
            items={[
              { name: t.common.home, href: routes.home },
              { name: g.title, href: routes.patientGuide },
              { name: g.transportTitle },
            ]}
          />
        }
      />
      <Container className="grid gap-6 py-10 lg:grid-cols-3">
        {branches.map((b) => (
          <Card key={b.id} className="p-6">
            <h2 className="font-sans text-lg font-semibold">
              <Link
                href={routes.location(b.slug)}
                className="rounded focus-ring hover:text-brand-600 hover:underline"
              >
                {b.name.tr}
              </Link>
            </h2>
            <p className="mt-1 flex gap-1.5 text-ink-muted">
              <MaterialIcon name="location_on" size={16} className="mt-1 shrink-0" />
              {b.address}, {b.district}
            </p>
            <h3 className="mt-5 flex items-center gap-2 font-sans text-base font-semibold">
              <MaterialIcon name="directions_bus" className="text-brand-600" />{" "}
              {t.locations.transport}
            </h3>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {b.transport.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <h3 className="mt-5 flex items-center gap-2 font-sans text-base font-semibold">
              <MaterialIcon name="directions_car" className="text-brand-600" />{" "}
              {t.locations.parking}
            </h3>
            <p className="mt-2">{b.parking}</p>
            <h3 className="mt-5 flex items-center gap-2 font-sans text-base font-semibold">
              <MaterialIcon name="accessible" className="text-brand-600" />{" "}
              {t.locations.accessibility}
            </h3>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {b.accessibility.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </Card>
        ))}
      </Container>
    </>
  );
}
