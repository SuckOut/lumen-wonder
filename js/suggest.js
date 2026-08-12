/**
 * Lumen Wonder — resource suggestion / contribution flow
 * Stores drafts in localStorage; optional email/endpoint later.
 */

window.LumenSuggest = (function () {
  const STORAGE_KEY = "lumen-wonder-suggestions";

  function escapeHtml(str) {
    return window.LumenComponents
      ? window.LumenComponents.escapeHtml(str)
      : String(str ?? "");
  }

  function loadAll() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveAll(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function validate(form) {
    const errors = {};
    const name = (form.name || "").trim();
    const url = (form.url || "").trim();
    const description = (form.description || "").trim();
    const category = (form.category || "").trim();
    const trustLabel = (form.trustLabel || "").trim();

    if (name.length < 2) errors.name = "Please enter the resource name.";
    if (!url) {
      errors.url = "Please enter a URL.";
    } else {
      try {
        const u = new URL(url);
        if (!["http:", "https:"].includes(u.protocol)) {
          errors.url = "URL must start with http:// or https://";
        }
      } catch {
        errors.url = "Please enter a valid URL (include https://).";
      }
    }
    if (description.length < 20) {
      errors.description = "Add a short description (at least 20 characters).";
    }
    if (!category) errors.category = "Choose a category.";
    if (!trustLabel) errors.trustLabel = "Choose a trust label.";

    return { ok: Object.keys(errors).length === 0, errors };
  }

  function toResourceDraft(form) {
    const name = form.name.trim();
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60);

    return {
      id: `suggested-${Date.now()}`,
      name,
      slug: slug || `resource-${Date.now()}`,
      description: form.description.trim(),
      url: form.url.trim(),
      categories: [form.category],
      trustLabel: form.trustLabel,
      tags: (form.tags || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      audience: ["all"],
      featured: false,
      location: (form.location || "").trim() || null,
      region: form.region || null,
      cost: form.cost || null,
      _meta: {
        submittedAt: new Date().toISOString(),
        submitterName: (form.submitterName || "").trim() || null,
        submitterEmail: (form.submitterEmail || "").trim() || null,
        notes: (form.notes || "").trim() || null,
        status: "pending-review",
      },
    };
  }

  function submit(form) {
    const { ok, errors } = validate(form);
    if (!ok) return { ok: false, errors };

    const draft = toResourceDraft(form);
    const all = loadAll();
    all.unshift(draft);
    saveAll(all);

    return { ok: true, draft, all };
  }

  function formatJson(draft) {
    // Strip _meta for clean data.js paste option
    const { _meta, ...resource } = draft;
    return JSON.stringify(resource, null, 2);
  }

  function mailtoBody(draft) {
    const lines = [
      "Lumen Wonder — resource suggestion",
      "",
      `Name: ${draft.name}`,
      `URL: ${draft.url}`,
      `Description: ${draft.description}`,
      `Category: ${draft.categories?.join(", ")}`,
      `Trust label: ${draft.trustLabel}`,
      `Location: ${draft.location || "—"}`,
      `Region: ${draft.region || "—"}`,
      `Tags: ${(draft.tags || []).join(", ") || "—"}`,
      "",
      `Submitted: ${draft._meta?.submittedAt || ""}`,
      `From: ${draft._meta?.submitterName || "—"} <${draft._meta?.submitterEmail || "—"}>`,
      `Notes: ${draft._meta?.notes || "—"}`,
      "",
      "JSON draft:",
      formatJson(draft),
    ];
    return lines.join("\n");
  }

  function buildMailto(draft, email) {
    const to = email || "suggest@example.com";
    const subject = encodeURIComponent(`[Lumen Wonder] Suggest: ${draft.name}`);
    const body = encodeURIComponent(mailtoBody(draft));
    return `mailto:${to}?subject=${subject}&body=${body}`;
  }

  return {
    STORAGE_KEY,
    loadAll,
    saveAll,
    validate,
    submit,
    formatJson,
    mailtoBody,
    buildMailto,
    escapeHtml,
  };
})();
