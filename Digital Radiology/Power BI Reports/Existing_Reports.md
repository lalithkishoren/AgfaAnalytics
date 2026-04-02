# Existing Power BI Reports — Full Documentation

> Auto-generated documentation for all PBIX files in the AGFA Digital Radiology analytics workspace.
> Last updated: 2026-03-25

---

## Index of Reports

| # | File | Folder | Pages | Tables | Status |
|---|------|--------|-------|--------|--------|
| 1 | [Commercial Analytics - Weekly FC Tracker.pbix](#1-commercial-analytics---weekly-fc-tracker) | Dashboards2 | 12 | 2 | Documented |
| 2 | [Partner Dashboard.pbix](#2-partner-dashboard) | Dashboards2 | 12 | 11 | Documented |
| 3 | [Price Margin Modalities.pbix](#3-price-margin-modalities) | Dashboards2 | 4 | 3 | Documented |
| 4 | [Commercial Analytics - OIT Margin & Product Mix 2026.pbix](#4-commercial-analytics---oit-margin--product-mix-2026) | Dashboards1 | 8 | 26 | Documented |
| 5 | [Commercial Analytics - Funnel Evolution Tracker.pbix](#5-commercial-analytics---funnel-evolution-tracker) | Dashboards3 | 4 | 2 | Documented |
| 6 | [Commercial Analytics - OI & Funnel Health Cockpit.pbix](#6-commercial-analytics---oi--funnel-health-cockpit) | Dashboards3 | 3 | 3 | Documented |

---

---

# 1. Commercial Analytics - Weekly FC Tracker

**File:** `Dashboards2/Commercial Analytics - Weekly FC Tracker.pbix`
**Created From:** Power BI Cloud (Service) — Release 2025.04
**Dataset ID:** `1de57985-80a4-449b-9607-f535ef4d1899`
**Report ID:** `b5b62d21-3e1e-4dc9-87eb-1b7ab924b7a7`
**Last Refreshed:** 2026-03-16 22:14:38 | Snapshot Week: W12

---

## 1.1 Data Model

### Tables

#### Table 1: `DataWeek` (Fact / Main Table)
- **Row Count:** ~34,919 rows
- **Grain:** One row per Opportunity × Snapshot Week

| # | Column Name | Data Type | Description / Domain Values |
|---|-------------|-----------|---------------------------|
| 1 | Snapshot Week | Text | Weekly snapshot identifier: W03–W12 |
| 2 | Group of Regions | Text | Top-level regional grouping: `Europe-Pacific`, `Intercontinental`, `North America` |
| 3 | Subregion | Text | 22 subregions: Africa, Asean, Brazil, Canada, DACH, Dealer, DoD, Europe East & South, Europe North, Govt-Other, Hong Kong, Iberia, India, Key Accounts, Mexico, Middle East & Other Africa, New Business Development, North LATAM, Oceania, Rest Of ASPAC South, South LATAM, USA |
| 4 | Destination | Text | Country-level destination |
| 5 | Sold-to party | Numeric (ID) | Customer master ID (e.g. 2016732) |
| 6 | Location | Text | Country name |
| 7 | Syracuse/SalesOne Opportunity | Text | CRM opportunity ID (e.g. OPP-49926) |
| 8 | Calendar month | Numeric | Month number (e.g. 04) |
| 9 | Closed Date | Date | Actual close date (often blank = open) |
| 10 | Closed Month | Text | Month of close (often blank) |
| 11 | Target Date - Quarter | Numeric | Quarter number for target date |
| 12 | Final Month | Numeric | Final target month number |
| 13 | Final Quarter | Text | Final forecast quarter: Q1, Q2, Q3, Q4 |
| 14 | Requested Delivery Date | Date | Customer requested delivery date |
| 15 | Sub Sales Stage | Text | Detailed stage: In Progress, Won, Lost, On Hold, Cancel, Abandon, Pricing, etc. |
| 16 | Opportunity status | Text | `Open`, `Won`, `Lost` |
| 17 | Amount in EUR | Numeric (decimal) | Unweighted opportunity value in EUR |
| 18 | Weighted Amount in EUR | Numeric (decimal) | Probability-weighted value (Amount × Win%) |
| 19 | Feasibility | Numeric (0.0–1.0) | Deal feasibility score: 0.0, 0.1, 0.3, 0.5, 0.7, 0.9 |
| 20 | Deal Percentage | Numeric | Deal win probability % |
| 21 | Win Percentage | Numeric | Sales-assigned win probability % |
| 22 | Average Probability | Numeric | Average probability used for weighting |
| 23 | Forecast Flag | Text | FC classification: `Won`, `Included and Secured`, `Included`, `Included with Risk`, `Upside`, `Excluded`, `Lost`, `Pipeline` |
| 24 | Flag | Text | Ordered FC flag: `1. Won`, `2. Included and Secured`, `3. Included`, `4. Included with Risk`, `5. Upside`, `6. Excluded` |
| 25 | Funnel Evolution | Text | Quarter evolution label: Q1–Q4, OIT, Closed |
| 26 | Pl# Order Int# Date | Date | Planned order intake date |
| 27 | Pl# Order Int# Month | Text | Planned OIT month (YYYY-MM) |
| 28 | Act# Order Int# Date | Date | Actual order intake date (often blank) |
| 29 | Act# Order Int# Month | Text | Actual OIT month (often blank) |
| 30 | Calendar month2 | Text | Secondary calendar month reference (often blank) |
| 31 | Act# OIT Quarter | Text | Actual OIT quarter (often blank) |
| 32 | Closed Opp# Quarter | Text | Quarter when opportunity closed (often blank) |
| 33 | Final Year | Numeric | Forecast year (e.g. 2026) |
| 34 | Opportunity Date Created | Date | Date opportunity was created in CRM |
| 35 | Sales Stage | Text | `Identifying`, `Qualifying`, `Quoting`, `Negotiating`, `Closing`, `4-Close` |
| 36 | Opportunity Owner | Text | KAM / salesperson name |
| 37 | Cal Day | Date | Calendar day of snapshot |
| 38 | First Day of Cal Week | Date | Monday of snapshot week |
| 39 | Overdue | Numeric (0/1) | Flag: opportunity is overdue |
| 40 | Check Staging | Numeric (0/1) | Data quality / staging check flag |
| 41 | Open Opportunity in Funnel | Numeric (0/1) | Flag: opportunity is active in funnel |
| 42 | Opp Naming Convention | Numeric (0/1) | Naming convention compliance flag |
| 43 | Cal Year | Numeric | Calendar year |
| 44 | Cal Quarter | Numeric | Calendar quarter (1.0–4.0) |
| 45 | Last Month of Cal Quarter | Text | Last month of the quarter (YYYY-MM) |
| 46 | Last Day of Cal Quarter | Date | Last day of the calendar quarter |
| 47 | Risk Opp | Numeric (0/1) | Flag: opportunity is at risk |
| 48 | New Opp Created This Week | Numeric (0/1) | Flag: new opportunity created in snapshot week |
| 49 | Weeknumber | Numeric | ISO week number (e.g. 3.0, 4.0) |
| 50 | Invertweek | Numeric | Inverted week number for reverse sorting |
| 51 | Region | Text | Detailed region (37 values: Almaty, Asean, Belux, Brazil, Canada, Chile, DACH, East & Other Africa, France, Greece, Gulf, Hong Kong, Hungary, Iberia, India, Iran, Italy, La Plata, Levant, Maghreb, Mexico, NOLA, Netherlands, Nord, Oceania, Peru & Bolivia, Poland, Rest Of ASPAC South, Russia, Saudi Arabia, South Africa, UK, USA, Ukraine, West & Central Africa, etc.) |

---

#### Table 2: `T last refreshed` (Metadata / Reference Table)
- **Row Count:** 1 row
- **Purpose:** Stores the last data refresh timestamp and current snapshot week

| Column | Data Type | Sample Value |
|--------|-----------|-------------|
| Last Update | DateTime | 2026-03-16 22:14:38 |
| Snapshot Week | Numeric | 12.0 |

---

### 1.2 Table Relationships & Cardinality

> The DataModel is stored in XPress9-compressed VertiPaq format. Based on structural analysis:

| From Table | From Column | To Table | To Column | Cardinality | Cross-filter | Notes |
|------------|-------------|----------|-----------|-------------|--------------|-------|
| — | — | — | — | — | — | **Single-table model.** All data is denormalized into `DataWeek`. No active relationships detected. `T last refreshed` is an independent metadata table, not joined to `DataWeek`. |

**Hierarchy defined in model:**
- `Group of Regions Hierarchy`: Group of Regions → Subregion → Destination (used in drill-down on visuals)

---

### 1.3 Measures

> All aggregations are implicit measures (no DAX measure definitions found via extraction — the DataModel is XPress9-compressed). All measures are `SUM` aggregations applied directly on columns.

| Measure Name (as displayed) | DAX Expression (inferred) | Used On Pages |
|----------------------------|--------------------------|---------------|
| Sum(DataWeek.Amount in EUR) | `SUM(DataWeek[Amount in EUR])` | All pages |
| Sum(DataWeek.Weighted Amount in EUR) | `SUM(DataWeek[Weighted Amount in EUR])` | Pages 5, 7, 8, 10, 11 |
| Sum(DataWeek.New Opp Created This Week) | `SUM(DataWeek[New Opp Created This Week])` | Page 11 |
| Sum(DataWeek.Overdue) | `SUM(DataWeek[Overdue])` | Page 12 (RawData) |
| Sum(DataWeek.Risk Opp) | `SUM(DataWeek[Risk Opp])` | Page 12 (RawData) |
| Sum(DataWeek.Check Staging) | `SUM(DataWeek[Check Staging])` | Page 12 (RawData) |
| Sum(DataWeek.Weeknumber) | `SUM(DataWeek[Weeknumber])` | Page 12 (RawData) |
| Sum(DataWeek.Cal Quarter) | `SUM(DataWeek[Cal Quarter])` | Page 12 (RawData) |
| Sum(DataWeek.Target Date - Quarter) | `SUM(DataWeek[Target Date - Quarter])` | Page 12 (RawData) |

---

### 1.4 Calculated Columns

> No explicit DAX calculated columns detected (DataModel is compressed). The following columns are derived/computed based on their content patterns:

| Column | Derivation Logic (inferred) |
|--------|----------------------------|
| Weighted Amount in EUR | `Amount in EUR × Win Percentage / 100` |
| Flag | Ordered version of `Forecast Flag` (prefix with rank number: "1. Won", "2. Included and Secured", etc.) |
| Weeknumber | ISO week number extracted from `First Day of Cal Week` |
| Invertweek | `52 - Weeknumber` (used for reverse chronological sort) |
| Final Quarter | Derived from `Target Date - Quarter` or `Requested Delivery Date` |
| Cal Quarter | Quarter number from `Cal Day` date |
| Last Month of Cal Quarter | Last month string of the quarter |
| Last Day of Cal Quarter | Last date of the calendar quarter |
| Open Opportunity in Funnel | `1 if Opportunity status = "Open" AND Flag ≠ "6. Excluded"` |
| New Opp Created This Week | `1 if Opportunity Date Created falls within snapshot week` |
| Overdue | `1 if Requested Delivery Date < snapshot date AND opportunity is Open` |
| Funnel Evolution | Quarter label tracking how an opportunity's target quarter evolved week-over-week |

---

### 1.5 Calculated Tables

None detected. The model contains 2 physical tables only: `DataWeek` and `T last refreshed`.

---

---

## 1.6 Report-Level Filters (Applied Across All Pages)

| Field | Table | Filter Type | Applied Values |
|-------|-------|-------------|----------------|
| Flag | DataWeek | Categorical | Open / all values (no restriction — filter pane visible) |
| Group of Regions | DataWeek | Categorical | ASPAC South, Europe-Pacific, Intercontinental, LATAM, North America |
| Sales Stage | DataWeek | Categorical | Open (no restriction applied) |
| Subregion | DataWeek | Categorical | Open (no restriction applied) |
| Opportunity Owner | DataWeek | Advanced | Open (no restriction applied) |

> Note: Group of Regions is the only report-level filter with pre-set values (5 regions explicitly selected).

---

---

## 1.7 Page-by-Page Detail

---

### Page 1 — Forecast Flags
**Purpose:** High-level snapshot of forecast distribution by flag category and region hierarchy.
**Ordinal:** 8 (displayed tab position)

#### Visuals

| # | Visual Type | Title / Label | Rows / Axis | Columns / Legend | Values | Description |
|---|-------------|---------------|-------------|-----------------|--------|-------------|
| 1 | **Clustered Column Chart** | — | Category: Group of Regions Hierarchy (Group of Regions → Subregion → Destination) — drillable | Legend: Flag (1. Won … 6. Excluded) | Sum(Amount in EUR) | Shows EUR amounts split by forecast flag, drillable through regional hierarchy |
| 2 | **Slicer** | FC Quarter | Values: Final Quarter | — | — | Dropdown/list to filter by Q1–Q4 |
| 3 | **Slicer** | Snapshot Week | Values: Snapshot Week | — | — | Filter by weekly snapshot (W03–W12) |

#### Page-Level Filters
None specific.

#### Visual-Level Filters (on Column Chart)
| Field | Type |
|-------|------|
| Forecast Flag | Categorical (open) |
| Opportunity Owner | Categorical (open) |
| (additional internal filters) | Advanced (open) |

---

### Page 2 — Global FC
**Purpose:** Global forecast matrix showing EUR amounts by Flag rows × Snapshot Week columns — executive summary view.
**Ordinal:** 0 (first tab shown)

#### Visuals

| # | Visual Type | Rows | Columns | Values | Description |
|---|-------------|------|---------|--------|-------------|
| 1 | **Slicer** | — | — | Subregion | Filter by subregion |
| 2 | **Slicer** | — | — | Group of Regions | Filter by region |
| 3 | **Slicer** | — | — | Destination | Filter by destination/country |
| 4 | **Slicer** | — | — | Opportunity Owner | Filter by KAM/salesperson |
| 5 | **Slicer** | — | — | Final Quarter | Filter by forecast quarter |
| 6 | **Text Box** | — | — | — | Page header / label |
| 7 | **Text Box** | — | — | — | Secondary label |
| 8 | **Image** | — | — | — | Agfa logo |
| 9 | **Group Container** | — | — | — | Visual grouping element |
| 10 | **Pivot Table** | Rows: Flag | Columns: Snapshot Week | Values: Sum(Amount in EUR) | Weekly FC progression by flag category |

#### Page-Level Filters
| Field | Type | Value |
|-------|------|-------|
| Feasibility | Advanced | Open (no restriction) |

#### Visual-Level Filters (on Pivot Table)
| Field | Type |
|-------|------|
| Snapshot Week | Categorical (open) |

---

### Page 3 — Region FC
**Purpose:** Forecast breakdown by Region hierarchy → Flag → Opportunity Owner, tracked across snapshot weeks.
**Ordinal:** 1

#### Visuals

| # | Visual Type | Rows | Columns | Values | Description |
|---|-------------|------|---------|--------|-------------|
| 1–4 | **Slicers** | — | — | Subregion, Final Quarter, Group of Regions, Destination, Opportunity Owner | 5 filter slicers |
| 5 | **Text Box** | — | — | — | Page label |
| 6 | **Group Container** | — | — | — | Grouping container |
| 7 | **Image** | — | — | — | Agfa logo |
| 8 | **Pivot Table** | Rows: Region → Subregion → Flag → Opportunity Owner (hierarchy drill-down) | Columns: Snapshot Week | Values: Sum(Amount in EUR) | Region-level weekly FC tracker |

#### Page-Level Filters
None.

#### Visual-Level Filters (Slicers)
| Field | Type |
|-------|------|
| Sales Stage | Categorical (open — hidden filter) |

---

### Page 4 — SubRegion FC
**Purpose:** Same as Region FC but pivoted at Subregion level (no Region group header).
**Ordinal:** 2

#### Visuals

| # | Visual Type | Rows | Columns | Values | Description |
|---|-------------|------|---------|--------|-------------|
| 1–4 | **Slicers** | — | — | Subregion, Group of Regions, Destination, Opportunity Owner, Final Quarter | 5 filter slicers |
| 5 | **Pivot Table** | Rows: Subregion → Flag → Opportunity Owner | Columns: Snapshot Week | Values: Sum(Amount in EUR) | Subregion-level weekly FC pivot |
| 6 | **Group Container** | — | — | — | Grouping |
| 7 | **Image** | — | — | — | Agfa logo |

#### Page-Level Filters
None.

#### Visual-Level Filters (on Pivot Table)
| Field | Type |
|-------|------|
| Flag | Categorical (open) |
| Feasibility | Advanced (open) |
| Opportunity Owner | Categorical (open) |
| Snapshot Week | Categorical (open) |

---

### Page 5 — Weighted Funnel Evolution
**Purpose:** Tracks how the weighted (probability-adjusted) funnel has evolved week-over-week by quarter label.
**Ordinal:** 3

#### Visuals

| # | Visual Type | Category (X-axis) | Series / Legend | Values (Y-axis) | Description |
|---|-------------|-------------------|-----------------|-----------------|-------------|
| 1–4 | **Slicers** | — | — | Subregion, Group of Regions, Destination, Opportunity Owner, Final Quarter | 5 filter slicers |
| 5 | **Column Chart** | Snapshot Week (W03…W12) | Funnel Evolution (Q1, Q2, Q3, Q4, OIT, Closed) | Sum(Weighted Amount in EUR) | Grouped columns showing weighted EUR by funnel stage per week |
| 6 | **Group Container** | — | — | — | Grouping |
| 7 | **Image** | — | — | — | Agfa logo |

#### Page-Level Filters
None.

#### Visual-Level Filters (on Column Chart)
| Field | Type |
|-------|------|
| Funnel Evolution | Categorical (open) |
| Weeknumber | Categorical (open) |

---

### Page 6 — Unweighted Funnel Evolution
**Purpose:** Same as Page 5 but using unweighted EUR amounts (face value, no probability adjustment).
**Ordinal:** 4

#### Visuals

| # | Visual Type | Category (X-axis) | Series / Legend | Values (Y-axis) | Description |
|---|-------------|-------------------|-----------------|-----------------|-------------|
| 1–4 | **Slicers** | — | — | Subregion, Group of Regions, Destination, Opportunity Owner, Final Quarter | 5 filter slicers |
| 5 | **Column Chart** | Snapshot Week (W03…W12) | Funnel Evolution (Q1, Q2, Q3, Q4, OIT, Closed) | Sum(Amount in EUR) | Unweighted EUR by funnel evolution stage per week |
| 6 | **Group Container** | — | — | — | Grouping |
| 7 | **Image** | — | — | — | Agfa logo |

#### Page-Level Filters
None.

#### Visual-Level Filters (on Column Chart)
| Field | Type |
|-------|------|
| Funnel Evolution | Categorical (open) |

---

### Page 7 — KAM FC
**Purpose:** Forecast by Key Account Manager (KAM) — unweighted EUR pivot across snapshot weeks.
**Ordinal:** 5

#### Visuals

| # | Visual Type | Rows | Columns | Values | Description |
|---|-------------|------|---------|--------|-------------|
| 1–4 | **Slicers** | — | — | Subregion, Group of Regions, Destination, Opportunity Owner, Final Quarter | 5 filter slicers |
| 5 | **Pivot Table** | Rows: Opportunity Owner (KAM name) | Columns: Snapshot Week | Values: Sum(Amount in EUR) | KAM-level unweighted FC across weeks |
| 6 | **Group Container** | — | — | — | |
| 7 | **Image** | — | — | — | Agfa logo |

#### Page-Level Filters
None.

#### Visual-Level Filters (on Pivot Table)
| Field | Type |
|-------|------|
| Flag | Categorical (open) |
| Feasibility | Advanced (open) |
| Opportunity Owner | Categorical (open) |
| Snapshot Week | Categorical (open) |

---

### Page 8 — KAM Funnel
**Purpose:** Side-by-side weighted and unweighted funnel by KAM across snapshot weeks.
**Ordinal:** 6

#### Visuals

| # | Visual Type | Rows | Columns | Values | Description |
|---|-------------|------|---------|--------|-------------|
| 1–4 | **Slicers** | — | — | Subregion, Group of Regions, Destination, Opportunity Owner, Final Quarter | 5 filter slicers |
| 5 | **Pivot Table** | Rows: Opportunity Owner | Columns: Snapshot Week | Values: Sum(Amount in EUR) + Sum(Weighted Amount in EUR) | KAM comparison: unweighted vs weighted EUR per week |
| 6 | **Group Container** | — | — | — | |
| 7 | **Image** | — | — | — | Agfa logo |

#### Page-Level Filters
None.

#### Visual-Level Filters
None specific (slicers control globally).

---

### Page 9 — FC Chart
**Purpose:** Visual trend of forecast EUR amounts by flag category across snapshot weeks (area chart).
**Ordinal:** 7

#### Visuals

| # | Visual Type | Category (X-axis) | Series / Legend | Values (Y-axis) | Description |
|---|-------------|-------------------|-----------------|-----------------|-------------|
| 1–2 | **Slicers** | — | — | Final Quarter, Forecast Flag, Subregion, Group of Regions | 4 filter slicers |
| 3 | **Text Box** | — | — | — | Page header |
| 4 | **Group Container** | — | — | — | |
| 5 | **Image** | — | — | — | Agfa logo |
| 6 | **Stacked Area Chart** | Snapshot Week (W03…W12) | Flag (1. Won … 6. Excluded) | Sum(Amount in EUR) | Weekly trend of total EUR by forecast flag — stacked to show overall funnel build-up |

#### Page-Level Filters
None.

#### Visual-Level Filters
| Field | Type |
|-------|------|
| Final Quarter | Categorical (open) |
| Sales Stage | Categorical (open — hidden) |

---

### Page 10 — Opp List
**Purpose:** Full opportunity-level detail table — drill-through/lookup view for individual deals.
**Ordinal:** 9

#### Visuals

| # | Visual Type | Columns Displayed | Description |
|---|-------------|------------------|-------------|
| 1 | **Table (tableEx)** | Snapshot Week, Group of Regions, Subregion, Destination, Opportunity ID, Opportunity Name, Sales Stage, Sub Sales Stage, Target Date - Quarter, Pl# Order Int# Date, Requested Delivery Date, Closed Date, Sold-to Party, Sold-to Party Name, Act# Order Int# Date, Opportunity Owner, Amount in EUR, Weighted Amount in EUR, Opportunity Status, Forecast Flag | 20-column flat table with all opportunity details |
| 2 | **Slicer** | — | Final Quarter |
| 3 | **Slicer** | — | Snapshot Week |
| 4 | **Slicer** | — | Forecast Flag |

#### Page-Level Filters
None.

#### Visual-Level Filters (on Table)
| Field | Type |
|-------|------|
| Opportunity Owner | Categorical (open) |

---

### Page 11 — New Opportunities *(note: "New Oppturnities" — typo in report)*
**Purpose:** Track new opportunities created each week — volume (count) vs weighted value trend.
**Ordinal:** 10

#### Visuals

| # | Visual Type | Category (X-axis) | Y-axis (Columns) | Y2-axis (Line) | Description |
|---|-------------|-------------------|--------------------|-----------------|-------------|
| 1–5 | **Slicers** | — | — | — | Opportunity Owner, Destination, Subregion, Group of Regions, Final Quarter, Feasibility (6 slicers) |
| 6 | **Line + Stacked Column Combo Chart** | Snapshot Week | Sum(Weighted Amount in EUR) | Sum(New Opp Created This Week) | Bars = weighted EUR of new opps per week; Line = count of new opps created |

#### Page-Level Filters
| Field | Type | Value |
|-------|------|-------|
| New Opp Created This Week | Categorical | `1` (only shows weeks with new opportunities) |

#### Visual-Level Filters (Slicers)
| Field | Type |
|-------|------|
| Sales Stage | Categorical (open — hidden) |

---

### Page 12 — RawData
**Purpose:** Diagnostic / data quality page — raw table dump for validation.
**Ordinal:** 11 (last tab)

#### Visuals

| # | Visual Type | Columns Displayed | Description |
|---|-------------|------------------|-------------|
| 1 | **Table (tableEx)** | Amount in EUR, Cal Quarter, Check Staging, Closed Date, Final Quarter, Flag, Forecast Flag, Location, Overdue, Risk Opp, Target Date - Quarter, Weeknumber, Win Percentage, Weighted Amount in EUR | 14 diagnostic columns for data quality checks |

#### Page-Level Filters
None.

#### Visual-Level Filters
None.

---

---

## 1.8 Slicer Summary — All Pages

| Slicer Field | Pages Where Present |
|-------------|---------------------|
| Final Quarter | All pages (1–11) |
| Snapshot Week | Pages 1, 10 |
| Group of Regions | Pages 2, 3, 4, 5, 6, 7, 8, 9, 11 |
| Subregion | Pages 2, 3, 4, 5, 6, 7, 8, 9, 11 |
| Destination | Pages 2, 3, 4, 5, 6, 7, 8, 11 |
| Opportunity Owner | Pages 2, 3, 4, 5, 6, 7, 8, 11 |
| Forecast Flag | Pages 9, 10 |
| Feasibility | Page 11 only |

---

## 1.9 Key Domain Reference

### Forecast Flag Hierarchy
| Flag (ordered) | Forecast Flag (label) | Meaning |
|----------------|----------------------|---------|
| 1. Won | Won | Deal closed — order received |
| 2. Included and Secured | Included and Secured | High confidence inclusion |
| 3. Included | Included | Standard FC inclusion |
| 4. Included with Risk | Included with Risk | Included but risk flagged |
| 5. Upside | Upside | Possible but not committed |
| 6. Excluded | Excluded / Pipeline | Outside current FC period |

### Regional Hierarchy
```
Group of Regions
├── Europe-Pacific
│   └── Subregions: DACH, Europe East & South, Europe North, Iberia, Oceania, Hong Kong,
│       Asean, Rest Of ASPAC South, Key Accounts, Dealer
├── Intercontinental
│   └── Subregions: Africa, Brazil, India, Middle East & Other Africa, North LATAM,
│       South LATAM, Mexico, New Business Development
└── North America
    └── Subregions: Canada, USA, DoD, Govt-Other
```

### Sales Stage Flow
`Identifying` → `Qualifying` → `Quoting` → `Negotiating` → `Closing` / `4-Close` → Won/Lost

---

*End of Commercial Analytics - Weekly FC Tracker documentation.*

---

---

# 2. Partner Dashboard

**File:** `Dashboards2/Partner Dashboard.pbix`
**Created From:** Power BI Cloud (Service) — Release 2025.04
**Dataset ID:** `c261a03f-dff8-4d53-b37a-9fc788e695c9`
**Report ID:** `aca10eb4-1395-4fec-96fb-9af489c2da3e`

---

## 2.1 Data Model

### Tables Overview

| # | Table Name | Type | Rows | Columns | Source |
|---|------------|------|------|---------|--------|
| 1 | FeedFile | Fact (Central) | ~1,082,674 | 44 | SAP (AP7) — sales transactions |
| 2 | BudgetClassGroup xl | Dimension | 16 | 2 | Excel — Budget Class grouping lookup |
| 3 | DealerList xl | Dimension | 754 | 10 | Excel — Partner/dealer master |
| 4 | DealerList_TargetSetting xl | Dimension / Budget | 3,928 | 12 | Excel — Dealer-level targets & forecasts |
| 5 | ProductFamilyList xl | Dimension | 94 | 11 | Excel — Product Family master |
| 6 | Region partner dashboard xl | Dimension | 278 | 8 | Excel — Country-to-region mapping |
| 7 | MonthQuarter xl | Dimension | 12 | 4 | Excel — Month/Quarter reference |
| 8 | Implementation_HourlyRate xl | Dimension | 152 | 5 | Excel — Hourly rates by country/year |
| 9 | AP2 customers | Dimension | 603 | 5 | Lookup — AP2 customer channel classification |
| 10 | MarginSecurity | Calculated / RLS | — | — | Row-level security or margin access control |
| 11 | DimCalendar | Calculated Date Table | — | — | Auto-generated calendar dimension |

> **Note:** `MarginSecurity` and `DimCalendar` are in-model tables not extracted to CSV (likely calculated/DAX tables or RLS tables).

---

### Table 1: `FeedFile` (Fact Table)
**Grain:** One row per SAP line item (sales transaction / document line)

| # | Column | Data Type | Description / Domain |
|---|--------|-----------|----------------------|
| 1 | Posting Date | Date | SAP posting date |
| 2 | Destination | Text | Country/destination of sale |
| 3 | Sales Organization | Text | SAP sales org code (e.g. AR01, DE01, FR60, GB01 — 16 unique) |
| 4 | Country | Text | Country |
| 5 | Bill-to party | Text (ID) | SAP bill-to customer ID |
| 6 | Bill-to Country | Text | Bill-to customer country |
| 7 | Channel | Text | Sales channel (direct/indirect) |
| 8 | Ship-To Party | Text | SAP ship-to party ID |
| 9 | Ship-to Country | Text | Ship-to country |
| 10 | Bill-to Customer Updated in APX | Text | APX-classified customer name/ID |
| 11 | Sale Document Nr. | Text | SAP sales document number |
| 12 | Sale Document Nr._1 | Text | Alternate document reference |
| 13 | Sales doc. type | Text | SAP document type (e.g. Contract DMR (SNow)) |
| 14 | Budget Class | Text | Product budget class (8 values: CR Products, DR Products, DR 3rd Parties, FPS Classics, FPS General, FPS Hardcopy, K2, K4) |
| 15 | Product Family | Text | Product Family code |
| 16 | Product Family Name | Text | Product Family display name |
| 17 | Reporting UoM PF | Text | Reporting unit of measure for product family |
| 18 | UoM PF Name | Text | UoM description |
| 19 | Material | Text | SAP material number |
| 20 | MSP | Text | MSP flag/code |
| 21 | Unit | Numeric | Sales quantity (in reporting UoM) |
| 22 | CAR Unit of Measure | Text | CAR system UoM |
| 23 | CAR UoM Name | Text | CAR UoM name |
| 24 | General it. cat. gr. | Text | Item category group (e.g. AS Service packages) |
| 25 | Channel Manager | Text | Channel manager ID |
| 26 | Channel Manager Name | Text | Channel manager name |
| 27 | Net Turnover EUR | Numeric (decimal) | Net revenue in EUR |
| 28 | Sales Quantity PC | Numeric | Sales quantity in pieces |
| 29 | Quantity (alt. UoM) | Numeric | Quantity in alternate UoM |
| 30 | Calculated Cost DR CR | Numeric | Calculated cost (DR/CR method) |
| 31 | Calculated Cost PFS | Numeric | Calculated cost (PFS method) |
| 32 | Calculated Cost APX | Numeric | Calculated cost (APX method — used for margin) |
| 33 | Cost+ | Numeric | Cost-plus pricing reference |
| 34 | Year | Numeric | Calendar year (2023–2026) |
| 35 | Month | Numeric | Month number (1–12) |
| 36 | Quarter | Numeric | Quarter number (1–4) |
| 37 | Source.Name | Text | Source file name |
| 38 | source | Text | Source system code |
| 39 | yr-mnth | Text | Year-month key (YYYY-MM) |
| 40 | SAP channel | Text | SAP channel code: `#-Not assigned`, `01-Dealer`, `04-Direct`, `05-Agfa` |
| 41 | source_ | Text | Clean source identifier (e.g. AP7) |
| 42 | SAP channel_ | Text | Clean channel label (same domain as SAP channel) |
| 43 | Bill-to Party Name | Text | Customer name |
| 44 | Customer ID and Name | Text | Combined customer ID + name field |

---

### Table 2: `BudgetClassGroup xl` (Dimension)
**Grain:** One row per Budget Class

| Column | Data Type | Values |
|--------|-----------|--------|
| Budget Class | Text | CR Products, CR/MOD General, CR Solutions, DR 3rd Parties, DR Products, DR Solutions, FPS Classics, FPS General, FPS Hardcopy, HE General, IMG General, IMPAX, K2, K4, Not assigned, RadIT maintain |
| Budget Class Group | Text | **CR Products**, **DR Products**, **FPS** (FPS Classics, FPS Hardcopy, FPS General, IMG General, HE General, IMPAX, RadIT maintain, Not assigned) |

---

### Table 3: `DealerList xl` (Dimension — Partner Master)
**Grain:** One row per dealer/partner

| Column | Data Type | Description |
|--------|-----------|-------------|
| Dealer Market | Text | Market region (e.g. North America, Europe) |
| Dealer SAP ID | Text | SAP partner ID (numeric) |
| SAP ID (TEXT) | Text | SAP ID as text |
| September 2023 updated in APX | Text | APX channel classification (e.g. Indirect Sales (Dealer)) |
| Channel Manager ID | Text | Responsible channel manager ID |
| Channel Manager Name | Text | Responsible channel manager name |
| Dealer Type | Text | Partner type (e.g. Dealer) |
| SAP channel | Text | SAP channel code (01, 04, 05) |
| SAP channel name | Text | SAP channel name (Dealer, Direct, Agfa) |
| sales last 2yr | Text | Flag: `YES`/`NO` — had sales in last 2 years |

---

### Table 4: `DealerList_TargetSetting xl` (Budget / Target Table)
**Grain:** One row per Dealer × Year × Month × Type × Budget Class

| Column | Data Type | Description |
|--------|-----------|-------------|
| Dealer Market | Text | Market region |
| Country | Text | Dealer country |
| Country Code | Text | ISO country code |
| Dealer SAP ID | Text | SAP partner ID |
| SAP ID (TEXT) | Text | Text version |
| Target Year | Numeric | Budget year |
| Target Month | Numeric | Budget month |
| Target Quarter | Numeric | Budget quarter |
| Target | Numeric (EUR) | Dealer sales target in EUR |
| Forecast | Numeric (EUR) | Dealer forecast in EUR |
| Type | Text | Revenue type (Goods, Implementation, Support) |
| Budget Class | Text | Budget class of the target |

---

### Table 5: `ProductFamilyList xl` (Dimension — Product Master)
**Grain:** One row per Product Family

| Column | Data Type | Description |
|--------|-----------|-------------|
| Budget Class | Text | Budget class of the product family |
| Product Family | Text | Product Family code |
| PF Name | Text | Product Family name |
| M Type Name | Text | Material type name |
| Modality | Text | Medical imaging modality |
| General it. cat. gr. | Text | Item category group |
| Functional area | Text | Business functional area |
| TYPE | Text | Revenue type: `Goods`, `Implementation`, `Support` |
| Main Equipment | Text | `Yes`/`No` — is this a main equipment product |
| Group | Text | Product grouping |
| UOM | Text | Unit of measure |

---

### Table 6: `Region partner dashboard xl` (Dimension — Geography)
**Grain:** One row per Country/Destination

| Column | Data Type | Description |
|--------|-----------|-------------|
| Country Code | Text | ISO country code |
| Destination | Text | SAP destination key |
| Report Country | Text | Reporting country name |
| Description | Text | Country description |
| Report Group Region | Text | Top-level: `Europe-Pacific`, `Intercontinental`, `North America`, `Not assigned` |
| IMG SubReg | Text | IMG subregion code |
| Report Sub-region | Text | 20 sub-regions (Africa, Asean, Brazil, Canada, China, DACH, Europe East & South, Europe North, Hong Kong, Iberia, India, Mexico, Middle East & Other Africa, North LATAM, Oceania, Rest Of ASPAC North, Rest Of ASPAC South, Rest of World others, South LATAM, USA) |
| Fixed Destination | Text | Normalized destination name for reporting |

---

### Table 7: `MonthQuarter xl` (Dimension — Calendar Reference)
**Grain:** One row per month (12 rows)

| Column | Data Type | Values |
|--------|-----------|--------|
| Name of Month | Text | January–December |
| Month | Numeric | 1–12 |
| Name Quarter | Text | Q1–Q4 |
| Quarter | Numeric | 1–4 |

---

### Table 8: `Implementation_HourlyRate xl` (Dimension — Rate Reference)
**Grain:** One row per Destination × Calendar Year

| Column | Data Type | Description |
|--------|-----------|-------------|
| Destination | Text | Country destination |
| Country Code | Text | ISO country code |
| Sofon Rate Ctry Code | Text | Sofon pricing tool country code |
| Calendar Year | Numeric | Year |
| Hourly Rate EUR | Numeric | Implementation hourly rate in EUR |

---

### Table 9: `AP2 customers` (Dimension — Channel Lookup)
**Grain:** One row per Bill-to customer in AP2

| Column | Data Type | Description |
|--------|-----------|-------------|
| Bill-to party | Text | SAP customer ID |
| Bill-to Country | Text | Country |
| Bill-to Customer Updated in APX | Text | APX-classified customer label |
| sap channel | Text | Channel code |
| sap channel name | Text | Channel name (Dealer / Direct / Agfa) |

---

### Table 10: `MarginSecurity` (RLS / Security Table)
In-model calculated table. Not extracted. Used for row-level security on the Margin page — controls which users can see which regions/partners' margin data.

---

### Table 11: `DimCalendar` (Calculated Date Table)
In-model DAX date table. Not extracted. Provides `Year → Quarter → Month → Date` hierarchy used as `FeedFile.Posting Date.Variation.Date Hierarchy` in visuals.

---

### Table 12: `Sheet1` (Referenced in Visuals)
Referenced in pivot table `Rows: Sheet1.TYPE` on Sales YTD, Sales FY, and Partner Performance pages. Likely a separate Excel query sheet containing product TYPE groupings (Goods / Implementation / Support) used for the revenue type pivot row.

---

## 2.2 Table Relationships & Cardinality

> Relationships inferred from column name matching and visual query patterns (DataModel is XPress9-compressed).

| From Table (Many side) | From Column | To Table (One side) | To Column | Cardinality | Cross-filter | Notes |
|------------------------|-------------|---------------------|-----------|-------------|--------------|-------|
| FeedFile | Budget Class | BudgetClassGroup xl | Budget Class | Many → One | Single | Groups raw BC into FPS / DR Products / CR Products |
| FeedFile | Product Family | ProductFamilyList xl | Product Family | Many → One | Single | Links to product type, modality, main equipment flag |
| FeedFile | Bill-to party | DealerList xl | Dealer SAP ID | Many → One | Single | Links transactions to partner master |
| FeedFile | Bill-to party | AP2 customers | Bill-to party | Many → One | Single | Alternate channel classification for AP2 customers |
| FeedFile | Destination | Region partner dashboard xl | Destination | Many → One | Single | Enriches with region/subregion hierarchy |
| FeedFile | Month | MonthQuarter xl | Month | Many → One | Single | Month name and quarter label lookup |
| FeedFile | Posting Date | DimCalendar | Date | Many → One | Single | Date dimension for Year/Quarter/Month drill-down |
| FeedFile | Destination + Year | Implementation_HourlyRate xl | Destination + Calendar Year | Many → One | Single | Hourly rate for implementation cost calc |
| DealerList xl | Dealer SAP ID | DealerList_TargetSetting xl | Dealer SAP ID | One → Many | Single | Target/forecast budget linked to dealer |
| FeedFile | — | MarginSecurity | — | — | RLS | Row-level security filter |

**Hierarchies defined in model:**
- `FeedFile.Posting Date.Variation.Date Hierarchy`: Year → Quarter → Month → Date (via DimCalendar)
- `FeedFile.Destination Hierarchy`: Destination → Bill-to party → Bill-to Party Name (drill-down in partner pages)
- `DimRegion.Report Group Region Hierarchy`: Report Group Region → Report Sub-region → Fixed Destination (via Region table)
- `DealerList_TargetSetting xl.Target Year Hierarchy`: Target Year → Target Quarter → Target Month

---

## 2.3 Measures

> Implicit and explicit measures visible in the report.

| Measure Name | Table / Context | DAX Expression (inferred) | Used On Pages |
|-------------|----------------|--------------------------|---------------|
| Sum(FeedFile.Net Turnover EUR) | FeedFile | `SUM(FeedFile[Net Turnover EUR])` | All pages |
| Sum(FeedFile.Unit) | FeedFile | `SUM(FeedFile[Unit])` | Sales YTD, Sales FY, Sales Evolution, Partner YTD, Partner FY, Partner Evolution |
| Sum(DimDealerTargetSetting.Target) | DealerList_TargetSetting xl | `SUM(DealerList_TargetSetting xl[Target])` | Indirect Target CY, Sales YTD, Partner YTD, Partner FY, Partner Evolution |
| Sum(FeedFile.Calculated Cost APX) | FeedFile | `SUM(FeedFile[Calculated Cost APX])` | Margin |
| Min(FeedFile.Destination) | FeedFile | `MIN(FeedFile[Destination])` | Top 5 Partners, Margin (partner info column) |
| Min(FeedFile.Channel Manager Name) | FeedFile | `MIN(FeedFile[Channel Manager Name])` | Top 5 Partners, Margin |
| FeedFile.Net Turnover EUR for 2025 | FeedFile | `CALCULATE(SUM(FeedFile[Net Turnover EUR]), FeedFile[Year]=2025)` | Sales YTD (comparison pivot) |
| FeedFile.Net Turnover EUR for 2026 | FeedFile | `CALCULATE(SUM(FeedFile[Net Turnover EUR]), FeedFile[Year]=2026)` | Sales YTD (comparison pivot) |
| FeedFile.Net Turnover EUR for 2024 | FeedFile | `CALCULATE(SUM(FeedFile[Net Turnover EUR]), FeedFile[Year]=2024)` | Sales FY (comparison pivot) |
| FeedFile.Net Turnover EUR % difference from 2025 | FeedFile | `DIVIDE([NTO 2026] - [NTO 2025], [NTO 2025])` | Sales YTD pivot |
| FeedFile.Net Turnover EUR % difference from 2024 | FeedFile | `DIVIDE([NTO 2025] - [NTO 2024], [NTO 2024])` | Sales FY pivot |
| FeedFile.Net Turnover EUR Y-1 | FeedFile | `CALCULATE(SUM(...), SAMEPERIODLASTYEAR(...))` or offset year | Sales Evolution |
| DimBCGroup.Net Turnover EUR minus Calculated Cost APX divided by Net Turnover EUR | BudgetClassGroup xl | `DIVIDE(SUM(FeedFile[Net Turnover EUR]) - SUM(FeedFile[Calculated Cost APX]), SUM(FeedFile[Net Turnover EUR]))` | Margin (margin % KPI cards) |

---

## 2.4 Calculated Columns

| Column | Table | Derivation |
|--------|-------|-----------|
| source_ | FeedFile | Cleaned version of `source` field — SAP system identifier |
| SAP channel_ | FeedFile | Cleaned/display version of `SAP channel` (e.g. `01-Dealer`) |
| yr-mnth | FeedFile | Concatenated year-month key from `Year` and `Month` |
| Customer ID and Name | FeedFile | Combined `Bill-to party` + `Bill-to Party Name` for slicer display |
| Fixed Destination | Region partner dashboard xl | Normalized destination name aligned across source systems |
| sales last 2yr | DealerList xl | YES/NO flag based on whether the dealer had transactions in last 2 fiscal years |

---

## 2.5 Calculated Tables

| Table | Purpose |
|-------|---------|
| DimCalendar | Full date table (auto or DAX-generated) powering `Posting Date` drill hierarchy |
| MarginSecurity | RLS-based security table controlling Margin page visibility by user/role |

---

---

## 2.6 Report-Level Filters (Applied Across All Pages)

| Field | Table | Filter Type | Applied Values |
|-------|-------|-------------|----------------|
| Budget Class Group | BudgetClassGroup xl | Categorical | Open (all values visible) |
| Report Group Region | Region partner dashboard xl | Categorical | Open (all regions visible) |
| TYPE | ProductFamilyList xl | Categorical | Open (Goods / Implementation / Support) |

---

---

## 2.7 Page-by-Page Detail

---

### Page 1 — SAP Channel Check
**Purpose:** Data quality / channel validation — verify SAP channel assignments for partners.
**Ordinal:** 10

#### Visuals

| # | Visual Type | Columns / Fields | Description |
|---|-------------|-----------------|-------------|
| 1 | **Slicer** | FeedFile.Bill-to Country | Filter by country |
| 2 | **Slicer** | FeedFile.source_ | Filter by SAP source system |
| 3 | **Slicer** | FeedFile.SAP channel | Filter by channel type |
| 4 | **Slicer** | FeedFile.Year | Filter by year |
| 5 | **Table** | Bill-to party, Bill-to Party Name, Bill-to Country, Channel Manager Name, source_, SAP channel, Bill-to Customer Updated in APX | Customer × channel assignment validation table |

#### Page-Level Filters
None.

---

### Page 2 — Indirect Target CY
**Purpose:** Current Year (CY) indirect channel target vs actual performance by destination and product.
**Ordinal:** 0 (first tab)

#### Visuals

| # | Visual Type | Role | Fields | Description |
|---|-------------|------|--------|-------------|
| 1 | **Slicer** | Filter | DimBCGroup.Budget Class Group | Filter: FPS / DR Products / CR Products |
| 2 | **Slicer** | Filter | DimPF.TYPE | Filter: Goods / Implementation / Support |
| 3 | **Slicer** | Filter | DimRegion.Report Group Region Hierarchy | Hierarchical region filter (Region → Sub-region → Fixed Destination) |
| 4 | **Slicer** | Filter | FeedFile.SAP channel_ | Channel type filter |
| 5 | **Slicer** | Filter | FeedFile.Customer ID and Name | Partner/customer search slicer |
| 6 | **Pivot Table** | Main | Rows: Destination Hierarchy (Destination → Bill-to party → Bill-to Party Name); Columns: Month; Values: Sum(Target), Sum(Net Turnover EUR) | Target vs actual by destination, monthly drill-down |
| 7 | **Bar Chart** | Supporting | Category: Budget Class; Values: Sum(Net Turnover EUR); Series: Budget Class Group | Revenue by budget class, coloured by group |
| 8 | **Clustered Bar Chart** | Supporting | Category: Year; Values: Sum(Net Turnover EUR); Series: TYPE | Revenue split by Goods / Implementation / Support vs prior year |
| 9 | **Custom Visual (PBI_CV_0B9C9FBA)** | KPI | actualMeasure: Sum(Net Turnover EUR); previousYearMeasure: Sum(Target); category: Year | Year-over-year vs target KPI gauge / comparison visual |
| 10 | **Clustered Column Chart** | Detail | Category: Destination Hierarchy + Month; Values: Sum(DimDealerTargetSetting.Target) | Monthly target breakdown by destination |
| 11 | **Text Boxes (×2)** | Labels | — | Page title and subtitle |
| 12 | **Image** | Branding | — | Agfa logo |

#### Page-Level Filters
| Field | Type | Value |
|-------|------|-------|
| Year | Categorical | `2026` (current year only) |
| (additional hidden filter) | Categorical | Open |
| DealerList_TargetSetting xl.Target Month | Categorical | Open |

---

### Page 3 — Sales YTD CY vs PY
**Purpose:** Year-to-date sales comparison: Current Year (2026) vs Prior Year (2025), by product family, budget class, and channel.
**Ordinal:** 1

#### Visuals

| # | Visual Type | Role | Fields | Description |
|---|-------------|------|--------|-------------|
| 1 | **Slicer** | Filter | FeedFile.SAP channel_ | Channel filter |
| 2 | **Slicer** | Filter | DimBCGroup.Budget Class Group | Budget class group filter |
| 3 | **Slicer** | Filter | DimRegion.Report Group Region Hierarchy | Region hierarchy filter |
| 4 | **Slicer** | Filter | DimPF.TYPE | Revenue type filter |
| 5 | **Clustered Bar Chart** | FPS Products | Category: Product Family Name; Series: Year; Values: Sum(Unit) | Unit volumes for FPS Hardcopy / FPS Classics product families (filtered to DRYSTAR 5301, 5302, 5503, AXYS) |
| 6 | **Clustered Bar Chart** | CR Products | Category: Product Family Name; Series: Year; Values: Sum(Unit) | Unit volumes for CR Products (filtered to Main Equipment = Yes) |
| 7 | **Clustered Bar Chart** | DR Products | Category: Product Family Name; Series: Year; Values: Sum(Unit) | Unit volumes for DR Products (filtered to Main Equipment = Yes) |
| 8 | **Clustered Bar Chart** | Revenue by Type | Category: Year; Series: TYPE; Values: Sum(Net Turnover EUR) | Revenue split Goods / Impl / Support per year |
| 9 | **Column Chart** | Revenue by BC Group | Category: Budget Class Group + Year; Series: BC Group; Values: Sum(Net Turnover EUR) | Revenue comparison by budget class group |
| 10 | **100% Stacked Bar Chart** | Revenue Mix | Category: Year → Quarter → Month; Values: Sum(Net Turnover EUR); Series: Budget Class Group | Budget class mix evolution (percentage split) |
| 11 | **Pivot Table** | YTD Comparison | Rows: Sheet1.TYPE; Values: NTO 2025, NTO 2026, % diff from 2025 | Summary pivot: 2026 YTD vs 2025 YTD by revenue type |
| 12 | **Custom Visual (PBI_CV_0B9C9FBA)** | KPI | actualMeasure: Sum(Net Turnover EUR); previousYearMeasure: Sum(Target); category: Target Year + Year | Sales vs target KPI comparison |
| 13 | **Text Boxes (×2)** | Labels | — | Page title / period label |
| 14 | **Image** | Branding | — | Agfa logo |

#### Page-Level Filters
| Field | Type | Value |
|-------|------|-------|
| Year | Categorical | `2025`, `2026` |
| Month | Categorical | `January` (YTD filter — Jan to latest month) |
| DealerList_TargetSetting xl.Target Month | Categorical | Open |

#### Visual-Level Filters (key ones)
| Visual | Field | Value |
|--------|-------|-------|
| FPS Bar Chart | Product Family Name | DRYSTAR 5301, DRYSTAR 5302, Drystar 5503, Drystar AXYS |
| FPS Bar Chart | Budget Class Group | FPS Hardcopy, FPS Classics |
| CR Bar Chart | Budget Class Group | CR Products |
| DR Bar Chart | Budget Class Group | DR Products |
| All product bar charts | Main Equipment | Yes (main equipment only) |

---

### Page 4 — Sales FY PY vs PY-1
**Purpose:** Full Year (FY) comparison: Prior Year (2025) vs Year-Before-Prior (2024).
**Ordinal:** 2

#### Visuals

| # | Visual Type | Role | Fields | Description |
|---|-------------|------|--------|-------------|
| 1–4 | **Slicers** | Filters | SAP channel_, Budget Class Group, Region Hierarchy, TYPE | Same 4 standard filters as all Sales pages |
| 5 | **Clustered Bar Chart** | FPS Products | Product Family Name × Year; Unit | FPS unit volumes — DRYSTAR 5301, 5302, 5503, AXYS |
| 6 | **Clustered Bar Chart** | CR Products | Product Family Name × Year; Unit | CR products — CR 12-X, CR 15-X |
| 7 | **Clustered Bar Chart** | DR Products | Product Family Name × Year; Unit | DR Products full year volume |
| 8 | **Clustered Bar Chart** | Revenue by Type | Year × TYPE; Net Turnover EUR | Goods / Impl / Support full year split |
| 9 | **Column Chart** | Revenue by BC Group | BC Group + Year; Net Turnover EUR | Full year BC group comparison |
| 10 | **100% Stacked Bar Chart** | Revenue Mix | Year; Net Turnover EUR; BC Group | Full year budget class mix % |
| 11 | **Pivot Table** | FY Comparison | Rows: Sheet1.TYPE; Values: NTO 2024, NTO 2025, % diff from 2024 | 2025 FY vs 2024 FY by revenue type |
| 12 | **Custom Visual (PBI_CV_0B9C9FBA)** | KPI | NTO vs Target; Year hierarchy | Full year sales vs target KPI |
| 13–14 | **Text Boxes** | Labels | — | Page title / year label |
| 15 | **Image** | Branding | — | Agfa logo |

#### Page-Level Filters
| Field | Type | Value |
|-------|------|-------|
| Year | Categorical | `2024`, `2025` |

---

### Page 5 — Sales Evolution
**Purpose:** Multi-year trend analysis of sales revenue, units, and budget class mix.
**Ordinal:** 3

#### Visuals

| # | Visual Type | Role | Fields | Description |
|---|-------------|------|--------|-------------|
| 1–4 | **Slicers** | Filters | SAP channel_, Budget Class Group, Region Hierarchy, TYPE | Standard 4 filters |
| 5 | **Clustered Bar Chart** | Unit Volume | Product Family Name × Year; Unit | Unit evolution by product family (Main Equipment only) |
| 6 | **Column Chart** | Revenue by BC Group | BC Group + Year; Net Turnover EUR | Revenue trend by budget class group over years |
| 7 | **Clustered Bar Chart** | Revenue by Type | Year × TYPE; Net Turnover EUR | Goods / Impl / Support revenue evolution |
| 8 | **Pivot Table** | Detailed Evolution | Rows: multiple dims; Columns: Year → Quarter → Month; Values: Net Turnover EUR | Full time-series pivot with monthly drill-down |
| 9 | **100% Stacked Bar Chart** | Mix Evolution | Year; Net Turnover EUR; BC Group | BC group mix percentage evolution |
| 10 | **Custom Visual (PBI_CV_0B9C9FBA)** | YoY KPI | NTO actual vs NTO Y-1; Year | Year-over-year revenue comparison |
| 11 | **Table** | Year Reference | Year column | Supporting reference table for year selection |
| 12 | **Text Box** | Label | — | Page title |
| 13 | **Image** | Branding | — | Agfa logo |

#### Page-Level Filters
None specific.

---

### Page 6 — Partner Performance YTD CY vs PY
**Purpose:** Partner-level revenue performance: Current Year YTD vs Prior Year YTD.
**Ordinal:** 4

#### Visuals

| # | Visual Type | Role | Fields | Description |
|---|-------------|------|--------|-------------|
| 1–4 | **Slicers** | Filters | SAP channel_, Budget Class Group, Region Hierarchy, TYPE | Standard 4 filters |
| 5 | **Pivot Table** | Partner Ranking | Rows: Bill-to Party Name → Bill-to party; Columns: Year; Values: Sum(Net Turnover EUR) | Partner revenue YTD: 2026 vs 2025 side-by-side |
| 6 | **100% Stacked Bar Chart** | BC Mix | Year; Net Turnover EUR; BC Group | YTD budget class mix comparison |
| 7 | **Column Chart** | BC Group Revenue | BC Group + Year; Net Turnover EUR | YTD BC group revenue comparison |
| 8 | **Clustered Bar Chart** | Revenue by Type | Year × TYPE; Net Turnover EUR | Goods / Impl / Support YTD split |
| 9 | **Pivot Table** | Summary by Type | Rows: Sheet1.TYPE; Columns: Year; Values: Net Turnover EUR | YTD revenue type pivot |
| 10 | **Clustered Bar Chart** | Unit Volumes | Product Family Name + Year; Unit (Main Equipment) | YTD unit volumes by product family |
| 11 | **Custom Visual (PBI_CV_0B9C9FBA)** | KPI | NTO vs Target; Year | Partner YTD vs target KPI |
| 12 | **Text Box** | Label | — | Page title |
| 13 | **Image** | Branding | — | Agfa logo |

#### Page-Level Filters
| Field | Type | Value |
|-------|------|-------|
| Year | Categorical | `2025`, `2026` |
| Month | Categorical | `January` (YTD filter) |
| DealerList_TargetSetting xl.Target Year | Categorical | Open |

#### Visual-Level Filters (key)
| Visual | Field | Value |
|--------|-------|-------|
| Bar charts / charts | Year | `2025`, `2026` (filtered to CY/PY only) |
| Unit bar chart | Main Equipment | Yes |

---

### Page 7 — Partner Performance FY PY vs PY-1
**Purpose:** Partner-level revenue: Prior Full Year (2025) vs Year Before (2024).
**Ordinal:** 5

#### Visuals

| # | Visual Type | Role | Fields | Description |
|---|-------------|------|--------|-------------|
| 1–4 | **Slicers** | Filters | SAP channel_, Budget Class Group, Region Hierarchy, TYPE | Standard 4 filters |
| 5 | **Pivot Table** | Partner FY | Rows: Bill-to Party Name; Columns: Year → Quarter → Month; Values: Net Turnover EUR | Partner revenue full-year monthly breakdown |
| 6 | **100% Stacked Bar Chart** | BC Mix | Year; Net Turnover EUR; BC Group | FY budget class mix |
| 7 | **Column Chart** | BC Group | BC Group + Year; Net Turnover EUR | FY BC group comparison |
| 8 | **Clustered Bar Chart** | Revenue by Type | Year × TYPE; Net Turnover EUR | Goods / Impl / Support FY comparison |
| 9 | **Pivot Table** | Summary by Type | Rows: Sheet1.TYPE; Columns: Year; Values: Net Turnover EUR | FY revenue type pivot |
| 10 | **Clustered Bar Chart** | Unit Volumes | Product Family Name × Year; Unit | FY unit volumes (Main Equipment only) |
| 11 | **Custom Visual (PBI_CV_0B9C9FBA)** | KPI | NTO vs Target; Year | FY performance KPI |
| 12 | **Text Box** | Label | — | Page title |
| 13 | **Image** | Branding | — | Agfa logo |

#### Page-Level Filters
| Field | Type | Value |
|-------|------|-------|
| Year | Categorical | `2024`, `2025` |

---

### Page 8 — Partner Performance Evolution
**Purpose:** Multi-year partner evolution — revenue, units, and margin trend over all available years.
**Ordinal:** 6

#### Visuals

| # | Visual Type | Role | Fields | Description |
|---|-------------|------|--------|-------------|
| 1–4 | **Slicers** | Filters | Budget Class Group, TYPE, Region Hierarchy (Region→Sub-region→Destination), SAP channel_ | 4 filters |
| 5 | **Slicer** | Filter | DealerList xl.Dealer Type | Partner type filter (Dealer / Direct / etc.) |
| 6 | **Slicer** | Filter | FeedFile.Bill-to Customer Updated in APX | Customer APX classification filter |
| 7 | **Clustered Bar Chart** | Unit Evolution | Product Family Name × Year; Unit (Main Equipment) | Multi-year unit volume by product family |
| 8 | **Pivot Table** | Partner Revenue | Rows: Bill-to Party Name; Columns: Year → Quarter → Month; Values: Net Turnover EUR | Full partner × time evolution pivot |
| 9 | **Clustered Bar Chart** | Revenue by Type | Year × TYPE; Net Turnover EUR | Revenue type evolution |
| 10 | **100% Stacked Bar Chart** | Mix Evolution | Year; Net Turnover EUR; BC Group | BC mix percentage evolution over years |
| 11 | **Pivot Table** | Revenue Detail | Rows: Bill-to Party Name → Bill-to party (with Bill-to Party Name column ref); Columns: Year → Quarter → Month | Detailed partner drill-down |
| 12 | **Column Chart** | BC Group Evolution | BC Group + Year; Net Turnover EUR | Multi-year BC group revenue trend |
| 13 | **Custom Visual (PBI_CV_0B9C9FBA)** | KPI | NTO actual vs planned target; Year | Multi-year vs target KPI |
| 14 | **Table** | Year Reference | Year | Supporting year lookup |
| 15 | **Action Button** | Navigation | — | Report navigation button |
| 16 | **Text Box** | Label | — | Page title |
| 17 | **Image** | Branding | — | Agfa logo |

#### Page-Level Filters
| Field | Type | Value |
|-------|------|-------|
| Year | Categorical | Open (all years visible) |

---

### Page 9 — Top 5 Partners
**Purpose:** Identify and rank top-performing partners by revenue for a selected period.
**Ordinal:** 7

#### Visuals

| # | Visual Type | Role | Fields | Description |
|---|-------------|------|--------|-------------|
| 1 | **Slicer** | Filter | Budget Class Group | BC group filter |
| 2 | **Slicer** | Filter | TYPE | Revenue type filter |
| 3 | **Slicer** | Filter | Region Hierarchy (Region → Sub-region → Destination) | Region filter |
| 4 | **Slicer** | Filter | Year | Year selector |
| 5 | **Slicer** | Filter | Month | Month selector |
| 6 | **Slicer** | Filter | SAP channel_ | Channel filter |
| 7 | **Slicer** | Filter | DealerList xl.Dealer Type | Partner type filter |
| 8 | **Slicer** | Filter | Bill-to Customer Updated in APX | Customer APX filter |
| 9 | **Pivot Table** | Ranking | Rows: Bill-to Party Name → Bill-to party; Values: Min(Destination), Min(Channel Manager Name), Sum(Net Turnover EUR) | Ranked partner list with country, manager, and revenue |
| 10 | **Packed Bubble Chart** | Visual | measure: Sum(Net Turnover EUR); category: Bill-to Party Name | Bubble chart — size = revenue — showing relative partner importance |
| 11 | **Text Box** | Label | — | Page title |
| 12 | **Image** | Branding | — | Agfa logo |

#### Page-Level Filters
None.

---

### Page 10 — Margin
**Purpose:** Gross margin analysis by partner and budget class — revenue vs calculated cost (APX method).
**Ordinal:** 8

#### Visuals

| # | Visual Type | Role | Fields | Description |
|---|-------------|------|--------|-------------|
| 1 | **Slicer** | Filter | Budget Class Group | BC group filter |
| 2 | **Slicer** | Filter | TYPE | Revenue type filter (pre-set to `Goods` only via page filter) |
| 3 | **Slicer** | Filter | Region Hierarchy | Region filter |
| 4 | **Slicer** | Filter | Year | Year |
| 5 | **Slicer** | Filter | Month | Month |
| 6 | **Slicer** | Filter | SAP channel_ | Channel |
| 7 | **Slicer** | Filter | Dealer Type | Partner type |
| 8 | **Slicer** | Filter | Bill-to Customer Updated in APX | Customer filter |
| 9 | **Line Chart** | Margin Trend | Category: Year → Quarter → Month; Values: (margin metrics) | Monthly margin trend line |
| 10 | **Pivot Table** | Margin Detail | Rows: Bill-to Party Name + Channel Manager; Values: Min(Destination), Min(Channel Manager Name), Sum(Net Turnover EUR), Sum(Calculated Cost APX), Margin % | Partner-level margin breakdown |
| 11 | **Card Visual — FPS** | KPI | Sum(Net Turnover EUR), Margin % | FPS group margin KPI card |
| 12 | **Card Visual — CR** | KPI | Sum(Net Turnover EUR), Margin % | CR Products margin KPI card |
| 13 | **Card Visual — DR** | KPI | Sum(Net Turnover EUR), Margin % | DR Products margin KPI card |
| 14 | **Text Box** | Label | — | Page title |
| 15 | **Image** | Branding | — | Agfa logo |

#### Page-Level Filters
| Field | Type | Value |
|-------|------|-------|
| ProductFamilyList xl.TYPE | Categorical | `Goods` (excludes Implementation and Support from margin calc) |

#### Visual-Level Filters (KPI Cards)
| Card | Budget Class Group Filter |
|------|--------------------------|
| FPS Card | FPS Classics, FPS Hardcopy |
| CR Card | CR Products |
| DR Card | DR Products |

---

### Page 11 — Remarks
**Purpose:** Free-text notes/commentary page for the report owner to add context.
**Ordinal:** 9

#### Visuals
| # | Visual Type | Description |
|---|-------------|-------------|
| 1 | **Text Box** | Large free-text remarks / notes area |
| 2 | **Image** | Agfa logo |
| 3 | **Text Box** | Additional label |

#### Page-Level Filters
| Field | Type | Value |
|-------|------|-------|
| Budget Class Group | Categorical | Open |
| Report Group Region | Categorical | Open |

---

### Page 12 — RawData
**Purpose:** Diagnostic data dump for validation of lookup/reference tables.
**Ordinal:** 11 (last tab)

#### Visuals
| # | Visual Type | Columns | Description |
|---|-------------|---------|-------------|
| 1 | **Table** | DealerList xl.Dealer Market, Dealer Name, sales last 2yr; BudgetClassGroup xl.Budget Class; DealerList_TargetSetting xl.Country, Forecast, Target, Target Year Hierarchy (Year → Quarter → Month), Type; Implementation_HourlyRate xl.Hourly Rate EUR; MonthQuarter xl.Quarter | Reference data validation table — shows dimension table contents side by side |

#### Page-Level Filters
None.

---

---

## 2.8 Slicer Summary — All Pages

| Slicer Field | Pages Where Present |
|-------------|---------------------|
| Budget Class Group | Pages 2–11 |
| TYPE (Goods/Impl/Support) | Pages 2–11 |
| Report Group Region Hierarchy | Pages 2–9 |
| SAP channel_ | Pages 1–9 |
| Year | Pages 1, 9, 10 |
| Month | Pages 9, 10 |
| Bill-to Country | Page 1 |
| source_ (SAP system) | Page 1 |
| SAP channel | Page 1 |
| Customer ID and Name | Page 2 |
| Dealer Type | Pages 8, 9, 10 |
| Bill-to Customer Updated in APX | Pages 8, 9, 10 |

---

## 2.9 Custom Visual Used

**Visual ID:** `PBI_CV_0B9C9FBA_15A2_4A94_8AE4_8F778869B200`
- Present on Pages 2, 3, 4, 5, 6, 7, 8
- **Roles:** `actualMeasure` (current NTO), `previousYearMeasure` (target or prior year NTO), `plannedMeasure` (planned target), `myCategory` (Year axis)
- **Purpose:** Year-over-year KPI comparison visual — likely a custom waterfall, bullet chart, or variance visual showing actual vs target/prior year.

---

## 2.10 Key Domain Reference

### Budget Class Groupings
| Budget Class Group | Budget Classes Included |
|-------------------|------------------------|
| **DR Products** | DR Products, DR 3rd Parties, DR Solutions, K4 |
| **CR Products** | CR Products, CR/MOD General, CR Solutions, K2 |
| **FPS** | FPS Hardcopy, FPS Classics, FPS General, IMG General, HE General, IMPAX, RadIT maintain, Not assigned |

### SAP Channel Codes
| Code | Name | Description |
|------|------|-------------|
| #-Not assigned | Not assigned | Unclassified channel |
| 01-Dealer | Dealer | Indirect sales via reseller partner |
| 04-Direct | Direct | Direct Agfa sales |
| 05-Agfa | Agfa | Internal Agfa entity |

### Revenue Type (TYPE)
| Type | Description |
|------|-------------|
| Goods | Physical equipment / product sales |
| Implementation | Installation and implementation services |
| Support | Maintenance / support contracts |

---

*End of Partner Dashboard documentation.*

---

---

# 3. Price Margin Modalities

**File:** `Dashboards2/Price Margin Modalities.pbix`
**Created From:** Power BI Cloud (Service) — Release 2025.04
**Dataset ID:** `37cb3f54-7595-46ce-b4e5-965bcc887713`
**Report ID:** `05312e9f-b339-43db-814c-d9953256b7ac`
**Canvas Size:** 1280 × 720 (all pages)

---

## 3.1 Data Model

### Tables Overview

| # | Table Name | Type | Description |
|---|------------|------|-------------|
| 1 | Q price realisation extra | Fact / Raw | Line-level price realization data — one row per sales document line (SAP source) |
| 2 | Q price realisation extra 2 | Aggregated View / Calculated | Pre-aggregated CY vs PY comparison view derived from table 1 |
| 3 | Q last refreshed | Metadata | Single-row table with last refresh timestamp |

> **Note:** Only `Q price realisation extra` appears as a physical node in the DiagramLayout. `Q price realisation extra 2` is likely a Power Query view or DAX calculated table that reshapes the same data into CY/PY measure pairs. The DataModel is XPress9-compressed (72 KB).

---

### Table 1: `Q price realisation extra` (Fact — Raw Line Level)
**Grain:** One row per SAP sales document line item

| # | Column | Data Type | Description |
|---|--------|-----------|-------------|
| 1 | posting date | Date | SAP posting date of the transaction |
| 2 | year-month | Text | Year-month key (YYYY-MM) |
| 3 | Year | Numeric | Calendar year |
| 4 | sales doc date | Date | Sales document creation date |
| 5 | sales doc deliv date | Date | Delivery date on sales document |
| 6 | sales document nr | Text | SAP sales document number |
| 7 | sales org | Text | SAP sales organization code |
| 8 | sales org name | Text | Sales organization name |
| 9 | destination | Text | Country/destination |
| 10 | subregion | Text | Subregion label |
| 11 | region | Text | Top-level region (Europe-Pacific, Intercontinental, North America) |
| 12 | modality | Text | Medical imaging modality (DR, CR, FPS, etc.) |
| 13 | material | Text | SAP material number |
| 14 | material name | Text | Material description |
| 15 | pf | Text | Product Family code |
| 16 | pf name | Text | Product Family name |
| 17 | functional area | Text | Functional area code |
| 18 | functional area group | Text | Functional area grouping (used as report-level filter — likely: Goods / Implementation / Support) |
| 19 | opportunity | Text | CRM opportunity ID |
| 20 | opportunity name | Text | CRM opportunity name |
| 21 | bill-to party | Text | SAP bill-to customer ID |
| 22 | bill-to party name | Text | Customer name |
| 23 | ship-to party | Text | SAP ship-to party ID |
| 24 | ship-to party name | Text | Ship-to customer name |
| 25 | base unit | Text | Base unit of measure |
| 26 | sales quantity | Numeric | Quantity in sales UoM |
| 27 | quantity | Numeric | Quantity in reporting UoM |
| 28 | regional list price | Numeric (EUR) | List price for the region (pre-discount) |
| 29 | lsp | Numeric (EUR) | List selling price |
| 30 | discount | Numeric (EUR) | Discount amount applied (negative) |
| 31 | net turnover eur | Numeric (EUR) | Net revenue = List Price − Discount |
| 32 | enp | Numeric (EUR) | Effective Net Price (actual price paid by customer) |
| 33 | sofon cost+ | Numeric (EUR) | Cost+ from Sofon pricing tool (standard cost baseline) |
| 34 | gross margin | Numeric (EUR) | Gross margin = Net Turnover − Sofon Cost+ |
| 35 | sales budget | Numeric (EUR) | Budgeted revenue for this line |
| 36 | qty budget | Numeric | Budgeted quantity |
| 37 | margin budget | Numeric (EUR) | Budgeted margin |

---

### Table 2: `Q price realisation extra 2` (Aggregated CY vs PY View)
**Grain:** Aggregated per Region × Subregion × Destination × Modality × Bill-to Party × Opportunity × Year
**Purpose:** Pre-computed Current Year (CY) and Prior Year (PY) metrics for side-by-side comparison in pivot tables and the waterfall chart.

| # | Column / Measure | Data Type | Description |
|---|-----------------|-----------|-------------|
| 1 | region | Text | Top-level region |
| 2 | subregion | Text | Subregion |
| 3 | destination | Text | Country/destination |
| 4 | modality | Text | Medical imaging modality |
| 5 | bill-to party | Text | Customer ID |
| 6 | bill-to party name | Text | Customer name |
| 7 | opportunity | Text | CRM opportunity ID |
| 8 | Year | Numeric | The selected/reference year |
| 9 | **Sales CY 2** | Numeric (EUR) | Net turnover EUR — Current Year |
| 10 | **Sales PY 2** | Numeric (EUR) | Net turnover EUR — Prior Year |
| 11 | **Qty CY 2** | Numeric | Quantity — Current Year |
| 12 | **Qty PY 2** | Numeric | Quantity — Prior Year |
| 13 | **Margin CY 2** | Numeric (EUR) | Gross margin — Current Year |
| 14 | **Margin PY 2** | Numeric (EUR) | Gross margin — Prior Year |
| 15 | **Margin % CY 2** | Numeric (%) | Gross margin % — Current Year |
| 16 | **Margin % PY 2** | Numeric (%) | Gross margin % — Prior Year |
| 17 | **Margin % BUD 2** | Numeric (%) | Gross margin % — Budget |
| 18 | **average enp 2** | Numeric (EUR) | Average Effective Net Price (CY) |
| 19 | **gross margin % 2** | Numeric (%) | Gross margin % (combined / display) |
| 20 | regional list price | Numeric (EUR) | List price (for waterfall) |
| 21 | discount | Numeric (EUR) | Discount (for waterfall) |
| 22 | net turnover eur | Numeric (EUR) | Net turnover (for waterfall) |
| 23 | sofon cost+ | Numeric (EUR) | Sofon cost+ (for waterfall) |
| 24 | gross margin | Numeric (EUR) | Gross margin (for waterfall) |
| 25 | quantity | Numeric | Total quantity |
| 26 | sales budget | Numeric (EUR) | Budget revenue |
| 27 | qty budget | Numeric | Budget quantity |
| 28 | margin budget | Numeric (EUR) | Budget margin |

---

### Table 3: `Q last refreshed` (Metadata)
**Grain:** 1 row

| Column | Data Type | Description |
|--------|-----------|-------------|
| Last Refreshed | DateTime | Timestamp of the last data refresh |

---

## 3.2 Table Relationships & Cardinality

| From | To | Cardinality | Notes |
|------|----|-------------|-------|
| Q price realisation extra | Q price realisation extra 2 | Derived | Table 2 is a reshaped/pivoted version of Table 1 — not a standard relationship. CY/PY columns computed via year offset logic in Power Query or DAX. |
| Q last refreshed | — | Independent | Standalone metadata table, not joined to fact data. |

> **Single-source model.** All analytical data derives from one SAP extract (`Q price realisation extra`). No separate dimension tables — all descriptive attributes (region, subregion, modality, customer) are denormalized into the fact table.

---

## 3.3 Measures

| Measure Name | Source Table | DAX / Logic (inferred) | Used On Pages |
|-------------|-------------|------------------------|---------------|
| Sum(regional list price) | Q price realisation extra 2 | `SUM([regional list price])` | Goods Waterfall, Raw Data |
| Sum(discount) | Q price realisation extra 2 | `SUM([discount])` — negative value | Goods Waterfall, Raw Data |
| Sum(net turnover eur) | Q price realisation extra 2 | `SUM([net turnover eur])` | All pages |
| Sum(sofon cost+) | Q price realisation extra 2 | `SUM([sofon cost+])` | Goods Waterfall, Raw Data |
| Sum(gross margin) | Q price realisation extra 2 | `SUM([gross margin])` = NTO − Cost+ | Goods Waterfall, Raw Data |
| Sum(quantity) | Q price realisation extra 2 | `SUM([quantity])` | Goods Waterfall |
| Sum(sales budget) | Q price realisation extra 2 | `SUM([sales budget])` | Overview, Goods Waterfall |
| Sum(qty budget) | Q price realisation extra 2 | `SUM([qty budget])` | Overview, Goods Waterfall |
| Sum(margin budget) | Q price realisation extra 2 | `SUM([margin budget])` | Overview |
| Sales CY 2 | Q price realisation extra 2 | `CALCULATE(SUM(NTO), year = selected year)` | Overview, Regions |
| Sales PY 2 | Q price realisation extra 2 | `CALCULATE(SUM(NTO), year = selected year − 1)` | Regions |
| Margin CY 2 | Q price realisation extra 2 | `CALCULATE(SUM(gross margin), year = CY)` | Overview, Regions |
| Margin PY 2 | Q price realisation extra 2 | `CALCULATE(SUM(gross margin), year = PY)` | Regions |
| Margin % CY 2 | Q price realisation extra 2 | `DIVIDE([Margin CY 2], [Sales CY 2])` | Overview, Regions |
| Margin % PY 2 | Q price realisation extra 2 | `DIVIDE([Margin PY 2], [Sales PY 2])` | Regions |
| Margin % BUD 2 | Q price realisation extra 2 | `DIVIDE([margin budget], [sales budget])` | Overview, Goods Waterfall |
| average enp 2 | Q price realisation extra 2 | `DIVIDE(SUM([enp]), SUM([quantity]))` | Goods Waterfall |
| gross margin % 2 | Q price realisation extra 2 | `DIVIDE(SUM([gross margin]), SUM([net turnover eur]))` | Goods Waterfall |
| Qty CY 2 | Q price realisation extra 2 | `CALCULATE(SUM([quantity]), year = CY)` | Overview, Regions |
| Qty PY 2 | Q price realisation extra 2 | `CALCULATE(SUM([quantity]), year = PY)` | Regions |
| Sum(enp) | Q price realisation extra | `SUM([enp])` | Raw Data |
| Sum(lsp) | Q price realisation extra | `SUM([lsp])` | Raw Data |
| Sum(sales quantity) | Q price realisation extra | `SUM([sales quantity])` | Raw Data |

---

## 3.4 Calculated Columns

| Column | Table | Derivation |
|--------|-------|------------|
| year-month | Q price realisation extra | Derived from `posting date` → formatted as YYYY-MM |
| Year | Q price realisation extra | Extracted year from `posting date` |
| gross margin | Q price realisation extra | `net turnover eur − sofon cost+` |
| functional area group | Q price realisation extra | Grouping of `functional area` — likely: Goods / Implementation / Support (aligns with Partner Dashboard TYPE field) |
| Sales CY 2, Sales PY 2, etc. | Q price realisation extra 2 | All CY/PY metrics computed as year-offset calculations from the base fact table |

---

## 3.5 Calculated Tables

| Table | Purpose |
|-------|---------|
| Q price realisation extra 2 | CY vs PY aggregated view — reshapes the raw fact data into parallel CY/PY column structure for side-by-side comparison in pivot tables |
| Q last refreshed | Single-row metadata table storing the latest data refresh timestamp |

---

---

## 3.6 Report-Level Filters (Applied Across All Pages)

| Field | Table | Filter Type | Applied Values |
|-------|-------|-------------|----------------|
| modality | Q price realisation extra | Categorical | Open (all modalities) |
| region | Q price realisation extra | Categorical | Open (all regions) |
| year-month | Q price realisation extra | Categorical | Open (used for time period scoping at page level) |
| functional area group | Q price realisation extra | Categorical | Open (Goods / Implementation / Support) |

---

---

## 3.7 Page-by-Page Detail

---

### Page 1 — Overview
**Purpose:** CY vs Budget comparison — price realization summary at region/modality/customer level.
**Ordinal:** 0 (first tab shown)

#### Visuals

| # | Visual Type | Rows | Columns | Values | Description |
|---|-------------|------|---------|--------|-------------|
| 1 | **Pivot Table** | Rows: Region → Modality → Subregion → Destination → Bill-to Party → Bill-to Party Name → Opportunity (full drill-down hierarchy) | — | Sales CY 2, Qty CY 2, Margin CY 2, Margin % CY 2, Sum(sales budget), Sum(qty budget), Sum(margin budget), Margin % BUD 2 | Full price realization detail: CY actuals vs Budget — drillable from region down to individual opportunity |
| 2 | **Slicer** | — | — | Region + Subregion (hierarchical) | Regional filter |
| 3 | **Slicer** | — | — | Year | Year selector |
| 4 | **Table** | — | — | Q last refreshed.Last Refreshed | Shows data freshness timestamp |

#### Page-Level Filters
| Field | Type | Value |
|-------|------|-------|
| year-month | Advanced | Open (scoped to selected Year via slicer) |

#### Visual-Level Filters (on Pivot Table)
All categorical filters are open (region, modality, subregion, destination, bill-to party, bill-to party name, opportunity) — controlled via slicers and report-level filters.

---

### Page 2 — Regions
**Purpose:** CY vs PY comparison — same structure as Overview but with prior year actuals instead of budget.
**Ordinal:** 1

#### Visuals

| # | Visual Type | Rows | Columns | Values | Description |
|---|-------------|------|---------|--------|-------------|
| 1 | **Pivot Table** | Rows: Region → Subregion → Destination → Modality → Bill-to Party → Bill-to Party Name → Opportunity | — | Sales CY 2, Qty CY 2, Margin CY 2, Margin % CY 2, Sales PY 2, Qty PY 2, Margin PY 2, Margin % PY 2 | CY vs PY side-by-side at every level of the region/modality/customer hierarchy |
| 2 | **Slicer** | — | — | Region + Subregion | Regional filter |
| 3 | **Slicer** | — | — | Year | Year selector (CY; PY computed as CY−1) |
| 4 | **Table** | — | — | Q last refreshed.Last Refreshed | Data freshness indicator |

#### Page-Level Filters
| Field | Type | Value |
|-------|------|-------|
| year-month | Advanced | Open (scoped by Year slicer) |

#### Visual-Level Filters (on Pivot Table)
All open — same categorical filters as Overview page.

---

### Page 3 — Goods Waterfall
**Purpose:** Price realization waterfall — decomposes revenue from List Price down to Gross Margin, with a modality-level pivot table and budget comparison.
**Ordinal:** 2

#### Visuals

| # | Visual Type | Fields | Description |
|---|-------------|--------|-------------|
| 1 | **Waterfall Chart (SimpleWaterfall)** | Measures (in order): Sum(regional list price), Sum(discount), Sum(net turnover eur), Sum(sofon cost+), Sum(gross margin) | **Price realization waterfall:** starts at List Price → subtracts Discount → lands on Net Turnover → subtracts Sofon Cost+ → arrives at Gross Margin. Visualizes where revenue is lost at each step. |
| 2 | **Pivot Table** | Rows: Modality; Values: Sum(regional list price), Sum(discount), Sum(net turnover eur), Sum(sofon cost+), Sum(gross margin), Sum(quantity), average enp 2, gross margin % 2, Sum(sales budget), Sum(qty budget), Margin % BUD 2 | Modality-level price breakdown with ENP, margin %, and budget comparison |
| 3 | **Slicer** | Year | Year selector |
| 4 | **Slicer** | Region + Subregion | Regional filter |

#### Page-Level Filters
| Field | Type | Value |
|-------|------|-------|
| functional area group | Categorical | Open — intended to be filtered to `Goods` (matches the page name) |

#### Visual-Level Filters
| Visual | Field | Value |
|--------|-------|-------|
| Waterfall | Advanced filters × 5 | Open (controlled by page/report filters) |
| Pivot Table | Modality | Open |

---

### Page 4 — Raw Data
**Purpose:** Full line-level data dump — diagnostic and export view for all underlying transactions.
**Ordinal:** 3 (last tab)

#### Visuals

| # | Visual Type | Columns | Description |
|---|-------------|---------|-------------|
| 1 | **Table** | destination, subregion, region, modality, material, material name, opportunity, opportunity name, pf, pf name, functional area group, sales document nr, Year, year-month, posting date, bill-to party, bill-to party name, sales org, sales org name, base unit, sales doc deliv date, sales doc date, ship-to party, ship-to party name, functional area, Sum(sales quantity), Sum(net turnover eur), Sum(regional list price), Sum(discount), Sum(sofon cost+), Sum(gross margin), Sum(enp), Sum(quantity), Sum(lsp), Sum(sales budget), Sum(qty budget), Sum(margin budget) | Complete 37-column raw data table — all descriptive and financial fields visible for data validation and export |

#### Page-Level Filters
None.

---

---

## 3.8 Slicer Summary — All Pages

| Slicer Field | Pages |
|-------------|-------|
| Year | Pages 1, 2, 3 |
| Region + Subregion (hierarchical) | Pages 1, 2, 3 |

---

## 3.9 Price Realization Logic

The core analytical concept in this report is **price realization** — the step-by-step decomposition from list price to gross margin:

```
Regional List Price (gross price from price book)
  − Discount (negotiated discount given to customer)
  = Net Turnover EUR (actual revenue booked in SAP)
  − Sofon Cost+ (standard cost from Sofon pricing tool)
  = Gross Margin EUR
```

**Key metrics:**
| Metric | Formula |
|--------|---------|
| Discount % | `Discount / Regional List Price` |
| Gross Margin % | `Gross Margin / Net Turnover EUR` |
| Average ENP | `SUM(enp) / SUM(quantity)` — average effective net price per unit |
| Margin % BUD | `margin budget / sales budget` |

---

## 3.10 Key Domain Reference

### Modalities
Imaging modalities tracked in this report (DR, CR, FPS, etc. — exact values dependent on the data extract).

### Functional Area Group
Aligns with Partner Dashboard `TYPE` field:
- `Goods` — Physical equipment sales (primary focus of Goods Waterfall page)
- `Implementation` — Installation services
- `Support` — Maintenance and support contracts

### Regional Hierarchy
Same structure as Partner Dashboard:
- `region` → `subregion` → `destination`
- Regions: Europe-Pacific, Intercontinental, North America

---

*End of Price Margin Modalities documentation.*

---

---

# 4. Commercial Analytics - OIT Margin & Product Mix 2026

**File:** `Dashboards1/Commercial Analytics - OIT Margin & Product Mix 2026.pbix`
**Created From:** Power BI Cloud (Service) — Release 2025.09
**Dataset ID:** `019c00e9-9026-4192-bdea-081c6c26625a`
**Report ID:** `d8d9f998-e25c-4a70-93ae-34e8f5955c01`
**Workspace:** `cafc0b2f-fd88-47eb-82aa-2158395532e0` (same workspace as Weekly FC Tracker)

---

## 4.1 Data Model

### Tables Overview

| # | Table Name | Type | Rows | Columns | Description |
|---|------------|------|------|---------|-------------|
| 1 | msd data | Fact (CRM) | 28,902 | 55 | Opportunity-level data from Dynamics 365 / MSD — enriched with region, product, margin fields |
| 2 | raw data | Fact (Budget) | 22,144 | 44 | Budget/standard price data — OIT actuals and targets at config level, 2026 only |
| 3 | opportunity | CRM Raw | 46,523 | 46 | Full opportunity extract from Dynamics 365 (unfiltered) |
| 4 | opportunityproduct | CRM Raw | 135,177 | 12 | Opportunity product line items (quote lines) from Dynamics 365 |
| 5 | account | CRM Lookup | 76,481 | 3 | Account master: SAP ID and country |
| 6 | mapping | Geography | 271 | 6 | Destination → IMG SubReg → IMG RegGrp → Report Region lookup |
| 7 | Topic map | Enrichment | 28,902 | 11 | Maps opportunity × region to Equipment type, Topic, FC category sort, weighted amount |
| 8 | New Cluster/ Region Table | Geography | 41 | 4 | Country → Region → Cluster → Area hierarchy |
| 9 | Region/ Cluster Slicer | Slicer Helper | 38 | 4 | Pre-built slicer values for REGION/CLUSTER/AREA filter |
| 10 | Quarter Slicer | Slicer Helper | 71 | 4 | All Year/Quarter combinations (2012–2030) for time slicer |
| 11 | Budget Quarter | Filter | 4 | 3 | 2026 quarters only — constrains budget page to current year |
| 12 | MSD Quarter | Filter | 72 | 3 | Valid MSD quarters — constrains CRM data to known periods |
| 13 | msd data sub-region | Geography | 39 | 4 | Sub-region → Area → Region → Cluster mapping (for msd data) |
| 14 | raw data sub-region | Geography | 33 | 4 | Sub-region → Region → Cluster → Area mapping (for raw data) |
| 15 | MeasuresTable | DAX Measures | — | — | Disconnected table holding all dynamic/switching measures |
| 16 | Header Selector | Parameter | — | — | Controls column headers in pivot tables (dynamic column switching) |
| 17 | View Selector | Parameter | — | — | Controls the view mode (e.g. Value / GM / Mixed display) |
| 18 | Value Selector | Parameter | — | — | Controls whether to show Value or GM in cards/pivots |
| 19 | Table view Selector | Parameter | — | — | Switches between table display modes |
| 20 | Quote type Selector | Parameter | — | — | Filters by quote type (Order / Quote) |
| 21 | Equipment_Map | Reference | — | — | Equipment type mapping table |
| 22 | GM_Value_Measures | DAX Measures | — | — | Dedicated measure table for gross margin vs value cards |
| 23 | Budget Page measures | DAX Measures | — | — | Measures specific to the Budget page |
| 24 | Funnel Page Measures | DAX Measures | — | — | Measures specific to the Funnel/Detailed pages |
| 25 | Product Performance measures | DAX Measures | — | — | Measures for the Product Performance page |
| 26 | Hardware_License_Implementation measure | DAX Measures | — | — | Split measures for hardware / license / implementation components |

> **Note:** Tables 15–26 are in-model measure tables and parameter tables — they have no extractable rows. The model uses a **field parameter / disconnected slicer** pattern extensively for dynamic column switching and measure selection.

---

### Table 1: `msd data` (Fact — CRM Opportunities, Enriched)
**Grain:** One row per opportunity × product × snapshot (enriched view — same grain as `Topic map`)
**Source:** Dynamics 365 (MSD) — filtered/enriched extract

| # | Column | Data Type | Description |
|---|--------|-----------|-------------|
| 1 | opportunityid | GUID | Dynamics 365 opportunity ID |
| 2 | createdon | DateTime | Opportunity creation date |
| 3 | owneridname | Text | Opportunity owner (salesperson) name |
| 4 | actualclosedate | Date | Actual close date |
| 5 | actualvalue_base | Numeric (EUR) | Actual revenue (base currency) |
| 6 | estimatedclosedate | Date | Estimated close date (used in date hierarchy drill-down) |
| 7 | estimatedvalue_base | Numeric (EUR) | Estimated value (base currency) |
| 8 | statecodename | Text | `Open` / `Won` |
| 9 | statuscodename | Text | `In Progress`, `New`, `On Hold`, `Won` |
| 10 | stepname | Text | CRM sales process step |
| 11 | accountid | GUID | Account / customer ID |
| 12 | msdyn_forecastcategoryname | Text | Forecast category: `Won`, `Included and Secured`, `Included`, `Included with risk`, `Upside`, `Excluded`, `Lost`, `Pipeline` |
| 13 | agfa_opportunityid | Text | Agfa opportunity ID (e.g. OPP-41715) |
| 14 | agfa_businessunitcodename | Text | Business unit |
| 15 | agfa_installatid | Text | Installation site ID |
| 16 | agfa_quoteid | Text | Associated quote ID |
| 17 | agfa_requesteddeliverydate | Date | Customer requested delivery date |
| 18 | agfa_quotetypename | Text | `Order` / `Quote` |
| 19 | agfa_quotestatusname | Text | Quote status |
| 20 | agfa_estordervalueexcludingsmaamount_base | Numeric (EUR) | Estimated order value excl. SMA (base currency) |
| 21 | agfa_saporderid | Text | SAP order ID (if converted) |
| 22 | agfa_actualrevenueexcludingsmaamount_base | Numeric (EUR) | Actual revenue excl. SMA |
| 23 | createdbyname | Text | Record created by |
| 24 | agfa_plannedrevenuerecognitiondate | Date | Planned revenue recognition date |
| 25 | agfa_margincostpercentagetotal | Numeric (%) | Total margin cost % |
| 26 | IMG SubReg_1 | Text | IMG sub-region (from mapping) |
| 27 | IMG RegGrp | Text | IMG region group |
| 28 | Year | Numeric | Year (from estimated close date) |
| 29 | Quarter | Text | Quarter (Q1–Q4) |
| 30 | YearQuarter | Text | Combined key e.g. 2026-Q1 |
| 31 | Sofon Product Family Id | Text | Sofon product family identifier |
| 32 | agfa_margincostpercentage | Numeric (%) | Product-level margin cost % |
| 33 | Equipment type | Text | Equipment category (9 types: DR 100e, DR 100s, DR 400, DR 600, DR 800, DX-D 300, Retrofit and Other, Valory Ceiling, Valory Floor) |
| 34 | AREA | Text | Geographic area (granular — e.g. USA, DACH, BENELUX) |
| 35 | REGION | Text | Top-level region: `EUROPE-PACIFIC`, `INTERCONTINENTAL`, `NORTH AMERICA` |
| 36 | CLUSTER | Text | Cluster (10): ASEAN, DACH, EUROPE EAST & SOUTH, EUROPE NORTH, IBERIA, INDIA & REST OF ASPAC, LATAM, MEA, NORTH AMERICA, OCEANIA |
| 37 | productname | Text | Product name |
| 38 | agfa_margincostpercentagehardware | Numeric (%) | Hardware margin cost % |
| 39 | agfa_margincostpercentageimplementation | Numeric (%) | Implementation margin cost % |
| 40 | agfa_margincostpercentageinternallicenses | Numeric (%) | Internal licenses margin cost % |
| 41 | agfa_margincostpercentageservicecontracts | Numeric (%) | Service contracts margin cost % |
| 42 | agfa_opportunitymarginpercentageexcludingsma | Numeric (%) | Opportunity-level margin % excl. SMA |
| 43 | Year_Est | Numeric | Year from estimated close date |
| 44 | Year_Actual | Numeric | Year from actual close date |
| 45 | Quarter_Est | Text | Quarter from estimated close date |
| 46 | Quarter_Actual | Text | Quarter from actual close date |
| 47 | quantity_final | Numeric | Final quantity |
| 48 | agfa_feasibilitycode | Numeric | Feasibility score: 0, 10, 30, 50, 70, 90 |
| 49 | agfa_wasquotedcreatedname | Text | `Yes` / `No` — was a quote created |
| 50 | agfa_maintypecodename | Text | Business type: `New Business`, `New machine sales`, `Expand existing business` |
| 51 | FC category sort | Numeric (1–9) | Forecast category sort order |
| 52 | IMG SubReg | Text | IMG sub-region |
| 53 | agfa_weightedamountexcludingsma_base | Numeric (EUR) | Weighted opportunity value excl. SMA |
| 54 | agfa_quantitysofon | Numeric | Sofon-confirmed quantity |
| 55 | destination | Text | Destination country |
| *(derived)* | Topic | Text | Product/equipment topic label used in pivot rows (from Topic map join) |

---

### Table 2: `raw data` (Fact — Budget / Standard Pricing)
**Grain:** One row per configuration × region × period (OI budget targets, 2026 only)
**Source:** Budget file (Excel/structured) — K4 business unit only

| # | Column | Data Type | Description |
|---|--------|-----------|-------------|
| 1 | Config Lev 1 | Text | Configuration level 1 type: CEILING MOUNTED, FLOOR MOUNTED, MOBILE, NON-MOTORIZED, Other, R&F, Retrofit, U-ARM |
| 2 | Config Lev 2 | Text | Configuration level 2 — specific model variant (e.g. DR 100e with rotating column, DR 400 v1, DX-D 300) |
| 3 | Config Lev 3 | Text | Configuration tier: Value, Economy, Mid Level, Midlevel A, Midlevel B, High End |
| 4 | UOM | Text | Unit of measure |
| 5 | BU | Text | Business unit: `K4` (DR/Digital Radiology) |
| 6 | Rate | Numeric | Exchange rate or multiplier |
| 7 | Currency | Text | Transaction currency |
| 8 | Sales Manager | Text | Responsible sales manager |
| 9 | Channel | Text | Sales channel: Direct, Indirect, Government, Canada (Indirect only) |
| 10 | Region | Text | Budget region |
| 11 | Month | Numeric | Month number |
| 12 | Period | Text | Period label |
| 13 | OI/Sales | Text | `OI` (Order Intake) — all rows are order intake budget |
| 14 | QTY Config | Numeric | Quantity at configuration level |
| 15 | QTY.1 | Numeric | Quantity alternate |
| 16 | Value Config | Numeric | Revenue value at config level (local currency) |
| 17 | Value.1 | Numeric | Revenue value alternate |
| 18 | LSP Config | Numeric | List Selling Price at config level |
| 19 | LSP.1 | Numeric | LSP alternate |
| 20 | Min Price Config | Numeric | Minimum price at config level |
| 21 | Min Price | Numeric | Minimum price |
| 22 | Value (EUR) | Numeric | Revenue in EUR |
| 23 | LSP (EUR) | Numeric | List Selling Price in EUR |
| 24 | Value Config (EUR) | Numeric | Config revenue in EUR |
| 25 | LSP Config (EUR) | Numeric | Config LSP in EUR |
| 26 | Min Price Config (EUR) | Numeric | Config min price in EUR |
| 27 | Min Price (EUR) | Numeric | Min price in EUR |
| 28–32 | HE REG LEVEL 1–5 | Text | Hardware equipment regional levels 1–5 |
| 33 | HE REG LEVEL 5 CODE | Text | Level 5 region code |
| 34 | Equipment Type | Text | Equipment type (DR 100e, DR 100s, DR 400, DR 600, DR 800, DX-D 300, Retrofit and Other, Valory Ceiling, Valory Floor) |
| 35 | IMG RegGrp | Text | IMG region group |
| 36 | Year | Numeric | `2026` |
| 37 | Quarter | Text | Q1–Q4 |
| 38 | YearQuarter | Text | e.g. 2026-Q1 |
| 39 | IMG SubReg | Text | IMG sub-region |
| 40 | PF.1 | Text | Product family (alternate) |
| 41 | PF | Text | Product family code |
| 42 | REGION.1 | Text | Region: EUROPE-PACIFIC, INTERCONTINENTAL, NORTH AMERICA |
| 43 | CLUSTER | Text | Cluster |
| 44 | AREA | Text | Area |

---

### Table 3: `opportunity` (CRM Raw — Full Extract)
**Grain:** One row per opportunity in Dynamics 365 (46,523 rows — all history)

| # | Column | Data Type | Description |
|---|--------|-----------|-------------|
| 1 | opportunityid | GUID | Unique opportunity ID |
| 2 | createdon | DateTime | Creation timestamp |
| 3 | owneridname | Text | Owner name |
| 4 | actualclosedate | Date | Actual close date |
| 5 | actualvalue / actualvalue_base | Numeric | Actual value (local + EUR base) |
| 6 | estimatedclosedate | Date | Estimated close date |
| 7 | estimatedvalue / estimatedvalue_base | Numeric | Estimated value (local + EUR base) |
| 8 | statecodename | Text | Open / Won / Lost |
| 9 | statuscodename | Text | Status reason |
| 10 | stepname | Text | Sales process step |
| 11 | accountid / accountidname | Text | Account ID and name |
| 12 | msdyn_forecastcategoryname | Text | Forecast category |
| 13 | agfa_dhdealhappencodename | Text | DH deal happen code |
| 14 | agfa_dsdealsigncodename | Text | DS deal sign code |
| 15 | agfa_opportunityid | Text | Agfa opportunity ID (OPP-XXXXX) |
| 16 | agfa_businessunitcodename | Text | Business unit |
| 17 | agfa_feasibilitycode | Numeric | Feasibility (0–90) |
| 18 | agfa_installatid | Text | Installation site |
| 19 | agfa_quoteid | Text | Quote ID |
| 20 | agfa_requesteddeliverydate | Date | Requested delivery |
| 21 | agfa_salesoneopportunityid | Text | SalesOne CRM ID |
| 22 | agfa_salesorganizationcode | Text | SAP sales org code |
| 23 | agfa_quotetypename | Text | Order / Quote |
| 24 | agfa_quotestatusname | Text | Quote status |
| 25 | agfa_weightedamount / _base | Numeric | Weighted amount (local + EUR) |
| 26 | agfa_estordervalueexcludingsmaamount / _base | Numeric | Est. order value excl. SMA |
| 27 | agfa_saporderid | Text | SAP order ID |
| 28 | agfa_weightedamountexcludingsma / _base | Numeric | Weighted amount excl. SMA |
| 29 | agfa_actualrevenueexcludingsmaamount / _base | Numeric | Actual revenue excl. SMA |
| 30 | createdbyname | Text | Creator |
| 31 | agfa_plannedrevenuerecognitiondate | Date | Revenue recognition date |
| 32–36 | agfa_margincostpercentage* | Numeric (%) | Margin cost % by component (total, hardware, impl, licenses, service) |
| 37 | agfa_opportunitymarginpercentageexcludingsma | Numeric (%) | Opportunity margin % excl. SMA |
| 38 | agfa_wasquotedcreatedname | Text | Yes / No |
| 39 | agfa_maintypecodename | Text | Business type |
| 40 | agfa_accountcountryidname | Text | Account country name |

---

### Table 4: `opportunityproduct` (CRM — Quote Line Items)
**Grain:** One row per opportunity product line (135,177 rows)

| Column | Data Type | Description |
|--------|-----------|-------------|
| opportunityproductid | GUID | Line item ID |
| extendedamount / extendedamount_base | Numeric | Extended price (local + EUR) |
| opportunityid | GUID | Parent opportunity ID (FK → opportunity) |
| productid | GUID | Product ID |
| agfa_budgetclass | Text | Budget class of the product |
| agfa_businessunitcodename | Text | Business unit |
| agfa_divisioncodename | Text | Division |
| quantity | Numeric | Quantity |
| agfa_sofonproductfamilyid | Text | Sofon product family ID |
| agfa_margincostpercentage | Numeric (%) | Line-level margin cost % |
| agfa_quantitysofon | Numeric | Sofon quantity |

---

### Table 5: `account` (CRM Account Master)
**Grain:** One row per account (76,481 rows)

| Column | Data Type | Description |
|--------|-----------|-------------|
| cr57c_accountid | GUID | Account ID |
| cr57c_address2_country | Text | Account country |
| cr57c_agfa_saprecordid | Text | Corresponding SAP customer ID |

---

### Table 6: `mapping` (Geography Lookup)
**Grain:** One row per destination (271 rows)

| Column | Description |
|--------|-------------|
| Destination | Country/destination name |
| IMG SubReg | IMG sub-region (23+ values) |
| IMG RegGrp | IMG region group (Europe-Pacific, Intercontinental, North America) |
| Report Region | Display report region (23 values including: Africa, Asean, Brazil, Canada, China, DACH, Europe East & South, Europe North, Hong Kong, Iberia, India, Mexico, Middle East & Other Africa, North LATAM, Oceania, Rest Of ASPAC North/South, South LATAM, USA, etc.) |
| Fixed Destination | Normalized destination name |
| Check | Validation flag |

---

### Table 7: `Topic map` (Opportunity Enrichment)
**Grain:** One row per opportunity × region × equipment type (28,902 rows — mirrors msd data)

| Column | Description |
|--------|-------------|
| Equipment type | Equipment category (9 types) |
| AREA | Geographic area |
| REGION | EUROPE-PACIFIC / INTERCONTINENTAL / NORTH AMERICA |
| CLUSTER | 10-value cluster |
| IMG SubReg | Sub-region |
| agfa_wasquotedcreatedname | Yes / No — quote created flag |
| agfa_maintypecodename | New Business / New machine sales / Expand existing business |
| FC category sort | Forecast category sort order (1–9) |
| IMG SubReg_1 | Sub-region duplicate |
| agfa_weightedamountexcludingsma_base | Weighted EUR amount excl. SMA |
| destination | Destination country |

> **Role:** Provides the `Topic` and `Equipment type` pivot row labels for the main matrix visuals. Acts as a bridge table linking CRM opportunity data to product/equipment classification.

---

### Tables 8–14: Geography & Time Reference Tables

| Table | Rows | Key Fields | Purpose |
|-------|------|-----------|---------|
| New Cluster/ Region Table | 41 | COUNTRIES, REGION, CLUSTER, AREA | Country → Region → Cluster → Area hierarchy (master geography) |
| Region/ Cluster Slicer | 38 | IMG SubReg, AREA, REGION, CLUSTER | Pre-built slicer values for region filter (38 sub-regions) |
| Quarter Slicer | 71 | Year, Quarter, YearQuarter, Quarter_Index | All quarters 2012–2030 — drives time slicer |
| Budget Quarter | 4 | Year, Quarter, YearQuarter | 2026 Q1–Q4 only — constrains budget data |
| MSD Quarter | 72 | Year, Quarter, YearQuarter | Valid MSD/CRM quarters |
| msd data sub-region | 39 | IMG SubReg, AREA, REGION, CLUSTER | Sub-region mapping for msd data |
| raw data sub-region | 33 | IMG SubReg, REGION, CLUSTER, AREA | Sub-region mapping for raw data |

---

### Tables 15–26: Measure & Parameter Tables (In-Model Only)

| Table | Purpose |
|-------|---------|
| MeasuresTable | Central DAX measure table — dynamic switching measures for Target page (Matrix Value Dynamic, % achieved, GM%, Gauge measures, card titles) |
| Budget Page measures | DAX measures for Budget page (Actual Card, GM Card, Budget Price/GM totals, Gap measures, Won, What we see without Upside, Gap by region: Intercontinental/Europe/NAM) |
| Funnel Page Measures | `Funnel Dynamic Measure` — single switchable measure used across all funnel pivot tables |
| GM_Value_Measures | Target Total card, Target GM card — used on Target page KPI cards |
| Product Performance measures | `Quantity Measure Table` — drives product performance pivot |
| Hardware_License_Implementation measure | Split measures for hardware / license / implementation cost components |
| Header Selector | Field parameter: drives dynamic column headers in all pivot tables (Sub Header column) |
| View Selector | Parameter: switches view mode (controls which measure set is shown) |
| Value Selector | Parameter: switches between Value EUR and GM display in cards |
| Table view Selector | Parameter: switches table display variant |
| Quote type Selector | Parameter: filters by Order vs Quote |
| Equipment_Map | Reference: maps equipment codes/IDs to display names |

---

## 4.2 Table Relationships & Cardinality

| From Table (Many) | From Column | To Table (One) | To Column | Cardinality | Notes |
|-------------------|-------------|----------------|-----------|-------------|-------|
| msd data | opportunityid | opportunity | opportunityid | Many → One | CRM enriched view links back to raw opportunity |
| opportunityproduct | opportunityid | opportunity | opportunityid | Many → One | Quote lines linked to parent opportunity |
| opportunityproduct | opportunityid | msd data | opportunityid | Many → One | Quote lines linked to enriched opportunity |
| msd data | accountid | account | cr57c_accountid | Many → One | Customer master lookup |
| opportunity | accountid | account | cr57c_accountid | Many → One | Account enrichment |
| msd data | destination | mapping | Destination | Many → One | Geography enrichment |
| msd data | IMG SubReg | msd data sub-region | IMG SubReg | Many → One | Sub-region hierarchy |
| raw data | IMG SubReg | raw data sub-region | IMG SubReg | Many → One | Sub-region hierarchy for budget |
| msd data | YearQuarter | MSD Quarter | YearQuarter | Many → One | Quarter validation filter |
| raw data | YearQuarter | Budget Quarter | YearQuarter | Many → One | Restricts raw data to 2026 |
| msd data (via Topic map) | opportunityid | Topic map | opportunityid | One → One | Enriches with Equipment type, Topic, FC sort |
| msd data | REGION / CLUSTER / AREA | Region/ Cluster Slicer | REGION / CLUSTER / AREA | Many → One | Drives region slicer |
| msd data / raw data | YearQuarter | Quarter Slicer | YearQuarter | Many → One | Drives time slicer |
| All fact tables | — | MeasuresTable / Page Measure tables | — | Disconnected | DAX measure tables — no physical relationship |
| Header Selector / View Selector etc. | — | Visuals | — | Disconnected (Field Parameter) | Dynamic column/measure switching |

**Hierarchies:**
- `Region/ Cluster Slicer`: REGION → CLUSTER → AREA (3-level geographic drill)
- `msd data.estimatedclosedate`: Year → Quarter → Month → Day (date drill hierarchy)
- `Quarter Slicer`: Year → Quarter (time filter)
- `New Cluster/ Region Table`: REGION → CLUSTER → AREA → COUNTRIES

---

## 4.3 Measures

### Budget Page Measures (`Budget Page measures` table)

| Measure | Description |
|---------|-------------|
| Actual Card Display | KPI card showing actual OIT value (dynamic — switches between EUR value and GM based on Value Selector) |
| GM Card Display | Gross margin card display |
| Budget Price Card | Total budget OIT target (EUR) |
| Budget GM card | Budget gross margin target |
| Budget Price Total | Sum of all budget targets — used as gauge max value |
| What we see without Upside | Funnel total excluding Upside category (Won + Included + Included with risk) |
| Won | Won opportunities total |
| Gap in What we See | `Budget Price Total − What we see without Upside` |
| Gap Value_intercontinental | Gap vs budget for INTERCONTINENTAL region |
| Gap Value_europe | Gap vs budget for EUROPE-PACIFIC region |
| Gap Value_NAM | Gap vs budget for NORTH AMERICA region |
| Percent value achieved | `Actual / Budget Price Total` |
| GM Value Achieved | Actual GM % achieved vs budget |
| Matrix Value (Dynamic) T1 - Budget | Dynamic measure for T1 pivot matrix — switches based on Header Selector (Value/GM/Qty by quarter) |
| Matrix Value (Dynamic) T2 - Budget | Dynamic measure for T2 pivot matrix |

### Target Page Measures (`MeasuresTable`)

| Measure | Description |
|---------|-------------|
| Card Title T1 | Dynamic title text for T1 card |
| Card Title T2 | Dynamic title text for T2 card |
| Matrix Value (Dynamic) | Dynamic switching measure for Target T1 pivot |
| Matrix Value (Dynamic) T2 | Dynamic switching measure for Target T2 pivot |
| Actual GM% (Weighted) – Gauge | Weighted actual GM% — used as gauge current value |
| Budget GM% (for Gauge) | Budget GM% target — used as gauge target |
| Percent Value achieved_target | `Actual NTO / Target NTO` |
| Percent GM achieved_target | `Actual GM% / Budget GM%` |

### GM & Value Measures (`GM_Value_Measures`)

| Measure | Description |
|---------|-------------|
| Target Total card | Total target value shown on Target page KPI card |
| Target_GM card | Target gross margin shown on Target page KPI card |

### Funnel Measures (`Funnel Page Measures`)

| Measure | Description |
|---------|-------------|
| Funnel Dynamic Measure | Single measure that switches between value/qty/GM based on Value Selector — drives all funnel pivot tables on Budget, Target, and Detailed Funnel pages |

### Product Performance Measures (`Product Performance measures`)

| Measure | Description |
|---------|-------------|
| Quantity Measure Table | Quantity display measure for product performance pivot — shows units by equipment type and topic per quarter |

---

## 4.4 Calculated Columns

| Column | Table | Description |
|--------|-------|-------------|
| Year | msd data | Extracted from `estimatedclosedate` |
| Quarter | msd data | Q1–Q4 from `estimatedclosedate` |
| YearQuarter | msd data | Concatenated e.g. `2026-Q1` |
| Year_Est / Year_Actual | msd data | Year from estimated vs actual close date (for dual-date analysis) |
| Quarter_Est / Quarter_Actual | msd data | Quarter from estimated vs actual close date |
| Equipment type | msd data | Mapped from Sofon Product Family → Equipment type lookup |
| AREA / REGION / CLUSTER | msd data | Joined from geography lookup via destination |
| IMG SubReg / IMG RegGrp | msd data | Joined from mapping table |
| FC category sort | msd data | Numeric sort order for forecast category (1=Won…9=Pipeline) |
| Topic | msd data | Product/configuration topic label (from Topic map) |
| Year / Quarter / YearQuarter | raw data | Derived period fields |
| IMG SubReg / REGION / CLUSTER / AREA | raw data | Joined from raw data sub-region table |
| destination | Topic map | Country destination |

---

## 4.5 Calculated Tables

| Table | Description |
|-------|-------------|
| Header Selector | DAX field parameter generating dynamic column headers (Quarter × Metric combinations) |
| View Selector | DAX parameter table for view switching |
| Value Selector | DAX parameter table for Value vs GM display |
| Table view Selector | DAX parameter for table variant |
| Quote type Selector | DAX parameter for Order vs Quote filter |
| MeasuresTable | DAX table with all dynamic/switching measures |
| Budget Page measures | DAX measure group table for Budget page |
| Funnel Page Measures | DAX measure group for Funnel pages |
| GM_Value_Measures | DAX measure group for margin KPIs |
| Product Performance measures | DAX measure group for Product page |
| Hardware_License_Implementation measure | DAX measure group for component cost split |
| Equipment_Map | DAX or static reference mapping table |

---

---

## 4.6 Report-Level Filters

None. All filtering is handled at page level and via slicers.

---

---

## 4.7 Page-by-Page Detail

---

### Page 1 — BUDGET - OIT MARGIN AND PRODUCTS MIX
**Purpose:** Main analytics page — CRM funnel vs Budget targets. Shows order intake forecast vs budget for 2026, with gap analysis, funnel breakdown, and product mix pivot tables.
**Ordinal:** 0 (first tab)
**Visuals:** 55 (including shapes, textboxes, action buttons used for layout/navigation)

#### Key Visuals

| # | Visual Type | Fields / Roles | Description |
|---|-------------|---------------|-------------|
| 1 | **Slicer** | Quarter Slicer.Quarter | Quarter filter (2026 Q1–Q4) |
| 2 | **Slicer** | Region/ Cluster Slicer.REGION | Region filter (3 regions) |
| 3 | **Slicer** | Region/ Cluster Slicer.CLUSTER + AREA | Cluster/Area drill-down filter |
| 4 | **Slicer** | View Selector.View | View mode selector (Value / GM / Mixed) |
| 5 | **Slicer** | msd data.owneridname | Opportunity owner filter |
| 6 | **Slicer** | Value Selector.Type | Value vs GM display toggle |
| 7 | **Slicer** | Table view Selector.Type | Table display mode selector |
| 8 | **Card** | MeasuresTable.Card Title T1 | Dynamic title for T1 section |
| 9 | **Pivot Table (T1)** | Rows: Topic map.Equipment type → Topic map.Topic; Columns: Header Selector.Sub Header; Values: Budget Page measures.Matrix Value (Dynamic) T1 - Budget | **Main product mix matrix** — Equipment type → Product Topic rows, dynamic quarter columns, switchable metric (value/GM/qty) |
| 10 | **Card** | MeasuresTable.Card Title T2 | Dynamic title for T2 section |
| 11 | **Pivot Table (T2)** | Rows: Equipment type → Topic; Columns: Header Selector.Sub Header; Values: Budget Page measures.Matrix Value (Dynamic) T2 - Budget | **Secondary product mix matrix** (alternate view) |
| 12 | **Card** | Budget Page measures.Actual Card Display | Actual OIT value KPI |
| 13 | **Card** | Budget Page measures.GM Card Display | Actual GM KPI |
| 14 | **Pivot Table (Funnel Q×FC)** | Rows: Quarter × msdyn_forecastcategoryname × Topic; Columns: Header Selector.Sub Header; Values: Funnel Page Measures.Funnel Dynamic Measure | Funnel breakdown by Quarter × Forecast Category × Product Topic |
| 15 | **Card** | Budget Page measures.Budget Price Card | Total budget target (EUR) |
| 16 | **Card** | Budget Page measures.Budget GM card | Budget GM target |
| 17 | **Gauge** | Y: What we see without Upside; Max: Budget Price Total | **Gap gauge** — current funnel (excl. Upside) vs budget maximum |
| 18 | **Card** | Budget Page measures.Gap in What we See | Gap value (Budget − Funnel excl. Upside) |
| 19 | **Pivot Table (Funnel + Feasibility)** | Rows: Quarter × FC Category × Feasibility code × Topic; Columns: Header Selector.Sub Header; Values: Funnel Dynamic Measure | Detailed funnel with feasibility breakdown |
| 20 | **Card** | Gap Value_intercontinental | Gap vs budget — INTERCONTINENTAL only |
| 21 | **Card** | Gap Value_europe | Gap vs budget — EUROPE-PACIFIC only |
| 22 | **Card** | Gap Value_NAM | Gap vs budget — NORTH AMERICA only |
| 23 | **Card** | What we see without Upside | Funnel excl. Upside total |
| 24 | **Card** | Won | Won opportunities total |
| 25 | **Action Buttons (×4)** | — | Navigation buttons to other pages |

#### Page-Level Filters
None specific.

#### Key Visual-Level Filters
| Visual | Filter | Value |
|--------|--------|-------|
| Funnel Pivot (Q×FC) | msd data.statecodename | Open, Won |
| Funnel Pivot (Q×FC) | msdyn_forecastcategoryname | Excludes `Upside` (separate Upside pivot below) |
| Gap Cards (by region) | Region/ Cluster Slicer.REGION | INTERCONTINENTAL / EUROPE-PACIFIC / NORTH AMERICA (separate cards) |
| Pivot Tables | (Advanced filter) | `op0=1L` — restricts to records where a flag = 1 |

---

### Page 2 — TARGET - OIT MARGIN AND PRODUCTS MIX
**Purpose:** Target performance view — actual OIT and GM vs targets, with per-equipment-type GM% gauges.
**Ordinal:** 1
**Visuals:** 37

#### Key Visuals

| # | Visual Type | Fields / Roles | Description |
|---|-------------|---------------|-------------|
| 1–4 | **Slicers** | Quarter, REGION, CLUSTER+AREA, View Selector | Standard 4 filters |
| 5 | **Slicer** | msd data.owneridname | Owner filter |
| 6 | **Slicer** | Value Selector.Type | Value vs GM toggle |
| 7 | **Slicer** | Table view Selector.Type | Table variant |
| 8 | **Card** | MeasuresTable.Card Title T1 | Dynamic T1 title |
| 9 | **Pivot Table (T1)** | Rows: Equipment type → Topic; Columns: Header Selector.Sub Header; Values: MeasuresTable.Matrix Value (Dynamic) | T1 product mix matrix vs target |
| 10 | **Card** | MeasuresTable.Card Title T2 | Dynamic T2 title |
| 11 | **Pivot Table (T2)** | Rows: Equipment type → Topic; Columns: Header Selector.Sub Header; Values: MeasuresTable.Matrix Value (Dynamic) T2 | T2 product mix matrix vs target |
| 12 | **Card Visual** | GM_Value_Measures.Target Total card + Target_GM card | Target value + GM KPI cards |
| 13 | **Card Visual** | MeasuresTable.Percent Value achieved_target + Percent GM achieved_target | % achievement vs target (value + GM) |
| 14 | **Gauge × 9** | Y: Actual GM% (Weighted) – Gauge; Target: Budget GM% (for Gauge) | **One gauge per equipment type** — shows actual weighted GM% vs budget GM% target for: DR 100e, DR 100s, DX-D 300, DR 400, Retrofit and Other, DR 600, Valory Ceiling, DR 800, Valory Floor |

#### Visual-Level Filters (Gauges)
Each gauge is filtered to its specific equipment type:
`DR 100e` | `DR 100s` | `DX-D 300` | `DR 400` | `Retrofit and Other` | `DR 600` | `Valory Ceiling` | `DR 800` | `Valory Floor`

---

### Page 3 — DETAILED FUNNEL VIEW
**Purpose:** Deep-dive funnel analysis — forecast category breakdown with feasibility, quarter, and region drill-down.
**Ordinal:** 2
**Visuals:** 18

#### Key Visuals

| # | Visual Type | Fields / Roles | Description |
|---|-------------|---------------|-------------|
| 1 | **Slicer** | Quarter Slicer.Quarter | Quarter filter |
| 2 | **Slicer** | Region/ Cluster Slicer.REGION | Region filter |
| 3 | **Slicer** | Region/ Cluster Slicer.CLUSTER + AREA | Cluster/Area filter |
| 4 | **Slicer** | msd data.msdyn_forecastcategoryname | Forecast category filter |
| 5 | **Card Visual** | Budget Price Card + Budget GM card | Budget target KPIs |
| 6 | **Card Visual** | Percent value achieved + GM Value Achieved | Achievement % KPIs |
| 7 | **Pivot Table (Main)** | Rows: Quarter × FC Category × Topic; Columns: Header Selector.Sub Header; Values: Funnel Dynamic Measure | Funnel by Quarter × Forecast Category × Product Topic — main drill-down |
| 8 | **Pivot Table (with Feasibility)** | Rows: Quarter × FC Category × Feasibility code × Topic; Columns: Header Selector.Sub Header; Values: Funnel Dynamic Measure | Same funnel with feasibility (0/10/30/50/70/90) as an additional row level |

#### Visual-Level Filters (Funnel Pivots)
| Visual | Filter | Value |
|--------|--------|-------|
| Bottom Pivot | msdyn_forecastcategoryname | `Upside` only (separate Upside view) |
| Both Pivots | msd data.statecodename, statuscodename, actualclosedate | Open (standard funnel filters) |

---

### Page 4 — PRODUCT PERFORMANCE
**Purpose:** Quantity-focused view — unit volumes by equipment type and product topic across quarters and regions.
**Ordinal:** 3
**Visuals:** 12

#### Key Visuals

| # | Visual Type | Fields / Roles | Description |
|---|-------------|---------------|-------------|
| 1 | **Slicer** | Quarter Slicer.Quarter | Quarter filter |
| 2 | **Slicer** | Region/ Cluster Slicer.REGION | Region filter |
| 3 | **Slicer** | Region/ Cluster Slicer.CLUSTER + AREA | Cluster/Area filter |
| 4 | **Pivot Table** | Rows: Topic map.Equipment type → Topic map.Topic; Columns: Header Selector.Sub Header; Values: Product Performance measures.Quantity Measure Table | Unit quantities by Equipment type → Topic, across dynamic column headers (quarters/regions) |

---

### Page 5 — ToolTip
**Purpose:** Hidden tooltip page — shown when hovering over pivot table rows.
**Ordinal:** 4
**Visuals:** 1

| # | Visual Type | Fields | Description |
|---|-------------|--------|-------------|
| 1 | **Card Visual** | Min(Topic), Min(owneridname), Min(destination) | Shows Topic, Owner, and Destination for the hovered row in a tooltip popup |

---

### Page 6 — Intercontinental
**Purpose:** Hidden drill-through / diagnostic page — Intercontinental-filtered detail table. Pre-filtered to INTERCONTINENTAL region, 2026, Included with risk + Upside categories.
**Ordinal:** 5
**Visuals:** 1

| # | Visual Type | Columns | Description |
|---|-------------|---------|-------------|
| 1 | **Table** | msdyn_forecastcategoryname, Topic, destination, Sum(agfa_estordervalueexcludingsmaamount_base), estimatedclosedate (Year/Quarter/Month/Day), Avg(agfa_opportunitymarginpercentageexcludingsma) | Opportunity list for Intercontinental region: FC category, topic, destination, value, close date hierarchy, margin % |

#### Visual-Level Filters
| Filter | Value |
|--------|-------|
| Year | `2026` |
| msdyn_forecastcategoryname | `Included with risk`, `Upside` |
| REGION | `INTERCONTINENTAL` |

---

### Page 7 — Page 1
**Purpose:** Hidden diagnostic / debug page — used during development for opportunity-level investigation.
**Ordinal:** 6
**Visuals:** 3

| # | Visual Type | Columns | Description |
|---|-------------|---------|-------------|
| 1 | **Table** (opportunity) | agfa_opportunityid, Sum(agfa_estordervalueexcludingsmaamount_base), msdyn_forecastcategoryname, accountidname, accountid | Raw opportunity table — pre-filtered to specific opportunity (OPP-50212) |
| 2 | **Table** (msd data) | agfa_opportunityid, Topic, REGION, Sum(agfa_estordervalueexcludingsmaamount_base), destination, statecodename | msd data filtered to 5 specific opportunity IDs |
| 3 | **Table** (msd data) | Topic, destination, accountid, accountidname, AREA, CLUSTER, REGION, Avg(margin%), statecodename | Opportunity-level margin view filtered to Topic = `(1) DX-D300` |

---

### Page 8 — Page 2
**Purpose:** Hidden diagnostic / debug page — continuation of opportunity investigation.
**Ordinal:** 7
**Visuals:** 1

| # | Visual Type | Columns | Description |
|---|-------------|---------|-------------|
| 1 | **Table** (msd data) | agfa_opportunityid, Topic, REGION, CLUSTER, Sum(value), destination, statecodename, statuscodename, stepname | Opportunity diagnostic table — filtered to 6 specific opportunity IDs |

---

---

## 4.8 Slicer Summary — All Pages

| Slicer Field | Pages |
|-------------|-------|
| Quarter Slicer.Quarter | Pages 1, 2, 3, 4 |
| Region/ Cluster Slicer.REGION | Pages 1, 2, 3, 4 |
| Region/ Cluster Slicer.CLUSTER + AREA | Pages 1, 2, 3, 4 |
| View Selector.View | Pages 1, 2 |
| msd data.owneridname | Pages 1, 2 |
| Value Selector.Type | Pages 1, 2 |
| Table view Selector.Type | Pages 1, 2 |
| msd data.msdyn_forecastcategoryname | Page 3 only |

---

## 4.9 Dynamic Column Pattern (Header Selector)

All main pivot tables use a **dynamic column switching** pattern via the `Header Selector` field parameter. The `Sub Header` column controls what appears in the pivot column headers, allowing users to switch between views such as:
- Quarterly breakdown (Q1 / Q2 / Q3 / Q4)
- Regional breakdown (by REGION or CLUSTER)
- Metric switching (Value EUR / Gross Margin / Quantity)

This is controlled by the **View Selector** slicer, which triggers the corresponding DAX measure (`Matrix Value (Dynamic)`, `Funnel Dynamic Measure`, etc.) to return the appropriate calculation.

---

## 4.10 Key Domain Reference

### Equipment Types (9)
| Equipment Type | Category |
|---------------|----------|
| DR 100e | Digital Radiography — floor-mounted analog |
| DR 100s | Digital Radiography — floor-mounted digital |
| DR 400 | Digital Radiography — mid-range |
| DR 600 | Digital Radiography — advanced |
| DR 800 | Digital Radiography — high-end |
| DX-D 300 | Digital X-ray Detector system |
| Valory Ceiling | Ceiling-suspended radiography system |
| Valory Floor | Floor-mounted radiography system |
| Retrofit and Other | Retrofit upgrades and miscellaneous |

### Forecast Category (FC) Hierarchy — Budget Page
| FC Category | FC Sort | Meaning |
|-------------|---------|---------|
| Won | 1 | Closed/converted to order |
| Included and Secured | 2 | High confidence — in forecast |
| Included | 3 | Standard forecast inclusion |
| Included with risk | 4 | Included but flagged as at-risk |
| Upside | 5 | Possible — not committed |
| Excluded | 6 | Outside current forecast |
| Lost | 7 | Lost to competitor |
| Pipeline | 8 | Early-stage pipeline |
| — | 9 | Other |

### Feasibility Codes
| Code | Meaning |
|------|---------|
| 0 | 0% feasibility |
| 10 | 10% |
| 30 | 30% |
| 50 | 50% |
| 70 | 70% |
| 90 | 90% |

### Regional Hierarchy
```
REGION
├── EUROPE-PACIFIC
│   └── Clusters: DACH, EUROPE EAST & SOUTH, EUROPE NORTH, IBERIA, OCEANIA
│       └── Areas: DACH, ALMATY, UKRAINE, POLAND, GREECE, HUNGARY, ITALY,
│                  BENELUX, NORD, UK & IRELAND, FRANCE, IBERIA, OCEANIA
├── INTERCONTINENTAL
│   └── Clusters: ASEAN, INDIA & REST OF ASPAC, LATAM, MEA
│       └── Areas: ASEAN, CHINA, HONG KONG, INDIA, REST OF ASPAC SOUTH,
│                  BRAZIL, MEXICO, NORTH LATAM, SOUTH LATAM,
│                  GULF, LEVANT, MAGHREB, MEA, SAUDI ARABIA, SOUTH AFRICA, etc.
└── NORTH AMERICA
    └── Clusters: NORTH AMERICA
        └── Areas: USA, CANADA
```

---

*End of Commercial Analytics - OIT Margin & Product Mix 2026 documentation.*

---

---

# 5. Commercial Analytics - Funnel Evolution Tracker

**File:** `Dashboards3/Commercial Analytics - Funnel Evolution Tracker.pbix`
**Created From:** Power BI Cloud (Service) — Release 2025.04
**Dataset ID:** `914ae9ce-2c20-454d-bf02-84f82c7b1ca3`
**Report ID:** `68d489b1-ed09-4f85-903b-159de0c02edf`
**Workspace:** `cafc0b2f-fd88-47eb-82aa-2158395532e0` (same workspace as Weekly FC Tracker & OIT Margin)

---

## 5.1 Data Model

### Tables Overview

| # | Table Name | Type | Rows | Columns | Description |
|---|------------|------|------|---------|-------------|
| 1 | T funnel evolution tracker | Fact | 499,796 | 60 | Weekly CRM funnel snapshots — opportunity × week × quarter evolution |
| 2 | DataWeek2024 | Lookup / Slicer | — | — | Country name lookup — drives the advanced country slicer |

> **Single-fact model.** All analytics derive from one denormalized snapshot table. `DataWeek2024` is a lightweight companion table used only for the advanced country-level slicer.

---

### Table 1: `T funnel evolution tracker` (Fact)
**Grain:** One row per Opportunity × Snapshot Week
**Source:** CRM + SAP (same origin as `DataWeek` in the Weekly FC Tracker, extended with funnel evolution fields)

| # | Column | Data Type | Description / Domain |
|---|--------|-----------|----------------------|
| 1 | Snapshot Week | Text | Weekly snapshot identifier |
| 2 | Region | Text | Sub-region level label |
| 3 | Group of Regions | Text | `Europe-Pacific`, `Intercontinental`, `North America` |
| 4 | Subregion | Text | 20 subregions: Africa, Asean, Brazil, Canada, DACH, Dealer, DoD, Europe East & South, Europe North, Govt-Other, Iberia, India, Key Accounts, Mexico, Middle East & Other Africa, North LATAM, Oceania, Rest Of ASPAC South, South LATAM, USA |
| 5 | Destination | Text | Country destination |
| 6 | Sold-to party | Text | SAP customer ID |
| 7 | Syracuse/SalesOne Opportunity | Text | CRM opportunity ID (OPP-XXXXX) |
| 8 | Pl# Order Int# Date | Date | Planned order intake date |
| 9 | Pl# Order Int# Month | Text | Planned OIT month (YYYY-MM) |
| 10 | Calendar month | Numeric | Calendar month number |
| 11 | Act# Order Int# Date | Date | Actual order intake date |
| 12 | Act# Order Int# Month | Text | Actual OIT month |
| 13 | Calendar month2 | Text | Secondary calendar month |
| 14 | Closed Date | Date | Opportunity close date |
| 15 | Closed Month | Text | Close month |
| 16 | Target Date - Quarter | Numeric | Quarter number of target date |
| 17 | Act# OIT Quarter | Text | Actual OIT quarter |
| 18 | Closed Opp# Quarter | Text | Quarter when opportunity closed |
| 19 | Final Month | Numeric | Final target month |
| 20 | Final Quarter | Text | Final forecast quarter |
| 21 | Final Year | Numeric | Forecast year |
| 22 | Requested Delivery Date | Date | Customer requested delivery date |
| 23 | Opportunity Date Created | Date | Date opportunity was created in CRM |
| 24 | Sales Stage | Text | `Identifying`, `Qualifying`, `Quoting`, `Negotiating` |
| 25 | Sub Sales Stage | Text | Detailed stage |
| 26 | Opportunity status | Text | `Funnel` / `New` |
| 27 | Opportunity Owner | Text | KAM / salesperson |
| 28 | Amount | Numeric (EUR) | Unweighted opportunity value |
| 29 | Weighted Amount | Numeric (EUR) | Probability-weighted value |
| 30 | Feasibility | Numeric (0.0–1.0) | Feasibility score |
| 31 | Deal Percentage | Numeric (%) | Deal win probability |
| 32 | Win Percentage | Numeric (%) | Sales-assigned win % |
| 33 | Average Probability | Numeric (%) | Average probability |
| 34 | Forecast Flag | Text | `Include`, `Included w/ Risk`, `Upside`, `Exclude` |
| 35 | Cal Day | Date | Calendar day of snapshot |
| 36 | First Day of Cal Week | Date | Monday of snapshot week |
| 37 | Overdue | Numeric (0/1) | Overdue flag |
| 38 | Check Staging | Numeric (0/1) | Data quality flag |
| 39 | Open Opportunity in Funnel | Numeric (0/1) | Active funnel flag |
| 40 | Opp Naming Convention | Numeric (0/1) | Naming convention flag |
| 41 | Cal Year | Numeric | Calendar year (2024 in current extract) |
| 42 | Cal Quarter | Numeric | Calendar quarter (1.0–4.0) |
| 43 | Last Month of Cal Quarter | Text | Last month of quarter (YYYY-MM) |
| 44 | Last Day of Cal Quarter | Date | Last day of calendar quarter |
| 45 | Risk Opp | Numeric (0/1) | Risk flag |
| 46 | New Opp Created This Week | Numeric (0/1) | New opportunity flag |
| 47 | Weeknumber | Numeric | ISO week number |
| 48 | Invertweek | Numeric | Inverted week for reverse sort |
| 49 | Quote Type | Text | Quote type (empty in current extract) |
| 50 | Quote Status | Text | Quote status (empty in current extract) |
| 51 | SAP order | Text | SAP order ID |
| 52 | Yearly | Text | Year label |
| 53 | Funnel Evolution | Text | Funnel quarter movement label: Q1, Q2, Q3, Q4 |
| 54 | Funnel_Number | Numeric | Numeric sort for Funnel Evolution (1–4) |
| 55 | New_Funnel | Text | Funnel evolution with Closed: `Q1`, `Q2`, `Q3`, `Q4`, `Closed` |
| 56 | Quarters | Text | Snapshot period label: `2024-Q1` … `2024-Q4`, `2024-Closed` |
| 57 | Monthly view | Text | `Monthly` / `Weekly` — display mode flag |
| 58 | Month_Name | Text | Month name |
| 59 | Week | Text | Week label (used as X-axis on weekly charts) |
| 60 | Snapshot Month | Text | Month label (used as X-axis on monthly charts) |

---

### Table 2: `DataWeek2024` (Country Slicer Lookup)
**Purpose:** Provides `Country Name` values for the advanced slicer visual on all pages. Companion lookup to the main fact table.

| Column | Data Type | Description |
|--------|-----------|-------------|
| Country Name | Text | Country name for advanced filter slicer |

---

## 5.2 Table Relationships & Cardinality

| From | To | Cardinality | Notes |
|------|----|-------------|-------|
| T funnel evolution tracker | DataWeek2024 | Many → One (inferred via Destination / Country Name) | DataWeek2024 is used only to power the advanced country slicer — loose coupling |

> **Essentially single-table.** All analytical visuals query only `T funnel evolution tracker`. `DataWeek2024` is a slicer-only helper.

---

## 5.3 Measures

| Measure | Expression (inferred) | Used On |
|---------|----------------------|---------|
| Sum(T funnel evolution tracker.Amount) | `SUM([Amount])` — unweighted EUR | Pages: Unweighted, Unweighted - Monthly |
| Sum(T funnel evolution tracker.Weighted Amount) | `SUM([Weighted Amount])` — probability-weighted EUR | Pages: Weighted, Weighted - Monthly |

---

## 5.4 Calculated Columns

| Column | Derivation |
|--------|-----------|
| Funnel_Number | Numeric sort order for `Funnel Evolution` (Q1=1, Q2=2, Q3=3, Q4=4) |
| New_Funnel | Extended version of `Funnel Evolution` adding `Closed` category |
| Quarters | Combined year-quarter label: `Cal Year` + `-` + `New_Funnel` (e.g. `2024-Q2`) |
| Week | Display label for snapshot week axis |
| Snapshot Month | Display label for snapshot month axis |
| Monthly view | Flag `Monthly` / `Weekly` — controls which axis column is used |
| Month_Name | Month name extracted from snapshot date |
| Yearly | Year as text label |

---

## 5.5 Calculated Tables

None. Model contains only physical tables.

---

---

## 5.6 Report-Level Filters

| Field | Table | Filter Type | Value |
|-------|-------|-------------|-------|
| Group of Regions | T funnel evolution tracker | Categorical | Open (all regions) |

---

---

## 5.7 Page-by-Page Detail

All 4 pages share an **identical layout** — same 9 visuals, same 5 slicers + 1 advanced slicer. The only difference is the **chart metric** (Weighted vs Unweighted Amount) and the **X-axis** (Weekly vs Monthly snapshot).

---

### Page 1 — Weighted *(default/home page)*
**Purpose:** Probability-weighted funnel evolution — weekly view. Shows how the weighted EUR value of each forecast quarter has evolved across snapshot weeks.
**Ordinal:** 0 (first tab shown)

#### Visuals

| # | Visual Type | Fields | Description |
|---|-------------|--------|-------------|
| 1 | **Slicer** | Group of Regions | Region filter |
| 2 | **Slicer** | Subregion | Sub-region filter |
| 3 | **Slicer** | Destination | Country filter |
| 4 | **Slicer** | Cal Year | Year filter |
| 5 | **Slicer** | Cal Quarter | Quarter filter (Q1–Q4) |
| 6 | **Advanced Slicer Visual** | DataWeek2024.Country Name | Enhanced country search/filter slicer |
| 7 | **Clustered Column Chart** | X-axis: **Week** (snapshot week); Series: **Quarters** (2024-Q1…2024-Closed); Y: **Sum(Weighted Amount)** | Weekly evolution of weighted funnel — each bar group = one snapshot week, each colour = a forecast quarter |
| 8 | **Image** | — | Report logo |
| 9 | **Text Box** | — | Page title |

#### Page-Level Filters
| Field | Type | Value |
|-------|------|-------|
| Opportunity status | Categorical | Open (controls whether Funnel / New shown) |
| New_Funnel | Categorical | Open (controls which funnel quarters shown) |

---

### Page 2 — Unweighted
**Purpose:** Face-value (unweighted) funnel evolution — weekly view.
**Ordinal:** 1

Identical layout to Page 1, except:
- **Y-axis:** `Sum(Amount)` instead of `Sum(Weighted Amount)`
- **X-axis:** `Week` (same as Page 1)

---

### Page 3 — Weighted - Monthly
**Purpose:** Probability-weighted funnel evolution — monthly view. Same metric as Page 1 but grouped by snapshot month instead of snapshot week.
**Ordinal:** 2

Identical layout, except:
- **Y-axis:** `Sum(Weighted Amount)`
- **X-axis:** `Snapshot Month` (monthly aggregation instead of weekly)

---

### Page 4 — Unweighted - Monthly
**Purpose:** Face-value funnel evolution — monthly view.
**Ordinal:** 3

Identical layout, except:
- **Y-axis:** `Sum(Amount)`
- **X-axis:** `Snapshot Month`

---

---

## 5.8 Slicer Summary — All Pages

| Slicer Field | Present On |
|-------------|-----------|
| Group of Regions | All 4 pages |
| Subregion | All 4 pages |
| Destination | All 4 pages |
| Cal Year | All 4 pages |
| Cal Quarter | All 4 pages |
| DataWeek2024.Country Name (Advanced) | All 4 pages |

---

## 5.9 Key Domain Reference

### Forecast Flag (simplified vs Weekly FC Tracker)
| Flag | Meaning |
|------|---------|
| Include | Committed forecast inclusion |
| Included w/ Risk | Included but at risk |
| Upside | Possible, not committed |
| Exclude | Outside forecast |

### Funnel Evolution / Quarters
Each opportunity is tagged with the **forecast quarter it is targeting** at each snapshot. The `Quarters` field (e.g. `2024-Q3`) tracks which quarter an opportunity was in at each week, enabling you to see **funnel build, slippage, and close-out** over time.

| New_Funnel Value | Meaning |
|-----------------|---------|
| Q1 / Q2 / Q3 / Q4 | Quarter the opportunity is currently forecast to close in |
| Closed | Opportunity has been won/closed |

### Page Matrix (2×2)
| | **Weekly X-axis** | **Monthly X-axis** |
|---|---|---|
| **Weighted Amount** | Page 1 — Weighted | Page 3 — Weighted - Monthly |
| **Unweighted Amount** | Page 2 — Unweighted | Page 4 — Unweighted - Monthly |

---

*End of Commercial Analytics - Funnel Evolution Tracker documentation.*

---

---

# 6. Commercial Analytics - OI & Funnel Health Cockpit

**File:** `Dashboards3/Commercial Analytics - OI & Funnel Health Cockpit.pbix`
**Created From:** Power BI Cloud (Service) — Release 2025.04
**Dataset ID:** `52c8e738-76f6-4cf2-8510-046c6e9e8904`
**Report ID:** `7e981737-55c9-4754-9c1a-7a03b205696a`
**Last Refreshed:** 2026-03-16 23:33:25 | Snapshot Week: W12 | Current Quarter: Q1

---

## 6.1 Data Model

### Tables

#### Table 1: `T funnel health` (Fact / Main Table)
- **Row Count:** 26,464 rows
- **Grain:** One row per Destination × Week × Quarter × key figure type

| # | Column Name | Data Type | Description / Domain Values |
|---|-------------|-----------|---------------------------|
| 1 | Destination | Text | Country-level destination (e.g. Afghanistan, Germany, USA) |
| 2 | Region | Text | Region name (e.g. Gulf, DACH, USA) |
| 3 | Group of Regions | Text | Top-level grouping: `Europe-Pacific`, `Intercontinental`, `North America` |
| 4 | Subregion | Text | Mid-level grouping (e.g. Middle East & Other Africa, DACH) |
| 5 | Week | Numeric | ISO week number (1.0–52.0) — x-axis for trend charts |
| 6 | Qtr | Text | Quarter label: `Q1`, `Q2`, `Q3`, `Q4` — used for quarterly page filtering |
| 7 | key figure | Text | Row type indicator (e.g. `Actual`) — distinguishes actuals from other row types |
| 8 | RT CY | Numeric | Running Total Current Year (YTD cumulative OIT actuals, kEUR) |
| 9 | RT PY | Numeric | Running Total Prior Year (YTD cumulative OIT prior year, kEUR) |
| 10 | RT BT | Numeric | Running Total Budget (YTD cumulative budget target, kEUR) |
| 11 | RT FC | Numeric | Running Total Forecast (YTD cumulative forecast, kEUR) |
| 12 | RT FC2 | Numeric | Running Total Forecast 2 (YTD cumulative FC2, kEUR) |
| 13 | CY | Numeric | Current Year snapshot value (weekly OIT actuals, kEUR) |
| 14 | PY | Numeric | Prior Year snapshot value (weekly OIT prior year, kEUR) |
| 15 | funnel | Numeric | Funnel value — pipeline-based prediction (kEUR) |
| 16 | funnel HF | Numeric | Funnel High-Fidelity — probability-weighted pipeline prediction (kEUR) |
| 17 | 4Q | Numeric | 4-Quarter rolling average prediction (kEUR) |
| 18 | PQ | Numeric | Prior Quarter trend-based prediction (kEUR) |
| 19 | SQ | Numeric | Same-Quarter prior-year trend prediction (kEUR) |
| 20 | FC2 | Numeric | Forecast 2 snapshot value — YTD variant (kEUR) |
| 21 | RT CY Q | Numeric | Running Total CY — Quarterly cumulative (kEUR) |
| 22 | RT PY Q | Numeric | Running Total PY — Quarterly cumulative (kEUR) |
| 23 | RT BT Q | Numeric | Running Total Budget — Quarterly cumulative (kEUR) |
| 24 | RT FC Q | Numeric | Running Total Forecast — Quarterly cumulative (kEUR) |
| 25 | RT FC2 Q | Numeric | Running Total FC2 — Quarterly cumulative (kEUR) |
| 26 | funnel Q | Numeric | Funnel prediction — Quarterly variant (kEUR) |
| 27 | funnel HF Q | Numeric | Funnel High-Fidelity prediction — Quarterly variant (kEUR) |
| 28 | 4Q Q | Numeric | 4-Quarter average prediction — Quarterly variant (kEUR) |
| 29 | PQ Q | Numeric | Prior Quarter prediction — Quarterly variant (kEUR) |
| 30 | SQ Q | Numeric | Same-Quarter prediction — Quarterly variant (kEUR) |
| 31 | FC2 Q | Numeric | Forecast 2 — Quarterly variant (kEUR) |

> **Note:** Each row represents a geography × week intersection. The `_Q` suffix columns contain the same metrics scoped to the current quarter's cumulative total (used on "Order Intake Q" page). Blank cells represent weeks where no data exists for that Destination.

---

#### Table 2: `Others` (KPI Measures / Metadata Table)
- **Row Count:** 1 row
- **Purpose:** Stores computed KPI % values displayed on card visuals and refresh metadata

| # | Column Name | Data Type | Sample Value | Description |
|---|-------------|-----------|-------------|-------------|
| 1 | Refreshed Date | DateTime | 2026-03-16 23:33:25 | Last data refresh timestamp |
| 2 | Current Week | Numeric | 12.0 | Current snapshot week number |
| 3 | Week of Year | Numeric | 12 | ISO week of year |
| 4 | CY vs BT QTD | Measure | — | Actuals vs Budget (Quarter-to-Date) — % variance displayed on card visual |
| 5 | CY vs PY QTD | Measure | — | Actuals vs Prior Year (Quarter-to-Date) — % variance displayed on card visual |
| 6 | YTD CY vs Total BT | Measure | — | YTD Actuals vs Full-Year Budget — % variance displayed on card visual |
| 7 | YTD CY vs Total PY | Measure | — | YTD Actuals vs Full-Year Prior Year — % variance displayed on card visual |

> Columns 4–7 are DAX measures (calculated, not stored in CSV export) referenced by card visuals.

---

#### Table 3: `last refresh` (Metadata Table)
- **Row Count:** 1 row
- **Purpose:** Tracks current snapshot context for display in report headers

| # | Column Name | Data Type | Sample Value | Description |
|---|-------------|-----------|-------------|-------------|
| 1 | current week | Numeric | 12.0 | Current week number |
| 2 | last refresh date | Date | 2026-03-16 | Date of last data refresh |
| 3 | current qtr | Text | Q1 | Current fiscal quarter |

---

## 6.2 Table Relationships & Cardinality

> DataModel is stored in XPress9-compressed VertiPaq format — relationships inferred from column matching and visual query patterns.

| From Table | From Column | To Table | To Column | Cardinality | Cross-filter | Notes |
|------------|-------------|----------|-----------|-------------|--------------|-------|
| — | — | — | — | — | — | **Disconnected tables model.** `T funnel health` is the sole fact table. `Others` and `last refresh` are independent single-row metadata/measures tables with no active relationships to the fact table. KPI card values are pre-computed aggregations stored in `Others`. |

**Hierarchy defined in model (inferred from filter usage):**
- `Geography Hierarchy`: Group of Regions → Region → Subregion → Destination

---

## 6.3 Measures

> DAX measures are stored in the `Others` table (DataModel is XPress9-compressed; names inferred from visual field references in `Report/Layout`).

| Measure Name | Table | Expression (inferred) | Description | Used On Pages |
|-------------|-------|-----------------------|-------------|---------------|
| CY vs BT QTD | Others | `DIVIDE([QTD CY] - [QTD BT], [QTD BT])` | Quarter-to-date actuals vs budget variance % | Order Intake Q |
| CY vs PY QTD | Others | `DIVIDE([QTD CY] - [QTD PY], [QTD PY])` | Quarter-to-date actuals vs prior year variance % | Order Intake Q |
| YTD CY vs Total BT | Others | `DIVIDE([YTD CY] - [Total BT], [Total BT])` | YTD actuals vs full-year budget variance % | Order Intake YTD, Order Intake FY |
| YTD CY vs Total PY | Others | `DIVIDE([YTD CY] - [Total PY], [Total PY])` | YTD actuals vs full-year prior year variance % | Order Intake YTD, Order Intake FY |
| BT YTD | T funnel health | Pre-aggregated budget YTD value | Budget target year-to-date | Order Intake YTD, Order Intake FY |
| FC YTD | T funnel health | Pre-aggregated forecast YTD value | Forecast year-to-date | Order Intake YTD, Order Intake FY |
| PY YTD | T funnel health | Pre-aggregated prior year YTD value | Prior year actuals year-to-date | Order Intake YTD, Order Intake FY |
| BT QTD | T funnel health | Pre-aggregated budget QTD value | Budget target quarter-to-date | Order Intake Q |
| FC2 Q YTD | T funnel health | Pre-aggregated FC2 quarterly cumulative | Forecast 2 quarter-to-date | Order Intake Q |
| PY Q | T funnel health | Pre-aggregated prior year quarterly | Prior year actuals quarter-to-date | Order Intake Q |
| CY Q | T funnel health | Pre-aggregated current year quarterly | CY actuals quarter-to-date | Order Intake Q |
| Total BT | T funnel health | Pre-aggregated full-year budget | Full-year budget total | Order Intake FY |
| Total FC | T funnel health | Pre-aggregated full-year forecast | Full-year forecast total | Order Intake FY |

> **Note:** Columns prefixed with `RT` (Running Total) are pre-aggregated time-series columns stored in `T funnel health` row-by-row — not DAX running total measures. This design pre-computes the weekly cumulative at ETL/data preparation time.

---

## 6.4 Calculated Columns

> Inferred from visual field usage; DataModel not directly readable.

| Column | Table | Description |
|--------|-------|-------------|
| Week1 | T funnel health | Likely a copy or alias of `Week` used as the chart x-axis (avoids ambiguity with slicer/filter `Week` field) |

---

## 6.5 Calculated Tables

No standalone calculated tables identified. `Others` and `last refresh` are loaded from the data source (not DAX-generated).

---

## 6.6 Report-Level Filters

> Applied to all 3 pages simultaneously.

| Filter Field | Table | Filter Type | Default State | Purpose |
|-------------|-------|-------------|---------------|---------|
| Group of Regions | T funnel health | Categorical | All selected (open) | Top-level geography filter |
| Region | T funnel health | Categorical | All selected (open) | Region-level geography filter |
| Subregion | T funnel health | Categorical | All selected (open) | Subregion-level geography filter |
| Destination | T funnel health | Categorical | All selected (open) | Country-level geography filter |

---

## 6.7 Page-Level Filters

No page-level filters on any page.

---

## 6.8 Page-by-Page Detail

---

### Page 1: Order Intake FY *(Default / Home page)*

**Purpose:** Full-year view — running total trend, YTD actuals vs BT/FC/PY, and full-year prediction models (funnel, 4Q, PQ, SQ).

**Visual count:** 12 (7 data visuals + 5 layout/text elements)

---

#### Visual 1 — Line Chart (Running Total Trend — Full Year)
| Role | Field | Description |
|------|-------|-------------|
| Category (X-Axis) | T funnel health.Week1 | Week number — 52-point x-axis |
| Y-Axis | Sum(T funnel health.RT CY) | CY running total — primary actuals line |
| Y-Axis | Sum(T funnel health.RT PY) | PY running total — prior year comparison |
| Y-Axis | Sum(T funnel health.RT BT) | Budget running total — target line |
| Y-Axis | Sum(T funnel health.FC2) | Forecast 2 running total — updated FC line |
| Y-Axis | Sum(T funnel health.funnel) | Funnel-based prediction |
| Y-Axis | Sum(T funnel health.funnel HF) | High-fidelity funnel prediction |
| Y-Axis | Sum(T funnel health.4Q) | 4-Quarter average prediction |
| Y-Axis | Sum(T funnel health.PQ) | Prior Quarter trend prediction |
| Y-Axis | Sum(T funnel health.SQ) | Same-Quarter prior-year prediction |
| Y-Axis | select / select1 / select2 / select3 / select4 / select5 | Dynamic/parameterized series (additional forecast or conditional lines) |

> **Note:** `select`, `select1`…`select5` are dynamically resolved series — likely additional forecast scenarios or region-conditional expressions resolved at query time.

**Page filters:** None
**Visual filters:** None

---

#### Visual 2 — Multi-Row Card: "Predictions"
| Role | Field | Description |
|------|-------|-------------|
| Values | Sum(T funnel health.funnel) | Funnel prediction (full year) |
| Values | Sum(T funnel health.funnel HF) | High-fidelity funnel prediction |
| Values | Sum(T funnel health.4Q) | 4-Quarter average prediction |
| Values | Sum(T funnel health.PQ) | Prior Quarter prediction |
| Values | Sum(T funnel health.SQ) | Same-Quarter prediction |

---

#### Visual 3 — Multi-Row Card: "Full Year"
| Role | Field | Description |
|------|-------|-------------|
| Values | Sum(T funnel health.PY) | Prior Year full-year total |
| Values | T funnel health.Total BT | Full-year budget target |
| Values | T funnel health.Total FC | Full-year forecast |

---

#### Visual 4 — Multi-Row Card: "YTD"
| Role | Field | Description |
|------|-------|-------------|
| Values | Sum(T funnel health.CY) | Current Year actuals (YTD) |
| Values | T funnel health.BT YTD | Budget year-to-date |
| Values | T funnel health.FC YTD | Forecast year-to-date |
| Values | T funnel health.PY YTD | Prior year year-to-date |

---

#### Visual 5 — Card: "Actuals vs PY YTD"
| Role | Field | Description |
|------|-------|-------------|
| Values | Others.YTD CY vs Total PY | YTD actuals vs full-year prior year — % variance |

---

#### Visual 6 — Card: "Actuals vs Budget YTD"
| Role | Field | Description |
|------|-------|-------------|
| Values | Others.YTD CY vs Total BT | YTD actuals vs full-year budget — % variance |

---

#### Visuals 7–12 — Layout Elements
| # | Type | Purpose |
|---|------|---------|
| 7 | image | AGFA logo or report header image |
| 8 | textbox | Page title or descriptive label |
| 9 | textbox | Sub-label or week reference text |
| 10 | textbox | Additional annotation or footer |

---

### Page 2: Order Intake YTD

**Purpose:** Year-to-date view — running total trend with YTD KPI cards and prediction models. Mirrors FY page but focuses on YTD scope; "End of Quarter" multi-row card added.

**Visual count:** 11 (6 data visuals + 5 layout/text elements)

---

#### Visual 1 — Line Chart (Running Total Trend — YTD)
| Role | Field | Description |
|------|-------|-------------|
| Category (X-Axis) | T funnel health.Week1 | Week number x-axis |
| Y-Axis | Sum(T funnel health.RT CY) | CY running total YTD |
| Y-Axis | Sum(T funnel health.RT PY) | PY running total YTD |
| Y-Axis | Sum(T funnel health.RT BT) | Budget running total YTD |
| Y-Axis | select5 | Dynamic series 5 |
| Y-Axis | Sum(T funnel health.PQ) | Prior Quarter prediction |
| Y-Axis | Sum(T funnel health.4Q) | 4-Quarter average prediction |
| Y-Axis | Sum(T funnel health.SQ) | Same-Quarter prediction |
| Y-Axis | select3 | Dynamic series 3 |
| Y-Axis | select4 | Dynamic series 4 |
| Y-Axis | select / select1 / select2 | Dynamic series 0–2 |
| Y-Axis | Sum(T funnel health.funnel) | Funnel prediction |
| Y-Axis | Sum(T funnel health.funnel HF) | High-fidelity funnel prediction |
| Y-Axis | Sum(T funnel health.FC2) | Forecast 2 |

**Page filters:** None
**Visual filters:** None

---

#### Visual 2 — Multi-Row Card: "YTD"
| Role | Field | Description |
|------|-------|-------------|
| Values | Sum(T funnel health.CY) | CY actuals year-to-date |
| Values | T funnel health.BT YTD | Budget YTD |
| Values | T funnel health.FC YTD | Forecast YTD |
| Values | T funnel health.PY YTD | Prior year YTD |

---

#### Visual 3 — Multi-Row Card: "End of Quarter"
| Role | Field | Description |
|------|-------|-------------|
| Values | Sum(T funnel health.RT PY) | Running total PY at end of quarter |
| Values | Sum(T funnel health.RT BT) | Running total Budget at end of quarter |
| Values | Sum(T funnel health.RT FC2) | Running total FC2 at end of quarter |

---

#### Visual 4 — Multi-Row Card: "Predictions"
| Role | Field | Description |
|------|-------|-------------|
| Values | Sum(T funnel health.funnel) | Funnel-based prediction |
| Values | Sum(T funnel health.funnel HF) | High-fidelity funnel prediction |
| Values | Sum(T funnel health.4Q) | 4-Quarter average prediction |
| Values | Sum(T funnel health.PQ) | Prior Quarter prediction |
| Values | Sum(T funnel health.SQ) | Same-Quarter prediction |

---

#### Visual 5 — Card: "Actuals vs Budget YTD"
| Role | Field | Description |
|------|-------|-------------|
| Values | Others.YTD CY vs Total BT | YTD actuals vs full-year budget — % variance |

---

#### Visual 6 — Card: "Actuals vs PY YTD"
| Role | Field | Description |
|------|-------|-------------|
| Values | Others.YTD CY vs Total PY | YTD actuals vs full-year PY — % variance |

---

#### Visuals 7–11 — Layout Elements
| # | Type | Purpose |
|---|------|---------|
| 7 | image | Header image |
| 8 | textbox | Page title |
| 9 | textbox | Sub-label |
| 10 | textbox | Week/refresh reference |

---

### Page 3: Order Intake Q

**Purpose:** Quarter-to-date view — running total trend scoped to current quarter, with QTD KPI cards, prediction models, and full-quarter projections.

**Visual count:** 13 (7 data visuals + 6 layout/text elements)

---

#### Visual 1 — Line Chart (Running Total Trend — Quarterly)
| Role | Field | Description |
|------|-------|-------------|
| Category (X-Axis) | T funnel health.Week1 | Week number x-axis |
| Y-Axis | Sum(T funnel health.RT CY Q) | CY running total QTD |
| Y-Axis | Sum(T funnel health.RT PY Q) | PY running total QTD |
| Y-Axis | Sum(T funnel health.RT BT Q) | Budget running total QTD |
| Y-Axis | select5 | Dynamic series 5 |
| Y-Axis | Sum(T funnel health.PQ Q) | Prior Quarter prediction (quarterly) |
| Y-Axis | Sum(T funnel health.4Q Q) | 4-Quarter average prediction (quarterly) |
| Y-Axis | Sum(T funnel health.SQ Q) | Same-Quarter prediction (quarterly) |
| Y-Axis | Sum(T funnel health.FC2 Q) | FC2 quarterly (appears twice — likely conditional display) |
| Y-Axis | select3 / select4 / select / select1 / select2 | Dynamic series 0–4 |
| Y-Axis | Sum(T funnel health.funnel Q) | Funnel prediction (quarterly) |
| Y-Axis | Sum(T funnel health.funnel HF Q) | High-fidelity funnel prediction (quarterly) |

**Page filters:** None
**Visual filters:** None

---

#### Visual 2 — Multi-Row Card: "QTD"
| Role | Field | Description |
|------|-------|-------------|
| Values | T funnel health.CY Q | CY actuals QTD |
| Values | T funnel health.BT QTD | Budget QTD |
| Values | T funnel health.FC2 Q YTD | FC2 cumulative QTD |
| Values | T funnel health.PY Q | Prior year QTD |

---

#### Visual 3 — Multi-Row Card: "Predictions"
| Role | Field | Description |
|------|-------|-------------|
| Values | Sum(T funnel health.funnel Q) | Funnel prediction (quarterly) |
| Values | Sum(T funnel health.funnel HF Q) | High-fidelity funnel prediction (quarterly) |
| Values | Sum(T funnel health.4Q Q) | 4-Quarter average prediction (quarterly) |
| Values | Sum(T funnel health.PQ Q) | Prior Quarter prediction (quarterly) |
| Values | Sum(T funnel health.SQ Q) | Same-Quarter prediction (quarterly) |

---

#### Visual 4 — Card: "Actuals vs Budget Q"
| Role | Field | Description |
|------|-------|-------------|
| Values | Others.CY vs BT QTD | QTD actuals vs budget — % variance |

---

#### Visual 5 — Card: "Actuals vs PY Q"
| Role | Field | Description |
|------|-------|-------------|
| Values | Others.CY vs PY QTD | QTD actuals vs prior year — % variance |

---

#### Visual 6 — Multi-Row Card: "Full Quarter"
| Role | Field | Description |
|------|-------|-------------|
| Values | Sum(T funnel health.RT PY Q) | PY running total at quarter-end |
| Values | Sum(T funnel health.RT BT Q) | Budget running total at quarter-end |
| Values | Sum(T funnel health.RT FC2 Q) | FC2 running total at quarter-end |

---

#### Visuals 7–13 — Layout Elements
| # | Type | Purpose |
|---|------|---------|
| 7 | textbox | Page title or section label |
| 8 | textbox | Sub-label |
| 9 | image | Header image |
| 10 | textbox | Quarter reference label |
| 11 | textbox | Week/refresh annotation |
| 12 | textbox | Footer or data note |

---

## 6.9 Slicer Summary

No dedicated slicer visuals on any page. All filtering is done via report-level filter pane (Group of Regions, Region, Subregion, Destination).

---

## 6.10 Key Domain Reference

### Column Naming Convention

| Pattern | Meaning |
|---------|---------|
| `RT *` | Running Total — cumulative from Week 1 to current week (YTD scope) |
| `RT * Q` | Running Total — cumulative from start of quarter to current week (QTD scope) |
| `* Q` suffix | Quarterly variant — value scoped to current quarter only |
| No suffix | YTD / full-year value or snapshot |
| `funnel` | Pipeline-based prediction using all open opportunities |
| `funnel HF` | High-fidelity funnel — only high-confidence opportunities |
| `4Q` | 4-Quarter rolling average prediction model |
| `PQ` | Prior Quarter actuals trend-based prediction |
| `SQ` | Same Quarter prior-year based prediction |
| `BT` | Budget Target |
| `FC` / `FC2` | Forecast 1 / Forecast 2 (two concurrent forecast versions) |
| `CY` | Current Year actuals |
| `PY` | Prior Year actuals |

### Page Matrix

| Page | Time Scope | Prediction Shown | Key Cards |
|------|-----------|-----------------|-----------|
| Order Intake FY | Full Year | funnel, funnel HF, 4Q, PQ, SQ | Full Year vs BT/PY + YTD actuals |
| Order Intake YTD | Year-to-Date | funnel, funnel HF, 4Q, PQ, SQ | YTD vs BT/PY + End of Quarter |
| Order Intake Q | Quarter-to-Date | funnel Q, funnel HF Q, 4Q Q, PQ Q, SQ Q | QTD vs BT/PY + Full Quarter end |

### Geography Hierarchy
`Group of Regions` → `Region` → `Subregion` → `Destination`
Three top-level groups: **Europe-Pacific**, **Intercontinental**, **North America**

---

*End of Commercial Analytics - OI & Funnel Health Cockpit documentation.*

---
