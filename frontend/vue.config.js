// vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  base: "/Frontend-CST3144/",
  define: {
    "process.env": {
      VITE_API_URL: JSON.stringify(
        process.env.VITE_API_URL || "http://localhost:5001/api"
      ),
    },
  },
});
