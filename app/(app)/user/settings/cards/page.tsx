import { Lock } from "lucide-react";

export const metadata = { title: "Saved Cards – Settings" };

export default function CardsPage() {
    return (
        <section>
            <h2 className="mb-4 text-base font-bold text-text-primary">Saved Cards</h2>
            <div className="border-t border-border-default pt-5">
                <div className="flex items-center gap-3 rounded-xl border border-dashed border-border-strong p-5 text-sm text-text-subtle">
                    <Lock className="h-4 w-4 shrink-0" />
                    No saved cards yet. Cards will appear here after checkout.
                </div>
            </div>
        </section>
    );
}
