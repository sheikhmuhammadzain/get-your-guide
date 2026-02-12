import CheckoutPageClient from "@/components/commerce/CheckoutPageClient";
import PageScaffold from "@/components/PageScaffold";

export default function CheckoutPage() {
  return (
    <PageScaffold title="Checkout" description="Complete your booking details and finalize payment.">
      <CheckoutPageClient />
    </PageScaffold>
  );
}
