import { buildSearchIndex } from "@/features/search/buildIndex";

/**
 * Otomatik tamamlama indeksi: build sırasında statik üretilir ve yalnız arama kutusu
 * kullanılınca indirilir (her sayfanın HTML'ine gömülmez — mobil LCP, docs/perf-3d.md).
 */
export async function GET() {
  return Response.json(await buildSearchIndex());
}
