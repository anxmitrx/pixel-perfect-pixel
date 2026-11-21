import React from "react";
import { useAdmin } from "@/lib/admin-context";
import {
  LayoutDashboard,
  ShoppingBag,
  Sparkles,
  Zap,
  FlaskConical,
  Ticket,
  Users,
  ScrollText,
} from "lucide-react";

export const AdminNavigation: React.FC = () => {
  const { activeTab, setActiveTab, orders, products, metrics } = useAdmin();

  const pendingOrdersCount = orders.filter(
    (o) => o.status === "pending" || o.status === "paid" || o.status === "queue_hold"
  ).length;

  const lowStockCount = products.filter((p) => p.stock <= p.minThreshold).length;

  const tabs = [
    {
      id: "overview",
      label: "Command Center",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "orders",
      label: "Orders & Rush Queue",
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : null,
      badgeColor: "bg-primary text-primary-foreground",
    },
    {
      id: "catalog",
      label: "Catalog & Scent Matrix",
      icon: Sparkles,
      badge: lowStockCount > 0 ? `${lowStockCount} low` : null,
      badgeColor: "bg-destructive/15 text-destructive font-semibold",
    },
    {
      id: "pressure",
      label: "Pressure & Drop Hub",
      icon: Zap,
      badge: metrics.flashDropMode ? "DROP ENGAGED" : `${metrics.rps} RPS`,
      badgeColor: metrics.flashDropMode
        ? "bg-hot text-destructive-foreground animate-pulse"
        : "bg-muted text-muted-foreground",
    },
    {
      id: "batch-lab",
      label: "Batch Lab & Aging",
      icon: FlaskConical,
      badge: null,
    },
    {
      id: "coupons",
      label: "Discounts & Drops",
      icon: Ticket,
      badge: null,
    },
    {
      id: "customers",
      label: "Fragrance VIPs",
      icon: Users,
      badge: null,
    },
    {
      id: "audit",
      label: "Audit Trail",
      icon: ScrollText,
      badge: null,
    },
  ];

  return (
    <nav className="border-b border-border/80 bg-card/60 backdrop-blur sticky top-[57px] z-30 overflow-x-auto scrollbar-none">
      <div className="mx-auto flex max-w-7xl items-center gap-1.5 px-4 py-2 md:px-8 min-w-max">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group flex items-center gap-2 rounded-2xl px-3.5 py-2 text-xs font-medium transition-all ${
                isActive
                  ? "bg-foreground text-background shadow-md shadow-foreground/10"
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              <Icon
                className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`pill px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                    isActive ? "bg-background/20 text-background" : tab.badgeColor
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

