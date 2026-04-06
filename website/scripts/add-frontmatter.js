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

    const rel = path.relative(root.dir, file).replace(/\\/g, "/");
    const basename = path.basename(file, ".md").toLowerCase();

    let permalink;
    if (basename === "readme") {
      // README.md → directory index
      // e.g. hardware/README.md → /de/docs/hardware/
      const dir = path.dirname(rel);
      permalink = dir === "." ? `${root.prefix}/` : `${root.prefix}/${dir}/`;
    } else {
      // Regular file — keep filename as-is (including _de/_en suffix)
      // so URLs match the links in docs.njk
      const slug = rel.replace(/\.md$/, "");
      permalink = `${root.prefix}/${slug}/`;
    }

    // Fix relative back-links: markdown files use ./README.md or ../README.md
    // which don't resolve to Eleventy URLs in the browser.
    if (basename === "readme") {
      // From a section index (e.g. /de/docs/hardware/), ../README.md or
      // ../../de/README.md should link to the docs root /de/docs/
      content = content.replace(/\(\.\.\/README\.md\)/g, "(../)");
      content = content.replace(/\(\.\.\/\.\.\/(?:de|en)\/README\.md\)/g, "(../)");
    } else {
      // From a sub-page (e.g. /de/docs/hardware/display_st7920_de/),
      // ./README.md should link to the section index (../  = one level up)
      content = content.replace(/\(\.\/README\.md\)/g, "(../)");
    }

    // Derive title from first H1
    const h1 = content.match(/^#\s+(.+)$/m);
    const title = h1 ? h1[1].replace(/[^\w\s\(\)×\/\-–—]/gu, "").trim() : basename;

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
