"use server";

import { getUser } from "@/lib/auth";
import { ROUTES } from "@/lib/constants";
import { getSiteUrl } from "@/lib/utils";
import type Stripe from "stripe";
import { stripe } from "./client";
import { syncStripeDataToClerk } from "./sync-stripe";

const SITE_URL = getSiteUrl();
const PRO_TIER_PRICE_ID = process.env.STRIPE_PRO_TIER_PRICE_ID;
if (!PRO_TIER_PRICE_ID)
  throw new Error("STRIPE_PRO_TIER_PRICE_ID is not defined");

export async function generateStripeCheckout() {
  const { user } = await getUser();

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

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: stripeCustomerId,
      success_url: `${SITE_URL}/${ROUTES.success}?sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/${ROUTES.dashboard.root}`,
      line_items: [
        {
          price: PRO_TIER_PRICE_ID,
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
  const { user } = await getUser();

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
  const { user } = await getUser();

  if (!user) return null;
  if (!user.stripeCustomerId) return null;

  const charge = await stripe.charges.retrieve(chargeId);
  const { customer, receipt_url } = charge;
  const customerId = typeof customer === "string" ? customer : customer?.id;

  if (customerId !== user.stripeCustomerId) {
    throw new Error("Unauthorized access to receipt");
  }

  return receipt_url;
}

export async function cancelSubscription() {
  const { user } = await getUser();
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
