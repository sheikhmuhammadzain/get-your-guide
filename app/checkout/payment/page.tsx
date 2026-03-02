import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheckoutPaymentClient from "@/components/commerce/CheckoutPaymentClient";

export const metadata = {
  title: "Payment — Smart Trip AI",
};

export default function CheckoutPaymentPage() {
  return (
    <div className="min-h-screen bg-surface-muted text-text-heading">
      <Header />
      <main className="mx-auto max-w-300 px-4 py-10 md:px-6">
        <CheckoutPaymentClient />
      </main>
      <Footer />
    </div>
  );
}
