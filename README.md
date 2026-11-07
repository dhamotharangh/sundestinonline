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
| `data/site.js` | **Every site-wide word**: nav, hero, section titles, form labels, footer, themes. |
| `data/properties.js` | **Every property**: name, headline, description, facts, photos + captions, amenities, seasons and rates, fees, nearby places, reviews, FAQ, contact. |
| `css/site.css` | Tokens (four colour themes), layout, components. |
| `js/site.js` | Fills the slots, gallery and lightbox, rates estimate, map, inquiry email, theme dropdown. |
| `images/` | Photos. `images/archive_photos/` is excluded from search engines. |
| `docs/DESIGN_PROMPT.md` | The design brief behind the site. |
| `robots.txt`, `sitemap.xml` | Search-engine files. |

## Edit text

Open `data/site.js` or `data/properties.js`, change the string, reload. Keep the keys. `{name}` inside a site string is replaced with the property name.

## Add a property

Copy the object in `data/properties.js`, change `id`, `name`, photos and the rest, set `featured: false`. It appears on `properties.html`; `index.html?p=<id>` shows it on the home layout.

## Change the asset version

After editing CSS or JS, bump `?v=3` in the two HTML files so browsers fetch the new file.

## Before launch

- Replace sample rates, minimum stays, cleaning fee and tax rate in `data/properties.js › seasons` and `fees`.
- Set the owner's real email (and phone / WhatsApp if wanted) in `data/properties.js › contact`.
- Add review links or real reviews.
- Point `Terms` and `Privacy` footer links at real pages.
- Deploy to a static host (Render Static Site, Cloudflare Pages, Netlify, GitHub Pages) with the custom domain `sundestinonline.com`.
