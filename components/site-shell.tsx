import { SiteStats } from "./site-stats";
import Link from "next/link";
import { LanguageSwitcher } from "./language-switcher";
import { localHref, routes, type Dictionary, type Locale } from "@/lib/i18n";
import { repositoryUrl } from "@/lib/config";
export function Mark() {
  return (
    <svg width="34" height="34" viewBox="0 0 36 36" aria-hidden="true">
      <rect
        x="1"
        y="1"
        width="34"
        height="34"
        rx="3"
        fill="none"
        stroke="currentColor"
      />
      <path
        d="M7 13h22M7 18h9m4 0h9M7 23h22M18 7v22"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
export function Header({ d, locale }: { d: Dictionary; locale: Locale }) {
  return (
    <header className="site-header">
      <a href="#main" className="skip-link">
        {d.ui.skip}
      </a>
      <div className="header-inner">
        <Link href={localHref(locale)} className="brand">
          <Mark />
          <span>
            OPM<span className="brand-sub">{d.ui.short}</span>
          </span>
        </Link>
        <nav aria-label={d.ui.menu} className="desktop-nav">
          {[2, 3, 4, 7].map((i) => (
            <Link key={i} href={localHref(locale, routes[i])}>
              {d.nav[i]}
            </Link>
          ))}
        </nav>
        <div className="header-tools">
          <LanguageSwitcher locale={locale} label={d.ui.language} />
          <Link
            href={localHref(locale, "contribute")}
            className="header-contribute"
          >
            {d.nav[8]} <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <details className="mobile-nav">
          <summary aria-label={d.ui.menu}>☰</summary>
          <nav aria-label={d.ui.menu}>
            {routes.map((path, i) => (
              <Link key={path} href={localHref(locale, path)}>
                {d.nav[i]}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
export function Footer({ d, locale }: { d: Dictionary; locale: Locale }) {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <div className="brand">
            <Mark />
            <span>OPM</span>
          </div>
          <p>{d.ui.project}</p>
          <p className="muted">{d.ui.footer}</p>
          <span className="badge">{d.ui.research}</span>
        </div>
        <nav aria-label={`${d.ui.menu} / ${d.ui.project}`}>
          {routes.slice(1).map((path, i) => (
            <Link key={path} href={localHref(locale, path)}>
              {d.nav[i + 1]}
            </Link>
          ))}
          <a href={repositoryUrl}>GitHub ↗</a>
        </nav>
      </div>
      <SiteStats d={d} locale={locale} />
      <div className="footer-bottom">
        <span>
          <a href="/toolkit/LICENSE.txt">Apache-2.0</a> /{" "}
          <a href="/toolkit/CONTENT_LICENSE.md">CC BY 4.0</a>
        </span>
        <Link href={localHref(locale, "contribute")}>{d.ui.review}</Link>
        <span className="mono">V1.0 · OPEN ENGINEERING</span>
      </div>
    </footer>
  );
}
