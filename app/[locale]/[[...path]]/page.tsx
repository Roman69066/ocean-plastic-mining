import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getDictionary,
  isLocale,
  locales,
  routes,
  localHref,
  type PageKey,
} from "@/lib/i18n";
import { challenges, getChallenge } from "@/lib/data";
import { siteUrl } from "@/lib/config";
import { Home } from "@/components/home";
import { ContentPage, ChallengeDetail } from "@/components/content-page";
export const dynamicParams = false;
export function generateStaticParams() {
  return [
    ...routes.map((route) => ({ path: route ? route.split("/") : [] })),
    ...challenges.map((c) => ({ path: ["challenges", c.id] })),
  ];
}
type Params = Promise<{ locale: string; path?: string[] }>;
export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, path = [] } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale);
  const route = path.join("/");
  const challenge =
    path.length === 2 && path[0] === "challenges"
      ? getChallenge(path[1])
      : null;
  const page = d.pages[route as PageKey];
  const title = challenge
    ? `${challenge.id} · ${d.challenges[challenge.id].title}`
    : page?.title || d.meta.title;
  const description = challenge
    ? d.challenges[challenge.id].summary
    : page?.intro || d.meta.description;
  const url = siteUrl + localHref(locale, route);
  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(
          locales.map((l) => [l, siteUrl + localHref(l, route)]),
        ),
        "x-default": siteUrl + localHref("en", route),
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Ocean Plastic Mining Project",
      type: "website",
      locale,
      alternateLocale: locales.filter((l) => l !== locale),
    },
    robots: { index: true, follow: true },
    icons: { icon: "/favicon.svg" },
  };
}
export default async function Page({ params }: { params: Params }) {
  const { locale, path = [] } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale);
  const route = path.join("/");
  if (path.length === 2 && path[0] === "challenges") {
    if (!getChallenge(path[1])) notFound();
    return <ChallengeDetail id={path[1]} locale={locale} d={d} />;
  }
  if (!(routes as readonly string[]).includes(route)) notFound();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: d.ui.project,
            url: siteUrl + localHref(locale),
            inLanguage: locale,
            description: d.meta.description,
          }).replace(/</g, "\\u003c"),
        }}
      />
      {route ? (
        <ContentPage page={route as PageKey} d={d} locale={locale} />
      ) : (
        <Home d={d} locale={locale} />
      )}
    </>
  );
}
