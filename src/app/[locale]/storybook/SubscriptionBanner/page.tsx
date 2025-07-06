"use client";

import { ThemeProvider, CssBaseline, Container, Stack, Typography, Box } from "@mui/material";
import { usePreviewTheme } from "@/hooks/usePreviewTheme";
import SubscriptionBanner from "@/components/SubscriptionBanner";

const statuses = ["active", "expired", "trial", "none", undefined] as const;

export default function SubscriptionBannerStorybook() {
  const { theme, Toggle } = usePreviewTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container sx={{ py: 4 }}>
        {Toggle}

        <Typography variant="h5" mb={3}>
          Aperçu des différents états de SubscriptionBanner
        </Typography>

        <Stack spacing={3}>
          {statuses.map((status, i) => (
            <Box key={i}>
              <Typography variant="subtitle1" gutterBottom>
                Status: <strong>{String(status)}</strong>
              </Typography>
              <SubscriptionBanner subscriptionStatus={status as string | undefined} />
            </Box>
          ))}
        </Stack>
      </Container>
    </ThemeProvider>
  );
}
