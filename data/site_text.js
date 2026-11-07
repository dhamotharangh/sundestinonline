/* SunDestin Online — SITE-LEVEL TEXT PLACEHOLDERS.
   Every word that is not about one specific property lives here. Edit text freely, keep the keys.
   Keys follow the page: site.hero.*, site.gallery.*, site.condo.*, site.amenities.*, site.rates.*,
   site.location.*, site.reviews.*, site.inquiry.*, site.faq.*, site.footer.*
   {name} inside a string becomes the property's name. Property text lives in data/properties.js. */
window.SDO_SITE = {
  brand: { name: "SunDestin", accent: "Online", domain: "https://sundestinonline.com" },

  /* Slim menu: three links. On phones they sit in a bottom bar. */
  nav: [["Photos", "#gallery"], ["Rates", "#rates"], ["Contact", "#inquiry"]],
  nav_cta: "Check dates",
  theme_label: "Theme",
  themes: [["emerald_water", "Emerald water"], ["deep_gulf", "Deep Gulf"], ["sunset_sand", "Sunset sand"], ["night_swim", "Night swim"]],

  hero: {
    title: "No platform fee.",
    title2: "Just you and the Gulf.",
    sub: "The price you see is the price you pay. A 2nd-floor beachfront condo at Sun Destin Beach Resort, Destin FL. Private balcony over the pool, sleeps 6, one minute to the sand.",
    cta: "Check dates",
    /* one quiet line under the photo, instead of three tiles */
    line: ["No platform fee", "Talk to the owner", "One clear policy"]
  },

  gallery:   { kicker: "Photos", title: "Step onto the beach. Kids in sight.", lead: "The pool and the beach sit right under the balcony, so you see everything from your chair.", all_label: "All", more_label: "more photos" },
  condo:     { kicker: "The condo", fact_labels: { bedrooms: "Bedrooms", bathrooms: "Bathrooms", sleeps: "Sleeps", floor: "Floor", view: "View", complex: "Resort", beds: "Beds", address: "Address" } },
  amenities: { kicker: "Amenities", title: "Everything a beach week needs" },
  rates:     { kicker: "Rates and dates", title_prefix: "From", title_suffix: "a night",
               packages_title: "Pick a week", packages_hint: "Tap a package and the calendar jumps to it. Prices include cleaning, before tax.",
               nights_word: "nights", from_word: "from",
               calendar_title: "Choose your nights", calendar_hint: "Click the first night, then the last. Drag works too.",
               check_in: "Check-in", check_out: "Check-out", ask_cta: "Ask for these dates",
               empty_hint: "Pick check-in and check-out to see an estimate.", order_hint: "Check-out must be after check-in.",
               cleaning: "Cleaning", taxes: "Taxes",
               min_hint: "These dates usually need a {min}-night minimum. Ask anyway, the owner may make an exception.",
               booked_hint: "{n} of those nights are already booked. Try other dates.",
               no_rate_hint: "No rate is published for part of those dates yet. Ask the owner.",
               estimate_hint: "Estimate only. The owner confirms the exact quote.",
               legend_free: "Available", legend_booked: "Booked", legend_sel: "Your nights",
               csv_note: "Rates and availability come from data/rates.csv and data/availability.csv.",
               preview_note: "Previewing an uploaded CSV in this browser only. " },
  location:  { kicker: "Location", title: "On the beach, in the middle of Destin" },
  reviews:   { kicker: "Guests", title: "What guests say",
               empty: "Guest reviews are on their way to this page.", empty_links: "Until then, read them on", empty_no_links: "Ask the owner for references when you inquire." },
  inquiry:   { kicker: "Book direct", title: "Ask for your dates. Keep the fee.",
               lead: "Send the dates and the owner replies with a quote, usually within a day. You pay the owner directly.",
               labels: { name: "Name", email: "Email", checkin: "Check-in", checkout: "Check-out", guests: "Guests", message: "Anything else" },
               placeholder: "Travelling with kids, arriving late, need beach chairs…", submit: "Send inquiry",
               sent: "Your email app should open with the inquiry filled in. If it does not, write to {email}.",
               mail_subject: "Inquiry: {name} · {in} to {out}",
               mail_body: "Hello,\n\nI would like to stay at {name}.\n\nCheck-in: {in}\nCheck-out: {out}\nGuests: {guests}\n\n{message}\n\nThanks,\n{guest}\n{guestEmail}" },
  faq:       { kicker: "FAQ", title: "Good to know" },

  footer: {
    tagline: "Owner-run beachfront condos in Destin, Florida. Book direct, keep the fee.",
    links: [["Photos", "#gallery"], ["Rates", "#rates"], ["Map", "#location"], ["FAQ", "#faq"], ["All properties", "properties.html"], ["Terms", "#"], ["Privacy", "#"]],
    legal_lead: "Who you book with:",
    legal: "every reservation, payment, cancellation and refund is a direct agreement between you and the property owner. SunDestin Online is the owner's own website, not a marketplace or agent.",
    copyright: "SunDestin Online"
  },

  /* properties.html */
  list: { kicker: "Properties", title: "Owner-run condos on the Destin beach", lead: "Each one is booked directly with its owner. Pick a condo to see photos, rates and the map.", from: "from", per_night: "/ night" }
};
