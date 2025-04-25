"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type React from "react";
import { useSubscriptionDrawer } from "./context/subscription-drawer-context";

type SubscriptionTriggerProps = React.ComponentProps<typeof Button>;

export function SubscriptionTrigger({
  children,
  className,
  ...rest
}: SubscriptionTriggerProps) {
  const { setIsOpen } = useSubscriptionDrawer();

  return (
    <Button
      onClick={() => setIsOpen(true)}
      className={cn(
        // TODO add hover effect
        "from-highlight to-highlight-secondary group bg-gradient-to-r",
        className,
      )}
      {...rest}
    >
      {children}
    </Button>
  );
}
