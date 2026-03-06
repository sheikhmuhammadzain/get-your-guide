export interface ProductReview {
  reviewer: string
  country: string
  date: string
  rating: number
  text: string
  verified: boolean
}

export interface Product {
  id: string
  slug: string
  image: string
  title: string
  summary: string
  location: string
  category: string
  description?: string
  activities?: string[]
  highlights: string[]
  includes: string[]
  badge?: string
  duration: string
  features?: string[]
  bookedText?: string
  rating: number
  reviews: number
  price: number
  currency: string
  highlightedReviews?: ProductReview[]
}

export const products: Product[] = [
  {
    id: "1",
    slug: "cappadocia-sunrise-balloon-flight",
    image: "https://picsum.photos/seed/cappadocia/800/600",
    title: "Cappadocia: Sunrise Hot Air Balloon Flight with Champagne",
    summary:
      "See Cappadocia valleys at sunrise with hotel pickup and post-flight celebration.",
    location: "Cappadocia",
    category: "Adventure",
    description:
      "Cappadocia is one of Turkey's most surreal landscapes — ancient volcanic eruptions sculpted a fantasy world of fairy chimneys, cave dwellings, and sweeping valleys. A sunrise hot air balloon flight is the quintessential way to witness this UNESCO-listed region at its most magical: golden light pouring across the Göreme plateau as the valley below stirs to life.",
    activities: [
      "Sunrise hot air balloon flight over Göreme",
      "Hike through Rose Valley and Red Valley",
      "Explore Kaymakli Underground City",
      "Visit Göreme Open Air Museum",
      "Pottery workshop in Avanos",
      "ATV tour through fairy chimneys",
      "Horse riding at sunset in Love Valley",
    ],
    highlights: [
      "Sunrise flight over Goreme and Red Valley",
      "Licensed pilot and safety briefing included",
      "Hotel pickup and return transfer",
    ],
    includes: [
      "Roundtrip transfer",
      "Flight certificate",
      "Light refreshments",
    ],
    badge: "AI Recommended",
    duration: "3 hours",
    features: ["Hotel pickup included", "Small group"],
    bookedText: "Booked 50 times today",
    rating: 4.9,
    reviews: 1250,
    price: 150,
    currency: "EUR",
    highlightedReviews: [
      {
        reviewer: "Sarah",
        country: "Australia",
        date: "February 14, 2026",
        rating: 5,
        text: "Absolutely breathtaking! Watching the sun rise over the fairy chimneys from the balloon basket is something I will never forget. The pilot was incredibly professional and the champagne celebration at the end was a perfect touch.",
        verified: true,
      },
      {
        reviewer: "Marco",
        country: "Italy",
        date: "January 28, 2026",
        rating: 5,
        text: "The most magical experience of our Turkey trip. We woke up at 4am and it was worth every second. The team was organised, safe, and passionate about sharing Cappadocia's beauty. Book the private basket — it's worth the upgrade.",
        verified: true,
      },
    ],
  },
  {
    id: "2",
    slug: "istanbul-hagia-sophia-blue-mosque-topkapi-tour",
    image: "https://picsum.photos/seed/istanbul/800/600",
    title: "Istanbul: Hagia Sophia, Blue Mosque & Topkapi Palace Tour",
    summary:
      "Guided Istanbul old-city route covering Ottoman and Byzantine landmarks.",
    location: "Istanbul",
    category: "Culture",
    description:
      "Istanbul is the only city in the world straddling two continents, and its layered history is written across every skyline. From the Byzantine grandeur of the Hagia Sophia to the Ottoman splendour of the Topkapi Palace, the old city packs more world-class monuments per square kilometre than almost anywhere on earth.",
    activities: [
      "Tour Hagia Sophia and the Blue Mosque",
      "Explore Topkapi Palace and the harem",
      "Wander the Grand Bazaar's 4,000+ shops",
      "Sample street food in Eminonu",
      "Bosphorus sunset cruise",
      "Visit Dolmabahce Palace",
      "Spice Bazaar shopping tour",
    ],
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
      {
        reviewer: "John",
        country: "United States",
        date: "February 26, 2026",
        rating: 5,
        text: "Incredible experience that brought the scale and wonder of history to life. Our guide Mehmet was knowledgeable, funny, and incredibly passionate about Ottoman culture. Skipping the lines made the whole day stress-free.",
        verified: true,
      },
      {
        reviewer: "Aleksandrs",
        country: "United Kingdom",
        date: "January 19, 2026",
        rating: 5,
        text: "Everything was so nice and smooth. Me and my wife enjoyed everything. Thank you very much for a lovely interesting day. The guide was excellent and patient with our questions.",
        verified: true,
      },
    ],
  },
  {
    id: "3",
    slug: "ephesus-small-group-tour-kusadasi-izmir",
    image: "https://picsum.photos/seed/ephesus/800/600",
    title: "Ephesus: Small Group Tour from Kusadasi/Izmir",
    summary:
      "Visit major Ephesus ruins with transfers and commentary in a small group.",
    location: "Ephesus",
    category: "History",
    description:
      "Ephesus was one of the greatest cities of the ancient world — a Roman metropolis of 250,000 people and home to one of the Seven Wonders of the World. Walking its marble streets today is an extraordinary encounter with antiquity: the Library of Celsus, the Great Theatre, and the Terrace Houses are all remarkably preserved.",
    activities: [
      "Explore the Library of Celsus ruins",
      "Walk the Arcadian Way to the Great Theatre",
      "Visit the Terrace Houses (upper city mansions)",
      "See the remains of the Temple of Artemis",
      "Day trip to the House of the Virgin Mary",
      "Selcuk Archaeological Museum visit",
      "Browse the Selcuk Saturday market",
    ],
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
      {
        reviewer: "Linda",
        country: "Canada",
        date: "March 1, 2026",
        rating: 5,
        text: "Ephesus is incredible and our guide made it come alive. Walking down the Marble Road knowing that millions of Romans walked the same path was goosebump-inducing. The small group size was perfect — no rushing, lots of time to explore.",
        verified: true,
      },
      {
        reviewer: "Pieter",
        country: "Netherlands",
        date: "February 8, 2026",
        rating: 4,
        text: "Wonderful tour, very well organised. The Library of Celsus is even more impressive in person. The lunch included was a bonus. My only small note is that it was busy mid-morning — if they offered a dawn slot that would be perfect.",
        verified: true,
      },
    ],
  },
  {
    id: "4",
    slug: "pamukkale-hierapolis-full-day-tour",
    image: "https://picsum.photos/seed/pamukkale/800/600",
    title: "Pamukkale & Hierapolis Full-Day Guided Tour",
    summary:
      "Discover travertine terraces and the ancient spa city of Hierapolis.",
    location: "Pamukkale",
    category: "Nature",
    description:
      "Pamukkale — meaning 'Cotton Castle' in Turkish — is a natural wonder unlike anything else on earth. Mineral-rich thermal waters have cascaded down the hillside for millennia, creating a brilliant white landscape of terraced pools. Above them sits Hierapolis, an ancient Greco-Roman spa city whose residents paid to soak in the same healing waters.",
    activities: [
      "Wade through the travertine thermal pools",
      "Explore Hierapolis ancient ruins and theatre",
      "Swim in Cleopatra's Antique Pool",
      "Visit the vast Hierapolis necropolis",
      "Sunset viewing at the white terraces",
      "Day trip to Laodikeia ancient city",
      "Kaklik Cave stalactite excursion",
    ],
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
    summary:
      "Sail the Aegean on a traditional wooden gulet, visiting hidden coves and crystal bays.",
    location: "Bodrum",
    category: "Adventure",
    description:
      "Bodrum has captivated visitors since antiquity — it was home to one of the Seven Wonders of the World, the Mausoleum at Halicarnassus. Today it thrives as the Aegean's most glamorous resort town, balancing its ancient harbour, crusader castle, and vibrant marina with pristine turquoise waters and legendary nightlife.",
    activities: [
      "Gulet blue voyage cruise to hidden coves",
      "Tour Bodrum Castle and the Underwater Museum",
      "Visit the Mausoleum at Halicarnassus ruins",
      "Snorkel and swim at Kara Ada island",
      "Explore Bodrum harbour market",
      "Sunset cocktails at the Bodrum windmills",
      "Day trip to Gumbet or Bitez beach",
    ],
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
    summary:
      "Explore Kaleici harbour, ride the Tunektepe cable car, and admire Duden Waterfalls.",
    location: "Antalya",
    category: "Nature",
    description:
      "Antalya is Turkey's turquoise coast capital — a sun-drenched city where Roman walls, Ottoman minarets, and Taurus Mountain backdrops frame the sparkling Mediterranean. Gateway to world-class beaches and ancient ruins, it balances urban culture with natural spectacle, from the thundering Düden Waterfalls to the panoramic Tünektepe cable car.",
    activities: [
      "Walk the historic Kaleiçi old quarter",
      "Ride the Tünektepe cable car for panoramic views",
      "Visit the Upper and Lower Düden Waterfalls",
      "Explore the ancient ruins of Perge",
      "Day trip to Aspendos Roman theatre",
      "Relax on Lara or Konyaalti beach",
      "Water activities at Konyaalti beach park",
    ],
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
    summary:
      "Discover the first Ottoman capital — magnificent mosques, covered bazaars, and royal tombs.",
    location: "Bursa",
    category: "Culture",
    description:
      "Bursa holds a special place in Turkish history as the first capital of the Ottoman Empire. Its skyline is defined by magnificent mosques, and its valleys are laced with thermal baths running since antiquity. Known as the 'Green City' for its lush parks, Bursa is also the birthplace of the iskender kebab and home to Turkey's finest silk.",
    activities: [
      "Visit Ulu Cami Grand Mosque with 20 domes",
      "Shop for silk at the Koza Han silk bazaar",
      "Explore the Green Mosque and Green Tomb",
      "Ride the gondola up to Uludağ mountain",
      "Soak in Çekirge Ottoman thermal baths",
      "Taste authentic iskender kebab",
      "Explore the Kapalı Çarşı old bazaar district",
    ],
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
    summary:
      "Visit Turkey's capital landmarks — the Anitkabir mausoleum and the world-class Anatolian Civilizations Museum.",
    location: "Ankara",
    category: "History",
    description:
      "Ankara is more than Turkey's administrative capital — it is home to the most powerful monument in the country, the Anıtkabir mausoleum of Mustafa Kemal Atatürk, and the world-renowned Museum of Anatolian Civilizations. While often overlooked by international tourists, Ankara rewards visitors with genuine historical and cultural depth spanning 10,000 years.",
    activities: [
      "Pay respects at Anıtkabir mausoleum",
      "Explore the Museum of Anatolian Civilizations",
      "Visit Ankara Citadel and old town (Ulus)",
      "See Kocatepe Mosque architecture",
      "Browse Atpazarı antique district",
      "Day trip to Gordion (ancient Phrygian capital)",
      "Sample Ankara tava and local cuisine",
    ],
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
    summary:
      "Trek to the cliff-carved Sumela Monastery and explore the lush Black Sea highland plateau.",
    location: "Trabzon",
    category: "Adventure",
    description:
      "Trabzon sits on the Black Sea coast where mountains tumble steeply into the sea, creating a dramatic landscape of misty peaks and lush highland plateaus. Once a Silk Road city and seat of a brilliant Byzantine empire, its most famous treasure — the Sumela Monastery — clings impossibly to a sheer cliff face in the Pontic Alps, one of the most striking sights in all Turkey.",
    activities: [
      "Trek to Sumela Monastery on its sheer cliff face",
      "Scenic drive to Uzungöl alpine lake",
      "Visit Trabzon Hagia Sophia church-mosque",
      "Explore Atatürk's Trabzon villa",
      "Hike the Karadağ plateau trails",
      "Taste Trabzon pide and Black Sea anchovies",
      "Day trip to Ayder hot spring plateau",
    ],
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
    summary:
      "Experience the spiritual heart of Turkey — the Mevlana Museum and a live Sema ceremony.",
    location: "Konya",
    category: "Culture",
    description:
      "Konya is one of Turkey's oldest continuously inhabited cities and the spiritual home of Sufism. This is where the 13th-century mystic poet Rumi lived, taught, and is buried — and his presence still shapes the city profoundly. Watching a live Sema ceremony — the whirling dervish ritual — is an unforgettable spiritual experience found nowhere else like this.",
    activities: [
      "Visit Mevlana Museum and Rumi's tomb",
      "Watch a live Sema whirling dervish ceremony",
      "Explore Alaeddin Mosque on the citadel",
      "Tour Karatay Ceramics Museum",
      "Day trip to Çatalhöyük Neolithic site",
      "Taste Konya etli ekmek flatbread",
      "See İnce Minaret Seljuk architecture",
    ],
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
    summary:
      "Walk through the legendary ruins of Troy and pay tribute at Gallipoli's WWI memorials.",
    location: "Canakkale",
    category: "History",
    description:
      "Few places on earth carry the weight of legend that Troy does. Immortalised in Homer's Iliad, the archaeological site reveals nine distinct civilisations layered over 4,000 years. Nearby, the Gallipoli Peninsula is one of WWI's most significant battlefields — a place of deep pilgrimage for Australians, New Zealanders, and Turks who share a profound respect for the fallen.",
    activities: [
      "Walk Troy UNESCO ruins and the replica wooden horse",
      "Visit Gallipoli Anzac Cove and WWI memorials",
      "Ferry crossing of the Dardanelles",
      "See the Chunuk Bair New Zealand memorial",
      "Lone Pine cemetery and battlefield walk",
      "Visit the Çanakkale Archaeology Museum",
      "Explore Çanakkale waterfront and clock tower",
    ],
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
    summary:
      "Glide along the Bosphorus Strait, spotting palaces, fortresses, and the bridge between Europe and Asia.",
    location: "Istanbul",
    category: "Culture",
    description:
      "The Bosphorus Strait is Istanbul's liquid spine — the narrow waterway separating Europe from Asia that has been one of history's most strategically significant passages for 3,000 years. Cruising it reveals Istanbul from an angle no street can offer: Ottoman palaces rising directly from the water, medieval fortresses perched on cliffs, and elegant wooden waterfront mansions lining both shores.",
    activities: [
      "Bosphorus cruise past palaces and fortresses",
      "Visit Dolmabahçe Palace grounds",
      "Cross to the Asian side: Üsküdar and Kadıköy",
      "Explore Rumeli Hisarı fortress",
      "Fish sandwich lunch at Eminönü docks",
      "Browse Ortaköy Sunday market",
      "Evening waterfront dinner at Bebek",
    ],
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
  {
    id: "13",
    slug: "izmir-agora-kordon-winery-tour",
    image: "https://picsum.photos/seed/izmir/800/600",
    title: "Izmir: Ancient Agora, Kadifekale & Kordon Waterfront Tour",
    summary:
      "Explore Turkey's third-largest city — walk Roman ruins, climb a fortress hill, and stroll the sparkling Aegean waterfront.",
    location: "Izmir",
    category: "Culture",
    description:
      "Izmir — ancient Smyrna — is Turkey's most cosmopolitan city: a sun-lit, liberal Aegean port where palm-lined boulevards meet Roman ruins, and café terraces face a glittering bay. One of the oldest continuously inhabited cities on earth, Izmir blends layers of Greek, Roman, Byzantine, Ottoman, and modern Turkish identity into a uniquely relaxed and welcoming character.",
    activities: [
      "Explore the Roman Agora of Smyrna",
      "Climb Kadifekale fortress for panoramic bay views",
      "Walk the Kordon waterfront promenade",
      "Browse Kemeraltı historical bazaar",
      "Day trip to Çeşme beach resort",
      "Visit Izmir Archaeological Museum",
      "Wine tasting at a local Aegean winery",
    ],
    highlights: [
      "Roman Agora of Smyrna — one of Turkey's best-preserved",
      "Kadifekale hill fortress with Aegean panorama",
      "Lively Kemeraltı bazaar and Kordon waterfront",
    ],
    includes: ["Guide", "Transport", "Museum entry"],
    badge: "Coastal Gem",
    duration: "6 hours",
    features: ["Seafront city", "Expert guide"],
    rating: 4.7,
    reviews: 460,
    price: 30,
    currency: "EUR",
  },
  {
    id: "14",
    slug: "alanya-castle-damlatas-cave-beach-tour",
    image: "https://picsum.photos/seed/alanya/800/600",
    title: "Alanya: Seljuk Castle, Damlatas Cave & Red Tower",
    summary:
      "Discover the medieval fortress city — cliff-top castle, ancient cave, and crimson harbour tower above turquoise Mediterranean waters.",
    location: "Alanya",
    category: "History",
    description:
      "Alanya is the Mediterranean coast's most dramatic resort town — a craggy peninsula jutting into the turquoise sea, crowned by a magnificent Seljuk castle that has dominated this stretch of coast for 800 years. Below the fortress walls, the Red Tower guards the harbour and Damlatas stalagmite cave opens beneath the cliff face. It combines archaeological treasure with one of Turkey's most popular beach destinations.",
    activities: [
      "Explore Alanya Seljuk Castle complex",
      "Tour Damlatas Cave and its stalactites",
      "Visit the Red Tower harbour fortress",
      "Swim at Cleopatra Beach",
      "Boat trip to the sea caves along the cliffs",
      "Alanya Archaeological Museum visit",
      "Cable car ride up the castle hill",
    ],
    highlights: [
      "Alanya Castle — Seljuk fortress with Mediterranean panoramas",
      "Damlatas Cave — ancient stalactite and stalagmite formations",
      "Red Tower — 13th-century octagonal harbour fortification",
    ],
    includes: ["Guide", "Cave entry", "Castle access"],
    badge: "Mediterranean Highlight",
    duration: "7 hours",
    features: ["Castle & caves", "Beach access"],
    rating: 4.6,
    reviews: 530,
    price: 33,
    currency: "EUR",
  },
  {
    id: "15",
    slug: "gaziantep-zeugma-mosaic-food-tour",
    image: "https://picsum.photos/seed/gaziantep/800/600",
    title: "Gaziantep: Zeugma Mosaic Museum, Spice Bazaar & Baklava Trail",
    summary:
      "Savour Turkey's food capital and explore its world-class Roman mosaic museum alongside legendary baklava workshops.",
    location: "Gaziantep",
    category: "Culture",
    description:
      "Gaziantep is widely regarded as Turkey's culinary capital, and visiting it is an absolute joy for food-lovers. Its UNESCO-recognised cuisine — over 400 distinct dishes — draws visitors from across the country. But Gaziantep is not just about food: it is also home to the Zeugma Mosaic Museum, one of the world's greatest collections of Roman mosaics, including the haunting 'Gypsy Girl' mosaic rescued from Euphrates dam waters.",
    activities: [
      "Tour Zeugma Mosaic Museum — the world's largest",
      "Baklava trail: visit legendary baklava workshops",
      "Explore Gaziantep bazaar (coppersmiths district)",
      "Visit Gaziantep Citadel and Defence Museum",
      "Taste kıymalı pide, beyran soup, and lahmacun",
      "Copper and pistachio shopping in old bazaars",
      "Evening visit to Zincirli Bedesten",
    ],
    highlights: [
      "Zeugma Mosaic Museum — UNESCO-level Roman mosaic collection",
      "Gaziantep baklava — protected geographical indication",
      "Ancient copper bazaars and Ottoman hans",
    ],
    includes: ["Museum entry", "Food tastings", "Guide"],
    badge: "Food Lover's Paradise",
    duration: "8 hours",
    features: ["Food tastings included", "Expert guide"],
    bookedText: "Popular with food lovers",
    rating: 4.9,
    reviews: 610,
    price: 42,
    currency: "EUR",
  },
  {
    id: "16",
    slug: "mardin-old-city-monastery-artisan-tour",
    image: "https://picsum.photos/seed/mardin/800/600",
    title:
      "Mardin: Honey-Stone Old City, Deyrulzafaran Monastery & Artisan Workshops",
    summary:
      "Wander Mesopotamia's most dramatic hilltop city — ancient monasteries, Syriac Christianity, and intricate limestone architecture.",
    location: "Mardin",
    category: "History",
    description:
      "Mardin is one of Turkey's most extraordinary cities — a UNESCO candidate hilltop citadel carved from honey-coloured limestone, rising high above the Mesopotamian plain. Its old city is interlaced with Syriac Christian churches, Ottoman mosques, medieval madrasas, and the workshops of silversmiths and copper-engravers who have practised their craft unchanged for centuries. Nearby Deyrulzafaran Monastery has been continuously inhabited since the 5th century.",
    activities: [
      "Walk honey-stone alleys of Mardin Old City",
      "Tour Deyrulzafaran Syriac Orthodox Monastery",
      "Visit the Grand Mosque (Ulu Cami)",
      "Explore Kasımiye and Zinciriye Madrasas",
      "Browse silver and copper artisan workshops",
      "Panoramic sunset over the Mesopotamian plain",
      "Day trip to Midyat and traditional village churches",
    ],
    highlights: [
      "Deyrulzafaran Monastery — 5th-century Syriac monastery",
      "Mardin Old City — honey-stone architecture above Mesopotamia",
      "Living Syriac artisan craft traditions",
    ],
    includes: ["Monastery entry", "Guide", "Artisan workshop visit"],
    badge: "Hidden Treasure",
    duration: "7 hours",
    features: ["Monastery visit", "Expert guide"],
    rating: 4.8,
    reviews: 280,
    price: 36,
    currency: "EUR",
  },
  {
    id: "17",
    slug: "safranbolu-ottoman-houses-cave-tour",
    image: "https://picsum.photos/seed/safranbolu/800/600",
    title: "Safranbolu: UNESCO Ottoman Houses, Cinci Han & Bulak Cave",
    summary:
      "Step back into a perfectly preserved 18th-century Ottoman trading town — cobbled lanes, carved wooden mansions, and ancient caravanserai.",
    location: "Safranbolu",
    category: "Culture",
    description:
      "Safranbolu is one of the world's best-preserved Ottoman towns — a UNESCO World Heritage Site where hundreds of 18th and 19th-century timber-framed mansions line cobbled lanes exactly as they have for 300 years. Named for the saffron trade that once made it rich, Safranbolu was a crucial stop on the Silk Road. Exploring it today feels like stepping directly into the Ottoman empire: the same carved wooden lattices, stone fountains, and covered bazaar as centuries before.",
    activities: [
      "Walk cobbled lanes of Safranbolu Old Quarter",
      "Visit Kaymakamlar Mansion house museum",
      "Explore Cinci Han Ottoman caravanserai",
      "Tour Bulak Mencilis stalactite cave",
      "See the Grand Mosque and Clock Tower",
      "Taste Turkish delight and saffron sweets",
      "Sunset views from Hıdırlık Hill",
    ],
    highlights: [
      "UNESCO World Heritage Ottoman old town",
      "Kaymakamlar Mansion — finest of 1,000+ heritage houses",
      "Cinci Han — 17th-century caravanserai still in use",
    ],
    includes: ["Museum entry", "Guide", "Cave access"],
    badge: "UNESCO Heritage",
    duration: "6 hours",
    features: ["UNESCO site", "Heritage architecture"],
    rating: 4.7,
    reviews: 340,
    price: 28,
    currency: "EUR",
  },
]

export function getProductById(id: string) {
  return products.find(product => product.id === id) ?? null
}

export function formatPrice(product: Product) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: product.currency,
    maximumFractionDigits: 0,
  }).format(product.price)
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
]
