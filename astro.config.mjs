import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import dotenv from "dotenv";
import 'dotenv/config';


// 🔐 Charge les variables d’environnement du fichier `.env`
dotenv.config();

export default defineConfig({
  integrations: [tailwind(), mdx(), sitemap()],
  vite: {
    define: {
      // 🔐 Injecte la variable dans le bundle côté client
      'import.meta.env.GITHUB_TOKEN': JSON.stringify(process.env.GITHUB_TOKEN)
    }
  }
});
