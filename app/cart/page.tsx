import CartPageClient from "@/components/commerce/CartPageClient";
import PageScaffold from "@/components/PageScaffold";

export default function CartPage() {
  return (
    <PageScaffold
      title="Cart"
      description="Review selected tours and experiences before final booking."
    >
      <CartPageClient />
    </PageScaffold>
  );
}
