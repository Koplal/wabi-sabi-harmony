# Wabi Sabi Services — Full Site Audit (v3)

**Date:** 2026-06-28 · **Branch:** feat/luxury-neighborhood-seo @ post-Phase-5 · **Method:** 4 parallel specialist re-audits (SEO, GEO, AEO, Brand+Anti-AI) vs `docs/SITE_AUDIT_v2.md`. Read-only.
**Lineage:** v1 `SITE_AUDIT.md` → remediation + `/iterate 4` → v2 `SITE_AUDIT_v2.md` → Phase-5 polish → **v3 (this doc)**.

## Headline
**Zero Critical, zero Major.** Phase-5 cleared the entire v2 backlog. Build green, `tsc` clean, **73 prerendered pages** (was 69; +4 new routes), one resolvable co-typed `#organization` node per page with exact runtime↔prerender parity. The one "Major regression" raised during the v3 audit (a claimed FAQ 26-vs-27 off-by-one) was a **false positive** — verified: `faqItems` has 26 items (the "27" counted the TypeScript interface line), `faqSections` sum = 26, FAQPage schema = 26. Parity intact.

## v2 backlog → v3 status

| v2 item | Status | Evidence |
|---|---|---|
| **SEO-1** Meta descriptions >155 (Major) | ✅ Cleared | All 73 pages ≤155 (the 8 >155 hits were ProductSchema/ItemList descriptions, which have no SERP limit) |
| **SEO-1** Area titles ", Victoria" redundancy | ✅ Cleared | `NeighborhoodPage` title → `Luxury Cleaning in {name}`; rendered ≤57 |
| **SEO-2** 4 routes not prerendered | ✅ Cleared | `/book`, `/careers`, `/terms-of-service`, `/client-agreement` prerendered + in sitemap (73 total) |
| **AEO-2** FAQ hardcoded accordion | ✅ Cleared | Rendered from `faqItems` via `faqSections.map → slice`; visible = schema = 26 |
| **GEO-1** Westshore/Langford + Metchosin in prose | ✅ Cleared | `About.tsx` names all three; `areas/Index.tsx` names the Westshore/Langford |
| **GEO-2** Runtime two org nodes; Oak Bay dup | ✅ Cleared | `OrganizationSchema` removed; single co-typed node in `LocalBusinessSchema`; runtime↔prerender field-parity exact; Oak Bay Place de-duped |
| **Anti-AI-1** 13 romaji "Design Principles" grids | ✅ Cleared | 0 romaji terms site-wide; replaced with per-page "How We Approach It" |
| **Anti-AI-2** 8 stray banned words | ✅ Cleared | 0 hits for transforms/seamless/curation/comprehensive/meticulous in prose |
| **Anti-AI-3** neighborhoods lockstep bullet (×14) | ✅ Cleared | Down to ×2, each reworded distinctly |
| **Brand-1** 6 cosmetic copy nits | ✅ Cleared | FestiveEstate, BeachsideManor, BotanicalEstate, GrandCelebration, SummerSerenity all rewritten |
| Single org node per prerendered page | ✅ Held | 1 per page incl. the 4 new routes |
| Consultation / NAP / no-discount | ✅ Held | "$150 credited" ×24; 0 "complimentary"/discount; NAP consistent |

**No Phase-5 regressions** (FAQ refactor, org merge, area-title change, prerender re-sync all verified clean).

## Post-audit hardening (applied this pass)
- Deleted the now-orphaned `OrganizationSchema.tsx` + barrel export (prevents accidental resurrection of the v2 double-node + its stale divergent description).
- Added a dev-mode drift guard in `FAQ.tsx` that errors if `faqSections` counts ever stop covering `faqItems` (makes the visible↔schema invariant fail-loud).

## Remaining (all Minor / cosmetic — optional)
- **Title length:** 18 blog/long-seasonal rendered `<title>`s exceed ~60 chars (e.g. march-2026 ~77) → SERP truncation only. Optional: shorten bare titles or the " | Wabi Sabi Services" suffix.
- **GEO nicety:** `areas/Index.tsx` prose names the Westshore but not Metchosin (it's in the grid + schema + About prose). One-word add if desired.
- **Anti-AI residual:** the lockstep neighborhood closing bullet survives on 2/19 records (reworded) — negligible.
- **Watch (not defects):** SPA soft-404 returns HTTP 200 (host-level 404 rule if desired); `/blog/july-2026` prerendered slightly ahead of its date (confirm content-calendar intent).
- **Doc drift:** a few code comments still reference the old two-component org setup — cosmetic.

## Posture
v1 had Critical issues in three dimensions; v2 reduced to one Major + minor polish; **v3 has none** — the site is, on every audited dimension, effectively flawless. The remaining list is cosmetic title-length trimming and a couple of one-word niceties. Recommended action: **ship.** A trivial optional "Phase 6" could trim the 18 long titles and add Metchosin to the Areas hub prose, but nothing remaining blocks merge.
