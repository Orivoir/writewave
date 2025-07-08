import { sendMail } from "@/lib/send-mail";
import Stripe from "stripe";
import stripe2user from "@/lib/stripe2user";

export default async function onSubscriptionDeleted(event: Stripe.Event): Promise<void> {
  const subscription = event.data.object as Stripe.Subscription;

  try {
    const user = await stripe2user(subscription);

    if (!user) {
      console.warn("⚠️ Aucun utilisateur trouvé pour onSubscriptionDeleted stripe event");
      return;
    }


    const isCanceledImmediately = subscription.cancel_at_period_end === false;

    if (isCanceledImmediately) {
      await sendMail({
        to: user.email,
        subject: "Votre abonnement a été annulé",
        template: "subscription-deleted",
        params: {
          userName: user.name,
          canceledAt: subscription.canceled_at
            ? new Date(subscription.canceled_at * 1000)
            : new Date(),
        },
      });

      console.log("✅ Abonnement annulé immédiatement pour :", user.email);
    } else if (subscription.cancel_at) {
      const cancelAt = new Date(subscription.cancel_at * 1000);
      console.log(`ℹ️ Annulation planifiée à la fin de la période : ${cancelAt.toISOString()}`);

      await sendMail({
        to: user.email,
        subject: "Votre âme d'écrivain est en repos !",
        template: "subscription-deleted",
        params: {
          userName: user.name,
          subscriptionEndAt: cancelAt,
        },
      });
    } else {
      console.log(`ℹ️ Annulation de subscription sans annulation immédiate ni date de fin pour ${user.email}`);
    }

  } catch (err) {
    console.error("❌ Erreur dans onSubscriptionDeleted:", err);
  }
}
