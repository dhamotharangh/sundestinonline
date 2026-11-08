# SunDestin Online — Booking build plan (Option B: Hostinger + Stripe)

Approved by the owner on 2026-11-07. Replaces the "OwnerRez later" path in NEXT.md.
Source spec: docs/SunDestinOnline_FINAL_SPEC.md (ChatGPT consolidated). This plan keeps the
spec's booking rules (server-authoritative availability, hold then pay, signed webhook,
idempotency, minimum data) and drops its stack proposal (React, Supabase, Cloudflare).

## 1. Shape of the system

```
browser (static site, unchanged look)
   │  fetch JSON
   ▼
api/*.php on Hostinger Business ──► MySQL (same Hostinger plan)
   │                                   nights table = the single source of truth
   ├──► Stripe Checkout (hosted card page, Stripe keys stay on the server)
   ◄── Stripe webhook (signed) confirms the booking
   └──► Hostinger mailbox (SMTP) sends confirmations and one-time codes
```

- One host (Hostinger Business: PHP 8, MySQL, cron, mailboxes, SSL) plus Stripe for cards.
- No framework. Plain PHP with PDO, prepared statements everywhere, one `api/lib.php`.
- Secrets live in `api/.env` which is listed in `.gitignore` and denied by `.htaccess`.
- The current static pages keep working; booking calls are added to `js/site_app.js`.
- Local development: PHP built-in server + SQLite through the same PDO code (SQL kept
  portable), Stripe test mode, Stripe CLI to forward webhooks. Production: MySQL.

## 2. Data (MySQL, UTC timestamps, property-local DATE for nights)

| table | purpose |
|---|---|
| `properties` | id (sundestin_203), name, timezone, min_nights, cleaning_fee, tax_rate, currency |
| `rates` | property_id, start, end (inclusive), season, label, nightly, min_nights — same columns as data/rates.csv |
| `blocks` | owner blocks: property_id, checkin, checkout, kind (owner, cleaning, maintenance, external), note |
| `nights` | **property_id + night DATE primary key**; kind (hold, booked, block); ref; expires_at. One row per occupied night. Overlap is impossible by construction. |
| `holds` | hold_id, property_id, checkin, checkout, guests, children, quote JSON, total_cents, status (open, paid, expired, cancelled), stripe_session_id, expires_at, email |
| `reservations` | ref (human code like SD-7K3M), property_id, dates, guest name/email/phone optional, totals, status (confirmed, cancelled, refunded), hold_id, created_at |
| `payments` | reservation_ref, stripe_payment_intent, amount_cents, currency, status, refunded_cents |
| `stripe_events` | event_id primary key, type, received_at — webhook idempotency |
| `users` | id, email (unique), name, role (guest, owner), created_at |
| `otp_codes` | email, code_hash, expires_at, attempts — passwordless sign-in |
| `sessions` | token_hash, user_id, expires_at, ip, user_agent |
| `audit_log` | actor, action, target, before JSON, after JSON, at |

Rules enforced in SQL or inside one transaction: `checkout > checkin`; a hold inserts one
`nights` row per night and the transaction fails on any duplicate; expired holds are swept
before the insert and by cron every 5 minutes; `stripe_events` rejects a replayed event.

## 3. Endpoints (all JSON, all HTTPS, all rate-limited by IP and email)

| method and path | who | does |
|---|---|---|
| GET  `api/calendar.php?property=&from=&to=` | anyone | nights that are booked, held or blocked (no guest data) + rates |
| POST `api/quote.php` | anyone | dates, guests, children → nightly lines, cleaning, tax, total, min-nights check, `quote_sig` (HMAC) |
| POST `api/hold.php` | anyone | re-validates, inserts nights, creates hold (30 min), creates Stripe Checkout session, returns checkout URL |
| POST `api/stripe_webhook.php` | Stripe | verifies signature on the raw body, matches amount/currency/hold, converts hold → reservation, nights hold → booked, emails guest and owner |
| GET  `api/reservation.php?ref=&email=` | guest | status for the confirmation page (polls until webhook lands) |
| POST `api/auth/request_code.php` | anyone | emails a 6-digit code (10 min, 5 attempts, 3 sends per hour per email) |
| POST `api/auth/verify.php` | anyone | sets an HttpOnly Secure SameSite=Lax session cookie |
| POST `api/auth/signout.php` | signed in | ends the session |
| GET  `api/me.php` | signed in | name, email, role, my reservations |
| GET/POST `api/admin/rates.php`, `blocks.php`, `reservations.php`, `refund.php` | owner only | owner tools; every call re-checks the session role on the server |
| GET  `api/cron/expire_holds.php?key=` | Hostinger cron | releases expired holds (also expires the Stripe session) |

Guest checkout needs no account: name and email are collected on the hold step. When that
email later signs in, its reservations appear under "Your account".

## 4. Guest flow on the site

1. Rates section: pick nights (existing calendar, now fed by `calendar.php`). Estimate box
   becomes a real quote from `quote.php` with the exact all-in total.
2. "Reserve and pay" opens a small panel: name, email, phone (optional), agree to terms and
   cancellation policy. Submit → `hold.php` → redirect to Stripe Checkout.
3. Stripe success → `booking.html?ref=SD-7K3M` which shows "Confirming…" then the booking
   once the webhook has landed (normally within seconds). Cancel or timeout → back to rates,
   hold released.
4. Emails: guest confirmation with dates, total, address, check-in notes; owner notice.

## 5. Owner flow

- `admin/` keeps its look; the passcode gate is replaced by owner sign-in (email code).
- Rates and blocks: same CSV upload and block-days calendar, now saved to MySQL.
- Reservations list: dates, guest, total, status; cancel with full or partial refund through
  Stripe; every action written to `audit_log`.

## 6. Sessions (build order)

| session | deliverable | done when |
|---|---|---|
| 1 | schema, `lib.php`, `calendar.php`, `quote.php`, `hold.php` (without Stripe), nights concurrency, local SQLite harness, test script that fires 20 parallel holds for the same nights and gets exactly one success | tests pass locally |
| 2 | Stripe Checkout + webhook + `booking.html` + emails + cron expiry | a test-card booking confirms end to end locally with Stripe CLI |
| 3 | email-code sign-in, sessions, account page, reservations under account, demo localStorage users retired | sign in on two browsers, sign out, code limits enforced |
| 4 | owner admin on MySQL: rates, blocks, reservations, refund, audit log | owner can block dates, change a rate, refund a test booking |
| 5 | deploy to a Hostinger staging subdomain, `.env`, SMTP, cron, Stripe live keys, security pass (headers, rate limits, CSP, backups), QA checklist from the spec §15 | checklist evidence recorded in docs/QA_BOOKING.md |
| 6 | launch on the real domain, first real booking watched | first booking confirmed and emailed |

## 7. What the owner must provide (blocking for the session noted)

| item | needed by |
|---|---|
| Real nightly rates and minimum stays per season (data/rates.csv format) | session 1 |
| Cleaning fee and the tax rate to charge (Florida + Okaloosa County, confirm the combined percentage) | session 1 |
| Cancellation policy text (for terms.html and the checkout checkbox) | session 2 |
| A Stripe account (free; owner creates it, Claude only ever sees test keys) | session 2 |
| Hostinger Business plan purchased, domain pointed, one mailbox (for example stay@) | session 5 |
| Confirmation of the address 1040 Highway 98 East #203 | session 2 |

## 8. Not in this build (deliberately)

Google and Microsoft sign-in, iCal import and export, Airbnb and Vrbo sync, natural-language
search and match scores, bidding, multi-owner roles, modifications by the guest, charts.
Each is a later item once the first bookings have run.

## 9. Local development (set up 2026-11-07)

- Portable PHP 8.3 lives at `C:\dev\tools\php\php.exe` (outside the repo; pdo_sqlite, pdo_mysql, mbstring, curl, openssl enabled). The download zip is in `C:\dev\tools\php_download`.
- The local database is `var/sdo.sqlite` (ignored by git). Commands, from the repo root:

```
C:\dev\tools\php\php.exe api\cli.php migrate
C:\dev\tools\php\php.exe api\cli.php seed
C:\dev\tools\php\php.exe -S 127.0.0.1:8766 -t .        (site + API together; Python server.bat has no PHP)
set PHP=C:\dev\tools\php\php.exe && python tests\concurrency_test.py 20
```

- Session 1 result: migrate and seed OK; 20 simultaneous holds → 1 success, 19 refused (PASS); the site shows the server quote with "All-in total, taxes included" when served through PHP, and falls back to the CSV files on a static server.
