# V1.1 acceptance record

Updated: 2026-09-14. Environment: macOS, Node 22.22.1, Next.js 16.3.4, production Next server on localhost:3100. This record describes software verification, not ocean engineering validation.

## Engineering

| Check | Result |
|---|---|
| npm install | Passed; reproducible package-lock.json included |
| npm run dev | Started successfully and served localized pages |
| npm run lint | Passed, no errors or warnings |
| npm run typecheck | Passed |
| npm test | 20 tests passed |
| npm run build | Passed; 168 localized SSG pages plus root/metadata/404 and one dynamic API |
| npm start | Passed |
| npm run test:routes | Passed against the production build |
| PLAYWRIGHT_CHANNEL=chrome npm run test:browser | Passed against the production build |

The initial sandbox blocked local listening and browser launch; the authorized execution profile allowed the checks. One development-mode browser run timed out during a server restart; the final production run passed.

## Routes and product

- 14 core pages × 7 languages, plus 10 challenge detail pages × 7 languages = 168 HTTP 200 routes.
- Four invalid route cases returned actual HTTP 404 responses.
- All nine toolkit downloads, favicon, robots and sitemap returned HTTP 200.
- HTML language, canonical, seven hreflang alternates and Open Graph metadata checked on every localized page; sitemap contains 168 URLs.
- Seven locales × six page layouts checked at 390px width; no page-level horizontal overflow.
- Desktop homepage and calculator plus Chinese mobile homepage visually inspected.
- Challenge filtering, language retention including query/fragment, preferred-language entry, calculator arithmetic and invalid/empty input behavior verified.
- Mobile navigation and keyboard skip link verified. No browser page errors or console errors in the final run.
- All translation catalogs have matching key structures, ten challenge texts and honest pending-review metadata.

## Cost and evidence integrity

Verified LCOCR is null. Leaderboard entries are empty. All ten seed challenges are E0 and nine core assumptions remain uncertain. No invented teams, reviewers, trials or costs are shown. Numeric calculator inputs are user-supplied scenarios; they never publish themselves as verified records. T1 operating and full-cost balances are distinct.

## Public understanding and trust layer

The homepage states the central research question, Today/T1/T2/T3 cost thresholds, the explicit unproven status and eight key unknowns. Seven localized Project Overview pages cover the complete 14-part method, including LCOCR, Gate A/B/C, all ten Challenges, falsification and the rule that unknown is a valid answer. Seven localized Contact pages provide direct email and canonical GitHub paths.

The permanent public launch date is `2026-09-13`; runtime is calculated from that canonical UTC date without deployment metadata or an environment variable. The UI labels the counter “Estimated unique browsers” and explains that it is not a count of verified unique people. Backend response validation, environment-isolated namespaces, random-ID hashing, atomic command construction, repeat-ID deduplication and unavailable-state logic are covered by tests. HTTP tests verify GET availability and same-origin JSON POST enforcement.

**External counter integration is not active while Redis credentials are absent.** Configure dedicated server credentials and redeploy; until then the production UI correctly shows “Not available” rather than zero. Do not present local test visits as public traffic.

## Open-source handover

README, CONTRIBUTING, GOVERNANCE, CODE_OF_CONDUCT, SECURITY, ROADMAP, Apache-2.0 LICENSE, CONTENT_LICENSE, RFC template and proposed RFC-0001 exist. Eight issue forms, a PR template and CI workflow are included. Downloadable document copies match the repository originals.

## Remaining limits

- The public source repository is available at <https://github.com/Roman69066/ocean-plastic-mining>. `main` is the default stable branch, with `codex/v1-open-engineering` retained for engineering work.
- Vercel production is served from <https://ocean-plastic-mining.vercel.app/>. A custom domain has not been configured.
- No real visitor database is configured; estimated unique browsers remain unavailable until dedicated Redis REST credentials are added to Vercel.
- No human language review, confirmed ocean engineering results or approved safety checklist claimed.
- Lighthouse score and full WCAG conformance audit were not run; no score is fabricated. Keyboard, language, layout and visible-state checks were performed.
- Global 404 uses the documented experimental globalNotFound option because the app has multiple root layouts and language-specific HTML roots.
