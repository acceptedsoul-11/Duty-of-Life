import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#00796B" },
    secondary: { main: "#F57C00" },
    success: { main: "#43A047" },
    info: { main: "#0288D1" },
    warning: { main: "#F9A825" },
    background: { default: "#F6FBFF", paper: "rgba(255, 255, 255, 0.82)" }
  },
  shape: { borderRadius: 18 },
  typography: {
    fontFamily: "Manrope, sans-serif",
    h3: { fontFamily: "DM Serif Display, serif", fontWeight: 400 },
    h4: { fontFamily: "DM Serif Display, serif", fontWeight: 400 }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(255,255,255,0.45)",
          boxShadow: "0 12px 36px rgba(2, 136, 209, 0.12)"
        }
      }
    }
  }
});
