import { Button } from "@mui/material";
import { useTranslations } from "next-intl";

export default function MagicLinkAuthButton({isLoading}: {isLoading: boolean}) {

  const t = useTranslations("Login")

  return (
    <Button
      type="submit"
      variant="contained"
      fullWidth
      disabled={isLoading}
    >
        {t("MagicLinkAuthButton")}
    </Button>
  )
}