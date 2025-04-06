// public/scripts/sendComment.js

const SUPABASE_URL = "https://ajbufqljpigkgyxdaygd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqYnVmcWxqcGlna2d5eGRheWdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyNjI1MzQsImV4cCI6MjA1ODgzODUzNH0.wnUTiakrSL7mjp3kBAL8-LREAL6USMlpz-TWoSGHXNw";

const emojis = ["☘️", "🍺", "🌦️", "🐑", "🏰", "🥔", "🎻", "🌈", "🧳", "📷"];

window.sendComment = async ({ slug, name, text }) => {
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];

  const response = await fetch(`${SUPABASE_URL}/rest/v1/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      slug,
      name,
      text,
      date: new Date().toISOString(),
      emoji,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("Erreur Supabase : " + errorText);
  }

  return true;
};
