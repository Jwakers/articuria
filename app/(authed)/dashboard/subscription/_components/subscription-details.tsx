"use client";

import { cancelSubscription } from "@/app/server/stripe/stripe-actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { api } from "@/convex/_generated/api";
import { useUser } from "@/hooks/use-user";
import { ACCOUNT_LIMITS, ROUTES, SUBSCRIPTION_TIERS } from "@/lib/constants";
import { price } from "@/lib/utils";
import { useQuery } from "convex/react";
import { Check, Sparkle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export function SubscriptionDetails() {
  const { user } = useUser();
  const videos = useQuery(api.videos.list);
  const videoCount = videos?.length ?? 0;
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const router = useRouter();
  const subData = user?.subscriptionData;
  const nextBillingUnix = subData?.currentPeriodEnd;

  const handleCancelSubscription = useCallback(async () => {
    const promise = cancelSubscription();
    toast.promise(promise, {
      loading: "Cancelling subscription...",
      success: () => {
        setShowCancelDialog(false);
        router.push(ROUTES.dashboard.root);
        return "Subscription cancelled";
      },
      error: () => (
        <p>
          Unable to cancel subscription, please{" "}
          <Link className="underline" href={ROUTES.dashboard.contact}>
            contact us
          </Link>{" "}
          for further support
        </p>
      ),
    });
  }, [router]);

  if (!subData) {
    toast.error(
      "Error getting subscription data. Please try again later or contact us for further support",
    );
    return null;
  }

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Current Subscription</CardTitle>
            <Badge
              variant={subData.status === "active" ? "default" : "destructive"}
              className="capitalize"
            >
              {subData.status?.replace("_", " ")}
            </Badge>
          </div>
          <CardDescription>
            Details about your current subscription plan
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plan</span>
              <span className="font-medium">Pro</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Billing Cycle</span>
              <span className="font-medium">Monthly</span>
            </div>
            {nextBillingUnix ? (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Next Billing Date</span>
                <span className="font-medium">
                  {new Date(nextBillingUnix * 1000).toLocaleDateString()}
                </span>
              </div>
            ) : null}
            {SUBSCRIPTION_TIERS.pro.price ? (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">
                  {price(SUBSCRIPTION_TIERS.pro.price / 100)}
                </span>
              </div>
            ) : null}
          </div>

          <div>
            <h3 className="mb-2 text-lg font-medium">Plan Features</h3>
            <ul className="grid gap-2">
              {SUBSCRIPTION_TIERS.pro.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  {feature.comingSoon ? (
                    <Sparkle className="text-highlight-secondary h-4 w-4" />
                  ) : (
                    <Check className="text-highlight-secondary h-4 w-4" />
                  )}
                  <span>{feature.title}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-medium">Usage</h3>
            <div className="grid gap-4">
              <div>
                <div className="mb-1 flex justify-between">
                  <span className="text-sm">Saved table topics</span>
                  <span className="text-sm">
                    {videoCount} / {ACCOUNT_LIMITS.pro.tableTopicLimit}
                  </span>
                </div>
                <Progress
                  value={
                    (videoCount / ACCOUNT_LIMITS.pro.tableTopicLimit) * 100
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <AlertDialog
            open={showCancelDialog}
            onOpenChange={setShowCancelDialog}
          >
            <AlertDialogTrigger asChild>
              <Button
                variant="link"
                size="sm"
                className="text-destructive ml-auto"
              >
                Cancel Subscription
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to cancel?
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-2">
                  <span>
                    Your subscription will be canceled immediately. You will
                    lose access to premium features at the end of your current
                    billing period.
                  </span>
                  <span className="text-destructive block font-bold">
                    Any videos you have saved passed the free limit may be
                    permanently deleted.
                  </span>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>No, keep my subscription</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive hover:bg-destructive/90"
                  onClick={() => handleCancelSubscription()}
                >
                  Yes, cancel my subscription
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}
