import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthCard from "@/components/auth/AuthCard";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-surface-muted text-text-heading">
      <Header />
      <main className="mx-auto max-w-300 px-4 py-8 md:py-14 md:px-6">
        <AuthCard mode="signin" />
      </main>
      <Footer />
    </div>
  );
}

