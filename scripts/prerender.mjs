/*
 * Build step: renders every route to static HTML in dist/ so crawlers and
 * link-preview bots get real content plus per-page meta tags, and writes
 * sitemap.xml. Runs after `vite build` and `vite build --ssr`.
 * The browser app still boots normally and takes over the page.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

/* Load React's production build: no dev-only server warnings, faster render. */
process.env.NODE_ENV = "production";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const serverEntry = pathToFileURL(path.join(root, "dist-server", "entry-server.js")).href;

const { render, pages, renderHead, SITE_URL } = await import(serverEntry);

const template = await fs.readFile(path.join(dist, "index.html"), "utf8");

const SEO_BLOCK = /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/;
const ROOT = '<div id="root"></div>';
if (!SEO_BLOCK.test(template) || !template.includes(ROOT)) {
  throw new Error("prerender: index.html is missing the seo markers or the empty #root div");
}

/* Preload the above-the-fold font files so text renders in the right face sooner. */
const assets = await fs.readdir(path.join(dist, "assets"));
const criticalFonts = [
  /^inter-latin-400-normal-[\w-]+\.woff2$/,
  /^inter-latin-600-normal-[\w-]+\.woff2$/,
  /^inter-latin-700-normal-[\w-]+\.woff2$/,
  /^jetbrains-mono-latin-400-normal-[\w-]+\.woff2$/,
];
const fontPreloads = criticalFonts
  .map((pattern) => assets.find((file) => pattern.test(file)))
  .filter(Boolean)
  .map((file) => `<link rel="preload" href="/assets/${file}" as="font" type="font/woff2" crossorigin />`);
if (fontPreloads.length !== criticalFonts.length) {
  throw new Error("prerender: could not find every critical font file in dist/assets");
}

for (const page of pages) {
  const appHtml = render(page.path);
  const head = [renderHead(page), ...fontPreloads].join("\n    ");
  const html = template
    .replace(SEO_BLOCK, `<!-- seo:start -->\n    ${head}\n    <!-- seo:end -->`)
    .replace(ROOT, `<div id="root">${appHtml}</div>`);

  const outFile =
    page.path === "/" ? path.join(dist, "index.html") : path.join(dist, page.path, "index.html");
  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(outFile, html);
  console.log(`prerendered ${page.path} → ${path.relative(root, outFile)}`);
}

/* Vercel serves 404.html (with a 404 status) for unknown case-study URLs;
   the app boots from it and routes the visitor home. */
await fs.copyFile(path.join(dist, "index.html"), path.join(dist, "404.html"));
console.log("wrote dist/404.html");

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) =>
      `  <url><loc>${SITE_URL}${page.path}</loc><lastmod>${today}</lastmod><priority>${page.path === "/" ? "1.0" : "0.8"}</priority></url>`,
  )
  .join("\n")}
</urlset>
`;
await fs.writeFile(path.join(dist, "sitemap.xml"), sitemap);
console.log("wrote dist/sitemap.xml");
