import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

export async function POST({ request }) {
  const body = await request.json();
  const id = body.id;

  if (!id) {
    console.error("❌ ID manquant !");
    return new Response("ID manquant", { status: 400 });
  }

  const { error } = await supabase.from("points").delete().eq("id", id);

  if (error) {
    console.error("❌ Erreur Supabase DELETE :", error.message);
    return new Response("Erreur Supabase", { status: 500 });
  }

  console.log("✅ Activité supprimée :", id);
  return new Response("Activité supprimée", { status: 200 });
}
