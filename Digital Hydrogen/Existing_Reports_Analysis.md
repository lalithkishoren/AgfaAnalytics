# Existing Analytical Reports — Sheet-by-Sheet Analysis

> **Date**: 2026-03-17
> **Folder**: Data/Sales & Margin analysis/
> **Purpose**: Understand how the controller currently analyzes data, to build on existing practices

---

## FILE 1: FY 2025.xls (6.5 MB — The Controller's Main Workbook)

**25 sheets** — a comprehensive sales & margin reporting workbook built on SAP BI extracts. This is the **controller's primary analytical tool**.

---

### MAPPING / REFERENCE SHEETS (Foundation Layer)

#### Sheet 18: Mapping Customers
- **262 rows, 15 columns**
- Maps order customer names → standardized Ship-To Party → Customer → Customer Name → Destination Country
- **KEY FINDING**: This IS the customer name mapping table we said was needed! It consolidates variants (e.g., "Ariema" and "Ariema Enerxia S.L." both map to "ARIEMA, ENERGÍA Y MEDIO AMBIENTE S.")
- Also contains a separate list of Korean customers (columns 10-12) with Korean characters
- Has a flag column: "Customer already existing in ACT" (Yes/No) — tracks new customer onboarding
- **111 unique order customer names** mapped to **78 standardized customers**

#### Sheet 19: Mapping Company Code
- **3 company codes** — the Agfa legal entities selling Zirfon:
  - **331** = Agfa-Gevaert N.V. (BE) — HQ/Mortsel, Belgium
  - **1125** = Agfa Materials Japan Ltd. — Intercompany Japan
  - **1674** = Agfa DPC South Korea — Intercompany Korea
- This confirms the intercompany structure: Belgium manufactures, Japan & Korea distribute locally

#### Sheet 20: Mapping Type
- **85 rows** — maps SAP material descriptions to standardized Zirfon types
- Maps variants like "ZIRFON UTP220 14X15", "ZIRFON UTP220 5 100C", "ZIRFON UTP221" → **UTP220**
- Standardized types: **UTP500, UTP220, UTP500+, UTP500A, Rebate, Not defined**
- Also maps "FREIGHT QF" → UTP500 (freight is allocated to product)
- Also maps "OMZET CORRECTIE QF" → UTP500+ (revenue corrections)
- Also maps "MISCELLANEOUS INCOME" → Not defined, "REBATE QF" → Rebate

#### Sheet 21: Mapping Months
- **54 rows** — maps "January 2023" → "January", "February 2024" → "February", etc.
- Strips the year from fiscal period to enable month-over-month comparison across years
- Covers 2021–2025

#### Sheet 22: Mapping Standard Costprices (**CRITICAL — UNLOCKS MARGIN**)
- **Standard cost per m²** by product type:
  - **UTP500**: EUR 115.86/m²
  - **UTP220**: EUR 95.47/m²
  - **UTP500+**: EUR 115.86/m² (same as UTP500)
  - **UTP500A**: EUR 115.86/m² (same as UTP500)
- These are the standard manufacturing costs used for margin calculation
- Combined with avg selling prices (UTP500: ~EUR 335/m², UTP220: ~EUR 350/m²), this implies **~60-70% gross margins**

---

### RAW DATA SHEET (Data Layer)

#### Sheet 17: raw data
- **3,167 rows, 30 columns** — the master dataset feeding all pivots
- **Source**: SAP BW/BI extract (CO-PA — Contribution Profitability Analysis)
- Contains **7 data periods**:
  - **ACT** = Actuals FY2025 (current year) — 1,067 rows
  - **ACT 2023** = Actuals FY2023 — 479 rows
  - **ACT 2022** = Actuals FY2022 — 437 rows
  - **ACT LY** = Actuals Last Year (FY2024) — 362 rows
  - **BUD 2024** = Budget FY2024 — 156 rows
  - **BUD 2025** = Budget FY2025 — 156 rows
  - **FOR** = Forecast (current rolling forecast) — 510 rows

**Key measures in raw data**:
| Measure | Description |
|---------|-------------|
| Net Turnover | Revenue in EUR |
| Sales quantity | Quantity in M2 |
| ENP | Effective Net Price (EUR/m²) |
| St.Costpr.Total | Standard Cost Total (uses Mapping Standard Costprices) |
| Gross Margin | = Net Turnover - St.Costpr.Total |

**Key dimensions in raw data**:
| Dimension | Description | Unique Values |
|-----------|-------------|---------------|
| Period | ACT/BUD/FOR/ACT LY/etc. | 7 |
| Company code | 331 (BE), 1125 (JP), 1674 (KR) | 5 |
| Ship-To Party | SAP ship-to customer ID | 383 |
| Customer | SAP sold-to customer ID | 316 |
| Country Destination | Country name | 50 |
| Product Family | SAP product family description | 11 |
| Material / Material Name | SAP material code & description | 84 / 72 |
| Zirfon Type | Standardized product (from Mapping Type) | 6 |
| 3rd P or ICO | Third-party (20) vs Intercompany (10) flag | 5 |
| FOR Type | Forecast category: ACT part / Committed / Uncommitted / Unidentified | 4 |
| Sales Order Number | SAP order reference | 1,066 |

**Revenue by period**:
| Period | Total Net Turnover (EUR) |
|--------|-------------------------|
| ACT (FY2025) | 31,372,530 |
| ACT LY (FY2024) | 30,039,190 |
| ACT 2023 | 23,642,190 |
| ACT 2022 | 4,243,068 |
| BUD 2024 | 34,396,180 |
| BUD 2025 | 36,247,880 |
| FOR (Forecast) | 33,056,240 |

---

### ANALYTICS / PIVOT SHEETS (Presentation Layer)

#### Sheet 2: Summary
- **Executive dashboard** — the main management reporting view
- Shows Monthly, YTD, and Quarterly comparisons of:
  - **ACT** (Actuals) vs **FOR** (Forecast) vs **BUD** (Budget) vs **LY** (Last Year)
- Revenue in kEUR with **CSG% (Comparable Sales Growth)**
- Product breakdown: UTP500, UTP220, UTP500+, UTP500A
- **Top 10 Customers** by ACT and by FOR
- Key numbers visible: YTD ACT = EUR 30.8M, BUD = EUR 33.5M, LY = EUR 29.0M
- **This is what the controller presents to management**

#### Sheet 3: Month TO (Monthly Turnover)
- **Pivot table**: Monthly revenue by customer, filterable
- Columns: ACT, FOR, BUD 2025, ACT LY
- Shows individual month data (current month highlighted)
- 286 rows covering all customer/month combinations

#### Sheet 4: Month Margin
- **Monthly margin pivot** by Zirfon Type
- Shows: Net Turnover, St. Costs, GM (Gross Margin) for each product type
- Compares ACT vs FOR vs BUD 2024 vs ACT LY vs BUD 2025
- February 2025 example: ACT margin 60.3%, with UTP220 at 94.5% and UTP500 at 59.3%

#### Sheet 5: Quarter
- **Quarterly turnover pivot**
- Q1-Q4 comparison across ACT, BUD 2024, ACT LY, BUD 2025, ACT 2023
- Shows customer-level breakdown per quarter
- FY2025 ACT: Q1=5.6M, Q2=7.7M, Q3=7.2M, Q4=10.3M → **strong Q4 loading**

#### Sheet 6: YTD TO (Year-to-Date Turnover)
- **Cumulative YTD pivot** — running total through the year
- ACT vs BUD 2025 vs ACT LY
- Full Year: ACT 30.8M vs BUD 36.2M vs LY 29.7M
- **ACT is 85% of Budget but 104% of Last Year**

#### Sheet 7: Q1 Margin (Margin Bridge)
- **Margin waterfall/bridge analysis** comparing ACT 2023 vs ACT 2024
- Breaks down margin change into: **Volume/Mix** + **Price/Mix** + **Cost Efficiencies**
- UTP220: Margin improved from 56.3% → 62.4% (driven by price/mix +234K and cost efficiency +87K)
- UTP500: Margin improved from 43.1% → 54.1% (driven by price/mix +673K)
- **Total margin improved from 49.4% → 57.9%** — excellent margin expansion

#### Sheet 8: Full Pivot Margin
- **Detailed monthly margin pivot** — the most granular margin view
- Monthly rows × Product type columns
- Shows: Turnover, ENP, QTY, St Cost, GM, GM% for each month-product combination
- Filterable by Company code, Ship to Name, Country, Customer, Material, 3rd P or ICO
- January 2025: GM% = 61.4%, February: 60.3%, March: 67.9%

#### Sheet 9: TO Pivot (Turnover Pivot)
- **Customer × Country × Product revenue pivot**
- Drillable by all dimensions (Material, Company, Country, Customer, Quarter, FOR Type)
- Shows Turnover + Sales Quantity per customer/product combination
- Example: ThyssenKrupp Nucera UTP220 in December = EUR 2.24M

#### Sheet 10: BI Report Mortsel
- **Raw SAP BI extract** for Mortsel (Belgium HQ — Company Code 331)
- "Detailed Sales Inquiry" from SAP CO-PA
- 425 rows — one of the source data imports
- Contains all SAP dimensions: Billing type, Bill-to party, Budget Class, Business Unit, etc.

#### Sheet 11: BI Report Aspac
- **Raw SAP BI extract** for Asia-Pacific entities
- 73 rows — covers Japan (1125) and Korea (1674) entities
- Korean and Japanese customer names in local scripts
- Same structure as BI Report Mortsel

#### Sheet 12: --> BUD (Budget Input)
- **Budget data** — 157 rows
- Monthly budget by Customer × Product for BUD 2024 and BUD 2025
- Same structure as raw data but specifically the budget planning input

#### Sheet 13: BI Report Turnover Analysis
- **Another SAP BI report** — "Turnover Analysis (Current)"
- 61 rows, 35 columns — high-level turnover comparison report

#### Sheet 14: --> LY (Last Year Actuals)
- **Last year actuals import** — 438 rows
- FY2024 detailed actuals from SAP, used for LY comparison columns

#### Sheet 15: --> FOR Uncom (Forecast Uncommitted)
- **22 rows** — uncommitted forecast items
- Customer-level forecast entries that don't have confirmed orders yet
- Example: KLEO Automation (Sept, UTP500 EUR 114K), Elsac Engineering (Apr, UTP500+ EUR 14K)

#### Sheet 16: --> FOR Com (Forecast Committed)
- **85 rows** — committed forecast items
- Customer-level forecast with confirmed/contracted volumes
- Aggregated by Country × Month × Customer × Zirfon Type
- Largest committed items: ThyssenKrupp UTP220 (multiple months, EUR 1-1.2M/month)

#### Sheet 23: Sheet1
- **ACT 2023 quarterly summary** — Q1-Q4 with Turnover, ENP, QTY, St Cost, GM, GM%
- FY2023 Total: Revenue EUR 23.4M, GM 49.1%

#### Sheet 24: Summary Views
- **Single-row grand total** from pivot: Total Net Turnover EUR 158M, St. Cost EUR 65.3M, GM EUR 92.1M, **GM% = 58.3%**
- This is the all-time total across all periods in raw data
- Filtered to 3rd Party only (code 20)

#### Sheet 25: sheet to be used for FOR
- **Empty** — placeholder for future forecast input

---

## FILE 2: ACTFY2025_Forecasting file.xlsx (1.7 MB — FY2025 Forecasting Workbook)

**44 sheets** — the detailed forecasting workbook used for RFC (Rolling Forecast Cycle) submissions for FY2025.

### EXECUTIVE SUMMARY — FY2025 Forecast Outcome

| Metric | Value |
|--------|-------|
| **FY2025 Total Forecast (Final)** | EUR 30.8M |
| **BUD 2025** | EUR 36.2M |
| **FOR vs BUD** | **-15.1%** (missed budget by EUR 5.4M) |
| **ACT LY (FY2024)** | EUR 29.7M |
| **FOR vs LY** | **+3.7%** (modest growth over prior year) |

---

### KEY SHEETS — DEEP DIVE

#### Sheet 1: Forecast Lay-out (1,095 rows × 76 cols)
- **The master forecast input grid** — where the commercial team enters their expectations
- Rows: Country × Company × Zirfon Type (3 types per company = ~365 companies × 3)
- Columns: 12 months × 5 metrics (Volume m² + Price EUR/m² + Cutting cost + Handling cost + Total EUR)
- 207 unique companies across all countries
- **This is the single source of truth for forecast input**

#### Sheet 3: FOR Summary
- **FY2025 Final Forecast = EUR 30.8M** (all Actuals by year-end — no remaining forecast)
- Monthly breakdown shows all 12 months realized
- By product type: UTP500, UTP500+, UTP220, UTP500A

#### Sheet 5: FOR vs BUD & LY
- **Forecast vs Budget vs Last Year comparison** — monthly by product type
- Key insight: **BUD 2025 was EUR 36.2M** — forecast underperformed budget by 15.1%
- **BUT beat prior year** (EUR 29.7M) by 3.7%
- The miss was primarily in H2 — H1 was closer to budget

#### Sheet 6: FOR vs previous FOR (CRITICAL — Forecast Revision History)
- **Shows how forecasts were revised DOWN throughout FY2025**
- Compares September forecast vs July forecast
- Delta: consistently negative across months — forecasts were systematically optimistic
- **Pattern**: Each RFC cycle revised the remaining months downward
- **Implication**: The forecasting process has an optimism bias that should be corrected

#### Sheet 15: Customer sort 2025 (Customer Rankings)
- Top customers by FY2025 revenue:
  1. **Sunfire SE** — EUR 11.9M (largest customer in FY2025)
  2. **ThyssenKrupp Nucera** — EUR 11.8M (NEOM project driving volume)
  3. John Cockerill — distant third
  4. GHS (Green Hydrogen Systems)
  5. McPhy

#### Sheet 31: Committed volumes by Customer
- Customer-level committed order volumes by month
- Key committed customers: ThyssenKrupp, Sunfire, John Cockerill, GHS
- Monthly M2 and Turnover (TO) by product type
- **Used to split forecast into Committed vs Uncommitted**

#### Sheet 37: TK Nucera (NEOM Project Tracking)
- **Dedicated ThyssenKrupp Nucera tracking** — confirms they're the most strategically important customer
- **NEOM project**: Batches #6 through #25 tracked individually
- **~EUR 949K per batch** — massive individual order tranches
- **PO 32017233** — single purchase order covering all NEOM batches
- Delivery schedule spans multiple months with specific batch-level dates
- **This is why TK Nucera requires manual forecast management** — too large and scheduled for standard process

#### Sheet 25: raw data TO FOR (795 rows)
- **The structured forecast data feeding all pivots**
- Dimensions: Period (Committed/Uncommitted) × Country × Customer × Product
- Measures: Monthly Turnover (TO) and M2 volumes
- **FOR Type breakdown**: ACT part (realized) + Committed (open orders) + Uncommitted (recent quotes) + Unidentified (gap-fill)

#### Sheet 23: open orders 2025 (212 rows)
- Sourced from **"File Ann Bals"** (team member who maintains order tracking)
- Current open orders used as "committed" portion of forecast
- Contains order dates, delivery dates, customer, product, quantities

#### Sheet 41: Instructions (Process Documentation — Dutch)
- **How the forecasting file is built — step by step**:
  1. **ACTUAL Sales**: Monthly TO report from SAP detailed sales → ACT pivot → fill blanks
  2. **ORDERS**: From Ann Bals (team member) file → open orders → map months & customers → South Korea & Japan check with Nick
  3. **QUOTES**: Use last 3 months of quotes as pipeline input
  4. **Forecasted TO** = M2 × ENP/M2 (volume × effective net price)
  5. **Manually add ThyssenKrupp Nucera** (grey coloured part) — special handling
  6. **Check overdue orders** — clean up overdue items
- **KEY INSIGHT**: This is a MANUAL process — no automated data pipeline. Controller builds forecast by assembling multiple Excel files.

#### Other Supporting Sheets:
- **FOR input RFC3**: Structured SAP RFC submission — Entity × Destination × Product × Monthly M2/EUR
- **18 months FOR**: 18-month rolling forecast beyond single fiscal year
- **FOR Graphs / graphs**: Monthly ACT/FOR cumulative vs Budget cumulative charts
- **top customers & volumes**: Top 6 customers — EUR, M2, EUR/M2
- **Customer sort 2024 / 2025 / 2026**: Customer revenue rankings by year
- **customer & country list** (198 rows): Another customer mapping — Quoting name → Order name → Country → Standardized Name
- **Quotes last 3 months / Quoting pivot to refresh**: Recent quotes for "uncommitted" pipeline
- **ACT data structured / ACT 2023 / ACT2024 Summary**: Historical actuals from SAP
- **BUD2024 / BUD2025**: Budget data for variance analysis
- **open orders pivot to refresh**: Pivot for committed orders

---

## FILE 3: Sales Forecast February2026.xlsx (1.8 MB — FY2026 Forecasting Workbook)

**49 sheets** (5 more than ACTFY2025) — updated for **FY2026 forecast cycle**. Contains the **most alarming finding** in this entire data set.

### EXECUTIVE SUMMARY — FY2026 FORECAST CRISIS

| Metric | Value | vs Prior |
|--------|-------|----------|
| **FY2026 Total Forecast** | **EUR 6.2M** | — |
| **BUD 2026** | EUR 17.3M | **FOR = 36% of BUD (-64.3%)** |
| **ACT LY (FY2025)** | EUR 30.8M | **FOR = 20% of LY (-79.9%)** |
| **July RFC2 Forecast** | EUR 31.2M | **EUR 25M downward revision** |

#### Forecast Composition (EUR 6.2M total):
| FOR Type | Amount (EUR) | Share | Certainty |
|----------|-------------|-------|-----------|
| **Actuals** (Jan-Feb realized) | 1.7M | 27% | 100% certain |
| **Committed** (open orders) | 2.2M | 35% | High certainty |
| **Uncommitted** (recent quotes) | 0.8M | 13% | Medium certainty |
| **Unidentified** (gap-fill) | 1.6M | 25% | Low certainty |

**CRITICAL**: Only EUR 3.9M (63%) of the forecast is backed by actual revenue or confirmed orders. The remaining EUR 2.4M is uncertain.

---

### KEY SHEETS — DEEP DIVE

#### Sheet 3: FOR Summary
- **FY2026 TOTAL FORECAST = EUR 6.2M** — a devastating number
- Monthly split: Actuals (Jan 0.8M + Feb 0.9M) + Forecast (Mar-Dec)
- Product breakdown shows dramatically reduced volumes across ALL product types
- Even the best months barely reach EUR 0.8M

#### Sheet 5: FOR vs BUD & LY (The Crisis in Numbers)
- **FOR EUR 6.2M vs BUD EUR 17.3M = -64.3%** — will miss budget by nearly two-thirds
- **FOR EUR 6.2M vs LY EUR 30.8M = -79.9%** — revenue collapsing to one-fifth of last year
- **Every single month** in 2026 is below both budget and prior year
- The gap is not seasonal — it's structural

#### Sheet 6: FOR vs previous FOR (The EUR 25M Revision Shock)
- **July RFC2 forecast was EUR 31.2M** — roughly in line with FY2025 actuals
- **September revision dropped to EUR 6.2M** — a EUR 25M downward revision in just 2 months
- **This is the single most important finding for the controller**
- Questions this raises:
  1. What happened between July and September to cause this collapse?
  2. Were major contracts cancelled or delayed (TK Nucera NEOM? Sunfire?)
  3. Is the hydrogen electrolyser market in a downturn?
  4. Is this a timing issue (orders delayed to 2027+) or a demand destruction?

#### Sheet 11: Revenue overview (NEW SHEET — Not in ACTFY2025)
- **This sheet provides critical new information**:

**Q1 2026 Revenue Detail**:
| Month | Revenue (kEUR) |
|-------|---------------|
| January (Actual) | ~800 |
| February (Actual) | ~900 |
| March (Forecast) | ~800 |
| **Q1 Total** | **~2,500** |

**Margin Data** (first time we see current-year margins):
| Metric | UTP220 | UTP500 | Total |
|--------|--------|--------|-------|
| Margin % | 42.8% | 57.1% | **51.4%** |
| MSP (EUR/m²) | 111.07 | 102.10 | — |

**KEY FINDING**: Q1 2026 margin (51.4%) is LOWER than FY2025 margins (~58-68%). This suggests:
- MSP (Manufacturing Standard Price) has changed vs Standard Cost Prices from FY2025 workbook
- UTP220 margin (42.8%) is dramatically lower than the 94.5% seen in some FY2025 months
- Price erosion and/or cost inflation is compressing margins

**LONG-TERM REVENUE PLANS** (first time we see beyond single FY):
| Year | Planned Revenue (EUR) | Planned Volume (m²) | Implied EUR/m² |
|------|----------------------|---------------------|----------------|
| **PLAN 2027** | **38.6M** | 185,000 | 209 |
| **PLAN 2028** | **51.4M** | 261,000 | 197 |
| **PLAN 2029** | **69.9M** | 375,000 | 186 |

**CRITICAL DISCONNECT**: The long-term plan assumes EUR 38.6M in 2027, but the current 2026 forecast is only EUR 6.2M. That's a **6.2x revenue jump** needed in one year. This is either:
- Unrealistic planning (plans not updated after the forecast crash)
- Expectations that delayed orders will materialize in 2027+
- Major new contracts expected to close

**Also note**: Implied EUR/m² is declining year-over-year (209→197→186), suggesting the plans assume volume growth with price erosion — classic market maturation.

#### Sheet 18: Customer sort 2026
- **Dramatically smaller customer volumes than FY2025**
- Top customers have much lower revenue — confirms the broad-based demand decline
- Customer concentration may actually be HIGHER in 2026 with fewer active customers

#### Sheet 26: open orders 2026 (117 rows)
- Sourced from **"File Ann Bals _ status 22012026"** — order file dated January 22, 2026
- 117 open orders vs 212 in FY2025 — **45% fewer open orders**
- These 117 orders form the "Committed" EUR 2.2M in the forecast

#### Sheet 40: BUD2026
- **Empty (0 rows)** — budget detail not loaded into this sheet
- Budget total (EUR 17.3M) exists in FOR vs BUD sheet but not at line level here
- May indicate budget was set before the forecast crash and hasn't been re-baselined

#### Sheet 13: March FOR (124 rows)
- Separate March forecast detail — 124 line items
- Granular customer × product × country breakdown for March only

### Key Differences from ACTFY2025 File:
| Feature | ACTFY2025 | February 2026 |
|---------|-----------|---------------|
| Sheets | 44 | 49 (+5 new) |
| RFC Cycle | RFC3 (mature/final) | RFC1 (early cycle) |
| Revenue Overview | Not present | **NEW — with margins and long-term plans** |
| March FOR | Not present | **NEW — separate March detail** |
| Forecast total | EUR 30.8M | EUR 6.2M (-80%) |
| Budget | EUR 36.2M | EUR 17.3M (-52%) |
| Open orders | 212 | 117 (-45%) |

---

## KEY FINDINGS FROM EXISTING REPORTS

### 1. Controller's Current Analytical Framework

The controller already has a mature reporting structure:

```
SAP BI/CO-PA Extract
    ↓
Raw Data (3,167 rows with 7 periods)
    ↓ (Mapping tables: Customer, Type, Month, Company Code, Cost Prices)
    ↓
┌────────────────────┬───────────────────┬──────────────────┐
│  Revenue Analytics  │  Margin Analytics  │  Forecasting     │
│  - Monthly TO       │  - Monthly Margin  │  - FOR Summary   │
│  - Quarterly TO     │  - Full Pivot GM   │  - FOR vs BUD    │
│  - YTD TO           │  - Q1 Margin Bridge│  - FOR vs LY     │
│  - Customer pivots  │                    │  - FOR vs prev   │
│  - Summary dashboard│                    │  - 18-month roll │
└────────────────────┴───────────────────┴──────────────────┘
```

### 2. Standard Cost Prices are Available! (was Gap G1)
- UTP500: EUR 115.86/m², UTP220: EUR 95.47/m², UTP500+: EUR 115.86/m²
- **Gross margins are ~58-68%** depending on product and period
- Margin expanded from 49% (2023) to ~60% (2025) — driven by price increases and cost efficiencies

### 3. Forecast Process is Well-Defined
The forecasting methodology (from Instructions sheet):
1. **Actuals** (realized months) — from SAP BI
2. **Committed orders** (open orders in SAP) — "certain" revenue
3. **Uncommitted pipeline** (quotes from last 3 months) — "probable" revenue
4. **ThyssenKrupp manually managed** — too large/complex for standard process
5. **Forecast = Actuals + Committed + Uncommitted**
6. **FOR Type** dimension tracks certainty: ACT part / Committed / Uncommitted / Unidentified

### 4. Budget Available
- BUD 2024: EUR 34.4M
- BUD 2025: EUR 36.2M
- BUD 2026: Available in February2026 file
- **This answers Question Q6 from our blueprint — budget IS available**

### 5. Intercompany Structure Confirmed
- **3rd P or ICO** flag distinguishes:
  - Code **20** = Third-party (external) sales
  - Code **10** = Intercompany (Japan/Korea)
  - Code **0** = Not assigned / other
- **This answers Question Q3 — intercompany IS flagged**

### 6. The Controller's Pain Points (Inferred)
- **Manual Excel work**: 25+ sheets, multiple pivot tables, manual refreshes
- **Multiple files**: FY 2025 workbook + Forecasting workbook + Sales Zirfon + Quotation — all maintained separately
- **Mapping maintenance**: Customer mapping, product mapping, month mapping all done manually
- **SAP extract dependency**: BI Reports are pasted in as raw data — no live connection
- **ThyssenKrupp special handling**: Largest customer requires manual forecast management
- **Korean text handling**: Korean customer names need translation/mapping
- **Forecast revision tracking**: Done by comparing file versions (July vs September forecast)

### 7. Data We Didn't Have Before
From these reports, we now have:
| Previously Missing | Now Available | Source |
|-------------------|---------------|--------|
| Standard cost prices | EUR 115.86/m² (UTP500), EUR 95.47/m² (UTP220) | Mapping Standard Costprices |
| Budget data | BUD 2024 (34.4M), BUD 2025 (36.2M), BUD 2026 | --> BUD sheets |
| Customer mapping | 111 → 78 standardized names | Mapping Customers |
| Product mapping | 85 SAP descriptions → 6 types | Mapping Type |
| Intercompany flag | 3rd P or ICO (10/20) | raw data |
| Gross margin by month/product | ~58-68% range | Full Pivot Margin |
| Forecast certainty categories | Committed / Uncommitted / Unidentified | FOR Type in raw data |
| Historical actuals 2022-2025 | Full yearly data | raw data periods |
| Margin bridge (Vol/Price/Cost) | Q1 2023 vs 2024 analysis | Q1 margin sheet |

---

## UPDATED DATA GAP STATUS

| Original Gap | Status | Resolution |
|-------------|--------|------------|
| G1: No cost/COGS data | **RESOLVED** | Standard cost prices in Mapping sheet |
| G2: No unified Customer ID | **PARTIALLY RESOLVED** | Mapping Customers provides standardization for ~111 names |
| G3: No Quotation ID in SAP | **STILL OPEN** | Not addressed in these reports |
| G4: Amount paid only 23% | **STILL OPEN** | Not in these reports — SAP FI/AR needed |
| G5: No FX rates | **RESOLVED** | SAP BI data is already in EUR (converted in SAP) |
| G6: No budget/target data | **RESOLVED** | BUD 2024, BUD 2025, BUD 2026 all available |
| G7: Customer segmentation | **PARTIALLY RESOLVED** | 3rd P or ICO flag exists; further segmentation still needed |
| G12: Intercompany not flagged | **RESOLVED** | 3rd P or ICO = 10 for intercompany |

---

## FORECASTING DEEP-DIVE — KEY DISCOVERIES

### Discovery 1: FY2026 Forecast Crisis (EUR 6.2M vs EUR 31.2M prior forecast)
- The September 2025 forecast revision wiped EUR 25M from the FY2026 outlook
- Current forecast (EUR 6.2M) is only 36% of budget (EUR 17.3M) and 20% of FY2025 actuals (EUR 30.8M)
- Only EUR 3.9M (63%) is backed by actuals + confirmed orders
- **Root cause investigation needed**: What happened between July and September?

### Discovery 2: Long-Term Plans Exist (PLAN 2027-2029)
- Found in Revenue overview sheet of February 2026 file
- PLAN 2027=EUR 38.6M, PLAN 2028=EUR 51.4M, PLAN 2029=EUR 69.9M
- **Massive disconnect** with FY2026 forecast of EUR 6.2M — implies 6.2x growth needed in one year
- Plans assume declining EUR/m² (209→197→186) — price erosion with volume growth

### Discovery 3: Margin Data for FY2026
- Q1 2026 total margin: 51.4% (lower than FY2025's 58-68% range)
- UTP220 margin: 42.8% (dramatic drop from some FY2025 months at 94.5%)
- UTP500 margin: 57.1% (more stable)
- MSP (Manufacturing Standard Price): UTP220=EUR 111.07/m², UTP500=EUR 102.10/m²
- **Different from FY2025 Standard Cost Prices** (UTP220=95.47, UTP500=115.86) — costs have changed

### Discovery 4: TK Nucera NEOM Project Details
- Batches #6-#25 (~20 batches remaining), each ~EUR 949K
- Total remaining NEOM value: ~EUR 19M (if all batches delivered)
- Single PO: 32017233
- Manually managed in forecast due to size and complexity
- **This is likely the key variable in whether the forecast crash is permanent or temporary**

### Discovery 5: Forecast Process Has Optimism Bias
- FY2025: Forecasts were revised DOWN throughout the year (September < July < earlier)
- FY2025 final (EUR 30.8M) missed BUD (EUR 36.2M) by 15.1%
- FY2026: July forecast (EUR 31.2M) collapsed to September (EUR 6.2M)
- **Pattern**: Initial forecasts are consistently too optimistic → need to build in a bias correction

### Discovery 6: Forecasting is Entirely Manual
- Process documented in Dutch (Instructions sheet)
- Assembles data from: SAP BI + Ann Bals order file + last 3 months quotes + manual TK Nucera
- No automated data pipeline — all Excel-based copy/paste
- **High risk of human error and version control issues**
