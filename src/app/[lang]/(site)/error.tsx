"use client";

import { useEffect, useRef } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import tr from "@/i18n/dictionaries/tr";

// error.tsx bir Client Component olmak zorunda; sözlüğe erişemediği için TR metinleri doğrudan alır.
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus(), []);
  return (
    <Container className="pt-40 pb-20">
      <h1 ref={heading} tabIndex={-1} className="text-h1 focus:outline-none">
        {tr.error.title}
      </h1>
      <p className="mt-3 max-w-prose text-ink-muted">{tr.error.body}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button onClick={reset}>{tr.error.retry}</Button>
        <ButtonLink href="/" variant="secondary">
          {tr.common.home}
        </ButtonLink>
      </div>
    </Container>
  );
}
