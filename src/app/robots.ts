import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

/** Portfolyo demosu varsayılan olarak indekslenmez (DEMO_MODE). */
export default function robots(): MetadataRoute.Robots {
  if (env.DEMO_MODE) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/arama", "/randevu/"] },
    sitemap: new URL("/sitemap.xml", env.NEXT_PUBLIC_SITE_URL).toString(),
  };
}
