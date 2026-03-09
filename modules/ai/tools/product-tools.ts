import { getProductById, products, type Product } from "@/lib/data";
import { getAvailabilityService } from "@/modules/products/product-option.service";

export interface SearchProductsArgs {
  query?: string;
  location?: string;
  category?: string;
  max_price?: number;
  limit?: number;
}

export interface GetProductDetailsArgs {
  product_id: string;
}

export interface CheckProductAvailabilityArgs {
  product_id: string;
  date: string;
  travelers: number;
}

function matchesQuery(product: Product, query: string): boolean {
  const lower = query.toLowerCase();
  return (
    product.title.toLowerCase().includes(lower) ||
    (product.description?.toLowerCase().includes(lower) ?? false) ||
    product.summary.toLowerCase().includes(lower)
  );
}

export async function searchProducts(args: SearchProductsArgs): Promise<unknown> {
  const limit = Math.min(Math.max(args.limit ?? 5, 1), 10);

  let results = [...products];

  if (args.query) {
    results = results.filter((p) => matchesQuery(p, args.query!));
  }

  if (args.location) {
    const lower = args.location.toLowerCase();
    results = results.filter((p) => p.location.toLowerCase().includes(lower));
  }

  if (args.category) {
    const lower = args.category.toLowerCase();
    results = results.filter((p) => p.category.toLowerCase().includes(lower));
  }

  if (args.max_price !== undefined) {
    results = results.filter((p) => p.price <= args.max_price!);
  }

  return results.slice(0, limit).map((p) => ({
    id: p.id,
    title: p.title,
    location: p.location,
    category: p.category,
    price: p.price,
    currency: p.currency,
    rating: p.rating,
    reviews: p.reviews,
    duration: p.duration,
    summary: p.summary,
    badge: p.badge ?? null,
    url: `/products/${p.id}`,
  }));
}

export async function getProductDetails(args: GetProductDetailsArgs): Promise<unknown> {
  const product = getProductById(args.product_id);
  if (!product) {
    return { error: `Product with id "${args.product_id}" not found.` };
  }

  return {
    id: product.id,
    title: product.title,
    location: product.location,
    category: product.category,
    price: product.price,
    currency: product.currency,
    rating: product.rating,
    reviews: product.reviews,
    duration: product.duration,
    summary: product.summary,
    description: product.description ?? null,
    highlights: product.highlights,
    includes: product.includes,
    activities: product.activities ?? [],
    badge: product.badge ?? null,
    url: `/products/${product.id}`,
  };
}

export async function checkProductAvailability(args: CheckProductAvailabilityArgs): Promise<unknown> {
  const product = getProductById(args.product_id);
  if (!product) {
    return { error: `Product with id "${args.product_id}" not found.` };
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.date)) {
    return { error: "date must be in YYYY-MM-DD format." };
  }

  const travelers = Math.min(Math.max(Math.round(args.travelers), 1), 20);

  try {
    const options = await getAvailabilityService(args.product_id, args.date, travelers);
    return { date: args.date, travelers, product_id: args.product_id, options };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Availability check failed.",
    };
  }
}
