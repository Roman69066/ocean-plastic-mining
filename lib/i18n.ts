import en from "@/locales/en/content.json";
import zh from "@/locales/zh/content.json";
import es from "@/locales/es/content.json";
import de from "@/locales/de/content.json";
import ja from "@/locales/ja/content.json";
import it from "@/locales/it/content.json";
import fr from "@/locales/fr/content.json";
export const locales = ["zh", "en", "es", "de", "ja", "it", "fr"] as const;
export type Locale = (typeof locales)[number];
export type Dictionary = typeof en;
export const languageNames: Record<Locale, string> = {
  zh: "中文",
  en: "English",
  es: "Español",
  de: "Deutsch",
  ja: "日本語",
  it: "Italiano",
  fr: "Français",
};
const dictionaries: Record<Locale, Dictionary> = { en, zh, es, de, ja, it, fr };
export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
export const routes = [
  "",
  "thesis",
  "cost",
  "challenges",
  "evidence",
  "solutions",
  "leaderboard",
  "starter-kit",
  "contribute",
  "methodology",
  "governance",
  "about",
] as const;
export type PageKey = Exclude<(typeof routes)[number], "">;
export function localHref(locale: Locale, path = "") {
  return `/${locale}/${path ? path.replace(/^\/+|\/+$/g, "") + "/" : ""}`;
}
