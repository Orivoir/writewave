import { Alert } from "@mui/material";

interface SubscriptionBannerProps {
  subscriptionStatus?: string;
}

export default function SubscriptionBanner({ subscriptionStatus }: SubscriptionBannerProps) {
  switch (subscriptionStatus) {
    case "active":
      return null; // pas besoin de bannière
    case "expired":
      return (
        <Alert severity="error" sx={{ mb: 2 }}>
          Votre abonnement a expiré. Merci de le renouveler pour continuer à profiter des services premium.
        </Alert>
      );
    case "trial":
      return (
        <Alert severity="info" sx={{ mb: 2 }}>
          Vous êtes en période d’essai. Profitez-en pour découvrir toutes les fonctionnalités premium !
        </Alert>
      );
    case "none":
    default:
      return (
        <Alert severity="info" sx={{ mb: 2 }}>
          Profitez d’un essai gratuit dès maintenant et découvrez toutes les fonctionnalités premium !
      </Alert>
      );
  }
}
