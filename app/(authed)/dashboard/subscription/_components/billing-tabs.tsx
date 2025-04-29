"use client";

import { getUserVideoCount } from "@/app/server/db/queries";
import type { getStripeBillingData } from "@/app/server/stripe/stripe-actions";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { BillingHistory } from "./billing-history";
import { SubscriptionDetails } from "./subscription-details";

export type BillingPageProps = {
  billingDataPromise: ReturnType<typeof getStripeBillingData>;
  videoCountPromise: ReturnType<typeof getUserVideoCount>;
};

export function BillingTabs(props: BillingPageProps) {
  const [activeTab, setActiveTab] = useState("subscription");

  return (
    <Tabs
      defaultValue="subscription"
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="subscription">Subscription</TabsTrigger>
        <TabsTrigger value="history">Billing History</TabsTrigger>
      </TabsList>
      <TabsContent value="subscription">
        <SubscriptionDetails {...props} />
      </TabsContent>
      <TabsContent value="history">
        <BillingHistory {...props} />
      </TabsContent>
    </Tabs>
  );
}

export function BillingTabsSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-9" />
      <Skeleton className="h-[542px]" />
    </div>
  );
}
