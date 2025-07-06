"use client";

import { useState } from "react";
import { ThemeProvider, CssBaseline, Container, Stack, Button, Box } from "@mui/material";
import { usePreviewTheme } from "@/hooks/usePreviewTheme";
import PreviewEbooks from "@/components/PreviewEbooks";
import { EbookResponse } from "@/hooks/useEbooks";

const mockEbooks: EbookResponse[] = [
  {
    _id: "1",
    title: "Ebook 1",
    slug: "ebook-1",
    author: "user-id-1" as any,
    public: true,
    theme: "theme-id-1" as any,
    createdAt: new Date(),
    updatedAt: new Date(),
    coverImage: "https://picsum.photos/800/300?u=key-1",
    coverImageKey: "key-1"
  },
  {
    _id: "2",
    title: "Ebook 2",
    slug: "ebook-2",
    author: "user-id-2" as any,
    public: true,
    theme: "theme-id-2" as any,
    createdAt: new Date(),
    updatedAt: new Date(),
    coverImage: "https://picsum.photos/600/280?u=key-2",
    coverImageKey: "key-2"
  },
  {
    _id: "3",
    title: "Ebook 3",
    slug: "ebook-3",
    author: "user-id-3" as any,
    public: true,
    theme: "theme-id-3" as any,
    createdAt: new Date(),
    updatedAt: new Date(),
    coverImage: "https://picsum.photos/400/600?u=key-3",
    coverImageKey: "key-3"
  },
];

export default function PreviewEbooksStorybook() {
  const { theme, Toggle } = usePreviewTheme();
  const [state, setState] = useState("loading");

  let ebooks: EbookResponse[] = [];
  let isLoading = false;

  if (state === "loading") {
    isLoading = true;
  } else if (state === "none") {
    ebooks = [];
  } else if (state === "few") {
    ebooks = mockEbooks.slice(0, 2);
  } else {
    ebooks = mockEbooks;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container sx={{ py: 4 }}>
        {Toggle}

        <Stack direction="row" spacing={2} mb={4}>
          <Button variant="outlined" onClick={() => setState("loading")}>Loading</Button>
          <Button variant="outlined" onClick={() => setState("none")}>0 Ebooks</Button>
          <Button variant="outlined" onClick={() => setState("few")}>Moins de 3 Ebooks</Button>
          <Button variant="outlined" onClick={() => setState("many")}>3 Ebooks ou plus</Button>
        </Stack>

        <PreviewEbooks ebooks={ebooks} isLoading={isLoading} />
      </Container>
    </ThemeProvider>
  );
}
