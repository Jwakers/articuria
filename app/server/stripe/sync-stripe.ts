"use server";

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import type Stripe from "stripe";
import { stripe } from "./stripe-client";

export type ClerkUserPublicMetadata =
  | {
      stripeCustomerId?: string;
      subscription?: "none" | "pro";
      subscriptionData?: ClerkSubscriptionMetaData;
    }
  | undefined;

type ClerkSubscriptionMetaData = Partial<{
  subscriptionId: Stripe.Subscription["id"];
  status: Stripe.Subscription.Status;
  priceId: Stripe.Price["id"];
  currentPeriodEnd: Stripe.Subscription["items"]["data"][number]["current_period_end"];
  currentPeriodStart: Stripe.Subscription["items"]["data"][number]["current_period_start"];
  cancelAtPeriodEnd: Stripe.Subscription["cancel_at_period_end"];
  paymentMethod: Stripe.Subscription["default_payment_method"];
}>;

export async function syncStripeDataToClerk(customerId?: string) {
  try {
    const user = await currentUser();

    if (!user) return { data: null, error: "User is not signed in" };

    const stripeCustomerId =
      customerId ??
      (user.publicMetadata as ClerkUserPublicMetadata)?.stripeCustomerId;

    if (!stripeCustomerId)
      return { data: null, error: "User missing stripe customer ID" };

    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      limit: 1,
      status: "all",
      expand: ["data.default_payment_method"],
    });

    if (subscriptions.data.length === 0) {
      const subData: ClerkUserPublicMetadata = {
        stripeCustomerId,
        subscription: "none",
        subscriptionData: undefined,
      };

      await updateUserPublicMetadata(subData, user);
      return { data: subData, error: null };
    }

    // Note only works for single tier subscriptions
    const subscription = subscriptions.data[0];

    const subData: ClerkUserPublicMetadata = {
      stripeCustomerId,
      subscription: "pro",
      subscriptionData: {
        subscriptionId: subscription.id,
        status: subscription.status,
        priceId: subscription.items.data[0].price.id,
        currentPeriodEnd: subscription.items.data[0].current_period_end,
        currentPeriodStart: subscription.items.data[0].current_period_start,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        paymentMethod: subscription.default_payment_method,
      },
    };

    await updateUserPublicMetadata(subData, user);
    return { data: subData, error: null };
  } catch (error) {
    console.error("Error syncing Stripe with Clerk:", error);
    return {
      data: null,
      error: "There was an error syncing Stripe with Clerk",
    };
  }
}

async function updateUserPublicMetadata(
  data: ClerkUserPublicMetadata,
  user?: Awaited<ReturnType<typeof currentUser>>,
) {
  user ??= await currentUser();
  if (!user) throw new Error("user is undefined");

  const client = await clerkClient();
  await client.users.updateUserMetadata(user.id, {
    publicMetadata: data,
  });
}
