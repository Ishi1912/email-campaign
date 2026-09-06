import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The backend (server.js) listens on http://localhost:3000 and does not set
// any CORS headers. Rather than modify the backend, we proxy /api requests
// through the Vite dev server so the browser sees everything as same-origin.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
