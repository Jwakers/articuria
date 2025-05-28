"use server";

import { getUserServer } from "@/app/server/auth";
import { ROUTES } from "@/lib/constants";
import type Stripe from "stripe";
import { stripe } from "./client";
import { syncStripeDataToClerk } from "./sync-stripe";

export async function generateStripeCheckout() {
  const { user } = await getUserServer();

  if (!user) return { data: null, error: "User is not signed in" };

  let stripeCustomerId = (user?.stripeCustomerId as string) ?? "";

  if (!stripeCustomerId) {
    // Create stripe customer ID and sync with clerk
    const newCustomer = await stripe.customers.create({
      email: user.email ?? "",
      metadata: {
        userId: user._id,
      },
    });

    await syncStripeDataToClerk(newCustomer.id);

    stripeCustomerId = newCustomer.id;
  }

  const origin = `${process.env.NODE_ENV === "production" ? "https" : "http"}://${process.env.NEXT_PUBLIC_APP_URL}`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: stripeCustomerId,
      success_url: `${origin}/${ROUTES.success}?sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${ROUTES.dashboard.root}`,
      line_items: [
        {
          price: process.env.STRIPE_PRO_TIER_PRICE_ID,
          quantity: 1,
        },
      ],
    });

    const data = JSON.parse(
      JSON.stringify(session),
    ) as Stripe.Response<Stripe.Checkout.Session>;

    return { data, error: null };
  } catch (error) {
    console.error(error);
    return { data: null, error: "Error creating checkout session" };
  }
}

export async function getStripeBillingData() {
  const { user } = await getUserServer();

  if (!user) return { data: null, error: "Not signed in" };
  if (!user.stripeCustomerId)
    return { data: null, error: "Customer ID is not defined" };

  try {
    const paymentIntents = await stripe.paymentIntents.list({
      customer: user.stripeCustomerId,
      limit: 100,
    });
    return { data: paymentIntents.data, error: null };
  } catch (error) {
    console.error(error);
    return { data: null, error: "Error getting billing data" };
  }
}

export async function getReceiptUrl(chargeId: string) {
  const { user } = await getUserServer();

  if (!user) return null;
  if (!user.stripeCustomerId) return null;

  const charge = await stripe.charges.retrieve(chargeId);

  // Validate the charge belongs to the authenticated user
  if (charge.customer !== user.stripeCustomerId) {
    throw new Error("Unauthorized access to receipt");
  }

  return charge.receipt_url;
}

export async function cancelSubscription() {
  const { user } = await getUserServer();
  const subscriptionId = user?.subscriptionData?.subscriptionId;

  if (!user) return { data: null, error: "Not signed in" };
  if (!subscriptionId) return { data: null, error: "No subscription ID" };

  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);

    if (subscription) await syncStripeDataToClerk(user.stripeCustomerId);
    const data = JSON.parse(JSON.stringify(subscription));

    return { data, error: null };
  } catch (error) {
    console.error(error);
    return { data: null, error: "Error cancelling subscription" };
  }
}
