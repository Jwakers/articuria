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
import { useUser } from "@/hooks/use-user";
import { SUBSCRIPTION_TIERS } from "@/lib/constants";
import { price } from "@/lib/utils";
import { loadStripe } from "@stripe/stripe-js";
import { Check, CreditCard, Loader2, Sparkle, X } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { useSubscriptionDrawer } from "./context";

export function SubscriptionDrawer() {
  const { isOpen, setIsOpen } = useSubscriptionDrawer();
  const [isPending, startTransition] = useTransition();
  const { user } = useUser();

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
        toast.error("Unable to get session ID");
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

  if (user?.subscriptionData?.status === "active") return null;

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="from-background to-highlight/10 max-h-[80%] bg-linear-to-b">
        <div className="container mx-auto w-full overflow-y-auto py-4">
          <DrawerHeader className="text-center">
            <DrawerTitle className="gradient-text text-center text-2xl font-bold">
              Choose Your Plan
            </DrawerTitle>
            <DrawerDescription className="text-muted-foreground text-center">
              Select the plan that works best for you
            </DrawerDescription>
            <div className="absolute top-4 right-4">
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
            <div className="bg-background flex flex-col rounded-lg border p-6">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium">Free Plan</h3>
                  <p className="text-muted-foreground text-sm">Basic access</p>
                </div>
                <div className="text-right">
                  <div className="font-bold">Free</div>
                  <p className="text-muted-foreground text-xs">Forever</p>
                </div>
              </div>

              <ul className="mb-4 space-y-3">
                {SUBSCRIPTION_TIERS.free.features.map((feature) => (
                  <li
                    className="flex items-center space-x-3"
                    key={feature.title}
                  >
                    <div className="bg-muted-background rounded-full p-1">
                      <Check className="text-muted-foreground h-3 w-3" />
                    </div>
                    <span className="text-muted-foreground text-sm">
                      {feature.shortDescription}
                    </span>
                  </li>
                ))}
              </ul>

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
              <div className="from-highlight to-highlight-secondary absolute inset-0 bg-linear-to-br" />
              <div className="bg-background isolate m-1 rounded border p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Pro Plan</h3>
                    <p className="text-muted-foreground text-sm">Full access</p>
                  </div>
                  {SUBSCRIPTION_TIERS.pro.price ? (
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        {price(SUBSCRIPTION_TIERS.pro.price / 100)}
                      </div>
                      <p className="text-muted-foreground text-xs">per month</p>
                    </div>
                  ) : null}
                </div>

                <ul className="mb-6 space-y-3">
                  {SUBSCRIPTION_TIERS.pro.features.map((feature) => (
                    <li
                      className="flex items-center space-x-3"
                      key={feature.title}
                    >
                      <div className="bg-highlight/10 rounded-full p-1">
                        {feature.comingSoon ? (
                          <Sparkle className="text-highlight-secondary h-4 w-4" />
                        ) : (
                          <Check className="text-highlight-secondary h-4 w-4" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm">{feature.shortDescription}</p>
                        {feature.comingSoon ? (
                          <p className="text-muted-foreground text-sm">
                            Coming soon
                          </p>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>

                <p className="text-muted-foreground mb-4 text-center text-sm">
                  No contract. Cancel anytime
                </p>

                <Button
                  type="submit"
                  variant="subscribe"
                  className="w-full"
                  onClick={handleSubscribe}
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <CreditCard className="mr-2 h-4 w-4" />
                  )}
                  {isPending ? "Loading..." : "Subscribe now"}
                </Button>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground text-center text-xs">
            By subscribing, you agree to our Terms of Service and Privacy
            Policy.
          </p>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
