import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import {
  challengeContributionHref,
  contributionHref,
  issueChooserUrl,
  issueTemplates,
  repositoryContributingUrl,
  repositoryUrl,
} from "../lib/config.ts";

const canonicalRepository =
  "https://github.com/Roman69066/ocean-plastic-mining";

function assertIssueForm(href: string, template: string) {
  const url = new URL(href);
  assert.equal(url.origin, "https://github.com");
  assert.equal(url.pathname, "/Roman69066/ocean-plastic-mining/issues/new");
  assert.equal(url.searchParams.get("template"), template);
  assert.doesNotMatch(href, /raw\.githubusercontent|\/blob\/|\/toolkit\//i);
}

test("canonical public GitHub destinations require no environment setting", () => {
  assert.equal(repositoryUrl, canonicalRepository);
  assert.equal(
    repositoryContributingUrl,
    `${canonicalRepository}/blob/main/CONTRIBUTING.md`,
  );
  assert.equal(issueChooserUrl, `${canonicalRepository}/issues/new/choose`);
  assert.doesNotMatch(
    readFileSync(new URL("../lib/config.ts", import.meta.url), "utf8"),
    /NEXT_PUBLIC_GITHUB_URL/,
  );
});

test("every contribution type uses an existing human-facing issue form", () => {
  assert.equal(issueTemplates.length, 7);
  issueTemplates.forEach((template, index) => {
    assert.ok(
      existsSync(
        new URL(`../.github/ISSUE_TEMPLATE/${template}`, import.meta.url),
      ),
      template,
    );
    assertIssueForm(contributionHref(index), template);
  });
  assert.throws(() => contributionHref(7), RangeError);
});

test("CH-001 through CH-010 carry their IDs into challenge issue forms", () => {
  for (let index = 1; index <= 10; index += 1) {
    const id = `CH-${String(index).padStart(3, "0")}`;
    const href = challengeContributionHref(id);
    assertIssueForm(href, "challenge-proposal.yml");
    assert.equal(
      new URL(href).searchParams.get("title"),
      `[Challenge proposal] ${id}: `,
    );
  }
  assert.match(challengeContributionHref("CH-007"), /CH-007/);
  assert.match(challengeContributionHref("CH-010"), /CH-010/);
  assert.throws(() => challengeContributionHref("007"));
});

test("localized content contains no obsolete repository-disconnected state", () => {
  for (const locale of ["zh", "en", "es", "de", "ja", "it", "fr"]) {
    const dictionary = JSON.parse(
      readFileSync(
        new URL(`../locales/${locale}/content.json`, import.meta.url),
        "utf8",
      ),
    );
    assert.equal("repoPending" in dictionary.ui, false, locale);
  }
});
