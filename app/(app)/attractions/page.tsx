import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Clock,
  Tag,
  Star,
  ChevronRight,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import CurrencyAmount from "@/components/CurrencyAmount";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { listAttractionsService, supportedInterestTags } from "@/modules/attractions/attraction.service";

const CITIES = [
  "istanbul",
  "cappadocia",
  "ephesus",
  "pamukkale",
  "antalya",
  "bodrum",
  "bursa",
  "ankara",
  "trabzon",
  "konya",
  "canakkale",
];

interface SearchParams {
  city?: string;
  tags?: string;
}

export default async function AttractionsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const city = params.city?.trim().toLowerCase() || undefined;
  const tagsRaw = params.tags?.trim().toLowerCase() || undefined;
  const activeTags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];

  const page = await listAttractionsService({
    city,
    tags: tagsRaw,
    limit: 36,
  });

  function buildHref(newCity?: string, newTags?: string[]) {
    const p = new URLSearchParams();
    if (newCity) p.set("city", newCity);
    if (newTags?.length) p.set("tags", newTags.join(","));
    const qs = p.toString();
    return `/attractions${qs ? `?${qs}` : ""}`;
  }

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
            <li className="font-medium text-text-body">Attractions</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary">
            Turkey Attractions
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Explore curated attractions across Turkey — filter by city and
            interest to find your perfect experience.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-5 rounded-2xl border border-border-soft bg-surface-base p-5">
          <div className="flex items-center gap-2 text-sm font-bold text-text-primary">
            <SlidersHorizontal className="h-4 w-4 text-brand" />
            Filters
          </div>

          {/* City chips */}
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              City
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href={buildHref(undefined, activeTags.length ? activeTags : undefined)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  !city
                    ? "border-brand bg-brand text-white"
                    : "border-border-default bg-surface-base text-text-body hover:bg-surface-subtle"
                }`}
              >
                All Cities
              </Link>
              {CITIES.map((c) => (
                <Link
                  key={c}
                  href={buildHref(c, activeTags.length ? activeTags : undefined)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    city === c
                      ? "border-brand bg-brand text-white"
                      : "border-border-default bg-surface-base text-text-body hover:bg-surface-subtle"
                  }`}
                >
                  <MapPin className="h-3 w-3" />
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </Link>
              ))}
            </div>
          </div>

          {/* Tag chips */}
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Interest
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href={buildHref(city, undefined)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeTags.length === 0
                    ? "border-brand bg-brand text-white"
                    : "border-border-default bg-surface-base text-text-body hover:bg-surface-subtle"
                }`}
              >
                All Interests
              </Link>
              {supportedInterestTags.map((tag) => {
                const isActive = activeTags.includes(tag);
                const nextTags = isActive
                  ? activeTags.filter((t) => t !== tag)
                  : [...activeTags, tag];

                return (
                  <Link
                    key={tag}
                    href={buildHref(city, nextTags.length ? nextTags : undefined)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      isActive
                        ? "border-brand bg-brand text-white"
                        : "border-border-default bg-surface-base text-text-body hover:bg-surface-subtle"
                    }`}
                  >
                    <Tag className="h-3 w-3" />
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Active filter summary */}
          {(city || activeTags.length > 0) && (
            <div className="flex items-center justify-between border-t border-border-subtle pt-3">
              <p className="text-xs text-text-muted">
                Showing{" "}
                <span className="font-semibold text-text-primary">
                  {page.data.length}
                </span>{" "}
                {page.data.length === 1 ? "attraction" : "attractions"}
                {city ? (
                  <>
                    {" "}in{" "}
                    <span className="font-semibold text-text-primary">
                      {city.charAt(0).toUpperCase() + city.slice(1)}
                    </span>
                  </>
                ) : null}
                {activeTags.length > 0 ? (
                  <>
                    {" "}tagged{" "}
                    <span className="font-semibold text-text-primary">
                      {activeTags.join(", ")}
                    </span>
                  </>
                ) : null}
              </p>
              <Link
                href="/attractions"
                className="text-xs font-medium text-brand hover:underline"
              >
                Clear All
              </Link>
            </div>
          )}
        </div>

        {/* Results */}
        {page.data.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-subtle">
              <Search className="h-7 w-7 text-text-subtle" />
            </div>
            <h2 className="text-lg font-bold text-text-primary">
              No attractions found
            </h2>
            <p className="mt-1 max-w-sm text-sm text-text-muted">
              Try adjusting your filters or{" "}
              <Link href="/attractions" className="font-medium text-brand hover:underline">
                view all attractions
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {page.data.map((item) => (
              <Link
                key={item.id}
                href={`/attractions/${item.slug}`}
                className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border-soft bg-surface-base transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-surface-subtle">
                  <Image
                    src={`https://picsum.photos/seed/${item.slug}/800/600`}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                  {item.popularityScore >= 90 && (
                    <div className="absolute left-3 top-3 flex items-center gap-1 rounded-sm bg-brand-hover px-2 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-sm">
                      <Star className="h-3 w-3 fill-current" />
                      Top Rated
                    </div>
                  )}
                  <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-surface-base/90 px-2.5 py-1 text-[11px] font-semibold text-text-body backdrop-blur-sm">
                    <MapPin className="h-3 w-3 text-brand" />
                    {item.city.charAt(0).toUpperCase() + item.city.slice(1)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-text-heading transition-colors group-hover:text-brand">
                    {item.name}
                  </h3>

                  <p className="line-clamp-2 text-sm leading-relaxed text-text-muted">
                    {item.description}
                  </p>

                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-text-body">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3 text-brand" />
                      {item.avgDurationMin} min
                    </span>
                    <span className="text-border-default">·</span>
                    <span>{item.openingHours}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border-subtle px-2 py-0.5 text-[10px] font-medium text-text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Price row */}
                  <div className="mt-auto flex items-center justify-between border-t border-border-subtle pt-3">
                    <div className="text-sm font-bold text-text-heading">
                      {item.ticketPriceRange?.min === 0 && item.ticketPriceRange?.max === 0 ? (
                        <span className="text-emerald-500 font-semibold">Free entry</span>
                      ) : (
                        <>
                          <CurrencyAmount
                            amount={item.ticketPriceRange?.min ?? 0}
                            baseCurrency={item.ticketPriceRange?.currency ?? "TRY"}
                          />
                          {" — "}
                          <CurrencyAmount
                            amount={item.ticketPriceRange?.max ?? 0}
                            baseCurrency={item.ticketPriceRange?.currency ?? "TRY"}
                          />
                        </>
                      )}
                    </div>
                    {item.bestVisitMonths?.length > 0 && (
                      <span className="text-[10px] text-text-subtle">
                        Best:{" "}
                        {item.bestVisitMonths
                          .slice(0, 3)
                          .map((m) =>
                            new Date(2024, m - 1).toLocaleString("en", {
                              month: "short",
                            }),
                          )
                          .join(", ")}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination: Load more */}
        {page.nextCursor && (
          <div className="mt-8 flex justify-center">
            <Link
              href={`/attractions?${new URLSearchParams({
                ...(city ? { city } : {}),
                ...(tagsRaw ? { tags: tagsRaw } : {}),
                cursor: page.nextCursor,
              }).toString()}`}
              className="inline-flex items-center gap-2 rounded-lg border border-border-default bg-surface-base px-5 py-2.5 text-sm font-medium text-text-body transition-colors hover:bg-surface-subtle"
            >
              Load More
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
