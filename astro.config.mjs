import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import dotenv from "dotenv";
import 'dotenv/config';

dotenv.config();

export default defineConfig({
  output: "static", // ✅ indique à Astro de générer un site 100% statique
  integrations: [tailwind(), mdx(), sitemap(), react()],
  vite: {
    define: {
      'import.meta.env.GITHUB_TOKEN': JSON.stringify(process.env.GITHUB_TOKEN)
    }
  }
});
