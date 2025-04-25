import { Check } from "lucide-react";
import { SubscriptionTrigger } from "./subscription-trigger";
import { SubscriptionWrapper } from "./subscription-wrapper";

export function SubscriptionBanner() {
  return (
    <SubscriptionWrapper>
      <div className="flex flex-col items-center justify-between gap-4 p-4 sm:flex-row">
        <div className="flex items-center gap-3">
          <div className="bg-highlight/10 text-highlight hidden h-10 w-10 flex-shrink-0 items-center justify-center rounded-full sm:flex">
            <Check className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-medium sm:text-base">
              <span className="from-highlight to-highlight-secondary bg-gradient-to-r bg-clip-text text-transparent">
                Upgrade to Pro
              </span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Get access to premium features
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-xs font-medium sm:block">
            <span className="text-sm font-bold">[PRICE]</span>/month
          </div>
          <SubscriptionTrigger>More info</SubscriptionTrigger>
        </div>
      </div>
    </SubscriptionWrapper>
  );
}
