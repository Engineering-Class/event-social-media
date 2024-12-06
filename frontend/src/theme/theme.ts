// src/theme/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark', // Change to 'light' for light mode
    primary: {
      main: '#ff6f61', // Vibrant primary color
    },
    secondary: {
      main: '#4a90e2', // Complementary secondary color
    },
    background: {
      default: '#1e1e2f', // Dark background color
      paper: '#23233d', // Card and paper background
    },
    text: {
      primary: '#ffffff',
      secondary: '#a0a0b3',
    },
  },
  typography: {
    fontFamily: `'Poppins', sans-serif`, // Modern font
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Rounded buttons
          textTransform: 'none', // No uppercase text
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Remove default shadows
        },
      },
    },
  },
});

export default theme;
