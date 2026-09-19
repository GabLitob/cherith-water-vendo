import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-input border border-transparent bg-[color-mix(in_oklab,var(--input)_50%,transparent)] px-3.5 text-sm text-foreground placeholder:text-muted-foreground outline-none",
        "focus-visible:ring-[3px] focus-visible:ring-ring/30",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
