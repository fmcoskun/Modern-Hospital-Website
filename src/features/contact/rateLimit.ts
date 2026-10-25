/**
 * Bellek içi kayan pencere rate limit (demo; gerçekte Redis — plan 10.2).
 * Anahtar başına `limit` istek / `windowMs`. Saf mantık, zaman dışarıdan verilir.
 */
export function createRateLimiter({
  limit,
  windowMs,
  maxKeys = 5000,
}: {
  limit: number;
  windowMs: number;
  maxKeys?: number;
}) {
  const hits = new Map<string, number[]>();
  return function allow(key: string, now: number): boolean {
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    if (recent.length >= limit) {
      hits.set(key, recent);
      return false;
    }
    recent.push(now);
    hits.delete(key);
    hits.set(key, recent);
    if (hits.size > maxKeys) hits.delete(hits.keys().next().value!);
    return true;
  };
}
