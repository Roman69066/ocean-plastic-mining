import Link from "next/link";
import { challenges, sources } from "@/lib/data";
import {
  localHref,
  routeLabel,
  type Dictionary,
  type Locale,
} from "@/lib/i18n";
import { contributionHref, repositoryUrl } from "@/lib/config";
import { ChallengeCard } from "./challenge-card";
import { CostCurve } from "./cost-curve";
export function Home({ d, locale }: { d: Dictionary; locale: Locale }) {
  return (
    <>
      <section className="hero">
        <div className="hero-topline">
          <p className="eyebrow">{d.home.eyebrow}</p>
          <span className="badge">{d.ui.research}</span>
        </div>
        <div className="hero-grid">
          <div className="hero-copy">
            <h1>
              {d.home.title}
              <br />
              <em>{d.home.emphasis}</em>
            </h1>
            <p className="hero-description">{d.home.subtitle}</p>
            <p className="hero-caveat">{d.home.answer}</p>
            <div className="actions">
              <Link
                className="button primary"
                href={localHref(locale, "project")}
              >
                {d.home.understand}
                <span aria-hidden="true">↗</span>
              </Link>
              <Link className="button" href={localHref(locale, "challenges")}>
                {d.ui.explore}
                <span aria-hidden="true">↗</span>
              </Link>
              <Link className="button" href={localHref(locale, "evidence")}>
                {d.home.challengeAssumptions}
              </Link>
            </div>
            <a className="subtle-link" href={repositoryUrl}>
              {d.ui.github} <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="hero-instrument">
            <div className="instrument-caption">
              <span className="mono">RESEARCH QUESTION / 001</span>
              <span aria-hidden="true">+</span>
            </div>
            <div className="ten">€/t</div>
            <div className="instrument-bottom">
              <span className="crosshair" aria-hidden="true">
                ⌖
              </span>
              <div>
                <p className="eyebrow">{d.home.north}</p>
                <p>{d.home.northText}</p>
              </div>
            </div>
            <div className="instrument-ruler" aria-hidden="true" />
          </div>
        </div>
        <div className="hero-foot">
          <span className="mono">01 — LCOCR</span>
          <span>{d.ui.noData}</span>
          <span aria-hidden="true">↓</span>
        </div>
      </section>
      <section className="viability-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">01 / COST LOGIC</p>
            <h2>{d.home.costLogic}</h2>
          </div>
          <Link className="text-link" href={localHref(locale, "project")}>
            {d.home.understand} ↗
          </Link>
        </div>
        <div className="viability-path">
          {d.home.stages.map(([stage, condition, outcome], index) => (
            <div className="viability-step-wrap" key={stage}>
              <article className="viability-step">
                <span className="mono">{stage}</span>
                <strong>{condition}</strong>
                <p>{outcome}</p>
              </article>
              {index < d.home.stages.length - 1 && (
                <div className="viability-arrow" aria-hidden="true">
                  <span>↓</span>
                  <small>{d.home.stageArrows[index]}</small>
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="notice">{d.home.stageNote}</p>
      </section>
      <section className="section unknown-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">02 / WHAT REMAINS UNKNOWN</p>
            <h2>{d.home.notProven}</h2>
            <p>{d.home.unknownIntro}</p>
          </div>
        </div>
        <ul className="unknown-grid">
          {d.home.keyUnknowns.map((unknown) => (
            <li key={unknown}>{unknown}</li>
          ))}
        </ul>
        <div className="actions">
          <Link className="button primary" href={localHref(locale, "project")}>
            {d.home.understand} ↗
          </Link>
          <Link className="button" href={localHref(locale, "challenges")}>
            {d.ui.explore} ↗
          </Link>
        </div>
      </section>
      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">03 / REFRAME</p>
            <h2>{d.home.shift}</h2>
          </div>
        </div>
        <div className="reframe">
          <article>
            <span className="mono muted">CLEANUP</span>
            <h3>{d.home.cleanup}</h3>
            <p>{d.home.cleanupQuestion}</p>
          </article>
          <div className="reframe-arrow" aria-hidden="true">
            →
          </div>
          <article>
            <span className="mono">MINING</span>
            <h3>{d.home.mining}</h3>
            <p>{d.home.miningQuestion}</p>
          </article>
        </div>
        <p className="annotation">{d.home.metaphor}</p>
      </section>
      <section className="section pioneers">
        <div>
          <p className="eyebrow">04 / THE COST CURVE</p>
          <h2>{d.home.pioneers}</h2>
          <p>{d.home.pioneersText}</p>
          <a className="text-link" href={sources[0].url}>
            The Ocean Cleanup · System 03 ↗
          </a>
          <p className="small muted">{d.home.analogy}</p>
          <strong>{d.home.frontier}</strong>
        </div>
        <CostCurve d={d} compact />
      </section>
      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">05 / OPEN CHALLENGES</p>
            <h2>{d.home.challenges}</h2>
            <p>{d.home.challengeText}</p>
          </div>
          <Link className="text-link" href={localHref(locale, "challenges")}>
            {d.ui.all} ↗
          </Link>
        </div>
        <div className="challenge-grid">
          {challenges
            .filter((_, i) => [0, 1, 2, 6].includes(i))
            .map((c) => (
              <ChallengeCard key={c.id} challenge={c} d={d} locale={locale} />
            ))}
        </div>
      </section>
      <section className="section evidence-principle">
        <p className="eyebrow">06 / EVIDENCE FIRST</p>
        <div className="principle-grid">
          <h2>{d.home.principle}</h2>
          <div>
            <p>{d.home.principleText}</p>
            <div className="evidence-tags">
              {(["supported", "uncertain", "rejected"] as const).map(
                (key, i) => (
                  <Link
                    href={localHref(locale, `evidence`) + `#${key}`}
                    className={`evidence-tag tag-${key}`}
                    key={key}
                  >
                    <span aria-hidden="true">{["✓", "?", "×"][i]}</span>
                    {d.labels[key]}
                  </Link>
                ),
              )}
            </div>
            <Link className="text-link" href={localHref(locale, "methodology")}>
              E0 → E6 · {routeLabel(d, "methodology")} ↗
            </Link>
          </div>
        </div>
      </section>
      <section className="final-cta">
        <p className="eyebrow">07 / BUILD IN THE OPEN</p>
        <h2>
          {d.home.breakTitle}
          <br />
          <em>{d.home.breakEmphasis}</em>
        </h2>
        <p>{d.home.breakText}</p>
        <div className="actions">
          {[0, 2, 1, 3].map((i) => (
            <a
              href={contributionHref(i)}
              key={i}
              className={i === 0 ? "button primary" : "button"}
            >
              {d.contributions[i][0]} ↗
            </a>
          ))}
        </div>
        <a className="subtle-link" href={repositoryUrl}>
          GitHub ↗
        </a>
      </section>
    </>
  );
}
