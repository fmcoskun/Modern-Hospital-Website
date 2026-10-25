import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { listKnownPaths } from "@/lib/known-paths";

/** Sitemap, proxy'nin kullandığı bilinen yol listesiyle aynı kaynaktan üretilir. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = await listKnownPaths();
  return paths
    .filter((p) => p !== "/arama")
    .map((p) => ({
      url: new URL(p, env.NEXT_PUBLIC_SITE_URL).toString(),
      changeFrequency: "weekly",
    }));
}
