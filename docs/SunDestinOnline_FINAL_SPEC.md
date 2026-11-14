# SunDestinOnline — Consolidated Website & Security Specification

**Version:** 1.0 consolidated | **Date:** 2026-11-07  
**Project:** SunDestinOnline vacation rental direct-booking platform  
**Status:** Implementation specification; decisions listed in §17 remain open

## 1. Objective and scope
Build a lightweight, mobile-first, privacy-first direct-booking platform for **1–5 Florida beach vacation rentals**, expandable to additional properties. Guests can discover properties, check trustworthy availability, see all-in pricing, reserve, pay through a hosted checkout, and receive confirmations. Owners/admins manage properties, availability, pricing, reservations and payments. The site must favor maintainable, common managed hosting over complex self-hosted infrastructure.

**Design qualities:** minimal Google-like homepage, clean typography, accessible controls, beach-inspired sand/teal/ocean-blue accents, fast loading, reusable page components, uniform layout/navigation and responsive image galleries. Guest browsing must work without login; guest checkout should be supported where feasible.

## 2. Existing project and references
- Existing local repo: `C:\Users\achai\OneDrive\Documents\GitHub\sundestinonline\`
- GitHub: `https://github.com/dhamotharangh/sundestinonline.git`
- **Existing application as recorded in source:** Python Tornado + SQLite + vanilla JavaScript; run `python server/tornado_app.py` on port `8888`; `server_debug=true` in `config.csv` was a development setting and **must not be enabled in production**.
- **Proposed target architecture:** static React + TypeScript + Vite frontend, Supabase managed backend, Stripe-hosted Checkout, Hostinger static hosting, Cloudflare and GitHub CI/CD. **This is a proposed migration, not a description of the current repository. Do not rewrite the app without reviewing current code and agreeing on a migration plan.**
- Styling/layout reference files in separate repository `ownervacationrentals`: `SAY_AND_STAY_LAYOUT_SPEC.md`, `STYLE_GUIDE.md`, `SESSION_CONTEXT.md`, `docs/ROLES_AND_FEATURES.md`, `docs/dev-crew/`, `QA_results_20260613_015957.log`. Treat as design/review references, not automatically applicable code.

## 3. User roles and feature authorization
Roles: anonymous visitor; guest; property owner; employee/operator; security administrator; organization administrator. Support flexible **role-to-feature assignments** and property-scoped permissions, with organization administrator as top-level governance role. Define an explicit **actor × feature × action** matrix for view/create/edit/delete/approve/export/refund. Employee assignments may be configured per feature. A new authenticated account receives only guest access; owner/admin privileges require a trusted invitation/approval process.

Every protected backend operation must enforce authorization independently of the frontend, including ownership of the specific property/reservation. No role may grant itself higher privilege. Record administrative privilege changes and access revocation. Require MFA and recent reauthentication for sensitive administrative operations.

## 4. Proposed hosting and technology
| Layer | Target implementation | Responsibility |
|---|---|---|
| Domain / edge | Own domain + Cloudflare DNS/CDN/WAF | DNS, edge defenses, HTTPS front door |
| Static site | Hostinger supported static hosting | Compiled site only; no secrets or guest database |
| UI | React, TypeScript, Vite; simple CSS or Tailwind | Responsive pages and calendar widgets |
| Source/deploy | Private GitHub + controlled CI/CD | Review, test, build, deployment and rollback |
| Data and identity | Managed Supabase PostgreSQL + Auth + RLS | Private records, identities, policy enforcement |
| API | Supabase Edge Functions / reviewed DB functions | Pricing, holds, booking and payment coordination |
| Files | Public optimized property images; private storage for sensitive files | Media, access-controlled attachments |
| Payments | Stripe-hosted Checkout | Card entry, payment and refunds |
| Email | Production transactional mail provider | OTP and transaction notifications |
| Resilience | Backups, restore tests, error/uptime monitoring | Operational recoverability |

**Architecture principle:** browser → Cloudflare → static site; frontend calls HTTPS Supabase endpoints; secure backend creates Stripe sessions and receives verified Stripe webhooks. Cloudflare WAF on the site **does not automatically protect** the Supabase domain. All backend endpoints need independent auth, validation, authorization and abuse controls.

Do not introduce a VPS, self-hosted database, Kubernetes, microservices, custom password storage or in-house card payment form without a documented reason. Static hosting should remain portable. Before choosing implementation, assess **retain Tornado/SQLite with security hardening vs migrate to Supabase/React**, and document scope, data conversion, tests and rollback.

## 5. Pages and consistent site layout
Use a shared header, logo, navigation, footer, typography, colors, forms, validation/error patterns and accessible components. Avoid duplicated page-specific nav CSS. Guest pages:
1. **Home:** slim, uncluttered, prominently centered natural-language vacation-search box and optional structured quick inputs for dates, guests and location; featured property cards and advantages of direct booking.
2. **Search/listings:** ranked property results and filters; show location, image, bedroom/bath, sleep capacity, amenities, nightly *and total* price, availability and Best Match score.
3. **Property detail:** gallery, summary, exact view/access descriptions, amenities, rules, reviews, parking, location, availability and sticky booking panel with itemized price quote.
4. **Availability / dates:** calendar and check-in/out selection; can be embedded in detail page.
5. **Reservation:** guest details, booking summary, special requests and required policy agreements.
6. **Payment:** review final total and redirect to **Stripe-hosted Checkout**; do not display a locally implemented credit-card field.
7. **Confirmation:** verified booking reference and status; email only after server-side confirmation.
8. **Support/contact, policies, terms, cancellation and privacy pages.**
9. **Owner/admin dashboard:** properties, reservations, calendar, blocked dates, rates, payments, approvals, reports, settings and audit history.

Owner dashboard may be staged but minimal secure controls for managing live bookings and calendar blocks are needed before launch.

## 6. Natural-language travel search and matching
Example: “Ocean-front condo for 2 adults and 1 child in Destin, Feb 27, 3 nights, about $250/night all-inclusive, parking, clear ocean view.”

A **server-side validated parser** converts free text to typed structured fields: city/region, check-in/check-out or length of stay, adults/children, budget and whether it refers to nightly or all-in total, waterfront vs view quality, amenities, parking, occupancy and optional constraints. Normalize relative/ambiguous dates using a known reference date and property timezone; ask for missing critical details rather than inventing them. Use deterministic parsing first; optional AI-assisted extraction must be isolated, data-minimized and treated as untrusted output. Do not grant the language model database permissions.

Search returns an explainable **Best Match score (0–100)** reflecting price fit, beach proximity, beachfront requirement, view, amenities, occupancy, parking and date availability. Hard constraints (unavailable nights, occupancy limits, mandatory beachfront requirement) must not be hidden by high scores. Include alternate suitable properties.

**Optional visualization:** interactive bubble chart (X = all-in price or clearly labelled nightly price, Y = beach distance, size = match score, color = amenity fit) and UpSet/intersection plot for beachfront, parking, ocean view, budget fit and availability. Provide accessible list/table alternatives. These advanced charts are later-phase features, not MVP launch blockers.

**Additional ideas retained:** RRI basic/premium display, off-season vs peak-season pricing distribution, clear legends, AI-assisted discovery, guest reviews with photos, and an optional “Bid your price” flow showing bid amount and relative percentage. **Bidding requires separate business approval** for acceptance rules, rate floors, expiry and payment handling; do not assume bids are confirmed bookings.

## 7. Property catalog and editorial content
Each property needs ID, name, complex, address, geography, unit, floor, photos, number of bedrooms/baths, sleeping capacity, amenities, beach/water view rating, beach access, parking, house rules, check-in/out times, pricing and fee rules, and disclosure of any seasonal amenities. Image gallery should use responsive images, captions/alt text, compression and licensed/owned media.

**SunDestin #203 draft content preserved for editorial review (do not silently publish as verified):**
- Headline option A: “Toes-in-the-Sand Gulf Views from Your Private Beachfront Balcony.”
- Subtitle A: “SunDestin #203 — 2nd-floor Gulf-front condo with direct beach access, beachside pool, and sleeping for 6, steps from the heart of Destin.”
- Headline option B: “Sandy Toes, Salty Air, and a Balcony That Spoils You Rotten.”
- Subtitle B: “A breezy little 2nd-floor hideaway at SunDestin — roll out of bed, grab your coffee, and you're beach-bound before the sunscreen dries.”
- Source drafts describe a one-bedroom/one-bath second-floor condo sleeping six with bunk nook, sleeper sofa, full kitchen, Wi-Fi, beachside pool and balcony. Claims such as direct Gulf-front views, seasonal chairs and proximity must be fact-checked before publishing.
- **Conflicting source addresses:** one draft says `1040 Highway 90 East`, another says `1040 Highway 98 East`, both in Destin. **Verify actual street address and unit before publication**.
- Other example property in wireframes is Condo #815 in Panama City Beach; examples (price $180/night, occupancy, check-in times) are mockups, not verified production data.

## 8. Availability calendar — guest requirements
Display monthly navigation, available/unavailable/selected/restricted nights, nightly rates, check-in and check-out controls, stay length and quoted total. Support responsive/mobile layouts and date-range property search. Check-in is inclusive and check-out exclusive: June 10–15 occupies five nights, June 10–14; same-day turnover on June 15 is allowed unless restricted.

Validate minimum/maximum nights, lead time, booking window, permitted arrival/departure days, occupancy and turnover buffers. Clear errors should explain unavailable ranges or restrictions. Calendar display is advisory; **server/database availability checks are authoritative** at hold and confirmation.

## 9. Owner calendar, pricing and channel synchronization
Owner/admin capabilities: monthly/weekly/multi-property views, manual blocks (owner use, cleaning, maintenance, external reservation, other), calendar-based reservation actions, rates and stay rules, bulk updates, permission checks, and history recording actor, timestamp and before/after values.

Nightly price resolution must define explicit precedence for default, seasonal, weekday/weekend, event/holiday and date-specific overrides. Apply weekly/monthly/promotional discounts and calculate mandatory cleaning, taxes, platform/service, optional charges and deposits consistently; distinguish per-night estimates from **full, all-in price** before checkout.

Import external `.ics` feeds; export per-property signed/unguessable read-only feeds; track source, UID, last successful sync, failure, retry and conflicts. Support Airbnb/Vrbo through mechanisms actually permitted by each channel. External iCal is delayed and typically carries occupancy/blocks, not detailed prices. **Do not promise zero double bookings across unsynchronized third-party channels.** Reconcile overlapping imports, duplicate events, removals and stale feeds carefully. Do not include guest personal details in public/exported feeds.

## 10. Secure booking and payment lifecycle
`Select property/dates → validate availability, occupancy and restrictions → server-side final quote → atomically reserve a time-limited hold → create Stripe Checkout session → verify signed Stripe webhook and actual payment status → commit confirmed reservation while preserving inventory integrity → notify guest/owner → sync channels.`

Rules:
- Never trust dates, totals, roles or discounts provided by the browser.
- Database-enforce no overlapping active holds, booked nights or owner blocks. Protect against concurrency and replays.
- Use finite holds with documented expiration/release and reconciliation, including late webhooks and expired sessions.
- Verify the exact raw webhook body/signature, payment/session/amount/currency/booking match and idempotency. Do not confirm solely from the browser's success redirect.
- Support cancellation, modification, refund and manual approval workflows using server-validated state transitions and audit logs.
- Capture only booking-required guest contact data. Require explicit acceptance of relevant terms/cancellation rules and make privacy notice accessible.
- Do not store primary card numbers or CVV. Hosted payment reduces card-data exposure but does not automatically establish full PCI compliance.

## 11. Authentication (ATN), authorization (ATZ) and Zero Trust
**ATN:** Supabase Auth with (a) Google OAuth for eligible Google/Gmail/Workspace accounts; (b) Microsoft sign-in for supported Outlook/Hotmail/Live/Microsoft 365 accounts; (c) passwordless **email OTP** for Yahoo, corporate and any other reachable email. Email address alone is not a Yahoo/O365 identity federation. Enterprise SAML/OIDC is a future option where supported. Use production SMTP with SPF/DKIM/DMARC; rate-limit OTP issuance/verification and avoid account enumeration. Request only minimal identity scopes, **never mailbox, contacts or file access**.

**ATZ:** default guest role; explicit owner/admin promotion; server-side role + feature + property/resource checks and PostgreSQL RLS for all exposed tables. Authenticate and authorize every protected request. Owner A must not see Owner B’s records; guest A must not see guest B’s bookings. Never grant privilege based solely on email/domain. Apply controlled identity linking; never auto-merge accounts based just on a typed email. Revoke access promptly and audit privilege changes.

**Zero Trust:** no trust based only on network position, browser state, IP, email domain or frontend flags. Recheck identity and resource permission for each sensitive action; use minimum necessary scopes, MFA/re-authentication for privileged actions and protected secrets on the server only.

## 12. HTTPS, TLS certificates and application security
**SEC-TLS-001 (mandatory):** HTTPS for every page, authentication callback, API request and payment transition; automatically renewing valid TLS certificates; browser→Cloudflare HTTPS plus **Cloudflare Full (strict)** verified HTTPS to Hostinger origin (never Flexible); HTTPS endpoints for Supabase and Stripe; redirects HTTP→HTTPS; enable HSTS after validation; use TLS 1.2/1.3 as supported; prohibit mixed content; use Secure/HttpOnly/SameSite cookies where applicable; monitor expiry and test renewal.

Use OWASP ASVS 5.0 Level 2 as an engineering test target, not a certification claim. Apply strict server-side validation, parameterized queries, output encoding/XSS defenses, CSRF mitigations where relevant, secure CSP and other security headers, tightly scoped CORS, upload limits/validation, BOLA/IDOR prevention, bot/rate controls, secret scanning, dependency scans and sanitized error logging. Exposed tables require deny-by-default Row Level Security. Backend security must not depend on Cloudflare covering the Supabase URL. No service-role keys, DB passwords, Stripe secrets or unrestricted storage credentials in client bundles, logs or Git.

## 13. Privacy and data governance
Collect the minimum necessary: guest name, verified contact channel, booking dates/property, guest count, charges and token/reference to payment. Address and telephone fields should be required **only if business/tax/legal needs justify them**, despite the earlier sample wireframe listing all address fields. Do not request government IDs unless legally/business required and supported by a privacy-protective workflow.

Default to no advertising trackers, consent-aware optional analytics, private storage for sensitive documents, minimal log PII, role-separated operational/analytics data, documented provider sharing, retention/deletion schedule, deletion/access request workflow subject to legal obligations and property-scoped access. Document security incidents and notification responsibilities. Encrypt in transit and at rest, with additional field-level encryption only if justified.

## 14. Data model, session context and API contracts
Define ER diagram, keys, dependencies, migrations and testable RLS policies for at least:
`properties`, `property_media`, `amenities`, `profiles`, `roles`, `role_feature_grants`, `owner_property_assignments`, `reservations`, `booking_holds`, `calendar_blocks`, `nightly_rates`, `stay_rules`, `fees_taxes`, `payments`, `calendar_sync_sources`, `calendar_events`, `reviews`, `audit_logs`.

Use property-local **DATE** values for occupied nights and UTC timestamps for events. Enforce `check_out > check_in`, referential integrity, unique imported-event identity, payment/event idempotency and atomic inventory safety. Separate public read models from private customer data.

Design a shared, documented **session context** listing each variable, type, origin, persistence lifetime and accessibility, spanning pages/components without storing sensitive secrets or untrusted authorization flags in browser storage. Keep frontend state separate from authenticated backend state.

API contracts (paths are illustrative; adjust to deployed function routing): calendar GET; availability POST; quote POST; booking hold POST; reservation create/update/cancel; admin block/rate changes; external sync trigger; tokenized iCal export; checkout-session creation; signed Stripe webhook. Document request/response/error formats, role checks, throttles and idempotency keys.

## 15. Quality assurance and technical-role sign-offs
Retain the reference **10-role review model**, adjusted for actual chosen stack:
1. Requirements Analyst — complete, testable requirements.
2. Architect Reviewer — consistency, boundaries, reusable layout, no dead/broken links.
3. Backend Engineer — Tornado or Supabase/Edge Function correctness.
4. API Integration Reviewer — API contracts, provider/webhook integration.
5. Data Engineer — SQLite or PostgreSQL schema, migrations, integrity.
6. UI/UX Reviewer — consistent layout, mobile, accessibility, typography.
7. QA Tester — functional, integration, regression and edge cases.
8. Security Reviewer — ATN/ATZ/RLS, TLS, secrets, abuse and privacy.
9. DevOps Deployer — build, hosting, deployment, rollback and recovery.
10. Release Manager — release gate and evidence-based sign-offs.

Existing source refers to a PostToolUse review hook and engineering constitution in the `ownervacationrentals` reference project; **verify availability before adopting**. Technical-role sign-offs must be based on recorded tests, not generated declarations. Support **on-demand full-site or feature-specific QA** and report issues, fixes, reruns and approvals. Do not automatically commit/push unless explicitly directed; when directed, run review/tests then commit and push using authorized credentials.

Critical QA: public access cannot read private data; cross-guest/owner isolation; unauthorized role escalation; OAuth/email OTP; session invalidation; TLS/mixed-content; XSS/injection/CSRF; direct Supabase abuse; simultaneous booking; cancellation and blocked dates; rate tampering; webhook signature/idempotency; expired holds; iCal overlap and outages; fail-safe recovery; backup restoration; broken links; keyboard/mobile accessibility and console errors.

## 16. Deployment plan and rollout
**Stage A — Baseline:** inventory existing Tornado/SQLite repository and verify reference files; choose retain-vs-migrate; produce architecture diagram, feature matrix, ERD, threat model, session design and deployment configuration.

**Stage B — Public site:** shared layout/style, responsive home/search/property pages, optimized media, static hosting, domain, HTTPS/TLS, CI/CD with rollback.

**Stage C — Identity and administration:** Google/Microsoft/email OTP, production SMTP, MFA, role/feature/property permissions and owner controls.

**Stage D — Calendar and quotes:** rates, stay restrictions, manual blocks, imports/exports as ready, atomic inventory and short-lived holds.

**Stage E — Payments and booking:** Stripe Checkout and signed webhooks, confirmation, cancellation, refund/reconciliation, emails and audit.

**Stage F — Hardening/release:** threat-model closure, all security and functional QA, backup restore, logging/alerts, admin training and launch gate.

**Later enhancements:** AI matching, bubble/UpSet plots, RRI comparisons, bid-your-price, guest photo reviews, bulk calendar operations, advanced multi-property dashboards and enterprise SSO.

For every stage provide changed files, configuration, tests, security controls, manual setup, rollback and explicit pass/fail acceptance evidence. Keep separate production/staging environments and secrets, branch protection, dependency scanning, managed backups plus independent exports, and monitored domain/certificate/uptime. Determine free/paid service availability from current plans before budgeting.

## 17. Decisions and contradictions requiring confirmation
1. **Stack:** source says current Tornado/SQLite/vanilla JS, proposed production target is React/Vite/Supabase. Decide whether to retain and harden the existing app or migrate incrementally; do not discard current work.
2. **Property address/content:** conflicting Highway 90 vs Highway 98 address for SunDestin #203; verify all claims and rights to images. Decide between the two headline/copy options.
3. **Owner roles:** source asks both broad feature-level employee permissions and simple guest/owner/admin structure; adopt richer matrix in the backend but keep MVP UI simple.
4. **Bidding and RRI:** interesting additional features, but rules and metrics are not fully defined. Keep them out of the paid booking critical path until specified.
5. **Guest information:** original wireframe requires full mailing address; privacy-first requirement calls for minimum collection. Make billing/address conditional on actual need.
6. **Calendar:** external iCal is not instantaneous. Decide whether third-party channels will be actively selling same dates on launch and define conflict-response procedure.
7. **Property-specific pricing, cancellation policies, taxes, check-in/out and house rules** require approved real data; illustrative wireframe figures are not production defaults.

## 18. Required final deliverables for implementation agent
Provide: (1) current-state inventory and migration decision; (2) architecture/trust-boundary diagrams and threat model; (3) page and reusable-component plan; (4) user journey and permission matrix; (5) ERD/schema/RLS tests; (6) calendar and checkout sequence diagrams; (7) session context and API contracts; (8) privacy/data retention matrix; (9) repo structure; (10) Hostinger/Cloudflare/Supabase/Stripe setup; (11) CI/CD, monitoring, backup and rollback; (12) QA test plan with evidence; (13) stage-by-stage implementation and cost estimate with assumptions marked.

**Release rule:** never assert a feature, security test, deployment, provider integration or compliance state is complete without verifying it against the actual running implementation.
