"use client";

import { CaretLeft } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReminderSelect } from "@/components/reminder-select";
import type { FormState } from "@/lib/simulation";

export function ConfigureScreen({
  form,
  onBack,
  onSetName,
  onSetLocation,
  onSetReminder,
  onSave,
}: {
  form: FormState;
  onBack: () => void;
  onSetName: (v: string) => void;
  onSetLocation: (v: string) => void;
  onSetReminder: (v: number) => void;
  onSave: () => void;
}) {
  return (
    <div className="min-h-0 flex-1 overflow-auto px-[18px] pt-4 pb-8">
      <button
        type="button"
        onClick={onBack}
        className="mb-[18px] flex h-8 cursor-pointer items-center gap-1.5 rounded-pill border border-transparent bg-transparent py-0 pr-3 pl-2 text-[13px] font-medium text-muted-foreground"
      >
        <CaretLeft size={16} weight="regular" />
        Back
      </button>
      <h1 className="mb-[5px] text-2xl">Configure</h1>
      <p className="mb-6 text-[13px] text-muted-foreground">{form.name} · registered device</p>

      <div className="mb-4 flex flex-col gap-1.5">
        <label className="text-sm font-medium">Machine name</label>
        <Input value={form.name} onChange={(e) => onSetName(e.target.value)} />
      </div>
      <div className="mb-4 flex flex-col gap-1.5">
        <label className="text-sm font-medium">Location</label>
        <Input value={form.location} onChange={(e) => onSetLocation(e.target.value)} />
      </div>
      <div className="mb-3 flex flex-col gap-1.5">
        <label className="text-sm font-medium">Remind me again after</label>
        <ReminderSelect value={form.reminder} onChange={onSetReminder} />
      </div>
      <p className="mb-[26px] text-[13px] text-muted-foreground">
        Choosing <em>Remind me later</em> on a low-water alert re-notifies you after this interval,
        unless the machine reports water restored first.
      </p>
      <Button className="h-10 w-full" onClick={onSave}>
        Save changes
      </Button>
    </div>
  );
}
