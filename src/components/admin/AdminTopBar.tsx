import React from "react";
import { useAdmin } from "@/lib/admin-context";
import {
  Search,
  Volume2,
  VolumeX,
  Download,
  ExternalLink,
  ChevronRight,
  RotateCcw,
  Shield,
  Activity,
} from "lucide-react";

export const AdminTopBar: React.FC<{ onOpenCommandPalette: () => void }> = ({
  onOpenCommandPalette,
}) => {
  const {
    activeTab,
    metrics,
    soundEnabled,
    setSoundEnabled,
    exportDatabaseJSON,
    resetAllData,
  } = useAdmin();

  const tabTitles: Record<string, string> = {
    overview: "Dashboard Overview",
    orders: "Orders & Fulfillment",
    catalog: "Catalog & Stock Inventory",
    pressure: "Traffic & Concurrency Control",
    "batch-lab": "Batch Maturation Lab",
    coupons: "Promotions & Discounts",
    customers: "Customer Directory",
    audit: "System Audit Trail",
  };

  return (
    <header className="h-16 border-b border-border/80 bg-card px-6 flex items-center justify-between shrink-0">
      {/* Breadcrumb Path */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="hover:text-foreground transition cursor-default">Juicé</span>
        <ChevronRight className="h-3 w-3 opacity-60" />
        <span className="font-semibold text-foreground">
          {tabTitles[activeTab] || "Operations"}
        </span>
      </div>

      {/* Center: Command Palette Trigger */}
      <button
        onClick={onOpenCommandPalette}
        className="hidden md:flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground hover:border-foreground/30 transition w-64 justify-between shadow-xs"
      >
        <span className="flex items-center gap-2">
          <Search className="h-3.5 w-3.5" />
          <span>Quick search or jump to...</span>
        </span>
        <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground border border-border">
          Ctrl K
        </kbd>
      </button>

      {/* Right Actions & Status Telemetry */}
      <div className="flex items-center gap-3">
        {/* Clean Status Pill */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-muted/50 border border-border text-xs font-mono">
          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          <span className="text-muted-foreground text-[11px]">Edge PoPs</span>
          <span className="text-foreground font-semibold">{metrics.p99LatencyMs}ms</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-foreground font-semibold">{metrics.rps} RPS</span>
        </div>

        {/* Audio Alerts */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition"
          title={soundEnabled ? "Mute audio alerts" : "Enable order audio blips"}
        >
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>

        {/* Database Export */}
        <button
          onClick={exportDatabaseJSON}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted transition"
          title="Export Database Snapshot"
        >
          <Download className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Export JSON</span>
        </button>

        {/* View Storefront Link */}
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-semibold hover:bg-foreground/90 transition shadow-xs"
        >
          <span>Storefront</span>
          <ExternalLink className="h-3.5 w-3.5 opacity-70" />
        </a>
      </div>
    </header>
  );
};

