# Wabi Sabi Services — Full Site Audit (v2)

**Date:** 2026-06-25 · **Branch:** feat/luxury-neighborhood-seo · **Method:** 5 parallel specialist re-audits (Technical SEO, GEO/Local, AEO, Brand, Anti-AI), each comparing the post-remediation tree to v1 (`docs/SITE_AUDIT.md`). Read-only.
**Predecessor:** `docs/SITE_AUDIT.md` (v1). **Remediation:** `docs/AUDIT_LEDGER.md` (all 4 phases) + `/iterate 4` (converged, all reviewers ≥80).

## Headline
v1's defining problem — *"two sites in one"* (a strong rebranded core beside untouched, off-brand, schema-less, AI-written legacy pages) — is **gone**. Every v1 **Critical** and **Major** finding is resolved. The site now ships universal per-page meta, full-site prerendered JSON-LD with a resolvable co-typed Organization/LocalBusiness entity, one consistent quiet-luxury / $150-consultation voice, and clean NAP. What remains is **polish** (no Critical, one Major: meta/title length).

Build state at audit: `tsc` clean; `npm run build` green; 49 route + 20 area = **69 prerendered pages**; main bundle 471 kB (was 1.07 MB single).

---

## v1 → v2 status by dimension

### Technical SEO
| v1 finding | Status |
|---|---|
| Prerender only `/areas/*` | ✅ Resolved — 69 routes prerendered with title/meta/JSON-LD |
| ~36 pages no `<SEO>` (dup meta) | ✅ Resolved — 0 pages missing `<SEO>` |
| Blog double `<h1>` | ✅ Resolved — single h1/post |
| No noindex on Cart/Checkout/Success | ✅ Resolved — `noindex` prop applied |
| Services hub/Home no schema/breadcrumb | ✅ Resolved |
| Seasonal no SEO/schema, slug 404s, stale dates | ✅ Resolved |
| 1.07 MB single bundle | ✅ Resolved — route-level code-splitting |
| robots.txt no AI crawlers | ✅ Resolved |
| Orphaned /key-takeaways, legal not in footer | ✅ Resolved |
| Favicon hot-linked | ✅ Resolved — self-hosted |
| NotFound outside Layout/200 | ◑ Partial — in Layout + noindex; SPA still returns 200 (host-level only) |

### GEO / Local
| v1 finding | Status |
|---|---|
| NAP: `info@`, mixed phone formats | ✅ Resolved — 0 `info@`; uniform formats |
| Per-area geo defined but unused | ✅ Resolved — GeoCoordinates emitted (runtime + static) |
| LocalBusiness thin areaServed; 50 km radius too broad | ✅ Resolved — 23-Place areaServed, GeoCircle removed |
| Google/Instagram sameAs | ✅ Consistent across all 3 schema sources |
| Westshore/Langford + Metchosin under-surfaced | ◑ Partial — now in schema + FAQ; still absent from About + Areas-Index **prose** |

### AEO
| v1 finding | Status |
|---|---|
| FAQ/home/services invisible to non-JS crawlers | ✅ Resolved — full-site prerender |
| FAQ best asset JS-gated | ✅ Resolved — FAQPage (26/26) in static `/faq` |
| Blog no Article schema | ✅ Resolved — BlogPosting on all 12 |
| Seasonal no Product/Offer | ✅ Resolved — Product/Offer (CAD) on 24 |
| Uncited stats | ✅ Resolved — removed/softened |
| robots no AI crawlers | ✅ Resolved |
| `#organization` dangling on prerendered pages | ✅ Resolved — co-typed Org/LocalBusiness node on every page |
| FAQ single-sourced | ◑ Partial — schema single-sourced (`src/data/faqItems.ts`); visible accordion still hardcoded (parity OK today, drift risk) |

### Brand
| v1 finding | Status |
|---|---|
| KeyTakeaways worst page | ✅ Resolved — rewritten |
| PriceEstimator % off engine | ✅ Resolved — deleted |
| Consultation contradiction | ✅ Resolved — "$150 credited" everywhere; 0 "complimentary" |
| Legal contradictions | ✅ Resolved — one date/policy/name; §11 fixed |
| FallPumpkins stale/salesy | ✅ Resolved |
| Cart/Checkout "Installation" | ✅ Resolved → "Service"/"Service Address" |
| Down-market language site-wide | ✅ Resolved — 0 hits |
| About emojis | ✅ Resolved — lucide icons |
| Seasonal voice (24) | ◑ Mostly — 23/24 on-brand; FestiveEstate missed |

### Anti-AI writing
| v1 finding | Status |
|---|---|
| Seasonal estate "zenith/masterwork" clones | ✅ Resolved |
| 4 commercial clone paragraphs | ✅ Resolved |
| 24 hero triads | ✅ Resolved |
| Reviews testimonial triad / "meticulous" | ✅ Resolved |
| Blog formulaic / "Book X Clean" CTAs / uncited stats | ✅ Resolved |
| "bespokely" | ✅ Resolved |
| transform/curated/seamless/comprehensive (~22) | ◑ Down to ~8 stray (Blog excerpts, Organizing, legal) |
| Templated neighborhoods arrays | ◑ Wording varied; structural last-bullet repeats ×14 |
| Romaji "Design Principles" grids | ◑ 13 lower-tier seasonal pages still share the templated grid |

---

## Remaining backlog (v2) — all Minor/Major-polish, no Critical

### Major
- **SEO-1 — Meta descriptions >155 and rendered `<title>` >60 on ~30+ pages.** The de-AI rewrites lengthened several descriptions (SeasideEstate ~187, BeachsideManor ~183, SpringRefresh ~179; Home/FAQ/About/Reviews 162–168). Titles exceed 60 once `" | Wabi Sabi Services"` (+22) is appended. Trim descriptions to ≤155 and shorten bare titles (or the suffix) — **in both the page `<SEO>` and the matching `scripts/prerender.ts` route entry (keep in sync).**

### Minor
- **SEO-2 — 4 routes not prerendered:** `/book` (sitemap priority 1.0!), `/careers`, `/terms-of-service`, `/client-agreement` → add to the prerender route table.
- **AEO/Anti-AI-1 — 13 "Design Principles" romaji grids** on lower-tier seasonal pages share an identical 4-card Japanese-term format. Replace with the per-page "How We Approach It" treatment already on the upgraded pages.
- **GEO-1 — Surface Westshore/Langford + Metchosin in served-area prose** on `About.tsx` and `pages/areas/Index.tsx` (schema already names them).
- **Anti-AI-2 — 8 stray banned words:** `Blog.tsx` excerpts (transforms, seamless), `Organizing.tsx:67` (curation), `TermsOfService.tsx` (comprehensive ×2, meticulous). Single-word swaps.
- **Anti-AI-3 — neighborhoods.ts lockstep final bullet** (×14, reworded but structurally identical) — drop on more records to break the pattern.
- **AEO-2 — Render the visible FAQ accordion from `faqItems`** (`FAQ.tsx`) instead of hardcoded JSX, to structurally guarantee visible↔schema parity.
- **GEO-2 — Runtime org = two nodes** (`LocalBusinessSchema` + `OrganizationSchema`) sharing one `@id` vs prerender's single co-typed node; merge for exact parity. De-dupe the near-duplicate "Oak Bay" Place entry in `areaServed`.
- **Brand-1 — 6 cosmetic copy nits:** `FestiveEstate.tsx:76,78` (missed de-AI page — louder heading + flat opener), `BeachsideManor.tsx:78-81` (restated image), `BotanicalEstate.tsx:78`, `GrandCelebration.tsx:66`, `SummerSerenity.tsx:169` (dangling clauses).

### Watch / confirm (not defects)
- **Soft-404:** unknown routes render NotFound (noindex) but return HTTP 200 — needs a host-level 404 rule if desired (SPA limitation).
- **Future-dated blog:** `/blog/july-2026` (datePublished 2026-07-01) is prerendered ahead of its date — confirm content-calendar intent.

---

## Posture summary
v1 had Critical issues in SEO (no prerender/meta), AEO (FAQ invisible), and Brand (KeyTakeaways, discounts, contradictions). **v2 has none.** The remaining list is one Major (length trims) and a set of Minor polish items concentrated in the lower-tier seasonal pages (romaji grids) and a few stray words — the difference between "excellent" and "flawless." Recommended next pass ("Phase 5 polish") would clear SEO-1, SEO-2, GEO-1, and the romaji grids to reach uniform top-shelf quality.
