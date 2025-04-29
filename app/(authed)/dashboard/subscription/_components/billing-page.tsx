"use client";

import { getUserVideoCount } from "@/app/server/db/queries";
import type { getStripeBillingData } from "@/app/server/stripe/stripe-actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ROUTES } from "@/lib/constants";
import { AlertCircle, CreditCard } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BillingHistory } from "./billing-history";
import { SubscriptionDetails } from "./subscription-details";

export type BillingPageProps = {
  videoCount: Awaited<ReturnType<typeof getUserVideoCount>>;
  billingDataPromise: ReturnType<typeof getStripeBillingData>;
};

export function BillingPage(props: BillingPageProps) {
  const [activeTab, setActiveTab] = useState("subscription");

  return (
    <div className="max-w-6xl space-y-4">
      <PageHeader />
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
      <Contact />
    </div>
  );
}

function PageHeader() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <CreditCard className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Billing Management</h1>
      </div>
      <p className="text-muted-foreground">
        Manage your subscription and billing history
      </p>
    </div>
  );
}

function Contact() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <CardTitle>Need Help?</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          If you have any questions about your subscription or need assistance
          with billing, our support team is here to help.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link href={ROUTES.dashboard.contact}>Contact Support</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
