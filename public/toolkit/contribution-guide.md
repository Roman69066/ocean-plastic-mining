# Contributing

Measure it. Test it. Challenge the assumption. Negative results are welcome.

## Choose a contribution

1. **Find an error**: use [Data correction](https://github.com/Roman69066/ocean-plastic-mining/issues/new?template=data-correction.yml) for model/data issues or [Bug report](https://github.com/Roman69066/ocean-plastic-mining/issues/new?template=bug-report.yml) for software. State the affected record, current claim, proposed correction, source and uncertainty.
2. **Submit evidence**: use [Evidence submission](https://github.com/Roman69066/ocean-plastic-mining/issues/new?template=evidence-submission.yml). Provide a stable source, license, methods, raw data, limitations, proposed E0–E6 level and a separate conclusion direction. Do not call a paper operational validation without checking its methods.
3. **Solve or propose a challenge**: reference `CH-xxx`, its target metric and boundary. Use [Challenge proposal](https://github.com/Roman69066/ocean-plastic-mining/issues/new?template=challenge-proposal.yml) and the challenge template. Include unsuccessful approaches and failure conditions.
4. **Improve the model**: edit `lib/cost-model.ts` and methodology together; supply a hand-checkable case. A boundary or definition change needs an RFC, not only code.
5. **Build hardware**: use Solution proposal. Publish an inspectable bounded experiment, risk assessment and qualified review needs. A public design is not a deployment permit. Hardware licenses require separate review.
6. **Translate**: use [Translation correction](https://github.com/Roman69066/ocean-plastic-mining/issues/new?template=translation-correction.yml) and the translation guide. Edit only explanatory catalogs; never duplicate costs, IDs, evidence levels or dates into translated facts.
7. **Maintain**: use Governance proposal. Describe the domain, sustained contributions, availability, conflicts and handover plan. No role is awarded by donation or affiliation alone.

Use the public repository's [Issue Forms](https://github.com/Roman69066/ocean-plastic-mining/issues/new/choose) and Pull Requests. English is the shared review baseline; contributions in any supported language are welcome.

## Local changes and review

Fork, create a branch, install with `npm install`, and run `npm run dev`. Keep changes bounded and retain history. Before a code PR run `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`; for routing/UI changes also run route/browser checks against `npm start`.

A reviewer checks the claim, source rights, data boundaries and affected languages. Significant methodology changes require `rfcs/RFC-xxxx.md`. Preserve rejected claims with a reason and links to superseding records. Do not silently replace public evidence. Unknown fields use `null` or an explicit unknown, not guessed zeroes.

## Licensing and conduct

By contributing software you license your contribution under Apache-2.0; original non-code content under CC BY 4.0. You must have the right to contribute it. Identify third-party licenses. Do not submit private personal data, credentials or unrelated commercial secrets. No transfer of unrelated IP is required. Follow CODE_OF_CONDUCT.md and use SECURITY.md for sensitive vulnerabilities.
