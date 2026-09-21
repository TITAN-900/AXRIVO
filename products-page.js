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
    q: params.get("q") ?? ""
  };

  const updateUrl = () => {
    const next = new URLSearchParams();

    if (state.q) {
      next.set("q", state.q);
    }

    const query = next.toString();
    window.history.replaceState({}, "", localUrl(`/products/${query ? `?${query}` : ""}`));
  };

  const getResults = () =>
    catalog.searchProducts({
      query: state.q
    });

  const setPageMetadata = (results) => {
    const description = state.q
      ? `Browse AXRIVO product results for ${state.q} by product name, part number or OEM number.`
      : "Browse AXRIVO automotive and heavy vehicle parts by product name, part number or OEM number.";
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

  const render = () => {
    const results = getResults();

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
            <p>Find parts by product name, part number or OEM number.</p>
          </div>
          <form class="part-search catalog-search-form" action="${escapeHtml(localUrl("/products/"))}" data-products-search-form>
            <label class="sr-only" for="products-search-input">Search AXRIVO products</label>
            <div class="part-search-field">
              <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"></circle><path d="m16.5 16.5 4 4"></path></svg>
              <input id="products-search-input" name="q" type="search" value="${escapeHtml(state.q)}" placeholder="Search Product Name, Part Number or OEM..." />
            </div>
            <button class="part-search-button" type="submit"><span>SEARCH</span><span class="finder-arrow" aria-hidden="true">→</span></button>
          </form>
        </div>
      </section>

      <section class="catalog-section" id="products-grid">
        <div class="container products-grid-shell">
          <div class="catalog-results">
            <div class="catalog-results-head">
              <p>${results.length} product${results.length === 1 ? "" : "s"}</p>
              <a href="${escapeHtml(localUrl("/request-part/"))}">Can't find your part?</a>
            </div>
            ${
              results.length
                ? `<div class="product-grid catalog-product-grid">${results.map((product) => ui.renderProductCard(product, { compactMeta: true })).join("")}</div>`
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
  };

  render();
})();
