import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// If you later need browser polyfills (crypto, stream, buffer), add aliases.
// For now this only replaces `global` and `process.env` at build time.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    // replace `global` with `window` during build so libraries that reference `global` work in the browser
    global: "window",
    // provide a minimal process.env so libs that read process.env don't crash
    "process.env": {},
  },
  resolve: {
    // Uncomment and adjust aliases only if you hit "module not found" errors for node built-ins
    // alias: {
    //   util: "util/",
    //   stream: "stream-browserify",
    //   buffer: "buffer/",
    //   crypto: "crypto-browserify",
    // },
  },
});
