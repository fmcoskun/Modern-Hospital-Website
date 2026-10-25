import { cn } from "@/lib/cn";

/** Beyaz daire içinde kırmızı hilal (iki yay: dış r=13, iç r=11). */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={cn("size-11", className)}>
      <circle cx="24" cy="24" r="22" fill="var(--surface-raised)" stroke="var(--border-subtle)" />
      <path
        d="M22.4 11.01A13 13 0 1 0 33.66 29.76A11 11 0 1 1 22.4 11.01Z"
        transform="translate(2 0)"
        fill="var(--danger-600)"
      />
    </svg>
  );
}
