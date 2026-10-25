import { MaterialIcon } from "@/components/ui/Icon";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { appointmentHref, ArticleCard, DoctorCard, FeatureCard } from "@/components/cards/Cards";
import { telHref } from "@/components/layout/navigation";
import { JsonLd, breadcrumbLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { Alert, Badge } from "@/components/ui/Feedback";
import { Breadcrumb, Card, Container, PageHeader } from "@/components/ui/Layout";
import { Accordion } from "@/components/ui/Overlay";
import { DoctorGridByBranch } from "@/features/departments/DoctorGridByBranch";
import { getDictionary } from "@/i18n";
import { data } from "@/lib/data";
import { env } from "@/lib/env";
import { unitPhoto } from "@/lib/photos";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await data.departments.list()).map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const dept = await data.departments.getBySlug((await params).slug);
  if (!dept) return {};
  return {
    title: dept.name.tr,
    description: dept.summary.tr,
    alternates: { canonical: routes.unit(dept.slug) },
  };
}

export default async function UnitPage({ params }: Props) {
  const { slug } = await params;
  const dept = await data.departments.getBySlug(slug);
  if (!dept) notFound();

  const t = await getDictionary();
  const u = t.units;
  const [
    hospital,
    group,
    doctors,
    branches,
    technologies,
    faqs,
    articles,
    categories,
    departments,
    bookable,
  ] = await Promise.all([
    data.hospital.get(),
    data.departments.groups().then((gs) => gs.find((g) => g.id === dept.groupId)),
    data.doctors.byDepartment(dept.id),
    data.branches.list(),
    data.technologies.byIds(dept.technologyIds),
    data.faqs.list({ scope: "department", departmentId: dept.id }),
    data.articles.list({ departmentId: dept.id, limit: 3 }),
    data.articles.categories(),
    data.departments.list(),
    data.departments.bookable(),
  ]);
  const doctorBranchIds = await Promise.all(doctors.map((d) => data.doctors.branchIds(d.id)));
  const branchName = (id: string) => branches.find((b) => b.id === id)?.name.tr ?? "";
  const isEmergency = dept.kind === "emergency";
  const isBookable = bookable.some((b) => b.id === dept.id);
  const deptBranches = dept.locations.map((l) => ({
    ...l,
    branch: branches.find((b) => b.id === l.branchId)!,
  }));

  const idx = departments.findIndex((d) => d.id === dept.id);
  const prevDept = idx > 0 ? departments[idx - 1] : undefined;
  const nextDept = departments[idx + 1];

  const crumbs = [
    { name: t.common.home, href: routes.home },
    { name: u.title, href: routes.units },
    { name: dept.name.tr, href: routes.unit(dept.slug) },
  ];

  const anchors = [
    { id: "hizmetler", label: u.sections.services, show: dept.conditionsTreated.length > 0 },
    { id: "tani-tedavi", label: u.sections.treatment, show: dept.procedures.length > 0 },
    { id: "teknoloji", label: u.sections.technology, show: technologies.length > 0 },
    { id: "doktorlar", label: u.sections.doctors, show: doctors.length > 0 },
    { id: "konum", label: u.sections.location, show: true },
    { id: "sss", label: u.sections.faq, show: faqs.length > 0 },
    { id: "yazilar", label: u.sections.articles, show: articles.length > 0 },
  ].filter((a) => a.show);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": isEmergency ? "EmergencyService" : "MedicalClinic",
      name: `${hospital.name} — ${dept.name.tr}`,
      description: dept.summary.tr,
      url: new URL(routes.unit(dept.slug), env.NEXT_PUBLIC_SITE_URL).toString(),
      telephone: isEmergency ? hospital.emergencyPhone : hospital.callCenterPhone,
      ...(isEmergency ? {} : { medicalSpecialty: dept.name.tr }),
      ...(isEmergency ? { openingHours: "Mo-Su 00:00-23:59" } : {}),
    },
    breadcrumbLd(env.NEXT_PUBLIC_SITE_URL, crumbs),
    ...(faqs.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.question.tr,
              acceptedAnswer: { "@type": "Answer", text: f.answer.tr },
            })),
          },
        ]
      : []),
  ];

  const ctaCard = isEmergency ? null : (
    <Card className="p-6">
      <h2 className="font-sans text-lg font-semibold">{u.stickyTitle}</h2>
      <p className="mt-2 text-[0.95rem] text-ink-muted">
        {isBookable ? u.stickyBody : u.shortContent}
      </p>
      {isBookable && (
        <ButtonLink
          href={appointmentHref({ bolum: dept.slug })}
          className="mt-4 w-full"
          icon={<MaterialIcon name="calendar_add_on" />}
        >
          {u.bookFromUnit}
        </ButtonLink>
      )}
      <p className="mt-4 text-sm text-ink-muted">{u.phoneAppointment}</p>
      <a
        href={telHref(hospital.callCenterPhone)}
        className="inline-flex min-h-11 items-center gap-2 rounded font-semibold text-brand-700 underline-offset-4 focus-ring hover:underline"
      >
        <MaterialIcon name="call" size={16} />
        {hospital.callCenterPhone}
      </a>
    </Card>
  );

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* 1 — Başlık */}
      <PageHeader
        image={unitPhoto(dept.slug)}
        breadcrumb={<Breadcrumb label={t.common.breadcrumb} items={crumbs} />}
        eyebrow={group && <Badge tone="brand">{group.name.tr}</Badge>}
        title={dept.name.tr}
        lead={dept.summary.tr}
        nav={{
          prev: prevDept && { label: prevDept.name.tr, href: routes.unit(prevDept.slug) },
          next: nextDept && { label: nextDept.name.tr, href: routes.unit(nextDept.slug) },
        }}
      >
        {isEmergency ? (
          <div className="mt-6 max-w-3xl space-y-4">
            <Alert tone="error" title={u.emergency.call112}>
              <p>{u.emergency.noAppointment}</p>
            </Alert>
            <ButtonLink
              href={telHref(hospital.emergencyPhone)}
              variant="danger"
              size="lg"
              icon={<MaterialIcon name="emergency" />}
            >
              {t.common.emergencyLine}: {hospital.emergencyPhone}
            </ButtonLink>
          </div>
        ) : (
          isBookable && (
            <ButtonLink
              href={appointmentHref({ bolum: dept.slug })}
              size="lg"
              className="mt-6"
              icon={<MaterialIcon name="calendar_add_on" />}
            >
              {u.bookFromUnit}
            </ButtonLink>
          )
        )}
      </PageHeader>

      {/* Acil varyantı: konum ve yol tarifi ilk ekranda */}
      {isEmergency && (
        <Container className="pt-10">
          <h2 className="text-h2">{u.emergency.ourEmergencies}</h2>
          <ul className="mt-6 grid gap-5 md:grid-cols-2">
            {deptBranches.map((l) => (
              <li key={l.branchId}>
                <Card className="p-6">
                  <h3 className="font-sans text-lg font-semibold">{l.branch.name.tr}</h3>
                  <p className="mt-1 font-semibold text-danger-600">{u.emergency.open247}</p>
                  <p className="mt-2 text-ink-muted">
                    {l.branch.address}, {l.branch.district}/{l.branch.city} — {l.building}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <ButtonLink
                      href={telHref(l.branch.phone)}
                      variant="secondary"
                      icon={<MaterialIcon name="call" size={16} />}
                    >
                      {l.branch.phone}
                    </ButtonLink>
                    <ButtonLink
                      href={`https://www.openstreetmap.org/?mlat=${l.branch.geo.lat}&mlon=${l.branch.geo.lng}#map=16/${l.branch.geo.lat}/${l.branch.geo.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="secondary"
                      icon={<MaterialIcon name="location_on" size={16} />}
                    >
                      {t.common.directions}
                    </ButtonLink>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      )}

      <Container className="grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-14">
          {/* 2 — Sayfa içi menü */}
          {anchors.length > 1 && (
            <nav
              aria-label={u.onThisPage}
              className="relative -mx-1 overflow-x-auto rounded-card neu-inset p-1.5"
            >
              <ul className="flex gap-1">
                {anchors.map((a) => (
                  <li key={a.id} className="shrink-0">
                    <a
                      href={`#${a.id}`}
                      className="inline-flex min-h-11 items-center rounded-input px-4 font-medium focus-ring hover:bg-brand-100"
                    >
                      {a.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {dept.body.length > 0 ? (
            <div className="max-w-[72ch] space-y-4 text-lg">
              {dept.body.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          ) : (
            <Alert tone="info">{u.shortContent}</Alert>
          )}

          {/* 3 — Durumlar */}
          {dept.conditionsTreated.length > 0 && (
            <section id="hizmetler" aria-labelledby="hizmetler-t">
              <h2 id="hizmetler-t" className="text-h2">
                {u.conditions}
              </h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {dept.conditionsTreated.map((c) => (
                  <li
                    key={c}
                    className="flex items-center gap-3 rounded-input border border-subtle bg-raised px-4 py-3"
                  >
                    <span aria-hidden="true" className="text-brand-600">
                      ✓
                    </span>
                    {c}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 4 — Tanı ve tedavi */}
          {dept.procedures.length > 0 && (
            <section id="tani-tedavi" aria-labelledby="tani-tedavi-t">
              <h2 id="tani-tedavi-t" className="text-h2">
                {u.procedures}
              </h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {dept.procedures.map((p) => (
                  <li key={p}>
                    <Badge tone="brand" className="px-3.5 py-1.5 text-base">
                      {p}
                    </Badge>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 5 — Teknoloji */}
          {technologies.length > 0 && (
            <section id="teknoloji" aria-labelledby="teknoloji-t">
              <h2 id="teknoloji-t" className="text-h2">
                {u.sections.technology}
              </h2>
              <ul className="mt-5 grid gap-5 sm:grid-cols-2">
                {technologies.map((tech) => (
                  <li key={tech.id}>
                    <FeatureCard tech={tech} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 6 — Doktorlar */}
          {doctors.length > 0 && (
            <section id="doktorlar" aria-labelledby="doktorlar-t">
              <h2 id="doktorlar-t" className="mb-5 text-h2">
                {u.unitDoctors}
              </h2>
              <DoctorGridByBranch
                labels={{ all: u.allBranches, filter: u.filterByBranch }}
                branches={deptBranches.map((l) => ({ id: l.branchId, name: l.branch.name.tr }))}
                items={doctors.map((doc, i) => ({
                  id: doc.id,
                  branchIds: doctorBranchIds[i] ?? [],
                  node: (
                    <DoctorCard
                      doctor={doc}
                      t={t}
                      bookable={isBookable}
                      departmentName={
                        departments.find((d) => d.id === doc.primaryDepartmentId)?.name.tr ?? ""
                      }
                      branchNames={(doctorBranchIds[i] ?? []).map(branchName)}
                    />
                  ),
                }))}
              />
            </section>
          )}

          {/* 7 — Konum */}
          <section id="konum" aria-labelledby="konum-t">
            <h2 id="konum-t" className="text-h2">
              {u.sections.location}
            </h2>
            {/* Yatay kaydırılan tablo klavyeyle kaydırılabilmeli (WCAG 2.1.1, axe scrollable-region-focusable). */}
            {/* eslint-disable jsx-a11y/no-noninteractive-tabindex */}
            <div
              role="region"
              aria-labelledby="konum-t"
              tabIndex={0}
              className="relative mt-5 overflow-x-auto rounded-card border border-subtle bg-raised focus-ring"
            >
              {/* eslint-enable jsx-a11y/no-noninteractive-tabindex */}
              <table className="w-full min-w-[520px] text-left">
                <thead className="border-b border-subtle text-sm text-ink-muted">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-semibold">
                      {t.common.branch}
                    </th>
                    <th scope="col" className="px-5 py-3 font-semibold">
                      {u.building}
                    </th>
                    <th scope="col" className="px-5 py-3 font-semibold">
                      {u.floor}
                    </th>
                    <th scope="col" className="px-5 py-3 font-semibold">
                      {u.hours}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {deptBranches.map((l) => (
                    <tr key={l.branchId} className="border-b border-subtle last:border-0">
                      <th scope="row" className="px-5 py-3 font-semibold">
                        {l.branch.name.tr}
                      </th>
                      <td className="px-5 py-3">{l.building}</td>
                      <td className="px-5 py-3">{l.floor}</td>
                      <td className="px-5 py-3">{l.hours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 8 — SSS */}
          {faqs.length > 0 && (
            <section id="sss" aria-labelledby="sss-t">
              <h2 id="sss-t" className="mb-5 text-h2">
                {u.faqTitle}
              </h2>
              <Accordion
                items={faqs.map((f) => ({
                  id: f.id,
                  title: f.question.tr,
                  content: <p>{f.answer.tr}</p>,
                }))}
              />
            </section>
          )}

          {/* 9 — İlgili yazılar */}
          {articles.length > 0 && (
            <section id="yazilar" aria-labelledby="yazilar-t">
              <h2 id="yazilar-t" className="mb-5 text-h2">
                {u.relatedArticles}
              </h2>
              <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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

        {/* 10 — Yapışık randevu kartı */}
        {ctaCard && (
          <aside aria-label={u.stickyTitle} className="lg:sticky lg:top-36 lg:self-start">
            {ctaCard}
          </aside>
        )}
      </Container>
    </>
  );
}
