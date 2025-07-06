"use client";
import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

type ThemeContextType = {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export function ThemeContextProvider({ children }: Props) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useThemeContext must be used within ThemeContextProvider');
  return context;
};
