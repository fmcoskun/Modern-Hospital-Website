/**
 * Türkçe karakter ve aksan duyarsız arama anahtarı: normalizeTr("Şükrü") === "sukru".
 * İstemci ve sunucuda aynı sonucu verir.
 */
export function normalizeTr(input: string): string {
  return input
    .replace(/İ/g, "i")
    .replace(/I/g, "ı")
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function matchesQuery(haystack: string[], query: string): boolean {
  const q = normalizeTr(query);
  if (!q) return true;
  const text = normalizeTr(haystack.join(" "));
  return q.split(" ").every((token) => text.includes(token));
}

export function initials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toLocaleUpperCase("tr");
}
