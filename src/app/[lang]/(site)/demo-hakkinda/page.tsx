import type { Metadata } from "next";
import { Breadcrumb, Container, PageHeader } from "@/components/ui/Layout";
import { getDictionary } from "@/i18n";
import { routes } from "@/lib/routes";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.demoPage.title, alternates: { canonical: routes.aboutDemo } };
}

export default async function AboutDemoPage() {
  const t = await getDictionary();
  const d = t.demoPage;
  return (
    <>
      <PageHeader
        image="banner-genel"
        title={d.title}
        breadcrumb={
          <Breadcrumb
            label={t.common.breadcrumb}
            items={[{ name: t.common.home, href: routes.home }, { name: d.title }]}
          />
        }
      />
      <Container className="max-w-3xl space-y-4 py-10 text-lg">
        {d.body.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
        <h2 className="pt-6 text-h2">{d.stackTitle}</h2>
        <ul className="list-disc space-y-1 pl-6">
          {d.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </Container>
    </>
  );
}
