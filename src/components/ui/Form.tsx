import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/cn";

const control =
  "focus-ring neu-inset w-full rounded-input border border-control px-4 py-3 text-ink placeholder:text-ink-muted aria-[invalid=true]:border-2 aria-[invalid=true]:border-danger-600 disabled:opacity-60";

export function FieldError({ id, children }: { id: string; children?: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-danger-600">
      <span aria-hidden="true">✕</span>
      {children}
    </p>
  );
}

interface FieldProps {
  label: string;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
}

function useFieldIds(id?: string) {
  const auto = useId();
  const fieldId = id ?? auto;
  return { fieldId, hintId: `${fieldId}-hint`, errorId: `${fieldId}-error` };
}

function describedBy(hint: unknown, error: unknown, hintId: string, errorId: string) {
  return [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;
}

export function TextField({
  label,
  hint,
  error,
  id,
  className,
  ...rest
}: FieldProps & ComponentProps<"input">) {
  const { fieldId, hintId, errorId } = useFieldIds(id);
  return (
    <div className={className}>
      <label htmlFor={fieldId} className="mb-1.5 block font-medium">
        {label}
      </label>
      {hint && (
        <p id={hintId} className="mb-1.5 text-sm text-ink-muted">
          {hint}
        </p>
      )}
      <input
        id={fieldId}
        className={control}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(hint, error, hintId, errorId)}
        {...rest}
      />
      <FieldError id={errorId}>{error}</FieldError>
    </div>
  );
}

export function Textarea({
  label,
  hint,
  error,
  id,
  className,
  ...rest
}: FieldProps & ComponentProps<"textarea">) {
  const { fieldId, hintId, errorId } = useFieldIds(id);
  return (
    <div className={className}>
      <label htmlFor={fieldId} className="mb-1.5 block font-medium">
        {label}
      </label>
      {hint && (
        <p id={hintId} className="mb-1.5 text-sm text-ink-muted">
          {hint}
        </p>
      )}
      <textarea
        id={fieldId}
        className={cn(control, "min-h-32")}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(hint, error, hintId, errorId)}
        {...rest}
      />
      <FieldError id={errorId}>{error}</FieldError>
    </div>
  );
}

export function Select({
  label,
  hint,
  error,
  id,
  className,
  children,
  ...rest
}: FieldProps & ComponentProps<"select">) {
  const { fieldId, hintId, errorId } = useFieldIds(id);
  return (
    <div className={className}>
      <label htmlFor={fieldId} className="mb-1.5 block font-medium">
        {label}
      </label>
      <select
        id={fieldId}
        className={cn(control, "appearance-auto pr-8")}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(hint, error, hintId, errorId)}
        {...rest}
      >
        {children}
      </select>
      {hint && (
        <p id={hintId} className="mt-1.5 text-sm text-ink-muted">
          {hint}
        </p>
      )}
      <FieldError id={errorId}>{error}</FieldError>
    </div>
  );
}

export function Checkbox({
  label,
  error,
  id,
  className,
  ...rest
}: { label: ReactNode; error?: string } & Omit<ComponentProps<"input">, "type">) {
  const { fieldId, errorId } = useFieldIds(id);
  return (
    <div className={className}>
      <div className="flex items-start gap-3">
        <input
          id={fieldId}
          type="checkbox"
          className="mt-1 size-5 shrink-0 accent-brand-600 focus-ring"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          {...rest}
        />
        <label htmlFor={fieldId}>{label}</label>
      </div>
      <FieldError id={errorId}>{error}</FieldError>
    </div>
  );
}

/**
 * Seçilebilir kart (radyo). Seçili durum: dolgu + kalın brand kenarlık + ✓ ikonu —
 * durum yalnız renk/gölgeye dayanmaz (WCAG 1.4.1).
 */
export function RadioCard({
  name,
  value,
  checked,
  onChange,
  title,
  description,
  icon,
  disabled,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className={cn(
        "relative flex min-h-11 cursor-pointer items-start gap-3 rounded-input border p-4 transition-colors duration-150 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus",
        checked
          ? "border-2 border-brand-600 bg-brand-100 shadow-neu-inset"
          : "!border-control neu-raised-sm hover:bg-brand-100",
        disabled && "cursor-not-allowed opacity-60",
      )}
    >
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      {icon && <span className="mt-0.5 text-brand-600">{icon}</span>}
      <span className="min-w-0 flex-1">
        <span className="block font-semibold">{title}</span>
        {description && <span className="mt-0.5 block text-sm text-ink-muted">{description}</span>}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold",
          checked ? "border-brand-600 bg-brand-600 text-inverse" : "border-control bg-raised",
        )}
      >
        {checked ? "✓" : ""}
      </span>
    </label>
  );
}

/** Formun üstünde, hatalı alanlara link veren özet (plan 6.8). */
export function FormErrorSummary({
  title,
  errors,
  id = "form-errors",
}: {
  title: string;
  errors: { fieldId: string; message: string }[];
  id?: string;
}) {
  if (errors.length === 0) return null;
  return (
    <div
      id={id}
      role="alert"
      tabIndex={-1}
      className="rounded-input border-2 border-danger-600 bg-danger-100 p-4 focus-ring"
    >
      <p className="font-semibold text-danger-600">{title}</p>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {errors.map((e) => (
          <li key={e.fieldId}>
            <a href={`#${e.fieldId}`} className="underline focus-ring">
              {e.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
