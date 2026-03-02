import fs from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import mongoose from "mongoose"

const seedPath = path.join(
  process.cwd(),
  "scripts",
  "seed",
  "product-options.seed.json",
)

const productOptionSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    openingHoursText: { type: String, required: true },
    pricePerPerson: { type: Number, required: true },
    currency: { type: String, required: true },
    cancellationHours: { type: Number, required: true },
    maxGroupSize: { type: Number, required: true },
    availableDaysOfWeek: [{ type: Number }],
    timeSlots: [{ type: String }],
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
)

productOptionSchema.index({ productId: 1, sortOrder: 1 })

const ProductOption =
  mongoose.models.ProductOption ||
  mongoose.model("ProductOption", productOptionSchema, "product_options")

async function run() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error("MONGODB_URI is required")
  }

  await mongoose.connect(uri, { dbName: "travel_planner" })

  const raw = await fs.readFile(seedPath, "utf8")
  const items = JSON.parse(raw)

  // Remove existing options and re-insert fresh
  await ProductOption.deleteMany({})

  const result = await ProductOption.insertMany(items)
  console.log("Product options seed complete", { inserted: result.length })
}

run()
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await mongoose.disconnect()
  })
