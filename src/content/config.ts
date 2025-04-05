import { defineCollection, z } from "astro:content";

const articles = defineCollection({
  schema: z.object({
    title: z.string(),
    pubDate: z.string(),
    cover: z.string(),
  }),
});

export const collections = {
  articles,
};
