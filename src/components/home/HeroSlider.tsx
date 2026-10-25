"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { MaterialIcon } from "@/components/ui/Icon";
import { format } from "@/i18n/format";
import { cn } from "@/lib/cn";

export interface HeroSlide {
  title: string;
  emphasis: string;
  lead: string;
  image: { src: string; width: number; height: number; alt: string };
}

export interface HeroSliderLabels {
  label: string;
  prev: string;
  next: string;
  goTo: string;
  slide: string;
  scroll: string;
}

/**
 * Ana sayfa slider'ı: tam ekran fotoğraf, iki satırlı slogan,
 * önceki/sonraki okları, sayfalama noktaları ve fare kaydırma göstergesi. WAI-ARIA carousel
 * kalıbı; otomatik geçiş yok (WCAG 2.2.2). Görünmeyen slaytlar `inert`.
 */
export function HeroSlider({
  slides,
  labels,
  heading,
  actions,
  scrollTarget,
}: {
  slides: HeroSlide[];
  labels: HeroSliderLabels;
  /** Sayfanın tek h1'i (ekran okuyucu); slogan metinleri slayt içinde görsel başlıktır. */
  heading: string;
  actions: ReactNode;
  scrollTarget: string;
}) {
  const [active, setActive] = useState(0);
  const total = slides.length;
  const go = (i: number) => setActive((i + total) % total);

  const control =
    "inline-flex size-11 items-center justify-center rounded-input border border-inverse/60 text-inverse transition-colors focus-ring hover:bg-inverse/15";

  return (
    <section
      aria-roledescription="carousel"
      aria-label={labels.label}
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-dark text-inverse"
    >
      <h1 id="hero-title" className="sr-only">
        {heading}
      </h1>
      {slides.map((s, i) => (
        <div
          key={s.image.src}
          aria-hidden="true"
          className={cn(
            "absolute inset-0 -z-10 transition-opacity duration-700 ease-standard",
            i === active ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            src={s.image.src}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark/90 via-dark/65 to-dark/25" />
        </div>
      ))}

      <div className="relative mx-auto w-full max-w-7xl px-4 pt-40 pb-28 sm:px-6 sm:pb-32 lg:px-8">
        {slides.map((s, i) => (
          <div
            key={s.title}
            role="group"
            aria-roledescription="slide"
            aria-label={format(labels.slide, { n: i + 1, total })}
            hidden={i !== active}
            className="max-w-2xl"
          >
            <p className="text-display leading-tight font-light text-inverse">
              {s.title}
              <b className="block font-bold">{s.emphasis}</b>
            </p>
            <p className="mt-5 max-w-xl text-lg text-inverse/90">{s.lead}</p>
            <p className="sr-only">{s.image.alt}</p>
          </div>
        ))}
        <div className="mt-8 flex flex-wrap gap-3">{actions}</div>

        <div className="mt-10 flex items-center gap-3">
          <button
            type="button"
            onClick={() => go(active - 1)}
            aria-label={labels.prev}
            className={control}
          >
            <MaterialIcon name="keyboard_arrow_left" size={24} />
          </button>
          <ol className="flex items-center">
            {slides.map((s, i) => (
              <li key={s.title}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-label={format(labels.goTo, { n: i + 1 })}
                  aria-current={i === active || undefined}
                  className="group inline-flex size-11 items-center justify-center rounded-input focus-ring"
                >
                  <span
                    className={cn(
                      "h-1 rounded-full transition-all duration-300",
                      i === active
                        ? "w-8 bg-inverse"
                        : "w-4 bg-inverse/50 group-hover:bg-inverse/80",
                    )}
                  />
                </button>
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={() => go(active + 1)}
            aria-label={labels.next}
            className={control}
          >
            <MaterialIcon name="keyboard_arrow_right" size={24} />
          </button>
        </div>
      </div>

      <a
        href={`#${scrollTarget}`}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 rounded-full p-2 focus-ring sm:block"
      >
        <span className="sr-only">{labels.scroll}</span>
        <span
          aria-hidden="true"
          className="flex h-10 w-6 justify-center rounded-full border-2 border-inverse/80 pt-2"
        >
          <span className="h-2 w-1 animate-bounce rounded-full bg-inverse" />
        </span>
      </a>
    </section>
  );
}
