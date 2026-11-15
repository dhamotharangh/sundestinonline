/* Cloudflare Worker for laketown815.com (and later sundestinonline.com).
   Serves the GitHub Pages site under this domain so the address bar keeps the name.
   The site itself picks the condo from the hostname (index.html head script), so this only proxies.
   Setup: Cloudflare dashboard > Workers & Pages > Create > paste this > Deploy,
   then Settings > Domains & Routes > add laketown815.com and www.laketown815.com.
   Free plan: 100,000 requests a day. */
const ORIGIN = "ownervacation.rentals";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    url.hostname = ORIGIN;
    const res = await fetch(url.toString(), { method: request.method, headers: request.headers, redirect: "manual" });
    // GitHub answers redirects with its own host; rewrite them back to this domain
    const loc = res.headers.get("location");
    if (loc && loc.includes(ORIGIN)) {
      const h = new Headers(res.headers);
      h.set("location", loc.replace(ORIGIN, new URL(request.url).hostname));
      return new Response(res.body, { status: res.status, headers: h });
    }
    return res;
  }
};
