# AXRIVO Website

Official static website project for AXRIVO Automotive & Heavy Vehicle Parts.

This folder is the GitHub/Vercel project root. Open this folder directly in VS Code.

## Local Development

```bash
npm run dev
```

The local server uses normal HTTP routes such as:

- `/`
- `/car-parts/`
- `/heavy-truck-parts/`
- `/brands/`
- `/about/`
- `/contact/`
- `/search/`
- `/car-parts/product/{product-slug}/`
- `/heavy-truck-parts/product/{product-slug}/`

Direct `file://` opening is no longer the primary workflow.

## Production Build

```bash
npm run build
```

The build writes deployable files to `dist/`. Vercel should deploy only `dist/`, not the project tools.

## Vercel Settings

- Framework Preset: Other
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: leave default or blank
- Root Directory: this folder

`vercel.json` contains the same build settings for Vercel imports.

## SITE_URL

Set `SITE_URL` in Vercel Environment Variables after creating the Vercel project.

For local builds, copy `.env.example` to `.env` and set:

```bash
SITE_URL=https://your-vercel-project.vercel.app
```

When the final AXRIVO domain is ready, update `SITE_URL` in Vercel and bind the domain there. Do not permanently hardcode a temporary Vercel URL in source files.

## Configuration

- `site-config.js`: brand, routes, company placeholders, WhatsApp placeholder, analytics placeholders and SEO defaults.
- `product-data.js`: centralized demo product schema, category data, brand lists, search helpers and product import standard.
- `AGENTS.md`: permanent Product Import SEO + GEO rules.

Unknown company information remains as placeholders in `site-config.js`.

## Product Import Workflow

When adding products or product images, follow the Product Import SEO + GEO workflow unless the request explicitly says not to do SEO/GEO.

- `tools/product-import-template.json`: blank product data template. Leave unknown facts blank.
- `tools/product-import-audit.js`: checks duplicate identifiers, image SEO, searchable fields, schema readiness, sitemap coverage and missing product information.
- `tools/generate-sitemap.js`: generates or checks `sitemap.xml` after public product pages are added.

Useful checks:

```bash
npm run validate
node tools/product-import-audit.js --candidate tools/product-import-template.json
```

## Replace Images

Replace these files without changing the HTML structure:

- `assets/axrivo-logo-transparent.png`
- `images/hero/car-bmw.jpg`
- `images/hero/heavy-truck-quarry.jpg`
- `assets/hero-bridge-background.jpg`
- `assets/categories/*.svg`
- `assets/products/*.svg`

## Placeholder Features

Search, filters, vehicle finder, product gallery, copy part number, enquiry modal, contact form, request-part form, newsletter and WhatsApp routing are frontend UI only. Connect them to the real backend, CRM, inbox, WhatsApp number or product database before production.
