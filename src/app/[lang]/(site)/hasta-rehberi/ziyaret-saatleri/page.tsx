import { MaterialIcon } from "@/components/ui/Icon";
import type { Metadata } from "next";
import { Alert } from "@/components/ui/Feedback";
import { Breadcrumb, Card, Container, PageHeader } from "@/components/ui/Layout";
import { getDictionary } from "@/i18n";
import { data } from "@/lib/data";
import { routes } from "@/lib/routes";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    title: t.patientGuide.visitingTitle,
    description: t.patientGuide.visitingLead,
    alternates: { canonical: routes.visiting },
  };
}

/** Ziyaret saatleri hastane kaydından gelir (tek kaynak). */
export default async function VisitingPage() {
  const t = await getDictionary();
  const g = t.patientGuide;
  const { visiting } = await data.hospital.get();
  const cards = [
    { icon: "schedule" as const, title: g.wards, body: visiting.wards },
    { icon: "bed" as const, title: g.icu, body: visiting.icu },
    { icon: "person" as const, title: g.companion, body: visiting.companionNote },
  ];
  return (
    <>
      <PageHeader
        image="banner-hasta"
        title={g.visitingTitle}
        lead={g.visitingLead}
        breadcrumb={
          <Breadcrumb
            label={t.common.breadcrumb}
            items={[
              { name: t.common.home, href: routes.home },
              { name: g.title, href: routes.patientGuide },
              { name: g.visitingTitle },
            ]}
          />
        }
      />
      <Container className="py-10">
        <ul className="grid gap-5 md:grid-cols-3">
          {cards.map(({ icon, title, body }) => (
            <li key={title}>
              <Card className="h-full p-6">
                <MaterialIcon name={icon} size={32} className="text-brand-600" />
                <h2 className="mt-3 font-sans text-lg font-semibold">{title}</h2>
                <p className="mt-1 text-lg">{body}</p>
              </Card>
            </li>
          ))}
        </ul>
        <Alert tone="info" className="mt-8 max-w-3xl">
          <ul className="list-disc space-y-1 pl-5">
            {g.visitingRules.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </Alert>
      </Container>
    </>
  );
}
