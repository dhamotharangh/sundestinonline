/* SunDestin Online — PROPERTY DATA. One object per property; the "featured" one is the home page.
   Photos live in images/ with logical names (kitchen_wide.jpg). Rates and availability come from
   data/rates.csv and data/availability.csv (matched on id); "seasons" below gives each season key
   its colour and is the fallback if the CSV cannot be read. */
window.SDO_PROPERTIES = [
  {
    id: "sundestin_203",
    place: "Destin",
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
    contact: { email: "sundestinonline@gmail.com", phone: "+1 (678) 793-9686", whatsapp: "" }
  },
  {
    id: "laketown_815",
    place: "PCB",
    name: "Laketown Wharf #815",
    complex: "Laketown Wharf Resort",
    address: "9860 S Thomas Dr, #815, Panama City Beach, FL 32408",
    lat: 30.1773, lng: -85.8054,
    headline: "Gulf views from the 8th floor. Five pools below.",
    subhead: "A 1-bedroom, 2-bath condo at Laketown Wharf with a king bed, a bunk nook and the beach a short walk across the street.",
    facts: { bedrooms: 1, bathrooms: 2, sleeps: 6, floor: "8th floor", view: "Gulf view" },
    site: {
      hero: {
        title: "Gulf views from the 8th floor,",
        title2: "five pools below",
        sub: "A 1-bedroom, 2-bath condo at Laketown Wharf Resort, Panama City Beach FL, with a king bed, a bunk nook and a queen sleeper. Sleeps 6.",
        sub_strong: "The beach is a short walk across the street.",
        sub2: "Laketown Wharf is a resort in itself: five pools, a splash pad, a lakefront boardwalk with restaurants, a fitness center and a putting green, with Pier Park and the Gulf minutes away."
      },
      location: { title: "In the middle of Panama City Beach" }
    },
    beds: ["King bed in the bedroom", "Queen sleeper sofa in the living room", "Twin-over-twin bunk bed in the bunk area"],
    hero: "images/laketown_wharf/laketown_815_01.jpg",
    photos: [
      { src: "images/laketown_wharf/laketown_815_01.jpg", alt: "Living room with two sofas and sliding doors opening to the balcony and the Gulf beyond", tag: "Living" },
      { src: "images/laketown_wharf/laketown_815_06.jpg", alt: "Balcony doorway framing the Gulf, the beach and the towers of Thomas Drive", tag: "Balcony" },
      { src: "images/laketown_wharf/laketown_815_02.jpg", alt: "Kitchen with cherry cabinets, granite counters and stainless appliances", tag: "Kitchen" },
      { src: "images/laketown_wharf/laketown_815_03.jpg", alt: "Bedroom with king bed, nightstands and a window", tag: "Bedroom" },
      { src: "images/laketown_wharf/laketown_815_04.jpg", alt: "Balcony chairs looking out over the Gulf of Mexico", tag: "Balcony" },
      { src: "images/laketown_wharf/laketown_815_08.jpg", alt: "Open living area with sofas, breakfast bar and kitchen", tag: "Living" },
      { src: "images/laketown_wharf/laketown_815_09.jpg", alt: "Granite island and bar seating with the living room and balcony behind", tag: "Kitchen" },
      { src: "images/laketown_wharf/laketown_815_05.jpg", alt: "Flat-screen TV, dining table and kitchen seen from the sofa", tag: "Living" },
      { src: "images/laketown_wharf/laketown_815_13.jpg", alt: "Twin-over-twin bunk bed in the bunk nook", tag: "Bunks" },
      { src: "images/laketown_wharf/laketown_815_12.jpg", alt: "Bathroom with granite vanity and tub-shower", tag: "Bath" },
      { src: "images/laketown_wharf/laketown_815_14.jpg", alt: "Second full bathroom with tub-shower", tag: "Bath" },
      { src: "images/laketown_wharf/laketown_815_15.jpg", alt: "Hallway with stacked washer and dryer", tag: "Laundry" },
      { src: "images/laketown_wharf/laketown_815_20.jpg", alt: "Gulf and beach seen from the 8th-floor balcony", tag: "Balcony" },
      { src: "images/laketown_wharf/laketown_815_21.jpg", alt: "Lagoon pool and lazy-river area beside the resort tower", tag: "Pool" },
      { src: "images/laketown_wharf/laketown_815_23.jpg", alt: "Aerial view of the resort pools and putting green", tag: "Pool" },
      { src: "images/laketown_wharf/laketown_815_28.jpg", alt: "Kids splash pad with the Gulf in the distance", tag: "Pool" },
      { src: "images/laketown_wharf/laketown_815_31.jpg", alt: "Fitness center with floor-to-ceiling windows", tag: "Resort" },
      { src: "images/laketown_wharf/laketown_815_44.jpg", alt: "Aerial view of Laketown Wharf between the lake and the Gulf", tag: "Resort" },
      { src: "images/laketown_wharf/laketown_815_45.jpg", alt: "Laketown Wharf at sunset over the lake", tag: "Resort" }
    ],
    description: [
      "Inside, an open floor plan runs from a fully equipped kitchen with cherry cabinets, granite counters and a breakfast bar, through the dining area, into a living room with two sofas, a flat-screen TV and a wall of glass onto the balcony. The bedroom has a king bed and its own full bathroom; a second full bath serves the twin bunk nook, and a queen sleeper sofa brings the count to 6. A stacked washer and dryer sits in the hall.",
      "Step out onto the 8th-floor balcony for Gulf views over Thomas Drive. Downstairs, Laketown Wharf has five pools, a splash pad, a lakefront boardwalk with restaurants and shops, a fitness center and a putting green. The beach is a short walk across the street, and Pier Park, Shipwreck Island and Ripley's are minutes away."
    ],
    amenity_groups: [
      ["Resort and beach", "beach", ["Five pools and a kids splash pad", "Lakefront boardwalk with dining", "Fitness center and putting green", "Beach access across Thomas Drive", "Elevators and covered parking garage"]],
      ["Inside",           "kitchen", ["Fully equipped kitchen", "Breakfast bar with seating", "Dishwasher and microwave", "Coffee maker", "Flat-screen TVs in living room and bedroom", "Washer and dryer in the unit"]],
      ["Comfort",          "wifi", ["Free Wi-Fi", "Central air conditioning", "Linens and towels provided", "Hair dryer, iron and board", "Two full bathrooms", "No pets, no smoking"]]
    ],
    seasons: [
      { key: "off",      label: "Off-season",  when: "Nov – Feb",             nightly: 139, min: 2, color: "var(--season_off)" },
      { key: "shoulder", label: "Shoulder",    when: "Mar – May · Sep – Oct", nightly: 199, min: 3, color: "var(--season_shoulder)" },
      { key: "peak",     label: "Peak summer", when: "Jun – Aug",             nightly: 279, min: 5, color: "var(--season_peak)" },
      { key: "holiday",  label: "Holidays",    when: "Spring break · Jul 4 · Thanksgiving · Christmas", nightly: 319, min: 5, color: "var(--season_holiday)" }
    ],
    month_season: ["off","off","shoulder","shoulder","shoulder","peak","peak","peak","shoulder","shoulder","off","off"],
    holiday_ranges: [["03-07","03-31"],["07-01","07-07"],["11-20","11-30"],["12-20","01-03"]],
    fees: { cleaning: 150, tax_rate: 0.12 },
    min_nights: 2,
    map_ring_miles: 3,
    rates_note: "Sample rates for layout only. The owner confirms live nightly rates, minimum stays, the resort parking fee and cleaning fee before launch.",
    nearby: [
      ["Beach (across Thomas Drive)", "about 5 minutes on foot"],
      ["Shipwreck Island Waterpark", "about 1 mi", 30.1830, -85.8160],
      ["Pier Park (shopping, dining)", "about 3 mi", 30.2120, -85.8690],
      ["Ripley's Believe It or Not", "about 2 mi", 30.1976, -85.8373],
      ["St. Andrews State Park", "about 4 mi", 30.1310, -85.7380],
      ["Northwest Florida Beaches Airport (ECP)", "about 30 min", 30.3571, -85.7955]
    ],
    reviews: [],
    review_links: [],
    faq: [
      ["How do I book?", "Send an inquiry with your dates. The owner replies within a day with a quote, and you pay the owner directly. There is no platform service fee on this site."],
      ["What is the bed setup?", "A king bed in the bedroom, a queen sleeper sofa in the living room and a twin-over-twin bunk bed in the bunk area. The condo sleeps 6."],
      ["How far is the beach?", "Laketown Wharf sits across Thomas Drive from the beach. Use the crosswalk at the resort entrance; it is a short walk."],
      ["Is parking included?", "The resort charges a parking and wristband fee at check-in, paid to the resort. Ask the owner for the current amount."],
      ["Is there an elevator?", "Yes. The condo is on the 8th floor with elevators from the parking garage."],
      ["What is the cancellation policy?", "The owner's policy is quoted with every booking. Ask before you pay if you need flexibility."]
    ],
    contact: { email: "sundestinonline@gmail.com", phone: "+1 (678) 793-9686", whatsapp: "" }
  }
];
