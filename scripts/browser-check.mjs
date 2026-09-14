import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const repository = "https://github.com/Roman69066/ocean-plastic-mining";
function assertIssueHref(href, template, challengeId) {
  const url = new URL(href);
  assert.equal(url.origin + url.pathname, `${repository}/issues/new`);
  assert.equal(url.searchParams.get("template"), template);
  if (challengeId)
    assert.ok(url.searchParams.get("title")?.includes(challengeId));
  assert.doesNotMatch(href, /raw\.githubusercontent|\/blob\/|\/toolkit\//i);
}
const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  locale: "en-US",
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (e) => {
  if (e.type() === "error") errors.push(e.text());
});
await mkdir("test-results", { recursive: true });
try {
  await page.goto(base + "/en/");
  await page.locator("h1").waitFor();
  await page.screenshot({
    path: "test-results/home-desktop.png",
    fullPage: true,
  });
  assert.match(await page.locator("h1").innerText(), /markets to participate/i);
  assert.ok(
    await page
      .getByText("We have not proven this works.", { exact: false })
      .count(),
  );
  assert.equal(
    await page
      .getByRole("link", { name: /Understand the project/ })
      .first()
      .getAttribute("href"),
    "/en/project/",
  );
  assert.equal(
    await page
      .getByRole("link", { name: /View 10 open questions/ })
      .first()
      .getAttribute("href"),
    "/en/challenges/",
  );
  assert.ok(await page.locator(`a[href="${repository}"]`).count());
  await page.goto(base + "/en/project/");
  const projectText = await page.locator("main").innerText();
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
    assert.ok(projectText.includes(term), `Project overview: ${term}`);
  assert.match(projectText, /Commercial viability has not been proven/i);
  await page.screenshot({
    path: "test-results/project-desktop.png",
    fullPage: true,
  });
  await page
    .getByRole("combobox", { name: "Language", exact: true })
    .selectOption("fr");
  await page.waitForURL("**/fr/project/");
  await page.goto(base + "/en/contact/");
  assert.equal(
    await page
      .getByRole("link", { name: "hoot69066@gmail.com" })
      .getAttribute("href"),
    "mailto:hoot69066@gmail.com",
  );
  assert.ok(await page.locator(`a[href="${repository}"]`).count());
  await page.screenshot({
    path: "test-results/contact-desktop.png",
    fullPage: true,
  });
  await page.goto(base + "/en/contribute/");
  assert.equal(
    await page.getByText(/public GitHub repository is not connected/i).count(),
    0,
  );
  const contributionLinks = await page
    .locator(".contribution-grid a")
    .evaluateAll((links) => links.map((link) => link.href));
  assert.equal(contributionLinks.length, 7);
  const contributionTemplates = [
    "data-correction.yml",
    "evidence-submission.yml",
    "challenge-proposal.yml",
    "rfc-proposal.yml",
    "solution-proposal.yml",
    "translation-correction.yml",
    "governance-proposal.yml",
  ];
  contributionLinks.forEach((href, index) =>
    assertIssueHref(href, contributionTemplates[index]),
  );
  for (let index = 1; index <= 10; index += 1) {
    const id = `CH-${String(index).padStart(3, "0")}`;
    await page.goto(`${base}/en/challenges/${id}/`);
    const href = await page
      .locator(".challenge-aside .button.primary")
      .getAttribute("href");
    assert.ok(href, `${id} contribution link`);
    assertIssueHref(href, "challenge-proposal.yml", id);
  }
  await page.goto(base + "/en/solutions/");
  const solutionLinks = await page
    .locator(".solution-card a")
    .evaluateAll((links) => links.map((link) => link.href));
  assert.ok(solutionLinks.length);
  solutionLinks.forEach((href) =>
    assertIssueHref(href, "solution-proposal.yml"),
  );
  await page.goto(base + "/en/methodology/");
  assert.equal(
    await page.locator(".page-end .button").getAttribute("href"),
    `${repository}/issues/new/choose`,
  );
  await page.goto(base + "/en/challenges/CH-007/?check=1#main");
  await page
    .getByRole("combobox", { name: "Language", exact: true })
    .selectOption("zh");
  await page.waitForURL("**/zh/challenges/CH-007/?check=1#main");
  assert.match(await page.locator("h1").innerText(), /热解净能源/);
  assert.equal(await page.locator("html").getAttribute("lang"), "zh");
  assert.equal(
    await page.evaluate(() => localStorage.getItem("opm-language")),
    "zh",
  );
  await page.goto(base + "/");
  await page.waitForURL("**/zh/");
  await page.goto(base + "/en/challenges/");
  await page.getByRole("searchbox").fill("pyrolysis");
  assert.equal(await page.locator("[data-challenge]").count(), 1);
  assert.equal(
    await page.locator("[data-challenge]").getAttribute("data-challenge"),
    "CH-007",
  );
  await page.goto(base + "/en/cost/");
  const values = {
    capex: 1000,
    lifetime: 10,
    rate: 0,
    opex: 80,
    search: 20,
    energy: 30,
    logistics: 40,
    maintenance: 10,
    processing: 10,
    disposal: 5,
    compliance: 5,
    tonnes: 10,
    resourceRevenue: 240,
    publicPayment: 30,
  };
  for (const [key, value] of Object.entries(values))
    await page.locator(`#cost-${key}`).fill(String(value));
  await page.getByRole("button", { name: /Calculate scenario/ }).click();
  assert.match(await page.locator(".result-number").innerText(), /30/);
  assert.match(await page.locator(".model-result").innerText(), /-30/);
  await page.locator("#cost-tonnes").fill("0");
  await page.getByRole("button", { name: /Calculate scenario/ }).click();
  assert.equal(await page.locator(".model-result").count(), 0);
  await page.getByRole("button", { name: "Clear inputs" }).click();
  assert.equal(await page.locator("#cost-capex").inputValue(), "");
  await page.screenshot({
    path: "test-results/cost-desktop.png",
    fullPage: true,
  });
  const stats = await page.locator(".site-stats").innerText();
  assert.ok(!stats.includes("NaN"));
  assert.ok(!stats.includes("undefined"));
  assert.ok(stats.includes("Public since"));
  assert.ok(stats.includes("September 13, 2026"));
  assert.ok(stats.includes("Estimated unique browsers"));
  await page
    .getByTestId("visitor-count")
    .filter({ hasText: "Not available" })
    .waitFor();
  await page.setViewportSize({ width: 390, height: 844 });
  for (const locale of ["zh", "en", "es", "de", "ja", "it", "fr"]) {
    for (const route of [
      "",
      "project",
      "contact",
      "cost",
      "challenges/CH-007",
      "leaderboard",
    ]) {
      await page.goto(`${base}/${locale}/${route ? route + "/" : ""}`);
      await page.locator("h1").waitFor();
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth + 1,
        ),
        `horizontal overflow: ${locale}/${route}`,
      );
    }
  }
  await page.goto(base + "/zh/");
  await page.screenshot({
    path: "test-results/home-mobile.png",
    fullPage: true,
  });
  await page.locator(".mobile-nav summary").click();
  assert.ok(
    await page
      .locator(".mobile-nav")
      .getByRole("link", { name: "项目", exact: true })
      .count(),
  );
  assert.ok(
    await page
      .locator(".mobile-nav")
      .getByRole("link", { name: "联系", exact: true })
      .count(),
  );
  const evidenceLink = page
    .locator(".mobile-nav")
    .getByRole("link", { name: "证据库", exact: true });
  await Promise.all([page.waitForURL("**/zh/evidence/"), evidenceLink.click()]);
  assert.equal(new URL(page.url()).pathname, "/zh/evidence/");
  await page.goto(base + "/en/");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  assert.ok(page.url().endsWith("#main"), "keyboard skip link");
  const filtered = errors.filter((e) => !e.includes("favicon.ico"));
  assert.deepEqual(filtered, [], "Browser console/page errors");
  console.log(
    "PASS: V1.1 homepage understanding, Project and Contact, public vital signs, desktop + 390px mobile, canonical GitHub and seven contribution workflows, CH-001–CH-010 submission links, 7 languages × 6 layouts, challenge search, retained language path/query/hash, calculator validation, persisted language, mobile navigation, keyboard skip link, stats and console checks.",
  );
} finally {
  await browser.close();
}
