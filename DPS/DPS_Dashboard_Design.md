# AGFA DPS — Analytics Dashboard Design
## Business Analyst Specification | For Business User Review

> **Prepared by:** Business Analyst
> **Date:** 2026-03-25
> **Audience:** DPS Finance Controllers, BU Managers, CFO, FP&A Team
> **Context:** Dashboard is built on top of 5 manually exported DPS reports (RECO, AMSP, CO-PA, Sales Details, Order Follow-up). This is a **current-state analytics layer** — not a live EDW. Data is refreshed by re-importing source files. This design documents what is built, why, and what the analytical intent is behind every design decision.

---

## PART 1: BUSINESS CONTEXT & ANALYTICAL INTENT

### 1.1 What We Are Building — And Why

Today, AGFA DPS financial practitioners maintain **5 separate source reports**, each extracted from a different system (SAP BW, manual Excel), each measuring a different perimeter, at a different scope. No unified view exists across the Order Intake → Revenue Recognition → Revenue → Margin lifecycle.

The insights exist — but they are buried across 60+ pivot sheets, require manual cross-referencing, and the three financial measurement frameworks (RECO, AMSP, CO-PA) are understood by few people outside FP&A.

The goal of this dashboard is not to replicate what the source files show today. The goal is to answer questions that today's tools **cannot answer at all**:

> *"Which Budget Class is driving DPS's margin compression?"*
> *"Is FY2026 order intake pacing ahead of or behind the FY2025 run rate?"*
> *"Why does AMSP show 61.9% margin while CO-PA shows 38.9% — and which one should I use?"*
> *"Which orders are stuck between Intake and Revenue Recognition — and what is the revenue risk?"*

### 1.2 The Data Reality: Five Sources, Three Perimeters

A critical context for all users of this dashboard:

| Source | System | Perimeter | Currency | Scope |
|--------|--------|-----------|----------|-------|
| RECO Analysis | SAP BW | All DPS entities incl. IC | kEUR | Full P&L: Revenue → EBIT |
| AMSP | SAP BW | AGFA NV only, 3rd party | EUR | Margin % by Budget Class |
| CO-PA | SAP BW | AGFA NV only, 3rd party, net of rebates | EUR | Net Turnover after discounts |
| Sales Details | SAP BW | AGFA NV only, 3rd party | EUR | Transaction-level: 4,821 rows |
| Order Follow-up | Manual Excel | All entities, unit-based | Units (no EUR) | OIT, RR, Delayed, Pipeline |

**Key implication:** Numbers will not tie across sources. This is by design — they measure different things. The dashboard surfaces this explicitly rather than hiding it.

### 1.3 The Critical Gap: No Order Lifecycle Join Key

There is **no shared SAP order number or CRM ID** between the Order Follow-up file (units, manual Excel) and the financial reporting files (RECO/AMSP/CO-PA in SAP BW).

This means:
- We cannot compute revenue per order, margin per printer sold, or OIT-to-RR conversion in EUR terms
- The order lifecycle — from intake through recognition to margin — cannot be traced end-to-end
- Pipeline unit coverage cannot be converted to EUR without manual ASP estimation

This gap is surfaced prominently in the Order Explorer tab and in the Data Gaps panel.

### 1.4 User Personas

#### PERSONA 1: DPS Finance Controller / CFO
- **Needs:** Cross-source financial performance. Revenue vs. prior year. Margin bridge. RECO P&L summary.
- **Time per session:** 15–20 minutes, weekly
- **Key questions:** How did we land vs. prior year? Which BU drove margin improvement? How does RECO compare to AMSP?
- **Current pain:** Has to manually reconcile RECO, AMSP, and CO-PA to understand the same question three ways

#### PERSONA 2: BU Manager (LK / LI / M0)
- **Needs:** Their BU's unit performance (OIT, RR, backlog) and margin position relative to other BUs.
- **Time per session:** 10–15 minutes, weekly
- **Key questions:** How many units did my BU book this month? What is my Budget Class margin? Am I ahead or behind on intake?
- **Current pain:** Order intake data is in a separate Excel from financial data — no single view of their BU's commercial + financial health

#### PERSONA 3: FP&A Analyst
- **Needs:** Data source reconciliation, understanding of gaps, full P&L detail, budget class breakdown
- **Time per session:** 30–60 minutes, ad hoc
- **Key questions:** Why is the RECO revenue €385M but Sales Details shows €191M? What is the IC elimination amount? What's the CO-PA Net TO vs AMSP basis difference?
- **Current pain:** Each source file requires a separate Excel model to extract the relevant view

#### PERSONA 4: Sales / Commercial Manager
- **Needs:** Order intake trends, geographic breakdown, top customers, OIT vs RR progress
- **Time per session:** 10 minutes, weekly
- **Key questions:** How many units were booked this month vs. last year? Which region is lagging? What's in the delayed backlog?
- **Current pain:** The order follow-up file has the unit data but no financial context alongside it

---

## PART 2: DASHBOARD ARCHITECTURE

### 2.1 Navigation Structure

```
┌────────────────────────────────────────────────────────────────────────────┐
│  AGFA DPS  │  Digital Printing Systems — Analytics Dashboard               │
│  ──────────────────────────────────────────────────────────────────────    │
│                                                                             │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┬──────────────┐   │
│  │    📊    │    💰    │    🎨    │    🌍    │    📦    │     🔍       │   │
│  │Executive │ Revenue  │ Product  │Geographic│  Order   │    Order     │   │
│  │ Summary  │ & Margin │   Mix    │   View   │ Pipeline │   Explorer   │   │
│  └──────────┴──────────┴──────────┴──────────┴──────────┴──────────────┘   │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  GLOBAL FILTER BAR (persistent across all tabs)                       │ │
│  │  Year [All ▼]  Business Unit [All ▼]  Budget Class [All ▼]  Region [All▼]│
│  │  [Active filters shown as chips]  [✕ Clear all]                       │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Global Filter Logic

| Filter | Options | Cascade Rule |
|--------|---------|--------------|
| Year | All / FY2024 / FY2025 / FY2026 (YTD) | Changes chart data across all tabs |
| Business Unit | All / LK (Wide Format) / LI (Industrial Inkjet) / M0 (Packaging) | Auto-resets Budget Class if BC doesn't belong to selected BU |
| Budget Class | All / 7 BCs (filtered by BU) | Only shows BCs valid for the selected BU |
| Region | All / Europe / Americas / Asia Pacific / Middle East & Africa | Filters geographic and order data |

**Budget Class to BU mapping:**
- LK: Jeti (Wide Format), Anapurna (Wide Format), OEM Inks
- LI: INCA Wide Format
- M0: Packaging Onset (INCA), Packaging Print Engineering, Packaging Speedset

### 2.3 Design Principles

| Principle | What It Means in Practice |
|-----------|--------------------------|
| **Source transparency** | Every chart and KPI shows its data source (RECO / AMSP / CO-PA / OIT) |
| **Confidence badges** | Every data point is tagged: Verified / Derived / Estimated / Proxy |
| **Gap-first thinking** | Data gaps are surfaced as named alerts — not silently hidden |
| **Multi-framework literacy** | AMSP margin and CO-PA margin are shown side-by-side with explanation, not averaged |
| **Units and EUR separated** | Order intake (units) and revenue (EUR) are never on the same axis — they come from different unlinked sources |
| **Top-down storytelling** | Every tab starts with the headline numbers, then explains them |

---

## PART 3: TAB-BY-TAB DESIGN SPECIFICATION

---

## TAB 1: EXECUTIVE SUMMARY
### "The Weekly Health Check"

**Who uses it:** CFO, Finance Controller, BU Managers needing a 30-second view
**Core question answered:** *"How is DPS performing — commercially and financially — right now?"*

---

### Layout

```
┌────────────────────────────────────────────────────────────────────────────┐
│  EXECUTIVE SUMMARY                           [Filter context chip if active]│
│  ─────────────────────────────────────────────────────────────────────     │
│                                                                             │
│  ROW 1: COMMERCIAL + FINANCIAL HEADLINE KPIs                               │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌──────────┐  │
│  │  NET REVENUE    │ │  EBIT           │ │  OIT FY2025     │ │ FY2026   │  │
│  │  €385M (RECO)   │ │  €205M (RECO)   │ │  195 units      │ │ YTD OIT  │  │
│  │  All entities   │ │  53.3% margin   │ │  vs 196 FY2024  │ │ 22 units │  │
│  │  [→ Revenue tab]│ │  [→ Revenue tab]│ │  [→ Pipeline]   │ │ [→ Pipe] │  │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘ └──────────┘  │
│                                                                             │
│  ROW 2: MARGIN + OPERATIONAL KPIs                                          │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌──────────┐  │
│  │  AMSP MARGIN    │ │  CO-PA GM%      │ │  SG&A           │ │ BACKLOG  │  │
│  │  61.9%          │ │  38.9%          │ │  -€85M actual   │ │ 46 units │  │
│  │  AGFA NV 3rdP   │ │  Net of rebates │ │  vs -€94M budget│ │ end-Feb  │  │
│  │  [→ Rev tab]    │ │  [→ Rev tab]    │ │  +€9M favorable │ │ [→ Order]│  │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘ └──────────┘  │
│                                                                             │
│  ROW 3: TWO MAIN CHARTS                                                    │
│  ┌────────────────────────────────────┐ ┌───────────────────────────────┐  │
│  │  MONTHLY NET SALES TREND           │ │  RECO P&L KEY LINES           │  │
│  │  ─────────────────────────────     │ │  ─────────────────────────    │  │
│  │                                    │ │                               │  │
│  │  Area chart — 12 months FY2025:    │ │  Horizontal bar chart:        │  │
│  │  ■ Net Sales (EUR, area fill)      │ │  Revenue   ████████  385M     │  │
│  │  ─ Average line                    │ │  Mfg Contrib ███████ 313M     │  │
│  │                                    │ │  Gross Margin ██████ 299M     │  │
│  │  Peak: Dec €30.6M                  │ │  SG&A        ████   -85M      │  │
│  │  Low:  Feb €9.8M                   │ │  Adj EBIT    █████  211M      │  │
│  │  Seasonality signal visible        │ │  EBIT        █████  205M      │  │
│  │                                    │ │  (kEUR, all entities)         │  │
│  │  When FY=2026: switches to         │ │                               │  │
│  │  monthly OIT vs RR (units)         │ │                               │  │
│  └────────────────────────────────────┘ └───────────────────────────────┘  │
│                                                                             │
│  ROW 4: ORDER TREND + MARGIN MIX                                           │
│  ┌────────────────────────────────────┐ ┌───────────────────────────────┐  │
│  │  OIT TREND — FY2024 vs FY2025      │ │  AMSP BY BU + BACKLOG         │  │
│  │  ─────────────────────────────     │ │  ─────────────────────────    │  │
│  │                                    │ │                               │  │
│  │  Grouped bar — 12 months:          │ │  Mini bar: AMSP margin by BU  │  │
│  │  ■ FY2025 (blue)                   │ │  LK   ██████████   62.0%      │  │
│  │  ░ FY2024 (grey)                   │ │  LI   █████████    54.9%      │  │
│  │                                    │ │  M0   ██████████   70.8%      │  │
│  │  When FY=2026: shows FY2026        │ │                               │  │
│  │  OIT (blue) vs RR (teal)           │ │  Mini line: backlog evolution │  │
│  │                                    │ │  Dec=40 → Jan=43 → Feb=46    │  │
│  └────────────────────────────────────┘ └───────────────────────────────┘  │
│                                                                             │
│  ROW 5: KEY INSIGHTS PANEL                                                 │
│  ┌──────────────────────────┐ ┌──────────────────────┐ ┌────────────────┐  │
│  │ 🔴 Dec margin 46.4%      │ │ ✅ SG&A +€9M         │ │ ⚠ No join key │  │
│  │    vs 61.9% FY avg       │ │    vs budget          │ │   OIT → Rev   │  │
│  └──────────────────────────┘ └──────────────────────┘ └────────────────┘  │
│  ┌──────────────────────────┐ ┌──────────────────────┐ ┌────────────────┐  │
│  │ ⚠ RECO 385M vs           │ │ ℹ CO-PA 38.9% vs     │ │ ⚠ Pipeline EUR │  │
│  │   Sales Details 191M     │ │   AMSP 61.9%          │ │   not available│  │
│  └──────────────────────────┘ └──────────────────────┘ └────────────────┘  │
└────────────────────────────────────────────────────────────────────────────┘
```

### KPI Card Design
- All KPI cards are **clickable** — they navigate to the relevant tab
- Cards show: metric value, sub-label (source/perimeter), trend/context line
- Hover: card lifts (translateY -2px) to indicate interactivity

### Analytical Value Over Current State
- **Cross-source headline** — today requires opening RECO and AMSP files separately and mentally reconciling. One screen shows both.
- **FY2026 YTD KPIs** — currently buried in multiple OIT sheets in the Excel. Dashboard surfaces them as the top-line metric.
- **Backlog as a KPI** — not currently tracked as a headline number in any single report.
- **Key Insights panel** — no equivalent today. Contextual alerts replace the manual commentary that FP&A writes in email.

---

## TAB 2: REVENUE & MARGIN
### "The Financial Performance Deep Dive"

**Who uses it:** Finance Controller, CFO, FP&A Analyst
**Core question answered:** *"What is DPS's revenue and margin performance — and how do the three measurement frameworks compare?"*

---

### Layout

```
┌────────────────────────────────────────────────────────────────────────────┐
│  REVENUE & MARGIN                                                           │
│  ─────────────────────────────────────────────────────────────────────     │
│                                                                             │
│  ROW 1: KPI CARDS                                                           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────────────────┐   │
│  │ RECO NET    │ │ RECO EBIT   │ │ SG&A vs BUD │ │ AMSP MARGIN %      │   │
│  │ REVENUE     │ │             │ │             │ │                    │   │
│  │ €385M       │ │ €205M       │ │ +€9M fav.   │ │ 61.9%              │   │
│  │ All entities│ │ 53.3% of Rev│ │ Under budget│ │ AGFA NV 3rdP       │   │
│  └─────────────┘ └─────────────┘ └─────────────┘ └────────────────────┘   │
│                                                                             │
│  ROW 2: FULL RECO P&L TABLE                                                │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  RECO P&L — FY2025 (All DPS Entities, kEUR)                         │  │
│  │                                                                      │  │
│  │  Metric                    Actual      Budget      Prior Year        │  │
│  │  ─────────────────────────────────────────────────────────────────  │  │
│  │  Revenue                   385,098     —           —                 │  │
│  │  Manufacturing Contribution 312,900    —           —                 │  │
│  │  Gross Margin              298,800     —           —                 │  │
│  │  SG&A                      -85,000    -94,000      —      +9M fav.  │  │
│  │  Adj. EBIT                 211,300     —           —                 │  │
│  │  Non-recurring items        -6,191     —           —                 │  │
│  │  EBIT                      205,109     —           —                 │  │
│  │  Overall Result             78,017     —           —                 │  │
│  │                                                                      │  │
│  │  Totals bolded. Budget available only for SG&A — no BC-level budget │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ROW 3: TWO FRAMEWORKS COMPARED                                            │
│  ┌──────────────────────────────────┐ ┌─────────────────────────────────┐  │
│  │  CO-PA WATERFALL (AGFA NV only)  │ │  AMSP vs CO-PA MARGIN FRAMEWORK │  │
│  │  ─────────────────────────────   │ │  ──────────────────────────── ─ │  │
│  │                                  │ │                                 │  │
│  │  Gross Sales      +220,000 kEUR  │ │  FRAMEWORK    AMSP      CO-PA  │  │
│  │  Rebates           -60,426       │ │  ──────────────────────────     │  │
│  │  Net Turnover     +159,574  ██   │ │  Basis        AGFA NV   AGFA NV│  │
│  │  COGS TP           -97,508       │ │  Scope        3rdP only 3rdP   │  │
│  │  Gross Margin      +62,066  ██   │ │  Rebates      No        Yes    │  │
│  │                                  │ │  IC pricing   Yes       No     │  │
│  │  GM% = 38.9%                     │ │  Margin %     61.9%     38.9%  │  │
│  │                                  │ │                                 │  │
│  │  Rebate impact = 27.5% of gross  │ │  Gap = IC pricing benefit       │  │
│  └──────────────────────────────────┘ └─────────────────────────────────┘  │
│                                                                             │
│  ROW 4: TOP PRODUCT FAMILIES (CO-PA NET TO)                               │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  TOP CO-PA PRODUCT FAMILIES BY NET TO (kEUR)                         │  │
│  │                                                                      │  │
│  │  JETI UV INK HIGH      ████████████████████  27,454                 │  │
│  │  JETI SERVICE          ████████████████      19,926                 │  │
│  │  ONSET SERVICE         █████████████         15,000                 │  │
│  │  (horizontal bar chart, top 8 families, filter-aware by BU)         │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────┘
```

### Data Source Notes
- **RECO P&L:** All DPS entities including intercompany. kEUR. SG&A budget is the only available budget line.
- **CO-PA waterfall:** AGFA NV entity only. EUR. Gross Sales → Rebates → Net TO → COGS TP → Gross Margin.
- **AMSP margin:** AGFA NV entity only. EUR. Includes intercompany pricing benefit. Higher than CO-PA by design.

### Analytical Value Over Current State
- **Two-margin framework** — currently requires two separate file extracts and mental reconciliation. Dashboard explains the gap explicitly.
- **CO-PA waterfall** — the rebate deduction (€60.4M) is not visible in any current summary view.
- **SG&A vs Budget** — the only available budget variance. Dashboard makes this the headline favorable signal.

---

## TAB 3: PRODUCT MIX
### "Which Products Are Driving Margin?"

**Who uses it:** Finance Controller, BU Managers, FP&A
**Core question answered:** *"Which Budget Classes and product families deliver the highest margin — and how does the product mix shift margin?"*

---

### Layout

```
┌────────────────────────────────────────────────────────────────────────────┐
│  PRODUCT MIX                                                                │
│  ─────────────────────────────────────────────────────────────────────     │
│                                                                             │
│  ROW 1: CO-PA NET TO BY BU                                                 │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  CO-PA NET TO BY BUSINESS UNIT (kEUR) — AGFA NV, FY2025             │  │
│  │                                                                      │  │
│  │  LK (Wide Format)  ██████████████████████████  138,600  86.9%        │  │
│  │  LI (Industrial)   ████                        17,300   10.8%        │  │
│  │  M0 (Packaging)    █                            3,700    2.3%        │  │
│  │                                                                      │  │
│  │  Total: 159,574 kEUR (CO-PA Net TO)                                  │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ROW 2: AMSP MARGIN BY BUDGET CLASS                                        │
│  ┌──────────────────────────────────┐ ┌─────────────────────────────────┐  │
│  │  AMSP MARGIN % BY BUDGET CLASS   │ │  MARGIN FRAMEWORK COMPARISON    │  │
│  │  ─────────────────────────────   │ │  ──────────────────────────── ─ │  │
│  │                                  │ │                                 │  │
│  │  Packaging Print Eng.  ████  95.9│ │  BC                AMSP   CO-PA │  │
│  │  Packaging Onset INCA  ████  68.1│ │  ─────────────────────────────  │  │
│  │  Anapurna WF           ████  66.7│ │  LK — Wide Format  62.0%  38.9% │  │
│  │  INCA Wide Format      ████  64.8│ │  LI — Industrial   54.9%  n/a  │  │
│  │  Jeti Wide Format      ████  58.8│ │  M0 — Packaging    70.8%  n/a  │  │
│  │  OEM Inks              ████  53.5│ │  Overall           61.9%  38.9% │  │
│  │  Packaging Speedset    █      9.6│ │                                 │  │
│  │                                  │ │  Gap source: IC pricing benefit │  │
│  │  Overall: 61.9% weighted avg     │ │  in AMSP not present in CO-PA   │  │
│  └──────────────────────────────────┘ └─────────────────────────────────┘  │
│                                                                             │
│  ROW 3: REVENUE vs MARGIN SCATTER + BC DETAIL TABLE                       │
│  ┌──────────────────────────────────┐ ┌─────────────────────────────────┐  │
│  │  REVENUE VS MARGIN SCATTER       │ │  BUDGET CLASS DETAIL TABLE      │  │
│  │  ─────────────────────────────   │ │  ──────────────────────────── ─ │  │
│  │                                  │ │                                 │  │
│  │  X-axis: Revenue contribution %  │ │  BC | Revenue% | Margin% | BU  │  │
│  │  Y-axis: AMSP Margin %           │ │  (table with all 7 BCs, filter) │  │
│  │  Bubble size: absolute revenue   │ │                                 │  │
│  │                                  │ │  High margin / low volume       │  │
│  │  Each bubble = 1 Budget Class    │ │  quadrant highlighted           │  │
│  │  Color = BU                      │ │                                 │  │
│  │                                  │ │  Speedset: low margin, needs    │  │
│  │  Speedset: high revenue,         │ │  attention (9.6%)               │  │
│  │  very low margin — outlier       │ │                                 │  │
│  └──────────────────────────────────┘ └─────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────┘
```

### Analytical Value Over Current State
- **Speedset outlier** — 9.6% AMSP margin with significant revenue exposure. Currently requires manual filter in AMSP source file. Dashboard makes this immediately visible.
- **Packaging Print Engineering** — 95.9% margin. Not prominently visible in any current summary report.
- **CO-PA by BU** — LK dominates at 86.9%. Not surfaced in any current single-page view.

---

## TAB 4: GEOGRAPHIC VIEW
### "Where Is the Business Coming From?"

**Who uses it:** Commercial Managers, Finance Controller, CFO
**Core question answered:** *"Which regions and countries generate the most revenue — and how is the sales organization performing?"*

---

### Layout

```
┌────────────────────────────────────────────────────────────────────────────┐
│  GEOGRAPHIC VIEW                                                            │
│  ─────────────────────────────────────────────────────────────────────     │
│                                                                             │
│  ROW 1: REGIONAL SUMMARY KPIs                                              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐  │
│  │  EUROPE      │ │  AMERICAS    │ │  ASIA PAC    │ │  MEA             │  │
│  │  €73.6M      │ │  €31.5M      │ │  €25.2M      │ │  €6.2M           │  │
│  │  38.7% share │ │  16.5% share │ │  13.2% share │ │  3.2% share      │  │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────────┘  │
│                                                                             │
│  ROW 2: TWO REGIONAL CHARTS                                                │
│  ┌──────────────────────────────────┐ ┌─────────────────────────────────┐  │
│  │  NET SALES BY REGION (bar)       │ │  TOP COUNTRIES (horizontal bar) │  │
│  │  ─────────────────────────────   │ │  ──────────────────────────── ─ │  │
│  │                                  │ │                                 │  │
│  │  Horizontal bar — 5 regions      │ │  Belgium     ████████  €28.4M  │  │
│  │  Europe    ████████████████████  │ │  USA         ████████  €22.6M  │  │
│  │  Americas  █████████             │ │  Germany     ███████   €19.2M  │  │
│  │  Asia Pac  ███████               │ │  China       █████     €15.4M  │  │
│  │  MEA       ██                    │ │  France      █████     €14.8M  │  │
│  │  Other     ██████████████████    │ │  (filter by Region active)     │  │
│  │                                  │ │                                 │  │
│  │  "Other" = 28.4% of revenue —    │ │  Note: Top customers are AGFA  │  │
│  │  allocation unknown              │ │  IC subsidiaries — not end-cust │  │
│  └──────────────────────────────────┘ └─────────────────────────────────┘  │
│                                                                             │
│  ROW 3: OIT BY SALES ORGANIZATION                                         │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  OIT BY SALES ORGANIZATION — FY2025 vs FY2024 (Units)               │  │
│  │                                                                      │  │
│  │  Sales Org        FY2025   FY2024   Δ Units   Δ%                    │  │
│  │  ─────────────────────────────────────────────────────────────────  │  │
│  │  Europe West        48       45       +3      +6.7%  🟢             │  │
│  │  Europe North       31       33       -2      -6.1%  🔴             │  │
│  │  Americas           29       28       +1      +3.6%  🟢             │  │
│  │  Asia Pacific       24       26       -2      -7.7%  🔴             │  │
│  │  ... (11 orgs total)                                                 │  │
│  │                                                                      │  │
│  │  Grouped bar chart + table | Filter by Region applies               │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ROW 4: IC NOTE                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  ⚠ INTERCOMPANY NOTE: All top customers are AGFA IC subsidiaries     │  │
│  │  (AGFA NV, AGFA Germany, AGFA USA, etc.). This is DPS's view as the  │  │
│  │  manufacturing entity. End-customer data is at subsidiary level.     │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────┘
```

### Analytical Value Over Current State
- **Regional + Sales Org in one view** — today, regional revenue is in Sales Details and OIT by sales org is in the order follow-up file. No current tool combines them.
- **"Other" region transparency** — 28.4% unallocated revenue is surfaced as a gap, not hidden.
- **IC customer note** — explicitly explains why all top customers are subsidiaries, preventing misinterpretation.

---

## TAB 5: ORDER PIPELINE
### "Is Commercial Momentum Healthy?"

**Who uses it:** Commercial Managers, BU Managers, Finance Controller
**Core question answered:** *"How many units are being booked, recognized, and what is the forward pipeline?"*

---

### Layout

```
┌────────────────────────────────────────────────────────────────────────────┐
│  ORDER PIPELINE                                                             │
│  ─────────────────────────────────────────────────────────────────────     │
│                                                                             │
│  ROW 1: 6 KPI CARDS                                                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────┐ │
│  │ OIT YTD  │ │ RR YTD   │ │ BACKLOG  │ │ PACE     │ │ FY2025   │ │ DEL │ │
│  │ FY2026   │ │ FY2026   │ │ End-Feb  │ │ vs LY    │ │ TOTAL    │ │ -AY │ │
│  │ 22 units │ │ 16 units │ │ 46 units │ │ +12% pace│ │ 195 units│ │ 12  │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └─────┘ │
│                                                                             │
│  ROW 2: MONTHLY OIT vs RR CHART                                           │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  FY2026 YTD — ORDER INTAKE vs REVENUE RECOGNITION (Units/Month)     │  │
│  │                                                                      │  │
│  │  Grouped bars per month:                                             │  │
│  │  ■ OIT (blue)   ■ RR (teal)                                          │  │
│  │                                                                      │  │
│  │  Jan: OIT=11  RR=9   Gap=+2 pending                                 │  │
│  │  Feb: OIT=10  RR=7   Gap=+3 pending                                 │  │
│  │  Mar: OIT=3   RR=0   MTD — incomplete                               │  │
│  │                                                                      │  │
│  │  When year=FY2025 or FY2024: shows OIT FY2024 vs FY2025 trend      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ROW 3: EQUIPMENT FAMILY + BACKLOG                                        │
│  ┌──────────────────────────────────┐ ┌─────────────────────────────────┐  │
│  │  OIT BY EQUIPMENT FAMILY FY2026  │ │  BACKLOG EVOLUTION (Units)      │  │
│  │  ─────────────────────────────   │ │  ──────────────────────────── ─ │  │
│  │                                  │ │                                 │  │
│  │  Donut: Anapurna/Accurio  13     │ │  Area chart:                   │  │
│  │         Jeti               7     │ │  End-Dec 2025   40              │  │
│  │         Onset              2     │ │  End-Jan 2026   43  ▲           │  │
│  │         Other              2     │ │  End-Feb 2026   46  ▲           │  │
│  │                                  │ │                                 │  │
│  │  Also shown as bar chart         │ │  Rising backlog = intake        │  │
│  │                                  │ │  outpacing recognition          │  │
│  └──────────────────────────────────┘ └─────────────────────────────────┘  │
│                                                                             │
│  ROW 4: FORWARD PIPELINE + SALES ORG TABLE                               │
│  ┌──────────────────────────────────┐ ┌─────────────────────────────────┐  │
│  │  FORWARD PIPELINE (Units)        │ │  OIT BY SALES ORG — YoY Table   │  │
│  │  ─────────────────────────────   │ │  ──────────────────────────── ─ │  │
│  │                                  │ │                                 │  │
│  │  Stacked bar per month:          │ │  11 sales orgs with FY2025 /   │  │
│  │  ■ Confirmed  ■ Expected         │ │  FY2024 OIT and delta           │  │
│  │  ░ Potential                     │ │                                 │  │
│  │                                  │ │  Color-coded delta: green/red   │  │
│  │  Mar: 3 confirmed / 8 expected   │ │  Filter by Region applies       │  │
│  │  Apr: 2 confirmed / 10 expected  │ │                                 │  │
│  │  May: 1 confirmed / 7 expected   │ │                                 │  │
│  │  Jun+: 0 confirmed / 12 expected │ │                                 │  │
│  │                                  │ │  ⚠ Units only — no EUR value   │  │
│  └──────────────────────────────────┘ └─────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────┘
```

### Analytical Value Over Current State
- **OIT vs RR in one chart** — today, OIT sheets and RR sheets are on different tabs in the Excel. No current view overlays them.
- **Backlog evolution** — not tracked as a headline KPI in any current report. Requires manual subtraction.
- **Pipeline buckets (confirmed/expected/potential)** — currently visible only in the Excel pipeline sheet; no chart visualization exists.

---

## TAB 6: ORDER EXPLORER
### "The Lifecycle Trace — Where Orders Break Down"

**Who uses it:** Finance Controller, Operations Manager, anyone investigating delayed revenue
**Core question answered:** *"What is the status of individual orders, and where in the OIT → RR → Revenue & Margin lifecycle does the trail go cold?"*

---

### Layout

```
┌────────────────────────────────────────────────────────────────────────────┐
│  ORDER EXPLORER — Lifecycle Journey                                         │
│  ─────────────────────────────────────────────────────────────────────     │
│                                                                             │
│  SECTION 1: ORDER LIFECYCLE VISUAL                                         │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                                                                      │  │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────────┐  │  │
│  │  │  STAGE 01   │    │  STAGE 02   │    │  STAGE 03               │  │  │
│  │  │  ORDER      │    │  REVENUE    │    │  REVENUE &              │  │  │
│  │  │  INTAKE     │    │  RECOGNIT.  │    │  MARGIN                 │  │  │
│  │  │             │    │             │    │                         │  │  │
│  │  │  195        │    │  16         │    │  €385M                  │  │  │
│  │  │  units FY25 │    │  FY26 YTD   │    │  net sales FY25         │  │  │
│  │  │             │    │             │    │                         │  │  │
│  │  │  ✓ Unit count   ╳╳╳ NO  ╳╳╳   │    │  ✓ Net sales by BU     │  │  │
│  │  │  ✓ By family│    │  JOIN  │    │    │  ✓ AMSP margin %        │  │  │
│  │  │  ✗ EUR value│    │  KEY   │    │    │  ✗ Revenue per order    │  │  │
│  │  │  ✗ SAP ord# │    │        │    │    │  ✗ Margin per unit      │  │  │
│  │  └─────────────┘    └─────────────┘    └─────────────────────────┘  │  │
│  │                                                                      │  │
│  │  !! CRITICAL GAP: No SAP Sales Order number or CRM ID links Stage 1 │  │
│  │     and Stage 2 to Stage 3. Revenue and margin cannot be traced     │  │
│  │     back to individual orders.                                       │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  SECTION 2: FY2026 OIT vs RR TABLE (shown when year = 2026 or All)        │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Month   OIT (ordered)   RR (invoiced)   Gap (pending)              │  │
│  │  Jan        11               9              +2                      │  │
│  │  Feb        10               7              +3                      │  │
│  │  Mar         3               0   MTD         +3                     │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  SECTION 3: FY2025 MONTHLY OIT BY BU (shown when year = 2025 or All)     │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Month  LK units  LI units  M0 units  FY2025 Total  FY2024  YoY    │  │
│  │  (12 months, BU split derived from annual product mix ratios)        │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  SECTION 4: DELAYED ORDERS — Stage 1→2 Blockages                         │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  [Search]  12 delayed orders  Filter by BU / Region active          │  │
│  │                                                                      │  │
│  │  Order ID | Product | BU | Customer | Region | Orig RR | Rev RR | Reason | Delay│
│  │  (12 rows — root cause categories: Customer / Logistics / Supplier)  │  │
│  │                                                                      │  │
│  │  ⚠ EUR value of delay cannot be quantified — no join key to revenue │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  SECTION 5: GAP CARDS                                                     │
│  ┌────────────────────────────────┐ ┌───────────────────────────────────┐  │
│  │  IC CUSTOMER NOTE              │ │  WHAT WE CANNOT DO WITHOUT        │  │
│  │  ─────────────────────────     │ │  A JOIN KEY                       │  │
│  │                                │ │  ─────────────────────────────    │  │
│  │  Top 5 customers are AGFA IC   │ │  ✗ Revenue per order              │  │
│  │  subsidiaries. End-customer    │ │  ✗ Margin per printer sold        │  │
│  │  data is held at subsidiary    │ │  ✗ OIT→RR conversion in EUR       │  │
│  │  level — not in DPS scope.     │ │  ✗ Delayed order EUR impact       │  │
│  │                                │ │  ✗ Cohort analysis (Q1 → Q2 rev)  │  │
│  │  Fix: Pull Sales Details from  │ │                                   │  │
│  │  national subsidiary SAP       │ │  Fix: SAP SD order no. in OIT file│  │
│  └────────────────────────────────┘ └───────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────┘
```

### Analytical Value Over Current State
- **Lifecycle visual** — no current view shows where the data trail breaks. This is the only place in DPS reporting that explicitly maps Stage 1 → Stage 2 → Stage 3.
- **Delayed orders with filter** — today buried in the Delayed tab of the Excel. No current visualization of delay reasons by BU or region.
- **Gap card (Join Key)** — no current documentation of this limitation exists. Dashboard surfaces it as a named, actionable gap.

---

## PART 4: DATA GAPS REGISTER

The following gaps are documented and surfaced in the dashboard. They are not bugs — they are limitations of the current source data scope.

| # | Gap | Source Limitation | Business Impact | Recommended Fix |
|---|-----|-------------------|-----------------|-----------------|
| 1 | Budget by Budget Class | Budget files not shared — only actuals in AMSP/RECO | Cannot compute actual vs budget variance at product level | Request BP1/BP2 budget Excel from FP&A |
| 2 | Budget by Region | Geographic budget not in any analyzed file | Regional performance cannot be benchmarked vs plan | Add budget to SAP BEx CO-PA query |
| 3 | Hardware vs Consumable Split | FA dimension inconsistently populated | Cannot assess recurring revenue ratio | Use KRECO20 FA dimension with BC filter |
| 4 | Revenue by Sales Organization | Sales org absent in CO-PA | Sales team performance not measurable | Add Sales Org to BEx CO-PA query |
| 5 | Order Intake EUR Value | OIT file tracks units only, not EUR | OIT units cannot be compared to revenue EUR | Link OIT to SAP SD module order value |
| 6 | Pipeline EUR Value | Pipeline is unit-based, no pricing | Pipeline coverage vs budget not computable | Add ASP (avg selling price) to pipeline register |
| 7 | **No Join Key: OIT → RR → Revenue & Margin** | No SAP order number or CRM ID between OIT Excel and SAP BW | Cannot trace revenue or margin back to individual orders | Enforce SAP SD order no. in OIT file at booking time |

---

## PART 5: DATA CONFIDENCE FRAMEWORK

Every data point in the dashboard carries one of four confidence badges:

| Badge | Color | Meaning | Example |
|-------|-------|---------|---------|
| **Verified** | Green | Directly read from source file, no transformation | FY2025 OIT = 195 units |
| **Derived** | Blue | Calculated from verified source data | BU split of monthly OIT (from annual ratios) |
| **Estimated** | Orange | Reasonable approximation, not directly available | IC % of revenue at DPS level |
| **Proxy** | Red | Different metric used as stand-in for unavailable one | CO-PA GM% as margin proxy for RECO all-entity margin |

---

## PART 6: OPEN QUESTIONS FOR BUSINESS REVIEW

The following questions arose during data analysis and require FP&A / BRM input to resolve:

1. **RECO vs Sales Details gap:** RECO shows €385M but Sales Details (AGFA NV 3rdP) shows €191M. After IC elimination RECO = €114M. Residual gap of €77M may reflect entity perimeter differences. **Q: Can FP&A confirm the entity perimeter for each source?**

2. **CO-PA vs AMSP margin gap:** CO-PA shows 38.9% GM vs AMSP 61.9%. The identified cause is IC pricing benefit in AMSP. **Q: Can FP&A quantify the IC pricing uplift explicitly?**

3. **December margin dip:** December has the highest revenue (€30.6M) but lowest AMSP margin (46.4%). **Q: Is this a year-end pricing / true-up effect, or Speedset overweight in December?**

4. **BU code "DP" in older data:** Some source files show BU code "DP" instead of "M0" for Packaging. **Q: Are these the same entity — or did a reclassification happen?**

5. **OIT Excel SAP integration:** The Order Follow-up file is manually maintained. **Q: Is there a plan to integrate with SAP SD to eliminate the manual step and enable the join key?**

---

## PART 7: TECHNOLOGY STACK

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | React 19 + TypeScript | Vite 6 build tooling |
| UI Components | MUI v7 (Material UI) | Grid v2 API, responsive layout |
| Charts | Recharts v3 | AreaChart, BarChart, ScatterChart, FunnelChart |
| Data Layer | Static TypeScript arrays (dpsData.ts) | No API — data embedded at build time |
| Hosting | Firebase Hosting | Deployed to agfa-dps-dashboard.web.app |
| Filtering | React useMemo | All filter logic client-side, no server |

### Refresh Process (Current State)
1. Export updated data from SAP BW (RECO, AMSP, CO-PA, Sales Details) and update Order Follow-up Excel
2. Update values in `src/data/dpsData.ts`
3. Run `npm run build`
4. Run `firebase deploy --only hosting`

### Future State (Recommended)
- Connect to an EDW or data warehouse layer (SAP BW → API or Databricks) to enable live refresh
- Enforce SAP Sales Order number in the OIT file to enable order lifecycle tracing
- Add budget data export to enable actual vs budget variance at BC and region level

---

*Document version: 1.0 | Last updated: 2026-03-25 | Dashboard URL: https://agfa-dps-dashboard.web.app*
