# Ocean Plastic Mining Project

**Can we lower the full cost of permanently removing ocean plastic far enough for independent teams and markets to participate?**

An open engineering project to reduce the cost of permanently removing ocean plastic.

**Project status: Research / pre-validation.** No verified LCOCR, sea trial, operating team or profitable resource-recovery pathway is claimed. “Mining” is an economic metaphor; the project name is provisional.

## Mission

Build inspectable methods, data, models and challenges so many independent teams can test whether complete removal cost can fall. The project must be maintainable without its founder. The ocean doesn’t need another promise. It needs a measurable cost curve.

## Current status

- 14 core pages and 10 challenge detail pages, in seven languages: **168 localized pre-rendered pages**.
- First-class Project Overview and Contact pages, plus a homepage that states the research question, cost thresholds and what remains unproven.
- Editable gross LCOCR calculator, conceptual cost curve, separate operating/full-cost T1 balances and T2 balance.
- Ten E0 challenges; nine explicitly uncertain assumptions; no fabricated leaderboard entries.
- Working downloads, issue forms, contribution and governance processes.
- Permanent public launch history and running time from `2026-09-13`, plus an optional persistent estimated-unique-browser counter.
- Methodology version `0.1-draft`, awaiting RFC-0001 review. No maintainers are invented.

## Start here

Node.js **22.13 or newer** (Node 22 LTS recommended).

```bash
npm install
npm run dev
```

Open http://localhost:3100/zh/ or http://localhost:3100/en/.

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

`npm run dev` and `npm start` both use port 3100; run one at a time. No private keys are required for installation, compilation or ordinary page rendering. `npm run test:routes` and `npm run test:browser` run against `http://localhost:3100` (override `TEST_BASE_URL`). Browser checks require `npx playwright install chromium` once.

## Challenges

`data/challenges.json` owns IDs, status, level, metrics, dates and source references. `locales/{locale}/content.json` owns explanatory text. The ten questions cover resource density, logistics energy floor, autonomy, satellite detection, drones, drag, pyrolysis net energy, mothership/swarm, offshore maintenance and the LCOCR baseline.

## Cost model

`lib/cost-model.ts` defines annualization and gross LCOCR. All inputs start blank. Blank is unknown, not zero. Revenues and public payments do **not** reduce gross removal cost; they enter separate viability balances. See [methodology](docs/methodology/lcocr.md) and [verification](docs/methodology/verification.md).

## Evidence

Evidence direction (supported / uncertain / rejected) is independent of E0–E6 quality. External operator statements are background reading, not project verification. The leaderboard is intentionally empty. The seed reference is The Ocean Cleanup’s [System 03 overview](https://theoceancleanup.com/updates/system-03-a-beginners-guide/); it is not used to estimate their €/t.

## Contributing

The canonical public repository is <https://github.com/Roman69066/ocean-plastic-mining>. Start with [CONTRIBUTING](CONTRIBUTING.md), [GitHub Issue Forms](https://github.com/Roman69066/ocean-plastic-mining/issues/new/choose), [templates](public/toolkit/) and [RFCs](rfcs/). English is the cross-country collaboration baseline; Chinese and English are priority languages. Other-language submissions are welcome. No account system is built into the website.

## Governance

Read [GOVERNANCE](GOVERNANCE.md), [CODE_OF_CONDUCT](CODE_OF_CONDUCT.md), [SECURITY](SECURITY.md) and [ROADMAP](ROADMAP.md). The founder may become an advisor. Domain maintainers and a lead maintainer can take over through the recorded succession process.

## Languages

`zh / en / es / de / ja / it / fr`. Every catalog has identical keys, `translation.status`, `reviewedBy` and `lastReviewedDate`. All currently need community review; none is marked native-reviewed. Facts never live in separate language copies. URL switching keeps route, query and fragment. An explicit URL wins; only `/` consults local preference and browser languages. No IP-based redirection.

## Deploy to Vercel

Import this **independent project directory**, not the unrelated parent repository. Use the Next.js preset, Node 22, `npm ci`, `npm run build`, and the default Next.js output setting. `vercel.json` is included. Because the requested visitor counter has one dynamic API route, this is a static-first Next.js deployment, not a pure static export.

Optional public configuration (rebuild after changes):

- `NEXT_PUBLIC_SITE_URL`: actual origin; used for canonical, hreflang, sitemap and Open Graph. Defaults to localhost for local development. Set before public deployment.

The permanent public launch date is `2026-09-13`, stored once in `lib/uptime.ts`. It does not depend on deployment metadata or an environment variable and must remain unchanged across releases, domains and hosting providers.

Optional server-only counter configuration:

- `COUNTER_REDIS_REST_URL`, `COUNTER_REDIS_REST_TOKEN`: credentials for a dedicated Upstash-compatible Redis REST database.
- `COUNTER_NAMESPACE`: optional explicit prefix. When omitted on Vercel, production, preview and development use separate defaults. Never reuse an unrelated application's credentials or namespace.

The API stores a SHA-256 hash of a random first-party cookie ID in a Redis set. `SADD` and `SCARD` execute atomically. The cookie lasts up to one year; new devices, clearing cookies or expiry may count again. This counts unique browser identifiers, **not verified natural persons**. JS-capable bots can inflate the number. No IP, user-agent, path or timestamp-per-visitor is stored. DNT/GPC avoids adding visitors. See [statistics deployment](docs/site-statistics.md).

After changing governance or contribution documents, run `npm run sync:toolkit` to refresh website downloads. The tests detect stale copies. See [acceptance record](docs/ACCEPTANCE.md) for the complete verified scope.

## Project structure

```text
app/[locale]/[[...path]]/   localized static pages and challenge routes
app/api/site-stats/        one optional dynamic statistics API
components/                layout, charts, calculator and filters
lib/                       model, routing, configuration and schemas
data/                      one canonical engineering record set
content/                   content entry points
locales/{locale}/          seven complete explanatory catalogs
docs/                      methodology, operations and review guidance
rfcs/                      public methodology and governance proposals
public/toolkit/            real downloadable templates and guides
.github/                   issue forms, PR template and CI
scripts/, tests/           route/browser and invariant checks
```

## License

Software: [Apache License 2.0](LICENSE). Original research content and data: [CC BY 4.0](CONTENT_LICENSE.md). Third-party rights remain with their owners. No hardware license is asserted.
