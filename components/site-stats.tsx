"use client";
import { useEffect, useState } from "react";
import {
  localizedPublicLaunchDate,
  PUBLIC_LAUNCH_DATE,
  runningDays,
} from "@/lib/uptime";
import type { Dictionary, Locale } from "@/lib/i18n";
type Stats = {
  visitors: number | null;
  counterStatus: string;
};
let statsPromise: Promise<Stats> | undefined;
// Shared across navigation in this document, so page changes do not send extra count requests.
function getStats() {
  return (statsPromise ??= (async () => {
    const response = await fetch("/api/site-stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
      cache: "no-store",
    });
    const data = await response.json();
    if (!("counterStatus" in data)) throw new Error("Stats unavailable");
    return data;
  })());
}
export function SiteStats({ d, locale }: { d: Dictionary; locale: Locale }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    let active = true;
    const initialTimer = window.setTimeout(() => setNow(Date.now()), 0);
    getStats()
      .then((data) => {
        if (active) setStats(data);
      })
      .catch(() => {
        if (active)
          setStats({
            visitors: null,
            counterStatus: "unavailable",
          });
      });
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => {
      active = false;
      clearTimeout(initialTimer);
      clearInterval(timer);
    };
  }, []);
  const t = d.stats;
  const days = now === null ? null : runningDays(now);
  const format = new Intl.NumberFormat(locale);
  return (
    <section className="site-stats" aria-label={t.title}>
      <p className="eyebrow">{t.eyebrow}</p>
      <h2>{t.title}</h2>
      <div className="vital-signs-grid">
        <div>
          <span>{t.publicSince}</span>
          <strong>
            <time dateTime={PUBLIC_LAUNCH_DATE}>
              {localizedPublicLaunchDate(locale)}
            </time>
          </strong>
        </div>
        <div>
          <span>{t.runningFor}</span>
          <strong>
            {days === null
              ? t.loading
              : `${format.format(days)} ${days === 1 ? t.day : t.days}`}
          </strong>
        </div>
        <div>
          <span>{t.visitors}</span>
          <strong data-testid="visitor-count">
            {stats?.visitors !== null && stats?.visitors !== undefined
              ? format.format(stats.visitors)
              : stats
                ? t.unavailable
                : t.loading}
          </strong>
        </div>
      </div>
      <p className="stats-note">{t.note}</p>
    </section>
  );
}
