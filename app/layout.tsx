import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { BRAND_HEX } from "@/theme/colors";
import { ThemeProvider } from "@/components/ThemeProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://smarttripai.com'),
  title: {
    default: 'Smart Trip AI | AI-Powered Turkey Travel Itineraries & Tours',
    template: '%s | Smart Trip AI'
  },
  description: 'Discover Turkey with AI-powered travel itineraries. Explore Cappadocia hot air balloon rides, Istanbul tours, and personalized trip planning. Book unforgettable experiences with Smart Trip AI.',
  keywords: ['Turkey tours', 'travel itinerary', 'Cappadocia', 'Istanbul tours', 'AI travel planner', 'Turkey travel', 'hot air balloon', 'travel experiences', 'vacation planning', 'guided tours'],
  authors: [{ name: 'Smart Trip AI' }],
  creator: 'Smart Trip AI',
  publisher: 'Smart Trip AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://smarttripai.com',
    title: 'Smart Trip AI | AI-Powered Turkey Travel Itineraries & Tours',
    description: 'Discover Turkey with AI-powered travel itineraries. Explore Cappadocia, Istanbul, and more with personalized trip planning.',
    siteName: 'Smart Trip AI',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Smart Trip AI - AI-Powered Travel Planning',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smart Trip AI | AI-Powered Turkey Travel Itineraries',
    description: 'Discover Turkey with AI-powered travel itineraries. Explore Cappadocia, Istanbul, and personalized experiences.',
    creator: '@smarttripai',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Smart Trip AI',
    description: 'AI-powered travel itinerary planning and tour booking platform',
    url: 'https://smarttripai.com',
    logo: 'https://smarttripai.com/logo.png',
    sameAs: [
      'https://www.facebook.com/smarttripai',
      'https://twitter.com/smarttripai',
      'https://www.instagram.com/smarttripai',
    ],
    serviceType: 'Travel & Tourism',
    areaServed: {
      '@type': 'Country',
      name: 'Turkey',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Tours and Experiences',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'TouristAttraction',
            name: 'Cappadocia Hot Air Balloon',
            description: 'Experience breathtaking hot air balloon rides over Cappadocia',
          },
        },
      ],
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://smarttripai.com" />
        <link rel="preload" href="/chabot.png" as="image" />
        <meta name="theme-color" content={BRAND_HEX} />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('gyg-theme');if(t==='dark')document.documentElement.classList.add('dark')}catch(e){}})()`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${plusJakartaSans.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
