import { MaterialIcon } from "@/components/ui/Icon";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd, breadcrumbLd } from "@/components/seo/JsonLd";
import { Alert } from "@/components/ui/Feedback";
import { Breadcrumb, Card, Container, PageHeader } from "@/components/ui/Layout";
import { getDictionary } from "@/i18n";
import { data, type Page } from "@/lib/data";
import { env } from "@/lib/env";
import { fmtDay } from "@/lib/dates";
import { routes } from "@/lib/routes";

/** Kurumsal, hasta rehberi ve yasal sayfaların ortak "Bilgi sayfası" şablonu (plan 4, şablon 6). */
const sectionRoot: Record<Page["section"], { prefix: string }> = {
  corporate: { prefix: "/kurumsal/" },
  patient: { prefix: "/hasta-rehberi/" },
  legal: { prefix: "/yasal/" },
};

export async function infoStaticParams(section: Page["section"]) {
  return (await data.pages.list(section)).map((p) => ({
    slug: p.path.slice(sectionRoot[section].prefix.length),
  }));
}

export async function infoMetadata(section: Page["section"], slug: string): Promise<Metadata> {
  const p = await data.pages.getByPath(`${sectionRoot[section].prefix}${slug}`);
  return p ? { title: p.title, description: p.lead, alternates: { canonical: p.path } } : {};
}

export async function InfoPage({ section, slug }: { section: Page["section"]; slug: string }) {
  const page = await data.pages.getByPath(`${sectionRoot[section].prefix}${slug}`);
  if (!page) notFound();
  const t = await getDictionary();

  const crumbs = [
    { name: t.common.home, href: routes.home },
    ...(section === "patient"
      ? [{ name: t.info.sections.patient, href: routes.patientGuide }]
      : []),
    { name: page.title, href: page.path },
  ];

  return (
    <>
      <JsonLd data={breadcrumbLd(env.NEXT_PUBLIC_SITE_URL, crumbs)} />
      <PageHeader
        image={
          section === "patient"
            ? "banner-hasta"
            : section === "legal"
              ? "banner-genel"
              : "banner-kurumsal"
        }
        breadcrumb={<Breadcrumb label={t.common.breadcrumb} items={crumbs} />}
        eyebrow={<span className="font-medium text-brand-200">{t.info.sections[section]}</span>}
        title={page.title}
        lead={page.lead}
      />
      <Container className="grid gap-10 py-10 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-36 lg:self-start">
          {page.sections.length > 1 && (
            <nav aria-labelledby="toc" className="rounded-card neu-inset p-5">
              <h2 id="toc" className="font-sans text-base font-semibold">
                {t.info.onThisPage}
              </h2>
              <ol className="mt-2 space-y-1">
                {page.sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="block rounded py-1 text-brand-700 underline-offset-4 focus-ring hover:underline"
                    >
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}
        </aside>
        <article className="max-w-[72ch] min-w-0 space-y-10 text-lg">
          {page.isTemplate && (
            <Alert tone="warning" title={t.info.templateTitle}>
              <p>{t.common.demoNotice}</p>
            </Alert>
          )}
          {page.sections.map((s) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-t`}>
              <h2 id={`${s.id}-t`} className="text-h2">
                {s.heading}
              </h2>
              {s.paragraphs.map((p) => (
                <p key={p.slice(0, 24)} className="mt-3">
                  {p}
                </p>
              ))}
              {s.items.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {s.items.map((i) => (
                    <li key={i} className="flex gap-3">
                      <span aria-hidden="true" className="mt-0.5 text-brand-600">
                        ✓
                      </span>
                      {i}
                    </li>
                  ))}
                </ul>
              )}
              {s.steps.length > 0 && (
                <ol className="mt-4 space-y-3">
                  {s.steps.map((step, i) => (
                    <li key={step} className="flex gap-4">
                      <span
                        aria-hidden="true"
                        className="flex size-9 shrink-0 items-center justify-center rounded-full neu-raised-sm font-semibold text-brand-700"
                      >
                        {i + 1}
                      </span>
                      <span className="pt-1">{step}</span>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          ))}
          <p className="text-sm text-ink-muted">
            {t.info.updated}: <time dateTime={page.updatedAt}>{fmtDay(page.updatedAt)}</time>
          </p>
          {page.related.length > 0 && (
            <Card className="p-6">
              <h2 className="font-sans text-lg font-semibold">{t.info.related}</h2>
              <ul className="mt-3 space-y-1">
                {page.related.map((r) => (
                  <li key={r.href}>
                    <Link
                      href={r.href}
                      className="inline-flex min-h-11 items-center gap-1.5 rounded font-semibold text-brand-600 underline-offset-4 focus-ring hover:underline"
                    >
                      {r.label} <MaterialIcon name="arrow_forward" size={16} />
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </article>
      </Container>
    </>
  );
}
