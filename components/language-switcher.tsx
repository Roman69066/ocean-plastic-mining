"use client";
import { usePathname } from "next/navigation";
import { locales, languageNames, type Locale } from "@/lib/i18n";
import { switchLocalePath } from "@/lib/locale-routing";
export function LanguageSwitcher({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const pathname = usePathname();
  return (
    <label className="language">
      <span className="sr-only">{label}</span>
      <span aria-hidden="true">◎</span>
      <select
        aria-label={label}
        value={locale}
        onChange={(event) => {
          const next = event.target.value;
          try {
            localStorage.setItem("opm-language", next);
          } catch {}
          window.location.assign(
            switchLocalePath(pathname, next) +
              window.location.search +
              window.location.hash,
          );
        }}
      >
        {locales.map((l) => (
          <option key={l} value={l}>
            {languageNames[l]}
          </option>
        ))}
      </select>
    </label>
  );
}
