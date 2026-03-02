export interface ProductReview {
  reviewer: string;
  country: string;
  date: string;
  rating: number;
  text: string;
  verified: boolean;
}

export interface Product {
  id: string;
  slug: string;
  image: string;
  title: string;
  summary: string;
  location: string;
  category: string;
  highlights: string[];
  includes: string[];
  badge?: string;
  duration: string;
  features?: string[];
  bookedText?: string;
  rating: number;
  reviews: number;
  price: number;
  currency: string;
  highlightedReviews?: ProductReview[];
}

export const products: Product[] = [
  {
    id: "1",
    slug: "cappadocia-sunrise-balloon-flight",
    image: "https://picsum.photos/seed/cappadocia/800/600",
    title: "Cappadocia: Sunrise Hot Air Balloon Flight with Champagne",
    summary: "See Cappadocia valleys at sunrise with hotel pickup and post-flight celebration.",
    location: "Cappadocia",
    category: "Adventure",
    highlights: [
      "Sunrise flight over Goreme and Red Valley",
      "Licensed pilot and safety briefing included",
      "Hotel pickup and return transfer",
    ],
    includes: ["Roundtrip transfer", "Flight certificate", "Light refreshments"],
    badge: "AI Recommended",
    duration: "3 hours",
    features: ["Hotel pickup included", "Small group"],
    bookedText: "Booked 50 times today",
    rating: 4.9,
    reviews: 1250,
    price: 150,
    currency: "EUR",
    highlightedReviews: [
      { reviewer: "Sarah", country: "Australia", date: "February 14, 2026", rating: 5, text: "Absolutely breathtaking! Watching the sun rise over the fairy chimneys from the balloon basket is something I will never forget. The pilot was incredibly professional and the champagne celebration at the end was a perfect touch.", verified: true },
      { reviewer: "Marco", country: "Italy", date: "January 28, 2026", rating: 5, text: "The most magical experience of our Turkey trip. We woke up at 4am and it was worth every second. The team was organised, safe, and passionate about sharing Cappadocia's beauty. Book the private basket — it's worth the upgrade.", verified: true },
    ],
  },
  {
    id: "2",
    slug: "istanbul-hagia-sophia-blue-mosque-topkapi-tour",
    image: "https://picsum.photos/seed/istanbul/800/600",
    title: "Istanbul: Hagia Sophia, Blue Mosque & Topkapi Palace Tour",
    summary: "Guided Istanbul old-city route covering Ottoman and Byzantine landmarks.",
    location: "Istanbul",
    category: "Culture",
    highlights: [
      "Skip long entry lines with pre-planned route",
      "Professional English-speaking guide",
      "Context on empire, architecture, and daily life",
    ],
    includes: ["Guide", "Planned entry sequence", "Old-city walking route"],
    badge: "Top Cultural Pick",
    duration: "4 hours",
    features: ["Skip the ticket line", "Expert Guide"],
    rating: 4.8,
    reviews: 3200,
    price: 45,
    currency: "EUR",
    highlightedReviews: [
      { reviewer: "John", country: "United States", date: "February 26, 2026", rating: 5, text: "Incredible experience that brought the scale and wonder of history to life. Our guide Mehmet was knowledgeable, funny, and incredibly passionate about Ottoman culture. Skipping the lines made the whole day stress-free.", verified: true },
      { reviewer: "Aleksandrs", country: "United Kingdom", date: "January 19, 2026", rating: 5, text: "Everything was so nice and smooth. Me and my wife enjoyed everything. Thank you very much for a lovely interesting day. The guide was excellent and patient with our questions.", verified: true },
    ],
  },
  {
    id: "3",
    slug: "ephesus-small-group-tour-kusadasi-izmir",
    image: "https://picsum.photos/seed/ephesus/800/600",
    title: "Ephesus: Small Group Tour from Kusadasi/Izmir",
    summary: "Visit major Ephesus ruins with transfers and commentary in a small group.",
    location: "Ephesus",
    category: "History",
    highlights: [
      "Library of Celsus and Great Theatre stop",
      "Smaller group for flexible pacing",
      "Ideal for cruise and city visitors",
    ],
    includes: ["Transport", "Guide", "Lunch"],
    badge: "Best Value",
    duration: "6 hours",
    features: ["Lunch included", "Historical insights"],
    bookedText: "Popular with history buffs",
    rating: 4.7,
    reviews: 890,
    price: 60,
    currency: "EUR",
    highlightedReviews: [
      { reviewer: "Linda", country: "Canada", date: "March 1, 2026", rating: 5, text: "Ephesus is incredible and our guide made it come alive. Walking down the Marble Road knowing that millions of Romans walked the same path was goosebump-inducing. The small group size was perfect — no rushing, lots of time to explore.", verified: true },
      { reviewer: "Pieter", country: "Netherlands", date: "February 8, 2026", rating: 4, text: "Wonderful tour, very well organised. The Library of Celsus is even more impressive in person. The lunch included was a bonus. My only small note is that it was busy mid-morning — if they offered a dawn slot that would be perfect.", verified: true },
    ],
  },
  {
    id: "4",
    slug: "pamukkale-hierapolis-full-day-tour",
    image: "https://picsum.photos/seed/pamukkale/800/600",
    title: "Pamukkale & Hierapolis Full-Day Guided Tour",
    summary: "Discover travertine terraces and the ancient spa city of Hierapolis.",
    location: "Pamukkale",
    category: "Nature",
    highlights: [
      "Terrace viewpoints and UNESCO guidance",
      "Ancient baths and theatre access",
      "Comfortable day schedule with transport",
    ],
    includes: ["Transport", "Guide", "Free time at terraces"],
    badge: "Natural Wonder",
    duration: "8 hours",
    features: ["Transport included", "Swimming option"],
    rating: 4.6,
    reviews: 650,
    price: 55,
    currency: "EUR",
  },
  {
    id: "5",
    slug: "bodrum-blue-voyage-gulet-cruise",
    image: "https://picsum.photos/seed/bodrum/800/600",
    title: "Bodrum: Blue Voyage Gulet Cruise with Lunch",
    summary: "Sail the Aegean on a traditional wooden gulet, visiting hidden coves and crystal bays.",
    location: "Bodrum",
    category: "Adventure",
    highlights: [
      "Visit Kara Ada hot springs and sea caves",
      "Swimming and snorkeling in turquoise waters",
      "Traditional Turkish lunch on board",
    ],
    includes: ["Lunch", "Snorkeling equipment", "Transfers from Bodrum centre"],
    badge: "Bestseller",
    duration: "8 hours",
    features: ["Lunch included", "Small group"],
    bookedText: "Booked 30 times today",
    rating: 4.8,
    reviews: 720,
    price: 40,
    currency: "EUR",
  },
  {
    id: "6",
    slug: "antalya-old-town-waterfall-tour",
    image: "https://picsum.photos/seed/antalya/800/600",
    title: "Antalya: Old Town, Duden Waterfalls & Cable Car",
    summary: "Explore Kaleici harbour, ride the Tunektepe cable car, and admire Duden Waterfalls.",
    location: "Antalya",
    category: "Nature",
    highlights: [
      "Guided walk through Roman-era Kaleici lanes",
      "Panoramic Taurus Mountain cable car ride",
      "Upper and Lower Duden Waterfall viewpoints",
    ],
    includes: ["Cable car ticket", "Guide", "Hotel pick-up"],
    badge: "Top Rated",
    duration: "7 hours",
    features: ["Hotel pickup", "Cable car included"],
    rating: 4.7,
    reviews: 540,
    price: 35,
    currency: "EUR",
  },
  {
    id: "7",
    slug: "bursa-grand-mosque-silk-market-tour",
    image: "https://picsum.photos/seed/bursa/800/600",
    title: "Bursa: Grand Mosque, Silk Bazaar & Green Tomb Tour",
    summary: "Discover the first Ottoman capital — magnificent mosques, covered bazaars, and royal tombs.",
    location: "Bursa",
    category: "Culture",
    highlights: [
      "Ulu Cami Grand Mosque with 20 domes",
      "Silk bazaar and traditional Bursa silk scarves",
      "Green Mosque and Green Tomb of Sultan Mehmed I",
    ],
    includes: ["Guide", "Transport", "Bazaar walking route"],
    badge: "Hidden Gem",
    duration: "5 hours",
    features: ["Expert guide", "Transport included"],
    rating: 4.6,
    reviews: 310,
    price: 30,
    currency: "EUR",
  },
  {
    id: "8",
    slug: "ankara-anitkabir-museum-anatolian-civilizations",
    image: "https://picsum.photos/seed/ankara/800/600",
    title: "Ankara: Ataturk Mausoleum & Museum of Anatolian Civilizations",
    summary: "Visit Turkey's capital landmarks — the Anitkabir mausoleum and the world-class Anatolian Civilizations Museum.",
    location: "Ankara",
    category: "History",
    highlights: [
      "Anitkabir: Ataturk's monumental mausoleum",
      "Artefacts spanning Paleolithic to Ottoman eras",
      "Hittite and Phrygian gallery highlights",
    ],
    includes: ["Museum ticket", "Guide", "City transport"],
    badge: "Cultural Must-See",
    duration: "6 hours",
    features: ["Museum tickets included", "Expert guide"],
    rating: 4.7,
    reviews: 425,
    price: 28,
    currency: "EUR",
  },
  {
    id: "9",
    slug: "trabzon-sumela-monastery-black-sea-tour",
    image: "https://picsum.photos/seed/trabzon/800/600",
    title: "Trabzon: Sumela Monastery & Black Sea Highlands",
    summary: "Trek to the cliff-carved Sumela Monastery and explore the lush Black Sea highland plateau.",
    location: "Trabzon",
    category: "Adventure",
    highlights: [
      "Sumela Monastery at 1200 m on a sheer cliff face",
      "Uzungol alpine lake scenic drive",
      "Traditional Black Sea breakfast included",
    ],
    includes: ["Monastery entry", "Breakfast", "Transport"],
    badge: "Off the Beaten Path",
    duration: "9 hours",
    features: ["Breakfast included", "Scenic mountain drive"],
    bookedText: "Popular with nature lovers",
    rating: 4.8,
    reviews: 290,
    price: 38,
    currency: "EUR",
  },
  {
    id: "10",
    slug: "konya-mevlana-museum-whirling-dervish",
    image: "https://picsum.photos/seed/konya/800/600",
    title: "Konya: Mevlana Museum & Sema Whirling Dervish Ceremony",
    summary: "Experience the spiritual heart of Turkey — the Mevlana Museum and a live Sema ceremony.",
    location: "Konya",
    category: "Culture",
    highlights: [
      "Mevlana Museum: resting place of Rumi",
      "Live Sema whirling dervish performance",
      "Karatay Ceramics Museum",
    ],
    includes: ["Museum entry", "Ceremony ticket", "Guide"],
    badge: "Spiritual Experience",
    duration: "5 hours",
    features: ["Ceremony included", "Expert guide"],
    rating: 4.7,
    reviews: 380,
    price: 32,
    currency: "EUR",
  },
  {
    id: "11",
    slug: "troy-ancient-ruins-canakkale-tour",
    image: "https://picsum.photos/seed/troy/800/600",
    title: "Troy Ancient Ruins & Gallipoli Battlefield Day Tour",
    summary: "Walk through the legendary ruins of Troy and pay tribute at Gallipoli's WWI memorials.",
    location: "Canakkale",
    category: "History",
    highlights: [
      "Troy UNESCO site with replica wooden horse",
      "Gallipoli Anzac Cove and Chunuk Bair",
      "Expert historian commentary throughout",
    ],
    includes: ["Entry tickets", "Historian guide", "Ferry crossing"],
    badge: "History Lovers Pick",
    duration: "10 hours",
    features: ["Ferry included", "Expert historian"],
    rating: 4.6,
    reviews: 510,
    price: 65,
    currency: "EUR",
  },
  {
    id: "12",
    slug: "istanbul-bosphorus-cruise-two-continents",
    image: "https://picsum.photos/seed/bosphorus/800/600",
    title: "Istanbul: Bosphorus Cruise — Two Continents in One Day",
    summary: "Glide along the Bosphorus Strait, spotting palaces, fortresses, and the bridge between Europe and Asia.",
    location: "Istanbul",
    category: "Culture",
    highlights: [
      "Dolmabahce Palace waterfront view",
      "Rumeli Fortress from the water",
      "Fish market lunch stop in Eminonu",
    ],
    includes: ["Boat cruise", "Audio guide", "Port transfers"],
    badge: "Most Popular",
    duration: "3.5 hours",
    features: ["Scenic cruise", "Audio guide"],
    bookedText: "Booked 80 times today",
    rating: 4.8,
    reviews: 4100,
    price: 25,
    currency: "EUR",
  },
];

export function getProductById(id: string) {
  return products.find((product) => product.id === id) ?? null;
}

export function formatPrice(product: Product) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: product.currency,
    maximumFractionDigits: 0,
  }).format(product.price);
}

export const filters = [
  "AI Itineraries",
  "Cultural Tours",
  "Historical Sites",
  "Adventure",
  "Food & Culinary",
  "Relaxation",
  "Cruises",
  "Family Friendly",
  "Budget Friendly",
];
