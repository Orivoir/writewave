import { sendMail } from "@/lib/send-mail";
import Stripe from "stripe";
import stripe2user from "@/lib/stripe2user";

export default async function onSubscriptionTrialWillEnd(event: Stripe.Event): Promise<void> {

  const subscription = event.data.object as Stripe.Subscription;

  try {
    const user = await stripe2user(subscription)

    if (!user) {
      console.warn("⚠️ Aucun utilisateur trouvé pour onSubscriptionTrialWillEnd stripe event");
      return;
    }

    if(!user.hasTrialEndingNotified) {

      user.hasTrialEndingNotified = true
      await sendMail({
        to: user.email,
        subject: "Votre essai gratuit prends bientôt fin !",
        template: "subscription-trial-will-end",
        params: {
          trialEndAt: subscription.trial_end,
          userName: user.name,
        },
      })
      await user.save()
    }

  }
  catch(err) {
    console.error("❌ Erreur dans onSubscriptionTrialWillEnd:", err);
  }
}