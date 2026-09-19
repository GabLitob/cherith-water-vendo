"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Notification } from "@/lib/simulation";

export function AlertsScreen({
  notifs,
  onAck,
  onSnooze,
}: {
  notifs: Notification[];
  onAck: (key: number) => void;
  onSnooze: (key: number) => void;
}) {
  const live = notifs.filter((n) => n.status !== "resolved");
  const alertsLine = live.length
    ? `${live.length} open · ${notifs.length - live.length} resolved`
    : "Nothing open";

  return (
    <div className="min-h-0 flex-1 overflow-auto px-[18px] pt-4 pb-6">
      <h1 className="mb-[5px] text-2xl">Alerts</h1>
      <p className="mb-[18px] text-[13px] text-muted-foreground">{alertsLine}</p>

      {notifs.length === 0 && (
        <div className="rounded-card border border-dashed border-border px-5 py-10 text-center">
          <div className="font-heading mb-1 text-[15px] font-semibold">All machines normal</div>
          <p className="text-[13px] text-muted-foreground">
            Low-water alerts appear here as the sensors report them.
          </p>
        </div>
      )}

      {notifs.map((n) => {
        const done = n.status === "resolved";
        const note = done
          ? `Water restored at ${n.resolvedAt}`
          : n.status === "snoozed"
            ? "Reminder set — you will be notified again"
            : n.status === "acknowledged"
              ? "Acknowledged — waiting for refill"
              : "Refill required";

        return (
          <div
            key={n.key}
            className={cn(
              "mb-3 rounded-card p-[18px] shadow-md ring-hairline",
              done ? "bg-card" : "bg-destructive-tint",
            )}
          >
            <div className="mb-1 flex items-center gap-2.5">
              <span className={cn("size-2 flex-none rounded-full", done ? "bg-ok" : "bg-destructive")} />
              <span className="font-heading flex-1 text-sm font-semibold">
                {n.name} — {done ? "Resolved" : "Low water"}
              </span>
              <span className="font-heading text-xs text-muted-foreground">{n.time}</span>
            </div>
            <div className="ml-[18px] text-[13px] text-muted-foreground">{note}</div>
            {n.status === "active" && (
              <div className="mt-3.5 ml-[18px] flex gap-2">
                <Button size="sm" className="h-8" onClick={() => onAck(n.key)}>
                  Acknowledge
                </Button>
                <Button size="sm" variant="outline" className="h-8" onClick={() => onSnooze(n.key)}>
                  Remind me later
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
