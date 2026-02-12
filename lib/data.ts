
export interface Product {
  id: string;
  image: string;
  title: string;
  badge?: string;
  duration: string;
  features?: string[];
  bookedText?: string;
  rating?: number;
  reviews?: number;
  price?: number;
  currency?: string;
}

export const products: Product[] = [
  {
    id: '1',
    image: 'https://picsum.photos/seed/cappadocia/800/600', // Consistent random image for Cappadocia
    title: 'Cappadocia: Sunrise Hot Air Balloon Flight with Champagne',
    badge: 'AI Recommended',
    duration: '3 hours',
    features: ['Hotel pickup included', 'Small group'],
    bookedText: 'Booked 50 times today',
    rating: 4.9,
    reviews: 1250,
    price: 150,
    currency: '€'
  },
  {
    id: '2',
    image: 'https://picsum.photos/seed/istanbul/800/600', // Consistent random image for Istanbul
    title: 'Istanbul: Hagia Sophia, Blue Mosque & Topkapi Palace Tour',
    badge: 'Top Cultural Pick',
    duration: '4 hours',
    features: ['Skip the ticket line', 'Expert Guide'],
    rating: 4.8,
    reviews: 3200,
    price: 45,
    currency: '€'
  },
  {
    id: '3',
    image: 'https://picsum.photos/seed/ephesus/800/600', // Consistent random image for Ephesus
    title: 'Ephesus: Small Group Tour from Kusadasi/Izmir',
    badge: 'Best Value',
    duration: '6 hours',
    features: ['Lunch included', 'Historical insights'],
    bookedText: 'Popular with history buffs',
    rating: 4.7,
    reviews: 890,
    price: 60,
    currency: '€'
  },
  {
    id: '4',
    image: 'https://picsum.photos/seed/pamukkale/800/600', // Consistent random image for Pamukkale
    title: 'Pamukkale & Hierapolis Full-Day Guided Tour',
    badge: 'Natural Wonder',
    duration: '8 hours',
    features: ['Transport included', 'Swimming option'],
    rating: 4.6,
    reviews: 650,
    price: 55,
    currency: '€'
  }
];

export const filters = [
  'AI Itineraries',
  'Cultural Tours',
  'Historical Sites',
  'Adventure',
  'Food & Culinary',
  'Relaxation',
  'Cruises',
  'Family Friendly',
  'Budget Friendly'
];
