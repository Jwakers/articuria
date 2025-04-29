import { stripe } from "@/app/server/stripe/stripe-client";
import { syncStripeDataToClerk } from "@/app/server/stripe/sync-stripe";
import { tryCatch } from "@/lib/utils";
import { headers } from "next/headers";
import { after, NextResponse } from "next/server";
import type Stripe from "stripe";

export async function POST(req: Request): Promise<NextResponse> {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature");

  if (!signature) return NextResponse.json({}, { status: 400 });

  async function doEventProcessing() {
    if (typeof signature !== "string") {
      throw new Error("[STRIPE HOOK] Header isn't a string???");
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );

    // Return early, let the processing continue in the background
    return after(() => processEvent(event));
  }

  const { error } = await tryCatch(doEventProcessing());

  if (error) {
    console.error("[STRIPE HOOK] Error processing event", error);
  }

  return NextResponse.json({ received: true });
}

const allowedEvents: Stripe.Event.Type[] = [
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "customer.subscription.paused",
  "customer.subscription.resumed",
  "customer.subscription.pending_update_applied",
  "customer.subscription.pending_update_expired",
  "customer.subscription.trial_will_end",
  "invoice.paid",
  "invoice.payment_failed",
  "invoice.payment_action_required",
  "invoice.upcoming",
  "invoice.marked_uncollectible",
  "invoice.payment_succeeded",
  "payment_intent.succeeded",
  "payment_intent.payment_failed",
  "payment_intent.canceled",
];

async function processEvent(event: Stripe.Event) {
  if (!allowedEvents.includes(event.type))
    return console.log(
      `[STRIPE HOOK] Event ${event.type} not flagged for processing`,
    );

  const { customer: customerId } = (event?.data?.object || {}) as {
    customer: string;
  };

  if (typeof customerId !== "string") {
    console.error(
      `[STRIPE HOOK] Invalid or missing customer ID in event:`,
      event.type,
    );
    throw new Error(
      `[STRIPE HOOK] ID isn't string.\nEvent type: ${event.type}`,
    );
  }

  try {
    return await syncStripeDataToClerk(customerId);
  } catch (error) {
    console.error(`[STRIPE HOOK] Error syncing customer ${customerId}:`, error);
    throw error;
  }
}
