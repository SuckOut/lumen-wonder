# Lumen Wonder — Architecture (v1)

## Purpose

Lumen Wonder is a **curated Catholic resource directory and search engine**.  
It helps regular Catholics, families, catechists, and travelers find trusted resources, places, and practical guidance — quickly and clearly.

### What this site is
- A curated directory of trusted Catholic websites, organizations, parishes, shrines, podcasts, CCD materials, and pilgrimages
- A search-first discovery tool with clear categories
- A place for short, careful, source-grounded pointers (not original doctrine)

### What this site is not
- An official voice of the Catholic Church
- A replacement for a priest, parish, or diocese
- A place that teaches doctrine on its own authority

---

## Site map (v1)

| Route | File | Purpose |
|-------|------|---------|
| `/` | `index.html` | Homepage: large search, category icons, featured resources, disclaimer |
| `/find-mass.html` | `find-mass.html` | Location-aware Mass / Confession discovery |
| `/free-ccd.html` | `free-ccd.html` | Curated free CCD printables (coloring, puzzles, mazes) |
| `/directory.html` | `directory.html` | Full directory: search, category, trust, region filters |
| `/suggest.html` | `suggest.html` | Suggest a resource (localStorage + JSON export) |
| `/about.html` | `about.html` | Mission, trust labels explained, scope boundaries |

Future:
- `/resource/:slug` — dedicated resource pages
- `/answers` — short Q&A with sources
- Review queue / CMS for suggestions

---

## Folder structure

```
lumen-wonder/
├── index.html
├── find-mass.html
├── directory.html
├── suggest.html
├── about.html
├── README.md
├── docs/ARCHITECTURE.md
├── css/styles.css
└── js/
    ├── data.js             # Categories, regions, resources, mass finders
    ├── components.js       # Reusable UI renderers
    ├── search.js           # Search + URL filters
    ├── location.js         # Place scoring + geolocation
    ├── suggest.js          # Contribution / localStorage
    └── app.js              # Page bootstrapping
```

---

## Data model

### Category
```js
{
  id: string,           // e.g. "mass-confession"
  slug: string,         // URL-friendly
  name: string,         // Display name
  shortName: string,    // Card label
  description: string,
  icon: string,         // Icon key (maps to SVG/emoji in components)
  color: string,        // Soft accent token
  order: number
}
```

### TrustLabel
```js
{
  id: string,           // e.g. "official-church"
  name: string,         // "Official Church"
  description: string,  // Short explainer
  priority: number      // Sort weight (lower = more authoritative)
}
```

### Region
```js
{
  id: string,               // e.g. "us-northeast"
  name: string,
  country: string | null,
  keywords: string[]        // Used for place matching
}
```

### Resource
```js
{
  id: string,
  name: string,
  slug: string,
  description: string,      // 1–2 sentences, careful wording
  url: string,              // External destination
  categories: string[],     // Category ids
  trustLabel: string,       // TrustLabel id
  tags: string[],           // Free-form for search
  audience: string[],       // families | catechists | travelers | all
  featured: boolean,
  location: string | null,  // Human-readable place
  region: string | null,    // Region id
  cost: "free" | "paid" | "mixed" | null
}
```

### Mass finder tool (outbound)
```js
{
  id: string,
  name: string,
  description: string,
  trustLabel: string,
  homeUrl: string,
  searchUrl: string,        // may include {place}
  geoUrl?: string           // may include {lat} {lng}
}
```

### Design principles for data
1. **Add by editing `js/data.js`** — no database required in v1
2. Every resource **must** have a trust label
3. Prefer linking out over hosting long content
4. Descriptions stay neutral and source-pointing (“See USCCB…” not “You must believe…”)

---

## Component inventory (v1)

| Component | Used on | Responsibility |
|-----------|---------|----------------|
| `SiteHeader` | All pages | Logo, nav, mobile menu |
| `SiteFooter` | All pages | Links, disclaimer line |
| `SearchBar` | Home, Directory | Large query input + submit |
| `CategoryGrid` | Home | Icon links to filtered directory |
| `CategoryIcon` | Home, Directory | Single category tile |
| `TrustBadge` | Cards, filters | Color-coded trust label |
| `ResourceCard` | Home, Directory | Name, desc, badge, link |
| `ResourceGrid` | Home, Directory | Card layout + empty state |
| `FilterBar` | Directory | Category + trust filters |
| `DisclaimerBanner` | Home, About | Scope boundaries |

---

## Search behavior (v1)

Client-side only:
1. Normalize query (lowercase, trim, strip accents)
2. Match against `name`, `description`, `tags`, `location`, `region`, category names
3. Optional filters: category, trust label, region
4. Sort: featured first, then trust priority, then name

Query string params:
- `?q=confession`
- `?category=mass-confession`
- `?trust=official-church`
- `?region=us-northeast`
- `find-mass.html?place=Chicago,%20IL`

## Location / Find Mass

1. User enters place text or grants geolocation
2. `buildFinderLinks` produces outbound tool URLs (optional lat/lng)
3. `findLocalResources` scores directory items against place keywords
4. `matchRegions` surfaces related region directory filters

Reverse geocode (Nominatim) is best-effort; map tools still work with coordinates alone.

## Suggestions

- Validated client-side form → `localStorage` key `lumen-wonder-suggestions`
- Exportable JSON matches the Resource schema for pasting into `data.js`
- Optional `site.suggestEmail` enables mailto handoff
- No auto-publish

---

## Visual system

**Inspiration:** Angi / TaskRabbit — clean, trustworthy, modern. Soft pastels without fluff. Solid and approachable for men and families.

| Token | Role |
|-------|------|
| Warm off-white `#F7F6F3` | Page background |
| White `#FFFFFF` | Cards / surfaces |
| Deep navy `#1E3A5F` | Primary actions, headings |
| Soft blue `#4A7C9B` | Links, secondary accent |
| Warm sand `#C4A882` | Soft highlight (not ornate gold) |
| Slate gray `#5C6570` | Body / muted text |

Typography: system UI stack + optional Inter — large, clear, high contrast.  
Icons: simple line icons (inline SVG). No photo focus in v1.

---

## Expansion path

1. **v1 (now)** — Static pages, seed data, search + categories + cards
2. **v1.1** — More resources, better tags, location filters for Mass/shrines
3. **v2** — Static site generator or lightweight framework; resource detail pages
4. **v3** — Optional short “careful answers” with citations; contribution workflow

Keep the data shape stable so a future CMS or API can map 1:1 onto `Resource`.
