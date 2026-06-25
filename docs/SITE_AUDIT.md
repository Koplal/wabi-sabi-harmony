# Wabi Sabi Services — Full Site Audit

**Date:** 2026-06-22 · **Branch:** feat/luxury-neighborhood-seo · **Method:** 5 parallel specialist audits (Technical SEO, GEO/Local, AEO, Brand consistency, Anti-AI writing), read-only.

## The one theme that explains almost everything
The site is **two sites in one**:
- **Tier A — the freshly rebranded core** (Home, About, Services + sub-pages, FAQ, the 19 `/areas` pages, Ritual, Contact). Strong: prerendered meta + JSON-LD on `/areas`, single H1s, on-brand quiet-luxury voice, clean NAP, breadcrumbs, FAQPage schema.
- **Tier B — the untouched older pages** (12 blog posts, 24 seasonal pages, KeyTakeaways, legal docs, Cart/Checkout). These lag on **every** dimension at once: missing meta, no schema, off-brand/down-market copy, AI-writing tells, stale dates, contradictions.

**Net:** ~80% of the open issues live in Tier B. The fastest path to a uniformly excellent site is to bring Tier B up to the `/areas` standard.

---

## CRITICAL (fix first — cross-cutting, high blast radius)

1. **Prerender covers only `/areas/*`** — *[SEO + AEO]*
   `scripts/prerender.ts` bakes static meta + JSON-LD only for area pages. Home, Services(+3 subs), **FAQ (the single best AEO asset — 26 Q&As + FAQPage schema)**, blog, seasonal ship as an empty SPA shell with **homepage meta** to non-JS consumers (social scrapers, GPTBot/ClaudeBot/PerplexityBot, first-pass crawl). → Generalize the prerender route table to cover home, services(+subs), faq, blog index+posts, seasoning index+packages, about, reviews, contact (inject per-route JSON-LD; ideally static body for FAQ/services).

2. **~36 pages render NO `<SEO>` at all → site-wide duplicate title/description** — *[SEO]*
   Only ~11 pages use `<SEO>`. All 11 non-August blog posts, the blog index, all 24 seasonal pages, Ritual/Careers/Book/KeyTakeaways/legal inherit `"Wabi Sabi Services | Mindful Luxury Cleaning | Victoria, BC"` verbatim. → Add unique title (≤60) + description (≤155) to each (titles/excerpts already exist in `Blog.tsx`/seasonal data).

3. **`KeyTakeaways.tsx` is the most off-brand + most AI-coded page** — *[Brand + Anti-AI]*
   Emoji headers (🌿✨📊…), **"Flexible service packages to fit your budget" / "Best value through regular service discounts"** (L72-73), a "Traditional vs Wabi Sabi" comparison table, fabricated stats ("90% retention", "5-star average", "100%"), "transform the ordinary act of cleaning into an extraordinary experience". Linked from the FAQ. → Rewrite in the Home/About voice or delete the page + its FAQ card.

4. **Consultation model contradicts itself** — *[Brand]*
   Home: paid **"$150, credited to your first service"**; Ritual/Cleaning/Organizing/Book: **"complimentary consultation"**; FAQ: silent. A premium brand can't be ambiguous about its intake. → Pick one (Home's "$150 credited" is the most intentional) and unify everywhere.

5. **Seasonal section (24 pages) is the worst overall** — *[SEO + AEO + Brand + Anti-AI]*
   No `<SEO>`, no schema; `FallPumpkins` shows stale "Sold Out for 2024 / 2025 packages" + red destructive badges; 4 estate pages are thesaurus-clones ("zenith of our seasonal artistry — a masterwork…"), 4 commercial pages share a verbatim paragraph; **slug mismatch** (index links omit the `the-` prefix that routes require → likely 404s). → SEO+schema pass, fix dates/slugs, de-template copy.

6. **Dead `PriceEstimator.tsx` with a "% off" discount engine** — *[Brand]*
   Not imported anywhere, but renders `(20% off)/(15% off)` and "Book your peace of mind now". A live landmine against the no-discount brand. → Delete it.

---

## MAJOR

7. **NAP inconsistencies** — *[GEO + Brand + AEO]*
   `TermsOfService.tsx:209` uses `info@wabisabiservices.ca` (everywhere else `hello@`). Phone appears as both `(250) 896-5971` (display, 4×) and `+1-250-896-5971` (20×) — pick one human-readable display format. → One email, one display phone.

8. **Legal pages contradict each other** — *[Brand]*
   Effective dates differ (Nov 2024 vs Nov 1 2025); cancellation policy stated 3 different ways (Terms vs ClientAgreement vs FAQ); "Wabi Sabi Services **Inc.**" vs "Wabi Sabi Services"; ClientAgreement section numbering skips 11. → Reconcile to one source of truth.

9. **Blog (12 posts): no Article schema, double `<h1>`, off-brand + uncited stats** — *[SEO + AEO + Brand + Anti-AI]*
   Each post has two `<h1>` (hero "Mindful Living Blog" + article title); zero `BlogPosting`/author/datePublished schema; transactional "Book Your X Clean" CTAs; the words bespoke/concierge/discreet/museum-level appear **0 times** in the entire blog; uncited stats ("50% less cleaning time", "27% more relationship stress", "15% better focus"). → Demote hero to non-h1, add Article schema, consultation CTAs, source/soften stats, light luxury-voice pass.

10. **Per-area geo coordinates defined but never used** — *[GEO]*
    `neighborhoods.ts` has an optional `geo` field; 0 of 19 populate it and `NeighborhoodPage` never reads it. Area-page `Service` schema emits only an `areaServed` name string. → Populate real lat/lng per enclave and emit `GeoCoordinates`. Highest-leverage hyperlocal win.

11. **LocalBusiness geo signals thin** — *[GEO]*
    No `areaServed` array of the 19 enclaves on the `#organization` node; 50 km `GeoCircle` overshoots the real footprint (reaches the US San Juans). → Add `areaServed` Place list (+ Greater Victoria/Saanich Peninsula/Oak Bay/Westshore); tighten radius to ~25-30 km.

12. **Services hub + Home lack schema/breadcrumbs** — *[SEO + AEO]*
    `Services.tsx` has SEO but no `Service`/`ItemList` schema; Home has no schema beyond the global Layout nodes; breadcrumbs exist only on `/areas`. → Add Service/ItemList to the hub; BreadcrumbList site-wide.

13. **Westshore/Langford under-surfaced** — *[GEO]*
    Bear Mountain is the only Westshore page, and "Westshore"/"Langford" appears nowhere in About/Areas-Index/FAQ served-area copy. → Name the Westshore (and Metchosin) in those served-area sentences.

14. **Cart/Checkout are e-commerce leftovers and indexable** — *[Brand + SEO]*
    "Installation" line item + "Installation Address" field (cleaning installs nothing); no `noindex`. → Rename to "Service"/"Service Address"; add `noindex` (extend `SEO.tsx` with a `noindex` prop); keep out of sitemap (already are).

15. **Seasonal packages have no Product/Offer schema** — *[SEO + AEO]*
    24 pages sell named packages with prices/availability and emit zero structured data. → Add `Product`/`Offer` (price, priceCurrency CAD, availability).

---

## MINOR / polish

- **Anti-AI vocabulary purge** *(site-wide)*: highest-frequency tells are *transform/transforms* (~22), *curated*, *seamless*, *comprehensive*, plus strained *"bespokely"* (`Organizing.tsx:42`). Break mechanical rule-of-three (24 seasonal hero triads; Reviews testimonial "Professional, discreet, and meticulous"); vary the lockstep last bullet repeated in every `neighborhoods.ts` `whyLuxuryHere`/`conciergeServices` array. *[Anti-AI]*
- **Emojis in `About.tsx` core-value cards** (🧘🌿🤝✨) — the one tone clash on a flagship page; replace with lucide icons or none. *[Brand + Anti-AI]*
- **Single 1.07 MB JS bundle, no code-splitting** (build warns >500 kB) — hurts Core Web Vitals (a ranking factor). → `React.lazy()` route splitting / `manualChunks`. *[SEO]*
- **`robots.txt` names no AI crawlers** — they fall under `*: Allow /` (not blocked), but add explicit `GPTBot`/`ClaudeBot`/`PerplexityBot`/`Google-Extended`/`CCBot` allows. *[AEO]*
- **`/key-takeaways` orphaned** — not in nav/footer/sitemap; legal links also absent from footer. → Add to footer or `noindex` if internal. *[SEO]*
- **Favicon hot-linked** from `storage.googleapis.com/...` with a space in the filename — fragile/unprofessional; self-host under `/public`. *[SEO + Brand]*
- **NotFound renders outside Layout, no `noindex`, returns 200** (soft-404 risk). *[SEO]*
- **Uncited blog statistics** — add sources or soften; AI engines distrust unverifiable precision. *[AEO + Anti-AI]*
- **FAQ minor visible-vs-schema drift** (a "products" bullet present in visible but not schema; condensed paraphrases). *[AEO]*
- **Future-dated blog posts** (through Jul 2026) — confirm intentional content calendar. *[AEO]*

---

## Section scorecard

| Section | SEO | GEO | AEO | Brand | Anti-AI |
|---|---|---|---|---|---|
| Home | ⚠ client-only meta | ✅ | ⚠ no extractable definition | ✅ strong | 🟡 low |
| About | ⚠ | ✅ | 🟡 | ✅ strongest page | 🟢 lowest |
| Services (+subs) | ⚠ hub no schema | ✅ | ⚠ | ✅ | 🟡 lexicon-heavy |
| FAQ | ⚠ not prerendered | ✅ | ✅ best asset (but JS-gated) | 🟡 residual phrasing | 🟡 med |
| Areas (19 + hub) | ✅ model section | ⚠ geo unused | ✅ | ✅ | 🟡 templated arrays |
| Blog (12) | ❌ no SEO, double-h1 | ✅ | ❌ no Article schema | ❌ off-brand | 🟡 formulaic |
| Seasonal (24) | ❌ no SEO/schema | ⚠ | ❌ | ❌ stale/salesy/clones | 🔴 worst |
| Legal | 🟡 | ⚠ info@ | n/a | ❌ contradictions | 🟢 |
| KeyTakeaways | ❌ | ⚠ | ❌ | 🔴 worst page | 🔴 |
| Cart/Checkout | ⚠ indexable | ✅ | n/a | ❌ "Installation" | 🟢 |

---

## Recommended remediation roadmap

**Phase 1 — Brand integrity & trust (fast, high-visibility):** rewrite/remove KeyTakeaways; delete PriceEstimator; unify the consultation model; fix `info@`→`hello@` + one phone format; reconcile legal pages; fix FallPumpkins dates + seasonal slug 404s; rename Cart/Checkout "Installation".

**Phase 2 — SEO/AEO coverage:** add `<SEO>` to all ~36 bare pages; extend `scripts/prerender.ts` to all key routes; add `noindex` to Cart/Checkout/CheckoutSuccess/NotFound; add `/key-takeaways` decision; robots.txt AI-crawler allows.

**Phase 3 — Structured data:** Article/BlogPosting on posts; Product/Offer on seasonal; Service/ItemList on the hub; BreadcrumbList site-wide; populate per-area `geo` + LocalBusiness `areaServed` array + tighter radius.

**Phase 4 — Content quality:** de-AI pass (purge transform/curated/seamless/comprehensive, break triads, vary templated arrays); blog luxury-voice + consultation CTAs + sourced stats; self-host favicon; route-level code-splitting for Core Web Vitals.

## Already strong (protect these)
The `/areas` system (prerendered raw-HTML meta + JSON-LD, single H1, Service+Breadcrumb schema, real local facts, interlinking), NAP hygiene across the rebranded core, the FAQPage schema parity (26/26), consistent Layout/header/footer, and the About page voice. These are the standard the rest of the site should match.
