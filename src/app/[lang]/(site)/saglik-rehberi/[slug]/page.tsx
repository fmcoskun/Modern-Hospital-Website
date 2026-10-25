import { MaterialIcon } from "@/components/ui/Icon";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { appointmentHref, ArticleCard, Avatar } from "@/components/cards/Cards";
import { JsonLd, breadcrumbLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { Alert, DemoBadge } from "@/components/ui/Feedback";
import { Breadcrumb, Card, Container, PageHeader } from "@/components/ui/Layout";
import { format, getDictionary } from "@/i18n";
import { data } from "@/lib/data";
import { env } from "@/lib/env";
import { fmtDay } from "@/lib/dates";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await data.articles.list()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = await data.articles.getBySlug((await params).slug);
  if (!a) return {};
  return {
    title: a.title.tr,
    description: a.excerpt.tr,
    alternates: { canonical: routes.article(a.slug) },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await data.articles.getBySlug(slug);
  if (!article) notFound();

  const t = await getDictionary();
  const ar = t.articles;
  const [categories, author, reviewer, departments, sameCategory, bookable] = await Promise.all([
    data.articles.categories(),
    data.doctors.getById(article.authorDoctorId),
    article.medicalReviewerDoctorId
      ? data.doctors.getById(article.medicalReviewerDoctorId)
      : undefined,
    Promise.all(article.departmentIds.map((id) => data.departments.getById(id))),
    data.articles.list({ categoryId: article.categoryId }),
    data.departments.bookable(),
  ]);
  const category = categories.find((c) => c.id === article.categoryId);
  const dept = departments.find((d) => d && bookable.some((b) => b.id === d.id)) ?? departments[0];
  const related = sameCategory.filter((a) => a.id !== article.id).slice(0, 3);
  const name = (d?: { title: string; firstName: string; lastName: string }) =>
    d ? `${d.title} ${d.firstName} ${d.lastName}` : "";
  const crumbs = [
    { name: t.common.home, href: routes.home },
    { name: ar.title, href: routes.articles },
    { name: article.title.tr, href: routes.article(article.slug) },
  ];
  const sectionId = (i: number) => `bolum-${i + 1}`;

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            headline: article.title.tr,
            description: article.excerpt.tr,
            datePublished: article.publishedAt,
            lastReviewed: article.reviewedAt,
            author: { "@type": "Physician", name: name(author) },
            reviewedBy: { "@type": "Physician", name: name(reviewer) },
            url: new URL(routes.article(article.slug), env.NEXT_PUBLIC_SITE_URL).toString(),
          },
          breadcrumbLd(env.NEXT_PUBLIC_SITE_URL, crumbs),
        ]}
      />
      <PageHeader
        image="banner-saglik"
        breadcrumb={<Breadcrumb label={t.common.breadcrumb} items={crumbs} />}
        eyebrow={
          <>
            {category && <span className="font-medium text-brand-200">{category.name.tr}</span>}
            <DemoBadge label={t.common.demoContent} />
          </>
        }
        title={article.title.tr}
        lead={article.excerpt.tr}
      />
      <Container className="py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <article className="min-w-0">
            <div className="grid gap-4 rounded-card border border-subtle bg-raised p-5 sm:grid-cols-3">
              {[
                { label: ar.author, doc: author },
                { label: ar.reviewer, doc: reviewer },
              ].map(({ label, doc }) =>
                doc ? (
                  <div key={label} className="flex items-center gap-3">
                    <span className="hidden sm:block">
                      <Avatar doctor={doc} />
                    </span>
                    <dl>
                      <dt className="text-sm text-ink-muted">{label}</dt>
                      <dd>
                        <Link
                          href={routes.doctor(doc.slug)}
                          className="rounded font-semibold underline-offset-4 focus-ring hover:underline"
                        >
                          {name(doc)}
                        </Link>
                      </dd>
                    </dl>
                  </div>
                ) : null,
              )}
              <dl>
                <dt className="text-sm text-ink-muted">{ar.reviewedAt}</dt>
                <dd className="font-semibold">
                  {article.reviewedAt && (
                    <time dateTime={article.reviewedAt}>{fmtDay(article.reviewedAt)}</time>
                  )}
                </dd>
                <dd className="mt-1 flex items-center gap-1.5 text-sm text-ink-muted">
                  <MaterialIcon name="schedule" size={16} />
                  {format(t.common.readingTime, { n: article.readingMinutes })}
                </dd>
              </dl>
            </div>

            <nav aria-labelledby="toc" className="mt-8 rounded-card neu-inset p-5">
              <h2 id="toc" className="font-sans text-base font-semibold">
                {ar.toc}
              </h2>
              <ol className="mt-2 list-decimal space-y-1 pl-5">
                {article.sections.map((s, i) => (
                  <li key={s.heading}>
                    <a
                      href={`#${sectionId(i)}`}
                      className="rounded text-brand-700 underline-offset-4 focus-ring hover:underline"
                    >
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="mt-8 max-w-[72ch] space-y-8 text-lg">
              {article.sections.map((s, i) => (
                <section key={s.heading} aria-labelledby={sectionId(i)}>
                  <h2 id={sectionId(i)} className="text-h3">
                    {s.heading}
                  </h2>
                  {s.paragraphs.map((p) => (
                    <p key={p.slice(0, 24)} className="mt-3">
                      {p}
                    </p>
                  ))}
                </section>
              ))}
            </div>

            <Alert tone="warning" className="mt-10 max-w-[72ch]">
              {t.common.medicalDisclaimer}
            </Alert>

            <section aria-labelledby="sources" className="mt-10">
              <h2 id="sources" className="text-h3">
                {ar.sources}
              </h2>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                {article.sources.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded text-brand-700 underline focus-ring"
                    >
                      {s.title}
                      <span className="sr-only"> (yeni sekmede açılır)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </article>

          {dept && (
            <aside aria-label={ar.relatedDept} className="lg:sticky lg:top-36 lg:self-start">
              <Card className="p-6">
                <p className="text-sm text-ink-muted">{ar.relatedDept}</p>
                <Link
                  href={routes.unit(dept.slug)}
                  className="mt-1 block rounded text-h3 focus-ring hover:text-brand-600"
                >
                  {dept.name.tr}
                </Link>
                <p className="mt-2 text-[0.95rem] text-ink-muted">{dept.summary.tr}</p>
                {bookable.some((b) => b.id === dept.id) && (
                  <ButtonLink
                    href={appointmentHref({ bolum: dept.slug })}
                    className="mt-5 w-full"
                    icon={<MaterialIcon name="calendar_add_on" />}
                  >
                    {ar.bookRelated}
                  </ButtonLink>
                )}
              </Card>
            </aside>
          )}
        </div>

        {related.length > 0 && (
          <section aria-labelledby="related" className="mt-16">
            <h2 id="related" className="mb-5 text-h2">
              {ar.related}
            </h2>
            <ul className="grid gap-5 md:grid-cols-3">
              {related.map((a) => (
                <li key={a.id} className="flex">
                  <ArticleCard article={a} categoryName={category?.name.tr ?? ""} t={t} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </Container>
    </>
  );
}
