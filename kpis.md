# KPI Register — All Dashboards
> Existing KPIs (what is live today) vs Proposed KPIs (what we are adding / what is missing)
> Sources: dashboard `types/index.ts`, `DataOverviewTab.tsx`, `dpsData.ts`, and all `data_analysis_findings.md` files

---

## 1. Digital Radiology (DR)

### 1.1 Existing KPIs — Live in Current Power BI Reports

#### Order Intake (OIT)
| KPI | Formula | Source | Confidence |
|-----|---------|--------|-----------|
| OIT YTD 2026 | `SUM(actualvalue_base) WHERE Won AND Year=2026` | msd data.csv | ✅ Verified |
| Won Deals Count | `COUNT(opportunityid) WHERE Won AND Year=2026` | msd data.csv | ✅ Verified |
| Avg Deal Size | OIT YTD / Won Deals Count | Derived | 🔵 Derived |
| OIT vs Budget | `(OIT YTD / Budget YTD) – 1` | msd data + Budget Quarter.csv | ⚠ Estimated |
| OIT FY 2025 / FY 2024 | Historical actuals | msd data.csv | ✅ Verified |

#### Pipeline & Funnel
| KPI | Formula | Source | Confidence |
|-----|---------|--------|-----------|
| Open Pipeline Total | `SUM(estimatedvalue_base) WHERE Open` | opportunity.csv | ✅ Verified |
| Open Pipeline Count | `COUNT(opportunityid) WHERE Open` | opportunity.csv | ✅ Verified |
| Pipeline Coverage | Open Pipeline / (OIT YTD × 4) | Derived | 🔵 Derived |
| RT CY (Running Total Current Year) | Cumulative weekly OIT actuals | T funnel health.csv | ✅ Verified |
| RT BT (Running Total Budget) | Cumulative weekly OIT budget | T funnel health.csv | ✅ Verified |
| RT PY (Running Total Prior Year) | Cumulative weekly OIT prior year | T funnel health.csv | ✅ Verified |
| Weighted Amount | `SUM(agfa_weightedamountexcludingsma_base)` | DataWeek.csv / opportunity.csv | ✅ Verified |
| Forecast Flag Snapshot | Won / Incl & Secured / Included / Incl w Risk / Upside / Excluded | DataWeek.csv | ✅ Verified |
| Funnel Evolution (weekly) | Funnel by flag per week × region | T funnel evolution tracker.csv | ✅ Verified |

#### Deal Scoring
| KPI | Formula | Source | Confidence |
|-----|---------|--------|-----------|
| DS% (Deal Sign) | `agfa_dsdealsigncodename` | msd data / opportunity.csv | ✅ Verified |
| DH% (Deal Happen) | `agfa_dhdealhappencodename` | msd data / opportunity.csv | ✅ Verified |
| Feasibility % | `agfa_feasibilitycode` (0–90 integer scale) | opportunity.csv | ✅ Verified |

#### Margin
| KPI | Formula | Source | Confidence |
|-----|---------|--------|-----------|
| CRM Margin % (total) | `agfa_margincostpercentagetotal` — KAM-entered at deal creation | msd data.csv | ⚠ Estimated |
| HW Margin % | `agfa_margincostpercentagehardware` | msd data.csv | ⚠ Estimated |
| Implementation Margin % | `agfa_margincostpercentageimplementation` | msd data.csv | ⚠ Estimated |
| License Margin % | `agfa_margincostpercentageinternallicenses` | msd data.csv | ⚠ Estimated |
| Service Margin % | `agfa_margincostpercentageservicecontracts` | msd data.csv | ⚠ Estimated |
| SAP Actual Margin (Goods) | `(Net Turnover EUR – Calculated Cost APX) / Net Turnover EUR` | FeedFile.csv (Report 2) | ✅ Verified (goods only) |
| Standard Margin (Sofon) | `(Net Turnover – Sofon Cost+) / Net Turnover` | Q price realisation (DirectQuery) | 🔴 Proxy — not connected |

#### Revenue / Actuals (Partner Dashboard & Price Reports)
| KPI | Formula | Source | Confidence |
|-----|---------|--------|-----------|
| Partner Revenue vs Target | Dealer actual EUR vs budget by quarter | FeedFile + DealerList_TargetSetting | ✅ Verified |
| Revenue by Year & Type | SAP actuals by Goods / Implementation / Support | FeedFile.csv | ✅ Verified |
| Price Realization Waterfall | List Price → Discount → Net TO → Sofon Cost+ → Gross Margin | Q price realisation (Report 3) | ✅ Verified |
| ENP (Effective Net Price) | Per-unit pricing from AP2 | BP2 query | ✅ Verified |
| SAP Order Count (Won) | `COUNT(opportunityid) WHERE agfa_saporderid IS NOT NULL AND Won` | msd data.csv | 🔵 Derived |
| Planned Reco Count | `COUNT WHERE agfa_plannedrevenuerecognitiondate IS NOT NULL AND Open` | msd data.csv | ⚠ Estimated |

---

### 1.2 Proposed / New KPIs — Not Yet Built

#### Revenue Recognition (CRITICAL GAP 1 — data already exists)
| KPI | Formula | Data Available | Priority |
|-----|---------|---------------|---------|
| Planned Reco by Month | `SUM(estimatedvalue) GROUP BY agfa_plannedrevenuerecognitiondate month` | msd data table (Report 4) — field exists, NOT surfaced | 🔴 P1 |
| Reco Walk (Won → Impl → Invoiced) | Stage progress tracking from Won date to SAP invoice date | agfa_saporderid + SAP posting date | 🔴 P1 |
| Overdue Reco | Won deals where planned Reco date < today AND no SAP posting | msd data + FeedFile | 🔴 P1 |
| Implementation Lag | agfa_plannedrevenuerecognitiondate – estimatedclosedate (days) | msd data — derived | 🔵 P2 |

#### Order Book / Backlog (CRITICAL GAP 2 — requires new data source)
| KPI | Formula | Data Available | Priority |
|-----|---------|---------------|---------|
| Order Book Value | `SUM(Won order value) WHERE not yet invoiced in SAP` | Requires EDW — agfa_saporderid → SAP order status | 🔴 P7 |
| Order Book by Equipment Type | Same, split by product line | EDW required | 🔴 P7 |
| Order Book by Region | Same, split by region | EDW required | 🔴 P7 |

#### Book & Bill (CRITICAL GAP 3)
| KPI | Formula | Data Available | Priority |
|-----|---------|---------------|---------|
| B&B Volume | Deals where OIT and Reco occur in same period | agfa_requesteddeliverydate vs estimatedclosedate — derived | 🔴 P3 |
| B&B % of Total OIT | B&B deals / Total OIT deals | Derived | 🔵 P3 |

#### Win/Loss Analysis (GAP 5)
| KPI | Formula | Data Available | Priority |
|-----|---------|---------------|---------|
| Win Rate % (Overall) | Won / (Won + Lost) | statecodename in opportunity.csv | 🟡 P3 |
| Win Rate by Region | Same, split by region | opportunity.csv | 🟡 P3 |
| Win Rate by Equipment | Same, split by equipment type | opportunity.csv | 🟡 P3 |
| Win Rate by Deal Size Band | Same, split by value bands | opportunity.csv | 🟡 P3 |
| Avg Time to Close (Won vs Lost) | actualclosedate – createdon (days) | opportunity.csv | 🟡 P3 |
| Loss Volume by Quarter | COUNT(Lost) by quarter | opportunity.csv | 🟡 P3 |

#### 2× Upside Rule (GAP — playbook-defined, not monitored)
| KPI | Formula | Data Available | Priority |
|-----|---------|---------------|---------|
| Upside / Included with Risk Ratio | Upside EUR ÷ Included with Risk EUR per region | DataWeek.csv | ✅ Ready — P2 |
| 2× Rule Alert | Flag if ratio < 2 per region | Derived from above | ✅ Ready — P2 |

#### Large & Strategic Deal Tracking (GAP 6)
| KPI | Formula | Data Available | Priority |
|-----|---------|---------------|---------|
| Large Deals List (>500 kEUR) | Opportunities above threshold by stage/flag | opportunity.csv | ✅ Ready — P5 |
| Stage Change Alert | Flag deals where forecast category degraded week-on-week | Weekly snapshots in Report 1 | 🔵 Medium effort — P5 |

#### Services P&L (CRITICAL GAP — not in any report)
| KPI | Formula | Data Available | Priority |
|-----|---------|---------------|---------|
| Services Revenue | Net Turnover TYPE=Support | FeedFile.csv | ✅ Partial |
| Services Margin % | `(Services Revenue – Services Cost) / Services Revenue` | FeedFile only at aggregate level | ⚠ Estimated — P6 |

#### NWC (Net Working Capital — CRITICAL GAP)
| KPI | Formula | Data Available | Priority |
|-----|---------|---------------|---------|
| Net Working Capital | Receivables – Payables | Not in any current report — requires SAP FI extract | 🔴 EDW required |
| DSO (Days Sales Outstanding) | AR balance / Daily Revenue | SAP FI data needed | 🔴 EDW required |

---

## 2. Digital Hydrogen (DH)

### 2.1 Existing KPIs — Live in Dashboard

#### Revenue & Orders
| KPI | Formula | Source | Confidence |
|-----|---------|--------|-----------|
| YTD Revenue | `SUM(amount) WHERE currency=EUR, status=2, year=2026` | orders.json | ✅ Verified |
| Full Year Forecast | Actuals + Committed + Uncommitted + Unidentified (FY2026) | kpis.json → forecast files | ✅ Verified |
| vs Budget % | `(Forecast – Budget) / Budget × 100` | BUD 2026 = €17.3M from forecasting file | ✅ Verified |
| vs Prior Year % | `(Forecast – LY) / LY × 100` | ACT LY from FY 2025.xls | ✅ Verified |
| Revenue by Product | EUR split by UTP500 / UTP220 / UTP500+ | orders.json | ✅ Verified |
| Customer Concentration | Top 5 / Top 10 as % of total EUR revenue | orders.json | ✅ Verified |
| Open Orders Count | `COUNT WHERE status=1` | orders.json | ✅ Verified |
| Open Orders Value | `SUM(amount) WHERE status=1` | orders.json | ✅ Verified |
| Average Order Value | Total EUR / Count of completed orders | orders.json | ✅ Verified |
| Revenue by Year | Annual EUR totals (2023–2026) | orders.json | ✅ Verified |

#### Pipeline & Conversion
| KPI | Formula | Source | Confidence |
|-----|---------|--------|-----------|
| Quote Conversion Rate | Orders (isOrdered=true) / Total Quotations | quotations.json | ✅ Verified |
| Pipeline Value | `SUM(totalAmount) WHERE isOrdered=false` | quotations.json | ✅ Verified |
| Pipeline Count | `COUNT WHERE isOrdered=false` | quotations.json | ✅ Verified |
| Conversion Rate by Year | Conversion per quotation year (2023: 8.8%, 2024: 24.1%, 2025: 24.8%) | quotations.json | ✅ Verified |
| Conversion Rate by Product | UTP220: 22.9%, UTP500+: 16.5%, UTP500: 16.2% | quotations.json | ✅ Verified |
| Avg Quote Size | Total amount / Quote count | quotations.json | ✅ Verified |
| Ordered vs Non-Ordered Avg Size | Ordered avg €20,856 vs Non-ordered avg €197,046 | quotations.json | ✅ Verified |

#### Margin & Profitability
| KPI | Formula | Source | Confidence |
|-----|---------|--------|-----------|
| Gross Margin % | `(Net Turnover – Standard Cost Total) / Net Turnover × 100` | revenue_summary.json / margin_data.json | ✅ Verified |
| Gross Margin (Absolute) | Net Turnover – Standard Cost Total (EUR) | margin_data.json | ✅ Verified |
| Standard Cost per m² | UTP500: €115.86/m², UTP220: €95.47/m², UTP500+: €115.86/m² | FY 2025.xls — Mapping Standard Costprices | ✅ Verified |
| MSP 2026 | UTP220: €111.07/m², UTP500: €102.10/m² | Revenue Overview in Feb2026 file | ✅ Verified |
| Average Selling Price (EUR/m²) | EUR Revenue / Total m² sold, by product and year | orders.json | ✅ Verified |
| Margin by Product | GM% per UTP type | margin_data.json | ✅ Verified |

#### Forecast & Plans
| KPI | Formula | Source | Confidence |
|-----|---------|--------|-----------|
| Forecast Composition | Actuals (27%) + Committed (35%) + Uncommitted (13%) + Unidentified (25%) | forecast.json | ⚠ Estimated |
| Budget Gap | FY2026 Forecast – Budget = −€11.1M (−64.3%) | forecast files | ✅ Verified |
| Forecast Revision History | BUD: €17.3M → RFC2: €31.2M → Current: €6.2M | forecast_revisions.json | ✅ Verified |
| Long-Term Plans | 2027: €38.6M, 2028: €51.4M, 2029: €69.9M | long_term_plans.json | ⚠ Estimated |
| Scenario Analysis | Base / Bear (×0.7) / Bull (×1.2) | Calculated from sliders | ⚠ Estimated |
| TK Nucera NEOM Batches | PO 32017233 — Batches #6–#25, ~€949K each | ACTFY2025 TK Nucera sheet | ✅ Verified |

#### Customer 360°
| KPI | Formula | Source | Confidence |
|-----|---------|--------|-----------|
| Lifetime Revenue per Customer | `SUM(amount) WHERE customer=X AND status=2` | orders.json | ✅ Verified |
| Quotation Conversion per Customer | Converted quotes / Total quotes per customer | quotations.json | ✅ Verified |
| Product Mix per Customer | Revenue by product type for selected customer | orders.json | ✅ Verified |

---

### 2.2 Proposed / New KPIs — From Data Analysis Findings

#### Operational (data available, not built)
| KPI | Formula | Data Available | Gap Ref |
|-----|---------|---------------|---------|
| Quote-to-Cash Cycle Time | Order Date – Sent Date (days) | quotations.json | G3 — no Quotation ID in SAP |
| On-Time Delivery Rate | Delivered on/before Deliv. date | SAP Orders — Deliv. date vs Doc. Date | G13 |
| Order Fulfillment Rate | ConfirmQty / Order qty | AP1 SAP extract | ✅ Ready to build |
| Avg Lead Time | Deliv. date – Doc. Date | AP1 SAP extract | ✅ Ready to build |
| Pricing Variance | Actual EUR/m² vs Standard pricing | quotations.json + standard costs | ✅ Ready to build |

#### Customer Analytics (data gaps)
| KPI | Formula | Data Available | Gap Ref |
|-----|---------|---------------|---------|
| DSO (Days Sales Outstanding) | AR balance / Daily Revenue — based on payment terms | Only 23.4% of amountPaid populated | G4 — HIGH |
| New vs Repeat Customers | First order date analysis | orders.json — derivable | ✅ Ready to build |
| Customer Lifetime Value | Cumulative revenue per SAP Customer ID | orders.json | ✅ Ready to build |
| Revenue by Channel | Intercompany (AGFA Japan/Korea) vs Direct 3rd party | orders.json + thirdPartyOrIco flag | ✅ Ready to build |
| Customer Segment Revenue | OEM vs End-User vs Research vs Intercompany | 3rd P or ICO flag exists; further segmentation needed | G7 — MEDIUM |

#### Win/Loss Intelligence (gaps)
| KPI | Formula | Data Available | Gap Ref |
|-----|---------|---------------|---------|
| Quote Loss Reasons | Why 82% of quotes don't convert | Not captured — no lost reason field | G9 — MEDIUM |
| Sales Rep Performance | Revenue attributed per sales rep | Not captured — no sales rep field | G8 — MEDIUM |
| Forecast Accuracy | Forecast vs Actual for closed periods | forecast_revisions.json — partially structured | G14 — MEDIUM |

---

## 3. DPS

### 3.1 Existing KPIs — Live in Dashboard

#### Revenue & Margin (FY2025 Actuals)
| KPI | Formula | Source | Confidence |
|-----|---------|--------|-----------|
| Net Revenue (3rd Party) | Sum of Net Sales to third-party customers | AMSP Contribution | ✅ Verified |
| AMSP Margin % | AMSP Contribution / Net Sales 3rdP × 100 | AMSP Contribution | ✅ Verified |
| CO-PA Gross Margin % | Gross Margin / Net TO × 100 | CO-PA GMPCOPA_1 | ✅ Verified |
| EBIT | Adjusted EBIT + Non-recurring items | RECO Analysis | ✅ Verified |
| Budget Variance % | (Actual – Budget) / Budget × 100 | RECO vs BP1 budget | 🔵 Derived |
| Monthly Net Sales Trend | EUR net sales per month (Jan–Dec 2025) | AMSP Contribution | ✅ Verified |
| AMSP Margin by Budget Class/BU | Margin % per product line (Anapurna, INCA, Jeti, etc.) | AMSP Contribution | ✅ Verified |
| RECO Full P&L | Revenue → Manufacturing Contribution → Gross Margin → SG&A → Adjusted EBIT → EBIT → Overall Result | RECO Analysis (KRECO20) | ✅ Verified |
| IC Elimination | Intercompany flows (€270.6M to exclude from external revenue) | RECO Analysis | ✅ Verified |
| External Revenue | Total Revenue minus IC elimination | RECO — derived | 🔵 Derived |

#### Order Intake & Pipeline (Units Only)
| KPI | Formula | Source | Confidence |
|-----|---------|--------|-----------|
| OIT Units | Count of order intake records by period | Order follow-up (manual Excel) | ✅ Verified |
| RR Units | Count of invoiced/recognized orders by period | Order follow-up | ✅ Verified |
| Backlog Units | OIT cumulative – RR cumulative | Order follow-up — derived | 🔵 Derived |
| Delayed Orders | Count of orders with revised RR > original RR | Delayed tracker tab | ✅ Verified |
| Pending RR (2026 YTD) | 46 units in backlog (end Feb 2026) | Order follow-up | ✅ Verified |
| Cancellations | Count of cancelled orders | Order follow-up | ✅ Verified |

#### Equipment Family Breakdown
| KPI | Formula | Source | Confidence |
|-----|---------|--------|-----------|
| OIT by Family | Units per product family (Anapurna, Jeti, Oberon, Onset, Speedset, etc.) | Order follow-up (VLOOKUP → Family col) | ✅ Verified |
| RR by Family | Invoiced units per family | Order follow-up | ✅ Verified |
| OIT vs RR Gap | Units placed vs units invoiced per period | Order follow-up — derived | 🔵 Derived |

---

### 3.2 Proposed / New KPIs — Gaps Identified

#### EUR-Value Metrics (CRITICAL — currently units only for hardware)
| KPI | Gap Reason | Data Needed | Priority |
|-----|-----------|------------|---------|
| OIT EUR Value | Order intake file tracks units only, no EUR value per order | EUR value not in order follow-up file — needs SAP link | 🔴 Critical |
| Pipeline EUR Value | Forward pipeline has no EUR dimension | CRM or SAP extract needed | 🔴 Critical |
| RR EUR per Period | Revenue recognised per month in EUR | Cross-file join: Order follow-up → AMSP/RECO | 🔴 Critical |
| HW vs Consumable Split (EUR) | Financial Application dimension not in current extracts | BW query field needed | 🔴 Critical |

#### Deal-Level Margin (CRITICAL — entity/BU mismatch)
| KPI | Gap Reason | Data Needed | Priority |
|-----|-----------|------------|---------|
| Deal-Level Gross Margin | No CRM connection for DPS; margin only at BU aggregate level | CRM or order-level SAP data | 🔴 Critical |
| No AMSP Rate Coverage | €64M net sales (33.6%) has no AMSP rate — margin unknown | AMSP rate assignment in SAP | 🔴 Critical |

#### Order-to-Cash & Cycle Time
| KPI | Formula | Data Needed | Priority |
|-----|---------|------------|---------|
| Order-to-Invoice Cycle Time | Invoice Month – Order Month (from order follow-up formula cols) | Order follow-up (derivable from AJ–AK cols) | ✅ Ready to build |
| OIT-to-RR Lag by Family | Months between OIT and RR per equipment family | Order follow-up — derived | ✅ Ready to build |
| Delayed Order Impact (EUR) | Delayed units × estimated ASP (no EUR per unit available) | Requires EUR dimension | 🟡 Medium |

#### Regional Breakdown (EUR)
| KPI | Gap Reason | Data Needed | Priority |
|-----|-----------|------------|---------|
| Revenue by Region (EUR) | RECO and AMSP files are BU-level only — no region dimension in those files | BW query with Region dimension | 🔴 High |
| OIT by Region (EUR) | Order follow-up has Sales Org/Order Destination but not standard region codes | Region mapping needed | 🟡 Medium |

---

## 4. HE IT

### 4.1 Existing KPIs — Live in Dashboard

#### Order Intake (OI) — 9 Key Figures
| KPI | Definition | Source | Unit |
|-----|-----------|--------|------|
| MONTH ACT | Monthly OI actual — new orders booked in the month | oi_monthly.json (Key Figure = "MONTH ACT") | kEUR |
| MONTH BUD | Monthly OI budget — annual plan phased monthly | oi_monthly.json (Key Figure = "MONTH BUD") | kEUR |
| MONTH LY | Monthly OI prior year — same calendar month, prior year | oi_monthly.json (Key Figure = "MONTH LY") | kEUR |
| MONTH FOR | Monthly OI latest forecast — actuals YTD + forecast balance | oi_monthly.json (Key Figure = "MONTH FOR") | kEUR |
| YTD ACT | Year-to-date cumulative OI actuals from Jan to reporting month | oi_ytd.json (Key Figure = "YTD ACT") | kEUR |
| YTD BUD | Year-to-date OI budget cumulated to same period | oi_ytd.json (Key Figure = "YTD BUD") | kEUR |
| YTD LY | Year-to-date OI prior year cumulated to same period | oi_ytd.json (Key Figure = "YTD LY") | kEUR |
| FY (A+F) | Full-year Actual + Forecast (YTD actuals + remaining forecast) | oi_monthly.json (Key Figure = "FY (A+F)") | kEUR |
| FY BUD | Full-year OI budget (static annual plan) | oi_monthly.json (Key Figure = "FY BUD") | kEUR |

#### Order Book (OB) — 8 Bucket KPIs
| Bucket | Definition | Risk Level |
|--------|-----------|-----------|
| Planned Current Year | Orders in backlog planned for recognition in current FY | Low — committed |
| Planned Next Years | Backlog planned beyond current FY (multi-year) | Medium |
| Rev Overdue ≤ 6 months | Revenue planned in past period, not yet recognised — overdue ≤6m | High |
| Rev Overdue > 6 months | Revenue overdue >6 months — significant delivery/contract risk | Critical — escalation |
| Not Planned Sales Order | Sales orders received but not yet scheduled for reco | Medium |
| Not Planned Opportunity ≤ 3 months | Near-term unplanned opportunity-stage orders | Variable |
| Not Planned Opportunity 4–6 months | Mid-range unplanned opportunities | Variable |
| Not Planned Opportunity 7–24 months | Longer-horizon unplanned opportunities | Variable |

#### TACO (P&L) — 8 Key Lines from 85-line P&L
| Line | Label | Definition | Source |
|------|-------|-----------|--------|
| 02 | Net Sales Hardware / Equipment | Revenue from hardware equipment sales (net of returns/discounts) | taco_key_lines.json |
| 07 | Net Sales Own Licenses | Revenue from proprietary software licenses | taco_key_lines.json |
| 09 | Net Sales subs. Own IP | Subscription revenue for own IP software | taco_key_lines.json |
| 11 | Net Sales 3rd Party Licenses | Revenue from reselling third-party software licenses | taco_key_lines.json |
| 26 | Net Sales Total | Total revenue across all categories (sum lines 02–25) | taco_key_lines.json |
| 55 | TACO Margin | Gross profit after direct costs. TACO Margin % = Line 55 / Line 26 | taco_key_lines.json |
| 63 | Product Contribution | TACO Margin minus product-specific overheads | taco_key_lines.json |
| 85 | TACO Contribution | Operating result after all allocated expenses (EBIT equivalent) — **key bottom line** | taco_key_lines.json |

#### TACO Computed Variants — 14 KPIs total
| Variant | Description |
|---------|-------------|
| ACT | Actuals (EUR) |
| BUD | Budget (EUR) |
| ACT LY | Prior year actuals (EUR) |
| ACT vs BUD % | (ACT – BUD) / BUD × 100 |
| ACT vs LY % | (ACT – ACT LY) / ACT LY × 100 |
| ACT vs BUD (absolute) | ACT – BUD |
| ACT vs LY (absolute) | ACT – ACT LY |
| + 4 Local Currency (LC) variants of each above | Same metrics in local currency (using selectable FX rate) |

#### OI Business Type Breakdown
| Business Type | Description |
|--------------|-------------|
| Net New | New customer or entirely new product line |
| Cross-sell | Additional product to existing customer |
| Upsell | Upgraded version of existing product |
| Renewal | Contract renewal (same product, same customer) |
| Upgrade and Updates | Standard upgrades / maintenance contract renewals |

---

### 4.2 Proposed / New KPIs — Gaps Identified

#### Revenue Lifecycle Funnel (CRITICAL — no shared key across 3 datasets)
| KPI | Description | Blocker | Priority |
|-----|-------------|---------|---------|
| OI → OB → TACO Funnel | OI booked → OB backlog → TACO recognised — end-to-end conversion | OI, OB, TACO come from 3 separate Access DBs with no shared key | 🔴 EDW required |
| OI-to-OB Conversion Rate | % of OI that flows into confirmed Order Book | No project/opportunity ID linking OI to OB | 🔴 EDW required |
| OB-to-TACO Recognition Rate | % of Order Book released into TACO net sales in period | No shared key between OB and TACO | 🔴 EDW required |
| Revenue Coverage % | `TACO Net Sales / OI Budget` as % | TACO 2026 budget not yet available | ⚠ Partial — data pending |

#### OI Enhancements
| KPI | Description | Data Available | Priority |
|-----|-------------|--------------|---------|
| MONTH FOR in P&L Report charts | FOR column already in data (13 snapshots) — not surfaced in UI | oi_monthly.json — ✅ ready | 🟡 Low effort |
| OI by Business Type at OB level | Business Type dimension exists in OI but absent from OB | OB files have no Business Type field | 🔴 EDW required |
| Customer-level OI | OI aggregates have no customer dimension (only at raw cache level) | Raw OI cache has customer — not extracted | 🔴 Structural gap |

#### OB Enhancements
| KPI | Description | Data Available | Priority |
|-----|-------------|--------------|---------|
| OB Age Analysis | How long orders sit in each bucket before recognition | ob_grid.json has pl_year+pl_qtr vs rep_year+rep_month | ✅ Ready to build |
| Project Risk Level | Risk flag per project-level order | Not in any current source file | 🔴 Not available |
| Project Comments / Notes | Qualitative commentary per project line | Not in any current source file | 🔴 Not available |
| Rev Overdue Alert | Auto-flag projects where overdue bucket value crosses threshold | ob_grid.json — derivable | ✅ Ready to build |

#### TACO Enhancements
| KPI | Description | Data Available | Priority |
|-----|-------------|--------------|---------|
| TACO FOR (Forecast) | Forecast column in TACO P&L | Available in OI but NOT in TACO source — Access DB gap | 🔴 Source gap |
| TACO Quarterly Phasing | Quarterly breakdown of P&L (currently monthly only) | Monthly data — derivable by summing | ✅ Ready to build |
| TACO by Company Code | Entity-level P&L attribution (80+ Comp c values available) | taco_monthly.json — partial | 🟡 Medium effort |
| Services P&L Line Detail | Breakdown of Implementation Services revenue/cost | fa_line dimension in TACO — partial | 🟡 Medium effort |

---

## 5. Cross-Dashboard KPI Summary

| KPI Category | DR | DH | DPS | HE IT |
|-------------|----|----|-----|-------|
| OIT / Order Intake | ✅ EUR (CRM) | ✅ EUR (ledger) | ✅ Units only — ❌ No EUR | ✅ kEUR |
| Revenue Actuals | ✅ SAP FeedFile | ✅ SAP orders | ✅ EUR (AMSP/CO-PA) | ✅ TACO kEUR |
| Gross Margin | ⚠ CRM estimate only | ✅ Standard cost | ✅ AMSP + CO-PA | ✅ TACO Margin line 55 |
| Order Book / Backlog | ❌ CRITICAL GAP | ⚠ Open orders only | ⚠ Units only | ✅ 8 OB buckets |
| Revenue Recognition | ❌ CRITICAL GAP | ⚠ Status=2 invoiced | ⚠ RR units only | ✅ TACO Net Sales |
| Pipeline / Funnel | ✅ Full CRM funnel | ✅ Quotation pipeline | ⚠ Units, no EUR | ⚠ OI FOR available |
| Win/Loss Analysis | ❌ GAP | ❌ No lost reason field | ❌ N/A | ❌ N/A |
| Forecast vs Actual | ✅ RT CY/BT/PY weekly | ✅ Revision history | ✅ Budget variance | ✅ ACT vs BUD/LY |
| Customer Dimension | ✅ KAM scorecard | ✅ Customer 360° | ❌ No customer link | ⚠ OB top customers only |
| Regional Breakdown | ✅ 3 region groups | ✅ By country | ❌ No EUR by region | ✅ Full region filter |
| Book & Bill | ❌ CRITICAL GAP | ⚠ Partial (status flag) | ⚠ Implicit in OIT vs RR | ✅ OB buckets |

---

## 6. Priority Matrix — Proposed KPIs

| Priority | Dashboard | KPI | Effort | Data Ready? |
|---------|-----------|-----|--------|------------|
| 🔴 P1 | DR | Revenue Recognition (planned Reco by month) | Low | ✅ Already in model |
| 🔴 P1 | DR | Overdue Reco alert | Low | ✅ Already in model |
| 🔴 P1 | DPS | OIT EUR Value | High | ❌ Needs SAP link |
| 🔴 P1 | DPS | Pipeline EUR Value | High | ❌ Needs CRM/SAP |
| ✅ P2 | DR | 2× Upside Rule KPI + alert | Very Low | ✅ Ready now |
| 🟡 P2 | HE IT | MONTH FOR in P&L Report | Very Low | ✅ Ready now |
| 🟡 P2 | HE IT | OB Age / Rev Overdue alerts | Low | ✅ Ready now |
| 🟡 P3 | DR | Win/Loss Analysis page | Low | ✅ Already in model |
| 🟡 P3 | DR | Book & Bill tracking | Medium | ⚠ Partially derivable |
| 🟡 P3 | DH | On-Time Delivery Rate | Low | ✅ Ready now |
| 🟡 P3 | DH | Revenue by Channel (IC vs Direct) | Low | ✅ Ready now |
| 🟡 P4 | DH | New vs Repeat Customers | Low | ✅ Ready now |
| 🟡 P5 | DR | Large Deal Tracker (>500 kEUR) | Medium | ✅ Ready now |
| 🔴 P6 | DR | Reference data automation | High | ⚠ Pipeline change |
| 🔴 P7 | DR | Order Book (Won not invoiced) | High | ❌ Needs EDW |
| 🔴 P7 | HE IT | OI → OB → TACO revenue funnel | High | ❌ Needs EDW |
| 🔴 P7 | HE IT | TACO FOR (forecast column) | Medium | ❌ Source DB gap |
| 🔴 P7 | DR | NWC / DSO | High | ❌ Needs SAP FI |
