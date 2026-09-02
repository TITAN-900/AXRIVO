#!/usr/bin/env node
"use strict";

const fs = require("fs");
const http = require("http");
const path = require("path");

const siteRoot = path.resolve(__dirname, "..");

const parseArgs = () => {
  const args = process.argv.slice(2);
  const portIndex = args.indexOf("--port");
  const rootIndex = args.indexOf("--root");

  return {
    port: Number(process.env.PORT || (portIndex >= 0 ? args[portIndex + 1] : 4173)),
    root: rootIndex >= 0 ? path.resolve(siteRoot, args[rootIndex + 1]) : siteRoot
  };
};

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8"
};

const isInside = (parent, child) => {
  const relative = path.relative(parent, child);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
};

const routeToFile = (root, pathname) => {
  const routePath = decodeURIComponent(pathname).replace(/\\/g, "/");
  const direct = path.join(root, routePath);
  const candidates = [];

  if (routePath.endsWith("/")) {
    candidates.push(path.join(root, routePath, "index.html"));
  } else {
    candidates.push(direct);
    candidates.push(`${direct}.html`);
    candidates.push(path.join(direct, "index.html"));
  }

  return candidates.find((candidate) => isInside(root, candidate) && fs.existsSync(candidate) && fs.statSync(candidate).isFile());
};

const serve = (root, port) => {
  const server = http.createServer((request, response) => {
    const parsed = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);

    const filePath = routeToFile(root, parsed.pathname || "/") || path.join(root, "404.html");
    const extension = path.extname(filePath).toLowerCase();

    response.writeHead(filePath.endsWith("404.html") && parsed.pathname !== "/404.html" ? 404 : 200, {
      "Content-Type": contentTypes[extension] || "application/octet-stream"
    });
    response.end(fs.readFileSync(filePath));
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      serve(root, port + 1);
      return;
    }

    throw error;
  });

  server.listen(port, "127.0.0.1", () => {
    console.log(`AXRIVO dev server running at http://127.0.0.1:${port}/`);
  });
};

const options = parseArgs();
serve(options.root, options.port);
