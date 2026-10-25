"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Bölüm sayfasındaki doktor grid'i için şube filtresi; kartlar sunucuda render edilip prop olarak gelir. */
export function DoctorGridByBranch({
  items,
  branches,
  labels,
}: {
  items: { id: string; branchIds: string[]; node: ReactNode }[];
  branches: { id: string; name: string }[];
  labels: { all: string; filter: string };
}) {
  const id = useId();
  const [branch, setBranch] = useState("");
  const visible = items.filter((i) => !branch || i.branchIds.includes(branch));
  return (
    <div>
      {branches.length > 1 && (
        <div
          role="group"
          aria-labelledby={`${id}-l`}
          className="mb-6 flex flex-wrap items-center gap-2"
        >
          <span id={`${id}-l`} className="mr-2 font-medium">
            {labels.filter}:
          </span>
          {[{ id: "", name: labels.all }, ...branches].map((b) => (
            <button
              key={b.id || "all"}
              type="button"
              aria-pressed={branch === b.id}
              onClick={() => setBranch(b.id)}
              className={cn(
                "min-h-11 rounded-full border px-4 text-sm font-semibold focus-ring",
                branch === b.id
                  ? "border-brand-600 bg-brand-600 text-inverse"
                  : "border-control bg-raised hover:bg-brand-100",
              )}
            >
              {branch === b.id && <span aria-hidden="true">✓ </span>}
              {b.name}
            </button>
          ))}
        </div>
      )}
      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((i) => (
          <li key={i.id}>{i.node}</li>
        ))}
      </ul>
    </div>
  );
}
