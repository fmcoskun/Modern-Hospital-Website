import { MaterialIcon } from "@/components/ui/Icon";
import type { Metadata } from "next";
import Link from "next/link";
import { telHref } from "@/components/layout/navigation";
import { Breadcrumb, Card, Container, PageHeader } from "@/components/ui/Layout";
import { ContactForm } from "@/features/contact/ContactForm";
import { getDictionary } from "@/i18n";
import { data } from "@/lib/data";
import { routes } from "@/lib/routes";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    title: t.contact.title,
    description: t.contact.lead,
    alternates: { canonical: routes.contact },
  };
}

export default async function ContactPage() {
  const t = await getDictionary();
  const c = t.contact;
  const hospital = await data.hospital.get();
  const link =
    "focus-ring inline-flex min-h-11 items-center gap-2 rounded font-semibold text-brand-700 underline-offset-4 hover:underline";
  return (
    <>
      <PageHeader
        image="banner-iletisim"
        title={c.title}
        lead={c.lead}
        breadcrumb={
          <Breadcrumb
            label={t.common.breadcrumb}
            items={[{ name: t.common.home, href: routes.home }, { name: c.title }]}
          />
        }
      />
      <Container className="grid gap-10 py-10 lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside aria-labelledby="channels">
          <Card className="p-6">
            <h2 id="channels" className="font-sans text-lg font-semibold">
              {c.channels}
            </h2>
            <dl className="mt-4 space-y-3">
              <div>
                <dt className="text-sm text-ink-muted">{t.common.emergencyLine}</dt>
                <dd>
                  <a href={telHref(hospital.emergencyPhone)} className={`${link} text-danger-600`}>
                    <MaterialIcon name="emergency" size={16} />
                    {hospital.emergencyPhone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-ink-muted">{t.common.callCenter}</dt>
                <dd>
                  <a href={telHref(hospital.callCenterPhone)} className={link}>
                    <MaterialIcon name="call" size={16} />
                    {hospital.callCenterPhone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-ink-muted">{c.fields.email}</dt>
                <dd>
                  <a href={`mailto:${hospital.email}`} className={link}>
                    <MaterialIcon name="mail" size={16} />
                    {hospital.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-ink-muted">{c.kep}</dt>
                <dd className="font-semibold break-all">{hospital.kepAddress}</dd>
              </div>
            </dl>
            <Link href={routes.locations} className={`${link} mt-4`}>
              <MaterialIcon name="location_on" size={16} />
              {t.nav.contactLinks.locations}
            </Link>
          </Card>
        </aside>
        <section aria-labelledby="form-title" className="relative max-w-2xl">
          <h2 id="form-title" className="mb-5 text-h2">
            {c.formTitle}
          </h2>
          <ContactForm labels={c} />
        </section>
      </Container>
    </>
  );
}
