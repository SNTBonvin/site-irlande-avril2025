window.sendComment = async function ({ slug, name, text }) {
  const SUPABASE_URL = "https://ajbufqljpigkgyxdaygd.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqYnVmcWxqcGlna2d5eGRheWdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyNjI1MzQsImV4cCI6MjA1ODgzODUzNH0.wnUTiakrSL7mjp3kBAL8-LREAL6USMlpz-TWoSGHXNw"; // mets ici ta clé complète

  const res = await fetch(`${SUPABASE_URL}/rest/v1/comments`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      slug,
      name,
      text,
      created_at: new Date().toISOString(),
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error("Erreur Supabase : " + error);
  }

  return true;
};



