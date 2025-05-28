import { getUserServer } from "@/app/server/auth";
import { SUBSCRIPTION_TIERS } from "@/lib/constants";
import { price } from "@/lib/utils";
import { Check } from "lucide-react";
import { SubscriptionTrigger } from "./subscription-trigger";
import { SubscriptionWrapper } from "./subscription-wrapper";

export async function SubscriptionBanner() {
  const { user } = await getUserServer();
  if (!user || user.subscriptionData?.status === "active") return null;

  return (
    <SubscriptionWrapper>
      <div className="flex flex-wrap items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-3">
          <div className="bg-highlight/10 hidden h-10 w-10 shrink-0 items-center justify-center rounded-full sm:flex">
            <Check className="text-highlight-secondary h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-medium">
              <span className="gradient-text">Upgrade to Pro</span>
            </h3>
            <p className="text-muted-foreground text-xs">
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
