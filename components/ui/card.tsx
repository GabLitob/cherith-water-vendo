import * as React from "react";

import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "rounded-card bg-card text-card-foreground shadow-md ring-hairline",
        className,
      )}
      {...props}
    />
  );
}

export { Card };
