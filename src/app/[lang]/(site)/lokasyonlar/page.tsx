import type { Metadata } from "next";
import { BranchCard } from "@/components/cards/Cards";
import { Alert } from "@/components/ui/Feedback";
import { NearestBranches } from "@/features/branches/NearestBranches";
import { Breadcrumb, Container, PageHeader } from "@/components/ui/Layout";
import { getDictionary } from "@/i18n";
import { data } from "@/lib/data";
import { routes } from "@/lib/routes";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    title: t.locations.title,
    description: t.locations.lead,
    alternates: { canonical: routes.locations },
  };
}

export default async function LocationsPage() {
  const t = await getDictionary();
  const branches = await data.branches.list();
  return (
    <>
      <PageHeader
        image="banner-iletisim"
        title={t.locations.title}
        lead={t.locations.lead}
        breadcrumb={
          <Breadcrumb
            label={t.common.breadcrumb}
            items={[{ name: t.common.home, href: routes.home }, { name: t.locations.title }]}
          />
        }
      />
      <Container className="py-10">
        <Alert tone="error" className="mb-8">
          {t.locations.call112}
        </Alert>
        <NearestBranches
          labels={t.nearest}
          items={branches.map((b) => ({
            id: b.id,
            geo: b.geo,
            node: (
              <BranchCard branch={b} t={t}>
                <p className="mt-3 text-sm text-ink-muted">{b.parking}</p>
              </BranchCard>
            ),
          }))}
        />
      </Container>
    </>
  );
}
