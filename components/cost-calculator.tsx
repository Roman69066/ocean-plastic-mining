"use client";
import { useState } from "react";
import { buckets, calculateCost, type CostInput } from "@/lib/cost-model";
import type { Dictionary, Locale } from "@/lib/i18n";
const keys = [
  "capex",
  "lifetime",
  "rate",
  ...buckets,
  "tonnes",
  "resourceRevenue",
  "publicPayment",
] as const;
export function CostCalculator({
  d,
  locale,
}: {
  d: Dictionary;
  locale: Locale;
}) {
  const [result, setResult] = useState<ReturnType<typeof calculateCost> | null>(
    null,
  );
  const [error, setError] = useState(false);
  const fmt = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
  return (
    <section className="calculator" id="calculator">
      <div className="section-heading">
        <div>
          <p className="eyebrow">LCOCR / 0.1</p>
          <h2>{d.ui.calculate}</h2>
        </div>
        <span className="badge">{d.ui.modelOnly}</span>
      </div>
      <p>{d.ui.inputHint}</p>
      <form
        onChange={() => {
          setResult(null);
          setError(false);
        }}
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const values = Object.fromEntries(
            keys.map((key) => [
              key,
              data.get(key) === "" ? NaN : Number(data.get(key)),
            ]),
          ) as CostInput;
          try {
            setResult(calculateCost(values));
            setError(false);
          } catch {
            setResult(null);
            setError(true);
          }
        }}
        onReset={() => {
          setResult(null);
          setError(false);
        }}
      >
        <div className="input-grid">
          {keys.map((key) => (
            <label key={key} htmlFor={`cost-${key}`}>
              <span>
                {key in d.costLabels
                  ? d.costLabels[key as keyof typeof d.costLabels] + " (€/yr)"
                  : d.ui[key as keyof typeof d.ui]}
              </span>
              <input
                id={`cost-${key}`}
                name={key}
                type="number"
                inputMode="decimal"
                step="any"
                min={key === "lifetime" || key === "tonnes" ? "0.000001" : "0"}
                max={key === "rate" ? 100 : undefined}
                required
                placeholder="—"
              />
            </label>
          ))}
        </div>
        <div className="actions">
          <button type="submit" className="button primary">
            {d.ui.calculate} <span aria-hidden="true">↗</span>
          </button>
          <button type="reset" className="button">
            {d.ui.reset}
          </button>
        </div>
      </form>
      {error && (
        <p role="alert" className="error">
          {d.ui.invalid}
        </p>
      )}
      <div aria-live="polite" aria-atomic="true">
        {result && (
          <div className="model-result">
            <div>
              <span className="eyebrow">LCOCR</span>
              <p className="result-number">
                {fmt.format(result.lcocr)} <small>€/t</small>
              </p>
              <span>{d.ui.modelOnly}</span>
            </div>
            <dl>
              {(
                [
                  [d.ui.annualCapex, result.capital],
                  [d.ui.operatingCost, result.operating],
                  [d.ui.fullCost, result.fullCost],
                  [d.ui.t1Operating, result.t1Operating],
                  [d.ui.t1Full, result.t1Full],
                  [d.ui.t2Balance, result.t2],
                ] as const
              ).map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{fmt.format(value)} €</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
      <p className="muted small">{d.ui.outputHint}</p>
    </section>
  );
}
