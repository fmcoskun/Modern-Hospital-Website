/** YYYY-MM-DD tarihini Türkçe uzun biçimde gösterir (Europe/Istanbul). */
export const fmtDay = (date: string) =>
  new Intl.DateTimeFormat("tr-TR", { dateStyle: "long", timeZone: "Europe/Istanbul" }).format(
    new Date(`${date}T12:00:00+03:00`),
  );
