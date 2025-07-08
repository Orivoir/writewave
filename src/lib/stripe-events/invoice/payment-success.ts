import { sendMail } from "@/lib/send-mail";
import Stripe from "stripe";
import stripe2user from "@/lib/stripe2user";
import { stripe } from "@/lib/stripe";
import extractSubscriptionIdFromInvoice from "@/lib/extract-subscription-id-from-invoice-stripe";

export default async function onInvoicePaymentSucceeded(event: Stripe.Event): Promise<void> {
  if (event.type !== "invoice.payment_succeeded") {
    console.warn("⚠️ Mauvais type d'event pour ce handler");
    return;
  }

  const invoice = event.data.object as Stripe.Invoice;

  try {
    const subscriptionId = extractSubscriptionIdFromInvoice(invoice);

    if (!subscriptionId) {
      console.warn("⚠️ invoice.payment_succeeded sans subscription ID détectable");
      console.dir(invoice.lines.data, { depth: null });
      return;
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    if (!subscription) {
      console.warn("⚠️ Subscription introuvable après retrieve()");
      return;
    }

    const user = await stripe2user(invoice);
    if (!user) {
      console.warn("⚠️ Aucun utilisateur trouvé pour invoice.payment_succeeded");
      return;
    }

    const amount = invoice.amount_paid / 100;
    const currency = invoice.currency.toUpperCase();
    const paidAt = new Date(invoice.status_transitions.paid_at! * 1000);

    console.log(`✅ Paiement réussi pour ${user.email} : ${amount} ${currency} (invoice ${invoice.id})`);

    if (invoice.amount_paid === 0) {
      console.log(`ℹ️ Paiement de 0€ ignoré pour ${user.email} (trial period)`);
      return;
    } else {
      await sendMail({
        to: user.email,
        subject: "Paiement confirmé – Merci pour votre soutien !",
        template: "invoice-payment-success",
        params: {
          userName: user.name,
          amount,
          currency,
          date: paidAt.toLocaleDateString("fr-FR"),
          invoiceUrl: invoice.hosted_invoice_url ?? "#",
        },
      });
    }
    

  } catch (err) {
    console.error("❌ Erreur dans onInvoicePaymentSucceeded:", err);
  }
}
