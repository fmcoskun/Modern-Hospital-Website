import { MaterialIcon } from "@/components/ui/Icon";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb, Container, PageHeader } from "@/components/ui/Layout";
import { getDictionary } from "@/i18n";
import { data, type Page } from "@/lib/data";
import { routes } from "@/lib/routes";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    title: t.patientGuide.title,
    description: t.patientGuide.lead,
    alternates: { canonical: routes.patientGuide },
  };
}

type Group = NonNullable<Page["group"]>;
const order: Group[] = ["before", "arriving", "inHospital", "leaving", "rights"];

/** Kullanıcı ihtiyacına göre 5 grup (plan 4.F); bilgi sayfaları + veriye dayalı sayfalar. */
export default async function PatientGuidePage() {
  const t = await getDictionary();
  const g = t.patientGuide;
  const pages = await data.pages.list("patient");
  const extra: Record<Group, { title: string; lead: string; href: string }[]> = {
    before: [],
    arriving: [{ title: g.transportTitle, lead: g.transportLead, href: routes.transport }],
    inHospital: [{ title: g.visitingTitle, lead: g.visitingLead, href: routes.visiting }],
    leaving: [],
    rights: [{ title: g.faqTitle, lead: g.faqLead, href: routes.faq }],
  };

  return (
    <>
      <PageHeader
        image="banner-hasta"
        title={g.title}
        lead={g.lead}
        breadcrumb={
          <Breadcrumb
            label={t.common.breadcrumb}
            items={[{ name: t.common.home, href: routes.home }, { name: g.title }]}
          />
        }
      />
      <Container className="space-y-12 py-10">
        {order.map((group) => {
          const items = [
            ...pages
              .filter((p) => p.group === group)
              .map((p) => ({ title: p.title, lead: p.lead, href: p.path })),
            ...extra[group],
          ];
          return (
            <section key={group} aria-labelledby={`g-${group}`}>
              <h2 id={`g-${group}`} className="mb-5 text-h2">
                {g.groups[group]}
              </h2>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((i) => (
                  <li key={i.href}>
                    <Link
                      href={i.href}
                      className="group flex h-full flex-col rounded-card neu-raised p-5 focus-ring transition-transform duration-150 hover:-translate-y-0.5"
                    >
                      <span className="flex items-center justify-between gap-3 font-sans text-lg font-semibold">
                        {i.title}
                        <MaterialIcon name="arrow_forward" className="shrink-0 text-brand-600" />
                      </span>
                      <span className="mt-1 text-[0.95rem] text-ink-muted">{i.lead}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </Container>
    </>
  );
}
