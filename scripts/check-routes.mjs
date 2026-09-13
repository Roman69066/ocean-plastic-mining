import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const locales = ["zh", "en", "es", "de", "ja", "it", "fr"];
const core = [
  "",
  "thesis",
  "cost",
  "challenges",
  "evidence",
  "solutions",
  "leaderboard",
  "starter-kit",
  "contribute",
  "methodology",
  "governance",
  "about",
];
const challenges = JSON.parse(
  await readFile(new URL("../data/challenges.json", import.meta.url)),
);
let count = 0;
for (const locale of locales) {
  for (const path of [
    ...core,
    ...challenges.map((c) => `challenges/${c.id}`),
  ]) {
    const response = await fetch(`${base}/${locale}/${path ? path + "/" : ""}`);
    assert.equal(response.status, 200, `${locale}/${path}`);
    const html = await response.text();
    assert.ok(
      html.includes(`<html lang="${locale}"`),
      `${locale}: HTML language`,
    );
    assert.ok(html.includes('rel="canonical"'), `${locale}/${path}: canonical`);
    for (const l of locales)
      assert.ok(
        html.includes(`hrefLang="${l}"`) || html.includes(`hreflang="${l}"`),
        `${locale}/${path}: hreflang ${l}`,
      );
    assert.ok(html.includes('property="og:title"'), `${locale}/${path}: OG`);
    if (path.startsWith("challenges/"))
      assert.ok(html.includes(path.split("/")[1]));
    assert.ok(!html.includes("NEXT_NOT_FOUND"), "Unexpected not found");
    count++;
  }
}
for (const path of [
  "/xx/",
  "/en/missing/",
  "/en/challenges/CH-999/",
  "/not-a-page/",
])
  assert.equal((await fetch(base + path)).status, 404, path);
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
  assert.equal((await fetch(`${base}/toolkit/${file}`)).status, 200, file);
for (const path of ["/favicon.svg", "/robots.txt", "/sitemap.xml"])
  assert.equal((await fetch(base + path)).status, 200, path);
const sitemap = await (await fetch(base + "/sitemap.xml")).text();
assert.equal((sitemap.match(/<loc>/g) || []).length, 154);
const stats = await fetch(base + "/api/site-stats/");
assert.ok([200, 503].includes(stats.status));
const payload = await stats.json();
assert.ok(
  ["unconfigured", "unavailable", "active"].includes(payload.counterStatus),
);
const blocked = await fetch(base + "/api/site-stats/", {
  method: "POST",
  headers: {
    Origin: "https://unrelated.example",
    "Content-Type": "application/json",
  },
  body: "{}",
});
assert.equal(blocked.status, 403);
const allowed = await fetch(base + "/api/site-stats/", {
  method: "POST",
  headers: { Origin: base, "Content-Type": "application/json" },
  body: "{}",
});
assert.ok([200, 503].includes(allowed.status));
console.log(
  `PASS: ${count} localized routes, 4 real 404s, 9 downloads, metadata, sitemap, assets and statistics API authorization.`,
);
