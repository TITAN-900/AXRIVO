(function () {
  const root = document.querySelector("[data-category-page-root]");
  const catalog = window.AXRIVO_CATALOG;
  const ui = window.AXRIVO_UI;
  const helpers = window.AXRIVO_CONFIG_HELPERS;

  if (!root || !catalog || !ui) {
    return;
  }

  const escapeHtml = ui.escapeHtml;
  const localUrl = ui.localUrl;
  const [routeBase, categorySlug] = (helpers?.currentSitePath() ?? window.location.pathname).split("/").filter(Boolean);
  const vehicleType = routeBase === "heavy-truck-parts" ? "HEAVY TRUCK" : "CAR";
  const routeLabel = vehicleType === "HEAVY TRUCK" ? "Heavy Truck Parts" : "Car Parts";
  const finderLabel = vehicleType === "HEAVY TRUCK" ? "Find by Truck" : "Find by Vehicle";
  const category = catalog.categoryBySlug(categorySlug);
  const validCategory = category?.vehicleTypes?.includes(vehicleType);
  const params = new URLSearchParams(window.location.search);
  const state = {
    vehicleBrand: params.get("vehicleBrand") ?? "",
    vehicleModel: params.get("vehicleModel") ?? "",
    engineModel: params.get("engineModel") ?? "",
    sort: params.get("sort") ?? "relevance"
  };

  const option = (value, label, selected) =>
    `<option value="${escapeHtml(value)}"${value === selected ? " selected" : ""}>${escapeHtml(label)}</option>`;

  const currentUrl = () => `/${routeBase}/${categorySlug}/`;

  const updateUrl = () => {
    const next = new URLSearchParams();

    Object.entries(state).forEach(([key, value]) => {
      if (value && !(key === "sort" && value === "relevance")) {
        next.set(key, value);
      }
    });

    window.history.replaceState({}, "", localUrl(`${currentUrl()}${next.toString() ? `?${next}` : ""}`));
  };

  const setMeta = (count) => {
    const title = validCategory ? `${category.name} ${routeLabel} | AXRIVO` : "Category Not Found | AXRIVO";
    const description = validCategory
      ? `${category.name} for ${routeLabel.toLowerCase()} with structured product information and direct enquiry.`
      : "AXRIVO category route placeholder.";

    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", helpers?.absoluteUrl(currentUrl()) ?? currentUrl());

    const schema = document.querySelector("[data-page-jsonld]");
    if (schema && validCategory) {
      schema.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "CollectionPage",
            name: `${category.name} ${routeLabel}`,
            url: helpers?.absoluteUrl(currentUrl()) ?? currentUrl(),
            description,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: count
            }
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: helpers?.absoluteUrl("/") ?? "/" },
              { "@type": "ListItem", position: 2, name: routeLabel, item: helpers?.absoluteUrl(`/${routeBase}/`) ?? `/${routeBase}/` },
              { "@type": "ListItem", position: 3, name: category.name, item: helpers?.absoluteUrl(currentUrl()) ?? currentUrl() }
            ]
          }
        ]
      });
    }
  };

  const setActiveNavigation = () => {
      const targetHref = `/${routeBase}/`;

    document.querySelectorAll(".desktop-nav a, .mobile-nav a").forEach((link) => {
      const isActive = helpers?.isRouteLink(link, targetHref) ?? link.getAttribute("href") === targetHref;
      link.classList.toggle("is-active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      }
    });
  };

  const getResults = () =>
    validCategory
      ? catalog.getProductsByCategory(vehicleType, category.slug, {
          vehicleBrand: state.vehicleBrand,
          vehicleModel: state.vehicleModel,
          engineModel: state.engineModel,
          sort: state.sort
        })
      : [];

  const renderFilterSelect = ({ label, name, options, selected }) => `
    <label class="catalog-filter-field">
      <span>${escapeHtml(label)}</span>
      <select class="catalog-select" name="${escapeHtml(name)}">
        ${options.map(({ value, label: itemLabel }) => option(value, itemLabel, selected)).join("")}
      </select>
    </label>
  `;

  const renderInvalid = () => {
    setMeta(0);
    root.innerHTML = `
      <section class="catalog-hero">
        <div class="container">
          <nav class="product-breadcrumb" aria-label="Breadcrumb">
            <a href="${escapeHtml(localUrl("/"))}">Home</a>
            <span aria-hidden="true">/</span>
            <a href="${escapeHtml(localUrl(`/${routeBase}/`))}">${escapeHtml(routeLabel)}</a>
            <span aria-hidden="true">/</span>
            <span>Category Not Found</span>
          </nav>
          <div class="empty-state">
            <p class="commerce-kicker"><span>//</span> Category</p>
            <h1>CATEGORY NOT FOUND</h1>
            <p>This category route is ready for future product data, but no matching category is available yet.</p>
            <div class="content-actions">
              <a class="button button-primary" href="${escapeHtml(localUrl(`/${routeBase}/`))}">
                <span>BACK TO ${vehicleType === "HEAVY TRUCK" ? "TRUCK" : "CAR"} PARTS</span>
                <span class="button-arrow" aria-hidden="true">→</span>
              </a>
              <a class="button button-secondary" href="${escapeHtml(localUrl("/request-part/"))}">
                <span>REQUEST A PART</span>
                <span class="button-arrow" aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    `;
  };

  const render = () => {
    if (!validCategory) {
      renderInvalid();
      return;
    }

    const results = getResults();
    const vehicleProducts = catalog.getProductsByVehicleType(vehicleType);
    const filterOptions = catalog.getFilterOptions(vehicleProducts);
    const relatedCategories = catalog
      .getCategoriesForVehicleType(vehicleType)
      .filter((item) => item.slug !== category.slug)
      .slice(0, 5);

    setMeta(results.length);

    root.innerHTML = `
      <section class="catalog-hero category-detail-hero">
        <div class="container catalog-hero-grid">
          <div class="catalog-hero-copy">
            <nav class="product-breadcrumb" aria-label="Breadcrumb">
              <a href="${escapeHtml(localUrl("/"))}">Home</a>
              <span aria-hidden="true">/</span>
              <a href="${escapeHtml(localUrl(`/${routeBase}/`))}">${escapeHtml(routeLabel)}</a>
              <span aria-hidden="true">/</span>
              <span>${escapeHtml(category.name)}</span>
            </nav>
            <p class="commerce-kicker"><span>//</span> ${escapeHtml(routeLabel)}</p>
            <h1>${escapeHtml(category.name.toUpperCase())}</h1>
            <p>${escapeHtml(category.intro)}</p>
            <div class="content-actions">
              <a class="button button-primary" href="${escapeHtml(localUrl(`/${routeBase}/#${vehicleType === "HEAVY TRUCK" ? "find-by-truck" : "find-by-vehicle"}`))}">
                <span>${escapeHtml(finderLabel.toUpperCase())}</span>
                <span class="button-arrow" aria-hidden="true">→</span>
              </a>
              <button class="button button-secondary" type="button" data-enquiry-trigger>
                <span>ASK AXRIVO</span>
                <span class="button-arrow" aria-hidden="true">→</span>
              </button>
            </div>
          </div>
          <figure class="catalog-hero-media">
            <img src="${escapeHtml(localUrl(category.image))}" alt="${escapeHtml(category.name)} placeholder" loading="eager" decoding="async" />
          </figure>
        </div>
      </section>

      <section class="catalog-section">
        <div class="container catalog-layout">
          <aside class="catalog-filter-panel" aria-label="Category filters">
            <div>
              <p class="commerce-kicker"><span>//</span> Refine</p>
              <h2>FILTER CATEGORY</h2>
            </div>
            <form class="filter-grid" data-category-filter-form>
              ${renderFilterSelect({
                label: "Vehicle Brand",
                name: "vehicleBrand",
                selected: state.vehicleBrand,
                options: [{ value: "", label: "All Brands" }, ...filterOptions.vehicleBrands.map((brand) => ({ value: brand, label: brand }))]
              })}
              ${renderFilterSelect({
                label: "Model",
                name: "vehicleModel",
                selected: state.vehicleModel,
                options: [{ value: "", label: "All Models" }, ...catalog.getVehicleModels(vehicleType, state.vehicleBrand).map((model) => ({ value: model, label: model }))]
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
            <div class="related-category-list">
              <span>Related Categories</span>
              ${relatedCategories.map((item) => `<a href="${escapeHtml(localUrl(`/${routeBase}/${item.slug}/`))}">${escapeHtml(item.name)}</a>`).join("")}
            </div>
          </aside>

          <div class="catalog-results">
            <div class="catalog-results-head">
              <p>${results.length} ${escapeHtml(category.name)} result${results.length === 1 ? "" : "s"}</p>
              <a href="${escapeHtml(localUrl("/request-part/"))}">Request a missing part</a>
            </div>
            ${
              results.length
                ? `<div class="product-grid catalog-product-grid">${results.map((item) => ui.renderProductCard(item)).join("")}</div>`
                : `<div class="empty-state">
                    <p class="commerce-kicker"><span>//</span> No Match</p>
                    <h2>NO CATEGORY RESULTS YET.</h2>
                    <p>This demo catalog can be expanded with real AXRIVO products. Send part details to request a match.</p>
                    <div class="content-actions">
                      <a class="button button-primary" href="${escapeHtml(localUrl("/request-part/"))}">
                        <span>REQUEST THIS PART</span>
                        <span class="button-arrow" aria-hidden="true">→</span>
                      </a>
                      <a class="button button-secondary" href="${escapeHtml(localUrl("/search/"))}">
                        <span>SEARCH ALL PARTS</span>
                        <span class="button-arrow" aria-hidden="true">→</span>
                      </a>
                    </div>
                  </div>`
            }
          </div>
        </div>
      </section>
    `;

    root.querySelector("[data-category-filter-form]")?.addEventListener("change", (event) => {
      const field = event.target.name;

      if (!field) {
        return;
      }

      state[field] = event.target.value;

      if (field === "vehicleBrand") {
        state.vehicleModel = "";
      }

      updateUrl();
      render();
    });
  };

  setActiveNavigation();
  render();
})();
