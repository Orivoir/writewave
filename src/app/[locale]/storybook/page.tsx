"use client";

import { Container, Typography, Stack, Link } from "@mui/material";

export default function StorybookHome() {

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Storybook interne
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Un aperçu des composants standalone de l’application, pour faciliter les tests et les itérations.
      </Typography>
      <Stack spacing={2} mt={4}>
        <Link href="/storybook/CreateEbook">CreateEbook</Link>
        <Link href="/storybook/DashboardHeader">DashboardHeader</Link>
        <Link href="/storybook/DrawerMenu">DrawerMenu</Link>
        <Link href="/storybook/EbookCard">EbookCard</Link>
        <Link href="/storybook/Login">Login</Link>
        <Link href="/storybook/PreviewEbooks">PreviewEbooks</Link>
        <Link href="/storybook/PreviewStats">PreviewStats</Link>
        <Link href="/storybook/SubscriptionBanner">SubscriptionBanner</Link>
      </Stack>
    </Container>
  );
}
