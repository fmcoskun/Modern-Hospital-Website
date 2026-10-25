"use client";

import { MaterialIcon } from "@/components/ui/Icon";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { format } from "@/i18n/format";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";
import { suggest } from "./filter";
import { loadSearchIndex } from "./loadIndex";
import type { SearchItem, SearchLabels } from "./types";

/**
 * WAI-ARIA 1.2 combobox (liste otomatik tamamlama). Ok tuşları seçeneklerde gezer, Enter seçer,
 * Esc listeyi kapatır. Seçenek yoksa Enter serbest metinle site aramasına gider.
 */
export function GlobalSearchBox({
  labels,
  inputId,
  onNavigate,
  size = "lg",
}: {
  labels: SearchLabels;
  inputId?: string;
  onNavigate?: () => void;
  size?: "md" | "lg";
}) {
  const router = useRouter();
  const id = useId();
  const listId = `${id}-list`;
  const fieldId = inputId ?? `${id}-input`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const [index, setIndex] = useState<SearchItem[]>([]);
  // İndeks ilk etkileşimde indirilir (sayfa HTML'ini büyütmez).
  const ensureIndex = () => {
    if (index.length === 0) loadSearchIndex().then(setIndex, () => {});
  };
  // Hidrasyondan önce yazılan metin (yavaş cihaz) kaybolmasın: indeks gelince değer state'e alınır.
  useEffect(() => {
    const el = inputRef.current;
    if (!el || (!el.value && document.activeElement !== el)) return;
    loadSearchIndex().then(
      (idx) => {
        setIndex(idx);
        setQuery(el.value);
        setOpen(document.activeElement === el);
      },
      () => {},
    );
  }, []);
  const results = useMemo(() => suggest(index, query), [index, query]);
  const expanded = open && query.trim().length >= 2 && index.length > 0;

  function go(href: string) {
    setOpen(false);
    onNavigate?.();
    router.push(href);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    ensureIndex();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (results.length ? (i + 1) % results.length : -1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (results.length ? (i <= 0 ? results.length - 1 : i - 1) : -1));
    } else if (e.key === "Escape") {
      if (expanded) {
        e.preventDefault();
        e.stopPropagation();
        setOpen(false);
        setActive(-1);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      const picked = results[active];
      if (expanded && picked) go(picked.href);
      else if (query.trim()) go(`${routes.search}?q=${encodeURIComponent(query.trim())}`);
    }
  }

  const groups = (["doctor", "department", "condition"] as const)
    .map((type) => ({
      type,
      items: results.map((item, i) => ({ item, i })).filter((r) => r.item.type === type),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="relative">
      <label htmlFor={fieldId} className="mb-2 block font-medium">
        {labels.label}
      </label>
      <div className="relative">
        <MaterialIcon
          name="search"
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-muted"
        />
        <input
          ref={inputRef}
          id={fieldId}
          type="search"
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={expanded}
          aria-controls={listId}
          aria-activedescendant={expanded && active >= 0 ? `${id}-opt-${active}` : undefined}
          placeholder={labels.placeholder}
          value={query}
          onChange={(e) => {
            ensureIndex();
            setQuery(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => {
            ensureIndex();
            setOpen(true);
          }}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={onKeyDown}
          className={cn(
            "w-full rounded-input border border-control neu-inset pr-4 pl-12 text-ink focus-ring placeholder:text-ink-muted",
            size === "lg" ? "h-14 text-lg" : "h-12",
          )}
        />
      </div>
      <p aria-live="polite" className="sr-only">
        {expanded && index.length > 0
          ? results.length
            ? format(labels.results, { n: results.length })
            : labels.noResults
          : ""}
      </p>
      <ul
        id={listId}
        role="listbox"
        aria-label={labels.label}
        hidden={!expanded}
        className="absolute inset-x-0 top-full z-40 mt-2 max-h-[60vh] overflow-y-auto rounded-card border border-control bg-raised p-2 shadow-neu-raised"
      >
        {results.length === 0 && index.length > 0 && (
          <li role="presentation" className="px-4 py-3 text-ink-muted">
            {labels.noResults}
          </li>
        )}
        {groups.map((g) => (
          <li key={g.type} role="group" aria-labelledby={`${id}-g-${g.type}`}>
            <p
              id={`${id}-g-${g.type}`}
              className="px-3 pt-3 pb-1 text-xs font-semibold tracking-wide text-ink-muted uppercase"
            >
              {labels.groups[g.type]}
            </p>
            <ul role="presentation">
              {g.items.map(({ item, i }) => (
                // Seçenekler input'taki ok/Enter tuşlarıyla yönetilir (combobox deseni); tıklama yalnız fare kısayolu.
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                <li
                  key={item.id}
                  id={`${id}-opt-${i}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => go(item.href)}
                  onMouseEnter={() => setActive(i)}
                  className={cn(
                    "flex min-h-11 cursor-pointer flex-col justify-center rounded-input px-3 py-2",
                    i === active ? "bg-brand-600 text-inverse" : "hover:bg-brand-100",
                  )}
                >
                  <span className="font-medium">{item.label}</span>
                  {item.sub && (
                    <span
                      className={cn(
                        "line-clamp-1 text-sm",
                        i === active ? "text-inverse" : "text-ink-muted",
                      )}
                    >
                      {item.sub}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
