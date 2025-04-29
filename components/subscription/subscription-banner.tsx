import { SUBSCRIPTION_TIERS } from "@/lib/constants";
import { price, userWithMetadata } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { Check } from "lucide-react";
import { SubscriptionTrigger } from "./subscription-trigger";
import { SubscriptionWrapper } from "./subscription-wrapper";

export async function SubscriptionBanner() {
  const { user, publicMetadata } = userWithMetadata(await currentUser());
  if (!user || publicMetadata.subscriptionData?.status === "active")
    return null;

  return (
    <SubscriptionWrapper>
      <div className="flex flex-wrap items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-3">
          <div className="hidden h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-highlight/10 sm:flex">
            <Check className="h-5 w-5 text-highlight-secondary" />
          </div>
          <div>
            <h3 className="text-sm font-medium sm:text-base">
              <span className="bg-gradient-to-r from-highlight to-highlight-secondary bg-clip-text text-transparent">
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
            <span className="text-sm font-bold">
              {SUBSCRIPTION_TIERS.pro.price
                ? price(SUBSCRIPTION_TIERS.pro.price / 100)
                : "N/A"}
            </span>
            /month
          </div>
          <SubscriptionTrigger>More info</SubscriptionTrigger>
        </div>
      </div>
    </SubscriptionWrapper>
  );
}
