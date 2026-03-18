# Digital Hydrogen — Finance Controller Analytics Blueprint

> **Date**: 2026-03-17
> **Persona**: Finance Controller — Agfa Digital Hydrogen (Zirfon)
> **Source**: Analysis of 4 data files (Customer Master, Quotation, Sales Zirfon GHS, AP1 SAP Extract)

---

## PART 1: DATA GAPS & RISKS

### 1.1 Critical Data Gaps (Blocking Analytics)

| # | Gap | Impact | Affected Analytics | Recommendation |
|---|-----|--------|--------------------|----------------|
| G1 | **No cost/COGS data anywhere** | Cannot compute margin | Margin analysis, profitability by customer/product/country | Need SAP cost data or standard cost per m² by product type |
| G2 | **No unified Customer ID across files** | Cannot reliably join Quotation ↔ Sales ↔ Customer Master | End-to-end Quote-to-Cash tracking, customer-level P&L | Add SAP Customer ID to Quotation & Sales Zirfon files, or build a customer name mapping table |
| G3 | **No Quotation ID in SAP Orders** | Cannot trace which quote became which SAP order | Win/loss analysis with order-level detail, quote accuracy analysis | Capture quotation reference in SAP sales order |
| G4 | **Amount paid only 23% populated** | Cannot compute actual DSO, aging, or cash collection rates | AR aging, cash conversion cycle, bad debt risk | Complete payment tracking or integrate with SAP AR module |
| G5 | **No FX rates available** | JPY & KRW revenue cannot be converted to EUR for consolidated view | Consolidated revenue reporting, total company P&L | Need historical EUR/JPY and EUR/KRW monthly rates, or use SAP document currency conversion |
| G6 | **No budget/target data** | Cannot measure actual vs plan performance | Budget variance analysis, forecast accuracy | Need annual/monthly revenue budget by product, country, or customer |

### 1.2 Significant Data Gaps (Limiting Analytics)

| # | Gap | Impact | Affected Analytics |
|---|-----|--------|--------------------|
| G7 | **Customer segmentation missing** | Cannot distinguish OEM vs End-User vs Research vs Intercompany | Revenue quality analysis, channel strategy |
| G8 | **Sales rep / account owner not captured** | Cannot attribute revenue to sales team | Sales performance, pipeline ownership |
| G9 | **Lost reason for unconverted quotes** | 82% of quotes don't convert — no insight into why | Win/loss root cause, competitive analysis |
| G10 | **Invoice-level detail missing in Sales Zirfon** | Invoice amounts exist but no line-level breakout | Revenue recognition timing, invoice disputes |
| G11 | **Credit limit data absent** | Cannot assess customer credit risk exposure | Credit risk management, AR provisioning |
| G12 | **Intercompany transfer pricing not flagged** | Agfa Japan/Korea orders mixed with external — distorts revenue | True external revenue, intercompany elimination |
| G13 | **No delivery actuals vs requested** | Req. Delivery date exists but actual ship date not consistently tracked | On-time delivery KPI, customer satisfaction |
| G14 | **Forecast vs Actual not structured** | Forecast info sheet is a free-form grid, not joinable to actuals | Forecast accuracy measurement |

### 1.3 Data Quality Issues (Causing Errors)

| # | Issue | File(s) | Records Affected | Fix Effort |
|---|-------|---------|-------------------|------------|
| Q1 | Customer name variants (Sunfire GmbH / SE / Switzerland, ThyssenKrupp / Thyssenkrupp Nucera, McPhy / McPhy Energy France) | All | ~50-80 customer groups | Medium — build mapping table |
| Q2 | Country naming inconsistent ("the Netherlands" / "Nederland" / "NL" / "the Nederlands") | All | ~30 countries | Low — standardize to ISO |
| Q3 | Payment terms: 41+ free-text variants for ~6 actual categories | Sales Zirfon, Customer Master | ~760 rows | Low — create lookup table |
| Q4 | Product type typos (" UTP500", "utp220", "UTP 500") | Sales Zirfon, Quotation | ~10 rows | Low — trim & uppercase |
| Q5 | Shipping method variants ("courier" / "courrier" / "pick-up" / "pick up") | Sales Zirfon | ~270 rows | Low — standardize |
| Q6 | Invalid currency codes ("40O", "40S") | Sales Zirfon | 2 rows | Low — correct manually |
| Q7 | Status field contains text legends mixed with numeric codes | Sales Zirfon | ~20 rows | Low — separate metadata from data |
| Q8 | SAP Customer ID stored as float (precision loss) | Customer Master | 296 rows | Low — convert to text |
| Q9 | Column mislabeling ("Customer" = SAP ID, "Cust. nr." = Name) | Customer Master | All | Low — rename |
| Q10 | Duplicate customer rows | Customer Master | 6 rows | Low — deduplicate |

---

## PART 2: ANALYTICS FRAMEWORK FOR FINANCE CONTROLLER

### 2.1 Analytics Modules — Prioritized

```
┌─────────────────────────────────────────────────────────┐
│  MODULE 1: REVENUE ANALYTICS (Ready Now)                │
│  Data: Sales Zirfon GHS + Customer Master               │
├─────────────────────────────────────────────────────────┤
│  MODULE 2: PIPELINE & CONVERSION (Ready Now)            │
│  Data: Quotation + Sales Zirfon GHS                     │
├─────────────────────────────────────────────────────────┤
│  MODULE 3: ORDER MANAGEMENT (Ready Now)                 │
│  Data: AP1 SAP Extract + Sales Zirfon GHS               │
├─────────────────────────────────────────────────────────┤
│  MODULE 4: FORECASTING (Partially Ready)                │
│  Data: Forecast info sheet + historical actuals          │
├─────────────────────────────────────────────────────────┤
│  MODULE 5: MARGIN & PROFITABILITY (Blocked — need COGS) │
│  Data: Sales Zirfon + Cost data (NOT AVAILABLE)          │
├─────────────────────────────────────────────────────────┤
│  MODULE 6: CASH & AR (Partially Blocked — need payments) │
│  Data: Sales Zirfon (Amount paid only 23% populated)     │
└─────────────────────────────────────────────────────────┘
```

---

### 2.2 MODULE 1: Revenue Analytics (CAN BUILD NOW)

#### KPIs

| KPI | Definition | Dimension Cuts | Controller Value |
|-----|-----------|----------------|------------------|
| **Total Revenue (EUR)** | Sum of Amount where Currency=EUR, Status=2 | By Year, Quarter, Month | Top-line performance tracking |
| **Revenue Growth Rate** | (Current Period - Prior Period) / Prior Period | YoY, QoQ, MoM | Trend identification |
| **Revenue by Product** | Revenue split by Type perl (UTP500/220/500+) | By Year, Customer | Product mix strategy |
| **Revenue by Geography** | Revenue by Country, rolled up to Region | By Year, Product | Geographic diversification tracking |
| **Revenue by Customer** | Revenue per customer, ranked | By Year, Product | Concentration risk monitoring |
| **Customer Concentration Index** | Top 5 / Top 10 / Top 20 share of total revenue | By Year | Risk indicator — target: reduce below 50% for top 5 |
| **Geographic Concentration Index** | Top 3 countries share of total revenue | By Year | Risk indicator — Germany dependency |
| **Average Order Value (AOV)** | Revenue / Number of Orders | By Product, Customer, Country | Order size trends |
| **Revenue per sqm** | Revenue / Total sqm sold | By Product, Year | Pricing power indicator |
| **Intercompany vs External Revenue** | Split revenue by channel (Agfa Japan/Korea vs direct) | By Year | True third-party revenue visibility |
| **New vs Repeat Customer Revenue** | Revenue from first-time vs returning customers | By Year | Customer acquisition vs retention |

#### Analyses

| Analysis | Description | Deliverable |
|----------|-------------|-------------|
| **Revenue Waterfall** | YoY bridge: existing customer growth + new customers + lost customers + price effect + volume effect | Waterfall chart |
| **Customer Pareto (80/20)** | Which customers drive 80% of revenue? How many? | Pareto chart + table |
| **Geographic Heat Map** | Revenue by country, colored by growth rate | Map visualization |
| **Product Mix Trend** | UTP500 vs UTP220 vs UTP500+ share over time | Stacked area chart |
| **Quarterly Revenue Seasonality** | Is there a seasonal pattern? Q4 loading? | Line chart by quarter |
| **Customer Cohort Analysis** | Revenue from 2023 cohort customers in subsequent years — are they growing? | Cohort matrix |

---

### 2.3 MODULE 2: Pipeline & Conversion Analytics (CAN BUILD NOW)

#### KPIs

| KPI | Definition | Dimension Cuts | Controller Value |
|-----|-----------|----------------|------------------|
| **Quote Volume** | Count of quotations issued | By Year, Quarter, Month, Country, Product | Activity level indicator |
| **Pipeline Value** | Sum of Total amount for open (non-ordered) quotes | By Product, Country | Forward-looking revenue indicator |
| **Quote Conversion Rate** | Quotes with Order=yes / Total Quotes | By Year, Product, Country, Customer | Sales effectiveness |
| **Avg Quote Size** | Total quoted amount / Quote count | By Product, Country | Deal size trends |
| **Quote-to-Order Cycle Time** | Order Date - Sent Date (in days) | By Product, Country | Sales cycle length |
| **Non-Standard Pricing %** | Quotes with Standard pricing=No / Total | By Year, Product | Pricing discipline |
| **Volume Discount Request Rate** | Quotes with Volume request=yes / Total | By Year | Pricing pressure indicator |
| **Large Deal Conversion** | Conversion rate for quotes > EUR 100K vs < EUR 100K | By Year | Big deal win rate |

#### Analyses

| Analysis | Description | Deliverable |
|----------|-------------|-------------|
| **Conversion Funnel** | Quotes → Approved → Ordered → Delivered → Invoiced → Paid | Funnel visualization |
| **Pipeline Aging** | How old are open quotes? Bucket into 0-30, 30-90, 90-180, 180+ days | Aging table |
| **Win/Loss by Product** | Which products convert best? | Bar chart comparison |
| **Win/Loss by Country** | Which geographies convert best? | Ranked table |
| **Quote Velocity Trend** | Is quoting activity increasing or decreasing? | Trend line |
| **Expected Revenue from Pipeline** | Open pipeline × historical conversion rate × avg deal size | Single number forecast |
| **Price Realization** | Quoted price/m² vs actual invoiced price/m² | Variance analysis |

---

### 2.4 MODULE 3: Order Management Analytics (CAN BUILD NOW)

#### KPIs

| KPI | Definition | Dimension Cuts | Controller Value |
|-----|-----------|----------------|------------------|
| **Open Order Backlog** | Status=1 orders, sum of Amount | By Product, Customer | Revenue visibility |
| **Order Fulfillment Rate** | Confirmed Qty / Ordered Qty | By Product, Shipping Point | Operational efficiency |
| **Avg Lead Time** | Delivery Date - Document Date (in days) | By Product, Customer | Planning input |
| **On-Time Delivery %** | Orders delivered on/before Req. Delivery Date | By Product, Customer | Customer satisfaction proxy |
| **Order Type Distribution** | ZETA / ZATA / ZACC / ZBVZ / ZARE split | By Period | Channel mix monitoring |
| **Credit/Debit Note Rate** | CN-DN rows / Total orders | By Year, Customer | Quality/dispute indicator |

#### Analyses

| Analysis | Description | Deliverable |
|----------|-------------|-------------|
| **Backlog Aging** | Open orders by age bucket and expected delivery month | Table + chart |
| **Monthly Order Intake vs Revenue** | New orders received vs invoiced revenue per month | Dual-axis chart |
| **Delivery Performance Dashboard** | OTD %, lead time trends, fulfillment rates | Scorecard |
| **Order Pattern Analysis** | Repeat ordering frequency by customer | Customer ordering cadence |

---

### 2.5 MODULE 4: Forecasting Analytics (PARTIALLY READY)

#### KPIs

| KPI | Definition | Dimension Cuts | Controller Value |
|-----|-----------|----------------|------------------|
| **Forecast Accuracy** | 1 - ABS(Actual - Forecast) / Forecast | By Month, Customer | Forecast reliability |
| **Revenue Run Rate** | Last 3 months annualized | By Product | Quick full-year estimate |
| **Weighted Pipeline** | Open quotes × conversion probability | By Product, Country | Probability-adjusted forecast |
| **Committed Revenue** | Backlog (Status=1) + Confirmed orders | By Month | Near-term certainty |
| **Expected Revenue** | Committed + Weighted Pipeline | By Quarter | Controller's best estimate |

#### Analyses

| Analysis | Description | Deliverable |
|----------|-------------|-------------|
| **Rolling 12-Month Forecast** | Based on backlog + pipeline + run rate | Forecast model |
| **Forecast vs Actual Variance** | Compare Forecast info sheet predictions to actual revenue | Variance table |
| **Customer-Level Forecast** | Expected revenue by top 20 customers | Table with confidence levels |
| **Scenario Analysis** | Base / Bull / Bear cases based on conversion rate assumptions | Three scenarios |
| **Revenue Bridge: Actual → Forecast** | Secured orders + probable pipeline + upside | Waterfall |

---

### 2.6 MODULE 5: Margin & Profitability (BLOCKED — NEED DATA)

**Cannot build without cost data.** Once available:

| KPI | Definition | Data Needed |
|-----|-----------|-------------|
| Gross Margin % | (Revenue - COGS) / Revenue | Standard cost per m² by product |
| Gross Margin by Product | Margin % by UTP500 / UTP220 / UTP500+ | Product-level cost |
| Gross Margin by Customer | Margin % per customer (incl. special pricing impact) | Cost + freight allocation |
| Contribution Margin | Revenue - Variable Costs | Variable cost breakout |
| Margin Erosion Analysis | Are margins declining due to volume discounts? | Historical cost trends |
| Customer Profitability | Revenue - COGS - Freight - Credit cost per customer | Full cost allocation |

---

### 2.7 MODULE 6: Cash & AR Analytics (PARTIALLY BLOCKED)

**Limited by 23% Amount Paid coverage.** What's possible now vs later:

| KPI | Current Status | Data Needed to Complete |
|-----|---------------|------------------------|
| Days Sales Outstanding (DSO) | Can estimate from Payment Terms | Need actual payment dates |
| AR Aging | Can simulate from Invoice Date + Payment Terms | Need actual outstanding balances |
| Cash Conversion Cycle | Partially possible | Need payment actuals |
| Payment Compliance | Limited (23% paid data) | Full payment tracking |
| Bad Debt Risk | Can flag based on "Slechte voorafbetalers" notes | Credit limit + actual overdue data |
| Advance Payment Coverage | Can identify which orders have advance terms | % of revenue secured by advance payment |

---

## PART 3: RECOMMENDED HIERARCHIES & DIMENSIONS

### 3.1 Dimension Tables to Build

| Dimension | Source | Levels | Purpose |
|-----------|--------|--------|---------|
| **DIM_Customer** | Customer Master + fuzzy matching from all files | Customer Group → Legal Entity → Ship-to | Single customer truth |
| **DIM_Geography** | Country standardization across all files | Region → Sub-Region → Country | Geographic roll-up |
| **DIM_Product** | Type perl standardization | Product Family → Product Type → Product Variant (dimensions) | Product hierarchy |
| **DIM_Time** | Date fields across all files | Year → Quarter → Month → Week | Time intelligence |
| **DIM_Channel** | To be created based on customer type | Direct / Intercompany / Distributor / Research | Revenue channel analysis |
| **DIM_Payment** | Payment term standardization | Payment Group (Advance / Net 30 / Net 60+) | Cash flow planning |
| **DIM_OrderStatus** | Status field cleanup | Open → Confirmed → Produced → Shipped → Invoiced → Paid | Process tracking |

### 3.2 Customer Master Enrichment Needed

| Field | Purpose | Suggested Categories |
|-------|---------|---------------------|
| **Customer Group** | Consolidate legal entities (Sunfire GmbH + SE + Switzerland = "Sunfire") | ~200 groups from 370 names |
| **Customer Segment** | Business type classification | OEM / System Integrator / End-User / Research & Academic / Intercompany |
| **Customer Tier** | Revenue-based tier | Tier 1 (>EUR 5M) / Tier 2 (EUR 1-5M) / Tier 3 (EUR 100K-1M) / Tier 4 (<EUR 100K) |
| **Region** | Geographic grouping | Europe / APAC / Americas / Middle East & Africa |
| **Sub-Region** | More granular geography | DACH / Nordics / Southern Europe / Benelux / East Asia / South Asia / ANZ / North America / etc. |
| **Strategic Account Flag** | Is this a named strategic account? | Yes / No |
| **Intercompany Flag** | Is this an Agfa subsidiary? | Yes (Japan, Korea) / No |

### 3.3 Proposed Region Mapping

| Region | Countries | Revenue Share (est.) |
|--------|-----------|---------------------|
| **Europe - DACH** | Germany, Austria, Switzerland | ~65% |
| **Europe - Benelux** | Belgium, Netherlands, Luxembourg | ~7% |
| **Europe - Southern** | Italy, Spain, France, Portugal, Greece | ~10% |
| **Europe - Nordics** | Denmark, Finland, Sweden, Norway | ~6% |
| **Europe - Other** | Poland, UK, Ireland, Czech, etc. | ~2% |
| **APAC - East Asia** | China, Japan, Korea, Taiwan | ~5% (in EUR; higher incl. JPY/KRW) |
| **APAC - South Asia** | India | ~9% |
| **APAC - ANZ** | Australia, New Zealand | ~1% |
| **Americas** | USA, Canada, Brazil, etc. | ~1% |
| **MEA** | South Africa, Israel, Turkey, etc. | <1% |

---

## PART 4: QUESTIONS FOR THE BUSINESS / CONTROLLER

### Data & Systems Questions

| # | Question | Why It Matters |
|---|----------|---------------|
| Q1 | **Is there cost/COGS data available per product (standard cost per m²)?** Where does it live — SAP, a separate file? | Unlocks margin analysis (Module 5) — the #1 gap |
| Q2 | **Are Sunfire GmbH, Sunfire SE, and Sunfire Switzerland the same customer group or separate entities?** Same question for ThyssenKrupp / Thyssenkrupp Nucera, and McPhy / McPhy Energy (France) | Accurate customer concentration analysis — could change top customer from Sunfire (EUR 28M combined) to ThyssenKrupp (EUR 24M) |
| Q3 | **Are Agfa Materials Japan and Agfa Materials Korea intercompany entities?** Should their revenue be separated or eliminated in reporting? | Affects "true external revenue" calculation |
| Q4 | **Is there a revenue budget/target for FY2025 and FY2026?** Monthly or quarterly breakdown? | Enables actual vs budget variance analysis |
| Q5 | **What FX rates should we use for JPY and KRW conversion?** Fixed budget rates or monthly actuals? | Consolidated EUR revenue reporting |
| Q6 | **Is payment data tracked elsewhere (SAP FI/AR module)?** The Sales Zirfon file only has 23% of payments recorded | Cash flow analytics, DSO calculation |
| Q7 | **What does the "Status" legend in Sales Zirfon mean exactly?** We inferred 1=Open, 2=Complete — is that correct? Are there other statuses? | Accurate backlog and open order reporting |
| Q8 | **What are order types ZETA, ZATA, ZACC, ZBVZ, ZARE?** We inferred meanings — need confirmation | Order channel classification |

### Business Context Questions

| # | Question | Why It Matters |
|---|----------|---------------|
| Q9 | **What is the typical production lead time for Zirfon membranes?** | Order-to-delivery KPI benchmarking |
| Q10 | **Is there a capacity constraint?** What is max production volume in sqm/year? | Forecasting ceiling, capacity utilization KPI |
| Q11 | **Are there framework/blanket agreements with large customers (ThyssenKrupp, Sunfire)?** If so, what are the committed volumes? | Separating committed vs at-risk revenue in forecasts |
| Q12 | **What drives the massive 2023→2024 revenue jump (EUR 11.5M → 33.4M)?** Was it one-time (ThyssenKrupp NEOM project) or structural growth? | Forecasting assumptions — is 2024 the new baseline or an anomaly? |
| Q13 | **Why is the 2025 growth only 7.1% after 191% in 2024?** Market saturation, capacity constraint, or pipeline timing? | 2026 forecast calibration |
| Q14 | **What is the competitive landscape?** Who are the alternatives to Zirfon? Is there pricing pressure? | Pricing power assumptions for forecasting |
| Q15 | **Are there known large deals in the pipeline for 2026-2027?** (Beyond what's in the Forecast info sheet) | Revenue visibility and forecast completeness |
| Q16 | **What is the controller's current reporting cadence?** Monthly? Quarterly? What reports exist today? | Design analytics outputs to fit existing workflow |
| Q17 | **Why do 82% of quotations NOT convert?** Is it competitive loss, project cancellation, customer not proceeding, pricing rejection? | Conversion improvement strategy, forecast accuracy |
| Q18 | **Are CN (Credit Notes) related to quality issues, pricing adjustments, or returns?** | Revenue quality and customer satisfaction insight |

### Reporting Preferences

| # | Question | Options |
|---|----------|---------|
| Q19 | **Preferred reporting tool?** | Excel dashboard / Power BI / Python notebook / Web app? |
| Q20 | **Currency reporting preference?** | EUR only? Multi-currency with EUR equivalent? |
| Q21 | **Fiscal year = Calendar year?** | Jan-Dec? Or different fiscal year? |
| Q22 | **What level of detail does the controller need?** | Executive summary KPIs? Drill-down to customer/order level? Both? |

---

## PART 5: RECOMMENDED NEXT STEPS (Prioritized)

### Phase 1: Foundation (Data Cleansing & Dimensions)
1. Build **Customer Name Mapping Table** — consolidate 370+ names into ~200 groups
2. Standardize **Country Names** across all files → ISO mapping
3. Standardize **Payment Terms** into 6 groups
4. Standardize **Product Types** (trim, uppercase, correct typos)
5. Create **Region Mapping** (Country → Region → Sub-Region)
6. Flag **Intercompany** customers (Agfa Japan, Agfa Korea)

### Phase 2: Core Analytics (Modules 1-3)
7. Build **Revenue Dashboard** — by year, product, customer, country, region
8. Build **Pipeline & Conversion Dashboard** — conversion funnel, win rates, pipeline value
9. Build **Order Management View** — backlog, delivery performance, order intake trend

### Phase 3: Forecasting (Module 4)
10. Structure **Forecast Info** data into joinable format
11. Build **Rolling Forecast Model** — backlog + pipeline × conversion rate
12. Compare **Forecast vs Actual** for months where both exist

### Phase 4: Advanced (Modules 5-6, pending data)
13. Integrate **cost data** when available → Margin analytics
14. Integrate **payment data** from SAP AR → Cash analytics
15. Build **Customer Profitability** model

---

## APPENDIX: Data Source → KPI Mapping

| KPI Category | Customer Master | Quotation | Sales Zirfon | AP1 SAP | Additional Data Needed |
|-------------|:-:|:-:|:-:|:-:|---|
| Revenue by Year/Product/Country | | | **PRIMARY** | secondary | FX rates for consolidation |
| Customer Concentration | reference | | **PRIMARY** | | Customer name mapping |
| Quote Conversion Rate | | **PRIMARY** | validation | | |
| Pipeline Value | | **PRIMARY** | | | |
| Order Backlog | | | **PRIMARY** | **PRIMARY** | |
| Gross Margin | | | revenue side | | **COGS / standard cost** |
| DSO / AR Aging | payment terms | | partial | | **SAP AR data** |
| Forecast Accuracy | | | actuals | | **Budget / forecast** |
| On-Time Delivery | | | partial | **PRIMARY** | |
| Customer Lifetime Value | | | **PRIMARY** | | Customer name mapping |
