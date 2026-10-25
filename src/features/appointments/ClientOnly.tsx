"use client";

import { useSyncExternalStore, type ReactNode } from "react";

const noop = () => () => {};

/** sessionStorage'a bağlı akışı yalnız tarayıcıda render eder (hidrasyon uyuşmazlığını önler). */
export function ClientOnly({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  const mounted = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  return mounted ? children : fallback;
}
