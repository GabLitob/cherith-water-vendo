"use client";

import { Drop } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";

export function PushBanner({
  name,
  onAck,
  onSnooze,
}: {
  name: string;
  onAck: () => void;
  onSnooze: () => void;
}) {
  return (
    <div className="animate-sc-in absolute top-3 right-3 left-3 z-20 rounded-card bg-card p-[18px] shadow-lg ring-hairline">
      <div className="flex gap-[11px]">
        <span className="relative mt-px flex size-5 flex-none items-center justify-center text-destructive">
          <span className="animate-sc-ping absolute inset-1 rounded-full bg-destructive" />
          <Drop size={18} weight="regular" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="mb-0.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            Brook Cherith
          </div>
          <div className="font-heading mb-0.5 text-[15px] font-semibold">{name} — Low water</div>
          <div className="text-[13px] text-muted-foreground">Refill required</div>
        </div>
      </div>
      <div className="mt-3.5 flex gap-2">
        <Button size="sm" className="h-[34px] flex-1" onClick={onAck}>
          Acknowledge
        </Button>
        <Button size="sm" variant="outline" className="h-[34px] flex-1" onClick={onSnooze}>
          Remind me later
        </Button>
      </div>
    </div>
  );
}
