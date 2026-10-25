"use client";

import { useId, useState } from "react";
import { format } from "@/i18n/format";
import { cn } from "@/lib/cn";
import { matchesQuery } from "@/lib/text";

type Type = "public" | "private" | "corporate";

export interface InsuranceItem {
  id: string;
  name: string;
  type: Type;
  coverageNotes: string;
  branches: string[];
}

export function InsuranceDirectory({
  items,
  labels,
}: {
  items: InsuranceItem[];
  labels: {
    search: string;
    placeholder: string;
    type: string;
    types: Record<Type | "all", string>;
    branches: string;
    count: string;
    none: string;
  };
}) {
  const id = useId();
  const [q, setQ] = useState("");
  const [type, setType] = useState<Type | "all">("all");
  const shown = items.filter(
    (i) => (type === "all" || i.type === type) && matchesQuery([i.name, i.coverageNotes], q),
  );
  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="w-full max-w-md">
          <label htmlFor={`${id}-q`} className="mb-1.5 block font-medium">
            {labels.search}
          </label>
          <input
            id={`${id}-q`}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={labels.placeholder}
            className="h-12 w-full rounded-full border border-control neu-inset px-5 focus-ring"
          />
        </div>
        <div role="group" aria-label={labels.type} className="flex flex-wrap gap-2">
          {(["all", "public", "private", "corporate"] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={type === v}
              onClick={() => setType(v)}
              className={cn(
                "min-h-11 rounded-full border px-4 text-sm font-semibold focus-ring",
                type === v
                  ? "border-brand-600 bg-brand-600 text-inverse"
                  : "border-control bg-raised hover:bg-brand-100",
              )}
            >
              {type === v && <span aria-hidden="true">✓ </span>}
              {labels.types[v]}
            </button>
          ))}
        </div>
      </div>
      <p role="status" className="mt-4 text-sm font-semibold">
        {shown.length ? format(labels.count, { n: shown.length }) : labels.none}
      </p>
      <ul className="mt-4 grid gap-4 md:grid-cols-2">
        {shown.map((i) => (
          <li
            key={i.id}
            className="rounded-card border border-subtle bg-raised p-5 shadow-neu-flat"
          >
            <p className="text-sm font-semibold text-brand-700">{labels.types[i.type]}</p>
            <h2 className="mt-1 font-sans text-lg font-semibold">{i.name}</h2>
            <p className="mt-1 text-ink-muted">{i.coverageNotes}</p>
            <p className="mt-3 text-sm">
              <span className="font-semibold">{labels.branches}:</span> {i.branches.join(", ")}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
