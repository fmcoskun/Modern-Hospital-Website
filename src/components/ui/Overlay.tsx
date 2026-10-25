"use client";

import { MaterialIcon } from "@/components/ui/Icon";
import { Accordion as A, Dialog as D, Tabs as T } from "radix-ui";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Radix Dialog: odak tuzağı, Esc ile kapanma ve odak iadesi hazır gelir. */
export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  closeLabel,
  children,
  side,
  initialFocusId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  closeLabel: string;
  children: ReactNode;
  /** "bottom" → mobil alt sayfa (Sheet), "right" → yan çekmece. */
  side?: "bottom" | "right";
  /** Açılışta odaklanacak öğe (varsayılan: ilk odaklanabilir öğe). */
  initialFocusId?: string;
}) {
  return (
    <D.Root open={open} onOpenChange={onOpenChange}>
      <D.Portal>
        <D.Overlay className="fixed inset-0 z-50 bg-ink/40" />
        <D.Content
          onOpenAutoFocus={(e) => {
            const el = initialFocusId ? document.getElementById(initialFocusId) : null;
            if (el) {
              e.preventDefault();
              el.focus();
            }
          }}
          className={cn(
            "fixed z-50 flex flex-col bg-surface text-ink shadow-2xl focus:outline-none",
            side === "bottom" && "inset-x-0 bottom-0 max-h-[85dvh] rounded-t-card",
            side === "right" && "inset-y-0 right-0 w-full max-w-sm",
            !side &&
              "top-1/2 left-1/2 max-h-[85dvh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-card",
          )}
        >
          <div className="flex items-center justify-between gap-4 border-b border-subtle px-5 py-4">
            <D.Title className="text-h3">{title}</D.Title>
            <D.Close
              aria-label={closeLabel}
              className="inline-flex size-11 items-center justify-center rounded-full border border-control focus-ring"
            >
              <MaterialIcon name="close" />
            </D.Close>
          </div>
          {description ? (
            <D.Description className="px-5 pt-3 text-ink-muted">{description}</D.Description>
          ) : (
            <D.Description className="sr-only">{title}</D.Description>
          )}
          <div className="overflow-y-auto px-5 py-4">{children}</div>
        </D.Content>
      </D.Portal>
    </D.Root>
  );
}

export function Tabs({
  label,
  tabs,
  defaultValue,
}: {
  label: string;
  tabs: { value: string; label: string; content: ReactNode }[];
  defaultValue?: string;
}) {
  return (
    <T.Root defaultValue={defaultValue ?? tabs[0]?.value}>
      <T.List
        aria-label={label}
        className="relative flex gap-1 overflow-x-auto rounded-card neu-inset p-1.5"
      >
        {tabs.map((t) => (
          <T.Trigger
            key={t.value}
            value={t.value}
            className="min-h-11 shrink-0 rounded-input px-4 font-medium text-ink-muted focus-ring data-[state=active]:bg-brand-600 data-[state=active]:text-inverse"
          >
            {t.label}
          </T.Trigger>
        ))}
      </T.List>
      {tabs.map((t) => (
        <T.Content key={t.value} value={t.value} className="mt-6 rounded-input focus-ring">
          {t.content}
        </T.Content>
      ))}
    </T.Root>
  );
}

export function Accordion({
  items,
}: {
  items: { id: string; title: string; content: ReactNode }[];
}) {
  return (
    <A.Root type="multiple" className="space-y-3">
      {items.map((item) => (
        <A.Item key={item.id} value={item.id} className="rounded-input neu-raised-sm">
          <A.Header asChild>
            <h3 className="font-sans text-base">
              <A.Trigger className="group flex min-h-11 w-full items-center justify-between gap-4 rounded-input px-5 py-4 text-left font-semibold focus-ring">
                {item.title}
                <span
                  aria-hidden="true"
                  className="text-xl text-brand-600 transition-transform duration-150 group-data-[state=open]:rotate-45"
                >
                  +
                </span>
              </A.Trigger>
            </h3>
          </A.Header>
          <A.Content className="px-5 pb-5 text-ink-muted">{item.content}</A.Content>
        </A.Item>
      ))}
    </A.Root>
  );
}
