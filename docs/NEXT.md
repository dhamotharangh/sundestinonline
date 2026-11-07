# Where things stand (updated 2026-11-07)

**Decided path (owner, 2026-11-07):**
1. Hostinger Premium, Git deploy from GitHub, site live with the demo owner tools at `/admin/` (password-protect the folder in hPanel). No new monthly cost.
2. Real rates, fees, contact email, reviews; then promotion (Google Business Profile, QR flyer, Airbnb/Vrbo listings pointing to "book direct").
3. When bookings justify about $40/month, add OwnerRez: live calendar synced with Airbnb/Vrbo, card payment, confirmations. Its widget replaces the CSV calendar in the Rates section; the demo admin calendar and the registration page retire. Alternative if staying one host with no tool: PHP + MySQL backend on Hostinger replacing `js/site_store.js`.

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
