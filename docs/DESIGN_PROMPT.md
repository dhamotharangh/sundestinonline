# SunDestin Online — Design Prompt

The brief behind the site. Reuse it for the next property or the next owner site: change §2 and §8, keep the rest.
Written 2026-11-06 after the owner's approval of the wireframe and the Emerald Coast palette.

---

## 1. Purpose

Build an **independent, owner-run promotional website** for one beachfront condo (SunDestin #203, Destin FL), ready to hold up to four or five sister units. The site exists for **digital promotion**: rank on Google for the property and the complex, look right when the link is shared on social or by text, and turn a visitor into a **direct inquiry to the owner**.

It is the single-property expression of the Owner Vacation Rentals thesis ("Own your booking. Keep more of it."). Here that becomes one guest-facing promise, and it is the headline of the page:

> **No platform fee.** Just you and the Gulf.

It is **not** a booking engine, a marketplace, or the Tornado/SQLite portal described in `docs/Portal Specs - SunDestinOnline.txt`. Availability, payment and channel sync are a later phase (see §10).

## 2. Audience and job to be done

Families and couples planning a Destin beach week, most of them on a phone, arriving from Google, a Facebook group, a text from a friend, or a QR code on the owner's flyer. Their questions, in order: *Is the view real? Where exactly is it? What does it sleep? What does it cost? How do I ask?* The page answers them in that order and nothing else.

## 3. Style

- **Modern, contemporary, new-age.** Minimal words, big tiles, generous air. Photos do the talking.
- **Clean and neat photos.** No text over photographs, no gradients, no overlays. The hero photo is an untouched rounded tile beside the headline, not a background under it.
- **One typeface**, Inter, weights 400 to 700. Headlines are six to eight words. Body copy appears only in the description and the FAQ.
- **Flat colour, one accent.** The accent is used for the single call to action, the kicker labels and icons. Nothing else is coloured.
- **Rounded everything.** 20px tiles, 12px inner cards, pill buttons and chips. Soft shadow only on the hero tile.
- **Calm motion.** Tiles fade up on scroll, images zoom 4% on hover, lightbox transitions under 250ms. Honour `prefers-reduced-motion`.
- **Easy to navigate.** One sticky bar with four words and one button. Every link scrolls; no dropdowns, no second-level pages. On phones the "Check dates" button is pinned to the bottom of the screen.

## 4. Colour: Emerald Coast (default theme)

Taken from the water in the owner's photos. Blue-green only; no orange or red anywhere, including the season band.

| Token | Hex | Use |
|---|---|---|
| Gulf deep | `#0E3A5B` | headlines, footer, holiday season |
| Emerald water | `#0FA3A3` | **the accent**: buttons, kickers, icons, shoulder season |
| Lagoon | `#1D7FA8` | links, peak season |
| Sea foam | `#CFEFEA` | tinted tiles, chips, book panel |
| Sky wash | `#E3F2FA` | alternate tiles |
| Sugar sand | `#F7F3EA` | section surfaces |
| Haze | `#9AB7C9` | off-season |

Three alternates ship in the theme dropdown and must stay within the same grammar (one accent, two tile tints, one surface): **Deep Gulf** (lagoon accent), **Sunset sand** (warm accent for an evening campaign), **Night swim** (dark). The visitor's choice is remembered in the browser.

## 5. Page structure (home)

1. **Top bar**: logo, Photos · The condo · Rates · Map · FAQ · All properties, theme dropdown, "Check dates".
2. **Hero**: badge "Book direct with the owner", H1 "No platform fee. / Just you and the Gulf.", one-sentence sub, fact chips (1 bedroom · 1 bath · Sleeps 6 · 2nd floor · beachfront), two buttons, clean photo tile.
3. **Why book direct**: three tinted tiles. No platform fee · Talk to the owner · One clear policy.
4. **Photos**: tag filters, bento grid of six tiles plus "+12 more", full-screen lightbox with keyboard and swipe.
5. **The condo**: the owner's professional description beside a facts card (beds, floor, view, address).
6. **Amenities**: sixteen icon tiles, two or three words each.
7. **Rates**: "From $149 a night", twelve-month season band with legend, season table, quick estimate (dates → nights, fees, tax, total, minimum-stay hint).
8. **Location**: embedded map tile and a list of nearby places with distances.
9. **What guests say**: review tiles from data; an honest empty state until real reviews exist. Never invented.
10. **Book direct**: inquiry form (name, email, dates, guests, note) that opens the visitor's email app with a pre-filled message. Owner contact lines.
11. **FAQ**: six expandable questions.
12. **Footer**: tagline, links, "Who you book with" statement.

**All properties** page: card grid built from the same data file, one card per property.

## 6. Content rules

- **No copy in HTML.** Every word lives in `data/site.js` (site-wide) or `data/properties.js` (per property). HTML holds `data-t` text slots and `data-block` list slots. Sections can be cut and pasted into a new order.
- Page `<title>`, meta description and social preview tags stay in the HTML head so crawlers read them before JavaScript runs.
- Sentence case. No exclamation marks. No "simply", "seamless", "unlock".
- Rates, fees and taxes are placeholders until the owner confirms them; the note under the table says so.
- No fabricated reviews, distances or amenities. Distances are "about N mi".
- Photo alt text describes what is in the picture, for Google and for screen readers.

## 7. Promotion plumbing

- Canonical URL, Open Graph and Twitter card tags, schema.org `VacationRental` JSON-LD, `robots.txt`, `sitemap.xml`.
- Hero image loaded eagerly with `fetchpriority="high"`; every other photo lazy.
- No frameworks, no build step, one CSS file, one JS file. Hostable on Render Static Site (free tier), Cloudflare Pages, Netlify or GitHub Pages. Droppable into a Tornado `static/` folder unchanged.

## 8. Property inputs the owner supplies

| Input | Where | Status |
|---|---|---|
| Nightly rates by season, minimum stays | `data/properties.js › seasons` | sample values, to confirm |
| Cleaning fee, tax rate | `data/properties.js › fees` | sample values, to confirm |
| Owner email, phone, WhatsApp | `data/properties.js › contact` | placeholder address |
| Airbnb / Vrbo review links | `data/properties.js › reviewLinks` | empty |
| Real reviews | `data/properties.js › reviews` | empty |
| Photos | `images/` + `data/properties.js › photos` | 18 supplied |

## 9. What was reused from OVR, what was not

**Reused**: the Google-clean philosophy (white surfaces, one accent, no gradients on functional UI), pure HTML/CSS/JS with no build step, the chip/card/pill grammar, the footer's "Who you book with" responsibility line, the book-direct message.
**Not reused**: OVR's Google-blue palette and Google Sans, the search/results/bids/deals machinery, the status pill and fixed nav frame, the orange/red semantic colours.

## 10. Out of scope (next phases)

- Live availability calendar, online payment, Airbnb/Vrbo calendar sync. Options: embed OwnerRez or Hospitable widgets in the Rates section, or build the Supabase + Stripe reservation backend described in `docs/Website specs 2b.pdf`.
- Owner dashboard, roles, database, QA sign-off process: `docs/Portal Specs - SunDestinOnline.txt`.
- Terms and Privacy pages (footer links are placeholders).

## 11. The prompt in one paragraph

> Design a modern, minimal, phone-first promotional website for one owner-run beachfront condo in Destin FL, extendable to five. Big rounded photo tiles, almost no words, one emerald-water accent on a white and sand page with Gulf-blue headlines. Headline "No platform fee. Just you and the Gulf." Sections in decision order: hero, why book direct, photos, the condo, amenities, rates with a season band and estimate, map, reviews, inquiry form, FAQ, footer. All copy in data files, not HTML. SEO and social tags, structured data, no frameworks, no build step. Never invent reviews or prices; mark placeholders.
