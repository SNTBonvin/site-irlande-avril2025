// src/pages/admin/edit/[slug].js
export const prerender = false;

import fs from "node:fs/promises";
import path from "node:path";
import { getEntryBySlug } from "astro:content";

export async function GET({ params }) {
  const article = await getEntryBySlug("articles", params.slug);
  if (!article) {
    return new Response("Not found", { status: 404 });
  }

  const { title, pubDate, cover, album } = article.data;
  const body = (await article.render()).Content.trim();

  return new Response(
    `<html lang="fr">
      <head>
        <title>Modifier l’article</title>
        <meta charset="UTF-8" />
      </head>
      <body style="font-family: sans-serif; padding: 2rem; max-width: 700px; margin: auto;">
        <h1>📝 Modifier l’article</h1>
        <form method="POST">
          <p><label>Titre :<br /><input name="title" value="${title}" required style="width: 100%;"/></label></p>
          <p><label>Date :<br /><input name="pubDate" type="date" value="${pubDate.toISOString().split("T")[0]}" required /></label></p>
          <p><label>Image de couverture :<br /><input name="cover" value="${cover ?? ""}" style="width: 100%;" /></label></p>
          <p><label>Lien album :<br /><input name="album" value="${album ?? ""}" style="width: 100%;" /></label></p>
          <p><label>Contenu (Markdown) :<br /><textarea name="body" rows="10" style="width: 100%;">${body}</textarea></label></p>
          <p><button type="submit">✅ Enregistrer</button></p>
        </form>
      </body>
    </html>`,
    {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    }
  );
}

export async function POST({ request, params, redirect }) {
  const form = await request.formData();
  const title = form.get("title");
  const pubDate = form.get("pubDate");
  const cover = form.get("cover");
  const album = form.get("album");
  const body = form.get("body").trim();

  const frontmatter = [
    "---",
    `title: "${title}"`,
    `pubDate: ${pubDate}`,
    cover ? `cover: ${cover}` : "",
    album ? `album: ${album}` : "",
    "---",
  ]
    .filter(Boolean)
    .join("\n");

  const content = `${frontmatter}\n\n${body}\n`;

  const filePath = path.resolve("src/content/articles", `${params.slug}.md`);
  await fs.writeFile(filePath, content, "utf-8");
  console.log("✅ Article modifié :", filePath);
  return redirect("/admin");
}
