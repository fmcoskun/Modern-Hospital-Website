import { MaterialIcon } from "@/components/ui/Icon";
import Link from "next/link";
import type { ReactNode } from "react";
import { telHref } from "@/components/layout/navigation";
import { Badge } from "@/components/ui/Feedback";
import { DataIcon } from "@/components/ui/Icon";
import { format, type Dictionary } from "@/i18n";
import { cn } from "@/lib/cn";
import type { Article, Branch, CheckupPackage, Doctor, Technology } from "@/lib/data";
import { routes } from "@/lib/routes";
import { initials } from "@/lib/text";

/** Tüm kart tıklanabilir olduğunda tek link + genişletilmiş tıklama alanı (plan 6.5). */
const stretched = "after:absolute after:inset-0 after:rounded-card after:content-['']";
const cardBase =
  "group relative rounded-card neu-raised transition-transform duration-150 ease-standard hover:-translate-y-0.5 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus";

export function Avatar({
  doctor,
  size = "md",
}: {
  doctor: Pick<Doctor, "firstName" | "lastName" | "gender">;
  size?: "md" | "lg";
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full neu-raised-sm font-semibold text-brand-700",
        size === "lg" ? "size-28 text-4xl" : "size-20 text-2xl",
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center rounded-full bg-brand-200",
          size === "lg" ? "size-24" : "size-16",
        )}
      >
        {initials(doctor.firstName, doctor.lastName)}
      </span>
    </span>
  );
}

export function DoctorCard({
  doctor,
  departmentName,
  branchNames,
  t,
  bookable = true,
}: {
  doctor: Doctor;
  departmentName: string;
  branchNames: string[];
  t: Dictionary;
  bookable?: boolean;
}) {
  const fullName = `${doctor.title} ${doctor.firstName} ${doctor.lastName}`;
  return (
    <article className="flex h-full flex-col rounded-card border border-subtle bg-raised p-5 transition-shadow hover:shadow-neu-flat">
      <div className="flex items-start gap-4">
        <Avatar doctor={doctor} />
        <div className="min-w-0">
          <h3 className="font-sans text-lg leading-snug font-semibold">
            <Link
              href={routes.doctor(doctor.slug)}
              className="rounded focus-ring hover:text-brand-600 hover:underline"
            >
              {fullName}
            </Link>
          </h3>
          <p className="text-brand-700">{departmentName}</p>
          <p className="mt-1 flex items-center gap-1 text-sm text-ink-muted">
            <MaterialIcon name="location_on" size={16} className="shrink-0" />
            <span className="sr-only">{t.common.branches}: </span>
            {branchNames.join(", ")}
          </p>
        </div>
      </div>
      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={t.doctors.tabs.interests}>
        {doctor.interests.slice(0, 3).map((i) => (
          <li key={i}>
            <Badge>{i}</Badge>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-ink-muted">
        <span>{t.common.languages}: </span>
        {doctor.languages.map((l) => (
          <abbr
            key={l}
            title={t.langNames[l] ?? l}
            className="mr-1.5 font-semibold text-ink no-underline"
          >
            {l.toUpperCase()}
          </abbr>
        ))}
      </p>
      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        <Link
          href={routes.doctor(doctor.slug)}
          aria-label={`${t.common.viewProfile}: ${fullName}`}
          className="inline-flex min-h-11 items-center rounded-input border border-brand-600 px-4 text-sm font-medium text-brand-600 focus-ring hover:bg-brand-100"
        >
          {t.common.viewProfile}
        </Link>
        {bookable && (
          <Link
            href={appointmentHref({ doktor: doctor.slug })}
            aria-label={`${t.common.bookAppointment}: ${fullName}`}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-input bg-brand-600 px-4 text-sm font-medium text-inverse focus-ring hover:bg-brand-500"
          >
            <MaterialIcon name="calendar_add_on" size={16} />
            {t.common.bookAppointment}
          </Link>
        )}
      </div>
    </article>
  );
}

export function appointmentHref(pre: { bolum?: string; doktor?: string; sube?: string }) {
  const p = new URLSearchParams();
  if (pre.sube) p.set("sube", pre.sube);
  if (pre.bolum) p.set("bolum", pre.bolum);
  if (pre.doktor) p.set("doktor", pre.doktor);
  const qs = p.toString();
  return qs ? `${routes.appointment}?${qs}` : routes.appointment;
}

export function ArticleCard({
  article,
  categoryName,
  t,
}: {
  article: Article;
  categoryName: string;
  t: Dictionary;
}) {
  return (
    <article className={cn(cardBase, "flex w-full flex-col p-6")}>
      <p className="text-sm font-semibold text-brand-700">{categoryName}</p>
      <h3 className="mt-2 text-h3">
        <Link href={routes.article(article.slug)} className={cn("focus:outline-none", stretched)}>
          {article.title.tr}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-3 text-ink-muted">{article.excerpt.tr}</p>
      <p className="mt-auto flex items-center gap-1.5 pt-4 text-sm text-ink-muted">
        <MaterialIcon name="schedule" size={16} />
        {format(t.common.readingTime, { n: article.readingMinutes })}
      </p>
    </article>
  );
}

export function BranchCard({
  branch,
  t,
  children,
}: {
  branch: Branch;
  t: Dictionary;
  children?: ReactNode;
}) {
  return (
    <article className="flex w-full flex-col rounded-card neu-raised p-6">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-sans text-lg font-semibold">
          <Link
            href={routes.location(branch.slug)}
            className="rounded focus-ring hover:text-brand-600 hover:underline"
          >
            {branch.name.tr}
          </Link>
        </h3>
        {branch.hasEmergency && (
          <Badge tone="danger">
            <MaterialIcon name="emergency" size={14} />
            {t.common.emergency} 7/24
          </Badge>
        )}
      </div>
      <p className="mt-2 text-ink-muted">
        {branch.address}, {branch.district}/{branch.city}
      </p>
      <p className="mt-3">
        <a
          href={telHref(branch.phone)}
          className="inline-flex min-h-11 items-center gap-2 rounded font-semibold text-brand-700 underline-offset-4 focus-ring hover:underline"
        >
          <MaterialIcon name="call" size={16} />
          {branch.phone}
        </a>
      </p>
      {children}
      <a
        href={`https://www.openstreetmap.org/?mlat=${branch.geo.lat}&mlon=${branch.geo.lng}#map=15/${branch.geo.lat}/${branch.geo.lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex min-h-11 items-center gap-1.5 self-start rounded pt-3 font-semibold text-brand-600 underline underline-offset-4 focus-ring"
      >
        <MaterialIcon name="location_on" size={16} />
        {t.common.directions}
        <span className="sr-only"> ({branch.name.tr}, yeni sekmede açılır)</span>
      </a>
    </article>
  );
}

export function PackageCard({ pkg, t }: { pkg: CheckupPackage; t: Dictionary }) {
  return (
    <article className="flex w-full flex-col rounded-card neu-raised p-6">
      <p className="text-sm font-semibold text-brand-700">{pkg.audience}</p>
      <h3 className="mt-1 text-h3">{pkg.name.tr}</h3>
      <p className="mt-2 text-ink-muted">{pkg.summary.tr}</p>
      <ul className="mt-4 space-y-1.5 text-[0.95rem]">
        {pkg.includedTests.slice(0, 4).map((test) => (
          <li key={test} className="flex gap-2">
            <span aria-hidden="true" className="text-brand-600">
              ✓
            </span>
            {test}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-ink-muted">
        {format(t.home.package.tests, { n: pkg.includedTests.length })} ·{" "}
        {format(t.home.package.duration, { n: pkg.durationMinutes })}
      </p>
      <Link
        href={appointmentHref({ bolum: "check-up" })}
        className="mt-auto inline-flex min-h-11 items-center gap-1.5 self-start pt-4 font-semibold text-brand-600 underline underline-offset-4 focus-ring"
      >
        {t.common.bookAppointment}
        <span className="sr-only">: {pkg.name.tr}</span>
        <MaterialIcon name="arrow_forward" size={16} />
      </Link>
    </article>
  );
}

export function FeatureCard({ tech }: { tech: Technology }) {
  return (
    <article className="rounded-card neu-inset p-6">
      <DataIcon name={tech.icon} size={32} className="text-brand-600" />
      <p className="mt-4 text-sm font-semibold text-ink-muted">{tech.category}</p>
      <h3 className="mt-1 font-sans text-lg font-semibold">{tech.name.tr}</h3>
      <p className="mt-2 text-[0.95rem] text-ink-muted">{tech.description.tr}</p>
    </article>
  );
}
