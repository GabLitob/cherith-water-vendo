"use client";

import { Bell } from "@phosphor-icons/react";

import { FleetCard } from "@/components/fleet-card";
import { MachineTile } from "@/components/machine-tile";
import { formatTemp } from "@/lib/simulation";
import type { Machine } from "@/lib/simulation";

export function DashboardScreen({
  machines,
  now,
  fahrenheit,
  activeCount,
  onOpenMachine,
  onGoAlerts,
}: {
  machines: Machine[];
  now: Date;
  fahrenheit: boolean;
  activeCount: number;
  onOpenMachine: (id: number) => void;
  onGoAlerts: () => void;
}) {
  const low = machines.filter((m) => m.low);
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 18 ? "Good afternoon" : "Good evening";
  const siteLine =
    low.length === 0
      ? `All ${machines.length} machines normal`
      : low.length === 1
        ? "1 machine needs attention"
        : `${low.length} machines need attention`;

  return (
    <div className="min-h-0 flex-1 overflow-auto px-[18px] pt-4 pb-6">
      <div className="mb-[18px] flex items-start justify-between gap-3">
        <div>
          <h1 className="mb-1 text-2xl">{greeting}</h1>
          <p className="text-[13px] text-muted-foreground">{siteLine}</p>
        </div>
        <button
          type="button"
          onClick={onGoAlerts}
          aria-label="Alerts"
          className="relative flex size-9 cursor-pointer items-center justify-center rounded-pill border border-border bg-background text-foreground"
        >
          <Bell size={17} weight="regular" />
          {activeCount > 0 && (
            <span className="font-heading absolute -top-1.5 -right-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-app bg-destructive px-1 text-[11px] font-semibold text-white">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      <FleetCard normalCount={machines.length - low.length} total={machines.length} lowCount={low.length} />

      <div className="grid grid-cols-2 gap-3">
        {machines.map((m) => (
          <MachineTile
            key={m.id}
            machine={m}
            tempLabel={formatTemp(m.temp, fahrenheit)}
            onOpen={() => onOpenMachine(m.id)}
          />
        ))}
      </div>
    </div>
  );
}
