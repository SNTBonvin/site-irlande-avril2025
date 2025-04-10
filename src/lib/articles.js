// src/lib/articles.js
import { getCollection } from "astro:content";

export async function getAllArticles() {
  const articles = await getCollection("articles");
  return articles.sort((a, b) => new Date(b.data.pubDate) - new Date(a.data.pubDate));
}
