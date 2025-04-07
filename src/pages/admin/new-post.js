// src/pages/admin/new-post.js
export const prerender = false;

import fs from "node:fs/promises";
import path from "node:path";
import slugify from "slugify";
import { sendNotification } from "../../scripts/sendNotification.js"; // ← Chemin à adapter si besoin

export async function POST({ request, redirect }) {
  try {
    const form = await request.formData();
    const title = form.get("title")?.toString().trim();
    const pubDate = form.get("pubDate")?.toString().trim();
    const cover = form.get("cover")?.toString().trim();
    const album = form.get("album")?.toString().trim();
    const body = form.get("body")?.toString().trim();

    if (!title || !pubDate || !body) {
      return new Response("Champs requis manquants", { status: 400 });
    }

    const slug = `${pubDate}-${slugify(title, { lower: true, strict: true })}`;
    const frontmatter = [
      "---",
      `title: "${title}"`,
      `pubDate: "${pubDate}"`,
      cover ? `cover: "${cover}"` : "",
      album ? `album: "${album}"` : "",
      "---",
    ]
      .filter(Boolean)
      .join("\n");

    const content = `${frontmatter}\n\n${body}\n`;
    const filePath = path.resolve("src/content/articles", `${slug}.md`);

    await fs.writeFile(filePath, content, "utf-8");
    console.log("✅ Article créé :", filePath);

    // 🔔 Notification NTFY
    await sendNotification({ title, cover, slug });

    return redirect("/admin");
  } catch (err) {
    console.error("❌ Erreur dans la création :", err);
    return new Response("Erreur lors de la création", { status: 500 });
  }
}
