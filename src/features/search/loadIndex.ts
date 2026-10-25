import type { SearchItem } from "./types";

let pending: Promise<SearchItem[]> | undefined;

/** İndeks bir kez indirilir; hata olursa sonraki denemede yeniden istenir. */
export function loadSearchIndex(): Promise<SearchItem[]> {
  pending ??= fetch("/api/search-index")
    .then((r) =>
      r.ok ? (r.json() as Promise<SearchItem[]>) : Promise.reject(new Error(String(r.status))),
    )
    .catch((e: unknown) => {
      pending = undefined;
      throw e;
    });
  return pending;
}
