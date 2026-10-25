import { MaterialIcon } from "@/components/ui/Icon";
import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/layout/Logo";
import { telHref } from "@/components/layout/navigation";
import { Container, SkipLink } from "@/components/ui/Layout";
import { getDictionary } from "@/i18n";
import { data } from "@/lib/data";
import { routes } from "@/lib/routes";

/** Dikkat dağıtmayan sade akış layout'u (plan 7.3). */
export default async function FlowLayout({ children }: { children: ReactNode }) {
  const [t, hospital] = await Promise.all([getDictionary(), data.hospital.get()]);
  return (
    <>
      <SkipLink label={t.common.skipToContent} />
      <header className="border-b border-subtle bg-surface">
        <Container className="flex h-16 items-center justify-between gap-4">
          <Link href={routes.home} className="flex items-center gap-2 rounded-input focus-ring">
            <Logo className="size-9" />
            <span className="font-semibold text-brand-700">ÖZEL FMC</span>
            <span className="sr-only"> HASTANESİ — {t.common.home}</span>
          </Link>
          <div className="flex items-center gap-2">
            <a
              href={telHref(hospital.callCenterPhone)}
              className="hidden min-h-11 items-center gap-2 rounded-input px-3 text-sm font-medium focus-ring sm:inline-flex"
            >
              <MaterialIcon name="call" size={16} />
              {hospital.callCenterPhone}
            </a>
            <Link
              href={routes.home}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-input border border-control px-4 text-sm font-medium focus-ring"
            >
              <MaterialIcon name="close" size={16} />
              {t.common.close}
            </Link>
          </div>
        </Container>
      </header>
      <main id="main" tabIndex={-1} className="pb-16 focus:outline-none">
        {children}
      </main>
    </>
  );
}
