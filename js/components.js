/**
 * Lumen Wonder — reusable UI components
 * Pure functions that return HTML strings.
 */

window.LumenComponents = (function () {
  const ICONS = {
    church: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2v3M9 5h6M4 21V10l8-5 8 5v11"/><path d="M9 21v-6h6v6M12 10v1"/></svg>`,
    book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
    map: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    mic: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/></svg>`,
    compass: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/></svg>`,
    globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    search: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
    external: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/></svg>`,
    menu: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`,
    locate: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>`,
    youtube: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.75 15.5v-7l6.5 3.5-6.5 3.5z"/></svg>`,
  };

  function escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getTrustLabel(id) {
    return (
      window.LumenData.trustLabels.find((t) => t.id === id) || {
        id: "independent",
        name: "Independent",
      }
    );
  }

  function getCategory(id) {
    return window.LumenData.categories.find((c) => c.id === id);
  }

  function getRegion(id) {
    return (window.LumenData.regions || []).find((r) => r.id === id);
  }

  /** Site header */
  function SiteHeader(activePage) {
    const links = [
      { href: "index.html", id: "home", label: "Home" },
      { href: "find-mass.html", id: "find-mass", label: "Find Mass" },
      { href: "free-ccd.html", id: "free-ccd", label: "Free CCD" },
      { href: "directory.html", id: "directory", label: "Directory" },
      { href: "suggest.html", id: "suggest", label: "Suggest" },
      { href: "about.html", id: "about", label: "About" },
    ];

    const nav = links
      .map((l) => {
        const current = l.id === activePage ? ' aria-current="page"' : "";
        return `<a href="${l.href}"${current}>${l.label}</a>`;
      })
      .join("");

    return `
      <header class="site-header">
        <div class="container site-header__inner">
          <a class="logo" href="index.html">
            <span class="logo__mark" aria-hidden="true" title="Lumen Wonder">
              <svg class="logo__cross" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
                <rect x="10" y="3" width="4" height="18" rx="1" fill="currentColor"/>
                <rect x="5" y="8" width="14" height="4" rx="1" fill="currentColor"/>
              </svg>
            </span>
            <span class="logo__text">Lumen Wonder</span>
          </a>
          <button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" data-nav-toggle>
            ${ICONS.menu}
          </button>
          <nav class="nav" data-nav aria-label="Main">
            ${nav}
          </nav>
        </div>
      </header>
    `;
  }

  /** Site footer */
  function SiteFooter() {
    const yt = window.LumenData?.site?.youtube || "https://www.youtube.com/@LumenWonder";
    const x = window.LumenData?.site?.x || "https://x.com/LumenWonder";
    return `
      <footer class="site-footer">
        <div class="container">
          <div class="site-footer__grid">
            <div>
              <div class="site-footer__brand">Lumen Wonder</div>
              <p>A curated Catholic resource directory. Find trusted sites, places, and practical guidance — simply.</p>
              <p class="site-footer__social">
                <a href="${escapeHtml(yt)}" target="_blank" rel="noopener noreferrer">YouTube</a>
                <span aria-hidden="true"> · </span>
                <a href="${escapeHtml(x)}" target="_blank" rel="noopener noreferrer">X</a>
              </p>
            </div>
            <div>
              <h4>Explore</h4>
              <ul>
                <li><a href="find-mass.html">Find Mass near you</a></li>
                <li><a href="directory.html">Full directory</a></li>
                <li><a href="free-ccd.html">Free CCD resources</a></li>
                <li><a href="index.html#youtube">Catholic YouTube</a></li>
                <li><a href="directory.html?category=podcasts">Podcasts</a></li>
              </ul>
            </div>
            <div>
              <h4>About</h4>
              <ul>
                <li><a href="about.html">What this is</a></li>
                <li><a href="about.html#trust">Trust labels</a></li>
                <li><a href="suggest.html">Suggest a resource</a></li>
                <li><a href="index.html#featured-family">Featured Family</a></li>
              </ul>
            </div>
          </div>
          <div class="site-footer__bottom">
            Lumen Wonder is not an official voice of the Catholic Church.
            Always consult your parish, diocese, or a priest for pastoral guidance.
          </div>
        </div>
      </footer>
    `;
  }

  /**
   * Free CCD resource table — semantic, AI-friendly structure
   * @param {Array} items
   */
  function FreeCcdTable(items) {
    const rows = (items || [])
      .map(
        (r, i) => `
      <tr id="ccd-resource-${escapeHtml(r.id)}">
        <td>
          <a class="ccd-table__name" href="${escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer">
            ${escapeHtml(r.name)}
          </a>
        </td>
        <td>${escapeHtml(r.country)}</td>
        <td>${escapeHtml(r.description)}</td>
        <td>
          <a class="resource-card__link" href="${escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer">
            Open link ${ICONS.external}
          </a>
        </td>
      </tr>`
      )
      .join("");

    return `
      <div class="ccd-table-wrap">
        <table class="ccd-table" id="free-ccd-resource-list">
          <caption class="sr-only">
            Completely free Catholic CCD and faith formation materials. Columns: website or page name, country, description, and direct link.
          </caption>
          <thead>
            <tr>
              <th scope="col">Website / Page Name</th>
              <th scope="col">Country</th>
              <th scope="col">What is available</th>
              <th scope="col">Direct link</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  }

  /** Modest Featured Family card (home) */
  function FeaturedFamily(family) {
    if (!family) return "";
    const yt = family.youtube || "";
    const x = family.x || "";
    return `
      <aside class="featured-family" aria-labelledby="featured-family-title">
        <p class="featured-family__label">Featured Family</p>
        <h3 id="featured-family-title" class="featured-family__name">${escapeHtml(family.name)}</h3>
        <p class="featured-family__blurb">${escapeHtml(family.blurb)}</p>
        <div class="featured-family__links">
          ${
            yt
              ? `<a class="btn btn--secondary" href="${escapeHtml(yt)}" target="_blank" rel="noopener noreferrer">YouTube</a>`
              : ""
          }
          ${
            x
              ? `<a class="btn btn--ghost" href="${escapeHtml(x)}" target="_blank" rel="noopener noreferrer">Follow on X</a>`
              : ""
          }
        </div>
      </aside>
    `;
  }

  /**
   * Large search bar
   * @param {{ compact?: boolean, value?: string, action?: string, id?: string, placeholder?: string, name?: string }} opts
   */
  function SearchBar(opts = {}) {
    const compact = opts.compact ? " search-bar--compact" : "";
    const value = escapeHtml(opts.value || "");
    const action = opts.action || "directory.html";
    const id = opts.id || "site-search";
    const name = opts.name || "q";
    const placeholder = escapeHtml(
      opts.placeholder || "Search Mass times, CCD, podcasts, shrines…"
    );

    return `
      <div class="search-bar${compact}">
        <form class="search-bar__form" action="${action}" method="get" role="search">
          <span class="search-bar__icon">${ICONS.search}</span>
          <label class="sr-only" for="${id}">Search Catholic resources</label>
          <input
            class="search-bar__input"
            type="search"
            id="${id}"
            name="${name}"
            value="${value}"
            placeholder="${placeholder}"
            autocomplete="off"
          />
          <button class="btn btn--primary${opts.compact ? "" : " btn--lg"}" type="submit">
            Search
          </button>
        </form>
      </div>
    `;
  }

  /** Single category icon card */
  function CategoryCard(category) {
    const icon = ICONS[category.icon] || ICONS.globe;
    const href = category.href
      ? category.href
      : `directory.html?category=${escapeHtml(category.id)}`;
    return `
      <a class="category-card" href="${href}">
        <div class="category-card__icon category-card__icon--${escapeHtml(category.color)}">
          ${icon}
        </div>
        <h3 class="category-card__title">${escapeHtml(category.shortName || category.name)}</h3>
        <p class="category-card__desc">${escapeHtml(category.description)}</p>
        <span class="category-card__arrow">${category.href ? "Open tool →" : "Browse →"}</span>
      </a>
    `;
  }

  /** Grid of categories */
  function CategoryGrid(categories) {
    const sorted = [...categories].sort((a, b) => a.order - b.order);
    return `
      <div class="category-grid">
        ${sorted.map(CategoryCard).join("")}
      </div>
    `;
  }

  /** Trust badge */
  function TrustBadge(trustLabelId) {
    const label = getTrustLabel(trustLabelId);
    return `<span class="trust-badge trust-badge--${escapeHtml(label.id)}">${escapeHtml(label.name)}</span>`;
  }

  /**
   * Resource card
   * @param {object} resource
   * @param {string} [highlightQuery] — when set, matched terms are highlighted
   */
  function ResourceCard(resource, highlightQuery) {
    const highlight =
      highlightQuery && window.LumenSearch?.highlightHtml
        ? (text) => window.LumenSearch.highlightHtml(text, highlightQuery)
        : (text) => escapeHtml(text);

    const cats = (resource.categories || [])
      .map(getCategory)
      .filter(Boolean)
      .slice(0, 2);

    const pills = cats
      .map((c) => `<span class="meta-pill">${escapeHtml(c.shortName || c.name)}</span>`)
      .join("");

    const location = resource.location
      ? `<span class="meta-pill">${escapeHtml(resource.location)}</span>`
      : "";

    const region = getRegion(resource.region);
    const regionPill = region
      ? `<span class="meta-pill">${escapeHtml(region.name)}</span>`
      : "";

    const cost =
      resource.cost && resource.cost !== "free"
        ? `<span class="meta-pill">${escapeHtml(resource.cost === "mixed" ? "Free & paid" : "Paid")}</span>`
        : resource.cost === "free"
          ? `<span class="meta-pill">Free</span>`
          : "";

    const freePill =
      resource._source === "free-ccd" || resource._source === "page"
        ? `<span class="meta-pill meta-pill--gold">Free CCD</span>`
        : "";

    const isInternal = resource._internal || (resource.url && !/^https?:\/\//i.test(resource.url));
    const targetAttrs = isInternal
      ? ""
      : ` target="_blank" rel="noopener noreferrer"`;
    const linkLabel = isInternal ? "Open page" : "Visit site";

    return `
      <article class="resource-card${resource._source === "free-ccd" || resource._source === "page" ? " resource-card--free-ccd" : ""}" data-resource-id="${escapeHtml(resource.id)}">
        <div class="resource-card__top">
          <h3 class="resource-card__name">
            <a href="${escapeHtml(resource.url)}"${targetAttrs}>
              ${highlight(resource.name)}
            </a>
          </h3>
          ${TrustBadge(resource.trustLabel)}
        </div>
        <p class="resource-card__desc">${highlight(resource.description)}</p>
        <div class="resource-card__meta">
          ${freePill}
          ${pills}
          ${location}
          ${regionPill}
          ${cost}
        </div>
        <div class="resource-card__footer">
          <a class="resource-card__link" href="${escapeHtml(resource.url)}"${targetAttrs}>
            ${linkLabel} ${ICONS.external}
          </a>
        </div>
      </article>
    `;
  }

  /** Resource grid + empty state */
  function ResourceGrid(resources, emptyMessage, highlightQuery) {
    if (!resources.length) {
      return `
        <div class="empty-state">
          <h3>No resources found</h3>
          <p>${escapeHtml(emptyMessage || "Try a different search or clear your filters.")}</p>
          <a class="btn btn--secondary" href="directory.html">Clear filters</a>
          <a class="btn btn--ghost" href="free-ccd.html">Browse Free CCD</a>
        </div>
      `;
    }
    return `
      <div class="resource-grid">
        ${resources.map((r) => ResourceCard(r, highlightQuery)).join("")}
      </div>
    `;
  }

  /** Filter bar for directory */
  function FilterBar({
    categories,
    trustLabels,
    regions = [],
    selectedCategory,
    selectedTrust,
    selectedRegion,
  }) {
    const catOptions = categories
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((c) => {
        const sel = c.id === selectedCategory ? " selected" : "";
        return `<option value="${escapeHtml(c.id)}"${sel}>${escapeHtml(c.name)}</option>`;
      })
      .join("");

    const trustOptions = trustLabels
      .slice()
      .sort((a, b) => a.priority - b.priority)
      .map((t) => {
        const sel = t.id === selectedTrust ? " selected" : "";
        return `<option value="${escapeHtml(t.id)}"${sel}>${escapeHtml(t.name)}</option>`;
      })
      .join("");

    const regionOptions = (regions || [])
      .map((r) => {
        const sel = r.id === selectedRegion ? " selected" : "";
        return `<option value="${escapeHtml(r.id)}"${sel}>${escapeHtml(r.name)}</option>`;
      })
      .join("");

    return `
      <div class="filter-bar" data-filter-bar>
        <div class="filter-field">
          <label for="filter-category">Category</label>
          <select id="filter-category" name="category" data-filter="category">
            <option value="">All categories</option>
            ${catOptions}
          </select>
        </div>
        <div class="filter-field">
          <label for="filter-trust">Trust label</label>
          <select id="filter-trust" name="trust" data-filter="trust">
            <option value="">All trust levels</option>
            ${trustOptions}
          </select>
        </div>
        <div class="filter-field">
          <label for="filter-region">Region</label>
          <select id="filter-region" name="region" data-filter="region">
            <option value="">All regions</option>
            ${regionOptions}
          </select>
        </div>
        <div class="filter-bar__actions">
          <button type="button" class="btn btn--secondary" data-filter-clear>Clear</button>
        </div>
      </div>
    `;
  }

  /** Location search panel for Find Mass page */
  function LocationSearchPanel({ value = "" } = {}) {
    return `
      <div class="location-panel">
        <form class="location-panel__form" data-place-form>
          <div class="location-panel__row">
            <div class="location-panel__field">
              <label for="place-input">City, state, or ZIP</label>
              <input
                id="place-input"
                name="place"
                type="search"
                class="location-panel__input"
                placeholder="e.g. Chicago, IL or 10001"
                value="${escapeHtml(value)}"
                autocomplete="address-level2"
                required
              />
            </div>
            <div class="location-panel__actions">
              <button type="submit" class="btn btn--primary btn--lg">Find nearby</button>
              <button type="button" class="btn btn--secondary btn--lg" data-use-location>
                ${ICONS.locate} Use my location
              </button>
            </div>
          </div>
          <p class="location-panel__hint" data-location-status>
            We’ll match dioceses and shrines in our directory, and open trusted Mass-finder tools for your area.
          </p>
        </form>
      </div>
    `;
  }

  /** Outbound mass finder link cards */
  function FinderLinkCards(links) {
    if (!links.length) return "";
    return `
      <div class="finder-grid">
        ${links
          .map(
            (l) => `
          <a class="finder-card" href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">
            <div class="finder-card__top">
              <strong>${escapeHtml(l.name)}</strong>
              ${TrustBadge(l.trustLabel)}
            </div>
            <p>${escapeHtml(l.description)}</p>
            <span class="finder-card__cta">Open tool ${ICONS.external}</span>
          </a>
        `
          )
          .join("")}
      </div>
    `;
  }

  /** Trust legend for about page */
  function TrustLegend(trustLabels) {
    const items = trustLabels
      .slice()
      .sort((a, b) => a.priority - b.priority)
      .map(
        (t) => `
        <div class="trust-legend__item">
          ${TrustBadge(t.id)}
          <p>${escapeHtml(t.description)}</p>
        </div>
      `
      )
      .join("");

    return `<div class="trust-legend">${items}</div>`;
  }

  /** Scope disclaimer */
  function DisclaimerBanner() {
    return `
      <aside class="disclaimer" aria-label="Important notice">
        <h3>A careful note</h3>
        <p>
          Lumen Wonder is a <strong>curated directory</strong>, not an official Church voice.
          We link you to trusted sources — we do not replace your priest, parish, or diocese.
        </p>
        <ul>
          <li>For sacramental life and pastoral advice, contact your local parish.</li>
          <li>For doctrine, prefer Official Church and Diocesan sources first.</li>
          <li>Trust labels help you see who is behind a resource.</li>
        </ul>
      </aside>
    `;
  }

  /** Suggest resource form */
  function SuggestForm({ categories, trustLabels, regions }) {
    const catOpts = categories
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((c) => `<option value="${escapeHtml(c.id)}">${escapeHtml(c.name)}</option>`)
      .join("");

    const trustOpts = trustLabels
      .slice()
      .sort((a, b) => a.priority - b.priority)
      .map((t) => `<option value="${escapeHtml(t.id)}">${escapeHtml(t.name)}</option>`)
      .join("");

    const regionOpts = (regions || [])
      .map((r) => `<option value="${escapeHtml(r.id)}">${escapeHtml(r.name)}</option>`)
      .join("");

    return `
      <form class="suggest-form" data-suggest-form novalidate>
        <div class="form-grid">
          <div class="form-field form-field--full">
            <label for="sug-name">Resource name <span class="req">*</span></label>
            <input id="sug-name" name="name" type="text" required maxlength="120" placeholder="e.g. Archdiocese of…" />
            <p class="field-error" data-error-for="name" hidden></p>
          </div>
          <div class="form-field form-field--full">
            <label for="sug-url">Website URL <span class="req">*</span></label>
            <input id="sug-url" name="url" type="url" required placeholder="https://" />
            <p class="field-error" data-error-for="url" hidden></p>
          </div>
          <div class="form-field form-field--full">
            <label for="sug-desc">Short description <span class="req">*</span></label>
            <textarea id="sug-desc" name="description" rows="3" required maxlength="400" placeholder="One or two careful sentences about what this resource is."></textarea>
            <p class="field-error" data-error-for="description" hidden></p>
          </div>
          <div class="form-field">
            <label for="sug-cat">Category <span class="req">*</span></label>
            <select id="sug-cat" name="category" required>
              <option value="">Select…</option>
              ${catOpts}
            </select>
            <p class="field-error" data-error-for="category" hidden></p>
          </div>
          <div class="form-field">
            <label for="sug-trust">Trust label <span class="req">*</span></label>
            <select id="sug-trust" name="trustLabel" required>
              <option value="">Select…</option>
              ${trustOpts}
            </select>
            <p class="field-error" data-error-for="trustLabel" hidden></p>
          </div>
          <div class="form-field">
            <label for="sug-location">Location (optional)</label>
            <input id="sug-location" name="location" type="text" placeholder="City, State / Country" />
          </div>
          <div class="form-field">
            <label for="sug-region">Region (optional)</label>
            <select id="sug-region" name="region">
              <option value="">—</option>
              ${regionOpts}
            </select>
          </div>
          <div class="form-field">
            <label for="sug-cost">Cost (optional)</label>
            <select id="sug-cost" name="cost">
              <option value="">—</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
              <option value="mixed">Free &amp; paid</option>
            </select>
          </div>
          <div class="form-field">
            <label for="sug-tags">Tags (optional, comma-separated)</label>
            <input id="sug-tags" name="tags" type="text" placeholder="mass, kids, pilgrimage" />
          </div>
          <div class="form-field">
            <label for="sug-your-name">Your name (optional)</label>
            <input id="sug-your-name" name="submitterName" type="text" autocomplete="name" />
          </div>
          <div class="form-field">
            <label for="sug-email">Your email (optional)</label>
            <input id="sug-email" name="submitterEmail" type="email" autocomplete="email" />
          </div>
          <div class="form-field form-field--full">
            <label for="sug-notes">Notes for reviewers (optional)</label>
            <textarea id="sug-notes" name="notes" rows="2" maxlength="500" placeholder="Why you trust this source, or anything editors should know."></textarea>
          </div>
        </div>
        <div class="suggest-form__actions">
          <button type="submit" class="btn btn--primary btn--lg">Submit suggestion</button>
        </div>
        <p class="form-footnote">
          Suggestions are stored in this browser for review and can be copied as JSON for the directory data file.
          They are not published automatically.
        </p>
      </form>
    `;
  }

  function SuggestSuccess({ draft, json, mailto }) {
    return `
      <div class="suggest-success" data-suggest-success>
        <h3>Thank you — suggestion saved</h3>
        <p>
          <strong>${escapeHtml(draft.name)}</strong> was stored on this device as pending review.
          It will not appear in the public directory until an editor adds it.
        </p>
        <div class="suggest-success__actions">
          ${mailto ? `<a class="btn btn--primary" href="${escapeHtml(mailto)}">Email this suggestion</a>` : ""}
          <button type="button" class="btn btn--secondary" data-copy-json>Copy JSON for data.js</button>
          <button type="button" class="btn btn--ghost" data-suggest-another>Suggest another</button>
        </div>
        <pre class="code-block" data-json-block>${escapeHtml(json)}</pre>
      </div>
    `;
  }

  function PendingSuggestionsList(items) {
    if (!items.length) {
      return `<p class="text-muted">No pending suggestions in this browser yet.</p>`;
    }
    return `
      <ul class="pending-list">
        ${items
          .map(
            (d) => `
          <li>
            <strong>${escapeHtml(d.name)}</strong>
            <span class="text-muted"> · ${escapeHtml(d._meta?.submittedAt?.slice(0, 10) || "")}</span>
            <br />
            <a href="${escapeHtml(d.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(d.url)}</a>
          </li>
        `
          )
          .join("")}
      </ul>
    `;
  }

  /** Single YouTube channel card */
  function YouTubeChannelCard(channel) {
    return `
      <article class="youtube-card" data-youtube-id="${escapeHtml(channel.id)}">
        <div class="youtube-card__top">
          <div>
            <h3 class="youtube-card__name">
              <a href="${escapeHtml(channel.url)}" target="_blank" rel="noopener noreferrer">
                ${escapeHtml(channel.name)}
              </a>
            </h3>
            ${
              channel.host
                ? `<p class="youtube-card__host">${escapeHtml(channel.host)}</p>`
                : ""
            }
          </div>
          <span class="youtube-badge">${ICONS.youtube} YouTube</span>
        </div>
        <p class="youtube-card__desc">${escapeHtml(channel.description)}</p>
        <div class="youtube-card__footer">
          ${TrustBadge(channel.trustLabel || "media")}
          <a class="resource-card__link" href="${escapeHtml(channel.url)}" target="_blank" rel="noopener noreferrer">
            Visit channel ${ICONS.external}
          </a>
        </div>
      </article>
    `;
  }

  /** Grid of YouTube channels */
  function YouTubeChannelGrid(channels) {
    const list = channels || [];
    if (!list.length) {
      return `<div class="empty-state"><h3>No channels listed yet</h3></div>`;
    }
    return `
      <div class="youtube-grid">
        ${list.map(YouTubeChannelCard).join("")}
      </div>
    `;
  }

  return {
    ICONS,
    escapeHtml,
    getTrustLabel,
    getCategory,
    getRegion,
    SiteHeader,
    SiteFooter,
    FreeCcdTable,
    FeaturedFamily,
    SearchBar,
    CategoryCard,
    CategoryGrid,
    TrustBadge,
    ResourceCard,
    ResourceGrid,
    FilterBar,
    LocationSearchPanel,
    FinderLinkCards,
    TrustLegend,
    DisclaimerBanner,
    SuggestForm,
    SuggestSuccess,
    PendingSuggestionsList,
    YouTubeChannelCard,
    YouTubeChannelGrid,
  };
})();
