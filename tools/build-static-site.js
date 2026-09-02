#!/usr/bin/env node
"use strict";

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const siteRoot = path.resolve(__dirname, "..");
const distRoot = path.join(siteRoot, "dist");
const deployItems = [
  "index.html",
  "404.html",
  "favicon.ico",
  "robots.txt",
  "styles.css",
  "site-config.js",
  "product-data.js",
  "script.js",
  "enquiry.js",
  "parts-pages.js",
  "category-page.js",
  "brand-page.js",
  "search-page.js",
  "info-pages.js",
  "product-detail.js",
  "assets",
  "images",
  "about",
  "brands",
  "car-parts",
  "heavy-truck-parts",
  "contact",
  "cookies",
  "privacy",
  "request-part",
  "search",
  "terms"
];
const textExtensions = new Set([".css", ".html", ".js", ".json", ".svg", ".txt", ".xml"]);

const loadDotEnv = () => {
  const envPath = path.join(siteRoot, ".env");

  if (!fs.existsSync(envPath)) {
    return;
  }

  fs.readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .forEach((line) => {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("#")) {
        return;
      }

      const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);

      if (!match || process.env[match[1]]) {
        return;
      }

      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    });
};

const withProtocol = (value) => (/^https?:\/\//i.test(value) ? value : `https://${value}`);

const configuredSiteUrl = () => {
  const configPath = path.join(siteRoot, "site-config.js");
  const text = fs.existsSync(configPath) ? fs.readFileSync(configPath, "utf8") : "";
  const match = text.match(/\bsiteUrl:\s*"([^"]+)"/);

  return match?.[1] || "";
};

const resolveSiteUrl = () => {
  const value =
    process.env.SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    configuredSiteUrl() ||
    "https://axrivo.vercel.app";

  return withProtocol(String(value).trim()).replace(/\/+$/, "");
};

const isInside = (parent, child) => {
  const relative = path.relative(parent, child);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
};

const copyRecursive = (source, target) => {
  const stat = fs.statSync(source);

  if (stat.isDirectory()) {
    fs.mkdirSync(target, { recursive: true });
    fs.readdirSync(source).forEach((entry) => copyRecursive(path.join(source, entry), path.join(target, entry)));
    return;
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
};

const listFiles = (root) =>
  fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(root, entry.name);
    return entry.isDirectory() ? listFiles(filePath) : [filePath];
  });

const cleanRouteFromTarget = (htmlFile, href) => {
  if (!href || /^(?:[a-z][a-z0-9+.-]*:|#|mailto:|tel:|javascript:)/i.test(href)) {
    return href;
  }

  const hashIndex = href.indexOf("#");
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : "";
  const withoutHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const queryIndex = withoutHash.indexOf("?");
  const query = queryIndex >= 0 ? withoutHash.slice(queryIndex) : "";
  const pathname = queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash;
  const resolved = pathname.startsWith("/")
    ? path.join(distRoot, pathname)
    : path.resolve(path.dirname(htmlFile), pathname);

  if (!isInside(distRoot, resolved)) {
    return href;
  }

  const relative = path.relative(distRoot, resolved).replace(/\\/g, "/");

  if (relative === "index.html") {
    return `/${query}${hash}`;
  }

  if (relative.endsWith("/index.html")) {
    return `/${relative.slice(0, -"index.html".length)}${query}${hash}`;
  }

  if (relative.endsWith(".html")) {
    return `/${relative.slice(0, -".html".length)}${query}${hash}`;
  }

  return href;
};

const transformTextFile = (filePath, siteUrl) => {
  const extension = path.extname(filePath).toLowerCase();

  if (!textExtensions.has(extension)) {
    return;
  }

  let text = fs.readFileSync(filePath, "utf8");
  text = text.replaceAll("http://localhost:4173", siteUrl).replaceAll("http://localhost:4173", siteUrl);

  if (extension === ".html") {
    text = text.replace(/(<a\b[^>]*?\shref=")([^"]+)(")/gi, (match, before, href, after) => {
      return `${before}${cleanRouteFromTarget(filePath, href)}${after}`;
    });
  }

  fs.writeFileSync(filePath, text, "utf8");
};

const safeCleanDist = () => {
  if (!isInside(siteRoot, distRoot) || path.basename(distRoot) !== "dist") {
    throw new Error(`Refusing to clean unsafe dist path: ${distRoot}`);
  }

  fs.rmSync(distRoot, { recursive: true, force: true });
  fs.mkdirSync(distRoot, { recursive: true });
};

const main = () => {
  loadDotEnv();
  const siteUrl = resolveSiteUrl();

  safeCleanDist();

  deployItems.forEach((item) => {
    const source = path.join(siteRoot, item);

    if (fs.existsSync(source)) {
      copyRecursive(source, path.join(distRoot, item));
    }
  });

  listFiles(distRoot).forEach((filePath) => transformTextFile(filePath, siteUrl));

  const sitemap = execFileSync(process.execPath, [path.join(siteRoot, "tools", "generate-sitemap.js"), "--site-url", siteUrl], {
    cwd: siteRoot,
    encoding: "utf8"
  });
  fs.writeFileSync(path.join(distRoot, "sitemap.xml"), sitemap, "utf8");

  execFileSync(process.execPath, [path.join(siteRoot, "tools", "validate-hosting.js"), "--root", "dist"], {
    cwd: siteRoot,
    stdio: "inherit"
  });

  console.log(`AXRIVO static build complete: ${distRoot}`);
  console.log(`SITE_URL: ${siteUrl}`);
};

main();
