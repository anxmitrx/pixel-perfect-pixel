import React from "react";
import { useAdmin } from "@/lib/admin-context";
import {
  TrendingUp,
  ShoppingBag,
  IndianRupee,
  ShieldCheck,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Layers,
  ChevronRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const hourlyMetrics = [
  { hour: "14:00", sales: 18400, orders: 14, latency: 28 },
  { hour: "16:00", sales: 24200, orders: 19, latency: 31 },
  { hour: "18:00", sales: 38900, orders: 32, latency: 35 },
  { hour: "20:00", sales: 94800, orders: 78, latency: 42 },
  { hour: "21:00", sales: 62400, orders: 51, latency: 36 },
  { hour: "22:00", sales: 48900, orders: 39, latency: 33 },
  { hour: "23:00", sales: 34200, orders: 28, latency: 29 },
];

const categoryBreakdown = [
  { category: "Eau De Parfum (EDP)", share: 45, units: 142 },
  { category: "Pure Oil Attar", share: 25, units: 88 },
  { category: "Discovery & Gift Sets", share: 18, units: 54 },
  { category: "Extrait de Parfum", share: 12, units: 28 },
];

export const OverviewTab: React.FC = () => {
  const { products, orders, metrics, setActiveTab, quickAdjustStock } = useAdmin();

  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.status !== "cancelled" ? o.total : 0),
    0
  );
  const paidOrders = orders.filter(
    (o) => o.status === "paid" || o.status === "packing" || o.status === "shipped" || o.status === "delivered"
  );
  const aov = paidOrders.length > 0 ? Math.round(totalRevenue / paidOrders.length) : 0;
  const lowStock = products.filter((p) => p.stock <= p.minThreshold);

  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  return (
    <div className="space-y-6">
      {/* Top Overview KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Gross Revenue</span>
            <span className="text-[11px] font-mono font-medium text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight className="h-3 w-3" />
              +18.4%
            </span>
          </div>
          <div className="mt-2">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              {inr(totalRevenue)}
            </h2>
            <p className="text-[11px] text-muted-foreground mt-1">
              From {orders.length} total captured orders
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Orders Processed</span>
            <span className="text-[11px] font-mono font-medium text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight className="h-3 w-3" />
              +12.1%
            </span>
          </div>
          <div className="mt-2">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              {orders.length}
            </h2>
            <p className="text-[11px] text-muted-foreground mt-1">
              {paidOrders.length} fulfilled · {orders.filter((o) => o.status === "queue_hold").length} held in queue
            </p>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Average Order Value</span>
            <span className="text-[11px] font-mono font-medium text-muted-foreground">
              Target: ₹1,500
            </span>
          </div>
          <div className="mt-2">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              {inr(aov)}
            </h2>
            <p className="text-[11px] text-emerald-600 mt-1 font-medium">
              +₹340 above baseline target
            </p>
          </div>
        </div>

        {/* Edge Cache & Latency */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Cache Efficiency</span>
            <span className="text-[11px] font-mono text-emerald-600 font-medium">
              Optimal
            </span>
          </div>
          <div className="mt-2">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              {metrics.edgeCacheHitRate}%
            </h2>
            <p className="text-[11px] text-muted-foreground mt-1 font-mono">
              P99: {metrics.p99LatencyMs}ms · Origin Load: {metrics.originServerLoad}%
            </p>
          </div>
        </div>
      </div>

      {/* Main Analytics: Revenue Velocity Chart & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Velocity Chart */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Hourly Sales & Throughput</h3>
              <p className="text-xs text-muted-foreground">Captured gross revenue across 24h timeline</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-foreground">
                <span className="h-2 w-2 rounded-full bg-foreground"></span>
                <span>Revenue (₹)</span>
              </span>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyMetrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="#888888" fontSize={11} tickLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="rounded-lg border border-border bg-card p-2.5 shadow-md text-xs">
                          <p className="font-bold text-foreground">{d.hour}</p>
                          <p className="font-mono text-emerald-700 font-semibold mt-0.5">
                            Sales: {inr(d.sales)}
                          </p>
                          <p className="text-muted-foreground text-[11px]">Orders: {d.orders}</p>
                          <p className="text-muted-foreground font-mono text-[10px]">Latency: {d.latency}ms</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="var(--color-foreground)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#revenueGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Category Distribution */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Fragrance Category Share</h3>
            <p className="text-xs text-muted-foreground mb-4">Volume breakdown by concentration</p>

            <div className="space-y-3.5">
              {categoryBreakdown.map((cat) => (
                <div key={cat.category} className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="font-medium text-foreground">{cat.category}</span>
                    <span className="font-mono text-muted-foreground font-semibold">
                      {cat.share}% ({cat.units} units)
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-foreground"
                      style={{ width: `${cat.share}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border mt-4">
            <button
              onClick={() => setActiveTab("catalog")}
              className="w-full py-2 rounded-lg border border-border text-xs font-semibold hover:bg-muted transition text-center"
            >
              Manage Catalog Inventory →
            </button>
          </div>
        </div>
      </div>

      {/* Low Inventory Warnings (If any) */}
      {lowStock.length > 0 && (
        <div className="rounded-xl border border-amber-300/80 bg-amber-50/60 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
              <AlertCircle className="h-4 w-4 text-amber-700" />
              <span>Low Inventory Threshold Alerts ({lowStock.length} Fragrances)</span>
            </div>
            <button
              onClick={() => setActiveTab("catalog")}
              className="text-xs font-semibold text-amber-900 hover:underline"
            >
              View Inventory Table
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {lowStock.map((p) => (
              <div
                key={p.id}
                className="rounded-lg bg-card border border-amber-200 p-3 flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-foreground">{p.name}</p>
                  <p className="text-muted-foreground text-[11px] font-mono">
                    Remaining: <b className="text-amber-700">{p.stock}</b> (Min: {p.minThreshold})
                  </p>
                </div>
                <button
                  onClick={() => quickAdjustStock(p.id, 25)}
                  className="px-2.5 py-1 rounded bg-muted hover:bg-muted/80 text-[11px] font-semibold text-foreground transition"
                  title="Restock +25 bottles"
                >
                  +25 Stock
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders Overview */}
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Recent Orders</h3>
            <p className="text-xs text-muted-foreground">Latest transactions across the storefront</p>
          </div>
          <button
            onClick={() => setActiveTab("orders")}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition flex items-center gap-1"
          >
            <span>View All ({orders.length})</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="divide-y divide-border text-xs">
          {orders.slice(0, 5).map((order) => (
            <div
              key={order.id}
              className="p-3.5 flex items-center justify-between hover:bg-muted/30 transition"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-foreground">{order.orderNumber}</span>
                <div>
                  <p className="font-medium text-foreground">{order.customerName}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {order.items.map((it) => `${it.quantity}x ${it.name}`).join(", ")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-mono font-bold text-foreground">{inr(order.total)}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold font-mono uppercase ${
                    order.status === "paid"
                      ? "bg-emerald-100 text-emerald-800"
                      : order.status === "queue_hold"
                      ? "bg-amber-100 text-amber-800"
                      : order.status === "shipped"
                      ? "bg-sky-100 text-sky-800"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {order.status.replace("_", " ")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
