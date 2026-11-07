/* SunDestin Online — property data.
   One object per property. index.html renders the property marked "featured";
   properties.html lists all of them. Edit here, never in the HTML.
   Rates are SAMPLE values until the owner confirms them (see docs/DESIGN_PROMPT.md §8). */
window.SDO_PROPERTIES = [
  {
    id: "sd203",
    featured: true,
    name: "SunDestin #203",
    complex: "Sun Destin Vacation Complex",
    address: "1040 Highway 98 East, #203, Destin, FL 32541",
    lat: 30.3864, lng: -86.4617,
    headline: "Toes-in-the-Sand Gulf Views from Your Private Beachfront Balcony",
    subhead: "2nd-floor Gulf-front condo with direct beach access, a beachside pool and room for 6, steps from the heart of Destin.",
    facts: { bedrooms: 1, bathrooms: 1, sleeps: 6, floor: "2nd floor", view: "Gulf-front" },
    beds: ["Queen bed", "Queen sleeper sofa", "Built-in twin bunks (2)"],
    hero: "images/2729818.jpg",
    photos: [
      { src: "images/2729825.jpg", alt: "Private balcony with table and chairs looking straight out over the Gulf of Mexico", tag: "Balcony" },
      { src: "images/2509279.jpg", alt: "Balcony view down onto the beachside pool and the white-sand beach", tag: "Balcony" },
      { src: "images/2729820.jpg", alt: "Living room with floor-to-ceiling slider opening onto the Gulf-view balcony", tag: "Living" },
      { src: "images/2729818.jpg", alt: "Kitchen with stainless appliances looking through to the Gulf", tag: "Kitchen" },
      { src: "images/2729829.jpg", alt: "Gated Gulf-front pool deck with the beach and emerald water beyond", tag: "Pool" },
      { src: "images/2729824.jpg", alt: "Striped sleeper sofa and leather chair facing the balcony and Gulf", tag: "Living" },
      { src: "images/2729821.jpg", alt: "Dining table for four beside the living area and balcony", tag: "Dining" },
      { src: "images/2729826.jpg", alt: "Glass dining table with the Gulf framed in the slider behind", tag: "Dining" },
      { src: "images/2729816.jpg", alt: "Breakfast bar and fully equipped kitchen with mosaic backsplash", tag: "Kitchen" },
      { src: "images/2729822.jpg", alt: "Kitchen counter and sink with a view across the living room to the water", tag: "Kitchen" },
      { src: "images/2729815.jpg", alt: "Bedroom with queen bed in an arched alcove and a window to the palms", tag: "Bedroom" },
      { src: "images/2729814.jpg", alt: "Bedroom flat-screen TV and dresser with the bathroom beyond", tag: "Bedroom" },
      { src: "images/2729813.jpg", alt: "Built-in twin bunk nook by the entry, a favourite with kids", tag: "Bunks" },
      { src: "images/2729817.jpg", alt: "Open-plan living and dining area in coastal blue", tag: "Living" },
      { src: "images/2729823.jpg", alt: "Wide view of the living room, dining area and kitchen", tag: "Living" },
      { src: "images/2729819.jpg", alt: "Bathroom vanity with framed mirror and tub-shower", tag: "Bath" },
      { src: "images/2729827.jpg", alt: "Tub-shower combination and vanity", tag: "Bath" },
      { src: "images/2509280.jpg", alt: "Rows of beach umbrellas on the sand seen from the pool deck", tag: "Beach" }
    ],
    description: [
      "Wake up to the emerald-green Gulf of Mexico from this beautifully kept 2nd-floor condo at the Sun Destin Vacation Complex. Your private balcony hangs directly over the beachside pool and sugar-white sand, close enough to hear the waves and low enough to count the umbrellas.",
      "Inside, the open floor plan flows from a fully equipped kitchen with stainless appliances and breakfast bar, through a bright dining area, into a coastal-blue living room with a flat-screen TV and a wall of glass framing the Gulf. The queen sleeper sofa and a charming built-in bunk nook let the condo comfortably sleep 6. Kids claim the bunks every time.",
      "Step out the slider and the best of Destin is at your feet: a gated Gulf-front pool deck, seasonal beach chair service on one of Florida's most celebrated beaches, and HarborWalk Village, Big Kahuna's and Destin Commons only minutes away. Being on the 2nd floor means no elevator waits. You are from your door to the sand in under a minute."
    ],
    amenities: [
      ["Gulf-front private balcony", "balcony"], ["Beachside heated pool", "pool"], ["Direct beach access", "beach"],
      ["Seasonal beach chair service", "chair"], ["Fully equipped kitchen", "kitchen"], ["Breakfast bar", "bar"],
      ["Flat-screen TVs (living + bedroom)", "tv"], ["Free Wi-Fi", "wifi"], ["Free parking", "parking"],
      ["Central air conditioning", "ac"], ["Linens and towels provided", "linens"], ["Coffee maker", "coffee"],
      ["Dishwasher and microwave", "dish"], ["Hair dryer", "hair"], ["No elevator wait (2nd floor)", "stairs"], ["Gated pool deck", "gate"]
    ],
    seasons: [
      { key: "off",      label: "Off-season",   when: "Nov – Feb",            nightly: 149, min: 2, color: "var(--season-off)" },
      { key: "shoulder", label: "Shoulder",     when: "Mar – May · Sep – Oct", nightly: 219, min: 3, color: "var(--season-shoulder)" },
      { key: "peak",     label: "Peak summer",  when: "Jun – Aug",            nightly: 299, min: 5, color: "var(--season-peak)" },
      { key: "holiday",  label: "Holidays",     when: "Spring break · Jul 4 · Thanksgiving · Christmas", nightly: 339, min: 5, color: "var(--season-holiday)" }
    ],
    /* month index 0-11 → season key. Holidays are flagged by date range below. */
    monthSeason: ["off","off","shoulder","shoulder","shoulder","peak","peak","peak","shoulder","shoulder","off","off"],
    holidayRanges: [["03-07","03-31"],["07-01","07-07"],["11-20","11-30"],["12-20","01-03"]],
    fees: { cleaning: 150, taxRate: 0.12 },
    ratesNote: "Sample rates for layout only. The owner confirms live nightly rates, minimum stays and fees before launch.",
    nearby: [
      ["Beach", "0 min · out the slider"],
      ["Big Kahuna's Water & Adventure Park", "about 1 mi"],
      ["HarborWalk Village & Destin Harbor", "about 3 mi"],
      ["Destin Commons (shopping, dining)", "about 4 mi"],
      ["Henderson Beach State Park", "about 2 mi"],
      ["Destin–Fort Walton Beach Airport (VPS)", "about 25 min"]
    ],
    reviews: [],
    reviewLinks: [],
    faq: [
      ["How do I book?", "Send an inquiry with your dates. The owner replies within a day with a quote, and you pay the owner directly. There is no platform service fee on this site."],
      ["What is the bed setup?", "A queen bed in the bedroom, a queen sleeper sofa in the living room and two built-in twin bunks by the entry. The condo sleeps 6."],
      ["Is parking included?", "Yes. One parking space is included at no charge."],
      ["Is there beach chair service?", "Seasonal chair-and-umbrella service runs on the beach in front of the complex. Ask the owner for current dates and pricing."],
      ["Is there an elevator?", "The condo is on the 2nd floor, one flight up. Most guests find the stairs faster than waiting for an elevator with beach gear."],
      ["What is the cancellation policy?", "The owner's policy is quoted with every booking. Ask before you pay if you need flexibility."]
    ],
    contact: { email: "stay@sundestinonline.com", phone: "", whatsapp: "" }
  }
];
