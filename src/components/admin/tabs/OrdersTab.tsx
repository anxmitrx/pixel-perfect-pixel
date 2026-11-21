import React, { useState, useMemo } from "react";
import { useAdmin } from "@/lib/admin-context";
import type { AdminOrder, OrderStatus } from "@/types/admin";
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  AlertCircle,
  Download,
  X,
  Printer,
  ChevronRight,
  ExternalLink,
  Flame,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

export const OrdersTab: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    bulkUpdateOrderStatus,
    assignCourier,
    deleteOrder,
    injectStressOrders,
  } = useAdmin();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [activeOrderModal, setActiveOrderModal] = useState<AdminOrder | null>(null);

  // Tracking assign form inside modal
  const [courierChoice, setCourierChoice] = useState<AdminOrder["courier"]>("Bluedart Express");
  const [trackingNumberInput, setTrackingNumberInput] = useState("");

  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus =
        statusFilter === "all" ? true : o.status === statusFilter;
      const q = search.toLowerCase();
      const matchesSearch =
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.email.toLowerCase().includes(q) ||
        o.phone.toLowerCase().includes(q) ||
        o.address.city.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, search]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(filteredOrders.map((o) => o.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkStatus = (status: OrderStatus) => {
    if (selectedOrders.length === 0) return;
    bulkUpdateOrderStatus(selectedOrders, status);
    setSelectedOrders([]);
  };

  const exportSelectedCSV = () => {
    const listToExport =
      selectedOrders.length > 0
        ? orders.filter((o) => selectedOrders.includes(o.id))
        : filteredOrders;

    const headers = [
      "Order Number",
      "Date",
      "Customer",
      "Email",
      "Phone",
      "City",
      "State",
      "Pincode",
      "Items",
      "Subtotal",
      "Discount",
      "Total",
      "Status",
      "Payment Method",
      "Courier",
      "Tracking Number",
    ];

    const rows = listToExport.map((o) => [
      o.orderNumber,
      o.createdAt,
      `"${o.customerName}"`,
      o.email,
      o.phone,
      `"${o.address.city}"`,
      `"${o.address.state}"`,
      o.address.pincode,
      `"${o.items.map((i) => `${i.quantity}x ${i.name}`).join("; ")}"`,
      o.subtotal,
      o.discount,
      o.total,
      o.status,
      o.paymentMethod,
      o.courier || "",
      o.trackingNumber || "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `juice-orders-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${listToExport.length} orders to CSV`);
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold font-serif text-foreground">
            Orders & Fulfillment
          </h2>
          <p className="text-xs text-muted-foreground">
            Order lifecycle processing, carrier airway bills, and bulk fulfillment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportSelectedCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted transition shadow-xs"
          >
            <Download className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
          {[
            { id: "all", label: "All Orders", count: orders.length },
            {
              id: "queue_hold",
              label: "Rush Hold",
              count: orders.filter((o) => o.status === "queue_hold").length,
              hot: true,
            },
            { id: "paid", label: "Paid", count: orders.filter((o) => o.status === "paid").length },
            { id: "packing", label: "Packing", count: orders.filter((o) => o.status === "packing").length },
            { id: "shipped", label: "Shipped", count: orders.filter((o) => o.status === "shipped").length },
            { id: "delivered", label: "Delivered", count: orders.filter((o) => o.status === "delivered").length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`pill flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition ${
                statusFilter === tab.id
                  ? "bg-foreground text-background"
                  : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground border border-border"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`pill px-1.5 py-0.2 text-[10px] font-bold ${
                  tab.hot && tab.count > 0
                    ? "bg-hot text-destructive-foreground"
                    : statusFilter === tab.id
                    ? "bg-background/20 text-background"
                    : "bg-muted text-foreground"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search #, name, city, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-border bg-card pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Bulk Action Sticky Bar (Visible when items selected) */}
      {selectedOrders.length > 0 && (
        <div className="rounded-2xl bg-foreground text-background px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xl animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="pill bg-primary px-2.5 py-0.5 text-foreground font-bold">
              {selectedOrders.length}
            </span>
            <span>Selected for batch dispatch</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleBulkStatus("packing")}
              className="pill bg-card/20 hover:bg-card/30 px-3 py-1.5 text-xs font-medium transition"
            >
              Mark Packing
            </button>
            <button
              onClick={() => handleBulkStatus("shipped")}
              className="pill bg-primary text-primary-foreground hover:bg-kiwi px-3.5 py-1.5 text-xs font-semibold transition"
            >
              Dispatch (Bluedart Air)
            </button>
            <button
              onClick={() => handleBulkStatus("delivered")}
              className="pill bg-card/20 hover:bg-card/30 px-3 py-1.5 text-xs font-medium transition"
            >
              Mark Delivered
            </button>
            <button
              onClick={() => setSelectedOrders([])}
              className="pill p-1.5 text-background/60 hover:text-background"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
              <tr>
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      filteredOrders.length > 0 &&
                      selectedOrders.length === filteredOrders.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-border"
                  />
                </th>
                <th className="p-4">Order #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Juices & Bottles</th>
                <th className="p-4">Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4">Courier</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-muted-foreground">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isSelected = selectedOrders.includes(order.id);
                  return (
                    <tr
                      key={order.id}
                      className={`transition-colors hover:bg-muted/30 ${
                        isSelected ? "bg-muted/50" : ""
                      }`}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(order.id)}
                          className="rounded border-border"
                        />
                      </td>

                      {/* Order Number */}
                      <td className="p-4 font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-foreground">{order.orderNumber}</span>
                          {order.isRushOrder && (
                            <span className="pill bg-hot text-destructive-foreground px-1.5 py-0.2 text-[9px] font-bold">
                              RUSH
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(order.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="p-4">
                        <p className="font-semibold text-foreground">{order.customerName}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {order.address.city}, {order.address.pincode}
                        </p>
                      </td>

                      {/* Items */}
                      <td className="p-4 max-w-xs">
                        <div className="space-y-0.5">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                              <span className="pill bg-muted px-1.5 py-0.2 font-mono text-[10px] font-bold">
                                {item.quantity}x
                              </span>
                              <span className="truncate text-foreground">{item.name}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="p-4 font-bold text-foreground">
                        {inr(order.total)}
                        {order.discount > 0 && (
                          <div className="text-[10px] text-emerald-600 font-normal">
                            Saved {inr(order.discount)}
                          </div>
                        )}
                      </td>

                      {/* Payment */}
                      <td className="p-4">
                        <span className="pill border border-border bg-card px-2 py-0.5 text-[11px] font-mono">
                          {order.paymentMethod}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span
                          className={`pill px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase ${
                            order.status === "paid"
                              ? "bg-emerald-100 text-emerald-800"
                              : order.status === "queue_hold"
                              ? "bg-amber-100 text-amber-800 animate-pulse"
                              : order.status === "packing"
                              ? "bg-indigo-100 text-indigo-800"
                              : order.status === "shipped"
                              ? "bg-sky-100 text-sky-800"
                              : order.status === "delivered"
                              ? "bg-teal-100 text-teal-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {order.status.replace("_", " ")}
                        </span>
                      </td>

                      {/* Courier */}
                      <td className="p-4">
                        {order.courier ? (
                          <div className="font-mono text-[11px]">
                            <p className="font-semibold text-foreground">{order.courier}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {order.trackingNumber || "Assigned"}
                            </p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-[11px]">—</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            setActiveOrderModal(order);
                            setTrackingNumberInput(order.trackingNumber || "");
                          }}
                          className="pill border border-border bg-card px-3 py-1 font-medium hover:bg-muted transition text-foreground"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal / Drawer */}
      {activeOrderModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm animate-in fade-in"
          onClick={() => setActiveOrderModal(null)}
        >
          <div
            className="w-full max-w-2xl rounded-3xl border border-border bg-cream p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-2xl font-bold">
                    Order {activeOrderModal.orderNumber}
                  </h3>
                  {activeOrderModal.isRushOrder && (
                    <span className="pill bg-hot text-destructive-foreground px-2 py-0.5 text-xs font-bold">
                      Rush Queue
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Placed on {new Date(activeOrderModal.createdAt).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => setActiveOrderModal(null)}
                className="pill p-2 text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-6 space-y-6 text-xs">
              {/* Customer & Shipping Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl bg-card p-4 border border-border">
                <div>
                  <h4 className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider mb-2">
                    Customer Information
                  </h4>
                  <p className="font-bold text-sm text-foreground">
                    {activeOrderModal.customerName}
                  </p>
                  <p className="text-muted-foreground">{activeOrderModal.email}</p>
                  <p className="text-muted-foreground">{activeOrderModal.phone}</p>
                </div>

                <div>
                  <h4 className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider mb-2">
                    Delivery Address
                  </h4>
                  <p className="text-foreground">{activeOrderModal.address.street}</p>
                  <p className="text-foreground">
                    {activeOrderModal.address.city}, {activeOrderModal.address.state} —{" "}
                    <b>{activeOrderModal.address.pincode}</b>
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <div className="rounded-2xl bg-card border border-border overflow-hidden">
                <div className="bg-muted/40 px-4 py-2 font-bold text-muted-foreground text-[11px]">
                  Bottles & Fragrances
                </div>
                <div className="divide-y divide-border p-2">
                  {activeOrderModal.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2">
                      <div className="flex items-center gap-3">
                        <span className="pill bg-primary/20 px-2 py-0.5 font-bold font-mono">
                          {item.quantity}x
                        </span>
                        <div>
                          <p className="font-bold text-foreground">{item.name}</p>
                          <p className="text-muted-foreground text-[10px]">{item.cat} Formulation</p>
                        </div>
                      </div>
                      <p className="font-bold text-foreground font-mono">
                        {inr(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Subtotal & Total */}
                <div className="border-t border-border bg-muted/20 p-4 space-y-1">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{inr(activeOrderModal.subtotal)}</span>
                  </div>
                  {activeOrderModal.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount</span>
                      <span>-{inr(activeOrderModal.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-serif text-base font-bold text-foreground pt-1 border-t border-border">
                    <span>Total Amount</span>
                    <span>{inr(activeOrderModal.total)}</span>
                  </div>
                </div>
              </div>

              {/* Status & Courier Operations */}
              <div className="rounded-2xl bg-card p-4 border border-border space-y-4">
                <h4 className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider">
                  Fulfillment Status & Airway Bill
                </h4>

                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      "queue_hold",
                      "paid",
                      "packing",
                      "shipped",
                      "delivered",
                      "cancelled",
                    ] as OrderStatus[]
                  ).map((st) => (
                    <button
                      key={st}
                      onClick={() => updateOrderStatus(activeOrderModal.id, st)}
                      className={`pill px-3 py-1 font-semibold transition ${
                        activeOrderModal.status === st
                          ? "bg-foreground text-background"
                          : "border border-border bg-muted/40 hover:bg-muted"
                      }`}
                    >
                      {st.replace("_", " ")}
                    </button>
                  ))}
                </div>

                {/* Courier Assignment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground mb-1 uppercase">
                      Courier Partner
                    </label>
                    <select
                      value={courierChoice}
                      onChange={(e) => setCourierChoice(e.target.value as any)}
                      className="w-full rounded-xl border border-border bg-background px-3 py-1.5 focus:outline-none"
                    >
                      <option value="Bluedart Express">Bluedart Express</option>
                      <option value="Delhivery Air">Delhivery Air</option>
                      <option value="Shiprocket Priority">Shiprocket Priority</option>
                      <option value="India Post">India Post Speed Post</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground mb-1 uppercase">
                      Airway Bill / Tracking #
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. BLU-9921019"
                        value={trackingNumberInput}
                        onChange={(e) => setTrackingNumberInput(e.target.value)}
                        className="flex-1 rounded-xl border border-border bg-background px-3 py-1.5 focus:outline-none font-mono"
                      />
                      <button
                        onClick={() => {
                          const tracking =
                            trackingNumberInput ||
                            `BLU-${Math.floor(10000000 + Math.random() * 90000000)}`;
                          assignCourier(activeOrderModal.id, courierChoice, tracking);
                          setActiveOrderModal(null);
                        }}
                        className="pill bg-primary px-3 py-1.5 font-bold text-primary-foreground hover:bg-kiwi transition"
                      >
                        Assign
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Audit */}
              <div className="space-y-2">
                <h4 className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider">
                  Order Audit Trail
                </h4>
                <div className="space-y-2">
                  {activeOrderModal.timeline.map((entry, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className="h-2 w-2 rounded-full bg-primary mt-1.5"></div>
                      <div>
                        <span className="font-bold text-foreground">{entry.title}</span>
                        <span className="text-[10px] text-muted-foreground ml-2">
                          {entry.timestamp}
                        </span>
                        <p className="text-muted-foreground text-[11px]">{entry.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

