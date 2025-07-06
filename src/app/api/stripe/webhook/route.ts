import { NextResponse, NextRequest } from "next/server";
import {stripe} from "@/lib/stripe"
import Stripe from "stripe"
import onSessionCompleted from "@/lib/stripe-events/checkout/session-completed";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  const bodyBuffer = await req.arrayBuffer();
  const body = Buffer.from(bodyBuffer);

  let event: Stripe.Event;

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

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      onSessionCompleted(event)
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
