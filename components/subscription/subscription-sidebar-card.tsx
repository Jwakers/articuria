import { userWithMetadata } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { Check } from "lucide-react";
import { SubscriptionTrigger } from "./subscription-trigger";
import { SubscriptionWrapper } from "./subscription-wrapper";

export async function SubscriptionSidebarCard() {
  const user = userWithMetadata(await currentUser());
  if (!user || user.publicMetadata.subscription === "pro") return null;

  return (
    <SubscriptionWrapper>
      <div className="p-3">
        <h3 className="flex items-center gap-1.5 text-sm font-medium">
          <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-highlight/10">
            <Check className="h-2.5 w-2.5 text-highlight-secondary" />
          </div>
          <span className="bg-gradient-to-r from-highlight to-highlight-secondary bg-clip-text text-transparent">
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
