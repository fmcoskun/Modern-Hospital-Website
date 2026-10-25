import { cn } from "@/lib/cn";
import { ICON_NAMES, type IconName } from "./icon-names";

/**
 * Material Symbols Rounded ikon fontu. Font kendi sunucumuzdan ve
 * yalnız kullanılan gliflerle gelir (`pnpm icons:fetch`). Varsayılan dekoratif (aria-hidden);
 * ikon tek başına anlam taşıyorsa `label` verilir.
 */
export function MaterialIcon({
  name,
  size = 20,
  filled = false,
  label,
  className,
}: {
  name: IconName;
  /** px; yazı tipi boyutu = ikon boyutu */
  size?: number;
  filled?: boolean;
  label?: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
      translate="no"
      className={cn("msr", filled && "msr-filled", className)}
      style={{ fontSize: size }}
    >
      {name}
    </span>
  );
}

const known = new Set<string>(ICON_NAMES);
export const isIconName = (value: string): value is IconName => known.has(value);

/** Seed verisindeki ikon adını (string) gösterir; bilinmeyen ad stetoskopa düşer. */
export function DataIcon({
  name,
  size,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  return (
    <MaterialIcon
      name={isIconName(name) ? name : "stethoscope"}
      size={size}
      className={className}
    />
  );
}
