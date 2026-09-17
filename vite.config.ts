import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: isSsrBuild
        ? {}
        : {
            /* Libraries change far less often than site code, so separate
               chunks stay cached across deploys. */
            manualChunks: {
              react: ["react", "react-dom", "react-router-dom"],
              motion: ["motion/react", "lenis"],
            },
          },
    },
  },
}));
