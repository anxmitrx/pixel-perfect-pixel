import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { UserProfileDrawer } from "@/components/UserProfileDrawer";
import logo from "@/assets/logo.png";
import { User, ShoppingBag, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Juicé Profile & Juicy Club Rewards" },
      { name: "description", content: "Track orders, view your scent wardrobe, and redeem Juicy Drops points." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <a href="/" className="flex items-center gap-2 text-xs font-semibold hover:text-hot transition">
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Store</span>
          </a>
          <a href="/">
            <img src={logo} alt="Juicé Fragrances" className="h-5 object-contain" />
          </a>
          <div className="w-20"></div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-12">
        <UserProfileDrawer isOpen={true} onClose={() => window.location.href = "/"} />
      </main>
    </div>
  );
}

