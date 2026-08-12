/**
 * Lumen Wonder — location matching for Mass finder & region filters
 */

window.LumenLocation = (function () {
  const S = () => window.LumenSearch;

  function normalize(str) {
    return S().normalize(str);
  }

  function getRegions() {
    return window.LumenData.regions || [];
  }

  function getRegion(id) {
    return getRegions().find((r) => r.id === id) || null;
  }

  /**
   * Score how well a place query matches a region (via keywords)
   */
  function scoreRegion(region, queryNorm) {
    if (!queryNorm) return 0;
    let score = 0;
    for (const kw of region.keywords || []) {
      const k = normalize(kw);
      if (!k) continue;
      if (queryNorm === k) score += 10;
      else if (queryNorm.includes(k) || k.includes(queryNorm)) score += 5;
    }
    if (normalize(region.name).includes(queryNorm)) score += 4;
    return score;
  }

  /**
   * Infer best-matching region ids from a free-text place query
   */
  function matchRegions(placeQuery, limit = 3) {
    const q = normalize(placeQuery);
    if (!q) return [];
    return getRegions()
      .map((r) => ({ region: r, score: scoreRegion(r, q) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((x) => x.region);
  }

  /**
   * Score a resource against a place query (location, region keywords, tags, name)
   */
  function scoreResourceForPlace(resource, placeQuery) {
    const q = normalize(placeQuery);
    if (!q) return 0;
    let score = 0;
    const loc = normalize(resource.location);
    if (loc) {
      if (loc.includes(q) || q.includes(loc)) score += 12;
      // token overlap
      const qTokens = q.split(/\s+/).filter((t) => t.length > 2);
      for (const t of qTokens) {
        if (loc.includes(t)) score += 3;
      }
    }
    const region = getRegion(resource.region);
    if (region) score += scoreRegion(region, q);
    for (const tag of resource.tags || []) {
      const t = normalize(tag);
      if (t && (q.includes(t) || t.includes(q))) score += 2;
    }
    const name = normalize(resource.name);
    if (name.includes(q)) score += 4;
    return score;
  }

  /**
   * Directory resources relevant to a place (dioceses, shrines, mass tools)
   */
  function findLocalResources(placeQuery, { limit = 12, categories = null } = {}) {
    const resources = window.LumenData.resources || [];
    const q = normalize(placeQuery);
    if (!q) return [];

    let scored = resources
      .map((r) => ({ resource: r, score: scoreResourceForPlace(r, placeQuery) }))
      .filter((x) => x.score > 0);

    if (categories && categories.length) {
      scored = scored.filter((x) =>
        (x.resource.categories || []).some((c) => categories.includes(c))
      );
    }

    // Prefer diocesan / parish when place-specific
    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const trustOrder = { diocesan: 0, "parish-shrine": 1, "official-church": 2 };
      const ta = trustOrder[a.resource.trustLabel] ?? 9;
      const tb = trustOrder[b.resource.trustLabel] ?? 9;
      return ta - tb;
    });

    return scored.slice(0, limit).map((x) => x.resource);
  }

  /**
   * Build outbound Mass-finder links for a place and optional coords
   */
  function buildFinderLinks(placeQuery, coords) {
    const finders = window.LumenData.massFinders || [];
    const place = (placeQuery || "").trim();
    const encoded = encodeURIComponent(place);

    return finders.map((f) => {
      let url = f.homeUrl;
      if (coords && f.geoUrl) {
        url = f.geoUrl
          .replace("{lat}", coords.lat)
          .replace("{lng}", coords.lng);
      } else if (place && f.searchUrl) {
        url = f.searchUrl.replace("{place}", encoded);
      }
      return {
        id: f.id,
        name: f.name,
        description: f.description,
        trustLabel: f.trustLabel,
        url,
      };
    });
  }

  /**
   * Browser geolocation → coords (no reverse geocode required)
   */
  function getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          });
        },
        (err) => {
          let msg = "Could not get your location.";
          if (err.code === 1) msg = "Location permission was denied.";
          if (err.code === 2) msg = "Location unavailable.";
          if (err.code === 3) msg = "Location request timed out.";
          reject(new Error(msg));
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
      );
    });
  }

  /**
   * Optional reverse geocode via OpenStreetMap Nominatim (public, rate-limited).
   * Fails gracefully — Mass finder still works with lat/lng alone.
   */
  async function reverseGeocode(lat, lng) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(
      lat
    )}&lon=${encodeURIComponent(lng)}&zoom=10&addressdetails=1`;
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) return null;
      const data = await res.json();
      const a = data.address || {};
      const parts = [
        a.city || a.town || a.village || a.hamlet || a.municipality,
        a.state || a.region,
        a.country_code ? a.country_code.toUpperCase() : a.country,
      ].filter(Boolean);
      return parts.length ? parts.join(", ") : data.display_name || null;
    } catch {
      return null;
    }
  }

  return {
    getRegions,
    getRegion,
    matchRegions,
    findLocalResources,
    buildFinderLinks,
    getCurrentPosition,
    reverseGeocode,
    scoreResourceForPlace,
  };
})();
