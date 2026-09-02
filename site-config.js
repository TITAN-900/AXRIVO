(function () {
  const configScriptUrl = document.currentScript?.src || window.location.href;
  const siteRootUrl = new URL("./", configScriptUrl);

  const siteConfig = {
    brandName: "AXRIVO",
    companyName: "AXRIVO",
    domain: "",
    siteUrl: "",
    phone: "PLACEHOLDER_PHONE",
    companyWhatsApp: "PLACEHOLDER_WHATSAPP_NUMBER",
    email: "PLACEHOLDER_EMAIL",
    address: "PLACEHOLDER_BUSINESS_ADDRESS",
    businessHours: "PLACEHOLDER_BUSINESS_HOURS",
    routes: {
      home: "/",
      carParts: "/car-parts/",
      truckParts: "/heavy-truck-parts/",
      brands: "/brands/",
      search: "/search/",
      requestPart: "/request-part/",
      about: "/about/",
      contact: "/contact/"
    },
    assets: {
      logo: "/assets/axrivo-logo-transparent.png",
      defaultProductImage: "/assets/categories/body-others.svg",
      socialImage: "/assets/hero-bridge-background.jpg"
    },
    whatsappMessages: {
      generic: "Hello AXRIVO, I am looking for a vehicle part."
    },
    socialLinks: [],
    analytics: {
      googleAnalyticsId: "",
      googleTagManagerId: "",
      googleSearchConsoleVerification: "",
      metaPixelId: ""
    },
    seo: {
      defaultTitle: "AXRIVO | Automotive & Heavy Vehicle Parts",
      defaultDescription:
        "AXRIVO supplies passenger car parts and heavy truck parts through clear product information, compatibility and direct enquiry.",
      twitterCard: "summary_large_image",
      robots: "index,follow"
    }
  };

  const isPlaceholderValue = (value) => !value || String(value).startsWith("PLACEHOLDER_");

  const cleanSiteUrl = () => {
    const configuredSiteUrl = String(siteConfig.siteUrl || "").trim();

    if (configuredSiteUrl && !isPlaceholderValue(configuredSiteUrl)) {
      return configuredSiteUrl.replace(/\/+$/, "");
    }

    if (/^https?:$/.test(window.location.protocol) && window.location.origin) {
      return window.location.origin.replace(/\/+$/, "");
    }

    return "http://localhost:4173";
  };

  const splitUrlParts = (value) => {
    const source = String(value ?? "");
    const hashIndex = source.indexOf("#");
    const hash = hashIndex >= 0 ? source.slice(hashIndex) : "";
    const withoutHash = hashIndex >= 0 ? source.slice(0, hashIndex) : source;
    const queryIndex = withoutHash.indexOf("?");
    const query = queryIndex >= 0 ? withoutHash.slice(queryIndex) : "";
    const pathname = queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash;

    return { pathname, query, hash };
  };

  const isExternalUrl = (value) =>
    /^(?:[a-z][a-z0-9+.-]*:|#|mailto:|tel:|javascript:)/i.test(String(value ?? ""));

  const routeToFilePath = (path = "/") => {
    const value = String(path ?? "/");

    if (isExternalUrl(value)) {
      return value;
    }

    if (!value.startsWith("/")) {
      return value;
    }

    const { pathname, query, hash } = splitUrlParts(value);
    const trimmed = pathname.replace(/^\/+/, "");
    const filePath = !trimmed
      ? "index.html"
      : pathname.endsWith("/")
        ? `${trimmed.replace(/\/+$/, "")}/index.html`
        : trimmed;

    return `${filePath}${query}${hash}`;
  };

  const filePathToRoute = (filePath = "") => {
    const { pathname, query, hash } = splitUrlParts(String(filePath).replace(/\\/g, "/").replace(/^\/+/, ""));

    if (!pathname || pathname === "index.html") {
      return `/${query}${hash}`;
    }

    const routePath = pathname.endsWith("/index.html")
      ? `${pathname.slice(0, -"index.html".length)}`
      : pathname;

    return `/${routePath}${query}${hash}`;
  };

  const currentSitePath = () => {
    const currentHref = window.location.href.split("#")[0].split("?")[0];
    const rootHref = siteRootUrl.href;
    let relativePath = "";

    if (currentHref.startsWith(rootHref)) {
      relativePath = currentHref.slice(rootHref.length);
    } else {
      const decodedPath = decodeURIComponent(window.location.pathname).replace(/\\/g, "/");
      const marker = "/outputs/axrivo-site/";
      const markerIndex = decodedPath.toLowerCase().lastIndexOf(marker);
      relativePath = markerIndex >= 0 ? decodedPath.slice(markerIndex + marker.length) : decodedPath.replace(/^\/+/, "");
    }

    return filePathToRoute(relativePath);
  };

  const relativeFromCurrentPage = (targetPath) => {
    const targetFile = routeToFilePath(targetPath);

    if (isExternalUrl(targetFile) || !String(targetFile).startsWith("/") && !String(targetPath).startsWith("/")) {
      return targetFile;
    }

    const { pathname: targetPathname, query, hash } = splitUrlParts(targetFile);
    const currentFilePath = routeToFilePath(currentSitePath());
    const currentPathname = splitUrlParts(currentFilePath).pathname || "index.html";
    const currentSegments = currentPathname.split("/").filter(Boolean);
    const targetSegments = targetPathname.split("/").filter(Boolean);
    const currentDirs = currentSegments.slice(0, -1);
    let shared = 0;

    while (shared < currentDirs.length && shared < targetSegments.length && currentDirs[shared] === targetSegments[shared]) {
      shared += 1;
    }

    const ups = currentDirs.slice(shared).map(() => "..");
    const downs = targetSegments.slice(shared);
    let relativePath = [...ups, ...downs].join("/");

    if (!relativePath) {
      relativePath = currentSegments.at(-1) || "index.html";
    }

    if (!relativePath.startsWith(".")) {
      relativePath = `./${relativePath}`;
    }

    return `${relativePath}${query}${hash}`;
  };

  const hostedUrl = (targetPath) => {
    const value = String(targetPath ?? "/");

    if (isExternalUrl(value)) {
      return value;
    }

    if (!value.startsWith("/")) {
      return value;
    }

    const { pathname, query, hash } = splitUrlParts(value);
    const cleanPath = pathname.endsWith("index.html") ? filePathToRoute(pathname) : pathname;

    return `${cleanPath}${query}${hash}`;
  };

  const localUrl = (targetPath) => (window.location.protocol === "file:" ? relativeFromCurrentPage(targetPath) : hostedUrl(targetPath));

  const sitePathFromUrl = (href) => {
    try {
      const url = new URL(href, window.location.href);
      const cleanHref = url.href.split("#")[0].split("?")[0];
      const rootHref = siteRootUrl.href;

      if (cleanHref.startsWith(rootHref)) {
        const relativePath = cleanHref.slice(rootHref.length);
        return filePathToRoute(`${relativePath}${url.search}${url.hash}`);
      }

      return filePathToRoute(`${url.pathname}${url.search}${url.hash}`);
    } catch {
      return String(href ?? "");
    }
  };

  const isRouteLink = (link, routePath) => sitePathFromUrl(link.href) === filePathToRoute(routeToFilePath(routePath));

  const absoluteUrl = (path = "/") => {
    try {
      return new URL(path, `${cleanSiteUrl()}/`).href;
    } catch {
      return `${cleanSiteUrl()}${String(path).startsWith("/") ? "" : "/"}${path}`;
    }
  };

  const normalizeWhatsAppNumber = (number) => {
    if (isPlaceholderValue(number)) {
      return "";
    }

    return String(number).replace(/[^\d]/g, "");
  };

  const buildWhatsAppUrl = (message) => {
    const number = normalizeWhatsAppNumber(siteConfig.companyWhatsApp);

    if (!number) {
      return "#";
    }

    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  };

  window.AXRIVO_SITE_CONFIG = siteConfig;
  window.AXRIVO_CONFIG_HELPERS = {
    absoluteUrl,
    buildWhatsAppUrl,
    cleanSiteUrl,
    currentSitePath,
    isPlaceholderValue,
    isRouteLink,
    localUrl,
    routeToFilePath,
    sitePathFromUrl
  };
})();
