import { defineCollection, z } from "astro:content";

const articles = defineCollection({
  schema: z.object({
    title: z.string(),
    pubDate: z.string(),
    cover: z.string().optional(), // image de couverture
  }),
});

export const collections = {
  articles,
};
