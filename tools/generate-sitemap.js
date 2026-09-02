#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const siteRoot = path.resolve(__dirname, "..");
const sitemapPath = path.join(siteRoot, "sitemap.xml");

const parseArgs = () => {
  const args = process.argv.slice(2);
  const options = {
    check: args.includes("--check"),
    write: args.includes("--write"),
    lastmod: new Date().toISOString().slice(0, 10),
    siteUrl: ""
  };
  const lastmodIndex = args.indexOf("--lastmod");
  const siteUrlIndex = args.indexOf("--site-url");

  if (lastmodIndex >= 0 && args[lastmodIndex + 1]) {
    options.lastmod = args[lastmodIndex + 1];
  }

  if (siteUrlIndex >= 0 && args[siteUrlIndex + 1]) {
    options.siteUrl = args[siteUrlIndex + 1];
  }

  return options;
};

const createBrowserLikeContext = () => {
  const window = {
    location: new URL("https://axrivo.vercel.app/"),
    addEventListener() {}
  };
  const document = {
    currentScript: {
      src: "https://axrivo.vercel.app/site-config.js"
    },
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
    addEventListener() {}
  };

  window.document = document;

  const context = {
    console,
    document,
    URL,
    window
  };
  context.globalThis = context;

  return vm.createContext(context);
};

const loadScript = (context, filename) => {
  const filePath = path.join(siteRoot, filename);
  vm.runInContext(fs.readFileSync(filePath, "utf8"), context, { filename });
};

const loadSiteData = () => {
  const context = createBrowserLikeContext();
  loadScript(context, "site-config.js");
  loadScript(context, "product-data.js");

  return {
    catalog: context.window.AXRIVO_CATALOG,
    siteConfig: context.window.AXRIVO_SITE_CONFIG
  };
};

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const withProtocol = (value) => (/^https?:\/\//i.test(value) ? value : `https://${value}`);

const resolveSiteUrl = (siteConfig, siteUrlOption) => {
  const candidates = [
    siteUrlOption,
    process.env.SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
    siteConfig.siteUrl,
    "https://axrivo.vercel.app"
  ];
  const value = candidates.find((candidate) => String(candidate || "").trim());

  return withProtocol(String(value).trim()).replace(/\/+$/, "");
};

const createUrlSet = (siteConfig, catalog, lastmod, siteUrlOption) => {
  const cleanSiteUrl = resolveSiteUrl(siteConfig, siteUrlOption);
  const entries = [];
  const seen = new Set();
  const categoryOrder = {
    CAR: ["engine-parts", "brake-system", "suspension", "steering", "electrical", "cooling", "transmission", "body-parts"],
    "HEAVY TRUCK": [
      "engine-parts",
      "brake-system",
      "clutch",
      "transmission",
      "differential",
      "suspension",
      "steering",
      "electrical",
      "cooling",
      "body-parts"
    ]
  };
  const brandOrder = [
    "toyota",
    "honda",
    "nissan",
    "mazda",
    "mitsubishi",
    "perodua",
    "proton",
    "ford",
    "hino",
    "isuzu",
    "fuso",
    "howo",
    "volvo",
    "scania",
    "ud",
    "man"
  ];

  const absoluteUrl = (routePath) => new URL(routePath, `${cleanSiteUrl}/`).href;
  const addEntry = (routePath, priority) => {
    const loc = absoluteUrl(routePath);

    if (seen.has(loc)) {
      return;
    }

    seen.add(loc);
    entries.push({ loc, lastmod, priority });
  };
  const orderedCategories = (vehicleType) => {
    const categories = catalog.getCategoriesForVehicleType(vehicleType);
    const order = categoryOrder[vehicleType] ?? [];

    return [...categories].sort((a, b) => {
      const aIndex = order.indexOf(a.slug);
      const bIndex = order.indexOf(b.slug);

      if (aIndex === -1 && bIndex === -1) {
        return a.name.localeCompare(b.name);
      }

      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  };
  const orderedBrands = () =>
    [...catalog.getVehicleBrands()].sort((a, b) => {
      const aSlug = catalog.slugify(a);
      const bSlug = catalog.slugify(b);
      const aIndex = brandOrder.indexOf(aSlug);
      const bIndex = brandOrder.indexOf(bSlug);

      if (aIndex === -1 && bIndex === -1) {
        return a.localeCompare(b);
      }

      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });

  [
    ["/", "1.0"],
    ["/car-parts/", "0.9"],
    ["/heavy-truck-parts/", "0.9"],
    ["/brands/", "0.8"],
    ["/about/", "0.7"],
    ["/contact/", "0.7"],
    ["/request-part/", "0.7"],
    ["/privacy/", "0.3"],
    ["/terms/", "0.3"],
    ["/cookies/", "0.3"]
  ].forEach(([routePath, priority]) => addEntry(routePath, priority));

  orderedCategories("CAR").forEach((category) => {
    addEntry(`/car-parts/${category.slug}/`, "0.8");
  });

  orderedCategories("HEAVY TRUCK").forEach((category) => {
    addEntry(`/heavy-truck-parts/${category.slug}/`, "0.8");
  });

  orderedBrands().forEach((brand) => {
    const slug = catalog.slugify(brand);
    const hasProducts = catalog.getBrandProducts(slug).length > 0;
    addEntry(`/brands/${slug}/`, hasProducts ? "0.7" : "0.6");
  });

  catalog
    .getProducts()
    .filter((product) => product.status !== "draft")
    .filter((product) => !String(catalog.buildProductSeo?.(product)?.robots ?? "").toLowerCase().includes("noindex"))
    .forEach((product) => {
      addEntry(catalog.productUrl(product), "0.75");
    });

  return entries;
};

const renderSitemap = (entries) => {
  const urls = entries
    .map(
      (entry) =>
        `  <url><loc>${escapeXml(entry.loc)}</loc><lastmod>${entry.lastmod}</lastmod><priority>${entry.priority}</priority></url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
};

const normalizeForCompare = (value) => String(value).replace(/\r\n/g, "\n").trim();

const main = () => {
  const options = parseArgs();
  const { catalog, siteConfig } = loadSiteData();
  const sitemap = renderSitemap(createUrlSet(siteConfig, catalog, options.lastmod, options.siteUrl));

  if (options.write) {
    fs.writeFileSync(sitemapPath, sitemap, "utf8");
    console.log(`Sitemap written: ${sitemapPath}`);
  }

  if (options.check) {
    const current = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, "utf8") : "";

    if (normalizeForCompare(current) !== normalizeForCompare(sitemap)) {
      console.error("Sitemap check failed: sitemap.xml does not match generated output.");
      process.exitCode = 1;
      return;
    }

    console.log("Sitemap check passed.");
  }

  if (!options.write && !options.check) {
    process.stdout.write(sitemap);
  }
};

main();
