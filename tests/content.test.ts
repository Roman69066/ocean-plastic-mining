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
    assert.equal(d.pages.project.sections.length, 14);
    assert.equal(d.contactTopics.length, 6);
    assert.deepEqual(d.translation.reviewedBy, []);
    assert.equal(d.translation.lastReviewedDate, null);
    assert.equal(d.translation.status, "community-review-needed");
  }
});
test("project overview preserves the V1.1 research and falsification boundaries", () => {
  const en = read("locales/en/content.json");
  const zh = read("locales/zh/content.json");
  const text = JSON.stringify(en.pages.project);
  for (const term of [
    "LCOCR",
    "T1",
    "T2",
    "T3",
    "Gate A",
    "Gate B",
    "Gate C",
    "Unknown is a valid answer",
    "10 Challenges",
  ])
    assert.ok(text.includes(term), term);
  assert.match(text, /not (?:been )?proven|not proven|NOT Proven/i);
  assert.ok(
    text.includes(
      "A high-quality falsification is as valuable as supporting evidence.",
    ),
  );
  assert.match(JSON.stringify(zh.pages.project), /尚未.*商业|商业.*尚未/);
});
test("Project and Contact are first-class routes in all seven languages", () => {
  const routeSource = readFileSync(
    new URL("../lib/i18n.ts", import.meta.url),
    "utf8",
  );
  assert.match(routeSource, /"project"/);
  assert.match(routeSource, /"contact"/);
  for (const locale of ["zh", "en", "es", "de", "ja", "it", "fr"]) {
    const d = read(`locales/${locale}/content.json`);
    assert.ok(d.pages.project.title, locale);
    assert.ok(d.pages.contact.title, locale);
  }
  assert.equal(switchLocalePath("/en/project/", "fr"), "/fr/project/");
  assert.equal(switchLocalePath("/zh/contact/", "en"), "/en/contact/");
});
test("Contact exposes the direct email and canonical public GitHub repository", () => {
  const source = readFileSync(
    new URL("../components/content-page.tsx", import.meta.url),
    "utf8",
  );
  assert.ok(source.includes('href="mailto:hoot69066@gmail.com"'));
  assert.ok(source.includes("repositoryUrl"));
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
