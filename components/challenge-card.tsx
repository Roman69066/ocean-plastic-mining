import Link from "next/link";
import type { Challenge } from "@/lib/data";
import { localHref, type Dictionary, type Locale } from "@/lib/i18n";
export function ChallengeCard({
  challenge: c,
  d,
  locale,
}: {
  challenge: Challenge;
  d: Dictionary;
  locale: Locale;
}) {
  const t = d.challenges[c.id];
  return (
    <article
      className="challenge-card"
      data-challenge={c.id}
      data-evidence={c.evidenceLevel}
    >
      <div className="card-meta">
        <span className="mono">{c.id}</span>
        <span className="status">
          <span aria-hidden="true">○</span>{" "}
          {c.status === "OPEN" ? d.ui.open : c.status}
        </span>
      </div>
      <p className="discipline">{d.labels[c.category]}</p>
      <h3>
        <Link href={localHref(locale, `challenges/${c.id}`)}>
          {t.title}
          <span aria-hidden="true">↗</span>
        </Link>
      </h3>
      <p>{t.summary}</p>
      <div className="card-bottom">
        <span
          className="badge"
          title={`${d.ui.evidence}: ${d.labels[c.evidenceLevel]}`}
        >
          {c.evidenceLevel} · {d.labels[c.evidenceLevel]}
        </span>
        <span className="small">
          {d.ui.target}: {c.targetMetric.unit}
        </span>
      </div>
      <div className="card-date">
        {d.ui.updated} <time dateTime={c.lastUpdated}>{c.lastUpdated}</time>
      </div>
    </article>
  );
}
