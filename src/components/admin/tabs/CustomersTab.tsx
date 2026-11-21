import React, { useState, useMemo } from "react";
import { useAdmin } from "@/lib/admin-context";
import { Users, Search, Crown, Heart, Mail, Phone, MapPin, IndianRupee } from "lucide-react";

export const CustomersTab: React.FC = () => {
  const { customers } = useAdmin();
  const [search, setSearch] = useState("");

  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  const filtered = useMemo(() => {
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.city.toLowerCase().includes(search.toLowerCase())
    );
  }, [customers, search]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold font-serif text-foreground">
            Customer Directory
          </h2>
          <p className="text-xs text-muted-foreground">
            Customer lifetime value, loyalty tiers, signature scent preferences, and repeat buyers.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, email, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-1.5 text-xs focus:outline-none"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
              <tr>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Loyalty Tier</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Location</th>
                <th className="p-4">Orders</th>
                <th className="p-4">Lifetime Spend</th>
                <th className="p-4">Signature Scent</th>
                <th className="p-4 text-right">Last Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-muted/30 transition">
                  <td className="p-4 font-bold text-foreground">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/20 text-foreground font-serif font-bold text-sm">
                        {c.name[0]}
                      </div>
                      <span>{c.name}</span>
                    </div>
                  </td>

                  <td className="p-4">
                    <span
                      className={`pill px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        c.tier === "Amber Connoisseur"
                          ? "bg-amber-100 text-amber-900 border border-amber-300"
                          : c.tier === "Juicy Gold"
                          ? "bg-yellow-100 text-yellow-900 border border-yellow-300"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {c.tier}
                    </span>
                  </td>

                  <td className="p-4 text-muted-foreground">
                    <p className="text-foreground">{c.email}</p>
                    <p className="text-[11px] font-mono">{c.phone}</p>
                  </td>

                  <td className="p-4 text-foreground font-medium">{c.city}</td>

                  <td className="p-4 font-mono font-bold text-foreground">
                    {c.totalOrders}
                  </td>

                  <td className="p-4 font-bold text-foreground font-mono">
                    {inr(c.totalSpent)}
                  </td>

                  <td className="p-4 text-primary font-medium">
                    {c.favoriteScent}
                  </td>

                  <td className="p-4 text-right font-mono text-muted-foreground">
                    {c.lastOrderDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

