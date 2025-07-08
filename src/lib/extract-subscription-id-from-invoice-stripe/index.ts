import Stripe from "stripe";

// 🔍 Extraction robuste de l'ID d'abonnement (compatible avec l'API Stripe 2025-06-30+)
export default function extractSubscriptionIdFromInvoice(invoice: Stripe.Invoice): string | null {
  for (const line of invoice.lines.data) {
    // Ancien format (direct)
    if (typeof (line as any).subscription === "string") {
      return (line as any).subscription;
    }

    // Nouveau format (imbriqué)
    const maybeId = (line as any)?.parent?.subscription_item_details?.subscription;
    if (typeof maybeId === "string") {
      return maybeId;
    }
  }

  return null;
}