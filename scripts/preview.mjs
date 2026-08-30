import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { Liquid } from "liquidjs";
import matter from "gray-matter";
import { marked } from "marked";

const require = createRequire(import.meta.url);
const yaml = require("js-yaml");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteDir = path.join(root, "_site");
const port = Number(process.env.PORT || 4173);

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    if (name.startsWith(".") && name !== ".well-known") continue;
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (["node_modules", "_site", "_layouts", "_includes", "_data", "scripts", "vendor", "yapay zeka bitki analizi"].includes(name)) continue;
      walk(full, acc);
    } else {
      acc.push(full);
    }
  }
  return acc;
}

function fixIncludes(src) {
  return src.replace(/{%\s*include\s+([a-zA-Z0-9._\-\/]+)\s*%}/g, '{% include "$1" %}');
}

function htmlEscape(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function looksLikeHtml(src) {
  const trimmed = src.trim();
  return trimmed.startsWith("<") || trimmed.startsWith("<!DOCTYPE");
}

function permalinkToFile(url) {
  if (url.endsWith(".html") || url.endsWith(".txt") || url.endsWith(".xml") || url.endsWith(".json")) {
    return url.replace(/^\//, "");
  }
  if (url === "/") return "index.html";
  return `${url.replace(/^\/|\/$/g, "")}/index.html`;
}

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const name of fs.readdirSync(from)) {
    const src = path.join(from, name);
    const dest = path.join(to, name);
    if (fs.statSync(src).isDirectory()) copyDir(src, dest);
    else fs.copyFileSync(src, dest);
  }
}

const config = yaml.load(read(path.join(root, "_config.yml")));
const data = {};
for (const file of fs.readdirSync(path.join(root, "_data"))) {
  const key = path.basename(file, path.extname(file));
  data[key] = yaml.load(read(path.join(root, "_data", file)));
}

const includeRoot = path.join(root, "_includes");

const engine = new Liquid({
  root: includeRoot,
  extname: "",
  jsTruthy: true,
  fs: {
    sep: path.sep,
    existsSync: (filepath) => fs.existsSync(filepath),
    exists: async (filepath) => fs.existsSync(filepath),
    readFileSync: (filepath) => fixIncludes(read(filepath)),
    readFile: async (filepath) => fixIncludes(read(filepath)),
    resolve: (dir, file, ext) => {
      const name = String(file || "").replace(/^["']|["']$/g, "");
      const withExt = name.includes(".") ? name : `${name}${ext || ""}`;
      return path.resolve(dir || includeRoot, withExt);
    },
    contains: (rootDir, file) => {
      const rel = path.relative(rootDir, file);
      return !!rel && !rel.startsWith("..") && !path.isAbsolute(rel);
    },
  },
});

engine.registerFilter("relative_url", (value) => value || "/");
engine.registerFilter("absolute_url", (value) => {
  const url = config.url.replace(/\/$/, "");
  if (!value) return `${url}/`;
  if (String(value).startsWith("http")) return value;
  return url + (String(value).startsWith("/") ? value : `/${value}`);
});
engine.registerFilter("xml_escape", htmlEscape);
engine.registerFilter("escape", htmlEscape);
engine.registerFilter("jsonify", (value) => JSON.stringify(value ?? ""));
engine.registerFilter("uri_escape", (value) => encodeURIComponent(String(value ?? "")));

function parseDoc(file, extra = {}) {
  const parsed = matter(read(file));
  const slug = path.basename(file, path.extname(file));
  const page = {
    ...parsed.data,
    slug,
    path: path.relative(root, file).replaceAll("\\", "/"),
    ...extra,
  };
  if (!page.url) {
    page.url = page.permalink || `/${slug}/`;
  }
  return { page, body: parsed.content };
}

async function renderBody(body, ctx) {
  const liquided = await engine.parseAndRender(fixIncludes(body), ctx);
  if (!liquided.trim() || looksLikeHtml(liquided)) return liquided;
  return marked.parse(liquided, { async: false });
}

async function applyLayouts(html, layoutName, ctx) {
  let current = layoutName || "default";
  while (current) {
    const layoutPath = path.join(root, "_layouts", `${current}.html`);
    const parsed = matter(read(layoutPath));
    ctx.content = html;
    html = await engine.parseAndRender(fixIncludes(parsed.content), ctx);
    current = parsed.data.layout || null;
  }
  return html;
}

function collectCollection(dir, permalinkTpl) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".md"))
    .sort()
    .map((name) => {
      const file = path.join(dir, name);
      const slug = name.replace(/\.md$/, "");
      const { page, body } = parseDoc(file, {
        url: permalinkTpl.replace(":name", slug),
      });
      page._body = body;
      page._file = file;
      return page;
    });
}

const buketler = collectCollection(path.join(root, "_buketler"), "/buketler/:name/");
const bolgeler = collectCollection(path.join(root, "_bolgeler"), "/teslimat/:name/");

const skipPageNames = new Set(["README.md", "GORSELLER.md", "LICENSE"]);
const pageFiles = walk(root).filter((file) => {
  const rel = path.relative(root, file).replaceAll("\\", "/");
  if (rel.startsWith("_")) return false;
  if (skipPageNames.has(path.basename(file))) return false;
  return file.endsWith(".md") || file.endsWith(".html");
});

const pages = pageFiles.map((file) => {
  const { page, body } = parseDoc(file);
  page._body = body;
  page._file = file;
  return page;
});

const site = {
  ...config,
  data,
  buketler,
  bolgeler,
  pages,
  time: new Date().toISOString(),
};

fs.rmSync(siteDir, { recursive: true, force: true });
fs.mkdirSync(siteDir, { recursive: true });

async function writePage(page) {
  const ctx = { site, page, layout: null };
  let html = await renderBody(page._body, ctx);
  html = await applyLayouts(html, page.layout || "default", { ...ctx, page: { ...page, content: html } });
  const out = path.join(siteDir, permalinkToFile(page.url));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
}

for (const page of [...pages, ...buketler, ...bolgeler]) {
  await writePage(page);
}

copyDir(path.join(root, "assets"), path.join(siteDir, "assets"));
for (const extra of [
  "robots.txt",
  "llms.txt",
  "humans.txt",
  "ai.txt",
  "security.txt",
  "CNAME",
  "site.webmanifest",
]) {
  const src = path.join(root, extra);
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(siteDir, extra));
}
const wellKnown = path.join(root, ".well-known");
if (fs.existsSync(wellKnown)) copyDir(wellKnown, path.join(siteDir, ".well-known"));

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

const server = http.createServer((req, res) => {
  const url = decodeURIComponent((req.url || "/").split("?")[0]);
  let file = path.join(siteDir, url);
  if (url.endsWith("/")) file = path.join(file, "index.html");
  if (!path.extname(file) && fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    file = path.join(file, "index.html");
  }
  if (!fs.existsSync(file) && fs.existsSync(`${file}.html`)) file = `${file}.html`;
  if (!fs.existsSync(file)) {
    const fallback = path.join(siteDir, "404.html");
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end(fs.existsSync(fallback) ? read(fallback) : "404");
    return;
  }
  const type = mime[path.extname(file)] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": type });
  res.end(fs.readFileSync(file));
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Onizleme: http://127.0.0.1:${port}/`);
});
