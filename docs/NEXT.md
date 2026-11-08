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
