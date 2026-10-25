import { normalizeTr } from "@/lib/text";
import type { SearchItem } from "./types";

const ORDER: SearchItem["type"][] = ["doctor", "department", "condition"];

/** Gruplu öneriler: her gruptan en çok `perGroup`, önek eşleşmesi öne. */
export function suggest(index: SearchItem[], query: string, perGroup = 4): SearchItem[] {
  const q = normalizeTr(query);
  if (q.length < 2) return [];
  const tokens = q.split(" ");
  const scored = index
    .filter((item) =>
      tokens.every((t) => item.terms.includes(t) || normalizeTr(item.label).includes(t)),
    )
    .map((item) => {
      const label = normalizeTr(item.label);
      const score =
        label.startsWith(q) || item.terms.startsWith(q)
          ? 0
          : label.split(" ").some((w) => w.startsWith(tokens[0]!))
            ? 1
            : 2;
      return { item, score };
    })
    .sort((a, b) => a.score - b.score || a.item.label.localeCompare(b.item.label, "tr"));

  return ORDER.flatMap((type) =>
    scored
      .filter((s) => s.item.type === type)
      .slice(0, perGroup)
      .map((s) => s.item),
  );
}
