
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
    image: 'https://images.unsplash.com/photo-1541336032412-2048a614051f?q=80&w=2070&auto=format&fit=crop', // Cappadocia Hot Air Balloons
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
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1974&auto=format&fit=crop', // Istanbul Hagia Sophia
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
    image: 'https://images.unsplash.com/photo-1552483775-db7297b2d5f8?q=80&w=2070&auto=format&fit=crop', // Ephesus
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
    image: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?q=80&w=2070&auto=format&fit=crop', // Pamukkale
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
