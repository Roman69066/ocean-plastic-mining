import { notFound } from "next/navigation";
import { Header, Footer } from "@/components/site-shell";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import "../globals.css";
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale);
  return (
    <html lang={locale}>
      <body>
        <Header d={d} locale={locale} />
        <main id="main">{children}</main>
        <Footer d={d} locale={locale} />
      </body>
    </html>
  );
}
