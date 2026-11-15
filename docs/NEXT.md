# Handoff 2026-11-15 (end of day)

State: everything is committed and pushed to main (last commit e19d056). Live at https://ownervacation.rentals.

Done today, in order: Laketown Wharf #815 added (second property, `?p=laketown_815`); rebrand to Owner Vacation Rentals; combined home = two-card list; header order logo, Destin|PCB pill, EN|ES, menu, theme, Login, Check dates; domain switched to ownervacation.rentals; per-domain `hosts` map (dormant); Laketown copy says the beach is "just across the street" (owner: never "a short walk"); Laketown contact laketown815@gmail.com; header menu trimmed to Rates, Contact.

Owner's open steps in Cloudflare (Claude cannot sign in there: Turnstile blocks the browser pane, Chrome extension never connects):
1. sundestinonline.com zone (now on Cloudflare nameservers, currently GitHub 404): Rules > Redirect Rules > All incoming requests > static 301 to https://ownervacation.rentals/?p=sundestin_203.
2. ownervacation.rentals zone: www row must be CNAME dhamotharangh.github.io (522 while the old A row remains).
laketown815.com already 301s to https://ownervacation.rentals/?p=laketown_815.

Still open on the site: Laketown rates/fees are SAMPLE values; admin passcode is still the demo one and admin is linked from the footer; booking API host not chosen (Namecheap Stellar vs Hostinger); Laketown photos uncompressed (~1 MB each); Worker (`docs/cloudflare/worker_laketown815.js`) deferred by owner choice.

# Domain switch 2026-11-15: GitHub Pages now serves ownervacation.rentals

CNAME, canonical links, sitemap, robots and `brand.domain` moved to ownervacation.rentals. Cloudflare DNS for that zone: four GitHub A records on @ and www (owner added them, still PROXIED; GitHub's own certificate needs them DNS-only, or keep the proxy with Cloudflare SSL mode Full). Per-domain behaviour lives in `data/site_text.js` `hosts`: sundestinonline.com opens Destin as "SunDestin Online", laketown815.com opens Laketown as "Laketown Wharf 815", any other host opens the combined list as "Owner Vacation Rentals". Owner decision 2026-11-15 evening: keep it simple with Cloudflare Redirect Rules (301), not the Worker. laketown815.com -> https://ownervacation.rentals/?p=laketown_815 is live. sundestinonline.com moved to Cloudflare nameservers; its rule -> https://ownervacation.rentals/?p=sundestin_203 is the owner's next step. Consequence: the per-domain brands in `hosts` and the cross-domain pill link (commit 8223695) stay dormant until a Worker (`docs/cloudflare/worker_laketown815.js`) is deployed; nothing on the site changes either way. Still open: www.ownervacation.rentals must be CNAME dhamotharangh.github.io (522 while an A row remains).

# Built 2026-11-15: Laketown Wharf #815 is on the site

`index.html?p=laketown_815` renders the second property (data: `laketown_815` in `data/properties.js` and `data/properties_es.js`, 19 of the owner's 45 photos in `images/laketown_wharf/`, sample rate and availability rows in the CSVs). Header pill Destin | PCB (`B.site_prop`, same CSS as the EN | ES pill, `place` field per property). A property may override site-level copy through `site: { hero, location }`; anchor links from other pages keep `?p=`. Facts (1 BR, 2 BA, sleeps 6, king + twin bunks + queen sleeper, 8th floor, washer/dryer) come from the Sail Away Rentals listing of unit 0815; rates are SAMPLE values ($139/$199/$279/$319), the resort parking fee and cleaning fee are unconfirmed. Not done: rebrand to ownervacation.rentals, host choice, the 26 unused photos and the three zips stay untracked.

# Decisions 2026-11-14 (evening): second property, one brand, one host

**Second property: Laketown Wharf, Unit 815 (Panama City Beach)** joins THIS repo as a second object in `data/properties.js` (id `laketown_815`, plus `data/properties_es.js`, rows in `rates.csv` / `availability.csv`, photos in `images/laketown_wharf/`). No separate folder or repo: the site already renders any property via `index.html?p=<id>` and `properties.html` lists them all. Owner wants it "like laketown815.com"; the photo source is NOT yet named, and facts (beds, sleeps, floor, view, address) and rates are still needed.

**One brand: ownervacation.rentals** (being bought at Namecheap). Rebrand the ~35 literal "SunDestin Online" mentions (page titles, footers, Terms, Privacy, ES text) and `brand` in `data/site_text.js`. Bare URL lands on the two-property list.

**Header pill "Destin | PCB"** flips between the two property pages: same component as the EN | ES toggle (`B.site_lang` in `js/site_app.js`, `.site_lang` CSS), one button per property linking to its `?p=` page, label from a new one-word `place` field per property. About 8 lines of JS, no new CSS.

**Domains:** sundestinonline.com and laketown815.com stay independent names, same look and feel. Two ways, owner to pick with the host:
- GitHub Pages (one custom domain per repo): CNAME becomes ownervacation.rentals; the two old domains 301-forward at the registrar to `/?p=sundestin_203` and `/?p=laketown_815` (address bar changes; HTTPS on the old names needs Cloudflare free or similar).
- Namecheap Stellar shared hosting (free trial offered in the cart, then ~$5.88/mo; renewal price to check): PHP 8 + MySQL + cron + AutoSSL + cPanel Git deploy, 3 websites. All three domains point at the same folder, each keeps its own address bar, a hostname check picks the default property. ALSO runs the booking API in `api/` that GitHub Pages cannot, so it replaces the Hostinger Business plan above. Recommended; owner has not yet confirmed.

**Order when switching host or domain:** new domain live and verified first, then CNAME/DNS change, then forwards, so sundestinonline.com is never dark. Google Search Console change-of-address after the 301s.

---

# Handoff 2026-11-14: the site is LIVE as a brochure

**Live at https://sundestinonline.com/ on GitHub Pages** (repo `dhamotharangh/sundestinonline`, now PUBLIC, branch `main`, root folder; every push redeploys in about a minute). The `CNAME` file in the repo root holds the custom domain: do not delete it.

**DNS** is at Squarespace Domains (nameservers `ns-cloud-c*.googledomains.com`): four A records `@` to 185.199.108-111.153, CNAME `www` to `dhamotharangh.github.io`. Email-forwarding MX/SPF (mailgun), the Google and Microsoft verification records and `smtp._domainkey` were left untouched. The old Squarespace website plan is expired and not needed.

**What works on the live site (static, no PHP):** photos, rates and calendar from `data/*.csv`, map, EN/ES on every page including Terms and Privacy. Reserve and Pay opens a panel (first name, last name, phone, email); with no API the button reads "Email the owner" and opens a prefilled email to the owner. No hold, no payment.

**What does not run on GitHub Pages:** everything in `api/` (calendar, quote, hold, Stripe Checkout, webhook, cron). The booking plan in `docs/BOOKING_PLAN.md` still needs a PHP + MySQL host (Hostinger Business); when that is bought, point the same domain there.

**Done this session:** owner contact `sundestinonline@gmail.com` and phone in `data/properties.js`; account deletion is a quiet "email the admin" link; cancellation terms reworded (60+ days full refund, 30 to 59 days 50%, inside 30 days none); Spanish bodies for `terms.html` and `privacy.html` (`.only_en` / `.only_es` blocks, one CSS rule); Spanish short messages through `msgs` in `data/site_text_es.js` and `SDO_tr()`; asset version is `?v=48`.

**Privacy state of the public repo:** no secrets in files or history. The owner's working docs were untracked on 2026-11-14 (commit 10eb9da) but remain in older commits, as does the owner's personal Gmail as author of the first 53 commits. Commits now use the GitHub no-reply address `50078545+dhamotharangh@users.noreply.github.com`. Working copies under `docs/` stay untracked.

**Open items**
- Confirm "Enforce HTTPS" is ticked in the repo's Pages settings (HTTPS already answers).
- Real rates, cleaning fee, tax rate, reviews: still sample values, and now public.
- Payment terms in `terms.html` are still a bracketed placeholder (EN and ES).
- `booking.html` and `js/booking.js` are English only; they are reached only after a Stripe payment.
- `/admin/` demo page is public with a readable demo passcode; browser-only, change before a real admin exists.
- A relay service would let the form send email without opening the guest's mail app; not added, needs the owner's say-so.
- Photos in `images/avari_20261111` are committed but not yet used by the gallery; `images/laketown_wharf` and `images/vacasa-1010902` are untracked.

---

# Where things stand (updated 2026-11-07, end of session)

**Live on GitHub (dhamotharangh/sundestinonline, branch main), local preview `.\server.bat -start` → http://127.0.0.1:8765/**

Built so far: static site with all copy in data files (EN in `site_text.js` / `properties.js`, ES in `site_text_es.js` / `properties_es.js`, EN/ES switch in header), four colour themes (dropdown in header on desktop, footer on phones), hero "Step onto the beach. Watch kids in sight.", eight-tile gallery with viewer, condo text, three amenity groups, rates from `data/rates.csv` with package cards and a two-month click-or-drag calendar (check-in to check-out highlighted inclusive, booked nights hatched) reading `data/availability.csv`, Guests/Children selectors, OpenStreetMap with numbered pins and two-way hover, guest reviews (add/edit, demo), inquiry by email, FAQ, Terms and Privacy pages, demo `register.html`, demo owner tools at `/admin/` (passcode `admin.demo_passcode`), CSP and Hostinger `.htaccess`, `check_pages.ps1` smoke test.

**Owner inputs still needed:** real rates/min stays (`data/rates.csv`), real blocked dates (`data/availability.csv`), cleaning fee + tax (`data/properties.js › fees`), owner email, review links, Terms placeholders, new admin passcode, map pin coordinates check.

**Decided path:** Hostinger Premium now (Git deploy, password-protect `/admin/`), OwnerRez (~$40/mo, no booking fee) when bookings justify instant reservation + card payment; alternative is a PHP + MySQL backend on Hostinger replacing `js/site_store.js`. Rejected: Supabase, Guesty, Hospitable, Squarespace, GoDaddy.

**Owner working style:** explain and wait for "approve" before building; sends screenshots with numbered fixes; wants exact wording kept (e.g. "Watch kids in sight.").

---

# Where things stand (updated 2026-11-07)

**Decided path (owner, 2026-11-07):**
1. Hostinger Premium, Git deploy from GitHub, site live with the demo owner tools at `/admin/` (password-protect the folder in hPanel). No new monthly cost.
2. Real rates, fees, contact email, reviews; then promotion (Google Business Profile, QR flyer, Airbnb/Vrbo listings pointing to "book direct").
3. **Superseded 2026-11-07 (owner: "approve B").** No Airbnb/Vrbo listing, so OwnerRez is dropped. Booking is built in-house: PHP + MySQL on Hostinger Business plus Stripe Checkout, replacing `js/site_store.js`. Full plan, tables, endpoints, session order and owner inputs in `docs/BOOKING_PLAN.md`.

**Not chosen:** Supabase (second host), Guesty (3-listing cap, then quote-only), Hospitable (7% on direct bookings), Squarespace (cannot run this site), GoDaddy (no advantage over Hostinger).

**Before launch:** replace sample rows in `data/rates.csv` and `data/availability.csv`; set fees and contact in `data/properties.js`; review `terms.html` placeholders and `privacy.html`; change `admin.demo_passcode` in `data/site_text.js`; two-factor on Hostinger, GitHub and the domain registrar.

---

# Where to pick up (saved 2026-11-06)

Done 2026-11-07: naming scheme, slim menu with phone bottom bar, trimmed hero, two-month drag calendar with packages, grouped amenities, Beachfront wording. Earlier direction kept for reference: **simpler and more impactful**, like
`docs/reference/simple-layout-reference.webp` (the ChatGPT property-page wireframe):

1. One big clean photo at the top: `images/kitchen_wide.jpg` (kitchen through to the Gulf, owner picked it 2026-11-06 as "wide and impressive"), full width, fact chips under it.
2. A single row of plain text links: Overview · Amenities · Photos · Reviews · House rules.
3. One block, "Check availability & reserve": availability calendar on the left,
   reservation summary on the right (nights x rate, cleaning fee, taxes, total),
   one button. Legend: Selected / Unavailable.
4. Far fewer sections and words than the current home page.

Keep: data-file placeholders, CSV rates and availability, calendar logic, themes, GitHub to Hostinger deploy.
Then decide the add-ons in order: email form endpoint, iCal calendar sync, AI chat, voice agent.

State: two commits on main, no GitHub remote yet. Rates, fees, contact email and reviews are still sample values.
