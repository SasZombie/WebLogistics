// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import { getScrapedBooks } from "./server/api/scrapeBooks";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  modules: ["@pinia/nuxt"],
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
});