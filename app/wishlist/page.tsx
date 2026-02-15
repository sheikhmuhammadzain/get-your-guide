import PageScaffold from "@/components/PageScaffold";
import WishlistPageClient from "@/components/WishlistPageClient";

export default function WishlistPage() {
  return (
    <PageScaffold
      title="Wishlist"
      description="Save attractions and tours you want to revisit while planning your Turkey trip."
    >
      <WishlistPageClient />
    </PageScaffold>
  );
}
