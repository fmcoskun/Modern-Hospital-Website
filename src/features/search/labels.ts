import type { Dictionary } from "@/i18n";
import type { SearchLabels } from "./types";

export const searchLabels = (t: Dictionary): SearchLabels => ({
  label: t.search.label,
  placeholder: t.search.placeholder,
  submit: t.search.submit,
  noResults: t.search.noResults,
  results: t.search.results,
  groups: t.search.groups,
});
