"use server";

import { ROUTES } from "@/lib/constants";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { stripe } from "./stripe-client";

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

    // This is the sync function - should abstract
    const client = await clerkClient();
    await client.users.updateUserMetadata(user.id, {
      publicMetadata: {
        stripeCustomerId: newCustomer.id,
      },
    });

    stripeCustomerId = newCustomer.id;
  }

  const origin = `${process.env.NODE_ENV === "production" ? "https" : "http"}://${process.env.NEXT_PUBLIC_APP_URL}`;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: stripeCustomerId,
    success_url: `${origin}/${ROUTES.subscription.success}?sessionId={CHECKOUT_SESSION_ID}`,
    cancel_url: origin,
    line_items: [
      {
        price: process.env.STRIPE_PRO_TIER_PRICE_ID,
        quantity: 1,
      },
    ],
  });

  return { data: session, error: null };
}
