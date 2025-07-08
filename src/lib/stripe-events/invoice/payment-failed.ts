import { sendMail } from "@/lib/send-mail";
import Stripe from "stripe";
import stripe2user from "@/lib/stripe2user";
import extractSubscriptionIdFromInvoice from "@/lib/extract-subscription-id-from-invoice-stripe";

export default async function onInvoicePaymentFailed(event: Stripe.Event): Promise<void> {
  if (event.type !== "invoice.payment_failed") {
    console.warn("⚠️ Mauvais type d'event pour ce handler");
    return;
  }

  const invoice = event.data.object as Stripe.Invoice;

  try {
    // Récup subscription dans lines, si pas dans l'objet directement
    const subscriptionId = extractSubscriptionIdFromInvoice(invoice)

    if (!subscriptionId) {
      console.warn("⚠️ Pas d'abonnement lié à cette facture échouée");
      return;
    }

    const user = await stripe2user(invoice);
    if (!user) {
      console.warn("⚠️ Aucun utilisateur trouvé pour invoice.payment_failed");
      return;
    }
    
    await sendMail({
      to: user.email,
      subject: "Échec du paiement de votre abonnement",
      template: "invoice-payment-failed",
      params: {
        userName: user.name,
        amount: (invoice.amount_due ?? 0) / 100,
        currency: invoice.currency.toUpperCase(),
        dueDate: invoice.due_date ? new Date(invoice.due_date * 1000).toLocaleDateString("fr-FR") : null,
      }
    });

    console.log(`⚠️ Paiement échoué pour ${user.email} (invoice ${invoice.id})`);

  } catch (err) {
    console.error("❌ Erreur dans onInvoicePaymentFailed:", err);
  }
}
