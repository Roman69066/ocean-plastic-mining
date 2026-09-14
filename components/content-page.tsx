import Link from "next/link";
import {
  challenges,
  evidenceLevels,
  evidence,
  sources,
  solutions,
  kitFiles,
  leaderboard,
} from "@/lib/data";
import {
  localHref,
  routeLabel,
  type Dictionary,
  type Locale,
  type PageKey,
} from "@/lib/i18n";
import {
  challengeContributionHref,
  contributionHref,
  issueChooserUrl,
  repositoryUrl,
} from "@/lib/config";
import { CostCurve } from "./cost-curve";
import { CostCalculator } from "./cost-calculator";
import { ChallengeBrowser } from "./challenge-browser";
export function ProseSections({ sections }: { sections: string[][] }) {
  return (
    <div className="prose-sections">
      {sections.map(([title, body]) => (
        <section key={title}>
          <h2>{title}</h2>
          <p>{body}</p>
        </section>
      ))}
    </div>
  );
}
function EvidenceScale({ d }: { d: Dictionary }) {
  return (
    <div className="evidence-scale">
      {evidenceLevels.map((level) => (
        <div key={level}>
          <span className="mono">{level}</span>
          <span>{d.labels[level]}</span>
        </div>
      ))}
    </div>
  );
}
function ProjectOverview({ d, locale }: { d: Dictionary; locale: Locale }) {
  const sections = d.pages.project.sections;
  return (
    <div className="project-overview">
      {sections.map(([title, body], index) => (
        <section className={index === 9 ? "not-proven-panel" : ""} key={title}>
          <span className="mono">{String(index + 1).padStart(2, "0")}</span>
          <div>
            <h2>{title}</h2>
            <p>{body}</p>
            {index === 5 && (
              <div className="project-thresholds">
                {d.home.stages.slice(1).map(([stage, condition, outcome]) => (
                  <div key={stage}>
                    <strong className="mono">{stage}</strong>
                    <span>{condition}</span>
                    <small>{outcome}</small>
                  </div>
                ))}
              </div>
            )}
            {index === 10 && (
              <ol className="project-challenges">
                {challenges.map((challenge) => (
                  <li key={challenge.id}>
                    <Link
                      href={localHref(locale, `challenges/${challenge.id}`)}
                    >
                      <span className="mono">{challenge.id}</span>
                      {d.challenges[challenge.id].title}
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>
      ))}
      <div className="project-principles">
        <strong>{d.ui.noData}</strong>
        <strong>{d.pages.project.principle}</strong>
      </div>
    </div>
  );
}
function ContactPage({ d }: { d: Dictionary }) {
  return (
    <div className="contact-panel">
      <section>
        <h2>{d.pages.contact.welcome}</h2>
        <ul>
          {d.contactTopics.map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2>{d.pages.contact.sections[0][0]}</h2>
        <p>{d.pages.contact.sections[0][1]}</p>
        <a className="button" href={`${repositoryUrl}/issues/new/choose`}>
          GitHub Issues ↗
        </a>
      </section>
      <section className="contact-direct">
        <h2>{d.pages.contact.sections[1][0]}</h2>
        <p>{d.pages.contact.sections[1][1]}</p>
        <dl>
          <div>
            <dt>{d.pages.contact.initiator}</dt>
            <dd>Roman</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>
              <a href="mailto:hoot69066@gmail.com">hoot69066@gmail.com</a>
            </dd>
          </div>
          <div>
            <dt>GitHub</dt>
            <dd>
              <a href={repositoryUrl}>Roman69066/ocean-plastic-mining ↗</a>
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
export function ContentPage({
  page,
  d,
  locale,
}: {
  page: PageKey;
  d: Dictionary;
  locale: Locale;
}) {
  const text = d.pages[page];
  return (
    <div className="page-content">
      <header className="page-intro">
        <p className="eyebrow">OPM / {page.toUpperCase()}</p>
        <h1>{text.title}</h1>
        <p>{text.intro}</p>
        {["cost", "methodology"].includes(page) && (
          <span className="badge">{d.ui.draft}</span>
        )}
      </header>
      {page === "challenges" && <ChallengeBrowser d={d} locale={locale} />}
      {page === "cost" && (
        <>
          <div className="cost-summary">
            <div>
              <span className="eyebrow">{d.ui.current}</span>
              <h2>{d.ui.notVerified}</h2>
              <p>{d.ui.unit}</p>
            </div>
            <CostCurve d={d} />
          </div>
          <div
            className="formula"
            role="math"
            aria-label={d.pages.cost.sections[0][1]}
          >
            <span>LCOCR =</span>
            <div>
              <span>
                {d.ui.annualCapex} + {Object.values(d.costLabels).join(" + ")}
              </span>
              <span>{d.ui.tonnes}</span>
            </div>
            <span>€/t</span>
          </div>
          <CostCalculator d={d} locale={locale} />
        </>
      )}
      {page === "evidence" && (
        <>
          <EvidenceScale d={d} />
          <div className="evidence-columns">
            {(["supported", "uncertain", "rejected"] as const).map(
              (direction) => (
                <section
                  id={direction}
                  className={`evidence-group tag-${direction}`}
                  key={direction}
                >
                  <header>
                    <h2>{d.labels[direction]}</h2>
                    <span className="mono">
                      {evidence[direction].length.toString().padStart(2, "0")}
                    </span>
                  </header>
                  {direction === "uncertain" ? (
                    evidence.uncertain.map((record, i) => (
                      <article className="assumption" key={record.id}>
                        <span className="mono">
                          {record.id} · {record.evidenceLevel}
                        </span>
                        <h3>{d.assumptions[i]}</h3>
                        <p>{d.ui.noSources}</p>
                      </article>
                    ))
                  ) : (
                    <p className="empty small">
                      {direction === "supported"
                        ? d.labels.supportedEmpty
                        : d.labels.rejectedEmpty}
                    </p>
                  )}
                </section>
              ),
            )}
          </div>
          <div className="reference-panel">
            <h2>{d.ui.source}</h2>
            <p>{d.home.pioneersText}</p>
            {sources.map((source) => (
              <p key={source.id}>
                <span className="mono">{source.id}</span>{" "}
                <a className="text-link" href={source.url}>
                  {source.title} — {source.publisher} ↗
                </a>
              </p>
            ))}
            <p className="muted small">{d.pages.cost.sections[1][1]}</p>
          </div>
        </>
      )}
      {page === "solutions" && (
        <div className="solution-grid">
          {solutions.map((s, i) => (
            <article className="solution-card" key={s.id}>
              <div className="card-meta">
                <span className="mono">{s.id}</span>
                <span className="badge">
                  {s.evidenceLevel} · {d.labels.E0}
                </span>
              </div>
              <h2>{d.solutionTexts[i][0]}</h2>
              <p>{d.solutionTexts[i][1]}</p>
              <a href={contributionHref(4)}>{d.ui.submit} ↗</a>
            </article>
          ))}
        </div>
      )}
      {page === "leaderboard" && (
        <>
          <div className="table-wrap">
            <table>
              <caption className="sr-only">{text.title}</caption>
              <thead>
                <tr>
                  {[
                    d.ui.rank,
                    d.ui.team,
                    d.ui.solution,
                    "LCOCR",
                    d.ui.evidence,
                    d.ui.location,
                    d.ui.duration,
                    d.ui.removed,
                    d.ui.verification,
                    d.ui.updated,
                  ].map((s) => (
                    <th scope="col" key={s}>
                      {s}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leaderboard.entries.length === 0 && (
                  <tr>
                    <td colSpan={10} className="leaderboard-empty">
                      <span className="empty-symbol" aria-hidden="true">
                        —
                      </span>
                      <h2>{d.ui.notVerified}</h2>
                      <p>{text.intro}</p>
                      <Link
                        className="text-link"
                        href={localHref(locale, "methodology")}
                      >
                        {routeLabel(d, "methodology")} ↗
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <EvidenceScale d={d} />
        </>
      )}
      {page === "starter-kit" && (
        <>
          <div className="kit-grid">
            {kitFiles.map((file, i) => (
              <a
                className="kit-card"
                key={file}
                href={`/toolkit/${file}`}
                download
              >
                <span className="mono">
                  {String(i + 1).padStart(2, "0")} /{" "}
                  {file.endsWith("csv") ? "CSV" : "MD"}
                </span>
                <h2>{d.kit[i]}</h2>
                <span>{d.ui.download} ↓</span>
              </a>
            ))}
          </div>
          <p className="notice">{d.pages.about.sections[1][1]}</p>
        </>
      )}
      {page === "contribute" && (
        <>
          <div className="contribution-grid">
            {d.contributions.map(([title, body], i) => (
              <article id={`contribution-${i}`} key={title}>
                <span className="mono">0{i + 1}</span>
                <h2>{title}</h2>
                <p>{body}</p>
                <a className="text-link" href={contributionHref(i)}>
                  {d.ui.github} ↗
                </a>
              </article>
            ))}
          </div>
          <section className="reference-panel">
            <h2>{d.ui.review}</h2>
            <p>{d.ui.reviewNote}</p>
            <a href="/toolkit/translation-guide.md" className="text-link">
              {d.kit[7]} ↓
            </a>
            <p className="small mono">
              {d.translation.status} · reviewedBy: [] · lastReviewedDate: null
            </p>
          </section>
        </>
      )}
      {page === "project" && <ProjectOverview d={d} locale={locale} />}
      {page === "contact" && <ContactPage d={d} />}
      {page === "methodology" && (
        <>
          <EvidenceScale d={d} />
          <div className="notice">
            <a className="text-link" href="/toolkit/RFC-0001.md">
              RFC-0001 · {d.ui.draft} ↗
            </a>
          </div>
        </>
      )}
      {page === "thesis" && (
        <>
          <div className="thesis-flow">
            {["R0", "T1", "T2"].map((stage, i) => (
              <div key={stage}>
                <span>{stage}</span>
                <p>{[d.ui.research, d.home.t1, d.home.t2][i]}</p>
              </div>
            ))}
          </div>
          <p className="annotation">{d.home.metaphor}</p>
          <a className="text-link" href={sources[0].url}>
            The Ocean Cleanup · System 03 ↗
          </a>
        </>
      )}
      {"sections" in text && !["project", "contact"].includes(page) && (
        <ProseSections sections={text.sections} />
      )}
      {page === "governance" && (
        <div className="reference-panel">
          {[
            "GOVERNANCE.md",
            "CONTRIBUTING.md",
            "CODE_OF_CONDUCT.md",
            "SECURITY.md",
            "ROADMAP.md",
          ].map((file) => (
            <a
              key={file}
              href={`/toolkit/${file}`}
              className="text-link doc-link"
            >
              {file} ↗
            </a>
          ))}
        </div>
      )}
      {page !== "contribute" && (
        <aside className="page-end">
          <p>{d.home.breakEmphasis}</p>
          <a href={issueChooserUrl} className="button">
            {d.ui.submit} ↗
          </a>
        </aside>
      )}
    </div>
  );
}
export function ChallengeDetail({
  id,
  d,
  locale,
}: {
  id: string;
  d: Dictionary;
  locale: Locale;
}) {
  const c = challenges.find((c) => c.id === id)!;
  const t = d.challenges[c.id];
  return (
    <div className="page-content">
      <Link href={localHref(locale, "challenges")} className="back-link">
        ← {d.ui.back}
      </Link>
      <header className="page-intro challenge-intro">
        <div className="card-meta">
          <span className="eyebrow">
            {c.id} / {d.labels[c.category]}
          </span>
          <span className="badge">{d.ui.open}</span>
        </div>
        <h1>{t.title}</h1>
        <p>{t.summary}</p>
      </header>
      <div className="detail-layout">
        <div>
          <ProseSections
            sections={[
              [d.ui.problem, t.problem],
              [d.ui.why, t.whyItMatters],
            ]}
          />
          {(
            [
              [d.ui.facts, c.knownFacts.length ? c.knownFacts : [d.ui.unknown]],
              [d.ui.assumptions, t.assumptions],
              [d.ui.questions, t.openQuestions],
            ] as [string, string[]][]
          ).map(([title, items]) => (
            <section className="detail-section" key={title}>
              <h2>{title}</h2>
              <ul>
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
          <section className="detail-section">
            <h2>{d.ui.source}</h2>
            {c.sources.length ? (
              c.sources.map((id) => {
                const s = sources.find((x) => x.id === id)!;
                return (
                  <p key={id}>
                    <span className="mono">{id} </span>
                    <a className="text-link" href={s.url}>
                      {s.title} ↗
                    </a>
                  </p>
                );
              })
            ) : (
              <p>{d.ui.noSources}</p>
            )}
          </section>
          {[d.ui.datasets, d.ui.submissions].map((title) => (
            <section className="detail-section" key={title}>
              <h2>{title}</h2>
              <p className="muted">{d.ui.empty}</p>
            </section>
          ))}
        </div>
        <aside className="challenge-aside">
          <dl>
            <div>
              <dt>{d.ui.target}</dt>
              <dd>
                {c.targetMetric.unit}
                <small>{d.ui.unknown}</small>
              </dd>
            </div>
            <div>
              <dt>{d.ui.evidence}</dt>
              <dd>
                {c.evidenceLevel} · {d.labels[c.evidenceLevel]}
              </dd>
            </div>
            <div>
              <dt>{d.ui.status}</dt>
              <dd>{d.ui.open}</dd>
            </div>
            <div>
              <dt>{d.ui.updated}</dt>
              <dd>
                <time>{c.lastUpdated}</time>
              </dd>
            </div>
            <div>
              <dt>{d.ui.maintainers}</dt>
              <dd>{d.ui.unassigned}</dd>
            </div>
          </dl>
          <a href={challengeContributionHref(c.id)} className="button primary">
            {d.ui.submit} ↗
          </a>
          <a href="/toolkit/evidence-template.md" className="text-link">
            {d.kit[2]} ↓
          </a>
        </aside>
      </div>
      <p className="notice">{d.pages.about.sections[1][1]}</p>
    </div>
  );
}
