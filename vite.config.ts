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
        main: "public/index.html",
        register: resolve(__dirname, "public/register.html"),
        home: "public/home.html",
        game: "public/game.html",
      },
    },
  },
});
