# Deploying SunDestin Online from GitHub

The site is static files only. Deployment means "copy the repository to a web folder". Two ways are set up for.

## A. Hostinger Premium (hPanel → Git)

Hostinger shared plans, Premium included, have a built-in Git deployment: hPanel → Websites → Manage → **Advanced → GIT**. It clones a repository into a folder of your site and can re-pull on every push through a webhook.

1. Push this repository to GitHub (see "First push" below).
2. hPanel → Advanced → GIT → **Create a new repository**.
   - Repository: the GitHub HTTPS URL (public repo) or SSH URL (private repo; hPanel shows a deploy key to add under GitHub → repo → Settings → Deploy keys).
   - Branch: `main`.
   - Install path: leave empty to deploy into `public_html`.
3. Click **Deploy**. The files land in `public_html`, `.htaccess` included.
4. Copy the **webhook URL** hPanel shows and add it on GitHub → repo → Settings → Webhooks (content type `application/json`, "Just the push event"). From then on every commit to `main` redeploys automatically.
5. Protect the owner tools: hPanel → Advanced → **Password Protect Directories**, choose `public_html/admin`, set a user and password. The server then asks for them before `/admin/` loads. Nothing on the site links to that folder.
6. Point the domain `sundestinonline.com` at the Hostinger site (hPanel → Domains) and turn on the free SSL (hPanel → Security → SSL). `.htaccess` then forces HTTPS.

**Is this safe?** Yes, for this site:
- The repository holds no secrets: no API keys, no passwords, no guest data. The inquiry form opens the visitor's email app; nothing is stored on the server.
- `.htaccess` blocks `/.git` so the repository metadata cannot be read through the web, and sets the usual security headers.
- The only write path to the live site is a commit to `main`. Protect the GitHub account with two-factor authentication and keep the repository private if you prefer (then use the SSH deploy key).
- What Hostinger shared hosting cannot do is run a backend. The moment you add online payment, calendar sync or an AI agent, that code runs elsewhere (a serverless function or small service) and the static site only talks to it. See `docs/DESIGN_PROMPT.md` §10.

## B. Render, Cloudflare Pages, Netlify, GitHub Pages

Connect the repository, build command empty, publish directory `/`. `.htaccess` is ignored there; the equivalent headers are set in the host's dashboard.

## First push

```bash
git remote add origin https://github.com/<your-account>/sundestinonline.git
```

```bash
git push -u origin main
```

## Day-to-day

- Change text: edit `data/site.js` or `data/properties.js`, commit.
- Change rates or availability: edit `data/rates.csv` or `data/availability.csv` in GitHub's web editor and commit, or use `admin.html` on the live site to validate and preview a CSV first.
- Change CSS or JS: bump the `?v=` number in `index.html`, `properties.html` and `admin.html`.

## What `.gitignore` keeps out

`images/archive_photos/` (raw downloads and duplicates, never deployed) and `.claude/` (local tooling).
