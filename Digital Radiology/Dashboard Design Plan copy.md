# AGFA Digital Radiology — Analytics Dashboard Design Plan
**Version:** 1.0 — For Business User Review & Feedback
**Prepared by:** Business Analyst
**Date:** 2026-03-26
**Audience:** Financial Controllers, CFO, Commercial Leaders

---

## 1. Design Philosophy

### 1.1 The Problem with Current State
The existing 6 Power BI reports answer one question: **"How is the funnel performing this week?"**

What financial controllers and CFOs actually need is the answer to a different, more critical question:

> *"Given what we have sold, what have we recognised, and what is still in the pipe — are we going to make our financial commitments for the quarter and the year?"*

The current reports cannot answer this because they sit entirely on the **left side of the revenue lifecycle**:

```
FUNNEL  ──►  ORDER INTAKE  ──►  ORDER BOOK  ──►  RECO  ──►  CASH
  ✅              ✅                  ❌             ❌         ❌
(covered)      (covered)          (missing)     (missing)  (missing)
```

The EDW closes this gap. Every page of the proposed dashboard is designed around a specific moment in this lifecycle.

### 1.2 Design Principles

| Principle | What It Means in Practice |
|-----------|--------------------------|
| **Answer first, detail second** | Every page opens with a single headline number and a RAG status — the CFO can read the story in 10 seconds |
| **High-to-low drill path** | Company → Region → Country → Customer → Order → Line Item — every metric supports the same drill chain |
| **Actuals vs Plan always visible** | Every chart shows CY, Budget, Forecast, and PY in the same view — no toggling |
| **Time horizon switching** | Weekly / Monthly / Quarterly / YTD / Full Year — one click, same page |
| **Forward-looking bias** | Every page has at least one forward-looking view (what will happen), not just backward-looking (what happened) |
| **Single source of truth** | All pages are fed from the same EDW semantic layer — no more label inconsistencies across reports |

---

## 2. Dashboard Architecture

### 2.1 Navigation Structure

The dashboard is organised as a **two-level navigation system**:
- **Level 1 — Domain Tabs** (always visible top nav): 5 financial domains
- **Level 2 — Perspective Pages** (left side nav within each domain): 2–4 pages per domain

```
┌─────────────────────────────────────────────────────────────────────┐
│  AGFA Digital Radiology | Analytics                    [Global Filters] │
├───────────┬──────────────┬─────────────┬───────────┬─────────────────┤
│  EXECUTIVE│  COMMERCIAL  │  REVENUE    │  MARGIN   │  CHANNEL &     │
│  OVERVIEW │  PERFORMANCE │  & RECO     │  ANALYSIS │  PIPELINE       │
└───────────┴──────────────┴─────────────┴───────────┴─────────────────┘
│                                                                         │
│  [Left Nav — sub-pages]         [Main Canvas]                           │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Global Filter Bar (Persistent Across All Pages)

```
  Year: [2026 ▼]    Quarter: [All ▼]    Region: [All ▼]    BU: [DR ▼]    [Reset Filters]
```

These filters cascade across every page. Selection persists when the user navigates between tabs.

---

## 3. Dashboard Pages — Detailed Design

---

### TAB 1 — EXECUTIVE OVERVIEW

**Audience:** CFO, VP Finance, Regional VPs
**Purpose:** One page that tells the complete financial story — no clicking required
**Refresh cadence:** Weekly (aligned to Monday Revenue Walk)

---

#### Page 1.1 — Executive Scorecard

**Layout: Full Page**

```
╔═══════════════════════════════════════════════════════════════════════╗
║  EXECUTIVE SCORECARD — Digital Radiology          Week 12 | 2026-03-21  ║
╠════════════╦════════════╦════════════╦═════════════╦══════════════════╣
║            ║            ║            ║             ║                  ║
║  ORDER     ║  REVENUE   ║  GROSS     ║  ORDER      ║  PIPELINE        ║
║  INTAKE    ║  RECO      ║  MARGIN    ║  BOOK       ║  COVERAGE        ║
║            ║            ║            ║             ║                  ║
║  €XX.Xm    ║  €XX.Xm    ║  XX.X%     ║  €XX.Xm     ║  XXX%            ║
║  vs BT ▲X% ║  vs BT ▲X% ║  vs BT ▼X% ║  vs PY ▲X%  ║  vs Target ▲XX%  ║
║  ● On Track ║  ⚠ At Risk  ║  ⚠ At Risk  ║  ● Healthy  ║  ● Strong        ║
║            ║            ║            ║             ║                  ║
╠════════════╩════════════╩════════════╩═════════════╩══════════════════╣
║                                                                         ║
║  REVENUE WALK — YTD                          ║  QUARTERLY TREND        ║
║                                              ║                         ║
║  [Opening OB]  ──► [+OIT]  ──► [–Reco]       ║  [Line chart: OIT/Reco  ║
║    €XXXm        +€XXm       –€XXm             ║   /Margin Q1'25–Q4'26]  ║
║                  ──► [=Closing OB]            ║                         ║
║                      €XXXm                   ║                         ║
╠══════════════════════════════════════════════╩═════════════════════════╣
║                                                                         ║
║  REGIONAL PERFORMANCE HEATMAP                                           ║
║                                                                         ║
║  Region           OIT vs BT    Reco vs BT    Margin    Pipeline Cover   ║
║  North America    ██████ 108%  ████░░ 94%    41.2%     ███████ 2.4×     ║
║  Europe North     ████░░  87%  █████░ 101%   38.7%     ██████░ 1.9×     ║
║  Europe South     ███░░░  72%  ███░░░  78%   35.1%     █████░░ 1.6×     ║
║  Intercontinental ████░░  91%  ████░░  88%   39.4%     ████░░░ 1.4×     ║
║                                                                         ║
╚═════════════════════════════════════════════════════════════════════════╝
```

**Key Metrics on This Page:**
- **5 KPI Cards** with RAG status: OIT, Reco, Margin %, Order Book, Pipeline Coverage
- **Revenue Walk bar/waterfall**: Opening Order Book → OIT → Reco → Closing Order Book (YTD)
- **4-quarter trend line**: OIT / Reco / Margin on same axis — shows whether OIT lead is translating to revenue
- **Regional heatmap**: 4 regions × 4 KPIs — color-coded to budget %

**Drill-down:** Click any region row → navigates to Page 2.1 (Commercial Performance) pre-filtered to that region

---

#### Page 1.2 — Financial Forecast & Outlook

**Audience:** CFO, Finance Controllers
**Purpose:** Answer "will we make the quarter / year?" with confidence interval

```
╔══════════════════════════════════════════════════════════════════════╗
║  FINANCIAL OUTLOOK — Q2 2026                                           ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                        ║
║  Q2 OIT FORECAST                       Q2 RECO FORECAST               ║
║  ┌─────────────────────────────┐       ┌──────────────────────────┐   ║
║  │ Won (locked)     €XX.Xm ████│       │ Already delivered  €XX.Xm│   ║
║  │ Incl & Secured   €XX.Xm ███ │       │ In delivery        €XX.Xm│   ║
║  │ Included         €XX.Xm ██  │       │ Planned Q2 Reco    €XX.Xm│   ║
║  │ Incl w/ Risk     €XX.Xm █   │       │ Upside / B&B       €XX.Xm│   ║
║  │ Upside           €XX.Xm ░   │       └──────────────────────────┘   ║
║  │ Budget Target    €XX.Xm ─── │                                       ║
║  └─────────────────────────────┘                                       ║
║                                                                        ║
║  SCENARIO ANALYSIS                     QUARTER PHASING (Monthly)      ║
║  Base Case:    €XX.Xm (vs BT: +X%)     [Apr] [May] [Jun] vs Budget    ║
║  Bear Case:    €XX.Xm (–X% risk)        OIT: Bar | Reco: Line          ║
║  Bull Case:    €XX.Xm (+X% upside)                                     ║
║                                                                        ║
╠══════════════════════════════════════════════════════════════════════╣
║  UPSIDE RULE COMPLIANCE (2× Rule)                                      ║
║  Region        Incl w/ Risk   Upside   Ratio   Status                  ║
║  N.America     €X.Xm          €X.Xm    2.4×    ● Compliant            ║
║  Europe N.     €X.Xm          €X.Xm    1.7×    ⚠ Below 2×            ║
║  Europe S.     €X.Xm          €X.Xm    1.2×    ✗ Non-Compliant        ║
╚══════════════════════════════════════════════════════════════════════╝
```

**Key Analytics:**
- **Forecast stacked bar** decomposed by forecast flag — visual representation of confidence layers
- **Base/Bear/Bull scenario**: Base = Won + I&S + Included; Bear = Won + I&S; Bull = Base + weighted Upside
- **Monthly phasing**: how the quarter builds month by month (Apr/May/Jun vs budget)
- **2× Upside Rule table**: for the first time, this playbook rule becomes a visible, tracked KPI

**Value to CFO:** This single page replaces the manual Excel the finance team currently builds every week to answer "where do we land vs budget?"

---

### TAB 2 — COMMERCIAL PERFORMANCE

**Audience:** Commercial Directors, Regional VPs, Sales Controllers
**Purpose:** OIT performance management — from region down to deal level

---

#### Page 2.1 — OIT Performance Dashboard

```
╔══════════════════════════════════════════════════════════════════════╗
║  ORDER INTAKE — 2026 YTD             Last Updated: W12 2026-03-21     ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                        ║
║  [KPI Row]  OIT Actual  |  vs Budget  |  vs PY  |  vs Forecast        ║
║             €XX.Xm       +X.X%         +X.X%     –X.X%                ║
║                                                                        ║
║  OIT TREND (Weekly Actuals vs Budget vs PY)                            ║
║  [Running total line chart — W01 to W12, 3 series]                     ║
║                                                                        ║
╠══════════════════╦═══════════════════════════════════════════════════╣
║  REGION WATERFALL║  OIT BY PRODUCT MIX                                ║
║                  ║                                                     ║
║  [Waterfall:     ║  [Stacked bar by month]                             ║
║   PY base        ║  ■ DR 100e  ■ DR 400  ■ DR 600                      ║
║   +/- per region ║  ■ DR 800   ■ Retrofit ■ DX-D 300                  ║
║   = CY total]    ║  ■ Valory   ■ Software ■ Services                   ║
║                  ║                                                     ║
╠══════════════════╩═══════════════════════════════════════════════════╣
║  DEAL LEADERBOARD — Top 20 Deals Won YTD                               ║
║  Rank  Deal/Customer  Region    Equipment   €Value  Margin%  Close Date ║
║   1    [Hospital A]   N.America DR 800      €X.Xm   41.2%   Jan-26     ║
║   2    [Hospital B]   Europe N. DR 600      €X.Xm   38.5%   Feb-26     ║
║  ...                                                                   ║
╚══════════════════════════════════════════════════════════════════════╝
```

**Drill path:** Click a region → sub-region → country → customer → single deal

---

#### Page 2.2 — Pipeline & Funnel Health

```
╔══════════════════════════════════════════════════════════════════════╗
║  PIPELINE HEALTH — Q2 & Q3 2026 OUTLOOK                               ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                        ║
║  FUNNEL SNAPSHOT (Current Week)              FUNNEL EVOLUTION          ║
║  ┌────────────────────────────┐             [Sankey / slope chart:     ║
║  │ Won            €XX.Xm ████│             W08 → W09 → W10 → W11 →    ║
║  │ Incl & Secured €XX.Xm ███ │             show upgrades/downgrades    ║
║  │ Included       €XX.Xm ██  │             between flag categories]    ║
║  │ Incl w/ Risk   €XX.Xm █   │                                         ║
║  │ Upside         €XX.Xm ░   │                                         ║
║  │ ─── Budget Gap ───         │                                         ║
║  │ Gap to Close   €X.Xm  ░░  │                                         ║
║  └────────────────────────────┘                                         ║
║                                                                        ║
╠══════════════════════════════════════════════════════════════════════╣
║  STAGE CONVERSION ANALYSIS              AVERAGE DEAL VELOCITY          ║
║  Identifying → Qualifying  XX% (Δ–X%)  Identifying → Won: XX days     ║
║  Qualifying  → Quoting     XX% (Δ+X%)  vs 2025 benchmark:  XX days     ║
║  Quoting     → Negotiating XX% (Δ–X%)                                  ║
║  Negotiating → Won         XX% (Δ+X%)  OVERDUE OPPORTUNITIES: XX       ║
║                                        AT RISK (risk flag):   XX       ║
║                                        CHECK STAGING:         XX       ║
╚══════════════════════════════════════════════════════════════════════╝
```

**Advanced analytics on this page:**
- **Funnel movement matrix** (week-over-week): how many deals moved up/down/stayed in each category — this is currently invisible in all existing reports
- **Stage conversion rates with trend arrows** — is the funnel getting more or less efficient?
- **Deal velocity** — average days per stage, so management can predict close timing

---

#### Page 2.3 — Win / Loss Analysis

```
╔══════════════════════════════════════════════════════════════════════╗
║  WIN / LOSS ANALYSIS — 2025 Full Year & 2026 YTD                       ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                        ║
║  WIN RATE           LOST VALUE         AVG DEAL SIZE                   ║
║  XX% (vs 2025: +X%) €XX.Xm YTD         Won: €XXX,XXX                  ║
║                                         Lost: €XXX,XXX                 ║
║                                                                        ║
║  WIN RATE BY REGION          WIN RATE BY EQUIPMENT TYPE                ║
║  [Bar chart, sorted desc]    [Bar chart: DR100e DR400 DR600 DR800...]   ║
║                                                                        ║
║  WIN RATE BY DEAL SIZE BAND  LOSS REASON BREAKDOWN                     ║
║  <€100k:  XX%                [Pareto: Price / Competitor / Timing /    ║
║  €100–500k: XX%               No Budget / Spec Mismatch / Cancelled]   ║
║  €500k–1m: XX%                                                         ║
║  >€1m:    XX%                                                           ║
║                                                                        ║
╠══════════════════════════════════════════════════════════════════════╣
║  COMPETITIVE INTELLIGENCE (from loss reason CRM field)                 ║
║  Competitor     Encounters  Won  Lost  Win Rate  Avg Deal Lost          ║
║  Competitor A   XX          X    X     XX%       €XX,XXX                ║
║  Competitor B   XX          X    X     XX%       €XX,XXX                ║
╚══════════════════════════════════════════════════════════════════════╝
```

**New capability — never existed before.** Currently every loss is silent. This page gives Marketing and Sales leadership the first systematic view of where and why deals are being lost.

---

#### Page 2.4 — Large & Strategic Deal Tracker

```
╔══════════════════════════════════════════════════════════════════════╗
║  LARGE DEAL TRACKER (>€500k)     ■ Strategic  ◆ Large  ● Watch List   ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                        ║
║  DEAL TIMELINE (Gantt-style)                                           ║
║  ┌────────────────────────────────────────────────────────────┐        ║
║  │Deal          Region    €Value  Stage       Q1  Q2  Q3  Q4  │        ║
║  │■ Hospital X  N.Am.     €2.1m  Negotiating  ──[====]──       │        ║
║  │■ Clinic Y    Eur N.    €1.4m  Quoting      ───[==]───       │        ║
║  │◆ Network Z   Intercont €0.8m  Identifying  ────[=======]    │        ║
║  └────────────────────────────────────────────────────────────┘        ║
║                                                                        ║
║  DEAL DETAIL PANEL (click any row)                                     ║
║  ┌──────────────────────────────────────────────────────────┐          ║
║  │ Customer:   [Hospital X]    KAM: [Name]                  │          ║
║  │ Region:     N.America       Team: [Commercial Lead]       │          ║
║  │ Equipment:  DR 800 × 3      Est. Close: Q2 2026           │          ║
║  │ Value:      €2.1m           Margin:  39.5%                │          ║
║  │ DS%: 70     DH%: 70         Feasibility: 70%              │          ║
║  │ Forecast:   Included        Sofon Quote: ✅ Sent           │          ║
║  │ SAP Order:  Not yet         Last Stage Change: W09→W10    │          ║
║  │                                                           │          ║
║  │ WEEK-ON-WEEK STAGE HISTORY                                │          ║
║  │ W07:Qualifying → W09:Quoting → W11:Negotiating           │          ║
║  └──────────────────────────────────────────────────────────┘          ║
╚══════════════════════════════════════════════════════════════════════╝
```

**Value:** This replaces the manual spreadsheet/slide deck used to track strategic deals in Business Pulse and MPR. Every deal's full history, CRM signals, and stage movement are in one place.

---

### TAB 3 — REVENUE & RECO

**Audience:** Finance Controllers, Revenue Recognition team, CFO
**Purpose:** Track the journey from Won order to recognised revenue — the currently invisible part of the lifecycle

---

#### Page 3.1 — Revenue Recognition Dashboard

```
╔══════════════════════════════════════════════════════════════════════╗
║  REVENUE RECOGNITION — 2026                                            ║
╠════════════╦═════════════╦═════════════╦══════════════════════════════╣
║ RECO YTD   ║ RECO Q2 FC  ║ RECO FY FC  ║  OIT → RECO CONVERSION LAG  ║
║ €XX.Xm     ║ €XX.Xm      ║ €XX.Xm      ║  Avg: XX days               ║
║ vs BT: XX% ║ vs BT: XX%  ║ vs BT: XX%  ║  Target: ≤ XX days          ║
╠════════════╩═════════════╩═════════════╩══════════════════════════════╣
║                                                                        ║
║  RECO PHASING — MONTHLY (Planned vs Actual)                            ║
║  [Clustered bar: each month has Actual (solid) + Planned (outlined)]   ║
║  Jan ████ / ████  Feb ███ / █████  Mar ██████ / ████  Apr ── / █████  ║
║                                                                        ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                        ║
║  REVENUE WATERFALL — Q2 2026                                           ║
║  ┌──────────────────────────────────────────────────────────────┐      ║
║  │ Q1 Closing OB   +OIT Won Q2   –Reco Q2   =Q2 Closing OB     │      ║
║  │    €XXXm          +€XXm        –€XXm         €XXXm           │      ║
║  └──────────────────────────────────────────────────────────────┘      ║
║                                                                        ║
╠══════════════════════════════════════════════════════════════════════╣
║  RECO RISK — DEALS WHERE PLANNED RECO DATE IS APPROACHING              ║
║                                                                        ║
║  Status         Count   Value      Action                              ║
║  Reco this month  XX    €XX.Xm    → Confirm installation complete      ║
║  Reco next month  XX    €XX.Xm    → In delivery, on track              ║
║  Overdue Reco     XX    €XX.Xm    → ⚠ Requires escalation             ║
║  Not yet planned  XX    €XX.Xm    → KAM to enter Reco date in CRM      ║
╚══════════════════════════════════════════════════════════════════════╝
```

**The single most impactful new page.** Financial controllers currently build this manually every month for MPR. This replaces that process entirely.

---

#### Page 3.2 — Order Book (Backlog) Management

```
╔══════════════════════════════════════════════════════════════════════╗
║  ORDER BOOK — Digital Radiology                    Snapshot: W12 2026  ║
╠════════════╦═════════════╦═════════════╦══════════════════════════════╣
║ TOTAL OB   ║ EQUIPMENT   ║ IMPLEMENTN  ║ BOOK & BILL                  ║
║ €XXX.Xm    ║ €XX.Xm      ║ €XX.Xm      ║ €XX.Xm (same-period)        ║
╠════════════╩═════════════╩═════════════╩══════════════════════════════╣
║                                                                        ║
║  ORDER BOOK COMPOSITION                 ORDER BOOK AGING               ║
║  [Stacked donut]:                       [Horizontal bar]:              ║
║  ■ Planned Current Year:  XX%           < 3 months:    €XX.Xm (XX%)   ║
║  ■ Planned Next Years:    XX%           3–6 months:    €XX.Xm (XX%)   ║
║  ■ Overdue ≤ 6 months:    XX%           6–12 months:   €XX.Xm (XX%)   ║
║  ■ Not yet planned:       XX%           > 12 months:   €XX.Xm (XX%)   ║
║                                         Overdue:       €XX.Xm (XX%) ⚠ ║
║                                                                        ║
╠══════════════════════════════════════════════════════════════════════╣
║  ORDER BOOK EVOLUTION (13-month rolling)                               ║
║  [Area chart: 4 buckets stacked, Jan'25 to Jan'26 + current]          ║
║                                                                        ║
╠══════════════════════════════════════════════════════════════════════╣
║  ORDER BOOK DRILL — by Region                                          ║
║  Region       Total OB   Current Yr  Next Yrs  Overdue  Not Planned   ║
║  N.America    €XXXm      €XXm (XX%)  €XXm      €Xm      €XXm          ║
║  Europe N.    €XXm       ...                                           ║
║  Europe S.    €XXm       ...                                           ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

### TAB 4 — MARGIN ANALYSIS

**Audience:** Finance Controllers, Pricing team, Product Management
**Purpose:** Understand where margin is made and lost — from deal level to posted SAP actuals

---

#### Page 4.1 — Margin Waterfall (Price Realization)

```
╔══════════════════════════════════════════════════════════════════════╗
║  PRICE REALIZATION & MARGIN — 2026 YTD                                 ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                        ║
║  PRICE WATERFALL (per unit, average)                                   ║
║                                                                        ║
║  List Price         €XXX,XXX ████████████████████████                  ║
║  – Discount         –€XX,XXX ████░░░░░░░░░░░░░░░░░░░░  –X.X%          ║
║  = Net Price        €XXX,XXX ████████████████          = Realiz. XX%   ║
║  – Standard Cost    –€XX,XXX ████████████░░░░          (Sofon)         ║
║  = Gross Margin     €XX,XXX  ██████████                = GM XX%        ║
║  – Actual vs Std    –€X,XXX  ████░░░░░░                (SAP delta)     ║
║  = Actual Margin    €XX,XXX  █████████                 = Act. XX%      ║
║                                                                        ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                        ║
║  MARGIN BY EQUIPMENT TYPE                MARGIN BY REGION              ║
║  DR 100e  ████████ 39.2%                 N.America   ████████ 41.1%    ║
║  DR 400   ███████░ 36.8%                 Europe N.   ███████░ 38.4%    ║
║  DR 600   ██████░░ 34.1%                 Europe S.   █████░░░ 32.1%    ║
║  DR 800   █████░░░ 31.5%                 Intercontl  ██████░░ 36.7%    ║
║  Retrofit ████████ 42.3%                                               ║
║                                                                        ║
╠══════════════════════════════════════════════════════════════════════╣
║  DEAL MARGIN DISTRIBUTION (Scatter)                                    ║
║  Y-axis: Margin %  X-axis: Deal Value  Size: Revenue stream            ║
║  [Each dot = 1 deal; color = region; tooltip = deal name, KAM, date]   ║
╚══════════════════════════════════════════════════════════════════════╝
```

**Key advancement over current Report 3:** This page combines CRM-estimated margin with SAP-posted actual margin side by side. The delta column ("Actual vs Std") is the critical insight that shows where quotes are being over-promised. This is currently invisible.

---

#### Page 4.2 — Margin Bridge (Budget vs Actual)

```
╔══════════════════════════════════════════════════════════════════════╗
║  MARGIN BRIDGE — YTD vs Budget                                         ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                        ║
║  [Waterfall chart — horizontal]                                        ║
║                                                                        ║
║  Budget Margin              € XX.Xm ████████████████████               ║
║  + Volume effect            + € X.Xm ████ (more deals won)             ║
║  +/– Mix effect             – € X.Xm ██   (more low-margin equip.)     ║
║  +/– Price effect           + € X.Xm ██   (less discount given)        ║
║  +/– Cost variance          – € X.Xm ██   (actual cost > standard)     ║
║  +/– FX effect              – € X.Xm █    (USD/EUR movement)           ║
║  = Actual Margin              €XX.Xm                                   ║
║                                                                        ║
║  MARGIN TREND (quarterly, with bridge decomposition)                   ║
║  [Stacked bar per quarter: Volume / Mix / Price / Cost / FX / Actual]  ║
║                                                                        ║
╚══════════════════════════════════════════════════════════════════════╝
```

**Value to CFO:** The first time AGFA can answer "why is our margin XX% and not the budgeted XX%?" with a structured quantified bridge. Previously this was a manual quarterly exercise.

---

### TAB 5 — CHANNEL & PIPELINE

**Audience:** Channel Managers, Sales Directors, Partner Managers
**Purpose:** Partner/dealer performance, pipeline quality, and CRM data health

---

#### Page 5.1 — Channel Partner Performance

```
╔══════════════════════════════════════════════════════════════════════╗
║  PARTNER / CHANNEL PERFORMANCE — 2026                                  ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                        ║
║  [KPI Row] Channel Revenue | vs Target | Active Partners | Avg/Partner ║
║                                                                        ║
║  PARTNER REVENUE RANKING           REVENUE TYPE MIX BY PARTNER         ║
║  [Bar chart top 15, colored by     [100% stacked bar: Goods /          ║
║   growth vs prior year]             Implementation / Support]           ║
║                                                                        ║
║  PARTNER PERFORMANCE MATRIX        PARTNER HEALTH SCORE                ║
║  X-axis: Revenue vs Target %       [Bubble chart: size=revenue,        ║
║  Y-axis: Margin %                   X=revenue growth, Y=margin]        ║
║  [Each bubble = 1 partner]                                              ║
║                                                                        ║
╠══════════════════════════════════════════════════════════════════════╣
║  PARTNER DETAIL DRILL (click partner)                                  ║
║  Revenue trend | Deal pipeline | Product mix | Implementation rate     ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

#### Page 5.2 — CRM Data Quality Monitor

```
╔══════════════════════════════════════════════════════════════════════╗
║  CRM DATA QUALITY — PIPELINE INTEGRITY                                  ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                        ║
║  OVERALL QUALITY SCORE: XX/100    ⚠ 3 issues require immediate action  ║
║                                                                        ║
║  COMPLETENESS BY FIELD              ISSUES BY OWNER (KAM)              ║
║  ┌────────────────────────────┐     KAM Name     # Issues  Value at    ║
║  │ Forecast Category ████ 98% │                             Risk       ║
║  │ Close Date        ████ 94% │     [KAM A]         3       €X.Xm      ║
║  │ DS% / DH%         ███░ 87% │     [KAM B]         7       €X.Xm ⚠    ║
║  │ Reco Date         ██░░ 61% │     [KAM C]        12       €X.Xm ✗    ║
║  │ Sofon Quote       █░░░ 42% │                                         ║
║  │ SAP Order ID      ░░░░ 28% │                                         ║
║  └────────────────────────────┘                                         ║
║                                                                        ║
║  ACTION LIST — Open Issues                                             ║
║  [Table: Opportunity | Field Missing | KAM | Value | Days Outstanding] ║
╚══════════════════════════════════════════════════════════════════════╝
```

**Unique value:** This page turns CRM data quality from a conversation in a meeting into a **self-service accountability tool**. KAMs see their own score. Managers see where the data gaps are concentrated. Finance see what value of pipeline is at risk due to incomplete data.

---

## 4. Cross-Report Interactions

### 4.1 Drill-Down Path (Consistent Across All Tabs)

Every metric in every page supports the same drill chain:

```
Company Total
    └── Region Group (Europe / N.America / Intercontinental)
        └── Region (DACH / UK / France / USA / etc.)
            └── Subregion (DACH → Austria / Germany / Switzerland)
                └── Country
                    └── Customer / Account
                        └── Order / Opportunity
                            └── Order Line (Product × Revenue Stream)
```

Right-click → Drill Through on any number → opens **Order Detail Page** pre-filtered to that selection.

### 4.2 Order Detail Page (Universal Drill-Through Target)

```
╔══════════════════════════════════════════════════════════════════════╗
║  ORDER / DEAL DETAIL — [OPP-XXXXX]                     ← Back button   ║
╠══════════════════════════════════════════════════════════════════════╣
║  Customer:    [Name]        KAM:        [Name]                         ║
║  Region:      N.America     Subregion:  USA                            ║
║  SAP Order:   [ID]          Sofon ID:   [ID]                           ║
╠═══════════════════╦══════════════════════════════════════════════════╣
║  FINANCIAL        ║  TIMELINE                                          ║
║  OIT Value: €Xm   ║  Created:    [date]                               ║
║  CRM Margin: XX%  ║  Quoted:     [date]                               ║
║  Act. Margin: XX% ║  Won:        [date]                               ║
║  Δ vs CRM: –X.X%  ║  Planned Reco: [date]                             ║
║                   ║  Actual Reco:  [date or —]                        ║
╠═══════════════════╬══════════════════════════════════════════════════╣
║  PRODUCT LINES    ║  FORECAST HISTORY (weekly)                        ║
║  [Line detail:    ║  W07: Upside → W09: Incl w/Risk → W11: Included  ║
║   Equip, Qty,     ║  [Timeline bar showing stage + flag progression]  ║
║   Unit Price,     ║                                                    ║
║   Cost, Margin]   ║                                                    ║
╚═══════════════════╩══════════════════════════════════════════════════╝
```

---

## 5. Advanced Analytics Capabilities (Beyond Current State)

### 5.1 Predictive / AI-Assisted Features (Phase 2)

These are capabilities enabled by having a proper EDW — not possible from the current fragmented reports.

| Feature | Method | Value |
|---------|--------|-------|
| **Quarter-end OIT prediction** | Rolling 4Q average + regression on current funnel mix | Replaces manual prediction models in Report 6 with ML-based range |
| **Reco date slip prediction** | Historical average slip between planned and actual Reco date by equipment type | Alert when a deal's Reco is likely to slip out of the quarter |
| **Deal win probability score** | Logistic regression on DS%/DH%/stage/deal size/region/equipment type | Supplement or replace manual DS%/DH% with data-driven score |
| **Margin erosion alert** | Compare CRM margin estimate at deal creation vs margin at close vs SAP posted | Flag deals where margin is consistently over-estimated at quote stage |
| **Pipeline velocity benchmark** | Compare each deal's stage duration to historical average for similar deals | Alert when a deal is stalling in a stage longer than the benchmark |

### 5.2 What-If Analysis

| Tool | Description |
|------|-------------|
| **Quarter-end simulator** | Slider: "what if X% of Included with Risk converts?" → shows impact on OIT and Reco |
| **Discount impact modeller** | Slider: "what if we reduce average discount by 1%?" → shows margin impact in EUR |
| **FX sensitivity** | Dropdown: select FX scenario → shows EUR impact on USD-denominated revenue |
| **Mix shift analysis** | Slider: shift product mix (more DR 800, less DR 100e) → shows margin impact |

### 5.3 Automated Alerts (Push, Not Pull)

Once the EDW is live, alerts can be configured without manual monitoring:

| Alert | Trigger | Recipient |
|-------|---------|-----------|
| Upside Rule Breach | Any region's Upside / (Incl w Risk) < 2× | Region VP |
| Large Deal Stage Regression | Deal >€500k moves down a forecast category | Commercial Director |
| Reco Slip Risk | Planned Reco date in current quarter, SAP order not confirmed | Finance Controller |
| Budget Gap Alert | OIT running total falls below –10% vs budget | CFO, Commercial Director |
| CRM Data Quality | KAM has >3 open opps missing required fields for >2 weeks | KAM + Sales Manager |
| Win/Loss Rate Change | Win rate changes >5pp vs prior 4-week average | Sales Director |

---

## 6. EDW Data Layer — What Powers the Dashboard

### 6.1 Proposed Semantic Layer Structure

```
                    ┌───────────────────┐
                    │   PRESENTATION    │
                    │  (Power BI / Web) │
                    └────────┬──────────┘
                             │
                    ┌────────▼──────────┐
                    │  SEMANTIC LAYER   │  ← Single certified dataset
                    │  (Power BI DS /   │    All measures defined once
                    │   Analysis Svcs)  │    All hierarchies standardized
                    └────────┬──────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
    ┌─────────▼───┐  ┌───────▼────┐  ┌─────▼──────────┐
    │  GOLD LAYER │  │ GOLD LAYER │  │  GOLD LAYER    │
    │  Commercial │  │ Revenue &  │  │  Reference     │
    │  (Funnel,   │  │ Margin     │  │  (Geo, Product │
    │   Pipeline) │  │ (Reco, OB) │  │   Calendar)    │
    └─────────┬───┘  └───────┬────┘  └─────┬──────────┘
              │              │              │
    ┌─────────▼──────────────▼──────────────▼──────────┐
    │                  SILVER LAYER                     │
    │   Cleaned, conformed, business-rule applied       │
    └─────────────────────────┬─────────────────────────┘
                              │
    ┌─────────────────────────▼─────────────────────────┐
    │                  BRONZE LAYER                     │
    │   Raw ingestion, no transformation                │
    │   D365 CRM | SAP AP5 | SAP AP2 | SAP AP7 | Sofon │
    └────────────────────────────────────────────────────┘
```

### 6.2 Key Conformed Dimensions (Fix the Inconsistency Problems)

| Dimension | Current Problem | EDW Solution |
|-----------|----------------|-------------|
| **Geography** | 4 different field names / levels across reports | Single `dim_geography` table: Destination → Fixed Dest → Region → Subregion → Group — one version used everywhere |
| **Forecast Category** | 3 different label sets across reports | Single `dim_forecast_category` table: code + standard label + sort order — all reports reference same table |
| **Product / Equipment** | Product family from Sofon vs product from D365 vs material from SAP | Single `dim_product` table: SAP material → Sofon PF → Equipment type → Revenue stream hierarchy |
| **Calendar** | Various date fields, no standard fiscal calendar | Single `dim_date` table: fiscal year / fiscal quarter / fiscal week / ISO week |
| **Customer / Account** | D365 account ID ≠ SAP sold-to party | Single `dim_customer` table: D365 cr57c_accountid ↔ SAP agfa_saprecordid bridge |

---

## 7. Feedback Questions for Business Users

The following questions are designed to guide the review session:

### On Coverage
1. Are there metrics tracked in your monthly presentations or MPR decks that are **not represented** in the proposed dashboard design?
2. The Revenue Walk (OIT → Reco → Order Book) is central to the design. Is this the right "spine" of the financial story?

### On Priorities
3. Which of the 5 tabs would you open first on a Monday morning? Which would you open before an MPR?
4. Of the 3 Critical Gaps (Reco, Order Book, Margin bridge) — which single one has the highest pain today?

### On Granularity
5. Is order-level drill-down needed for executive pages, or should that be reserved for a separate operational view?
6. Which fields in the Deal Detail page are the most important — would you remove or add any?

### On Advanced Analytics
7. Which of the predictive features (win probability, Reco slip prediction, margin erosion) would change decisions you make today?
8. Would automated alerts (email/Teams) be more valuable than dashboard views for time-sensitive signals?

### On Data Quality
9. The CRM Data Quality page makes KAM-level field completion public. Is this acceptable, or is there a sensitivity concern?
10. What is the single biggest data quality issue today that causes you to distrust a report?

---

## 8. Phased Delivery Plan

| Phase | Scope | Prerequisite | Value Delivered |
|-------|-------|-------------|----------------|
| **Phase 0** | Fix existing Power BI reports (label alignment, Reco page from existing data, 2× Upside KPI) | None — data already loaded | Quick wins; builds trust |
| **Phase 1** | EDW Bronze + Silver: D365 + SAP ingestion, conformed dimensions | ETL pipeline setup | Single source of truth; eliminates manual reference files |
| **Phase 2** | Dashboard Tabs 1–3 (Executive, Commercial, Revenue/Reco) | Phase 1 complete | Full OIT-to-Reco visibility; CFO scorecard live |
| **Phase 3** | Dashboard Tabs 4–5 (Margin, Channel) + Win/Loss + Large Deal Tracker | Phase 1 + SAP cost data | Margin bridge; competitive intelligence |
| **Phase 4** | Predictive analytics, what-if simulators, automated alerts | Phase 2 + historical depth ≥ 2 years | Forward-looking; shift from reporting to decision support |

---

*Dashboard Design Plan v1.0 — For Business User Review*
*AGFA Digital Radiology Analytics | 2026-03-26*
