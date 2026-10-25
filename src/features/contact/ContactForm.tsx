"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Feedback";
import { FormErrorSummary, Select, TextField, Textarea } from "@/components/ui/Form";
import type { Dictionary } from "@/i18n";
import { format } from "@/i18n/format";
import { routes } from "@/lib/routes";
import { sendContactAction } from "./actions";
import { contactSchema, TOPICS, type ContactErrorKey, type ContactInput } from "./schema";

const order: (keyof ContactInput)[] = ["name", "email", "phone", "topic", "message"];

export function ContactForm({ labels }: { labels: Dictionary["contact"] }) {
  // Doldurma süresi ilk etkileşimden ölçülür (prerender sırasında saat okunmaz).
  const [startedAt, setStartedAt] = useState(0);
  const [status, setStatus] = useState<"idle" | "sent" | "rateLimited" | "spam" | "server">("idle");
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, submitCount },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", topic: "general", message: "" },
    shouldFocusError: false,
  });
  const topic = useWatch({ control, name: "topic" });
  const message = useWatch({ control, name: "message" }) ?? "";
  const msg = (k?: string) => (k ? labels.errors[k as ContactErrorKey] : undefined);
  const list = order
    .filter((f) => errors[f])
    .map((f) => ({
      fieldId: `c-${f}`,
      message: `${labels.fields[f]}: ${msg(errors[f]?.message)}`,
    }));

  const onValid = (values: ContactInput, website: string) =>
    startTransition(async () => {
      const res = await sendContactAction({ values, website, startedAt }).catch(
        () => ({ ok: false, error: "server" }) as const,
      );
      if (res.ok) {
        setStatus("sent");
        return;
      }
      if (res.error === "validation") {
        for (const [field, key] of Object.entries(res.fieldErrors))
          setError(field as keyof ContactInput, { message: key });
        setStatus("idle");
      } else setStatus(res.error);
    });

  if (status === "sent") {
    return (
      <div>
        <Alert tone="success" role="status" title={labels.success} />
        <Button
          variant="secondary"
          className="mt-4"
          onClick={() => {
            reset();
            setStartedAt(0);
            setStatus("idle");
          }}
        >
          {labels.newMessage}
        </Button>
      </div>
    );
  }

  return (
    <form
      noValidate
      onFocus={() => {
        if (startedAt === 0) setStartedAt(Date.now());
      }}
      onSubmit={(e) => {
        const website = String(new FormData(e.currentTarget).get("website") ?? "");
        return handleSubmit(
          (values) => onValid(values, website),
          () => setTimeout(() => document.getElementById("contact-errors")?.focus(), 0),
        )(e);
      }}
      className="space-y-5"
    >
      <Alert tone="warning">{labels.healthWarning}</Alert>
      {status !== "idle" && (
        <Alert tone="error" role="alert">
          {labels.errors[status]}
        </Alert>
      )}
      <FormErrorSummary
        id="contact-errors"
        title={format(labels.errors.summaryTitle, { n: list.length })}
        errors={submitCount > 0 ? list : []}
      />
      <TextField
        id="c-name"
        label={labels.fields.name}
        autoComplete="name"
        error={msg(errors.name?.message)}
        {...register("name")}
      />
      <p id="c-contact-hint" className="text-sm text-ink-muted">
        {labels.fields.contactHint}
      </p>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          id="c-email"
          type="email"
          label={labels.fields.email}
          autoComplete="email"
          error={msg(errors.email?.message)}
          {...register("email")}
        />
        <TextField
          id="c-phone"
          type="tel"
          label={labels.fields.phone}
          autoComplete="off"
          error={msg(errors.phone?.message)}
          {...register("phone")}
        />
      </div>
      <div>
        <Select
          id="c-topic"
          label={labels.fields.topic}
          error={msg(errors.topic?.message)}
          {...register("topic")}
        >
          {TOPICS.map((k) => (
            <option key={k} value={k}>
              {labels.topics[k]}
            </option>
          ))}
        </Select>
        <p aria-live="polite" className="mt-2 text-sm text-ink-muted">
          {labels.routing[topic]}
        </p>
      </div>
      <Textarea
        id="c-message"
        label={labels.fields.message}
        hint={`${labels.fields.messageHint} (${message.length}/2000)`}
        maxLength={2000}
        rows={6}
        error={msg(errors.message?.message)}
        {...register("message")}
      />
      {/* Honeypot: ekranda ve erişilebilirlik ağacında yok; botlar doldurur. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="c-website">{labels.fields.honeypot}</label>
        <input id="c-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <p className="text-sm text-ink-muted">
        {labels.fields.kvkk}{" "}
        <Link
          href={routes.kvkk}
          className="rounded font-semibold text-brand-600 underline focus-ring"
        >
          KVKK
        </Link>
      </p>
      <p className="text-sm text-ink-muted">{labels.demoNote}</p>
      <Button type="submit" size="lg" loading={pending} loadingText={labels.sending}>
        {labels.submit}
      </Button>
    </form>
  );
}
