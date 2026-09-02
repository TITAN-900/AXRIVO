(function () {
  const catalog = window.AXRIVO_CATALOG;
  const ui = window.AXRIVO_UI;
  const helpers = window.AXRIVO_CONFIG_HELPERS;
  const productDetailRoot = document.querySelector("[data-product-detail-root]");

  if (!productDetailRoot || !catalog || !ui) {
    return;
  }

  const escapeHtml = ui.escapeHtml;
  const localUrl = ui.localUrl;

  const routeParts = (helpers?.currentSitePath() ?? window.location.pathname).split("/").filter(Boolean);
  const [routeBase, productSegment, slug] = routeParts;
  const product = productSegment === "product" ? catalog.getProductByRoute(routeBase, slug) : null;

  const routeLabel = (item) => (item.vehicleType === "HEAVY TRUCK" ? "Heavy Truck Parts" : "Car Parts");
  const routeHref = (item) => (item.vehicleType === "HEAVY TRUCK" ? "/heavy-truck-parts/" : "/car-parts/");
  const oemText = (item) => (item.oemNumbers?.length ? item.oemNumbers.join(" / ") : "");
  const applicationText = (item) => catalog.compact([...(item.vehicleBrands ?? []), ...(item.vehicleModels ?? [])]).join(" / ");

  const ensureMeta = (selector, create) => {
    const existing = document.querySelector(selector);

    if (existing) {
      return existing;
    }

    const element = create();
    document.head.append(element);
    return element;
  };

  const setProductMetadata = (item) => {
    const seo = catalog.buildProductSeo?.(item);
    const title = seo?.title ?? `${item.name} | AXRIVO`;
    const category = catalog.categoryName(item.category);
    const description =
      seo?.description ?? `${item.name} for ${item.vehicleType.toLowerCase()} applications. OEM and part number enquiry template by AXRIVO.`;
    const canonicalPath = seo?.canonicalPath ?? catalog.productUrl(item);
    const canonical = helpers?.absoluteUrl(canonicalPath) ?? canonicalPath;
    const imagePath = seo?.image ?? item.mainImage;
    const image = helpers?.absoluteUrl(imagePath) ?? imagePath;

    document.title = title;
    document.querySelector("[data-product-description]")?.setAttribute("content", description);
    document.querySelector("[data-product-og-title]")?.setAttribute("content", title);
    document.querySelector("[data-product-og-description]")?.setAttribute("content", description);
    ensureMeta('meta[property="og:url"]', () => {
      const meta = document.createElement("meta");
      meta.setAttribute("property", "og:url");
      return meta;
    }).setAttribute("content", canonical);
    ensureMeta('meta[property="og:image"]', () => {
      const meta = document.createElement("meta");
      meta.setAttribute("property", "og:image");
      return meta;
    }).setAttribute("content", image);
    ensureMeta('link[rel="canonical"]', () => {
      const link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      return link;
    }).setAttribute("href", canonical);

    const jsonLd = document.querySelector("[data-product-jsonld]");
    if (jsonLd) {
      jsonLd.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Product",
            "@id": `${canonical}#product`,
            name: item.name,
            brand: {
              "@type": "Brand",
              name: item.brand
            },
            category,
            image,
            sku: item.partNumber,
            mpn: oemText(item),
            description: item.shortDescription,
            additionalProperty: [
              { "@type": "PropertyValue", name: "Vehicle Type", value: item.vehicleType },
              { "@type": "PropertyValue", name: "Application", value: applicationText(item) },
              { "@type": "PropertyValue", name: "Engine Model", value: (item.engineModels ?? []).join(" / ") }
            ].filter((property) => property.value)
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: helpers?.absoluteUrl("/") ?? "/" },
              { "@type": "ListItem", position: 2, name: routeLabel(item), item: helpers?.absoluteUrl(routeHref(item)) ?? routeHref(item) },
              {
                "@type": "ListItem",
                position: 3,
                name: category,
                item: helpers?.absoluteUrl(`${routeHref(item)}${item.category}/`) ?? `${routeHref(item)}${item.category}/`
              },
              { "@type": "ListItem", position: 4, name: item.name, item: canonical }
            ]
          }
        ]
      });
    }
  };

  const setActiveProductNavigation = (item) => {
    const targetHref = routeHref(item);

    document.querySelectorAll(".desktop-nav a, .mobile-nav a").forEach((link) => {
      const isActive = helpers?.isRouteLink(link, targetHref) ?? link.getAttribute("href") === targetHref;
      link.classList.toggle("is-active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const renderBreadcrumb = (item) => `
    <nav class="product-breadcrumb" aria-label="Breadcrumb">
      <a href="${escapeHtml(localUrl("/"))}">Home</a>
      <span aria-hidden="true">/</span>
      <a href="${escapeHtml(localUrl(routeHref(item)))}">${escapeHtml(routeLabel(item))}</a>
      <span aria-hidden="true">/</span>
      <a href="${escapeHtml(localUrl(`${routeHref(item)}${item.category}/`))}">${escapeHtml(catalog.categoryName(item.category))}</a>
      <span aria-hidden="true">/</span>
      <span>${escapeHtml(item.name)}</span>
    </nav>
  `;

  const getGalleryImages = (item) => {
    const images = [item.mainImage, ...(item.images ?? [])];
    const seen = new Set();

    return images
      .filter(Boolean)
      .map((src) => ({
        src: localUrl(src),
        alt: catalog.productImageAlt?.(item, src) || item.imageAlt || `${item.name} product image placeholder`
      }))
      .filter((image) => {
        if (seen.has(image.src)) {
          return false;
        }

        seen.add(image.src);
        return true;
      });
  };

  const renderGallery = (item) => {
    const images = getGalleryImages(item);
    const mainImage = images[0];

    return `
      <section class="product-gallery" aria-label="${escapeHtml(item.name)} image gallery">
        <div class="product-main-image">
          <img
            src="${escapeHtml(mainImage.src)}"
            alt="${escapeHtml(mainImage.alt)}"
            data-product-main-image
            loading="eager"
            decoding="async"
          />
        </div>
        <div class="product-thumbnails" aria-label="Product thumbnails">
          ${images
            .map(
              (image, index) => `
                <button
                  class="product-thumbnail${index === 0 ? " is-active" : ""}"
                  type="button"
                  aria-label="Show product image ${index + 1}"
                  aria-pressed="${index === 0 ? "true" : "false"}"
                  data-gallery-src="${escapeHtml(image.src)}"
                  data-gallery-alt="${escapeHtml(image.alt)}"
                >
                  <img src="${escapeHtml(image.src)}" alt="" loading="lazy" decoding="async" />
                </button>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  };

  const renderDefinitionRows = (rows, className) => `
    <dl class="${className}">
      ${rows
        .filter(([, value]) => (Array.isArray(value) ? value.length : value))
        .map(
          ([label, value]) => `
            <div>
              <dt>${escapeHtml(label)}</dt>
              <dd>${escapeHtml(Array.isArray(value) ? value.join(" / ") : value)}</dd>
            </div>
          `
        )
        .join("")}
    </dl>
  `;

  const renderProductSummary = (item) => `
    <section class="product-summary-panel" aria-labelledby="product-title">
      <p class="commerce-kicker"><span>//</span> ${escapeHtml(routeLabel(item))}</p>
      <h1 id="product-title">${escapeHtml(item.name)}</h1>
      <div class="product-number-row">
        ${oemText(item) ? `<span>OEM: ${escapeHtml(oemText(item))}</span>` : ""}
        <span>PART NO: ${escapeHtml(item.partNumber)}</span>
      </div>
      <div class="product-detail-tags">
        <span>${escapeHtml(item.vehicleType)}</span>
        <span>${escapeHtml(catalog.categoryName(item.category))}</span>
      </div>
      ${renderDefinitionRows(
        [
          ["Vehicle Type", item.vehicleType],
          ["Application", applicationText(item)],
          ["Engine", item.engineModels],
          ["Category", catalog.categoryName(item.category)],
          ["Brand", item.brand]
        ],
        "product-basic-info"
      )}
      <p class="product-short-description">${escapeHtml(item.shortDescription)}</p>
      <div class="product-cta-row" aria-label="Product enquiry actions">
        <button class="button button-primary" type="button" data-enquiry-trigger data-product-id="${escapeHtml(item.id)}">
          <span>ENQUIRE THIS PART</span>
          <span class="button-arrow" aria-hidden="true">→</span>
        </button>
        <a class="button button-secondary" href="#" data-whatsapp-product data-product-id="${escapeHtml(item.id)}">
          <span>WHATSAPP</span>
          <span class="button-arrow" aria-hidden="true">→</span>
        </a>
        <button class="copy-part-button" type="button" data-copy-part="${escapeHtml(item.partNumber)}">
          COPY PART NUMBER
        </button>
      </div>
    </section>
  `;

  const renderSpecifications = (item) => {
    const specs = [
      ["OEM Number", oemText(item)],
      ["Part Number", item.partNumber],
      ["Brand", item.brand],
      ["Category", catalog.categoryName(item.category)],
      ["Vehicle Brand", item.vehicleBrands],
      ["Vehicle Model", item.vehicleModels],
      ["Engine Model", item.engineModels],
      ["Weight", item.weight],
      ["Dimensions", item.dimensions],
      ["Material", item.material],
      ["Position", item.position],
      ["Application", applicationText(item)]
    ];

    return `
      <section class="product-detail-section product-spec-section" aria-labelledby="product-spec-title">
        <div class="container">
          <div class="product-section-heading">
            <p class="commerce-kicker"><span>//</span> Technical Data</p>
            <h2 id="product-spec-title">SPECIFICATIONS</h2>
          </div>
          ${renderDefinitionRows(specs, "spec-grid")}
        </div>
      </section>
    `;
  };

  const renderCompatibility = (item) => `
    <section class="product-detail-section compatibility-section" aria-labelledby="compatibility-title">
      <div class="container">
        <div class="product-section-heading">
          <p class="commerce-kicker"><span>//</span> Fitment</p>
          <h2 id="compatibility-title">VEHICLE COMPATIBILITY</h2>
        </div>
        <div class="compatibility-list">
          ${(item.compatibility ?? [])
            .map((row) => {
              const fields = [
                ["Vehicle Brand", row.vehicleBrand],
                ["Vehicle Model", row.vehicleModel],
                ["Year", row.year],
                ["Engine", row.engine],
                ["Engine Model", row.engineModel],
                ["Notes", row.notes]
              ].filter(([, value]) => value);

              return `
                <article class="compatibility-card">
                  ${fields
                    .map(
                      ([label, value]) => `
                        <div>
                          <span>${escapeHtml(label)}</span>
                          <strong>${escapeHtml(value)}</strong>
                        </div>
                      `
                    )
                    .join("")}
                </article>
              `;
            })
            .join("")}
        </div>
      </div>
    </section>
  `;

  const renderDescription = (item) => {
    const sections = [
      ["OVERVIEW", item.description],
      ["FEATURES", item.features],
      ["APPLICATION", applicationText(item)],
      ["NOTES", "Confirm OEM number, part number, vehicle model and engine code before enquiry."]
    ].filter(([, value]) => (Array.isArray(value) ? value.length : value));

    return `
      <section class="product-detail-section product-description-section" aria-labelledby="product-description-title">
        <div class="container">
          <div class="product-section-heading">
            <p class="commerce-kicker"><span>//</span> Product Information</p>
            <h2 id="product-description-title">PRODUCT DESCRIPTION</h2>
          </div>
          <div class="description-grid">
            ${sections
              .map(
                ([title, value]) => `
                  <article class="description-block">
                    <h3>${escapeHtml(title)}</h3>
                    ${
                      Array.isArray(value)
                        ? `<ul>${value.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>`
                        : `<p>${escapeHtml(value)}</p>`
                    }
                  </article>
                `
              )
              .join("")}
          </div>
        </div>
      </section>
    `;
  };

  const renderRelatedProducts = (item) => `
    <section class="product-detail-section related-parts-section" aria-labelledby="related-parts-title">
      <div class="container">
        <div class="product-section-heading">
          <p class="commerce-kicker"><span>//</span> Related</p>
          <h2 id="related-parts-title">RELATED PARTS</h2>
        </div>
        <div class="product-grid related-products-grid">
          ${catalog.getRelatedProducts(item, 4).map((related) => ui.renderProductCard(related, { className: "related-product-card" })).join("")}
        </div>
      </div>
    </section>
  `;

  const renderProductDetail = (item) => {
    productDetailRoot.innerHTML = `
      <div class="product-detail-top">
        <div class="container">
          ${renderBreadcrumb(item)}
        </div>
      </div>

      <section class="product-detail-hero" data-product-reveal-section>
        <div class="container product-detail-grid">
          <div class="product-page-reveal">
            ${renderGallery(item)}
          </div>
          <div class="product-page-reveal">
            ${renderProductSummary(item)}
          </div>
        </div>
      </section>

      ${renderSpecifications(item)}
      ${renderCompatibility(item)}
      ${renderDescription(item)}
      ${renderRelatedProducts(item)}
    `;
  };

  const bindGallery = () => {
    const mainImage = document.querySelector("[data-product-main-image]");
    const thumbnails = document.querySelectorAll("[data-gallery-src]");

    thumbnails.forEach((thumbnail) => {
      thumbnail.addEventListener("click", () => {
        if (!mainImage) {
          return;
        }

        mainImage.src = thumbnail.dataset.gallerySrc;
        mainImage.alt = thumbnail.dataset.galleryAlt;

        thumbnails.forEach((item) => {
          const isActive = item === thumbnail;
          item.classList.toggle("is-active", isActive);
          item.setAttribute("aria-pressed", String(isActive));
        });
      });
    });
  };

  const copyText = async (value) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-999px";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  };

  const bindCopyButton = () => {
    const button = document.querySelector("[data-copy-part]");

    if (!button) {
      return;
    }

    button.addEventListener("click", async () => {
      const originalLabel = button.textContent;

      try {
        await copyText(button.dataset.copyPart);
        button.textContent = "PART NUMBER COPIED";
      } catch {
        button.textContent = "COPY FAILED";
      }

      window.setTimeout(() => {
        button.textContent = originalLabel;
      }, 1600);
    });
  };

  const revealProductSections = () => {
    const sections = document.querySelectorAll(".product-detail-hero, .product-detail-section, .site-footer");
    const reveal = (section) => section.classList.add("is-visible");

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries, sectionObserver) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              reveal(entry.target);
              sectionObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.14 }
      );

      sections.forEach((section) => observer.observe(section));
    } else {
      sections.forEach(reveal);
    }

    window.requestAnimationFrame(() => {
      document.querySelector(".product-detail-hero")?.classList.add("is-visible");
    });
  };

  const renderMissingProduct = () => {
    const isTruckRoute = routeBase === "heavy-truck-parts";
    productDetailRoot.innerHTML = `
      <section class="product-not-found">
        <div class="container">
          <p class="commerce-kicker"><span>//</span> Product Detail</p>
          <h1>Product Not Found</h1>
          <p>This product detail template is ready for centralized demo products and future imported product data.</p>
          <div class="content-actions">
            <a class="button button-primary" href="${escapeHtml(localUrl(isTruckRoute ? "/heavy-truck-parts/" : "/car-parts/"))}">
              <span>BACK TO ${isTruckRoute ? "TRUCK" : "CAR"} PARTS</span>
              <span class="button-arrow" aria-hidden="true">→</span>
            </a>
            <a class="button button-secondary" href="${escapeHtml(localUrl("/request-part/"))}">
              <span>REQUEST A PART</span>
              <span class="button-arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>
    `;
  };

  if (product) {
    setProductMetadata(product);
    setActiveProductNavigation(product);
    renderProductDetail(product);
    bindGallery();
    bindCopyButton();
    revealProductSections();
  } else {
    renderMissingProduct();
  }
})();
