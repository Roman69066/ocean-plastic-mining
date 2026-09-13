import records from "@/data/challenges.json";
import sources from "@/data/sources/index.json";
import evidence from "@/data/evidence.json";
import solutions from "@/data/solutions.json";
import leaderboard from "@/data/leaderboard/index.json";
import model from "@/data/lcocr/model.json";
import type { Dictionary } from "./i18n";
export { sources, evidence, solutions, leaderboard, model };
export type ChallengeStatus =
  | "OPEN"
  | "ACTIVE"
  | "PARTIALLY_SOLVED"
  | "VALIDATED"
  | "REJECTED"
  | "ARCHIVED";
export type EvidenceLevel = "E0" | "E1" | "E2" | "E3" | "E4" | "E5" | "E6";
export type Challenge = Omit<
  (typeof records)[number],
  "status" | "evidenceLevel" | "category" | "id"
> & {
  id: keyof Dictionary["challenges"];
  status: ChallengeStatus;
  evidenceLevel: EvidenceLevel;
  category: keyof Dictionary["labels"];
};
export const challenges = records as Challenge[];
export function getChallenge(id: string) {
  return challenges.find((c) => c.id === id);
}
export const evidenceLevels: EvidenceLevel[] = [
  "E0",
  "E1",
  "E2",
  "E3",
  "E4",
  "E5",
  "E6",
];
export const kitFiles = [
  "cost-model.csv",
  "challenge-template.md",
  "evidence-template.md",
  "dataset-template.md",
  "field-test-template.md",
  "safety-checklist.md",
  "contribution-guide.md",
  "translation-guide.md",
  "rfc-template.md",
];
