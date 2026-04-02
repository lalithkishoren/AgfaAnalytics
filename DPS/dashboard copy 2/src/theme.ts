import { createTheme } from '@mui/material/styles';

export const CHART_COLORS = [
  '#1565C0',
  '#00897B',
  '#F57C00',
  '#D32F2F',
  '#6A1B9A',
  '#00838F',
  '#558B2F',
  '#EF6C00',
];

export const CONFIDENCE_COLORS = {
  verified: '#2E7D32',
  derived: '#1565C0',
  estimated: '#E65100',
  proxy: '#D32F2F',
};

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1565C0',
      dark: '#0D47A1',
      light: '#42A5F5',
    },
    secondary: {
      main: '#00897B',
    },
    error: {
      main: '#D32F2F',
    },
    warning: {
      main: '#F57C00',
    },
    success: {
      main: '#2E7D32',
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
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 600,
    },
    subtitle2: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#F5F7FA',
            fontWeight: 600,
            color: '#1A2027',
          },
        },
      },
    },
  },
});
