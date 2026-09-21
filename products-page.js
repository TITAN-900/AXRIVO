(function () {
  const root = document.querySelector("[data-products-page-root]");
  const catalog = window.AXRIVO_CATALOG;
  const ui = window.AXRIVO_UI;
  const helpers = window.AXRIVO_CONFIG_HELPERS;

  if (!root || !catalog || !ui) {
    return;
  }

  const escapeHtml = ui.escapeHtml;
  const localUrl = ui.localUrl;
  const params = new URLSearchParams(window.location.search);
  const state = {
    q: params.get("q") ?? "",
    category: params.get("category") ?? "",
    vehicleBrand: params.get("vehicleBrand") ?? "",
    engineModel: params.get("engineModel") ?? "",
    sort: params.get("sort") ?? "relevance"
  };

  const option = (value, label, selected) =>
    `<option value="${escapeHtml(value)}"${value === selected ? " selected" : ""}>${escapeHtml(label)}</option>`;

  const updateUrl = () => {
    const next = new URLSearchParams();

    Object.entries(state).forEach(([key, value]) => {
      if (value && !(key === "sort" && value === "relevance")) {
        next.set(key, value);
      }
    });

    const query = next.toString();
    window.history.replaceState({}, "", localUrl(`/products/${query ? `?${query}` : ""}`));
  };

  const getResults = () =>
    catalog.searchProducts({
      query: state.q,
      filters: {
        category: state.category,
        vehicleBrand: state.vehicleBrand,
        engineModel: state.engineModel
      },
      sort: state.sort
    });

  const setPageMetadata = (results) => {
    const description = state.q
      ? `Browse AXRIVO product results for ${state.q}, including OEM, part number, vehicle and engine information.`
      : "Browse AXRIVO automotive and heavy vehicle parts by product category, OEM number, part number, brand, vehicle or engine.";
    const canonical = helpers?.absoluteUrl("/products/") ?? "/products/";

    document.title = state.q ? `${state.q} Products | AXRIVO` : "Products | AXRIVO Automotive & Heavy Vehicle Parts";
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", document.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", canonical);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", canonical);

    const schema = document.querySelector("[data-products-jsonld]");
    if (schema) {
      schema.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "AXRIVO Products",
        url: canonical,
        description,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: results.length,
          itemListElement: results.map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: product.name,
            url: helpers?.absoluteUrl(catalog.productUrl(product)) ?? catalog.productUrl(product)
          }))
        }
      });
    }
  };

  const renderFilterSelect = ({ label, name, options, selected }) => `
    <label class="catalog-filter-field">
      <span>${escapeHtml(label)}</span>
      <select class="catalog-select" name="${escapeHtml(name)}">
        ${options.map(({ value, label: itemLabel }) => option(value, itemLabel, selected)).join("")}
      </select>
    </label>`;

  const render = () => {
    const results = getResults();
    const allProducts = catalog.getProducts();
    const filterOptions = catalog.getFilterOptions(allProducts);
    const categories = catalog.getCategories();

    setPageMetadata(results);

    root.innerHTML = `
      <section class="catalog-hero products-catalog-hero">
        <div class="container">
          <nav class="product-breadcrumb" aria-label="Breadcrumb">
            <a href="${escapeHtml(localUrl("/"))}">Home</a>
            <span aria-hidden="true">/</span>
            <span>Products</span>
          </nav>
          <div class="catalog-hero-copy">
            <p class="commerce-kicker"><span>//</span> Complete Parts Catalog</p>
            <h1>PRODUCTS</h1>
            <p>Find parts by product name, OEM number, part number, vehicle or engine.</p>
          </div>
          <form class="part-search catalog-search-form" action="${escapeHtml(localUrl("/products/"))}" data-products-search-form>
            <label class="sr-only" for="products-search-input">Search AXRIVO products</label>
            <div class="part-search-field">
              <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"></circle><path d="m16.5 16.5 4 4"></path></svg>
              <input id="products-search-input" name="q" type="search" value="${escapeHtml(state.q)}" placeholder="Search Part Number, OEM, Product, Vehicle or Engine..." />
            </div>
            <button class="part-search-button" type="submit"><span>SEARCH</span><span class="finder-arrow" aria-hidden="true">→</span></button>
          </form>
        </div>
      </section>

      <section class="catalog-section" id="categories">
        <div class="container catalog-layout">
          <aside class="catalog-filter-panel" aria-label="Product filters">
            <div><p class="commerce-kicker"><span>//</span> Browse</p><h2>FILTER PRODUCTS</h2></div>
            <form class="filter-grid" data-products-filter-form>
              ${renderFilterSelect({
                label: "Category",
                name: "category",
                selected: state.category,
                options: [{ value: "", label: "All Categories" }, ...categories.map((category) => ({ value: category.slug, label: category.name }))]
              })}
              ${renderFilterSelect({
                label: "Vehicle Brand",
                name: "vehicleBrand",
                selected: state.vehicleBrand,
                options: [{ value: "", label: "All Brands" }, ...filterOptions.vehicleBrands.map((brand) => ({ value: brand, label: brand }))]
              })}
              ${renderFilterSelect({
                label: "Engine",
                name: "engineModel",
                selected: state.engineModel,
                options: [{ value: "", label: "All Engines" }, ...filterOptions.engineModels.map((engine) => ({ value: engine, label: engine }))]
              })}
              ${renderFilterSelect({
                label: "Sort",
                name: "sort",
                selected: state.sort,
                options: [
                  { value: "relevance", label: "Relevance" },
                  { value: "newest", label: "Newest" },
                  { value: "az", label: "A-Z" }
                ]
              })}
            </form>
            <div class="related-category-list products-category-links">
              <span>Categories</span>
              ${categories
                .map(
                  (category) =>
                    `<a href="${escapeHtml(localUrl(`/products/?category=${encodeURIComponent(category.slug)}`))}"${state.category === category.slug ? ' aria-current="page"' : ""}>${escapeHtml(category.name)}</a>`
                )
                .join("")}
            </div>
          </aside>

          <div class="catalog-results">
            <div class="catalog-results-head">
              <p>${results.length} product${results.length === 1 ? "" : "s"}</p>
              <a href="${escapeHtml(localUrl("/request-part/"))}">Can't find your part?</a>
            </div>
            ${
              results.length
                ? `<div class="product-grid catalog-product-grid">${results.map((product) => ui.renderProductCard(product)).join("")}</div>`
                : `<div class="empty-state">
                    <p class="commerce-kicker"><span>//</span> No Match</p>
                    <h2>WE COULDN'T FIND THAT PART.</h2>
                    <p>Send the part number, OEM number, vehicle information or a product photo and AXRIVO can help identify it.</p>
                    <div class="content-actions"><a class="button button-primary" href="${escapeHtml(localUrl("/request-part/"))}"><span>REQUEST A PART</span><span class="button-arrow" aria-hidden="true">→</span></a></div>
                  </div>`
            }
          </div>
        </div>
      </section>`;

    bindEvents();
  };

  const bindEvents = () => {
    root.querySelector("[data-products-search-form]")?.addEventListener("submit", (event) => {
      event.preventDefault();
      state.q = root.querySelector("#products-search-input")?.value.trim() ?? "";
      updateUrl();
      render();
    });

    root.querySelector("[data-products-filter-form]")?.addEventListener("change", (event) => {
      if (!event.target.name) {
        return;
      }

      state[event.target.name] = event.target.value;
      updateUrl();
      render();
    });
  };

  render();
})();
