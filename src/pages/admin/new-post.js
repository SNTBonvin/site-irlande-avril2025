export const prerender = false;

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

const PostSchema = z.object({
  title: z.string(),
  pubDate: z.string().optional(),
  body: z.string(),
  cover: z.string().optional(),
  album: z.string().optional()
});

export async function POST({ request, redirect }) {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  const parsed = PostSchema.safeParse(values);
  if (!parsed.success) {
    console.error("❌ Données invalides :", parsed.error);
    return new Response("Invalid form data", { status: 400 });
  }

  const { title, pubDate, body, cover, album } = parsed.data;

  const slug = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const date = pubDate || new Date().toISOString().split("T")[0];

  let finalCover = cover || "";
  const coverFile = formData.get("coverFile");
  if (coverFile && typeof coverFile.name === "string" && coverFile.size > 0) {
    const extension = coverFile.name.split(".").pop();
    const fileName = `${slug}.${extension}`;
    const filePath = path.resolve("public/images", fileName);
    const buffer = Buffer.from(await coverFile.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
    finalCover = `/images/${fileName}`;
  }

  const metadata = {
    title,
    pubDate: date,
    cover: finalCover,
    album
  };

  const cleanedMetadata = Object.fromEntries(
    Object.entries(metadata).filter(([_, v]) => v !== undefined)
  );

  const content = matter.stringify(body, cleanedMetadata);
  const filename = `${date}-${slug}.md`;
  const filepath = path.resolve("src/content/articles", filename);
  fs.writeFileSync(filepath, content);
  console.log(`✅ Fichier Markdown enregistré : ${filename}`);

  // 🔔 Notification NTFY
  const notificationUrl = `${import.meta.env.NTFY_SERVER}/${import.meta.env.NTFY_TOPIC}`;
  const iconUrl = finalCover.startsWith("http") ? finalCover : `https://tonsite.fr${finalCover}`;

  try {
    const response = await fetch(notificationUrl, {
      method: "POST",
      headers: {
        "Title": "Nouvel article sur GoodWine Family",
        "Tags": "shamrock,ireland",
        "Click": `https://tonsite.fr/${slug}`,
        "Authorization": "Basic " + btoa("notifs:" + import.meta.env.NTFY_SEND_PASSWORD),
        ...(finalCover && { "Icon": iconUrl }),
        "Content-Type": "text/plain",
      },
      body: `📰 ${title}`,
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ Échec notification NTFY :", response.status, errText);
    } else {
      console.log("✅ Notification NTFY envoyée !");
    }
  } catch (e) {
    console.error("❌ Exception NTFY :", e);
  }

  return redirect("/admin");
}
