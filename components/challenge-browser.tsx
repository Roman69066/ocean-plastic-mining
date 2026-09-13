"use client";
import { useState } from "react";
import { challenges } from "@/lib/data";
import { ChallengeCard } from "./challenge-card";
import type { Dictionary, Locale } from "@/lib/i18n";
export function ChallengeBrowser({
  d,
  locale,
}: {
  d: Dictionary;
  locale: Locale;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const shown = challenges.filter(
    (c) =>
      (!category || c.category === category) &&
      `${c.id} ${d.challenges[c.id].title} ${d.challenges[c.id].summary}`
        .toLocaleLowerCase(locale)
        .includes(query.toLocaleLowerCase(locale)),
  );
  return (
    <>
      <div className="filters">
        <label>
          <span className="sr-only">{d.ui.search}</span>
          <input
            type="search"
            placeholder={d.ui.search}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label>
          <span className="sr-only">{d.ui.category}</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {["", ...new Set(challenges.map((c) => c.category))].map((v) => (
              <option value={v} key={v}>
                {v ? d.labels[v as keyof typeof d.labels] : d.ui.allCategories}
              </option>
            ))}
          </select>
        </label>
        <span className="mono" role="status">
          {shown.length} / {challenges.length}
        </span>
      </div>
      <div className="challenge-grid">
        {shown.map((c) => (
          <ChallengeCard key={c.id} challenge={c} d={d} locale={locale} />
        ))}
      </div>
      {!shown.length && <p className="empty">{d.ui.noResults}</p>}
    </>
  );
}
