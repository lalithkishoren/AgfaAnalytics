# Data Analysis Findings

---

## File: DPS Equipment Customer order & revenue follow-up 2026 for Sutherland project (1).xlsx

**Path:** `C:\Users\vajra\OneDrive\Documents\Work\AGFA Analysis\AgfaAnalytics\DPS\Data\Order-Intake\`
**Analyzed on:** 2026-03-24
**Total sheets:** 61

### What this file is

This is a **point-in-time snapshot copy** of the main file (`DPS_Customer order & revenue follow-up 2026.xlsx`) prepared for the **Sutherland analytics project** (the current engagement). It is NOT a separate customer dataset — "Sutherland" is the project name, not a customer name.

### Differences from the main file

| Aspect | Main File | Sutherland File |
|---|---|---|
| Total sheets | 62 | 61 |
| Missing sheet | — | `RR 2026 pending YTD` (removed) |
| Dashboard rows | 2,502 | 2,502 |
| Dashboard columns | 37 (same) | 37 (same) |
| Data rows changed | — | 1 row updated (Order 77209966) |

### The one updated row — Order 77209966 (IMS Internationale Marketing)

This single change reflects the order being credit-released and progressed between the two file versions:

| Field | Main File | Sutherland File |
|---|---|---|
| Equipment type | `ANAPURNA CIERVO H3200` | `ANAPURNA CIERVO H3200 - staged in HQ` |
| Invoiced | `others` | `potential` |
| Order Destination | `Other` | `Customer` ← **now counts as OIT** |
| Rev. Rec. Month | blank | `04_2026` |
| Order date | TBC | 2026-03-04 |
| ZUB | TBC | 4552573828 |
| Chart file change | 2026-03-06 | 2026-03-10 |
| Notes | "NO ZUB yet - order not yet credit released" | "Order credit released March 10th" |
| Specifications | blank | "Intention is to deliver still in 03_2026 despite OIT only March" |

### Impact of this change on KPIs

Because Order Destination changed from `Other` → `Customer`, this order **now appears in OIT counts**:
- `actual OIT 03-2026` total: **4 units** (vs 3 in main file) — IMS added to Europe/DACH
- All other sheets (RR, Delayed, YTD) are identical

### Structure & Architecture

Identical to main file in all other respects — same 37 columns, same pivot architecture, same cache structure, same formula logic, same KPIs. Refer to the main file analysis below for full details.

---

## File: DPS_Customer order & revenue follow-up 2026.xlsx

**Path:** `C:\Users\vajra\OneDrive\Documents\Work\AGFA Analysis\AgfaAnalytics\DPS\Data\Order-Intake\`
**Analyzed on:** 2026-03-24
**Total sheets:** 61

---

## Sheet Structure Overview

| Group | Sheets | Purpose |
|---|---|---|
| Master Register | `Dashboard 2026` | All machine orders 2019–2026 (2,501 rows) |
| Monthly OIT Pivots | `actual OIT 01/02/03-2026`, `OIT FY 2025`, `OIT 01-12 2025`, `OIT FY 2023/2024` | Count of new orders per month |
| SPR Views | `SPR printer OIT 2026`, `SPR Tauro periph OIT 2026` | Current-month sales progress report |
| Delayed Tracker | `Delayed` | Units with delayed revenue recognition |
| Monthly RR Actuals | `RR 01-12 2025`, `RR 01-02 2026`, `RR FY 2023/2024` | Invoiced units per invoice month |
| Forward RR Pipeline | `Potential/Expected RR 03–05_2026` | Upcoming revenue recognition |
| YTD Summaries | `RR 2026 YTD`, `RR 2026 pending YTD`, family variants | Rolling year-to-date actuals + pipeline |
| SSOT | `SSOT RR 2025 till Sep`, Europe variant | Authoritative 2025 RR reference (Jan–Sep) |
| Printer Overview | `2024/2025/2026 Printer Overview OIT&Graph` | Monthly × family pivot feeding charts |
| Reference / Config | `Data validation`, `AD`, `EFI assortm`, `Default Col. Width` | Dropdown lists, article codes, EFI assortment |

---

## Sheet-by-Sheet Analysis

### 1. `Dashboard 2026` — Master Order Register

**2,501 data rows × 37 columns** (cols 38–45 empty)

The single source of truth for all machine orders — cumulative from 2019–2026. All other sheets are pivots or filtered views of this data.

#### Columns

| # | Column | Description |
|---|---|---|
| 1 | Sales Org | Country/entity (58 unique) |
| 2 | Region | 7 regions: Europe, NAFTA, LATAM, ASPAC, ROW, Non Region, TBC |
| 3 | Customer info | Free-text: customer ID prefix + notes + dates |
| 4 | Equipment type | Specific model name (e.g. ANAPURNA H2050I LED) |
| 5 | Equipment family | Product family (24 families) |
| 6 | SX Model | Short model code |
| 7 | Customer name | |
| 8 | Order Nbr. | SAP order number |
| 9 | On Production plan | Yes / No / delayed / reserved / n.a. |
| 10 | Shipped | Yes / No / delayed / reserved / n.a. |
| 11 | Invoiced | Yes / announced / delayed / potential / risk / others / n.a. |
| 12 | Order Destination | Customer / Demo / Replenishment / Loan / Fair / Swap / Agfa Alussa / Other |
| 13 | Order Cancelled | Yes (blank = not cancelled) |
| 14 | Rev. Rec. Month | Revenue recognition month (format: `MM_YYYY`, e.g. `04_2026`) |
| 15 | Delayed Invoicing | Flag |
| 16 | Root cause delayed invoicing | Customer / Logistics / Supplier / Sales+Service / Field Test / Other |
| 17 | Year Classifier (OIT) | Order intake year (2019–2026) |
| 18 | Specifications & Specials | |
| 19 | Expected date of shipping ex fact | |
| 20 | Installation date | |
| 21 | Serial nr | Machine serial number |
| 22 | Specials | (blank) / ECO3 / Demo allocated / etc. |
| 23 | Rev. Rec. input from Service | Free-text notes from field service (initials + date + status) |
| 24 | Transfer to MS Dynamics | ERP transfer flag |
| 25 | Chart file change/addition | Date of last update |
| 26 | Order date | |
| 27 | U1P/S4H | ERP system identifier |
| 28 | ZUB + Further comments | SAP reference + notes |
| 29 | Fairs in YYYY | Trade fair attribution |
| 30 | Peripheral info | |
| 31 | PP RR | Production plan revenue rec. |
| 32 | Family | Formula-derived (errors in raw read) |
| 33 | Order Year | Formula-derived |
| 34 | Order Month | Formula-derived |
| 35 | Invoiced Y/N | Clean Yes/No flag |
| 36 | Invoice Year | Formula-derived |
| 37 | Invoice Month | Formula-derived |

#### Dimension Unique Values

- **Regions (7):** Europe, NAFTA, LATAM, ASPAC, ROW, Non Region, TBC
- **Sales Orgs (58):** BNL, DACH (Germany/Austria/CH/SEE), France, Italy, Iberia, UK, Nordic, Poland, Turkey, NAFTA/US, NAFTA/Canada, Nafta/US EFI, Netherlands EFI, Brazil, Mexico, Colombia, Argentina, Japan, Oceania, India, South Korea, South Africa, Dubai, Saudi Arabia, Israel, and more
- **Equipment Families (24):** Accurio, Alpina, Anapurna, Anapurna LED, Anapurna option, Avinci, Condor options, Jeti Bronco, Jeti Condor, Jeti Mira LED (LM), Jeti Tauro LED, Jeti Tauro LED Alussa, Jeti Tauro LED Indust, Jeti Tauro UHS LED, Jeti Tauro WB, Oberon, Onset Automation, Onset Printer, Onset option, Speedset Printer, Speedset options, Tauro options, used equipment, TBC
- **Year Classifier:** 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026

---

### 2. Monthly OIT Snapshot Sheets

**Pattern:** Pivot of Dashboard 2026 filtered to a specific order month/year. One sheet per month.

#### Pivot Filters Applied
- Order Destination = `Customer` (excludes Demo, Replenishment, EFI pre-payment, Demo allocated)
- Order Cancelled = blank (not cancelled)
- Invoiced Y/N = All
- Order Year = specific year
- Order Month = specific month(s)

#### Pivot Layout
- **Rows:** Region → Sales Org → Customer name → Specials → Order date → Equipment type
- **Columns:** Equipment Family groups (Anapurna/Accurio | Interiojet | Jeti | Oberon | Onset)
- **Values:** Count of Order Nbr.
- **Top-right:** `status` date (snapshot date) + `Total units [month] = N`

#### Unit Counts by Period

| Sheet | Period | Total Units |
|---|---|---|
| `OIT FY 2023 (Arnaud C)` | Full Year 2023 | — |
| `OIT FY 2024 (Arnaud C)` | Full Year 2024 | 196 |
| `OIT 01-2025` … `OIT 08-2025` | Monthly 2025 (Jan–Aug) | — |
| `actual OIT 09-2025` … `actual OIT 12-2025` | Monthly 2025 (Sep–Dec) | — |
| `OIT FY 2025` | Full Year 2025 | 195 |
| `actual OIT 01-2026` | January 2026 | 11 |
| `actual OIT 02-2026` | February 2026 | 10 |
| `actual OIT 03-2026` | March 2026 (MTD 23/03) | 3 |
| `OIT 10_2024 MTD - MV` | October 2024 MTD | — |

#### March 2026 OIT Detail (`actual OIT 03-2026`)
- 3 units total
- ASPAC/Japan: 1 × JETI CONDOR RTR5200 HS (Admax, ECO3)
- Non Region/Nafta-US EFI: 1 × EFI TAURO UHS 7C W16 (EFI INC)
- ROW/India: 1 × INTERIOJET 3300I (Sidmark)
- 1 cancellation recorded: UK / UYR Limited — JETI TAURO H3300 UHS LED 4C + peripherals (financing fell through, MH 3/3/26)

#### February 2026 OIT Detail (`actual OIT 02-2026`)
- 10 units total
- Europe (3): France×2 (Publiscreen, REALISAPRINT), Iberia×1 (PINKPLATE - Onset Panthera)
- NAFTA (6): NAFTA/US×5 (Konica Minolta×3 Accurio, INNOMARK Anapurna, FIFTH COLOR Jeti, GILSON Jeti), ROW×1
- ROW (1): Israel (GETTER GROUP - Anapurna)

---

### 3. SPR (Sales Progress Report) Views

- **`SPR printer OIT 2026`** — Current month printer OIT only (March 2026: 1 unit — EFI Tauro UHS, Non Region)
- **`SPR Tauro periph OIT 2026`** — Peripheral/accessory orders current month
  - Note: Certain peripherals explicitly excluded from SPR tracking: TAURO H3300 Stacker Upg 4→6 arms, TAURO H3300 S UPGR TO HS, TAURO H3300 UHS LIGHT RTR INTEGRATION KIT, EFI TAURO UHS LIGHT RTR INTEGRATION KIT

Same pivot structure as OIT sheets but with additional `Family` column and filtered to Order Month = 03, Order Year = 2026.

---

### 4. `Delayed` — Delayed Revenue Recognition Tracker

**As of 23/03/2026 — 12 units delayed (all OIT Year 2025)**

| Root Cause | Count | Examples |
|---|---|---|
| Customer | 4 | Brazil (order change), Iberia (construction delay), Italy (customer change/financing), Mexico (financing) |
| Logistics | 3 | Brazil (Korean harbour congestion), DACH Germany (sea transport delay ×2) |
| Other | 1 | Brazil (MODULE — shown at Expoprint Mar 2026, RR moved to 04_2026) |
| Sales/Service | 1 | DACH Germany (FLYERALARM — no install capacity, now May 2026) |
| Supplier | 1 | Poland (VKF Spork — EXW Canada docking now April) |
| (Customer, deal lost) | 1 | Mexico (DATAPRINT — competitor win, potential replacement customer) |
| (Service delay) | 1 | Iberia (Mira Trade-in pending, deliver 25/03, invoice April 2026) |

**Columns:** Year Classifier (OIT) → Root cause → Sales Org → Equipment type → Customer name → Specials → Rev. Rec. input from Service → Count

---

### 5. Monthly RR Snapshot Sheets (Revenue Recognition Effected)

**Pattern:** Each sheet = invoiced units for a specific Invoice Month (pivoted from Dashboard 2026).

#### Pivot Filters Applied
- Order Destination = Multiple (includes all)
- Order Cancelled = blank
- Invoice Year = specific year
- Invoice Month = specific month
- Invoiced Y/N = All (shows both Yes and pending)

#### Pivot Layout
- **Rows:** Invoiced flag → Equipment family → Region → Sales Org → Equipment type → Customer → Specials → Rev. Rec. input from Service
- **Values:** Count of Customer info

#### RR Sheet Inventory

| Sheet | Period | Notes |
|---|---|---|
| `RR FULL YEAR 2023` | FY 2023 actuals | |
| `RR FULL YEAR 2024` | FY 2024 actuals | |
| `RR 01_2025 Eq Fam` … `RR 12_2025 Eq Fam` | Monthly 2025 | 12 sheets |
| `RR 01_2026 Eq Fam` | Jan 2026 actuals | 9 units invoiced |
| `RR 02_2026 Eq Fam` | Feb 2026 actuals | 7 units invoiced |
| `Potential RR 03_2026 Eq Fam` | Mar 2026 potential | Not yet invoiced |
| `Expected RR 03_2026 Eq Fam` | Mar 2026 expected/announced | |
| `Potential RR 04_2026 Eq Fam` | Apr 2026 potential | Forward-looking |
| `Expected RR 04_2026 Eq Fam` | Apr 2026 expected | |
| `Potential RR 05_2026 Eq Fam` | May 2026 potential | |

#### Sample: RR Mar 2025 (`RR 03_2025 Eq Fam`)
- 13 units invoiced (Yes Total = 13)
- Families: Anapurna LED, Avinci, Jeti Bronco, Jeti Tauro LED
- Regions: ASPAC, Europe, NAFTA

#### Sample: RR Jan 2026 (`RR 01_2026 Eq Fam`)
- ASPAC: 1 (Oberon, Japan)
- Europe: 5 (Anapurna LED ×3 France/Iberia, Jeti Tauro LED UK, Jeti Tauro UHS LED UK)
- LATAM: 1 (Anapurna LED, Guatemala)
- NAFTA: multiple (Anapurna FB2540I, H2050I, etc.)

---

### 6. YTD Summary Sheets

#### `RR 2026 YTD` — Revenue Recognition 2026 Year-to-Date (as of 23/03/2026)
- **16 units invoiced total** across Jan + Feb 2026
- Anapurna/Accurio family: 11 units (Jan=6, Feb=5)
- Jeti family: 4 units (Jan=2, Feb=2)
- Oberon: 1 unit (Jan=1)
- Structure: Family → Equipment family → Region → Sales Org → Equipment type → Customer → Invoiced flag → Invoice Month columns (01, 02)

#### `RR 2026 YTD FAMILY` — Compact Family Summary
| Rev. Rec. Month | Anapurna/Accurio | Jeti | Oberon | Grand Total |
|---|---|---|---|---|
| 01_2026 | 6 | 2 | 1 | 9 |
| 02_2026 | 5 | 2 | — | 7 |
| **Grand Total** | **11** | **4** | **1** | **16** |

#### `RR 2026 pending YTD` — Pending Pipeline 2026
- Filters: Invoice Year=2026, not yet invoiced
- Key metrics at top: Backlog end Jan = 43 units, OIT Feb = 10; Backlog end Feb = 46 units, OIT Mar = 0 (MTD)
- Monthly columns: 03-2026, 04-2026, 05-2026+
- Structure same as RR YTD but showing pending/potential units

---

### 7. SSOT (Single Source of Truth) Sheets

- **`SSOT RR 2025 till Sep`** — Authoritative 2025 RR Jan through September
  - Monthly columns: 01 through 09
  - Region → Family → Equipment family → Sales Org → Equipment type → Customer → Invoiced → Specials
  - Marked as SSOT = authoritative reference, not to be overwritten
- **`SSOT RR 2025 till Sep EUROPE`** — Same, Europe region only

---

### 8. `Expected RR 2026 Cntry-O.NR` — Forward Pipeline

**Pending Revenue Recognition 2026 — future months only**

> Note: "announced current month excluded — potential current month + 1 NOT included"

- **Columns:** Region → Sales Org → Equipment family → Equipment type → Customer name → Order Nbr. → Specials → Rev. Rec. input from Service → Invoiced status → 04-2026 | 05-2026 | 06-2026 columns
- **Invoiced status values:** blank (firm), delayed, potential, announced
- Includes Italy/IPRINT cancellation rebooking flag at top (ANAPURNA CIERVO H3200 — financing issues)
- Alussa (Ecuador) allocation recovery also noted

---

### 9. Printer Overview Sheets

- `2024 Printer Overview OIT&Graph`
- `2025 Printer Overview OIT&Graph`
- `2026 Printer Overview OIT&Graph`

**Structure:** Compact pivot — Order Month (rows) × Family (columns: Anapurna/Accurio, Jeti, Onset, Grand Total)

**2026 OIT by Month (as of 23/03/2026):**
| Month | Anapurna/Accurio | Jeti | Onset | Grand Total |
|---|---|---|---|---|
| 01 | 8 | 2 | 1 | 11 |
| 02 | 5 | 4 | 1 | 10 |
| 03 (MTD) | — | 1 | — | 1 |
| **Total** | **13** | **7** | **2** | **22** |

> Note on sheet: "Always refresh above pivot for Graph update!" — pivot feeds embedded charts in the sheet.

---

### 10. Reference / Config Sheets

#### `Data validation`
Dropdown list master for all controlled fields in Dashboard 2026:
- **Equipment family:** 24 values (Accurio, Alpina, Anapurna, Anapurna LED, Anapurna option, Avinci, Condor options, Jeti Bronco, Jeti Condor, Jeti Mira LED, Jeti Mira LED (LM), Jeti Tauro LED, Jeti Tauro LED Alussa, Jeti Tauro LED Indust, Jeti Tauro UHS LED, Jeti Tauro WB, Oberon, Onset Automation, Onset Printer, Onset option, Speedset Printer, Speedset options, Tauro options, used equipment)
- **On Production plan:** Yes / reserved / No / delayed / n.a. + specific model codes for production plan reference
- **Shipped:** Yes / reserved / No / delayed / n.a.
- **Invoiced:** announced / delayed / potential / risk / n.a. / others / option only / Yes
- **Destination:** Customer / Customer Consignment / Demo / Loan / Fair / Swap / Agfa Alussa / Replenishment / Other / Forecast rev.rec
- **Region:** Europe / NAFTA / LATAM / ASPAC / ROW / Non Region
- **Root cause delayed invoicing:** Supplier / Logistics / Field Test / Sales+Service / Customer / Other
- Last updated: Jan 15, 2025 (valid as of 1/1/2025, per new SX template 2025)

#### `AD` — Article/Accessory Code Master
- MABC codes (e.g. AVZHG, AV5DT, AD8BX) with descriptions, manufacturing dates, SAP material numbers
- Grouped by category: Flex RTR, Feeder & Stacker, Feeder, etc.
- Used to link peripheral orders to product hierarchy

#### `EFI assortm` — EFI Product Assortment
- EFI-branded equipment list with: Equipment type, Manufacturing site (Mississauga, CA), Pickup point, Payment terms (3-times), Agfa type code, EFI type code, bph (production rate), Options, EFI MABC code, EFI MABC Description
- Note: "We ONLY create EFI specific MABC codes in case there is different labeling/branding. This is only Printers/Roll-to-Roll peripherals and some consumables."
- EFI MABC codes = separate SKU namespace for EFI-branded variant of Agfa machines

---

## Data Source Architecture & Sheet Relationships

### How the data flows

All 57 analytical sheets ultimately trace back to **one source: `Dashboard 2026`**, but through two distinct paths:

```
Dashboard 2026  (sheet, range A1:AK3335, 37 columns, 2501+ rows)
        │
        ├─── Path A: Direct Worksheet Cache (cacheId=86)
        │    Refreshed by: Haufe, Martina
        │    Used by: All OIT snapshot sheets (OIT FY 2024, OIT 01-12 2025,
        │             actual OIT 09-2025 through actual OIT 04-2026, OIT FY 2025)
        │    Fields: All 37 Dashboard columns available
        │
        └─── Path B: Excel Power Pivot Data Model (Connection 1)
             Loaded via: WorksheetConnection_Dashboard!$A:$AJ
             Refreshed by: Puttemans, Karen
             Used by: ALL other analytical sheets (RR, SPR, Delayed, YTD,
                      SSOT, Expected RR, Printer Overview)
             Fields: Subset of Dashboard columns (12–17 per cache, by pivot need)
```

> Key insight: The Data Model acts as an in-memory OLAP cube over the Dashboard data. Each pivot table queries a specific subset of fields from it — this is why different sheet types expose different columns.

---

### Cache-to-Sheet Mapping (complete)

| Sheet | cacheId | Pivot Location | Source Type | Refreshed By | Fields |
|---|---|---|---|---|---|
| **Dashboard 2026** | — | — | **Master data (not a pivot)** | Haufe, Martina | All 37 cols |
| OIT FY 2024 | **86** | A8:L173 | Worksheet → Dashboard 2026 (A1:AK3335) | Haufe, Martina | All 37 |
| OIT 01-2025 … OIT 08-2025 | **86** | A8:J~32 | Worksheet → Dashboard 2026 | Haufe, Martina | All 37 |
| actual OIT 09–12 2025 | **86** | A10:K~36 | Worksheet → Dashboard 2026 | Haufe, Martina | All 37 |
| OIT FY 2025 | **86** | A10:M192 | Worksheet → Dashboard 2026 | Haufe, Martina | All 37 |
| actual OIT 01-2026 | **86** | A10:J28 | Worksheet → Dashboard 2026 | Haufe, Martina | All 37 |
| actual OIT 02-2026 | **86** | A10:J24 | Worksheet → Dashboard 2026 | Haufe, Martina | All 37 |
| actual OIT 03-2026 | **86** | A10:I18 | Worksheet → Dashboard 2026 | Haufe, Martina | All 37 |
| actual OIT 04-2026 | **86** | A10:G12 | Worksheet → Dashboard 2026 | Haufe, Martina | All 37 |
| SPR printer OIT 2026 | **46** | A8:I12 | Data Model | Puttemans, Karen | 14 |
| SPR Tauro periph OIT 2026 | **45** | A8:H10 | Data Model | Puttemans, Karen | 14 |
| OIT FY 2023 | **61** | A10:K167 | Data Model | Puttemans, Karen | 13 |
| OIT 10_2024 MTD | **60** | A8:G26 | Data Model | Puttemans, Karen | varies |
| Delayed | **79** | A5:H19 | Data Model | Puttemans, Karen | 14 |
| RR FULL YEAR 2023 | **78** | A9:U178 | Data Model | Puttemans, Karen | 15 |
| RR FULL YEAR 2024 | **77** | A9:U164 | Data Model | Puttemans, Karen | 15 |
| RR 01_2025 Eq Fam | **76** | A9:I20 | Data Model | Puttemans, Karen | 15 |
| RR 02_2025 … RR 12_2025 | **75 → 65** | A9:I~45 | Data Model | Puttemans, Karen | 15 |
| RR 01_2026 Eq Fam | **64** | A9:I24 | Data Model | Puttemans, Karen | 15 |
| RR 02_2026 Eq Fam | **63** | A9:I22 | Data Model | Puttemans, Karen | 15 |
| Potential RR 03_2026 Eq Fam | **62** | A9:I11 | Data Model | Puttemans, Karen | 15 |
| Expected RR 03_2026 Eq Fam | **80** | A9:I19 | Data Model | Puttemans, Karen | 15 |
| Potential RR 04_2026 Eq Fam | **44** | A9:I22 | Data Model | Puttemans, Karen | 15 |
| Expected RR 04_2026 Eq Fam | **83** | A9:I11 | Data Model | Puttemans, Karen | 15 |
| Potential RR 05_2026 | **84** | A9:I11 | Data Model | Puttemans, Karen | 15 |
| RR 2025 YTD | **52** | A9:U149 | Data Model | Puttemans, Karen | 14 |
| RR 2025 YTD USED | **53** | A9:M17 | Data Model | Puttemans, Karen | 14 |
| RR 2026 YTD | **51** | A9:K30 | Data Model | Puttemans, Karen | 14 |
| RR 2026 YTD FAMILY | **82** | A11:E15 | Data Model | Puttemans, Karen | 15 |
| RR 2026 pending YTD | **47** | A10:O58 | Data Model | Puttemans, Karen | 15 |
| RR 2026 pending YTD FAMILY | **81** | A11:F19 | Data Model | Puttemans, Karen | 15 |
| RR 2025 pending YTD USED | **50** | A10:I12 | Data Model | Puttemans, Karen | varies |
| SSOT RR 2025 till Sep | **49** | A9:R111 | Data Model | Puttemans, Karen | 15 |
| SSOT RR 2025 till Sep EUROPE | **48** | A9:R56 | Data Model | Puttemans, Karen | 15 |
| Expected RR 2026 Cntry-O.NR | **85** | A10:O51 | Data Model | Puttemans, Karen | 17 |
| 2024 Printer Overview (summary) | **58** | B8:I22 | Data Model | Puttemans, Karen | 12 |
| 2024 Printer Overview (detail) | **59** | R8:AH156 | Data Model | Puttemans, Karen | 12 |
| 2025 Printer Overview (summary) | **57** | B8:F13 | Data Model | Puttemans, Karen | 12 |
| 2025 Printer Overview (detail) | **56** | R8:AH157 | Data Model | Puttemans, Karen | 12 |
| 2026 Printer Overview (summary) | **54** | B8:F13 | Data Model | Puttemans, Karen | 12 |
| 2026 Printer Overview (detail) | **55** | R8:Y31 | Data Model | Puttemans, Karen | 12 |

---

### Fields Exposed Per Cache Type

#### Cache 86 — OIT Sheets (Direct Dashboard source, all 37 fields)
All 37 Dashboard columns available. Key fields used in OIT pivots:
`Order Year`, `Order Month`, `Equipment family`, `Family`, `Order Destination`, `Order Cancelled`, `Region`, `Sales Org`, `Customer name`, `Equipment type`, `Order date`, `Specials`, `Count of Order Nbr.`, `Invoiced Y/N`

#### Cache 46 / 45 — SPR Views (14 fields via Data Model)
`Order Year`, `Order Month`, `Equipment family`, `Order Destination`, `Order Cancelled`, `Family`, `Region`, `Customer name`, `Sales Org`, `Equipment type`, `Order date`, `Specials`, `Count of Customer info`, `Order Nbr.`

#### Cache 61 — OIT FY 2023 (13 fields via Data Model)
`Order Year`, `Equipment family`, `Order Destination`, `Order Cancelled`, `Count of Order Nbr.`, `Family`, `Invoiced Y/N`, `Region`, `Sales Org`, `Order date`, `Order Month`, `Customer name`, `Specials`

#### Cache 79 — Delayed Sheet (14 fields via Data Model)
`Order Year`, `Equipment family`, `Order Destination`, `Count of Order Nbr.`, `Sales Org`, `Invoice Year`, `Invoiced Y/N`, `Invoiced`, `Customer name`, `Year Classifier (OIT)`, `Root cause delayed invoicing`, `Rev. Rec. input from Service`, `Specials`, `Equipment type`

#### Caches 63–78 — RR Monthly Sheets (15 fields via Data Model)
`Order Year`, `Equipment family`, `Order Destination`, `Order Cancelled`, `Region`, `Sales Org`, `Invoice Year`, `Invoice Month`, `Invoiced Y/N`, `Invoiced`, `Customer name`, `Equipment type`, `Count of Customer info`, `Rev. Rec. input from Service`, `Specials`

#### Cache 47 — RR Pending YTD (15 fields via Data Model)
`Order Year`, `Equipment family`, `Order Destination`, `Order Cancelled`, `Region`, `Sales Org`, `Invoice Year`, `Invoice Month`, `Invoiced Y/N`, `Invoiced`, `Customer name`, `Equipment type`, `Count of Customer info`, `Family`, `Specials`

#### Cache 51 — RR YTD (14 fields via Data Model)
`Order Year`, `Equipment family`, `Order Destination`, `Order Cancelled`, `Count of Order Nbr.`, `Family`, `Region`, `Sales Org`, `Invoice Year`, `Invoice Month`, `Invoiced`, `Customer name`, `Equipment type`, `Specials`

#### Cache 85 — Expected RR 2026 (17 fields via Data Model — most complete RR cache)
`Order Year`, `Equipment family`, `Order Destination`, `Order Cancelled`, `Region`, `Sales Org`, `Invoice Year`, `Invoice Month`, `Invoiced Y/N`, `Invoiced`, `Customer name`, `Equipment type`, `Count of Customer info`, `Family`, `Specials`, `Order Nbr.`, `Rev. Rec. input from Service`

#### Caches 54–59 — Printer Overview (12 fields via Data Model)
`Order Year`, `Order Month`, `Equipment family`, `Equipment type`, `Order Destination`, `Order Cancelled`, `Count of Order Nbr.`, `Family`, `Region`, `Customer name`, `Sales Org`, `SX Model`

---

### Reference Sheets (no pivot, feed into Dashboard)

| Sheet | Role | Feeds into |
|---|---|---|
| `Data validation` | Dropdown value lists for all controlled fields | Dashboard 2026 data entry |
| `AD` | MABC article/accessory code master (material codes, categories, dates) | Dashboard peripheral tracking |
| `EFI assortm` | EFI-branded product assortment with MABC codes | Dashboard EFI order classification |
| `Default Col. Width inPivotTable` | Formatting reference | Pivot table display only |

---

## Key Business Logic

| Rule | Detail |
|---|---|
| **OIT ≠ RR** | Order Intake = order placed date; Revenue Recognition = invoice date after installation. Gap can be months. |
| **True OIT filter** | Order Destination = "Customer", Order Cancelled = blank. Demo / Replenishment / Loan excluded. |
| **EFI orders** | EFI Inc. is a reseller/JV partner. Tracked under "Non Region" / "Nafta/US EFI". Pre-payment scenario applies. |
| **ECO3** | Tag in Specials column = Japanese distributor channel (Eco3 Co.). All Japan ECO3 sales routed through them. |
| **Delayed tracking** | `Delayed` sheet + `Rev. Rec. input from Service` field = order-level accountability with initials + date |
| **Potential vs Expected vs Announced** | Invoiced status hierarchy: potential (uncertain) → expected (planned) → announced (committed) → Yes (done) |
| **Formula columns** | Cols 32–37 (Family, Order/Invoice Year/Month, Invoiced Y/N) are Excel formula-derived. Show #VALUE!/#N/A in raw Python read — require live Excel or manual parsing from cols 1–31. |
| **Backlog metric** | Backlog end Jan 2026 = 43 units pending RR. Backlog end Feb 2026 = 46 units pending RR. |

---

## KPIs & Calculation Logic

### Pivot Measures (what is actually counted)

Only **2 measures** are used across all 57 analytical pivot sheets — both are simple counts:

| Measure | Function | Used In |
|---|---|---|
| `Count of Order Nbr.` | COUNT | All OIT sheets, Printer Overview, RR YTD |
| `Count of Customer info` | COUNT | All RR sheets, SPR, Delayed, SSOT, Expected RR, Pending YTD |

> No SUM, AVERAGE, DIVIDE, or complex DAX expressions exist. The sole KPI tracked throughout is **unit count** — number of machines ordered or invoiced.

The Data Model also auto-generates two auxiliary COUNTs used for pivot filter validation:
- `Count of On Production plan` = `COUNTA([On Production plan])`
- `Count of Order Destination` = `COUNTA([Order Destination])`

---

### Derived Columns in Dashboard 2026 (formula logic)

Six columns (AF–AK) are formula-derived from raw input columns. These power all pivot filtering and grouping:

| Col | Column Name | Formula | Logic |
|---|---|---|---|
| AF | **Family** | `VLOOKUP(F, 'Data validation'!N:O, 2, FALSE)` | Maps SX Model (col F) to a Family group via lookup table. If no match → `#N/A` |
| AG | **Order Year** | `TEXT(YEAR(Z), "####")` | Extracts 4-digit year from Order date (col Z). Blank order date → `#VALUE!` |
| AH | **Order Month** | `TEXT(MONTH(Z), "0#")` | Extracts zero-padded month (01–12) from Order date. Blank → `#VALUE!` |
| AI | **Invoiced Y/N** | `IF(K="Yes","Yes","No")` | Binary flag from Invoiced field (col K). Anything other than "Yes" → "No" |
| AJ | **Invoice Year** | `TEXT(VALUE(RIGHT(N,4)),"####")` | Parses the last 4 chars of Rev. Rec. Month (col N, format `MM_YYYY`) as year |
| AK | **Invoice Month** | `TEXT(VALUE(LEFT(N,2)),"0#")` | Parses the first 2 chars of Rev. Rec. Month (col N, format `MM_YYYY`) as month |

**Key dependencies:**
- `Order Year` / `Order Month` depend on col Z (Order date) — rows without an order date show `#VALUE!`
- `Invoice Year` / `Invoice Month` depend on col N (Rev. Rec. Month) in `MM_YYYY` format — rows without RR month show `#VALUE!`
- `Family` depends on col F (SX Model) matching the lookup table — unmapped models show `#N/A`

---

### Family Grouping Logic

The `Family` column (AF) maps individual **SX Model codes** to **7 high-level Family groups** via VLOOKUP on `'Data validation'!N:O`.

| Family Group | SX Model codes included |
|---|---|
| **Anapurna** | ANAPURNA H1650 (4C+W / EXPRESS / 6C), H2050, H2500, H3200, FB2540, RTR3200, ACCURIOWIDE (160/320) — also all LED variants (`...I LED`) and Ciervo H2500/H3200 |
| **Jeti** | JETI MIRA 2716/2732 HS LED, JETI TAURO H2500 LED, H3300/S/HS/UHS/X-UHS LED (Agfa + EFI variants), JETI BRONCO H3300/S/HS, JETI CONDOR RTR5200 |
| **Oberon** | OBERON RTR3300 4C+W, OBERON RTR3300 6C |
| **Interiojet** | INTERIOJET IJ3300, INTERIOJET IJ2250 |
| **Onset** | ONSET X1/HS, ONSET X2/HS, ONSET X3/HS, ONSET PANTHERA variants |
| **Speedset** | SPEEDSET 1060 |
| **Soft Signage** | AVINCI CX32XX |

> Note: **ACCURIOWIDE is grouped under Anapurna** — not a separate family. This is intentional per the lookup table.
> Note: Some newer models (e.g. ANAPURNA CIERVO H2500, ALPINA) may not be in the lookup → show `#N/A` in Family col.

---

### How KPIs Are Filtered to Produce Business Metrics

The unit count KPIs take meaning from the pivot filters applied:

| Business Metric | Filter Logic |
|---|---|
| **Order Intake (OIT)** | Order Destination=`Customer` + Order Cancelled=`blank` + Order Year=`YYYY` + Order Month=`MM` → Count of Order Nbr. |
| **Revenue Recognition (RR) Actuals** | Invoice Year=`YYYY` + Invoice Month=`MM` + Invoiced=`Yes` → Count of Customer info |
| **Pending RR (backlog)** | Invoice Year=`2026` + Invoiced ≠ `Yes` (blank/potential/announced/delayed) → Count of Customer info |
| **Delayed units** | Invoiced ≠ `Yes` + Delayed Invoicing flag present → Count of Order Nbr. |
| **Cancellations** | Order Cancelled=`Yes` → visible in Dashboard but excluded from OIT counts |
| **True OIT excl. EFI pre-payment** | Same as OIT + manually excludes EFI pre-payment rows (noted in pivot filter header) |
| **True OIT excl. Demo** | Same as OIT + Order Destination=`Customer` only (Demo, Replenishment excluded by default) |

---

## Current State Snapshot (as of 2026-03-23)

| Metric | Value |
|---|---|
| 2026 OIT YTD (Jan+Feb+Mar MTD) | 22 units (excl. cancellations) |
| 2026 RR YTD (Jan+Feb invoiced) | 16 units |
| 2026 Pending RR backlog (end Feb) | 46 units |
| Delayed units (currently) | 12 units (all 2025 OIT year) |
| Mar 2026 cancellation | 1 order — UK/UYR Limited (financing) |
| Full Year 2024 OIT | 196 units |
| Full Year 2025 OIT | 195 units |

---

## Key Analytical Findings — Order Intake Files

The following findings are derived strictly from the analyzed files. No external assumptions are made.

### Finding 1: Both order intake files share the same underlying dataset

The Sutherland file is a snapshot copy of the main file as of approximately March 10, 2026. The only structural difference is one fewer sheet (`RR 2026 pending YTD` absent) and one updated data row (Order 77209966 — IMS Internationale Marketing). All architecture, columns, pivot logic, and KPIs are identical. For all analytical purposes the two files are the same dataset at marginally different points in time.

### Finding 2: A single order reclassification changes March 2026 OIT from 3 to 4 units

Order 77209966 (IMS Internationale Marketing, ANAPURNA CIERVO H3200) changed Order Destination from `Other` → `Customer` when it was credit-released on March 10, 2026. This is the only substantive data difference between the two files. The Sutherland file shows March 2026 OIT = 4 units; the main file shows 3 units.

### Finding 3: FY 2024 and FY 2025 OIT were nearly flat at 196 and 195 units respectively

From the quantitative summary sheets: Full Year 2024 OIT = 196 units, Full Year 2025 OIT = 195 units. This 1-unit difference represents no material change in volume year-on-year at the total level.

### Finding 4: Two separate refreshers maintain different pivot groups — divergence risk

OIT pivot sheets are refreshed by Haufe Martina via a direct worksheet cache (cacheId=86). RR, SPR, Delayed, YTD, Expected RR, and SSOT sheets are refreshed by Puttemans Karen via the Excel Power Pivot Data Model (Connection 1). If one refresher updates without the other, OIT and RR counts can be temporarily inconsistent within the same file.

### Finding 5: Order intake file covers hardware units only

The Dashboard 2026 master register tracks individual machine orders. Inks, consumables, service contracts, options, and accessories are not tracked here. The full revenue picture (which includes inks + service at ~40–50% of total revenue per Sales Details file) requires the Sales & Margin files.

### Finding 6: "Order Destination = Customer" filter is the gate for OIT counting

Only orders with Order Destination = `Customer` are counted in OIT pivots. Orders classified as Demo, Replenishment, Loan, Fair, Swap, Agfa Alussa, or Other are excluded. A reclassification from any of these to `Customer` (as seen with order 77209966) adds a unit to OIT counts retrospectively.

### Finding 7: The Family column (col AF) is a VLOOKUP that can silently error

`Family` = `VLOOKUP(SX Model, Data validation!$N:$O, 2, FALSE)`. If a new SX Model code is not in the lookup table (Data validation sheet, col N:O, 38 entries), the formula returns an error. This would exclude that order from all family-level pivot aggregations. The lookup table must be kept current as new models are added.

### Finding 8: Revenue Recognition Month is a manually-entered free-text field

Column 14 (`Rev. Rec. Month`, format `MM_YYYY`) is manually updated by the DPS team when an order moves toward invoicing. There is no automated SAP feed that writes this field. Data quality — and the accuracy of forward RR pipeline views — depends entirely on team discipline in maintaining this field.

### Finding 9: Dashboard 2026 is cumulative from 2019 to 2026

The master register contains 2,501 rows spanning orders from 2019 to 2026. Pivots filter by Order Year or Invoice Year to scope to specific periods. Any aggregation on the full Dashboard without a year filter will include multi-year history. Year Classifier (OIT) reflects the order placement year, not the invoice year — these can differ for delayed orders.

### Finding 10: 12 units are currently flagged as delayed

From the quantitative summary: Delayed units = 12, all with OIT Year = 2025. Root cause categories available (Customer / Logistics / Supplier / Sales+Service / Field Test / Other) but counts per category not extracted from the current file state.

---

## Data Gaps & Questions

### Gap 1: No EUR revenue value per order

The Dashboard 2026 has no price, value, or expected revenue column. It tracks units only. Revenue EUR per order must come from the Sales & Margin files via an approximate join on Family × Revenue Recognition Month. There is no order number or CRM ID in the Sales & Margin files to enable an exact match.

### Gap 2: Manual maintenance creates timing gaps vs SAP actuals

The order intake file is updated manually by the DPS team after SAP invoicing events. There is no automated sync from SAP. The Sales & Margin BEx files (which are direct SAP extracts) may reflect invoiced revenue before the order intake file is updated to show `Invoiced = Yes`. This gap is documented in the file itself (two separate refreshers with different schedules).

### Gap 3: SSOT sheet only covers Jan–Sep 2025

The `SSOT RR 2025 till Sep` sheet is the authoritative 2025 RR reference but stops at September 2025. Oct, Nov, Dec 2025 RR data is held in other sheets (`RR 01-12 2025`, `RR 2026 YTD`). There is no single authoritative full-year 2025 RR sheet.

### Gap 4: Customer info column (col 3) is unstructured free text

The `Customer info` column contains a mix of customer IDs, dates, initials, notes, and status updates in a single free-text cell. It cannot be aggregated or filtered reliably. Structured customer data (col 7 Customer name, col 10 Ship-To) must be used for any customer-level analysis.

### Gap 5: Cancellation tracking exists but is not aggregated in any pivot

`Order Cancelled` (col 13) flags cancelled orders with `Yes`. All OIT pivots filter this field to blank (non-cancelled). There is no dedicated pivot or summary showing cancellation counts, cancellation rate, or cancelled revenue value by period or region.

### Gap 6: Equipment families (24) do not map 1:1 to Budget Classes in Sales files

The order intake file uses 24 equipment family names. The Sales & Margin files use 10 Budget Classes. The mapping is not fully 1:1: Onset → INCA wide format, Interiojet → Jeti, Oberon → Jeti are non-obvious groupings. The Family VLOOKUP (col AF) maps to 7 groups, not 24 families, reducing granularity.

### Gap 7: No visibility into order value or pricing at order intake stage

There is no ASP, list price, or contracted value column in the order intake file. Average Selling Price can only be estimated retrospectively by dividing Sales Details EUR by RR unit counts from the SSOT sheet — and even then only at Budget Class × month grain, not per individual order.

### Gap 8: Sutherland file will diverge from main file over time

The Sutherland file is a snapshot. As the DPS team continues to update the main file (new orders, status changes, RR month updates), the Sutherland file will become increasingly stale. Any analysis run on the Sutherland file after its snapshot date reflects the state of the data as of approximately March 10, 2026 only.

---

## Relevance to Analytics Goals

| Analytics Goal | Data Available | Coverage | Key Limitation |
|---|---|---|---|
| **Order Intake tracking** | Dashboard 2026 + monthly OIT pivot sheets | High — unit counts by region, sales org, family, month | No EUR value per order |
| **Revenue Recognition tracking** | RR sheets + SSOT RR 2025 | High — invoiced unit counts by family and month | SSOT covers Jan–Sep 2025 only; Oct–Dec in separate sheets |
| **Forward pipeline / RR forecast** | Expected/Potential RR sheets (Mar–May 2026) | Medium — units expected to invoice by month | Rev. Rec. Month is manual; subject to change |
| **Delay analysis** | `Delayed` sheet + cols 15–16 in Dashboard | High — delayed units with root cause classification | No EUR value of delayed revenue |
| **Cancellation analysis** | Col 13 (Order Cancelled = Yes) | Partial — flag exists in Dashboard | No aggregated cancellation view or trend pivot |
| **Customer-level order tracking** | Dashboard 2026 (col 7 Customer name) | Partial — named per order | Customer info (col 3) is unstructured; no customer hierarchy |
| **Family/product mix of OIT** | OIT pivot sheets, SPR sheets | High — family columns in all OIT pivots | 24 equipment families vs 10 Budget Classes in Sales files |
| **OIT vs RR gap** | Both OIT and RR sheets present | High — can compute units placed vs units invoiced per period | No EUR dimension; join to Sales files is approximate |
| **ASP analysis** | Not available in this file | None | No price field; must cross-reference Sales Details |
| **Full-year 2025 RR reconciliation** | RR 01-12 2025 + SSOT (Jan–Sep) | Partial | SSOT authoritative only through Sep; no single full-year SSOT |
| **Forecasting** | Expected/Potential RR pipeline sheets | Partial — units only, 3-month horizon | No revenue value; horizon limited to next 3 months |

---

## Recommended Next Analyses

### 1. OIT-to-RR conversion rate by family and year

Goal: Understand what % of orders placed in a given month are invoiced in the same month vs delayed.
Method: For each order in Dashboard 2026 with Invoiced = Yes, compute the gap between Order Month (col 34) and Invoice Month (col 37). Segment by Equipment Family and Year Classifier.
File needed: Dashboard 2026 (all 2,501 rows).

### 2. Delay root cause breakdown

Goal: Quantify the 12 currently delayed units by root cause category.
Method: Filter Dashboard 2026 to Delayed Invoicing = flag set, group by Root cause delayed invoicing (col 16). Cross-check against Delayed sheet.
File needed: Dashboard 2026, Delayed sheet.

### 3. Cancellation rate trend

Goal: Measure annual cancellation rate as % of OIT.
Method: Count rows where Order Cancelled = Yes, group by Year Classifier. Divide by total OIT units per year (from OIT FY pivot sheets).
File needed: Dashboard 2026.

### 4. Full-year 2025 RR unit count (authoritative)

Goal: Produce a single verified FY 2025 RR total by family.
Method: Combine SSOT RR 2025 till Sep (Jan–Sep, verified) + RR 01-12 2025 sheet (Oct–Dec additions). Verify totals reconcile.
Files needed: SSOT RR 2025 till Sep + RR 01-12 2025.

### 5. Hardware ASP by family (cross-file)

Goal: Estimate average invoice price per machine for each equipment family.
Method: From Sales Details file — filter to hardware-only Product Families (exclude inks/service/options PF names), sum Turnover EUR per Budget Class per month. Divide by RR unit count from SSOT for same Budget Class and month. This gives EUR per unit at Budget Class × month grain.
Files needed: Dashboard 2026 (RR units) + Sales Details (revenue EUR).

### 6. 2026 OIT pipeline vs 2025 run-rate

Goal: Assess whether 2026 order intake is on track vs 2025 pace.
Method: Compare monthly OIT from `actual OIT 01/02/03-2026` sheets with corresponding 2025 months from `OIT 01-12 2025`. Note: March 2026 has only partial data (MTD at time of snapshot).
Files needed: OIT 01-12 2025 sheet + actual OIT sheets for 2026.
