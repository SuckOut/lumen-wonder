/**
 * Lumen Wonder — keyword-enabled search & filter
 */

window.LumenSearch = (function () {
  const STOPWORDS = new Set([
    "a",
    "an",
    "the",
    "and",
    "or",
    "for",
    "to",
    "of",
    "in",
    "on",
    "at",
    "my",
    "me",
    "our",
    "your",
    "some",
    "any",
    "all",
    "with",
    "from",
    "about",
    "please",
    "find",
    "show",
    "get",
    "need",
    "looking",
    "stuff",
    "things",
    "thing",
    "materials",
    "resources",
    "resource",
    "pages",
    "page",
    "site",
    "sites",
  ]);

  /** Synonym / keyword groups for broader matching */
  const KEYWORD_GROUPS = [
    ["free", "gratis", "nofee", "complimentary", "printable", "printables", "download", "downloadable"],
    ["ccd", "catechesis", "catechetical", "catechist", "catechists", "faith", "formation", "sre", "religious", "education", "classroom", "kids", "children", "child"],
    ["coloring", "colouring", "color", "colour", "puzzle", "puzzles", "maze", "mazes", "activity", "activities", "worksheet", "worksheets", "printout"],
    ["mass", "liturgy", "eucharist", "communion", "confession", "reconciliation", "adoration"],
    ["podcast", "podcasts", "audio", "youtube", "video", "videos"],
    ["pilgrimage", "pilgrimages", "shrine", "shrines", "basilica"],
    ["rosary", "prayer", "prayers", "saint", "saints"],
  ];

  function normalize(str) {
    return String(str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function tokenize(query) {
    return normalize(query)
      .replace(/[^\p{L}\p{N}\s-]/gu, " ")
      .split(/\s+/)
      .filter(Boolean);
  }

  /** Meaningful tokens for matching (stopwords removed) */
  function significantTokens(query) {
    return tokenize(query).filter((t) => t.length > 1 && !STOPWORDS.has(t));
  }

  function expandToken(token) {
    const set = new Set([token]);
    for (const group of KEYWORD_GROUPS) {
      if (group.includes(token)) {
        group.forEach((g) => set.add(g));
      }
    }
    // partial: "coloring" matches group via startsWith within group
    for (const group of KEYWORD_GROUPS) {
      if (group.some((g) => g.startsWith(token) || token.startsWith(g))) {
        group.forEach((g) => set.add(g));
      }
    }
    return [...set];
  }

  function expandTokens(tokens) {
    const out = new Set();
    tokens.forEach((t) => expandToken(t).forEach((x) => out.add(x)));
    return [...out];
  }

  function isFreeCcdIntent(query) {
    const tokens = tokenize(query);
    const sig = significantTokens(query);
    const joined = tokens.join(" ");
    const hasFree = tokens.some((t) => expandToken(t).includes("free") || t === "free");
    const hasCcd = tokens.some((t) =>
      ["ccd", "catechesis", "catechetical", "coloring", "colouring", "puzzle", "maze", "printable", "printables", "worksheet"].includes(t)
    );
    if (hasCcd) return true;
    if (hasFree && (joined.includes("ccd") || joined.includes("kid") || joined.includes("child") || joined.includes("color") || joined.includes("colour") || joined.includes("print"))) {
      return true;
    }
    // "free stuff" alone is weak — still boost free CCD if free is only significant term and query mentions free
    if (hasFree && sig.length <= 2) return true;
    return false;
  }

  function resourceSearchText(resource, categories, regions) {
    const catNames = (resource.categories || [])
      .map((id) => categories.find((c) => c.id === id))
      .filter(Boolean)
      .map((c) => `${c.name} ${c.shortName || ""}`)
      .join(" ");

    const region = (regions || []).find((r) => r.id === resource.region);
    const regionText = region
      ? `${region.name} ${(region.keywords || []).join(" ")}`
      : "";

    return normalize(
      [
        resource.name,
        resource.description,
        resource.location,
        resource.region,
        regionText,
        (resource.tags || []).join(" "),
        (resource.audience || []).join(" "),
        resource.country || "",
        resource._keywords || "",
        catNames,
      ].join(" ")
    );
  }

  function scoreMatch(haystack, tokens) {
    if (!tokens.length) return 1;
    let score = 0;
    let matched = 0;
    for (const t of tokens) {
      const variants = expandToken(t);
      if (variants.some((v) => haystack.includes(v))) {
        matched += 1;
        score += haystack.includes(t) ? 3 : 2;
      }
    }
    // Prefer matching most significant tokens (not requiring 100% when synonyms expand intent)
    if (matched === 0) return 0;
    if (matched < tokens.length && matched / tokens.length < 0.5) return 0;
    return score + matched * 2;
  }

  function matchesQuery(resource, tokens, categories, regions) {
    if (!tokens.length) return true;
    const haystack = resourceSearchText(resource, categories, regions);
    return scoreMatch(haystack, tokens) > 0;
  }

  /** Build searchable free-CCD entries + page hub */
  function freeCcdAsResources() {
    const list = window.LumenData?.freeCcdResources || [];
    const items = list.map((r) => ({
      id: `free-ccd-${r.id}`,
      name: r.name,
      slug: r.id,
      description: `${r.description} Completely free CCD / faith formation printables — no registration required.`,
      url: r.url,
      categories: ["ccd-resources"],
      trustLabel: r.trustLabel || "independent",
      tags: [
        "free",
        "ccd",
        "coloring",
        "colouring",
        "printable",
        "puzzle",
        "maze",
        "activity",
        "worksheet",
        "kids",
        "children",
        "catechesis",
        "faith formation",
        r.country,
      ],
      audience: ["families", "catechists", "all"],
      featured: true,
      location: r.country || null,
      region: null,
      cost: "free",
      country: r.country,
      _source: "free-ccd",
      _keywords: "free ccd materials stuff printables coloring pages",
    }));

    items.unshift({
      id: "page-free-ccd",
      name: "Free CCD Resources — Lumen Wonder",
      slug: "free-ccd-page",
      description:
        "Curated page of completely free Catholic CCD materials: coloring pages, puzzles, mazes, and activity sheets for families and catechists.",
      url: "free-ccd.html",
      categories: ["ccd-resources"],
      trustLabel: "independent",
      tags: ["free", "ccd", "coloring", "printable", "maze", "puzzle", "activity", "lumen wonder"],
      audience: ["families", "catechists", "all"],
      featured: true,
      location: null,
      region: null,
      cost: "free",
      _source: "page",
      _keywords: "free ccd stuff materials resources printables",
      _internal: true,
    });

    return items;
  }

  /**
   * Highlight query terms in plain text (returns safe HTML)
   */
  function highlightHtml(text, query) {
    const escapeHtml = (str) =>
      String(str ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

    const raw = String(text ?? "");
    // Include stopwords that are meaningful to highlight (e.g. free, ccd)
    const rawTokens = tokenize(query).filter((t) => t.length >= 2);
    const highlightTerms = [...new Set(rawTokens)].filter(
      (t) => !["the", "and", "for", "with", "from", "about"].includes(t)
    );
    if (!highlightTerms.length) return escapeHtml(raw);

    const escapedTerms = highlightTerms
      .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .sort((a, b) => b.length - a.length);

    const re = new RegExp(`(${escapedTerms.join("|")})`, "gi");
    let out = "";
    let last = 0;
    let m;
    while ((m = re.exec(raw)) !== null) {
      out += escapeHtml(raw.slice(last, m.index));
      out += `<mark class="search-highlight">${escapeHtml(m[0])}</mark>`;
      last = m.index + m[0].length;
    }
    out += escapeHtml(raw.slice(last));
    return out;
  }

  /**
   * @param {object} options
   */
  function search({
    resources,
    categories,
    trustLabels,
    regions,
    freeCcdResources,
    query = "",
    category = "",
    trust = "",
    region = "",
    featuredOnly = false,
    includeFreeCcd = true,
  }) {
    const tokens = significantTokens(query);
    const regionList = regions || window.LumenData?.regions || [];
    const trustPriority = Object.fromEntries(
      (trustLabels || []).map((t) => [t.id, t.priority ?? 99])
    );

    let pool = [...(resources || [])];

    // Always merge free CCD catalog into the searchable pool (unless filtered away)
    if (includeFreeCcd) {
      const freeItems = freeCcdAsResources();
      const forceCcd =
        isFreeCcdIntent(query) ||
        category === "ccd-resources" ||
        tokens.some((t) => expandToken(t).includes("ccd") || expandToken(t).includes("free"));
      if (forceCcd || tokens.length) {
        // Deduplicate by id
        const seen = new Set(pool.map((r) => r.id));
        freeItems.forEach((item) => {
          if (!seen.has(item.id)) {
            pool.push(item);
            seen.add(item.id);
          }
        });
      }
    }

    // If free-CCD intent and no category filter, prefer ccd category inclusion
    let results = pool
      .map((r) => {
        if (featuredOnly && !r.featured && r._source !== "free-ccd" && r._source !== "page") {
          return null;
        }
        if (category && !(r.categories || []).includes(category)) {
          // Free-CCD intent: still allow free-ccd items when category empty only
          return null;
        }
        if (trust && r.trustLabel !== trust) return null;
        if (region && r.region !== region) return null;

        const haystack = resourceSearchText(r, categories || [], regionList);
        const score = tokens.length ? scoreMatch(haystack, tokens) : r.featured ? 2 : 1;
        if (tokens.length && score <= 0) {
          // Free CCD intent: include all free-ccd items even if weak token match
          if (isFreeCcdIntent(query) && (r._source === "free-ccd" || r._source === "page")) {
            return { resource: r, score: 5 };
          }
          return null;
        }
        let bonus = 0;
        if (isFreeCcdIntent(query) && (r._source === "free-ccd" || r._source === "page")) {
          bonus += 20;
        }
        if ((r.categories || []).includes("ccd-resources") && isFreeCcdIntent(query)) {
          bonus += 8;
        }
        return { resource: r, score: score + bonus };
      })
      .filter(Boolean);

    results.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (Boolean(b.resource.featured) !== Boolean(a.resource.featured)) {
        return b.resource.featured ? 1 : -1;
      }
      const pa = trustPriority[a.resource.trustLabel] ?? 99;
      const pb = trustPriority[b.resource.trustLabel] ?? 99;
      if (pa !== pb) return pa - pb;
      return a.resource.name.localeCompare(b.resource.name);
    });

    return results.map((x) => x.resource);
  }

  function paramsFromURL(search) {
    const params = new URLSearchParams(search || window.location.search);
    return {
      query: params.get("q") || "",
      category: params.get("category") || "",
      trust: params.get("trust") || "",
      region: params.get("region") || "",
      place: params.get("place") || "",
    };
  }

  function writeParamsToURL(
    { query, category, trust, region, place },
    replace = true
  ) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category) params.set("category", category);
    if (trust) params.set("trust", trust);
    if (region) params.set("region", region);
    if (place) params.set("place", place);
    const qs = params.toString();
    const url = qs
      ? `${window.location.pathname}?${qs}`
      : window.location.pathname;
    if (replace) {
      history.replaceState(null, "", url);
    } else {
      history.pushState(null, "", url);
    }
  }

  return {
    normalize,
    tokenize,
    significantTokens,
    isFreeCcdIntent,
    highlightHtml,
    search,
    paramsFromURL,
    writeParamsToURL,
    freeCcdAsResources,
  };
})();
