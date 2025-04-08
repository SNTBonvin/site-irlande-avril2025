// src/lib/sendNotification.js
export async function sendNotification({ title, cover, slug }) {
  const username = import.meta.env.PUBLIC_NTFY_USER;
  const password = import.meta.env.PUBLIC_NTFY_PASSWORD;

  const topic = "irlande2025";
  const url = `https://notifications.goodwine-walnutgrove.ynh.fr/${topic}`;
  const authHeader = "Basic " + Buffer.from(`${username}:${password}`).toString("base64");

  const articleUrl = `https://irlande2025.goodwine-walnutgrove.ynh.fr/articles/${slug}`;
  const message = `🍀🇮🇪 ${title} est en ligne !\n👉 ${articleUrl}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Title": "GoodWine Family en Irlande",
        "Tags": "shamrock,ie,elf",
        "Authorization": authHeader,
        "Click": articleUrl, // ← rend la notif cliquable
        ...(cover && { Attach: cover }),
        "Content-Type": "text/plain",
      },
      body: message,
    });

    const text = await res.text();
    console.log("🔔 Notification envoyée :", res.status, text);
  } catch (err) {
    console.error("❌ Erreur lors de l’envoi NTFY :", err);
  }
}
