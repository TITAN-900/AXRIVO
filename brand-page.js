(function () {
  const root = document.querySelector("[data-brand-page-root]");
  const catalog = window.AXRIVO_CATALOG;
  const ui = window.AXRIVO_UI;
  const helpers = window.AXRIVO_CONFIG_HELPERS;

  if (!root || !catalog || !ui) {
    return;
  }

  const escapeHtml = ui.escapeHtml;
  const localUrl = ui.localUrl;
  const [, brandSlug] = (helpers?.currentSitePath() ?? window.location.pathname).split("/").filter(Boolean);

  const brandLink = (brand) => localUrl(`/brands/${catalog.slugify(brand)}/`);

  const setMeta = ({ title, description, canonicalPath, schema }) => {
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", helpers?.absoluteUrl(canonicalPath) ?? canonicalPath);

    const json = document.querySelector("[data-page-jsonld]");
    if (json && schema) {
      json.textContent = JSON.stringify(schema);
    }
  };

  const renderBrandIndex = () => {
    const carBrands = catalog.getPopularBrands("CAR");
    const truckBrands = catalog.getPopularBrands("HEAVY TRUCK");

    setMeta({
      title: "Brands We Supply | AXRIVO",
      description: "Passenger car and heavy truck brand placeholders for AXRIVO product enquiries.",
      canonicalPath: "/brands/",
      schema: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Brands We Supply | AXRIVO",
        url: helpers?.absoluteUrl("/brands/") ?? "/brands/"
      }
    });

    root.innerHTML = `
      <section class="catalog-hero">
        <div class="container">
          <nav class="product-breadcrumb" aria-label="Breadcrumb">
            <a href="${escapeHtml(localUrl("/"))}">Home</a>
            <span aria-hidden="true">/</span>
            <span>Brands</span>
          </nav>
          <div class="catalog-hero-copy">
            <p class="commerce-kicker"><span>//</span> Supply Network</p>
            <h1>BRANDS WE SUPPLY</h1>
            <p>Browse AXRIVO demo product data by passenger car and heavy truck brand.</p>
          </div>
        </div>
      </section>
      <section class="catalog-section">
        <div class="container brand-index-grid">
          <article class="brand-index-panel">
            <p class="commerce-kicker"><span>//</span> Passenger Car</p>
            <h2>CAR BRANDS</h2>
            <div class="parts-brand-list">
              ${carBrands.map((brand) => `<a class="parts-brand-item" href="${brandLink(brand)}">${escapeHtml(brand)}</a>`).join("")}
            </div>
          </article>
          <article class="brand-index-panel">
            <p class="commerce-kicker"><span>//</span> Heavy Truck</p>
            <h2>TRUCK BRANDS</h2>
            <div class="parts-brand-list">
              ${truckBrands.map((brand) => `<a class="parts-brand-item" href="${brandLink(brand)}">${escapeHtml(brand)}</a>`).join("")}
            </div>
          </article>
        </div>
      </section>
    `;
  };

  const routeBaseForType = (type) => (type === "HEAVY TRUCK" ? "heavy-truck-parts" : "car-parts");
  const routeLabelForType = (type) => (type === "HEAVY TRUCK" ? "Heavy Truck Parts" : "Car Parts");

  const renderBrandDetail = () => {
    const summary = catalog.getBrandSummary(brandSlug);
    const products = summary.products;
    const vehicleTypes = summary.vehicleTypes.length ? summary.vehicleTypes : [];
    const categories = summary.categories
      .map((slug) => catalog.categoryBySlug(slug))
      .filter(Boolean);
    const searchHref = localUrl(`/search/?vehicleBrand=${encodeURIComponent(summary.name)}`);

    setMeta({
      title: `${summary.name} Parts | AXRIVO`,
      description: `AXRIVO demo products and enquiry route for ${summary.name} passenger car or heavy truck parts.`,
      canonicalPath: `/brands/${summary.slug}/`,
      schema: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Brand",
            name: summary.name,
            url: helpers?.absoluteUrl(`/brands/${summary.slug}/`) ?? `/brands/${summary.slug}/`
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: helpers?.absoluteUrl("/") ?? "/" },
              { "@type": "ListItem", position: 2, name: "Brands", item: helpers?.absoluteUrl("/brands/") ?? "/brands/" },
              { "@type": "ListItem", position: 3, name: summary.name, item: helpers?.absoluteUrl(`/brands/${summary.slug}/`) ?? `/brands/${summary.slug}/` }
            ]
          }
        ]
      }
    });

    root.innerHTML = `
      <section class="catalog-hero brand-detail-hero">
        <div class="container catalog-hero-grid">
          <div class="catalog-hero-copy">
            <nav class="product-breadcrumb" aria-label="Breadcrumb">
              <a href="${escapeHtml(localUrl("/"))}">Home</a>
              <span aria-hidden="true">/</span>
              <a href="${escapeHtml(localUrl("/brands/"))}">Brands</a>
              <span aria-hidden="true">/</span>
              <span>${escapeHtml(summary.name)}</span>
            </nav>
            <p class="commerce-kicker"><span>//</span> Brand Page</p>
            <h1>${escapeHtml(summary.name.toUpperCase())} PARTS</h1>
            <p>Browse available demo products, related categories and vehicle models for this brand.</p>
            <div class="content-actions">
              <a class="button button-primary" href="${escapeHtml(searchHref)}">
                <span>SEARCH ${escapeHtml(summary.name.toUpperCase())}</span>
                <span class="button-arrow" aria-hidden="true">→</span>
              </a>
              <a class="button button-secondary" href="${escapeHtml(localUrl("/request-part/"))}">
                <span>REQUEST A PART</span>
                <span class="button-arrow" aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <div class="brand-mark-panel" aria-hidden="true">
            <span>${escapeHtml(summary.name)}</span>
          </div>
        </div>
      </section>

      <section class="catalog-section">
        <div class="container catalog-layout">
          <aside class="catalog-filter-panel">
            <p class="commerce-kicker"><span>//</span> Brand Data</p>
            <h2>OVERVIEW</h2>
            <div class="brand-summary-grid">
              <div>
                <span>Vehicle World</span>
                <strong>${vehicleTypes.length ? escapeHtml(vehicleTypes.map(routeLabelForType).join(" / ")) : "Placeholder Brand"}</strong>
              </div>
              <div>
                <span>Demo Products</span>
                <strong>${products.length}</strong>
              </div>
              <div>
                <span>Vehicle Models</span>
                <strong>${summary.vehicleModels.length ? escapeHtml(summary.vehicleModels.join(" / ")) : "Pending product data"}</strong>
              </div>
            </div>
            <div class="related-category-list">
              <span>Available Categories</span>
              ${
                categories.length
                  ? categories
                      .map((category) => {
                        const type = products.find((product) => product.category === category.slug)?.vehicleType ?? "CAR";
                        return `<a href="${escapeHtml(localUrl(`/${routeBaseForType(type)}/${category.slug}/`))}">${escapeHtml(category.name)}</a>`;
                      })
                      .join("")
                  : `<a href="${escapeHtml(localUrl("/request-part/"))}">Send product information</a>`
              }
            </div>
          </aside>

          <div class="catalog-results">
            <div class="catalog-results-head">
              <p>${products.length} product${products.length === 1 ? "" : "s"}</p>
              <a href="${escapeHtml(searchHref)}">Open Search Results</a>
            </div>
            ${
              products.length
                ? `<div class="product-grid catalog-product-grid">${products.map((product) => ui.renderProductCard(product)).join("")}</div>`
                : `<div class="empty-state">
                    <p class="commerce-kicker"><span>//</span> Placeholder</p>
                    <h2>PRODUCT DATA COMING LATER.</h2>
                    <p>This brand page is ready for real AXRIVO inventory. Add products in product-data.js to populate it automatically.</p>
                    <div class="content-actions">
                      <a class="button button-primary" href="${escapeHtml(localUrl("/request-part/"))}">
                        <span>REQUEST ${escapeHtml(summary.name.toUpperCase())} PARTS</span>
                        <span class="button-arrow" aria-hidden="true">→</span>
                      </a>
                    </div>
                  </div>`
            }
          </div>
        </div>
      </section>
    `;
  };

  if (brandSlug) {
    renderBrandDetail();
  } else {
    renderBrandIndex();
  }
})();
