# Lumen Wonder

**Find trusted Catholic resources — simply.**

A curated Catholic resource directory and search engine for regular Catholics, families, catechists, and travelers.

> Lumen Wonder is **not** an official voice of the Catholic Church, a substitute for a priest or parish, or a place that teaches doctrine on its own authority.

---

## Quick start

No build step. No Node required.

```bash
cd lumen-wonder
python3 -m http.server 8080
# visit http://localhost:8080
```

Or open `index.html` directly in your browser.

---

## What’s included

| Feature | Status |
|---------|--------|
| Homepage with large search + category icons | ✓ |
| Resource directory with cards | ✓ |
| Trust labels | ✓ |
| Region filter + expanded seed data (~70 resources) | ✓ |
| **Find Mass** — city/ZIP, geolocation, Mass-finder links | ✓ |
| Dioceses, shrines, CCD, podcasts, official sources | ✓ |
| **Suggest a resource** form (localStorage + JSON export) | ✓ |
| Client-side search & filters | ✓ |

---

## Pages

| Page | Purpose |
|------|---------|
| `index.html` | Hero search, categories, featured resources |
| `find-mass.html` | Location-aware Mass / Confession / Adoration discovery |
| `directory.html` | Full directory — category, trust, region filters |
| `suggest.html` | Contribute / suggest a resource for review |
| `about.html` | Mission, scope, trust legend |

### Useful URLs

- `directory.html?q=confession`
- `directory.html?category=ccd-resources`
- `directory.html?trust=diocesan`
- `directory.html?region=us-northeast`
- `find-mass.html?place=Chicago,%20IL`

---

## Project structure

```
lumen-wonder/
├── index.html
├── find-mass.html
├── directory.html
├── suggest.html
├── about.html
├── css/styles.css
├── js/
│   ├── data.js          # Categories, regions, resources, mass finders
│   ├── components.js    # Reusable UI
│   ├── search.js        # Search + URL filters
│   ├── location.js      # Place matching + geolocation
│   ├── suggest.js       # Contribution flow
│   └── app.js           # Page bootstrap
└── docs/ARCHITECTURE.md
```

---

## How to add a resource (editor)

### Option A — Suggest form
1. Open `suggest.html`
2. Fill the form → suggestion saved in the browser
3. Click **Copy JSON for data.js**
4. Paste into the `resources` array in `js/data.js`

### Option B — Edit data directly

Append to `resources` in `js/data.js`:

```js
{
  id: "unique-id",
  name: "Display Name",
  slug: "url-slug",
  description: "One or two careful sentences.",
  url: "https://example.org/",
  categories: ["trusted-websites"],
  trustLabel: "diocesan",  // official-church | diocesan | parish-shrine | apostolate | media | independent
  tags: ["keyword1", "keyword2"],
  audience: ["all", "families", "catechists", "travelers"],
  featured: false,
  location: "City, ST, USA",  // or null
  region: "us-midwest",       // see regions in data.js
  cost: "free",               // free | paid | mixed | null
}
```

### Optional: email suggestions

In `js/data.js` under `site`:

```js
suggestEmail: "you@example.com",
```

The success screen will offer a pre-filled mailto.

---

## Find Mass — how it works

1. User enters city/ZIP **or** taps **Use my location**
2. Lumen Wonder builds outbound links to MassTimes, CatholicMassTimes, Google Maps, etc.
3. Directory resources (dioceses, shrines) are scored against the place text
4. Related region chips filter the full directory

We do **not** host live parish schedules. Users should always verify on the parish site.

---

## Design

Warm off-white, deep navy, soft blue/sand accents — clean and trustworthy (Angi / TaskRabbit style). Large Inter typography. Icons over photos in v1.

---

## Publish

- **Netlify Drop:** drag this folder to [app.netlify.com/drop](https://app.netlify.com/drop)
- **GitHub Pages:** push and enable Pages from the root

---

Made with care. *Ad majorem Dei gloriam.*
