import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;

if (!key) throw new Error("Stripe key is missing");

export const stripe = new Stripe(key, {
  apiVersion: "2025-03-31.basil",
});
