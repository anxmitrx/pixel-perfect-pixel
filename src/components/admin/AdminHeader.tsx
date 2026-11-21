import React from "react";
import { useAdmin } from "@/lib/admin-context";
import {
  Zap,
  Volume2,
  VolumeX,
  ExternalLink,
  ShieldCheck,
  Search,
  Radio,
  Flame,
  Download,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export const AdminHeader: React.FC<{ onOpenCommandPalette: () => void }> = ({ onOpenCommandPalette }) => {
  const {
    metrics,
    toggleFlashDropMode,
    soundEnabled,
    setSoundEnabled,
    autoStreamOrders,
    setAutoStreamOrders,
    injectStressOrders,
    resetAllData,
    exportDatabaseJSON,
  } = useAdmin();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-md">
      {/* Top Banner for Flash Drop Mode */}
      {metrics.flashDropMode && (
        <div className="bg-gradient-to-r from-hot via-sale to-hot px-4 py-1.5 text-center text-xs font-semibold tracking-wider text-destructive-foreground animate-pulse flex items-center justify-center gap-2">
          <Flame className="h-4 w-4 animate-bounce" />
          <span>⚡ FLASH DROP MODE ENGAGED — AGGRESSIVE EDGE CACHING & QUEUE THROTTLE ACTIVE</span>
          <Flame className="h-4 w-4 animate-bounce" />
        </div>
      )}

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        {/* Left: Brand & Live Edge Health */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-foreground text-background font-serif font-black text-lg shadow-sm">
              J
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-bold tracking-tight">Juicé</span>
                <span className="pill bg-pastel/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-foreground">
                  Ops Pro
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 font-mono">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>CF Workers Edge</span>
                <span>·</span>
                <span className="text-emerald-600 font-semibold">{metrics.p99LatencyMs}ms</span>
                <span>·</span>
                <span>RPS: <b>{metrics.rps}</b></span>
              </p>
            </div>
          </div>
        </div>

        {/* Center: Search / Command Palette Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-3 rounded-full border border-border bg-card/80 px-4 py-1.5 text-xs text-muted-foreground hover:border-foreground/30 hover:bg-card transition-all shadow-sm w-72 justify-between"
        >
          <span className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5" />
            <span>Search products, orders, rules...</span>
          </span>
          <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground font-medium border border-border">
            Ctrl K
          </kbd>
        </button>

        {/* Right: Operational Controls */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Flash Drop Toggle */}
          <button
            onClick={toggleFlashDropMode}
            className={`pill flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-all shadow-sm ${
              metrics.flashDropMode
                ? "bg-hot text-destructive-foreground ring-2 ring-hot/50 animate-pulse"
                : "border border-hot/30 bg-hot/10 text-hot hover:bg-hot hover:text-destructive-foreground"
            }`}
            title="Toggle Flash Sale High Pressure Mode"
          >
            <Flame className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              {metrics.flashDropMode ? "Drop Active" : "Drop Mode"}
            </span>
          </button>

          {/* Quick Stress Injection Button */}
          <div className="relative group hidden lg:block">
            <button
              onClick={() => injectStressOrders(10)}
              className="pill flex items-center gap-1.5 border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition"
            >
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <span>Simulate Rush</span>
            </button>
            <div className="invisible group-hover:visible absolute right-0 top-full mt-1 w-44 rounded-2xl border border-border bg-card p-2 shadow-xl z-50 text-xs">
              <p className="px-2 py-1 font-semibold text-muted-foreground text-[10px] uppercase">
                Inject Rush Orders
              </p>
              <button
                onClick={() => injectStressOrders(10)}
                className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-muted flex justify-between"
              >
                <span>+10 Orders</span>
                <span className="text-muted-foreground">Standard</span>
              </button>
              <button
                onClick={() => injectStressOrders(50)}
                className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-muted flex justify-between"
              >
                <span>+50 Orders</span>
                <span className="text-amber-600 font-semibold">Rush</span>
              </button>
              <button
                onClick={() => injectStressOrders(250)}
                className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-muted flex justify-between text-hot font-bold"
              >
                <span>+250 Orders</span>
                <span>🔥 Extreme</span>
              </button>
            </div>
          </div>

          {/* Auto-stream Ticker Toggle */}
          <button
            onClick={() => setAutoStreamOrders(!autoStreamOrders)}
            className={`pill flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium transition ${
              autoStreamOrders
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                : "border border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
            title="Auto-stream incoming live orders every 6 seconds"
          >
            <Radio className={`h-3 w-3 ${autoStreamOrders ? "text-emerald-600 animate-pulse" : ""}`} />
            <span className="hidden xl:inline">Live Stream</span>
          </button>

          {/* Audio Alert Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="pill p-2 text-muted-foreground hover:text-foreground border border-border bg-card hover:bg-muted transition"
            title={soundEnabled ? "Mute audio alerts" : "Enable order audio blips"}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>

          {/* Export & Reset dropdown */}
          <div className="relative group">
            <button
              className="pill p-2 text-muted-foreground hover:text-foreground border border-border bg-card hover:bg-muted transition"
              title="System Database Actions"
            >
              <Sparkles className="h-4 w-4 text-kiwi" />
            </button>
            <div className="invisible group-hover:visible absolute right-0 top-full mt-1 w-48 rounded-2xl border border-border bg-card p-2 shadow-xl z-50 text-xs">
              <button
                onClick={exportDatabaseJSON}
                className="w-full text-left px-2 py-2 rounded-lg hover:bg-muted flex items-center gap-2"
              >
                <Download className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Export Backup JSON</span>
              </button>
              <button
                onClick={resetAllData}
                className="w-full text-left px-2 py-2 rounded-lg hover:bg-destructive/10 text-destructive flex items-center gap-2"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Database</span>
              </button>
            </div>
          </div>

          {/* Link to Storefront */}
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="pill hidden sm:flex items-center gap-1.5 bg-foreground px-3.5 py-1.5 text-xs font-medium text-background hover:bg-foreground/90 transition shadow-sm"
          >
            <span>Storefront</span>
            <ExternalLink className="h-3.5 w-3.5 opacity-70" />
          </a>
        </div>
      </div>
    </header>
  );
};

