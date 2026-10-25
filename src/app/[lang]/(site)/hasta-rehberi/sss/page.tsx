import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumb, Container, PageHeader } from "@/components/ui/Layout";
import { Accordion } from "@/components/ui/Overlay";
import { getDictionary } from "@/i18n";
import { data } from "@/lib/data";
import { routes } from "@/lib/routes";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    title: t.patientGuide.faqTitle,
    description: t.patientGuide.faqLead,
    alternates: { canonical: routes.faq },
  };
}

export default async function FaqPage() {
  const t = await getDictionary();
  const g = t.patientGuide;
  const [general, appointment] = await Promise.all([
    data.faqs.list({ scope: "global" }),
    data.faqs.list({ scope: "appointment" }),
  ]);
  const groups = [
    { id: "genel", title: g.faqGeneral, items: general },
    { id: "randevu", title: g.faqAppointment, items: appointment },
  ];
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [...general, ...appointment].map((f) => ({
            "@type": "Question",
            name: f.question.tr,
            acceptedAnswer: { "@type": "Answer", text: f.answer.tr },
          })),
        }}
      />
      <PageHeader
        image="banner-hasta"
        title={g.faqTitle}
        lead={g.faqLead}
        breadcrumb={
          <Breadcrumb
            label={t.common.breadcrumb}
            items={[
              { name: t.common.home, href: routes.home },
              { name: g.title, href: routes.patientGuide },
              { name: g.faqTitle },
            ]}
          />
        }
      />
      <Container className="max-w-4xl space-y-10 py-10">
        {groups.map((grp) => (
          <section key={grp.id} aria-labelledby={`faq-${grp.id}`}>
            <h2 id={`faq-${grp.id}`} className="mb-5 text-h2">
              {grp.title}
            </h2>
            <Accordion
              items={grp.items.map((f) => ({
                id: f.id,
                title: f.question.tr,
                content: <p>{f.answer.tr}</p>,
              }))}
            />
          </section>
        ))}
      </Container>
    </>
  );
}
