// src/pages/admin/new-post.js
export const prerender = false;

import fs from "node:fs/promises";
import path from "node:path";
import slugify from "slugify";
import { sendNotification } from "../../scripts/sendNotification.js"; // ✅ Corrigé

export async function POST({ request, redirect }) {
  try {
    const form = await request.formData();
    const title = form.get("title")?.toString().trim();
    const pubDate = form.get("pubDate")?.toString().trim();
    const coverUrl = form.get("cover")?.toString().trim();
    const album = form.get("album")?.toString().trim();
    const body = form.get("body")?.toString().trim();
    const file = form.get("coverFile");

    if (!title || !pubDate || !body) {
      return new Response("Champs requis manquants", { status: 400 });
    }

    // 📂 Si image locale envoyée, on l'enregistre dans /public/uploads/
    let cover = coverUrl;
    if (file && typeof file.name === "string" && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const extension = path.extname(file.name);
      const imageFileName = `${Date.now()}-${slugify(title)}${extension}`;
      const imagePath = path.resolve("public/uploads", imageFileName);
      await fs.mkdir(path.dirname(imagePath), { recursive: true });
      await fs.writeFile(imagePath, buffer);
      cover = `/uploads/${imageFileName}`;
    }

    // 📄 Génération du fichier markdown
    const slug = `${pubDate}-${slugify(title, { lower: true, strict: true })}`;
    const frontmatter = [
      "---",
      `title: "${title}"`,
      `pubDate: "${pubDate}"`,
      ...(cover ? [`cover: "${cover}"`] : []),
      ...(album ? [`album: "${album}"`] : []),
      "---",
    ].join("\n");

    const markdown = `${frontmatter}\n\n${body}\n`;
    const filePath = path.resolve("src/content/articles", `${slug}.md`);
    await fs.writeFile(filePath, markdown, "utf-8");
    console.log("✅ Article créé :", filePath);

    // 🔔 Envoi de la notification
    await sendNotification({ title, cover, slug });

    return redirect("/admin");
  } catch (err) {
    console.error("❌ Erreur dans la création :", err);
    return new Response("Erreur lors de la création", { status: 500 });
  }
}
