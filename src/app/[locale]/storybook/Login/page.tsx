"use client";

import { useState } from "react";
import LoginPage from "@/app/[locale]/login/page"; // adapte le chemin si besoin
import MockSessionProvider from "@/components/MockSessionProvider"; // ton code ci-dessus
import { Box, Button, CssBaseline, Stack, ThemeProvider, Typography } from "@mui/material";
import type { Session } from "next-auth";
import { usePreviewTheme } from "@/hooks/usePreviewTheme";

const mockSession: Session = {
  user: {
    id: "0"
  },
  expires: new Date(Date.now() + 3600 * 1000).toISOString(), // expire dans 1h
};

export default function LoginPagePreview() {
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("unauthenticated");
  const { theme, Toggle } = usePreviewTheme(); 

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        LoginPage preview – Status: <strong>{status}</strong>
      </Typography>

      <Stack direction="row" spacing={2} mb={4}>
        <Button variant="outlined" onClick={() => setStatus("unauthenticated")}>
          Unauthenticated
        </Button>
        <Button variant="outlined" onClick={() => setStatus("authenticated")}>
          Authenticated
        </Button>
        <Button variant="outlined" onClick={() => setStatus("loading")}>
          Loading
        </Button>
      </Stack>

      <ThemeProvider theme={theme}>
        <CssBaseline />
        {Toggle}

        <Box mt={4}>
          <MockSessionProvider
            status={status}
            session={status === "authenticated" ? mockSession : null}
          >
            <LoginPage />
          </MockSessionProvider>
        </Box>
      </ThemeProvider>
    </Box>
  );
}
