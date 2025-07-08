import { sendMail } from "@/lib/send-mail";
import Stripe from "stripe";
import stripe2user from "@/lib/stripe2user";

export default async function onSubscriptionCreated(event: Stripe.Event): Promise<void> {
  const subscription = event.data.object as Stripe.Subscription;

  try {

    const user = await stripe2user(subscription)

    if (!user) {
      console.warn("⚠️ Aucun utilisateur trouvé pour le onSubscriptionCreated");
      return;
    }

    // Abonnement avec période d’essai
    if (subscription.trial_end && !user.hasUsedTrial) {
      user.hasUsedTrial = true;
      await user.save();

      await sendMail({
        to: user.email,
        subject: "Bienvenue dans votre période d’essai",
        template: "subscription-created",
        params: {
          trialEndAt: subscription.trial_end,
          userName: user.name,
        },
      });

      console.log("✅ Essai gratuit activé pour:", user.email);
    }
    // Abonnement sans essai, actif dès maintenant
    else if (!subscription.trial_end && subscription.status === "active") {
      await sendMail({
        to: user.email,
        subject: "Bienvenue dans votre espace pro",
        template: "subscription-created",
        params: {
          userName: user.name,
        },
      });

      console.log("✅ Abonnement actif (sans trial) pour:", user.email);
    } else {
      console.warn(
        `⚠️ Subscription ignorée: status=${subscription.status}, trial_end=${subscription.trial_end}`
      );
    }

  } catch (err) {
    console.error("❌ Erreur dans onSubscriptionCreated:", err);
  }
}
