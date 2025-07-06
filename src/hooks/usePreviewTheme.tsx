"use client";

import { useState, useMemo, JSX } from "react";
import { createTheme, Theme } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

export function usePreviewTheme(defaultTheme: "dark" | "light" = "light"): {
  theme: Theme;
  Toggle: JSX.Element;
} {
  const [darkMode, setDarkMode] = useState(defaultTheme === "dark");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
        },
      }),
    [darkMode]
  );

  const Toggle: JSX.Element = (
    <FormControlLabel
      control={
        <Switch
          checked={darkMode}
          onChange={(e) => setDarkMode(e.target.checked)}
        />
      }
      label="Dark mode"
      sx={{ mb: 2 }}
    />
  );

  return { theme, Toggle };
}
