import type { ChatCompletionTool } from "openai/resources/chat/completions";

export const agentTools: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "search_products",
      description:
        "Search and filter tour products available on the platform. Use this when the user asks for tour recommendations, activities, or things to do in Turkey. Supports filtering by keyword, location, or category.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              "Free-text search term to match against product title and description (e.g. 'balloon', 'mosque tour', 'hot spring').",
          },
          location: {
            type: "string",
            description:
              "City or region to filter by (e.g. 'Istanbul', 'Cappadocia', 'Ephesus', 'Pamukkale', 'Antalya').",
          },
          category: {
            type: "string",
            description:
              "Category slug to filter by. Valid values: 'adventure', 'culture', 'nature', 'history', 'food', 'wellness'.",
          },
          max_price: {
            type: "number",
            description: "Maximum price per person in product's native currency.",
          },
          limit: {
            type: "number",
            description: "Maximum number of results to return (1-10, default 5).",
          },
        },
        required: [],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_product_details",
      description:
        "Get full details for a specific tour product by its ID, including description, highlights, what's included, duration, and reviews.",
      parameters: {
        type: "object",
        properties: {
          product_id: {
            type: "string",
            description: "The numeric product ID (e.g. '1', '3', '7').",
          },
        },
        required: ["product_id"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "check_product_availability",
      description:
        "Check available time slots and pricing options for a specific product on a given date with a given number of travelers.",
      parameters: {
        type: "object",
        properties: {
          product_id: {
            type: "string",
            description: "The product ID to check availability for.",
          },
          date: {
            type: "string",
            description: "The desired date in YYYY-MM-DD format.",
          },
          travelers: {
            type: "number",
            description: "Number of travelers (1-20).",
          },
        },
        required: ["product_id", "date", "travelers"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_attractions",
      description:
        "Search attractions from the database filtered by city and/or interest tags. Use this to get information about specific landmarks, museums, or natural sites in Turkish cities.",
      parameters: {
        type: "object",
        properties: {
          city: {
            type: "string",
            description:
              "City to search in. Valid cities: istanbul, cappadocia, ephesus, pamukkale, antalya, bodrum, bursa, ankara, trabzon, konya, canakkale.",
          },
          interests: {
            type: "array",
            items: {
              type: "string",
              enum: ["culture", "history", "food", "nature", "adventure", "relaxation"],
            },
            description: "List of interest tags to filter by.",
          },
          limit: {
            type: "number",
            description: "Maximum number of results (1-20, default 8).",
          },
        },
        required: [],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_attraction_details",
      description:
        "Get detailed info about a specific attraction by its URL slug (e.g. 'blue-mosque', 'cappadocia-fairy-chimneys').",
      parameters: {
        type: "object",
        properties: {
          slug: {
            type: "string",
            description: "The attraction slug (URL-friendly identifier).",
          },
        },
        required: ["slug"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "generate_itinerary",
      description:
        "Generate a detailed day-by-day travel itinerary for Turkey based on user preferences. Always use this when the user asks to plan a trip, create an itinerary, or wants a day-by-day schedule.",
      parameters: {
        type: "object",
        properties: {
          destinations: {
            type: "array",
            items: { type: "string" },
            description:
              "List of cities to visit (e.g. ['istanbul', 'cappadocia']). Use lowercase city names. Max 4.",
          },
          start_date: {
            type: "string",
            description: "Trip start date in YYYY-MM-DD format.",
          },
          end_date: {
            type: "string",
            description: "Trip end date in YYYY-MM-DD format.",
          },
          budget_level: {
            type: "string",
            enum: ["budget", "standard", "luxury"],
            description: "Overall budget level for the trip.",
          },
          interests: {
            type: "array",
            items: {
              type: "string",
              enum: ["culture", "history", "food", "nature", "adventure", "relaxation"],
            },
            description: "User's interest tags to personalize the itinerary.",
          },
          travelers: {
            type: "number",
            description: "Number of travelers (1-20).",
          },
          pace: {
            type: "string",
            enum: ["slow", "balanced", "fast"],
            description: "Preferred travel pace. slow=2 activities/day, balanced=3, fast=4.",
          },
        },
        required: ["destinations", "start_date", "end_date", "budget_level", "interests", "travelers", "pace"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "save_itinerary",
      description:
        "Save a generated itinerary to the user's account for future reference. Requires the user to be signed in. Call this after generating an itinerary if the user wants to save it.",
      parameters: {
        type: "object",
        properties: {
          request_snapshot: {
            type: "object",
            description: "The original itinerary request parameters (from generate_itinerary).",
            additionalProperties: true,
          },
          generated_plan: {
            type: "object",
            description: "The generated itinerary plan object (from generate_itinerary result).",
            additionalProperties: true,
          },
          notes: {
            type: "string",
            description: "Optional personal notes about this itinerary.",
          },
          status: {
            type: "string",
            enum: ["draft", "saved", "archived"],
            description: "Status of the itinerary (default: 'draft').",
          },
        },
        required: ["request_snapshot", "generated_plan"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "list_itineraries",
      description:
        "List all itineraries saved to the user's account. Requires the user to be signed in. Use this when the user asks to see their saved trips or itineraries.",
      parameters: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description: "Number of itineraries to return (1-20, default 10).",
          },
          cursor: {
            type: "string",
            description: "Pagination cursor from a previous list_itineraries call.",
          },
        },
        required: [],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_itinerary",
      description:
        "Fetch the full details of a specific saved itinerary by its ID. Requires the user to be signed in.",
      parameters: {
        type: "object",
        properties: {
          itinerary_id: {
            type: "string",
            description: "The MongoDB ObjectId of the itinerary to fetch.",
          },
        },
        required: ["itinerary_id"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "update_itinerary",
      description:
        "Update the notes or status of a saved itinerary. Requires the user to be signed in. Use this when the user wants to rename, add notes, or change the status of a saved trip.",
      parameters: {
        type: "object",
        properties: {
          itinerary_id: {
            type: "string",
            description: "The ID of the itinerary to update.",
          },
          notes: {
            type: "string",
            description: "New personal notes to attach to the itinerary.",
          },
          status: {
            type: "string",
            enum: ["draft", "saved", "archived"],
            description: "New status for the itinerary.",
          },
        },
        required: ["itinerary_id"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "delete_itinerary",
      description:
        "Permanently delete a saved itinerary from the user's account. Requires the user to be signed in. Confirm with the user before calling this.",
      parameters: {
        type: "object",
        properties: {
          itinerary_id: {
            type: "string",
            description: "The ID of the itinerary to delete.",
          },
        },
        required: ["itinerary_id"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_exchange_rate",
      description:
        "Get the current currency exchange rate between two currencies. Use this when the user asks about prices in their currency, or when converting Turkish Lira costs.",
      parameters: {
        type: "object",
        properties: {
          base: {
            type: "string",
            description: "The base currency code (e.g. 'USD', 'EUR', 'GBP').",
          },
          target: {
            type: "string",
            description: "The target currency code (e.g. 'TRY', 'USD').",
          },
        },
        required: ["base", "target"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_turkey_travel_info",
      description:
        "Get curated travel information and tips about Turkey, including city guides, cultural etiquette, transport options, food recommendations, and safety advice.",
      parameters: {
        type: "object",
        properties: {
          topic: {
            type: "string",
            enum: ["culture", "food", "transport", "safety", "weather", "cities", "general"],
            description: "The topic of information to retrieve.",
          },
          city: {
            type: "string",
            description: "Optional specific city to get info about (e.g. 'Istanbul', 'Cappadocia').",
          },
        },
        required: ["topic"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_weather",
      description:
        "Get current weather conditions and forecast for a Turkish city. Use this when the user asks about weather, what to pack, or best time to visit.",
      parameters: {
        type: "object",
        properties: {
          city: {
            type: "string",
            description: "The city name to get weather for (e.g. 'Istanbul', 'Cappadocia', 'Antalya').",
          },
        },
        required: ["city"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_transport_info",
      description:
        "Get transport guidance and options between Turkish cities or within a city, including buses, flights, and car travel.",
      parameters: {
        type: "object",
        properties: {
          from: {
            type: "string",
            description: "Origin city or location (e.g. 'Istanbul').",
          },
          to: {
            type: "string",
            description: "Destination city or location (e.g. 'Cappadocia').",
          },
          mode: {
            type: "string",
            enum: ["car", "bus", "flight"],
            description: "Transport mode. Default: 'bus'.",
          },
        },
        required: ["from", "to"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_wishlist",
      description:
        "Retrieve the current user's wishlist of saved tours and products. Requires the user to be signed in.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "toggle_wishlist",
      description:
        "Add or remove a tour product from the user's wishlist. Requires the user to be signed in. Calling this toggles the current state.",
      parameters: {
        type: "object",
        properties: {
          product_id: {
            type: "string",
            description: "The product ID to add or remove from the wishlist.",
          },
        },
        required: ["product_id"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_user_profile",
      description:
        "Retrieve the signed-in user's profile information including name, email, and verification status. Requires the user to be signed in.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_user_preferences",
      description:
        "Retrieve the signed-in user's saved travel preferences: preferred budget level, cities, and interests. Requires the user to be signed in.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "update_user_preferences",
      description:
        "Update the signed-in user's travel preferences. Only provide the fields that should change. Requires the user to be signed in.",
      parameters: {
        type: "object",
        properties: {
          preferred_budget: {
            type: "string",
            enum: ["budget", "standard", "luxury"],
            description: "The user's preferred budget level.",
          },
          preferred_cities: {
            type: "array",
            items: { type: "string" },
            description: "List of preferred destination cities.",
          },
          preferred_interests: {
            type: "array",
            items: { type: "string" },
            description: "List of interest tags (e.g. ['culture', 'food', 'nature']).",
          },
        },
        required: [],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "list_orders",
      description:
        "List the signed-in user's past booking orders, including order status, total, and items. Requires the user to be signed in.",
      parameters: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description: "Number of orders to return (1-20, default 10).",
          },
          cursor: {
            type: "string",
            description: "Pagination cursor from a previous list_orders call.",
          },
        },
        required: [],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "submit_feedback",
      description:
        "Submit user feedback or a rating about the platform, assistant, itinerary quality, or UX. Use this when the user wants to give feedback.",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            enum: ["ux", "itinerary", "assistant", "realtime", "other"],
            description: "Category of feedback.",
          },
          message: {
            type: "string",
            description: "The feedback message text.",
          },
          rating: {
            type: "number",
            description: "Optional rating from 1 (worst) to 5 (best).",
          },
        },
        required: ["category", "message"],
        additionalProperties: false,
      },
    },
  },
];

export const TOOL_LABELS: Record<string, string> = {
  search_products: "Searching tours...",
  get_product_details: "Fetching product details...",
  check_product_availability: "Checking availability...",
  search_attractions: "Searching attractions...",
  get_attraction_details: "Fetching attraction info...",
  generate_itinerary: "Generating your itinerary...",
  save_itinerary: "Saving itinerary...",
  list_itineraries: "Loading your itineraries...",
  get_itinerary: "Fetching itinerary...",
  update_itinerary: "Updating itinerary...",
  delete_itinerary: "Deleting itinerary...",
  get_exchange_rate: "Checking exchange rate...",
  get_turkey_travel_info: "Looking up travel info...",
  get_weather: "Checking weather...",
  get_transport_info: "Looking up transport options...",
  get_wishlist: "Loading your wishlist...",
  toggle_wishlist: "Updating wishlist...",
  get_user_profile: "Fetching your profile...",
  get_user_preferences: "Loading your preferences...",
  update_user_preferences: "Saving your preferences...",
  list_orders: "Loading your orders...",
  submit_feedback: "Submitting feedback...",
};
