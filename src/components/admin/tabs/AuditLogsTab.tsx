import React, { useState, useMemo } from "react";
import { useAdmin } from "@/lib/admin-context";
import { ScrollText, Search, Shield, Zap, Package, Tag, Filter } from "lucide-react";

export const AuditLogsTab: React.FC = () => {
  const { auditLogs } = useAdmin();
  const [filterCat, setFilterCat] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchCat = filterCat === "all" ? true : log.category === filterCat;
      const q = search.toLowerCase();
      const matchSearch =
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.actor.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [auditLogs, filterCat, search]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold font-serif text-foreground">
            System & Operations Audit Trail
          </h2>
          <p className="text-xs text-muted-foreground">
            Immutable chronological record of administrative actions, price adjustments, and edge security events.
          </p>
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
          {["all", "Pressure", "Inventory", "Orders", "Security", "Price"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                filterCat === cat
                  ? "bg-foreground text-background font-semibold"
                  : "bg-card text-muted-foreground hover:bg-muted border border-border"
              }`}
            >
              {cat === "all" ? "All Events" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
              <tr>
                <th className="p-4 w-28">Timestamp</th>
                <th className="p-4 w-32">Actor</th>
                <th className="p-4 w-40">Action</th>
                <th className="p-4 w-28">Category</th>
                <th className="p-4">Details & Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/30 transition">
                  <td className="p-4 font-mono text-muted-foreground">{log.timestamp}</td>
                  <td className="p-4 font-semibold text-foreground">{log.actor}</td>
                  <td className="p-4 font-bold text-foreground">
                    <span
                      className={`pill px-2 py-0.5 text-[10px] font-semibold ${
                        log.severity === "critical" || log.severity === "warning"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-primary/20 text-foreground"
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="pill border border-border bg-card px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                      {log.category}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground leading-relaxed">
                    {log.details}
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

