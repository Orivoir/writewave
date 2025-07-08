import Stripe from "stripe";
import dbConnect from "../mongoose";
import User from "@/models/User";

export default async function stripe2user(subscription: Stripe.Subscription | Stripe.Invoice) {

  await dbConnect()
  
  const stripeCustomerId = typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id;

  const user = await User.findOne({ stripeCustomerId });

  return user ?? null
}