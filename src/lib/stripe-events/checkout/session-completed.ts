import User from "@/models/User";
import dbConnect from "@/lib/mongoose";
import { sendMail } from "@/lib/send-mail";
import Stripe from "stripe";


/**
 * @event `checkout.session.completed`
 * @description webhook stripe event handler, when client have finalized payment at checkout Stripe (subscription or payment one-time)
 */
export default async function onSessionCompleted(event: Stripe.Event): Promise<void> {

  // callback trigger for bad event type
  if (event.type !== "checkout.session.completed") {
    console.log("checkout.session.completed callback have been called for a:" + event.type + " event")
    return;
  }

  const session = event.data.object as Stripe.Checkout.Session;

  const customerId = session.customer

  if (!customerId) {
    console.log("checkout.session.completed event aborted because customer id from event is undefined")
    return;
  }

  await dbConnect()

  const user = await User.findOne({ stripeCustomerId: customerId })

  if (!user) {
    console.error(`checkout.session.completed event aborted because no user find for customer id: ${customerId}`);
    return;
  }

  await sendMail({
    to: user.email,
    subject: "Welcome at Writewave Pro",
    template: "checkout-completed",
    params: {
      userName: user.name || "there"
    }
  })

  console.log(`✅ checkout.session.completed handled for ${user.email}`);
}