import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import netlify from "@astrojs/netlify/static";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  output: "static",
  adapter: netlify(),
  integrations: [tailwind(), mdx(), sitemap(), react()],
  vite: {
    define: {
      "import.meta.env.GITHUB_TOKEN": JSON.stringify(process.env.GITHUB_TOKEN)
    }
  }
});
