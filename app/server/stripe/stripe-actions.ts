"use server";

import { ROUTES } from "@/lib/constants";
import { userWithMetadata } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import type Stripe from "stripe";
import { stripe } from "./client";
import { syncStripeDataToClerk } from "./sync-stripe";

export async function generateStripeCheckout() {
  const user = await currentUser();

  if (!user) return { data: null, error: "User is not signed in" };

  let stripeCustomerId =
    (user.publicMetadata?.stripeCustomerId as string) ?? "";

  if (!stripeCustomerId) {
    // Create stripe customer ID and sync with clerk
    const newCustomer = await stripe.customers.create({
      email: user.emailAddresses[0].emailAddress,
      metadata: {
        userId: user.id,
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
  const { user, publicMetadata } = userWithMetadata(await currentUser());

  if (!user) return { data: null, error: "Not signed in" };
  if (!publicMetadata.stripeCustomerId)
    return { data: null, error: "Customer ID is not defined" };

  try {
    const paymentIntents = await stripe.paymentIntents.list({
      customer: publicMetadata.stripeCustomerId,
      limit: 100,
    });
    return { data: paymentIntents.data, error: null };
  } catch (error) {
    console.error(error);
    return { data: null, error: "Error getting billing data" };
  }
}

export async function getReceiptUrl(chargeId: string) {
  const charge = await stripe.charges.retrieve(chargeId);

  return charge.receipt_url;
}

export async function cancelSubscription() {
  const { user, publicMetadata } = userWithMetadata(await currentUser());
  const subscriptionId = publicMetadata?.subscriptionData?.subscriptionId;

  if (!user) return { data: null, error: "Not signed in" };
  if (!subscriptionId) return { data: null, error: "No subscription ID" };

  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);

    if (subscription) await syncStripeDataToClerk();
    const data = JSON.parse(JSON.stringify(subscription));

    return { data, error: null };
  } catch (error) {
    console.error(error);
    return { data: null, error: "Error cancelling subscription" };
  }
}
