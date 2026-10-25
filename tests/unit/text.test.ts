import { describe, expect, it } from "vitest";
import { initials, matchesQuery, normalizeTr } from "@/lib/text";

describe("normalizeTr", () => {
  it.each([
    ["Şükrü", "sukru"],
    ["İSTANBUL", "istanbul"],
    ["IŞIK", "isik"],
    ["Göğüs  Hastalıkları", "gogus hastaliklari"],
    ["Çocuk", "cocuk"],
    ["  ötesi ", "otesi"],
  ])("%s → %s", (input, expected) => expect(normalizeTr(input)).toBe(expected));
});

describe("matchesQuery", () => {
  it("aksan ve büyük/küçük harf duyarsız, tüm kelimeler eşleşmeli", () => {
    expect(matchesQuery(["Prof. Dr.", "Şükrü", "Erdem", "Nöroloji"], "sukru noroloji")).toBe(true);
    expect(matchesQuery(["Şükrü", "Erdem"], "sukru kardiyoloji")).toBe(false);
    expect(matchesQuery(["x"], "  ")).toBe(true);
  });
});

it("initials", () => expect(initials("ilker", "şahin")).toBe("İŞ"));
