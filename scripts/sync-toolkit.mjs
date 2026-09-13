import { copyFile } from "node:fs/promises";
const mappings = [
  ["CONTRIBUTING.md", "contribution-guide.md"],
  ["rfcs/RFC-template.md", "rfc-template.md"],
  ["rfcs/RFC-0001.md", "RFC-0001.md"],
  ["LICENSE", "LICENSE.txt"],
  ...[
    "CONTENT_LICENSE.md",
    "GOVERNANCE.md",
    "CONTRIBUTING.md",
    "CODE_OF_CONDUCT.md",
    "SECURITY.md",
    "ROADMAP.md",
  ].map((name) => [name, name]),
];
for (const [source, target] of mappings)
  await copyFile(
    new URL("../" + source, import.meta.url),
    new URL("../public/toolkit/" + target, import.meta.url),
  );
console.log("Synchronized published governance and contribution downloads.");
