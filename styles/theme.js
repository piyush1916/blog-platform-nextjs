"use client";

import { alpha, createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: true,
  modularCssLayers: true,
  palette: {
    mode: "dark",
    primary: {
      main: "#6c3fff",
    },
    secondary: {
      main: "#38bdf8",
    },
    background: {
      default: "#0a0a12",
      paper: "rgba(255,255,255,0.04)",
    },
    text: {
      primary: "#e0e0ff",
      secondary: "#6e6e9a",
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: "var(--font-plus-jakarta), sans-serif",
    h1: {
      fontFamily: "var(--font-space-grotesk), sans-serif",
      fontWeight: 800,
    },
    h2: {
      fontFamily: "var(--font-space-grotesk), sans-serif",
      fontWeight: 700,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#0a0a12",
          color: "#e0e0ff",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 20,
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: alpha("#ffffff", 0.06),
        },
      },
    },
  },
});

export default theme;
