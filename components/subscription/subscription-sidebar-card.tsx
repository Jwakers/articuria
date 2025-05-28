import { getUserServer } from "@/app/server/auth";
import { SUBSCRIPTION_TIERS } from "@/lib/constants";
import { price } from "@/lib/utils";
import { Check } from "lucide-react";
import { SubscriptionTrigger } from "./subscription-trigger";
import { SubscriptionWrapper } from "./subscription-wrapper";

export async function SubscriptionSidebarCard() {
  const { user } = await getUserServer();
  if (user?.subscriptionData?.status === "active") return null;

  return (
    <SubscriptionWrapper>
      <div className="p-3">
        <h3 className="flex items-center gap-1.5 text-lg font-medium">
          <div className="bg-highlight/10 flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
            <Check className="text-highlight-secondary h-2.5 w-2.5" />
          </div>
          <span className="gradient-text">Upgrade to Pro</span>
        </h3>

        <div className="mt-2 flex items-center justify-between">
          {SUBSCRIPTION_TIERS.pro.price ? (
            <div className="text-muted-foreground text-xs">
              <span className="font-bold">
                {price(SUBSCRIPTION_TIERS.pro.price / 100)}
              </span>
              /mo
            </div>
          ) : null}

          <SubscriptionTrigger size="sm">Details</SubscriptionTrigger>
        </div>
      </div>
    </SubscriptionWrapper>
  );
}
