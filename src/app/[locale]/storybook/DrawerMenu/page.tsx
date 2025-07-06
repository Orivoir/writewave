"use client";

import React, { useState } from "react";
import DrawerMenu from "@/components/DrawerMenu";
import { usePreviewTheme } from "@/hooks/usePreviewTheme";
import { ThemeProvider, CssBaseline, Stack } from "@mui/material";

export default function DrawerMenuStory() {
  const [open, setOpen] = useState(false);

  const { theme, Toggle } = usePreviewTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Stack direction="row" spacing={4}>
        {Toggle}
        <button onClick={() => setOpen(true)}>Open Drawer</button>
      </Stack>
      <DrawerMenu open={open} onClose={() => setOpen(false)} onOpen={() => setOpen(true)} />
    </ThemeProvider>
  );
}
