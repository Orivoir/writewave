import MagicLinkLogin from "@/components/MagicLinkLogin";
import FacebookOauthButton from "@/atomes/FacebookOauthButton";
import GoogleOauthButton from "@/atomes/GoogleOauthButton";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function FormAuth({isLoading}: {isLoading: boolean}) {

  const t = useTranslations("Login")

  return (
    <Box
      maxWidth={400}
      mx="auto"
      my={6}
      px={2}
      display="flex"
      flexDirection="column"
      gap={4}
    >
      <Typography variant="h4" gutterBottom>
        {t("Title")}
      </Typography>

      <Stack spacing={2}>
        <GoogleOauthButton isLoading={isLoading} />
        <FacebookOauthButton isLoading={isLoading} />
      </Stack>

      <Divider />

      <Box mt={4}>
        <Typography variant="subtitle1" gutterBottom>
          {t("MagicLinkTitle")}
        </Typography>
        <MagicLinkLogin isLoading={isLoading} />
      </Box>
    </Box>
  )
}