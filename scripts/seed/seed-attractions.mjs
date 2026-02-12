import fs from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import mongoose from "mongoose"

const seedPath = path.join(
  process.cwd(),
  "scripts",
  "seed",
  "attractions.seed.json",
)

const attractionSchema = new mongoose.Schema(
  {
    slug: {type: String, required: true, unique: true},
    city: {type: String, required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    tags: [{type: String, required: true}],
    coordinates: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    openingHours: {type: String, required: true},
    avgDurationMin: {type: Number, required: true},
    ticketPriceRange: {
      min: {type: Number, required: true},
      max: {type: Number, required: true},
      currency: {type: String, required: true},
    },
    bestVisitMonths: [{type: Number, required: true}],
    popularityScore: {type: Number, required: true},
  },
  {timestamps: true},
)

attractionSchema.index({city: 1, tags: 1})
attractionSchema.index({coordinates: "2dsphere"})
attractionSchema.index({name: "text", description: "text"})

const Attraction =
  mongoose.models.Attraction ||
  mongoose.model("Attraction", attractionSchema, "attractions")

async function run() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error("MONGODB_URI is required")
  }

  await mongoose.connect(uri, {dbName: "travel_planner"})

  const raw = await fs.readFile(seedPath, "utf8")
  const items = JSON.parse(raw)

  const operations = items.map(item => ({
    updateOne: {
      filter: {slug: item.slug},
      update: {$set: item},
      upsert: true,
    },
  }))

  const result = await Attraction.bulkWrite(operations)
  console.log("Seed complete", {
    inserted: result.upsertedCount,
    modified: result.modifiedCount,
    matched: result.matchedCount,
  })
}

run()
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await mongoose.disconnect()
  })
