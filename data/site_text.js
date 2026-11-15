/* Owner Vacation Rentals — SITE-LEVEL TEXT PLACEHOLDERS.
   Every word that is not about one specific property lives here. Edit text freely, keep the keys.
   Keys follow the page: site.hero.*, site.gallery.*, site.condo.*, site.amenities.*, site.rates.*,
   site.location.*, site.reviews.*, site.inquiry.*, site.faq.*, site.footer.*
   {name} inside a string becomes the property's name. Property text lives in data/properties.js. */
window.SDO_SITE = {
  brand: { name: "Owner Vacation", accent: "Rentals", domain: "https://ownervacation.rentals" },
  /* property domains: a bare visit opens that condo and the header carries its own name; any other host is the combined site */
  hosts: {
    "sundestinonline.com": { property: "sundestin_203", brand: { name: "SunDestin", accent: "Online" } },
    "laketown815.com":     { property: "laketown_815",  brand: { name: "Laketown Wharf", accent: "815" } }
  },

  /* Slim menu: three links. On phones they sit in a bottom bar. */
  nav: [["Contact", "#inquiry"]],
  nav_cta: "Check dates",
  signin_link: "Login", account_link: "Hi, {user}",
  theme_label: "Theme",
  themes: [["emerald_water", "Emerald water"], ["deep_gulf", "Deep Gulf"], ["sunset_sand", "Sunset sand"], ["night_swim", "Night swim"]],

  hero: {
    title: "Breathtaking beachfront views",
    title2: "from your private balcony",
    sub: "Your balcony sits right over the pool and the sand, so you watch the kids from your chair. A 2nd-floor beachfront condo at Sun Destin Beach Resort, Destin FL. Sleeps 6.",
    sub_strong: "The sand starts at your door.",
    sub2: "Wake up to the emerald-green Gulf of Mexico in this beautifully kept 2nd-floor condo. From the balcony you are close enough to hear the waves and low enough to count the umbrellas on the sugar-white sand.",
    cta: "Check dates",
    /* one quiet line under the photo, instead of three tiles */
    line: ["No Platform fee", "Book direct with the owner", "The price you see is the price you pay"]
  },

  gallery:   { kicker: "Photos", title: "Every room, every view", lead: "", all_label: "All", see_all: "See all {n} photos" },
  condo:     { kicker: "The condo", fact_labels: { bedrooms: "Bedrooms", bathrooms: "Bathrooms", sleeps: "Sleeps", floor: "Floor", view: "View", complex: "Resort", beds: "Beds", address: "Address" } },
  amenities: { kicker: "Amenities", title: "Everything a beach week needs" },
  rates:     { kicker: "Rates and dates", title_prefix: "From", title_suffix: "a night",
               packages_title: "Pick a week", packages_hint: "Tap a package and the calendar jumps to it. Prices include cleaning, before tax.",
               nights_word: "nights", from_word: "from",
               calendar_title: "Choose your nights", book_kicker: "Book direct", calendar_hint: "Click the check-in date, then the last night. Drag works too.",
               guests_label: "Guests", children_label: "Children",
               check_in: "Check-in", check_out: "Check-out", ask_cta: "Ask for these dates", reserve_cta: "Reserve and Pay",
               pick_first: "Pick your check-in and check-out first.",
               empty_hint: "Pick check-in and check-out to see an estimate.", order_hint: "Check-out must be after check-in.",
               cleaning: "Cleaning", taxes: "Taxes",
               min_hint: "These dates usually need a {min}-night minimum. Ask anyway, the owner may make an exception.",
               min_hard: "Stays are a minimum of {min} nights. Pick a later check-out.",
               booked_hint: "{n} of those nights are already booked. Try other dates.",
               no_rate_hint: "No rate is published for part of those dates yet. Ask the owner.",
               estimate_hint: "Estimate only. The owner confirms the exact quote.",
               exact_hint: "All-in total, taxes included. Live availability.",
               legend_free: "Available", legend_booked: "Booked", legend_sel: "Your nights",
               csv_note: "Rates and availability come from data/rates.csv and data/availability.csv.",
               preview_note: "Previewing an uploaded CSV in this browser only. " },
  location:  { kicker: "Location", title: "On the beach, in the middle of Destin", ring_note: "Dashed ring: {miles} miles around the condo" },
  reviews:   { kicker: "Guests", title: "What guests say",
               empty: "Guest reviews are on their way to this page.", empty_links: "Until then, read them on", empty_no_links: "Ask the owner for references when you inquire.",
               add_btn: "Add your review", edit_btn: "Edit your review", signin_hint: "Register or sign in to leave a review.", signin_link: "Your account",
               form_title: "Your review", stars_label: "Stars", text_label: "What was the stay like?", when_label: "When did you stay? (optional)", save_btn: "Save review", cancel_btn: "Cancel", delete_btn: "Delete my review",
               saved: "Thank you. Your review is on the page (demo: this browser only).", demo_tag: "Demo review", prev: "Previous reviews", next: "More reviews" },
  reserve:   { name: "First name", last: "Last name", email: "Email", phone: "Phone (optional)",
               need_email: "Please enter your first name and a valid email address.",
               submit_mail: "Email the owner", mail_opened: "Your email app opened with the request. Press send there and it reaches the owner's inbox.",
               agree: "I accept the", agree_link: "terms and cancellation policy",
               submit: "Hold these nights", cancel: "Cancel", holding: "Holding your nights…",
               held: "Your nights are held until {time}.", held_note: "Pay by card, Apple Pay, Google Pay or bank through Stripe on the next page.",
               expired: "The hold ended. Pick your dates again." },
  inquiry:   { kicker: "Questions?", title: "Ask the owner",
               lead: "A late arrival, a pet, dates the calendar shows as taken: write and the owner answers, usually within a day.",
               labels: { name: "Name", email: "Email", checkin: "Check-in", checkout: "Check-out", guests: "Guests", message: "Anything else" },
               placeholder: "Travelling with kids, arriving late, need beach chairs…", submit: "Send inquiry",
               sent: "Your email app should open with the inquiry filled in. If it does not, write to {email}.",
               mail_subject: "Inquiry: {name} · {in} to {out}",
               mail_body: "Hello,\n\nI would like to stay at {name}.\n\nCheck-in: {in}\nCheck-out: {out}\nGuests: {guests}\n\n{message}\n\nThanks,\n{guest}\n{guestEmail}" },
  faq:       { kicker: "FAQ", title: "Good to know" },

  footer: {
    tagline: "Owner-run beach condos on Florida's Gulf Coast. Book direct, keep the fee.",
    links: [["Photos", "#gallery"], ["Rates", "#rates"], ["Map", "#location"], ["FAQ", "#faq"], ["All properties", "properties.html"], ["Your account", "register.html"], ["Terms", "terms.html"], ["Privacy", "privacy.html"], ["Owner", "admin/"]],
    legal_lead: "Book direct with Owner. No platform fee:",
    legal: "every reservation, payment, cancellation and refund is a direct agreement between you and the property owner. Owner Vacation Rentals is the owner's own website, not a marketplace or agent.",
    copyright: "Owner Vacation Rentals"
  },

  /* register.html + admin.html (demo: browser storage only) */
  account: { kicker: "Guests", title: "Your account", lead: "Register once and your details are ready for every inquiry. Demo: stored in this browser only.",
             consent: "We keep only your name and email, and only the owner sees them. To delete your account, email the owner from your account page.",
             signup_title: "Create Account", signin_title: "Login", name: "Name", email: "Email", password: "Password", password_hint: "At least 8 characters",
             signup_btn: "Create account", signin_btn: "Login", signout_btn: "Sign out",
             delete_link: "Email to Admin with a request to delete your account",
             delete_subject: "Account deletion request: {email}",
             delete_body: "Hello,\n\nPlease delete my Owner Vacation Rentals account.\n\nName: {user}\nEmail: {email}\n\nThanks",
             hello: "Hello, {user}", since: "Registered {date}", switch_in: "Already registered? Sign in", switch_up: "New here? Open to register" },
  admin:   { demo_passcode: "sundestin", kicker: "Owner", title: "Edit the site", lead: "Change the text, upload rates and availability, and block days on the calendar. Demo: changes live in this browser only; use Export to publish them through GitHub.",
             gate_title: "Owner sign-in", gate_label: "Passcode", gate_btn: "Open", gate_error: "Wrong passcode.",
             text_title: "Text", headline: "Condo headline", subhead: "Sub-line", description: "Description (one paragraph per line)",
             rates_title: "Rates CSV", availability_title: "Availability CSV", calendar_title: "Block or unblock days", calendar_hint: "Click a day to toggle it. Blocked days show hatched.",
             save_btn: "Save", saved: "Saved. Open the site to see it.", export_btn: "Export files", reset_btn: "Discard changes", reset_done: "Changes discarded. The site shows the published files again.",
             signout_btn: "Close owner tools" },
  /* properties.html */
  list: { kicker: "Properties", title: "Owner-run condos on the Gulf Coast", lead: "Each one is booked directly with its owner. Pick a condo to see photos, rates and the map.", from: "from", per_night: "/ night" }
};
