# DPS Analytics Dashboard — Client Email
## Subject: DPS Analytics Dashboard — Ready for Review | Data Validation & Open Questions

---

Hi [Name],

Thank you for sharing the DPS source reports. We've built an interactive Business Intelligence dashboard based on the 5 reports you provided (RECO Analysis, AMSP, CO-PA, Sales Details, and the Order Follow-up file), and it's ready for your review.

**Dashboard Link:** https://agfa-dps-dashboard.web.app

---

## What We've Built

The dashboard has 6 tabs covering the full DPS commercial and financial picture from order intake through to EBIT. Here is what each tab contains:

**Tab 1 — Executive Summary**
The weekly health check. 8 KPI cards (RECO Net Revenue, EBIT, AMSP Margin, CO-PA GM%, SG&A vs Budget, OIT FY2025, FY2026 YTD OIT, Backlog) with a monthly net sales area chart, RECO P&L key lines bar chart, OIT trend, and a Key Insights panel with 6 contextual alerts. All KPI cards are clickable and navigate to the relevant detail tab. The year filter dynamically switches chart content — selecting FY2026 switches the OIT chart to show 2026 OIT vs Revenue Recognition units.

**Tab 2 — Revenue & Margin**
The financial deep dive. Full RECO P&L table (Revenue → Manufacturing Contribution → Gross Margin → SG&A → Adj. EBIT → Non-recurring → EBIT → Overall Result) with Actual, Budget, and Prior Year columns. CO-PA waterfall showing the €60.4M rebate deduction from gross sales to Net TO. AMSP vs CO-PA two-margin comparison framework. Top CO-PA product families by Net TO. Filter-aware by Business Unit and Budget Class.

**Tab 3 — Product Mix**
Which products are driving margin. CO-PA Net TO breakdown by Business Unit (LK 86.9%, LI 10.8%, M0 2.3%). AMSP margin % by all 7 Budget Classes — from Packaging Print Engineering at 95.9% down to Packaging Speedset at 9.6%. Revenue vs margin scatter chart (bubble per Budget Class) and a full Budget Class detail table. Filter-aware — selecting a BU shows only that BU's Budget Classes.

**Tab 4 — Geographic View**
Where the business comes from. Net sales by region (Europe, Americas, Asia Pacific, MEA) with top country breakdown. OIT by sales organization (11 orgs, FY2025 vs FY2024 with YoY delta). Includes an intercompany customer note explaining why all top customers are AGFA subsidiaries — end-customer data is held at the national subsidiary level, outside current DPS scope.

**Tab 5 — Order Pipeline**
Commercial momentum tracking. 6 KPI cards (FY2026 OIT YTD, RR YTD, End-Feb Backlog, pace vs prior year, FY2025 total, delayed count). Monthly FY2026 OIT vs Revenue Recognition grouped bar chart. OIT by equipment family (Anapurna/Accurio, Jeti, Onset). Backlog evolution area chart (End-Dec=40, End-Jan=43, End-Feb=46). Forward pipeline stacked bar (confirmed/expected/potential units for Mar–Jun+). OIT by sales organization table with YoY comparison.

**Tab 6 — Order Explorer**
The lifecycle trace — where the data trail breaks. See detail below.

---

We'd like to draw your attention specifically to the **Order Explorer** tab — this is the most important tab for this review, as it documents where the data trail breaks in the order lifecycle.

---

## The Order Explorer Tab — Why It Matters

The Order Explorer tab maps the full DPS order lifecycle in three stages:

- **Stage 1 — Order Intake:** Unit count, product family, sales organization, delayed tracker. Source: Order Follow-up Excel.
- **Stage 2 — Revenue Recognition:** Units invoiced, delay reasons, OIT→RR lag. Source: Order Follow-up Excel (SSOT sheets).
- **Stage 3 — Revenue & Margin:** Net sales, AMSP margin %, CO-PA Net TO, RECO P&L. Source: SAP BW (RECO, AMSP, CO-PA).

**Critical gap between Stage 2 and Stage 3:** There is no SAP Sales Order number or CRM ID that links the unit order tracker (manual Excel) to the financial reporting files (SAP BW). This means we cannot compute revenue per order, margin per printer sold, or quantify the EUR impact of delayed orders. This is surfaced explicitly in the dashboard as a named, actionable gap.

---

## The Three Financial Frameworks — Important Context

One of the most complex aspects of DPS reporting is that the same business is measured three different ways across the source files. Here is how we've interpreted them:

| Framework | Perimeter | Currency | Rebates | Key Metric |
|-----------|-----------|----------|---------|------------|
| RECO Analysis | All DPS entities incl. IC | kEUR | Not deducted | €385M revenue, €205M EBIT |
| AMSP | AGFA NV only, 3rd party | EUR | Not deducted | 61.9% margin |
| CO-PA | AGFA NV only, 3rd party | EUR | Deducted (€60.4M) | €159.6M Net TO, 38.9% GM% |

Numbers will not tie across frameworks — this is by design. The dashboard surfaces both AMSP and CO-PA margins side by side with an explanation of the gap rather than averaging them. Please confirm whether our perimeter interpretation is correct for each source.

---

## Data Confidence System

Because we don't have complete data for every KPI, we've implemented a 4-level confidence badge visible on every metric:

- **Verified (green)** — Directly read from source file. e.g., FY2025 OIT = 195 units from the Order Follow-up master sheet.
- **Derived (blue)** — Calculated from verified source data. e.g., BU split of monthly OIT derived from annual product mix ratios.
- **Estimated (orange)** — Hardcoded from manual reading of source files. e.g., RECO P&L line items, backlog evolution end-of-month snapshots.
- **Proxy (red)** — No direct data available, using a substitute metric. e.g., AMSP margin % used as proxy for BU-level profitability where CO-PA BU split is unavailable.

We'd appreciate your confirmation on whether the "Estimated" values are correct and guidance on improving the "Proxy" metrics.

---

## Critical Questions Requiring Your Input

**#1 Priority — The RECO vs. Sales Details Revenue Gap:**
RECO shows €385M total revenue (all entities including IC), while Sales Details (AGFA NV, 3rd party only) shows €191M. After IC elimination, RECO implies approximately €114M at the AGFA NV 3rd-party level — leaving an unexplained residual of ~€77M. Understanding this gap is essential for us to correctly attribute revenue across the frameworks.

---

### Data & Systems Questions

| # | Question | Why It Matters |
|---|----------|----------------|
| Q1 | Is the Order Follow-up Excel the single source of truth for all OIT and RR unit data, or does SAP capture any of this? | Determines whether the manual Excel can be replaced or validated by SAP SD |
| Q2 | Does a SAP Sales Order (SD) number exist at the time of order booking in the Excel file? | This is the join key needed to link units to financial outcomes — currently absent |
| Q3 | The CO-PA file shows €60.4M in rebates deducted from gross sales. Are these volume rebates, year-end adjustments, or a mix? | Affects how we interpret the 27.5% rebate-to-gross-sales ratio |
| Q4 | BU code "DP" appears in some historical data instead of "M0" for Packaging — are these the same entity, or was there a reclassification? | Affects historical BU trend comparisons |
| Q5 | The Sales Details file covers AGFA NV only. Is a consolidated file available that includes all DPS entities? | Currently we cannot break RECO revenue (€385M) into product/customer detail |

---

### Business Context Questions

| # | Question | Why It Matters |
|---|----------|----------------|
| Q6 | December has the highest revenue (€30.6M) but lowest AMSP margin (46.4% vs 61.9% FY average). Is this a year-end pricing true-up, a product mix effect (Speedset overweight in December), or a cost accrual? | Currently unexplained — the largest single-month margin anomaly |
| Q7 | Packaging Speedset shows a 9.6% AMSP margin — significantly below all other Budget Classes. Is this structurally expected, or is there a specific project or pricing issue driving it? | At current margin, Speedset may be diluting overall DPS profitability |
| Q8 | The Order Follow-up file covers 2019–2026 cumulative. Are there any structural business changes in that period (product line additions, entity changes, go-to-market shifts) that would make pre-2023 OIT data not comparable to recent years? | Affects whether we use 5-year or 2-year trend baselines |
| Q9 | The forward pipeline (Mar–Jun+ 2026) is classified as Potential / Expected / Confirmed. Who assigns these classifications — Sales, Service, or Finance? | Determines reliability of the pipeline EUR coverage estimate |

---

### Business Logic Confirmations Needed

| Item | Our Assumption | Please Confirm |
|------|---------------|----------------|
| Fiscal Year | Calendar year (Jan–Dec) | Correct? |
| FY2025 OIT | 195 units (196 in FY2024, -1 YoY) | Confirmed? |
| FY2026 YTD OIT | 22 units (Jan–Feb, as of 23 Mar snapshot) | Confirmed? |
| End-Feb 2026 Backlog | 46 units (End-Dec=40, End-Jan=43, End-Feb=46) | Confirmed? |
| RECO Net Revenue FY2025 | €385,098 kEUR (all entities, incl. IC) | Confirmed? |
| AMSP Margin FY2025 | 61.9% (AGFA NV, 3rd party, unweighted) | Confirmed? |
| CO-PA Gross Margin % | 38.9% (after €60.4M rebate deduction) | Confirmed? |
| SG&A Budget | -€94,000 kEUR (vs -€85,000 actual — +€9M favorable) | Confirmed? |
| Delayed Orders | 12 units delayed as of Mar 2026 (all from FY2025 OIT cohort) | Confirmed? |
| IC Customer View | Top customers are AGFA subsidiaries — end-customer data held at subsidiary level | Correct for DPS manufacturing entity? |

---

## Key Findings from Data Analysis

While reviewing the 5 source files, we uncovered 6 significant findings documented throughout the dashboard:

1. **December Margin Anomaly** — December is simultaneously the highest-revenue month (€30.6M) and the lowest-margin month (46.4% AMSP vs 61.9% FY average). Root cause not identifiable from current data.

2. **Speedset Margin Outlier** — Packaging Speedset at 9.6% AMSP margin vs. 68.1% for Packaging Onset INCA and 95.9% for Packaging Print Engineering. Structural concern or one-time pricing issue?

3. **The Three-Framework Problem** — RECO (€385M), AMSP (61.9%), and CO-PA (38.9%) measure the same business but are not reconcilable without IC elimination data. This is a significant reporting complexity risk.

4. **No Order Lifecycle Traceability** — The 12 delayed orders in FY2025 represent revenue slippage, but the EUR impact cannot be calculated. With no join key between units and financials, the revenue risk of a delayed order is unknown.

5. **LK Concentration Risk** — LK (Wide Format) represents 86.9% of CO-PA Net TO. LI and M0 combined are 13.1%. Any LK softness has outsized business impact.

6. **Rising Backlog in FY2026** — Backlog grew from 40 units (end-Dec) to 46 units (end-Feb) while only 16 units were recognized. OIT is outpacing RR — pipeline is building but recognition is lagging.

---

## Data Gaps Identified

We identified 7 data gaps. Some are resolvable with additional data, some require system changes:

| # | Gap | Current Impact | Recommended Fix |
|---|-----|---------------|-----------------|
| G1 | No budget by Budget Class | Cannot compute actuals vs plan at product level | Share BP1/BP2 budget Excel from FP&A |
| G2 | No budget by Region | Regional performance cannot be benchmarked vs plan | Add budget to SAP BEx CO-PA query |
| G3 | No Hardware vs Consumables split | Cannot assess recurring revenue ratio | Use KRECO20 FA dimension with BC filter |
| G4 | No revenue by Sales Organization | Sales org performance not measurable in EUR | Add Sales Org to CO-PA BEx query |
| G5 | OIT file has no EUR order value | OIT units cannot be compared to revenue EUR | Link to SAP SD module order value at booking |
| G6 | Pipeline is unit-based only | Pipeline EUR coverage vs budget not computable | Add ASP to the pipeline register |
| **G7** | **No join key: OIT → Revenue → Margin** | **Cannot trace any order from intake to financial outcome** | **Enforce SAP SD order number in OIT file at booking time** |

---

## Next Steps

We'd appreciate if your team could:

1. **Review the Order Explorer tab** and validate the lifecycle stage interpretation and gap description
2. **Respond to the open questions above** — especially Q2 (join key) and Q6 (December margin anomaly)
3. **Confirm the business logic assumptions** in the table above, particularly the three financial framework perimeters
4. **Flag any additional data** you can share — particularly: monthly budget by Budget Class, IC elimination detail, or a consolidated revenue file covering all DPS entities
5. **Validate the 12 delayed orders** — are these the correct orders, root cause classifications, and revised RR dates?

Once we have your feedback, we can move "Estimated" metrics to "Verified" status, resolve the remaining gaps, and refine the KPI definitions where our assumptions need correction.

---

Please feel free to explore all 6 tabs — every chart and KPI card is interactive with filters (Year, Business Unit, Budget Class, Region) and the KPI cards on the Executive Summary tab navigate directly to the relevant detail tab when clicked.

Looking forward to your feedback.

---

*Dashboard built on: RECO Analysis | AMSP | CO-PA | Sales Details | Order Follow-up (DPS_Customer order & revenue follow-up 2026.xlsx)*
*Data snapshot: March 2026 | Dashboard version: 1.0*
