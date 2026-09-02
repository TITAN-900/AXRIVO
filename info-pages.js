(function () {
  const root = document.querySelector("[data-info-page-root]");
  const inferPageType = () => {
    const firstSegment =
      (window.AXRIVO_CONFIG_HELPERS?.currentSitePath() ?? window.location.pathname).split("/").filter(Boolean)[0] ?? "not-found";
    const map = {
      about: "about",
      contact: "contact",
      "request-part": "request",
      privacy: "privacy",
      terms: "terms",
      cookies: "cookies",
      "404.html": "not-found"
    };

    return map[firstSegment] ?? document.body.dataset.infoPage ?? "not-found";
  };

  const pageType = document.body.dataset.infoPage || inferPageType();
  const siteConfig = window.AXRIVO_SITE_CONFIG;
  const helpers = window.AXRIVO_CONFIG_HELPERS;
  const ui = window.AXRIVO_UI;

  if (!root || !pageType || !siteConfig || !ui) {
    return;
  }

  const escapeHtml = ui.escapeHtml;
  const localUrl = ui.localUrl;

  const pages = {
    about: {
      title: "About AXRIVO",
      eyebrow: "About",
      heading: "BUILT FOR EVERY ROAD.",
      description:
        "AXRIVO is built to make automotive and heavy vehicle parts easier to find, understand and source.",
      canonical: "/about/"
    },
    contact: {
      title: "Contact AXRIVO",
      eyebrow: "Contact",
      heading: "CONTACT AXRIVO",
      description: "Send AXRIVO part numbers, OEM references, vehicle details or product photos.",
      canonical: "/contact/"
    },
    request: {
      title: "Request a Part | AXRIVO",
      eyebrow: "Part Request",
      heading: "SEND US THE PART DETAILS.",
      description: "Use part number, OEM number, vehicle information or a photo to request support.",
      canonical: "/request-part/"
    },
    privacy: {
      title: "Privacy Policy | AXRIVO",
      eyebrow: "Legal",
      heading: "PRIVACY POLICY",
      description: "Placeholder privacy policy page for AXRIVO.",
      canonical: "/privacy/"
    },
    terms: {
      title: "Terms | AXRIVO",
      eyebrow: "Legal",
      heading: "TERMS",
      description: "Placeholder terms page for AXRIVO.",
      canonical: "/terms/"
    },
    cookies: {
      title: "Cookie Policy | AXRIVO",
      eyebrow: "Legal",
      heading: "COOKIE POLICY",
      description: "Placeholder cookie policy page for AXRIVO.",
      canonical: "/cookies/"
    },
    "not-found": {
      title: "Page Not Found | AXRIVO",
      eyebrow: "404",
      heading: "PAGE NOT FOUND.",
      description: "This AXRIVO route is not available yet.",
      canonical: "/404.html"
    }
  };

  const page = pages[pageType] ?? pages["not-found"];

  const configRow = (label, value) => {
    const isPlaceholder = helpers?.isPlaceholderValue(value);
    return `
      <div class="config-row${isPlaceholder ? " is-placeholder" : ""}">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(isPlaceholder ? "To be configured" : value)}</strong>
      </div>
    `;
  };

  const setMeta = () => {
    document.title = page.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", page.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", page.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", page.description);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", helpers?.absoluteUrl(page.canonical) ?? page.canonical);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", helpers?.absoluteUrl(page.canonical) ?? page.canonical);

    const schema = document.querySelector("[data-page-jsonld]");
    if (schema) {
      schema.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: page.title,
        url: helpers?.absoluteUrl(page.canonical) ?? page.canonical,
        description: page.description
      });
    }
  };

  const setActiveNavigation = () => {
    const activeHref =
      pageType === "about" ? "/about/" : pageType === "contact" ? "/contact/" : "";

    if (!activeHref) {
      return;
    }

    document.querySelectorAll(".desktop-nav a, .mobile-nav a").forEach((link) => {
      const isActive = helpers?.isRouteLink(link, activeHref) ?? link.getAttribute("href") === activeHref;
      link.classList.toggle("is-active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      }
    });
  };

  const renderHero = () => `
    <section class="content-hero">
      <div class="container">
        <nav class="product-breadcrumb" aria-label="Breadcrumb">
          <a href="${escapeHtml(localUrl("/"))}">Home</a>
          <span aria-hidden="true">/</span>
          <span>${escapeHtml(page.title.replace(" | AXRIVO", ""))}</span>
        </nav>
        <div class="content-hero-copy">
          <p class="commerce-kicker"><span>//</span> ${escapeHtml(page.eyebrow)}</p>
          <h1>${escapeHtml(page.heading)}</h1>
          <p>${escapeHtml(page.description)}</p>
        </div>
      </div>
    </section>
  `;

  const renderAbout = () => `
    ${renderHero()}
    <section class="content-section">
      <div class="container content-split">
        <figure class="content-media">
          <img src="${escapeHtml(localUrl("/assets/about/axrivo-brand-story.svg"))}" alt="AXRIVO spare parts and warehouse placeholder" loading="lazy" decoding="async" />
        </figure>
        <div class="content-copy">
          <p class="commerce-kicker"><span>//</span> AXRIVO Platform</p>
          <h2>A CLEANER WAY TO SOURCE PARTS.</h2>
          <p>
            From passenger vehicles to heavy trucks, AXRIVO keeps product information, vehicle compatibility and direct enquiry in one simple experience.
          </p>
          <p>
            This page is ready for real company story content later. Current copy intentionally avoids fake history, fake certifications or fake operational claims.
          </p>
          <div class="brand-summary-grid">
            <div><span>Vehicle Worlds</span><strong>Car / Heavy Truck</strong></div>
            <div><span>Product Flow</span><strong>Search / Filter / Enquire</strong></div>
            <div><span>Data Ready</span><strong>OEM / Engine / Fitment</strong></div>
          </div>
        </div>
      </div>
    </section>
    <section class="content-section about-why-section">
      <div class="container">
        <div class="parts-section-header">
          <p class="commerce-kicker"><span>//</span> AXRIVO Advantage</p>
          <div>
            <h2>WHY AXRIVO</h2>
            <p>Focused support for automotive and heavy vehicle part enquiries.</p>
          </div>
        </div>
        <div class="why-grid">
          <article class="why-item">
            <span class="why-number">01</span>
            <span class="why-slash" aria-hidden="true"></span>
            <h3>PRECISE FITMENT</h3>
            <p>Parts selected for the right vehicle application.</p>
          </article>
          <article class="why-item">
            <span class="why-number">02</span>
            <span class="why-slash" aria-hidden="true"></span>
            <h3>CAR &amp; HEAVY TRUCK</h3>
            <p>One platform for passenger and heavy vehicle parts.</p>
          </article>
          <article class="why-item">
            <span class="why-number">03</span>
            <span class="why-slash" aria-hidden="true"></span>
            <h3>RELIABLE SOURCING</h3>
            <p>Built around consistent product information and supply.</p>
          </article>
          <article class="why-item">
            <span class="why-number">04</span>
            <span class="why-slash" aria-hidden="true"></span>
            <h3>FAST ENQUIRY</h3>
            <p>Send your part number, OEM number or photo directly to us.</p>
          </article>
        </div>
      </div>
    </section>
  `;

  const contactForm = (id) => `
    <form class="request-form" action="#" data-ui-placeholder-form>
      <label>
        <span>Name</span>
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
        <span>Part Number / OEM</span>
        <input name="partNumber" placeholder="Part number, OEM number or product name" />
      </label>
      <label>
        <span>Vehicle / Engine</span>
        <input name="vehicle" placeholder="Vehicle brand, model, year or engine code" />
      </label>
      <label class="request-form-wide">
        <span>Message</span>
        <textarea name="message" rows="5" placeholder="Tell us what part you need."></textarea>
      </label>
      ${id === "request" ? `<label class="request-form-wide file-placeholder">
        <span>Photo Upload Placeholder</span>
        <input type="file" name="photo" accept="image/*" />
      </label>` : ""}
      <p class="form-status" data-form-status></p>
      <button class="button button-primary" type="submit">
        <span>${id === "request" ? "SEND PART REQUEST" : "SEND MESSAGE"}</span>
        <span class="button-arrow" aria-hidden="true">→</span>
      </button>
    </form>
  `;

  const renderContact = () => `
    ${renderHero()}
    <section class="content-section">
      <div class="container catalog-layout">
        <aside class="catalog-filter-panel">
          <p class="commerce-kicker"><span>//</span> Contact Config</p>
          <h2>COMPANY DETAILS</h2>
          <div class="brand-summary-grid">
            ${configRow("Phone", siteConfig.phone)}
            ${configRow("WhatsApp", siteConfig.companyWhatsApp)}
            ${configRow("Email", siteConfig.email)}
            ${configRow("Address", siteConfig.address)}
            ${configRow("Business Hours", siteConfig.businessHours)}
          </div>
          <div class="content-actions">
            <a class="button button-secondary" href="#" data-whatsapp-generic>
              <span>WHATSAPP US</span>
              <span class="button-arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </aside>
        <div class="catalog-results">
          <p class="commerce-kicker"><span>//</span> Enquiry Form</p>
          <h2>SEND AN ENQUIRY</h2>
          ${contactForm("contact")}
        </div>
      </div>
    </section>
  `;

  const renderRequest = () => `
    ${renderHero()}
    <section class="content-section">
      <div class="container catalog-layout">
        <aside class="catalog-filter-panel">
          <p class="commerce-kicker"><span>//</span> What Helps</p>
          <h2>PART DETAILS</h2>
          <div class="related-category-list">
            <span>Useful Information</span>
            <a href="${escapeHtml(localUrl("/search/?q=E13C"))}">Engine code</a>
            <a href="${escapeHtml(localUrl("/search/?q=898123456"))}">OEM number</a>
            <a href="${escapeHtml(localUrl("/search/?q=brake%20drum"))}">Product name</a>
            <a href="${escapeHtml(localUrl("/search/?q=Toyota%20Vios"))}">Vehicle model</a>
          </div>
        </aside>
        <div class="catalog-results">
          <p class="commerce-kicker"><span>//</span> Photo / OEM Request</p>
          <h2>REQUEST A PART</h2>
          ${contactForm("request")}
        </div>
      </div>
    </section>
  `;

  const renderLegal = () => `
    ${renderHero()}
    <section class="content-section legal-page">
      <div class="container">
        <p class="commerce-kicker"><span>//</span> Placeholder</p>
        <h2>REPLACE BEFORE LAUNCH</h2>
        <p>
          This is a placeholder legal page. AXRIVO should replace it with approved legal content before publishing the website on a real domain.
        </p>
        <p>
          No privacy policy, terms, cookie notice or compliance statement should be treated as final until reviewed by the business and legal advisor.
        </p>
      </div>
    </section>
  `;

  const renderNotFound = () => `
    ${renderHero()}
    <section class="content-section">
      <div class="container empty-state">
        <p>Try searching for the part, or go back to the main AXRIVO product worlds.</p>
        <div class="content-actions">
          <a class="button button-primary" href="${escapeHtml(localUrl("/search/"))}">
            <span>SEARCH PARTS</span>
            <span class="button-arrow" aria-hidden="true">→</span>
          </a>
          <a class="button button-secondary" href="${escapeHtml(localUrl("/"))}">
            <span>BACK HOME</span>
            <span class="button-arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  `;

  const render = () => {
    setMeta();
    setActiveNavigation();

    if (pageType === "about") {
      root.innerHTML = renderAbout();
    } else if (pageType === "contact") {
      root.innerHTML = renderContact();
    } else if (pageType === "request") {
      root.innerHTML = renderRequest();
    } else if (["privacy", "terms", "cookies"].includes(pageType)) {
      root.innerHTML = renderLegal();
    } else {
      root.innerHTML = renderNotFound();
    }

    root.querySelectorAll("[data-ui-placeholder-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const status = form.querySelector("[data-form-status]");

        if (status) {
          status.textContent = "This form is a UI placeholder. Connect it to AXRIVO's backend, inbox or CRM before launch.";
        }
      });
    });
  };

  render();
})();
