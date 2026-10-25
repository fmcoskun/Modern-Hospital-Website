/** "{n} doktor" gibi şablonları doldurur. İstemci ve sunucuda kullanılabilir. */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`));
}
