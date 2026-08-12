/**
 * Lumen Wonder — page bootstrap
 */

(function () {
  const C = window.LumenComponents;
  const S = window.LumenSearch;
  const Data = window.LumenData;
  const Loc = window.LumenLocation;
  const Sug = window.LumenSuggest;

  function mountShell(activePage) {
    const headerEl = document.querySelector("[data-site-header]");
    const footerEl = document.querySelector("[data-site-footer]");
    if (headerEl) headerEl.outerHTML = C.SiteHeader(activePage);
    if (footerEl) footerEl.outerHTML = C.SiteFooter();
    initNav();
  }

  function initNav() {
    const toggle = document.querySelector("[data-nav-toggle]");
    const nav = document.querySelector("[data-nav]");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
  }

  /* ---------- Home ---------- */
  function initHome() {
    mountShell("home");

    const searchMount = document.querySelector("[data-mount-search]");
    if (searchMount) {
      searchMount.innerHTML = C.SearchBar({ id: "home-search" });
    }

    const catMount = document.querySelector("[data-mount-categories]");
    if (catMount) {
      catMount.innerHTML = C.CategoryGrid(Data.categories);
    }

    const familyMount = document.querySelector("[data-mount-featured-family]");
    if (familyMount && C.FeaturedFamily) {
      familyMount.innerHTML = C.FeaturedFamily(Data.featuredFamily);
    }

    const youtubeMount = document.querySelector("[data-mount-youtube]");
    if (youtubeMount) {
      const channels = Data.youtubeChannels || [];
      youtubeMount.innerHTML = C.YouTubeChannelGrid(channels);
    }

    const featuredMount = document.querySelector("[data-mount-featured]");
    if (featuredMount) {
      const featured = S.search({
        resources: Data.resources,
        categories: Data.categories,
        trustLabels: Data.trustLabels,
        regions: Data.regions,
        featuredOnly: true,
      }).slice(0, 6);
      featuredMount.innerHTML = C.ResourceGrid(featured);
    }

    const disclaimerMount = document.querySelector("[data-mount-disclaimer]");
    if (disclaimerMount) {
      disclaimerMount.innerHTML = C.DisclaimerBanner();
    }

    document.querySelectorAll("[data-hint]").forEach((chip) => {
      chip.addEventListener("click", () => {
        const q = chip.getAttribute("data-hint") || "";
        window.location.href = `directory.html?q=${encodeURIComponent(q)}`;
      });
    });
  }

  /* ---------- Directory ---------- */
  function initDirectory() {
    mountShell("directory");

    let state = S.paramsFromURL();

    const searchMount = document.querySelector("[data-mount-search]");
    const filterMount = document.querySelector("[data-mount-filters]");
    const resultsMount = document.querySelector("[data-mount-results]");
    const metaMount = document.querySelector("[data-mount-meta]");
    const titleMount = document.querySelector("[data-page-title]");
    const subMount = document.querySelector("[data-page-sub]");
    const massCta = document.querySelector("[data-mass-cta]");

    function categoryTitle(id) {
      const cat = Data.categories.find((c) => c.id === id);
      return cat ? cat.name : null;
    }

    function render() {
      if (searchMount) {
        searchMount.innerHTML = C.SearchBar({
          compact: true,
          value: state.query,
          action: "directory.html",
          id: "directory-search",
        });
      }

      if (filterMount) {
        filterMount.innerHTML = C.FilterBar({
          categories: Data.categories,
          trustLabels: Data.trustLabels,
          regions: Data.regions,
          selectedCategory: state.category,
          selectedTrust: state.trust,
          selectedRegion: state.region,
        });
      }

      if (massCta) {
        massCta.hidden = state.category !== "mass-confession" && !state.query.toLowerCase().includes("mass");
      }

      const results = S.search({
        resources: Data.resources,
        categories: Data.categories,
        trustLabels: Data.trustLabels,
        regions: Data.regions,
        freeCcdResources: Data.freeCcdResources,
        query: state.query,
        category: state.category,
        trust: state.trust,
        region: state.region,
        includeFreeCcd: true,
      });

      const ccdBanner =
        state.query && S.isFreeCcdIntent && S.isFreeCcdIntent(state.query)
          ? `<div class="callout callout--gold" style="margin-bottom: 1.25rem;">
              <div>
                <h3>Free CCD materials</h3>
                <p>Your search matches free CCD / faith formation printables. Results below include free coloring pages, puzzles, and our Free CCD page.</p>
              </div>
              <a class="btn btn--primary" href="free-ccd.html">Open Free CCD page</a>
            </div>`
          : "";

      if (resultsMount) {
        resultsMount.innerHTML = ccdBanner + C.ResourceGrid(results, null, state.query);
      }

      if (metaMount) {
        const bits = [];
        if (state.query) bits.push(`“${C.escapeHtml(state.query)}”`);
        if (state.category) {
          const name = categoryTitle(state.category);
          if (name) bits.push(C.escapeHtml(name));
        }
        if (state.trust) {
          const t = Data.trustLabels.find((x) => x.id === state.trust);
          if (t) bits.push(C.escapeHtml(t.name));
        }
        if (state.region) {
          const r = Data.regions.find((x) => x.id === state.region);
          if (r) bits.push(C.escapeHtml(r.name));
        }
        const filterText = bits.length ? ` for ${bits.join(" · ")}` : "";
        metaMount.innerHTML = `<strong>${results.length}</strong> resource${results.length === 1 ? "" : "s"}${filterText}`;
      }

      if (titleMount) {
        const catName = categoryTitle(state.category);
        titleMount.textContent = catName || "Resource directory";
      }
      if (subMount) {
        const cat = Data.categories.find((c) => c.id === state.category);
        subMount.textContent = cat
          ? cat.description
          : "Browse trusted Catholic resources. Filter by category, region, or trust label.";
      }

      bindDirectoryEvents();
    }

    function bindDirectoryEvents() {
      const form = searchMount?.querySelector("form");
      if (form) {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const input = form.querySelector('input[name="q"]');
          state.query = input ? input.value.trim() : "";
          const params = new URLSearchParams();
          if (state.query) params.set("q", state.query);
          if (state.category) params.set("category", state.category);
          if (state.trust) params.set("trust", state.trust);
          if (state.region) params.set("region", state.region);
          const qs = params.toString();
          window.location.href = qs ? `directory.html?${qs}` : "directory.html";
        });
      }

      const catSelect = document.querySelector('[data-filter="category"]');
      const trustSelect = document.querySelector('[data-filter="trust"]');
      const regionSelect = document.querySelector('[data-filter="region"]');
      const clearBtn = document.querySelector("[data-filter-clear]");

      if (catSelect) {
        catSelect.addEventListener("change", () => {
          state.category = catSelect.value;
          S.writeParamsToURL(state);
          render();
        });
      }
      if (trustSelect) {
        trustSelect.addEventListener("change", () => {
          state.trust = trustSelect.value;
          S.writeParamsToURL(state);
          render();
        });
      }
      if (regionSelect) {
        regionSelect.addEventListener("change", () => {
          state.region = regionSelect.value;
          S.writeParamsToURL(state);
          render();
        });
      }
      if (clearBtn) {
        clearBtn.addEventListener("click", () => {
          window.location.href = "directory.html";
        });
      }
    }

    render();
  }

  /* ---------- Find Mass ---------- */
  function initFindMass() {
    mountShell("find-mass");

    const params = S.paramsFromURL();
    let place = params.place || params.query || "";
    let coords = null;

    const panelMount = document.querySelector("[data-mount-location-panel]");
    const findersMount = document.querySelector("[data-mount-finders]");
    const localMount = document.querySelector("[data-mount-local]");
    const regionsMount = document.querySelector("[data-mount-matched-regions]");
    const statusEl = () => document.querySelector("[data-location-status]");

    function setStatus(msg, isError) {
      const el = statusEl();
      if (!el) return;
      el.textContent = msg;
      el.classList.toggle("is-error", Boolean(isError));
    }

    function renderPanel() {
      if (panelMount) {
        panelMount.innerHTML = C.LocationSearchPanel({ value: place });
      }
      bindPanel();
    }

    function renderResults() {
      const hasPlace = Boolean(place.trim()) || coords;

      if (findersMount) {
        if (!hasPlace) {
          findersMount.innerHTML = `
            <div class="empty-state empty-state--soft">
              <h3>Enter a place to get started</h3>
              <p>Search by city or ZIP, or use your device location. We’ll open Mass-finder tools and match dioceses in our directory.</p>
            </div>
          `;
        } else {
          const links = Loc.buildFinderLinks(place, coords);
          findersMount.innerHTML = `
            <div class="section-header">
              <div>
                <h2>Mass-finder tools</h2>
                <p>Open a trusted tool${place ? ` for <strong>${C.escapeHtml(place)}</strong>` : " near you"}. Always confirm times on the parish site.</p>
              </div>
            </div>
            ${C.FinderLinkCards(links)}
          `;
        }
      }

      if (localMount) {
        if (!place.trim()) {
          localMount.innerHTML = "";
        } else {
          const local = Loc.findLocalResources(place, {
            limit: 10,
            categories: ["mass-confession", "pilgrimages-shrines", "trusted-websites"],
          });
          // Prefer diocesan / places for this section
          const prioritized = local.filter(
            (r) =>
              r.trustLabel === "diocesan" ||
              r.trustLabel === "parish-shrine" ||
              (r.categories || []).includes("mass-confession")
          );
          const list = prioritized.length ? prioritized : local;
          localMount.innerHTML = `
            <div class="section-header">
              <div>
                <h2>In our directory</h2>
                <p>Dioceses, shrines, and related resources matching <strong>${C.escapeHtml(place)}</strong>.</p>
              </div>
              <a class="btn btn--secondary" href="directory.html?q=${encodeURIComponent(place)}">Search full directory</a>
            </div>
            ${
              list.length
                ? C.ResourceGrid(list)
                : `<div class="empty-state"><h3>No local matches yet</h3><p>Try a nearby major city, or use the Mass-finder tools above. You can also <a href="suggest.html">suggest a diocese or parish</a>.</p></div>`
            }
          `;
        }
      }

      if (regionsMount) {
        if (!place.trim()) {
          regionsMount.innerHTML = "";
        } else {
          const matched = Loc.matchRegions(place, 4);
          if (!matched.length) {
            regionsMount.innerHTML = "";
          } else {
            regionsMount.innerHTML = `
              <div class="chip-row">
                <span class="chip-row__label">Related regions:</span>
                ${matched
                  .map(
                    (r) =>
                      `<a class="hint-chip" href="directory.html?region=${encodeURIComponent(r.id)}">${C.escapeHtml(r.name)}</a>`
                  )
                  .join("")}
              </div>
            `;
          }
        }
      }
    }

    function bindPanel() {
      const form = document.querySelector("[data-place-form]");
      const geoBtn = document.querySelector("[data-use-location]");

      if (form) {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const input = form.querySelector('input[name="place"]');
          place = input ? input.value.trim() : "";
          coords = null;
          if (!place) {
            setStatus("Please enter a city, state, or ZIP.", true);
            return;
          }
          S.writeParamsToURL({ place }, false);
          setStatus(`Showing results for “${place}”.`);
          renderResults();
        });
      }

      if (geoBtn) {
        geoBtn.addEventListener("click", async () => {
          geoBtn.disabled = true;
          setStatus("Getting your location…");
          try {
            coords = await Loc.getCurrentPosition();
            const label = await Loc.reverseGeocode(coords.lat, coords.lng);
            place = label || `${coords.lat.toFixed(3)}, ${coords.lng.toFixed(3)}`;
            const input = document.querySelector("#place-input");
            if (input) input.value = place;
            S.writeParamsToURL({ place }, false);
            setStatus(
              label
                ? `Location found: ${label}. Opening tools near you.`
                : "Location found. Map tools will use your coordinates."
            );
            renderResults();
          } catch (err) {
            setStatus(err.message || "Could not get location.", true);
          } finally {
            geoBtn.disabled = false;
          }
        });
      }
    }

    // Quick city chips
    document.querySelectorAll("[data-place-hint]").forEach((chip) => {
      chip.addEventListener("click", () => {
        place = chip.getAttribute("data-place-hint") || "";
        coords = null;
        renderPanel();
        S.writeParamsToURL({ place }, false);
        setStatus(`Showing results for “${place}”.`);
        renderResults();
      });
    });

    renderPanel();
    if (place) {
      setStatus(`Showing results for “${place}”.`);
      renderResults();
    } else {
      renderResults();
    }
  }

  /* ---------- Suggest ---------- */
  function initSuggest() {
    mountShell("suggest");

    const formMount = document.querySelector("[data-mount-suggest-form]");
    const pendingMount = document.querySelector("[data-mount-pending]");
    const resultMount = document.querySelector("[data-mount-suggest-result]");

    function renderForm() {
      if (formMount) {
        formMount.hidden = false;
        formMount.innerHTML = C.SuggestForm({
          categories: Data.categories,
          trustLabels: Data.trustLabels,
          regions: Data.regions,
        });
      }
      if (resultMount) {
        resultMount.hidden = true;
        resultMount.innerHTML = "";
      }
      bindForm();
      renderPending();
    }

    function renderPending() {
      if (!pendingMount || !Sug) return;
      const items = Sug.loadAll();
      pendingMount.innerHTML = C.PendingSuggestionsList(items);
    }

    function clearErrors() {
      document.querySelectorAll("[data-error-for]").forEach((el) => {
        el.hidden = true;
        el.textContent = "";
      });
    }

    function showErrors(errors) {
      clearErrors();
      Object.entries(errors).forEach(([key, msg]) => {
        const el = document.querySelector(`[data-error-for="${key}"]`);
        if (el) {
          el.textContent = msg;
          el.hidden = false;
        }
      });
    }

    function bindForm() {
      const form = document.querySelector("[data-suggest-form]");
      if (!form || !Sug) return;

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        clearErrors();
        const fd = new FormData(form);
        const data = Object.fromEntries(fd.entries());
        const result = Sug.submit(data);

        if (!result.ok) {
          showErrors(result.errors);
          return;
        }

        const json = Sug.formatJson(result.draft);
        const email = Data.site.suggestEmail;
        const mailto = email ? Sug.buildMailto(result.draft, email) : Sug.buildMailto(result.draft, "");
        // Only use mailto if email configured; otherwise still allow copy JSON
        const mailtoLink = Data.site.suggestEmail
          ? mailto
          : null;

        if (formMount) formMount.hidden = true;
        if (resultMount) {
          resultMount.hidden = false;
          resultMount.innerHTML = C.SuggestSuccess({
            draft: result.draft,
            json,
            mailto: mailtoLink || Sug.buildMailto(result.draft, "your-email@example.com"),
          });

          const copyBtn = resultMount.querySelector("[data-copy-json]");
          if (copyBtn) {
            copyBtn.addEventListener("click", async () => {
              try {
                await navigator.clipboard.writeText(json);
                copyBtn.textContent = "Copied!";
                setTimeout(() => {
                  copyBtn.textContent = "Copy JSON for data.js";
                }, 2000);
              } catch {
                // Fallback select
                const block = resultMount.querySelector("[data-json-block]");
                if (block) {
                  const range = document.createRange();
                  range.selectNodeContents(block);
                  const sel = window.getSelection();
                  sel.removeAllRanges();
                  sel.addRange(range);
                }
              }
            });
          }

          const another = resultMount.querySelector("[data-suggest-another]");
          if (another) {
            another.addEventListener("click", renderForm);
          }
        }

        renderPending();
      });
    }

    renderForm();
  }

  /* ---------- Free CCD ---------- */
  function initFreeCcd() {
    mountShell("free-ccd");

    const listMount = document.querySelector("[data-mount-free-ccd]");
    if (listMount && C.FreeCcdTable) {
      listMount.innerHTML = C.FreeCcdTable(Data.freeCcdResources || []);
    }

    const countEl = document.querySelector("[data-free-ccd-count]");
    if (countEl) {
      const n = (Data.freeCcdResources || []).length;
      countEl.textContent = String(n);
    }
  }

  /* ---------- About ---------- */
  function initAbout() {
    mountShell("about");

    const legendMount = document.querySelector("[data-mount-trust-legend]");
    if (legendMount) {
      legendMount.innerHTML = C.TrustLegend(Data.trustLabels);
    }

    const disclaimerMount = document.querySelector("[data-mount-disclaimer]");
    if (disclaimerMount) {
      disclaimerMount.innerHTML = C.DisclaimerBanner();
    }
  }

  /* ---------- Boot ---------- */
  const page = document.body.dataset.page;
  if (page === "home") initHome();
  else if (page === "directory") initDirectory();
  else if (page === "find-mass") initFindMass();
  else if (page === "free-ccd") initFreeCcd();
  else if (page === "suggest") initSuggest();
  else if (page === "about") initAbout();
  else mountShell(page || "home");
})();
