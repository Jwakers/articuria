"use client";

import { getUserServer } from "@/app/server/auth";
import { syncStripeDataToClerk } from "@/app/server/stripe/sync-stripe";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useConfetti } from "@/hooks/use-confetti";
import { ROUTES, SUBSCRIPTION_TIERS } from "@/lib/constants";
import { price } from "@/lib/utils";
import { useSession } from "@clerk/nextjs";
import {
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Settings,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import Loading from "../loading";

export default async function PageContent() {
  const { user } = await getUserServer();
  const { session } = useSession();
  const sessionReloaded = useRef(false);
  const isSubscriptionActive = user?.subscriptionData?.status === "active";
  const startDateUnix = user?.subscriptionData?.currentPeriodStart;
  const nextBillingUnix = user?.subscriptionData?.currentPeriodEnd;

  useConfetti(isSubscriptionActive && sessionReloaded.current);

  useEffect(() => {
    if (sessionReloaded.current || !session) return;

    let isCancelled = false;

    const syncData = async () => {
      try {
        await syncStripeDataToClerk();
        if (!isCancelled) {
          await session.reload();
          sessionReloaded.current = true;
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Failed to sync Stripe data:", error);
          toast.error(
            "Failed to sync subscription data. Please refresh or contact support.",
          );
          sessionReloaded.current = true;
        }
      }
    };

    syncData();

    return () => {
      isCancelled = true;
    };
  }, [session]);

  if (!sessionReloaded.current || !isSubscriptionActive) {
    return <Loading />;
  }

  return (
    <div className="from-background to-highlight-secondary/5 flex min-h-screen flex-col bg-linear-to-b">
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="mx-auto w-full max-w-3xl">
          <div className="mb-8 text-center">
            <div className="from-highlight to-highlight-secondary mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-r">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>

            <h1 className="gradient-text text-3xl font-bold md:text-4xl">
              Subscription Successful!
            </h1>

            <p className="text-muted-foreground mt-4 text-lg">
              Thank you for subscribing to our Pro plan! Your account has been
              upgraded.
            </p>
          </div>

          <div className="bg-background mb-8 rounded-xl border p-6 shadow-md">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-lg font-semibold md:text-xl">Pro Plan</h2>
                {startDateUnix ? (
                  <p className="text-muted-foreground text-sm">
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
                  <p className="text-muted-foreground text-xs">
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
                    <div className="bg-highlight/10 shrink-0 rounded-full p-1">
                      {feature.comingSoon ? (
                        <Sparkles className="text-highlight-secondary h-3 w-3" />
                      ) : (
                        <CheckCircle className="text-highlight-secondary h-3 w-3" />
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
                <div className="bg-highlight/10 shrink-0 rounded-full p-2">
                  <Sparkles className="text-highlight h-4 w-4" />
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-medium">
                    Explore Premium Features
                  </h3>
                  <p className="text-muted-foreground mb-3 text-sm">
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
            {/* <Card className="p-4 transition-shadow hover:shadow-md">
              <div className="flex items-start gap-3">
                <div className="shrink-0 rounded-full bg-highlight/10 p-2">
                  <BookOpen className="h-4 w-4 text-highlight" />
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-medium">
                    Learn More About Pro Features
                  </h3>
                  <p className="mb-3 text-sm text-muted-foreground">
                    Check out our documentation to learn how to get the most out
                    of your subscription.
                  </p>
                  <Button variant="outline" asChild>
                    <Link href={ROUTES.dashboard.root}>
                      View Documentation <ChevronRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card> */}
          </div>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild>
              <Link
                href={ROUTES.dashboard.root}
                aria-label="Go to your dashboard"
              >
                Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button asChild variant="outline">
              <Link
                href={ROUTES.dashboard.subscription}
                aria-label="Manage your subscription"
              >
                Manage Subscription <Settings className="mr-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground text-sm">
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
