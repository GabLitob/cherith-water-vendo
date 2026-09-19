"use client";

import { Thermometer } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/status-badge";
import type { Machine } from "@/lib/simulation";

export function MachineTile({
  machine,
  tempLabel,
  onOpen,
}: {
  machine: Machine;
  tempLabel: string;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "flex w-full cursor-pointer flex-col items-start gap-2.5 rounded-card p-4 text-left shadow-sm",
        machine.low
          ? "border border-destructive-tint-border bg-destructive-tint"
          : "border border-border bg-card",
      )}
    >
      <div className="flex w-full items-center justify-between">
        <span className="font-heading text-[15px] font-semibold">{machine.name}</span>
        <span className="relative block size-2 flex-none">
          {machine.low && (
            <span className="absolute inset-0 animate-sc-ping rounded-full bg-destructive" />
          )}
          <span
            className={cn(
              "absolute inset-0 rounded-full",
              machine.low ? "bg-destructive" : "bg-ok",
            )}
          />
        </span>
      </div>
      <StatusBadge low={machine.low} />
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Thermometer size={13} weight="regular" />
        {tempLabel}
      </div>
    </button>
  );
}
