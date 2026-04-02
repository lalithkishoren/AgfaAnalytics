# AGFA Digital Radiology — Analytics Dashboard Design Plan
**Version:** 2.0 — Revised for Full Lifecycle Coverage
**Prepared by:** Business Analyst
**Date:** 2026-03-26
**Audience:** CFO, Financial Controllers, Commercial Leaders, Sales Operations, Channel Managers

---

## 1. Design Philosophy

### 1.1 The Core Problem with Current State

The existing 6 Power BI reports were built organically by the commercial team to answer one operational question: **"How is the funnel performing this week?"**

What this architecture misses is that **funnel and OIT are only 2 of the 5 layers** a CFO needs to manage financial commitments:

```
  LAYER 1        LAYER 2        LAYER 3        LAYER 4        LAYER 5
  ─────────      ─────────      ─────────      ─────────      ─────────
  PIPELINE   ──► ORDER      ──► ORDER      ──► REVENUE    ──► MARGIN
  & FUNNEL       INTAKE         BOOK           RECO
                 (OIT)          (Backlog)      (Recognition)

  "What will    "What did    "What have    "What have    "What did
   we win?"      we win?"     we won but    we invoiced?" we actually
                              not yet                     earn?"
                              delivered?"

  CURRENT:
  ████████      ████████      ░░░░░░░░      ░░░░░░░░      ████░░░░
  STRONG ✅     STRONG ✅     EMPTY ❌      EMPTY ❌      PARTIAL ⚠️

  NEW EDW:
  ████████      ████████      ████████      ████████      ████████
  + Win/Loss    + New/Expand  + Aging       + Phasing     + Bridge
  + Velocity    + B&B         + Milestones  + Overdue     + Actual vs
  + 2× Rule     + Segment     + By region   + Alerts       Standard
```

The critical technical enabler for Layers 3, 4, and 5 is a **single join** that has never been built:

```
  CRM Opportunity (Won)
        │
        │ agfa_saporderid  ◄── This one join unlocks 3 missing layers
        ▼
  SAP Sales Order
        ├── Delivery Status ────► Layer 3: Order Book (what's in backlog)
        ├── Invoice Posting Date ► Layer 4: Revenue Reco (what's recognised)
        └── Calculated Cost APX ► Layer 5: Actual Margin (what was earned)
```

The EDW builds this join as its foundation. Everything else follows.

### 1.2 Audience Architecture

The dashboard serves three distinct audiences, each needing a different entry point:

```
  CFO / VP Finance          Financial Controllers       Sales Operations
  ─────────────────         ─────────────────────       ──────────────────
  Tab 1: Executive          Tab 3: Revenue & Reco       Tab 2 (Ops section)
  Scorecard                 Tab 4: Margin               KAM Scorecards
  Revenue Walk              Margin Bridge               Weekly Snapshots
  Scenario Planning         Reco Risk Register          New Pipeline
```

### 1.3 Design Principles

| Principle | What It Means in Practice |
|-----------|--------------------------|
| **Answer first, detail second** | Every page leads with a RAG-status headline — CFO reads the story in 10 seconds |
| **Lifecycle spine** | Every page is anchored to one of the 5 lifecycle layers — users always know "where they are" |
| **Actuals vs Plan always visible** | Every chart shows CY Actual, Budget, Forecast, and PY — no toggling required |
| **Consistent drill path** | Company → Region → Country → Customer → Order → Line — works the same across all pages |
| **Scoring is trusted** | DS%/DH%/Feasibility scores are client-calculated and treated as reliable inputs for weighted analytics |
| **Multi-year by default** | Channel and sales history pages show at least 3 years — one year never tells the real story |
| **Single source of truth** | All pages feed from the same EDW semantic layer — no more label inconsistencies |

---

## 2. Dashboard Architecture

### 2.1 Navigation Structure (6 Tabs, 22 Pages)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  AGFA Digital Radiology  |  Analytics Platform          [Global Filters ▼]  │
├──────────┬──────────────┬──────────────┬────────────┬────────────┬──────────┤
│  TAB 1   │    TAB 2     │    TAB 3     │   TAB 4    │   TAB 5   │  TAB 6   │
│ EXECUTIVE│  COMMERCIAL  │  ORDER BOOK  │  REVENUE   │  MARGIN   │ CHANNEL  │
│ OVERVIEW │  & PIPELINE  │  & RECO      │  WALK      │  ANALYSIS │ & SALES  │
│          │              │              │            │           │ ACTUALS  │
└──────────┴──────────────┴──────────────┴────────────┴────────────┴──────────┘
```

### 2.2 Page Map (All 22 Pages)

```
TAB 1 — EXECUTIVE OVERVIEW                  TAB 4 — REVENUE WALK
  1.1  Executive Scorecard                    4.1  Revenue Recognition Dashboard
  1.2  Financial Forecast & Outlook           4.2  Reco Risk Register
                                              4.3  Book & Bill Tracker
TAB 2 — COMMERCIAL & PIPELINE
  ── Management Views ──                    TAB 5 — MARGIN ANALYSIS
  2.1  OIT Performance                        5.1  Price Realization Waterfall
  2.2  Pipeline & Funnel Health               5.2  Margin Bridge (Budget vs Actual)
  2.3  Win / Loss Analysis                    5.3  Deal Scoring & Pipeline Quality
  2.4  Large & Strategic Deal Tracker
                                            TAB 6 — CHANNEL & SALES ACTUALS
  ── Sales Operations Views ──               ── Partner Performance ──
  2.5  Weekly KAM Scorecard                   6.1  Partner Overview (Multi-Year)
  2.6  SubRegion Weekly Snapshot              6.2  Partner Deep Dive
  2.7  New Pipeline Activity                  6.3  Top Partner Rankings
                                              ── Sales Actuals History ──
TAB 3 — ORDER BOOK                            6.4  Product Line Sales (Multi-Year)
  3.1  Order Book Overview                    6.5  Sales History (CY / PY / PY-1)
  3.2  Backlog Aging & Risk                   ── Data Quality ──
                                              6.6  SAP Channel Data Quality
  + Universal: Order Detail Drill-Through
```

### 2.3 Global Filter Bar (Persistent Across All Pages)

```
  Year: [2026 ▼]   Quarter: [All ▼]   Region: [All ▼]   Channel: [All ▼]   [Reset]
```

Filters cascade to every page. The **Channel** filter is new vs the current reports — enables direct vs indirect split across all lifecycle layers simultaneously.

### 2.4 Lifecycle Layer Indicator (Page-Level Label)

Every page carries a small lifecycle badge in the top-right corner so users always know which layer they are looking at:

```
  [● PIPELINE]  [● OIT]  [● ORDER BOOK]  [● RECO]  [● MARGIN]  [● ACTUALS]
```

This is the visual spine that connects the 22 pages into one coherent story.

---

## 3. Tab 1 — Executive Overview

**Audience:** CFO, VP Finance, Regional VPs
**Lifecycle layers:** All 5 layers summarised
**Refresh cadence:** Weekly (Monday Revenue Walk alignment)

---

### Page 1.1 — Executive Scorecard

**Purpose:** The single page that answers the CFO's question: "Where do we stand — pipeline to margin?"

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  EXECUTIVE SCORECARD — Digital Radiology              W12 | 2026-03-21       ║
╠═════════╦═════════╦══════════╦══════════╦══════════╦══════════════════════╣
║ PIPELINE ║   OIT   ║  ORDER   ║  RECO    ║  GROSS   ║  PIPELINE            ║
║ COVERAGE ║  YTD    ║  BOOK    ║  YTD     ║  MARGIN  ║  COVERAGE RATIO      ║
║          ║         ║          ║          ║          ║                      ║
║  2.1×    ║ €XX.Xm  ║ €XX.Xm   ║ €XX.Xm   ║  XX.X%   ║  ████░ 2.1×         ║
║  ● Strong ║ ▲ +X%BT ║ ▲ +X% PY ║ ⚠ –X%BT  ║ ⚠ –X%BT  ║  Target: 2.5×       ║
╠═════════╩═════════╩══════════╩══════════╩══════════╩══════════════════════╣
║                                                                              ║
║  REVENUE LIFECYCLE WALK — YTD          ║  QUARTERLY TREND (5 Quarters)      ║
║                                        ║                                    ║
║  Opening  +OIT   –Reco  =Closing       ║  [Line chart — 3 series]           ║
║  OB        Won           OB            ║  OIT ●  Reco ▲  Margin % ◆        ║
║  €XXXm  +€XXm  –€XXm   €XXXm           ║  Q4'24 Q1'25 Q2'25 Q3'25 Q4'25    ║
║  [Waterfall — the financial story]     ║  Trend: Is OIT lead converting?    ║
╠════════════════════════════════════════╩════════════════════════════════════╣
║  REGIONAL PERFORMANCE HEATMAP — All 5 Lifecycle KPIs per Region             ║
║                                                                              ║
║  Region          Pipeline  OIT vs BT  Order Book  Reco vs BT  Margin        ║
║  North America   ███ 2.4×  ██████108% €XXXm       ████░ 94%   41.2% ●      ║
║  Europe North    ██ 1.9×   ████░░ 87% €XXm        █████101%   38.7% ●      ║
║  Europe South    █ 1.6×    ███░░░ 72% €XXm        ███░░  78%  35.1% ⚠      ║
║  Intercontinental██ 1.4×   ████░░ 91% €XXm        ████░  88%  39.4% ●      ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

**Key design decision:** The heatmap now shows all 5 lifecycle KPIs per region — not just OIT. A region that is strong on OIT but weak on Reco is a delivery risk signal, visible immediately.

**Drill-down:** Click any region → opens Tab 2 (Commercial) pre-filtered to that region.

---

### Page 1.2 — Financial Forecast & Outlook

**Purpose:** Answer "will we make the quarter and the year?" with structured scenario analysis.

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  FINANCIAL OUTLOOK — Q2 2026                                                 ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  Q2 OIT FORECAST                        Q2 RECO FORECAST                    ║
║  ┌──────────────────────────────┐       ┌──────────────────────────────┐    ║
║  │ Won (locked)      €XX.Xm ████│       │ Already invoiced    €XX.Xm ██│    ║
║  │ Incl & Secured    €XX.Xm ███ │       │ In delivery         €XX.Xm █ │    ║
║  │ Included          €XX.Xm ██  │       │ Planned Q2 Reco     €XX.Xm ░ │    ║
║  │ Incl with Risk    €XX.Xm █░  │       │ Book & Bill upside  €XX.Xm ░ │    ║
║  │ Upside            €XX.Xm ░░  │       │ ─── Budget Target ──────────│    ║
║  │ ─── Budget Gap ──────────    │       │ Gap to close        €XX.Xm   │    ║
║  └──────────────────────────────┘       └──────────────────────────────┘    ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  SCENARIO ANALYSIS           ║  MONTHLY PHASING — Q2                         ║
║  Base Case:  €XX.Xm +X%BT    ║  [Clustered bar: Apr / May / Jun]             ║
║  Bear Case:  €XX.Xm –X% risk ║  OIT (bar, solid)   Reco (bar, hatched)       ║
║  Bull Case:  €XX.Xm +X% upsd ║  Budget (line)                                ║
╠══════════════════════════════╩══════════════════════════════════════════════╣
║  2× UPSIDE RULE — COMPLIANCE TABLE                                           ║
║                                                                              ║
║  Region          Incl w/Risk    Upside      Ratio   Status                   ║
║  North America   €X.Xm          €X.Xm       2.4×    ● Compliant             ║
║  Europe North    €X.Xm          €X.Xm       1.7×    ⚠ Below 2×             ║
║  Europe South    €X.Xm          €X.Xm       1.2×    ✗ Non-Compliant         ║
║  Intercontinental€X.Xm          €X.Xm       2.1×    ● Compliant             ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

## 4. Tab 2 — Commercial & Pipeline

**Lifecycle layers:** Pipeline (Layer 1) + OIT (Layer 2)
**Split into two sections:**
- Management Views (2.1–2.4): For Commercial Directors, Regional VPs — visual, insight-driven
- Sales Operations Views (2.5–2.7): For Sales Managers, KAMs — operational, weekly working tools

---

### Page 2.1 — OIT Performance Dashboard

**Audience:** Commercial Directors, Regional VPs
**Purpose:** OIT actuals vs Budget / PY — from company total to individual deal

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  ORDER INTAKE — 2026 YTD                              [● OIT]  W12 2026-03-21║
╠══════════╦═══════════╦══════════╦══════════╦═══════════════════════════════╣
║ OIT YTD  ║ vs Budget ║  vs PY   ║ vs FC    ║  NEW BUSINESS vs EXPANSION    ║
║ €XX.Xm   ║  +X.X%    ║  +X.X%   ║  –X.X%   ║  New Biz XX%  │ Expand XX%   ║
╠══════════╩═══════════╩══════════╩══════════╩═══════════════════════════════╣
║                                                                              ║
║  OIT RUNNING TOTAL (Weekly, W01–W12)    ║  OIT BY EQUIPMENT TYPE            ║
║  [3-line chart]                          ║  [Stacked bar by month]           ║
║  ─── CY Actual  ─── Budget  ─── PY      ║  ■ DR 100e  ■ DR 400  ■ DR 600   ║
║  Shows: are we ahead or behind pace?    ║  ■ DR 800   ■ Retrofit ■ DX-D 300 ║
║                                          ║  ■ Valory   ■ Software ■ Services ║
╠══════════════════════════════════════════╩══════════════════════════════════╣
║                                                                              ║
║  OIT WATERFALL — CY vs PY BY REGION      ║  TOP 20 DEALS WON YTD            ║
║  [Waterfall: PY base → +/– per region    ║  Rank Customer  Region  Equip    ║
║   → CY total]                            ║  1   [Hosp A]  N.Am.   DR 800    ║
║  Shows: where did we grow/shrink vs PY?  ║     €X.Xm  41.2%  Jan-26         ║
║                                          ║  2   [Hosp B]  Eur N.  DR 600    ║
║                                          ║     €X.Xm  38.5%  Feb-26         ║
╚══════════════════════════════════════════╩══════════════════════════════════╝
```

**Drill-down:** Region → Subregion → Country → Customer → Order Detail page

---

### Page 2.2 — Pipeline & Funnel Health

**Audience:** Commercial Directors, Sales Managers
**Purpose:** Quality and momentum of the forward pipeline

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  PIPELINE HEALTH — Q2 & Q3 2026 OUTLOOK              [● PIPELINE]           ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  FUNNEL BY FLAG (Current Week)          FUNNEL MOVEMENT THIS WEEK           ║
║  Won            €XX.Xm ██████████       [Sankey / movement matrix]          ║
║  Incl & Secured €XX.Xm ████████         ↑ Upgraded this week: XX deals €XXm ║
║  Included       €XX.Xm ██████           ↓ Downgraded this week: XX deals    ║
║  Incl w/Risk    €XX.Xm ████             → Unchanged: XX deals €XXm          ║
║  Upside         €XX.Xm ██              ✗ Lost this week: XX deals €XXm      ║
║  ─── Budget Gap ─────────────────────                                       ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  FUNNEL EVOLUTION (W01–W12 Weighted)    STAGE CONVERSION RATES               ║
║  [Stacked area: Q-label series per week ║  Identifying → Qualifying  XX% ▲  ║
║   Q1 Q2 Q3 Q4 OIT Closed]              ║  Qualifying  → Quoting     XX% ▼  ║
║  Both weighted and unweighted toggleable║  Quoting     → Negotiating XX% ▲  ║
║                                         ║  Negotiating → Won         XX% ─  ║
║                                         ║  Avg days Won: XX (BM: XX days)   ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  DATA QUALITY FLAGS                                                          ║
║  Overdue: XX opps (€XXm)  │  Check Staging: XX  │  2× Upside: X regions ⚠  ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

### Page 2.3 — Win / Loss Analysis

**Audience:** Commercial Directors, Marketing, Regional VPs
**Purpose:** Understand where deals are won and lost — the post-mortem loop the playbook requires

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  WIN / LOSS ANALYSIS — 2025 Full Year + 2026 YTD      [● OIT]               ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  WIN RATE YTD    LOST VALUE YTD    WON AVG DEAL   LOST AVG DEAL             ║
║  XX.X%           €XX.Xm            €XXX,XXX        €XXX,XXX                 ║
║  vs 2025: +X%    vs 2025: –€Xm     vs 2025: +X%   vs 2025: +X%             ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  WIN RATE BY REGION          WIN RATE BY EQUIPMENT TYPE                     ║
║  [Bar chart — sorted desc]   [Bar chart: DR100e DR400 DR600 DR800 Retrofit] ║
║                                                                              ║
║  WIN RATE BY DEAL SIZE       WIN RATE BY DS% BAND                           ║
║  <€100k:    XX%              DS% 30: XX%  (is scoring calibrated?)          ║
║  €100–500k: XX%              DS% 50: XX%                                    ║
║  €500k–€1m: XX%              DS% 70: XX%                                    ║
║  >€1m:      XX%              DS% 90: XX%                                    ║
║                              Insight: high DS% should correlate to high win ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  LOSS REASON PARETO          COMPETITIVE INTELLIGENCE                       ║
║  [Pareto bar]                Competitor  Encounters  Win Rate  Avg Lost      ║
║  1. Price           XX%      Comp. A     XX          XX%       €XX,XXX      ║
║  2. Competitor      XX%      Comp. B     XX          XX%       €XX,XXX      ║
║  3. No Budget       XX%                                                      ║
║  4. Timing          XX%                                                      ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

### Page 2.4 — Large & Strategic Deal Tracker

**Audience:** Commercial Directors, CFO (pre-MPR)
**Purpose:** Systematic visibility of high-value and strategic deals — replaces manual slide decks

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  LARGE DEAL TRACKER (>€500k)    ■ Strategic  ◆ Large  ● Watch List          ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  DEAL TIMELINE (Gantt)                                                       ║
║  Deal          Region    Value   Stage       Q1  Q2  Q3  Q4   Trend         ║
║  ■ Hospital X  N.Am.     €2.1m   Negotiating  ──[====]──      ↑ Upgraded    ║
║  ■ Clinic Y    Eur N.    €1.4m   Quoting      ───[==]───      → Stable      ║
║  ◆ Network Z   Intercon  €0.8m   Identifying  ────[=======]   ↓ Slipping    ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  DEAL DETAIL PANEL (click any row)                                           ║
║  Customer: [Name]          KAM: [Name]        Sofon Quote: ✅ Sent           ║
║  Region:   N.America       Close: Q2 2026     SAP Order:  Not yet           ║
║  Equip:    DR 800 × 3      Value: €2.1m       Margin:  39.5% (CRM est.)     ║
║  DS%: 70   DH%: 70         Feasibility: 70%   Forecast: Included            ║
║                                                                              ║
║  STAGE HISTORY:  W07:Qualifying → W09:Quoting → W11:Negotiating             ║
║  Planned Reco:  Q3 2026                                                      ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

### — SALES OPERATIONS SECTION —

*Pages 2.5–2.7 are the weekly working tools for KAMs and sales managers. Same data as pages 2.1–2.2 but structured for the Friday review format — pivot tables, weekly columns, individual owner rows.*

---

### Page 2.5 — Weekly KAM Scorecard

**Audience:** KAMs, Sales Managers
**Purpose:** The Friday individual KAM review — equivalent to current Report 1 Pages 7 & 8

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  KAM WEEKLY SCORECARD — Q2 2026        [Filters: Region | SubRegion | Quarter]
╠═══════════════════════╦══════╦══════╦══════╦══════╦══════╦══════╦══════════╣
║  KAM Name             ║  W07 ║  W08 ║  W09 ║  W10 ║  W11 ║  W12 ║  Δ W→W  ║
╠═══════════════════════╬══════╬══════╬══════╬══════╬══════╬══════╬══════════╣
║  [KAM A]              ║  XXm ║  XXm ║  XXm ║  XXm ║  XXm ║  XXm ║  ▲ +Xm  ║
║  [KAM B]              ║  XXm ║  XXm ║  XXm ║  XXm ║  XXm ║  XXm ║  ▼ –Xm  ║
║  [KAM C]              ║  XXm ║  XXm ║  XXm ║  XXm ║  XXm ║  XXm ║  → 0    ║
║  TOTAL                ║ XXXm ║ XXXm ║ XXXm ║ XXXm ║ XXXm ║ XXXm ║         ║
╠═══════════════════════╩══════╩══════╩══════╩══════╩══════╩══════╩══════════╣
║  [Toggle: Unweighted Amount  |  Weighted Amount  |  Both Side-by-Side]       ║
║                                                                              ║
║  [Breakdown below table: click KAM row → expand to Flag × Week detail]      ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

**Enhancement vs current Report 1:** The W→W delta column is new — shows which KAM's funnel grew or shrank this week. Currently users must mentally compare two adjacent columns.

---

### Page 2.6 — SubRegion Weekly Snapshot

**Audience:** Regional Sales Managers, Sales Directors
**Purpose:** The Friday team review — SubRegion → Flag → KAM × Week (equivalent to Report 1 Pages 3 & 4)

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  SUBREGION WEEKLY SNAPSHOT             [Filters: Region | Quarter | Flag]    ║
╠══════════════════╦══════╦══════╦══════╦══════╦══════╦══════╦══════════════╣
║  SubRegion/KAM   ║  W07 ║  W08 ║  W09 ║  W10 ║  W11 ║  W12 ║  vs Budget  ║
╠══════════════════╬══════╬══════╬══════╬══════╬══════╬══════╬══════════════╣
║ ▶ USA            ║      ║      ║      ║      ║      ║      ║   +12%  ●    ║
║   Won            ║  XXm ║  XXm ║  XXm ║  XXm ║  XXm ║  XXm ║             ║
║   Incl & Sec.    ║  XXm ║      ║      ║      ║      ║  XXm ║             ║
║   Included       ║  XXm ║      ║      ║      ║      ║  XXm ║             ║
║   [KAM A]        ║  XXm ║      ║      ║      ║      ║  XXm ║             ║
║ ▶ Canada         ║      ║      ║      ║      ║      ║      ║   –8%   ⚠   ║
╠══════════════════╩══════╩══════╩══════╩══════╩══════╩══════╩══════════════╣
║  Conditional formatting: red = decline vs prior week, green = growth        ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

### Page 2.7 — New Pipeline Activity

**Audience:** Sales Managers, Sales Directors
**Purpose:** Track the rate of new opportunity creation — is the top of the funnel being fed?

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  NEW PIPELINE ACTIVITY — 2026              [● PIPELINE]                      ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  WEEKLY NEW PIPELINE vs CLOSED PIPELINE                                      ║
║  [Combo chart — bars = new opp weighted value per week]                      ║
║  [Overlaid line = lost/closed opp value per week]                            ║
║  Net funnel growth = bars above line = healthy                               ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  NEW OPP COUNT + VALUE BY REGION     NEW OPP QUALITY DISTRIBUTION            ║
║  [Grouped bar: count × region]       Feasibility on entry:                  ║
║  [Secondary: weighted value]         30%: XX opps  50%: XX  70%: XX          ║
║                                      [Is new pipeline high or low quality?]  ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  NEW OPPORTUNITIES THIS WEEK — DETAIL TABLE                                  ║
║  Opp ID  Customer  Region  Equipment  Value  Feasibility  KAM  Created       ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

## 5. Tab 3 — Order Book

**Lifecycle layer:** Layer 3 — Order Book (Backlog)
**Audience:** Finance Controllers, Operations, Delivery Managers
**Purpose:** Complete visibility of what has been Won but not yet delivered or invoiced — the currently invisible layer

---

### Page 3.1 — Order Book Overview

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  ORDER BOOK — Digital Radiology                [● ORDER BOOK]  W12 2026     ║
╠════════════╦════════════╦════════════╦════════════╦═══════════════════════╣
║ TOTAL OB   ║ EQUIPMENT  ║ IMPLEMENT  ║ BOOK &     ║  OB EVOLUTION          ║
║ €XXX.Xm    ║ €XX.Xm     ║ €XX.Xm     ║ BILL       ║  [13-month rolling     ║
║ vs PY ▲X%  ║ XX% of OB  ║ XX% of OB  ║ €XX.Xm     ║   area chart — 4      ║
║            ║            ║            ║ same-period ║   buckets stacked]    ║
╠════════════╩════════════╩════════════╩════════════╩═══════════════════════╣
║                                                                              ║
║  ORDER BOOK COMPOSITION                  ORDER BOOK AGING                   ║
║  [Stacked donut — 4 buckets]             [Horizontal bar]                   ║
║  ■ Planned Current Year:  XX%            < 3 months:   €XX.Xm  XX%         ║
║  ■ Planned Next Years:    XX%            3–6 months:   €XX.Xm  XX%         ║
║  ■ Overdue ≤ 6 months:    XX%  ⚠         6–12 months:  €XX.Xm  XX%         ║
║  ■ Not yet planned:       XX%            > 12 months:  €XX.Xm  XX%         ║
║                                          Overdue:      €XX.Xm  XX% ⚠       ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  ORDER BOOK BY REGION (Table)                                                ║
║  Region       Total OB    Curr Yr    Next Yrs   Overdue   Not Planned        ║
║  N. America   €XXXm       €XXm(XX%)  €XXm       €Xm       €XXm              ║
║  Europe N.    €XXm                                                           ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

### Page 3.2 — Backlog Aging & Risk

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  BACKLOG AGING & DELIVERY RISK         [● ORDER BOOK]                        ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  OVERDUE ORDERS (Planned Reco Date < Today, Not Yet Invoiced)                ║
║                                                                              ║
║  Opp/Order  Customer     Region    Equipment  Value  Planned Reco  Days O/D ║
║  [OPP-XXX]  [Hospital A] N.America DR 800     €XXXk  2026-01-15   +65 days  ║
║  [OPP-XXX]  [Clinic B]   Europe N. DR 600     €XXXk  2026-02-28   +21 days  ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  ORDERS DUE THIS QUARTER (Reco date in Q2 2026)                              ║
║                                                                              ║
║  Status          Count   Value      Action Required                          ║
║  Reco this month  XX     €XX.Xm    Confirm installation complete            ║
║  Reco next month  XX     €XX.Xm    In delivery — on track                   ║
║  Reco in Q2       XX     €XX.Xm    SAP order confirmed                      ║
║  Date not set     XX     €XX.Xm    ⚠ KAM to enter Reco date in CRM         ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  IMPLEMENTATION LAG DISTRIBUTION                                             ║
║  [Histogram: days from OIT to Reco, by equipment type]                       ║
║  DR 100e: avg XX days   DR 600: avg XX days   DR 800: avg XX days            ║
║  Insight: Which equipment type takes longest to convert to revenue?          ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

## 6. Tab 4 — Revenue Walk

**Lifecycle layer:** Layer 4 — Revenue Recognition (Reco)
**Audience:** Finance Controllers, CFO
**Purpose:** Track the conversion from Won order to recognised revenue — currently managed entirely in manual Excel

---

### Page 4.1 — Revenue Recognition Dashboard

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  REVENUE RECOGNITION — 2026            [● RECO]                              ║
╠════════════╦═════════════╦═════════════╦══════════════════════════════════╣
║ RECO YTD   ║ RECO Q2 FC  ║ RECO FY FC  ║  OIT → RECO CONVERSION            ║
║ €XX.Xm     ║ €XX.Xm      ║ €XX.Xm      ║  Avg lag:   XX days               ║
║ vs BT: XX% ║ vs BT: XX%  ║ vs BT: XX%  ║  Target lag: ≤ XX days            ║
║            ║             ║             ║  Backlog coverage: X.X×            ║
╠════════════╩═════════════╩═════════════╩══════════════════════════════════╣
║                                                                              ║
║  RECO PHASING — MONTHLY (Planned vs Actual vs Budget)                        ║
║  [Clustered bar per month]                                                   ║
║  Each month: ■ Actual (solid)  □ Planned (outlined)  ─ Budget (line)         ║
║  Jan ████/████  Feb ███/█████  Mar ██████/████  Apr ──/█████  May ──/████   ║
║  Shows: are we recognising on time? Are future months adequately planned?    ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  REVENUE WATERFALL — Q2                  RECO BY REGION                     ║
║  Q1 Closing OB + OIT Won Q2 – Reco Q2   [Stacked bar: region × month]       ║
║  = Q2 Closing OB                        Shows: which region is delivering?  ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

### Page 4.2 — Reco Risk Register

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  RECO RISK REGISTER — Q2 2026          [● RECO]                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  RECO AT RISK THIS QUARTER                                                   ║
║                                                                              ║
║  Opp/Order   Customer    Region    Equipment  Value  Planned  Risk Reason    ║
║  [OPP-XXX]   [Hosp A]    N.Am.     DR 800     €X.Xm  Apr-26  Installation   ║
║                                                                delay >30d    ║
║  [OPP-XXX]   [Clinic B]  Eur. N.   DR 600     €X.Xm  Jun-26  Customer      ║
║                                                                site not ready║
╠══════════════════════════════════════════════════════════════════════════════╣
║  RECO CONFIDENCE BANDS                  SLIP HISTORY                         ║
║  High confidence (SAP confirmed): €XXm  [Bar: how many times deals slipped  ║
║  Medium (in delivery):            €XXm   from planned Reco quarter]          ║
║  Low (date set, not started):     €XXm  Q1→Q2 slips: XX  Q2→Q3: XX          ║
║  No date set:                     €XXm  ⚠ Average: XX% of Q Reco slips once ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

### Page 4.3 — Book & Bill Tracker

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  BOOK & BILL — Same-Period OIT & Reco  [● OIT + RECO]                       ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  BOOK & BILL VALUE YTD   BOOK & BILL % OF RECO   PRODUCT MIX OF B&B         ║
║  €XX.Xm                  XX.X%                   Software: XX%  HW: XX%     ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  MONTHLY B&B VOLUME                     B&B BY REGION                       ║
║  [Bar chart: B&B value per month]       [Stacked bar: B&B by region/month]  ║
║  [Line: B&B as % of total monthly Reco] N.Am XX%  Eur XX%  Intercon XX%     ║
║                                                                              ║
║  Insight: B&B is the end-of-quarter acceleration mechanism — track whether  ║
║  it is growing (= more standard/software sales) or shrinking (= more custom  ║
║  complex deals requiring long implementation)                                ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

## 7. Tab 5 — Margin Analysis

**Lifecycle layer:** Layer 5 — Margin
**Audience:** Finance Controllers, Pricing team, CFO
**Purpose:** Understand actual earned margin — not CRM estimates, not Sofon standard, but SAP actual — and explain variance from budget

---

### Page 5.1 — Price Realization Waterfall

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  PRICE REALIZATION & MARGIN — 2026 YTD [● MARGIN]                           ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  MARGIN RECONCILIATION (per unit average across all deals)                  ║
║                                                                              ║
║  CRM Estimate at Deal Creation  XX.X%  (DS%/DH%-weighted, from CRM)         ║
║  ─────────────────────────────────────────────────────────────────           ║
║  List Price            €XXX,XXX  ████████████████████████████               ║
║  – Discount            –€XX,XXX  ████░░░░░░░░░░░░░░░░░░░░░░  –X.X%         ║
║  = Net Turnover         €XXX,XXX  ████████████████████         = XX%         ║
║  – Sofon Standard Cost –€XX,XXX  ████████████░░░░░░           (Sofon std)   ║
║  = Standard Margin      €XX,XXX   ████████████                 = XX%         ║
║  – Actual vs Standard  –€X,XXX   █████░░░░░░                  (cost delta)  ║
║  = Actual SAP Margin    €XX,XXX   █████████                    = XX% ← REAL  ║
║                                                                              ║
║  [CRM Est XX% → Standard XX% → Actual XX%] — gap explained here             ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  MARGIN BY EQUIPMENT TYPE             MARGIN BY REGION                      ║
║  DR 100e   ████████ 39.2%             N.America    ████████ 41.1%           ║
║  DR 400    ███████░ 36.8%             Europe N.    ███████░ 38.4%           ║
║  DR 600    ██████░░ 34.1%             Europe S.    █████░░░ 32.1%           ║
║  DR 800    █████░░░ 31.5%             Intercontinl ██████░░ 36.7%           ║
║  Retrofit  ████████ 42.3% ← best                                            ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  DEAL MARGIN SCATTER                                                         ║
║  Y: Actual Margin %   X: Deal Value   Colour: Region   Size: Equipment Type ║
║  Each dot = 1 deal    Tooltip: Customer, KAM, Equip, CRM est., Actual delta ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

### Page 5.2 — Margin Bridge (Budget vs Actual)

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  MARGIN BRIDGE — YTD vs Budget         [● MARGIN]                            ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  [Waterfall — answers "WHY is our margin different from budget?"]            ║
║                                                                              ║
║  Budget Margin              €XX.Xm  ████████████████████████                ║
║  + Volume effect            +€X.Xm  ████  (more deals won)                  ║
║  +/– Mix effect             –€X.Xm  ██░   (more DR 800 vs DR 100e)          ║
║  +/– Price/Discount effect  +€X.Xm  ██    (tighter discount discipline)     ║
║  +/– Cost variance          –€X.Xm  ██░   (actual cost > Sofon standard)    ║
║  +/– FX effect              –€X.Xm  █░    (USD/EUR movement)                ║
║  +/– Channel mix            +€X.Xm  █     (more direct vs dealer)           ║
║  = Actual Margin              €XX.Xm                                         ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  BRIDGE TREND (Quarterly)                                                    ║
║  [Stacked bar per quarter: Volume / Mix / Price / Cost / FX / Channel]       ║
║  Shows: which driver is consistently hurting margin quarter over quarter?    ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

### Page 5.3 — Deal Scoring & Pipeline Quality

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  DEAL SCORING & PIPELINE QUALITY       [● PIPELINE]                          ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  SCORING CALIBRATION — DS% vs Actual Win Rate                                ║
║                                                                              ║
║  DS% Band   Deals Scored   Won   Actual Win%   Calibration                  ║
║  DS 30       XX            X      XX%          DS 30 should = ~30% win      ║
║  DS 50       XX            X      XX%          ● Well calibrated             ║
║  DS 70       XX            X      XX%          ⚠ Over-confident?            ║
║  DS 90       XX            X      XX%          ✗ Only XX% won (target 90%)  ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  DS% vs DH% DISTRIBUTION (scatter)     FEASIBILITY SCORE BREAKDOWN          ║
║  [Scatter: open opps, X=DS%, Y=DH%]    [Treemap: open opp count × value     ║
║  Ideal: cluster near diagonal           by feasibility band 10/30/50/70/90] ║
║  Off-diagonal = scoring inconsistency  Higher feasibility = better quality   ║
║                                         pipeline signal                      ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  SOFON QUOTE COMPLIANCE                                                      ║
║  Stage        Total Opps  Quote Sent  % Compliance   Action                 ║
║  Quoting      XX          XX          XX%   ●        All good               ║
║  Negotiating  XX          XX          XX%   ⚠        X missing quotes       ║
║  Closing      XX          XX          XX%   ✗        Escalate               ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

## 8. Tab 6 — Channel & Sales Actuals

**Lifecycle layer:** Layer 2 (posted actuals) + multi-year historical
**Audience:** Channel Managers, Sales Directors, Finance Controllers
**Purpose:** Posted SAP revenue — by partner, product line, multi-year — the commercial track record

---

### Page 6.1 — Partner Overview (Multi-Year)

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  PARTNER PERFORMANCE — 2024 / 2025 / 2026  [● ACTUALS]                       ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  CHANNEL REVENUE YTD   vs TARGET   vs PY    ACTIVE PARTNERS   AVG/PARTNER   ║
║  €XX.Xm                +X.X%       +X.X%    XX                €XXXk         ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  MULTI-YEAR PARTNER REVENUE (2024 | 2025 | 2026 YTD)                        ║
║  [Clustered bar per partner — top 20]                                        ║
║  [Colour: Goods / Implementation / Support mix within each year]             ║
║  Shows: is the revenue type mix shifting per partner over time?              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  PARTNER HEALTH MATRIX                  REVENUE TYPE EVOLUTION               ║
║  Y-axis: Margin %                       [100% stacked bar per year]          ║
║  X-axis: Revenue growth % (CY vs PY)    Goods / Impl / Support by year       ║
║  Size: absolute revenue value           Shows macro shift in business model  ║
║  Colour: region                                                              ║
║  Target zone: high growth + high margin                                      ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

### Page 6.2 — Partner Deep Dive

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  PARTNER DEEP DIVE — [Select Partner ▼]    [● ACTUALS]                       ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  Partner:  [Name]        Region: [X]       Channel Mgr: [Name]               ║
║  SAP ID:   [XXXXXX]      Type:   Dealer    Active since: 20XX                ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  REVENUE TREND (Monthly drill-down, all years)  REVENUE TYPE SHIFT           ║
║  [Line chart: 2024 / 2025 / 2026]               [100% stacked bar per year]  ║
║  Shows multi-year seasonality and growth         Goods / Impl / Support      ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  PRODUCT MIX (Units + Revenue)          MARGIN TREND (Goods, RLS-protected) ║
║  [Bar: product family × year]           [Line: margin % per quarter]         ║
║  Main equipment + services breakdown    Is this partner's margin improving?  ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  TARGET vs ACTUAL (Monthly — current year)                                   ║
║  [Clustered bar: Target / Actual per month]  Running gap to annual target    ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

### Page 6.3 — Top Partner Rankings

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  TOP PARTNER RANKINGS         [Filters: Year | Region | Channel | BC Group] ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  PARTNER BUBBLE CHART                    RANKED TABLE                        ║
║  X-axis: Revenue growth % (CY vs PY)     Rank  Partner   Region  Mgr  Rev   ║
║  Y-axis: Margin %                         1    [Name]    N.Am.   [X]  €XXm  ║
║  Bubble size: absolute revenue            2    [Name]    Eur.N.  [X]  €XXm  ║
║  Colour: region                           ...                                ║
║                                                                              ║
║  Four quadrants:                         [Select row to open Page 6.2]      ║
║  Top-right:  Star partners (grow + margin)                                   ║
║  Top-left:   Defend (high margin, low growth)                                ║
║  Bot-right:  Invest (growing but thin margin)                                ║
║  Bot-left:   Review (low growth + low margin)                                ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

### Page 6.4 — Product Line Sales (Multi-Year)

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  PRODUCT LINE SALES — 2024 / 2025 / 2026 YTD    [● ACTUALS]                 ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  UNIT VOLUMES BY PRODUCT FAMILY                                              ║
║  [Clustered bar: product family × year, 3 years side by side]               ║
║  DR Products:  DR 100e / DR 400 / DR 600 / DR 800 / Retrofit / DX-D 300     ║
║  Shows unit trends: is DR 800 growing at DR 600 expense?                    ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  REVENUE BY TYPE (Goods / Implementation / Support)                          ║
║  [Clustered bar + 100% stacked — 3 years]                                   ║
║  Is the services attach rate improving? (Impl + Support growing as % of HW) ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  BUDGET CLASS MIX EVOLUTION                                                  ║
║  [100% stacked bar: DR Products / CR Products / FPS per year]               ║
║  Shows: DR growing as share of total AGFA DR business                       ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

### Page 6.5 — Sales History (CY / PY / PY-1)

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  SALES HISTORY — 3-YEAR COMPARISON     [● ACTUALS]                           ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  REVENUE TYPE PIVOT                                                          ║
║  ─────────────────────────────────────────────────────────────────           ║
║               2024 FY   2025 FY   2026 YTD   2026 FY FC   Δ PY   Δ PY-1    ║
║  Goods        €XXm      €XXm      €XXm       €XXm         +X%    +X%        ║
║  Implementation €XXm    €XXm      €XXm       €XXm         +X%    +X%        ║
║  Support      €XXm      €XXm      €XXm       €XXm         +X%    +X%        ║
║  TOTAL        €XXm      €XXm      €XXm       €XXm         +X%    +X%        ║
║                                                                              ║
║  [The PY-1 column prevents a one-time event looking like a trend]            ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  MULTI-YEAR KPI CHART (custom visual)                                        ║
║  [Bullet/variance chart: 2026 actual vs 2025 vs 2024]                       ║
║  [By region — shows which regions are driving multi-year growth]             ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

### Page 6.6 — SAP Channel Data Quality

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  SAP CHANNEL DATA QUALITY              [Data Steward Tool]                   ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  CHANNEL ASSIGNMENT ISSUES                                                   ║
║  [Table: Bill-to party | Name | Country | SAP channel | APX classification] ║
║  [Filter: show only #-Not assigned or mismatches between SAP and APX]        ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  UNCLASSIFIED REVENUE (SAP channel = #Not Assigned)                          ║
║  €XXm — XX% of total channel revenue is unclassified                        ║
║  By country: [Table — which countries have highest unclassified %]           ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

## 9. Universal — Order Detail Drill-Through Page

Available from every page via right-click → Drill Through. Pre-filtered to selected opportunity/order.

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  ORDER DETAIL — [OPP-XXXXX]                              ← Back              ║
╠════════════════════════╦═════════════════════════════════════════════════╣
║  DEAL IDENTITY         ║  FINANCIAL SUMMARY                               ║
║  Customer:  [Name]     ║  OIT Value:       €X.Xm                         ║
║  Region:    N.America  ║  CRM Margin est:  XX.X%  (at deal creation)     ║
║  KAM:       [Name]     ║  Actual Margin:   XX.X%  (SAP posted)           ║
║  SAP Order: [ID]       ║  Margin Delta:    –X.X%  (est vs actual)        ║
║  Sofon ID:  [ID]       ║  Discount given:  –XX.X% vs list price          ║
╠════════════════════════╩═════════════════════════════════════════════════╣
║  LIFECYCLE TIMELINE                                                          ║
║  Created     Quoted       Won        Planned Reco   Actual Reco              ║
║  [date]  ──► [date]  ──► [date]  ──► [date]    ──► [date / pending]         ║
║  DS%: XX   Sofon: ✅    SAP: ✅    On track: ●   Status: In delivery        ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  PRODUCT LINE DETAIL                  FORECAST HISTORY (weekly)              ║
║  Equipment   Qty  Unit €  Cost+  Margin  W08: Upside                         ║
║  DR 800×3    3    €XXXk   €XXXk  XX%     W09: Incl w/Risk                   ║
║  Impl Svcs   —    €XXXk   €XXXk  XX%     W10: Incl w/Risk                   ║
║  Support     —    €XXXk   €XXXk  XX%     W11: Included  ← improvement       ║
║  TOTAL       —    €X.Xm   €X.Xm  XX%     W12: Included                      ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

## 10. EDW Semantic Layer — What Feeds Every Page

### 10.1 Conformed Dimensions (Single Version of Truth)

| Dimension | Fixes | All Pages Use |
|-----------|-------|---------------|
| `dim_geography` | 4 different region field names across reports | One table: Destination → Region → Subregion → Group → Cluster |
| `dim_forecast_category` | 3 different label sets across reports | One table: code + standard label + sort order |
| `dim_product` | SAP material ≠ Sofon PF ≠ D365 equipment type | One table: SAP material → Sofon PF → Equipment type → Revenue stream |
| `dim_calendar` | No fiscal calendar in current reports | One table: Fiscal Year / Fiscal Q / Fiscal Week / ISO Week |
| `dim_customer` | D365 account ID ≠ SAP sold-to party | One table: D365 cr57c_accountid ↔ SAP agfa_saprecordid |

### 10.2 Core Fact Tables

| Fact Table | Source | Grain | Layers Powered |
|-----------|--------|-------|---------------|
| `fact_opportunity_weekly` | D365 CRM (weekly snapshot) | Opportunity × Week | Layers 1, 2 |
| `fact_orders` | SAP (via agfa_saporderid join) | SAP order × line | Layers 2, 3 |
| `fact_revenue` | SAP FeedFile (AP7) | SAP invoice line | Layers 2, 4, 5 |
| `fact_price_realisation` | SAP BW (BP5/AP5 + BP2/AP2) | SAP doc line + CRM opp | Layers 2, 5 |
| `fact_budget` | Planning system / Excel (automated) | Dealer × Month × Type × BC | All layers (plan side) |

---

## 11. Phased Delivery Plan

| Phase | Deliverable | Lifecycle Layers | Pages Live |
|-------|-------------|-----------------|-----------|
| **Phase 0** | Fix existing reports (label alignment, Reco page from existing data, 2× Upside KPI) | 1, 2 | 0 new pages; existing 6 reports improved |
| **Phase 1** | EDW Bronze + Silver + conformed dimensions | Foundation | n/a |
| **Phase 2** | Tab 1 (Executive) + Tab 2 (Commercial + Ops) + Tab 6 (Channel multi-year) | 1, 2, historical | 13 pages |
| **Phase 3** | Tab 3 (Order Book) + Tab 4 (Revenue Reco) | 3, 4 | +5 pages |
| **Phase 4** | Tab 5 (Margin full: bridge + actual vs standard) | 5 | +3 pages |
| **Phase 5** | Predictive analytics, what-if simulators, automated alerts | All | +0 pages, enhanced |

---

## 12. Feedback Questions for Business Users

### On the Lifecycle Story
1. The Revenue Walk (OIT → Order Book → Reco) is the spine of the design. Does this map to how you report monthly to leadership?
2. Which of the three currently-empty layers (Order Book, Reco, Actual Margin) would have the most immediate impact on decision-making if it were live tomorrow?

### On Coverage
3. Are there reports or slides you build manually for MPR that are still not covered in this design?
4. The Sales Operations pages (KAM Scorecard, SubRegion Weekly, New Pipeline) mirror the existing Friday meeting format. Would you retire the old reports once these are live?

### On Margin
5. There are currently 3 different margin numbers (CRM estimate / Sofon standard / SAP actual). Which one does the business currently report as "the margin number"? Should the new dashboard change that?
6. The margin bridge (Volume / Mix / Price / Cost / FX) — is this level of decomposition useful or too granular?

### On Scoring
7. DS%/DH%/Feasibility scores are treated as reliable client-calculated inputs. Should the dashboard show the calibration chart (DS 70 → does it actually win at 70%?) or is that politically sensitive?

### On Partner / Channel
8. The multi-year partner view shows margin with row-level security. Who should have access to which partners' margin data?
9. Is 3 years of history (2024/2025/2026) enough for the partner trend view, or do you need to go back further?

### On Delivery
10. Phase 0 can deliver improvements to existing reports within weeks (no EDW needed). Which of the existing reports' fixes (Reco page, 2× Upside rule, label alignment) would be most valuable to start with?

---

*Dashboard Design Plan v2.0 — AGFA Digital Radiology*
*Full lifecycle coverage: Pipeline → OIT → Order Book → Reco → Margin*
*2026-03-26*
