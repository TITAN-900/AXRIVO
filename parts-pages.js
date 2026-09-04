(function () {
  const catalog = window.AXRIVO_CATALOG;
  const ui = window.AXRIVO_UI;
  const helpers = window.AXRIVO_CONFIG_HELPERS;
  const pageType = document.body.dataset.partsPage;
  const vehicleType = pageType === "truck" ? "HEAVY TRUCK" : "CAR";
  const routeBase = pageType === "truck" ? "heavy-truck-parts" : "car-parts";
  const pageLabel = pageType === "truck" ? "Heavy Truck Parts" : "Car Parts";
  const heroImagePath =
    pageType === "truck"
      ? "/images/pages/heavy-truck-parts/howo-heavy-truck-side-profile.png"
      : "/images/pages/car-parts/proton-passenger-car-side-profile.png";
  const heroImageAlt =
    pageType === "truck"
      ? "HOWO heavy truck side profile for AXRIVO heavy truck parts"
      : "Proton passenger car side profile for AXRIVO car parts";

  if (!catalog || !ui || !pageType) {
    return;
  }

  const escapeHtml = ui.escapeHtml;
  const localUrl = ui.localUrl;
  const categoryCodePrefix = pageType === "truck" ? "TRUCK" : "CAR";
  const carCategoryVisuals = {
    "engine-parts": {
      image: "/images/pages/car-parts/categories/car-engine-parts.webp",
      alt: "Passenger car engine assembly on white background"
    },
    "brake-system": {
      image: "/images/pages/car-parts/categories/car-brake-system.webp",
      alt: "Brake disc, caliper and brake pads on white background"
    },
    suspension: {
      image: "/images/pages/car-parts/categories/car-suspension-parts.webp",
      alt: "Shock absorber strut and control arm on white background"
    },
    steering: {
      image: "/images/pages/car-parts/categories/car-steering-parts.webp",
      alt: "Steering rack assembly on white background"
    },
    electrical: {
      image: "/images/pages/car-parts/categories/car-electrical-parts.webp",
      alt: "Car battery, alternator and starter motor on white background"
    },
    cooling: {
      image: "/images/pages/car-parts/categories/car-cooling-system.webp",
      alt: "Radiator, cooling fan and water pump on white background"
    },
    transmission: {
      image: "/images/pages/car-parts/categories/car-transmission-parts.webp",
      alt: "Passenger car transmission gearbox on white background"
    },
    "body-parts": {
      image: "/images/pages/car-parts/categories/car-body-parts.webp",
      alt: "Car hood, fender and headlight on white background"
    }
  };

  const getCategoryVisual = (category) => {
    const carVisual = pageType === "car" ? carCategoryVisuals[category.slug] : null;

    return {
      image: carVisual?.image ?? category.image,
      alt: carVisual?.alt ?? `${category.name} placeholder`,
      isProductPhoto: Boolean(carVisual)
    };
  };
  const carBrandOrder = ["Toyota", "Honda", "Perodua", "Nissan", "Mitsubishi", "Mazda", "Proton", "Ford"];
  const carBrandVisuals = {
    toyota: {
      image: "/images/pages/car-parts/categories/toyota-logo.webp",
      alt: "Toyota logo"
    },
    honda: {
      image: "/images/pages/car-parts/categories/honda-logo.webp",
      alt: "Honda logo"
    },
    perodua: {
      image: "/images/pages/car-parts/categories/perodua-logo.webp",
      alt: "Perodua logo"
    },
    nissan: {
      image: "/images/pages/car-parts/categories/nissan-logo.webp",
      alt: "Nissan logo"
    },
    mitsubishi: {
      image: "/images/pages/car-parts/categories/mitsubishi-logo.webp",
      alt: "Mitsubishi Motors logo"
    },
    mazda: {
      image: "/images/pages/car-parts/categories/mazda-logo.webp",
      alt: "Mazda logo"
    },
    proton: {
      image: "/images/pages/car-parts/categories/proton-logo.webp",
      alt: "Proton logo"
    },
    ford: {
      image: "/images/pages/car-parts/categories/ford-logo.webp",
      alt: "Ford logo"
    }
  };

  const getBrandVisual = (brand) => (pageType === "car" ? carBrandVisuals[catalog.slugify(brand)] : null);

  const getBrandsToRender = () => {
    const brands = catalog.getVehicleBrands(vehicleType);

    if (pageType !== "car") {
      return brands;
    }

    const brandsBySlug = new Map(brands.map((brand) => [catalog.slugify(brand), brand]));
    const orderedBrands = carBrandOrder
      .map((brand) => brandsBySlug.get(catalog.slugify(brand)))
      .filter(Boolean);
    const orderedSlugs = new Set(orderedBrands.map((brand) => catalog.slugify(brand)));
    const remainingBrands = brands.filter((brand) => !orderedSlugs.has(catalog.slugify(brand)));

    return [...orderedBrands, ...remainingBrands];
  };

  const renderCategoryCard = (category, index) => {
    const visual = getCategoryVisual(category);

    return `
      <a class="category-card parts-category-card${visual.isProductPhoto ? " has-product-photo" : ""}" href="${escapeHtml(localUrl(`/${routeBase}/${category.slug}/`))}" aria-label="Explore ${escapeHtml(category.name)}">
        <img src="${escapeHtml(localUrl(visual.image))}" alt="${escapeHtml(visual.alt)}" loading="lazy" decoding="async" />
        <span class="category-shade" aria-hidden="true"></span>
        <span class="category-content">
          <span class="category-code">${categoryCodePrefix} / ${String(index + 1).padStart(2, "0")}</span>
          <strong>${escapeHtml(category.name.toUpperCase())}</strong>
          <span class="category-link">Explore <span aria-hidden="true">→</span></span>
        </span>
        <span class="category-accent" aria-hidden="true"></span>
      </a>
    `;
  };

  const renderBrand = (brand) => {
    const visual = getBrandVisual(brand);

    return `
      <a class="parts-brand-item${visual ? " has-brand-logo" : ""}" href="${escapeHtml(localUrl(`/brands/${catalog.slugify(brand)}/`))}" aria-label="View AXRIVO parts for ${escapeHtml(brand)}">
        ${
          visual
            ? `<img src="${escapeHtml(localUrl(visual.image))}" alt="${escapeHtml(visual.alt)}" loading="lazy" decoding="async" />`
            : escapeHtml(brand)
        }
      </a>
    `;
  };

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
    document.querySelector('meta[property="og:image"]')?.setAttribute("content", helpers?.absoluteUrl(heroImagePath) ?? heroImagePath);
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
          about: pageLabel,
          image: helpers?.absoluteUrl(heroImagePath) ?? heroImagePath,
          primaryImageOfPage: {
            "@type": "ImageObject",
            url: helpers?.absoluteUrl(heroImagePath) ?? heroImagePath,
            caption: heroImageAlt
          }
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

    brandList.innerHTML = getBrandsToRender().map(renderBrand).join("");
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
