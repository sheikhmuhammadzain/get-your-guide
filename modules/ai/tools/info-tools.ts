import { getCurrencyRate } from "@/modules/realtime/currency.service";

export interface GetExchangeRateArgs {
  base: string;
  target: string;
}

export interface GetTurkeyTravelInfoArgs {
  topic: "culture" | "food" | "transport" | "safety" | "weather" | "cities" | "general";
  city?: string;
}

const CITY_INFO: Record<string, string> = {
  istanbul:
    "Istanbul straddles Europe and Asia across the Bosphorus. Key areas: Sultanahmet (old city, Hagia Sophia, Blue Mosque), Beyoğlu (Istiklal Avenue, nightlife), Kadıköy (Asian side, food scene). Use the Istanbulkart metro card for public transport. Best months: April–June, September–November.",
  cappadocia:
    "Cappadocia (Göreme, Ürgüp, Avanos) is famous for fairy chimneys, cave hotels, and hot air balloons. Balloon flights leave at sunrise and cost ~€150–250. Book 2+ days ahead. Göreme Open Air Museum, Kaymakli Underground City, and Rose Valley are must-sees. Best months: April–June, September–November.",
  ephesus:
    "Ephesus (near Selçuk) is one of the best-preserved Roman cities in the world. Visit early morning to avoid tour groups. Combine with the Terrace Houses (extra ticket). Nearby: House of Virgin Mary, Temple of Artemis. Best months: March–May, September–November.",
  pamukkale:
    "Pamukkale's white calcium travertine terraces lead to natural thermal pools. Combine with Hierapolis ancient city. Swimming allowed in thermal pools at the top. Entry ~100 TRY. Best months: April–June, September–October.",
  antalya:
    "Antalya is the Turkish Riviera hub — beaches, old harbor (Kaleiçi), Aspendos Roman theatre, Köprülü Canyon. Lara Beach for resorts, Konyaaltı for city beach. Best months: May–June, September–October to avoid peak heat.",
  bodrum:
    "Bodrum is Turkey's most glamorous coast town — Castle of St. Peter, Mausoleum, blue flag beaches, nightlife. Nearby beaches: Yalıkavak, Türkbükü (high-end), Bitez. Ferry to Greek islands. Best months: May–June, September.",
  bursa:
    "Bursa is Turkey's green city — cable car to Uludağ ski resort, Grand Mosque, Silk Bazaar, İskender kebab birthplace. Easy day trip from Istanbul by ferry. Best months: April–June, October.",
  ankara:
    "Ankara is the capital — Anıtkabir (Atatürk mausoleum), Museum of Anatolian Civilizations, and a modern city feel. Less touristy than Istanbul. Best months: April–May, September–October.",
  trabzon:
    "Trabzon in Black Sea region — Sümela Monastery carved into a cliff, Uzungöl lake, Atatürk's mansion. Green hills, tea plantations, local anchovies. Best months: May–September.",
  konya:
    "Konya is the spiritual home of Rumi and Sufism — Mevlâna Museum (dervish lodge), Karatay Madrasa. Conservative city, dress modestly. Best months: April–June, September–October.",
  canakkale:
    "Çanakkale: gateway to Troy ruins and Gallipoli WW1 battlefields. Ferry crossing the Dardanelles, drive to Troy (30 min). Best months: April–June, September–October.",
};

const TOPIC_INFO: Record<string, string> = {
  culture:
    "Turkish cultural etiquette: Dress modestly at mosques (cover head, shoulders, knees; remove shoes). Greet with 'Merhaba' (hello) or 'Teşekkürler' (thank you). Tea culture is central — accept çay (tea) when offered. Bargaining is expected in bazaars, not in shops with price tags. Friday is a holy day but not a holiday.",
  food:
    "Turkish cuisine highlights: Breakfast (kahvaltı) is elaborate — olives, cheese, tomatoes, eggs, pastries, honey. Kebabs vary by region: Adana (spicy), Iskender (Bursa), döner. Meze platters, fresh seafood on the coasts, lahmacun (flatbread with meat), baklava, Turkish delight (lokum), ayran (yogurt drink). Street food: simit (sesame bread), kestane (roasted chestnuts), mussels stuffed with rice (midye).",
  transport:
    "Transport in Turkey: Istanbul has metro, tram, funicular, and ferry (use Istanbulkart card). Inter-city buses (Flixbus equivalents like Kamil Koç, Metro Turizm) are cheap and comfortable. Domestic flights on Turkish Airlines, Pegasus, SunExpress. Car rental useful for Cappadocia/coast. Taxis: use apps (BiTaksi) to avoid overcharging. High-speed trains between Istanbul–Ankara–Konya.",
  safety:
    "Turkey safety tips: Generally safe for tourists. Use Uber/BiTaksi instead of hailing street taxis to avoid scams. Keep copies of your passport. In Istanbul, be cautious in Taksim/Sultanahmet tourist-heavy areas for pickpockets. Emergency: 112 (ambulance), 155 (police), 110 (fire). Health insurance recommended. Tap water is generally not drinkable — buy bottled.",
  weather:
    "Turkey weather: Istanbul is mild year-round (winters cold/rainy, summers hot/humid). Cappadocia gets snow in winter (December–March), balloon flights often cancelled. Aegean/Mediterranean coast: hot summers (35°C+), mild winters. Black Sea region: rainy, green, cooler. Best time overall: April–June and September–October for most regions.",
  cities:
    "Major Turkish destinations: Istanbul (must-visit), Cappadocia (unique landscape), Ephesus (ancient ruins), Pamukkale (thermal pools), Antalya (coast), Bodrum (glamour), Izmir (modern Aegean city), Bursa (green city), Trabzon (Black Sea), Ankara (capital). Turkey has 11 UNESCO World Heritage Sites.",
  general:
    "Turkey basics: Population 85M, capital Ankara, largest city Istanbul. Currency: Turkish Lira (TRY). Electricity: 220V/50Hz, Type F plugs. Language: Turkish (English widely spoken in tourist areas). Time zone: UTC+3. Major airports: Istanbul (IST, SAW), Ankara (ESB), Antalya (AYT), Izmir (ADB), Bodrum (BJV). Visa: e-Visa online at evisa.gov.tr for most nationalities (~$50). Tip 10% at restaurants if service charge not included.",
};

export async function getExchangeRate(args: GetExchangeRateArgs): Promise<unknown> {
  const base = args.base.toUpperCase();
  const target = args.target.toUpperCase();

  try {
    const result = await getCurrencyRate(base, target);
    return {
      base: result.base,
      target: result.target,
      rate: result.rate,
      asOf: result.asOf,
      source: result.source,
      example: `1 ${base} = ${result.rate.toFixed(4)} ${target}`,
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Currency lookup failed." };
  }
}

export async function getTurkeyTravelInfo(args: GetTurkeyTravelInfoArgs): Promise<unknown> {
  if (args.city) {
    const cityKey = args.city.toLowerCase();
    const cityInfo = CITY_INFO[cityKey];
    if (cityInfo) {
      return {
        topic: args.topic,
        city: args.city,
        info: cityInfo,
      };
    }
  }

  const topicInfo = TOPIC_INFO[args.topic] ?? TOPIC_INFO.general;
  return {
    topic: args.topic,
    city: args.city ?? null,
    info: topicInfo,
  };
}
