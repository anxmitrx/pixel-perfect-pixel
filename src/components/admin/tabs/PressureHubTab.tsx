import React, { useState } from "react";
import { useAdmin } from "@/lib/admin-context";
import {
  Activity,
  Cpu,
  Database,
  Globe,
  RotateCw,
  CheckCircle2,
  Shield,
  Layers,
  Sliders,
  CreditCard,
  Lock,
  Unlock,
} from "lucide-react";

export const PressureHubTab: React.FC = () => {
  const {
    metrics,
    toggleFlashDropMode,
    toggleWaitingRoom,
    setWaitingRoomPassRate,
    setBotShieldLevel,
    toggleInventoryBufferLock,
    purgeEdgeCache,
    simulateRushTraffic,
    injectStressOrders,
  } = useAdmin();

  const [sliderRps, setSliderRps] = useState(metrics.rps);

  const handleSliderChange = (newVal: number) => {
    setSliderRps(newVal);
    simulateRushTraffic(newVal);
  };

  return (
    <div className="space-y-6">
      {/* Title & Edge Purge Action */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold font-serif text-foreground">
            Traffic & Concurrency Operations
          </h2>
          <p className="text-xs text-muted-foreground">
            Edge infrastructure telemetry, rate-limiting queues, and high-concurrency drop controls.
          </p>
        </div>

        <button
          onClick={purgeEdgeCache}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted transition shadow-xs w-fit"
        >
          <RotateCw className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Purge Global Cache (285 PoPs)</span>
        </button>
      </div>

      {/* Primary Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* P99 Latency */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>P99 Edge Latency</span>
            <Activity className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <h3 className="font-mono text-2xl font-bold text-foreground">
              {metrics.p99LatencyMs}ms
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">SLA target: &lt;50ms</p>
          </div>
        </div>

        {/* Origin Server Load */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Origin CPU / Load</span>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-2">
            <h3 className="font-mono text-2xl font-bold text-foreground">
              {metrics.originServerLoad}%
            </h3>
            <div className="mt-1.5 h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  metrics.originServerLoad > 75
                    ? "bg-rose-500"
                    : metrics.originServerLoad > 45
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
                style={{ width: `${metrics.originServerLoad}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Database Connection Pool */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Active DB Connections</span>
            <Database className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-2">
            <h3 className="font-mono text-2xl font-bold text-foreground">
              {metrics.dbConnectionsActive} <span className="text-xs font-normal text-muted-foreground">/ 100</span>
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">No pool queueing detected</p>
          </div>
        </div>

        {/* Queue Depth */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Checkout Queue Depth</span>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-2">
            <h3 className="font-mono text-2xl font-bold text-foreground">
              {metrics.checkoutQueueDepth} <span className="text-xs font-normal text-muted-foreground">sessions</span>
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Meters payment gateway entry</p>
          </div>
        </div>
      </div>

      {/* Core Protection Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Flash Drop Concurrency Switch */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-foreground" />
                <h3 className="text-sm font-semibold text-foreground">
                  Edge Catalog Protection Mode
                </h3>
              </div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                When active, all catalog browse requests are served from edge memory without querying the origin database.
              </p>
            </div>

            <button
              onClick={toggleFlashDropMode}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                metrics.flashDropMode
                  ? "bg-foreground text-background"
                  : "border border-border bg-muted/50 text-foreground hover:bg-muted"
              }`}
            >
              {metrics.flashDropMode ? "Enabled" : "Disabled"}
            </button>
          </div>

          <div className="space-y-2 border-t border-border pt-3 text-xs">
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Global Cache Hit Ratio:</span>
              <span className="font-mono font-semibold text-foreground">{metrics.edgeCacheHitRate}%</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Inventory Safety Lock:</span>
              <button
                onClick={toggleInventoryBufferLock}
                className="font-mono text-xs font-semibold text-foreground hover:underline"
              >
                {metrics.inventoryBufferLocked ? "5% Locked" : "Disabled"}
              </button>
            </div>
          </div>
        </div>

        {/* Checkout Queue Rate Limiter */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-foreground" />
                <h3 className="text-sm font-semibold text-foreground">
                  Checkout Rate Limiter (Waiting Room)
                </h3>
              </div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Throttles user checkout entries into a tokenized queue to protect bank payment gateways.
              </p>
            </div>

            <button
              onClick={toggleWaitingRoom}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                metrics.waitingRoomActive
                  ? "bg-foreground text-background"
                  : "border border-border bg-muted/50 text-foreground hover:bg-muted"
              }`}
            >
              {metrics.waitingRoomActive ? "Enabled" : "Disabled"}
            </button>
          </div>

          <div className="border-t border-border pt-3 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Checkout Pass Rate:</span>
              <span className="font-mono font-bold text-foreground">
                {metrics.waitingRoomPassRate} orders / min
              </span>
            </div>
            <div className="flex gap-1.5">
              {[50, 100, 150, 300, 500].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setWaitingRoomPassRate(rate)}
                  className={`flex-1 py-1 rounded text-[11px] font-mono transition ${
                    metrics.waitingRoomPassRate === rate
                      ? "bg-foreground text-background font-bold"
                      : "border border-border bg-card hover:bg-muted text-muted-foreground"
                  }`}
                >
                  {rate}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Traffic Load Testing Utility */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-foreground" />
              <h3 className="text-sm font-semibold text-foreground">
                Synthetic Load Testing Control
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Simulate traffic surges to verify latency resilience and checkout queue handling.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-bold text-foreground">{sliderRps} RPS</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                sliderRps > 2000
                  ? "bg-rose-100 text-rose-800"
                  : sliderRps > 500
                  ? "bg-amber-100 text-amber-800"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {sliderRps > 2000 ? "High Spike" : sliderRps > 500 ? "Elevated" : "Baseline"}
            </span>
          </div>
        </div>

        {/* Range Slider */}
        <div className="space-y-1 pt-1">
          <input
            type="range"
            min={20}
            max={4500}
            step={20}
            value={sliderRps}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            className="w-full accent-foreground h-1.5 bg-muted rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
            <span>20 RPS (Baseline)</span>
            <span>650 RPS (Drop Start)</span>
            <span>2,000 RPS (Peak)</span>
            <span>4,500 RPS (Max Capacity)</span>
          </div>
        </div>

        {/* Inject Synthetic Orders */}
        <div className="border-t border-border pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-muted-foreground">
            Inject synthetic concurrent orders into fulfillment queue:
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => injectStressOrders(10)}
              className="px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted font-mono font-medium"
            >
              +10 Orders
            </button>
            <button
              onClick={() => injectStressOrders(50)}
              className="px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted font-mono font-medium"
            >
              +50 Orders
            </button>
            <button
              onClick={() => injectStressOrders(200)}
              className="px-3 py-1.5 rounded-lg bg-foreground text-background hover:bg-foreground/90 font-mono font-semibold"
            >
              +200 Orders
            </button>
          </div>
        </div>
      </div>

      {/* Gateway Health Status */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Payment Gateway Latency & Success Ratios
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="rounded-lg border border-border p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <div>
                <p className="font-semibold text-foreground">UPI (GPay / PhonePe)</p>
                <p className="text-[10px] text-muted-foreground">Avg Latency: 320ms</p>
              </div>
            </div>
            <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              {metrics.paymentGatewayHealth.upi}%
            </span>
          </div>

          <div className="rounded-lg border border-border p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <div>
                <p className="font-semibold text-foreground">Cards (Visa / MC / RuPay)</p>
                <p className="text-[10px] text-muted-foreground">3D Secure v2.0</p>
              </div>
            </div>
            <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              {metrics.paymentGatewayHealth.cards}%
            </span>
          </div>

          <div className="rounded-lg border border-border p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <div>
                <p className="font-semibold text-foreground">COD Pincode Risk Engine</p>
                <p className="text-[10px] text-muted-foreground">Active Filter</p>
              </div>
            </div>
            <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              100%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
