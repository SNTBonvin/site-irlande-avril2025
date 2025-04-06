import fs from "fs";
import path from "path";

const articlesDir = "./src/content/articles";
const outputDir = "./public/data/comments";

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(articlesDir);

for (const file of files) {
  const slug = file.replace(/\.md$/, "");
  const outFile = path.join(outputDir, `${slug}.json`);

  if (!fs.existsSync(outFile)) {
    fs.writeFileSync(outFile, "[]");
    console.log(`✅ Fichier JSON créé : ${slug}.json`);
  } else {
    console.log(`ℹ️ Déjà existant : ${slug}.json`);
  }
}
