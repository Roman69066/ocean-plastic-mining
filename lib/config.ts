function publicOrigin(value: string | undefined) {
  if (!value) return "http://localhost:3100";
  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol))
    throw new Error("SITE_URL must be HTTP(S)");
  return url.origin;
}
export const siteUrl = publicOrigin(process.env.NEXT_PUBLIC_SITE_URL);
export const repositoryUrl =
  "https://github.com/Roman69066/ocean-plastic-mining";
export const repositoryContributingUrl = `${repositoryUrl}/blob/main/CONTRIBUTING.md`;
export const issueChooserUrl = `${repositoryUrl}/issues/new/choose`;
export const issueTemplates = [
  "data-correction.yml",
  "evidence-submission.yml",
  "challenge-proposal.yml",
  "rfc-proposal.yml",
  "solution-proposal.yml",
  "translation-correction.yml",
  "governance-proposal.yml",
] as const;

function issueFormHref(template: string, title?: string) {
  const params = new URLSearchParams({ template });
  if (title) params.set("title", title);
  return `${repositoryUrl}/issues/new?${params.toString()}`;
}

export function contributionHref(index: number) {
  const template = issueTemplates[index];
  if (!template) throw new RangeError(`Unknown contribution type: ${index}`);
  return issueFormHref(template);
}

export function challengeContributionHref(challengeId: string) {
  if (!/^CH-\d{3}$/.test(challengeId))
    throw new Error(`Invalid challenge ID: ${challengeId}`);
  return issueFormHref(
    "challenge-proposal.yml",
    `[Challenge proposal] ${challengeId}: `,
  );
}
