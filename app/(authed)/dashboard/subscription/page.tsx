import { getUserVideoCount } from "@/app/server/db/queries";
import { getStripeBillingData } from "@/app/server/stripe/stripe-actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";
import { AlertCircle, CreditCard } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BillingTabs, BillingTabsSkeleton } from "./_components/billing-tabs";

export const metadata: Metadata = {
  title: "Subscription & Billing",
  description:
    "View and manage your subscription plans, billing history, and payment methods",
};

export default async function Page() {
  const videoCountPromise = getUserVideoCount();
  const billingDataPromise = getStripeBillingData();

  return (
    <main className="max-w-6xl space-y-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <CreditCard className="h-6 w-6" />
          <h1 className="text-xl font-bold md:text-2xl">
            Subscription & Billing
          </h1>
        </div>
        <p className="text-muted-foreground">
          Manage your subscription and billing history
        </p>
      </div>
      <Suspense fallback={<BillingTabsSkeleton />}>
        <BillingTabs
          billingDataPromise={billingDataPromise}
          videoCountPromise={videoCountPromise}
        />
      </Suspense>
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
    </main>
  );
}
