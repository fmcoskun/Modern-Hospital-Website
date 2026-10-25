import type { Metadata } from "next";
import { Alert } from "@/components/ui/Feedback";
import { Breadcrumb, Container, PageHeader } from "@/components/ui/Layout";
import { InsuranceDirectory } from "@/features/insurance/InsuranceDirectory";
import { getDictionary } from "@/i18n";
import { data } from "@/lib/data";
import { routes } from "@/lib/routes";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    title: t.insurancePage.title,
    description: t.insurancePage.lead,
    alternates: { canonical: routes.insurance },
  };
}

export default async function InsurancePage() {
  const t = await getDictionary();
  const p = t.insurancePage;
  const [providers, branches] = await Promise.all([data.insurance.list(), data.branches.list()]);
  return (
    <>
      <PageHeader
        image="banner-kurumsal"
        title={p.title}
        lead={p.lead}
        breadcrumb={
          <Breadcrumb
            label={t.common.breadcrumb}
            items={[
              { name: t.common.home, href: routes.home },
              { name: t.nav.corporate, href: routes.about },
              { name: p.title },
            ]}
          />
        }
      />
      <Container className="py-10">
        <Alert tone="info" className="mb-8 max-w-3xl">
          {p.note}
        </Alert>
        <InsuranceDirectory
          labels={p}
          items={providers.map((i) => ({
            id: i.id,
            name: i.name,
            type: i.type,
            coverageNotes: i.coverageNotes,
            branches: i.branchIds.map((id) => branches.find((b) => b.id === id)?.name.tr ?? id),
          }))}
        />
      </Container>
    </>
  );
}
