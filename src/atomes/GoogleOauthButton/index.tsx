import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google"
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function GoogleOauthButton({isLoading}: {isLoading: boolean}) {

  const t = useTranslations("Login");

  return (
    <Button
      variant="outlined"
      startIcon={<GoogleIcon />}
      onClick={() => signIn("google")}
      fullWidth
      disabled={isLoading}
    >
      {t("GoogleOauthButton")}
    </Button>
  )
}