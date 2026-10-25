"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { DataIcon } from "@/components/ui/Icon";
import { format } from "@/i18n/format";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";
import { matchesQuery, normalizeTr } from "@/lib/text";

export interface UnitItem {
  slug: string;
  name: string;
  icon: string;
  groupId: string;
  keywords: string[];
}

/** Bölüm listesi: grup / A–Z görünümü ve anlık filtre. JS yoksa sunucu çıktısı (grup görünümü) çalışır. */
export function UnitDirectory({
  units,
  groups,
  labels,
}: {
  units: UnitItem[];
  groups: { id: string; name: string }[];
  labels: {
    grouped: string;
    az: string;
    filter: string;
    placeholder: string;
    noMatch: string;
    count: string;
  };
}) {
  const id = useId();
  const [view, setView] = useState<"grouped" | "az">("grouped");
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () => units.filter((u) => matchesQuery([u.name, ...u.keywords], q)),
    [units, q],
  );

  const sections =
    view === "grouped"
      ? groups.map((g) => ({
          key: g.id,
          title: g.name,
          items: filtered.filter((u) => u.groupId === g.id),
        }))
      : [...new Set(filtered.map((u) => normalizeTr(u.name).charAt(0).toUpperCase()))]
          .sort()
          .map((letter) => ({
            key: letter,
            title: letter,
            items: filtered
              .filter((u) => normalizeTr(u.name).charAt(0).toUpperCase() === letter)
              .sort((a, b) => a.name.localeCompare(b.name, "tr")),
          }));

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full max-w-md">
          <label htmlFor={`${id}-q`} className="mb-1.5 block font-medium">
            {labels.filter}
          </label>
          <input
            id={`${id}-q`}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={labels.placeholder}
            className="h-12 w-full rounded-input border border-control neu-inset px-5 focus-ring"
          />
        </div>
        <div
          role="group"
          aria-label={`${labels.grouped} / ${labels.az}`}
          className="inline-flex rounded-card neu-inset p-1"
        >
          {(["grouped", "az"] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className={cn(
                "min-h-11 rounded-input px-5 font-medium focus-ring",
                view === v ? "bg-brand-600 text-inverse" : "text-ink-muted hover:text-ink",
              )}
            >
              {view === v && <span aria-hidden="true">✓ </span>}
              {v === "grouped" ? labels.grouped : labels.az}
            </button>
          ))}
        </div>
      </div>

      <p aria-live="polite" className="mt-4 text-sm text-ink-muted">
        {filtered.length ? format(labels.count, { n: filtered.length }) : labels.noMatch}
      </p>

      <div className="mt-6 space-y-10">
        {sections
          .filter((s) => s.items.length > 0)
          .map((s) => (
            <section key={s.key} aria-labelledby={`${id}-${s.key}`}>
              <h2 id={`${id}-${s.key}`} className="mb-4 text-h3">
                {s.title}
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {s.items.map((u) => (
                  <li key={u.slug}>
                    <Link
                      href={routes.unit(u.slug)}
                      className="flex min-h-16 items-center gap-4 rounded-input neu-raised-sm px-4 py-3 font-semibold focus-ring transition-colors hover:bg-brand-100"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                        <DataIcon name={u.icon} />
                      </span>
                      {u.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
      </div>
    </div>
  );
}
