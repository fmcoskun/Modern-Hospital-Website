"use client";

import { MaterialIcon } from "@/components/ui/Icon";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import type { Dictionary } from "@/i18n";
import { format } from "@/i18n/format";
import { cn } from "@/lib/cn";
import type { CampusBuilding } from "@/lib/data/types";
import { Campus3D } from "./Campus3D";

const icons = {
  clinic: "apartment",
  emergency: "emergency",
  parking: "directions_car",
  service: "apartment",
} as const;

/**
 * Olanaklar sayfasının etkileşimli kampüsü. Bina seçimi sahneden de HTML listeden de yapılır;
 * klavye ve ekran okuyucu için birincil yol listedir (plan 9.2 "Etkileşim").
 */
export function ExploreCampus({
  buildings,
  poster,
  labels,
}: {
  buildings: CampusBuilding[];
  poster: ReactNode;
  labels: Dictionary["scene3d"];
}) {
  const [selectedId, setSelectedId] = useState("");
  const selected = buildings.find((b) => b.id === selectedId);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <div>
        <div className="aspect-[13/9] overflow-hidden rounded-card neu-raised">
          <Campus3D
            buildings={buildings}
            poster={<div className="size-full p-4 sm:p-6">{poster}</div>}
            labels={labels}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>
        <p className="mt-3 text-sm text-ink-muted">{labels.exploreHint}</p>
      </div>

      <div>
        <h3 className="font-sans text-lg font-semibold" id="campus-buildings">
          {labels.buildings}
        </h3>
        <ul aria-labelledby="campus-buildings" className="mt-3 space-y-2">
          {buildings.map((b) => {
            const icon = icons[b.kind];
            const isSel = b.id === selectedId;
            return (
              <li key={b.id}>
                <button
                  type="button"
                  aria-pressed={isSel}
                  aria-controls="campus-detail"
                  onClick={() => setSelectedId(isSel ? "" : b.id)}
                  className={cn(
                    "flex min-h-12 w-full items-center gap-3 rounded-input border px-4 py-2 text-left font-semibold focus-ring",
                    isSel
                      ? "border-2 border-brand-600 bg-brand-100"
                      : "border-control bg-raised hover:bg-brand-100",
                  )}
                >
                  <MaterialIcon
                    name={icon}
                    className={cn(b.kind === "emergency" ? "text-danger-600" : "text-brand-600")}
                  />
                  <span className="flex-1">{b.name}</span>
                  {isSel && <span aria-hidden="true">✓</span>}
                </button>
              </li>
            );
          })}
        </ul>
        <div
          id="campus-detail"
          aria-live="polite"
          className="mt-4 min-h-36 rounded-card neu-inset p-5"
        >
          {selected ? (
            <>
              <p className="font-sans text-lg font-semibold">{selected.name}</p>
              {selected.floors > 1 && (
                <p className="text-sm text-ink-muted">
                  {format(labels.floors, { n: selected.floors })}
                </p>
              )}
              <p className="mt-2">{selected.description}</p>
              {selected.href && (
                <Link
                  href={selected.href}
                  className="mt-3 inline-flex min-h-11 items-center gap-1.5 rounded font-semibold text-brand-600 underline underline-offset-4 focus-ring"
                >
                  {labels.goTo} <MaterialIcon name="arrow_forward" size={16} />
                </Link>
              )}
            </>
          ) : (
            <p className="text-ink-muted">{labels.selectPrompt}</p>
          )}
        </div>
      </div>
    </div>
  );
}
