import { MaterialIcon } from "@/components/ui/Icon";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { telHref } from "@/components/layout/navigation";
import { JsonLd, breadcrumbLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Feedback";
import { Breadcrumb, Card, Container, PageHeader } from "@/components/ui/Layout";
import { ConsentMap } from "@/features/branches/ConsentMap";
import { getDictionary } from "@/i18n";
import { data } from "@/lib/data";
import { env } from "@/lib/env";
import { branchPhoto } from "@/lib/photos";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await data.branches.list()).map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const b = await data.branches.getBySlug((await params).slug);
  if (!b) return {};
  return {
    title: b.name.tr,
    description: `${b.address}, ${b.district}/${b.city}`,
    alternates: { canonical: routes.location(b.slug) },
  };
}

const dayNames = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const schemaDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default async function LocationPage({ params }: Props) {
  const { slug } = await params;
  const branch = await data.branches.getBySlug(slug);
  if (!branch) notFound();

  const t = await getDictionary();
  const l = t.locations;
  const [hospital, departments] = await Promise.all([data.hospital.get(), data.departments.list()]);
  const here = departments.filter((d) => d.locations.some((x) => x.branchId === branch.id));
  const crumbs = [
    { name: t.common.home, href: routes.home },
    { name: l.title, href: routes.locations },
    { name: branch.name.tr, href: routes.location(branch.slug) },
  ];
  const dirUrl = `https://www.openstreetmap.org/directions?to=${branch.geo.lat}%2C${branch.geo.lng}`;

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": branch.hasEmergency ? ["Hospital", "EmergencyService"] : "MedicalClinic",
            name: `${hospital.name} ${branch.name.tr}`,
            telephone: branch.phone,
            address: {
              "@type": "PostalAddress",
              streetAddress: branch.address,
              addressLocality: branch.district,
              addressRegion: branch.city,
              postalCode: branch.postalCode,
              addressCountry: "TR",
            },
            geo: { "@type": "GeoCoordinates", latitude: branch.geo.lat, longitude: branch.geo.lng },
            openingHoursSpecification: branch.openingHours.map((o) => ({
              "@type": "OpeningHoursSpecification",
              dayOfWeek: o.days.map((d) => schemaDays[d - 1]),
              opens: o.opens,
              closes: o.closes,
            })),
            url: new URL(routes.location(branch.slug), env.NEXT_PUBLIC_SITE_URL).toString(),
          },
          breadcrumbLd(env.NEXT_PUBLIC_SITE_URL, crumbs),
        ]}
      />
      <PageHeader
        image={branchPhoto(branch.slug)}
        breadcrumb={<Breadcrumb label={t.common.breadcrumb} items={crumbs} />}
        eyebrow={
          branch.hasEmergency && (
            <Badge tone="danger">
              <MaterialIcon name="emergency" size={14} /> {t.common.emergency} 7/24
            </Badge>
          )
        }
        title={branch.name.tr}
        lead={
          <address className="flex items-start gap-2 not-italic">
            <MaterialIcon name="location_on" className="mt-1 shrink-0" />
            {branch.address}, {branch.postalCode} {branch.district}/{branch.city}
          </address>
        }
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href={telHref(branch.phone)} icon={<MaterialIcon name="call" />}>
            {branch.phone}
          </ButtonLink>
          <ButtonLink
            href={dirUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="onDark"
            icon={<MaterialIcon name="location_on" />}
          >
            {t.common.directions}
          </ButtonLink>
        </div>
      </PageHeader>
      <Container className="pb-12">
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="flex items-center gap-2 font-sans text-lg font-semibold">
                <MaterialIcon name="schedule" className="text-brand-600" /> {l.hours}
              </h2>
              <ul className="mt-3 space-y-1">
                {branch.openingHours.map((o) => (
                  <li key={o.days.join()}>
                    <span className="font-semibold">
                      {o.days.length > 1
                        ? `${dayNames[o.days[0]! - 1]}–${dayNames[o.days.at(-1)! - 1]}`
                        : dayNames[o.days[0]! - 1]}
                    </span>
                    : {o.opens}–{o.closes}
                  </li>
                ))}
                {branch.hasEmergency && (
                  <li className="font-semibold text-danger-600">{t.common.emergency}: 7/24</li>
                )}
              </ul>
            </Card>
            <Card className="p-6">
              <h2 className="flex items-center gap-2 font-sans text-lg font-semibold">
                <MaterialIcon name="directions_bus" className="text-brand-600" /> {l.transport}
              </h2>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                {branch.transport.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <h2 className="mt-6 flex items-center gap-2 font-sans text-lg font-semibold">
                <MaterialIcon name="directions_car" className="text-brand-600" /> {l.parking}
              </h2>
              <p className="mt-2">{branch.parking}</p>
              <h2 className="mt-6 flex items-center gap-2 font-sans text-lg font-semibold">
                <MaterialIcon name="accessible" className="text-brand-600" /> {l.accessibility}
              </h2>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                {branch.accessibility.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </Card>
          </div>
          <div>
            <h2 className="sr-only">{l.map}</h2>
            <ConsentMap
              lat={branch.geo.lat}
              lng={branch.geo.lng}
              title={`${l.map}: ${branch.name.tr}`}
              labels={{ consent: l.mapConsent, load: l.loadMap }}
            />
            <h2 className="mt-8 text-h3">{l.units}</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {here.map((d) => (
                <li key={d.id}>
                  <Link
                    href={routes.unit(d.slug)}
                    className="inline-flex min-h-11 items-center rounded-input border border-control bg-raised px-4 font-medium focus-ring hover:bg-brand-100"
                  >
                    {d.name.tr}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </>
  );
}
