# Scope of Work: SEO/AEO/GEO + Premium Rebrand — Wabi Sabi Services

**Document type:** Product specification / implementation plan
**Target repo:** `wabi-sabi-harmony-main`
**Reference repo:** `pearly-s-Website`
**Date:** 2026-06-12
**Research basis:** `docs/SEO_RESEARCH_VICTORIA.md` (do NOT fabricate beyond it)

---

## 0. Executive Summary

This initiative adds a family of **neighborhood landing pages** (local SEO/GEO), an **answer-engine layer** (AEO via FAQ + BreadcrumbList + Service schema), and a **premium copy refresh** that saturates the site with the "bespoke concierge / quiet luxury" positioning. The architecture mirrors Pearly's proven reusable `NeighborhoodPage` pattern but is adapted to WabiSabi's existing components (`SEO.tsx`, `structured-data/*`, `Layout.tsx`) and elevated brand voice.

The core deliverable is a single reusable `NeighborhoodPage` component fed by a typed data array, rendering 18 neighborhood pages across 3 phased tiers, each carrying unique per-neighborhood facts (sourced only from the research file) to avoid thin/duplicate content.

---

## 1. Key Architectural Decisions

### DECISION-1: Route family = `/areas/<slug>`
- Brand fit (concierge covers cleaning + organizing + errands, not just cleaning).
- Mirrors Pearly's proven `/areas/<slug>` taxonomy (reuse breadcrumb + schema).
- Avoids collision with existing `/services/cleaning`.
- Scalable for future area content.

### DECISION-2: Add an `/areas` index hub page
Required so the breadcrumb middle node "Service Areas" resolves to a real URL, and to provide an internal-linking nexus + single crawl discovery surface.
**`/areas` index ACs (AC-H1..H3):** H1 title `Service Areas | Wabi Sabi Services` (via `SEO title="Service Areas"`), meta description (concierge-toned, lists region: "Greater Victoria, Saanich Peninsula, Oak Bay"), canonical `https://wabisabiservices.ca/areas`; exactly one `<h1>` ("Bespoke Concierge Cleaning Across Greater Victoria"); renders ALL 18 area links grouped under brand section headings ("Flagship Estates" / "Coastal & Executive" / "Heritage & Urban"); emits a `BreadcrumbList` (Home → Service Areas) and may emit a `Service` schema for the region. Renders `<Layout>` internally.

### DECISION-3: Data-driven pages (single source of truth)
Pages MUST be driven by `src/data/neighborhoods.ts`. Each route renders `<NeighborhoodPage data={neighborhoods['uplands']} />`. Guarantees schema consistency, prevents drift across 18 near-identical pages, makes duplicate-content mitigation auditable.

### DECISION-3.5: Crawlability / rendering (SPA + Vercel) — REQUIRED understanding
The site is a client-rendered Vite SPA. Two distinct concerns:
- **Deep-link 404s:** ALREADY SOLVED — `vercel.json` rewrites `/(.*)` → `/index.html`, so a direct hit to `/areas/uplands` serves the app (React Router then renders the page). No new redirect/rewrite file needed. (Verify `vercel.json` is unchanged.)
- **JS-rendered indexing lag:** Googlebot renders JS but with delay, and other AI/answer engines (and social scrapers) often do NOT execute JS — so client-only meta/JSON-LD is weaker for AEO/GEO. **In scope (recommended): add build-time prerendering** of all static routes (esp. `/areas/*`, `/faq`, service pages) so each ships real HTML with its meta + JSON-LD. Approach: use **`vite-react-ssg`** (maintained, Vite-native — PREFERRED; `react-snap` is largely unmaintained since 2019, reference only); acceptance = `dist/areas/uplands/index.html` (or equivalent) contains the rendered H1, meta description, and JSON-LD without executing JS. If prerendering proves infeasible in the build window, it may be deferred to a fast-follow, but the plan MUST ship the page HTML/meta correctly so prerender is a drop-in. **AC-X1:** prerender produces static HTML for every `/areas/*` route containing title, meta description, and ≥1 JSON-LD block; OR a documented deferral with rationale.

### DECISION-4: Stale-price handling rule ("Qualitative Framing Rule") — BINDING
> No precise dollar figure from research may appear in rendered copy/meta. Convert to qualitative bands:
> - `< $2M median` → "multi-million-dollar homes"
> - `$2M–$4M` → "estates in the multi-million-dollar range"
> - `$4M+`/record → "trophy estates" / "some of Vancouver Island's most valuable homes"
> - Named record sales → reference street/property as a *landmark of value*, no number.
>
> Heritage facts, architect names, park names, materials, sq-ft character, landmarks ARE permitted verbatim. EXCEPTION: a current figure may be used only if an implementer verifies a live VREB benchmark and adds a dated source comment. Default = qualitative.

---

## 2. Neighborhood Landing Pages

### 2.1 Final list & phasing (18 pages)
Slugs lowercase-hyphenated, stable, must byte-match across routes/sitemap/JSON-LD/nearbyAreas.

**Tier 1 — Flagship (Phase 1):** uplands, oak-bay, rockland, ten-mile-point, cadboro-bay, north-saanich, willis-point
**Tier 2 (Phase 2):** fairfield, gordon-head, broadmead, cordova-bay, dean-park, prospect-lake, sidney, metchosin
**Tier 3 / Urban (Phase 3):** james-bay, downtown-victoria, gonzales

Out of scope v1: Queenswood (fold into Cadboro Bay), East Sooke, Bear Mountain.

### 2.2 Per-page featured facts (MUST surface; from research only)
1. **Uplands** — Olmsted garden suburb (John Charles Olmsted, 1907); National Historic Site (2019); serpentine roads + Garry oak meadows; Riffington estate (1913, architect Philip A. Jullien, Tudor Revival); heritage-preservation compliance; salt-air remediation; sandstone/Indiana limestone, marble, cast limestone, heritage millwork. → "trophy estates."
2. **Oak Bay** — 100+ heritage props; Samuel Maclure (~500 homes, half-timbering); Bowker Gates (1913), Royal Victoria Yacht Club, Uplands Park, 400-yr Garry oaks; cast limestone fireplaces, wrought iron, marble, heritage windows; salt-air.
3. **Rockland** — "Nob Hill" Victorian/Edwardian; Craigdarroch Castle + Government House (2 NHS); Maclure & Rattenbury; heritage-designation constraints; stone masonry/half-timbering/Victorian chimneys.
4. **Ten Mile Point** — rocky Haro Strait peninsula; mid-century + contemporary oceanfront-bluff estates; floor-to-ceiling glazing; Ecological Reserve; extreme salt-spray; view-glass; deep-water moorage; local stone, Douglas fir, heated concrete, teak/Ipe. Ultra-privacy.
5. **Cadboro Bay** — seaside village + heritage/character homes; **Queenswood Drive** oceanfront estates (in-ground pools, private docks) — *lead with this, fold Queenswood here*; Cadboro-Gyro Park sandy beach; UVic-adjacent (academic/professional clientele); salt-spray window/exterior care. (Do NOT use the "Cadborosaurus" sculpture — tourist novelty, off-brand for quiet luxury.)
6. **North Saanich** — Lands End Road waterfront corridor (landmark-of-value, no $); acreage/ALR/equestrian; marinas (Canoe Cove, Deep Cove); 7,000+ sq ft estates + guest houses; yacht/moorage; absentee near YYJ; floor-to-ceiling glass, stone, smart-home.
7. **Willis Point** — ultra-secluded (~150 homes) above Tod Inlet near Butchart; single access road; timber-frame/post-and-beam; Gowlland Tod Park; forest debris on cedar/timber; long-vacancy inspection; EPITOME of quiet-luxury/discreet-concierge (lead with this).
8. **Fairfield** — "most stable market"; Ross Bay Villa (1865, Gothic Revival); Arts & Crafts/Craftsman/Edwardian; Dallas Road salt-spray; Cook Street Village, Moss Street Market, Beacon Hill Park; heritage finish care.
9. **Gordon Head** — UVic-adjacent; 1950s–80s + renovated West Coast; Mount Douglas (PKOLS); engineered/old fir hardwood, heated concrete, quartz/stone, cedar; professional/empty-nester.
10. **Broadmead** — master-planned executive (late 1970s+); cul-de-sacs; Rithet's Bog, Elk/Beaver Lake; marble/granite, hardwood, stone foyers, cedar shakes, smart-home; 3,000–5,000+ sq ft; absence management; referral culture.
11. **Cordova Bay** — beachfront Cordova Bay Road; Mattick's Farm; Cordova Bay Golf Course; The Ridge; Haro Strait/San Juans; West Coast timber, cedar/fir, glass, granite/slate, ipe; vacation homes; salt-air; absentee key-holding; event turnover.
12. **Dean Park Estates** — elevated executive estates beside John Dean Provincial Park; Patricia Bay/Saanich Inlet/Gulf Islands/Olympic views; timber/cedar, granite/limestone, glazing, oak, smart-home; commuter absentee; 4,000–7,000 sq ft; view-glass.
13. **Prospect Lake** — rare lakefront luxury; Prospect Lake/Munn/Sparton Rds; Francis/King & Thetis Lake parks; cedar/fir, fieldstone, wide-plank oak, triple-pane glazing; pollen/algae/moisture care; seasonal open/close; boat/dock.
14. **Sidney** — upscale seaside town; "Retirement Capital"/Booktown; oceanfront condos (Coast Waterfront Residences); minutes to YYJ & Swartz Bay; Salish Sea/Gulf Islands; retirees + second-home; condo salt-air.
15. **Metchosin** — semi-rural acreage; Juan de Fuca oceanfront; privacy; rural-estate care. (Research sparse — keep lean, no invented facts.)
16. **James Bay** — oldest BC residential neighbourhood (1850s); 150+ heritage buildings; Helmcken House (c.1852), Woodlands (1861); Victorian/Edwardian/Italianate/Queen Anne; Dallas Road, Ogden Point, Beacon Hill, Parliament; lock-and-leave condos (Shoal Point, Harbourside); heritage finish care.
17. **Downtown Victoria** — heritage conversions + towers (Customs House, Morley Soda Factory 1875, The Pearl, The Falls); Inner Harbour, David Foster Pathway; marble baths, granite/quartz, glass; lock-and-leave, pied-à-terre/corporate, white-glove.
18. **Gonzales (South Oak Bay)** — oceanfront hillside enclave with panoramic Juan de Fuca Strait views; historic Gonzales Observatory (75+ yrs) landmark; protected beaches and secluded cul-de-sacs; established heritage/character homes with large lots adjacent to Oak Bay's Maclure legacy; salt-air degradation of marble/heritage windows; discreet care for an affluent, tranquil pocket. → "multi-million-dollar oceanfront homes."

**Fixed patterns:** title `Luxury Cleaning in {Name}, Victoria`; H1 `Bespoke Concierge Cleaning in {Name}`; meta ≤155 chars qualitative + 1 landmark; canonical `https://wabisabiservices.ca/areas/{slug}`.

### 2.3 Reusable `NeighborhoodPage` component
**File:** `src/components/NeighborhoodPage.tsx`. Uses WabiSabi `Layout`, `SEO`, extended `ServiceSchema`, new `BreadcrumbSchema`; shadcn `Button`/`Card`; lucide icons. (No `LocalBusinessAreaSchema` — see §5.3.)

```ts
export interface NeighborhoodNearby { name: string; slug: string }
export interface Neighborhood {
  name: string; slug: string; tier: 1 | 2 | 3;
  metaDescription: string;      // ≤155 chars, qualitative pricing
  heroTagline: string;
  intro: string;
  localContext: string[];       // paragraphs (NOT \n-delimited — avoids Pearly's split bug)
  whyLuxuryHere: string[];
  heritageMaterials: string[];
  conciergeServices?: string[];
  nearbyAreas: NeighborhoodNearby[];
  geo?: { lat: string; lng: string };
  ogImage?: string;             // optional per-area OG image; defaults to /og-image.png (shared OK v1)
}
interface NeighborhoodPageProps { data: Neighborhood }
```

**Sections (in order):** (1) Hero w/ visual breadcrumb + H1 + tagline + intro + CTAs + trust line; (2) Local Context paragraphs; (3) Why Luxury Cleaning Here (checked list); (4) Materials & Heritage Care; (5) Concierge Services (3 cards → /services/*); (6) **Google Reviews trust band** — one line ("See why discerning Victoria homeowners choose us") + link to the existing Google Reviews URL (`https://share.google/qpmn3a6VHcDFweao6`, same as Layout footer) — provides a real trust anchor without fabricated reviews; (7) Nearby Areas pills → /areas/{slug}; (8) closing CTA → /contact.

**Styling contract (match existing visual language — no new design system):** Hero = full-bleed CSS background section with overlay, identical pattern to `Home.tsx` hero (lines 19–50) — per-area photography is out of scope, so differentiate via the unique H1/copy and an area-appropriate existing asset (`src/assets/*`). Concierge cards = shadcn `<Card>` exactly as the "Featured Services" cards in `Home.tsx` (lines 92–142). Nearby-area pills = `<Button variant="outline" size="sm" asChild>` wrapping `<Link>` (or shadcn `<Badge variant="outline">` inside a Link). Section spacing/typography = copy the `py-32 px-6 lg:px-12` + `font-serif` heading patterns used across `Home.tsx`/`Services.tsx`. Do NOT invent new colors or fonts.

**ServiceSchema call signature (exact, for implementer):**
```tsx
<ServiceSchema
  name={`Bespoke Concierge Cleaning in ${data.name}`}
  description={data.metaDescription}
  serviceType="Luxury House Cleaning & Concierge"
  areaServed={`${data.name}, Victoria, BC`}
  areaServedType="Place"
/>
```

**Per-page JSON-LD:** Service (areaServedType "Place", provider references `#organization`), BreadcrumbList (Home → Service Areas → name). NOTE: do NOT emit a third full LocalBusiness entity per page (see §5.3 — collision-safe redesign); geo relevance is carried by Service.areaServed.

**Acceptance (NeighborhoodPage):** AC-N1 all 8 sections; AC-N2 valid schema (Rich Results Test); AC-N3 paragraphs as `<p>` (no literal `\n`); AC-N4 no $ figures; AC-N5 valid nearby slugs; AC-N6 one `<h1>`, `<h2>` sections; AC-N7 canonical correct; AC-N8 ≥250 unique words/page; **AC-N9 (accessibility):** decorative lucide icons `aria-hidden="true"`; nearby-areas list wrapped in `<nav aria-label="Nearby service areas">`; all link text self-descriptive (no bare "here"); hero background image conveyed via CSS (decorative) or, if an `<img>`, meaningful `alt`; visible focus states retained from shadcn defaults.

### 2.4 `nearbyAreas` adjacency map (use EXACTLY these — prevents AC-N5 slug failures)
Each page links 4–5 of these (all slugs verified against §2.1):
- **uplands** → oak-bay, gonzales, cadboro-bay, rockland, ten-mile-point
- **oak-bay** → uplands, gonzales, rockland, fairfield, cadboro-bay
- **rockland** → oak-bay, fairfield, uplands, james-bay, gonzales
- **ten-mile-point** → cadboro-bay, gordon-head, uplands, oak-bay
- **cadboro-bay** → ten-mile-point, gordon-head, uplands, oak-bay
- **north-saanich** → sidney, dean-park, cordova-bay, willis-point
- **willis-point** → prospect-lake, broadmead, cordova-bay, north-saanich
- **fairfield** → oak-bay, rockland, james-bay, downtown-victoria, gonzales
- **gordon-head** → cadboro-bay, ten-mile-point, broadmead, cordova-bay
- **broadmead** → cordova-bay, prospect-lake, gordon-head, willis-point
- **cordova-bay** → broadmead, gordon-head, dean-park, north-saanich
- **dean-park** → north-saanich, sidney, cordova-bay
- **prospect-lake** → willis-point, broadmead, gordon-head
- **sidney** → north-saanich, dean-park, cordova-bay
- **metchosin** → downtown-victoria, james-bay, fairfield  *(remote; light cross-links acceptable)*
- **james-bay** → downtown-victoria, fairfield, rockland, oak-bay
- **downtown-victoria** → james-bay, fairfield, rockland
- **gonzales** → oak-bay, uplands, fairfield, rockland

---

## 3. Routing + Discovery Wiring

### 3.1 `src/App.tsx`
Explicit static routes mapped from data array, before NotFound catch-all:
```tsx
<Route path="/areas" element={<AreasIndex />} />
{Object.values(neighborhoods).map((n) => (
  <Route key={n.slug} path={`/areas/${n.slug}`} element={<NeighborhoodPage data={n} />} />
))}
```
NeighborhoodPage/AreasIndex render `<Layout>` internally (like `About.tsx:8` / `Services.tsx:10`). **GUARD:** do NOT also wrap the route element in `<Layout>` in App.tsx — that would double-render header/footer AND the Layout-level `LocalBusinessSchema`/`OrganizationSchema`. Follow the About/Services pattern, NOT the Home exception (`App.tsx:86` `<Layout><Home/></Layout>`).
**Hosting:** existing `vercel.json` rewrites all paths → `/index.html`, so deep links to `/areas/*` already resolve; no new redirect file required (do not modify `vercel.json`).
**AC-R1:** each `/areas/{slug}` renders with exactly one header/footer; `/areas` index renders; unknown → NotFound.

### 3.2 `public/sitemap.xml`
Add `Service Area Pages` block (lastmod 2026-06-12, changefreq monthly, priority 0.9 for /areas+Tier1, 0.8 Tier2/3). 19 URLs: `/areas` + all 18 slugs.
**AC-R2:** all 19 well-formed, slugs byte-match.

### 3.3 `src/components/Layout.tsx`
Header (desktop): single restrained `Areas` link → `/areas`. Footer: `Service Areas` list (≥7 Tier-1 areas + "All Service Areas" → /areas).

**MOBILE NAV (Major gap — MUST address):** the current `Layout.tsx` has NO mobile menu — below `lg`, only a "Book Now" button shows; About/Services/FAQ/Contact/Areas are all `hidden lg:flex` and unreachable on phones (and for mobile-first crawling). This initiative MUST add a mobile menu: a hamburger trigger (shadcn `Sheet` or `DropdownMenu`) visible `lg:hidden` that exposes About, Services (+ sub-links), Areas, the core nav array, Cart, and Book Now. Reuse existing `navigation`/`servicesLinks` arrays so it stays in sync.
**AC-R3:** `Areas` + all primary nav reachable from the header on BOTH desktop AND mobile (≤`lg`); footer lists ≥7 area links + /areas.

### 3.4 Internal linking
`/areas` index links all 18 (grouped by brand sections "Flagship Estates"/"Coastal & Executive"/"Heritage & Urban", NOT "Tier 1/2/3"). Nearby-area interlinking 4–6 adjacency per page. Home "Where We Serve" → /areas + 4 flagships. Services/sub-pages closing link → /areas.
**AC-R4:** every area ≤2 clicks from Home; no orphans; all internal links resolve.

---

## 4. Premium Copy Refresh (file-level intent)

### 4.1 `Home.tsx`
Hero subhead → bespoke concierge for discerning homes. Elevate "Why" cards to concierge register (vetted/discreet/heritage-aware, museum-level). NEW "Where We Serve" section after Featured Services → /areas + 4 flagships (Uplands, Oak Bay, Rockland, North Saanich).
- **HERO PRICEESTIMATOR — REMOVE from hero (brand-critical):** `PriceEstimator.tsx` renders a flat-rate grid (~$140–$445) with explicit discount tiers (20% weekly / 15% bi-weekly). A discount price calculator as the first hero element is the sharpest contradiction of quiet-luxury positioning. **Replace the hero estimator with a "Request a Private Consultation" primary CTA → `/contact`** (and keep "Explore Services"). The estimator component may be relocated to `/book` (where a price expectation is appropriate) or retired — implementer's choice, but it MUST NOT appear in the Home hero. This supersedes the earlier "keep estimator" note.
**AC-C1:** "bespoke"+"concierge" above fold; "Where We Serve" → /areas; **no price/discount widget in the Home hero**; hero primary CTA is consultation-led.
- **`$150` consultation figure (Home "Curated Care Plan", ~line 165):** this is a named *service-fee disclosure* (credited to first booking), NOT a market-price/discount claim — it is a PERMITTED exception to the Pricing Rule and the §10 grep. Decision: KEEP but reframe to lead with the value ("a private in-home consultation, credited in full toward your first service") rather than leading with the number. Document this exception so the §10 grep hit on `$150` is expected, not a violation.

### 4.1b Testimonials / reviews integrity (`Home.tsx`, `Reviews.tsx`) — brand + trust
The existing review quotes are attributed to "Bear Mountain" (out-of-scope, off-brand) and have NO verifiable source (`Home.tsx:189`; `Reviews.tsx:13,22`; Reviews SEO meta also references Bear Mountain). Fabricated/placeholder testimonials are a consumer-trust risk.
- Replace out-of-scope/unsourced attributions: re-attribute to an in-scope luxury area (e.g., Uplands, Oak Bay, Rockland) ONLY if the quote is genuine and the client consented; otherwise the quote must be removed or clearly generalized.
- **This requires owner confirmation** (are these real, consented testimonials?). Flag as an open item; default action if unconfirmed = remove the specific neighborhood attribution rather than publish unverifiable claims.
- Surface the real Google Reviews link (already in Layout footer) as the trust path instead of unverifiable quotes.
**AC-C5:** No "Bear Mountain" attribution remains in Home/Reviews/Reviews-meta; no unsourced testimonial presented as a specific named-client claim without owner confirmation; Google Reviews link surfaced as trust anchor.

### 4.2 `Services.tsx`
Intro → white-glove/discreet/estate-capable. Elevate 4 cards (Consistent=dedicated vetted pro; Discretion=NDA-grade). CTA → "Begin with a private consultation." Closing → /areas.
**AC-C2:** links /areas; no discount language.

### 4.3 `About.tsx`
Layer concierge for absentee/estate owners + heritage expertise + discretion. Elevate values cards. Expand served-areas closing → /areas; REMOVE "Bear Mountain."
**AC-C3:** estate/concierge/heritage + /areas link; Bear Mountain removed.

### 4.4 Service sub-pages
`Cleaning.tsx` line ~27 "throughout Vancouver" → "throughout Victoria" (MANDATORY factual fix). Add heritage & fine-materials paragraph (marble/limestone/heritage windows/salt-air). Each sub-page closing → /areas.
**AC-C4:** Vancouver→Victoria fixed; sub-pages link /areas.

---

## 5. New / Extended Schema Components (`src/components/structured-data/`)

### 5.1 Extend `ServiceSchema.tsx`
Add `areaServedType?: "City" | "Place"` (default "City"); backward compatible.
**AC-S1:** existing `/services/cleaning` output byte-identical when omitted.

### 5.2 New `BreadcrumbSchema.tsx`
`{ items: {name,url}[] }` → BreadcrumbList with sequential 1-based positions, absolute item URLs.
**AC-S2:** positions sequential; URLs absolute.

### 5.3 ~~New `LocalBusinessAreaSchema.tsx`~~ — REMOVED (collision-safe redesign)
**Do NOT emit a third `LocalBusiness` entity per page.** `Layout.tsx` already renders both `LocalBusinessSchema` and `OrganizationSchema`, BOTH using `@id: "https://wabisabiservices.ca/#organization"`. Emitting another full `LocalBusiness` node with that same `@id` on every area page creates a duplicate/ambiguous entity that Google's validator flags.
**Instead:** geo/area relevance is carried entirely by the per-page **`ServiceSchema`** (with `areaServedType: "Place"`) plus the **`BreadcrumbList`**.
**CORRECTION (verified):** `ServiceSchema.tsx`'s current `provider` block is NOT a bare reference — it re-declares `{ "@type":"LocalBusiness", "@id":"...#organization", "name":..., "url":... }` (4 props). A partial re-declaration sharing the same `@id` merges into the same node (acceptable), but to be clean, **slim the `provider` to a bare `{ "@id": "https://wabisabiservices.ca/#organization" }`** in `ServiceSchema.tsx` so the full identity lives only in the Layout-level `OrganizationSchema`/`LocalBusinessSchema`.
**Pre-existing co-typing (intentional, document it):** `OrganizationSchema` and `LocalBusinessSchema` both emit `@id: #organization` with different `@type` — this is valid co-typing of one node (Organization + LocalBusiness); leave as-is, add a one-line code comment noting it's intentional.
**AC-S3:** No area page emits a second/third full `LocalBusiness`/`Organization` entity; `provider` slimmed to bare `@id`; Rich Results Test shows exactly one identity for `#organization`.

### 5.5 Remove fabricated `aggregateRating` (consistency with §7 non-goal)
`LocalBusinessSchema.tsx` hardcodes `aggregateRating` `{ ratingValue: "5.0", reviewCount: "24" }`. This is rendered site-wide (via Layout) and is **fabricated review data** — directly contradicting the §7 non-goal and Google's policy (rich-result manipulation risk). **Remove the `aggregateRating` block** unless the owner can supply a real, auditable review count/value (then source it). **AC-S4:** no fabricated `aggregateRating` ships; either removed or owner-verified with source.

### 5.4 `index.ts` — export `BreadcrumbSchema` (and keep existing exports). `LocalBusinessAreaSchema` is NOT created.

---

## 6. AEO / Answer-Engine Layer

### 6.2 `FAQ.tsx` — add 8 local-intent Q&As to BOTH visible accordion AND `faqItems` array (visible+schema parity):
1. Luxury cleaning in Oak Bay & Uplands? 2. Heritage homes/historic finishes? 3. Waterfront/salt-air estates? 4. Concierge for absentee/second-home owners? 5. Vetted/discreet for high-value estates? 6. "Which luxury neighbourhoods near me do you serve?" (+ /areas link) 7. Luxury condos Downtown/James Bay? 8. Very large estate homes?
**EXISTING discount copy to fix:** the current `faqItems` "How is pricing determined?" / "What frequency should I choose?" answers contain "up to 20% off for weekly cleaning" and percentage-discount tiers (also in `PriceEstimator`). This down-market language contradicts quiet-luxury. Reframe to qualitative commitment language ("preferred rates for ongoing care plans", "tailored to your home and cadence") — remove explicit "% off" from FAQ answers.
**AC-A1:** 8 Qs in accordion + array. **AC-A2:** no prices/percent-discounts in ANY FAQ answer (new OR existing). **AC-A3:** NAP consistent (`+1-250-896-5971`/`(250) 896-5971`, `hello@wabisabiservices.ca`, "Victoria, BC").

### 6.3 Conversational guidance
Natural-language H2s mirroring voice search; ≥1 question-form heading per area page; NAP consistency enforced.

---

## 7. Non-Goals & Visual Direction
**Non-goals:** No backend/CMS/DB; no fabricated Review/AggregateRating; no blog/seasoning changes; no flat-rate prices on area pages; no Queenswood/East Sooke/Bear Mountain pages v1; no analytics changes; no precise VREB figures unless build-time-verified.

**Visual direction (per-neighborhood photography is out of scope v1, but differentiation is NOT):** area pages reuse existing `src/assets/*` imagery, but each page MUST feel distinct via (a) its unique H1/copy, (b) an area-appropriate existing hero asset (don't use the identical image on adjacent pages where avoidable), and (c) a consistent CSS overlay/typography treatment matching `Home.tsx`. Per-area hero photography and custom per-area OG images are a recommended fast-follow (the `Neighborhood.ogImage` field exists to drop these in later). Explicitly: shared `/og-image.png` is acceptable for v1.

**Trust without fabrication:** every area page surfaces the real Google Reviews link (§2.3 section 6) as the social-proof anchor. Post-launch task (out of build scope): solicit Google reviews from flagship-area clients to populate that anchor.

---

## 8. Risks & Mitigations
- **Stale prices** → binding Pricing Rule + AC-N4/AC-A2.
- **Thin/duplicate content** → single neighborhoods.ts forces unique facts; AC-N8 ≥250 words; tier-specific landmarks/architects/materials.
- **Factual inaccuracy** → source only from research file; Metchosin kept lean.
- **NAP inconsistency** → AC-A3.
- **Schema errors** → AC-N2/S2/S3 Rich Results Test; reuse `#organization`.
- **Slug drift** → slugs defined once; AC-R2/R4 audits.
- **Pearly's `\n\n` bug** → localContext is `string[]`; AC-N3.
- **Nav clutter** → single header Areas link; depth in footer + hub.
- **SPA not indexed (CSR)** → prerender static HTML for static routes (DECISION-3.5, AC-X1); deep-link 404s already solved by `vercel.json`.
- **Mobile users/crawlers have no nav** → build mobile menu (§3.3, AC-R3).
- **Unsourced/off-brand testimonials** (Bear Mountain) → AC-C5 remove/confirm; surface real Google Reviews link instead of fabricated quotes.
- **Down-market cues** (hero price calculator, "% off") → remove estimator from hero + reframe discount copy (§4.1, §6.2).
- **Templated feel across 18 pages** → unique facts + varied hero assets + per-area copy (§7 visual direction).

---

## 9. Master Acceptance Checklist
Pages/component: AC-N1..N9 (incl. accessibility); all 18 + /areas render.
Routing/discovery: AC-R1..R4 (incl. mobile nav in AC-R3).
Copy/brand: AC-C1..C5 (incl. no hero price widget; no Bear Mountain/unsourced testimonials).
Schema: AC-S1..S3 (no duplicate `#organization` entity) + index exports.
AEO: AC-A1..A3 (incl. removing existing % discount language).
Crawlability: AC-X1 (prerender static HTML for /areas/* OR documented deferral).
Global: `npm run build` no TS errors; pricing-rule grep clean; all facts traceable to research.

---

## 10. Implementation Sequencing (parallelizable)

**Phase 0 — Foundation (serial, BLOCKING):**
1. Schema: create `BreadcrumbSchema.tsx`, extend `ServiceSchema.tsx` (`areaServedType`), update `index.ts` export. (NO `LocalBusinessAreaSchema` — see §5.3.)
2. `src/data/neighborhoods.ts` — type (incl. `ogImage?`) + all 18 records with §2.4 adjacency (Pricing Rule applied).
3. `src/components/NeighborhoodPage.tsx` (8 sections, styling contract, AC-N9 a11y).

**Then parallel workstreams:**
- **A — Routing/discovery:** App.tsx routes + `src/pages/areas/Index.tsx` (create `pages/areas/` dir) + sitemap.xml + Layout nav/footer + **mobile menu (AC-R3)**.
- **B — Premium copy + brand:** Home (remove hero estimator → consultation CTA; "Where We Serve"), Services, About (remove Bear Mountain), Cleaning (+Vancouver fix), Organizing, Errands, **Reviews/Home testimonials (AC-C5)**.
- **C — AEO/FAQ:** FAQ.tsx 8 new Q&As + reframe existing % discount answers.
- **D — Data authoring QA:** Tier records (independent rows).
- **E — Crawlability (after A):** prerender setup (`vite-react-ssg`/`react-snap`) or documented deferral (AC-X1).

> Coupling note: Workstream A (Layout nav/footer + mobile menu) and Workstream B both may touch `Layout.tsx`/`Home.tsx`? No — B touches `Home.tsx` content; A touches `Layout.tsx` only. Keep Home edits in B and Layout edits in A to avoid conflicts. Reviews.tsx is B-only.

**Phase Final — Integration audit:** §9 checklist; `npm run build` (must pass, no TS errors); Rich Results Test on Uplands/Willis Point/Downtown; zero internal 404s.
**Pricing-rule audit command (mechanical):**
```
grep -rniE '\$[0-9]|[0-9]+(\.[0-9]+)?\s*[mM]\b|[0-9]+\s*%|[0-9],[0-9]{3},[0-9]{3}' \
  src/data/neighborhoods.ts src/pages/areas/ src/pages/FAQ.tsx
```
Permitted matches (NOT violations): square footage ("7,000+ sq ft", "8,000–17,500 sq ft"), years (1907, 1913), street numbers, "Step 5". Any dollar amount, "$X", "$XM", or "X% off" IS a violation → fix.
**Prerender check (AC-X1):** confirm static HTML emitted per `/areas/*` route OR documented deferral.

```
Phase 0 (serial) ──► [ A ‖ B ‖ C ‖ D ] (parallel) ──► Final audit (serial)
```

## Files
**New:** `src/data/neighborhoods.ts`, `src/components/NeighborhoodPage.tsx`, `src/pages/areas/Index.tsx`, `src/components/structured-data/BreadcrumbSchema.tsx`. (Prerender config if AC-X1 done: e.g. `vite.config` change / `react-snap` postbuild script.)
**Modified:** `src/App.tsx`, `src/components/Layout.tsx` (nav + footer + **mobile menu**), `public/sitemap.xml`, `ServiceSchema.tsx` (areaServedType), `structured-data/index.ts`, `Home.tsx` (+ remove hero estimator + testimonials), `Services.tsx`, `About.tsx`, `Reviews.tsx` (testimonials/meta), `FAQ.tsx`, `services/Cleaning.tsx` (+Vancouver fix), `Organizing.tsx`, `Errands.tsx`. (`PriceEstimator.tsx` relocated/retired per §4.1.)
**NOT modified:** `vercel.json` (already handles SPA rewrites).
