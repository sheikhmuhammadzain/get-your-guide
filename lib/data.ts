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
