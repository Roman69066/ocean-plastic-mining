function publicOrigin(value: string | undefined) {
  if (!value) return "http://localhost:3100";
  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol))
    throw new Error("SITE_URL must be HTTP(S)");
  return url.origin;
}
export const siteUrl = publicOrigin(process.env.NEXT_PUBLIC_SITE_URL);
export const repositoryUrl = (() => {
  const value = process.env.NEXT_PUBLIC_GITHUB_URL;
  if (!value) return null;
  if (!/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/.test(value))
    throw new Error("GITHUB_URL must identify one public repository");
  return value.replace(/\/$/, "");
})();
export const issueTemplates = [
  "data-correction.yml",
  "evidence-submission.yml",
  "challenge-proposal.yml",
  "data-correction.yml",
  "solution-proposal.yml",
  "translation-correction.yml",
  "governance-proposal.yml",
];
export function contributionHref(index: number) {
  return repositoryUrl
    ? `${repositoryUrl}/issues/new?template=${issueTemplates[index]}`
    : "/toolkit/contribution-guide.md";
}
