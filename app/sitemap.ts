import type { MetadataRoute } from "next";
import { locales, routes, localHref } from "@/lib/i18n";
import { challenges } from "@/lib/data";
import { siteUrl } from "@/lib/config";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...routes, ...challenges.map((c) => `challenges/${c.id}`)];
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: siteUrl + localHref(locale, path),
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, siteUrl + localHref(l, path)]),
        ),
      },
    })),
  );
}
