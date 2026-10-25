import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { inter } from "@/app/fonts";
import { getDictionary, getLocale } from "@/i18n";
import { locales } from "@/i18n/config";
import { env } from "@/lib/env";
import "../globals.css";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
    title: { default: t.meta.siteName, template: t.meta.titleTemplate },
    description: t.meta.description,
    // Portfolyo demosu: arama motorlarında listelenmez (plan Açık sorular, varsayılan).
    robots: env.DEMO_MODE ? { index: false, follow: false } : undefined,
    openGraph: { siteName: t.meta.siteName, locale: "tr_TR", type: "website" },
  };
}

export const viewport: Viewport = { themeColor: "#e4e8ec", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale} className={inter.variable}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
