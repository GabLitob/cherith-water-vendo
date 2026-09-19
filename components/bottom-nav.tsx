"use client";

import { Bell, SquaresFour, Sliders } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import type { Screen } from "@/lib/simulation";

function NavButton({
  active,
  label,
  icon,
  onClick,
  badge,
}: {
  active: boolean;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  badge?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-10 cursor-pointer items-center gap-1.5 rounded-full border-none px-3.5 text-[13px] font-medium transition-colors",
        active ? "bg-primary text-primary-foreground" : "bg-transparent text-muted-foreground",
      )}
    >
      <span className="relative flex">
        {icon}
        {badge}
      </span>
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

export function BottomNav({
  screen,
  hasActive,
  onMachines,
  onAlerts,
  onSettings,
}: {
  screen: Screen;
  hasActive: boolean;
  onMachines: () => void;
  onAlerts: () => void;
  onSettings: () => void;
}) {
  return (
    <div className="flex flex-none justify-center border-t border-border bg-app px-4 pt-2.5 pb-[18px]">
      <div className="flex items-center gap-1 rounded-full bg-background p-1.5 shadow-lg ring-hairline">
        <NavButton
          active={screen === "dashboard"}
          label="Machines"
          icon={<SquaresFour size={18} weight="regular" />}
          onClick={onMachines}
        />
        <NavButton
          active={screen === "alerts"}
          label="Alerts"
          icon={<Bell size={18} weight="regular" />}
          onClick={onAlerts}
          badge={
            hasActive ? (
              <span
                className="absolute -top-0.5 -right-1 size-2 rounded-full border-[1.5px]"
                style={{
                  background: screen === "alerts" ? "var(--primary-foreground)" : "var(--destructive)",
                  borderColor: screen === "alerts" ? "var(--primary)" : "var(--background)",
                }}
              />
            ) : null
          }
        />
        <NavButton
          active={screen === "settingsList"}
          label="Settings"
          icon={<Sliders size={18} weight="regular" />}
          onClick={onSettings}
        />
      </div>
    </div>
  );
}
