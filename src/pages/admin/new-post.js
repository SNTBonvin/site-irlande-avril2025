// src/pages/admin/new.js
export const prerender = false;

import fs from "node:fs/promises";
import path from "node:path";
import slugify from "slugify";

export async function POST({ request, redirect }) {
  console.log("📨 Requête POST reçue");

  try {
    const form = await request.formData();
    const title = form.get("title");
    const pubDate = form.get("pubDate");
    const cover = form.get("cover");
    const album = form.get("album");
    const body = form.get("body").trim();

    const slug = `${pubDate}-${slugify(title, { lower: true, strict: true })}`;
    const frontmatter = [
      "---",
      `title: "${title}"`,
      `pubDate: "${pubDate}"`,
      cover ? `cover: ${cover}` : "",
      album ? `album: ${album}` : "",
      "---",
    ]
      .filter(Boolean)
      .join("\n");

    const content = `${frontmatter}\n\n${body}\n`;
    const filePath = path.resolve("src/content/articles", `${slug}.md`);

    await fs.writeFile(filePath, content, "utf-8");
    console.log("✅ Article créé :", filePath);

    return redirect("/admin");
  } catch (err) {
    console.error("❌ Erreur lors de la création de l’article :", err);
    return new Response("Erreur lors de la création de l’article", { status: 500 });
  }
}
