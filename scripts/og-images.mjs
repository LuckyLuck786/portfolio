/*
 * Regenerates the 1200×630 link-preview cards in public/:
 *   og.png (home) and og-<slug>.png (one per case study).
 *
 * macOS only (renders SVG with QuickLook, crops with sips), so the PNGs are
 * committed rather than built on Vercel. Needs a prior `npm run build`
 * (reads project data from dist-server/). Run: node scripts/og-images.mjs
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { projectCards } = await import(
  pathToFileURL(path.join(root, "dist-server", "entry-server.js")).href
);

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const SANS = "Helvetica Neue, Helvetica, Arial, sans-serif";
const MONO = "Menlo, monospace";

/** Greedy word wrap by character count. */
function wrap(text, max) {
  const lines = [];
  let line = "";
  for (const word of text.split(" ")) {
    if (line && (line + " " + word).length > max) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/*
 * QuickLook renders SVGs into a square thumbnail, so the card is drawn in
 * the vertical centre band (y 285–915) of a 1200×1200 canvas and then
 * cropped to 1200×630.
 */
function card({ kicker, title, lines, lineSize, tags, footerLeft }) {
  const lineTop = lineSize > 38 ? 653 : 640;
  const lineStep = lineSize > 38 ? 56 : 48;
  return `<svg width="1200" height="1200" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="50%" cy="24%" r="60%">
      <stop offset="0%" stop-color="#f5a623" stop-opacity="0.20"/>
      <stop offset="55%" stop-color="#f5a623" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#f5a623" stop-opacity="0"/>
    </radialGradient>
    <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse">
      <circle cx="1.2" cy="1.2" r="1.2" fill="#26262e"/>
    </pattern>
  </defs>
  <rect width="1200" height="1200" fill="#101013"/>
  <rect width="1200" height="1200" fill="url(#dots)"/>
  <rect width="1200" height="1200" fill="url(#glow)"/>
  <rect x="0" y="285" width="1200" height="6" fill="#f5a623"/>
  <text x="96" y="455" font-family="${MONO}" font-size="22" letter-spacing="6" fill="#f5a623">${esc(kicker)}</text>
  <text x="90" y="570" font-family="${SANS}" font-size="104" font-weight="bold" letter-spacing="-3" fill="#f5f5f2">${esc(title)}</text>
  ${lines
    .map(
      (line, i) =>
        `<text x="94" y="${lineTop + i * lineStep}" font-family="${SANS}" font-size="${lineSize}" font-weight="500" letter-spacing="-0.5" fill="#a6a6af">${line}</text>`,
    )
    .join("\n  ")}
  <rect x="96" y="771" width="64" height="2" fill="#2c2c33"/>
  <text x="96" y="825" font-family="${MONO}" font-size="19" letter-spacing="2" fill="#8a8a93">${esc(tags)}</text>
  <text x="96" y="871" font-family="${MONO}" font-size="19" letter-spacing="2" fill="#c9c9d1">${esc(footerLeft)}</text>
  <text x="1104" y="871" text-anchor="end" font-family="${MONO}" font-size="20" fill="#f5a623">shaik.luqman_</text>
</svg>`;
}

const cards = [
  {
    file: "og.png",
    svg: card({
      kicker: "PORTFOLIO — BENGALURU, INDIA",
      title: "Shaik Luqman",
      lines: [
        `<tspan fill="#f5f5f2">${esc("I Build Things.")}</tspan>`,
        `${esc("Still learning how to build them right")}<tspan fill="#f5a623">.</tspan>`,
      ],
      lineSize: 42,
      tags: "REACT 18 · DJANGO · SPRING BOOT · RAG · LLM ORCHESTRATION · JWT/RBAC",
      footerLeft: "CSE @ DSATM · BS DATA SCIENCE @ IIT MADRAS",
    }),
  },
  ...projectCards.map((project) => ({
    file: `og-${project.slug}.png`,
    svg: card({
      kicker: `CASE STUDY ${project.index} — ${project.kicker.toUpperCase()}`,
      title: project.title,
      lines: wrap(project.summary, 44).slice(0, 3).map(esc),
      lineSize: 36,
      tags: project.tags.join(" · ").toUpperCase(),
      footerLeft: "BY SHAIK LUQMAN",
    }),
  })),
];

const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "og-"));
for (const { file, svg } of cards) {
  const svgPath = path.join(tmp, file.replace(/\.png$/, ".svg"));
  await fs.writeFile(svgPath, svg);
  execFileSync("qlmanage", ["-t", "-s", "1200", "-o", tmp, svgPath], { stdio: "ignore" });
  const out = path.join(root, "public", file);
  execFileSync("sips", ["-c", "630", "1200", `${svgPath}.png`, "--out", out], { stdio: "ignore" });
  console.log(`wrote public/${file}`);
}
await fs.rm(tmp, { recursive: true, force: true });
