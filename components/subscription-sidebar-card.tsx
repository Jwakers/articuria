import { Check } from "lucide-react";
import { SubscriptionTrigger } from "./subscription-trigger";
import { SubscriptionWrapper } from "./subscription-wrapper";

export function SubscriptionSidebarCard() {
  return (
    <SubscriptionWrapper>
      <div className="p-3">
        <h3 className="flex items-center gap-1.5 text-sm font-medium">
          <div className="bg-highlight/10 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full">
            <Check className="text-highlight h-2.5 w-2.5" />
          </div>
          <span className="from-highlight to-highlight-secondary bg-gradient-to-r bg-clip-text text-transparent">
            Upgrade to Pro
          </span>
        </h3>

        <div className="mt-2 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            <span className="font-bold">$9.99</span>/mo
          </div>
          <SubscriptionTrigger size="sm">Details</SubscriptionTrigger>
        </div>
      </div>
    </SubscriptionWrapper>
  );
}
