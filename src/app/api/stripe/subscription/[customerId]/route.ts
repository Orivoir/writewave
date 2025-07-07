import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";


export async function GET(
  _: NextRequest,
  { params }: { params: { customerId: string } }
) {
  const customerId = await params.customerId;

  if (!customerId) {
    return NextResponse.json({ error: "Missing customer ID" }, { status: 400 });
  }

  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "all", // Tu peux filtrer plus strictement si besoin
      limit: 1,
    });

    const subscription = subscriptions.data[0];

    if (!subscription) {
      return NextResponse.json({ subscription: null }, { status: 200 });
    }

    const plan = subscription.items.data[0]?.price;


    return NextResponse.json({
      id: subscription.id,
      status: subscription.status,
      // currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      plan: {
        amount: plan?.unit_amount ?? 0,
        currency: plan?.currency ?? "eur",
        interval: plan?.recurring?.interval ?? "month",
        nickname: plan?.nickname ?? null,
      },
      isInTrial: subscription.status === "trialing",
      trialEnd: subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null,
    });
  } catch (error) {
    console.error("❌ Stripe subscription fetch error:", error);
    return NextResponse.json(
      { error: "Could not retrieve subscription" },
      { status: 500 }
    );
  }
}
