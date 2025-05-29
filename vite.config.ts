import { defineConfig } from "vite";
import { resolve } from "path";
import { fileURLToPath } from "url";

// Fix för __dirname i ES-moduler
const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, "..");
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        login: resolve(__dirname, "index.html"),
        register: resolve(__dirname, "register.html"),
        home: resolve(__dirname, "home.html"),
        game: resolve(__dirname, "game.html"),
      },
    },
  },
});
