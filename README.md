# SunDestin Online

Owner-run promotional website for SunDestin #203 (Destin, FL), built to hold up to a few sister units. Static HTML, CSS and vanilla JavaScript. No framework, no build step.

## Run locally

```bash
python -m http.server 8765 --bind 127.0.0.1
```

Open http://127.0.0.1:8765/. (Opening `index.html` straight from the file system also works, except the embedded map.)

## Where things live

| Path | What |
|---|---|
| `index.html` | Home page layout. No copy inside: text slots only. |
| `properties.html` | Card list of every property. |
| `data/site_text.js` | **Every site-wide word**: nav, hero, section titles, form labels, footer, themes. |
| `data/properties.js` | **Every property**: name, headline, description, facts, photos + captions, amenities, fallback seasons, fees, nearby places, reviews, FAQ, contact. |
| `data/rates.csv` | **Nightly rates by date range** (`property_id,start,end,season,label,nightly,min_nights`). Read by the site at load. |
| `data/availability.csv` | **Booked and blocked dates** (`property_id,checkin,checkout,status,note`). Drives the calendar and the estimate. |
| `rates_upload.html` | Owner tool: upload a CSV, validate it, preview it on the site, download a cleaned copy. Not indexed. |
| `js/csv.js` | CSV parser and validators shared by the site and the upload page. |
| `.htaccess` | Hostinger/Apache: HTTPS redirect, security headers, caching, blocks `/.git`. |
| `docs/DEPLOY.md` | GitHub → Hostinger (or Render/Cloudflare/Netlify) deployment steps. |
| `css/site_style.css` | Tokens (four colour themes), layout, components. |
| `js/site_app.js` | Fills the slots, gallery and lightbox, rates estimate, map, inquiry email, theme dropdown. |
| `images/` | Photos. `images/archive_photos/` is excluded from search engines. |
| `docs/DESIGN_PROMPT.md` | The design brief behind the site. |
| `robots.txt`, `sitemap.xml` | Search-engine files. |

## Naming

Every object has a logical snake_case name, object first then part: `gallery_tile`, `quote_calendar`, `inquiry_form`, `kitchen_wide.jpg`. The same name is the HTML id, the CSS class and the data key.

## Edit text

Open `data/site_text.js` or `data/properties.js`, change the string, reload. Keep the keys. `{name}` inside a site string is replaced with the property name.

## Add a property

Copy the object in `data/properties.js`, change `id`, `name`, photos and the rest, set `featured: false`. It appears on `properties.html`; `index.html?p=<id>` shows it on the home layout.

## Update rates or availability

Edit `data/rates.csv` / `data/availability.csv` and commit. To check a file first, open `rates_upload.html`, pick the CSV, read the validation result, click "Preview on the site" (this browser only), then commit the file. Rates: one row per date range, both dates inclusive. Availability: check-out is the departure day and is not blocked.

## Change the asset version

After editing CSS or JS, bump `?v=5` in index.html, properties.html and rates_upload.html so browsers fetch the new file.

## Before launch

- Replace the sample rows in `data/rates.csv` and `data/availability.csv`; set cleaning fee and tax rate in `data/properties.js › fees`.
- Set the owner's real email (and phone / WhatsApp if wanted) in `data/properties.js › contact`.
- Add review links or real reviews.
- Point `Terms` and `Privacy` footer links at real pages.
- Deploy to a static host (Render Static Site, Cloudflare Pages, Netlify, GitHub Pages) with the custom domain `sundestinonline.com`.
