"use client";

import { CaretLeft, Minus, Plus } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReminderSelect } from "@/components/reminder-select";
import { cn } from "@/lib/utils";
import type { SetupState } from "@/lib/simulation";

export function SetupScreen({
  step,
  setup,
  onBack,
  onNext,
  onSetText,
  onCountDelta,
  onSetLocation,
  onSetReminder,
  onTogglePush,
}: {
  step: number;
  setup: SetupState;
  onBack: () => void;
  onNext: () => void;
  onSetText: (field: "business" | "owner" | "phone", value: string) => void;
  onCountDelta: (delta: number) => void;
  onSetLocation: (index: number, value: string) => void;
  onSetReminder: (value: number) => void;
  onTogglePush: () => void;
}) {
  const title = step === 1 ? "Your details" : step === 2 ? "Your machines" : "Alerts";
  const blurb =
    step === 1
      ? "We use this to label your dashboard and reach you when a machine needs attention."
      : step === 2
        ? "Tell us how many machines you run and where each one sits."
        : "Choose how Brook Cherith should follow up when you put an alert off.";

  return (
    <div className="flex flex-1 flex-col px-6 pt-4 pb-7">
      <div className="mb-[26px] flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="flex size-8 flex-none cursor-pointer items-center justify-center rounded-full border border-border bg-background text-foreground"
        >
          <CaretLeft size={16} weight="regular" />
        </button>
        <div className="flex flex-1 gap-[5px]">
          {[1, 2, 3].map((n) => (
            <span
              key={n}
              className={cn("h-1 flex-1 rounded-full", n <= step ? "bg-primary" : "bg-muted")}
            />
          ))}
        </div>
        <span className="font-heading text-xs font-medium text-muted-foreground">{step} / 3</span>
      </div>

      <h1 className="mb-2 text-[26px]">{title}</h1>
      <p className="mb-[26px] max-w-[26em] text-sm text-muted-foreground">{blurb}</p>

      {step === 1 && (
        <>
          <div className="mb-4 flex flex-col gap-1.5">
            <label className="text-sm font-medium">Business name</label>
            <Input
              placeholder="Brook Cherith Water Station"
              value={setup.business}
              onChange={(e) => onSetText("business", e.target.value)}
            />
          </div>
          <div className="mb-4 flex flex-col gap-1.5">
            <label className="text-sm font-medium">Owner name</label>
            <Input
              placeholder="Juan dela Cruz"
              value={setup.owner}
              onChange={(e) => onSetText("owner", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Mobile number</label>
            <Input
              placeholder="+63 9XX XXX XXXX"
              value={setup.phone}
              onChange={(e) => onSetText("phone", e.target.value)}
            />
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className="mb-[18px] flex items-center justify-between rounded-card bg-card p-4 px-[18px] shadow-sm ring-hairline">
            <div>
              <div className="text-sm font-medium">Machines to register</div>
              <div className="text-xs text-muted-foreground">You can add or rename them later</div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onCountDelta(-1)}
                disabled={setup.count <= 1}
                aria-label="Fewer"
                className="flex size-[30px] cursor-pointer items-center justify-center rounded-full border border-border bg-background text-foreground disabled:cursor-default disabled:opacity-40"
              >
                <Minus size={15} weight="bold" />
              </button>
              <span className="font-heading min-w-6 text-center text-xl font-semibold">{setup.count}</span>
              <button
                type="button"
                onClick={() => onCountDelta(1)}
                disabled={setup.count >= 12}
                aria-label="More"
                className="flex size-[30px] cursor-pointer items-center justify-center rounded-full border border-border bg-background text-foreground disabled:cursor-default disabled:opacity-40"
              >
                <Plus size={15} weight="bold" />
              </button>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-auto rounded-card bg-card py-1.5 shadow-md ring-hairline">
            {Array.from({ length: setup.count }, (_, i) => (
              <div key={i} className="flex items-center gap-3 px-[18px] py-[11px]">
                <span className="font-heading flex size-[26px] flex-none items-center justify-center rounded-full bg-muted text-xs font-semibold">
                  {i + 1}
                </span>
                <Input
                  className="h-[34px] flex-1 text-[13px]"
                  placeholder="Location, e.g. School Building A"
                  value={setup.locations[i] || ""}
                  onChange={(e) => onSetLocation(i, e.target.value)}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="mb-[22px] flex flex-col gap-1.5">
            <label className="text-sm font-medium">Remind me again after</label>
            <ReminderSelect value={setup.reminder} onChange={onSetReminder} />
          </div>
          <button
            type="button"
            onClick={onTogglePush}
            className="flex w-full cursor-pointer items-center gap-3.5 rounded-card bg-card p-4 px-[18px] text-left text-foreground shadow-md ring-hairline"
          >
            <span className="flex-1">
              <span className="block text-sm font-medium">Push notifications</span>
              <span className="block text-xs text-muted-foreground">
                Alert me the moment a machine runs low
              </span>
            </span>
            <span
              className="relative h-6 w-10 flex-none rounded-full transition-colors"
              style={{ background: setup.push ? "var(--primary)" : "var(--input)" }}
            >
              <span
                className="absolute top-[3px] size-[18px] rounded-full bg-white shadow-sm transition-[left]"
                style={{ left: setup.push ? "19px" : "3px" }}
              />
            </span>
          </button>
        </>
      )}

      <div className="min-h-5 flex-1" />
      <Button className="h-10 w-full" onClick={onNext}>
        {step === 3 ? "Finish setup" : "Continue"}
      </Button>
    </div>
  );
}
