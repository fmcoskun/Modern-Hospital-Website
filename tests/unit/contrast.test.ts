import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { suggest } from "@/features/search/filter";
import type { SearchItem } from "@/features/search/types";
import { normalizeTr } from "@/lib/text";

/** tokens.css'teki renk çiftlerini WCAG 2.x formülüyle doğrular (plan 6.2, 13 "Tasarım sistemi"). */
const css = readFileSync("src/styles/tokens.css", "utf8");
const root = css.slice(css.indexOf(":root {"), css.indexOf("}", css.indexOf(":root {")));
const token = (name: string) => {
  const m = root.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, "i"));
  if (!m) throw new Error(`token yok: ${name}`);
  return m[1]!;
};
const lum = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a: string, b: string) => {
  const [x, y] = [lum(token(a)), lum(token(b))].sort((p, q) => q - p) as [number, number];
  return (x + 0.05) / (y + 0.05);
};

describe("WCAG kontrast", () => {
  it.each([
    ["text-primary", "surface-base", 4.5],
    ["text-primary", "surface-raised", 4.5],
    ["text-primary", "surface-sunken", 4.5],
    ["text-secondary", "surface-base", 4.5],
    ["text-secondary", "surface-raised", 4.5],
    ["text-secondary", "surface-sunken", 4.5],
    ["brand-600", "surface-base", 4.5],
    ["brand-700", "brand-100", 4.5],
    ["brand-700", "brand-200", 4.5],
    ["text-inverse", "brand-600", 4.5],
    ["text-inverse", "brand-500", 4.5],
    ["text-inverse", "danger-600", 4.5],
    ["danger-600", "surface-base", 4.5],
    ["danger-600", "danger-100", 4.5],
    ["success-600", "success-100", 4.5],
    ["text-primary", "warning-200", 4.5],
    ["topbar-text", "topbar-bg", 4.5],
    ["topbar-muted", "topbar-bg", 4.5],
    // Koyu bant ve banner katmanı (from-dark/95 en koyu nokta)
    ["text-inverse", "surface-dark", 4.5],
    ["brand-200", "surface-dark", 4.5],
    ["brand-600", "surface-sunken", 4.5],
    ["border-control", "surface-base", 3],
    ["border-control", "surface-sunken", 3],
    ["color-focus", "surface-base", 3],
  ])("%s / %s ≥ %s:1", (fg, bg, min) => {
    expect(ratio(fg, bg)).toBeGreaterThanOrEqual(min);
  });
});

describe("global arama önerileri", () => {
  const item = (type: SearchItem["type"], label: string, terms = label): SearchItem => ({
    id: `${type}-${label}`,
    type,
    label,
    sub: "",
    href: "#",
    terms: normalizeTr(terms),
  });
  const index = [
    item("doctor", "Prof. Dr. Şükrü Erdem", "Şükrü Erdem migren"),
    item("department", "Nöroloji"),
    item("condition", "Migren ve baş ağrısı"),
    item("condition", "migren"),
  ];

  it("aksan duyarsız ve gruplu (doktor → bölüm → şikayet)", () => {
    expect(suggest(index, "sukru").map((i) => i.label)).toEqual(["Prof. Dr. Şükrü Erdem"]);
    expect(suggest(index, "migren").map((i) => i.type)).toEqual([
      "doctor",
      "condition",
      "condition",
    ]);
  });
  it("2 karakterden kısa sorguda öneri yok", () => expect(suggest(index, "m")).toEqual([]));
});
