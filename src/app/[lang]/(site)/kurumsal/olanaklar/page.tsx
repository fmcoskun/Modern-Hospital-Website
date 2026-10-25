import type { Metadata } from "next";
import { FeatureCard } from "@/components/cards/Cards";
import { CampusIllustration } from "@/components/home/CampusIllustration";
import { Breadcrumb, Container, PageHeader } from "@/components/ui/Layout";
import { ExploreCampus } from "@/features/scene3d";
import { getDictionary } from "@/i18n";
import { data } from "@/lib/data";
import { routes } from "@/lib/routes";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    title: t.facilities.title,
    description: t.facilities.lead,
    alternates: { canonical: routes.facilities },
  };
}

/** Etkileşimli kampüs ("explore" modu); bina listesi 3D olmadan da aynı bilgiyi sunar. */
export default async function FacilitiesPage() {
  const t = await getDictionary();
  const f = t.facilities;
  const [technologies, buildings] = await Promise.all([
    data.technologies.list(),
    data.campus.buildings(),
  ]);
  return (
    <>
      <PageHeader
        image="banner-kurumsal"
        title={f.title}
        lead={f.lead}
        breadcrumb={
          <Breadcrumb
            label={t.common.breadcrumb}
            items={[
              { name: t.common.home, href: routes.home },
              { name: t.nav.corporate, href: routes.about },
              { name: f.title },
            ]}
          />
        }
      />
      <Container className="py-10">
        <section aria-labelledby="campus">
          <h2 id="campus" className="mb-5 text-h2">
            {f.campus}
          </h2>
          <ExploreCampus
            buildings={buildings}
            labels={t.scene3d}
            poster={<CampusIllustration buildings={buildings} className="size-full" />}
          />
          <p className="mt-3 text-sm text-ink-muted">{f.campusNote}</p>
        </section>
        <section aria-labelledby="tech" className="mt-16">
          <h2 id="tech" className="mb-5 text-h2">
            {f.technologies}
          </h2>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {technologies.map((tech) => (
              <li key={tech.id}>
                <FeatureCard tech={tech} />
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </>
  );
}
