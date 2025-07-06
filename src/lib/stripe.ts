// lib/stripe.ts
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_API_KEY;

if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_API_KEY in environment");
}

// On stocke l’instance en cache global pour éviter les re-inits
declare global {
  var stripeInstance: Stripe | undefined;
}

export const stripe =
  global.stripeInstance ??
  new Stripe(stripeSecretKey, {
    apiVersion: "2025-06-30.basil",
  });

if (process.env.NODE_ENV !== "production") {
  global.stripeInstance = stripe;
}
