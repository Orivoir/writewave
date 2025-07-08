import { Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function SubscriptionButton() {

  const t = useTranslations("Plan")

  const [isLoading, setIsLoading] = useState(false)

  const onSubscription = async () => {
    setIsLoading(true)
    const res = await fetch(
      "/api/stripe/checkout",
      {
        body: JSON.stringify({priceId: "price_1RhH4KQ5zWBsaZZn5C36TI55"}), // @TODO: dynamique price id (for correct devise)
        method: "POST"
      }
    )

    const {url} = await res.json()

    window.location.href = url
  }

  return (
    <Button
      variant="contained"
      onClick={onSubscription}
      loading={isLoading}
      loadingPosition="end"
    >
      {t("SubscriptionButton")}
    </Button>
  )
}