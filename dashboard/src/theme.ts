import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1565C0',
      light: '#42A5F5',
      dark: '#0D47A1',
    },
    secondary: {
      main: '#00897B',
      light: '#4DB6AC',
      dark: '#00695C',
    },
    error: {
      main: '#D32F2F',
      light: '#EF5350',
    },
    warning: {
      main: '#F57C00',
      light: '#FFB74D',
    },
    success: {
      main: '#2E7D32',
      light: '#66BB6A',
    },
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A2027',
      secondary: '#5A6872',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h5: { fontWeight: 600, letterSpacing: '-0.01em' },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500, color: '#5A6872' },
    subtitle2: { fontWeight: 500, fontSize: '0.8rem', color: '#5A6872' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
          borderRadius: 12,
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          },
          transition: 'box-shadow 0.2s ease-in-out',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500, fontSize: '0.75rem' },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.9rem',
          minHeight: 48,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 500 },
      },
    },
  },
});

export default theme;

// Chart color palette
export const CHART_COLORS = {
  primary: '#1565C0',
  secondary: '#00897B',
  tertiary: '#7B1FA2',
  quaternary: '#E65100',
  success: '#2E7D32',
  warning: '#F57C00',
  error: '#D32F2F',
  neutral: '#78909C',
};

export const PRODUCT_COLORS: Record<string, string> = {
  UTP500: '#1565C0',
  UTP220: '#00897B',
  'UTP500+': '#7B1FA2',
  UTP500A: '#E65100',
};

export const FOR_TYPE_COLORS: Record<string, string> = {
  Actuals: '#2E7D32',
  Committed: '#1565C0',
  Uncommitted: '#F57C00',
  Unidentified: '#BDBDBD',
  'ACT part': '#2E7D32',
};

export const STATUS_COLORS = {
  green: { bg: '#E8F5E9', text: '#2E7D32', border: '#A5D6A7' },
  amber: { bg: '#FFF3E0', text: '#E65100', border: '#FFCC80' },
  red: { bg: '#FFEBEE', text: '#C62828', border: '#EF9A9A' },
  blue: { bg: '#E3F2FD', text: '#1565C0', border: '#90CAF9' },
};
