"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { MaterialIcon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

/**
 * Sekmeli bölüm (birimler, şubeler): yatay kaydırılabilir sekme çubuğu + ok butonları;
 * panel içerikleri sunucuda üretilir. WAI-ARIA tabs (otomatik etkinleştirme, ok/Home/End).
 */
export function ScrollTabs({
  tabs,
  panels,
  labels,
  className,
}: {
  tabs: { id: string; label: string }[];
  panels: ReactNode[];
  labels: { prev: string; next: string; list: string };
  className?: string;
}) {
  const base = useId();
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const tabId = (i: number) => `${base}-tab-${tabs[i]?.id}`;
  const panelId = (i: number) => `${base}-panel-${tabs[i]?.id}`;

  const select = (i: number) => {
    const next = (i + tabs.length) % tabs.length;
    setActive(next);
    const el = document.getElementById(tabId(next));
    el?.focus();
    el?.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const map: Record<string, number> = {
      ArrowLeft: active - 1,
      ArrowRight: active + 1,
      Home: 0,
      End: tabs.length - 1,
    };
    const target = map[e.key];
    if (target === undefined) return;
    e.preventDefault();
    select(target);
  };

  const scrollBy = (dir: 1 | -1) =>
    listRef.current?.scrollBy({
      left: dir * listRef.current.clientWidth * 0.6,
      behavior: "smooth",
    });

  const arrow =
    "hidden size-11 shrink-0 items-center justify-center rounded-input border border-subtle bg-raised text-ink-muted focus-ring hover:text-brand-700 sm:inline-flex";

  return (
    <div className={className}>
      <div className="flex items-center gap-2 border-b border-subtle">
        <button
          type="button"
          className={arrow}
          onClick={() => scrollBy(-1)}
          aria-label={labels.prev}
        >
          <MaterialIcon name="keyboard_arrow_left" size={22} />
        </button>
        <div
          ref={listRef}
          role="tablist"
          aria-label={labels.list}
          className="-mb-px flex flex-1 snap-x [scrollbar-width:none] gap-1 overflow-x-auto"
        >
          {tabs.map((t, i) => (
            <button
              key={t.id}
              id={tabId(i)}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-controls={panelId(i)}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={onKeyDown}
              className={cn(
                "min-h-12 shrink-0 snap-start border-b-2 px-4 font-medium whitespace-nowrap focus-ring transition-colors",
                i === active
                  ? "border-brand-600 text-brand-700"
                  : "border-transparent text-ink-muted hover:text-brand-700",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={arrow}
          onClick={() => scrollBy(1)}
          aria-label={labels.next}
        >
          <MaterialIcon name="keyboard_arrow_right" size={22} />
        </button>
      </div>
      {panels.map((panel, i) => (
        <div
          key={tabs[i]?.id ?? i}
          id={panelId(i)}
          role="tabpanel"
          aria-labelledby={tabId(i)}
          hidden={i !== active}
          tabIndex={0}
          className="rounded-card pt-8 focus-visible:outline-offset-4"
        >
          {panel}
        </div>
      ))}
    </div>
  );
}
