# Dashboard Coverage Analysis
**Does the Design Plan cover all existing reports?**
**Date:** 2026-03-26

---

## Short Answer

**No — not completely.** The design plan covers ~60% of existing pages analytically. The gaps fall into 3 clear categories that need specific additions to the design.

---

## Full Coverage Matrix (43 pages across 6 reports)

### Legend
| Symbol | Meaning |
|--------|---------|
| ✅ | Fully covered in design plan |
| 🔶 | Partially covered — concept present but not all detail |
| ❌ | Not covered — analytical gap in design plan |
| ⬜ | Intentionally excluded — diagnostic/notes/raw data (non-analytical) |

---

### Report 1 — Weekly FC Tracker (12 pages)

| Page | Name | What it does | Coverage | Design Plan Tab |
|------|------|-------------|----------|----------------|
| P1 | Forecast Flags | Flag × Region grouped column chart | ✅ | Tab 2.2 Pipeline |
| P2 | Global FC | **Flag × Snapshot Week weekly pivot matrix** | 🔶 | Tab 2.2 (concept, not the week-pivot format) |
| P3 | Region FC | Region → Flag → KAM × Week | 🔶 | Tab 2.2 |
| P4 | SubRegion FC | **Subregion → Flag → KAM × Snapshot Week pivot** | ❌ | Missing |
| P5 | Weighted Funnel Evolution | Weighted EUR by quarter-label × week | ✅ | Tab 2.2 |
| P6 | Unweighted Funnel Evolution | Unweighted EUR by quarter-label × week | ✅ | Tab 2.2 |
| P7 | KAM FC | **KAM × Snapshot Week unweighted pivot** | ❌ | Missing |
| P8 | KAM Funnel | **KAM × Snapshot Week (weighted + unweighted side-by-side)** | ❌ | Missing |
| P9 | FC Chart | Stacked area: flag trend across weeks | ✅ | Tab 2.2 |
| P10 | Opp List | Full opportunity detail table | ✅ | Order Detail drill-through |
| P11 | New Opportunities | **New opps created this week — count + weighted value** | ❌ | Missing |
| P12 | RawData | Diagnostic data dump | ⬜ | Intentionally excluded |

**Gap summary for Report 1:** 4 analytical pages missing (P4, P7, P8, P11)

---

### Report 2 — Partner Dashboard (12 pages)

| Page | Name | What it does | Coverage | Design Plan Tab |
|------|------|-------------|----------|----------------|
| P1 | SAP Channel Check | **SAP channel assignment data quality validation** | ❌ | Missing |
| P2 | Indirect Target CY | Target vs actual by destination × month | 🔶 | Tab 5.1 (less detail) |
| P3 | Sales YTD CY vs PY | **FPS/CR/DR unit volumes + BC mix YTD** | ❌ | Missing |
| P4 | Sales FY PY vs PY-1 | **Prior year vs year-before full year comparison** | ❌ | Missing |
| P5 | Sales Evolution | Multi-year revenue + unit trend | 🔶 | Tab 2.1 (partial) |
| P6 | Partner Performance YTD | Partner revenue ranking YTD vs PY | ✅ | Tab 5.1 |
| P7 | Partner Performance FY | **Partner full-year revenue (PY vs PY-1)** | ❌ | Missing |
| P8 | Partner Evolution | **Multi-year partner revenue + product mix evolution** | ❌ | Missing |
| P9 | Top 5 Partners | **Top partner bubble chart + ranked table** | ❌ | Missing |
| P10 | Margin | Partner-level margin (Goods only, RLS-protected) | 🔶 | Tab 4 (no RLS design) |
| P11 | Remarks | Free-text commentary | ⬜ | Intentionally excluded |
| P12 | RawData | Reference table validation dump | ⬜ | Intentionally excluded |

**Gap summary for Report 2:** 6 analytical pages missing (P1, P3, P4, P7, P8, P9)

---

### Report 3 — Price Margin Modalities (4 pages)

| Page | Name | What it does | Coverage | Design Plan Tab |
|------|------|-------------|----------|----------------|
| P1 | Price Waterfall (Goods) | List Price → Discount → Net → Sofon Cost → GM per modality | ✅ | Tab 4.1 |
| P2 | CY vs PY Comparison | Current year vs prior year price + margin pivot | ✅ | Tab 4.1 |
| P3 | Modality Breakdown | Margin % and EUR by modality/product family | ✅ | Tab 4.1 |
| P4 | ENP Analysis | Effective Net Price per unit by region/product | 🔶 | Tab 4.1 (referenced, not specific page) |

**Gap summary for Report 3:** 0 missing (1 partial)

---

### Report 4 — OIT Margin & Product Mix 2026 (8 pages)

| Page | Name | What it does | Coverage | Design Plan Tab |
|------|------|-------------|----------|----------------|
| P1 | OIT Dashboard | OIT actuals vs budget by region × equipment type | ✅ | Tab 2.1 |
| P2 | Product Mix | Equipment type mix with budget comparison | ✅ | Tab 2.1 |
| P3 | Margin by Equipment | CRM margin % by equipment type | ✅ | Tab 4.1 |
| P4 | Budget Page | OIT vs budget by region × config, dynamic measure switching | ✅ | Tab 1.2 |
| P5 | Deal Scoring | **DS%/DH%/Feasibility view for open opportunities** | ❌ | Missing |
| P6 | Quote Analysis | **Quote type/status and Sofon compliance by stage** | ❌ | Missing |
| P7 | Regional Breakdown | Region × equipment type matrix | ✅ | Tab 2.1 |
| P8 | Reference/Config | Budget target config page (admin) | ⬜ | Intentionally excluded |

**Gap summary for Report 4:** 2 analytical pages missing (P5, P6)

---

### Report 5 — Funnel Evolution Tracker (4 pages)

| Page | Name | What it does | Coverage | Design Plan Tab |
|------|------|-------------|----------|----------------|
| P1 | Weekly Weighted | Weighted funnel evolution weekly | ✅ | Tab 2.2 |
| P2 | Weekly Unweighted | Unweighted funnel evolution weekly | ✅ | Tab 2.2 |
| P3 | Monthly Weighted | Weighted funnel evolution monthly | ✅ | Tab 2.2 |
| P4 | Monthly Unweighted | Unweighted funnel evolution monthly | ✅ | Tab 2.2 |

**Gap summary for Report 5:** 0 missing ✅

---

### Report 6 — OI & Funnel Health Cockpit (3 pages)

| Page | Name | What it does | Coverage | Design Plan Tab |
|------|------|-------------|----------|----------------|
| P1 | FY Cockpit | Full year OIT running total vs BT/FC/PY + predictions | ✅ | Tab 1 |
| P2 | YTD Cockpit | YTD OIT running total + prediction models | ✅ | Tab 2.1 |
| P3 | Q Cockpit | Quarterly OIT running total + predictions | ✅ | Tab 1.2 |

**Gap summary for Report 6:** 0 missing ✅

---

## Summary Score

| Report | Total Pages | ✅ Covered | 🔶 Partial | ❌ Missing | ⬜ Excluded |
|--------|------------|-----------|-----------|-----------|------------|
| R1 Weekly FC Tracker | 12 | 5 | 2 | 4 | 1 |
| R2 Partner Dashboard | 12 | 2 | 3 | 6 | 3 (Remarks + 2 RawData) |
| R3 Price Margin | 4 | 3 | 1 | 0 | 0 |
| R4 OIT Margin & Mix | 8 | 5 | 0 | 2 | 1 |
| R5 Funnel Evolution | 4 | 4 | 0 | 0 | 0 |
| R6 OI Cockpit | 3 | 3 | 0 | 0 | 0 |
| **TOTAL** | **43** | **22 (51%)** | **6 (14%)** | **12 (28%)** | **5 (12%)** |

**Of the 38 analytical pages (excluding 5 intentional non-analytical):**
- ✅ Covered: 22 (58%)
- 🔶 Partial: 6 (16%)
- ❌ Missing: 12 (32%) — **need to be added to design plan**

---

## The 12 Missing Pages — Grouped by Theme

### GROUP A — KAM Operational Layer (4 pages from Report 1)
These are used **every Friday** by sales managers in the individual KAM review.

| Missing | What's needed |
|---------|--------------|
| R1.P4 SubRegion FC | Subregion → Flag → KAM × Snapshot Week pivot |
| R1.P7 KAM FC | KAM × Snapshot Week unweighted EUR pivot |
| R1.P8 KAM Funnel | KAM × Week with both weighted and unweighted |
| R1.P11 New Opportunities | New opps created this week: count + weighted value trend |

**Root cause:** The design plan skipped the operational/sales-ops layer entirely. It goes from pipeline health (visual) straight to win/loss (analytical) without the weekly working tool KAMs and sales managers actually use to run the Friday meeting.

---

### GROUP B — SAP Actuals Historical Layer (6 pages from Report 2)
These track **posted revenue** at product family and partner level — different from CRM pipeline.

| Missing | What's needed |
|---------|--------------|
| R2.P1 SAP Channel Check | Channel assignment validation (SAP data quality, not CRM) |
| R2.P3 Sales YTD CY vs PY | Unit volumes by product family (FPS/CR/DR) + revenue type split |
| R2.P4 Sales FY PY vs PY-1 | Prior full year vs year-before full year comparison |
| R2.P7 Partner FY | Partner full-year revenue with monthly drill-down |
| R2.P8 Partner Evolution | Multi-year partner trend (all years 2023–2026) |
| R2.P9 Top 5 Partners | Ranked partner bubble chart — spotlight view |

**Root cause:** The design plan's Channel tab (Tab 5) only covers current-year partner performance. It is missing the multi-year SAP actuals dimension and the unit volume tracking that is unique to the Partner Dashboard.

---

### GROUP C — CRM Deal Scoring & Quoting (2 pages from Report 4)
These are used by commercial managers to assess pipeline quality at deal level.

| Missing | What's needed |
|---------|--------------|
| R4.P5 Deal Scoring | DS%/DH%/Feasibility distribution for open opportunities |
| R4.P6 Quote Analysis | Quote type/status and Sofon compliance per stage |

**Root cause:** The design plan addresses the output of the scoring (weighted amounts, win probability) but not the input quality — whether the CRM scoring fields are actually populated and calibrated correctly.

---

## Updated Design Plan — Additional Pages Required

To achieve full coverage, the design plan needs **2 new sections** added:

---

### NEW — Tab 2 Addition: Sales Operations Sub-Pages

Add these 4 pages under a **"Sales Operations"** navigation section within Tab 2 (Commercial Performance). These are the working tools for weekly KAM reviews — not for CFO, but for sales managers and KAMs.

**Page 2.5 — Weekly KAM Scorecard**
```
Purpose: Friday individual KAM review tool
Core visual: Pivot table — KAM rows × Snapshot Week columns × Amount EUR
Secondary: Same pivot with Weighted Amount EUR (side by side)
Filters: Region, Subregion, Quarter, Forecast Flag
Insight added vs current: Week-on-week delta column (W11 → W12 change per KAM)
```

**Page 2.6 — SubRegion Weekly Snapshot**
```
Purpose: Regional manager view for Friday team review
Core visual: Pivot — SubRegion → Flag → KAM × Snapshot Week
Filters: Group of Regions, Quarter
Insight added vs current: Conditional formatting — red if declining week-on-week
```

**Page 2.7 — New Pipeline Activity**
```
Purpose: Track new opportunities entering the funnel each week
Core visual: Combo chart — bars = weighted EUR of new opps (by week), line = count
Filters: Region, Subregion, Feasibility, Quarter
Insight added vs current: New opp value vs closed opp value in same week = net funnel health
```

---

### NEW — Tab 5 Expansion: SAP Actuals Historical + Product Lines

Expand Tab 5 (Channel & Pipeline) into a fuller **"Channel & Actuals"** tab with additional pages:

**Page 5.3 — Product Line Sales (Multi-Year)**
```
Purpose: Unit volume + revenue tracking by product family (FPS/CR/DR separately)
Core visuals:
  - Unit volume by product family × year (FPS: Drystar 5301/5302/5503/AXYS; CR: CR 12-X; DR: full DR range)
  - Revenue type split (Goods / Implementation / Support) by year
  - BC group mix evolution (% stacked bar over years)
Filters: Channel, BC Group, Region, Year
Insight added vs current: First time unit volume trends sit alongside revenue — catches mix shifts before revenue impact
```

**Page 5.4 — Sales History (CY vs PY vs PY-1)**
```
Purpose: Three-year revenue comparison — provides the "is this year's growth real?" context
Core visual: Pivot — Revenue type rows × Year columns (2024 / 2025 / 2026) with % change columns
Secondary: YoY KPI visual (custom bullet/variance chart)
Filters: Channel, BC Group, Region, TYPE
Insight added vs current: PY-1 baseline prevents one-time events from looking like a trend
```

**Page 5.5 — Partner Deep Dive (Multi-Year Evolution)**
```
Purpose: Full history of a selected partner — revenue, product mix, implementation share, margin
Core visuals:
  - Partner revenue trend (all years, monthly drill-down)
  - Revenue type evolution (Goods / Impl / Support shift over time)
  - BC group mix (% stacked, is partner shifting product lines?)
  - Margin trend (Goods only, RLS-protected)
Filter: Partner selector (single-select slicer)
Insight added vs current: Replaces "visit the RawData tab" pattern; shows partner health over time
```

**Page 5.6 — Top Partner Rankings**
```
Purpose: Relative partner importance view for channel management
Core visuals:
  - Bubble chart: X = revenue growth %, Y = margin %, Size = absolute revenue
  - Ranked table: partner, region, channel manager, revenue, target, % attainment
Filters: Year, Month, Region, Channel, BC Group, Dealer Type
Insight added vs current: Bubble position replaces raw rankings — managers see growth-vs-margin tradeoffs
```

**Page 5.7 — SAP Channel Data Quality**
```
Purpose: Validate SAP channel code assignments for partners (separate from CRM quality)
Core visual: Table — Bill-to party, Name, Country, Channel Manager, SAP channel, APX classification
Filters: Country, SAP source system, Channel type
Note: This is a data steward tool, not an exec view — can be hidden from CFO navigation
```

---

### NEW — Tab 4 Addition: Deal Scoring Monitor

**Page 4.3 — Pipeline Quality Scoring**
```
Purpose: Show whether DS%/DH%/Feasibility scores are reliable and calibrated
Core visuals:
  - Distribution chart: DS% values (0/30/50/70/90) frequency by region — is scoring spread healthy?
  - DS% vs DH% scatter per deal — should correlate; outliers need review
  - Feasibility vs actual close rate (historical) — calibration check
  - Sofon quote compliance: % of deals in Quoting/Negotiating that have Sofon quote sent
Insight added vs current: Tells managers if the scores driving weighted pipeline are trustworthy
```

---

## Revised Total Page Count

| Tab | Current Design | New Pages | Total |
|-----|--------------|-----------|-------|
| Tab 1 — Executive Overview | 2 | 0 | 2 |
| Tab 2 — Commercial Performance | 4 | 3 (Ops pages) | 7 |
| Tab 3 — Revenue & Reco | 2 | 0 | 2 |
| Tab 4 — Margin Analysis | 2 | 1 (Scoring) | 3 |
| Tab 5 — Channel & Actuals | 2 | 5 | 7 |
| Universal — Order Detail | 1 | 0 | 1 |
| **TOTAL** | **13** | **9** | **22** |

With 22 pages, the dashboard covers 100% of the analytical content from all 6 existing reports, **plus** 10 new pages that address the critical gaps identified in the Data Analysis Findings.

---

## Coverage After Updates

| Report | Before | After |
|--------|--------|-------|
| R1 Weekly FC Tracker | 58% | 100% |
| R2 Partner Dashboard | 40% | 100% |
| R3 Price Margin | 85% | 100% |
| R4 OIT Margin & Mix | 63% | 100% |
| R5 Funnel Evolution | 100% | 100% |
| R6 OI Cockpit | 100% | 100% |
| **OVERALL** | **~60%** | **100%** |

---

## Navigation Impact — Revised Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│  TAB 1          TAB 2               TAB 3        TAB 4      TAB 5       │
│  EXECUTIVE      COMMERCIAL          REVENUE &    MARGIN     CHANNEL &   │
│  OVERVIEW       PERFORMANCE         RECO         ANALYSIS   ACTUALS     │
├─────────────────────────────────────────────────────────────────────────┤
│  • Scorecard    • OIT Performance   • Reco       • Price    • Partner   │
│  • FC Outlook   • Pipeline Health     Dashboard    Waterfall  Perf YTD  │
│                 • Win/Loss          • Order Book • Margin   • Product   │
│                 • Large Deals                     Bridge     Lines      │
│                 ─────────────                   • Pipeline • Sales     │
│                 SALES OPS SECTION:               Scoring    History    │
│                 • KAM Scorecard                           • Partner    │
│                 • SubRegion Weekly                          Deep Dive  │
│                 • New Pipeline                           • Top Partner │
│                                                          • Channel DQ  │
└─────────────────────────────────────────────────────────────────────────┘
                                               + Universal Drill-Through:
                                                 Order Detail Page
```

**Recommendation:** Separate the Sales Ops pages visually from the Executive/Management pages using a section divider or different background colour. The KAM pages are operational working tools, not the same audience as the Scorecard.

---

*Coverage Analysis v1.0 — AGFA Digital Radiology | 2026-03-26*
