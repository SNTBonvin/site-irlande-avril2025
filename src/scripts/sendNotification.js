// src/lib/sendNotification.js
export async function sendNotification({ title, cover, slug }) {
    const username = import.meta.env.PUBLIC_NTFY_USER;
    const password = import.meta.env.PUBLIC_NTFY_PASSWORD;
  
    const topic = "irlande2025";
    const url = `https://notifications.goodwine-walnutgrove.ynh.fr/${topic}`;
    const authHeader = "Basic " + Buffer.from(`${username}:${password}`).toString("base64");
  
    const message = `🍀🇮🇪 ${title} est en ligne !\n👉 https://irlande2025.goodwine-walnutgrove.ynh.fr/articles/${slug}`;
  
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Title": title,
          "Tags": "shamrock,ie,elf",
          "Authorization": authHeader,
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
  