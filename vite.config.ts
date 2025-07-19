//import { defineConfig } from "vite";
//import react from "@vitejs/plugin-react-swc";
//import path from "path";

// https://vitejs.dev/config/
//export default defineConfig({
//  server: {
//    host: "::",
//    port: 8080,
//  },
//  base: "/krok-mvp/",
//  plugins: [
//    react(),
//  ],
//  resolve: {
//    alias: {
//      "@": path.resolve(__dirname, "./src"),
//    },
//  },
//});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  base: "/krok-mvp/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});