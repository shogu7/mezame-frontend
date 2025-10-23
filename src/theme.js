import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    background: { default: '#f4f7fb', paper: '#ffffff' },
    text: { primary: '#0f1724', secondary: '#6b7280' }
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: [
      'Inter', 'ui-sans-serif', 'system-ui', '-apple-system',
      '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial'
    ].join(','),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: '#f4f7fb' }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: 8,
          '&.Mui-focused': { boxShadow: 'none' },
        },
        notchedOutline: {
          borderColor: 'rgba(15,23,36,0.12)'
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#6b7280',
          '&.Mui-focused': { color: '#0f1724' },
          '&.MuiInputLabel-shrink': {
            background: '#ffffff',
            padding: '0 6px',
            transformOrigin: 'left top'
          }
        }
      }
    },
    MuiIconButton: {
      defaultProps: { disableRipple: true, disableFocusRipple: true },
      styleOverrides: {
        root: {
          padding: 6,
          minWidth: 34,
          height: 34,
          outline: 'none',
          '&.Mui-focusVisible': { outline: 'none', boxShadow: 'none' }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          background: 'linear-gradient(90deg,#1976d2,#145ca8)',
          color: '#fff',
          boxShadow: '0 6px 18px rgba(25,118,210,0.12)',
          textTransform: 'none'
        },
        text: { textTransform: 'none' }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          padding: 16,
          borderRadius: 12,
          boxShadow: '0 6px 18px rgba(15,23,36,0.08)'
        }
      }
    }
  }
});

export default theme;
