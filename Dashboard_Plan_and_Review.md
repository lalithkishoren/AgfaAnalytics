# Digital Hydrogen — Review Call Preparation & MUI Dashboard Plan

> **Date**: 2026-03-17
> **Prepared for**: Review call with Agfa Digital Hydrogen (Zirfon) team
> **Audience**: Finance Controller
> **Deliverable**: Multi-tab MUI Dashboard with hierarchical drill-down

---

# SECTION A: FINANCE CONTROLLER'S PERSPECTIVE — WHAT WE UNDERSTAND

## A1. The Business at a Glance

Agfa's Digital Hydrogen division manufactures **Zirfon separator membranes** (UTP500, UTP220, UTP500+) for alkaline water electrolysis — a critical component in the green hydrogen value chain. The business operates from **Belgium (HQ, manufacturing)** with intercompany distribution via **Japan** and **South Korea**.

### Revenue Trajectory
```
FY2022:  EUR  4.2M  ░░
FY2023:  EUR 11.5M  ░░░░░░
FY2024:  EUR 33.4M  ░░░░░░░░░░░░░░░░░  (+191% — breakout year)
FY2025:  EUR 30.8M  ░░░░░░░░░░░░░░░░   (+7.1% on actuals, missed BUD 36.2M)
FY2026F: EUR  6.2M  ░░░                 (FORECAST CRISIS — only 36% of BUD 17.3M)
```

### The Headline Story for the Controller
1. **2022→2024 was a ramp-up story** — revenue grew 8x in 2 years, driven by green hydrogen market expansion and key contracts (TK Nucera NEOM, Sunfire)
2. **2025 was stabilization** — beat prior year (+3.7%) but missed budget (-15.1%), suggesting the initial wave of orders has been fulfilled
3. **2026 is a crisis** — EUR 6.2M forecast vs EUR 31.2M just 6 months ago. The EUR 25M downward revision between July and September is the single most important data point
4. **Long-term plans (2027-2029) assume rapid recovery** — EUR 38.6M→51.4M→69.9M — but the path from EUR 6.2M to EUR 38.6M is not explained by current data

---

## A2. How They Currently Analyze Data

### Current Tooling: 100% Excel-Based
The controller maintains **3 separate workbooks** plus **4 data files**, all manually maintained:

| Workbook | Purpose | Sheets | Refresh |
|----------|---------|--------|---------|
| FY 2025.xls | Revenue + Margin reporting (SAP BI extract) | 25 | Monthly SAP extract paste |
| ACTFY2025 Forecasting | FY2025 forecast building + tracking | 44 | Each RFC cycle |
| Sales Forecast Feb2026 | FY2026 forecast building + tracking | 49 | Each RFC cycle |
| Sales Zirfon GHS | Order lifecycle tracking (quote→order→invoice→payment) | 6 | Manual entry |

### Current Analytics Maturity Assessment

#### DESCRIPTIVE ANALYTICS (What happened?) — MATURE ✅
The controller already does this well:
- **Monthly/Quarterly/YTD revenue** by product, customer, country (FY 2025.xls: Sheets 2-6, 9)
- **Margin analysis** with standard cost prices (Sheets 4, 7, 8)
  - Monthly GM% by product (58-68% range)
  - Margin bridge: Volume/Mix + Price/Mix + Cost Efficiencies
- **ACT vs BUD vs LY comparisons** (Sheets 2, 5, 6)
- **Customer rankings** and concentration tracking (Customer sort sheets)
- **Intercompany vs 3rd Party** split (3rd P or ICO flag)
- **Product mix** tracking (UTP500/220/500+ split)

**What's missing in descriptive**:
- No **end-to-end Quote→Order→Revenue→Cash** view (data is fragmented across 4+ files)
- No **customer cohort analysis** (which 2023 customers are still buying in 2025?)
- No **geographic concentration risk** tracking as a KPI
- No **order intake vs revenue** trend (leading vs lagging indicator)
- No **pricing trend** analysis (EUR/m² erosion or growth over time)
- No consolidated view across years — each year is a separate sheet/file

#### PREDICTIVE ANALYTICS (What will happen?) — BASIC ⚠️
Current forecasting is:
- **Manual assembly** of: Actuals + Open orders (committed) + Recent quotes (uncommitted) + Manual TK Nucera
- **FOR Type categories**: ACT part / Committed / Uncommitted / Unidentified — good structure but manual
- **18-month rolling** view exists
- **Forecast revision tracking** (FOR vs previous FOR) shows forecast accuracy over time

**What's missing in predictive**:
- No **statistical forecast model** — purely manual/judgmental
- No **conversion rate-based pipeline weighting** (they use quotes from "last 3 months" as uncommitted, but don't apply historical conversion rates)
- No **forecast bias correction** — data shows consistent optimism bias but no systematic adjustment
- No **scenario modeling** (base/bull/bear)
- No **customer-level probability scoring** for pipeline
- No **seasonality modeling** — Q4 loading pattern exists but isn't used for prediction

#### PRESCRIPTIVE ANALYTICS (What should we do?) — NOT PRESENT ❌
Nothing in the current data suggests prescriptive analytics:
- No **pricing optimization** (when to discount, when to hold)
- No **customer prioritization scoring** (which prospects to focus on)
- No **capacity planning** tied to pipeline probability
- No **risk alerts** (customer concentration breaching thresholds, margin erosion triggers)
- No **what-if analysis** (if we lose TK Nucera, what happens to revenue?)

---

## A3. Critical Findings & Gaps

### TOP 5 FINDINGS (for the review call)

| # | Finding | Impact | Controller Action Needed |
|---|---------|--------|--------------------------|
| 1 | **FY2026 forecast collapsed from EUR 31.2M to EUR 6.2M** | Revenue crisis — only 20% of prior year | Need root cause: cancelled orders? Market downturn? Timing shift? |
| 2 | **Extreme customer concentration** — Top 2 = 56% of revenue (ThyssenKrupp + Sunfire) | One lost customer = revenue halved | Need diversification strategy metrics |
| 3 | **Quote→Order link is broken** — no shared key between Quotation and SAP | Cannot trace which quotes became which orders | Need SAP quotation reference or mapping |
| 4 | **Forecasting has systematic optimism bias** — forecasts consistently revised down | Controller may be reporting inflated numbers early in cycle | Need bias correction methodology |
| 5 | **Long-term plans (2027-2029) disconnect from current reality** | PLAN2027 EUR 38.6M vs FY2026 EUR 6.2M — 6.2x gap | Plans need re-baselining or bridge explanation |

### DATA GAPS STILL OPEN

| Gap | Status | Impact | Ask |
|-----|--------|--------|-----|
| Quote→SAP Order linkage | **OPEN** | Can't build true conversion funnel | Can SAP capture quotation reference? |
| Payment data (only 23% populated) | **OPEN** | Can't calculate DSO/cash collection | Is SAP FI/AR data available? |
| Customer segmentation (OEM/End-User/Research) | **OPEN** | Can't segment revenue quality | Can controller classify top 50 customers? |
| Lost deal reasons | **OPEN** | 82% of quotes don't convert — no insight why | Can sales team tag lost reasons? |
| FY2026 forecast root cause | **NEW** | The EUR 25M revision is unexplained in data | What happened Jul→Sep? |

### QUESTIONS FOR THE REVIEW CALL

**Must-answer today:**
1. **What caused the FY2026 forecast to drop from EUR 31.2M to EUR 6.2M?** Is it TK Nucera NEOM delays? Sunfire? Market-wide?
2. **Are Sunfire GmbH, Sunfire SE, and Sunfire Switzerland one customer group or separate?** (Changes who the #1 customer is)
3. **Is the FY2026 budget (EUR 17.3M) being re-baselined?** Or are we tracking against a now-unrealistic target?
4. **What reporting cadence and tool does the controller want?** Monthly dashboard? Real-time? Excel-based or web app?

**Good to clarify:**
5. What is the status of TK Nucera NEOM batches #6-#25? (~EUR 19M remaining)
6. Is there production capacity constraint? What's max m²/year?
7. Are the long-term plans (2027-2029) still valid given the 2026 forecast?
8. What drives the margin change from 58-68% in 2025 to 51.4% in Q1 2026?

---

# SECTION B: MUI DASHBOARD PLAN — MULTI-TAB HIERARCHICAL DESIGN

## B1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    AGFA DIGITAL HYDROGEN                         │
│              Zirfon Business Intelligence Dashboard              │
│                                                                  │
│  ┌─────────┬──────────┬──────────┬──────────┬─────────┬───────┐ │
│  │Overview │Pipeline &│Revenue & │Margin &  │Forecast │Customer│ │
│  │         │Conversion│Orders    │Profit    │& Plans  │360°    │ │
│  └─────────┴──────────┴──────────┴──────────┴─────────┴───────┘ │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │ GLOBAL FILTERS (persistent across all tabs)                  ││
│  │ [Year ▼] [Quarter ▼] [Product ▼] [Region ▼] [Customer ▼]   ││
│  │ [3rd Party / ICO ▼] [FOR Type ▼]                            ││
│  └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │                     TAB CONTENT AREA                         ││
│  │              (details per tab below)                          ││
│  └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│  [Data last refreshed: 2026-03-17 09:00] [Export ▼] [Settings ⚙]│
└─────────────────────────────────────────────────────────────────┘
```

### Tech Stack
| Layer | Technology | Why |
|-------|-----------|-----|
| **UI Framework** | React 18 + TypeScript | Type safety, component reuse |
| **Component Library** | MUI (Material UI) v5 | Professional enterprise look, extensive data components |
| **Data Visualization** | Recharts + MUI X Charts | MUI-native charts + Recharts for complex viz |
| **Data Grid** | MUI X DataGrid Pro | Sorting, filtering, grouping, export, hierarchical rows |
| **State Management** | React Context + useReducer | Filter state shared across tabs |
| **Data Layer** | Python FastAPI backend | Data processing, aggregation, Excel file parsing |
| **Data Processing** | Pandas + openpyxl | Parse all 7 Excel files into unified data model |

---

## B2. Tab-by-Tab Design

### TAB 1: OVERVIEW (Executive Summary — "The Review Call Tab")

**Purpose**: The first thing the controller sees. Answers "How are we doing?" in 10 seconds.

```
┌─────────────────────────────────────────────────────────────────┐
│ OVERVIEW                                                         │
│                                                                  │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐    │
│ │ YTD Revenue│ │ vs Budget  │ │ vs LY      │ │ Gross Margin│    │
│ │  EUR 1.7M  │ │  -64.3%    │ │  -79.9%    │ │   51.4%    │    │
│ │  ▼ trend   │ │  🔴 RED    │ │  🔴 RED    │ │  ⚠️ AMBER  │    │
│ └────────────┘ └────────────┘ └────────────┘ └────────────┘    │
│                                                                  │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐    │
│ │ Full Year  │ │ Pipeline   │ │ Conversion │ │ Open Orders │    │
│ │ Forecast   │ │ Value      │ │ Rate       │ │ Backlog     │    │
│ │  EUR 6.2M  │ │  EUR XXM   │ │  24.8%     │ │  EUR 2.2M   │    │
│ │  36% of BUD│ │  from Quot.│ │  ▲ trend   │ │  117 orders │    │
│ └────────────┘ └────────────┘ └────────────┘ └────────────┘    │
│                                                                  │
│ ┌──────────────────────────┐ ┌──────────────────────────────┐   │
│ │ Revenue Trend (4-year)   │ │ Forecast Revision Tracker    │   │
│ │ ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅      │ │ RFC1 → RFC2 → RFC3 → Current│   │
│ │ Area chart: ACT vs BUD   │ │ Waterfall: shows revisions   │   │
│ │ vs FOR with YoY overlay  │ │ from initial to current FOR  │   │
│ └──────────────────────────┘ └──────────────────────────────┘   │
│                                                                  │
│ ┌──────────────────────────┐ ┌──────────────────────────────┐   │
│ │ Customer Concentration   │ │ Data Gaps & Questions        │   │
│ │ Treemap: top 10 customers│ │ Checklist of open items      │   │
│ │ Size=revenue, Color=YoY  │ │ for the controller to review │   │
│ │ growth rate              │ │ with action items & status   │   │
│ └──────────────────────────┘ └──────────────────────────────┘   │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ KEY ALERTS (auto-generated from data)                        │ │
│ │ 🔴 FY2026 forecast EUR 25M below July estimate              │ │
│ │ 🔴 Top 2 customers = 56% of revenue — concentration risk    │ │
│ │ ⚠️ Q1 margin (51.4%) below FY2025 average (61%)             │ │
│ │ ⚠️ Open orders down 45% vs prior year (117 vs 212)          │ │
│ │ ℹ️ FY2025 forecast missed budget by 15.1%                   │ │
│ └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**MUI Components**:
- `Card` with `CardContent` for KPI tiles (8 tiles, 2 rows of 4)
- KPI tiles use conditional coloring: Green (>5% above target), Amber (within 5%), Red (>5% below)
- `AreaChart` (Recharts) for revenue trend
- `BarChart` (Recharts) for forecast revision waterfall
- `Treemap` (Recharts) for customer concentration
- `Alert` components for the KEY ALERTS section
- `Chip` components for status indicators (Actual/Committed/Uncommitted/Unidentified)

---

### TAB 2: PIPELINE & CONVERSION (Quote-to-Order Analytics)

**Purpose**: Answers "How healthy is our pipeline? Are we converting enough quotes?"

```
┌─────────────────────────────────────────────────────────────────┐
│ PIPELINE & CONVERSION                                            │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ CONVERSION FUNNEL                                            │ │
│ │ Quotes Sent ─── Approved ─── Ordered ─── Delivered ─── Paid │ │
│ │   1,337          98          240          756          215   │ │
│ │   100%          7.3%        18.0%        56.5%        16.1% │ │
│ │ (Sankey/Funnel diagram with drop-off at each stage)          │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ ┌───────────────────────┐ ┌────────────────────────────────────┐│
│ │ Conversion by Year    │ │ Conversion by Product              ││
│ │ 2023: 8.8%  ░░░      │ │ UTP220:  22.9% ░░░░░░░░           ││
│ │ 2024: 24.1% ░░░░░░░░ │ │ UTP500+: 16.5% ░░░░░░            ││
│ │ 2025: 24.8% ░░░░░░░░ │ │ UTP500:  16.2% ░░░░░░            ││
│ └───────────────────────┘ └────────────────────────────────────┘│
│                                                                  │
│ ┌───────────────────────┐ ┌────────────────────────────────────┐│
│ │ Pipeline Value        │ │ Quote Aging (Open Quotes)          ││
│ │ Open quotes by product│ │ 0-30d │ 30-90d │ 90-180d │ 180d+ ││
│ │ EUR amount + count    │ │ Stacked bar with EUR values        ││
│ └───────────────────────┘ └────────────────────────────────────┘│
│                                                                  │
│ ┌───────────────────────┐ ┌────────────────────────────────────┐│
│ │ Win Rate by Country   │ │ Deal Size vs Conversion            ││
│ │ World map with        │ │ Scatter: X=deal size, Y=conv rate  ││
│ │ color = conversion %  │ │ Shows small deals convert better   ││
│ └───────────────────────┘ └────────────────────────────────────┘│
│                                                                  │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ QUOTATION DETAIL (MUI DataGrid Pro with grouping)            │ │
│ │ Hierarchy: Year → Quarter → Customer → Individual Quote      │ │
│ │ Columns: Quote#, Date, Customer, Country, Product, sqm,      │ │
│ │          EUR/m², Total, Status, Days Open, Converted?         │ │
│ │ [Export CSV] [Group by ▼]                                     │ │
│ └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**MUI Components**:
- Custom `Funnel` component (Recharts `BarChart` adapted or custom SVG)
- `HorizontalBarChart` for conversion rates
- `ScatterChart` for deal size vs conversion
- `DataGrid Pro` with `treeData` for hierarchical quote detail
- `Tooltip` with MUI popovers showing quote details on hover

---

### TAB 3: REVENUE & ORDERS (Order-to-Revenue Analytics)

**Purpose**: Answers "How much revenue did we generate? What's the order backlog? Who are our top customers?"

```
┌─────────────────────────────────────────────────────────────────┐
│ REVENUE & ORDERS                                                 │
│                                                                  │
│ ┌───────────────────────────────────────────────────────────────┐│
│ │ REVENUE WATERFALL (Year-over-Year Bridge)                     ││
│ │ FY2024 → Existing Customer Growth → New Customers →           ││
│ │ Lost Customers → Price Effect → FY2025                        ││
│ │ [Waterfall chart showing components of YoY revenue change]    ││
│ └───────────────────────────────────────────────────────────────┘│
│                                                                  │
│ ┌─────────────────────┐ ┌─────────────────────────────────────┐ │
│ │ Revenue by Product  │ │ Revenue by Region                   │ │
│ │ Stacked area chart  │ │ Choropleth map or treemap           │ │
│ │ UTP500/220/500+     │ │ DACH 65% │ APAC 14% │ S.Europe 10%│ │
│ │ over time (monthly) │ │ with drill-down to country          │ │
│ └─────────────────────┘ └─────────────────────────────────────┘ │
│                                                                  │
│ ┌─────────────────────┐ ┌─────────────────────────────────────┐ │
│ │ ACT vs BUD vs LY    │ │ Customer Pareto (80/20)             │ │
│ │ Grouped bar chart   │ │ Cumulative % curve showing          │ │
│ │ by Month or Quarter │ │ how few customers drive 80%         │ │
│ │ with variance %     │ │ of revenue                          │ │
│ └─────────────────────┘ └─────────────────────────────────────┘ │
│                                                                  │
│ ┌─────────────────────┐ ┌─────────────────────────────────────┐ │
│ │ Order Intake Trend  │ │ Backlog Aging                       │ │
│ │ Monthly new orders  │ │ Open orders by delivery month       │ │
│ │ vs invoiced revenue │ │ (committed future revenue)          │ │
│ │ Leading vs lagging  │ │ Stacked by product type             │ │
│ └─────────────────────┘ └─────────────────────────────────────┘ │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ ORDER DETAIL (MUI DataGrid Pro)                              │ │
│ │ Hierarchy: Customer Group → Legal Entity → Order → Line Item │ │
│ │ Source: Sales Zirfon GHS + AP1 SAP (merged)                  │ │
│ │ Columns: Order#, Date, Customer, Product, M2, EUR/m², Total, │ │
│ │          Status, SAP#, Invoice#, Delivery Date               │ │
│ │ [Row grouping] [Column pinning] [Quick filter] [Export]      │ │
│ └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**Hierarchical Drill-Down** (key differentiator):
```
Revenue by Region (Level 1) — click Europe DACH
  → Revenue by Country (Level 2) — click Germany
    → Revenue by Customer (Level 3) — click ThyssenKrupp
      → Revenue by Product (Level 4) — click UTP220
        → Individual Orders (Level 5) — see each order line
```

**MUI Components**:
- `WaterfallChart` (custom Recharts `BarChart`)
- `AreaChart` stacked for product mix over time
- `DataGrid Pro` with `rowGrouping` and `detailPanel` for hierarchical drill
- `Tabs` within tab for sub-views (Monthly / Quarterly / YTD)
- `ToggleButtonGroup` for ACT/BUD/LY/FOR view switching

---

### TAB 4: MARGIN & PROFITABILITY

**Purpose**: Answers "Are we making money? Where are margins expanding or contracting?"

```
┌─────────────────────────────────────────────────────────────────┐
│ MARGIN & PROFITABILITY                                           │
│                                                                  │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐    │
│ │ Gross Margin│ │ GM vs LY   │ │ GM vs BUD  │ │ Best Product│   │
│ │   51.4%    │ │  -9.6pp    │ │  -7.2pp    │ │ UTP500 57.1%│   │
│ │  Q1 2026   │ │  (was 61%) │ │  (tgt 58.6)│ │             │    │
│ └────────────┘ └────────────┘ └────────────┘ └────────────┘    │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ MARGIN BRIDGE (Waterfall)                                    │ │
│ │ Prior Year GM% → Volume/Mix Impact → Price/Mix Impact →     │ │
│ │ Cost Efficiency → Current GM%                                │ │
│ │ [Shows exactly what's driving margin change]                 │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ ┌───────────────────────┐ ┌────────────────────────────────────┐│
│ │ GM% by Product (trend)│ │ Pricing Power: EUR/m² Trend       ││
│ │ Line chart: UTP500,   │ │ Actual selling price vs standard  ││
│ │ UTP220, UTP500+ over  │ │ cost over time by product         ││
│ │ monthly periods       │ │ Shows margin expansion/compression││
│ └───────────────────────┘ └────────────────────────────────────┘│
│                                                                  │
│ ┌───────────────────────┐ ┌────────────────────────────────────┐│
│ │ GM% by Customer (top  │ │ Cost Price Changes                ││
│ │ 15 customers ranked)  │ │ Standard cost vs MSP vs Actual    ││
│ │ Horizontal bar sorted │ │ UTP500: 115.86→102.10 (MSP)      ││
│ │ by GM%                │ │ UTP220: 95.47→111.07 (MSP ↑)     ││
│ └───────────────────────┘ └────────────────────────────────────┘│
│                                                                  │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ MONTHLY MARGIN DETAIL (MUI DataGrid)                         │ │
│ │ Pivot: Month × Product → Turnover, Cost, GM, GM%             │ │
│ │ Comparable to current "Full Pivot Margin" sheet but live      │ │
│ └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**MUI Components**:
- KPI tiles with `SparklineChart` (MUI X Charts) showing trend
- `WaterfallChart` for margin bridge
- `LineChart` with dual Y-axis (EUR/m² price vs GM%)
- `BarChart` horizontal sorted for customer margin ranking
- `DataGrid` with conditional cell formatting (green/red for margin bands)

---

### TAB 5: FORECAST & PLANS

**Purpose**: Answers "What's our revenue outlook? How reliable is our forecast? What do long-term plans look like?"

```
┌─────────────────────────────────────────────────────────────────┐
│ FORECAST & PLANS                                                 │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ FORECAST COMPOSITION (Stacked bar — THE key visual)          │ │
│ │                                                              │ │
│ │ EUR 6.2M total:                                              │ │
│ │ ████████ Actuals (1.7M, 27%)                                 │ │
│ │ ██████████████ Committed (2.2M, 35%)                         │ │
│ │ █████ Uncommitted (0.8M, 13%)                                │ │
│ │ ████████ Unidentified (1.6M, 25%)                            │ │
│ │                                                              │ │
│ │ Monthly breakdown with stacked FOR Types                     │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ ┌───────────────────────┐ ┌────────────────────────────────────┐│
│ │ Forecast Revision     │ │ Forecast Accuracy (Historical)     ││
│ │ Timeline              │ │ By year: actual vs forecast at     ││
│ │ RFC1 → RFC2 → RFC3 → │ │ same point in year                 ││
│ │ Current               │ │ Shows optimism bias quantified     ││
│ │ Shows EUR 25M drop    │ │ MAPE% and bias direction           ││
│ └───────────────────────┘ └────────────────────────────────────┘│
│                                                                  │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ LONG-TERM REVENUE PLAN (Line + Bar combo)                    │ │
│ │ X-axis: 2022 → 2023 → 2024 → 2025 → 2026F → 2027P → 2028P │ │
│ │ Bars: Actual/Forecast revenue                                │ │
│ │ Line: Volume (m²)                                            │ │
│ │ Secondary line: EUR/m² (showing price erosion in plans)      │ │
│ │ GAP HIGHLIGHTED: EUR 6.2M (2026) → EUR 38.6M (2027)         │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ ┌───────────────────────┐ ┌────────────────────────────────────┐│
│ │ TK Nucera NEOM Tracker│ │ Weighted Pipeline Forecast         ││
│ │ Batch #6-#25 schedule │ │ Open quotes × historical conv rate ││
│ │ Gantt-style: planned  │ │ = Probability-weighted revenue     ││
│ │ vs actual delivery    │ │ by month (NEW — not done today)    ││
│ │ EUR 949K per batch    │ │ Base / Bull / Bear scenarios       ││
│ └───────────────────────┘ └────────────────────────────────────┘│
│                                                                  │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ SCENARIO ANALYSIS (Prescriptive — NEW)                       │ │
│ │ Sliders: Conversion Rate [▬▬▬●▬▬] 18%                       │ │
│ │          TK Nucera Batches [▬▬●▬▬▬] 10 of 20                │ │
│ │          Price Change [▬▬▬●▬▬] 0%                            │ │
│ │ Result:  Base=EUR 8.2M | Bull=EUR 14.1M | Bear=EUR 4.8M     │ │
│ └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**MUI Components**:
- `StackedBarChart` with custom colors for FOR Types
- `LineChart` combo with dual Y-axis for long-term plans
- Custom `GanttChart` component for TK Nucera batch tracking
- `Slider` components (MUI) for scenario analysis inputs
- `Paper` cards showing scenario results with conditional coloring
- `Stepper` for forecast revision timeline

---

### TAB 6: CUSTOMER 360°

**Purpose**: Deep-dive into any single customer — full history, pipeline, forecasts, margin, payment behavior.

```
┌─────────────────────────────────────────────────────────────────┐
│ CUSTOMER 360°                                                    │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ Customer Selector: [Autocomplete ▼ ThyssenKrupp Nucera    ] │ │
│ │ (searches across all customer name variants)                 │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐    │
│ │ Total Rev  │ │ Orders     │ │ Open Quotes│ │ Payment    │    │
│ │ EUR 24.3M  │ │ 23         │ │ 5          │ │ Net 30     │    │
│ │ Lifetime   │ │ Lifetime   │ │ EUR 1.2M   │ │ Terms      │    │
│ └────────────┘ └────────────┘ └────────────┘ └────────────┘    │
│                                                                  │
│ ┌──────────────────────────┐ ┌──────────────────────────────┐   │
│ │ Revenue History          │ │ Product Mix                   │   │
│ │ Monthly revenue line     │ │ Donut chart: UTP220 vs 500   │   │
│ │ chart 2022→present       │ │ by revenue share              │   │
│ └──────────────────────────┘ └──────────────────────────────┘   │
│                                                                  │
│ ┌──────────────────────────┐ ┌──────────────────────────────┐   │
│ │ Quote History            │ │ Order Timeline               │   │
│ │ All quotes with status   │ │ Gantt: order → delivery →    │   │
│ │ DataGrid with conversion │ │ invoice → payment timeline   │   │
│ └──────────────────────────┘ └──────────────────────────────┘   │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ FULL TRANSACTION HISTORY (DataGrid Pro)                      │ │
│ │ All quotes + orders + invoices for this customer             │ │
│ │ Merged from: Quotation + Sales Zirfon + AP1 SAP             │ │
│ │ Timeline view with status indicators                         │ │
│ └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**MUI Components**:
- `Autocomplete` with fuzzy search across all customer name variants
- `Avatar` + `Typography` for customer header card
- `Timeline` (MUI Lab) for order lifecycle visualization
- `DataGrid Pro` with merged data from multiple sources
- `Tabs` within tab for Quote History / Order History / Payment History

---

## B3. Data Model (Unified Backend)

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ DIM_Customer     │     │ DIM_Product      │     │ DIM_Geography   │
│ customer_id (PK) │     │ product_key (PK) │     │ country_key (PK)│
│ customer_group   │     │ zirfon_type      │     │ country_name    │
│ legal_entity     │     │ material_code    │     │ region          │
│ country_key (FK) │     │ material_desc    │     │ sub_region      │
│ segment          │     │ std_cost_m2      │     └─────────────────┘
│ tier             │     │ msp_m2           │
│ ic_flag          │     └──────────────────┘     ┌─────────────────┐
│ payment_terms    │                               │ DIM_Time        │
└────────┬────────┘     ┌──────────────────┐     │ date_key (PK)   │
         │              │ FACT_Revenue     │     │ year            │
         │              │ order_id (PK)    │     │ quarter         │
         └──────FK──────│ customer_id (FK) │     │ month           │
                        │ product_key (FK) │     │ fiscal_period   │
         ┌──────FK──────│ country_key (FK) │     └─────────────────┘
         │              │ date_key (FK)    │
         │              │ source_file      │     ┌─────────────────┐
         │              │ sap_order_num    │     │ FACT_Quotation  │
         │              │ invoice_num      │     │ quote_id (PK)   │
         │              │ quantity_m2      │     │ customer_id (FK)│
         │              │ eur_per_m2       │     │ product_key (FK)│
         │              │ revenue_eur      │     │ sent_date       │
         │              │ std_cost_total   │     │ total_sqm       │
         │              │ gross_margin     │     │ total_eur       │
         │              │ status           │     │ converted_flag  │
         │              │ for_type         │     │ order_date      │
         │              │ period_type      │     │ days_to_convert │
         │              └──────────────────┘     └─────────────────┘
         │
         │              ┌──────────────────┐
         └──────FK──────│ FACT_Forecast    │
                        │ forecast_id (PK) │
                        │ customer_id (FK) │
                        │ product_key (FK) │
                        │ country_key (FK) │
                        │ fiscal_year      │
                        │ rfc_cycle        │
                        │ for_type         │
                        │ month            │
                        │ forecast_m2      │
                        │ forecast_eur     │
                        │ actual_eur       │
                        └──────────────────┘
```

---

## B4. What Makes This Dashboard "Thrilling" — Value-Add Over Current Excel

| Current State (Excel) | Dashboard Improvement | Controller Benefit |
|----------------------|----------------------|-------------------|
| 7 separate files, 120+ sheets | **Single unified interface** | One place for everything — no file switching |
| Manual pivot table refresh | **Auto-refresh on data load** | Saves hours per month |
| No cross-file analysis | **Merged data model** | See quote→order→revenue→payment in one view |
| Static charts | **Interactive drill-down** | Click Region→Country→Customer→Order |
| No alerts | **Automated KPI alerts** | Red/Amber/Green with threshold-based warnings |
| Forecast is a spreadsheet | **Visual forecast composition** | See Actual/Committed/Uncommitted at a glance |
| No scenario analysis | **Interactive what-if sliders** | "What if we get 10 more NEOM batches?" |
| Manual forecast vs actual | **Forecast accuracy tracking** | Quantified bias correction over time |
| No customer 360° | **Single customer deep-dive** | See full lifecycle for any customer in one click |
| Customer names inconsistent | **Fuzzy-matched customer master** | "Sunfire GmbH" + "Sunfire SE" = one customer group |
| No long-term view | **Multi-year plan visualization** | 2022→2029 on one chart with actuals + plans |
| No pipeline weighting | **Probability-weighted pipeline** | Statistical conversion rate applied to open quotes |
| No concentration KPIs | **Risk monitoring dashboard** | Alerts when top-customer dependency exceeds threshold |
| FY 2025 workbook has 25 sheets | **6 clean tabs** | Same information, 75% less complexity |

---

## B5. Implementation Phases

### Phase 1: Data Foundation (Week 1)
- Parse all 7 Excel files into unified Pandas DataFrames
- Build dimension tables (Customer mapping, Product mapping, Geography, Time)
- Create customer fuzzy-matching logic using FY2025 Mapping Customers as base
- Standardize country names, payment terms, product types
- Output: Clean CSV/Parquet files for backend

### Phase 2: Backend API (Week 2)
- FastAPI endpoints for each tab's data needs
- Aggregation logic: Revenue by dimensions, Conversion funnel, Margin calculations
- Filter engine: Apply global filters across all queries
- Forecast composition logic: Split by FOR Type
- Output: RESTful API serving JSON to frontend

### Phase 3: Dashboard Shell + Overview Tab (Week 3)
- React + MUI project setup with TypeScript
- Global filter bar component (shared state via Context)
- Overview tab with KPI tiles, alerts, and summary charts
- Tab navigation structure
- Output: Working Overview tab with real data

### Phase 4: Core Analytics Tabs (Weeks 4-5)
- Tab 2: Pipeline & Conversion (funnel, conversion charts, DataGrid)
- Tab 3: Revenue & Orders (waterfall, treemap, hierarchical DataGrid)
- Tab 4: Margin & Profitability (margin bridge, product margin trends)
- Output: 4 of 6 tabs fully functional

### Phase 5: Advanced Tabs (Week 6)
- Tab 5: Forecast & Plans (scenario sliders, long-term plan chart, TK Nucera tracker)
- Tab 6: Customer 360° (autocomplete search, merged transaction history)
- Output: All 6 tabs live

### Phase 6: Polish & Handoff (Week 7)
- Export functionality (PDF, Excel, CSV)
- Responsive design for different screen sizes
- Performance optimization (lazy loading, data caching)
- User documentation
- Output: Production-ready dashboard

---

## B6. Immediate Deliverable for Today's Call

For the review call today, we can present:
1. **Slide 1**: Our understanding of the data landscape (7 files, how they connect)
2. **Slide 2**: Key findings (FY2026 crisis, customer concentration, margin compression)
3. **Slide 3**: Current analytics maturity assessment (Descriptive ✅, Predictive ⚠️, Prescriptive ❌)
4. **Slide 4**: Data gaps and questions (5 must-answer + 3 good-to-clarify)
5. **Slide 5**: Dashboard mockup (6-tab structure with wireframes)
6. **Slide 6**: Value proposition (Current Excel vs Dashboard comparison table)
7. **Slide 7**: Implementation timeline (7-week phased plan)
