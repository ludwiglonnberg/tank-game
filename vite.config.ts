import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: "public/index.html",
        register: "public/register.html",
        home: "public/home.html",
        game: "public/game.html",
      },
    },
  },
});
