# AGFA HE IT — Data Analytics Findings

> **Analyst:** Claude (AI Assistant)
> **Date:** 2026-03-18
> **Scope:** Order Book Overview — BRM HQ Views
> **Source File:** `Data/7.14 Order Book Overview pivot (BRM HQ views).xlsx`
> **Source System:** SAP BEx (Business Warehouse)

---

## 1. File Overview

This file is the primary **Order Book (OB) tracking report** used by AGFA's Business Revenue Management (BRM) team at HQ level. It contains **19 sheets** of pivot tables exported from SAP BW/BEx, covering monthly order book snapshots from **February 2025 through February 2026** (13 periods), with one historical sheet going back to **2015**.

All monetary values are in **thousands of EUR (kEUR)** unless otherwise noted.

---

## 2. Source Data Architecture

### 2.1 Source System & Connection

| Property | Detail |
|----------|--------|
| **Database type** | Microsoft Access (`.mdb`) |
| **File path** | `\\agfahealthcare.com\dfs\data\be\medical\medical\controlling\Preparation Presentations\OB Data for pivot.mdb` |
| **Connection name** | `Connection2` (ODBC via MS Access Driver, DriverId=25) |
| **Last refreshed by** | Burney, Mohd Fahad |
| **Last refresh date** | ~Feb 2026 (Excel serial date 46090) |
| **Total data rows** | **20,595 records** in the pivot cache |

> The file is **not** a direct SAP BEx export despite containing a BExRepositorySheet. The BEx metadata tag (`http://www.sap.com/ip/bi/bexanalyzer/excel/application`) indicates SAP BEx Analyzer was used, but the **actual data source is an intermediate Microsoft Access database** — SAP data has been pre-processed and loaded into this `.mdb` file before being connected to Excel.

### 2.2 Source Table

There is a **single flat table** that feeds all 17 analytical pivot sheets:

**Table name:** `OB - Data source for pivot`

This is a denormalized, flattened table — all dimension attributes and measures are in a single wide table. No joins between tables are performed at the Excel level.

### 2.3 Source Table — Full Column Definition

The SQL query pulling this table is:

```sql
SELECT
    `OB - Data source for pivot`.Period,
    `OB - Data source for pivot`.Year,
    `OB - Data source for pivot`.`Mth nr`,
    `OB - Data source for pivot`.`Mth name`,
    `OB - Data source for pivot`.`Key Fig`,
    `OB - Data source for pivot`.`Key Fig Detail`,
    `OB - Data source for pivot`.`BD c`,
    `OB - Data source for pivot`.`BD d`,
    `OB - Data source for pivot`.`BU c`,
    `OB - Data source for pivot`.`BU d`,
    `OB - Data source for pivot`.`BC c`,
    `OB - Data source for pivot`.`BC d`,
    `OB - Data source for pivot`.`FA Grp`,
    `OB - Data source for pivot`.`FA c`,
    `OB - Data source for pivot`.`FA d`,
    `OB - Data source for pivot`.`Dest c`,
    `OB - Data source for pivot`.`Dest d`,
    `OB - Data source for pivot`.Val,
    `OB - Data source for pivot`.GeoFin,
    `OB - Data source for pivot`.`RGrp lvl1`,
    `OB - Data source for pivot`.`RGrp lvl2`,
    `OB - Data source for pivot`.`RGrp lvl3`,
    `OB - Data source for pivot`.Region,
    `OB - Data source for pivot`.Subregion,
    `OB - Data source for pivot`.VUSD
FROM `OB - Data source for pivot`
```

All **25 columns** from the source table are used. No filters, aggregations, or calculations are done at the SQL level — everything is handled in the Excel pivot layer.

### 2.4 Column-by-Column Reference

#### Time Dimensions

| Column | Type | Distinct Values | Sample Values | Description |
|--------|------|----------------|---------------|-------------|
| `Period` | Text | 14 | `2025-01` … `2026-02` | Year-month snapshot identifier (YYYY-MM) |
| `Year` | Text | 2 | `2025`, `2026` | Fiscal year of the snapshot |
| `Mth nr` | Text | 12 | `01` … `12` | Month number (zero-padded string) |
| `Mth name` | Text | 12 | `JAN` … `DEC` | Month abbreviation |

#### Key Figure / Metric Columns

| Column | Type | Distinct Values | Sample Values | Description |
|--------|------|----------------|---------------|-------------|
| `Key Fig` | Text | 2 | `Total Order Book`, `Other` | High-level metric type |
| `Key Fig Detail` | Text | 8 | See below | **Granular order book bucket classification** |
| `Val` | Numeric | Continuous | -484.31 to 27,774.28 | **Order book value in kEUR** (primary measure) |
| `VUSD` | Numeric | Continuous | -576.33 to 30,624.81 | **Order book value in kUSD** (secondary measure — FX converted) |

**All 8 `Key Fig Detail` values in the source (pivots show grouped versions):**

| Key Fig Detail (source) | Mapped to in Pivots | Category |
|------------------------|---------------------|----------|
| `Planned Current Year` | Planned Current Year | Committed / In-year |
| `Planned Next Years` | Planned Next Years | Multi-year backlog |
| `Rev Overdue <= 6 mths` | Rev Overdue <= 6 mths | At-risk (grouped in "Key Fig Detail2") |
| `Rev overdue > 6 mths` | Rev Overdue <= 6 mths *(grouped)* | At-risk (hidden in summary views) |
| `Not Planned Opportunity <= 3 mths` | Not Planned yet | Unplanned opportunity |
| `Not Planned Opportunity 4 - 6 mths` | Not Planned yet | Unplanned opportunity |
| `Not Planned Opportunity 7 - 24 mths` | Not Planned yet | Unplanned opportunity |
| `Not Planned sales order` | Not Planned yet | Unplanned order |

> **Important:** The pivot displays **4 grouped buckets** via the computed field `Key Fig Detail2`, but the source has **8 granular statuses**. The grouping masks the difference between short and long overdue revenue, and between different stages of unplanned opportunities. The raw `.mdb` data contains this granularity.

#### Business Division & Unit Dimensions

| Column | Type | Distinct Values | All Values | Description |
|--------|------|----------------|-----------|-------------|
| `BD c` | Text | 3 | `IT`, `IM`, `J0` | Business Division code |
| `BD d` | Text | 3 | `IT Division`, `Imaging Division`, `General HE` | Business Division full name |
| `BU c` | Text | 9 | `S1`, `S2`, `S3`, `S4`, `K1`, `K2`, `K4`, `JA`, `J0` | Business Unit code |
| `BU d` | Text | 6 | `IITS`, `DIIT`, `HCIS`, `ICAS`, `#N/A`, *(blank)* | Business Unit destination/description |

> **BU codes decoded:** S1–S4 are the primary software/IT solution units. K1, K2, K4 appear to be consumable/hardware-related units. JA and J0 are likely general/catch-all codes. `IITS` (Integrated IT Solutions) appears as the main destination BU for S1.

#### Business Category Dimensions

| Column | Type | Distinct Values | Description |
|--------|------|----------------|-------------|
| `BC c` | Text | 29 | Business Category code (2-char) |
| `BC d` | Text | 29 | Business Category full name |

**All 29 Business Categories (BC c → BC d):**

| Code | Description | Code | Description |
|------|-------------|------|-------------|
| SH | Enterprise Imaging I | SC | ENT Clin.&EPR Lic. |
| KR | DR Products | SD | ENT Clin.&EPR Hard. |
| HI | Cardio maintain | SE | DIIT ORBIS RIS |
| SI | RadIT maintain | SF | DITT Others |
| SM | IITS General | SJ | RIS Maintain |
| SQ | HYDMedia | SZ | Agfa Managed Service |
| SR | LAB | SG | ENT Technical Serv. |
| SS | Enterprise Resource | KP | DR 3rd Parties |
| ST | IT-Services (DACH) | KI | FPS Classics |
| SU | Clinical Information | KJ | FPS Hardcopy |
| SW | HCIS General | KS | CR Products |
| SX | Agfa Portal | JA | IMG General |
| BI | Business Intelligence | SK | Rad Invest |
| SV | EAI | SY | Web DCR/IPPS |
| — | — | J0 | HE General |

#### Financial Application (Revenue Stream) Dimensions

| Column | Type | Distinct Values | Description |
|--------|------|----------------|-------------|
| `FA c` | Text | 15 | Financial Application code (e.g., `010O`, `010H`) |
| `FA d` | Text | 12 | Financial Application full description |
| `FA Grp` | Text | 6 | Grouped revenue stream category |

**FA Grp and FA d values — Revenue Stream Taxonomy:**

| FA Grp (Pivot group) | FA d (Source detail) | FA c Code |
|---------------------|---------------------|-----------|
| **Own Licenses** | Own IP software | 010O |
| **Own Licenses** | Own Licenses | 010L |
| **Own Licenses** | Recurr. Own Licenses | 010Y |
| **3rdP Licenses** | 3rdP Software | 010Q |
| **3rdP Licenses** | 3rdP Licenses | 010T |
| **3rdP Licenses** | Recurr. 3rdP Licenses | 010X |
| **Implementation Services** | Implementation Services | 010S |
| **Implementation Services** | Recurr. Implementation Services | 010Z |
| **Hardware** | Hardware | 010H |
| **Hardware** | Recurr. Hardware | 010W |
| **Managed Services** | Managed Services | 010V |
| **Consumables** | Consumables | 010C |
| *(unassigned)* | *(unknown)* | 010I, 010U, # |

> **Notable:** Each FA Grp contains both **one-time** and **recurring** variants (prefix `Recurr.`). The pivot aggregates these together. The source data can distinguish recurring vs. non-recurring revenue — an important distinction for revenue quality analysis.

#### Geographic Dimensions

| Column | Type | Distinct Values | Description |
|--------|------|----------------|-------------|
| `GeoFin` | Text | 2 | `New IITS`, `ACESO` — Financial geography segment |
| `RGrp lvl1` | Text | 3 | `Europe & Int`, `N.America`, `Worldwide` |
| `RGrp lvl2` | Text | 6 | `Europe North`, `Europe South`, `International`, `N.America`, `Europe`, `Worldwide` |
| `RGrp lvl3` | Text | 8 | `Aspac`, `Direct Export`, `Europe North`, `Europe South`, `Latam`, `N.America`, `South`, `Worldwide` |
| `Region` | Text | 14 | `Nordic`, `BeNeLux`, `Dach`, `France`, `UK`, `Iberia`, `Italy`, `N.America`, `Canada`, `USA`, `Latam`, `Aspac`, `Direct Export`, `Worldwide` |
| `Subregion` | Text | 25 | Granular sub-regional breakdown |
| `Dest c` | Text | 90 | ISO country code (destination country of sale) |
| `Dest d` | Text | 90 | Destination country full name |

**90 destination countries** are present in the data, spanning all major geographies. Key ones include: USA, CANADA, GERMANY, FRANCE, UK, BRAZIL, MEXICO, AUSTRALIA, SINGAPORE, SOUTH AFRICA, and 80+ more.

### 2.5 Computed Columns (Created in Excel Pivot Layer — Not in Source)

These two columns do NOT exist in the `.mdb` — they are grouping fields created inside the Excel pivot cache:

| Computed Column | Based On | Grouping Logic |
|----------------|----------|----------------|
| `Key Fig Detail2` | `Key Fig Detail` | Groups 8 source buckets → 4 display buckets; hides `Rev overdue > 6 mths` inside the <=6 mths group |
| `FA Grp2` | `FA Grp` | Groups 6 FA Groups → 2 high-level groups: `HW & 3rdP SW` and `Own SW & All Services`; `Consumables` appears as separate group |

---

## 3. Data Structure & Dimensions

### 2.1 Common Filter Dimensions

Every sheet in this file is a pivot filtered on a consistent set of dimensions:

| Dimension | Description |
|-----------|-------------|
| `Year / Period / Mth nr / Mth name` | Time — the **snapshot month** of the order book (not delivery/revenue date) |
| `RGrp lvl1 / lvl2 / lvl3` | Regional group hierarchy — 3 levels of geographic rollup |
| `Region / Subregion` | Sales region and sub-region |
| `Dest c / Dest d` | Destination country (code / full name) |
| `GeoFin` | Financial geography segment (e.g., `New IITS`) |
| `BD c / BD d` | **Business Division** — e.g., `IT` = IT division |
| `BU c / BU d` | **Business Unit** — `S1`, `S2`, `S3`, `S4`, `H1` |
| `BC c / BC d` | Business Category (code / name) |
| `FA c / FA d / FA Grp / FA Grp2` | **Financial Application** group — revenue stream classification |
| `Key Fig` | Always `Total Order Book` in this file |
| `Key Fig Detail / Key Fig Detail2` | Order book classification bucket (see Section 3) |

### 2.2 Business Units Present

| BU Code | Coverage in File |
|---------|-----------------|
| `S1` | Primary unit — most sheets, largest order book |
| `S2` | Sheets 6, 7, 12, 14 |
| `S3` | Sheet 15 (IT division, GeoFin=New IITS only) |
| `S4` | Sheets 8, 9 |
| `H1` | Sheet 19 (historical, from 2015) |

---

## 3. Core Metric: Order Book Bucket Classification

The **Total Order Book** is split into 4 planning buckets across every pivot:

| Bucket | Definition | Interpretation |
|--------|-----------|----------------|
| **Planned Current Year** | Revenue scheduled for recognition in the current fiscal year | Near-term, committed pipeline |
| **Planned Next Years** | Revenue planned beyond the current FY | Long-term backlog — multi-year contracts |
| **Rev Overdue <= 6 mths** | Revenue that should have been recognized but is delayed (up to 6 months overdue) | Execution risk / slippage |
| **Not Planned yet** | Orders received but not yet scheduled | Unplanned backlog — needs active planning |

> **Key Insight:** The **"Planned Next Years"** bucket consistently represents the largest share of the order book, confirming that AGFA's IT business operates on **multi-year contract cycles** (typical for enterprise software and managed services).

---

## 4. Revenue Stream Classification

### 4.1 High-Level Groups (FA Grp2)
- **HW & 3rdP SW** — Hardware + third-party software licenses
- **Own SW & All Services** — Own software licenses + all service categories

### 4.2 Detailed Revenue Streams (Sheet 10 — IT per RevStr)

| Revenue Stream | Description |
|---------------|-------------|
| **Hardware** | Physical equipment |
| **Own Licenses** | Proprietary software licenses |
| **3rd Party Licenses** | Resold/bundled third-party software |
| **Implementation Services** | Project-based delivery/integration services |
| **Managed Services** | Ongoing recurring service contracts |

---

## 5. KPI Catalogue — What Is Measured and How

### 5.1 How Many KPIs Exist

Despite having 17 analytical pivot sheets, the entire file uses only **2 distinct KPIs**, both derived from a single source column (`Val`):

| KPI Name | Source Field | Aggregation | Display Format | Appears In |
|----------|-------------|-------------|---------------|-----------|
| **Value** | `Val` | SUM | Thousands (kEUR) | All 17 sheets |
| **% of total (100%)** | `Val` | SUM → % of parent row | Percentage (0%) | Sheets 10, 13, 14, 15 only |

There are **no calculated fields, no DAX, no custom formulas** — all KPIs are pure aggregations of the raw `Val` column from the source table.

---

### 5.2 KPI 1: `Value` — Total Order Book (kEUR)

**Definition:**
```
Value = SUM(Val)
WHERE Key Fig = 'Total Order Book'
  AND BU c = [segment filter]
  AND Period IN [2025-02 ... 2026-02]
```

**Logic:** Straight sum of the `Val` column (kEUR) with filters applied at the pivot level. No mathematical transformation. The `Key Fig = 'Total Order Book'` filter permanently excludes the `Other` category present in the source data.

**What it represents:** The total monetary value of all open orders (backlog) at a given snapshot month — i.e., revenue that has been contracted but not yet recognized.

**Number format:** Two display variants:
- `numFmtId=165` → Custom thousands format with decimals (e.g., `144,389.47`) — used in sheets with higher precision requirements
- `numFmtId=3` → Standard thousands with no decimals (`#,##0`) — used in simpler overview sheets

**Sliced by row/column combinations to produce different views:**

| Pivot Layout Pattern | Row Fields | Column Fields | Sheets Using It |
|---------------------|-----------|--------------|----------------|
| **A — Bucket × Time** | `Key Fig Detail2` | `Year`, `Period` | Sheet 2 (Total OB evo) |
| **B — Region × Bucket × Time** | `RGrp lvl2`, `RGrp lvl3`, `Key Fig Detail2` | `Year`, `Period` | Sheets 3, 6, 8 (per region) |
| **C — Region × RevStr × Time** | `RGrp lvl2`, `RGrp lvl3`, `FA Grp2` or `FA Grp` | `Year`, `Period` | Sheets 4, 5, 7, 9, 13 (per RevStr) |
| **D — RevStr × Time (flat)** | `(Values)`, `FA Grp` | `Year`, `Period` | Sheet 10 (IT per RevStr) |
| **E — Flat totals × Time** | *(none — single total row)* | `Year`, `Period` | Sheets 11, 12 (historical series) |
| **F — BU dest × Bucket × Time** | `BU d`, `Key Fig Detail2` | `Year`, `Period` | Sheet 16 (S1 OB EI) |
| **G — Region × BU dest × Time** | `Region`, `BU d` | `Year`, `Period` | Sheet 18 (S1 OB EI per region) |

---

### 5.3 KPI 2: `% of total (100%)` — Revenue Stream Mix Share

**Definition:**
```
% of total (100%) = SUM(Val for this row)
                  / SUM(Val for parent row in RGrp lvl2 grouping)
showDataAs = percentOfParentRow
baseField  = RGrp lvl2
```

**Logic:** This is an Excel pivot `percentOfParentRow` calculation — not a simple `Val / Grand Total`. It computes each row's value as a percentage of its parent row in the `RGrp lvl2` (regional group level 2) hierarchy.

In practice, since these pivots have no `RGrp lvl2` row breakdown (the region filter is set to "All"), the "parent row" collapses to the **grand total row**. The result is therefore effectively:

```
% of total (100%) = SUM(Val for FA Grp row) / SUM(Val for all FA Grp rows)
                  = Revenue stream share of total order book
```

**What it represents:** The **portfolio mix of revenue streams** as a percentage of total order book for the given period. Answers: "What % of the backlog is Own Licenses vs. Managed Services vs. Hardware etc.?"

**Appears in:**

| Sheet | Rows | What the % means |
|-------|------|-----------------|
| 10 — IT per RevStr | FA Grp (5 streams) | % of total OB per revenue stream, all regions combined, S1 IT |
| 13 — IT per RevStr Grp | FA Grp (grouped) | Same but with grouped revenue streams |
| 14 — IT per RevStr (2) | FA Grp | % per revenue stream for S2, GeoFin=New IITS |
| 15 — IT per RevStr (3) | FA Grp | % per revenue stream for S3, GeoFin=New IITS |

**Number format:** `numFmtId=10` → Standard percentage with 0 decimals (e.g., `32%`)

---

### 5.4 Filter Logic — How Each Sheet Scopes the KPI

Every sheet is the **same KPI (`SUM(Val)`)** with a different filter combination applied. The filters are what differentiate each view:

#### Permanent Filters (Fixed Across All Sheets)
```
Key Fig = 'Total Order Book'       -- always excludes 'Other'
Period NOT IN ['2025-01']          -- first month excluded from all trend sheets
```

#### Variable Filters by Sheet (BU Segment & Business Division)

| Sheets | BU c Filter | BD c Filter | GeoFin Filter | BC c Filter | Purpose |
|--------|------------|------------|--------------|------------|---------|
| 1 — Default | S1, S2, S3, S4 | (All) | (All) | (All) | Company-wide total |
| 2 — Total OB evo | **S1** | **IT only** | (All) | (All) | IT Division S1 backlog trend |
| 3, 4, 5 — S1 views | **S1** | (All) | (All) | (All) | S1 across all divisions |
| 6, 7 — S2 views | **S2** | (All) | (All) | (All) | S2 segment |
| 8, 9 — S4 views | **S4** | (All) | (All) | (All) | S4 segment |
| 10 — IT per RevStr | **S1** | **IT only** | (All) | (All) | IT Division S1 by revenue stream |
| 11 — S1 region (2) | **S1** | (All) | (All) | (All) | S1 historical (2015+) |
| 12 — S2 region (2) | **S2** | (All) | (All) | (All) | S2 historical (2015+) |
| 13 — IT RevStr Grp | **S1** | **IT only** | (All) | (All) | IT Division S1 grouped streams |
| 14 — IT RevStr (2) | **S2** | **IT only** | **New IITS** | (All) | IT Division S2, IITS product set |
| 15 — IT RevStr (3) | **S3** | **IT only** | **New IITS** | (All) | IT Division S3, IITS product set |
| 16 — S1 OB EI | **S1** | (All) | (All) | **EI only** | Enterprise Imaging sub-segment |
| 18 — S1 OB EI region | **S1** | (All) | (All) | **EI only** | EI by region |

#### Enterprise Imaging (EI) Business Category Filter — Sheets 16 & 18
The `BC c` filter on sheets 16 and 18 selects only Enterprise Imaging business categories, **excluding** the following 15 BC codes:
`HI` (Cardio maintain), `KP` (DR 3rd Parties), `KR` (DR Products), `SI` (RadIT maintain), `SJ` (RIS Maintain), `SM` (IITS General), `SQ` (HYDMedia), `SR` (LAB), `SS` (Enterprise Resource), `ST` (IT-Services DACH), `SU` (Clinical Information), `SV` (EAI), `SW` (HCIS General), `SX` (Agfa Portal), `SZ` (Agfa Managed Service)

The **included** EI categories are: `SH` (Enterprise Imaging I), `SC` (ENT Clin.&EPR Lic.), `SD` (ENT Clin.&EPR Hard.), `SE` (DIIT ORBIS RIS), `SF` (DITT Others), `BI` (Business Intelligence), `SG` (ENT Technical Serv.), `SK` (Rad Invest), `SY` (Web DCR/IPPS), `KI` (FPS Classics), `KJ` (FPS Hardcopy), `KS` (CR Products), `JA` (IMG General), `J0` (HE General)

---

### 5.5 The Key Fig Detail2 Grouping Logic (Most Critical KPI Derivative)

This computed field is the **most analytically important construct** in the file. It groups 8 raw order book statuses into 4 display buckets:

```
Key Fig Detail2 mapping:
  'Planned Current Year'          <-- Key Fig Detail = 'Planned Current Year'
  'Planned Next Years'            <-- Key Fig Detail = 'Planned Next Years'
  'Rev Overdue <= 6 mths'         <-- Key Fig Detail IN ('Rev Overdue <= 6 mths',
                                                          'Rev overdue > 6 mths')  ← HIDDEN
  'Not Planned yet' (Group1)      <-- Key Fig Detail IN ('Not Planned Opportunity <= 3 mths',
                                                          'Not Planned Opportunity 4 - 6 mths',
                                                          'Not Planned Opportunity 7 - 24 mths',
                                                          'Not Planned sales order')
```

**Critical implication:** The `Rev overdue > 6 mths` status is silently merged into `Rev Overdue <= 6 mths`. Any overdue orders older than 6 months are **invisible** in all pivot views. To see truly at-risk revenue, the raw `.mdb` source must be queried with the `Key Fig Detail` field unfiltered.

---

### 5.6 FA Grp2 Grouping Logic (Revenue Stream Simplification)

A second computed grouping used in sheets 4, 5, 13:

```
FA Grp2 mapping:
  'HW & 3rdP SW'        <-- FA Grp IN ('Hardware', '3rdP Licenses')
  'Own SW & All Svc'    <-- FA Grp IN ('Own Licenses', 'Implementation Services',
                                        'Managed Services')
  'Consumables'         <-- FA Grp = 'Consumables'
```

This is a deliberate business simplification that separates AGFA's **own intellectual property revenue** (software + services) from **pass-through/hardware revenue** (HW + 3rdP), which have fundamentally different margin profiles.

---

## 6. Sheet-by-Sheet Inventory

| # | Sheet Name | BU | BD Filter | Geographic Dimension | Primary Use |
|---|-----------|----|-----------|--------------------|-------------|
| 1 | Default pivot | Multiple | All | None (total) | Single-row total with JAN/FEB columns — quick reference |
| 2 | Total OB evo | S1 | IT | None (total) | **Order book evolution** over 13 months — trend tracking |
| 3 | S1 per region | S1 | All | RGrp lvl2 + lvl3 | S1 OB by region × 4 planning buckets |
| 4 | S1 per RevStr | S1 | All | RGrp lvl2 + lvl3 | S1 OB by region × revenue stream (HW vs SW/Services) |
| 5 | S1 per RevStr (2) | S1 | All | RGrp lvl2 + lvl3 | Variant of sheet 4 (FA Grp level) |
| 6 | S2 per region | S2 | All | RGrp lvl2 + lvl3 | S2 OB by region × 4 planning buckets |
| 7 | S2 per RevStr | S2 | All | RGrp lvl2 + lvl3 | S2 OB by region × revenue stream |
| 8 | S4 per region | S4 | All | RGrp lvl2 + lvl3 | S4 OB by region × 4 planning buckets |
| 9 | S4 per RevStr | S4 | All | RGrp lvl2 + lvl3 | S4 OB by revenue stream |
| 10 | IT per RevStr | S1 | IT | None (total) | IT division — 5 detailed revenue streams + % share of total |
| 11 | S1 per region (2) | S1 | All | Region + Subregion | **Historical series 2015–2026** — total OB per region (no bucket split) |
| 12 | S2 per region (2) | S2 | All | Region + Subregion | Same historical series for S2 |
| 13 | IT per RevStr Grp | S1 | IT | RGrp hierarchy | IT OB by grouped FA Grp |
| 14 | IT per RevStr (2) | S2 | IT | RGrp hierarchy | IT S2, filtered to GeoFin = New IITS |
| 15 | IT per RevStr (3) | S3 | IT | RGrp hierarchy | IT S3, filtered to GeoFin = New IITS |
| 16 | S1 OB EI | S1 | All | None | S1 by destination BU (IITS) × 4 planning buckets |
| 17 | BExRepositorySheet | — | — | — | SAP BEx metadata — **not analytical data** |
| 18 | S1 OB EI per region | S1 | All | Region | S1 EI order book broken out by region |
| 19 | H1 per Region | H1 | All | Region Grp + Reg | H1 segment historical view from 2015 |

---

## 6. Quantitative Findings

### 6.1 Total Order Book — Monthly Trend (S1, All Regions, kEUR)

| Snapshot Month | Total Order Book (kEUR) | MoM Change |
|---------------|------------------------|------------|
| 2025-02 | 144,389 | — |
| 2025-03 | 158,407 | **+9.7%** |
| 2025-04 | 153,137 | -3.3% |
| 2025-05 | 147,179 | -3.9% |
| 2025-06 | 142,412 | -3.2% |
| 2025-07 | 140,479 | -1.4% |
| 2025-08 | 144,332 | +2.7% |
| 2025-09 | 166,938 | **+15.7%** |
| 2025-10 | 179,325 | +7.4% |
| 2025-11 | 176,543 | -1.6% |
| 2025-12 | **207,361** | **+17.5% (peak)** |
| 2026-01 | 194,219 | -6.3% |
| 2026-02 | 189,631 | -2.4% |

**Pattern observed:**
- Mid-year trough (Jun–Jul 2025): ~140K — likely reflects revenue recognition burn-down mid-year
- Strong Q3/Q4 intake: Sep–Dec 2025 surge to peak of **207K** — driven by year-end order intake
- Post-peak burn-down in early 2026 as planned current year revenue gets recognized

### 6.2 Order Book Bucket Evolution (Sheet 2 — S1, BD=IT)

| Bucket | 2025-02 | 2025-09 | 2025-12 | 2026-02 | Trend |
|--------|---------|---------|---------|---------|-------|
| Planned Current Year | 49,815 | 19,184 | 12,332 | 76,077 | Depletes through year, resets in Jan |
| Planned Next Years | 80,900 | 132,145 | 171,777 | 98,347 | Builds through year as new orders signed |
| Rev Overdue <=6 mths | 7,707 | 9,296 | 20,864 | 13,530 | Elevated at year-end — delivery pressure |
| Not Planned yet | 5,968 | 6,313 | 2,388 | 1,677 | Shrinks — good planning discipline |

**Key insight:** The dramatic reset of "Planned Current Year" from ~12K (Dec 2025) to ~76K (Jan 2026) confirms the **annual planning cycle** — new year budget/delivery plans are loaded in January.

### 6.3 Regional Split of S1 Order Book (2026-02 snapshot)

| Region | Order Book (kEUR) | Share |
|--------|-----------------|-------|
| **N.America** | 112,706 | **59.4%** |
| Europe North | 37,272 | 19.7% |
| International (Aspac + Latam + Direct Export) | 30,972 | 16.3% |
| Europe South | 8,681 | 4.6% |
| **Grand Total** | **189,631** | **100%** |

Regional sub-breakdown (International, 2026-02):
- Latam: 22,532 kEUR
- Direct Export: 6,846 kEUR
- Aspac: 1,594 kEUR

### 6.4 Revenue Stream Mix — IT Division (Sheet 10, 2026-02)

| Revenue Stream | 2026-02 (kEUR) | Share |
|---------------|---------------|-------|
| Own Licenses | 60,321 | **31.8%** |
| Managed Services | 41,794 | **22.0%** |
| Hardware | 35,674 | 18.8% |
| Implementation Services | 31,508 | 16.6% |
| 3rd Party Licenses | 20,333 | 10.7% |
| **Total** | **189,631** | **100%** |

Revenue stream mix has shifted over the observed period:
- **Own Licenses share grew** from ~21% (Feb 2025) → ~32% (Feb 2026) — significant software license intake
- **Hardware share grew** from ~6% (Feb 2025) → ~19% (Feb 2026) — large hardware deals signed H2 2025
- **Implementation Services share declined** from ~26% → ~17% — services backlog depleting faster than new intake
- **Managed Services share declined** from ~31% → ~22% — recurring services being consumed

### 6.5 Revenue Stream Split — S1 by Region (Sheet 4, 2026-02)

| Region | HW & 3rdP SW (kEUR) | Own SW & All Services (kEUR) | HW+3rdP Share |
|--------|--------------------|-----------------------------|--------------|
| N.America | 32,221 | 80,484 | 28.6% |
| Europe North | 11,453 | 25,819 | 30.7% |
| Europe South | 3,834 | 4,848 | 44.2% |
| Latam | 5,575 | 16,956 | 24.8% |
| Aspac | 322 | 1,272 | 20.2% |
| Direct Export | 2,602 | 4,244 | 38.0% |

**Observation:** Europe South and Direct Export have a **higher hardware mix** relative to other regions — suggesting different deal structures or customer profiles.

---

## 7. Key Analytical Findings

### Finding 1: Business is Dominated by N.America (~60%)
N.America consistently represents ~59–60% of S1 total order book across all observed periods. Any revenue forecast or risk scenario must weight N.America heavily. Europe North is the second-largest region at ~20%.

### Finding 2: Strong Q4 Order Intake Pattern
The order book peaks in December each year (207K in Dec-25), indicating a strong **year-end deal closing** pattern typical of enterprise software sales. This creates a cyclical pattern: high OB in Jan, depletion through H1, rebuilding from Q3 onwards.

### Finding 3: Multi-Year Contract Nature (High "Planned Next Years" Bucket)
"Planned Next Years" consistently exceeds "Planned Current Year," confirming the business runs on **long-term contracts** (2–5 year deals). As of Dec-25, 171,777 kEUR (~83% of OB) was planned beyond current year — extremely high backlog visibility.

### Finding 4: Overdue Spike at Year-End
"Rev Overdue <= 6 mths" spikes to **20,864 kEUR** in Dec-25 (vs ~7.7K in Feb-25) — a **2.7x increase**. This suggests delivery bottlenecks or delayed customer acceptance at year-end. This is an execution risk metric to monitor closely.

### Finding 5: Software/Services > Hardware (But Hardware Growing)
The business is predominantly software + services (~81% in Feb-26). However, hardware share grew from ~6% to ~19% between Feb-25 and Feb-26, suggesting **large hardware deals** were signed in H2 2025. This warrants investigation — one-time deals vs. structural change.

### Finding 6: "Not Planned yet" is Well-Controlled
The "Not Planned yet" bucket stays small and declining (5,968 kEUR in Feb-25 → 1,677 kEUR in Feb-26), indicating AGFA's planning discipline is solid — orders are being classified and scheduled relatively quickly after receipt.

### Finding 7: Revenue Stream Mix Shift Has Margin Implications
- Own Licenses growing share → typically **higher margin**
- Hardware growing share → typically **lower margin**
- Implementation Services shrinking → **variable margin**
- Managed Services shrinking share → typically **predictable/recurring margin**
The net margin direction is uncertain without margin data — this is a key gap to close with margin call data.

---

## 8. Data Gaps & Questions for Customer

1. **Dual currency available but not used in pivots**: The source table has BOTH `Val` (kEUR) and `VUSD` (kUSD) columns. The pivots only display `Val`. FX rates are baked into `VUSD` at source — the exchange rate applied is not documented.
2. **Margin data not in this file**: Only revenue (order book value) is available. The source `.mdb` has no cost or margin columns. Margin analysis needs a separate file.
3. **BU c codes need confirmation**: The source reveals 9 BU codes — `S1`, `S2`, `S3`, `S4`, `K1`, `K2`, `K4`, `JA`, `J0`. Only S1/S2/S4/H1 appear in the pivot sheets. K1, K2, K4, JA, J0 are present in source but filtered out — customer should confirm what they represent.
4. **BD "IM" (Imaging Division) and "J0" (General HE) are in source but excluded from all pivots** — this file covers IT Division primarily. The other divisions presumably have separate reporting files.
5. **GeoFin has only 2 values**: `New IITS` and `ACESO`. This is not a broad geography field — it is a product/solution segment classification. Meaning needs customer confirmation.
6. **`Rev overdue > 6 mths` is hidden by grouping**: The `Key Fig Detail2` computed field groups `Rev overdue > 6 mths` into the `Rev Overdue <= 6 mths` bucket. The true overdue split (short vs. long overdue) is masked in all pivots but available in the source `.mdb`.
7. **Recurring vs. non-recurring revenue not surfaced**: The source `FA d` column distinguishes recurring items (`Recurr. Own Licenses`, `Recurr. Hardware`, etc.) from one-time items. This is aggregated away in `FA Grp`. Recurring revenue % is a critical quality metric that is hidden.
8. **Order intake vs. order book**: This file shows order **book** (backlog at a point in time), not order **intake** (new orders added in a period). Intake must be derived by delta calculation across snapshots or sourced from a separate file.
9. **Historical data sparsity**: Sheets 11 and 19 have regional rows from 2015 but many values are zero — likely reflects reporting scope changes over time, not data corruption.
10. **Source `.mdb` file is on a network share**: `\\agfahealthcare.com\dfs\...` — this is a live corporate network path. The data in the Excel pivot is a cached snapshot. Any refresh requires VPN/corporate network access.

---

## 9. Relevance to Analytics Goals

| Analytics Goal | Data Available | Coverage | Next Steps |
|---------------|---------------|----------|------------|
| **Order Intake** | Partial — OB evolution can be used to derive net intake | Medium | Need a dedicated order intake file |
| **Revenue Management** | Yes — planned current year bucket shows near-term revenue | High | Cross with actuals to track attainment |
| **Margin Calls** | No — revenue only, no cost/margin data | None | Need margin/cost file |
| **Forecasting** | Yes — bucket structure supports revenue recognition forecasting | High | Build rolling forecast model from OB buckets |
| **Regional Analysis** | Yes — full regional hierarchy available | High | Ready for analysis |
| **Revenue Stream Analysis** | Yes — 5 streams visible in IT sheets | High | Ready for mix/shift analysis |

---

## 10. Recommended Next Analyses

1. **Order Book Burn-Down Model** — Use "Planned Current Year" + "Rev Overdue" buckets to forecast in-year revenue recognition month by month.
2. **Overdue Trend Analysis** — Track the "Rev Overdue <= 6 mths" bucket as a % of total OB over time as an execution health metric.
3. **Regional Concentration Risk** — N.America at 60% is a concentration risk; model impact of N.America shortfall on total.
4. **Revenue Stream Mix Shift** — Track HW vs. SW/Services mix monthly to detect structural portfolio shifts.
5. **Year-End Intake Pattern** — Quantify the Q4 order intake spike and its impact on H1 revenue visibility.

---

---
---

# FILE 2: Order Book Detailed Pivot

> **Source File:** `Data/Order Book detailed pivot.xlsm`
> **File Type:** Excel Macro-Enabled Workbook (.xlsm) — VBA present (30,720 bytes)

---

## A. File Overview

This is the **line-item level order book** — a drill-down complement to the overview pivot. Where the overview file aggregates to region/segment/revenue-stream level, this file goes to **individual project and customer level**, enabling order-by-order analysis. It is also macro-enabled, meaning VBA automation is used for report generation or refresh.

Key differences vs. the overview file:

| Dimension | Overview Pivot | Detailed Pivot |
|-----------|---------------|----------------|
| Granularity | Region / Segment / Revenue Stream | Project / Customer / Line Item |
| Rows in source | 20,595 | **45,091** |
| Sheets | 19 analytical | 3 (Sheet1, Sheet2, Home) |
| VBA macros | No | **Yes** |
| Customer names | Not present | **Present** (8,000 unique) |
| CRM opportunity IDs | Not present | **Present** (8,000 unique) |
| Project definition | Not present | **Present** |
| Planned receipt date | Not present | **Present** (quarter, year, period) |

---

## B. Source Data Architecture

### B.1 Source System & Connection

| Property | Detail |
|----------|--------|
| **Database type** | Microsoft Access (`.mdb`) |
| **File path** | `\\agfahealthcare.com\dfs\data\be\medical\medical\controlling\Update Pivot tables\OB detailed pivot\Detailed Order Book.mdb` |
| **Source table** | `Data Source for pivot` |
| **Total records** | **45,091 rows** (vs. 20,595 in overview file — ~2.2x more detailed) |
| **Last refreshed by** | Burney, Mohd Fahad |
| **VBA project** | Present — likely automates refresh + period updates |

> **Different `.mdb` than the overview file.** The overview uses `OB Data for pivot.mdb`; this file uses `Detailed Order Book.mdb`. Both are maintained separately in different subfolders of the same network share.

### B.2 Source Table — Full 39-Column Schema

The SQL query pulls all 39 columns from `Data Source for pivot`. This is a fully denormalized flat table.

#### Time Dimensions

| # | Column | Type | Distinct Values | Description |
|---|--------|------|----------------|-------------|
| 01 | `Reporting Year` | Numeric | 12 (2015–2026) | Year of the OB snapshot |
| 02 | `Reporting month` | Text | 12 | Month of snapshot (e.g., `01 - JAN`) |
| 35 | `Pl Rec period` | Text | 834 | **Planned receipt period** (e.g., `20261` = 2026 Q1) |
| 36 | `Pl Rec Qtr` | Text | 5 | **Planned receipt quarter** (1–4, or `#` if unset) |
| 37 | `Pl Rec Year` | Text | 215 | **Planned receipt year** (2025–2050+, or `#`) |

> **Key new dimension vs. overview file:** The `Pl Rec period/Qtr/Year` columns indicate **when each order line is planned to be delivered/recognized** — enabling revenue recognition timing analysis at line-item level. The overview file only had bucket-level groupings.

#### Order Book Classification

| # | Column | Distinct Values | All Values |
|---|--------|----------------|-----------|
| 00 | `Key Fig Lvl 1` | 3 | `Planned`, `Not Planned Sales Order`, `Not Planned Opport.` |
| 03 | `Line Item` | 7 | `Planned Current Year`, `Planned Next Years`, `Not Planned Sales Order`, `Rev Overdue <=6 mths`, `Not Planned Opportunity <=3mths`, `Not Planned Opportunity 4 to 6 mths`, `Planned Next Year` *(legacy)* |

> `Key Fig Lvl 1` is a higher-level grouping of `Line Item`:
> - `Planned` → covers `Planned Current Year`, `Planned Next Years`, `Rev Overdue <=6 mths`
> - `Not Planned Sales Order` → `Not Planned Sales Order`
> - `Not Planned Opport.` → `Not Planned Opportunity <=3mths`, `Not Planned Opportunity 4 to 6 mths`

> **`Planned Next Year`** (singular) is a legacy value (`u="1"` = unused/deprecated in current data) — historic classification before multi-year planning was introduced.

#### Customer & Deal Identifiers (NEW — not in overview file)

| # | Column | Distinct Values | Description |
|---|--------|----------------|-------------|
| 04 | `CRM Opport ID` | **8,000** | CRM opportunity ID (10-digit, e.g., `0000093851`) — links to CRM system |
| 05 | `Sold to Key` | **6,807** | SAP customer number (sold-to party key) |
| 06 | `Sold to Name` | **7,887** | Customer name (free text, e.g., `Kantonsspital Uri`) |
| 07 | `Postal code` | **5,027** | Customer postal code |
| 11 | `Customer` | **8,000** | Customer name (uppercase version of `Sold to Name`) |
| 20 | `Sales doc` | **8,000** | SAP sales order document number |
| 08 | `Syr-Sales One` | **8,000** | Syrius / SalesOne system ID (e.g., `0314MI-BGOA-94NM8X`) — CRM deal tracker |

#### Project Dimensions (NEW — not in overview file)

| # | Column | Distinct Values | Description |
|---|--------|----------------|-------------|
| 09 | `Proj def code` | **8,000** | Project definition code (SAP PS WBS element, e.g., `0030020730`) |
| 10 | `Proj def descr` | **8,000** | Project description (e.g., `CH-Altdorf-Kantonsspital Uri`) — encodes country-city-customer |
| 27 | `PF code` | **358** | Product family code |
| 28 | `PF descr` | **576** | Product family description (e.g., `DMS ORBIS/HY IMPL`, `EI - GRIP (MS)`) |
| 33 | `Mat code` | **8,000** | SAP material code |
| 34 | `Mat descr` | **8,000** | Material description (e.g., `DMS INSTALLATION`, `GENERAL APPLICATION TRAINING`) |

#### Business Hierarchy Dimensions

| # | Column | Distinct Values | All Values |
|---|--------|----------------|-----------|
| 21 | `BD` | 4 | `IT`, `IM`, `J0`, `#` |
| 22 | `BU` | 13 | `S1`, `S2`, `S3`, `S4`, `K1`, `K2`, `K3`, `K4`, `JA`, `J0`, `MI`, `JB`, `#` |
| 23 | `BC code` | 36 | Business Category codes |
| 24 | `BC descr` | 68 | Business Category descriptions |
| 25 | `FA code` | 15 | Financial Application codes (`010S`, `010V`, `010O`, `010H`, etc.) |
| 26 | `FA descr` | **32** | FA descriptions including recurring variants: `Net Sales Services`, `Net Sls Recur. Man. Serv`, `Net Sls Recur. HW`, `Net Sales Hardware`, etc. |

> **BU has 13 codes here vs. 9 in overview** — includes `K3`, `MI`, `JB`, `#` which don't appear in overview. The detailed file covers a broader scope.
> **FA descr is more granular here** (32 descriptions vs 12 in overview) — shows actual P&L line names used in SAP: `Net Sales Services`, `Net Sls Recur. Man. Serv`, `Net Sales Hardware`, etc.

#### Geographic Dimensions

| # | Column | Distinct Values | Description |
|---|--------|----------------|-------------|
| 12 | `RGrp lvl1` | 3 | `Europe & Int`, `N.America`, `Worldwide` |
| 13 | `RGrp lvl2` | 6 | Regional group level 2 |
| 14 | `RGrp lvl3` | 13 | Regional group level 3 (more granular than overview: adds `USA`, `North`, `BeNeLux`, `Canada`, `Dach`) |
| 15 | `Region` | 16 | Sales region (adds `BeLux`, `NordPol` vs. overview's 14) |
| 16 | `Subregion` | 25 | Sub-region |
| 17 | `GeoFin` | **8** | `ACESO`, `New IITS`, `International`, `Aspac`, `Worldwide`, `Europe`, `Perimeter`, `N.America` (vs. only 2 in overview) |
| 18 | `Destination code` | **188** | Country code (vs. 90 in overview — nearly double) |
| 19 | `Destination descr` | **189** | Country name |
| 29 | `Region Grp code` | 7 | `W`, `R`, `E`, `N`, `I`, `A`, `#` |
| 30 | `Region Grp descr` | 8 | `World Wide`, `Not assigned`, `Europe`, `N.America`, `International`, `Aspac`, `RoW`, `Americas` |

#### Legal Entity / Company Dimensions

| # | Column | Distinct Values | Description |
|---|--------|----------------|-------------|
| 31 | `Comp code` | 33 | SAP company code |
| 32 | `Comp descr` | 44 | Legal entity name (e.g., `DH HealthCare Switzerland`, `Dedalus HealthCare GmbH`, `Agfa HealthCare Inc.`) |

> **Important:** Company descriptions reveal **both AGFA and Dedalus entities** (`Dedalus HealthCare GmbH`, `Dedalus HealthCare France`, etc.) — AGFA's IT division was carved out and rebranded as **Dedalus** during the analysis period. This is a key business context fact.

#### Measure Column

| # | Column | Type | Description |
|---|--------|------|-------------|
| 38 | `Val` | Numeric | Order book value in EUR (not kEUR — **full EUR**, unlike overview file) |

> **CRITICAL UNIT DIFFERENCE:** The overview file stores values in **kEUR** (thousands). This detailed file stores values in **full EUR**. Sheet1 shows `208,101,328` for Jan total vs. overview file's `208,101` — confirming 1,000x difference.

---

## C. Sheets — What Each Contains

### Sheet 1: `Sheet1` — Summary View (All Segments)
**Pivot: PivotTable1**

| Property | Value |
|----------|-------|
| Row fields | `Key Fig Lvl 1` → `Line Item` (2-level hierarchy) |
| Column fields | `Reporting month` (JAN…DEC) |
| KPI | `SUM(Val)` shown as `Value (EUR)` |
| Active filters | `Reporting Year = 2026` |
| Segments | All BUs included |

**What it shows:** Total order book by planning status (Planned/Not Planned) × month for year 2026. This is the **company-wide summary** without any BU filter — equivalent to the "Default pivot" sheet in the overview file but in full EUR.

**Data layout observed:**
```
Key Fig Lvl 1       | Line Item                    | JAN              | FEB
Planned             | Planned Current Year          | 82,000,875       | 81,610,444
                    | Planned Next Years            | 96,678,664       | 103,685,304
                    | Rev Overdue <=6 mths          | 27,644,440       | 16,078,853
Planned Total       |                               | 206,323,979      | 201,374,601
Not Planned Opport. | Not Planned Opportunity <=3m  |     51,091       |     70,329
                    | Not Planned Opportunity 4-6m  |    151,879       |     62,103
Not Planned Opport. Total                           |    202,970       |    132,432
Not Planned Sales Order | Not Planned Sales Order   |  1,574,379       |  2,022,351
Grand Total         |                               | 208,101,328      | 203,529,384
```

### Sheet 2: `Sheet2` — Project-Level Detail (S1 Segment)
**Pivot: PivotTable1 (same pivot name, different instance)**

| Property | Value |
|----------|-------|
| Row fields | `Key Fig Lvl 1` → `Line Item` → `Proj def code` → `Proj def descr` (4-level hierarchy) |
| Column fields | `Reporting month` |
| KPI | `SUM(Val)` shown as `Value (EUR)` |
| Active filters | `Reporting Year = 2026`, **`BU = S1`** |
| Granularity | **Individual project level** |

**What it shows:** Every project in S1's order book, with values by month. The `Proj def descr` format encodes `Country-City-CustomerName` (e.g., `LU-Luxembourg-CENTRE HOSPITALIER`, `GB-Cottingham, Castle Hill Hospital`). This enables **customer-level revenue tracking**.

### Sheet 3: `Home` — VBA Control Panel
No pivot table. Contains:
- Period lookup table (year + month → various format representations: `01 - JAN`, `Jan 2023`, `01.2023`, `02-Feb`, `2023-01`, etc.)
- VBA variables: `Year`, `Period`, `FOR Period`, `Planned Rec Month`, `PeriodFile`, `Month`
- Reference table for period formatting across 12 format variants
- Used by VBA macros to drive automated refresh and pivot filter updates

---

## D. KPIs — What Is Measured and How

### D.1 KPI: `Value (EUR)` = `SUM(Val)`

**Only one KPI** exists across both analytical pivots:

```
Value (EUR) = SUM(Val)
WHERE Reporting Year = 2026
  AND BU = [segment filter]
```

**No percentage measures, no % of parent, no calculated fields.** Pure aggregation only.

**Unit:** Full EUR (not kEUR). To reconcile with overview file: divide by 1,000.

### D.2 KPI Logic Differences vs. Overview File

| Feature | Overview File | Detailed File |
|---------|--------------|---------------|
| Measure unit | kEUR | **Full EUR** |
| % of total KPI | Yes (sheets 10,13,14,15) | **No** |
| Bucket classification field | `Key Fig Detail2` (computed grouping) | `Key Fig Lvl 1` + `Line Item` (source fields directly) |
| Overdue hidden grouping | `>6 mths` merged into `<=6 mths` | **No grouping — raw** |
| Revenue stream grouping | `FA Grp2` (HW vs SW) | Not used as row dimension |

> **No hidden grouping of overdue here.** Unlike the overview file where `Rev overdue > 6 mths` was silently merged, this detailed pivot uses the `Line Item` source field directly. However, `Rev Overdue <=6 mths` is the only overdue line present — meaning the **source `.mdb` for the detailed file may already pre-filter to <=6 months** or that `>6 months` doesn't appear in this dataset.

### D.3 `Key Fig Lvl 1` Grouping Logic

```
Key Fig Lvl 1 = 'Planned'              → Line Item IN ('Planned Current Year',
                                                         'Planned Next Years',
                                                         'Rev Overdue <=6 mths')
Key Fig Lvl 1 = 'Not Planned Sales Order' → Line Item = 'Not Planned Sales Order'
Key Fig Lvl 1 = 'Not Planned Opport.'  → Line Item IN ('Not Planned Opportunity <=3mths',
                                                         'Not Planned Opportunity 4 to 6 mths')
```

This 3-way split separates **committed revenue** (Planned) from **confirmed but unscheduled orders** (Not Planned Sales Order) from **pipeline/opportunity** (Not Planned Opport.).

---

## E. Key Analytical Findings — Detailed Pivot

### Finding 1: Project-level granularity enables customer revenue tracking
The `Proj def descr` format (`Country-City-CustomerName`) allows revenue to be tracked at individual hospital/customer level. With 8,000 unique customers and projects, this file is the basis for **customer concentration analysis** and **account-level revenue forecasting**.

### Finding 2: Planned revenue dominates — Not Planned is a small fraction
From Sheet1 (Jan 2026 data):
- **Planned (all buckets):** EUR 206,323,979 = **99.1% of total**
- **Not Planned Sales Orders:** EUR 1,574,379 = 0.76%
- **Not Planned Opportunities:** EUR 202,970 = 0.10%

This confirms extremely high **order book coverage** — the business is almost entirely covered by formal contracts, with minimal speculative pipeline.

### Finding 3: Revenue overdue spike visible at granular level
Jan 2026 overdue: EUR 27,644,440 vs Feb 2026: EUR 16,078,853 — a drop of EUR 11.6M in one month. This likely reflects year-end catch-up deliveries recognized in January. The project-level detail allows identification of **which specific projects caused the overdue**.

### Finding 4: Dedalus legal entities present alongside AGFA
`Comp descr` contains both `Agfa HealthCare` and `Dedalus HealthCare` entities — the carve-out/transition is still reflected in the data. Revenue from Dedalus-branded entities must be tracked separately for legal/reporting purposes.

### Finding 5: Planned receipt dates available for forecasting
`Pl Rec Year` has values up to 2050+ (long-term contracts), with 215 distinct year values and 834 distinct period codes. This makes it possible to build a **multi-year revenue recognition schedule** at project level — something the overview file cannot do.

### Finding 6: Broader geographic scope
188 destination countries vs. 90 in overview — indicates the detailed file captures a wider perimeter of deals (possibly including historical or indirect channel deals not in the aggregated view).

### Finding 7: FA descr reveals the actual P&L line structure
The `FA descr` field (32 values) shows the **actual SAP revenue account names** used in financial reporting:
- `Net Sales Services` — primary services revenue
- `Net Sls Recur. Man. Serv` — recurring managed services (high value, predictable)
- `Net Sls Recur. HW` — recurring hardware (e.g., leased equipment)
- `Net Sales Hardware` — one-time hardware
- `Net Sales Own Licenses` / `Net Sales Own IP SW` — software licenses
- `Net Sales 3rd p. Licenses` — resold licenses
- `Net Sales Implementa` — implementation projects
These map directly to P&L line items and are more granular than the `FA Grp` used in the overview file.

---

## F. Data Gaps & Questions — Detailed Pivot

1. **`Val` is in full EUR here but kEUR in overview** — reconciliation needs a ÷1000 conversion. Needs explicit confirmation from customer to avoid errors.
2. **`VUSD` column absent** — no USD equivalent in the detailed file (overview had it). FX conversion would need to be added.
3. **VBA macros purpose unknown** — the `Home` sheet and vbaProject suggest automated refresh workflows. Understanding the macro logic is needed to know if the data updates automatically or requires manual intervention.
4. **`Rev overdue > 6 mths` absent** — it's unclear whether long-overdue items are excluded at the source `.mdb` level or genuinely don't exist in the detailed dataset.
5. **`Planned Next Year` (legacy)** — 7th Line Item value marked as deprecated. Presence in the cache means it may still exist in older historical records (pre-2020 data). Needs filter in any analysis.
6. **`#` values in BD, BU, BC, FA** — unassigned/unmapped records exist across multiple dimension columns. Volume of `#` records should be quantified to understand data quality.
7. **8,000 = cache limit** — `CRM Opport ID`, `Sold to Key`, `Proj def code`, `Mat code` all show exactly 8,000 distinct values. This is the Excel pivot cache maximum for distinct items per field. The actual database may have more unique values than 8,000 — the cache is truncating.

---

## G. Relationship to Overview File

| Aspect | Overview File | Detailed File |
|--------|--------------|---------------|
| Source `.mdb` | `OB Data for pivot.mdb` | `Detailed Order Book.mdb` |
| Record count | 20,595 | 45,091 |
| Unit | kEUR | Full EUR |
| Customer data | No | Yes |
| Project data | No | Yes |
| CRM links | No | Yes |
| Revenue stream detail | 5-stream breakdown | `FA descr` (32 P&L lines) |
| % mix KPI | Yes | No |
| Planned receipt timing | No | Yes (Qtr/Year/Period) |
| Geographic depth | 90 countries | 188 countries |
| VBA automation | No | Yes |
| Purpose | HQ BRM summary views | Operational drill-down / account management |

Both files share the same dimensional framework (BD, BU, BC, FA, Geography hierarchy) and the same order book bucket logic, confirming they are complementary views of the **same underlying SAP data**, pre-processed through separate Access databases.

---

*End of File 2 analysis. Next file to analyze when ready.*

---
---

# SOURCE RELATIONSHIP ANALYSIS

> Cross-file comparison between the two order book sources.

---

## 1. Are These the Same Data?

**No — they are related but not identical.** They share the same SAP source system and dimensional framework, but are pre-processed into two separate Access databases at different levels of granularity and with different scopes.

**Total reconciliation (Feb 2026):**

| Source | Feb 2026 Total | Unit | In kEUR |
|--------|---------------|------|---------|
| Overview file (`OB Data for pivot.mdb`) | 229,380 | kEUR | 229,380 |
| Detailed file (`Detailed Order Book.mdb`) | 203,529,384 | Full EUR | 203,529 |
| **Difference** | | | **~25,851 kEUR (+12.7%)** |

The totals **do not reconcile**. The overview file is ~12.7% larger than the detailed file for Feb 2026. This is a structural scope difference, not a rounding issue.

---

## 2. Why the Totals Differ — Scope Differences

Three confirmed reasons for the gap:

### Reason A: Overview includes `Key Fig = 'Other'`
The overview source has a `Key Fig` field with two values: `Total Order Book` and `Other`. The pivots always filter to `Total Order Book`, but **`Other` exists in the raw data** and may represent reclassified or adjustment items not captured in the detailed file's `Line Item` classification.

### Reason B: Overview covers more OB categories
The overview has **8 `Key Fig Detail` statuses**, the detailed has **7 `Line Item` values**. Missing from detailed:
- `Rev overdue > 6 mths` — long-overdue revenue is completely absent from the detailed file
- `Not Planned Opportunity 7 - 24 mths` — longer-horizon pipeline not in detailed

These missing buckets exist in the overview and add revenue that isn't in the detailed view.

### Reason C: Broader BU scope in overview
Overview covers **9 BU codes** (`S1,K4,S4,S2,S3,K1,K2,JA,J0`), detailed covers **13** (`+K3,MI,JB,#`). But the overview pivots filter out `J0,K1,K2,K4,JA` via multiple-selection filters. The scope difference means neither is a true subset of the other.

---

## 3. Shared Dimensions (7 columns in common)

| Shared Column | Match Status | Notes |
|--------------|-------------|-------|
| `Val` | Same column name, different unit | Overview = kEUR, Detailed = full EUR |
| `GeoFin` | Same values, different order | Overview: 2 values (`New IITS`,`ACESO`); Detailed: 8 values (broader scope) |
| `RGrp lvl1` | Same values | `Europe & Int`, `N.America`, `Worldwide` |
| `RGrp lvl2` | Mostly same | Detailed adds `Worldwide`, overview has `Europe South` not in detailed |
| `RGrp lvl3` | Mostly same | Detailed has more values (`South`,`USA`,`North`,`BeNeLux`,`Canada`,`Dach`) |
| `Region` | Same concept, different coverage | Detailed has 16 regions vs overview's 14; both share core set |
| `Subregion` | Same concept | 25 values in both, different ordering |

**Join-able dimensions** (same values, same meaning):
- `BD c` (overview) = `BD` (detailed): same codes `IT`, `IM`, `J0`
- `BU c` (overview) = `BU` (detailed): same codes (`S1`–`S4`, `K1`–`K4`, `JA`, `J0`)
- `BC c` (overview) = `BC code` (detailed): same 2-char codes
- `FA c` (overview) = `FA code` (detailed): same `010x` codes
- `Dest c` (overview) = `Destination code` (detailed): same ISO country codes — **all 90 overview countries exist in detailed's 188**; detailed is a superset

---

## 4. Unique to Each File

### Only in Overview — 20 columns
| Column | Significance |
|--------|-------------|
| `Period` (YYYY-MM) | Snapshot identifier — enables time-series trend analysis |
| `Year` | Fiscal year of snapshot |
| `Mth nr` / `Mth name` | Month number/name |
| `VUSD` | USD equivalent — FX-converted value not in detailed |
| `Key Fig` | `Total Order Book` vs `Other` — extra categorisation |
| `Key Fig Detail` | 8 granular bucket statuses (vs 7 in detailed) |
| `FA Grp` / `FA d` | Revenue stream grouping and descriptions |
| `BD d` / `BU d` | Division/Unit descriptions (not just codes) |
| `BC d` | Business Category descriptions |
| `FA Grp2` | Computed HW vs SW/Services grouping |

> The overview is the **trend/time-series** file — it tracks the order book at monthly snapshot level across many periods (2025-01 to 2026-02). The `Period` column is its defining feature.

### Only in Detailed — 32 columns
| Column | Significance |
|--------|-------------|
| `Proj def code` / `Proj def descr` | Project-level identifier — the key join to SAP PS |
| `Sales doc` | SAP sales order number — **primary key to transactional data** |
| `CRM Opport ID` | Links to CRM pipeline system |
| `Sold to Key` / `Sold to Name` | Customer master data |
| `Customer` | Uppercase customer name |
| `Syr-Sales One` | Syrius/SalesOne CRM deal ID |
| `Pl Rec period` / `Pl Rec Qtr` / `Pl Rec Year` | **Planned recognition timing** — enables forecasting |
| `PF code` / `PF descr` | Product family breakdown |
| `Mat code` / `Mat descr` | Material/SKU level detail |
| `Comp code` / `Comp descr` | Legal entity (Agfa/Dedalus entity split) |
| `Region Grp code/descr` | Alternative regional grouping |
| `Postal code` | Customer location |
| `FA descr` (32 values) | Actual P&L revenue account names |
| `Key Fig Lvl 1` | High-level 3-way bucket grouping |
| `Reporting Year` / `Reporting month` | Snapshot time (renamed from `Year`/`Period`) |

> The detailed is the **drill-down/operational** file — it goes to individual project, customer and SAP document level. The `Sales doc` and `Proj def code` are the primary keys linking to SAP transactional systems.

---

## 5. Data Model Relationship Diagram

```
SAP ECC / BW (source of truth)
         │
         ├──── Pre-processed ────► OB Data for pivot.mdb
         │                         Table: "OB - Data source for pivot"
         │                         Grain: Period × BD × BU × BC × FA × Region
         │                         Rows: 20,595  Unit: kEUR
         │                         Focus: Time-series, trend, HQ summary
         │                              │
         │                              └── Excel: 7.14 Order Book Overview pivot.xlsx
         │                                  (19 pivot sheets, BRM HQ views)
         │
         └──── Pre-processed ────► Detailed Order Book.mdb
                                   Table: "Data Source for pivot"
                                   Grain: Reporting Month × Sales Doc × FA code
                                   Rows: 45,091  Unit: Full EUR
                                   Focus: Project/customer drill-down
                                        │
                                        └── Excel: Order Book detailed pivot.xlsm
                                            (3 sheets, VBA-driven, project level)
```

---

## 6. How to Join the Two Sources

There is **no direct foreign key** between the two Access databases — they are separate ETL outputs from SAP. However, they can be joined on shared dimension attributes:

### Option A: Dimensional join (aggregated level)
```sql
-- Join on shared business hierarchy dimensions
Overview.BD c      = Detailed.BD
Overview.BU c      = Detailed.BU
Overview.BC c      = Detailed.BC code
Overview.FA c      = Detailed.FA code
Overview.Region    = Detailed.Region
Overview.Key Fig Detail ≈ Detailed.Line Item  -- (near-match, different naming)
```
**Use for:** Adding `Pl Rec Year`/`Pl Rec Qtr` from detailed to overview's bucket totals.

### Option B: Time alignment
```
Overview.Period (YYYY-MM) → strip to Year+Month → match Detailed.Reporting Year + Reporting month
```
Both files use the same snapshot month concept, just formatted differently (`2026-02` vs `02 - FEB` + `2026`).

### Option C: Enrich overview with customer data
```
Overview total for (BD, BU, BC, FA, Region, Period)
  = SUM of Detailed.Val/1000 for same (BD, BU, BC code, FA code, Region, Reporting Year+month)
  WITH adjustment for scope differences (>6mths overdue, Other category)
```

### Key Fig / Line Item name mapping
| Overview `Key Fig Detail` | Detailed `Line Item` |
|--------------------------|---------------------|
| `Planned Current Year` | `Planned Current Year` ✓ exact |
| `Planned Next Years` | `Planned Next Years` ✓ exact |
| `Rev Overdue <= 6 mths` | `Rev Overdue <=6 mths` ✓ near-exact |
| `Not Planned Opportunity <= 3 mths` | `Not Planned Opportunity <=3mths` ✓ near-exact |
| `Not Planned Opportunity 4 - 6 mths` | `Not Planned Opportunity 4 to 6 mths` ✓ near-exact |
| `Not Planned sales order` | `Not Planned Sales Order` ✓ near-exact |
| `Rev overdue > 6 mths` | *(not in detailed)* — **gap** |
| `Not Planned Opportunity 7 - 24 mths` | *(not in detailed)* — **gap** |

---

## 7. Summary: What Each File Answers

| Business Question | Use Overview | Use Detailed | Use Both |
|-------------------|-------------|-------------|---------|
| How has our order book changed month-over-month? | ✓ | — | — |
| What is our revenue mix by stream (HW vs SW vs Services)? | ✓ | — | — |
| Which regions are growing/declining? | ✓ | ✓ | Better with both |
| Which specific customers have the largest backlog? | — | ✓ | — |
| Which projects are overdue and by how long? | Partial | ✓ | — |
| When is planned revenue expected to be recognized? | — | ✓ | — |
| What is the USD equivalent of the order book? | ✓ (VUSD) | — | — |
| What legal entity (Agfa vs Dedalus) owns the revenue? | — | ✓ | — |
| What is the CRM pipeline linked to the order book? | — | ✓ | — |
| What is the total backlog including long-overdue (>6mths)? | ✓ | — | — |

---

# FILE 3: OI HEC View Pivot Table (1).xlsx — Order Intake Analytics

> **File:** `Data/OI HEC view pivot table (1).xlsx`
> **Purpose:** Order Intake (OI) tracking — bookings by region, revenue stream, business type vs. actuals, forecast, and budget
> **Unit:** kEUR (thousands of EUR) — confirmed from sheet headers

---

## A. File Overview

This file tracks **Order Intake (OI)** — the value of new orders booked in a given period — as opposed to the Order Book files which track the accumulated backlog. It covers:
- **Actuals** (monthly, QTD, YTD) vs. **Last Year** and **Budget**
- **73 monthly snapshots** from **2021-06 through 2026-01**
- Business Unit split: **S1** (Imaging IT Solutions / IITS), **S2** (HIS/CIS), **S3** (Integrated Care Solutions / ICAS)
- **Business Type** dimension — new in this file, absent from Order Book files
- **132,953 records** in the main pivot cache (Cache2/3)
- **15 sheets**, primarily pivot-based with one formatted comparison report

---

## B. Source Data Architecture

### B.1 Source System and Connection

| Property | Detail |
|----------|--------|
| Database type | Microsoft Access (.accdb) — ACE OLEDB 12.0 |
| UNC path | \\agfahealthcare.com\dfs\data\be\medical\medical\controlling\Update Pivot tables\OI\OI pivot table\02-OI Database.accdb |
| Mapped drive path | I:\be\medical\medical\controlling\Update Pivot tables\OI\OI pivot table\02-OI Database.accdb |
| Connection names | 02-OI Database (UNC) + 02-OI Database1 (mapped drive I:) |
| Source table | tbl Source for pivot |
| Last refreshed by | Burney, Mohd Fahad |
| Total main records | 132,953 (Cache2 / Cache3) |
| Budget source | Internal worksheet table OI BUD26 per Bus Type (Cache1, 1,128 rows) |

### B.2 Pivot Cache Structure

Three separate pivot caches exist in this file:

| Cache ID | Source | Records | Purpose |
|----------|--------|---------|---------|
| Cache1 (ID=13) | Worksheet OI BUD26 per Bus Type (A1:J1129) | 1,128 | 2026 Budget by Business Type |
| Cache2 (ID=19) | tbl Source for pivot (all BUs) | 132,953 | Main OI actuals — all S1/S2/S3 |
| Cache3 (ID=21) | tbl Source for pivot (S1 only subset) | 132,953 | S1-only view (same DB, filtered) |

---

## C. Data Structure and Dimensions

### C.1 Main Source Table Columns (tbl Source for pivot — 22 fields)

| # | Column | Description | Sample Values |
|---|--------|-------------|---------------|
| 0 | Snapshot | Month of data capture (YYYY-MM) | 2025-01 to 2026-01, back to 2021-06 (73 unique months) |
| 1 | Region Grp | Region group level | Europe North, Europe south, International, N.America, World Wide, Europe, Not assigned |
| 2 | Region | Region name | Benelux, Iberia, Italy, Nordic, UK, AsPac, Direct Export, Latin America & Mexico, Canada, USA |
| 3 | SubR code | Sub-region code | BE, IBER, NL, ITAL, NORD, IE, UK, HOKO, OASP, OCEA, SING, BRA, CANA, USA |
| 4 | SubReg descr | Sub-region description | Belgium, Iberia, Netherlands, Italy, Nordic, Ireland, UK, Hong Kong, Oceania, Singapore, Brazil |
| 5 | Dest code | Destination country code | BE, ES, NL, IT, DK, NO, SE, GB, HK, CN, AU, US |
| 6 | Dest descr | Destination country description | BELGIUM, SPAIN, NETHERLANDS, ITALY |
| 7 | BU code | Business Unit code | S1, S2, S3 |
| 8 | BU long descr | Business Unit long name | Imaging IT Solutions, HIS/CIS, Integrated Care Solutions |
| 9 | BC code | Business Category code | SH, SI, SM, SJ, SX, SZ, SG, SK, SQ, SS, SU, SW, HI, BI |
| 10 | BC descr | Business Category description | Enterprise Imaging IT, RadIT maintain, IITS General, RIS Maintain, Agfa Portal, Rad Invest |
| 11 | FA code | Financial Application code | 010H, 010L, 010O, 010Q, 010S, 010T, 010W, 010X, 010Y, 010Z, 010V, 010I, 010U, 010C |
| 12 | FA descr | Financial Application description | Net Sales Hardware, Net Sales Own Licenses, Net Sales Services, Net Sales 3rd p. Lic, Net Sls Recurring |
| 13 | Type Bus C | Business Type code | 1, 2, 3, 4, 5, 7, # |
| 14 | Type Bus D | Business Type description | Net New, Feature Upselling, Cross Selling, Volume Upselling, Transition, Upgrade and Updates, Not assigned |
| 15 | Key Figure | KPI variant (what is being measured) | MONTH ACT, QTD ACT, YTD ACT, MONTH LY, QTD LY, YTD LY, Q1-Q4 LY, FY LY, MONTH FOR, Q1-Q4 (A+F), FY (A+F), Q1-Q4 BUD, FY BUD |
| 16 | Cust c | Customer code (SAP) | 2000679, 2001041 (hundreds of unique customers) |
| 17 | Cust d | Customer description | SILVA MEDICAL ASBL-VZW SCHEUTBOS, AZ DAMIAAN vzw |
| 18 | Value | OI value in kEUR (numeric) | — |
| 19 | BU descr | Business Unit short name | IITS, ICAS, HCIS |
| 20 | Key Fig grp | Key Figure group (aggregation level) | Q1, Q2, Q3, Q4, MTH, QTD, YTD, FY |
| 21 | Key Fig sort | Sort order for Key Figure display | 01 (MONTH ACT), 02 (MONTH FOR), 04 (MONTH LY), 25 (FY LY) |

### C.2 Budget Table Columns (OI BUD26 per Bus Type — 10 fields)

| Column | Description | Sample Values |
|--------|-------------|---------------|
| Responsibility Area | Cost/profit center code | 0327 |
| Entity | Legal entity name | [IE] HE IRLAND SO |
| Destination | Country code | IE |
| Destination Country | Country name | IRELAND |
| HE IT Region | Region label | EU North |
| Type | Budget type code | BT100, BT110, BT120 |
| Business Type | Business Type label | Net New, Feature Upselling, Cross Selling |
| Total | Budget amount (full EUR — NOT kEUR) | 1, 66666.67, 33333.33 |
| Period | Period number | 1-4 (quarters) |
| Qtr | Quarter | 1 |

---

## D. Key Figures and KPI Catalogue

### D.1 Key Figure Taxonomy

All KPIs are derived from the single numeric field **Value (OI Val)** using the Key Figure dimension as a row filter:

| Key Figure | Key Fig grp | Description |
|-----------|-------------|-------------|
| MONTH ACT | MTH | Actual order intake in the current month |
| MONTH FOR | MTH | Forecast order intake for the current month |
| MONTH LY | MTH | Actual order intake in the same month last year |
| QTD ACT | QTD | Quarter-to-date actual order intake |
| QTD BUD | QTD | Quarter-to-date budget |
| QTD LY | QTD | Quarter-to-date last year actuals |
| YTD ACT | YTD | Year-to-date actual order intake |
| YTD BUD | YTD | Year-to-date budget |
| YTD LY | YTD | Year-to-date last year actuals |
| Q1 (A+F) | Q1 | Q1 actual + forecast combined |
| Q2 (A+F) | Q2 | Q2 actual + forecast combined |
| Q3 (A+F) | Q3 | Q3 actual + forecast combined |
| Q4 (A+F) | Q4 | Q4 actual + forecast combined |
| FY (A+F) | FY | Full year actual + forecast |
| Q1 LY | Q1 | Q1 last year actuals |
| Q2 LY | Q2 | Q2 last year actuals |
| Q3 LY | Q3 | Q3 last year actuals |
| Q4 LY | Q4 | Q4 last year actuals |
| FY LY | FY | Full year last year actuals |
| Q1 BUD | Q1 | Q1 budget |
| Q2 BUD | Q2 | Q2 budget |
| Q3 BUD | Q3 | Q3 budget |
| Q4 BUD | Q4 | Q4 budget |
| FY BUD | FY | Full year budget |

### D.2 KPIs Available in Pivot Tables

| KPI Name | Formula | Notes |
|----------|---------|-------|
| OI Val | SUM(Value) filtered by Key Figure | Primary metric — all sheets except Budget |
| OI Val % | percentOfCol (SUM(Value) / column total) | Sheet S1 FA view (2) — share by revenue stream |
| Sum of Total | SUM(Total) from Budget table | Budget pivots only (Sheets 14, 15) |

### D.3 Business Type Classification (Unique to this File)

| Code | Business Type | Description |
|------|--------------|-------------|
| 1 | Net New | New customer or entirely new product line |
| 2 | Feature Upselling | Existing customer buying additional features |
| 3 | Cross Selling | Existing customer buying different product |
| 4 | Transition | Customer transitioning between product versions |
| 5 | Upgrade and Updates | Standard upgrades/maintenance contract renewals |
| 7 | Volume Upselling | Existing customer expanding volume |
| # | Not assigned | Unclassified orders |

---

## E. Sheet-by-Sheet Inventory

| # | Sheet Name | Pivot | Cache | BU | Focus |
|---|-----------|-------|-------|----|----|
| 1 | Pivot | pivotTable1 | Cache2 | All | Overview: all regions, all Key Fig groups, default snapshot=2026-01 |
| 2 | S1 Regional | pivotTable2 | Cache2 | S1 | S1 OI by sub-region and destination country |
| 3 | S1 Regional (2) | pivotTable3 | Cache2 | S1 | Variant of S1 Regional |
| 4 | S1 Own IP Regional | pivotTable4 | Cache2 | S1 | S1 OI for Own Intellectual Property only, by sub-region |
| 5 | S2 FA view | pivotTable5 | Cache2 | S2 | S2 OI by Financial Application, JAN2026, kEUR |
| 6 | S3 FA view | pivotTable6 | Cache2 | S3 | S3 OI by Financial Application, JAN2026 |
| 7 | S1 Geographical view | pivotTable7 | Cache2 | S1 | S1 OI at sub-region + destination level |
| 8 | S1 FA view | pivotTable8 | Cache2 | S1 | S1 OI by FA group |
| 9 | S1 FA view (2) | pivotTable9 | Cache2 | S1 | S1 OI by FA — % of column share |
| 10 | S1 FA view (3) | flat table | — | S1 | FA Grp rows x Key Fig columns (mEUR unit): MONTH/QTD/YTD/Q1 ACT/FOR/BUD/LY |
| 11 | S1 Regional (2) | pivotTable10 | Cache2 | S1 | S1 OI at customer + FA code level |
| 12 | OI per Business Type | formatted report | — | — | 2025 Actuals / 2026 Budget / 2026 Actuals / ACT vs BUD comparison |
| 13 | S1 Bus Type Pivot | pivotTable11+12 | Cache2+3 | S1 | Side-by-side 2026-01 vs 2025-01 snapshot, by Business Type |
| 14 | OI BUD26 per Bus Type | raw data table | — | — | Source data for Budget cache: 1,128 rows of 2026 budget by entity + business type |
| 15 | Pivot Bud Bus type | pivotTable13+14+15 | Cache1 | — | Budget FY / QTR / YTD by Business Type (3 side-by-side pivots) |

---

## F. Quantitative Data Points

| Metric | Value |
|--------|-------|
| Total main cache records | 132,953 |
| Unique monthly snapshots | 73 (2021-06 to 2026-01) |
| Budget cache records | 1,128 |
| Business Units covered | S1, S2, S3 |
| BU long names | Imaging IT Solutions (S1), HIS/CIS (S2), Integrated Care Solutions (S3) |
| Business Categories | 20 unique BC codes |
| FA codes | 15 (010H, 010L, 010O, 010Q, 010S, 010T, 010W, 010X, 010Y, 010Z, 010V, 010I, 010U, 010C, #) |
| Business Types | 7 (Net New, Feature Upselling, Cross Selling, Volume Upselling, Transition, Upgrade and Updates, unassigned) |
| Key Figure variants | 24+ (monthly, quarterly, YTD, FY x ACT/FOR/BUD/LY) |
| S1 FA view (3) sample — JAN 2026 MONTH ACT (kEUR): | |
| 3rd Party IP | ~2,042 |
| Hardware | ~1,540 |
| Own IP | ~1,739 |
| 2026 Budget by Business Type: | |
| Feature Upselling FY BUD | ~455,167 (kEUR) |
| Cross Selling FY BUD | ~57,623 (kEUR) |

---

## G. Key Analytical Findings

1. **This is the OI file — distinct from Order Book.** While OB files track backlog (unfulfilled orders), this file tracks bookings (new orders received in a period). Together they cover the full revenue lifecycle.

2. **Business Type is a unique dimension here.** No equivalent field exists in the Order Book files. This enables net-new vs. upsell/cross-sell breakdown — critical for growth analysis.

3. **73 months of history available** (2021-06 to 2026-01) — significantly longer than Order Book overview (13 months) and detailed (Feb 2026 only). Trend and seasonality analysis is possible here.

4. **Budget comparison infrastructure.** The file contains a complete 2026 budget by Business Type and entity (from OI BUD26 per Bus Type sheet), enabling ACT vs BUD variance analysis directly within the file.

5. **Two connection paths to the same DB.** Both UNC and mapped drive (I:) connections point to the same 02-OI Database.accdb. The UNC path is the primary/stable one.

6. **BU scope differs from Order Book:** This file covers S1, S2, S3. The Order Book Overview covers S1, S2, S4. S3 (Integrated Care / ICAS) appears in OI but not OB; S4 appears in OB but not OI. Different product tracking conventions per file.

7. **Customer-level OI data available.** Cust c + Cust d fields in the main cache enable customer concentration and account-level OI analysis.

8. **FA descr values are truncated** (20 chars max in pivot cache). Full descriptions need lookup in source Access DB.

9. **Sheet S1 FA view (3) uses mEUR** (values ~1,000-16,000 for single month), while other sheets use kEUR. Only sheet in file using a different unit — flag for dashboard design.

10. **Budget table (Cache1) stores full EUR** (e.g., 66,666.67 for a single entity) — divide by 1,000 to align with kEUR before comparison with actuals from Cache2/3.

---

## H. Relationship to Other Files

| Dimension | Order Book Overview | Order Book Detailed | OI HEC (this file) |
|-----------|---------------------|---------------------|--------------------|
| BU scope | S1, S2, S4 | S1 | S1, S2, S3 |
| Metric | Order backlog (stock) | Order backlog (stock) | Order intake (flow) |
| Business Type | Not present | Not present | 7 types |
| Historical depth | 13 months | Current only | 73 months |
| Budget comparison | Not present | Not present | 2026 budget included |
| Customer level | Not present | Present | Present |
| Unit | kEUR | Full EUR (divide by 1000) | kEUR (Cache1 full EUR) |
| Source DB | OB Data for pivot.mdb | Detailed Order Book.mdb | 02-OI Database.accdb |

**Join strategy to link OI with Order Book:**
- Link on: BU code = BU c, FA code = FA c, Region Grp approx RGrp lvl2, Snapshot (YYYY-MM) = Year + Period
- OI measures new bookings flowing into the backlog; OB measures the resulting stock at period end
- OB movement = OB(t) - OB(t-1) = OI(t) - Revenue recognized(t) + adjustments

---

# FILE 4: 20-TACO pivot 2025 Selectable x-rate.xlsm — P&L / Margin Analytics

> **File:** `Data/20-TACO pivot 2025 Selectable x-rate.xlsm`
> **Purpose:** TACO (Total Actualized Cost/Contribution) — full P&L from Net Sales down to Operating Contribution, with budget vs. actuals vs. last year, and selectable local currency exchange rates
> **Unit:** kEUR (thousands of EUR) by default; convertible to local currency via selectable x-rates
> **VBA:** 47,616 bytes — ActiveX buttons control x-rate input fields

---

## A. File Overview

TACO is AGFA's internal P&L reporting framework covering the full income statement from **Net Sales** through **Direct Costs (COGS)** to **TACO Margin**, then through **Operating Expenses** to **TACO Contribution** (equivalent to Operating Result / EBIT before allocations). Key features:

- **4 sheets**: interactive pivot dashboard + a formatted report view with actual data
- **2 pivot caches** (69,922 records each) from the same source query
- **10 ActiveX controls** + **VBA macros** providing selectable exchange rate buttons (ACT LC / BUD LC / ACT LY LC)
- **85+ line items** spanning the full P&L structure
- **Month filter** (1-12) as the time dimension — monthly granularity only (no snapshot series)
- **BU codes**: S1, S4, JB (IT General), S2
- **80+ legal entity (company) codes** — most granular entity dimension across all files

---

## B. Source Data Architecture

### B.1 Source System and Connection

| Property | Detail |
|----------|--------|
| Database type | Microsoft Access (.mdb) — ODBC, MS Access Driver (DriverId=25) |
| UNC path | \\agfahealthcare.com\dfs\data\be\medical\medical\Controlling\Update Pivot tables\TACO\10-TACO database.mdb |
| Default dir | G:\medical\Controlling\Update Pivot tables\TACO |
| Connection names | Connection (primary), Connection1 (duplicate) |
| Source object | Data source pivot queries (ACCESS QUERY/VIEW — not a raw table) |
| Total records | 69,922 (both caches identical) |
| Last refreshed by | Burney, Mohd Fahad |

**Important:** The source is a **query** (`Data source pivot queries`), not a base table. This means there is ETL logic in Access before data reaches Excel. The underlying raw SAP/ERP tables are abstracted behind this query.

### B.2 SQL Query (exact, from connections.xml)

```sql
SELECT `Data source pivot queries`.Month,
       `Data source pivot queries`.Link,
       `Data source pivot queries`.`FA c`,
       `Data source pivot queries`.`FA d`,
       `Data source pivot queries`.`BU c`,
       `Data source pivot queries`.`BU d`,
       `Data source pivot queries`.`BD c`,
       `Data source pivot queries`.`BD d`,
       `Data source pivot queries`.`Comp c`,
       `Data source pivot queries`.`Comp d`,
       `Data source pivot queries`.`Dest c`,
       `Data source pivot queries`.`Dest d`,
       `Data source pivot queries`.`Grp Reg c`,
       `Data source pivot queries`.`Grp Reg d`,
       `Data source pivot queries`.`Reg c`,
       `Data source pivot queries`.`Reg d`,
       `Data source pivot queries`.`SReg c`,
       `Data source pivot queries`.`SReg d`,
       `Data source pivot queries`.Actuals,
       `Data source pivot queries`.Budget,
       `Data source pivot queries`.`FA ranked detail`,
       `Data source pivot queries`.`FA ranked`,
       `Data source pivot queries`.Sp_Reg,
       `Data source pivot queries`.`Actuals LY`,
       `Data source pivot queries`.`RGrp lvl1`,
       `Data source pivot queries`.`RGrp lvl2`,
       `Data source pivot queries`.`RGrp lvl3`,
       `Data source pivot queries`.Region,
       `Data source pivot queries`.Subregion,
       `Data source pivot queries`.Geofin
FROM `Data source pivot queries` `Data source pivot queries`
```

### B.3 Pivot Cache Structure

| Cache | ID | Records | Used by | Notes |
|-------|-----|---------|---------|-------|
| Cache 1 | 0 | 69,922 | pivotTable1 (Pivot sheet), pivotTable2 (Dashboard EUR) | Full KPI set including LC variants |
| Cache 2 | 1 | 69,922 | pivotTable3 (Source Report view) | Same data, slightly different computed fields |

---

## C. Source Query Columns (30 fields from `Data source pivot queries`)

| # | Column | Description | Sample Values |
|---|--------|-------------|---------------|
| 0 | Month | Fiscal month number (1-12) | 1-12 |
| 1 | Link | Internal link/join key | — |
| 2 | FA c | Financial Application code | 010H, 010L, 010O, 010Q, 010S, 010T, 010V, 010W, 010X |
| 3 | FA d | Financial Application description (truncated) | — |
| 4 | BU c | Business Unit code | S1, S2, S4, JB |
| 5 | BU d | Business Unit description | IITS, HCIS, DIIT, IT GEN |
| 6 | BD c | Business Division code | IT |
| 7 | BD d | Business Division description | IT |
| 8 | Comp c | Company code (legal entity) | 0316, 0327, 0332, 0336, 1090, 1101 (80+ entities) |
| 9 | Comp d | Company description | Agfa HealthCare DK, Agfa-Gevaert Ltd. (IE), AGFA HealthCare NL BV, Agfa HealthCare Inc. |
| 10 | Dest c | Destination country code | IS, IE, NL, ES, IT, VA, PL, US |
| 11 | Dest d | Destination country description | ICELAND, IRELAND, NETHERLANDS, SPAIN |
| 12 | Grp Reg c | Region group code | E (Europe), I (International), N (N.America), W (World Wide), R (Not assigned) |
| 13 | Grp Reg d | Region group description | Europe, International, N.America, World Wide, Not assigned |
| 14 | Reg c | Region code | NORD, UK, BNLU, IBER, ITAL, DE, USA, LA&M, ASP, CANA, FRAN, DACH, ASEA, WW, EUR |
| 15 | Reg d | Region description | Nordic, United Kingdom, Benelux, Iberia, Italy, Direct Export, USA, Latam, AsPac, Canada, France, Dach, ASEA |
| 16 | SReg c | Sub-region code | NORD, IE, NL, IBER, ITAL, POLD, USA, SAFR |
| 17 | SReg d | Sub-region description | Nordic, Ireland, Netherlands, Iberia, Italy, Poland, USA, South Africa |
| 18 | Actuals | Actual P&L value (kEUR) | — (numeric) |
| 19 | Budget | Budget P&L value (kEUR) | — (numeric) |
| 20 | FA ranked detail | P&L line item with code (long format) | 02 - Net Sales Hardware / Equi (010H), 55 - TACO MARGIN |
| 21 | FA ranked | P&L line item (short format, display) | 02 - Net Sales Hardware Equi, 55 - TACO MARGIN |
| 22 | Sp_Reg | Special Region label | Nordic, UK, Benelux, Iberia, Italy, Direct Export, USA, Latam |
| 23 | Actuals LY | Last Year actual P&L value (kEUR) | — (numeric) |
| 24 | RGrp lvl1 | Regional group level 1 | Europe & Int, N.America, Worldwide |
| 25 | RGrp lvl2 | Regional group level 2 | Europe North, Europe South, International, N.America, Worldwide |
| 26 | RGrp lvl3 | Regional group level 3 | Europe North, Europe South, Direct Export, N.America, Latam, Aspac, Worldwide |
| 27 | Region | Region name (harmonized) | Nordic, UK, BeNeLux, Iberia, Italy, Direct Export, USA, Latam |
| 28 | Subregion | Sub-region name | Nordic, Ireland, Netherlands, Iberia, Italy, Poland, USA, South Africa |
| 29 | Geofin | Financial geography segment | New IITS, ACESO |

---

## D. P&L Structure — FA Ranked Detail Line Items

TACO covers the full income statement. The 85 line items are organized in a hierarchical P&L structure:

### D.1 Net Sales (Revenue)

| Line | FA Code | Description |
|------|---------|-------------|
| 02 | 010H | Net Sales Hardware / Equipment |
| 03 | 010V | Net Sls Recurring HW |
| 05 | 010I | Net Sales - subs. 3rd P Infrastructure |
| 06 | — | Sales Hardware (subtotal) |
| 07 | 010L | Net Sales Own Licenses |
| 08 | 010X | Net Sls Recur. Own IP SW |
| 09 | 010O | Net Sales - subs. own IP SW |
| 10 | — | Sales SW Own (subtotal) |
| 11 | 010T | Net Sales 3rd p. Licenses |
| 12 | 010W | Net Sls Recurring 3rdP SW |
| 13 | 010Q | Net Sales - subs. 3rP SW |
| 14 | — | Sales SW 3rdP (subtotal) |
| 15 | — | Sales Goods (subtotal) |
| 16 | 010M | Sales Supp Service / Net Sales Supp&Maintenance |
| 17 | 010U | Net Sales - subs. Professional Services |
| 18 | 010S | Net Sales Services |
| 19 | 010Y | Net Sls Recur. Impl. Serv |
| 20 | — | Sales Impl Service (subtotal) |
| 21 | — | Sales Service excl. AMS (subtotal) |
| 22 | 010K | Net Sales - subs. Managed Services |
| 23 | 010Z | Net Sls Recur. Man. Serv |
| 24 | — | Sales AMS (subtotal) |
| 25 | — | Sales Service+AMS (subtotal) |
| 26 | — | **Total Net Sales** |
| 28 | 07I | Insurance Services |

### D.2 Direct Cost of Sales (COGS)

| Line | FA Code | Description |
|------|---------|-------------|
| 29 | 020H | CoGS Hardware / Equipment |
| 30 | 020V | Cogs Recurring HW |
| 31 | 020R | Rentals & Managed Service |
| 32 | 010I | Cogs - subs. 3rd P Infrastructure |
| 33 | — | COGS Hardware (subtotal) |
| 34 | 020O | Cogs - subs. own IP SW |
| 35 | 020L | CoGS Own Licenses |
| 36 | 020X | Cogs Recur. Own IP SW |
| 37 | — | COGS SW Own (subtotal) |
| 38 | 020T | CoGS 3rd p. Licenses |
| 39 | 020W | Cogs Recurring 3rdP SW |
| 40 | 020Q | COGS subscription 3rp SW |
| 41 | — | COGS SW 3rdP (subtotal) |
| 42 | — | COGS Goods (subtotal) |
| 43 | 020J | Cogs - subs. SMA |
| 44 | 020M | Support & Maintenance |
| 46 | — | DCOS Supp Service (subtotal) |
| 47 | 020S | Services |
| 48 | 020Y | Cogs Recur. Impl. Serv |
| 49 | — | DCOS Impl Service (subtotal) |
| 50 | — | DCOS Service excl. AMS (subtotal) |
| 51 | 020Z | Cogs Recur. Man. Serv |
| 52 | DCOS AMS | DCOS AMS |
| 53 | — | DCOS Service+AMS (subtotal) |
| 54 | — | **Total Direct Cost of Sales** |

### D.3 Margins and Contribution Lines

| Line | Description | Formula |
|------|-------------|---------|
| 55 | **TACO MARGIN** | Total Net Sales - Total Direct Cost of Sales |
| 56 | Service | Below-TACO adjustments |
| 57 | Freight | |
| 58 | OTHER COGS | |
| 59 | Destructions & Depreciations | |
| 60 | Reclassification Housing/Insurance COGS | |
| 61 | Reclassification IFRS16 COGS | |
| 62 | **Total Product Driven Costs** | Sum of lines 56-61 |
| 63 | **PRODUCT CONTRIBUTION** | TACO MARGIN - Total Product Driven Costs |

### D.4 Operating Expenses

| Line | Description |
|------|-------------|
| 64 | SE - Freight to Customers |
| 65 | SE - Advertising |
| 66 | SE - Sales & Pre Sales |
| 67 | SE - Marketing and Applications |
| 68 | SE - Customer Care Center Non Service |
| 69 | SE - Supply Chain |
| 70 | SE - Logistics |
| 71 | SE - Reclassification Housing/Insurance |
| 72 | SE - Reclass IFRS16 |
| 73 | **Selling Expenses** (SE total) |
| 74 | GA - BG Management & Other Support |
| 75 | GA - Human Resources & HR related |
| 76 | GA - Procurement |
| 77 | GA - Finance |
| 78 | GA - Reclassification Housing/Insurance |
| 79 | GA - Reclass IFRS16 |
| 80 | **General Administration Expenses** (GA total) |
| 81 | Other Operating Income |
| 82 | Other Operating Expenses |
| 83 | **Other Operating** |
| 84 | **OPERATING EXPENSES** (SE + GA + Other) |
| 85 | **TACO CONTRIBUTION** = Product Contribution - Operating Expenses |

---

## E. KPI Catalogue — Computed Fields in Pivot Cache

All KPIs are derived from three base columns (Actuals, Budget, Actuals LY) using computed fields:

| KPI Field | Formula | Description |
|-----------|---------|-------------|
| Actuals | — | Base: actual P&L value in EUR |
| Budget | — | Base: budgeted P&L value in EUR |
| Actuals LY | — | Base: prior year actual P&L value in EUR |
| X-rate ACT | =1 (default) | Exchange rate for current year actuals |
| X-rate BUD | =1 (default) | Exchange rate for budget |
| X-rate ACT LY | =1 (default) | Exchange rate for last year actuals |
| **Actuals LC** | =Actuals * X-rate ACT | Actuals in local currency |
| **Budget LC** | =Budget * X-rate BUD | Budget in local currency |
| **Actuals LY LC** | =Actuals LY * X-rate ACT LY | Last year actuals in local currency |
| **A vs B** | =Actuals - Budget | Actuals vs. Budget variance (absolute) |
| **A vs B %** | =(Actuals/Budget) - 1 | Actuals vs. Budget variance (%) |
| **A vs A LY** | =Actuals - Actuals LY | Year-over-year variance (absolute) |
| **A vs A LY %** | =(Actuals/Actuals LY) - 1 | Year-over-year variance (%) |
| **A LC vs BUD LC** | =Actuals LC - Budget LC | LC actuals vs. LC budget (absolute) |
| **A LC vs BUD LC %** | =(Actuals LC/Budget LC) - 1 | LC actuals vs. LC budget (%) |
| **A LC vs A LY LC** | =Actuals LC - Actuals LY LC | LC year-over-year (absolute) |
| **A LC vs A LY LC %** | =(Actuals LC/Actuals LY LC) - 1 | LC year-over-year (%) |
| **RGrp lvl1_2** | (computed grouping) | Aggregated region group for pivot subtotals |

**Total distinct KPIs available in pivots: 14** (ACT, BUD, ACT LY, 4 variances + 4 LC variants + 4 LC variances)

---

## F. Sheet-by-Sheet Inventory

| # | Sheet Name | Pivot | Cache | Focus |
|---|-----------|-------|-------|-------|
| 1 | **Pivot** | pivotTable1 | Cache1 | Full KPI set (14 KPIs); filter panel: Month, Regions/WW, Geofin, RGrp lvl1-3, Region, Subregion, Dest, Comp, BU, FA; x-rate input cells |
| 2 | **Dashboard EUR** | pivotTable2 | Cache1 | Condensed view: ACT/BUD/ACT LY only; filtered to Geofin=New IITS, BU c=S1; month=12 |
| 3 | **Source Report view** | pivotTable3 | Cache2 | Full 14-KPI pivot; Regions/WW=Regions view; same filter panel as Pivot sheet |
| 4 | **Report view** | *(formatted flat table)* | — | Pre-calculated output table: Month 9 data by FA ranked (all 85 lines); columns: ACT, BUD, Act vs Bud, Act vs Bud %, ACT LY, Act vs Act ly, Act vs Act ly %, ACT LC, BUD LC, ACT LC vs BUD LC, ACT LC vs BUD LC % |

### F.1 Selectable X-Rate Feature

Three input cells appear on Pivot, Dashboard EUR, and Source Report view:
- **ACT LC** — exchange rate multiplier for actual values (default: 1 = EUR)
- **BUD LC** — exchange rate multiplier for budget values (default: 1 = EUR)
- **ACT LY LC** — exchange rate multiplier for last year actuals (default: 1 = EUR)

When set to 1, all LC columns equal the EUR columns. When set to e.g. 1.08 (USD/EUR rate), all LC columns convert EUR → USD. VBA macros likely drive these cells via ActiveX command buttons.

---

## G. Quantitative Data Points

| Metric | Value |
|--------|-------|
| Total pivot cache records | 69,922 |
| P&L line items (FA ranked detail) | 85 |
| Key summary lines | Total Net Sales (26), Total Direct Cost of Sales (54), TACO MARGIN (55), Product Contribution (63), Operating Expenses (84), TACO CONTRIBUTION (85) |
| Company codes (legal entities) | 80+ (all global Agfa HealthCare + some Agfa Materials/Graphics) |
| Business Units | S1 (IITS), S2 (HCIS), S4 (DIIT), JB (IT GEN) |
| Regions (Reg c) | 15: Nordic, UK, Benelux, Iberia, Italy, Direct Export, USA, Latam, AsPac, Canada, France, Dach, ASEA, WW, Europe |
| KPIs | 14 computed variants (EUR + LC, ACT/BUD/LY, absolute + %) |
| VBA size | 47,616 bytes |
| ActiveX controls | 10 |
| **Sample Month 9 (Sep 2025) actuals (kEUR):** | |
| Net Sales Hardware (line 02) | ~18,122 ACT vs ~18,223 BUD |
| Net Sales Own Licenses (line 07) | ~30,103 ACT vs ~29,739 BUD |
| Net Sls Recur Own IP SW (line 08) | ~3,551 ACT vs ~4,772 BUD |
| Net Sales subs own IP SW (line 09) | ~1,776 ACT vs ~606 BUD |
| Sales HW subtotal (line 06) | ~21,580 ACT vs ~19,841 BUD |

---

## H. Key Analytical Findings

1. **TACO is the P&L / Margin file** — the only file among the four that contains cost data and margin KPIs. The other three files (Order Book x2, OI) are revenue/order tracking; this one shows profitability.

2. **Source is a query, not a raw table.** `Data source pivot queries` implies ETL and data transformation logic exists inside the Access database that is not visible from Excel. The actual mapping from SAP cost codes to the P&L hierarchy is done there.

3. **Selectable exchange rates enable local currency reporting.** With x-rates set to 1 (EUR), all LC columns equal EUR values. Setting rates enables multi-currency comparison — important for regions with significant non-EUR revenue (N.America/USD, UK/GBP, Latam currencies).

4. **Company code dimension is the most granular entity level across all files.** 80+ Comp c values cover all legal entities in the AGFA group, including non-HealthCare entities (Agfa Materials, Agfa Graphics) — useful for carve-out/entity-level P&L attribution.

5. **Month is the only time dimension** (numeric 1-12). Unlike OI (73 months of snapshots) or Order Book (13 monthly snapshots), this file appears to cover a single fiscal year (2025 given filename), one month at a time. Year-over-year comparison is via the Actuals LY column (not a separate year dimension).

6. **BU JB (IT GEN) appears here but not in Order Book or OI files.** This appears to be a general/overhead business unit for IT. S3 from OI is absent; S4 (DIIT) is present here but absent from OI.

7. **FA codes overlap with Order Book and OI files** — the same 010H (Hardware), 010L (Own Licenses), 010S (Services) structure is used. This enables linking TACO revenue lines to the corresponding OI bookings and Order Book backlog.

8. **TACO CONTRIBUTION (line 85) = AGFA operating result** at the HE IT level — the final bottom line in this file. This is the key margin KPI for the AGFA analytics engagement.

9. **Two redundant connections** (Connection + Connection1) point to the same database — typical of Excel pivot cache duplication artifacts, not two separate data sources.

10. **Report view sheet contains pre-calculated values** (not pivot-driven) — it likely reads from pivotTable cells via formulas. Month 9 filter is currently active. These pre-calculated values are the "clean" output for presentations/exports.

---

## I. Relationship to Other Files

| Dimension | Order Book Overview | Order Book Detailed | OI HEC | TACO (this file) |
|-----------|---------------------|---------------------|--------|------------------|
| Metric type | Backlog stock | Backlog stock | Order intake | Revenue + Cost + Margin |
| Contains COGS | No | No | No | Yes (full COGS) |
| Margin KPIs | No | No | No | Yes (TACO Margin, Product Contribution, TACO Contribution) |
| Time dimension | Monthly snapshots | Current | Monthly snapshots | Monthly (single year) |
| Budget data | No | No | Yes (OI budget) | Yes (P&L budget) |
| Last Year comparison | No | No | Yes | Yes |
| Company code level | No | Partial (Comp descr) | No | Yes (80+ entities) |
| BU scope | S1, S2, S4 | S1 | S1, S2, S3 | S1, S2, S4, JB |
| Source DB | OB Data for pivot.mdb | Detailed Order Book.mdb | 02-OI Database.accdb | 10-TACO database.mdb |
| FA codes | Yes | Yes | Yes | Yes (+ COGS codes 020x) |

**Key linkage: TACO Revenue line 26 (Total Net Sales) should reconcile with recognized revenue; OI drives the Order Book; Order Book releases into TACO Net Sales when revenue is recognized.**

**Join strategy:**
- Link on: BU c = BU c/code, FA c = FA c, RGrp lvl2 = RGrp lvl2, Region, Dest c
- TACO month (1-12) maps to OI Snapshot (YYYY-MM) via fiscal year context
- TACO Actuals = recognized revenue; OI = bookings; OB = outstanding backlog
- Revenue waterfall: OI booked → enters Order Book → recognized → appears in TACO Actuals
