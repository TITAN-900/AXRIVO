(function () {
  const root = document.querySelector("[data-search-page-root]");
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
    vehicleType: params.get("vehicleType") ?? "",
    category: params.get("category") ?? "",
    vehicleBrand: params.get("vehicleBrand") ?? "",
    vehicleModel: params.get("vehicleModel") ?? "",
    engineModel: params.get("engineModel") ?? "",
    year: params.get("year") ?? "",
    sort: params.get("sort") ?? "relevance"
  };

  const option = (value, label, selected) =>
    `<option value="${escapeHtml(value)}"${value === selected ? " selected" : ""}>${escapeHtml(label)}</option>`;

  const currentFilters = () => ({
    vehicleType: state.vehicleType,
    category: state.category,
    vehicleBrand: state.vehicleBrand,
    vehicleModel: state.vehicleModel,
    engineModel: state.engineModel,
    year: state.year
  });

  const updateUrl = () => {
    const next = new URLSearchParams();

    Object.entries(state).forEach(([key, value]) => {
      if (value && !(key === "sort" && value === "relevance")) {
        next.set(key, value);
      }
    });

    const query = next.toString();
    window.history.replaceState({}, "", localUrl(`/search/${query ? `?${query}` : ""}`));
  };

  const setMeta = (count) => {
    const title = state.q ? `Search ${state.q} | AXRIVO` : "Search Parts | AXRIVO";
    const description = `${count} AXRIVO demo part result${count === 1 ? "" : "s"} for automotive and heavy vehicle enquiries.`;

    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", helpers?.absoluteUrl("/search/") ?? "/search/");
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", helpers?.absoluteUrl("/search/") ?? "/search/");
  };

  const setSchema = (count) => {
    const schema = document.querySelector("[data-page-jsonld]");

    if (!schema) {
      return;
    }

    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SearchResultsPage",
      name: state.q ? `Search results for ${state.q}` : "AXRIVO Search Results",
      url: helpers?.absoluteUrl(window.location.pathname + window.location.search) ?? window.location.href,
      about: "Automotive and heavy vehicle parts",
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: count
      }
    });
  };

  const search = () =>
    catalog.searchProducts({
      query: state.q,
      filters: currentFilters(),
      sort: state.sort
    });

  const getFilterOptions = () => {
    const baseItems = catalog.getProducts();

    return {
      categories: catalog.getCategoriesForVehicleType(state.vehicleType || "CAR").concat(
        state.vehicleType ? [] : catalog.getCategoriesForVehicleType("HEAVY TRUCK")
      ),
      vehicleBrands: catalog.getFilterOptions(baseItems).vehicleBrands,
      vehicleModels: catalog.getVehicleModels(state.vehicleType || "", state.vehicleBrand),
      engineModels: catalog.getFilterOptions(baseItems).engineModels
    };
  };

  const renderFilterSelect = ({ label, name, options, selected }) => `
    <label class="catalog-filter-field">
      <span>${escapeHtml(label)}</span>
      <select class="catalog-select" name="${escapeHtml(name)}">
        ${options.map(({ value, label: itemLabel }) => option(value, itemLabel, selected)).join("")}
      </select>
    </label>
  `;

  const renderResults = () => {
    const results = search();
    const options = getFilterOptions();
    const title = state.q ? `SEARCH RESULTS FOR "${state.q}"` : "SEARCH RESULTS";

    setMeta(results.length);
    setSchema(results.length);

    root.innerHTML = `
      <section class="catalog-hero catalog-search-hero">
        <div class="container">
          <nav class="product-breadcrumb" aria-label="Breadcrumb">
            <a href="${escapeHtml(localUrl("/"))}">Home</a>
            <span aria-hidden="true">/</span>
            <span>Search</span>
          </nav>
          <div class="catalog-hero-copy">
            <p class="commerce-kicker"><span>//</span> Part Search</p>
            <h1>${escapeHtml(title)}</h1>
            <p>Search by part number, OEM, vehicle model or engine code.</p>
          </div>
          <form class="part-search catalog-search-form" action="${escapeHtml(localUrl("/search/"))}" data-search-form>
            <label class="sr-only" for="catalog-search-input">Search AXRIVO parts</label>
            <div class="part-search-field">
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7"></circle>
                <path d="m16.5 16.5 4 4"></path>
              </svg>
              <input id="catalog-search-input" name="q" type="search" value="${escapeHtml(state.q)}" placeholder="Search Part Number, OEM, Product, Vehicle or Engine..." />
            </div>
            <button class="part-search-button" type="submit">
              <span>SEARCH</span>
              <span class="finder-arrow" aria-hidden="true">→</span>
            </button>
          </form>
        </div>
      </section>

      <section class="catalog-section">
        <div class="container catalog-layout">
          <aside class="catalog-filter-panel" aria-label="Search filters">
            <div>
              <p class="commerce-kicker"><span>//</span> Refine</p>
              <h2>FILTER PARTS</h2>
            </div>
            <form class="filter-grid" data-filter-form>
              ${renderFilterSelect({
                label: "Vehicle Type",
                name: "vehicleType",
                selected: state.vehicleType,
                options: [
                  { value: "", label: "All Vehicles" },
                  { value: "CAR", label: "Passenger Car" },
                  { value: "HEAVY TRUCK", label: "Heavy Truck" }
                ]
              })}
              ${renderFilterSelect({
                label: "Category",
                name: "category",
                selected: state.category,
                options: [
                  { value: "", label: "All Categories" },
                  ...catalog
                    .unique(options.categories.map((category) => category.slug))
                    .map((slug) => ({ value: slug, label: catalog.categoryName(slug) }))
                ]
              })}
              ${renderFilterSelect({
                label: "Vehicle Brand",
                name: "vehicleBrand",
                selected: state.vehicleBrand,
                options: [{ value: "", label: "All Brands" }, ...options.vehicleBrands.map((brand) => ({ value: brand, label: brand }))]
              })}
              ${renderFilterSelect({
                label: "Model",
                name: "vehicleModel",
                selected: state.vehicleModel,
                options: [{ value: "", label: "All Models" }, ...options.vehicleModels.map((model) => ({ value: model, label: model }))]
              })}
              ${renderFilterSelect({
                label: "Engine",
                name: "engineModel",
                selected: state.engineModel,
                options: [{ value: "", label: "All Engines" }, ...options.engineModels.map((engine) => ({ value: engine, label: engine }))]
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
          </aside>

          <div class="catalog-results">
            <div class="catalog-results-head">
              <p>${results.length} result${results.length === 1 ? "" : "s"}</p>
              <a href="${escapeHtml(localUrl("/request-part/"))}">Need help finding a part?</a>
            </div>
            ${
              results.length
                ? `<div class="product-grid catalog-product-grid">${results.map((product) => ui.renderProductCard(product)).join("")}</div>`
                : `<div class="empty-state">
                    <p class="commerce-kicker"><span>//</span> No Match</p>
                    <h2>WE COULDN'T FIND THAT PART.</h2>
                    <p>Send us the part number, OEM number, vehicle information or a product photo and AXRIVO can help identify it.</p>
                    <div class="content-actions">
                      <a class="button button-primary" href="${escapeHtml(localUrl("/request-part/"))}">
                        <span>SEND US A PHOTO / PART NUMBER</span>
                        <span class="button-arrow" aria-hidden="true">→</span>
                      </a>
                      <a class="button button-secondary" href="#" data-whatsapp-generic>
                        <span>WHATSAPP US</span>
                        <span class="button-arrow" aria-hidden="true">→</span>
                      </a>
                    </div>
                  </div>`
            }
          </div>
        </div>
      </section>
    `;

    bindEvents();
  };

  const bindEvents = () => {
    root.querySelector("[data-search-form]")?.addEventListener("submit", (event) => {
      event.preventDefault();
      state.q = root.querySelector("#catalog-search-input")?.value.trim() ?? "";
      updateUrl();
      renderResults();
    });

    root.querySelector("[data-filter-form]")?.addEventListener("change", (event) => {
      const field = event.target.name;

      if (!field) {
        return;
      }

      state[field] = event.target.value;

      if (field === "vehicleType") {
        state.category = "";
        state.vehicleBrand = "";
        state.vehicleModel = "";
        state.engineModel = "";
      }

      if (field === "vehicleBrand") {
        state.vehicleModel = "";
      }

      updateUrl();
      renderResults();
    });
  };

  renderResults();
})();
