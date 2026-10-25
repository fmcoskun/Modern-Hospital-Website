import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Spinner } from "./Feedback";

type Variant = "primary" | "secondary" | "ghost" | "light" | "danger" | "onDark";
type Size = "md" | "lg" | "sm";

const base =
  "focus-ring inline-flex min-h-11 select-none items-center whitespace-nowrap justify-center gap-2 rounded-input font-medium transition-[transform,background-color,box-shadow] duration-150 ease-standard active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60 aria-disabled:cursor-not-allowed aria-disabled:opacity-60";

/** Buton varyantları: primary (dolu), outlined (secondary), ghost/text, light. */
const variants: Record<Variant, string> = {
  // Dolgu brand-600: beyaz metin 8,01:1
  primary: "bg-brand-600 text-inverse hover:bg-brand-500 border border-brand-600",
  // Çerçeveli
  secondary:
    "border border-brand-600 bg-transparent text-brand-600 hover:bg-brand-100 hover:border-brand-700 hover:text-brand-700",
  // Metin buton
  ghost: "text-brand-600 hover:bg-brand-100 hover:text-brand-700",
  // Açık dolgu
  light: "border border-brand-200 bg-brand-100 text-brand-700 hover:border-brand-600",
  danger: "bg-danger-600 text-inverse border border-danger-600 hover:brightness-110",
  // Koyu görsel/bant üzerinde çerçeveli beyaz
  onDark: "border border-inverse/80 text-inverse hover:bg-inverse/10",
};

const sizes: Record<Size, string> = {
  sm: "min-h-11 px-3 text-sm",
  md: "px-4 text-base",
  lg: "min-h-12 px-5 text-base",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  loadingText?: string;
  icon?: ReactNode;
};

export function Button({
  variant,
  size,
  loading = false,
  loadingText,
  icon,
  className,
  children,
  disabled,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClass(variant, size, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <Spinner className="size-4" /> : icon}
      <span>{loading && loadingText ? loadingText : children}</span>
    </button>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  /** Metnin sağında ikon (ör. arrow_forward_ios). */
  iconRight?: ReactNode;
};

export function ButtonLink({
  variant,
  size,
  icon,
  iconRight,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link className={buttonClass(variant, size, className)} {...rest}>
      {icon}
      <span>{children}</span>
      {iconRight}
    </Link>
  );
}

export function IconButton({
  label,
  className,
  children,
  type = "button",
  ...rest
}: ComponentProps<"button"> & { label: string }) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-input border border-subtle bg-raised text-ink focus-ring hover:border-brand-600 hover:text-brand-600",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
