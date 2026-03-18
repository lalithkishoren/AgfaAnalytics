# AGFA HE IT — Enterprise Analytics Dashboard Design
## Business Analyst Specification | For Business User Review

> **Prepared by:** Business Analyst
> **Date:** 2026-03-18
> **Audience:** Financial Controllers, CFO, BRM Managers
> **Context:** Enterprise Data Warehouse (EDW) will be the data foundation — all current Excel/Access fragmentation is resolved at the data layer. This design focuses purely on the analytical and visual value to be delivered.

---

## PART 1: BUSINESS CONTEXT & ANALYTICAL INTENT

### 1.1 What We Are Building — And Why

Today, AGFA HE IT's financial practitioners maintain **4 separate Excel files**, manually refreshed, with no unified view across the Order Intake → Order Book → Revenue → Margin lifecycle. The insights exist — but they are buried in 42+ pivot sheets, require manual cross-referencing, and are always one data refresh behind.

The EDW resolves the data problem. **This dashboard resolves the insight problem.**

The goal is not to replicate what Excel shows today. The goal is to answer questions that today's tools **cannot answer at all**:

> *"Is our backlog healthy enough to sustain next year's revenue target?"*
> *"Which Business Unit is generating net-new business vs. renewing existing customers?"*
> *"If N.America softens by 10%, what happens to our TACO Contribution?"*
> *"Which customers have the largest overdue backlog and what's the recognition risk?"*

### 1.2 User Personas

#### PERSONA 1: CFO / Senior VP Finance
- **Needs:** 30-second view of business health. Headline KPIs. Trend direction. Risk flags.
- **Time per session:** 5–10 minutes, weekly
- **Key questions:** Are we growing? Are margins holding? Are we on budget? Where are the risks?
- **Current pain:** Has to ask controller to pull numbers from 4 different files before every review

#### PERSONA 2: BRM Finance Controller
- **Needs:** Detailed operational monitoring. Variance explanations. Customer and project-level tracking. OI vs OB reconciliation.
- **Time per session:** 30–60 minutes, daily
- **Key questions:** Which region missed OI budget? Which overdue projects need escalation? Is the recognition schedule realistic?
- **Current pain:** Spends ~4 hours/week manually refreshing and cross-referencing Excel files

#### PERSONA 3: Regional / BU Manager
- **Needs:** Their region or BU performance only. OI target tracking. Top customer status.
- **Time per session:** 15–20 minutes, weekly
- **Key questions:** How is my region tracking vs. budget? Who are my top OI customers this quarter? What's in my backlog?

---

## PART 2: DASHBOARD ARCHITECTURE

### 2.1 Navigation Structure

```
┌───────────────────────────────────────────────────────────────────────────┐
│  AGFA HE IT  │  Business Intelligence Dashboard                            │
│  ─────────────────────────────────────────────────────────────────────    │
│                                                                            │
│  ┌──────────┬───────────┬───────────┬──────────┬────────────┬──────────┐  │
│  │    📊    │    📥     │    📦     │    💰    │     🔮     │    👤    │  │
│  │Executive │  Order    │  Order    │   P&L /  │  Revenue   │ Customer │  │
│  │Overview  │  Intake   │  Book     │   TACO   │  Outlook   │   360°   │  │
│  └──────────┴───────────┴───────────┴──────────┴────────────┴──────────┘  │
│                                                                            │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │  GLOBAL CONTEXT BAR (persistent)                                   │    │
│  │  Fiscal Year [2025 ▼]  Quarter [All ▼]  BU [All ▼]  Region [All ▼]│    │
│  │  Revenue Stream [All ▼]  GeoFin [All ▼]  Currency [kEUR ▼]        │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                            │
│  [● Live  Last EDW sync: 18 Mar 2026 06:00]          [⬇ Export]  [⚙ Settings]│
└───────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Design Principles

| Principle | What It Means in Practice |
|-----------|--------------------------|
| **Top-down storytelling** | Every tab starts with the headline number, then explains it. Not a data dump. |
| **Traffic light intelligence** | Every KPI card has a RAG (Red/Amber/Green) status driven by thresholds, not manual input |
| **Drill anywhere** | Every chart is clickable. Region → Country → Customer → Project → Order line. One-click |
| **Insight first, data second** | Insights and annotations sit above charts. The user understands before they look |
| **No jargon clutter** | Labels use business language — "Backlog at Risk" not "Rev Overdue >6mths" |
| **Mobile-aware layout** | CFO may view on tablet — key KPIs must be visible without scrolling |

---

## PART 3: TAB-BY-TAB DESIGN SPECIFICATION

---

## TAB 1: EXECUTIVE OVERVIEW
### "The Monday Morning Dashboard"

**Who uses it:** CFO, Senior VP Finance, anyone needing a 30-second health check
**Core question answered:** *"How is the HE IT business performing right now — and where is the risk?"*

---

### Layout

```
┌───────────────────────────────────────────────────────────────────────────┐
│  EXECUTIVE OVERVIEW                                              Feb 2026   │
│  ─────────────────────────────────────────────────────────────────────    │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │  INSIGHT BANNER (auto-generated, rotates)                            │ │
│  │  💡 "Order Intake is 8% below YTD budget — N.America is the primary  │ │
│  │     driver. Order Book grew 2.3% MoM, indicating strong Q4 bookings  │ │
│  │     offsetting the intake shortfall."                                │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  ROW 1: COMMERCIAL HEALTH                                                  │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────┐  │
│  │  ORDER BOOK    │ │  ORDER INTAKE  │ │  OI vs BUDGET  │ │ BACKLOG    │  │
│  │  189,631 kEUR  │ │  YTD: xx,xxx   │ │   -8.2%  🔴   │ │ AT RISK    │  │
│  │  ▲ +2.3% MoM  │ │  kEUR          │ │  vs prior year │ │ 4.1% OB   │  │
│  │  🟢            │ │  🟡            │ │  +3.1% 🟢      │ │ overdue 🔴│  │
│  └────────────────┘ └────────────────┘ └────────────────┘ └────────────┘  │
│                                                                            │
│  ROW 2: FINANCIAL PERFORMANCE                                              │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────┐  │
│  │  NET REVENUE   │ │ TACO MARGIN    │ │ TACO           │ │ vs BUDGET  │  │
│  │  YTD kEUR      │ │  xx.x%         │ │ CONTRIBUTION   │ │            │  │
│  │  ACT vs BUD    │ │  ACT vs BUD    │ │ YTD kEUR       │ │ -5.4%  🔴  │  │
│  │  🟡 -3.2%      │ │  🟢 +1.1pp    │ │  🟡            │ │            │  │
│  └────────────────┘ └────────────────┘ └────────────────┘ └────────────┘  │
│                                                                            │
│  ROW 3: TWO MAIN CHARTS                                                    │
│  ┌──────────────────────────────────┐ ┌─────────────────────────────────┐ │
│  │  COMMERCIAL PERFORMANCE TREND     │ │  BU SCORECARD                   │ │
│  │  ─────────────────────────────── │ │  ─────────────────────────────  │ │
│  │  Dual-axis chart — 13 months:    │ │  Heatmap grid:                  │ │
│  │                                  │ │  Rows: S1 / S2 / S4             │ │
│  │  Bars: OI MONTH ACT (blue)       │ │  Cols: OI vs BUD% │ OB MoM% │   │ │
│  │        OI MONTH BUD (outline)    │ │         Revenue vs BUD% │       │ │
│  │        OI MONTH LY (grey)        │ │         TACO Margin%            │ │
│  │                                  │ │                                  │ │
│  │  Line: Order Book total (right   │ │  Color: 🟢 >+5% / 🟡 ±5% / 🔴  │ │
│  │        Y-axis) — 13 snapshots    │ │        <-5%                      │ │
│  │                                  │ │  One-click: expand to BU tab    │ │
│  │  Insight: Are bookings keeping   │ │  "S1 is healthy; S2 OI lagging  │ │
│  │  pace with backlog consumption?  │ │   budget by 12%"                │ │
│  └──────────────────────────────────┘ └─────────────────────────────────┘ │
│                                                                            │
│  ROW 4: SIGNALS AND ALERTS                                                 │
│  ┌──────────────────────────────────┐ ┌─────────────────────────────────┐ │
│  │  REVENUE STREAM MIX SHIFT        │ │  TOP RISK FLAGS                  │ │
│  │  ─────────────────────────────── │ │  ───────────────────────────    │ │
│  │  Stacked area — 13 months:       │ │  🔴 [x] projects overdue >6mths │ │
│  │  Own SW & Services (blue)        │ │      Total: [x,xxx] kEUR         │ │
│  │  HW & 3rdP SW (grey)             │ │                                  │ │
│  │                                  │ │  🔴 N.America OI -[x]% vs BUD   │ │
│  │  Shows SaaS transition: is       │ │      3 consecutive months below  │ │
│  │  recurring revenue share         │ │                                  │ │
│  │  growing over time?              │ │  🟡 Not Planned backlog: [x]%    │ │
│  │                                  │ │      of OB has no schedule yet   │ │
│  │  Critical for CFO strategy:      │ │                                  │ │
│  │  the move from HW to software    │ │  🟡 Dedalus OB: [x,xxx] kEUR    │ │
│  └──────────────────────────────────┘ │      Carve-out exposure          │ │
│                                       └─────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────────────┘
```

### KPI Card Thresholds (RAG Logic)

| KPI | Green | Amber | Red |
|-----|-------|-------|-----|
| OI vs BUD | > -2% | -2% to -8% | < -8% |
| OB MoM change | > 0% | -2% to 0% | < -2% |
| Backlog at risk (overdue %) | < 2% | 2-5% | > 5% |
| TACO Contribution vs BUD | > -3% | -3% to -10% | < -10% |
| TACO Margin % vs BUD | > -1pp | -1pp to -3pp | < -3pp |

### Analytical Value Over Current State
- **Insight banner** — no equivalent today. Currently the controller manually writes commentary in emails.
- **BU Scorecard heatmap** — today requires opening 3 different files to compare S1 vs S2 vs S4.
- **Revenue stream mix shift** — the SaaS transition story is invisible in current Excel pivots.

---

## TAB 2: ORDER INTAKE
### "Are We Winning Enough Business?"

**Who uses it:** BRM Controller, Regional Managers, CFO during business reviews
**Core question answered:** *"How much new business are we booking? Where, from whom, and what type?"*

---

### Layout

```
┌───────────────────────────────────────────────────────────────────────────┐
│  ORDER INTAKE                                    Period: Jan–Dec 2025      │
│  ─────────────────────────────────────────────────────────────────────    │
│                                                                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│  │ YTD OI   │ │ vs BUD   │ │ vs LY    │ │ Net New  │ │ Quarterly    │   │
│  │ ACT      │ │          │ │          │ │ Share %  │ │ Run Rate     │   │
│  │ kEUR     │ │ 🔴/🟡/🟢 │ │ 🔴/🟡/🟢 │ │ of OI    │ │ vs BUD pace │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────────┘   │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │  OI PERFORMANCE — ACT vs BUD vs PRIOR YEAR                          │ │
│  │                                                                      │ │
│  │  View: [Monthly ●] [Quarterly ○] [YTD ○]                            │ │
│  │                                                                      │ │
│  │  Grouped bar per period:                                             │ │
│  │  ■ ACT (solid blue)   □ BUD (outline)   ░ LY (grey fill)           │ │
│  │                                                                      │ │
│  │  Below each bar: variance label "+3.2%" or "-8.1%" in RAG color     │ │
│  │                                                                      │ │
│  │  Toggle: [All BUs] [S1] [S2] [S3]  —  auto-disables S3 if no data  │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  ┌──────────────────────────────┐ ┌───────────────────────────────────┐   │
│  │  BUSINESS TYPE BREAKDOWN     │ │  OI BY REVENUE STREAM             │   │
│  │  ─────────────────────────   │ │  ──────────────────────────────   │   │
│  │                              │ │                                    │   │
│  │  Stacked bar — monthly:      │ │  Stacked area — monthly:          │   │
│  │  🔵 Net New                  │ │  ■ Own SW Licenses (010L/O/X)     │   │
│  │  🟢 Feature Upselling        │ │  ■ Managed Services (010Z/K)      │   │
│  │  🟡 Cross Selling            │ │  ■ Implementation Svcs (010S/Y/U) │   │
│  │  🟠 Volume Upselling         │ │  ■ Hardware (010H/V)              │   │
│  │  🔴 Transition               │ │  ■ 3rd Party SW (010T/Q/W)        │   │
│  │  ⚪ Upgrade & Updates        │ │                                    │   │
│  │                              │ │  KEY QUESTION:                    │   │
│  │  KEY QUESTION:               │ │  Is recurring revenue (shaded)    │   │
│  │  Is Net New % growing?       │ │  growing as a share?              │   │
│  │  This is the growth health   │ │  The SaaS transition signal.      │   │
│  │  indicator.                  │ │                                    │   │
│  └──────────────────────────────┘ └───────────────────────────────────┘   │
│                                                                            │
│  ┌──────────────────────────────┐ ┌───────────────────────────────────┐   │
│  │  REGIONAL OI PERFORMANCE     │ │  SEASONALITY HEATMAP (5 years)    │   │
│  │  ─────────────────────────   │ │  ──────────────────────────────   │   │
│  │                              │ │                                    │   │
│  │  Horizontal bar chart:       │ │  Rows: 2021 / 2022 / 2023 /      │   │
│  │  Regions (RGrp lvl2):        │ │        2024 / 2025                │   │
│  │                              │ │  Cols: Jan Feb Mar Apr ... Dec    │   │
│  │  Europe North  ████ ACT      │ │  Cell color: OI value intensity   │   │
│  │               ░░░░ BUD       │ │  🔵 dark = high OI month          │   │
│  │  Europe South  ██ ACT        │ │  ⬜ light = low OI month          │   │
│  │  International ███ ACT       │ │                                    │   │
│  │  N.America     █████ ACT     │ │  Reveals Q4 loading pattern,      │   │
│  │                              │ │  summer troughs, year-over-year   │   │
│  │  Click any bar → drill to    │ │  growth shift across months       │   │
│  │  Region → Subregion →        │ │                                    │   │
│  │  Country → Customer          │ │  Used for: forecasting, resource  │   │
│  └──────────────────────────────┘ │  planning, commission timing      │   │
│                                   └───────────────────────────────────┘   │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │  TOP CUSTOMERS BY ORDER INTAKE  (Sortable DataGrid)                 │ │
│  │                                                                      │ │
│  │  Cols: Customer | Region | BU | YTD OI ACT | vs BUD% | vs LY% |    │ │
│  │        Business Type Mix | Revenue Stream | Trend (sparkline)       │ │
│  │                                                                      │ │
│  │  Expand row → show monthly OI detail for that customer               │ │
│  │  Click customer name → navigate to Customer 360° tab                │ │
│  │                                                                      │ │
│  │  [Show Top 10 ▼]  [Group by BU]  [Group by Region]  [Export]       │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────────────┘
```

### Advanced Analytics Capabilities in This Tab

| Capability | What It Shows | Why It Matters |
|-----------|---------------|----------------|
| **Business Type Trend** | Net New vs Upsell/Cross-sell monthly split | Growth health — is the business acquiring new customers or only renewing? |
| **Recurring Revenue Share** | Own SW + Managed Services as % of OI | SaaS transition progress — the most important strategic metric for valuation |
| **Seasonality Heatmap** | 5-year monthly OI pattern | First time this has ever been visualized — enables intelligent annual planning |
| **Business Type × Region Matrix** | Are new logos coming from specific geographies? | Where to invest sales capacity |

---

## TAB 3: ORDER BOOK
### "How Healthy Is Our Backlog?"

**Who uses it:** BRM Controller, CFO, Regional Managers
**Core question answered:** *"How much contracted revenue do we hold? What's at risk? When will it convert?"*

---

### Layout

```
┌───────────────────────────────────────────────────────────────────────────┐
│  ORDER BOOK                                      Snapshot: Feb 2026        │
│  ─────────────────────────────────────────────────────────────────────    │
│                                                                            │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │
│  │  TOTAL OB    │ │ PLANNED THIS │ │  MULTI-YEAR  │ │  AT RISK     │     │
│  │  189,631     │ │   YEAR       │ │  BACKLOG     │ │  (Overdue)   │     │
│  │  kEUR        │ │  xx,xxx kEUR │ │  xx,xxx kEUR │ │  x,xxx kEUR  │     │
│  │  ▲ +2.3% MoM │ │  xx% of OB  │ │  xx% of OB   │ │  x.x% of OB  │     │
│  │  🟢          │ │  🟢          │ │  🟡          │ │  🔴          │     │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘     │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │  BACKLOG COMPOSITION — 13-MONTH TREND                               │ │
│  │                                                                      │ │
│  │  Stacked area chart — Feb 2025 → Feb 2026:                         │ │
│  │  ■ Planned Current Year  (dark blue — most certain)                 │ │
│  │  ■ Planned Next Years    (medium blue — multi-year contracts)        │ │
│  │  ■ Not Planned Yet       (light blue — booked, unscheduled)          │ │
│  │  ■ Overdue ≤ 6 mths      (amber — at risk, needs attention)          │ │
│  │  ■ Overdue > 6 mths      (red — serious risk, escalation needed)     │ │
│  │                                                                      │ │
│  │  Annotation line: Total OB (black line overlay)                     │ │
│  │                                                                      │ │
│  │  Business insight: A growing "Not Planned" bucket signals           │ │
│  │  deals being booked without a delivery plan — a revenue risk.       │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  ┌──────────────────────────────┐ ┌───────────────────────────────────┐   │
│  │  OB BY REGION                │ │  REVENUE RECOGNITION SCHEDULE     │   │
│  │  ─────────────────────────   │ │  ──────────────────────────────   │   │
│  │                              │ │                                    │   │
│  │  Treemap: RGrp lvl2          │ │  Waterfall / bar chart:           │   │
│  │  Size = OB value             │ │  Current OB split by when it      │   │
│  │  Color = MoM change rate     │ │  is planned to be recognized:     │   │
│  │  🟢 growing  🔴 shrinking    │ │                                    │   │
│  │                              │ │  ████ Q1 2026: xx,xxx kEUR        │   │
│  │  N.America ~59%              │ │  ████ Q2 2026: xx,xxx kEUR        │   │
│  │  Europe North ~20%           │ │  ████ Q3 2026: xx,xxx kEUR        │   │
│  │  International ~16%          │ │  ████ Q4 2026: xx,xxx kEUR        │   │
│  │  Europe South ~5%            │ │  ████ 2027+:   xx,xxx kEUR        │   │
│  │                              │ │  ████ Not Planned: xx,xxx kEUR    │   │
│  │  Click → drill to Region     │ │                                    │   │
│  │  → Country → Customer        │ │  Source: Pl Rec Year/Qtr from     │   │
│  └──────────────────────────────┘ │  project-level OB detail          │   │
│                                   └───────────────────────────────────┘   │
│                                                                            │
│  ┌──────────────────────────────┐ ┌───────────────────────────────────┐   │
│  │  OB BY REVENUE STREAM        │ │  HISTORICAL CONTEXT (10 years)    │   │
│  │  ─────────────────────────   │ │  ──────────────────────────────   │   │
│  │                              │ │                                    │   │
│  │  Donut + side bars:          │ │  Line chart: S1 OB by region      │   │
│  │  - HW & 3rd Party SW         │ │  2015 → 2026 (annual, from        │   │
│  │  - Own SW & Services         │ │  historical Sheet 11 data)        │   │
│  │                              │ │                                    │   │
│  │  Revenue Stream % of OB      │ │  Context: Is current OB level     │   │
│  │  vs 12 months prior          │ │  historically high or low?        │   │
│  │  Is services share growing?  │ │  10-year perspective for CFO      │   │
│  └──────────────────────────────┘ └───────────────────────────────────┘   │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │  ORDER BOOK DETAIL — PROJECT & CUSTOMER LEVEL  (DataGrid Pro)       │ │
│  │                                                                      │ │
│  │  Hierarchy drill: Region → Customer → Project → SAP Order → Line    │ │
│  │                                                                      │ │
│  │  Columns:                                                            │ │
│  │  Customer | Project Code | SAP Sales Doc | Revenue Stream |          │ │
│  │  Bucket (Planned CY / Overdue etc.) | Value kEUR |                  │ │
│  │  Planned Rec. Quarter | Entity (Agfa/Dedalus) | CRM Opportunity      │ │
│  │                                                                      │ │
│  │  Smart filters:                                                      │ │
│  │  [🔴 Overdue Only]  [⚠ Not Planned]  [Dedalus Only]  [S1 Only]     │ │
│  │  [Planned in Q1 2026]  [Value > 500 kEUR]                          │ │
│  │                                                                      │ │
│  │  Action buttons per row: [Escalate] [Add Note] [View in CRM]        │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────────────┘
```

### Advanced Analytics Capabilities in This Tab

| Capability | What It Shows | Why It Matters |
|-----------|---------------|----------------|
| **Recognition Schedule** | How much OB is planned per quarter going forward | Replaces manual revenue forecasting — answers "what revenue will we recognize?" |
| **Backlog Composition Trend** | How buckets shift month over month | Early warning: growing "Overdue" or "Not Planned" is a revenue risk signal |
| **10-Year Historical Context** | Where current OB stands in a decade of history | CFO context question — "Is 189k kEUR high or low for us?" |
| **Dedalus Carve-out Filter** | Isolate Dedalus entities in backlog | Carve-out transition tracking — what portion of OB is AGFA-owned vs Dedalus |

---

## TAB 4: P&L / TACO
### "Are We Making Money and How?"

**Who uses it:** CFO, BRM Controller, BU Finance Managers
**Core question answered:** *"What is our operating result? Where is margin expanding or compressing? Which P&L lines are off-budget?"*

---

### Layout

```
┌───────────────────────────────────────────────────────────────────────────┐
│  P&L / TACO                        FY 2025  │  View: [YTD ●] [Monthly ○]  │
│  ─────────────────────────────────────────────────────────────────────    │
│                                                                            │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │
│  │  NET SALES   │ │  TACO MARGIN │ │  TACO MARGIN │ │  TACO        │     │
│  │  ACT vs BUD  │ │  kEUR ACT    │ │  % ACT       │ │  CONTRIBUTION│     │
│  │  Variance %  │ │  vs BUD Δ    │ │  vs BUD pp Δ │ │  ACT vs BUD% │     │
│  │  🔴/🟡/🟢   │ │  🔴/🟡/🟢   │ │  🔴/🟡/🟢   │ │  🔴/🟡/🟢   │     │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘     │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │  P&L WATERFALL — FROM REVENUE TO OPERATING RESULT                   │ │
│  │                                                                      │ │
│  │  ACT (kEUR):                                                        │ │
│  │  Net Sales  ████████████████████████████████  xx,xxx               │ │
│  │  - COGS     ████████████████  -xx,xxx                               │ │
│  │  ═══════════════════════════════════════════════════                │ │
│  │  TACO MARGIN  ███████████████  xx,xxx  (xx.x% margin)              │ │
│  │  - Prod.Costs  ████  -x,xxx                                         │ │
│  │  ═══════════════════════════════════════════════════                │ │
│  │  Prod.Contribution  ██████████  xx,xxx                              │ │
│  │  - Selling Exp   ████  -x,xxx                                       │ │
│  │  - G&A           ████  -x,xxx                                       │ │
│  │  ═══════════════════════════════════════════════════                │ │
│  │  TACO CONTRIBUTION  ████████  xx,xxx  (xx.x% of revenue)           │ │
│  │                                                                      │ │
│  │  Each bar has: ACT (solid) vs BUD (dotted outline)                  │ │
│  │  Delta label: "+x,xxx above BUD" or "-x,xxx below BUD" in RAG      │ │
│  │  Toggle: [EUR ●] [Local Currency ○ — enter x-rate]                  │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  ┌──────────────────────────────┐ ┌───────────────────────────────────┐   │
│  │  TACO CONTRIBUTION TREND     │ │  VARIANCE HEATMAP                 │   │
│  │  (Monthly ACT vs BUD vs LY)  │ │  ──────────────────────────────   │   │
│  │  ─────────────────────────   │ │                                    │   │
│  │  Line chart: Jan → Dec       │ │  Rows: 12 key P&L lines           │   │
│  │  ■ ACT  □ BUD  ░ LY          │ │  Cols: Jan Feb Mar ... Dec        │   │
│  │                              │ │                                    │   │
│  │  Shaded area: ACT vs BUD gap │ │  Cell = ACT vs BUD variance %     │   │
│  │  Green = above budget        │ │  🟢 dark = strong overperformance  │   │
│  │  Red = below budget          │ │  🔴 dark = significant miss        │   │
│  │                              │ │  ⬜ = on target                    │   │
│  │  Shows which months are the  │ │                                    │   │
│  │  problem and the trajectory  │ │  Instantly answers: "COGS was     │   │
│  └──────────────────────────────┘ │  the problem in March and May"    │   │
│                                   └───────────────────────────────────┘   │
│                                                                            │
│  ┌──────────────────────────────┐ ┌───────────────────────────────────┐   │
│  │  NET SALES BY REVENUE STREAM │ │  OPEX BREAKDOWN                   │   │
│  │  (ACT vs BUD vs LY)          │ │  ──────────────────────────────   │   │
│  │  ─────────────────────────   │ │                                    │   │
│  │  Grouped bars:               │ │  Stacked bar — monthly:           │   │
│  │  HW / Own SW / 3rdP SW /     │ │  ■ Selling Expenses (SE lines)   │   │
│  │  Services / AMS              │ │  ■ G&A Expenses (GA lines)        │   │
│  │                              │ │  ■ Other Operating                │   │
│  │  Each group: ACT + BUD Δ     │ │                                    │   │
│  │  Shows revenue mix in P&L    │ │  Line overlay: % of Net Sales     │   │
│  │  context — not just OI       │ │  Is Opex ratio improving?         │   │
│  └──────────────────────────────┘ └───────────────────────────────────┘   │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │  FULL P&L — ALL 85 LINES  (Collapsible DataGrid)                   │ │
│  │                                                                      │ │
│  │  Groups (expandable/collapsible):                                   │ │
│  │  ▶ Net Sales (lines 02–26)                                          │ │
│  │  ▶ Direct Cost of Sales / COGS (lines 29–54)                        │ │
│  │  ═ TACO MARGIN  (line 55)                                           │ │
│  │  ▶ Product Driven Costs (lines 56–62)                               │ │
│  │  ═ Product Contribution (line 63)                                   │ │
│  │  ▶ Selling Expenses (lines 64–73)                                   │ │
│  │  ▶ General & Administration (lines 74–80)                           │ │
│  │  ▶ Other Operating (lines 81–83)                                    │ │
│  │  ═ TACO CONTRIBUTION (line 85) — bold, highlighted                  │ │
│  │                                                                      │ │
│  │  Columns: Line | ACT kEUR | BUD kEUR | Δ kEUR | Δ% | LY kEUR | YoY%│ │
│  │  Conditional formatting: red rows = >5% below BUD                  │ │
│  │  [Collapse All]  [Expand All]  [Export to Excel]                    │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────────────┘
```

### Advanced Analytics Capabilities in This Tab

| Capability | What It Shows | Why It Matters |
|-----------|---------------|----------------|
| **P&L Waterfall** | Step-by-step from revenue to operating result | CFO's primary view — tells the profitability story in one visual |
| **Variance Heatmap** | Month × P&L line color grid | Pinpoints exactly which month and which cost line caused a budget miss |
| **Revenue Stream P&L** | Margin by stream (HW vs SW vs Services) | Services typically higher margin — shows if the business is mixing correctly |
| **Collapsible P&L** | Drill from summary to all 85 lines | Replaces the 4-sheet TACO pivot navigation in current Excel |

---

## TAB 5: REVENUE OUTLOOK
### "What Will We Recognize and When?"

**Who uses it:** CFO, BRM Controller, Finance Planning team
**Core question answered:** *"Based on backlog and intake trends, what revenue will we recognize in the coming quarters — and how confident are we?"*

**This is the most differentiated tab — it answers questions that are completely impossible with today's Excel setup.**

---

### Layout

```
┌───────────────────────────────────────────────────────────────────────────┐
│  REVENUE OUTLOOK                                                           │
│  ─────────────────────────────────────────────────────────────────────    │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │  THE REVENUE ENGINE — OI → OB → REVENUE                             │ │
│  │                                                                      │ │
│  │  How to read: OI feeds into OB. OB releases as Revenue (TACO).      │ │
│  │  If OI > Revenue: OB grows (building backlog). ✅                   │ │
│  │  If Revenue > OI: OB shrinks (consuming backlog). ⚠️                │ │
│  │                                                                      │ │
│  │  Monthly bar + line combo (13 months):                              │ │
│  │  Bars (left Y): OI ACT (blue) vs TACO Net Sales ACT (green)        │ │
│  │  Line (right Y): Order Book total (black — level indicator)         │ │
│  │  Area shading: OI - Revenue gap (green=building, red=depleting)     │ │
│  │                                                                      │ │
│  │  Annotation: "OB depleted by x,xxx kEUR over last 3 months —       │ │
│  │  OI must accelerate to maintain backlog level"                      │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  ┌──────────────────────────────┐ ┌───────────────────────────────────┐   │
│  │  RECOGNITION SCHEDULE        │ │  FORECAST CONFIDENCE PYRAMID      │   │
│  │  FROM CURRENT BACKLOG        │ │  ──────────────────────────────   │   │
│  │  ─────────────────────────   │ │                                    │   │
│  │                              │ │  Total Revenue Outlook FY2026:    │   │
│  │  Stacked bar — forward view: │ │                                    │   │
│  │  Q1 ████ xx,xxx (from Pl Rec)│ │  ████████████████ Already         │   │
│  │  Q2 ████ xx,xxx              │ │    Recognized (TACO ACT YTD)      │   │
│  │  Q3 ████ xx,xxx              │ │  ████████████ Planned CY in OB    │   │
│  │  Q4 ████ xx,xxx              │ │    (scheduled in backlog)         │   │
│  │  2027 ████ xx,xxx            │ │  ████████ Not Planned OB          │   │
│  │  2028+ ███ xx,xxx            │ │    (in backlog, unscheduled)      │   │
│  │  Not Planned ██ xx,xxx       │ │  ████ OI Pipeline (Q3/Q4 orders   │   │
│  │                              │ │    likely to book)                │   │
│  │  Color intensity = certainty │ │  ░░░░ Gap to BUD                  │   │
│  │  Dark = high confidence      │ │                                    │   │
│  │  Light = lower confidence    │ │  "Of EUR x BUD, xx% is covered    │   │
│  └──────────────────────────────┘ │   by existing backlog"            │   │
│                                   └───────────────────────────────────┘   │
│                                                                            │
│  ┌──────────────────────────────┐ ┌───────────────────────────────────┐   │
│  │  RECURRING REVENUE MOMENTUM  │ │  SCENARIO ANALYSIS                │   │
│  │  ─────────────────────────   │ │  ──────────────────────────────   │   │
│  │                              │ │                                    │   │
│  │  Line chart — 24 months:     │ │  Adjust assumptions, see impact:  │   │
│  │  ■ Recurring OI (subscript/  │ │                                    │   │
│  │    managed services codes)   │ │  OI Growth vs BUD:                │   │
│  │  ■ Non-recurring OI          │ │  ◄──────●──────► -10% ... +10%   │   │
│  │                              │ │                                    │   │
│  │  Recurring % trend line      │ │  OB Conversion Rate:              │   │
│  │  showing SaaS transition     │ │  ◄──────●──────► slow ... fast   │   │
│  │  velocity                    │ │                                    │   │
│  │                              │ │  Result:                          │   │
│  │  Benchmark: what % recurring │ │  Base: xx,xxx kEUR revenue        │   │
│  │  do we need for predictable  │ │  Bull: xx,xxx kEUR                │   │
│  │  revenue base?               │ │  Bear: xx,xxx kEUR                │   │
│  └──────────────────────────────┘ └───────────────────────────────────┘   │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │  PLANNED RECOGNITION DETAIL — BY CUSTOMER & PROJECT (DataGrid)      │ │
│  │                                                                      │ │
│  │  "Which specific deals are scheduled to recognize revenue in H1 2026?"│ │
│  │                                                                      │ │
│  │  Hierarchy: Pl Rec Quarter → Region → Customer → Project            │ │
│  │  Cols: Customer | Project | FA Description | Revenue kEUR |          │ │
│  │        Pl Rec Qtr | Pl Rec Year | Bucket | Risk Flag                │ │
│  │                                                                      │ │
│  │  [Q1 2026 ●] [Q2 2026 ○] [Q3 2026 ○] [Q4 2026 ○] [2027+ ○]        │ │
│  │  [Show Overdue Only]  [Show Dedalus Only]  [Export]                  │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────────────┘
```

### Advanced Analytics Capabilities in This Tab

| Capability | What It Shows | Why It Matters |
|-----------|---------------|----------------|
| **Revenue Engine visual** | OI vs Revenue vs OB level together | First time the full lifecycle is visible in one view |
| **Forecast Confidence Pyramid** | How much of budget is covered by existing backlog | Answers the CFO's key planning question with one visual |
| **Scenario Analysis** | What-if on OI growth rate and OB conversion speed | Enables BUD review conversations with data, not gut feel |
| **Recurring Revenue Momentum** | Subscription/managed services share trend | SaaS transition progress — critical for long-term valuation story |

---

## TAB 6: CUSTOMER 360°
### "What Does Our Customer Relationship Look Like End-to-End?"

**Who uses it:** BRM Controller, Account Managers, Regional Managers
**Core question answered:** *"For any customer — what is their OI history, current backlog, planned recognition, and financial contribution?"*

---

### Layout

```
┌───────────────────────────────────────────────────────────────────────────┐
│  CUSTOMER 360°                                                             │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │  Search Customer:  [🔍 Type customer name or SAP ID...           ▼] │ │
│  │  e.g. "University Hospital" → shows all matching entities            │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  ─── CUSTOMER: [CUSTOMER NAME]  │  BU: S1  │  Region: Europe North ───   │
│                                                                            │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │
│  │  TOTAL OI    │ │  ORDER BOOK  │ │  REVENUE     │ │ BUSINESS     │     │
│  │  (All Time)  │ │  (Current)   │ │  RECOGNIZED  │ │ TYPE MIX     │     │
│  │  kEUR        │ │  kEUR        │ │  (TACO YTD)  │ │ Net New xx%  │     │
│  │              │ │  ▲/▼ MoM    │ │  kEUR        │ │ Upsell  xx%  │     │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘     │
│                                                                            │
│  ┌──────────────────────────────┐ ┌───────────────────────────────────┐   │
│  │  OI HISTORY — MONTHLY        │ │  ORDER BOOK BREAKDOWN             │   │
│  │  (24 months)                 │ │  for this customer                │   │
│  │  ─────────────────────────   │ │  ──────────────────────────────   │   │
│  │                              │ │                                    │   │
│  │  Bar chart: monthly OI ACT   │ │  Stacked bar: bucket composition  │   │
│  │  colored by Business Type    │ │  ■ Planned CY                     │   │
│  │  ■ Net New (blue)            │ │  ■ Planned NY                     │   │
│  │  ■ Upselling (green)         │ │  ■ Not Planned                    │   │
│  │  ■ Cross Sell (yellow)       │ │  ■ Overdue                        │   │
│  │  ■ Transition (grey)         │ │                                    │   │
│  │                              │ │  + List of active projects:       │   │
│  │  Shows: is the customer      │ │  Project Code | Value | Rec. Qtr  │   │
│  │  growing, stable, or         │ │  with overdue flag if applicable  │   │
│  └──────────────────────────────┘ └───────────────────────────────────┘   │
│                                                                            │
│  ┌──────────────────────────────┐ ┌───────────────────────────────────┐   │
│  │  REVENUE STREAM PROFILE      │ │  PLANNED RECOGNITION TIMELINE     │   │
│  │  ─────────────────────────   │ │  ──────────────────────────────   │   │
│  │                              │ │                                    │   │
│  │  Donut chart:                │ │  Gantt / timeline chart:          │   │
│  │  What does this customer     │ │  Each open project as a bar:      │   │
│  │  buy from us?                │ │  Start = today                    │   │
│  │  HW / Own SW / 3rdP SW /     │ │  End = Pl Rec Quarter             │   │
│  │  Services / AMS              │ │  Bar width = value                │   │
│  │  Split by recurring vs       │ │  Color = bucket (planned/overdue) │   │
│  │  non-recurring               │ │                                    │   │
│  │                              │ │  Gives account manager a visual   │   │
│  │  Insight: is this a HW       │ │  of what revenue to expect and    │   │
│  │  customer transitioning to   │ │  when — for customer conversations│   │
│  │  managed services?           │ │                                    │   │
│  └──────────────────────────────┘ └───────────────────────────────────┘   │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │  FULL ORDER HISTORY  (DataGrid Pro — all time)                      │ │
│  │                                                                      │ │
│  │  Source: OI (bookings) + OB Detailed (current backlog)              │ │
│  │                                                                      │ │
│  │  Hierarchy: Year → Quarter → SAP Order → Line Item                  │ │
│  │  Cols: Date | OI / OB | SAP Order | Project Code | Revenue Stream |  │ │
│  │        Value kEUR | Pl Rec Qtr | Status | Business Type            │ │
│  │                                                                      │ │
│  │  Status tags: ✅ Recognized  📦 In Backlog  ⚠ Overdue  🕐 Pending │ │
│  │                                                                      │ │
│  │  [Export customer report]  [Download as PDF]                        │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## PART 4: CROSS-CUTTING CAPABILITIES

### 4.1 Universal Drill-Down Pattern

Every chart in every tab follows the same drill-down hierarchy. One click navigates down; breadcrumb navigates back up.

```
LEVEL 1 — COMPANY
  AGFA HE IT (all BUs, all regions)
    │
    ▼
LEVEL 2 — BUSINESS UNIT × REGION GROUP
  S1 / N.America  |  S1 / Europe North  |  S2 / Europe North ...
    │
    ▼
LEVEL 3 — REGION × REVENUE STREAM
  USA  |  Canada  |  UK  |  Benelux  |  Nordic  ...
    │
    ▼
LEVEL 4 — CUSTOMER
  [Customer Name / SAP ID]
    │
    ▼
LEVEL 5 — PROJECT
  [Proj def code + description]
    │
    ▼
LEVEL 6 — ORDER LINE
  [SAP Sales Doc + Line Item + Value + Status]
```

### 4.2 Intelligent Alerts Engine

Alerts are auto-generated from data thresholds — no manual input required. Shown on Overview tab and optionally emailed.

| Alert Type | Trigger Condition | Severity | Audience |
|-----------|------------------|----------|---------|
| OB overdue growing | Overdue % > 3% of total OB | 🔴 Critical | Controller, CFO |
| OI consecutive miss | OI below BUD for 3+ months in same region | 🔴 Critical | Regional Manager |
| Backlog depletion | OI < Revenue for 2+ consecutive months | 🔴 Critical | CFO, Controller |
| Not Planned growing | Not Planned bucket > 20% of total OB | 🟡 Warning | Controller |
| N.America concentration | N.America > 65% of OB | 🟡 Warning | CFO |
| Recurring share declining | Recurring OI < prior quarter | 🟡 Warning | CFO |
| TACO Margin below threshold | TACO Margin % < 30% in any BU | 🔴 Critical | CFO, Controller |
| Recognition schedule gap | Q1 Planned CY < Revenue target | 🟡 Warning | Controller |
| Dedalus OB material | Dedalus entities > 5% of total OB | ℹ Info | CFO |

### 4.3 Export Capabilities

| Export Type | What It Contains | Format |
|------------|-----------------|--------|
| **Management Pack** | Overview + BU Scorecard + Key alerts | PDF, auto-formatted |
| **OB Snapshot** | Full order book at any period snapshot | Excel |
| **OI Performance** | Monthly OI ACT/BUD/LY by BU/Region/FA | Excel |
| **P&L Summary** | Key 12 lines (not all 85) with ACT/BUD/LY | Excel + PDF |
| **Customer Report** | Customer 360° for selected customer | PDF |
| **Recognition Schedule** | OB split by planned recognition quarter | Excel |

---

## PART 5: DATA QUALITY TRANSPARENCY

Users must trust what they see. Every view includes a data confidence indicator:

```
┌────────────────────────────────────────────────────────┐
│  DATA SOURCES FOR THIS VIEW                             │
│  ✅ Order Book (EDW — refreshed 18 Mar 2026 06:00)     │
│  ✅ Order Intake (EDW — refreshed 18 Mar 2026 06:00)   │
│  ⚠️  TACO P&L (EDW — refreshed 15 Mar 2026 — 3 days)   │
│  ℹ️  OB Detailed: S1 only — S2/S4 project detail N/A   │
│  ℹ️  Business Type dimension: OI only — not in OB/TACO  │
└────────────────────────────────────────────────────────┘
```

This builds confidence and removes the "which version is this?" question that plagues the current Excel process.

---

## PART 6: VALUE PROPOSITION SUMMARY

### What This Dashboard Delivers vs. Current State

| Business Capability | Current Excel State | This Dashboard |
|--------------------|--------------------|--------------------|
| Single view of OI + OB + TACO | ❌ 4 separate files | ✅ Unified in one platform |
| Revenue recognition forecast | ❌ Not possible | ✅ Pl Rec Year/Qtr visual |
| Business Type analysis (Net New vs Upsell) | ❌ Buried in 1 of 15 sheets | ✅ Dedicated visual, all tabs |
| Recurring revenue trend (SaaS transition) | ❌ Not tracked | ✅ Dedicated momentum chart |
| OB overdue risk monitoring | ❌ Manual bucket lookup | ✅ Auto-alert with drill-down |
| P&L variance by month AND line | ❌ Requires cross-referencing | ✅ Single heatmap |
| Customer-level lifecycle (OI→OB→Revenue) | ❌ Not possible | ✅ Customer 360° tab |
| 10-year OB historical context | ❌ Separate sheet, static | ✅ Integrated into OB tab |
| Scenario modeling (what-if) | ❌ Not possible | ✅ Outlook tab with sliders |
| Automated alerts | ❌ Manual detection | ✅ 9 auto-generated alert types |
| Dedalus carve-out tracking | ❌ Not visible | ✅ Filter on OB tab |
| Regional OI vs BUD heatmap | ❌ Separate sheet per region | ✅ Single comparative view |
| Data freshness transparency | ❌ No indicator | ✅ Per-view data source badge |
| Export for management pack | ❌ Manual copy-paste | ✅ One-click PDF export |

### The Three Strategic Insights This Dashboard Enables

**1. Revenue Predictability**
By combining OB recognition schedule + OI pipeline, the CFO can for the first time answer: *"What percentage of next year's revenue target is already secured in the backlog?"* — turning forecasting from a guessing exercise into a data-driven conversation.

**2. Growth Quality**
The Business Type dimension (Net New vs Upselling) combined with the recurring revenue trend tells the strategic story: *"Is AGFA HE IT growing by acquiring new logos, expanding existing relationships, or transitioning customers to subscription models?"* — the three fundamentally different growth profiles that drive completely different valuations.

**3. Risk Concentration**
The automated alerts on regional concentration (N.America ~59% of OB), overdue backlog, and Dedalus carve-out exposure give the CFO an always-on risk dashboard — replacing the current model where risks are only discovered when someone manually looks.

---

## PART 7: QUESTIONS FOR BUSINESS USER FEEDBACK SESSION

Use these during the review to guide the conversation:

**On Coverage:**
1. Are there KPIs you currently track manually that you don't see represented here?
2. Which tab would you open first every morning — and what would you expect to see?
3. Is the Customer 360° tab relevant for your day-to-day, or is the BU/Regional view more important?

**On Analytical Depth:**
4. How far down do you typically need to drill — Region level, or all the way to individual projects?
5. The Revenue Outlook tab shows a scenario analysis — is this useful, or would you prefer a more structured forecasting input process?
6. Is the Dedalus carve-out visibility important to show prominently, or is it a secondary concern?

**On Usability:**
7. Do you need this on mobile/tablet, or is desktop-only sufficient?
8. Would you want automated email alerts, or is the dashboard-check model sufficient?
9. What frequency of data refresh do you need — daily, weekly, real-time?

**On Data Trust:**
10. What is the one number you would validate first to trust everything else in the dashboard?
