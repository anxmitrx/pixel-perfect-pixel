import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AdminProvider, useAdmin } from "@/lib/admin-context";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { CommandPalette } from "@/components/admin/CommandPalette";
import { OverviewTab } from "@/components/admin/tabs/OverviewTab";
import { OrdersTab } from "@/components/admin/tabs/OrdersTab";
import { ProductsTab } from "@/components/admin/tabs/ProductsTab";
import { PressureHubTab } from "@/components/admin/tabs/PressureHubTab";
import { BatchLabTab } from "@/components/admin/tabs/BatchLabTab";
import { CouponsTab } from "@/components/admin/tabs/CouponsTab";
import { CustomersTab } from "@/components/admin/tabs/CustomersTab";
import { AuditLogsTab } from "@/components/admin/tabs/AuditLogsTab";
import { Toaster } from "@/components/ui/sonner";
import { Lock, ShieldCheck, ArrowRight, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Juicé — Operations Console" },
      { name: "description", content: "Internal administrative control and fulfillment operations." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("juice_admin_authenticated") === "true";
      setIsAuthenticated(auth);
    }
  }, []);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (passcode === "2026" || passcode === "admin" || passcode === "") {
      setIsAuthenticated(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("juice_admin_authenticated", "true");
      }
    } else {
      setAuthError("Invalid Passcode. Enter '2026' or use Quick Access.");
    }
  };

  const handleQuickUnlock = () => {
    setIsAuthenticated(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("juice_admin_authenticated", "true");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("juice_admin_authenticated");
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-sans">
        <div className="flex items-center gap-2.5 text-xs text-muted-foreground font-medium animate-pulse">
          <span className="h-2 w-2 rounded-full bg-primary" />
          Loading Operations Console...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 font-sans">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-md space-y-6">
          <div className="text-center space-y-1.5">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background font-serif font-bold text-lg mb-3">
              J
            </div>
            <h1 className="font-serif text-xl font-bold text-foreground">
              Juicé Operations Console
            </h1>
            <p className="text-xs text-muted-foreground">
              Authorized access required for inventory and fulfillment.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                Operator Passcode
              </label>
              <div className="relative">
                <input
                  type={showPasscode ? "text" : "password"}
                  placeholder="PIN: 2026"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setAuthError("");
                  }}
                  className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-foreground font-mono text-center tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPasscode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {authError && (
                <p className="text-xs text-destructive font-medium mt-1.5 text-center">
                  {authError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-foreground py-2.5 text-xs font-semibold text-background hover:bg-foreground/90 transition shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>Authenticate Session</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          <div className="pt-3 border-t border-border">
            <button
              type="button"
              onClick={handleQuickUnlock}
              className="w-full rounded-lg border border-border bg-muted/40 py-2 text-xs font-medium text-foreground hover:bg-muted transition flex items-center justify-center gap-2"
            >
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Quick Login as Operator</span>
            </button>
          </div>
        </div>

        <a
          href="/"
          className="mt-6 text-xs text-muted-foreground hover:text-foreground transition underline"
        >
          Return to Storefront
        </a>
      </div>
    );
  }

  return <AdminContent onLogout={handleLogout} />;
}

function AdminContent({ onLogout }: { onLogout: () => void }) {
  const { activeTab } = useAdmin();
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans selection:bg-primary/30">
      {/* Systematic Left Sidebar */}
      <AdminSidebar onLogout={onLogout} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopBar onOpenCommandPalette={() => setIsPaletteOpen(true)} />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === "overview" && <OverviewTab />}
            {activeTab === "orders" && <OrdersTab />}
            {activeTab === "catalog" && <ProductsTab />}
            {activeTab === "pressure" && <PressureHubTab />}
            {activeTab === "batch-lab" && <BatchLabTab />}
            {activeTab === "coupons" && <CouponsTab />}
            {activeTab === "customers" && <CustomersTab />}
            {activeTab === "audit" && <AuditLogsTab />}
          </div>
        </main>
      </div>

      <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
    </div>
  );
}
