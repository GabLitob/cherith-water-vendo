"use client";

import { CaretRight } from "@phosphor-icons/react";

import type { Machine } from "@/lib/simulation";

export function SettingsListScreen({
  machines,
  onConfigure,
}: {
  machines: Machine[];
  onConfigure: (id: number) => void;
}) {
  return (
    <div className="min-h-0 flex-1 overflow-auto px-[18px] pt-4 pb-6">
      <h1 className="mb-[5px] text-2xl">Settings</h1>
      <p className="mb-[22px] text-[13px] text-muted-foreground">
        owner@brookcherith.ph · {machines.length} registered machines
      </p>
      <div className="mb-2.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
        Machines
      </div>
      <div className="overflow-hidden rounded-card bg-card py-1.5 shadow-md ring-hairline">
        {machines.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onConfigure(m.id)}
            className="flex w-full cursor-pointer items-center gap-2.5 bg-transparent px-[18px] py-[11px] text-left text-foreground"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium">{m.name}</span>
              <span className="block text-xs text-muted-foreground">
                {m.location} · reminder {m.reminder} min
              </span>
            </span>
            <CaretRight size={15} weight="regular" className="text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
}
