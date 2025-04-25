"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Check, CreditCard, X } from "lucide-react";
import { useSubscriptionDrawer } from "./context";

export function SubscriptionDrawer() {
  const { isOpen, setIsOpen } = useSubscriptionDrawer();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle subscription logic here
    console.log("Subscribing with email");
    // You would typically call an API here

    // Show success message or redirect
    setIsOpen(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="to-highlight/10 bg-gradient-to-b from-background">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader className="text-center">
            <DrawerTitle className="from-highlight to-highlight-secondary bg-gradient-to-r bg-clip-text text-center text-2xl font-bold text-transparent">
              Unlock Premium Features
            </DrawerTitle>
            <DrawerDescription className="text-center text-muted-foreground">
              Subscribe today and get access to all premium features
            </DrawerDescription>
            <div className="absolute right-4 top-4">
              <DrawerClose asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6 rounded-full"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="p-4 pb-0">
            <div className="rounded-lg border bg-background p-6 shadow-sm">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-highlight/10 rounded-full p-1">
                    <Check className="text-highlight-secondary h-4 w-4" />
                  </div>
                  <span className="text-sm">
                    Unlimited access to all features
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-highlight/10 rounded-full p-1">
                    <Check className="text-highlight-secondary h-4 w-4" />
                  </div>
                  <span className="text-sm">Priority customer support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-highlight/10 rounded-full p-1">
                    <Check className="text-highlight-secondary h-4 w-4" />
                  </div>
                  <span className="text-sm">Early access to new features</span>
                </div>
              </div>

              <div className="mt-6">
                <div className="from-highlight/5 to-highlight-secondary/5 rounded-lg bg-gradient-to-r p-4">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium">Pro Plan</div>
                    <div className="text-sm font-bold">[PRICE]/month</div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Cancel anytime. No hidden fees.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 pt-2">
            <form onSubmit={handleSubscribe} className="space-y-4">
              <Button
                type="submit"
                // TODO Add variant to button, add hover effect
                className="from-highlight to-highlight-secondary w-full bg-gradient-to-r"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Subscribe Now
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                By subscribing, you agree to our Terms of Service and Privacy
                Policy.
              </p>
            </form>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
