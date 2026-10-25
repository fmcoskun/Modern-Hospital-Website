import { MaterialIcon } from "@/components/ui/Icon";
import Image from "next/image";
import Link from "next/link";
import { photo, type Photo, type PhotoKey } from "@/lib/photos";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Container({ className, ...rest }: ComponentProps<"div">) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)} {...rest} />
  );
}

/** Sözlükteki `**vurgu**` işaretini <b>'ye çevirir (bölüm başlığındaki kalın kısım). */
export function Rich({ text }: { text: string }) {
  return text.split("**").map((part, i) => (i % 2 ? <b key={i}>{part}</b> : part));
}

/**
 * Bölüm kalıbı: küçük marka renkli etiket (`section-title`) + içinde <b> vurgusu olan büyük
 * başlık (`sub-title`). `tone`: beyaz, açık (dönüşümlü zemin) veya koyu bant.
 */
export function Section({
  id,
  eyebrow,
  title,
  lead,
  action,
  children,
  className,
  center = false,
  tone = "white",
  headingLevel: H = "h2",
}: {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  lead?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  center?: boolean;
  tone?: "white" | "light" | "dark";
  headingLevel?: "h2" | "h3";
}) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn(
        "py-14 sm:py-20",
        tone === "light" && "bg-sunken",
        tone === "dark" && "bg-dark text-inverse",
        className,
      )}
    >
      <Container>
        <SectionHeading
          id={headingId}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
          action={action}
          center={center}
          dark={tone === "dark"}
          as={H}
        />
        {children}
      </Container>
    </section>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  lead,
  action,
  center = false,
  dark = false,
  as: H = "h2",
}: {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  lead?: string;
  action?: ReactNode;
  center?: boolean;
  dark?: boolean;
  as?: "h2" | "h3";
}) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-wrap items-end gap-4",
        center ? "justify-center text-center" : "justify-between",
      )}
    >
      <div className={cn("max-w-3xl", center && "mx-auto")}>
        {eyebrow && (
          <p className={cn("mb-2 text-sm font-medium", dark ? "text-brand-200" : "text-brand-600")}>
            {eyebrow}
          </p>
        )}
        <H
          id={id}
          className={cn(
            "text-h2 font-normal tracking-normal [&_b]:font-bold",
            dark ? "text-inverse" : "text-ink",
          )}
        >
          {title}
        </H>
        {lead && <p className={cn("mt-3", dark ? "text-inverse/85" : "text-ink-muted")}>{lead}</p>}
      </div>
      {action}
    </div>
  );
}

type CardVariant = "raised" | "inset" | "flat";
const cardVariants: Record<CardVariant, string> = {
  raised: "neu-raised",
  inset: "neu-inset",
  flat: "bg-raised border border-subtle shadow-neu-flat",
};

export function Card({
  variant = "raised",
  className,
  ...rest
}: ComponentProps<"div"> & { variant?: CardVariant }) {
  return <div className={cn("rounded-card", cardVariants[variant], className)} {...rest} />;
}

export function SkipLink({ label }: { label: string }) {
  return (
    <a
      href="#main"
      className="sr-only z-[100] rounded-full bg-brand-600 px-5 py-3 font-semibold text-inverse focus-ring focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
    >
      {label}
    </a>
  );
}

export function Breadcrumb({
  label,
  items,
}: {
  label: string;
  items: { name: string; href?: string }[];
}) {
  return (
    <nav aria-label={label} className="text-sm">
      <ol className="flex flex-wrap items-center gap-1 text-ink-muted">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.name}-${i}`} className="flex items-center gap-1">
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="rounded px-0.5 underline-offset-4 focus-ring hover:text-brand-600 hover:underline"
                >
                  {item.name}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className={cn(last && "font-medium text-ink")}
                >
                  {item.name}
                </span>
              )}
              {!last && <MaterialIcon name="chevron_right" size={16} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Sayfa başlığı: fotoğraflı banner, koyu katman, beyaz başlık. Fixed header'ın altında kaldığı
 * için üstten boşluk bırakır. Detay sayfalarında önceki/sonraki gezinme.
 */
export function PageHeader({
  breadcrumb,
  eyebrow,
  title,
  lead,
  children,
  image = "banner-genel",
  nav,
}: {
  breadcrumb?: ReactNode;
  /** h1 üstündeki küçük etiket (rozet, kategori, tarih). */
  eyebrow?: ReactNode;
  title: string;
  lead?: ReactNode;
  children?: ReactNode;
  image?: PhotoKey | Photo;
  nav?: { prev?: { label: string; href: string }; next?: { label: string; href: string } };
}) {
  const p = typeof image === "string" ? photo(image) : image;
  return (
    <section className="relative isolate overflow-hidden bg-dark text-inverse">
      <Image src={p.src} alt="" fill priority sizes="100vw" className="-z-10 object-cover" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-dark/95 via-dark/80 to-dark/45"
      />
      <Container className="pt-36 pb-12 sm:pt-44 sm:pb-16">
        <div className="[&_a]:text-inverse/85 [&_a:hover]:text-inverse [&_li]:text-inverse/85 [&_span[aria-current]]:text-inverse">
          {breadcrumb}
        </div>
        {eyebrow && (
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-inverse/90">
            {eyebrow}
          </div>
        )}
        <h1 className="mt-4 max-w-4xl text-h1 font-bold text-inverse">{title}</h1>
        {lead && <div className="mt-3 max-w-3xl text-lg text-inverse/90">{lead}</div>}
        {children}
        {nav && (nav.prev || nav.next) && (
          <div className="mt-8 flex flex-wrap justify-between gap-4 border-t border-inverse/25 pt-5 text-sm">
            {nav.prev ? (
              <Link
                href={nav.prev.href}
                className="inline-flex min-h-11 items-center gap-1 rounded-input text-inverse/90 focus-ring hover:text-inverse"
              >
                <MaterialIcon name="arrow_back_ios" size={14} />
                <span>{nav.prev.label}</span>
              </Link>
            ) : (
              <span />
            )}
            {nav.next && (
              <Link
                href={nav.next.href}
                className="inline-flex min-h-11 items-center gap-1 rounded-input text-inverse/90 focus-ring hover:text-inverse"
              >
                <span>{nav.next.label}</span>
                <MaterialIcon name="arrow_forward_ios" size={14} />
              </Link>
            )}
          </div>
        )}
      </Container>
    </section>
  );
}

export function StepIndicator({
  label,
  steps,
  current,
}: {
  label: string;
  steps: { id: string; label: string }[];
  current: number;
}) {
  return (
    <nav aria-label={label}>
      <ol className="flex gap-1.5 sm:gap-2">
        {steps.map((step, i) => {
          const state = i < current ? "done" : i === current ? "current" : "todo";
          return (
            <li
              key={step.id}
              className="min-w-0 flex-1"
              aria-current={state === "current" ? "step" : undefined}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "block h-1.5 rounded-full",
                  state === "todo" ? "bg-subtle" : "bg-brand-600",
                  state === "current" && "outline outline-2 outline-offset-1 outline-brand-600",
                )}
              />
              <span
                className={cn(
                  "mt-1.5 hidden truncate text-xs md:block",
                  state === "current" ? "font-semibold text-ink" : "text-ink-muted",
                )}
              >
                {state === "done" && <span aria-hidden="true">✓ </span>}
                {step.label}
              </span>
              <span className="sr-only md:hidden">{step.label}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
