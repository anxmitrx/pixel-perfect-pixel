import React, { useState, useEffect } from "react";
import { useAdmin } from "@/lib/admin-context";
import {
  Search,
  LayoutDashboard,
  ShoppingBag,
  Sparkles,
  Zap,
  FlaskConical,
  Ticket,
  Users,
  ScrollText,
  Flame,
  RotateCw,
  Download,
  X,
} from "lucide-react";

export const CommandPalette: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const {
    setActiveTab,
    toggleFlashDropMode,
    injectStressOrders,
    purgeEdgeCache,
    exportDatabaseJSON,
    products,
    orders,
  } = useAdmin();

  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent can toggle
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAction = (cb: () => void) => {
    cb();
    onClose();
  };

  const navActions = [
    { label: "Dashboard Overview", tab: "overview", icon: LayoutDashboard },
    { label: "Orders & Fulfillment", tab: "orders", icon: ShoppingBag },
    { label: "Catalog & Stock Inventory", tab: "catalog", icon: Sparkles },
    { label: "Traffic & Concurrency Operations", tab: "pressure", icon: Zap },
    { label: "Batch Maturation Lab", tab: "batch-lab", icon: FlaskConical },
    { label: "Promotions & Discounts", tab: "coupons", icon: Ticket },
    { label: "Customer Directory", tab: "customers", icon: Users },
    { label: "System Audit Trail", tab: "audit", icon: ScrollText },
  ];

  const quickActions = [
    {
      label: "Toggle Edge Catalog Protection",
      icon: Flame,
      action: toggleFlashDropMode,
      badge: "Edge",
    },
    {
      label: "Purge Edge Cache (Global 285 PoPs)",
      icon: RotateCw,
      action: purgeEdgeCache,
      badge: "CDN",
    },
    {
      label: "Export Full Database JSON",
      icon: Download,
      action: exportDatabaseJSON,
      badge: "Backup",
    },
  ];

  const filteredNav = navActions.filter((n) =>
    n.label.toLowerCase().includes(query.toLowerCase())
  );

  const filteredQuick = quickActions.filter((q) =>
    q.label.toLowerCase().includes(query.toLowerCase())
  );

  const matchedProducts = products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.sku.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 3);

  const matchedOrders = orders
    .filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(query.toLowerCase()) ||
        o.customerName.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 3);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-foreground/50 p-4 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-3xl border border-border bg-cream p-4 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-border pb-3 px-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command, product, or order number..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground"
          />
          <button onClick={onClose} className="pill p-1 text-muted-foreground hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="mt-3 max-h-96 overflow-y-auto space-y-4 text-xs pr-1">
          {/* Quick Operations */}
          {filteredQuick.length > 0 && (
            <div>
              <p className="px-2 py-1 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                System Commands
              </p>
              <div className="space-y-1">
                {filteredQuick.map((q) => {
                  const Icon = q.icon;
                  return (
                    <button
                      key={q.label}
                      onClick={() => handleAction(q.action)}
                      className="w-full rounded-2xl px-3 py-2 text-left hover:bg-muted flex items-center justify-between text-foreground transition"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 text-primary" />
                        <span className="font-semibold">{q.label}</span>
                      </div>
                      <span className="pill bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                        {q.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation */}
          {filteredNav.length > 0 && (
            <div>
              <p className="px-2 py-1 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                Navigate Sections
              </p>
              <div className="space-y-1">
                {filteredNav.map((n) => {
                  const Icon = n.icon;
                  return (
                    <button
                      key={n.label}
                      onClick={() =>
                        handleAction(() => setActiveTab(n.tab))
                      }
                      className="w-full rounded-2xl px-3 py-2 text-left hover:bg-muted flex items-center gap-2.5 text-foreground transition"
                    >
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span>{n.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Matched Products */}
          {matchedProducts.length > 0 && (
            <div>
              <p className="px-2 py-1 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                Products
              </p>
              <div className="space-y-1">
                {matchedProducts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() =>
                      handleAction(() => setActiveTab("catalog"))
                    }
                    className="w-full rounded-2xl px-3 py-2 text-left hover:bg-muted flex items-center justify-between text-foreground transition"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{p.name}</span>
                      <span className="font-mono text-muted-foreground">({p.sku})</span>
                    </div>
                    <span className="font-mono text-emerald-700 font-semibold">
                      ₹{p.price} · {p.stock} in stock
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Orders */}
          {matchedOrders.length > 0 && (
            <div>
              <p className="px-2 py-1 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                Orders
              </p>
              <div className="space-y-1">
                {matchedOrders.map((o) => (
                  <button
                    key={o.id}
                    onClick={() =>
                      handleAction(() => setActiveTab("orders"))
                    }
                    className="w-full rounded-2xl px-3 py-2 text-left hover:bg-muted flex items-center justify-between text-foreground transition"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono">{o.orderNumber}</span>
                      <span className="text-muted-foreground">{o.customerName}</span>
                    </div>
                    <span className="pill bg-muted px-2 py-0.5 text-[10px] uppercase font-semibold">
                      {o.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

