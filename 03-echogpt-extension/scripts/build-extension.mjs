#!/usr/bin/env node
/**
 * Packages the Next.js static export as a loadable Manifest V3 extension.
 *
 * The one genuinely non-obvious step is the asset-path rewrite. Next emits
 * `/_next/...` by default, which resolves against the origin root. An
 * extension page's origin is `chrome-extension://<id>/`, so a root-absolute
 * path *happens* to work for the page's own files — but webpack's runtime
 * `publicPath` is baked into the bundle, dynamic chunks and the CSS loader all
 * derive from it, and any subdirectory page breaks immediately. So the export
 * is run with ECHOGPT_EXT_BUILD=1, which sets `assetPrefix: "./"`, and this
 * script then verifies that no root-absolute `_next` reference survived.
 *
 * Steps:
 *   1. next build   (output: "export", assetPrefix "./")  → out/
 *   2. copy out/ → dist/, keeping _next and the static files
 *   3. flatten the exported routes into popup.html / sidepanel.html /
 *      options.html at the dist root
 *   4. rewrite each page's asset paths to be relative
 *   5. copy extension/ (manifest, worker, content script, icons)
 *   6. verify, then print load-unpacked instructions
 */
import { execFileSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const OUT = join(ROOT, "out");
const DIST = join(ROOT, "dist");
const EXT = join(ROOT, "extension");

/** Exported route → the filename the manifest expects. */
const PAGES = [
  { route: "popup", file: "popup.html" },
  { route: "sidepanel", file: "sidepanel.html" },
  { route: "options", file: "options.html" },
];

const REQUIRED = [
  "manifest.json",
  "background.js",
  "content.js",
  "content.css",
  "popup.html",
  "sidepanel.html",
  "options.html",
  "icons/icon-16.png",
  "icons/icon-32.png",
  "icons/icon-48.png",
  "icons/icon-128.png",
];

function step(n, message) {
  console.log(`\n\x1b[35m[${n}/6]\x1b[0m ${message}`);
}

function fail(message) {
  console.error(`\n\x1b[31m✗ ${message}\x1b[0m`);
  process.exit(1);
}

// ---------------------------------------------------------------- 1. icons

step(1, "Generating icons");
execFileSync(process.execPath, [join(HERE, "gen-icons.mjs")], {
  stdio: "inherit",
});

// ----------------------------------------------------------- 2. next build

step(2, "Running the Next.js static export");
rmSync(OUT, { recursive: true, force: true });
execFileSync(
  process.execPath,
  [join(ROOT, "node_modules", "next", "dist", "bin", "next"), "build"],
  {
    cwd: ROOT,
    stdio: "inherit",
    env: { ...process.env, ECHOGPT_EXT_BUILD: "1" },
  },
);

if (!existsSync(OUT)) fail("next build produced no out/ directory.");

// ------------------------------------------------------------- 3. copy out

step(3, "Copying the export into dist/");
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
cpSync(OUT, DIST, { recursive: true });

// -------------------------------------------------------- 4. flatten pages

step(4, "Flattening routes into extension pages");
for (const { route, file } of PAGES) {
  // trailingSlash:false exports `route.html`; be tolerant of `route/index.html`.
  const flat = join(DIST, `${route}.html`);
  const nested = join(DIST, route, "index.html");
  const source = existsSync(flat) ? flat : existsSync(nested) ? nested : null;

  if (!source) fail(`The export is missing a page for /${route}.`);

  const target = join(DIST, file);
  if (resolve(source) !== resolve(target)) {
    writeFileSync(target, readFileSync(source));
    rmSync(source, { force: true });
  }
  // The route directory is dead weight once the page is at the root.
  rmSync(join(DIST, route), { recursive: true, force: true });
  console.log(`  /${route}  →  ${file}`);
}

// The showcase and Next's 404 are web-only; they just bloat the bundle.
for (const extra of ["index.html", "404.html", "index.txt", "404.txt"]) {
  rmSync(join(DIST, extra), { force: true });
}
for (const stray of readdirSync(DIST)) {
  if (stray.endsWith(".txt")) rmSync(join(DIST, stray), { force: true });
}

// ------------------------------------------------------- 5. rewrite + copy

step(5, "Rewriting asset paths and copying the extension layer");

let rewrites = 0;
for (const { file } of PAGES) {
  const path = join(DIST, file);
  let html = readFileSync(path, "utf8");
  const before = html;

  // Root-absolute → relative.
  //
  // Two shapes have to be covered. Plain attributes (`href="/_next/..."`) and
  // the inline flight payload, which embeds the same paths as *escaped* JSON
  // strings (`\"/_next/...\"`). The capture group keeps whichever quoting
  // prefix was there so both survive the rewrite untouched.
  html = html.replace(
    /(["'(]|\\["'])\/(_next\/|favicon\.ico)/g,
    (_match, prefix, path) => `${prefix}./${path}`,
  );

  if (html !== before) rewrites++;
  writeFileSync(path, html);
}
console.log(
  rewrites === 0
    ? "  assetPrefix already emitted relative paths — nothing to rewrite"
    : `  rewrote absolute paths in ${rewrites} page(s)`,
);

cpSync(EXT, DIST, { recursive: true });
console.log("  copied manifest.json, background.js, content.js, content.css, icons/");

// ----------------------------------------------------------- 6. verify

step(6, "Verifying the bundle");

for (const file of REQUIRED) {
  const path = join(DIST, file);
  if (!existsSync(path) || statSync(path).size === 0) {
    fail(`dist/${file} is missing or empty.`);
  }
}

// Every icon must be a real PNG, not a placeholder.
for (const size of [16, 32, 48, 128]) {
  const buf = readFileSync(join(DIST, "icons", `icon-${size}.png`));
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (!buf.subarray(0, 8).equals(signature)) {
    fail(`icons/icon-${size}.png is not a valid PNG.`);
  }
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  if (width !== size || height !== size) {
    fail(`icons/icon-${size}.png is ${width}×${height}, expected ${size}×${size}.`);
  }
}

// No page may still reference a root-absolute asset — that is the failure mode
// this whole script exists to prevent, so it is a hard error, not a warning.
const ABSOLUTE = /(?:["'(]|\\["'])(\/_next\/|\/favicon\.ico)/;
for (const { file } of PAGES) {
  const html = readFileSync(join(DIST, file), "utf8");
  const hit = html.match(ABSOLUTE);
  if (hit) {
    fail(
      `dist/${file} still references the absolute path "${hit[1]}". ` +
        "Chrome extension pages cannot load these.",
    );
  }
  if (!html.includes("./_next/")) {
    fail(`dist/${file} references no ./_next/ assets — the export looks broken.`);
  }
}

if (!existsSync(join(DIST, "_next"))) fail("dist/_next is missing.");

// The manifest must be parseable and point at files that exist.
const manifest = JSON.parse(readFileSync(join(DIST, "manifest.json"), "utf8"));
for (const referenced of [
  manifest.action?.default_popup,
  manifest.side_panel?.default_path,
  manifest.options_page,
  manifest.background?.service_worker,
  ...(manifest.content_scripts?.[0]?.js ?? []),
  ...(manifest.content_scripts?.[0]?.css ?? []),
  ...Object.values(manifest.icons ?? {}),
]) {
  if (referenced && !existsSync(join(DIST, referenced))) {
    fail(`manifest.json points at "${referenced}", which is not in dist/.`);
  }
}

function dirSize(dir) {
  return readdirSync(dir, { withFileTypes: true }).reduce((total, entry) => {
    const path = join(dir, entry.name);
    return total + (entry.isDirectory() ? dirSize(path) : statSync(path).size);
  }, 0);
}

const kb = Math.round(dirSize(DIST) / 1024);

console.log(`
\x1b[32m✓ Extension built\x1b[0m  →  ${relative(process.cwd(), DIST) || "dist"}/  (${kb} KB)

  manifest.json      Manifest V3 · side panel + popup + options + content script
  popup.html         400×600 launcher
  sidepanel.html     full chat surface
  options.html       settings
  background.js      service worker · side panel + context menus
  content.js/.css    selection tooltip (shadow DOM)
  icons/             16 · 32 · 48 · 128 px PNG
  _next/             shared JS and CSS, referenced relatively

\x1b[1mLoad it in Chrome\x1b[0m
  1. Open  chrome://extensions
  2. Turn on  Developer mode  (top right)
  3. Click  Load unpacked  and choose the dist/ folder
  4. Pin EchoGPT to the toolbar, then press  Ctrl+Shift+E  (⌘⇧E on macOS)

  Ctrl+Shift+S opens the side panel directly.
  Select text on any page to raise the tooltip, or right-click a selection.
`);
