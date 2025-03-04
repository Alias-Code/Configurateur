import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    react({
      babel: { plugins: ["@emotion/babel-plugin"] },
      jsxImportSource: "@emotion/react",
    }),
  ],
  build: {
    minify: "terser",
    target: "esnext",
    sourcemap: false,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          // Tout l'écosystème React et UI ensemble pour éviter des problèmes d'initialisation
          framework: [
            "react",
            "react-dom",
            "react/jsx-runtime",
            "scheduler",
            "prop-types",
            "@emotion/react",
            "@emotion/styled",
            "@emotion/cache",
            "styled-components",
            "@mui/material",
            "react-router-dom",
            "zustand",
          ],

          // Tout Three.js doit rester ensemble à cause des interdépendances
          "three-bundle": ["three", "@react-three/fiber", "@react-three/drei"],

          // Outils de document
          "document-tools": ["pdf-lib", "html2canvas"],

          // Services externes (Google, AWS, etc.)
          "external-services": [
            "@googlemaps/js-api-loader",
            "@react-oauth/google",
            "google-auth-library",
            "@aws-sdk/client-s3",
            "@aws-sdk/credential-provider-env",
            "@aws-sdk/s3-request-presigner",
            "gsap",
          ],
        },
        chunkFileNames: "assets/[name].[hash].js",
        entryFileNames: "assets/[name].[hash].js",
        assetFileNames: "assets/[name].[hash].[ext]",
      },
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "@emotion/react",
      "@emotion/styled",
      "@emotion/cache",
      "styled-components",
      "@mui/material",
      "three",
      "@react-three/fiber",
      "@react-three/drei",
      "gsap",
      "pdf-lib",
      "html2canvas",
      "react-router-dom",
    ],
    esbuildOptions: {
      jsx: "automatic",
      jsxImportSource: "@emotion/react",
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "frontend"),
    },
  },
});
