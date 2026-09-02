(function () {
  const catalog = window.AXRIVO_CATALOG;
  const ui = window.AXRIVO_UI;
  const helpers = window.AXRIVO_CONFIG_HELPERS;
  const pageType = document.body.dataset.partsPage;
  const vehicleType = pageType === "truck" ? "HEAVY TRUCK" : "CAR";
  const routeBase = pageType === "truck" ? "heavy-truck-parts" : "car-parts";
  const pageLabel = pageType === "truck" ? "Heavy Truck Parts" : "Car Parts";

  if (!catalog || !ui || !pageType) {
    return;
  }

  const escapeHtml = ui.escapeHtml;
  const localUrl = ui.localUrl;
  const categoryCodePrefix = pageType === "truck" ? "TRUCK" : "CAR";

  const renderCategoryCard = (category, index) => `
    <a class="category-card parts-category-card" href="${escapeHtml(localUrl(`/${routeBase}/${category.slug}/`))}" aria-label="Explore ${escapeHtml(category.name)}">
      <img src="${escapeHtml(localUrl(category.image))}" alt="${escapeHtml(category.name)} placeholder" loading="lazy" decoding="async" />
      <span class="category-shade" aria-hidden="true"></span>
      <span class="category-content">
        <span class="category-code">${categoryCodePrefix} / ${String(index + 1).padStart(2, "0")}</span>
        <strong>${escapeHtml(category.name.toUpperCase())}</strong>
        <span class="category-link">Explore <span aria-hidden="true">→</span></span>
      </span>
      <span class="category-accent" aria-hidden="true"></span>
    </a>
  `;

  const renderBrand = (brand) => `
    <a class="parts-brand-item" href="${escapeHtml(localUrl(`/brands/${catalog.slugify(brand)}/`))}" aria-label="View AXRIVO parts for ${escapeHtml(brand)}">
      ${escapeHtml(brand)}
    </a>
  `;

  const setMeta = () => {
    const title = `${pageLabel} | AXRIVO`;
    const description =
      vehicleType === "HEAVY TRUCK"
        ? "Heavy truck parts built for commercial vehicles, fleets and heavy-duty applications from AXRIVO."
        : "Passenger car parts for everyday vehicles, performance and reliability from AXRIVO.";

    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", helpers?.absoluteUrl(`/${routeBase}/`) ?? `/${routeBase}/`);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", helpers?.absoluteUrl(`/${routeBase}/`) ?? `/${routeBase}/`);
  };

  const setPageSchema = () => {
    const schema = document.querySelector("[data-page-jsonld]");

    if (!schema) {
      return;
    }

    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          "@id": helpers?.absoluteUrl(`/${routeBase}/#collection`) ?? `/${routeBase}/#collection`,
          name: `${pageLabel} | AXRIVO`,
          url: helpers?.absoluteUrl(`/${routeBase}/`) ?? `/${routeBase}/`,
          about: pageLabel
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: helpers?.absoluteUrl("/") ?? "/"
            },
            {
              "@type": "ListItem",
              position: 2,
              name: pageLabel,
              item: helpers?.absoluteUrl(`/${routeBase}/`) ?? `/${routeBase}/`
            }
          ]
        }
      ]
    });
  };

  const renderCategories = () => {
    const categoryGrid = document.querySelector("[data-parts-categories]");

    if (!categoryGrid) {
      return;
    }

    categoryGrid.innerHTML = catalog
      .getCategoriesForVehicleType(vehicleType)
      .map((category, index) => renderCategoryCard(category, index))
      .join("");
  };

  const renderBrands = () => {
    const brandList = document.querySelector("[data-parts-brands]");

    if (!brandList) {
      return;
    }

    brandList.innerHTML = catalog.getVehicleBrands(vehicleType).map(renderBrand).join("");
  };

  const renderProducts = () => {
    const productGrid = document.querySelector("[data-parts-products]");

    if (!productGrid) {
      return;
    }

    const products = catalog.sortProducts(catalog.getProductsByVehicleType(vehicleType), "newest").slice(0, 8);

    productGrid.innerHTML = products
      .map((product) =>
        ui.renderProductCard(product, {
          className: "parts-product-card",
          secondaryMeta:
            vehicleType === "HEAVY TRUCK"
              ? `Truck Model: ${(product.vehicleModels ?? []).join(" / ")} | Engine: ${(product.engineModels ?? []).join(" / ")}`
              : `Vehicle Application: ${(product.vehicleBrands ?? []).join(" / ")} ${(product.vehicleModels ?? []).join(" / ")}`
        })
      )
      .join("");
  };

  const setupFinder = () => {
    const finderFields = document.querySelector("[data-parts-finder-fields]");
    const finderForm = document.querySelector("[data-parts-finder-form]");
    const submitButton = document.querySelector(".parts-finder-submit");
    const finder = ui.setupVehicleFinder({
      container: finderFields,
      vehicleType,
      includeYear: vehicleType === "CAR",
      submitControl: submitButton
    });

    if (finderForm) {
      finderForm.addEventListener("submit", (event) => {
        event.preventDefault();
        finder?.submit();
      });
    }
  };

  const revealSections = () => {
    const partsSections = document.querySelectorAll("[data-parts-section]");
    const revealSection = (section) => section.classList.add("is-visible");

    if ("IntersectionObserver" in window) {
      const partsObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              revealSection(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.16 }
      );

      partsSections.forEach((section) => partsObserver.observe(section));
    } else {
      partsSections.forEach(revealSection);
    }

    window.requestAnimationFrame(() => {
      document.querySelector(".parts-hero")?.classList.add("is-visible");
    });
  };

  setMeta();
  setPageSchema();
  renderCategories();
  renderBrands();
  renderProducts();
  setupFinder();
  revealSections();
})();
