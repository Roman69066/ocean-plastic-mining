# V1 acceptance record

Completed: 2026-09-13. Environment: macOS, Node 22.22.1, Next.js 16.3.4, production Next server on localhost:3100. This record describes software verification, not ocean engineering validation.

## Engineering

| Check | Result |
|---|---|
| npm install | Passed; reproducible package-lock.json included |
| npm run dev | Started successfully and served localized pages |
| npm run lint | Passed, no errors or warnings |
| npm run typecheck | Passed |
| npm test | 11 tests passed |
| npm run build | Passed; 154 localized SSG pages plus root/metadata/404 and one dynamic API |
| npm start | Passed |
| npm run test:routes | Passed against the production build |
| PLAYWRIGHT_CHANNEL=chrome npm run test:browser | Passed against the production build |

The initial sandbox blocked local listening and browser launch; the authorized execution profile allowed the checks. One development-mode browser run timed out during a server restart; the final production run passed.

## Routes and product

- 12 core pages × 7 languages, plus 10 challenge detail pages × 7 languages = 154 HTTP 200 routes.
- Four invalid route cases returned actual HTTP 404 responses.
- All nine toolkit downloads, favicon, robots and sitemap returned HTTP 200.
- HTML language, canonical, seven hreflang alternates and Open Graph metadata checked on every localized page; sitemap contains 154 URLs.
- Seven locales × four page layouts checked at 390px width; no page-level horizontal overflow.
- Desktop homepage and calculator plus Chinese mobile homepage visually inspected.
- Challenge filtering, language retention including query/fragment, preferred-language entry, calculator arithmetic and invalid/empty input behavior verified.
- Mobile navigation and keyboard skip link verified. No browser page errors or console errors in the final run.
- All translation catalogs have matching key structures, ten challenge texts and honest pending-review metadata.

## Cost and evidence integrity

Verified LCOCR is null. Leaderboard entries are empty. All ten seed challenges are E0 and nine core assumptions remain uncertain. No invented teams, reviewers, trials or costs are shown. Numeric calculator inputs are user-supplied scenarios; they never publish themselves as verified records. T1 operating and full-cost balances are distinct.

## Statistics addition

Both cumulative elapsed time since first public launch and cumulative anonymous-browser count are implemented in seven languages. Empty launch date and unconfigured counting display explicit pending states. Backend response validation, random-ID hashing, atomic command construction and unavailable-state logic are covered by tests. HTTP tests verify GET availability and same-origin JSON POST enforcement.

**External counter integration has not been activated or tested against an actual Redis service.** Configure dedicated server credentials, verify repeat-cookie deduplication and a second browser in a production preview, then confirm first public launch time. Do not present local test visits as public traffic.

## Open-source handover

README, CONTRIBUTING, GOVERNANCE, CODE_OF_CONDUCT, SECURITY, ROADMAP, Apache-2.0 LICENSE, CONTENT_LICENSE, RFC template and proposed RFC-0001 exist. Eight issue forms, a PR template and CI workflow are included. Downloadable document copies match the repository originals.

## Remaining limits

- No public GitHub repository connected or pushed: the existing machine GitHub CLI credential was invalid. This new project is independent of the unrelated OneThought parent.
- No Vercel production deployment or real domain configured. Localhost SEO origins must be replaced through NEXT_PUBLIC_SITE_URL before launch.
- No real visitor database configured, and no first public launch date claimed.
- No human language review, confirmed ocean engineering results or approved safety checklist claimed.
- Lighthouse score and full WCAG conformance audit were not run; no score is fabricated. Keyboard, language, layout and visible-state checks were performed.
- Global 404 uses the documented experimental globalNotFound option because the app has multiple root layouts and language-specific HTML roots.
