"use client";

import { MaterialIcon } from "@/components/ui/Icon";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState, useTransition, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Yerel GET formu (JS kapalıyken de çalışır). JS açıkken select değişiminde ve yazmayı
 * bitirdikten kısa süre sonra URL'yi günceller; filtreler paylaşılabilir ve geri tuşu çalışır.
 */
export function AutoSubmitForm({
  children,
  className,
  label,
  toggleLabel,
  startOpen = false,
}: {
  children: ReactNode;
  className?: string;
  label: string;
  /** Mobilde paneli açıp kapatan buton metni. */
  toggleLabel: string;
  startOpen?: boolean;
}) {
  // Mobilde panel sunucuda da kapalı render edilir (hidrasyonda kayma/CLS olmaz);
  // JS yoksa <noscript> stili paneli açar ve işlevsiz butonu gizler.
  const [open, setOpen] = useState(startOpen);
  const router = useRouter();
  const pathname = usePathname();
  const ref = useRef<HTMLFormElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [pending, startTransition] = useTransition();

  function apply() {
    const form = ref.current;
    if (!form) return;
    const params = new URLSearchParams();
    for (const [k, v] of new FormData(form))
      if (typeof v === "string" && v.trim()) params.set(k, v.trim());
    const qs = params.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  }

  return (
    <form
      ref={ref}
      role="search"
      aria-label={label}
      aria-busy={pending || undefined}
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        apply();
      }}
      onChange={(e) => {
        clearTimeout(timer.current);
        const isText = (e.target as HTMLElement).tagName === "INPUT";
        timer.current = setTimeout(apply, isText ? 350 : 0);
      }}
    >
      <noscript>
        <style>{`#doctor-filter-fields{display:block!important}#doctor-filter-toggle{display:none!important}`}</style>
      </noscript>
      <button
        id="doctor-filter-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="doctor-filter-fields"
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-12 w-full items-center gap-2 rounded-card neu-raised px-5 font-semibold focus-ring lg:hidden"
      >
        <MaterialIcon name="tune" />
        {toggleLabel}
      </button>
      <div id="doctor-filter-fields" className={cn("mt-3 lg:mt-0", !open && "hidden lg:block")}>
        {children}
      </div>
    </form>
  );
}
