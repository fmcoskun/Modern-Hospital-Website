import { MaterialIcon } from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/icon-names";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Spinner({ className, label }: { className?: string; label?: string }) {
  return (
    <span role={label ? "status" : undefined} className="inline-flex items-center">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className={cn("animate-spin motion-reduce:animate-none", className ?? "size-5")}
        fill="none"
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      {label && <span className="sr-only">{label}</span>}
    </span>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-input bg-sunken motion-reduce:animate-none", className)}
    />
  );
}

type Tone = "info" | "success" | "warning" | "error";
const tones: Record<Tone, { cls: string; icon: IconName }> = {
  info: { cls: "bg-info-100 border-brand-600", icon: "info" },
  success: { cls: "bg-success-100 border-success-600", icon: "check_circle" },
  warning: { cls: "bg-warning-200 border-ink", icon: "warning" },
  error: { cls: "bg-danger-100 border-danger-600", icon: "error" },
};

export function Alert({
  tone = "info",
  title,
  children,
  className,
  role,
  id,
  tabIndex,
}: {
  tone?: Tone;
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
  role?: "alert" | "status";
  id?: string;
  tabIndex?: number;
}) {
  const { cls, icon } = tones[tone];
  return (
    <div
      id={id}
      role={role}
      tabIndex={tabIndex}
      className={cn("flex gap-3 rounded-input border-l-4 p-4 text-ink focus-ring", cls, className)}
    >
      <MaterialIcon name={icon} className="mt-0.5" />
      <div className="min-w-0 space-y-1 text-[0.95rem]">
        {title && <p className="font-semibold">{title}</p>}
        {children}
      </div>
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "brand" | "danger" | "success";
  className?: string;
}) {
  const toneCls = {
    neutral: "bg-raised text-ink border-control",
    brand: "bg-brand-100 text-brand-700 border-brand-600",
    danger: "bg-danger-100 text-danger-600 border-danger-600",
    success: "bg-success-100 text-success-600 border-success-600",
  }[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-sm font-medium",
        toneCls,
        className,
      )}
    >
      {children}
    </span>
  );
}

export function DemoBadge({ label, className }: { label: string; className?: string }) {
  return (
    <Badge tone="neutral" className={cn("border-dashed", className)}>
      <MaterialIcon name="info" size={14} />
      {label}
    </Badge>
  );
}

export function EmptyState({
  title,
  children,
  action,
}: {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-card neu-inset p-8 text-center">
      <p className="text-h3">{title}</p>
      {children && <div className="mx-auto mt-2 max-w-prose text-ink-muted">{children}</div>}
      {action && <div className="mt-5 flex flex-wrap justify-center gap-3">{action}</div>}
    </div>
  );
}
