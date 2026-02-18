import PageScaffold from "@/components/PageScaffold";
import SearchResultsClient from "@/components/SearchResultsClient";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const q = (params.q ?? "").trim();

  return (
    <PageScaffold
      title="Search Experiences"
      description="Find matching tours and activities with smart suggestions."
    >
      <SearchResultsClient initialQuery={q} />
    </PageScaffold>
  );
}
