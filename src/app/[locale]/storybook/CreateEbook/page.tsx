"use client";

import { ThemeProvider, CssBaseline, Container, Stack } from "@mui/material";
import { usePreviewTheme } from "@/hooks/usePreviewTheme";
import CreateEbook from "@/components/CreateEbook";

export default function CreateEbookStorybook() {
  const { theme, Toggle } = usePreviewTheme();

  const handleSubmit = (data: any) => {
    console.log("Should POST ebook:", data);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container sx={{ py: 4 }}>
        {Toggle}

        <Stack spacing={4}>
          <CreateEbook onSubmit={handleSubmit} />
        </Stack>
      </Container>
    </ThemeProvider>
  );
}
