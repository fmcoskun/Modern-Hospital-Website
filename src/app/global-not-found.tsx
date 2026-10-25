import type { Metadata } from "next";
import Link from "next/link";
import { inter } from "./fonts";
import tr from "@/i18n/dictionaries/tr";
import "./globals.css";

export const metadata: Metadata = {
  title: `${tr.notFound.title} | ${tr.meta.siteName}`,
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="tr" className={inter.variable}>
      <body className="min-h-dvh">
        <main className="mx-auto max-w-3xl px-4 py-20">
          <p className="text-6xl text-brand-600">404</p>
          <h1 className="mt-4 text-h1">{tr.notFound.title}</h1>
          <p className="mt-3 text-ink-muted">{tr.notFound.body}</p>
          <p className="mt-8 flex flex-wrap gap-4">
            <Link className="font-semibold text-brand-600 underline focus-ring" href="/">
              {tr.common.home}
            </Link>
            <Link className="font-semibold text-brand-600 underline focus-ring" href="/doktorlar">
              {tr.nav.doctors}
            </Link>
            <Link
              className="font-semibold text-brand-600 underline focus-ring"
              href="/randevu/yeni"
            >
              {tr.common.bookAppointment}
            </Link>
          </p>
        </main>
      </body>
    </html>
  );
}
