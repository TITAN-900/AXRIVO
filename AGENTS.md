# AXRIVO Product Import Standard

These instructions are permanent for AXRIVO work in this project.

When the user asks to add products, import product images, add items to Car Parts, add items to Heavy Truck Parts, or "put these products on the website", default to the full Product Import SEO + GEO workflow unless the user explicitly says "do not do SEO/GEO".

## Product Import Rule

Do not only display uploaded product images. A product import must cover:

- Product Data
- SEO
- GEO / AI Search Optimization
- Image SEO
- Internal Linking
- Structured Data
- AXRIVO Internal Search Index
- Sitemap
- Duplicate Product Protection
- Import Report

Accuracy is more important than quantity. Never invent unknown product facts for SEO, GEO, or search.

## Product Data

For each product, capture as much real information as available:

- Product Name
- Part Number
- OEM Number / OEM Numbers
- Brand
- Manufacturer
- Category
- Subcategory
- Vehicle Type
- Vehicle Brand
- Vehicle Model
- Engine Model
- Year / Generation
- Position
- Application
- Weight
- Dimensions
- Material
- Description
- Compatibility
- Keywords
- Main Image
- Gallery Images

If the image, filename, or user-provided information does not confirm a field, leave it empty. Do not guess OEM, part number, vehicle model, engine model, compatibility, specification, brand, manufacturer, or country of origin.

## Image SEO

Product images should use descriptive filenames when the available facts support it. Avoid keeping names such as `IMG_1234.jpg`, `DSC001.jpg`, or `WhatsApp-Image.jpg`.

Filename priority:

- Brand
- Vehicle
- Engine
- Product
- Part Number / OEM

Example: `hino-e13c-water-pump-16100-xxxx.jpg`

Alt text must be accurate and natural, such as `HINO E13C water pump OEM 16100-XXXX`. Do not keyword-stuff alt text. Keep images clear, web-friendly, responsive, and easy to replace. Use lazy loading for non-first-screen images. Do not distort or unnecessarily duplicate source images.

## Product URL SEO

Each product needs a stable, readable URL / slug, such as:

`/heavy-truck-parts/product/hino-e13c-water-pump-16100-xxxx/`

Do not use query-string product URLs such as `product?id=2387`. If a product already has a URL, do not change the slug for small edits.

## Page SEO

Every product page should include:

- `<title>`
- meta description
- canonical
- H1
- breadcrumb
- Open Graph metadata
- Twitter metadata when supported
- image alt text
- internal links

Titles and descriptions must be based on confirmed product information. Do not write unverified marketing claims or keyword-stuffed copy.

## GEO / AI Search Optimization

GEO means Generative Engine Optimization, not geographic SEO.

Every product page should expose clear entity relationships:

Product -> OEM Number -> Part Number -> Brand -> Vehicle -> Model -> Engine -> Category -> Application

Use clear sections:

- Product Overview
- Specifications
- Compatible Vehicles
- Engine Applications
- OEM / Part Numbers
- Applications
- Related Parts

Do not generate long, vague AI text. Prefer facts, structure, entity relationships, and accurate data.

## Structured Data

Generate valid JSON-LD where applicable:

- Product
- BreadcrumbList
- Organization
- WebSite

Product schema may include only real data, such as `name`, `image`, `description`, `sku`, `mpn`, and `brand`.

Do not create fake price, availability, rating, review, stock, or offer data.

## Internal Linking

Create internal links only when the underlying data is real:

- Product -> Category
- Product -> Brand
- Product -> Vehicle
- Product -> Engine
- Product -> Related Products

Example: `HINO E13C Water Pump -> HINO -> HINO 700 -> E13C -> Cooling System -> Related E13C Parts`

## AXRIVO Internal Search

After import, the product should be searchable by:

- Product Name
- Part Number
- OEM
- SKU
- Brand
- Vehicle Brand
- Vehicle Model
- Engine Model
- Category
- Keywords

Example searches such as `E13C`, `HINO E13C`, `water pump E13C`, and `16100-XXXX` should find the product when those facts exist in the product data.

## Sitemap

After adding a public product page, update sitemap generation and ensure:

- URL is unique
- canonical is correct
- sitemap includes the product
- page is not `noindex`
- `robots.txt` does not block the product

In local development, do not submit anything to Google. Search Console submission only happens after a real production domain is configured.

## Duplicate Product Protection

Before importing, check:

- Part Number
- OEM
- SKU
- Product Slug

If a possible duplicate exists, do not create a second page automatically. Decide whether it is:

- the same product with new images
- same OEM but different model
- left/right part
- front/rear part
- different specification

If unclear, stop and ask the user to confirm.

## Data Quality

SEO/GEO priority:

`ACCURACY > STRUCTURE > SEARCHABILITY > QUANTITY`

Prefer empty fields over invented information. Never fabricate OEM, part number, vehicle, engine, compatibility, specification, brand, manufacturer, or country of origin.

## Import Report

After each product import, report briefly in this format:

```text
Imported:
SEO:
GEO:
Image SEO:
Search Index:
Schema:
Sitemap:
Duplicate Check:
Missing Information:
```

## Current AXRIVO Files

The official AXRIVO website project root is this directory.

Important files:

- `product-data.js`: centralized product, category, brand, search and import-standard data
- `product-detail.js`: shared Product Detail Page template
- `search-page.js`: internal product search UI
- `category-page.js`: category result pages
- `brand-page.js`: brand pages
- `sitemap.xml`: generated sitemap output
- `tools/`: product import validation, static build and sitemap workflow tools
