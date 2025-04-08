// src/scripts/sendNotification.js
export async function sendNotification({ title, cover, slug }) {
  const username = import.meta.env.PUBLIC_NTFY_USER;
  const password = import.meta.env.PUBLIC_NTFY_PASSWORD;

  const topic = "irlande2025";
  const url = `https://notifications.goodwine-walnutgrove.ynh.fr/${topic}`;
  const authHeader = "Basic " + Buffer.from(`${username}:${password}`).toString("base64");

  const fullUrl = `https://irlande2025.goodwine-walnutgrove.ynh.fr/articles/${slug}`;
  const message = `🍀🇮🇪 ${title} est en ligne !\n👉 ${fullUrl}`;

  const headers = {
    "Title": "GoodWine Family en Irlande",
    "Tags": "shamrock,ie,elf",
    "Authorization": authHeader,
    "Click": fullUrl,
    "Content-Type": "text/plain",
  };

  // ✅ Gestion intelligente du champ cover
  if (cover?.startsWith("http")) {
    headers.Attach = cover;
  } else if (cover) {
    headers.Attach = `https://irlande2025.goodwine-walnutgrove.ynh.fr${cover}`;
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: message,
    });

    if (!res.ok) {
      console.warn("❗ Envoi avec image échoué, tentative sans image");
      delete headers.Attach;

      const fallback = await fetch(url, {
        method: "POST",
        headers,
        body: message,
      });

      console.log("🔔 Notification sans image envoyée :", fallback.status, await fallback.text());
    } else {
      const text = await res.text();
      console.log("🔔 Notification envoyée :", res.status, text);
    }
  } catch (err) {
    console.error("❌ Erreur lors de l’envoi NTFY :", err);
  }
}
