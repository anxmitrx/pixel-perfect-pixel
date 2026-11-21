import React, { useState } from "react";
import { useAdmin } from "@/lib/admin-context";
import type { BatchProduction } from "@/types/admin";
import {
  FlaskConical,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  Droplet,
  Layers,
  Thermometer,
} from "lucide-react";
import { toast } from "sonner";

export const BatchLabTab: React.FC = () => {
  const { batches, updateBatchStatus } = useAdmin();

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold font-serif text-foreground">
            Batch Maturation & Aging Lab
          </h2>
          <p className="text-xs text-muted-foreground">
            Fragrance maturation schedules, maceration vat monitoring, alcohol integration, and QC sign-offs.
          </p>
        </div>

        <div className="rounded-lg bg-card border border-border px-3 py-1.5 text-xs flex items-center gap-2 font-mono">
          <Thermometer className="h-3.5 w-3.5 text-emerald-600" />
          <span>Vat Room: 18.4°C · Humidity: 45%</span>
        </div>
      </div>

      {/* Batch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {batches.map((batch) => {
          const progressPercent = Math.min(100, Math.round((batch.daysAged / batch.macerationTargetDays) * 100));
          const isReady = batch.daysAged >= batch.macerationTargetDays;

          return (
            <div
              key={batch.id}
              className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-4 hover:shadow-md transition"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="pill bg-primary/20 text-foreground font-mono font-bold text-[10px] px-2 py-0.5 uppercase">
                      {batch.batchCode}
                    </span>
                    <span className="pill bg-muted text-muted-foreground text-[10px] font-semibold">
                      {batch.fragranceCategory}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-foreground mt-1">
                    {batch.fragranceName}
                  </h3>
                </div>

                <span
                  className={`pill px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${
                    batch.qcStatus === "Bottling Ready"
                      ? "bg-emerald-100 text-emerald-800"
                      : batch.qcStatus === "QC Passed"
                      ? "bg-sky-100 text-sky-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {batch.qcStatus}
                </span>
              </div>

              {/* Maceration Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Maceration Aging Progress:</span>
                  <span className="font-mono font-bold text-foreground">
                    {batch.daysAged} of {batch.macerationTargetDays} days ({progressPercent}%)
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isReady ? "bg-emerald-500" : "bg-kiwi"
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 rounded-2xl bg-muted/40 p-3 text-xs border border-border/60">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Vat Volume
                  </span>
                  <span className="font-bold text-foreground font-mono">{batch.liters} L</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Bottles Yield
                  </span>
                  <span className="font-bold text-foreground font-mono">{batch.yieldBottles} units</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Alcohol Grade
                  </span>
                  <span className="font-bold text-foreground font-mono">
                    {batch.alcoholPercentage === 0 ? "Pure Oil" : `${batch.alcoholPercentage}% Vol`}
                  </span>
                </div>
              </div>

              {/* Perfumer Note */}
              <div className="rounded-2xl bg-card p-3 border border-border text-xs">
                <span className="font-bold text-muted-foreground text-[10px] uppercase block mb-1">
                  Master Perfumer's Olfactory Note:
                </span>
                <p className="italic text-foreground leading-relaxed">
                  "{batch.perfumerNote}"
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1 border-t border-border text-xs">
                <span className="text-muted-foreground text-[11px]">
                  Started: {batch.macerationStartDate}
                </span>

                <div className="flex gap-2">
                  {batch.qcStatus === "Macerating" && (
                    <button
                      onClick={() => updateBatchStatus(batch.id, "Filtration")}
                      className="pill border border-border bg-card px-3 py-1 font-semibold hover:bg-muted"
                    >
                      Advance to Filtration
                    </button>
                  )}
                  {batch.qcStatus === "Filtration" && (
                    <button
                      onClick={() => updateBatchStatus(batch.id, "QC Passed")}
                      className="pill border border-border bg-card px-3 py-1 font-semibold hover:bg-muted"
                    >
                      Sign Off QC
                    </button>
                  )}
                  {batch.qcStatus === "QC Passed" && (
                    <button
                      onClick={() => updateBatchStatus(batch.id, "Bottling Ready")}
                      className="pill bg-primary px-3 py-1 font-bold text-primary-foreground hover:bg-kiwi"
                    >
                      Authorize Bottling
                    </button>
                  )}
                  {batch.qcStatus === "Bottling Ready" && (
                    <button
                      onClick={() => {
                        updateBatchStatus(batch.id, "Released");
                        toast.success(`Batch ${batch.batchCode} released to online storefront inventory!`);
                      }}
                      className="pill bg-foreground text-background px-3 py-1 font-bold hover:bg-foreground/90"
                    >
                      Release to Catalog
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

