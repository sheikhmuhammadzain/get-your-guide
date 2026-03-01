import Link from "next/link";
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

const CITIES = ["istanbul", "cappadocia", "ephesus", "pamukkale", "antalya", "bodrum"];

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
    limit: 24,
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

      <main className="mx-auto max-w-[1200px] px-4 py-10 md:px-6">
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
        <div className="mb-8 space-y-5 rounded-2xl border border-border-soft bg-white p-5">
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
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${!city
                    ? "border-brand bg-brand text-white"
                    : "border-border-default bg-white text-text-body hover:bg-surface-subtle"
                  }`}
              >
                All Cities
              </Link>
              {CITIES.map((c) => (
                <Link
                  key={c}
                  href={buildHref(c, activeTags.length ? activeTags : undefined)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${city === c
                      ? "border-brand bg-brand text-white"
                      : "border-border-default bg-white text-text-body hover:bg-surface-subtle"
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
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${activeTags.length === 0
                    ? "border-brand bg-brand text-white"
                    : "border-border-default bg-white text-text-body hover:bg-surface-subtle"
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
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${isActive
                        ? "border-brand bg-brand text-white"
                        : "border-border-default bg-white text-text-body hover:bg-surface-subtle"
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
                    {" "}
                    in{" "}
                    <span className="font-semibold text-text-primary">
                      {city.charAt(0).toUpperCase() + city.slice(1)}
                    </span>
                  </>
                ) : null}
                {activeTags.length > 0 ? (
                  <>
                    {" "}
                    tagged{" "}
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
              <article
                key={item.id}
                className="group flex flex-col rounded-2xl border border-border-soft bg-white p-5 transition-colors hover:border-brand/30"
              >
                {/* Title & City */}
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h2 className="text-base font-bold leading-snug text-text-primary group-hover:text-brand transition-colors">
                    {item.name}
                  </h2>
                  {item.popularityScore >= 90 && (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      Top Rated
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="mb-4 flex-1 text-sm leading-relaxed text-text-muted line-clamp-2">
                  {item.description}
                </p>

                {/* Metadata chips */}
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-surface-subtle px-2 py-1 text-[11px] font-medium text-text-body">
                    <MapPin className="h-3 w-3 text-brand" />
                    {item.city.charAt(0).toUpperCase() + item.city.slice(1)}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-surface-subtle px-2 py-1 text-[11px] font-medium text-text-body">
                    <Clock className="h-3 w-3 text-brand" />
                    {item.avgDurationMin} min
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-surface-subtle px-2 py-1 text-[11px] font-medium text-text-body">
                    🕐 {item.openingHours}
                  </span>
                </div>

                {/* Tags */}
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={buildHref(city, [tag])}
                      className="rounded-full border border-border-subtle px-2 py-0.5 text-[10px] font-medium text-text-muted transition-colors hover:border-brand hover:text-brand"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>

                {/* Price + Best Months */}
                <div className="flex items-center justify-between border-t border-border-subtle pt-3">
                  <div className="text-sm font-bold text-text-primary">
                    <CurrencyAmount
                      amount={item.ticketPriceRange?.min ?? 0}
                      baseCurrency={item.ticketPriceRange?.currency ?? "TRY"}
                    />
                    {" — "}
                    <CurrencyAmount
                      amount={item.ticketPriceRange?.max ?? 0}
                      baseCurrency={item.ticketPriceRange?.currency ?? "TRY"}
                    />
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
              </article>
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
              className="inline-flex items-center gap-2 rounded-lg border border-border-default px-5 py-2.5 text-sm font-medium text-text-body transition-colors hover:bg-surface-subtle"
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
