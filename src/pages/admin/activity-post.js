export const prerender = false;

import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

// Connexion Supabase
const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

// Schéma de validation
const ActivitySchema = z.object({
  title: z.string(),
  place: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  activity: z.string(),
  pubDate: z.string().optional(),
});

export async function POST({ request, redirect }) {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);
  const parsed = ActivitySchema.safeParse(values);

  if (!parsed.success) {
    console.error("❌ Données invalides :", parsed.error);
    return new Response("Données invalides", { status: 400 });
  }

  const { title, place, latitude, longitude, activity, pubDate } = parsed.data;

  const slug = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const date = pubDate || new Date().toISOString().split("T")[0];

  // Vérifie que les coordonnées GPS sont valides
  if (latitude && longitude && !isNaN(parseFloat(latitude)) && !isNaN(parseFloat(longitude))) {
    const { error } = await supabase.from("points").insert([
      {
        slug,
        title,
        place: place || "",
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
        activity: activity,
        pubDate: date,
      },
    ]);

    if (error) {
      console.error("❌ Erreur insertion Supabase :", error.message);
    } else {
      console.log("✅ Activité enregistrée dans Supabase !");
    }
  } else {
    console.warn("⚠️ Coordonnées GPS invalides ou absentes. Aucun point inséré.");
  }

  return redirect("/admin");
}
