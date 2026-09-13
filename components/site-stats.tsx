"use client";
import { useEffect, useState } from "react";
import { uptimeParts } from "@/lib/uptime";
import type { Dictionary, Locale } from "@/lib/i18n";
type Stats = {
  launchedAt: string | null;
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
    getStats()
      .then((data) => {
        if (active) {
          setStats(data);
          setNow(Date.now());
        }
      })
      .catch(() => {
        if (active)
          setStats({
            launchedAt: null,
            visitors: null,
            counterStatus: "unavailable",
          });
      });
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);
  const t = d.stats;
  const parts =
    stats?.launchedAt && now !== null
      ? uptimeParts(stats.launchedAt, now)
      : null;
  const format = new Intl.NumberFormat(locale);
  return (
    <section className="site-stats" aria-label={t.title}>
      <div>
        <span>{t.uptime}</span>
        <strong>
          {parts
            ? `${format.format(parts.days)} ${t.days} ${parts.hours} ${t.hours} ${parts.minutes} ${t.minutes}`
            : stats
              ? t.notLaunched
              : t.loading}
        </strong>
      </div>
      <div>
        <span>{t.visitors}</span>
        <strong data-testid="visitor-count">
          {stats?.visitors !== null && stats?.visitors !== undefined
            ? format.format(stats.visitors)
            : stats?.counterStatus === "unavailable"
              ? t.unavailable
              : stats
                ? t.unconfigured
                : t.loading}
        </strong>
      </div>
      <p>{t.note}</p>
    </section>
  );
}
