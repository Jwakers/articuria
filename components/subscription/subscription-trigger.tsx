"use client";

import { Button } from "@/components/ui/button";
import type React from "react";
import { useSubscriptionDrawer } from "./context";

type SubscriptionTriggerProps = React.ComponentProps<typeof Button>;

export function SubscriptionTrigger({
  children,
  ...rest
}: SubscriptionTriggerProps) {
  const { setIsOpen } = useSubscriptionDrawer();

  return (
    <Button
      onClick={() => setIsOpen(true)}
      variant="subscribe"
      {...rest}
      aria-label="View subscription details"
    >
      {children}
    </Button>
  );
}
