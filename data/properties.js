/* SunDestin Online — PROPERTY DATA. One object per property; the "featured" one is the home page.
   Photos live in images/ with logical names (kitchen_wide.jpg). Rates and availability come from
   data/rates.csv and data/availability.csv (matched on id); "seasons" below gives each season key
   its colour and is the fallback if the CSV cannot be read. */
window.SDO_PROPERTIES = [
  {
    id: "sundestin_203",
    featured: true,
    name: "SunDestin #203",
    complex: "Sun Destin Beach Resort",
    address: "1040 Highway 98 East, #203, Destin, FL 32541",
    lat: 30.3864, lng: -86.4617,
    headline: "Step onto the beach. Watch kids in sight.",
    subhead: "Step right onto the sand and enjoy the beach while keeping the kids in sight.",
    facts: { bedrooms: 1, bathrooms: 1.5, sleeps: 6, floor: "2nd floor", view: "Beachfront" },
    beds: ["Queen bed in the bedroom", "Queen sleeper sofa in the living room", "Built-in twin bunks (2) by the entry"],
    hero: "images/kitchen_wide.jpg",
    photos: [
      { src: "images/kitchen_wide.jpg",          alt: "Kitchen with stainless appliances looking through to the Gulf", tag: "Kitchen" },
      { src: "images/balcony_gulf_view.jpg",     alt: "Private balcony with table and chairs looking straight out over the Gulf of Mexico", tag: "Balcony" },
      { src: "images/balcony_over_pool.jpg",     alt: "Balcony view down onto the beachside pool and the white-sand beach", tag: "Balcony" },
      { src: "images/living_slider_gulf.jpg",    alt: "Living room with floor-to-ceiling sliding glass door opening onto the beachfront balcony", tag: "Living" },
      { src: "images/pool_deck_gulf.jpg",        alt: "Beachfront pool deck with the beach and emerald water beyond", tag: "Pool" },
      { src: "images/living_sofa_balcony.jpg",   alt: "Striped sleeper sofa and leather chair facing the balcony and Gulf", tag: "Living" },
      { src: "images/dining_living_balcony.jpg", alt: "Dining table for four beside the living area and balcony", tag: "Dining" },
      { src: "images/dining_table_gulf.jpg",     alt: "Glass dining table with the Gulf framed in the sliding glass door behind", tag: "Dining" },
      { src: "images/kitchen_breakfast_bar.jpg", alt: "Kitchen bar with counter seating and mosaic backsplash", tag: "Kitchen" },
      { src: "images/kitchen_sink_view.jpg",     alt: "Kitchen counter and sink with a view across the living room to the water", tag: "Kitchen" },
      { src: "images/bedroom_queen.jpg",         alt: "Bedroom with queen bed in an arched alcove and a window to the palms", tag: "Bedroom" },
      { src: "images/bedroom_tv_bath.jpg",       alt: "Bedroom flat-screen TV and dresser with the bathroom beyond", tag: "Bedroom" },
      { src: "images/bunks_entry.jpg",           alt: "Built-in twin bunk nook by the entry, a favourite with kids", tag: "Bunks" },
      { src: "images/living_dining_wide.jpg",    alt: "Open-plan living and dining area in coastal blue", tag: "Living" },
      { src: "images/living_room_wide.jpg",      alt: "Wide view of the living room, dining area and kitchen", tag: "Living" },
      { src: "images/bath_vanity.jpg",           alt: "Bathroom vanity with framed mirror and tub-shower", tag: "Bath" },
      { src: "images/bath_tub.jpg",              alt: "Tub-shower combination and vanity", tag: "Bath" },
      { src: "images/beach_umbrellas.jpg",       alt: "Rows of beach umbrellas on the sand seen from the pool deck", tag: "Beach" }
    ],
    description: [
      "Inside, the open floor plan flows from a fully equipped kitchen with stainless appliances and a counter-seating bar, through a bright dining area, into a coastal-blue living room with a flat-screen TV and a wall of glass framing the Gulf. The queen sleeper sofa and a charming built-in bunk nook let the condo comfortably sleep 6. Kids claim the bunks every time.",
      "Step out onto the balcony and the best of Destin is at your feet: a beachfront pool deck, seasonal beach chair service on one of Florida's most celebrated beaches, and HarborWalk Village, Big Kahuna's and Destin Commons only minutes away. Being on the 2nd floor means no elevator waits. Door to the sand in under a minute."
    ],
    /* three groups: [group title, icon, [items]] */
    amenity_groups: [
      ["Beach and pool", "beach", ["Beachfront private balcony", "Beachside heated pool", "Direct beach access", "Seasonal beach chair service ($)", "Pool deck steps from the sand"]],
      ["Inside",         "kitchen", ["Fully equipped kitchen", "Kitchen bar with counter seating", "Dishwasher and microwave", "Coffee maker", "Flat-screen TVs in living room and bedroom"]],
      ["Comfort",        "wifi", ["Free Wi-Fi", "Free parking", "Central air conditioning", "Linens and towels provided", "Hair dryer", "2nd floor, one flight of stairs up"]]
    ],
    seasons: [
      { key: "off",      label: "Off-season",  when: "Nov – Feb",             nightly: 149, min: 2, color: "var(--season_off)" },
      { key: "shoulder", label: "Shoulder",    when: "Mar – May · Sep – Oct", nightly: 219, min: 3, color: "var(--season_shoulder)" },
      { key: "peak",     label: "Peak summer", when: "Jun – Aug",             nightly: 299, min: 5, color: "var(--season_peak)" },
      { key: "holiday",  label: "Holidays",    when: "Spring break · Jul 4 · Thanksgiving · Christmas", nightly: 339, min: 5, color: "var(--season_holiday)" }
    ],
    month_season: ["off","off","shoulder","shoulder","shoulder","peak","peak","peak","shoulder","shoulder","off","off"],
    holiday_ranges: [["03-07","03-31"],["07-01","07-07"],["11-20","11-30"],["12-20","01-03"]],
    fees: { cleaning: 150, tax_rate: 0.12 },
    min_nights: 2,
    map_ring_miles: 3,
    rates_note: "Sample rates for layout only. The owner confirms live nightly rates, minimum stays and fees before launch.",
    /* nearby: [name, distance text, lat, lng]. Coordinates are approximate; adjust if a pin sits wrong. */
    nearby: [
      ["Beach", "under a minute"],
      ["Big Kahuna's Water & Adventure Park", "about 1 mi", 30.3936, -86.4546],
      ["Henderson Beach State Park", "about 2 mi", 30.3838, -86.4387],
      ["HarborWalk Village & Destin Harbor", "about 3 mi", 30.3935, -86.5085],
      ["Destin Commons (shopping, dining)", "about 4 mi", 30.3913, -86.4265],
      ["Destin–Fort Walton Beach Airport (VPS)", "about 25 min", 30.4832, -86.5254]
    ],
    reviews: [],
    review_links: [],
    faq: [
      ["How do I book?", "Send an inquiry with your dates. The owner replies within a day with a quote, and you pay the owner directly. There is no platform service fee on this site."],
      ["What is the bed setup?", "A queen bed in the bedroom, a queen sleeper sofa in the living room and two built-in twin bunks by the entry. The condo sleeps 6."],
      ["Is parking included?", "Yes. One parking space is included at no charge."],
      ["Is there beach chair service?", "Seasonal chair-and-umbrella service runs on the beach in front of the resort. Ask the owner for current dates and pricing."],
      ["Is there an elevator?", "The condo is on the 2nd floor, one flight up. Most guests find the stairs faster than waiting for an elevator with beach gear."],
      ["What is the cancellation policy?", "The owner's policy is quoted with every booking. Ask before you pay if you need flexibility."]
    ],
    contact: { email: "achaiyan@gmail.com", phone: "+1 (678) 793-9686", whatsapp: "" }
  }
];
