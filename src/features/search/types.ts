export interface SearchItem {
  id: string;
  type: "doctor" | "department" | "condition";
  label: string;
  sub: string;
  href: string;
  /** normalizeTr ile önceden normalize edilmiş arama metni. */
  terms: string;
}

export interface SearchLabels {
  label: string;
  placeholder: string;
  submit: string;
  noResults: string;
  results: string;
  groups: Record<SearchItem["type"], string>;
}
