import React from "react";
import { useAdmin } from "@/lib/admin-context";
import {
  LayoutDashboard,
  ShoppingBag,
  Sparkles,
  Cpu,
  FlaskConical,
  Ticket,
  Users,
  ScrollText,
  LogOut,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

export const AdminSidebar: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { activeTab, setActiveTab, orders, products, metrics } = useAdmin();

  const pendingCount = orders.filter(
    (o) => o.status === "pending" || o.status === "paid" || o.status === "queue_hold"
  ).length;

  const lowStockCount = products.filter((p) => p.stock <= p.minThreshold).length;

  const navGroups = [
    {
      group: "MAIN",
      items: [
        {
          id: "overview",
          label: "Dashboard",
          icon: LayoutDashboard,
          badge: null,
        },
      ],
    },
    {
      group: "COMMERCE",
      items: [
        {
          id: "orders",
          label: "Orders & Fulfillment",
          icon: ShoppingBag,
          badge: pendingCount > 0 ? pendingCount : null,
          badgeVariant: "neutral",
        },
        {
          id: "catalog",
          label: "Catalog & Stock",
          icon: Sparkles,
          badge: lowStockCount > 0 ? lowStockCount : null,
          badgeVariant: "warning",
        },
        {
          id: "coupons",
          label: "Promotions & Codes",
          icon: Ticket,
          badge: null,
        },
        {
          id: "customers",
          label: "Customers & VIPs",
          icon: Users,
          badge: null,
        },
      ],
    },
    {
      group: "INFRASTRUCTURE & OPS",
      items: [
        {
          id: "pressure",
          label: "Traffic & Concurrency",
          icon: Cpu,
          badge: metrics.flashDropMode ? "Active" : null,
          badgeVariant: "active",
        },
        {
          id: "batch-lab",
          label: "Batch Maturation Lab",
          icon: FlaskConical,
          badge: null,
        },
        {
          id: "audit",
          label: "Audit Trail",
          icon: ScrollText,
          badge: null,
        },
      ],
    },
  ];

  return (
    <aside className="w-64 border-r border-border/80 bg-card flex flex-col justify-between shrink-0 select-none">
      <div>
        {/* Brand Header */}
        <div className="h-16 border-b border-border/80 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background font-serif font-bold text-sm">
              J
            </div>
            <div>
              <span className="font-serif text-sm font-bold tracking-tight text-foreground block">
                Juicé Console
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                v2.4.0 · Production
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="p-4 space-y-6">
          {navGroups.map((grp) => (
            <div key={grp.group} className="space-y-1">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block mb-2">
                {grp.group}
              </span>
              <div className="space-y-0.5">
                {grp.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-foreground text-background font-semibold"
                          : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge !== null && (
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                            isActive
                              ? "bg-background/20 text-background"
                              : item.badgeVariant === "warning"
                              ? "bg-amber-100 text-amber-900"
                              : item.badgeVariant === "active"
                              ? "bg-primary/20 text-emerald-800"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Operator Status & Logout Footer */}
      <div className="border-t border-border/80 p-4 bg-muted/20">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center font-bold text-foreground text-xs">
              AD
            </div>
            <div>
              <p className="font-semibold text-foreground text-[11px] leading-tight">Admin Console</p>
              <p className="text-[10px] text-muted-foreground">Lead Operations</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="End Session"
            className="p-1.5 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

