#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const siteRoot = path.resolve(__dirname, "..");

const parseArgs = () => {
  const args = process.argv.slice(2);
  const rootIndex = args.indexOf("--root");

  return {
    root: rootIndex >= 0 ? path.resolve(siteRoot, args[rootIndex + 1]) : siteRoot
  };
};

const isInside = (parent, child) => {
  const relative = path.relative(parent, child);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
};

const listFiles = (root) =>
  fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(root, entry.name);

    if (entry.isDirectory()) {
      if ([".git", ".vercel", "dist", "node_modules"].includes(entry.name)) {
        return [];
      }

      return listFiles(filePath);
    }

    return [filePath];
  });

const fileProtocolPattern = new RegExp(["file:", "", "", ""].join("/"), "i");

const splitUrlParts = (value) => {
  const hashIndex = value.indexOf("#");
  const withoutHash = hashIndex >= 0 ? value.slice(0, hashIndex) : value;
  const queryIndex = withoutHash.indexOf("?");
  return queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash;
};

const targetFileForUrl = (root, fromFile, value) => {
  if (!value || /^(?:[a-z][a-z0-9+.-]*:|#|mailto:|tel:|javascript:)/i.test(value)) {
    return "";
  }

  const pathname = splitUrlParts(value);
  const resolved = pathname.startsWith("/") ? path.join(root, pathname) : path.resolve(path.dirname(fromFile), pathname);

  if (!isInside(root, resolved)) {
    return "";
  }

  const candidates = pathname.endsWith("/")
    ? [path.join(resolved, "index.html")]
    : [resolved, `${resolved}.html`, path.join(resolved, "index.html")];

  return candidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile()) || candidates[0];
};

const checkHtmlReferences = (root, filePath, issues) => {
  const html = fs.readFileSync(filePath, "utf8");
  const attributePattern = /\b(?:href|src)="([^"]+)"/gi;
  let match;

  while ((match = attributePattern.exec(html))) {
    const value = match[1];
    const target = targetFileForUrl(root, filePath, value);

    if (target && !fs.existsSync(target)) {
      issues.push(`${path.relative(root, filePath)} references missing file ${value}`);
    }
  }
};

const main = () => {
  const options = parseArgs();
  const root = options.root;
  const issues = [];
  const requiredFiles = [
    "index.html",
    "styles.css",
    "script.js",
    "site-config.js",
    "product-data.js",
    "assets/favicon/favicon-32x32.png",
    "heavy-truck-parts/index.html",
    "car-parts/index.html",
    "brands/index.html",
    "about/index.html",
    "contact/index.html",
    "search/index.html"
  ];

  requiredFiles.forEach((file) => {
    if (!fs.existsSync(path.join(root, file))) {
      issues.push(`missing required file ${file}`);
    }
  });

  listFiles(root).forEach((filePath) => {
    const textExtensions = new Set([".css", ".html", ".js", ".json", ".md", ".txt", ".xml"]);

    if (textExtensions.has(path.extname(filePath).toLowerCase())) {
      const text = fs.readFileSync(filePath, "utf8");

      if (/C:[/\\]Users/i.test(text) || fileProtocolPattern.test(text)) {
        issues.push(`${path.relative(root, filePath)} contains a local filesystem URL/path`);
      }

      if (/\/truck-parts\//i.test(text) && !path.relative(root, filePath).replace(/\\/g, "/").endsWith("validate-hosting.js")) {
        issues.push(`${path.relative(root, filePath)} still references the old heavy truck route`);
      }
    }

    if (path.extname(filePath).toLowerCase() === ".html") {
      checkHtmlReferences(root, filePath, issues);
    }
  });

  if (issues.length) {
    console.error("Hosting validation failed:");
    issues.forEach((issue) => console.error(`- ${issue}`));
    process.exitCode = 1;
    return;
  }

  console.log(`Hosting validation passed for ${root}`);
};

main();
