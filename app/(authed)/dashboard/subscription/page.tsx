import { getUserVideoCount } from "@/app/server/db/queries";
import { getStripeBillingData } from "@/app/server/stripe/stripe-actions";
import type { Metadata } from "next";
import { Suspense } from "react";
import { BillingPage } from "./_components/billing-page";

export const metadata: Metadata = {
  title: "Billing Management",
  description: "Manage your subscription and billing details",
};

// TODO - improve loading ui
export default async function Page() {
  const videoCount = await getUserVideoCount();
  const billingDataPromise = getStripeBillingData();

  return (
    <Suspense>
      <BillingPage
        videoCount={videoCount}
        billingDataPromise={billingDataPromise}
      />
    </Suspense>
  );
}
