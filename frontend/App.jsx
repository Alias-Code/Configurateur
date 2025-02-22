import React from "react";
import AppContent from "./AppContent";
import GlobalProvider from "./context/GlobalProvider";
import { ThemeProvider, createTheme } from "@mui/material";

// --- CUSTOM THEMES ---

export const lightTheme = {
  textColor: "black",
  backgroundColor: "white",
  borderColor: "#b7b7b7",
  labelColor: "black",
  displayAddressBoxColor: "#f8f9fa",
  displayAddressTextColor: "#333",
  displayAddressBorder: "none",
  displayAddressPaddingAndRadius: "10px",
};

export const darkTheme = {
  textColor: "white",
  backgroundColor: "black",
  borderColor: "#444444",
  labelColor: "#bdbdbd",
  displayAddressBoxColor: "transparent",
  displayAddressTextColor: "#bdbdbd",
  displayAddressBorder: "1px solid #444444",
  displayAddressPaddingAndRadius: "0px",
};

// --- CUSTOM BREAKPOINTS ---

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
      xxl: 2000,
    },
  },
});

// --- APP ---

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalProvider>
        <AppContent />
      </GlobalProvider>
    </ThemeProvider>
  );
}
