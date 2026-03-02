import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  MapPin,
  Clock,
  Banknote,
  CalendarDays,
  ChevronRight,
  Tag,
  Star,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CurrencyAmount from "@/components/CurrencyAmount";
import { getAttractionBySlug } from "@/modules/attractions/attraction.repository";
import { products } from "@/lib/data";

export default async function AttractionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const attraction = await getAttractionBySlug(slug);

  if (!attraction) {
    notFound();
  }

  /* Find related tours from the products catalogue */
  const relatedProducts = products
    .filter((p) =>
      p.location.toLowerCase() === attraction.city.toLowerCase() ||
      attraction.tags.some((tag: string) => p.category.toLowerCase().includes(tag)),
    )
    .slice(0, 3);

  const bestMonthNames = attraction.bestVisitMonths
    .map((m: number) => new Date(2024, m - 1).toLocaleString("en", { month: "long" }))
    .join(", ");

  const isFree =
    attraction.ticketPriceRange.min === 0 &&
    attraction.ticketPriceRange.max === 0;

  return (
    <div className="min-h-screen bg-surface-muted text-text-heading">
      <Header />

      <main className="mx-auto max-w-300 px-4 py-10 md:px-6">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center gap-1.5 text-xs text-text-muted">
            <li>
              <Link href="/" className="transition-colors hover:text-brand">
                Home
              </Link>
            </li>
            <ChevronRight className="h-3 w-3" />
            <li>
              <Link href="/attractions" className="transition-colors hover:text-brand">
                Attractions
              </Link>
            </li>
            <ChevronRight className="h-3 w-3" />
            <li className="font-medium text-text-body truncate max-w-[200px]">
              {attraction.name}
            </li>
          </ol>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Left column */}
          <div>
            {/* Hero image */}
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-surface-subtle">
              <Image
                src={`https://picsum.photos/seed/${attraction.slug}/1200/675`}
                alt={attraction.name}
                fill
                className="object-cover"
                unoptimized
                priority
              />
              {attraction.popularityScore >= 90 && (
                <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-sm bg-brand-hover px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  Top Rated
                </div>
              )}
            </div>

            {/* Title & city */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-sm text-text-muted mb-2">
                <MapPin className="h-4 w-4 text-brand" />
                <span className="font-medium">
                  {attraction.city.charAt(0).toUpperCase() + attraction.city.slice(1)}, Turkey
                </span>
              </div>
              <h1 className="text-2xl font-bold text-text-primary leading-snug">
                {attraction.name}
              </h1>
            </div>

            {/* Tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              {attraction.tags.map((tag: string) => (
                <Link
                  key={tag}
                  href={`/attractions?tags=${tag}`}
                  className="inline-flex items-center gap-1 rounded-full border border-border-subtle px-3 py-1 text-xs font-medium text-text-muted transition-colors hover:border-brand hover:text-brand"
                >
                  <Tag className="h-3 w-3" />
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </Link>
              ))}
            </div>

            {/* Description */}
            <div className="mt-6 rounded-2xl border border-border-soft bg-surface-base p-5">
              <h2 className="mb-3 text-sm font-bold text-text-primary">About</h2>
              <p className="text-sm leading-relaxed text-text-body">
                {attraction.description}
              </p>
            </div>

            {/* Details grid */}
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border-soft bg-surface-base p-4">
                <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  <Clock className="h-3.5 w-3.5 text-brand" />
                  Duration
                </div>
                <p className="text-sm font-bold text-text-primary">
                  {attraction.avgDurationMin >= 60
                    ? `${Math.floor(attraction.avgDurationMin / 60)}h ${attraction.avgDurationMin % 60 > 0 ? `${attraction.avgDurationMin % 60}m` : ""}`
                    : `${attraction.avgDurationMin} min`}
                </p>
              </div>

              <div className="rounded-2xl border border-border-soft bg-surface-base p-4">
                <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  <CalendarDays className="h-3.5 w-3.5 text-brand" />
                  Hours
                </div>
                <p className="text-sm font-bold text-text-primary">
                  {attraction.openingHours}
                </p>
              </div>

              <div className="rounded-2xl border border-border-soft bg-surface-base p-4">
                <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  <Banknote className="h-3.5 w-3.5 text-brand" />
                  Entry
                </div>
                <p className="text-sm font-bold text-text-primary">
                  {isFree ? (
                    <span className="text-emerald-500">Free</span>
                  ) : (
                    <>
                      <CurrencyAmount
                        amount={attraction.ticketPriceRange.min}
                        baseCurrency={attraction.ticketPriceRange.currency}
                      />
                      {" – "}
                      <CurrencyAmount
                        amount={attraction.ticketPriceRange.max}
                        baseCurrency={attraction.ticketPriceRange.currency}
                      />
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Best months */}
            {bestMonthNames && (
              <div className="mt-4 rounded-2xl border border-border-soft bg-surface-base p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-1">
                  Best Time to Visit
                </p>
                <p className="text-sm font-medium text-text-body">{bestMonthNames}</p>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <aside className="space-y-4">
            {/* Back to city */}
            <div className="rounded-2xl border border-border-soft bg-surface-base p-5">
              <h3 className="mb-3 text-sm font-bold text-text-primary">
                Explore {attraction.city.charAt(0).toUpperCase() + attraction.city.slice(1)}
              </h3>
              <Link
                href={`/attractions?city=${attraction.city}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
              >
                <MapPin className="h-4 w-4" />
                All {attraction.city.charAt(0).toUpperCase() + attraction.city.slice(1)} Attractions
              </Link>
              <Link
                href="/planner"
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border-default px-4 py-2.5 text-sm font-medium text-text-body transition-colors hover:bg-surface-subtle"
              >
                Plan a Trip
              </Link>
            </div>

            {/* Related tours */}
            {relatedProducts.length > 0 && (
              <div className="rounded-2xl border border-border-soft bg-surface-base p-5">
                <h3 className="mb-4 text-sm font-bold text-text-primary">
                  Related Tours
                </h3>
                <div className="space-y-3">
                  {relatedProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="group flex gap-3 rounded-xl border border-border-soft p-3 transition-colors hover:border-brand/30 hover:bg-surface-subtle"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-subtle">
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="line-clamp-2 text-xs font-semibold text-text-primary group-hover:text-brand transition-colors">
                          {product.title}
                        </p>
                        <p className="mt-1 text-[11px] text-text-muted">{product.duration}</p>
                        <p className="mt-0.5 text-[11px] font-bold text-text-heading">
                          From {product.price} {product.currency}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/search?q=${encodeURIComponent(attraction.city)}`}
                  className="mt-3 inline-flex w-full items-center justify-center text-xs font-medium text-brand hover:underline"
                >
                  View all {attraction.city} tours →
                </Link>
              </div>
            )}
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
