// src/pages/admin/delete/[slug].js
export const prerender = false;

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Obtenir le chemin absolu du dossier /src
const srcDir = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.resolve(srcDir, "../../../content/articles");

export async function POST({ params, redirect }) {
  const slug = params.slug;
  const filePath = path.join(contentDir, `${slug}.md`);

  try {
    console.log("🛠️ Tentative de suppression de :", filePath);
    await fs.unlink(filePath);
    console.log(`✅ Fichier supprimé : ${filePath}`);
    return redirect("/admin");
  } catch (err) {
    console.error(`❌ Erreur lors de la suppression : ${err.message}`);
    return new Response("Erreur lors de la suppression", { status: 500 });
  }
}

// Gère un accès direct en GET pour éviter une 404
export function GET() {
  return new Response(null, {
    status: 302,
    headers: { Location: "/admin" },
  });
}
