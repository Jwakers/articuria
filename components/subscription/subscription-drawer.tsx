"use client";

import type React from "react";

import { generateStripeCheckout } from "@/app/server/stripe/stripe-actions";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { SUBSCRIPTION_TIERS } from "@/lib/constants";
import { price, userWithMetadata } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { loadStripe } from "@stripe/stripe-js";
import { Check, CreditCard, Sparkle, X } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import Spinner from "../ui/spinner";
import { useSubscriptionDrawer } from "./context";

export function SubscriptionDrawer() {
  const { isOpen, setIsOpen } = useSubscriptionDrawer();
  const [isPending, startTransition] = useTransition();
  const { user, publicMetadata } = userWithMetadata(useUser().user);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const { data, error } = await generateStripeCheckout();

      if (error) {
        console.error(error);
        toast.error("There was an error creating checkout");
        return;
      }
      if (!data?.id) {
        toast.error("Enable to get session ID");
        return;
      }

      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
      );

      if (!stripe) {
        toast.error("Error loading Stripe");
        return;
      }

      stripe.redirectToCheckout({
        sessionId: data.id,
      });
    });
  };

  if (!user || publicMetadata.subscriptionData?.status === "active")
    return null;

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="max-h-[80%] bg-gradient-to-b from-background to-highlight/10">
        <div className="container mx-auto w-full overflow-y-auto px-4 py-4">
          <DrawerHeader className="text-center">
            <DrawerTitle className="bg-gradient-to-r from-highlight to-highlight-secondary bg-clip-text text-center text-2xl font-bold text-transparent">
              Choose Your Plan
            </DrawerTitle>
            <DrawerDescription className="text-center text-muted-foreground">
              Select the plan that works best for you
            </DrawerDescription>
            <div className="absolute right-4 top-4">
              <DrawerClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Free Plan */}
            <div className="flex flex-col rounded-lg border bg-background p-6">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="font-medium">Free Plan</h3>
                  <p className="text-sm text-muted-foreground">Basic access</p>
                </div>
                <div className="text-right">
                  <div className="font-bold">Free</div>
                  <p className="text-xs text-muted-foreground">Forever</p>
                </div>
              </div>

              <div className="mb-4 space-y-3">
                {SUBSCRIPTION_TIERS.free.features.map((feature) => (
                  <div
                    className="flex items-center space-x-3"
                    key={feature.title}
                  >
                    <div className="bg-muted-background rounded-full p-1">
                      <Check className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {feature.shortDescription}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                className="mt-auto w-full"
                onClick={() => setIsOpen(false)}
              >
                Continue with Free
              </Button>
            </div>

            {/* Pro Plan - More appealing with gradient and emphasis */}
            <div className="relative overflow-hidden rounded-lg shadow-md">
              <div className="absolute inset-0 bg-gradient-to-br from-highlight to-highlight-secondary" />
              <div className="isolate m-1 rounded border bg-background p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Pro Plan</h3>
                    <p className="text-sm text-muted-foreground">Full access</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {price(SUBSCRIPTION_TIERS.pro.price ?? 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">per month</p>
                  </div>
                </div>

                <div className="mb-6 space-y-3">
                  {SUBSCRIPTION_TIERS.pro.features.map((feature) => (
                    <div
                      className="flex items-center space-x-3"
                      key={feature.title}
                    >
                      <div className="rounded-full bg-highlight/10 p-1">
                        {feature.comingSoon ? (
                          <Sparkle className="h-4 w-4 text-highlight-secondary" />
                        ) : (
                          <Check className="h-4 w-4 text-highlight-secondary" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm">{feature.shortDescription}</p>
                        {feature.comingSoon ? (
                          <p className="text-sm text-muted-foreground">
                            Coming soon
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  type="submit"
                  variant="subscribe"
                  className="w-full"
                  onClick={handleSubscribe}
                  disabled={isPending}
                >
                  {isPending ? (
                    <Spinner />
                  ) : (
                    <CreditCard className="mr-2 h-4 w-4" />
                  )}
                  {isPending ? "Loading..." : "Subscribe now"}
                </Button>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            By subscribing, you agree to our Terms of Service and Privacy
            Policy.
          </p>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
