document.documentElement.classList.add("js-ready");

const catalog = window.AXRIVO_CATALOG;
const siteConfig = window.AXRIVO_SITE_CONFIG;
const configHelpers = window.AXRIVO_CONFIG_HELPERS;

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileNav = document.querySelector("[data-mobile-nav]");
let mobileLinks = document.querySelectorAll(".mobile-nav a");
const finderSection = document.querySelector("[data-finder-section]");
const partSearchForm = document.querySelector("[data-part-search]");
const vehicleTabs = document.querySelectorAll("[data-vehicle-tab]");
const vehiclePanels = document.querySelectorAll("[data-vehicle-panel]");
const finderSubmit = document.querySelector(".finder-submit");
const productGrid = document.querySelector("[data-product-grid]");
const productTabs = document.querySelectorAll("[data-product-tab]");
const brandTrack = document.querySelector("[data-brand-track]");
const scrollRevealSections = document.querySelectorAll("[data-scroll-section]");
const newsletterForm = document.querySelector("[data-newsletter-form]");
const searchButtons = document.querySelectorAll(".icon-button[aria-label='Search']");
const siteConfigFields = document.querySelectorAll("[data-config-field]");

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const localUrl = (path) => configHelpers?.localUrl(path) ?? path;

const isNonRouteHref = (href) => /^(?:[a-z][a-z0-9+.-]*:|#|mailto:|tel:|javascript:)/i.test(String(href ?? ""));

const upgradeHostedLinks = () => {
  if (window.location.protocol === "file:" || !configHelpers) {
    return;
  }

  document.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");

    if (!href || isNonRouteHref(href)) {
      return;
    }

    const routePath = configHelpers.sitePathFromUrl(link.href);

    if (routePath.startsWith("/")) {
      link.setAttribute("href", localUrl(routePath));
    }
  });
};

const getActiveNavRoute = () => {
  const currentPath = (configHelpers?.currentSitePath?.() ?? window.location.pathname).split("?")[0].split("#")[0];

  if (currentPath === "/" || currentPath === "/index.html") return "/";
  if (currentPath.startsWith("/car-parts/")) return "/car-parts/";
  if (currentPath.startsWith("/heavy-truck-parts/")) return "/heavy-truck-parts/";
  if (currentPath.startsWith("/brands/")) return "/brands/";
  if (currentPath.startsWith("/about/")) return "/about/";
  if (currentPath.startsWith("/contact/")) return "/contact/";

  return "";
};

const syncActiveNavigation = () => {
  const activeRoute = getActiveNavRoute();

  document.querySelectorAll(".desktop-nav a, .mobile-nav a").forEach((link) => {
    const isActive = Boolean(activeRoute) && (configHelpers?.isRouteLink(link, activeRoute) ?? link.getAttribute("href") === activeRoute);
    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

const ensureHomeNavigation = () => {
  document.querySelectorAll(".desktop-nav, .mobile-nav").forEach((nav) => {
    const hasHome = [...nav.querySelectorAll("a")].some((link) => link.textContent.trim().toUpperCase() === "HOME");

    if (hasHome) {
      return;
    }

    const homeLink = document.createElement("a");
    homeLink.href = localUrl("/");
    homeLink.textContent = "HOME";
    nav.prepend(homeLink);
  });

  mobileLinks = document.querySelectorAll(".mobile-nav a");
  syncActiveNavigation();
};

const getVehicleTypeFromTab = (tabValue) => (tabValue === "truck" ? "HEAVY TRUCK" : "CAR");

const buildSearchUrl = (params) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      query.set(key, value);
    }
  });

  const queryString = query.toString();
  return localUrl(`/search/${queryString ? `?${queryString}` : ""}`);
};

const renderProductCard = (product, options = {}) => {
  const categoryName = catalog?.categoryName(product.category) ?? product.category;
  const href = localUrl(options.href ?? catalog?.productUrl(product) ?? product.href ?? "#");
  const image = localUrl(product.mainImage ?? product.image ?? "/assets/categories/body-others.svg");
  const imageAlt = product.imageAlt ?? `${product.name} product placeholder`;
  const oemText = product.oemNumbers?.length ? product.oemNumbers.join(" / ") : product.oemNumber ?? product.oem ?? "";
  const vehicleText = product.vehicleType === "HEAVY TRUCK" ? "TRUCK" : "CAR";
  const secondaryMeta =
    options.secondaryMeta ??
    (product.vehicleType === "HEAVY TRUCK"
      ? `Engine: ${(product.engineModels ?? []).join(" / ")}`
      : `Application: ${product.vehicleBrand ?? ""} ${(product.vehicleModels ?? []).join(" / ")}`.trim());

  return `
    <a class="product-card${options.className ? ` ${escapeHtml(options.className)}` : ""}" href="${escapeHtml(href)}" aria-label="View details for ${escapeHtml(product.name)}">
      <span class="product-media">
        <img src="${escapeHtml(image)}" alt="${escapeHtml(imageAlt)}" loading="lazy" decoding="async" />
        <span class="product-type">${escapeHtml(vehicleText)}</span>
      </span>
      <span class="product-info">
        <h3>${escapeHtml(product.name)}</h3>
        <span class="product-meta">
          <span>OEM / Part Number: ${escapeHtml(oemText)} / ${escapeHtml(product.partNumber ?? product.sku ?? "")}</span>
          ${categoryName ? `<span>Category: ${escapeHtml(categoryName)}</span>` : ""}
          ${secondaryMeta ? `<span>${escapeHtml(secondaryMeta)}</span>` : ""}
        </span>
        <span class="product-link">View Details <span aria-hidden="true">→</span></span>
      </span>
    </a>
  `;
};

const renderSelectOptions = (items, selected, placeholder) => `
  <option value="">${escapeHtml(placeholder)}</option>
  ${items
    .map((item) => `<option value="${escapeHtml(item)}"${item === selected ? " selected" : ""}>${escapeHtml(item)}</option>`)
    .join("")}
`;

const renderFinderSelect = ({ label, field, placeholder, options, selected, disabled }) => `
  <label class="finder-select finder-select-native${disabled ? " is-disabled" : ""}">
    <span class="finder-select-label">${escapeHtml(label)}</span>
    <select data-finder-field="${escapeHtml(field)}" aria-label="${escapeHtml(label)}"${disabled ? " disabled" : ""}>
      ${renderSelectOptions(options, selected, placeholder)}
    </select>
    <span class="finder-select-mark" aria-hidden="true"></span>
  </label>
`;

const renderSiteConfigFields = () => {
  if (!siteConfigFields.length || !siteConfig) {
    return;
  }

  siteConfigFields.forEach((field) => {
    const key = field.dataset.configField;
    const value = siteConfig[key];
    field.textContent = value || `PLACEHOLDER_${String(key ?? "VALUE").toUpperCase()}`;
  });
};

const setupVehicleFinder = ({ container, vehicleType, includeYear = true, submitControl }) => {
  if (!container || !catalog) {
    return null;
  }

  const state = {
    vehicleBrand: "",
    vehicleModel: "",
    year: "",
    engineModel: ""
  };

  const render = () => {
    const options = catalog.getVehicleOptions(vehicleType, state);
    const isTruck = vehicleType === "HEAVY TRUCK";
    const selects = [
      renderFinderSelect({
        label: isTruck ? "TRUCK BRAND" : "BRAND",
        field: "vehicleBrand",
        placeholder: isTruck ? "Select Truck Brand" : "Select Brand",
        options: options.brands,
        selected: state.vehicleBrand
      }),
      renderFinderSelect({
        label: "MODEL",
        field: "vehicleModel",
        placeholder: "Select Model",
        options: options.models,
        selected: state.vehicleModel,
        disabled: !state.vehicleBrand
      })
    ];

    if (includeYear) {
      selects.push(
        renderFinderSelect({
          label: "YEAR",
          field: "year",
          placeholder: "Select Year",
          options: options.years,
          selected: state.year,
          disabled: !state.vehicleModel
        })
      );
    }

    selects.push(
      renderFinderSelect({
        label: "ENGINE",
        field: "engineModel",
        placeholder: "Select Engine",
        options: options.engines,
        selected: state.engineModel,
        disabled: includeYear ? !state.year : !state.vehicleModel
      })
    );

    container.innerHTML = selects.join("");
  };

  const submit = () => {
    window.location.href = buildSearchUrl({
      vehicleType,
      vehicleBrand: state.vehicleBrand,
      vehicleModel: state.vehicleModel,
      year: state.year,
      engineModel: state.engineModel
    });
  };

  container.addEventListener("change", (event) => {
    const field = event.target?.dataset?.finderField;

    if (!field) {
      return;
    }

    state[field] = event.target.value;

    if (field === "vehicleBrand") {
      state.vehicleModel = "";
      state.year = "";
      state.engineModel = "";
    }

    if (field === "vehicleModel") {
      state.year = "";
      state.engineModel = "";
    }

    if (field === "year") {
      state.engineModel = "";
    }

    render();
  });

  if (submitControl) {
    submitControl.addEventListener("click", (event) => {
      event.preventDefault();
      submit();
    });
  }

  render();

  return {
    state,
    submit
  };
};

const syncHeader = () => {
  if (header) {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
};

const setMenuOpen = (isOpen) => {
  if (!header || !mobileNav || !menuToggle) {
    return;
  }

  document.body.classList.toggle("menu-open", isOpen);
  header.classList.toggle("menu-is-open", isOpen);
  mobileNav.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
};

window.addEventListener("scroll", syncHeader, { passive: true });
syncHeader();
ensureHomeNavigation();
upgradeHostedLinks();
window.setTimeout(syncActiveNavigation, 0);
window.addEventListener("pageshow", syncActiveNavigation);

if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", () => {
    setMenuOpen(!mobileNav.classList.contains("is-open"));
  });
}

mobileLinks.forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenuOpen(false);
  }
});

if (partSearchForm) {
  partSearchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = partSearchForm.querySelector("input[type='search']")?.value.trim() ?? "";
    window.location.href = buildSearchUrl({ q: query });
  });
}

if (newsletterForm) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
  });
}

searchButtons.forEach((button) => {
  button.addEventListener("click", () => {
    window.location.href = localUrl("/search/");
  });
});

const homepageFinders = {};

const setVehicleType = (type) => {
  vehicleTabs.forEach((tab) => {
    const isActive = tab.dataset.vehicleTab === type;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  vehiclePanels.forEach((panel) => {
    const isActive = panel.dataset.vehiclePanel === type;
    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
  });
};

vehiclePanels.forEach((panel) => {
  const type = panel.dataset.vehiclePanel;
  const vehicleType = getVehicleTypeFromTab(type);

  homepageFinders[type] = setupVehicleFinder({
    container: panel,
    vehicleType,
    includeYear: vehicleType === "CAR"
  });
});

vehicleTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setVehicleType(tab.dataset.vehicleTab);
  });
});

if (finderSubmit) {
  finderSubmit.addEventListener("click", (event) => {
    event.preventDefault();
    const activeType = document.querySelector("[data-vehicle-tab].is-active")?.dataset.vehicleTab ?? "passenger";
    homepageFinders[activeType]?.submit();
  });
}

const getHomeProducts = (group) => {
  if (!catalog) {
    return [];
  }

  const products = catalog.getProducts();

  if (group === "arrivals") {
    return products.filter((product) => product.newArrival).slice(0, 6);
  }

  return products.filter((product) => product.featured).slice(0, 6);
};

const renderProducts = (group = "featured") => {
  if (!productGrid) {
    return;
  }

  productGrid.classList.add("is-switching");
  productGrid.innerHTML = getHomeProducts(group).map((product) => renderProductCard(product)).join("");

  const activeTab = document.querySelector(`[data-product-tab="${group}"]`);
  if (activeTab) {
    productGrid.setAttribute("aria-labelledby", activeTab.id);
  }

  window.requestAnimationFrame(() => {
    productGrid.classList.remove("is-switching");
  });
};

productTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const group = tab.dataset.productTab;

    productTabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    renderProducts(group);
  });
});

const renderBrands = () => {
  if (!brandTrack || !catalog) {
    return;
  }

  const brands = catalog.getVehicleBrands();
  const brandSet = brands
    .map((brand) => `<a class="brand-item" href="${escapeHtml(localUrl(`/brands/${catalog.slugify(brand)}/`))}">${escapeHtml(brand)}</a>`)
    .join("");
  const duplicateBrandSet = brands
    .map(
      (brand) =>
        `<a class="brand-item" href="${escapeHtml(localUrl(`/brands/${catalog.slugify(brand)}/`))}" aria-hidden="true" tabindex="-1">${escapeHtml(brand)}</a>`
    )
    .join("");

  brandTrack.innerHTML = `${brandSet}${duplicateBrandSet}`;
};

const revealFinderSection = () => {
  if (!finderSection) {
    return;
  }

  const revealFinder = () => finderSection.classList.add("is-visible");

  if ("IntersectionObserver" in window) {
    const finderObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealFinder();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.22 }
    );

    finderObserver.observe(finderSection);
  } else {
    revealFinder();
  }
};

const revealScrollSections = () => {
  if (!scrollRevealSections.length) {
    return;
  }

  const revealSection = (section) => section.classList.add("is-visible");

  if ("IntersectionObserver" in window) {
    const scrollRevealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealSection(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    scrollRevealSections.forEach((section) => scrollRevealObserver.observe(section));
  } else {
    scrollRevealSections.forEach(revealSection);
  }
};

document.addEventListener(
  "error",
  (event) => {
    const target = event.target;

    if (!(target instanceof HTMLImageElement) || target.dataset.fallbackApplied) {
      return;
    }

    target.dataset.fallbackApplied = "true";
    target.classList.add("image-fallback");
    target.src = localUrl("/assets/categories/body-others.svg");
  },
  true
);

window.AXRIVO_UI = {
  buildSearchUrl,
  escapeHtml,
  localUrl,
  renderProductCard,
  setupVehicleFinder
};

renderSiteConfigFields();
renderProducts();
renderBrands();
revealFinderSection();
revealScrollSections();
