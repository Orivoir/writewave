import {stripe} from "@/lib/stripe"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import isExistsPrice from "@/lib/stripe-prices"

export async function POST(req: NextRequest) {
  try {

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {priceId} = await req.json()

    if (!priceId || !isExistsPrice(priceId)) {
      return NextResponse.json({ error: "Invalid or missing currency" }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Étape 1 : créer un Stripe Customer si pas encore fait
    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user.id.toString() },
      });

      // associe le stripe customer au user model (via le stripe customer id)
      user.stripeCustomerId = customer.id;
      await user.save();
    } 

    const sessionStripe = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: user.stripeCustomerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/dashboard/payment-success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/payment-cancel`,
    });

    
    // url client should redirect for execute payment intent
    // client-side: window.location.href = response.url
    return NextResponse.json({ url: sessionStripe.url });

  } catch(err) {
    console.error("❌ Stripe Checkout Error", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}