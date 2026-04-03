/**
 * Adds Eleventy front matter to copied MD docs if not already present.
 * Maps each file to the correct i18n data key and layout.
 */

const fs = require("fs");
const path = require("path");

// Resolve paths relative to this script's location (website/scripts/)
const websiteDir = path.join(__dirname, "..");

const docRoots = [
  { dir: path.join(websiteDir, "src/de/docs"), lang: "de", prefix: "/de/docs" },
  { dir: path.join(websiteDir, "src/en/docs"), lang: "en", prefix: "/en/docs" },
];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...walk(full));
    else if (e.name.endsWith(".md")) files.push(full);
  }
  return files;
}

for (const root of docRoots) {
  if (!fs.existsSync(root.dir)) continue;
  const files = walk(root.dir);

  for (const file of files) {
    let content = fs.readFileSync(file, "utf8");

    // Skip if front matter already present
    if (content.startsWith("---")) continue;

    // Derive slug from filename (strip _de/_en suffix for URL)
    const rel = path.relative(root.dir, file);
    const slug = rel.replace(/\.(md)$/, "").replace(/_de|_en/, "");
    const permalink = `${root.prefix}/${slug}/`;

    // Derive title from first H1
    const h1 = content.match(/^#\s+(.+)$/m);
    const title = h1 ? h1[1].replace(/[^\w\s\(\)×\/\-–—]/gu, "").trim() : slug;

    const fm = `---
layout: layouts/doc.njk
i18n: ${root.lang}
permalink: ${permalink}
title: "${title.replace(/"/g, "'")}"
---\n\n`;

    fs.writeFileSync(file, fm + content);
    console.log(`  Front matter added: ${file}`);
  }
}

console.log("Done.");
