#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const siteRoot = path.resolve(__dirname, "..");

const parseArgs = () => {
  const args = process.argv.slice(2);
  const candidateIndex = args.indexOf("--candidate");

  return {
    candidatePath: candidateIndex >= 0 ? args[candidateIndex + 1] : "",
    strict: args.includes("--strict")
  };
};

const createBrowserLikeContext = () => {
  const window = {
    location: new URL("http://localhost:4173/"),
    addEventListener() {}
  };
  const document = {
    currentScript: {
      src: "http://localhost:4173/site-config.js"
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
    productData: context.window.AXRIVO_PRODUCT_DATA,
    siteConfig: context.window.AXRIVO_SITE_CONFIG
  };
};

const readCandidate = (candidatePath) => {
  if (!candidatePath) {
    return null;
  }

  const resolvedPath = path.resolve(process.cwd(), candidatePath);
  return JSON.parse(fs.readFileSync(resolvedPath, "utf8"));
};

const compact = (items) => items.filter((item) => item !== undefined && item !== null && String(item).trim() !== "");

const unique = (items) => [...new Set(compact(items).map((item) => String(item).trim()))];

const normalizeToken = (value) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");

const normalizePath = (value) => String(value ?? "").split("?")[0].split("#")[0];

const assetPathFromSitePath = (value) => {
  const clean = normalizePath(value);

  if (!clean || /^(?:https?:|data:|mailto:|tel:|#)/i.test(clean)) {
    return "";
  }

  return path.join(siteRoot, clean.replace(/^\/+/, ""));
};

const isGenericImageName = (value) => {
  const filename = path.basename(normalizePath(value));
  return /^(?:img|image|photo|dsc|screenshot|untitled|whatsapp[-_ ]?image)[-_ ]?\d*/i.test(filename);
};

const issueCollector = () => {
  const issues = [];

  return {
    add(message) {
      issues.push(message);
    },
    all() {
      return issues;
    },
    pass(message) {
      return issues.length ? issues.join("; ") : message;
    }
  };
};

const checkDuplicateValues = (products, candidate, catalog) => {
  const checks = [
    ["id", [candidate.id]],
    ["slug", [candidate.slug]],
    ["route", [candidate.slug ? catalog.productUrl(candidate) : ""]],
    ["sku", [candidate.sku]],
    ["partNumber", [candidate.partNumber]],
    ["oemNumbers", candidate.oemNumbers ?? []]
  ];
  const collisions = [];

  checks.forEach(([label, values]) => {
    unique(values).forEach((value) => {
      const normalizedValue = normalizeToken(value);

      if (!normalizedValue) {
        return;
      }

      products.forEach((product) => {
        const existingValues =
          label === "route"
            ? [catalog.productUrl(product)]
            : label === "oemNumbers"
              ? product.oemNumbers ?? []
              : [product[label]];

        if (existingValues.some((existingValue) => normalizeToken(existingValue) === normalizedValue)) {
          collisions.push(`${label}: ${value} matches ${product.id}`);
        }
      });
    });
  });

  return unique(collisions);
};

const productSeoStatus = (product, catalog) => {
  const issues = issueCollector();
  const seo = catalog.buildProductSeo(product);

  if (!seo.title || !seo.title.includes(product.name)) {
    issues.add("missing product-specific SEO title");
  }

  if (!seo.description || seo.description.length < 80) {
    issues.add("meta description should be specific and readable");
  }

  if (!seo.canonicalPath || seo.canonicalPath !== catalog.productUrl(product)) {
    issues.add("canonical path should match the product route");
  }

  if (String(seo.robots).toLowerCase().includes("noindex") && product.status !== "draft") {
    issues.add("public product is marked noindex");
  }

  return issues.pass("title, description and canonical are generated.");
};

const imageSeoStatus = (product, catalog) => {
  const issues = issueCollector();
  const images = unique([product.mainImage, ...(product.images ?? [])]);

  if (!product.mainImage) {
    issues.add("missing mainImage");
  }

  images.forEach((image) => {
    const filePath = assetPathFromSitePath(image);

    if (!filePath || !fs.existsSync(filePath)) {
      issues.add(`missing image file ${image}`);
    }

    if (isGenericImageName(image)) {
      issues.add(`generic image filename ${image}`);
    }

    if (!catalog.productImageAlt(product, image)) {
      issues.add(`missing alt text for ${image}`);
    }
  });

  return issues.pass("main image, gallery paths and alt text are usable.");
};

const geoStatus = (product, catalog) => {
  const entityMap = catalog.productEntityMap(product);
  const missing = [
    ["product", entityMap.product],
    ["vehicleType", entityMap.vehicleType],
    ["category", entityMap.category],
    ["brand", entityMap.brand],
    ["vehicleBrands", entityMap.vehicleBrands],
    ["vehicleModels", entityMap.vehicleModels],
    ["engineModels", entityMap.engineModels]
  ]
    .filter(([, value]) => (Array.isArray(value) ? !value.length : !value))
    .map(([label]) => label);

  if (missing.length) {
    return `entity map exists; missing optional precision fields: ${missing.join(", ")}.`;
  }

  return "product, category, vehicle, engine and brand entities are mapped.";
};

const searchIndexStatus = (product, catalog) => {
  const searchText = catalog.productSearchText(product);
  const mustInclude = unique([
    product.name,
    product.partNumber,
    product.sku,
    ...(product.oemNumbers ?? []),
    ...(product.vehicleBrands ?? []),
    ...(product.vehicleModels ?? []),
    ...(product.engineModels ?? [])
  ]);

  if (!mustInclude.length) {
    return "no searchable identifiers provided.";
  }

  const missing = mustInclude.filter((value) => !searchText.includes(catalog.normalizeText(value)));

  return missing.length ? `search index missing: ${missing.join(", ")}.` : "core identifiers are searchable.";
};

const schemaStatus = (product) => {
  const issues = issueCollector();

  if (!product.name) issues.add("Product.name missing");
  if (!product.brand) issues.add("Product.brand missing");
  if (!product.category) issues.add("Product.category missing");
  if (!product.mainImage) issues.add("Product.image missing");
  if (!product.partNumber && !(product.oemNumbers ?? []).length && !product.sku) {
    issues.add("Product identifier missing");
  }

  return issues.pass("Product and BreadcrumbList schema can be rendered without commerce-only fake fields.");
};

const sitemapStatus = (products, catalog, siteConfig) => {
  const sitemapPath = path.join(siteRoot, "sitemap.xml");

  if (!fs.existsSync(sitemapPath)) {
    return "sitemap.xml is missing.";
  }

  const sitemap = fs.readFileSync(sitemapPath, "utf8");
  const cleanSiteUrl = String(siteConfig.siteUrl || "http://localhost:4173").replace(/\/+$/, "");
  const missing = products
    .filter((product) => product.status !== "draft")
    .filter((product) => !String(catalog.buildProductSeo(product).robots).toLowerCase().includes("noindex"))
    .map((product) => new URL(catalog.productUrl(product), `${cleanSiteUrl}/`).href)
    .filter((url) => !sitemap.includes(url));

  return missing.length ? `missing product URLs: ${missing.join(", ")}.` : "all current public product URLs are listed.";
};

const missingInformation = (product) => {
  const requiredForStrongImport = [
    ["name", product.name],
    ["slug", product.slug],
    ["vehicleType", product.vehicleType],
    ["category", product.category],
    ["brand", product.brand],
    ["partNumber/OEM/SKU", product.partNumber || product.sku || (product.oemNumbers ?? []).length],
    ["mainImage", product.mainImage],
    ["description", product.description || product.shortDescription],
    ["compatibility", product.compatibility?.length],
    ["imageAlt", product.imageAlt || product.imageSeo?.altText]
  ];

  return requiredForStrongImport.filter(([, value]) => !value).map(([label]) => label);
};

const report = (label, value) => `${label}: ${value}`;

const main = () => {
  const options = parseArgs();
  const { catalog, productData, siteConfig } = loadSiteData();
  const candidate = readCandidate(options.candidatePath);
  const products = candidate ? [candidate] : catalog.getProducts();
  const duplicateSource = candidate ? catalog.getProducts() : [];
  const duplicateFindings = candidate ? checkDuplicateValues(duplicateSource, candidate, catalog) : [];
  const missing = unique(products.flatMap((product) => missingInformation(product).map((field) => `${product.id || product.slug}: ${field}`)));
  const reportLines = [
    report("Imported", candidate ? `${candidate.name || candidate.slug || "candidate product"} candidate checked.` : `${products.length} existing products checked.`),
    report("SEO", products.map((product) => `${product.id || product.slug}: ${productSeoStatus(product, catalog)}`).join(" | ")),
    report("GEO", products.map((product) => `${product.id || product.slug}: ${geoStatus(product, catalog)}`).join(" | ")),
    report("Image SEO", products.map((product) => `${product.id || product.slug}: ${imageSeoStatus(product, catalog)}`).join(" | ")),
    report("Search Index", products.map((product) => `${product.id || product.slug}: ${searchIndexStatus(product, catalog)}`).join(" | ")),
    report("Schema", products.map((product) => `${product.id || product.slug}: ${schemaStatus(product)}`).join(" | ")),
    report("Sitemap", sitemapStatus(candidate ? catalog.getProducts() : products, catalog, siteConfig)),
    report("Duplicate Check", candidate ? (duplicateFindings.length ? duplicateFindings.join("; ") : "no duplicate identifiers found.") : "use --candidate path/to/product.json before importing a new product."),
    report("Missing Information", missing.length ? missing.join("; ") : "none for checked products.")
  ];

  if (!productData.productImportStandard) {
    reportLines.push("Warning: productImportStandard is not exposed in product-data.js.");
  }

  console.log(reportLines.join("\n"));

  if (options.strict && (duplicateFindings.length || missing.length)) {
    process.exitCode = 1;
  }
};

main();
