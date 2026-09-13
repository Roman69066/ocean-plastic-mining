import Link from "next/link";
import { LocaleEntry } from "@/components/locale-entry";
import { locales, languageNames } from "@/lib/i18n";
export const metadata = {
  title: "Ocean Plastic Mining Project",
  description: "Can we make ocean cleanup 10× cheaper?",
  robots: { index: false, follow: true },
  icons: { icon: "/favicon.svg" },
};
export default function EntryPage() {
  return (
    <main className="entry">
      <LocaleEntry />
      <p className="eyebrow">OCEAN PLASTIC MINING PROJECT</p>
      <h1>
        Can we make ocean cleanup
        <br />
        10× cheaper?
      </h1>
      <p>Choose a language / 选择语言</p>
      <nav aria-label="Languages">
        {locales.map((l) => (
          <Link key={l} href={`/${l}/`} lang={l}>
            {languageNames[l]} ↗
          </Link>
        ))}
      </nav>
    </main>
  );
}
