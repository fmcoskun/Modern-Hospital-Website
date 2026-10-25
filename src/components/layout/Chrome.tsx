import { MaterialIcon } from "@/components/ui/Icon";
import Link from "next/link";
import type { Dictionary } from "@/i18n";
import { Container } from "@/components/ui/Layout";
import type { Branch, Department, Hospital } from "@/lib/data";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";
import { telHref } from "./navigation";
import { Logo } from "./Logo";

/** Üst bilgi çubuğu: acil hattına 0 tıkla erişim (plan 4.A-1). */
export function TopBar({ t, hospital }: { t: Dictionary; hospital: Hospital }) {
  return (
    <div className="bg-topbar text-topbar-ink">
      <Container className="flex min-h-10 flex-wrap items-center justify-between gap-x-6 gap-y-1 py-1.5 text-sm">
        <p className="hidden text-topbar-muted md:block">{t.common.demoNotice}</p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <a
            href={telHref(hospital.emergencyPhone)}
            className="inline-flex min-h-8 items-center gap-1.5 rounded font-semibold focus-ring"
          >
            <MaterialIcon name="emergency" size={16} />
            {t.common.emergencyLine}: {hospital.emergencyPhone}
          </a>
          <a
            href={telHref(hospital.callCenterPhone)}
            className="inline-flex min-h-8 items-center gap-1.5 rounded focus-ring"
          >
            <MaterialIcon name="call" size={16} />
            <span className="sr-only sm:not-sr-only">{t.common.callCenter}:</span>{" "}
            {hospital.callCenterPhone}
          </a>
          <span className="inline-flex items-center gap-1.5 text-topbar-muted">
            <span className="sr-only">{t.common.language}:</span>
            <span aria-current="true" className="font-semibold text-topbar-ink">
              TR
            </span>
          </span>
        </div>
      </Container>
    </div>
  );
}

export function MobileBottomBar({ t, hospital }: { t: Dictionary; hospital: Hospital }) {
  const item =
    "focus-ring flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 rounded-input text-xs font-semibold";
  return (
    <nav
      aria-label={t.nav.mobileBar}
      className="fixed inset-x-0 bottom-0 z-30 border-t border-subtle bg-raised/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <div className="flex gap-1 px-2 py-1">
        <a href={telHref(hospital.callCenterPhone)} className={item}>
          <MaterialIcon name="call" />
          {t.common.call}
        </a>
        <Link href={routes.appointment} className={`${item} bg-brand-600 text-inverse`}>
          <MaterialIcon name="calendar_add_on" />
          {t.common.bookAppointment}
        </Link>
        <Link href={routes.locations} className={item}>
          <MaterialIcon name="location_on" />
          {t.common.location}
        </Link>
      </div>
    </nav>
  );
}

/**
 * Footer yapısı: (1) açık zeminli 5 sütunlu menü — başlık koyu, linkler gri,
 * iletişim linkleri marka renginde; (2) logo | rozet + telif satırı; (3) kurum unvanı ve
 * noktalı yasal linkler.
 */
export function SiteFooter({
  t,
  hospital,
  departments,
  branches,
}: {
  t: Dictionary;
  hospital: Hospital;
  departments: Department[];
  branches: Branch[];
}) {
  const f = t.footer;
  const columns = [
    {
      title: f.corporate,
      links: [
        { label: t.nav.corporateLinks.about, href: routes.about },
        { label: t.nav.corporateLinks.facilities, href: routes.facilities },
        { label: t.nav.corporateLinks.insurance, href: routes.insurance },
        { label: t.nav.corporateLinks.quality, href: routes.quality },
      ],
    },
    {
      title: f.units,
      links: [
        ...departments
          .filter((d) => d.featured)
          .slice(0, 6)
          .map((d) => ({ label: d.name.tr, href: routes.unit(d.slug) })),
        { label: t.nav.allUnits, href: routes.units },
      ],
    },
    {
      title: f.patientGuide,
      links: [
        { label: t.nav.patientLinks.firstVisit, href: routes.firstVisit },
        { label: t.nav.patientLinks.transport, href: routes.transport },
        { label: t.nav.patientLinks.visiting, href: routes.visiting },
        { label: t.nav.patientLinks.rights, href: routes.rights },
        { label: t.nav.patientLinks.faq, href: routes.faq },
        { label: t.nav.patientLinks.index, href: routes.patientGuide },
      ],
    },
    {
      title: t.nav.healthGuide,
      links: [
        { label: t.nav.healthLinks.articles, href: routes.articles },
        { label: t.nav.healthLinks.announcements, href: routes.announcements },
        { label: t.nav.doctors, href: routes.doctors },
      ],
    },
  ];
  const legal = [
    { label: f.kvkk, href: routes.kvkk },
    { label: f.privacy, href: routes.privacy },
    { label: f.cookies, href: routes.cookies },
    { label: f.terms, href: routes.terms },
    { label: f.accessibility, href: routes.accessibility },
    { label: f.aboutDemo, href: routes.aboutDemo },
  ];
  const main = branches[0];
  const link = "focus-ring block rounded text-sm leading-5 text-ink-muted hover:text-brand-600";
  const contactLink =
    "focus-ring block rounded text-sm leading-5 font-medium text-brand-600 hover:underline";

  return (
    <footer className="pb-24 lg:pb-0">
      {/* 1 — footer-menu */}
      <div className="border-t border-subtle bg-raised py-6 sm:py-[60px]">
        <Container className="grid gap-8 sm:grid-cols-2 xl:grid-cols-5">
          {columns.map((col) => (
            <div key={col.title}>
              <h2 className="mb-[18px] text-base leading-[22px] font-medium tracking-normal">
                {col.title}
              </h2>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={link}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h2 className="mb-[18px] text-base leading-[22px] font-medium tracking-normal">
              {f.contact}
            </h2>
            <address className="space-y-3 not-italic">
              <a className={contactLink} href={telHref(hospital.emergencyPhone)}>
                {t.common.emergencyLine}: {hospital.emergencyPhone}
              </a>
              <a className={contactLink} href={telHref(hospital.callCenterPhone)}>
                {t.common.callCenter}: {hospital.callCenterPhone}
              </a>
              <a className={contactLink} href={`mailto:${hospital.email}`}>
                {hospital.email}
              </a>
              {main && (
                <Link className={link} href={routes.location(main.slug)}>
                  {main.address}, {main.district}/{main.city}
                </Link>
              )}
            </address>
            <h3 className="sr-only">{f.social}</h3>
            <ul className="mt-4 flex gap-2">
              {hospital.socialLinks.map((s) => (
                <li key={s.network}>
                  <a
                    href={s.url}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="inline-flex size-11 items-center justify-center rounded-full border border-control bg-surface text-xs font-semibold text-ink focus-ring hover:text-brand-600"
                  >
                    <span aria-hidden="true">{s.network.slice(0, 2)}</span>
                    <span className="sr-only">{s.network} (yeni sekmede açılır)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </div>

      {/* 2 — footer-copyright */}
      <div className="bg-raised">
        <Container className="flex flex-col items-center gap-4 border-t border-subtle py-6 text-sm text-ink-muted sm:flex-row sm:justify-between">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <span className="flex items-center gap-2">
              <Logo className="size-9" />
              <span className="font-bold text-brand-700">ÖZEL FMC</span>
            </span>
            <span aria-hidden="true" className="hidden text-subtle sm:block">
              |
            </span>
            <span className="rounded-full border border-dashed border-control px-3 py-1 text-xs font-medium text-ink">
              {t.common.demo}
            </span>
          </div>
          <p className="order-1 text-center sm:order-none sm:text-left">
            © 2026 {hospital.name}. {f.rights}
          </p>
        </Container>
      </div>

      {/* 3 — footer-holding */}
      <div className="border-t border-subtle bg-surface">
        <Container className="flex flex-col items-center justify-between gap-4 py-4 sm:py-6 lg:flex-row">
          <p className="text-sm font-semibold text-ink">{hospital.legalName}</p>
          <nav aria-label={f.legal}>
            <ul className="flex flex-col items-center gap-3 text-sm text-ink-muted sm:flex-row sm:flex-wrap sm:gap-x-6 sm:marker:text-subtle lg:justify-end">
              {legal.map((l, i) => (
                <li key={l.href} className={cn(i > 0 && "sm:list-disc")}>
                  <Link href={l.href} className="rounded focus-ring hover:text-brand-600">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </div>
    </footer>
  );
}
