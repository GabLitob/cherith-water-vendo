"use client";

import { cn } from "@/lib/utils";

const OPTIONS = [15, 30, 60];

export function ReminderSelect({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex h-9 gap-1 rounded-full bg-muted p-1">
      {OPTIONS.map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={cn(
            "flex-1 cursor-pointer rounded-full text-[13px] font-medium transition-colors",
            v === value
              ? "bg-background text-foreground shadow-sm"
              : "bg-transparent text-muted-foreground",
          )}
        >
          {v} min
        </button>
      ))}
    </div>
  );
}
