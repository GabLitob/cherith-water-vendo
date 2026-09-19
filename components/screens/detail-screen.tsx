"use client";

import { CaretLeft, Drop, MapPin, Sliders } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { formatTemp, formatTime, historyGroups } from "@/lib/simulation";
import type { Machine } from "@/lib/simulation";

export function DetailScreen({
  machine,
  now,
  fahrenheit,
  onBack,
  onConfigure,
}: {
  machine: Machine;
  now: Date;
  fahrenheit: boolean;
  onBack: () => void;
  onConfigure: () => void;
}) {
  const groups = historyGroups(machine, now);

  return (
    <div className="min-h-0 flex-1 overflow-auto px-[18px] pt-4 pb-8">
      <div className="mb-[18px] flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex h-8 cursor-pointer items-center gap-1.5 rounded-pill border border-transparent bg-transparent py-0 pr-3 pl-2 text-[13px] font-medium text-muted-foreground"
        >
          <CaretLeft size={16} weight="regular" />
          Machines
        </button>
        <button
          type="button"
          onClick={onConfigure}
          className="flex h-8 cursor-pointer items-center gap-1.5 rounded-pill border border-border bg-background px-3.5 text-[13px] font-medium text-foreground"
        >
          <Sliders size={14} weight="regular" />
          Configure
        </button>
      </div>

      <h1 className="mb-[5px] text-2xl">{machine.name}</h1>
      <p className="mb-[18px] flex items-center gap-1.5 text-[13px] text-muted-foreground">
        <MapPin size={13} weight="regular" />
        {machine.location}
      </p>

      <div
        className={cn(
          "mb-3.5 flex gap-2.5 rounded-alert border p-3.5 px-4",
          machine.low
            ? "border-destructive-tint-border bg-destructive-tint text-destructive-ink"
            : "border-ok-tint-border bg-ok-tint text-ok",
        )}
      >
        <span className="mt-px flex flex-none">
          <Drop size={16} weight="regular" />
        </span>
        <div>
          <div className="font-heading mb-0.5 text-sm font-semibold">
            {machine.low ? "Low water" : "Normal"}
          </div>
          <div className="text-[13px]">
            {machine.low ? "Refill required" : "Water level above the sensor"}
          </div>
        </div>
      </div>

      <div className="mb-[26px] grid grid-cols-2 gap-3">
        <div className="rounded-card bg-card p-4 px-[18px] shadow-md ring-hairline">
          <div className="mb-1.5 text-xs font-medium text-muted-foreground">Temperature</div>
          <div className="font-heading text-xl font-semibold">{formatTemp(machine.temp, fahrenheit)}</div>
        </div>
        <div className="rounded-card bg-card p-4 px-[18px] shadow-md ring-hairline">
          <div className="mb-1.5 text-xs font-medium text-muted-foreground">Last updated</div>
          <div className="font-heading text-xl font-semibold">{machine.updated || formatTime(now)}</div>
        </div>
      </div>

      <h4 className="mb-3 text-base">History</h4>
      {groups.map((g, gi) => (
        <div key={gi} className="mb-[18px]">
          <div className="mb-2 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            {g.day}
          </div>
          <div className="flex flex-col">
            {g.items.map((item, ii) => (
              <div key={ii} className="flex items-center gap-2.5 border-b border-border py-2.5">
                <span
                  className={cn(
                    "size-[7px] flex-none rounded-full",
                    item.kind === "low" ? "bg-destructive" : item.kind === "ok" ? "bg-ok" : "bg-chart-1",
                  )}
                />
                <span className="flex-1 text-[13px]">{item.label}</span>
                <span className="font-heading text-xs text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
