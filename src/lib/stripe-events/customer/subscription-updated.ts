import { sendMail } from "@/lib/send-mail";
import Stripe from "stripe";
import stripe2user from "@/lib/stripe2user";

export default async function onSubscriptionUpdated(event: Stripe.Event): Promise<void> {
  const subscription = event.data.object as Stripe.Subscription;

  try {
    const user = await stripe2user(subscription);
    if (!user) {
      console.warn("⚠️ Aucun utilisateur trouvé pour onSubscriptionUpdated stripe event");
      return;
    }

    const now = Math.floor(Date.now() / 1000);
    const trialEnded = subscription.trial_end !== null && subscription.trial_end < now;
    const cancelAt = subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : null;

    switch (subscription.status) {
      case "trialing":
        console.log(`ℹ️ ${user.email} est en période d'essai.`);
        return;

      case "active":
        if (trialEnded) {
          await sendMail({
            to: user.email,
            subject: "Votre âme d’écrivain vous attend !",
            template: "subscription-trial-ended",
            params: { userName: user.name },
          });
          console.log(`✅ Fin de période d'essai pour ${user.email}`);
        } else {
          await sendMail({
            to: user.email,
            subject: "Bienvenue dans votre espace pro",
            template: "subscription-created",
            params: { userName: user.name },
          });
          console.log(`✅ Abonnement actif confirmé pour ${user.email}`);

          if (subscription.cancel_at_period_end && cancelAt) {
            console.log(`ℹ️ Abonnement de ${user.email} sera annulé à la fin : ${cancelAt.toISOString()}`);
          }
        }
        return;

      case "past_due":
        console.warn(`⚠️ ${user.email} a un paiement en échec, mais Stripe retentera.`);
        const latestInvoice = subscription.latest_invoice as Stripe.Invoice | string | null;

        let invoiceUrl = null;
        if (typeof latestInvoice === "object" && latestInvoice?.hosted_invoice_url) {
          invoiceUrl = latestInvoice.hosted_invoice_url;
        }

        await sendMail({
          to: user.email,
          subject: "Action requise : paiement incomplet",
          template: "payment-incomplete",
          params: { userName: user.name, paymentUrl: invoiceUrl },
        });
        return;

      case "incomplete":
        console.warn(`⚠️ ${user.email} a un paiement incomplet (souvent 3D Secure non complété).`);
        // NE PAS envoyer "abonnement clôturé" ici
        return;

      case "canceled":
        await sendMail({
          to: user.email,
          subject: "Abonnement clôturé !",
          template: "subscription-deleted",
          params: { userName: user.name },
        });
        console.log(`⚠️ ${user.email} résilié (status: canceled)`);
        return;

      default:
        console.log(`ℹ️ ${user.email} a un statut inattendu : ${subscription.status}`);
        return;
    }
  } catch (err) {
    console.error("❌ Erreur dans onSubscriptionUpdated:", err);
  }
}
