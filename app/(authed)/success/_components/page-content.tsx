"use client";

import { syncStripeDataToClerk } from "@/app/server/stripe/sync-stripe";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useConfetti } from "@/hooks/use-confetti";
import { ROUTES, SUBSCRIPTION_TIERS } from "@/lib/constants";
import { price, userWithMetadata } from "@/lib/utils";
import { useSession, useUser } from "@clerk/nextjs";
import {
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Settings,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import Loading from "../loading";

export default function PageContent() {
  const { publicMetadata } = userWithMetadata(useUser().user);
  const { session } = useSession();
  const sessionReloaded = useRef(false);
  const isSubscriptionActive =
    publicMetadata?.subscriptionData?.status === "active";
  const startDateUnix = publicMetadata?.subscriptionData?.currentPeriodStart;
  const nextBillingUnix = publicMetadata?.subscriptionData?.currentPeriodEnd;

  useConfetti(isSubscriptionActive && sessionReloaded.current);

  useEffect(() => {
    if (sessionReloaded.current) return;

    syncStripeDataToClerk()
      .then(() => {
        session?.reload();
        sessionReloaded.current = true;
      })
      .catch((error) => {
        console.error("Failed to sync Stripe data:", error);
      });
  }, [session]);

  if (!sessionReloaded.current || !isSubscriptionActive) {
    return <Loading />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-highlight-secondary/5">
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="mx-auto w-full max-w-3xl">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-highlight to-highlight-secondary">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>

            <h1 className="bg-gradient-to-r from-highlight to-highlight-secondary bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
              Subscription Successful!
            </h1>

            <p className="mt-4 text-lg text-muted-foreground">
              Thank you for subscribing to our Pro plan! Your account has been
              upgraded.
            </p>
          </div>

          <div className="mb-8 rounded-xl border bg-background p-6 shadow-md">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-lg font-semibold md:text-xl">Pro Plan</h2>
                {startDateUnix ? (
                  <p className="text-sm text-muted-foreground">
                    Started on{" "}
                    {new Date(startDateUnix * 1000).toLocaleDateString()}
                  </p>
                ) : null}
              </div>
              <div className="text-right">
                {SUBSCRIPTION_TIERS.pro.price ? (
                  <div className="text-lg font-bold">
                    {price(SUBSCRIPTION_TIERS.pro.price / 100)}/month
                  </div>
                ) : null}
                {nextBillingUnix ? (
                  <p className="text-xs text-muted-foreground">
                    Next billing date:{" "}
                    {new Date(nextBillingUnix * 1000).toLocaleDateString()}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="py-4">
              <h3 className="mb-3 text-lg font-medium">
                Your subscription includes:
              </h3>
              <ul className="space-y-2">
                {SUBSCRIPTION_TIERS.pro.features.map((feature) => (
                  <li
                    className="flex items-center gap-2 text-sm"
                    key={feature.title}
                  >
                    <div className="flex-shrink-0 rounded-full bg-highlight/10 p-1">
                      {feature.comingSoon ? (
                        <Sparkles className="h-3 w-3 text-highlight-secondary" />
                      ) : (
                        <CheckCircle className="h-3 w-3 text-highlight-secondary" />
                      )}
                    </div>
                    <div className="">
                      <p className="font-bold">{feature.title}</p>

                      {feature.comingSoon ? (
                        <p className="text-muted-foreground">Coming soon</p>
                      ) : (
                        <p className="text-muted-foreground">
                          {feature.description}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <h2 className="text-lg font-semibold md:text-xl">Next Steps</h2>

          <div className="mb-8 grid gap-4 md:grid-cols-2">
            <Card className="p-4 transition-shadow hover:shadow-md">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 rounded-full bg-highlight/10 p-2">
                  <Sparkles className="h-4 w-4 text-highlight" />
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-medium">
                    Explore Premium Features
                  </h3>
                  <p className="mb-3 text-sm text-muted-foreground">
                    Discover all the new features available with your Pro
                    subscription.
                  </p>
                  <Button variant="subscribe" asChild>
                    <Link href={ROUTES.dashboard.tableTopics.record}>
                      Record your first topic{" "}
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild>
              <Link href="/dashboard">
                Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button asChild variant="outline">
              <Link href={ROUTES.dashboard.subscription}>
                <Settings className="mr-2 h-4 w-4" /> Manage Subscription
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            Need help with your subscription?{" "}
            <Link href={ROUTES.dashboard.contact} className="underline">
              Contact Support
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
