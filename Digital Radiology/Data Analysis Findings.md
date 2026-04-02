# AGFA Digital Radiology — Data Analysis Findings
**Prepared:** 2026-03-26
**Scope:** Digital Radiology analytics — all data files, Power BI reports, CRM extract specs, and SAP BW query definitions

---

## 1. Executive Summary

This document consolidates findings from the full review of AGFA Digital Radiology's data assets:
6 Power BI reports, 2 SAP BW query specs, 1 D365 CRM extract specification, 1 master region mapping table, and 1 sales process playbook.

**Key finding in one sentence:** The reporting stack is strong on funnel forecasting and weekly sales tracking but has critical blind spots on Revenue Recognition, Order Book pipeline, margin by deal, Book & Bill, and NWC — exactly the metrics that matter at month-end and MPRs.

---

## 2. Data Sources Inventory

### 2.1 Source Systems

| System | Role | Connected To |
|--------|------|-------------|
| **Dynamics 365 (D365/MSD)** | CRM — opportunities, quotes, accounts | Reports 1, 4, 5; BW via opportunity ID |
| **SAP AP5** | Transaction system — DR sales actuals | Report 3 (via BW query BP5) |
| **SAP AP2** | Transaction system — alternate sales/cost data | Reports 2, 3 (via BW query BP2) |
| **SAP AP7** | Transaction system — primary actuals feed | Report 2 (Partner Dashboard) |
| **Sofon** | CPQ quoting tool | CRM-linked via agfa_quoteid / agfa_sofonproductfamilyid |
| **BW (SAP Business Warehouse)** | Pre-aggregated extraction layer | Report 3 (BP5 + BP2 queries) |

### 2.2 Spec / Configuration Files (Not Data Files)

| File | What It Defines |
|------|----------------|
| `BW data in prize realisation.xlsx` | SAP BW query field specs — 2 queries (BP5/AP5, BP2/AP2) |
| `CRM data in Radiology reporting.xlsx` | D365 extract field list (4 tables) + master region mapping (271 rows) |

### 2.3 Power BI Reports

| # | Report | Folder | Focus | Data Grain |
|---|--------|--------|-------|-----------|
| 1 | Commercial Analytics - Weekly FC Tracker | Dashboards2 | Funnel forecast by week | Opportunity × Snapshot Week |
| 2 | Partner Dashboard | Dashboards2 | Partner/dealer revenue & margin | SAP transaction line |
| 3 | Price Margin Modalities | Dashboards2 | Price realization waterfall | SAP transaction line (BW) |
| 4 | OIT Margin & Product Mix 2026 | Dashboards1 | CRM opportunities + budget | Opportunity × product |
| 5 | Funnel Evolution Tracker | Dashboards3 | Quarterly funnel build/slippage | Opportunity × Snapshot Week |
| 6 | OI & Funnel Health Cockpit | Dashboards3 | OIT actuals vs BT/FC/PY | Country × Week (pre-aggregated) |

---

## 3. Data Architecture — How Everything Connects

```
D365 (CRM)
├── opportunity (48 fields)         ──► Reports 1, 4, 5  (forecast, funnel, margin)
├── opportunityproduct (11 fields)  ──► Report 4         (product mix, line margin)
├── cr57c_crm_account (5 fields)    ──► Report 4         (account → SAP ID bridge)
└── product (100+ fields)           ──► Report 4         (product classification)
        │
        │ agfa_saporderid (when Won)
        ▼
SAP (AP5 / AP2 / AP7)
├── AP5 → BW Query BP5              ──► Report 3         (price realization, CRM-linked)
├── AP2 → BW Query BP2              ──► Reports 2, 3     (revenue, ENP, partner data)
└── AP7 → FeedFile                  ──► Report 2         (partner dashboard, 1M+ rows)
        │
        │ Pre-aggregated at ETL
        ▼
Report 6 (OI & Funnel Health)       ──► T funnel health  (running totals, predictions)

GEOGRAPHY LAYER (master)
└── region mapping (271 rows)       ──► ALL 6 reports    (single source of truth)
```

**Critical bridge:** `agfa_saporderid` on the D365 opportunity is the CRM-to-SAP link — it is populated when a deal is Won and released in SAP. Without it, CRM pipeline and SAP actuals are disconnected.

---

## 4. Business Process Coverage Assessment

### 4.1 Sales Stage → Report Mapping

| Playbook Stage | CRM Fields | Report Coverage |
|----------------|-----------|-----------------|
| Identifying | Feasibility ≠ 0/10, BANT qualification | Report 1, 4, 5 |
| Qualifying | DS%, DH%, close date estimate | Report 1, 4 |
| Quoting | agfa_quotetypename, agfa_quotestatusname, Sofon ID | Report 4 (partial) |
| Negotiating | Updated DS%/DH%, margin % fields | Report 4 |
| Closing | Won flag, agfa_saporderid, FC category = Won | Reports 1, 4, 6 |
| Post Mortem (Win/Loss) | statecodename = Lost | **Not tracked in any report** |

### 4.2 Forecast Category Implementation

The playbook defines 5 forecast categories. All 6 reports implement them consistently:

| Category | Reports 1, 5 Label | Report 4 Label | Playbook Rule |
|----------|-------------------|---------------|---------------|
| Won | Won | Won | PO received, SAP order |
| Included & Secured | Included and Secured | Included and Secured | High confidence |
| Included | Included | Included | Committed |
| Included with Risk | Included with Risk | Included with risk | Committed + risk |
| Upside | Upside | Upside | Must be > 2× Included with Risk |
| Excluded / Pipeline | Excluded | Excluded | Outside period |

**Observation:** The 2× Upside rule (Upside must always exceed 2× Included with Risk) is defined in the playbook and visible in Report 1's data, but **no report enforces or visualises this rule as a KPI or alert**. It is only discussed in review meetings.

### 4.3 Business Review Cadence — Which Reports Serve Which Meeting

| Meeting | Frequency | Primary Report | Missing |
|---------|-----------|---------------|---------|
| KAM Individual Review | Weekly (Friday AM) | Report 1 — KAM FC page | Win/Loss analysis |
| Full Sales Team Review | Weekly (Friday PM) | Reports 1, 5 | 2× Upside rule alert |
| Business Pulse | Weekly/biweekly | Reports 6, 4 | Services P&L, B&B |
| Revenue Walk Dashboard | Weekly (Monday) | Report 6 | Reco walk, B&B, NWC |
| MPR | Monthly | Reports 4, 2, 3, 6 | Order Book, Services P&L, Channel Excellence |

### 4.4 Key Metrics Coverage

| Metric | Defined in Playbook | Available in Reports | Gap |
|--------|--------------------|--------------------|-----|
| OIT Actuals vs Target | ✅ | Reports 1, 4, 6 | None |
| OIT Margin | ✅ | Report 4 (CRM margin %) | Actual posted margin missing |
| Funnel Forecast | ✅ | Reports 1, 4, 5 | None |
| Revenue Recognition (Reco) | ✅ | ❌ Not in any report | **CRITICAL GAP** |
| Book & Bill (B&B) | ✅ | ❌ Not in any report | **CRITICAL GAP** |
| NWC (Net Working Capital) | ✅ | ❌ Not in any report | **CRITICAL GAP** |
| Order Book (Impl + Equipment) | ✅ | ❌ Not in any report | **CRITICAL GAP** |
| Services P&L | ✅ | ❌ Not in any report | **CRITICAL GAP** |
| Partner Revenue vs Target | ✅ | Report 2 | None |
| Price / Margin by Modality | ✅ | Report 3 | None |
| Win/Loss Analysis | ✅ | ❌ Not in any report | Gap |
| Large/Strategic Deal Tracking | ✅ | ❌ Not in any report | Gap |
| Channel Excellence Dashboard | ✅ | ❌ Not in any report | Gap |

---

## 5. Per-Report Deep-Dive Findings

### Report 1 — Weekly FC Tracker

**Strengths:**
- Perfect weekly cadence alignment — snapshot weeks W03–W12 match the Friday review rhythm
- Full forecast flag hierarchy with ordered sort (1–6), enabling clean pivot views
- `Overdue`, `Risk Opp`, and `Check Staging` binary flags enable data quality monitoring
- `Invertweek` calculated column enables reverse-chronological sorting — thoughtful design

**Issues / Observations:**
- Single-table model (denormalized) — all 34,919 rows are opportunity × week snapshots. No star schema. Flexible but has no dimension reuse across reports.
- Snapshot week range is W03–W12 (as of last refresh 2026-03-16). This is 2026 Q1 only. Historical comparison requires a separate report (Report 5).
- `4-Close` appears as a Sales Stage alongside the standard stages — this is a non-standard value that should be investigated (legacy CRM stage? migration artifact?).
- `Group of Regions` at report level is pre-set to 5 values — but the playbook shows 3 top-level regions. "ASPAC South" and "LATAM" appear separately at report level but roll up to "Intercontinental" in the master region mapping. This inconsistency could cause confusion.
- No explicit Upside-to-Included-with-Risk ratio calculated or displayed.

---

### Report 2 — Partner Dashboard

**Strengths:**
- Richest data model of all 6 reports — 11 tables, proper star schema, RLS implemented
- Historical depth: SAP data from 2023–2026 (multi-year trend capability)
- `Implementation_HourlyRate xl` table enables revenue → hours conversion for implementation analysis
- Three revenue type split (Goods / Implementation / Support) aligns with playbook's MPR agenda

**Issues / Observations:**
- `MarginSecurity` RLS table restricts margin data visibility — confirms this is sensitive data requiring access control. Need to understand who has access before building derivative reports.
- `FeedFile` has 1,082,674 rows — largest table in the ecosystem. Refresh time is a concern.
- `AP2 customers` table (603 rows) and `DealerList xl` (754 rows) are manually maintained Excel files. These are operational bottlenecks — if channel manager assignments change, someone must manually update the file.
- Budget data (`DealerList_TargetSetting xl`) is at Dealer × Year × Month × Type × Budget Class grain. This is detailed enough for bottom-up target tracking but requires careful maintenance.
- "Sales last 2yr" flag on dealers is a YES/NO flag — this is a calculated column. If a dealer goes inactive for 2 years, they drop out of partner analysis. The calculation method needs verification.
- The `Sheet1` table reference in visuals (TYPE rows in pivot) is unusual — likely a Power Query step that wasn't renamed. Creates fragility.

---

### Report 3 — Price Margin Modalities

**Strengths:**
- Price realization waterfall (List Price → Discount → Net Turnover → Sofon Cost+ → Gross Margin) is an excellent decomposition tool
- CRM opportunity linkage via BP5/AP5 query enables drill from posted revenue to the originating deal
- ENP (Effective Net Price) from BP2/AP2 enables per-unit pricing analysis
- `Margin % BUD` column enables CY margin vs budgeted margin comparison

**Issues / Observations:**
- Two-table model (`Q price realisation extra` + `Q price realisation extra 2`) means data is effectively stored twice — once at line level, once pre-aggregated. This is an ETL design decision, not a report bug, but it means the CY/PY comparison is only as good as the pre-aggregation logic.
- `Sofon Cost+` is the cost baseline — this is the standard cost from the quoting tool, **not the actual posted cost from SAP**. If deals are negotiated below standard, the margin may appear higher than reality.
- No regional filter pre-set on the Goods Waterfall page — the user must manually apply the `functional area group = Goods` filter to get the correct waterfall. This is a UI/UX issue.
- The `functional area group` field aligns with the Partner Dashboard's `TYPE` field (Goods/Implementation/Support) but uses a different field name — no formal relationship between reports.

---

### Report 4 — OIT Margin & Product Mix 2026

**Strengths:**
- Most architecturally sophisticated report — 26 tables, field parameters, dynamic measure switching
- Only report that contains DS%/DH%/Feasibility% (all three playbook CRM fields) in one view
- Equipment type classification (9 types: DR 100e, DR 100s, DR 400, DR 600, DR 800, DX-D 300, Retrofit, Valory Ceiling, Valory Floor) enables product mix analysis at the right granularity
- `agfa_maintypecodename` (New Business / New machine sales / Expand existing) enables new vs. expansion deal analysis
- Budget targets at config level (raw data table, 2026 only) enable CY actuals vs budget comparison down to equipment configuration

**Issues / Observations:**
- `opportunity` table has 46,523 rows (all CRM history). `msd data` has 28,902 rows. The gap of ~17,600 rows represents opportunities filtered out — likely lost, cancelled, or outside K4 business unit. This filter logic should be documented.
- `agfa_plannedrevenuerecognitiondate` is extracted from CRM and present in the model but **not used in any visible page**. This is the most important missing metric — planned Reco dates are in the data but not surfaced.
- Margin cost % fields (`agfa_margincostpercentagehardware`, `_implementation`, `_internallicenses`, `_servicecontracts`) are CRM-entered values, not SAP actuals. KAMs enter these at deal stage. Accuracy depends on discipline of entry.
- `agfa_feasibilitycode` values are 0, 10, 30, 50, 70, 90 (integer scale, not 0–1.0 like Report 1's `Feasibility` column). Both represent the same concept but different scales — this will cause confusion in cross-report analysis.
- `Budget Page measures` table contains gap measures by region (Intercontinental / Europe / NAM) — this is hardcoded region grouping in DAX. If the region structure changes, this measure table breaks.
- Dynamic measure switching (View Selector, Value Selector, Header Selector, Quote type Selector) adds powerful flexibility but significantly increases report maintenance complexity.

---

### Report 5 — Funnel Evolution Tracker

**Strengths:**
- The 2×2 page matrix (Weighted/Unweighted × Weekly/Monthly) is a clean design — covers all four perspectives in one report
- `Quarters` field (e.g. `2024-Q3`) tracking enables precise slippage analysis — you can see an opportunity move from targeting Q2 to Q3 week by week
- `New_Funnel` includes a `Closed` category — allows funnel close-out visibility

**Issues / Observations:**
- `Cal Year` values in current extract are 2024 — the data appears to be a 2024 historical snapshot, not current 2026 data. Confirm whether this report has a 2026 version or is intentionally archival.
- `Forecast Flag` in this report has simplified values (`Include`, `Included w/ Risk`, `Upside`, `Exclude`) — different label set from Reports 1 and 4 which use the full 6-category set. `Included and Secured` and `Won` are missing. This creates inconsistency in cross-report analysis.
- `DataWeek2024` companion table is named with the year — will need renaming as years progress or the naming will become misleading.
- `Quote Type` and `Quote Status` columns exist in the fact table but are **empty** in the current extract. These fields are present in the CRM spec (agfa_quotetypename, agfa_quotestatusname) — either the extract doesn't populate them or they were added to the schema but not yet data-loaded.

---

### Report 6 — OI & Funnel Health Cockpit

**Strengths:**
- Pre-aggregated running total design (`RT CY`, `RT PY`, `RT BT` columns) is the correct approach for executive trend charts — avoids complex DAX running total calculations
- Multiple prediction models side-by-side (funnel, funnel HF, 4Q average, Prior Quarter, Same Quarter) give management a range view rather than a single point estimate
- `Others` table stores KPI % cards (CY vs BT QTD, CY vs PY YTD) as pre-computed values — ensures card visuals are always correct without complex filter context issues
- Three-page structure (FY, YTD, Q) mirrors exactly how management thinks about OIT at different time horizons

**Issues / Observations:**
- Data is at Destination × Week grain — geographic detail is available but the prediction model columns (`funnel`, `4Q`, `PQ`, `SQ`) are region-aggregated predictions, not geography-specific forecasts. The source of these predictions (which system generates them?) is unclear from the report alone.
- `select`, `select1`…`select5` dynamic series on the line charts are unresolved in the documentation — these are query-time resolved series that may represent conditional forecasts or threshold lines. Their business meaning needs to be confirmed.
- `FC2` vs `FC` — two forecast series exist in the data (`RT FC` and `RT FC2`). The difference between Forecast and Forecast 2 is not labeled anywhere in the report. This is an ambiguity that will confuse users.
- The unit is **kEUR** (thousands of EUR) while Report 3 uses **EUR** and Report 4 uses **EUR (base)**. Cross-report comparisons require unit conversion awareness.

---

## 6. Data Quality Findings

### 6.1 Field Scale Inconsistencies

| Field | Report 1 | Report 4 | Issue |
|-------|---------|---------|-------|
| Feasibility | 0.0–1.0 (decimal) | 0, 10, 30, 50, 70, 90 (integer) | Same concept, different scale |
| Amount | EUR | EUR (base) | Need to confirm EUR = EUR base |
| OIT values | EUR | kEUR (Report 6) | 1000× difference across reports |

### 6.2 Forecast Flag Label Inconsistency

| Category | Report 1 | Report 4 | Report 5 | Playbook |
|----------|---------|---------|---------|---------|
| Flag 1 | Won | Won | (missing) | Won |
| Flag 2 | Included and Secured | Included and Secured | (missing) | Included & Secured |
| Flag 3 | Included | Included | Include | Included |
| Flag 4 | Included with Risk | Included with risk | Included w/ Risk | Included with Risk |
| Flag 5 | Upside | Upside | Upside | Upside |
| Flag 6 | Excluded | Excluded | Exclude | — |

Three different label sets for the same taxonomy across 3 reports. Any cross-report analysis joining on this field will fail or produce incorrect results.

### 6.3 Region Hierarchy Inconsistencies

| Level | Reports 1, 5 | Report 4 | Report 2 | Master Mapping |
|-------|-------------|---------|---------|---------------|
| Top level | Group of Regions (3) | REGION (3, uppercase) | Report Group Region (4 incl. "Not assigned") | Group of Regions |
| Mid level | Subregion (22) | CLUSTER (10) | Report Sub-region (20) | Subregion |
| Lower level | Region (37) | AREA | Fixed Destination | Region |

Each report uses a different field name and/or different level of the hierarchy. The master region mapping in `CRM data in Radiology reporting.xlsx` defines 5 columns (Destination, Fixed Destination, Region, Subregion, Group of Regions) — but Report 4 introduces CLUSTER and AREA levels that don't appear in the master mapping. This suggests Report 4 uses a newer, more granular geography model that was not back-applied to Reports 1, 2, and 5.

### 6.4 Manually Maintained Reference Files (Fragility Risk)

| File | Maintained By | Risk |
|------|-------------|------|
| `DealerList xl` (754 rows) | Manual Excel | Channel manager changes not auto-synced |
| `DealerList_TargetSetting xl` (3,928 rows) | Manual Excel | Budget updates require manual file edit |
| `ProductFamilyList xl` (94 rows) | Manual Excel | New products not auto-added |
| `Region partner dashboard xl` (278 rows) | Manual Excel | New destinations not auto-added |
| `Implementation_HourlyRate xl` (152 rows) | Manual Excel | Annual rate updates require manual edit |

All 5 reference tables in Report 2 are manually maintained Excel files loaded into Power BI. Any change to these (new dealer, new product, updated rate) requires manual file update + report refresh.

### 6.5 CRM Data Entry Discipline Dependencies

Several key analytics depend on salespeople entering data correctly in D365:

| Field | Entered By | Risk if Not Maintained |
|-------|-----------|----------------------|
| DS% / DH% | KAM / Channel Manager | Weighted amounts inaccurate |
| Feasibility % | Auto-calculated (system) | Low risk |
| Forecast Category | KAM / Channel Manager | Funnel totals wrong |
| agfa_margincostpercentage* | KAM at deal creation | Margin analysis unreliable |
| agfa_plannedrevenuerecognitiondate | KAM | Reco planning impossible |
| agfa_requesteddeliverydate | KAM | Delivery planning unreliable |
| Sofon quote status = "sent" | KAM before offer stage | Quote pipeline unclear |

The `Check Staging` and `Overdue` flags in Report 1 partially address this — but only for staging discipline and date overdue, not for completeness of all fields.

---

## 7. Critical Gaps Summary

### GAP 1 — Revenue Recognition (Reco) is invisible
**What's missing:** No report tracks planned vs actual revenue recognition dates or the Reco walk (Orders → Implementation → Invoiced). `agfa_plannedrevenuerecognitiondate` is extracted from CRM and present in Report 4's data model but never surfaced in any visual.

**Impact:** The MPR standard agenda includes "Current quarter Sales outlook" and "Order Book" — both require Reco data. Management is currently tracking this outside Power BI (likely in Excel).

**Data available:** `agfa_plannedrevenuerecognitiondate` in msd data table (Report 4). SAP posting date available in FeedFile (Report 2).

---

### GAP 2 — Order Book pipeline not tracked
**What's missing:** No Digital Radiology report shows the order book — won orders not yet invoiced, split by implementation progress and equipment delivery stage.

**Impact:** The Revenue Walk Dashboard (weekly Mondays) specifically requires "Order Book (Implementation + Equipment)" as a line item in the sales walk. This data exists in SAP but is not in any DR Power BI report.

**Data available:** `agfa_saporderid` links won CRM opportunities to SAP orders. SAP order status data would need to be added as a new data source.

---

### GAP 3 — Book & Bill (B&B) not tracked
**What's missing:** B&B = deals where the order intake and revenue recognition happen in the same period (typically small, standard products). No report separates B&B from standard implementation deals.

**Impact:** B&B expectations are a standard MPR agenda item. Without tracking, management cannot accurately forecast end-of-quarter acceleration.

**Data available:** Could be derived from `agfa_requesteddeliverydate` vs `estimatedclosedate` proximity in CRM, or from SAP delivery vs order date delta.

---

### GAP 4 — Margin data is CRM-entered, not SAP-verified
**What's missing:** Report 4's margin figures (`agfa_margincostpercentagehardware`, `_implementation`, etc.) come from CRM deal estimates, not from SAP actuals. Report 3 uses Sofon Cost+ as the cost baseline, which is the standard pricing cost, not the actual procurement/delivery cost.

**Impact:** OIT margin reported in Business Pulse may differ significantly from actual posted margin in SAP. There is no reconciliation report between CRM margin estimates and SAP actual margin.

**Data available:** `Calculated Cost APX` in Report 2's FeedFile is the actual cost method. This could be joined to opportunity data via SAP order ID.

---

### GAP 5 — Win/Loss analysis not available
**What's missing:** No report surfaces lost opportunities (statecodename = Lost) for post-mortem analysis. The `opportunity` table has all lost deals, but no report visualises win rates, loss reasons, or competitor intelligence.

**Impact:** The playbook's Post Mortem stage produces feedback to Marketing (especially for tenders). Without a win/loss report, this loop is closed manually.

**Data available:** `statecodename = Lost`, `statuscodename`, `actualclosedate` all available in the opportunity extract.

---

### GAP 6 — Large deal and strategic deal tracking
**What's missing:** No report has a dedicated "large deals" or "strategic deals" page. The playbook defines both categories explicitly (large = high value, next 6 months; strategic = complex/must-win/first-of-kind) and tracks them in Business Pulse and MPR.

**Impact:** Management currently tracks these deals manually, typically in a separate slide deck or spreadsheet. No systematic alerting when a large deal changes stage or forecast category.

**Data available:** Deal value thresholds available via `estimatedvalue_base`. Stage changes trackable via weekly snapshots in Reports 1 and 5.

---

### GAP 7 — Sofon quoting discipline not monitored
**What's missing:** The playbook requires Sofon status = "sent" before an opportunity enters the offer/quoting stage. `agfa_quotestatusname` and `agfa_wasquotedcreatedname` are both extracted from CRM, but only the Yes/No flag is visible in Report 4. No report shows opportunities that are in Quoting stage without a Sofon quote created.

**Impact:** Opportunities may progress through stages without proper quotes, leading to price/margin surprises at close.

---

## 8. Cross-System Connection Points

### 8.1 CRM → SAP Bridge (agfa_saporderid)
When a CRM opportunity is Won, `agfa_saporderid` is populated. This is the only field that links a CRM deal to its SAP execution. Currently Report 4 uses it as a data point but no report **joins** CRM opportunity data with SAP actuals at the deal level to compare estimated vs actual value and margin.

### 8.2 CRM → Sofon Bridge (agfa_sofonproductfamilyid)
Product family from Sofon is stored both on the `opportunityproduct` table and on the `product` master. The `Implementation_HourlyRate xl` table in Report 2 uses `Sofon Rate Ctry Code` — confirming Sofon rates feed into implementation revenue calculations.

### 8.3 BW → CRM Bridge (Opportunity ID in BP5)
SAP BW query BP5 (AP5 system) extracts `Syracuse/SalesOne Opportunity (Key)` as a dimension — enabling revenue posted in SAP to be traced back to the originating CRM opportunity. This linkage is used in Report 3 (Price Margin Modalities) but **not in Reports 1, 4, or 6**, which means it is theoretically possible to compare CRM estimated order value vs SAP posted revenue at the opportunity level but this has not been built.

### 8.4 AP2 → Product Master Bridge (agfa_ap2code)
The `product` table in D365 contains `agfa_ap2code` — the SAP AP2 material code. This enables CRM product data to be joined to AP2 transaction data. Report 3 uses both AP2 (via BP2) and CRM data, but the product-level join goes through `agfa_sofonproductfamilyid` rather than `agfa_ap2code`.

---

## 9. Recommendations — Priority Order

### Priority 1 — Revenue Recognition Report (NEW)
**Build:** A dedicated Reco tracking page using `agfa_plannedrevenuerecognitiondate` from Report 4's existing msd data table. No new data source needed — the field is already loaded.

**Minimum viable content:**
- Planned Reco by month (current quarter + next quarter) — bar chart
- Won opportunities by Reco month × region × equipment type — matrix
- Delta: planned Reco date vs estimated close date (implementation lag indicator)
- Overdue Reco: Won deals where planned Reco date < today and SAP order not posted

**Effort:** Low — all data already in Report 4's model.

---

### Priority 2 — 2× Upside Rule KPI (ENHANCE Report 1)
**Build:** Add a calculated measure to Report 1:
- `Upside EUR / (Included with Risk EUR)` ratio per region
- Visual alert (conditional formatting or KPI card) when ratio < 2
- Available for current snapshot week and trending over weeks

**Effort:** Very low — DAX measure on existing data.

---

### Priority 3 — Win/Loss Analysis Page (NEW PAGE in Report 4)
**Build:** Add a page to Report 4 using the existing `opportunity` table (46,523 rows, all history):
- Win rate % by region, equipment type, sales stage reached, deal size band
- Loss volume over time (bar chart by quarter)
- Average deal size: Won vs Lost
- Time-to-close: Won vs Lost (days from createdon to actualclosedate)

**Effort:** Low — all data already in Report 4's model.

---

### Priority 4 — Forecast Flag Label Standardisation (FIX)
**Fix:** Align forecast flag labels across Reports 1, 4, and 5 to a single standard. Recommend adopting the Report 1 / playbook standard:
- Won | Included and Secured | Included | Included with Risk | Upside | Excluded

**Effort:** Low for Report 5 (rename column values in Power Query). Report 4 is from D365 source — field name `msdyn_forecastcategoryname` uses "Included with risk" (lowercase r). A Power Query transformation step can normalise this.

---

### Priority 5 — Large Deal Tracker (NEW PAGE in Report 1 or 4)
**Build:** A page dedicated to deals above a configurable threshold (e.g. >500 kEUR):
- List view with opportunity name, KAM, region, equipment type, amount, stage, forecast category, estimated close date
- Stage change history (requires weekly snapshot comparison — already available in Report 1)
- Alert: deals where forecast category degraded week-over-week (e.g. Included → Included with Risk → Upside)

**Effort:** Medium — requires DAX for stage change detection across snapshot weeks.

---

### Priority 6 — Reference Data Automation (INFRASTRUCTURE)
**Fix:** Replace the 5 manually maintained Excel reference files in Report 2 with automated extracts:
- `DealerList xl` → D365 account extract (channel = Dealer)
- `ProductFamilyList xl` → D365 product extract (filtered to DR / K4)
- `DealerList_TargetSetting xl` → Budget system export (SAP or planning tool)
- `Region partner dashboard xl` → Use the master region mapping from `CRM data in Radiology reporting.xlsx`
- `Implementation_HourlyRate xl` → SAP rate table or controlled file with change log

**Effort:** Medium-High — requires data pipeline changes, not just report changes.

---

### Priority 7 — Order Book Report (NEW — Requires New Data Source)
**Build:** A DR Order Book report showing won orders not yet recognised as revenue.

**Data needed (not yet in Power BI):**
- SAP order status (open/in delivery/invoiced)
- Expected delivery/installation dates
- Implementation milestone completion

**Effort:** High — requires new SAP data connection. Implement after Priorities 1–6.

---

## 10. Appendix — Field Reference Map

### Opportunity-Level Fields Present in CRM Extract

| Field | Business Meaning | Used in Report |
|-------|-----------------|---------------|
| msdyn_forecastcategoryname | Forecast category | 1, 4, 5 |
| agfa_dsdealsigncodename | DS% — Agfa win preference | 4 |
| agfa_dhdealhappencodename | DH% — customer readiness | 4 |
| agfa_feasibilitycode | Feasibility score (0–90) | 1, 4, 5 |
| agfa_opportunityid | OPP-XXXXX identifier | 1, 3, 4, 5 |
| agfa_saporderid | SAP order (post-Won) | 4 |
| agfa_plannedrevenuerecognitiondate | Planned Reco date | **Not surfaced** |
| agfa_estordervalueexcludingsmaamount_base | Deal value excl. SMA | 4 |
| agfa_weightedamountexcludingsma_base | Weighted value | 1, 4 |
| agfa_margincostpercentagetotal | Total margin cost % | 4 |
| agfa_margincostpercentagehardware | Hardware margin % | 4 |
| agfa_margincostpercentageimplementation | Implementation margin % | 4 |
| agfa_margincostpercentageinternallicenses | License margin % | 4 |
| agfa_margincostpercentageservicecontracts | Service margin % | 4 |
| agfa_opportunitymarginpercentageexcludingsma | Deal-level margin % | 4 |
| agfa_maintypecodename | New Business / Expand / New machine | 4 |
| agfa_wasquotedcreatedname | Sofon quote created Y/N | 4 |
| agfa_quotetypename | Order vs Quote | 4 |
| agfa_quotestatusname | Sofon quote status | 4 (not visible) |
| agfa_requesteddeliverydate | Customer delivery date | 1, 4, 5 |
| agfa_installatid | Installation site ID | 4 |
| agfa_accountcountryidname | Account country | 4 |

---

*End of Data Analysis Findings — AGFA Digital Radiology*
*Document version: 1.0 | Date: 2026-03-26*
