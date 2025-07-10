import { createTheme as muiCreateTheme } from '@mui/material/styles';

import '@fontsource/dm-serif-display'; // par défaut en 400 normal
import '@fontsource/work-sans/400.css';
import '@fontsource/work-sans/500.css';
import '@fontsource/work-sans/600.css';


export default function createTheme(mode: 'light' | 'dark') {
  const isLight = mode === 'light';

  return muiCreateTheme({
    palette: {
      mode,
      primary: {
        main: '#5D5FEF', // Indigo
      },
      secondary: {
        main: isLight ? '#F2789F' : '#FF99AC', // Rose doux
        contrastText: '#fff',
      },
      background: {
        default: isLight ? '#FCFCFA' : '#1C1C2D',
        paper: isLight ? '#FFFFFF' : '#23243A',
      },
      text: {
        primary: isLight ? '#1A1A1A' : '#F0F0F0',
        secondary: isLight ? '#4F4F4F' : '#B3B3B3',
      },
    },
    typography: {
      fontFamily: '"Work Sans", sans-serif',
    
      h1: {
        fontFamily: '"DM Serif Display", serif',
        fontSize: '2.75rem',
        fontWeight: 400,
        lineHeight: 1.3,
      },
      h2: {
        fontFamily: '"DM Serif Display", serif',
        fontSize: '2.125rem',
        fontWeight: 400,
        lineHeight: 1.35,
      },
      h3: {
        fontFamily: '"DM Serif Display", serif',
        fontSize: '1.75rem',
        fontWeight: 400,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.75,
        fontWeight: 400,
        fontFamily: '"Work Sans", sans-serif',
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
        fontFamily: '"Work Sans", sans-serif',
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
        fontFamily: '"Work Sans", sans-serif',
      },
    },    
    shape: {
      borderRadius: 12,
    },
    spacing: 8,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            paddingLeft: 20,
            paddingRight: 20,
          },
          containedSecondary: {
            backgroundColor: isLight ? '#F2789F' : '#FF99AC',
            '&:hover': {
              backgroundColor: isLight ? '#D95F84' : '#FF85A0',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: isLight
              ? '0 4px 12px rgba(0, 0, 0, 0.05)'
              : '0 4px 12px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
  });
}
