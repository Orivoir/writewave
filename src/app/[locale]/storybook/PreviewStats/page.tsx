"use client";

import { useState } from "react";
import { ThemeProvider, CssBaseline, Container, Stack, Button } from "@mui/material";
import { usePreviewTheme } from "@/hooks/usePreviewTheme";
import DashboardStatsPreview from "@/components/PreviewStats";

const statsFixtures = {
  empty: { sold: 0, downloads: 0, views: 0, likes: 0 },
  small: { sold: 12, downloads: 40, views: 100, likes: 22 },
  big: { sold: 1200, downloads: 4000, views: 10000, likes: 2200 },
};

export default function PreviewStatsStorybook() {
  const { theme, Toggle } = usePreviewTheme();
  const [state, setState] = useState<keyof typeof statsFixtures>("small");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container sx={{ py: 4 }}>
        {Toggle}

        <Stack direction="row" spacing={2} mb={4}>
          <Button variant="outlined" onClick={() => setState("empty")}>Vide</Button>
          <Button variant="outlined" onClick={() => setState("small")}>Basique</Button>
          <Button variant="outlined" onClick={() => setState("big")}>Gros chiffres</Button>
        </Stack>

        <DashboardStatsPreview stats={statsFixtures[state]} />
      </Container>
    </ThemeProvider>
  );
}
