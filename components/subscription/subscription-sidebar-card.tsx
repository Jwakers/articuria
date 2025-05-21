import { SUBSCRIPTION_TIERS } from "@/lib/constants";
import { price, userWithMetadata } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { Check } from "lucide-react";
import { SubscriptionTrigger } from "./subscription-trigger";
import { SubscriptionWrapper } from "./subscription-wrapper";

export async function SubscriptionSidebarCard() {
  const { user, publicMetadata } = userWithMetadata(await currentUser());
  if (!user || publicMetadata.subscriptionData?.status === "active")
    return null;

  return (
    <SubscriptionWrapper>
      <div className="p-3">
        <h3 className="flex items-center gap-1.5 text-lg font-medium">
          <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-highlight/10">
            <Check className="h-2.5 w-2.5 text-highlight-secondary" />
          </div>
          <span className="gradient-text">Upgrade to Pro</span>
        </h3>

        <div className="mt-2 flex items-center justify-between">
          {SUBSCRIPTION_TIERS.pro.price ? (
            <div className="text-xs text-muted-foreground">
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
