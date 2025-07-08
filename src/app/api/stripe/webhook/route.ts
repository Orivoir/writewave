import { NextResponse, NextRequest } from "next/server";
import {stripe} from "@/lib/stripe"
import Stripe from "stripe"
import onSessionCompleted from "@/lib/stripe-events/checkout/session-completed";
import onSubscriptionCreated from "@/lib/stripe-events/customer/subscription-created";
import onSubscriptionDeleted from "@/lib/stripe-events/customer/subscription-deleted";
import onSubscriptionTrialWillEnd from "@/lib/stripe-events/customer/subscription-trial-will-end";
import onSubscriptionUpdated from "@/lib/stripe-events/customer/subscription-updated";
import onInvoicePaymentFailed from "@/lib/stripe-events/invoice/payment-failed";
import onInvoicePaymentSucceeded from "@/lib/stripe-events/invoice/payment-success";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  const bodyBuffer = await req.arrayBuffer();
  const body = Buffer.from(bodyBuffer);

  let event: Stripe.Event;

  // check signature request (secret webhook)
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed.", err);
    return NextResponse.json({ error: "Webhook Error: Invalid signature" }, { status: 400 });
  }

  // Handle the stripe event
  switch (event.type) {
    case "checkout.session.completed":
      await onSessionCompleted(event)
      break;
    case "customer.subscription.created":
      await onSubscriptionCreated(event)
      break;
    case "customer.subscription.deleted":
      await onSubscriptionDeleted(event)
      break;
    case "customer.subscription.trial_will_end":
      await onSubscriptionTrialWillEnd(event)
      break;
    case "customer.subscription.updated":
      await onSubscriptionUpdated(event)
      break;
    case "invoice.payment_failed":
      await onInvoicePaymentFailed(event)
      break;
    case "invoice.payment_succeeded":
      await onInvoicePaymentSucceeded(event)
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
