import { MaterialIcon } from "@/components/ui/Icon";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { appointmentHref, ArticleCard, DoctorCard } from "@/components/cards/Cards";
import { JsonLd, breadcrumbLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { Alert, Badge, DemoBadge } from "@/components/ui/Feedback";
import { Breadcrumb, Card, Container, PageHeader } from "@/components/ui/Layout";
import { Tabs } from "@/components/ui/Overlay";
import { format, getDictionary } from "@/i18n";
import { data } from "@/lib/data";
import { env } from "@/lib/env";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await data.doctors.list()).map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const doc = await data.doctors.getBySlug((await params).slug);
  if (!doc) return {};
  const dept = await data.departments.getById(doc.primaryDepartmentId);
  return {
    title: `${doc.title} ${doc.firstName} ${doc.lastName} — ${dept?.name.tr ?? ""}`,
    description: doc.bio.tr.slice(0, 155),
    alternates: { canonical: routes.doctor(doc.slug) },
  };
}

export default async function DoctorPage({ params }: Props) {
  const { slug } = await params;
  const doc = await data.doctors.getBySlug(slug);
  if (!doc) notFound();

  const t = await getDictionary();
  const d = t.doctors;
  const [dept, schedules, branchIds, branches, articles, categories, sameDept, bookable] =
    await Promise.all([
      data.departments.getById(doc.primaryDepartmentId),
      data.doctors.schedules(doc.id),
      data.doctors.branchIds(doc.id),
      data.branches.list(),
      data.articles.list({ authorDoctorId: doc.id, limit: 3 }),
      data.articles.categories(),
      data.doctors.byDepartment(doc.primaryDepartmentId),
      data.departments.bookable(),
    ]);
  const fullName = `${doc.title} ${doc.firstName} ${doc.lastName}`;
  const branchName = (id: string) => branches.find((b) => b.id === id)?.name.tr ?? "";
  const isBookable = bookable.some((b) => b.id === doc.primaryDepartmentId);
  const others = sameDept.filter((o) => o.id !== doc.id).slice(0, 3);
  const otherBranches = await Promise.all(others.map((o) => data.doctors.branchIds(o.id)));

  const crumbs = [
    { name: t.common.home, href: routes.home },
    { name: d.title, href: routes.doctors },
    { name: fullName, href: routes.doctor(doc.slug) },
  ];

  // Haftalık tablo: gün → şube → saat aralıkları
  const byDay = Array.from({ length: 7 }, (_, i) => {
    const rows = schedules.filter((s) => s.weekday === i + 1);
    return { day: t.weekdays[i]!, rows };
  }).filter((r) => r.rows.length > 0);

  if (!doc.isActive) {
    return (
      <Container className="pt-40 pb-16">
        <h1 className="text-h1">{fullName}</h1>
        <Alert tone="info" className="mt-6" title={d.inactive}>
          <Link href={routes.unit(dept?.slug ?? "")} className="underline focus-ring">
            {format(d.inactiveCta, { dept: dept?.name.tr ?? "" })}
          </Link>
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Physician",
            name: fullName,
            medicalSpecialty: dept?.name.tr,
            knowsLanguage: doc.languages,
            description: `${t.common.demoProfile}. ${doc.bio.tr}`,
            url: new URL(routes.doctor(doc.slug), env.NEXT_PUBLIC_SITE_URL).toString(),
            worksFor: { "@type": "Hospital", name: t.meta.siteName },
          },
          breadcrumbLd(env.NEXT_PUBLIC_SITE_URL, crumbs),
        ]}
      />
      <PageHeader
        image="banner-doktorlar"
        breadcrumb={<Breadcrumb label={t.common.breadcrumb} items={crumbs} />}
        eyebrow={<DemoBadge label={t.common.demoProfile} />}
        title={fullName}
        lead={
          dept && (
            <Link
              href={routes.unit(dept.slug)}
              className="rounded font-semibold text-inverse underline underline-offset-4 focus-ring"
            >
              {dept.name.tr}
            </Link>
          )
        }
      >
        <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-inverse/90">
          <div className="flex items-center gap-1.5">
            <dt>
              <MaterialIcon name="location_on" size={16} />
              <span className="sr-only">{t.common.branches}</span>
            </dt>
            <dd>{branchIds.map(branchName).join(", ")}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt>{t.common.languages}:</dt>
            <dd>{doc.languages.map((l) => t.langNames[l] ?? l).join(", ")}</dd>
          </div>
        </dl>
        {isBookable && (
          <ButtonLink
            href={appointmentHref({
              bolum: dept?.slug,
              doktor: doc.slug,
              sube: branches.find((b) => b.id === branchIds[0])?.slug,
            })}
            size="lg"
            className="mt-6"
            icon={<MaterialIcon name="calendar_add_on" />}
          >
            {t.common.bookAppointment}
          </ButtonLink>
        )}
      </PageHeader>

      <Container className="grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0">
          <Tabs
            label={fullName}
            tabs={[
              {
                value: "about",
                label: d.tabs.about,
                content: <p className="max-w-[72ch] text-lg">{doc.bio.tr}</p>,
              },
              {
                value: "education",
                label: d.tabs.education,
                content: (
                  <ol className="relative space-y-6 border-l-2 border-brand-200 pl-6">
                    {doc.education.map((e) => (
                      <li key={`${e.institution}-${e.year}`} className="relative">
                        <span
                          aria-hidden="true"
                          className="absolute top-1 -left-[33px] flex size-4 items-center justify-center rounded-full border-2 border-brand-600 bg-raised"
                        />
                        <p className="font-semibold">{e.degree}</p>
                        <p className="text-ink-muted">
                          <MaterialIcon name="school" size={16} className="mr-1 inline" />
                          {e.institution} · <time>{e.year}</time>
                        </p>
                      </li>
                    ))}
                  </ol>
                ),
              },
              {
                value: "experience",
                label: d.tabs.experience,
                content: (
                  <ul className="space-y-3">
                    {doc.experience.map((x) => (
                      <li
                        key={`${x.institution}-${x.from}`}
                        className="rounded-input border border-subtle bg-raised p-4"
                      >
                        <p className="font-semibold">{x.role}</p>
                        <p className="text-ink-muted">
                          {x.institution} · {x.from}–{x.to ?? d.present}
                        </p>
                      </li>
                    ))}
                  </ul>
                ),
              },
              {
                value: "interests",
                label: d.tabs.interests,
                content: (
                  <ul className="flex flex-wrap gap-2">
                    {doc.interests.map((i) => (
                      <li key={i}>
                        <Badge tone="brand" className="px-3.5 py-1.5 text-base">
                          {i}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                ),
              },
            ]}
          />

          {articles.length > 0 && (
            <section aria-labelledby="doc-articles" className="mt-14">
              <h2 id="doc-articles" className="mb-5 text-h2">
                {d.articlesBy}
              </h2>
              <ul className="grid gap-5 md:grid-cols-2">
                {articles.map((a) => (
                  <li key={a.id} className="flex">
                    <ArticleCard
                      article={a}
                      t={t}
                      categoryName={categories.find((c) => c.id === a.categoryId)?.name.tr ?? ""}
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside aria-labelledby="schedule-title" className="lg:sticky lg:top-36 lg:self-start">
          <Card className="p-6">
            <h2 id="schedule-title" className="font-sans text-lg font-semibold">
              {d.weeklySchedule}
            </h2>
            <table className="mt-4 w-full text-left text-[0.95rem]">
              <thead className="sr-only">
                <tr>
                  <th scope="col">{d.day}</th>
                  <th scope="col">{d.hours}</th>
                </tr>
              </thead>
              <tbody>
                {byDay.map((r) => (
                  <tr key={r.day} className="border-b border-subtle last:border-0">
                    <th scope="row" className="py-2.5 pr-3 align-top font-semibold">
                      {r.day}
                    </th>
                    <td className="py-2.5">
                      {r.rows.map((s) => (
                        <span key={`${s.startTime}-${s.branchId}`} className="block">
                          {s.startTime}–{s.endTime}{" "}
                          <span className="text-ink-muted">· {branchName(s.branchId)}</span>
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-sm text-ink-muted">{d.scheduleNote}</p>
          </Card>
        </aside>
      </Container>

      {others.length > 0 && (
        <section aria-labelledby="same-dept" className="pb-16">
          <Container>
            <h2 id="same-dept" className="mb-6 text-h2">
              {d.sameDept}
            </h2>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((o, i) => (
                <li key={o.id}>
                  <DoctorCard
                    doctor={o}
                    t={t}
                    bookable={isBookable}
                    departmentName={dept?.name.tr ?? ""}
                    branchNames={(otherBranches[i] ?? []).map(branchName)}
                  />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}
    </>
  );
}
