# Cumulative uptime and visitors

Added at the user's request. The content remains statically pre-rendered; only `/api/site-stats/` is dynamic. Next.js runtime deployment on Vercel is required; `output: export` is intentionally not used.

## First launch

The canonical public launch date is `2026-09-13` in `lib/uptime.ts`. It is permanent project history and does not depend on deployment dates, environment variables, domains or hosting providers. The client calculates completed public days from that date after hydration, so the server and browser do not render conflicting clock values. This is elapsed time since public launch, not monitored availability or an uptime SLA. The visitor count is independent of the launch clock.

## Durable anonymous counter

Create a dedicated Upstash-compatible Redis REST database, then configure server-only `COUNTER_REDIS_REST_URL` and `COUNTER_REDIS_REST_TOKEN` in Vercel. `COUNTER_NAMESPACE` may override the key prefix; when omitted, Vercel production, preview and development use isolated defaults. Never commit credentials or use `NEXT_PUBLIC_` for them. No database is necessary to build the project; absent configuration returns `unconfigured`, and the UI displays “Not available” rather than a fabricated zero.

The client sends one same-origin JSON POST per document session. The server creates a random UUID-v4 HttpOnly SameSite=Lax cookie (Secure in production, max age one year). It stores only SHA-256(random ID) in a Redis set. A Lua script atomically adds and counts. Repeat requests for the same cookie do not increase the count. GET only reads. No per-person profile, IP address, user-agent, route, geo or timestamp is stored. DNT=1 or Sec-GPC=1 only reads and does not create cookies.

The metric is cumulative unique browser identifiers, not verified humans. Clearing/expiring cookies, changing devices, concurrent first visits without a shared cookie, and JS-capable bots can increase the number. This is an exact set cardinality, not a claim of exact natural-person reach. Configure host/provider abuse limits before broad public use; no V1 service can guarantee bot-proof visitor figures.

Storage grows with unique IDs; monitor capacity. A reset or migration changes the public metric and should be documented. Deleting the namespace resets the count, so back it up according to the host’s operational policy. No automated reset is included.

## Failure and inspection

Missing configuration: HTTP 200 with `visitors: null`, `counterStatus: unconfigured`.
Backend error: HTTP 503 with `visitors: null`, `counterStatus: unavailable`. The content stays usable. No old number is presented as current.
Cross-origin or non-JSON POST: HTTP 403. Responses are not publicly cached. External credentials never enter client bundles.

Local tests verify API configuration/authorization, hash handling and backend response validation. Real Redis integration requires credentials and must be verified after connection; it is not falsely reported as complete before then.

Protocol reference: [Upstash REST API](https://upstash.com/docs/redis/features/restapi), command-in-body JSON arrays. No temporary or expiring database is presented as production persistence.
