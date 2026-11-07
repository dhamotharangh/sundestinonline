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
  signin_link: "Sign in", account_link: "Hi, {user}",
  theme_label: "Theme",
  themes: [["emerald_water", "Emerald water"], ["deep_gulf", "Deep Gulf"], ["sunset_sand", "Sunset sand"], ["night_swim", "Night swim"]],

  hero: {
    title: "Step onto the beach.",
    title2: "Watch kids in sight.",
    sub: "Your balcony sits right over the pool and the sand, so you watch the kids from your chair. A 2nd-floor beachfront condo at Sun Destin Beach Resort, Destin FL. Sleeps 6.",
    sub_strong: "Door to the sand in under a minute.",
    cta: "Check dates",
    /* one quiet line under the photo, instead of three tiles */
    line: ["No platform fee", "Book direct with the owner", "The price you see is the price you pay"]
  },

  gallery:   { kicker: "Photos", title: "Every room, every view", lead: "", all_label: "All", see_all: "See all {n} photos" },
  condo:     { kicker: "The condo", fact_labels: { bedrooms: "Bedrooms", bathrooms: "Bathrooms", sleeps: "Sleeps", floor: "Floor", view: "View", complex: "Resort", beds: "Beds", address: "Address" } },
  amenities: { kicker: "Amenities", title: "Everything a beach week needs" },
  rates:     { kicker: "Rates and dates", title_prefix: "From", title_suffix: "a night",
               packages_title: "Pick a week", packages_hint: "Tap a package and the calendar jumps to it. Prices include cleaning, before tax.",
               nights_word: "nights", from_word: "from",
               calendar_title: "Choose your nights", calendar_hint: "Click the first night, then the last. Drag works too.",
               guests_label: "Guests", children_label: "Children",
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
               empty: "Guest reviews are on their way to this page.", empty_links: "Until then, read them on", empty_no_links: "Ask the owner for references when you inquire.",
               add_btn: "Add your review", edit_btn: "Edit your review", signin_hint: "Register or sign in to leave a review.", signin_link: "Your account",
               form_title: "Your review", stars_label: "Stars", text_label: "What was the stay like?", when_label: "When did you stay? (optional)", save_btn: "Save review", cancel_btn: "Cancel", delete_btn: "Delete my review",
               saved: "Thank you. Your review is on the page (demo: this browser only).", demo_tag: "Demo review", prev: "Previous reviews", next: "More reviews" },
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
    links: [["Photos", "#gallery"], ["Rates", "#rates"], ["Map", "#location"], ["FAQ", "#faq"], ["All properties", "properties.html"], ["Your account", "register.html"], ["Terms", "terms.html"], ["Privacy", "privacy.html"]],
    legal_lead: "Book direct with Owner. No platform fee:",
    legal: "every reservation, payment, cancellation and refund is a direct agreement between you and the property owner. SunDestin Online is the owner's own website, not a marketplace or agent.",
    copyright: "SunDestin Online"
  },

  /* register.html + admin.html (demo: browser storage only) */
  account: { kicker: "Guests", title: "Your account", lead: "Register once and your details are ready for every inquiry. Demo: stored in this browser only.",
             consent: "We keep only your name and email, and only the owner sees them. Delete your account here at any time.",
             signup_title: "Register", signin_title: "Sign in", name: "Name", email: "Email", password: "Password", password_hint: "At least 8 characters",
             signup_btn: "Create account", signin_btn: "Sign in", signout_btn: "Sign out", delete_btn: "Delete my account",
             hello: "Hello, {user}", since: "Registered {date}", switch_in: "Already registered? Sign in", switch_up: "New here? Register" },
  admin:   { demo_passcode: "sundestin", kicker: "Owner", title: "Edit the site", lead: "Change the text, upload rates and availability, and block days on the calendar. Demo: changes live in this browser only; use Export to publish them through GitHub.",
             gate_title: "Owner sign-in", gate_label: "Passcode", gate_btn: "Open", gate_error: "Wrong passcode.",
             text_title: "Text", headline: "Condo headline", subhead: "Sub-line", description: "Description (one paragraph per line)",
             rates_title: "Rates CSV", availability_title: "Availability CSV", calendar_title: "Block or unblock days", calendar_hint: "Click a day to toggle it. Blocked days show hatched.",
             save_btn: "Save", saved: "Saved. Open the site to see it.", export_btn: "Export files", reset_btn: "Discard changes", reset_done: "Changes discarded. The site shows the published files again.",
             signout_btn: "Close owner tools" },
  /* properties.html */
  list: { kicker: "Properties", title: "Owner-run condos on the Destin beach", lead: "Each one is booked directly with its owner. Pick a condo to see photos, rates and the map.", from: "from", per_night: "/ night" }
};
