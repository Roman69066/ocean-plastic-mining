import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { preferredLocale, switchLocalePath } from "../lib/locale-routing.ts";
const read = (path: string) =>
  JSON.parse(readFileSync(new URL("../" + path, import.meta.url), "utf8"));
function shape(x: unknown): unknown {
  if (Array.isArray(x)) return x.map(shape);
  if (x && typeof x === "object")
    return Object.fromEntries(Object.entries(x).map(([k, v]) => [k, shape(v)]));
  return typeof x;
}
test("seven catalogs have complete keys, truthful review state and ten challenge texts", () => {
  const en = read("locales/en/content.json");
  for (const l of ["zh", "en", "es", "de", "ja", "it", "fr"]) {
    const d = read(`locales/${l}/content.json`);
    assert.deepEqual(shape(d), shape(en), l);
    assert.equal(Object.keys(d.challenges).length, 10);
    assert.deepEqual(d.translation.reviewedBy, []);
    assert.equal(d.translation.lastReviewedDate, null);
    assert.equal(d.translation.status, "community-review-needed");
  }
});
test("canonical data contains no fabricated verified cost, team or experiment", () => {
  const challenges = read("data/challenges.json");
  assert.equal(challenges.length, 10);
  assert.equal(new Set(challenges.map((c: { id: string }) => c.id)).size, 10);
  for (const c of challenges) {
    assert.equal(c.evidenceLevel, "E0");
    assert.equal(c.targetMetric.value, null);
    assert.deepEqual(c.submissions, []);
  }
  assert.deepEqual(read("data/leaderboard/index.json").entries, []);
  assert.equal(read("data/lcocr/model.json").verifiedCost, null);
  assert.equal(read("data/evidence.json").uncertain.length, 9);
});
test("switch preserves challenge path and language preference is deterministic", () => {
  assert.equal(
    switchLocalePath("/zh/challenges/CH-007/", "fr"),
    "/fr/challenges/CH-007/",
  );
  assert.equal(preferredLocale("ja", ["zh-CN"]), "ja");
  assert.equal(preferredLocale(null, ["pt-BR", "es-ES"]), "es");
  assert.equal(preferredLocale(null, ["xx"]), "en");
  assert.throws(() => switchLocalePath("/en/", "xx"));
});
test("toolkit and governance are actual files, downloadable copies are synchronized", () => {
  for (const file of [
    "LICENSE",
    "CONTENT_LICENSE.md",
    "CONTRIBUTING.md",
    "GOVERNANCE.md",
    "CODE_OF_CONDUCT.md",
    "SECURITY.md",
    "ROADMAP.md",
  ]) {
    assert.ok(existsSync(new URL("../" + file, import.meta.url)));
    const copy = file === "LICENSE" ? "LICENSE.txt" : file;
    assert.equal(
      readFileSync(new URL("../" + file, import.meta.url), "utf8"),
      readFileSync(
        new URL("../public/toolkit/" + copy, import.meta.url),
        "utf8",
      ),
    );
  }
  for (const file of [
    "cost-model.csv",
    "challenge-template.md",
    "evidence-template.md",
    "dataset-template.md",
    "field-test-template.md",
    "safety-checklist.md",
    "contribution-guide.md",
    "translation-guide.md",
    "rfc-template.md",
  ])
    assert.ok(
      existsSync(new URL("../public/toolkit/" + file, import.meta.url)),
    );
});
