# Security and operational safety

V1 is research infrastructure. It does not authorize ocean deployment. Marine work, vessels, machinery, autonomous systems, fuels and high-temperature treatment can harm people and ecosystems. Practical tests require competent safety review and compliance with applicable maritime, environmental, class, equipment, fuel and environmental-impact requirements.

## Software vulnerability reporting

Do not publish active credentials, personal data or an exploit against a live service in a public issue. After the repository is published and private vulnerability reporting enabled, use GitHub **Security → Report a vulnerability**. Until a private channel is available, use GitHub’s private platform reporting mechanism or prepare a redacted report; no security email or response SLA is fabricated.

Include affected version, reproduction, impact, boundaries and proposed mitigation. Maintainers should acknowledge promptly when capacity exists, coordinate remediation and publish a redacted advisory after a fix. Only the latest V1 branch is intended for support; no staffed support team is claimed.

## Application boundaries

Public pages are pre-rendered. The statistics route is optional, accepts same-origin JSON posts, stores only random-ID hashes and uses server-only credentials. Keep production and preview namespaces separate. No private token may use `NEXT_PUBLIC_`. Counter failure must not break reading or falsify counts. Protect external service access and configure platform rate limits before large-scale public traffic. Bots and cookie resets can affect statistics.

External citations are untrusted content, not executable code. Translation and JSON data do not run scripts. No embedded analytics SDK or third-party scripts are included.
