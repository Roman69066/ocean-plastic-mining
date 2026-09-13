export const supportedLocales = [
  "zh",
  "en",
  "es",
  "de",
  "ja",
  "it",
  "fr",
] as const;
export function preferredLocale(
  stored: string | null,
  languages: readonly string[],
) {
  if (stored && (supportedLocales as readonly string[]).includes(stored))
    return stored;
  for (const language of languages) {
    const base = language.toLowerCase().split("-")[0];
    if ((supportedLocales as readonly string[]).includes(base)) return base;
  }
  return "en";
}
export function switchLocalePath(pathname: string, locale: string) {
  if (!(supportedLocales as readonly string[]).includes(locale))
    throw new Error("Unsupported locale");
  const parts = pathname.split("/").filter(Boolean);
  if ((supportedLocales as readonly string[]).includes(parts[0])) parts.shift();
  return `/${locale}/${parts.length ? parts.join("/") + "/" : ""}`;
}
