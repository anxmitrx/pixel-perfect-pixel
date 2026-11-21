import React, { useState } from "react";
import { useAdmin } from "@/lib/admin-context";
import type { AdminCoupon } from "@/types/admin";
import { Ticket, Plus, CheckCircle, XCircle, Trash2, X, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const CouponsTab: React.FC = () => {
  const { coupons, addCoupon, toggleCoupon, deleteCoupon } = useAdmin();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percent" | "fixed">("percent");
  const [amount, setAmount] = useState(15);
  const [minSpend, setMinSpend] = useState(999);
  const [usageLimit, setUsageLimit] = useState(1000);
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error("Code is required");
      return;
    }

    addCoupon({
      code: code.trim().toUpperCase(),
      discountType,
      amount: Number(amount),
      minSpend: Number(minSpend),
      usageCount: 0,
      usageLimit: Number(usageLimit),
      active: true,
      expiresAt: "2026-12-31",
      description: description || `${amount}${discountType === "percent" ? "%" : "₹"} discount`,
    });

    setIsAddOpen(false);
    setCode("");
    setDescription("");
  };

  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold font-serif text-foreground">
            Promotions & Discount Codes
          </h2>
          <p className="text-xs text-muted-foreground">
            Manage promotional campaign vouchers, VIP codes, and cart discount rules.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-semibold hover:bg-foreground/90 transition shadow-xs w-fit"
        >
          <Plus className="h-4 w-4" />
          <span>New Promo Code</span>
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {coupons.map((coupon) => {
          const usagePercent = Math.round((coupon.usageCount / coupon.usageLimit) * 100);

          return (
            <div
              key={coupon.code}
              className={`rounded-3xl border p-5 shadow-sm space-y-4 transition flex flex-col justify-between ${
                coupon.active ? "bg-card border-border" : "bg-muted/40 border-border/60 opacity-60"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="pill bg-primary/20 text-foreground font-mono font-bold text-sm px-3 py-1 tracking-wider uppercase">
                    {coupon.code}
                  </span>
                  <button
                    onClick={() => toggleCoupon(coupon.code)}
                    className={`pill px-2.5 py-0.5 text-[10px] font-bold uppercase transition ${
                      coupon.active
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {coupon.active ? "Active" : "Paused"}
                  </button>
                </div>

                <div className="mt-4">
                  <h3 className="font-serif text-2xl font-bold text-foreground">
                    {coupon.discountType === "percent" ? `${coupon.amount}% OFF` : `Flat ${inr(coupon.amount)} OFF`}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {coupon.description}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-border text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Min Order Spend:</span>
                  <span className="font-bold text-foreground">{inr(coupon.minSpend)}</span>
                </div>

                {/* Usage meter */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground">Usage:</span>
                    <span className="font-mono font-semibold text-foreground">
                      {coupon.usageCount} / {coupon.usageLimit} ({usagePercent}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.min(100, usagePercent)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-muted-foreground">
                    Expires: {coupon.expiresAt}
                  </span>
                  <button
                    onClick={() => deleteCoupon(coupon.code)}
                    className="text-muted-foreground hover:text-destructive p-1 transition"
                    title="Delete coupon"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Coupon Modal */}
      {isAddOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsAddOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-border bg-cream p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="font-serif text-2xl font-bold">New Campaign Coupon</h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="pill p-2 text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">
                  Promo Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MONSOON20"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs focus:outline-none font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="fixed">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">
                    Amount Value *
                  </label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">
                    Minimum Spend (₹)
                  </label>
                  <input
                    type="number"
                    value={minSpend}
                    onChange={(e) => setMinSpend(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">
                    Max Redemptions
                  </label>
                  <input
                    type="number"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Flash sale 20% discount on orders over ₹999"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="pill border border-border bg-card px-4 py-2 hover:bg-muted font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="pill bg-primary text-primary-foreground hover:bg-kiwi px-5 py-2 font-bold shadow-sm transition"
                >
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

