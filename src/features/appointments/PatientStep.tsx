"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Feedback";
import { Checkbox, FormErrorSummary, TextField } from "@/components/ui/Form";
import { format } from "@/i18n/format";
import { routes } from "@/lib/routes";
import { patientSchema, type PatientErrorKey, type PatientInput } from "./schema";
import type { WizardLabels } from "./Wizard";

const fieldOrder: (keyof PatientInput)[] = [
  "firstName",
  "lastName",
  "phone",
  "email",
  "birthYear",
  "consent",
];

export function PatientStep({
  labels,
  defaults,
  onValid,
  onBack,
}: {
  labels: WizardLabels;
  defaults?: PatientInput;
  onValid: (p: PatientInput) => void;
  onBack: () => void;
}) {
  const a = labels.a;
  const {
    register,
    handleSubmit,
    formState: { errors, submitCount },
  } = useForm<PatientInput>({
    resolver: zodResolver(patientSchema),
    defaultValues: defaults ?? {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      birthYear: "",
      consent: undefined as unknown as true,
    },
    shouldFocusError: false,
  });
  const summaryRef = useRef<HTMLDivElement>(null);
  const msg = (k?: string) => (k ? a.errors[k as PatientErrorKey] : undefined);
  const list = fieldOrder
    .filter((f) => errors[f])
    .map((f) => ({
      fieldId: `p-${f}`,
      message: `${f === "consent" ? a.fields.consent : a.fields[f]}: ${msg(errors[f]?.message)}`,
    }));

  useEffect(() => {
    if (submitCount > 0 && list.length > 0) document.getElementById("form-errors")?.focus();
    // Yalnız gönderim denemesinde odakla
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitCount]);

  return (
    <form noValidate onSubmit={handleSubmit(onValid)}>
      <Alert tone="info" className="mb-6">
        {a.patientNote}
      </Alert>
      <div ref={summaryRef}>
        <FormErrorSummary
          title={format(a.errors.summaryTitle, { n: list.length })}
          errors={submitCount > 0 ? list : []}
        />
      </div>
      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        <TextField
          id="p-firstName"
          label={a.fields.firstName}
          autoComplete="given-name"
          error={msg(errors.firstName?.message)}
          {...register("firstName")}
        />
        <TextField
          id="p-lastName"
          label={a.fields.lastName}
          autoComplete="family-name"
          error={msg(errors.lastName?.message)}
          {...register("lastName")}
        />
        <TextField
          id="p-phone"
          label={a.fields.phone}
          hint={a.fields.phoneHint}
          type="tel"
          inputMode="tel"
          autoComplete="off"
          error={msg(errors.phone?.message)}
          {...register("phone")}
        />
        <TextField
          id="p-email"
          label={a.fields.email}
          type="email"
          autoComplete="email"
          error={msg(errors.email?.message)}
          {...register("email")}
        />
        <TextField
          id="p-birthYear"
          label={a.fields.birthYear}
          hint={a.fields.birthYearHint}
          inputMode="numeric"
          autoComplete="bday-year"
          maxLength={4}
          error={msg(errors.birthYear?.message)}
          {...register("birthYear")}
        />
      </div>
      <Checkbox
        id="p-consent"
        className="mt-6"
        error={msg(errors.consent?.message)}
        label={
          <>
            {a.fields.consent}{" "}
            <Link
              href={routes.kvkk}
              target="_blank"
              className="rounded font-semibold text-brand-600 underline focus-ring"
            >
              {a.fields.kvkkLink}
              <span className="sr-only"> (yeni sekmede açılır)</span>
            </Link>
          </>
        }
        {...register("consent")}
      />
      <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-subtle pt-6">
        <Button variant="ghost" onClick={onBack}>
          ← {labels.common.back}
        </Button>
        <Button type="submit">{labels.common.next} →</Button>
      </div>
    </form>
  );
}
