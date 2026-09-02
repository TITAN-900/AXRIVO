(function () {
  const catalog = window.AXRIVO_CATALOG;
  const helpers = window.AXRIVO_CONFIG_HELPERS;
  const siteConfig = window.AXRIVO_SITE_CONFIG;
  const ui = window.AXRIVO_UI;

  if (!ui) {
    return;
  }

  const escapeHtml = ui.escapeHtml;
  let modal;
  let lastProduct;

  const productApplication = (product) =>
    product ? [...(product.vehicleBrands ?? []), ...(product.vehicleModels ?? [])].filter(Boolean).join(" / ") : "";

  const productOem = (product) => (product?.oemNumbers?.length ? product.oemNumbers.join(" / ") : "");

  const productUrl = (product) => {
    if (!product || !catalog) {
      return window.location.href;
    }

    return helpers?.absoluteUrl(catalog.productUrl(product)) ?? catalog.productUrl(product);
  };

  const getProductFromTrigger = (trigger) => {
    const id = trigger?.dataset?.productId;
    return id && catalog ? catalog.getProductById(id) : null;
  };

  const buildWhatsAppProductMessage = (product) => `Hello AXRIVO,

I would like to enquire about this part:

Product: ${product?.name ?? ""}
Part Number: ${product?.partNumber ?? ""}
OEM: ${productOem(product)}
Vehicle: ${productApplication(product)}
Engine: ${(product?.engineModels ?? []).join(" / ")}
Product URL: ${productUrl(product)}

Please provide more information.`;

  const buildGenericWhatsAppMessage = () => "Hello AXRIVO, I am looking for a vehicle part.";

  const setStatus = (message, tone = "neutral") => {
    const status = modal?.querySelector("[data-enquiry-status]");

    if (!status) {
      return;
    }

    status.textContent = message;
    status.dataset.tone = tone;
  };

  const ensureModal = () => {
    if (modal) {
      return modal;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "enquiry-modal";
    wrapper.setAttribute("role", "dialog");
    wrapper.setAttribute("aria-modal", "true");
    wrapper.setAttribute("aria-labelledby", "enquiry-title");
    wrapper.setAttribute("hidden", "");
    wrapper.innerHTML = `
      <div class="enquiry-backdrop" data-enquiry-close></div>
      <div class="enquiry-panel">
        <button class="enquiry-close" type="button" aria-label="Close enquiry" data-enquiry-close>×</button>
        <p class="commerce-kicker"><span>//</span> Direct Enquiry</p>
        <h2 id="enquiry-title">ENQUIRE THIS PART</h2>
        <form class="enquiry-form" action="#" data-enquiry-form>
          <div class="enquiry-product-summary" data-enquiry-product-summary hidden></div>
          <label>
            <span>Your Name</span>
            <input name="name" autocomplete="name" placeholder="Your name" />
          </label>
          <label>
            <span>Company</span>
            <input name="company" autocomplete="organization" placeholder="Company name" />
          </label>
          <label>
            <span>Phone / WhatsApp</span>
            <input name="phone" autocomplete="tel" placeholder="Phone or WhatsApp number" />
          </label>
          <label>
            <span>Email</span>
            <input name="email" autocomplete="email" placeholder="Email address" />
          </label>
          <label>
            <span>Vehicle</span>
            <input name="vehicle" placeholder="Vehicle brand / model / year" />
          </label>
          <label>
            <span>Engine</span>
            <input name="engine" placeholder="Engine model" />
          </label>
          <label>
            <span>Part Number / OEM</span>
            <input name="partNumber" placeholder="Part number or OEM number" />
          </label>
          <label class="enquiry-message">
            <span>Message</span>
            <textarea name="message" rows="4" placeholder="Tell us what part you need. You can include OEM number, vehicle details or photo notes."></textarea>
          </label>
          <p class="enquiry-status" data-enquiry-status></p>
          <div class="enquiry-actions">
            <button class="button button-primary" type="submit">
              <span>SEND ENQUIRY</span>
              <span class="button-arrow" aria-hidden="true">→</span>
            </button>
            <button class="button button-secondary" type="button" data-enquiry-close>
              <span>CANCEL</span>
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.append(wrapper);
    modal = wrapper;

    modal.addEventListener("click", (event) => {
      if (event.target.closest("[data-enquiry-close]")) {
        closeModal();
      }
    });

    modal.querySelector("[data-enquiry-form]")?.addEventListener("submit", (event) => {
      event.preventDefault();
      setStatus(
        "This is a UI placeholder. Connect this form to your enquiry inbox, CRM or backend when AXRIVO is ready for live enquiries.",
        "success"
      );
    });

    return modal;
  };

  const fillModal = (product) => {
    const form = modal.querySelector("[data-enquiry-form]");
    const summary = modal.querySelector("[data-enquiry-product-summary]");

    if (!form || !summary) {
      return;
    }

    form.reset();
    lastProduct = product;

    if (product) {
      summary.hidden = false;
      summary.innerHTML = `
        <strong>${escapeHtml(product.name)}</strong>
        <span>PART NO: ${escapeHtml(product.partNumber)}</span>
        ${productOem(product) ? `<span>OEM: ${escapeHtml(productOem(product))}</span>` : ""}
      `;

      form.elements.partNumber.value = `${product.partNumber}${productOem(product) ? ` / ${productOem(product)}` : ""}`;
      form.elements.vehicle.value = productApplication(product);
      form.elements.engine.value = (product.engineModels ?? []).join(" / ");
      form.elements.message.value = `Product: ${product.name}\nProduct URL: ${productUrl(product)}`;
    } else {
      summary.hidden = true;
      summary.innerHTML = "";
      form.elements.message.value = `Page URL: ${window.location.href}`;
    }

    setStatus("");
  };

  const openModal = (product) => {
    ensureModal();
    fillModal(product);
    modal.hidden = false;
    document.body.classList.add("enquiry-open");
    window.setTimeout(() => modal.querySelector("input[name='name']")?.focus(), 40);
  };

  const closeModal = () => {
    if (!modal) {
      return;
    }

    modal.hidden = true;
    document.body.classList.remove("enquiry-open");
  };

  const handleWhatsApp = (event, link, message, product) => {
    const url = helpers?.buildWhatsAppUrl(message) ?? "#";

    if (url === "#") {
      event.preventDefault();
      openModal(product ?? lastProduct ?? null);
      setStatus("WhatsApp number is still a placeholder in site-config.js. The enquiry UI is ready for connection.", "warning");
      return;
    }

    link.href = url;
  };

  document.addEventListener("click", (event) => {
    const enquiryTrigger = event.target.closest("[data-enquiry-trigger]");
    const productWhatsApp = event.target.closest("[data-whatsapp-product]");
    const genericWhatsApp = event.target.closest("[data-whatsapp-generic]");

    if (enquiryTrigger) {
      event.preventDefault();
      openModal(getProductFromTrigger(enquiryTrigger));
      return;
    }

    if (productWhatsApp) {
      const product = getProductFromTrigger(productWhatsApp);
      handleWhatsApp(event, productWhatsApp, buildWhatsAppProductMessage(product), product);
      return;
    }

    if (genericWhatsApp) {
      handleWhatsApp(event, genericWhatsApp, buildGenericWhatsAppMessage(), null);
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  document.querySelectorAll("[data-whatsapp-generic]").forEach((link) => {
    const url = helpers?.buildWhatsAppUrl(buildGenericWhatsAppMessage()) ?? "#";
    link.setAttribute("href", url);

    if (url === "#") {
      link.setAttribute("aria-disabled", "true");
      link.setAttribute("title", "WhatsApp number is not configured yet");
    }
  });

  if (siteConfig && helpers?.isPlaceholderValue(siteConfig.companyWhatsApp)) {
    document.documentElement.classList.add("whatsapp-placeholder");
  }
})();
