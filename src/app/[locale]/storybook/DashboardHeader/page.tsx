"use client";

import { ThemeProvider, CssBaseline, Container, Stack, Typography, Box } from "@mui/material";
import { usePreviewTheme } from "@/hooks/usePreviewTheme";
import DashboardHeader from "@/components/DashboardHeader";
import { IamResponse } from "@/hooks/useIam";

const factories: IamResponse["user"][] = [
  {
    _id: "1",
    name: "Alice Zihna",
    email: "alice@example.com",
    image: "https://i.pravatar.cc/120?u=azhina",
    role: "premium",
    emailVerified: null,
  },
  {
    _id: "2",
    name: "Bob Gaviera",
    email: "bob@example.com",
    image: "https://i.pravatar.cc/120?u=bgaviera",
    role: "free",
    emailVerified: null,
  },
  {
    _id: "3",
    name: "Tyna Carlson",
    email: "carl@example.com",
    image: "https://i.pravatar.cc/120?u=mcarlson",
    role: "admin",
    emailVerified: null
  },
];

export default function DashboardHeaderPreview() {
  const { theme, Toggle } = usePreviewTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container sx={{ py: 4 }}>
        {Toggle}

        <Stack spacing={6}>
          {factories.map((user, i) => (
            <Box key={user._id || i}>
              <DashboardHeader user={user} onMenuToggle={() => {}} />
            </Box>
          ))}
        </Stack>

        <main style={{ marginTop: 32 }}>
          <Typography>Preview du composant DashboardHeader dans le contexte light/dark.</Typography>
        </main>
      </Container>
    </ThemeProvider>
  );
}
