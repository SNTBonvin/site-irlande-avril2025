import sendComment from "/src/scripts/sendComment.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("comment-form");
  const list = document.getElementById("comment-list");
  const nameInput = document.getElementById("comment-name");
  const textInput = document.getElementById("comment-text");

  const emojis = ["☘️", "🍺", "🌦️", "🐑", "🏰", "🥔", "🎻", "🌈", "🧳", "📷"];

  function timeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `il y a ${days} jour${days > 1 ? "s" : ""}`;
    if (hours > 0) return `il y a ${hours}h`;
    if (minutes > 0) return `il y a ${minutes} min`;
    return `à l’instant`;
  }

  async function loadComments() {
    const slug = location.pathname.split("/").filter(Boolean).pop();
    const url = `https://raw.githubusercontent.com/SNTBonvin/site-irlande-avril2025/main/public/data/comments/${slug}.json`;
    try {
      const res = await fetch(url);
      const saved = await res.json();
      list.innerHTML = "";
      saved.reverse().forEach(({ name, text, date }) => {
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        const li = document.createElement("li");
        li.className = "bg-gray-100 dark:bg-gray-700 p-4 rounded shadow";
        li.innerHTML = `
          <strong class="text-[#169B62]">${emoji} ${name}</strong>
          <span class="text-sm text-gray-500 float-right">${timeAgo(date)}</span>
          <p class="mt-2">${text}</p>
        `;
        list.appendChild(li);
      });
    } catch (e) {
      console.warn("Impossible de charger les commentaires :", e);
    }
  }

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const text = textInput.value.trim();
    const slug = location.pathname.split("/").filter(Boolean).pop();

    if (!name || !text) return;

    try {
      await sendComment({ slug, name, text });
      nameInput.value = "";
      textInput.value = "";
      await loadComments();
    } catch (err) {
      console.error(err);
      alert("Erreur : commentaire non envoyé !");
    }
  });

  loadComments();
});
