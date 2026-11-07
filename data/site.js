/* SunDestin Online — SITE-LEVEL CONTENT PLACEHOLDERS.
   Every word on the page that is not about one specific property lives here.
   Edit text freely. Keep the keys. {name} inside a string is replaced with the
   featured property's name. Property-specific text (headline, description,
   facts, FAQ, rates, photos) lives in data/properties.js. */
window.SDO_SITE = {
  brand: { name: "SunDestin", accent: "Online", domain: "https://sundestinonline.com" },

  /* Top bar links: [label, href]. Section ids: #photos #condo #rates #map #faq #book */
  nav: [["Photos", "#photos"], ["The condo", "#condo"], ["Rates", "#rates"], ["Map", "#map"], ["FAQ", "#faq"], ["All properties", "properties.html"]],
  navCta: "Check dates",
  themeLabel: "Theme",
  themes: [["emerald", "Emerald water"], ["deepgulf", "Deep Gulf"], ["sunset", "Sunset sand"], ["night", "Night swim"]],

  /* Hero: the big push */
  hero: {
    badge: "Book direct with the owner",
    title: "No platform fee.",
    title2: "Just you and the Gulf.",
    sub: "The price you see is the price you pay. A 2nd-floor Gulf-front condo at Sun Destin, Destin FL, with a private balcony over the beachside pool, sleeps 6, one minute to the sand.",
    cta1: "Check dates",
    cta2: "See photos"
  },

  /* Three tiles under the hero: [icon, title, text]. Icons: key chat shield pin check pool beach */
  why: [
    ["key", "No platform fee", "Airbnb and Vrbo add a service fee on top of the owner's price. Here there is none. You pay the owner, and only the owner."],
    ["chat", "Talk to the owner", "Questions about the beds, the beach or the best taco in town go to a real person who knows the condo."],
    ["shield", "One clear policy", "The owner's own cancellation and payment terms come with every quote. Nothing hidden in a checkout screen."]
  ],

  /* Section headings */
  photos:    { kicker: "Photos",      title: "Eighteen ways to look at the water", lead: "Tap any tile. Arrow keys or swipe to move through the set.", allLabel: "All", moreLabel: "more photos" },
  condo:     { kicker: "The condo",   factLabels: { bedrooms: "Bedrooms", bathrooms: "Bathrooms", sleeps: "Sleeps", floor: "Floor", view: "View", complex: "Complex", beds: "Beds", address: "Address" } },
  amenities: { kicker: "Amenities",   title: "Everything a beach week needs" },
  rates:     { kicker: "Rates",       titlePrefix: "From", titleSuffix: "a night", cols: ["Season", "Minimum", "Nightly"], nightsWord: "nights",
               quoteTitle: "Quick estimate", checkIn: "Check-in", checkOut: "Check-out", askCta: "Ask for these dates",
               emptyHint: "Pick check-in and check-out dates to see an estimate.", orderHint: "Check-out must be after check-in.",
               cleaning: "Cleaning", taxes: "Taxes", minHint: "These dates usually need a {min}-night minimum. Ask anyway, the owner may make an exception.",
               estimateHint: "Estimate only. The owner confirms the exact quote." },
  location:  { kicker: "Location",    title: "On the beach, in the middle of Destin" },
  reviews:   { kicker: "Guests",      title: "What guests say",
               empty: "Guest reviews are on their way to this page.", emptyLinks: "Until then, read them on", emptyNoLinks: "Ask the owner for references when you inquire." },
  book:      { kicker: "Book direct", title: "Ask for your dates. Keep the fee.",
               lead: "Send the dates and the owner replies with a quote, usually within a day. You pay the owner directly. No platform fee, no middle layer.",
               labels: { name: "Name", email: "Email", checkin: "Check-in", checkout: "Check-out", guests: "Guests", message: "Anything else" },
               placeholder: "Travelling with kids, arriving late, need beach chairs…", submit: "Send inquiry",
               sent: "Your email app should open with the inquiry filled in. If it does not, write to {email}.",
               mailSubject: "Inquiry: {name} · {in} to {out}",
               mailBody: "Hello,\n\nI would like to stay at {name}.\n\nCheck-in: {in}\nCheck-out: {out}\nGuests: {guests}\n\n{message}\n\nThanks,\n{guest}\n{guestEmail}" },
  faq:       { kicker: "FAQ",         title: "Good to know" },
  stickyCta: "Check dates · no platform fee",

  /* Footer */
  footer: {
    tagline: "Owner-run Gulf-front condos in Destin, Florida. Book direct, keep the fee.",
    cols: [
      ["Explore", [["Photos", "#photos"], ["Rates", "#rates"], ["Map", "#map"], ["All properties", "properties.html"]]],
      ["Book",    [["Ask for dates", "#book"], ["FAQ", "#faq"]]],
      ["Legal",   [["Terms", "#"], ["Privacy", "#"]]]
    ],
    legalLead: "Who you book with:",
    legal: "every reservation, payment, cancellation and refund is a direct agreement between you and the property owner. SunDestin Online is the owner's own website, not a marketplace or agent.",
    copyright: "SunDestin Online"
  },

  /* properties.html */
  list: { kicker: "Properties", title: "Owner-run condos on the Destin beach", lead: "Each one is booked directly with its owner. Pick a condo to see photos, rates and the map.", from: "from", perNight: "/ night" }
};
