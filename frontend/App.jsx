import React from "react";
import AppContent from "./AppContent";
import GlobalProvider from "./context/GlobalProvider";
import { ThemeProvider, createTheme } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

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
  labelColor: "#cecece",
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

const cache = createCache({ key: "css", prepend: true });

export default function App() {
  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <GoogleOAuthProvider clientId="172052439601-dkqnbasm5ouddo44abnjs0c3qepoqcc6.apps.googleusercontent.com">
          <GlobalProvider>
            <AppContent />
          </GlobalProvider>
        </GoogleOAuthProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
