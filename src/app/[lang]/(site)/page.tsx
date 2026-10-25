import { MaterialIcon } from "@/components/ui/Icon";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { appointmentHref, ArticleCard, DoctorCard, PackageCard } from "@/components/cards/Cards";
import { HeroSlider } from "@/components/home/HeroSlider";
import { ScrollTabs } from "@/components/home/ScrollTabs";
import { telHref } from "@/components/layout/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Feedback";
import { Container, Rich, Section, SectionHeading } from "@/components/ui/Layout";
import { GlobalSearchBox } from "@/features/search/GlobalSearchBox";
import { searchLabels } from "@/features/search/labels";
import { getDictionary } from "@/i18n";
import { data } from "@/lib/data";
import { env } from "@/lib/env";
import { fmtDay } from "@/lib/dates";
import { announcementPhoto, branchPhoto, photo, unitPhoto, type Photo } from "@/lib/photos";
import { routes } from "@/lib/routes";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    title: { absolute: `${t.meta.siteName} — ${t.home.heroTitle}` },
    alternates: { canonical: "/" },
  };
}

/** Ana sayfa sırası: slider → hızlı erişim → hakkımızda → sekmeli birimler → … → şubeler. */
export default async function HomePage() {
  const t = await getDictionary();
  const h = t.home;
  const [
    hospital,
    featuredDepts,
    featuredDoctors,
    departments,
    branches,
    checkups,
    articles,
    categories,
    announcements,
    insurers,
  ] = await Promise.all([
    data.hospital.get(),
    data.departments.featured(),
    data.doctors.featured(),
    data.departments.list(),
    data.branches.list(),
    data.checkups.list(),
    data.articles.list({ limit: 3 }),
    data.articles.categories(),
    data.announcements.list(3),
    data.insurance.list(),
  ]);

  const deptName = (id: string) => departments.find((d) => d.id === id)?.name.tr ?? "";
  const doctors = featuredDoctors.slice(0, 4);
  const doctorBranches = await Promise.all(doctors.map((d) => data.doctors.branchIds(d.id)));
  const branchName = (id: string) => branches.find((b) => b.id === id)?.name.tr ?? "";
  const units = featuredDepts.slice(0, 8);
  const tabLabels = { prev: h.tabsPrev, next: h.tabsNext };
  const heroPhotos = [photo("hero-1"), photo("hero-2"), photo("hero-3")];

  const quick = [
    { label: h.quick.appointment, href: routes.appointment, icon: "calendar_add_on" as const },
    { label: h.quick.doctor, href: routes.doctors, icon: "person_search" as const },
    { label: h.quick.locations, href: routes.locations, icon: "location_on" as const },
    { label: h.quick.eResult, href: routes.eResult, icon: "description" as const },
    {
      label: h.quick.checkup,
      href: routes.unit("check-up"),
      icon: "assignment_turned_in" as const,
    },
  ];
  const guide = [
    {
      ...h.patientTiles.firstVisit,
      href: routes.firstVisit,
      icon: "assignment_turned_in" as const,
    },
    { ...h.patientTiles.visiting, href: routes.visiting, icon: "schedule" as const },
    { ...h.patientTiles.parking, href: routes.transport, icon: "local_parking" as const },
    { ...h.patientTiles.rights, href: routes.rights, icon: "balance" as const },
  ];
  const stats = [
    { value: hospital.stats.branches, label: h.stats.branches },
    { value: hospital.stats.physicians, label: h.stats.physicians },
    { value: hospital.stats.beds, label: h.stats.beds },
    { value: "7/24", label: h.emergency247 },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Hospital",
          name: hospital.name,
          url: env.NEXT_PUBLIC_SITE_URL,
          telephone: hospital.callCenterPhone,
          email: hospital.email,
          description: t.common.demoNotice,
          department: branches.map((b) => ({
            "@type": "Hospital",
            name: `${hospital.name} ${b.name.tr}`,
            telephone: b.phone,
            address: {
              "@type": "PostalAddress",
              streetAddress: b.address,
              addressLocality: b.district,
              addressRegion: b.city,
              postalCode: b.postalCode,
              addressCountry: "TR",
            },
            geo: { "@type": "GeoCoordinates", latitude: b.geo.lat, longitude: b.geo.lng },
          })),
        }}
      />

      {/* Fotoğraf slider'ı */}
      <HeroSlider
        heading={`${t.meta.siteName} — ${h.heroTitle}`}
        labels={h.slider}
        scrollTarget="hizli-erisim"
        slides={h.slider.slides.map((s, i) => ({ ...s, image: heroPhotos[i] ?? heroPhotos[0]! }))}
        actions={
          <>
            <ButtonLink
              href={routes.appointment}
              size="lg"
              icon={<MaterialIcon name="calendar_add_on" />}
            >
              {t.common.bookAppointment}
            </ButtonLink>
            <ButtonLink
              href={routes.doctors}
              size="lg"
              variant="onDark"
              icon={<MaterialIcon name="stethoscope" />}
            >
              {t.common.findDoctor}
            </ButtonLink>
          </>
        }
      />

      {/* Hızlı erişim: arama + ikon kutucukları */}
      <Section id="hizli-erisim" eyebrow={h.quickEyebrow} title={<Rich text={h.quickTitle} />}>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="rounded-card border border-subtle bg-sunken p-5 sm:p-8">
            <GlobalSearchBox labels={searchLabels(t)} />
          </div>
          <div>
            <h3 className="sr-only">{h.quickActions}</h3>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {quick.map(({ label, href, icon }) => (
                <li key={href}>
                  <IconTile href={href} label={label} icon={icon} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Hakkımızda */}
      <section id="hakkimizda" aria-labelledby="about-title" className="bg-sunken py-14 sm:py-20">
        <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              id="about-title"
              eyebrow={h.aboutEyebrow}
              title={<Rich text={h.aboutHeading} />}
            />
            <div className="-mt-4 space-y-4 text-ink-muted">
              {h.aboutBody.map((p) => (
                <p key={p.slice(0, 20)}>{p}</p>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Badge>{t.common.demo}</Badge>
            </div>
            <ButtonLink
              href={routes.about}
              variant="secondary"
              className="mt-8"
              iconRight={<MaterialIcon name="arrow_forward_ios" size={16} />}
            >
              {h.moreInfo}
            </ButtonLink>
          </div>
          <PhotoFrame p={photo("about")} sizes="(min-width: 1024px) 50vw, 100vw" />
        </Container>
      </section>

      {/* Birimler (sekmeli) */}
      <Section
        id="units"
        eyebrow={h.unitsEyebrow}
        title={<Rich text={h.unitsTitle} />}
        action={<SeeAll href={routes.units} label={h.allUnits} />}
      >
        <ScrollTabs
          labels={{ ...tabLabels, list: h.featuredUnits }}
          tabs={units.map((d) => ({ id: d.slug, label: d.name.tr }))}
          panels={units.map((d) => (
            <div key={d.id} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
              <div className="relative pb-10 sm:pr-16">
                <PhotoFrame p={unitPhoto(d.slug)} sizes="(min-width: 1024px) 45vw, 100vw" />
                <div className="absolute right-0 bottom-0 hidden w-2/5 overflow-hidden rounded-card border-4 border-raised sm:block">
                  <Image
                    src={photo("unit-ek").src}
                    alt=""
                    width={photo("unit-ek").width}
                    height={photo("unit-ek").height}
                    sizes="20vw"
                    className="aspect-square object-cover"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-h3">{d.name.tr}</h3>
                <p className="mt-4 text-ink-muted">{d.summary.tr}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <ButtonLink
                    href={routes.unit(d.slug)}
                    variant="secondary"
                    iconRight={<MaterialIcon name="arrow_forward_ios" size={16} />}
                  >
                    {h.moreInfo}
                    <span className="sr-only">: {d.name.tr}</span>
                  </ButtonLink>
                  <ButtonLink
                    href={appointmentHref({ bolum: d.slug })}
                    icon={<MaterialIcon name="calendar_add_on" />}
                  >
                    {t.common.bookAppointment}
                    <span className="sr-only">: {d.name.tr}</span>
                  </ButtonLink>
                </div>
              </div>
            </div>
          ))}
        />
      </Section>

      {/* Doktorlar */}
      <Section
        id="doctors"
        tone="light"
        eyebrow={h.doctorsEyebrow}
        title={<Rich text={h.doctorsTitle} />}
        lead={h.doctorsLead}
        action={<SeeAll href={routes.doctors} label={h.allDoctors} />}
      >
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {doctors.map((doc, i) => (
            <li key={doc.id}>
              <DoctorCard
                doctor={doc}
                departmentName={deptName(doc.primaryDepartmentId)}
                branchNames={(doctorBranches[i] ?? []).map(branchName)}
                t={t}
              />
            </li>
          ))}
        </ul>
      </Section>

      {/* Check-up */}
      <Section
        id="checkup"
        eyebrow={h.checkupEyebrow}
        title={<Rich text={h.checkupTitle} />}
        lead={h.checkupsLead}
      >
        <ul className="grid gap-5 md:grid-cols-3">
          {checkups.map((pkg) => (
            <li key={pkg.id} className="flex">
              <PackageCard pkg={pkg} t={t} />
            </li>
          ))}
        </ul>
      </Section>

      {/* Rakamlar (koyu bant) */}
      <Section
        id="network"
        tone="dark"
        eyebrow={h.networkEyebrow}
        title={<Rich text={h.networkTitle} />}
        lead={h.networkLead}
      >
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-card bg-inverse/15 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse bg-dark p-6 sm:p-8">
              <dt className="mt-1 text-inverse/85">{s.label}</dt>
              <dd className="text-4xl font-bold text-inverse sm:text-5xl">{s.value}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Duyurular (görsel solda liste) */}
      <Section
        id="news"
        eyebrow={h.newsEyebrow}
        title={<Rich text={h.newsTitle} />}
        action={<SeeAll href={routes.announcements} label={t.common.viewAll} />}
      >
        <ul className="divide-y divide-subtle border-y border-subtle">
          {announcements.map((a) => {
            const img = announcementPhoto(a.slug);
            return (
              <li key={a.id}>
                <article className="grid gap-5 py-6 sm:grid-cols-[16rem_1fr] sm:gap-8">
                  <Image
                    src={img.src}
                    alt=""
                    width={img.width}
                    height={img.height}
                    sizes="(min-width: 640px) 16rem, 100vw"
                    className="aspect-[4/3] w-full rounded-card object-cover"
                  />
                  <div className="self-center">
                    <p className="flex items-center gap-1.5 text-sm text-ink-muted">
                      <MaterialIcon name="schedule" size={16} />
                      <time dateTime={a.publishedAt}>{fmtDay(a.publishedAt)}</time>
                    </p>
                    <h3 className="mt-2 text-h3">{a.title.tr}</h3>
                    <p className="mt-2 text-ink-muted">{a.excerpt.tr}</p>
                    <Link
                      href={routes.announcement(a.slug)}
                      className="mt-3 inline-flex min-h-11 items-center gap-1.5 rounded font-medium text-brand-600 underline-offset-4 focus-ring hover:underline"
                    >
                      {h.readMore}
                      <span className="sr-only">: {a.title.tr}</span>
                      <MaterialIcon name="arrow_forward_ios" size={14} />
                    </Link>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* Sağlık rehberi + hasta rehberi */}
      <Section
        id="articles"
        tone="light"
        eyebrow={h.articlesEyebrow}
        title={<Rich text={h.articlesTitle} />}
        lead={h.articlesLead}
        action={<SeeAll href={routes.articles} label={t.common.viewAll} />}
      >
        <ul className="grid gap-5 md:grid-cols-3">
          {articles.map((a) => (
            <li key={a.id} className="flex">
              <ArticleCard
                article={a}
                categoryName={categories.find((c) => c.id === a.categoryId)?.name.tr ?? ""}
                t={t}
              />
            </li>
          ))}
        </ul>
        <h3 className="mt-14 mb-5 text-h3">{h.patientTitle}</h3>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {guide.map((g) => (
            <li key={g.href}>
              <Link
                href={g.href}
                className="group flex h-full gap-4 rounded-card border border-subtle bg-raised p-5 focus-ring transition-shadow hover:shadow-neu-flat"
              >
                <MaterialIcon name={g.icon} size={28} className="shrink-0 text-brand-600" />
                <span>
                  <span className="block font-semibold group-hover:text-brand-700">{g.title}</span>
                  <span className="mt-1 block text-[0.95rem] text-ink-muted">{g.body}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* Anlaşmalı kurumlar */}
      <Section
        id="partners"
        eyebrow={h.partnersEyebrow}
        title={<Rich text={h.partnersTitle} />}
        action={<SeeAll href={routes.insurance} label={t.common.viewAll} />}
      >
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-subtle bg-[var(--border-subtle)] md:grid-cols-3 lg:grid-cols-4">
          {insurers.map((ins) => (
            <li
              key={ins.id}
              className="flex min-h-24 items-center justify-center bg-raised p-5 text-center font-semibold text-ink-muted"
            >
              {ins.name}
            </li>
          ))}
        </ul>
      </Section>

      {/* İletişim kolajı */}
      <section aria-labelledby="contact-title" className="bg-sunken py-14 sm:py-20">
        <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="grid grid-cols-[1.4fr_1fr] items-end gap-4">
            <PhotoFrame p={photo("contact-1")} sizes="(min-width: 1024px) 28vw, 58vw" tall />
            <PhotoFrame p={photo("contact-2")} sizes="(min-width: 1024px) 20vw, 40vw" />
          </div>
          <div>
            <SectionHeading
              id="contact-title"
              eyebrow={h.contactEyebrow}
              title={<Rich text={h.contactTitle} />}
              lead={h.contactLead}
            />
            <p>
              <a
                href={telHref(hospital.callCenterPhone)}
                className="inline-flex min-h-11 items-center gap-2 rounded text-2xl font-bold text-brand-700 underline-offset-4 focus-ring hover:underline"
              >
                <MaterialIcon name="call" size={24} />
                {hospital.callCenterPhone}
              </a>
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink
                href={routes.contact}
                iconRight={<MaterialIcon name="arrow_forward_ios" size={16} />}
              >
                {t.nav.contact}
              </ButtonLink>
              <ButtonLink
                href={`mailto:${hospital.email}`}
                variant="secondary"
                icon={<MaterialIcon name="mail" />}
              >
                {hospital.email}
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* Şubeler (sekmeli) */}
      <Section
        id="locations"
        eyebrow={h.branchesEyebrow}
        title={<Rich text={h.branchesTitle} />}
        lead={h.locationsLead}
        action={<SeeAll href={routes.locations} label={t.common.viewAll} />}
      >
        <ScrollTabs
          labels={{ ...tabLabels, list: h.locations }}
          tabs={branches.map((b) => ({ id: b.slug, label: b.name.tr }))}
          panels={branches.map((b) => (
            <div key={b.id} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
              <PhotoFrame p={branchPhoto(b.slug)} sizes="(min-width: 1024px) 45vw, 100vw" />
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-h3">{b.name.tr}</h3>
                  {b.hasEmergency && (
                    <Badge tone="danger">
                      <MaterialIcon name="emergency" size={14} />
                      {t.common.emergency} 7/24
                    </Badge>
                  )}
                </div>
                <p className="mt-4 flex gap-2 text-ink-muted">
                  <MaterialIcon
                    name="location_on"
                    size={20}
                    className="mt-0.5 shrink-0 text-brand-600"
                  />
                  {b.address}, {b.district}/{b.city}
                </p>
                <p className="mt-2">
                  <a
                    href={telHref(b.phone)}
                    className="inline-flex min-h-11 items-center gap-2 rounded font-semibold text-brand-700 underline-offset-4 focus-ring hover:underline"
                  >
                    <MaterialIcon name="call" size={20} />
                    {b.phone}
                  </a>
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <ButtonLink
                    href={routes.location(b.slug)}
                    variant="secondary"
                    iconRight={<MaterialIcon name="arrow_forward_ios" size={16} />}
                  >
                    {h.moreInfo}
                    <span className="sr-only">: {b.name.tr}</span>
                  </ButtonLink>
                  <ButtonLink
                    href={appointmentHref({ sube: b.slug })}
                    icon={<MaterialIcon name="calendar_add_on" />}
                  >
                    {t.common.bookAppointment}
                    <span className="sr-only">: {b.name.tr}</span>
                  </ButtonLink>
                </div>
              </div>
            </div>
          ))}
        />
      </Section>
    </>
  );
}

function PhotoFrame({ p, sizes, tall }: { p: Photo; sizes: string; tall?: boolean }) {
  return (
    <Image
      src={p.src}
      alt={p.alt}
      width={p.width}
      height={p.height}
      sizes={sizes}
      className={
        tall
          ? "aspect-[3/4] w-full rounded-card object-cover"
          : "aspect-[4/3] w-full rounded-card object-cover"
      }
    />
  );
}

function IconTile({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon:
    "calendar_add_on" | "person_search" | "location_on" | "description" | "assignment_turned_in";
}) {
  return (
    <Link
      href={href}
      className="group flex h-full min-h-28 flex-col justify-between gap-3 rounded-card border border-subtle bg-raised p-4 font-medium focus-ring transition-[box-shadow,border-color] hover:border-brand-600 hover:shadow-neu-flat"
    >
      <span className="flex size-11 items-center justify-center rounded-input bg-brand-100 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-inverse">
        <MaterialIcon name={icon} size={24} />
      </span>
      <span className="flex items-center justify-between gap-2">
        {label}
        <MaterialIcon name="arrow_forward_ios" size={14} className="text-brand-600" />
      </span>
    </Link>
  );
}

function SeeAll({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center gap-1.5 rounded font-medium text-brand-600 underline-offset-4 focus-ring hover:underline"
    >
      {label} <MaterialIcon name="arrow_forward_ios" size={14} />
    </Link>
  );
}
