import FacebookIcon from "@mui/icons-material/Facebook"
import { Button } from "@mui/material"
import { signIn } from "next-auth/react"
import { useTranslations } from "next-intl";

export default function FacebookOauthButton({isLoading}: {isLoading: boolean}) {

  const t = useTranslations("Login")

  return (
    <Button
      variant="outlined"
      startIcon={<FacebookIcon />}
      onClick={() => signIn("facebook")}
      fullWidth
      disabled={isLoading}
    >
      {t("FacebookOauthButton")}
    </Button>
  )
}