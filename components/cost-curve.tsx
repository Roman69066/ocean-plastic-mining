import type { Dictionary } from "@/lib/i18n";
export function CostCurve({
  d,
  compact = false,
}: {
  d: Dictionary;
  compact?: boolean;
}) {
  return (
    <figure className={`curve ${compact ? "compact" : ""}`}>
      <div className="curve-head">
        <span className="mono">LCOCR / €/t</span>
        <span className="badge">{d.ui.hypothetical}</span>
      </div>
      <svg
        viewBox="0 0 650 290"
        role="img"
        aria-label={`${d.ui.hypothetical}. ${d.home.milestone} TODAY → T1 → T2.`}
      >
        <title>{d.home.milestone}</title>
        <desc>{d.pages.cost.sections[1][1]}</desc>
        <defs>
          <pattern
            id={compact ? "grid-small" : "grid-large"}
            width="65"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M65 0H0V48"
              fill="none"
              stroke="currentColor"
              opacity=".12"
            />
          </pattern>
        </defs>
        <rect
          x="35"
          y="10"
          width="580"
          height="240"
          fill={`url(#${compact ? "grid-small" : "grid-large"})`}
        />
        <path
          d="M35 15V250H620"
          stroke="currentColor"
          opacity=".4"
          fill="none"
        />
        <path
          d="M65 40C155 45 140 147 270 170S410 217 580 223"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="4"
          strokeDasharray="8 5"
        />
        <path
          d="M270 171V250M580 223V250"
          stroke="currentColor"
          opacity=".3"
          strokeDasharray="3 5"
        />
        <circle cx="65" cy="40" r="6" fill="var(--accent)" />
        <circle cx="270" cy="171" r="6" fill="var(--accent)" />
        <circle cx="580" cy="223" r="6" fill="var(--accent)" />
        <g fill="currentColor" fontFamily="monospace" fontSize="14">
          <text x="43" y="275">
            TODAY
          </text>
          <text x="260" y="275">
            T1
          </text>
          <text x="570" y="275">
            T2
          </text>
        </g>
      </svg>
      <figcaption>{d.pages.cost.sections[1][1]}</figcaption>
    </figure>
  );
}
