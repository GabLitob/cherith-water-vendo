"use client";

import { Drop } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginScreen({
  onSignIn,
  onGoSetup,
}: {
  onSignIn: () => void;
  onGoSetup: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col justify-center px-6 pt-8 pb-[72px]">
      <div className="mb-[22px] flex size-[52px] items-center justify-center rounded-full bg-primary">
        <Drop size={24} weight="regular" color="oklch(0.988 0.003 106.5)" />
      </div>
      <h1 className="mb-2 text-[26px]">Brook Cherith</h1>
      <p className="mb-7 max-w-[26em] text-sm text-muted-foreground">
        Monitor your water vending machines and get notified the moment one runs low.
      </p>
      <div className="mb-3.5 flex flex-col gap-1.5">
        <label className="text-sm font-medium">Email</label>
        <Input value="owner@brookcherith.ph" readOnly />
      </div>
      <div className="mb-6 flex flex-col gap-1.5">
        <label className="text-sm font-medium">Password</label>
        <Input type="password" value="chrthwtr" readOnly />
      </div>
      <Button className="h-10 w-full" onClick={onSignIn}>
        Sign in
      </Button>
      <p className="mt-4 text-center text-[13px] text-muted-foreground">
        First time here?{" "}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onGoSetup();
          }}
        >
          Set up your account
        </a>
      </p>
    </div>
  );
}
