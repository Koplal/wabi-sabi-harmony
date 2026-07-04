# Audit Remediation Ledger

Source: `docs/SITE_AUDIT.md` (v1). Branch: feat/luxury-neighborhood-seo. Orchestrated multi-agent build.
Status legend: ⬜ pending · 🟦 in-progress · ✅ done · ⚠ partial/needs-follow-up · ❌ blocked

## Canonical decisions (apply everywhere — single source of truth)
- **Consultation:** "$150 in-home consultation, credited in full toward your first service." CTA = "Request a Private Consultation" → `/contact`. Remove all "complimentary/free consultation" wording.
- **Phone:** display `(250) 896-5971`; `tel:+12508965971`; schema `+1-250-896-5971`.
- **Email:** `hello@wabisabiservices.ca` everywhere.
- **Brand name:** "Wabi Sabi Services" (no "Inc.").
- **Cancellation policy:** 48 hours' notice to reschedule/cancel; within 48h = 50% fee; same-day = full charge.
- **Legal effective date:** June 1, 2026 (both legal docs).
- **No discounts / "% off" language anywhere.** Qualitative pricing in marketing/area copy.

---

## PHASE 1 — Brand integrity & trust
| ID | Task | Owner WP | Files | Status |
|----|------|----------|-------|--------|
| P1-1 | Rewrite KeyTakeaways on-brand (remove emojis, "fit your budget"/discounts, comparison table, fabricated stats) | WP-F | pages/KeyTakeaways.tsx | ⬜ |
| P1-2 | Delete dead PriceEstimator (with % off engine); confirm no imports | Foundation | components/PriceEstimator.tsx | ⬜ |
| P1-3 | Unify consultation model to "$150 credited" across all pages | WP-D/E/A/B/C/F | Home, FAQ, Ritual, Cleaning, Organizing, Book, blog, seasonal, KeyTakeaways | ⬜ |
| P1-4 | NAP: info@→hello@; standardize phone display to (250) 896-5971 | WP-G/D + all | TermsOfService + any deviations | ⬜ |
| P1-5 | Reconcile legal pages (dates, cancellation, "Inc.", email, section numbering) | WP-G | TermsOfService, ClientAgreement | ⬜ |
| P1-6 | Fix FallPumpkins stale 2024/2025 dates + destructive badges + salesy CTAs | WP-B | seasonal/FallPumpkins.tsx | ⬜ |
| P1-7 | Fix seasonal slug 404s (index omits `the-` prefix that routes require) | WP-B | Seasoning.tsx / seasonal index links | ⬜ |
| P1-8 | Rename Cart/Checkout "Installation"→"Service"/"Service Address"; soften chrome | WP-H | Cart.tsx, Checkout.tsx | ⬜ |

## PHASE 2 — SEO/AEO coverage
| ID | Task | Owner WP | Files | Status |
|----|------|----------|-------|--------|
| P2-1 | Add `noindex?` prop to SEO component | Foundation | components/SEO.tsx | ⬜ |
| P2-2 | Add unique `<SEO>` (title ≤60, desc ≤155) to all 12 blog posts + Blog index | WP-A | pages/blog/*, Blog.tsx | ⬜ |
| P2-3 | Add unique `<SEO>` to all 24 seasonal pages + Seasoning index | WP-B/C | seasonal/*, Seasoning.tsx | ⬜ |
| P2-4 | Add `<SEO>` to Ritual, Careers, Book, KeyTakeaways, legal; `noindex` Cart/Checkout/CheckoutSuccess/NotFound | WP-E/F/G/H | those pages | ⬜ |
| P2-5 | Extend prerender.ts to all key routes (home, services+subs, faq, about, reviews, contact, blog+posts, seasoning+packages) | WP-K | scripts/prerender.ts | ⬜ |
| P2-6 | robots.txt: add explicit AI-crawler allows (GPTBot/ClaudeBot/PerplexityBot/Google-Extended/CCBot) | WP-K | public/robots.txt | ⬜ |
| P2-7 | /key-takeaways: add to footer + sitemap (or noindex if internal) | WP-K/L | Layout.tsx, sitemap.xml | ⬜ |
| P2-8 | Wrap NotFound in Layout + noindex | WP-H | pages/NotFound.tsx | ⬜ |

## PHASE 3 — Structured data
| ID | Task | Owner WP | Files | Status |
|----|------|----------|-------|--------|
| P3-1 | Create ArticleSchema, ProductSchema(Offer), ItemListSchema components | Foundation | structured-data/* | ⬜ |
| P3-2 | Add BlogPosting/Article schema (+author/datePublished) to 12 posts | WP-A | pages/blog/* | ⬜ |
| P3-3 | Add Product/Offer schema to 24 seasonal pages | WP-B/C | seasonal/* | ⬜ |
| P3-4 | Add Service/ItemList schema to Services hub | WP-D | pages/Services.tsx | ⬜ |
| P3-5 | Add BreadcrumbList site-wide (services, blog, faq, about, seasonal) | WP-A/B/C/D | respective pages | ⬜ |
| P3-6 | Populate per-area geo (19) + emit GeoCoordinates; LocalBusiness areaServed array; tighten radius to ~28km | WP-J | neighborhoods.ts, NeighborhoodPage.tsx, LocalBusinessSchema.tsx | ⬜ |

## PHASE 4 — Content quality / de-AI
| ID | Task | Owner WP | Files | Status |
|----|------|----------|-------|--------|
| P4-1 | De-AI core: purge transform/curated/seamless/comprehensive; break triads; About emojis; Reviews testimonial triad; FAQ phrasing; Home extractable definition+NAP | WP-D | Home, Services, About, FAQ, Reviews | ⬜ |
| P4-2 | De-AI seasonal: rewrite 4 estate clones (zenith/masterwork), de-dup 4 commercial clones, vary 24 hero triads | WP-B/C | seasonal/* | ⬜ |
| P4-3 | De-AI blog: consultation CTAs, source/soften uncited stats, remove "not just X but Y", luxury-voice pass | WP-A | pages/blog/* | ⬜ |
| P4-4 | De-AI areas: vary lockstep `whyLuxuryHere`/`conciergeServices` closing bullets; fix "bespokely" (Organizing) | WP-J/E | neighborhoods.ts, Organizing.tsx | ⬜ |
| P4-5 | Self-host favicon (replace googleapis hot-link) | WP-L | index.html, public/ | ⬜ |
| P4-6 | Route-level code-splitting (React.lazy) for Core Web Vitals | WP-L | App.tsx | ⬜ |

## Verification gates (post-build)
| ID | Task | Status |
|----|------|--------|
| V-1 | `npx tsc --noEmit` clean | ✅ exit 0 |
| V-2 | `npm run build` green + prerender emits static HTML for all key routes | ✅ 69 static pages; code-split (471kB main) |
| V-3 | `/iterate 4` — all reviewers ≥80 | ✅ Cycle 2: Eng 88 / Reviewer 96 / Adversarial 91 / Critic2 86 (caught+fixed $$-mangling regression) |
| V-4 | Cross-check completed work vs SITE_AUDIT.md (inconsistencies/regressions/skipped) | ✅ all v1 Critical/Major resolved; gap-fixes: Ritual SEO, FAQ-prerender FAQPage; remainder = polish (see v2) |
| V-5 | Re-audit (5 dimensions) → docs/SITE_AUDIT_v2.md | ✅ docs/SITE_AUDIT_v2.md |

## Final outcome
All Phase 1–4 tasks ✅. `/iterate 4` converged (all reviewers ≥80). Re-audit (v2): every v1 Critical/Major resolved; no Critical remains. Remaining = 1 Major (meta/title length trims) + Minor polish (romaji grids on 13 lower-tier seasonal pages, 4 un-prerendered utility routes, Westshore prose, ~8 stray words, 6 copy nits). Recommended "Phase 5 polish" pass documented in SITE_AUDIT_v2.md.

## Build-1 completion (verified)
All Phase 1–4 tasks implemented by the 13-agent workflow and verified: tsc clean; build green; 0 down-market terms; 0 `info@`; 0 `PriceEstimator` refs; 0 "complimentary" (consultation unified to "$150 credited"); Bear Mountain intact; code-splitting live; 69 prerendered pages with per-route title+meta+JSON-LD (Service/BlogPosting/Product/ItemList/FAQPage/BreadcrumbList).
**Orchestrator gap-fixes (caught in pre-iterate cross-check):**
- P2-4: `Ritual.tsx` had no `<SEO>` (fell between WP boundaries) → added SEO + BreadcrumbSchema + prerendered.
- P2-5/AEO: `/faq` prerender carried only BreadcrumbList → extracted FAQ data to `src/data/faqItems.ts`, injected FAQPage JSON-LD into the static `/faq` HTML.
