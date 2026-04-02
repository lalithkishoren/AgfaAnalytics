# Existing Report Analysis

---

## File: DPS_BP2_Detailed Sales Inquiry AGFA NV_FY2025.xls

**Path:** `C:\Users\vajra\OneDrive\Documents\Work\AGFA Analysis\AgfaAnalytics\DPS\Data\Sales & Margin\`
**Analyzed on:** 2026-03-24
**Format:** Legacy Excel .xls (SAP BEx export)
**Sheets:** 2 — `BExRepositorySheet` (metadata marker, value=7), `Table` (all data)

---

### What this file is

A **SAP CO-PA (Controlling Profitability Analysis) Detailed Sales Inquiry** for FY 2025, scoped exclusively to **AGFA NV (company code 0898)**. Unlike other files which come from BW/BEx revenue reporting InfoProviders, this is sourced from the CO-PA module — giving profitability data at the transaction level with transfer-price-based COGS and ENP (Expected Net Price) data.

- **InfoProvider:** `GMPCOPA_1` (CO-PA Profitability Analysis)
- **Query Technical Name:** `GS_CO_PA_DET_SALES_INQ`
- **Query Description:** Detailed Sales Inquiry
- **Key Date of Posting:** 31/12/2025 (full year FY 2025)
- **Data as of:** 25/02/2009 22:58:24 *(note: this metadata date is incorrect/legacy — data content is FY 2025)*
- **Entity scope:** AGFA NV only (company code 0898, Belgium)
- **Business Group filter:** IN Industrial Solutions
- **Business Unit filter:** LK Sign and Display, LI Industrial Inkjet, M0 Packaging
- **Total data rows:** 6,855 (+ 58 BEx navigation rows that also carry metric values)

---

### Sheet: `Table` — Structure

**116 columns** — 13 dimension columns + **17 KPIs × 6 time periods**. Headers span rows 15–16 (two-level), data starts row 17.

#### Dimension Columns (cols 1–13)

| Col | Field | Notes |
|---|---|---|
| 2 | Navigation block / nav label | BEx navigation dimension names (58 entries); also used as first dimension display |
| 3 | Filter value | Active filter value (e.g., "0898 Agfa N.V. (BE)" for Company code filter) |
| 4 | Space | Separator |
| 5 | Business Unit code | LI / LK / M0 |
| 6 | Business Unit name | Industrial Inkjet / Sign and Display / Packaging |
| 7 | Budget Class | Text name (12 values incl. "Not assigned") |
| 8 | Product Family code | SAP PF code (156 unique) |
| 9 | Product Family name | Product family description |
| 10 | Ship-To Party code | SAP customer code (1,756 unique) |
| 11 | Ship-To Party name | Customer name (ship-to destination) |
| 12 | Customer (Install at) code | Installation customer code |
| 13 | Customer (Install at) name | Installation customer name |

#### 17 KPIs per Time Period

| Offset | KPI | Description |
|---|---|---|
| 0 | Net Turnover | Revenue after rebates and discounts |
| 1 | Rebates | Volume/trade rebates (negative = deduction) |
| 2 | Sales Quantity | Quantity sold in base UoM |
| 3 | Quantity (alt. UoM) | Quantity in alternative unit of measure |
| 4 | Gross Sales | List price × quantity (before all deductions) |
| 5 | Invoiced Freight | Freight charges billed to customer |
| 6 | TO QTY in UOM | Turnover quantity in UOM |
| 7 | Cash Discounts | Early payment discounts |
| 8 | Discounts | Line-item discounts |
| 9 | Reb/Bon/Disc | Total rebates/bonuses/discounts |
| 10 | ENP (Alt UoM) | Expected Net Price per alternative UoM |
| 11 | ENP | Expected Net Price — benchmark/standard price (`X` = suppressed) |
| 12 | ENP (PF) | ENP aggregated at Product Family level |
| 13 | Invoiced Turnover | Revenue per invoice document |
| 14 | ZINI Turnover | Revenue from ZINI billing document type (custom SAP billing) |
| 15 | Consumable Free deal | Consumable samples/free-of-charge deals |
| 16 | COGS at Transfer Pr. | Cost of goods sold at internal transfer price |

#### 6 Time Period Views (17 KPIs each)

| Cols | Period | Description |
|---|---|---|
| 14–30 | YTD Act CY | Year-to-date actuals, FY 2025 (full year at key date 31/12) |
| 31–47 | MTD Act CY | Month-to-date actuals, December 2025 only |
| 48–64 | MTD Act PY | December 2024 actuals (prior year same month) |
| 65–81 | YTD Act PY | FY 2024 full year actuals |
| 82–98 | MTD Bud CY | December 2025 budget — **all zeros (not loaded)** |
| 99–115 | YTD Bud CY | FY 2025 annual budget — **all zeros (not loaded)** |

> Budget columns (MTD/YTD Bud CY) contain no data in this extract. The "BP2" in the filename refers to Budget Plan 2 version but budget values were not included in the BEx output.

---

### Navigation Dimensions (58 available for drill-down)

Key dimensions available for slicing beyond what is shown in the data columns:

- **Product hierarchy:** Product Group, VSS Code, Product Family, Product Family (0Mat), CTAS Code VSS
- **Customer hierarchy:** Customer (Install at), Customer group, Customer Hierarchy, Local Market Segment (GS/IN/MI/ND/CI), Syracuse segmentation codes (CI/GS/IN/MI/ND for both Bill-to and Customer)
- **Sales team:** Employee, Employee Responsibility, Nav.SalesEmp, Sales Representative, Nav.SalesDis.
- **Transaction:** Billing type, Bill-to party, Payer, Ship-To Party, Sales Organization, Plant, Sales District, Storage location, Distribution Channel
- **Time:** Fiscal year/period, Posting date, day/month/year/YTD
- **Geography:** Agfa Sap Destination, Postal Code, Company code, Consignment Partner, Manufacturer
- **Product attributes:** Price Group, AcctAssgGr, Industry code 1, Transaction Type
- **Measure:** UN Quantity (alt), TO//Q/ENP (PF)

---

### KPIs & Actual Numbers (FY 2025, EUR)

**By Business Unit — YTD Act CY:**

| BU | Gross Sales | Net Turnover | COGS TP | Gross Margin | GM % |
|---|---|---|---|---|---|
| Sign and Display (LK) | 138,983,217 | 138,564,417 | 84,131,233 | 54,433,183 | 39.3% |
| Industrial Inkjet (LI) | 17,461,991 | 17,282,358 | 9,868,615 | 7,413,743 | 42.9% |
| Packaging (M0) | 3,726,643 | 3,727,174 | 3,450,331 | 276,843 | 7.4% |
| **Total** | **160,171,850** | **159,573,949** | **97,450,180** | **62,123,769** | **38.9%** |

**By Budget Class — YTD Act CY Net Turnover:**

| Budget Class | Net Turnover | COGS TP | Gross Margin | GM % |
|---|---|---|---|---|
| Jeti | 73,792,631 | 45,971,818 | 27,820,813 | 37.7% |
| Anapurna | 33,826,674 | 17,014,395 | 16,812,279 | 49.7% |
| INCA wide format | 29,187,092 | 20,076,432 | 9,110,660 | 31.2% |
| OEM Inks | 14,147,265 | 7,931,327 | 6,215,938 | 43.9% |
| Packaging Speedset | 3,557,739 | 3,317,438 | 240,301 | 6.8% |
| Industrial | 3,135,092 | 1,937,287 | 1,197,805 | 38.2% |
| Soft Signage | 1,553,148 | 889,587 | 663,561 | 42.7% |
| Other Sign & Display | 204,871 | 179,001 | 25,870 | 12.6% |
| Packaging Print Engi | 169,435 | 132,894 | 36,541 | 21.6% |

**Year-on-year comparison (YTD Act CY vs YTD Act PY):**
| Period | Net Turnover | Change |
|---|---|---|
| FY 2025 (Act CY) | EUR 159,573,949 | — |
| FY 2024 (Act PY) | EUR 154,365,450 | — |
| YoY change | — | **+EUR 5,208,498 (+3.4%)** |

**Revenue deduction waterfall (YTD Act CY total):**
| Item | EUR |
|---|---|
| Gross Sales | 160,171,850 |
| – Rebates | -203,811 (LI) / -615,639 (LK) |
| – Discounts | 127,409 |
| = **Net Turnover** | **159,573,949** |
| – COGS at Transfer Price | 97,450,180 |
| = **Gross Margin** | **62,123,769 (38.9%)** |

**ZINI Turnover** (special billing type) by Budget Class:
| Budget Class | ZINI Turnover |
|---|---|
| INCA wide format | 2,662,090 |
| Jeti | 2,524,325 |
| Anapurna | 699,935 |

**Top 10 Ship-To customers by YTD Net Turnover:**
| Customer | Net Turnover |
|---|---|
| Agfa Corp | 15,059,325 |
| EFI INC | 8,929,443 |
| AGFA CORP. | 6,828,258 |
| AGFA INC | 5,106,407 |
| AGFA CORPORATION | 5,012,189 |
| DELTA DISPLAY LTD | 3,380,415 |
| Agfa HealthCare México | 3,112,708 |
| ORAFOL Europe GmbH | 2,968,469 |
| AGFA DO BRASIL LTDA | 2,884,016 |
| AGFA Corp. C/O DSV | 2,719,638 |

> The majority of top customers are AGFA subsidiary entities — confirming this file captures AGFA NV → subsidiary intercompany transfers at transfer price. End-customer visible names appear lower in the ranking (e.g., DELTA DISPLAY, ORAFOL, Comdatek).

---

### Relationship to Other Files

| Aspect | Detailed Sales Inquiry (this file) | Sales Details (MMIS_CMTD) | AMSP Contribution (KRECO20) |
|---|---|---|---|
| InfoProvider | GMPCOPA_1 (CO-PA) | MMIS_CMTD | KRECO20 |
| Entity scope | AGFA NV only (0898) | All 15 DPS senders | All 16 DPS senders |
| Revenue | EUR 159.6M Net TO | EUR 191.2M Turnover | EUR 190.6M Net Sales |
| COGS basis | Transfer price (intercompany) | None | AMSP standard cost |
| Gross Margin | 38.9% (transfer price) | n/a | 61.9% (AMSP cost) |
| Customer detail | 1,756 ship-to customers | None | 1,246 customers |
| Budget data | Not loaded in this extract | None | None |
| Prior year | FY 2024 actuals included | None | None |
| Qty metric | Sales Quantity (base + alt UoM) | Qty (UOM Article) | TO Qty in UOM PF |
| ENP | Yes (partially suppressed 'X') | None | None |

**Revenue gap (EUR 159.6M vs EUR 191.2M):** The EUR 31.6M difference represents revenue booked by other DPS entities not included here — primarily INCA DIG PRINT LTD (Onset/INCA products), AGFA IJC LTD (industrial inkjet), and regional subsidiaries that invoice end customers directly.

**COGS basis difference:** Transfer price COGS (38.9% margin) is much lower than AMSP-based margin (61.9%) because transfer price includes the full manufacturing cost loaded by MAT entities, while AMSP valuation is a standard market-referenced cost that is only partially loaded.

---

### Key Business Logic & Data Notes

| Rule | Detail |
|---|---|
| **CO-PA InfoProvider** | `GMPCOPA_1` is the SAP CO-PA module — captures profitability at posting-document level with full price waterfall (Gross → Net → ENP → COGS). Different from BW material management (MMIS_CMTD) or RECO (KRECO20). |
| **AGFA NV scope only** | Company code 0898 filter means only transactions where AGFA NV is the selling entity. Subsidiaries invoicing end customers directly are excluded. |
| **ENP 'X' masking** | 955 rows show 'X' for ENP — BEx report suppresses price benchmark data for specific customer/product combinations (likely pricing sensitivity policy). ENP is numeric for 3,977 rows. |
| **ZINI billing type** | ZINI is a custom SAP billing document type (EUR 5.9M total). Appears mainly for hardware sales (Jeti, INCA, Anapurna). May represent specific commercial arrangements (e.g., distributor billing). |
| **Budget zeros** | MTD/YTD budget columns are all zero — budget data was not included in this BEx query extract. BP2 budget version exists in SAP but was not pulled. |
| **Intercompany dominance** | Top customers are mostly AGFA subsidiaries. This file captures the intra-group supply chain leg: AGFA NV → regional sales entities → end customers. |
| **Packaging low margin** | M0 Packaging gross margin 7.4% at transfer price — Speedset product family has very high COGS TP relative to net turnover (EUR 3.5M COGS on EUR 3.7M revenue), consistent with AMSP Contribution file finding (9.6% AMSP margin for Packaging Speedset). |
| **BP2 in filename** | BP2 = Budget Plan 2 (second budget revision). The filename indicates this is intended to be used with BP2 budget context, but budget data was not loaded. |
| **Data freshness note** | Status of Data field shows "25/02/2009 22:58:24" — this is a legacy metadata artifact, not the actual data date. The content covers FY 2025 (Jan–Dec 2025) based on key date 31/12/2025. |

---

## File: DPS_BP1_RECO Analysis Final (1).xls

**Path:** `C:\Users\vajra\OneDrive\Documents\Work\AGFA Analysis\AgfaAnalytics\DPS\Data\Sales & Margin\`
**Analyzed on:** 2026-03-24
**Format:** Legacy Excel .xls (SAP BEx export)
**Sheets:** 2 — `BExRepositorySheet` (metadata marker, value=7), `Table` (all data)

---

### What this file is

A **SAP BEx full P&L (RECO = Regional Contribution) report** covering the complete income statement from Revenue down to EBIT for FY 2025. It spans all entities in the **"IN Digital Print & Chemicals"** business group, including manufacturing entities, sales subsidiaries, and corporate allocations.

- **InfoProvider:** `KRECO20`
- **Query Technical Name:** `Q_KRECO20_111`
- **Query Description:** RECO Analysis overview Final
- **Report Period:** Jan 2025 – Dec 2025 (YTD range to reporting period)
- **Reporting Month:** DEC 2025 (full year)
- **Data as of:** 06/02/2026 21:57:19
- **Total data rows:** 52,091 (rows with account codes; 56 BEx navigation metadata rows also carry data values)

**Active query filters:**
- BG Sales Group (TD): `IN Digital Print & Chemicals`
- BU Sales Group (TD): `LI Industrial Inkjet, LK Sign and Display, M0 Packaging, DP`

---

### Sheet: `Table` — Structure

**18 columns** — header spans rows 14–15 (two-level header), data starts row 16

#### Dimension Columns

| Col | Field | Notes |
|---|---|---|
| 2 | Navigation block | BEx nav dimension labels shown once each (56 rows); these rows also carry real data values — do NOT exclude when aggregating |
| 3 | Filter value | Active filter applied to that navigation dimension (mostly empty at row level) |
| 5 | Tagetik FST Account code | P&L line code (e.g., 509999 = Revenue, 599999 = EBIT) |
| 6 | Tagetik FST Account name | Human-readable P&L line description |
| 7 | Cal. year / month | Format: `MM.YYYY` (e.g., `01.2025`) |
| 8 | SAP Sender code | Selling/manufacturing entity code (88 unique entities) |
| 9 | SAP Sender name | Entity name |
| 10 | Product Family (TD) code | Product family code (151 unique) |
| 11 | Product Family (TD) name | Product family name |

#### Metric Columns (all in **kEUR — thousands of EUR**)

| Col | Field | Description |
|---|---|---|
| 12 | Act YTD 2025 @ AC rate EURO | **Actual** FY 2025 at actual currency exchange rates |
| 13 | Init Budget YTD 2025 | **Budget Plan 1 (BP1)** — initial annual budget |
| 14 | Act YTD 2025 @ PY rate EURO | Actual FY 2025 translated at **prior year** FX rates |
| 15 | Act YTD 2025 @ BT rate EURO | Actual FY 2025 at **budget translation** FX rates |
| 16 | Act YTD 2025 @ FC rate EURO | Actual FY 2025 at **forecast** FX rates |
| 17 | Act PY YTD 2025 @ PY rate EURO | **Prior year** (FY 2024) actuals at prior year FX rates |

> The multiple FX rate columns enable currency impact analysis: comparing col 12 vs col 14 shows the FX translation effect between actual and prior year rates.

---

### P&L Structure — Tagetik FST Accounts

The file contains a complete management P&L with 47 distinct account codes organized in a hierarchical structure:

| Account | Description | Nature |
|---|---|---|
| 509999 | Revenue | External net sales |
| 510099 | COGS of own manufactured products | Manufacturing cost |
| 510207 | PPV charged intercompany | Intercompany price variance |
| 510258 | COGS purchased resale products IC | Intercompany COGS |
| 511408 | Elimination of sale of goods IC | IC elimination credit |
| 511999 | Direct cost of goods sold | Direct COGS |
| 514999 | Direct cost of services | Service delivery cost |
| **529999** | **Manufacturing Contribution** | **Subtotal: Revenue – COGS** |
| 530999–539999 | Production driven expenses | Variances, freight, write-downs, fixed costs |
| **549999** | **Gross Margin** | **Subtotal after all production costs** |
| 550999 | R&D expenses | Research & development |
| 552500 | Service HQ & intl service support | Centralized service overhead |
| 552999 | Selling expenses | Sales force, marketing |
| 553200–553999 | SG&A sub-lines | Procurement, ICS, G&A |
| **554999** | **SG&A expenses** | **Subtotal: all SG&A** |
| 560199–566999 | Other operating income/expense | Receivable impairments, sundry |
| **569999** | **Adjusted EBIT** | **Before non-recurring** |
| 580000–588999 | Non-recurring items | Restructuring, impairment, gains/losses |
| **589999** | **Non-recurring/restructuring** | **Subtotal non-recurring** |
| **599999** | **EBIT (Operating result)** | **Final EBIT** |
| 600099 | D&A | Depreciation & amortization |
| IFRS16 | IFRS16 | IFRS 16 lease adjustment |
| **RECO** | **Regional Contribution** | = EBIT allocated to regions |
| **NON RECO** | **Non Regional Contribution** | Unallocated central costs |
| **Overall Result** | **Overall Result** | Net result |

---

### KPIs & Actual Numbers (FY 2025, kEUR)

**P&L Waterfall — Act vs Budget vs Prior Year:**

| P&L Line | Act AC kEUR | Budget kEUR | Prior Year kEUR | vs Budget | vs PY |
|---|---|---|---|---|---|
| **Revenue** | **385,098** | **468,831** | **394,768** | **-83,733** | **-9,670** |
| Manufacturing Contribution | 312,949 | 397,526 | 319,257 | -84,577 | -6,308 |
| **Gross Margin** | **298,826** | **387,678** | **306,665** | **-88,852** | **-7,839** |
| SG&A expenses | -84,992 | -94,005 | -91,225 | +9,013 | +6,233 |
| Operating Expenses | -87,501 | -92,038 | -91,187 | +4,537 | +3,686 |
| **Adjusted EBIT** | **211,325** | **295,640** | **215,478** | **-84,315** | **-4,153** |
| Non-recurring/restructuring | -6,216 | -431 | +4,099 | -5,785 | -10,315 |
| **EBIT** | **205,109** | **295,208** | **219,578** | **-90,099** | **-14,469** |
| Regional Contribution (RECO) | 205,109 | 295,208 | 219,578 | -90,099 | -14,469 |
| Non Regional Contribution | -49,076 | -108,488 | -40,136 | +59,412 | -8,940 |
| **Overall Result** | **78,017** | **93,360** | **89,721** | **-15,344** | **-11,704** |

**Key margins:**

| Metric | Actual | Budget | Prior Year |
|---|---|---|---|
| Gross Margin % | 77.6% | 82.7% | 77.7% |
| Adjusted EBIT % | 54.9% | 63.1% | 54.6% |
| EBIT % | 53.3% | 63.0% | 55.6% |

> Revenue shortfall vs Budget: EUR -83.7M (-17.9%). This is the largest variance driver. Gross Margin % also declined 5.1pp vs budget, amplifying the absolute shortfall. SG&A was EUR 9M favorable vs budget (cost control).

**Monthly Revenue Act AC (kEUR):**
| Month | Revenue kEUR |
|---|---|
| Jan | 26,587 |
| Feb | 23,379 |
| Mar | 25,127 |
| Apr | 24,826 |
| May | 26,109 |
| Jun | 41,986 |
| Jul | 32,428 |
| Aug | 24,238 |
| Sep | 34,787 |
| Oct | 31,942 |
| Nov | 32,293 |
| Dec | 61,394 |

> Seasonal pattern consistent with Sales Details file: Dec spike (~EUR 61M), Jun and Sep elevated. Monthly average ~EUR 32M.

**Top Product Families by Revenue Act AC (kEUR):**
| Product Family | Revenue kEUR |
|---|---|
| JETI UVINK HIGH | 27,454 |
| JETI SERVICE | 19,926 |
| ONSET SERVICE | 14,961 |
| ANAPURNA INKS | 13,577 |
| ANAPURNA SERVICE | 10,534 |
| ONSET X3 HS 54K | 8,607 |
| WIDE FORMAT UV IN | 8,302 |
| JETLINER SERVICE | 8,187 |
| TAURO H3300 UHS | 6,522 |
| ONSET INKS | 5,970 |

> Note: EUR 192M of Revenue rows have no Product Family assigned (UNASSIGNED) — likely overhead/allocation rows, intercompany eliminations, or rows where PF dimension is not applicable.

---

### Navigation Dimensions Available

The BEx navigation panel exposes 56 drill-down dimensions including:
- `Quarter`, `Cal. year / month`, `Calendar month` (time)
- `BG Sales Group (TD)`, `BU Sales Group (TD)`, `BC Sales Group (TD)` (BU hierarchy)
- `Product Family (TD)`, `PF Level 1–5` (product hierarchy, 5 levels deep)
- `CTAS Code of the VSS`, `Functional area`, `Budgetdestination` (product/cost attributes)
- `Destination Country`, `SAP Sender`, `Sap system`, `System/Customer` (entity/geography)
- `Value type`, `RECO VTYPE Rep`, `RECO Indicator`, `RECO Val. Type MSP` (RECO reporting type)
- `Tagetik FST Account`, `P&L Level 1–5`, `Tagetik Account`, `G/L Account` (P&L hierarchy, 5 levels deep)
- `Cost Category (Y)`, `Responsibility Area` (cost management)
- `GS/HE/MAT/MI Destina Level 1–5` (entity-specific geography hierarchies — 4 entity types × 5 levels)
- `Local Currency`, `Key Figures`, `InfoProvider`

---

### Relationship to Other Files

| Aspect | RECO Analysis (this file) | AMSP Contribution (KRECO20) | Sales Details (MMIS_CMTD) |
|---|---|---|---|
| InfoProvider | KRECO20 | KRECO20 | MMIS_CMTD |
| Scope | Full P&L (Revenue → EBIT) | Revenue + AMSP cost only | Revenue only |
| BG scope | IN Digital Print & Chemicals | Same (DPS BUs only) | DPS 3 BUs only |
| Entity count | 88 senders (all entities incl. manufacturing) | 16 senders | 15 senders |
| Revenue figure | EUR 385M (kEUR; all entities incl. IC flows) | EUR 190.6M (3rd party net sales) | EUR 191.2M (turnover) |
| Customer detail | None (entity + PF grain) | Yes (1,246 customers) | None |
| Budget column | Yes (Init Budget BP1) | No | No |
| Prior year | Yes (FY 2024 actuals @ PY rates) | No | No |
| Units | **kEUR** (thousands) | EUR | EUR |
| Product Family | 151 unique (+ UNASSIGNED category) | 107 unique | 108 unique |

**Revenue gap explained (EUR 385M vs EUR 191M):**
The RECO file Revenue (EUR 385M) is much larger because:
1. It includes **all Agfa entities** across the IN business group — manufacturing entities book intercompany revenue when they sell to sales subsidiaries
2. `Elimination of sale of goods IC` (account 511408, +EUR 271M) is a credit on the **cost** side to eliminate double-counting — it does NOT reduce the Revenue line
3. The AMSP/Sales Details files show only **external 3rd-party revenue** (EUR ~191M); the difference (~EUR 194M) represents intercompany flows within the Agfa group

**Budget reference:** The Init Budget column in this file is the definitive BP1 budget figures. Budget revenue = EUR 468.8M vs actual EUR 385.1M — a shortfall of EUR 83.7M (-17.9%).

**Cross-reference to order intake:** The monthly revenue pattern matches the Sales Details file exactly (same Dec spike pattern). The budget shortfall at EBIT level (EUR -90M) is directly tied to the hardware unit shortfall visible in the OIT file.

---

### Key Business Logic & Data Notes

| Rule | Detail |
|---|---|
| **Units are kEUR** | All 6 metric columns are in thousands of EUR — multiply by 1,000 to reconcile with EUR figures in other files |
| **Navigation block rows have data** | Unlike other BEx files where nav rows are metadata-only, here the 56 nav block rows also contain real metric values — do NOT exclude them from aggregation |
| **RECO vs NON RECO** | RECO = costs/revenues directly attributable to regional BUs; NON RECO = group overhead/central costs (EUR -49M actual). NON RECO was EUR -108M in budget — EUR +59M favorable due to lower central cost allocation |
| **Restructuring impact** | Non-recurring/restructuring = EUR -6.2M actual vs EUR -0.4M budget — EUR 4.9M of restructuring provisions (account 586000) drove the overage |
| **WRONG CREATED PF** | Product Family code `#` / name "WRONG CREATED" shows EUR -84M EBIT — these are SAP postings to an invalid product family, likely offset by the UNASSIGNED category. Not a real business line. |
| **88 senders** | Includes manufacturing entities (MAT MORTSEL, MAT CHINA WUXI, MAT LUITHAGEN, MAT US, MAT JAPAN, MAT TAIWAN), finance entities (AGFA FINANCE NV, AGFA FINANCE INC.), HE (HealthCare Europe) entities, and UTOPIA entities — much broader than the 15-16 DPS-specific senders in other files |
| **Source system** | SAP BW/BEx, InfoProvider `KRECO20` — same InfoProvider as AMSP Contribution file, different query (Q_KRECO20_111 vs Q_KRECO20_112) |
| **BP1 in filename** | Budget Plan 1 = initial annual budget. The `Init Budget YTD 2025` column is the BP1 reference target. |

---

## File: DPS_BP1 - AMSP Contribution Check (Final).xls

**Path:** `C:\Users\vajra\OneDrive\Documents\Work\AGFA Analysis\AgfaAnalytics\DPS\Data\Sales & Margin\`
**Analyzed on:** 2026-03-24
**Format:** Legacy Excel .xls (SAP BEx export)
**Sheets:** 2 — `BExRepositorySheet` (metadata marker, value=7), `Table` (all data)

---

### What this file is

A **SAP BEx query export** of FY 2025 AMSP Contribution analysis at customer-product-country grain. It measures the difference between net revenue and AMSP (Average Market Selling Price) standard cost — effectively a contribution margin / gross margin check.

- **InfoProvider:** `KRECO20`
- **Query Technical Name:** `Q_KRECO20_112`
- **Query Description:** AMSP Contribution Check (Final)
- **Report Period:** Jan 2025 – Dec 2025 (YTD range to reporting period)
- **Reporting Month:** DEC 2025 (full year)
- **Data as of:** 06/02/2026 21:57:19
- **Total data rows:** 39,381 (leaf-level; 55 additional rows are BEx navigation metadata)

---

### Sheet: `Table` — Structure

**23 columns** — header at row 15, data starts row 16

#### Dimension Columns (cols 1–18)

| Col | Field | Code col | Description col | Notes |
|---|---|---|---|---|
| 2 | Navigation block | — | — | BEx metadata (55 rows, non-empty = nav row, exclude from aggregation) |
| 5 | Calendar year | — | — | 2025 (single year) |
| 6 | Calendar month | — | — | 1–12 integer |
| 7–8 | Sub Division/BUSG | Code | Name | Business Unit: LI=Industrial Inkjet / LK=Sign and Display / M0=Packaging |
| 9–10 | BC Sales Group (TD) | Code | Name | Budget Class (10 groups — see below) |
| 11–12 | Product Family (TD) | Code | Name | Product family (107 unique) |
| 13–14 | Destination Country | Code | Name | 96 destination countries |
| 15–16 | SAP Sender | Code | Name | 16 Agfa selling entities |
| 17–18 | System/Customer | Code | Name | 1,246 unique customers (customer-level detail) |

#### KPI / Metric Columns (cols 19–22)

| Col | Field | Notes |
|---|---|---|
| 19 | `TO Qty in UOM PF` | Volume in product family unit of measure |
| 20 | `TOTAL NET SALES 3rdP` | Net revenue to third-party customers (EUR) |
| 21 | `AMSP valuation` | Standard cost at AMSP rate — always negative (deduction) |
| 22 | `AMSP Contribution` | = TOTAL NET SALES 3rdP + AMSP valuation (verified: exact match) |

---

### AMSP Logic

**AMSP = Average Market Selling Price** — used as a standard cost benchmark in SAP.

The formula is confirmed by row-level verification:
```
AMSP Contribution = TOTAL NET SALES 3rdP + AMSP valuation
```
where `AMSP valuation` is always ≤ 0. This is equivalent to a **contribution margin** or **gross margin** metric: revenue minus standard product cost.

**AMSP valuation coverage:**
- 11,571 rows: NS > 0 AND AMSP valuation present (fully costed lines)
- 11,146 rows: NS > 0 but AMSP valuation = 0 (no AMSP rate defined for these items)
- 16,664 rows: NS = 0 (volume-only or zero-revenue lines)

**Items without AMSP rates (EUR net sales uncovered):**
| BC Sales Group | Net Sales without AMSP rate |
|---|---|
| Jeti | EUR 23,823,924 |
| INCA wide format | EUR 16,635,815 |
| Anapurna | EUR 13,134,301 |
| Packaging Print Engi | EUR 8,330,373 |
| Industrial | EUR 1,120,259 |
| Soft Signage | EUR 574,419 |
| General | EUR 486,322 |
| OEM Inks | EUR 138,941 |
| Other Sign & Display | EUR 3,873 |

> Rows without AMSP valuation pass through net sales directly to contribution (no cost deduction). These are likely hardware units, configured machines, or items where standard AMSP costs have not been loaded in SAP.

---

### Dimension Unique Values

**Business Units (3):**
| Code | Name |
|---|---|
| LI | Industrial Inkjet |
| LK | Sign and Display |
| M0 | Packaging |

> Note: BU code `M0` maps to "Packaging" here — in the Sales details file this BU was coded as `DP` (Digital Printing Solutions). Different InfoProvider/query uses different BU code.

**BC Sales Groups (10):**
| Code | Name |
|---|---|
| LK | General |
| LL | Jeti |
| LM | Industrial |
| LN | Anapurna |
| LR | Soft Signage |
| LS | OEM Inks |
| LW | Other Sign & Display |
| MA | INCA wide format |
| MB | Packaging Speedset |
| MC | Packaging Print Engi |

---

### KPIs & Actual Numbers (FY 2025)

**Grand Total:**
| KPI | FY 2025 |
|---|---|
| TOTAL NET SALES 3rdP | EUR 190,580,145 |
| AMSP valuation | EUR -72,546,184 |
| AMSP Contribution | EUR 118,033,961 |
| AMSP Margin % | **61.9%** |

**By Business Unit:**
| BU | Net Sales | AMSP Valuation | AMSP Contribution | Margin % |
|---|---|---|---|---|
| Sign and Display (LK) | EUR 161,313,334 | EUR -61,282,160 | EUR 100,031,174 | 62.0% |
| Industrial Inkjet (LI) | EUR 17,053,742 | EUR -7,698,322 | EUR 9,355,420 | 54.9% |
| Packaging (M0) | EUR 12,213,069 | EUR -3,565,702 | EUR 8,647,367 | 70.8% |

**By BC Sales Group:**
| BC Sales Group | Net Sales | AMSP Valuation | AMSP Contribution | Margin % |
|---|---|---|---|---|
| Jeti (LL) | EUR 83,426,593 | EUR -34,341,414 | EUR 49,085,180 | 58.8% |
| Anapurna (LN) | EUR 41,391,549 | EUR -13,774,241 | EUR 27,617,309 | 66.7% |
| INCA wide format (MA) | EUR 33,816,774 | EUR -11,904,867 | EUR 21,911,907 | 64.8% |
| OEM Inks (LS) | EUR 13,804,794 | EUR -6,421,226 | EUR 7,383,568 | 53.5% |
| Packaging Print Engi (MC) | EUR 8,658,631 | EUR -353,849 | EUR 8,304,782 | 95.9% |
| Packaging Speedset (MB) | EUR 3,554,438 | EUR -3,211,853 | EUR 342,585 | 9.6% |
| Industrial (LM) | EUR 3,248,948 | EUR -1,277,096 | EUR 1,971,852 | 60.7% |
| Soft Signage (LR) | EUR 1,553,329 | EUR -563,545 | EUR 989,784 | 63.7% |
| Other Sign & Display (LW) | EUR 914,832 | EUR -698,093 | EUR 216,739 | 23.7% |
| General (LK) | EUR 210,256 | EUR 0 | EUR 210,256 | 100.0% |

**Monthly Net Sales & AMSP Contribution (EUR):**
| Month | Net Sales | AMSP Valuation | AMSP Contribution |
|---|---|---|---|
| Jan | 11,843,268 | -4,082,378 | 7,760,890 |
| Feb | 11,657,016 | -3,365,526 | 8,291,491 |
| Mar | 12,540,274 | -4,062,593 | 8,477,680 |
| Apr | 12,400,637 | -4,532,512 | 7,868,125 |
| May | 12,983,234 | -3,577,955 | 9,405,279 |
| Jun | 20,940,686 | -8,448,211 | 12,492,475 |
| Jul | 16,132,915 | -6,482,034 | 9,650,881 |
| Aug | 12,109,306 | -4,201,095 | 7,908,212 |
| Sep | 17,391,598 | -5,407,507 | 11,984,091 |
| Oct | 15,846,430 | -5,915,505 | 9,930,925 |
| Nov | 16,100,790 | -6,039,330 | 10,061,460 |
| Dec | 30,633,991 | -16,431,538 | 14,202,453 |

> Dec 2025 has the highest AMSP cost deduction (EUR -16.4M) consistent with highest revenue month; AMSP margin in Dec (46.4%) is notably lower than full-year average (61.9%) — suggesting Dec revenue mix skews toward lower-margin products (hardware/equipment).

---

### Relationship to Other Files

#### Comparison with Sales Details File (DPS_BP1 - Sales details in all currencies.xls)

| Dimension | Sales Details File | AMSP Contribution File |
|---|---|---|
| InfoProvider | MMIS_CMTD | KRECO20 |
| Revenue metric | Turnover EURO (gross sales) | TOTAL NET SALES 3rdP (net sales) |
| Currency views | EUR + LC + TC (3 columns) | EUR only |
| Additional KPI | Qty (UOM Article) | AMSP valuation + AMSP Contribution |
| Customer detail | No (anonymous at material+country) | **Yes** — 1,246 named customers |
| BU for Packaging | `DP` (Digital Printing Sol) | `M0` (Packaging) — same entity, different code |
| Granularity | Material + Country + Sender + Currency | Customer + Product Family + Country + Sender + Month |
| Period coverage | JAN–DEC 2025 + YTD column | JAN–DEC 2025 monthly |
| Data freshness | 13/03/2026 | 06/02/2026 (slightly older) |

**Net Sales vs Turnover discrepancy:** Sales details file shows FY 2025 total EUR ~191.2M (Sign+Display EUR 161M + LI EUR 18M + DP EUR 12.2M). AMSP file shows TOTAL NET SALES 3rdP EUR 190.6M. The ~EUR 0.6M gap reflects:
- "NET SALES 3rdP" excludes intercompany/intragroup transactions included in Turnover
- Slightly different data snapshot dates (6 weeks apart)

#### What this file adds vs Sales Details

- **Margin analysis**: Sales details has no cost data; this file adds AMSP standard cost, enabling margin % by product/customer
- **Customer visibility**: Named customer column (1,246 customers) not present in sales details
- **Profitability by customer segment**: Can rank customers by AMSP Contribution
- **Items without AMSP rates**: Identifies ~EUR 64M of revenue where standard cost is undefined (mainly hardware)

#### How to cross-reference

| Join key | Sales Details file | AMSP Contribution file |
|---|---|---|
| Product Family | `Product Family (MT)` cols 9–10 | `Product Family (TD)` cols 11–12 |
| Country | `Country (Dest)` cols 18–19 | `Destination Country` cols 13–14 |
| Sender | `Sender` cols 16–17 | `SAP Sender` cols 15–16 |
| BU | `Business Unit (PF)` cols 20–21 | `Sub Division/BUSG` cols 7–8 |
| Budget Class | `Budget Class (PF)` cols 22–23 | `BC Sales Group (TD)` cols 9–10 |
| Period | Monthly cols (JAN–DEC) | `Calendar year` col 5 + `Calendar month` col 6 |

---

### Key Business Logic & Data Notes

| Rule | Detail |
|---|---|
| **AMSP formula** | AMSP Contribution = TOTAL NET SALES 3rdP + AMSP valuation (confirmed row-level exact match) |
| **AMSP valuation sign** | Always ≤ 0 — it is a cost deduction. Larger absolute value = higher standard cost. |
| **No AMSP rate** | ~28% of revenue rows (EUR ~64M net sales) have AMSP valuation = 0. These contribute 100% margin artificially. True blended margin for costed items is lower. |
| **Navigation block rows** | 55 rows at top have non-empty col 2 — BEx metadata, must exclude from aggregation. |
| **Customer grain** | Unlike Sales details file, this has customer-level visibility. Useful for customer profitability ranking. |
| **BU code difference** | Packaging BU = `M0` here vs `DP` in Sales Details file — same business unit, different SAP coding across InfoProviders. |
| **Packaging Print Engi high margin** | 95.9% AMSP margin — AMSP rate is near-zero for this category (EUR -354K on EUR 8.7M), suggesting these are engineered/custom solutions where standard AMSP pricing is not well defined. |
| **Packaging Speedset low margin** | 9.6% AMSP margin — EUR -3.2M AMSP cost on EUR 3.6M revenue. High standard cost relative to net sales; may indicate pricing pressure or cost overruns in this category. |
| **Source system** | SAP BW/BEx, InfoProvider `KRECO20` (different from `MMIS_CMTD` used in Sales details). KRECO20 is the revenue/contribution reporting InfoProvider. |

---

## File: DPS_BP1 - Sales details in all currencies.xls

**Path:** `C:\Users\vajra\OneDrive\Documents\Work\AGFA Analysis\AgfaAnalytics\DPS\Data\Sales & Margin\`
**Analyzed on:** 2026-03-24
**Format:** Legacy Excel .xls (SAP BEx export)
**Sheets:** 2 — `BExRepositorySheet` (metadata marker, value=7), `Table` (all data)

---

### What this file is

A **SAP BEx query export** of full-year 2025 sales (turnover + quantity) at the most granular product-country-currency level. It covers **all three DPS business units** across **96 countries**.

- **InfoProvider:** `MMIS_CMTD`
- **Query Technical Name:** `Q_MMIS_CMTD_TO_ANALYSIS_D_CURR`
- **Query Description:** Turnover Analysis DRAFT (Current)
- **Report Period:** Jan 2025 – Dec 2025 (YTD to reporting period)
- **Reporting Month:** 12.2025 (full year)
- **Data as of:** 13/03/2026 14:27:57
- **Total data rows:** 5,815 (leaf-level transactions; 36 additional rows are BEx navigation metadata)

---

### Sheet: `Table` — Structure

**76 columns** split across dimensions (cols 1–24) and metrics (cols 25–76)

#### Dimension Columns (cols 1–24)

| Col | Field | Code col | Description col | Notes |
|---|---|---|---|---|
| 3 | Navigation block | — | — | BEx report dimension label (empty on data rows) |
| 5–6 | Material | Code | Name | SAP material number + description (923 unique codes) |
| 7–8 | VSS-code (MT) | Code | Name | VSS product code + name (318 unique) |
| 9–10 | Product Family (MT) | Code | Name | Product family code + name (108 unique) |
| 11 | UOM Article | — | — | Unit of measure: L / KG / M2 / PCS |
| 12–13 | Currency | Code | Name | Reporting currency (10: EUR, USD, GBP, BRL, CAD, ARS, MXN, CLP, COP, PEN) |
| 14–15 | Transaction Currency | Code | Name | Original transaction currency (17 currencies) |
| 16–17 | Sender | Code | Name | Selling entity (15 Agfa entities) |
| 18–19 | Country (Dest) | Code | Name | Destination country (96 countries) |
| 20–21 | Business Unit (PF) | Code | Name | BU: DP=Digital Printing Sol / LI=Industrial Inkjet / LK=Sign and Display |
| 22–23 | Budget Class (PF) | Code | Name | Product category (10 classes) |

#### Metric Columns (cols 25–76) — 3 currency views × 13 periods + Qty

| Col range | Metric group | Periods |
|---|---|---|
| 25–37 | **Turnover EURO** | Actuals JAN–DEC 2025 + YTD |
| 38–50 | **Turnover LC** (Local Currency) | Actuals JAN–DEC 2025 + YTD |
| 51–63 | **Turnover TC** (Transaction Currency) | Actuals JAN–DEC 2025 + YTD |
| 64–76 | **Qty (UOM ART)** | Actuals JAN–DEC 2025 + YTD |

> For EUR-priced transactions, all three currency columns (EURO / LC / TC) are identical. Differences appear for non-EUR currencies.

---

### Dimension Unique Values

**Business Units (3):**
- `DP` — Digital Printing Sol
- `LI` — Industrial Inkjet
- `LK` — Sign and Display

**Budget Classes (10):**
Anapurna, DPL LeatherJet, INCA wide format, Industrial, Jeti, OEM Inks, Other Sign & Display, Packaging Print Engi, Packaging Speedset, Soft Signage

**Senders (15 Agfa entities):**
AGFA NV, AGFA INC., AGFA IJC LTD, AGFA GRAPHICS MIDDLE, INCA DIG PRINT LTD, LASTRA ATTREZZATURE, MAT MORTSEL NV, HE BRASIL SO, HE ARGENTINA SO, HE MEXICO SO, HE RUSSIA SO, GS USA CORP SO, GS CHILE SO, GS COLOMBIA SO, GS PERU SO

**Countries:** 96 destination countries across all global regions

---

### BU × Budget Class Row Distribution

| Business Unit | Budget Class | Rows |
|---|---|---|
| Sign and Display | Anapurna | 2,394 |
| Sign and Display | Jeti | 2,185 |
| Sign and Display | INCA wide format | 234 |
| Sign and Display | Soft Signage | 154 |
| Sign and Display | Other Sign & Display | 126 |
| Industrial Inkjet | OEM Inks | 653 |
| Industrial Inkjet | Industrial | 83 |
| Digital Printing Sol | Packaging Speedset | 16 |
| Digital Printing Sol | Packaging Print Engi | 4 |
| Digital Printing Sol | DPL LeatherJet | 1 |

---

### KPIs & Actual Numbers (FY 2025)

**Turnover EUR by Business Unit:**
| Business Unit | FY 2025 EUR |
|---|---|
| Sign and Display | EUR 161,081,344 |
| Industrial Inkjet | EUR 17,897,760 |
| Digital Printing Sol | EUR 12,216,069 |

**Turnover EUR by Budget Class:**
| Budget Class | FY 2025 EUR |
|---|---|
| Jeti | EUR 83,466,957 |
| Anapurna | EUR 41,328,773 |
| INCA wide format | EUR 33,816,774 |
| OEM Inks | EUR 14,540,062 |
| Packaging Print Engi | EUR 8,658,631 |
| Packaging Speedset | EUR 3,554,438 |
| Industrial | EUR 3,357,698 |
| Soft Signage | EUR 1,553,329 |
| Other Sign & Display | EUR 915,510 |
| DPL LeatherJet | EUR 3,000 |

**Monthly Turnover EUR 2025:**
| Month | EUR |
|---|---|
| Jan | 26,494,904 |
| Feb | 23,248,256 |
| Mar | 25,065,566 |
| Apr | 24,735,999 |
| May | 25,902,569 |
| Jun | 41,790,127 |
| Jul | 32,201,145 |
| Aug | 24,160,403 |
| Sep | 34,709,379 |
| Oct | 31,455,806 |
| Nov | 32,286,601 |
| Dec | 60,958,468 |

> Notable: Dec 2025 is the highest month (~EUR 61M) — typical year-end revenue push. Jun and Sep also spike above monthly average (~EUR 32M).

---

### Relationship to Order Intake File

#### How the two files connect

```
Order Intake File (DPS_Customer order & revenue follow-up 2026.xlsx)
        │
        │  When Invoiced = "Yes"  →  Revenue Recognition event occurs
        │  Rev. Rec. Month (MM_YYYY) = the month turnover is booked in SAP
        │
        ▼
Sales Details File (DPS_BP1 - Sales details in all currencies.xls)
        │
        │  Each invoiced machine/order creates one or more rows here
        │  at material + country + currency grain
```

The **Revenue Recognition (RR)** event in the order intake file is the trigger that creates an entry in the sales details file. When a machine is installed and invoiced (`Invoiced = Yes`), SAP books the revenue — and that booking flows into this BEx report.

#### Dimension Mapping

| Order Intake File | Sales Details File | Match Type |
|---|---|---|
| `Family` (derived col AF) | `Budget Class (PF)` | **Direct mapping** — same grouping logic |
| `Equipment family` (col 5) | `Product Family (MT)` name | Partial — OIT is coarser |
| `Region` (col 2) | `Dest. Resp. Region` (nav dim) | Equivalent geography |
| `Sales Org` (col 1) | `Country (Dest)` + `Sender` | Sales Org maps to a country + sender entity |
| `Order date` / `Rev. Rec. Month` | Monthly columns (JAN–DEC) | RR Month = the month column in sales file |
| `Year Classifier (OIT)` | Report period (Jan–Dec YYYY) | OIT year ≠ Invoice year — use Invoice Year/Month |

#### Family → Budget Class mapping (confirmed)

| OIT Family group | Sales Budget Class | Notes |
|---|---|---|
| Jeti | Jeti | Jeti Tauro / Bronco / Condor / Mira + EFI variants + Acorta + inks |
| Anapurna | Anapurna | Anapurna H-series / Accuriowide + inks + options + service |
| Onset | INCA wide format | Onset machines are under INCA wide format budget class |
| Soft Signage / Avinci | Soft Signage | Avinci CX3200 + textile inks |
| Speedset | Packaging Speedset | Speedset equipment + inks |
| Interiojet | Jeti | Interiojet models (WB family) grouped under Jeti in sales |
| Oberon | Jeti | Oberon RTR printers grouped under Jeti in sales |

#### What is in Sales file but NOT in Order Intake file

The order intake file tracks **hardware units only**. The sales file includes the full revenue picture:
- **Inks & consumables** (ANAPURNA INKS, Jeti inks, Avinci textile inks, OEM Inks)
- **Options & accessories** (ANAPURNA OPTIONS, EFI TAURO OPTIONS, Acorta tools)
- **Service & maintenance** (ANAPURNA SERVICE, INCA WF Inv Contract, Inv Repairs)
- **Used/refurbished equipment** (ANAPURNA USED EQM, ACORTA USED EQT)
- **Industrial Inkjet** (OEM Inks for industrial customers — not in OIT file at all)
- **Digital Printing Sol / Packaging** (Speedset, Packaging Print Engi — not in OIT file)

#### What is in Order Intake but NOT directly in Sales file

- **Pending/pipeline orders** (Invoiced = potential / announced / delayed) — these are pre-revenue, not yet in SAP
- **Unit count** — the sales file has Qty but only for consumables (litres, kg, m²). Machine units are not separately flagged.
- **Customer-level detail** (Customer name, Order Nbr., Serial nr) — sales file is anonymous at material+country grain

#### Monthly Revenue vs Unit Count Cross-reference

2025 monthly data available in both files. The OIT file's `SSOT RR 2025 till Sep` sheet provides unit counts per month; the sales file provides EUR revenue per month. Together they enable **Average Selling Price (ASP)** analysis per family per month:

| Family | FY 2025 Sales EUR (from sales file) | FY 2025 RR units (from OIT file) |
|---|---|---|
| Jeti | EUR 83,466,957 | from SSOT RR 2025 |
| Anapurna | EUR 41,328,773 | from SSOT RR 2025 |

> ASP = Turnover EUR (Budget Class) ÷ Count of invoiced units (RR sheet, same family, same period). Note: Sales EUR includes inks + service + options on top of hardware — pure hardware ASP requires filtering to equipment-only Product Families in the sales file.

---

### Key Business Logic & Data Notes

| Rule | Detail |
|---|---|
| **Multi-currency design** | Same transaction appears once. Turnover EURO = converted to EUR; LC = local subsidiary currency; TC = original transaction currency. When currency=EUR, all three are identical. |
| **Navigation block rows** | 36 rows at the top have non-empty "Navigation block" column — BEx report metadata showing available drill-down dimensions, NOT data. Always exclude when aggregating. |
| **Granularity** | Each row = unique combination of Material + Country + Sender + Currency + BU + Budget Class. This is the **leaf level** — no pre-aggregation. |
| **DPS scope** | Covers all 3 BUs: Sign & Display (largest, ~79% of turnover), Industrial Inkjet (~5%), Digital Printing Solutions (~3%). |
| **BP1 in filename** | BP1 = Budget Plan 1 (first annual budget version). Despite the name, this file contains **Actuals** for FY 2025. |
| **Source system** | SAP BW/BEx, InfoProvider `MMIS_CMTD` (Materials Management Information System, Current Month To Date) |

---

---

## Key Analytical Findings — Sales & Margin Files (FY 2025)

The following findings are derived strictly from the four analyzed files. No external assumptions are made.

### Finding 1: Revenue missed budget by EUR 83.7M (-17.9%)

Source: RECO Analysis (Q_KRECO20_111). Actual Revenue = EUR 385.1M vs Init Budget = EUR 468.8M. This is the single largest driver of all downstream P&L variances. Every subsequent P&L line cascades from this miss.

### Finding 2: Gross Margin % declined 5.1pp vs budget

Actual Gross Margin % = 77.6% vs Budget 82.7%. In absolute terms: EUR 298.8M actual vs EUR 387.7M budget — a shortfall of EUR 88.9M. The margin % gap means revenue mix or cost structure also deteriorated beyond the volume shortfall alone.

### Finding 3: SG&A was EUR 9.0M favorable vs budget

SG&A actual = EUR -85.0M vs budget EUR -94.0M. This is the only meaningful favorable variance in the P&L — cost control partially offset the revenue miss. Without this, EBIT shortfall would have been EUR 99M instead of EUR 90M.

### Finding 4: Non-recurring costs were EUR 5.8M worse than budget

Non-recurring/restructuring actual = EUR -6.2M vs budget EUR -0.4M. The overrun is driven by account 586000 (Additions and reversals of provisions for restructuring) = EUR -4.9M, which had no budget allocation. This was unplanned at time of BP1.

### Finding 5: EBIT shortfall of EUR 90.1M vs budget

EBIT actual = EUR 205.1M vs Budget EUR 295.2M (EUR -90.1M, -30.5%). Prior year EBIT = EUR 219.6M — so FY 2025 was also EUR 14.5M below prior year. EBIT margin 53.3% actual vs 63.0% budget vs 55.6% prior year.

### Finding 6: Revenue is concentrated in three months

Monthly revenue from RECO file (kEUR): Dec = 61,394, Jun = 41,986, Sep = 34,787. These three months together = EUR 138.2M = 35.9% of full-year EUR 385.1M revenue. Jan and Feb are the weakest months (EUR 26.6M and EUR 23.4M respectively).

### Finding 7: Sign and Display dominates at 84.4% of total net sales

From MMIS_CMTD Sales Details file: Sign and Display (LK) = EUR 161.1M of EUR 191.2M total DPS turnover (84.4%). Industrial Inkjet = EUR 17.9M (9.4%). Digital Printing Sol = EUR 12.2M (6.4%).

### Finding 8: EUR 64M of net sales has no AMSP standard cost rate

From AMSP Contribution file: 11,146 rows with Net Sales > 0 have AMSP valuation = 0. Total net sales without AMSP coverage = EUR 63.2M (33.2% of EUR 190.6M total). Breakdown by Budget Class: Jeti EUR 23.8M, INCA wide format EUR 16.6M, Anapurna EUR 13.1M, Packaging Print Engi EUR 8.3M. These items are reported at 100% AMSP margin artificially, inflating the blended 61.9% figure.

### Finding 9: AMSP margin varies from 9.6% to 95.9% by Budget Class

Packaging Speedset (MB): 9.6% — EUR -3.2M AMSP cost on EUR 3.6M net sales. Packaging Print Engi (MC): 95.9% — EUR -354K AMSP cost on EUR 8.7M net sales. OEM Inks: 53.5%. Jeti: 58.8%. Anapurna: 66.7%. INCA wide format: 64.8%.

### Finding 10: December AMSP margin (46.4%) is 15.5pp below the full-year average

From AMSP Contribution monthly data: Dec AMSP Contribution = EUR 14.2M on Net Sales EUR 30.6M = 46.4% margin, vs full-year 61.9%. The higher Dec revenue volume (EUR 30.6M vs monthly average EUR 15.9M) comes with a disproportionately higher AMSP cost (EUR -16.4M vs monthly average EUR -6.0M), indicating Dec revenue mix skews toward lower-margin product categories.

### Finding 11: Packaging gross margin is 7.4% at transfer price

From Detailed Sales Inquiry (CO-PA, AGFA NV): M0 Packaging Net Turnover = EUR 3.7M, COGS at Transfer Price = EUR 3.5M, Gross Margin = EUR 277K (7.4%). This is consistent with the AMSP file showing Packaging Speedset at 9.6% AMSP margin — the lowest of all Budget Classes.

### Finding 12: Top 5 customers in AGFA NV are all AGFA subsidiaries

From Detailed Sales Inquiry: Agfa Corp (EUR 15.1M), EFI INC (EUR 8.9M), AGFA CORP. (EUR 6.8M), AGFA INC (EUR 5.1M), AGFA CORPORATION (EUR 5.0M). Combined = EUR 40.9M = 25.6% of AGFA NV Net Turnover (EUR 159.6M). This confirms that AGFA NV primarily invoices its own regional subsidiaries (intercompany supply chain), not end customers directly.

### Finding 13: FY 2025 net turnover grew +3.4% vs FY 2024

From Detailed Sales Inquiry (CO-PA): YTD Act CY (FY 2025) = EUR 159.6M vs YTD Act PY (FY 2024) = EUR 154.4M. Net growth = +EUR 5.2M (+3.4%). This is for AGFA NV scope only.

### Finding 14: Overall Result (net profit) was EUR 78.0M vs budget EUR 93.4M

From RECO Analysis: Overall Result actual = EUR 78.0M vs budget EUR 93.4M (EUR -15.3M, -16.4%). Non Regional Contribution actual = EUR -49.1M vs budget EUR -108.5M — EUR 59.4M favorable, significantly reducing the EBIT miss at the overall P&L level.

---

## Data Gaps & Questions

### Gap 1: Budget data loaded in only one of four files

BP1 Init Budget is present only in the RECO Analysis file (Q_KRECO20_111). The other three files (Sales Details, AMSP Contribution, Detailed Sales Inquiry) have no budget columns or all-zero budget columns. Any budget vs actual comparison must be done via the RECO file. BP2 budget (referenced in the Sales Inquiry filename) was not loaded in that extract.

### Gap 2: EUR 64M net sales without AMSP standard cost

29 Budget Class/product combinations have zero AMSP valuation for rows where Net Sales > 0. This affects primarily hardware items (Jeti, INCA, Anapurna equipment) where AMSP rates may not be defined in SAP. The reported overall AMSP margin of 61.9% is overstated for the uncovered EUR 64M — true margin including these items at a plausible cost would be lower.

### Gap 3: No customer detail in RECO Analysis or Sales Details

The RECO Analysis (52,091 rows) has no customer column — data is at entity + product family + month grain. The Sales Details file (5,815 rows) also has no customer. Customer-level data is available only in the AMSP Contribution file (1,246 customers) and Detailed Sales Inquiry (1,756 ship-to customers). Neither of these has a full P&L per customer.

### Gap 4: Revenue figures are not directly comparable across files

| File | Revenue Figure | Basis |
|---|---|---|
| RECO Analysis | EUR 385.1M | All entities incl. intercompany manufacturing flows |
| Sales Details (MMIS_CMTD) | EUR 191.2M | External + intercompany turnover at material level |
| AMSP Contribution (KRECO20) | EUR 190.6M | 3rd-party net sales only |
| Detailed Sales Inquiry (CO-PA) | EUR 159.6M | AGFA NV company code only |

These four numbers measure different things. No single file gives the consolidated DPS external revenue figure in isolation.

### Gap 5: RECO intercompany elimination is a cost credit, not a revenue reduction

Account 511408 (Elimination of sale of goods IC) = EUR +270.6M — this appears as a positive on the cost side, not as a revenue deduction. The Revenue line (509999) still shows EUR 385.1M including intercompany flows. Understanding the net external revenue requires subtracting the intercompany revenue recorded by manufacturing entities (MAT MORTSEL, MAT CHINA WUXI, etc.).

### Gap 6: Data freshness is inconsistent across files

| File | Status of Data |
|---|---|
| AMSP Contribution | 06/02/2026 21:57:19 |
| RECO Analysis | 06/02/2026 21:57:19 |
| Sales Details | 13/03/2026 14:27:57 |
| Detailed Sales Inquiry | Shows 25/02/2009 (legacy metadata artifact — not actual data date) |

The Sales Details file is 5 weeks fresher than the AMSP/RECO files. Small revenue discrepancies between files (~EUR 0.6M) are partly explained by this.

### Gap 7: Recurring vs non-recurring revenue is not split in any file

All files mix equipment (one-time) with consumables, service, and maintenance (recurring) within the same Budget Class / Product Family columns. There is no flag or field distinguishing revenue quality (recurring vs one-time). This is a critical gap for assessing revenue sustainability.

### Gap 8: No forward-looking data in any Sales & Margin file

All four files contain FY 2025 actuals (and in RECO, budget). There is no pipeline, forecast, or backlog data. Forward-looking analysis requires the Order Intake file.

### Gap 9: MTD columns in Detailed Sales Inquiry represent December only

MTD Act CY (cols 31–47) and MTD Act PY (cols 48–64) in the Sales Inquiry file reflect Month-to-Date as of the key date 31/12/2025 — meaning they show December 2025 and December 2024 respectively, not a configurable month. The file is a point-in-time extract, not a dynamic report.

### Gap 10: No order-level link between Sales & Margin files and Order Intake file

The Sales & Margin files have no SAP order number or CRM ID. The join between the Order Intake file and these files must be approximated via Revenue Recognition Month + Equipment Family/Budget Class. This is an approximate match, not an exact reconciliation key.

---

## Relevance to Analytics Goals

| Analytics Goal | Files Available | Coverage | Key Limitation |
|---|---|---|---|
| **Revenue vs Budget** | RECO Analysis | High — full P&L with BP1 budget for every account line | BP2 budget not loaded in any file |
| **Margin analysis (AMSP)** | AMSP Contribution | High — AMSP margin by customer, BC, PF, country, month | EUR 64M of revenue has no AMSP rate |
| **Margin analysis (transfer price)** | Detailed Sales Inquiry | Medium — COGS TP and Gross Margin for AGFA NV | AGFA NV only; other entities not included |
| **Full P&L (Revenue → EBIT)** | RECO Analysis | High — all 47 P&L line accounts, monthly, 88 entities | No customer or order dimension |
| **Revenue trend (monthly)** | All 4 files | High — Jan–Dec 2025 monthly available in all files | Files disagree on total due to IC scope differences |
| **Prior year comparison** | RECO Analysis (FY 2024 @ 4 FX rates), Detailed Sales Inquiry (FY 2024 YTD) | Partial — RECO has full P&L PY; Sales Inquiry has Net Turnover PY only | FY 2024 not available in AMSP or Sales Details |
| **Customer profitability** | AMSP Contribution (1,246 customers), Sales Inquiry (1,756 ship-to) | Partial — AMSP margin per customer; transfer-price margin per ship-to | No EBIT per customer in any file |
| **Product mix analysis** | All 4 files | High — Budget Class and Product Family in all files | No hardware vs consumable vs service split flag |
| **Geographic analysis** | AMSP (96 countries), Sales Details (96 countries), Sales Inquiry (ship-to + install-at) | Medium — country dimension available | Regional hierarchy available only via BEx navigation, not in data columns |
| **Budget Class performance** | AMSP (10 BCs), Sales Details (10 BCs), Sales Inquiry (12 BCs) | High | BC definitions differ slightly across files (e.g., Packaging BU code M0 vs DP) |
| **FX impact analysis** | RECO Analysis (4 rate views: AC/PY/BT/FC) | High — 4 FX rate columns enable currency bridge | Only available at kEUR aggregation level; transaction-level FX in Sales Details |
| **Forecasting / pipeline** | None | None — all files are actuals/budget | Forward pipeline is only in the Order Intake file |
| **Cancellation analysis** | None | None | Not tracked in any Sales & Margin file |

---

## Recommended Next Analyses

The following are specific analyses that are directly actionable with the data available.

### 1. Revenue bridge: volume vs price vs mix decomposition

Goal: Explain the EUR 83.7M revenue budget miss (RECO file).
Method: Cross-reference OIT RR unit counts (Order Intake file, SSOT RR 2025) with Sales Details EUR by Budget Class and month. Compute: (a) budget units × budget ASP = budget revenue; (b) actual units × actual ASP = actual revenue; (c) delta = volume effect + price effect + mix effect.
Files needed: RECO Analysis (budget) + Sales Details (actual EUR) + Order Intake (RR unit counts).

### 2. True AMSP margin including uncovered EUR 64M

Goal: Correct the 61.9% blended AMSP margin for items without AMSP rates.
Method: Identify the 29 Budget Class + Product Family combinations where AMSP valuation = 0 but Net Sales > 0. Apply a proxy AMSP rate (e.g., from similar products) or flag them as "AMSP rate not defined."
File needed: AMSP Contribution file.

### 3. Customer profitability ranking

Goal: Rank the 1,246 customers by AMSP Contribution.
Method: Aggregate AMSP Contribution by System/Customer (cols 17–18) from the AMSP Contribution file.
File needed: AMSP Contribution file.

### 4. Seasonality risk quantification

Goal: Quantify how much revenue is at risk if Dec/Jun/Sep deliveries slip by one month.
Method: From RECO monthly data — Dec = EUR 61.4M, Jun = EUR 42.0M, Sep = EUR 34.8M. Model scenarios where each of these months delivers 10%, 20%, 30% less.
File needed: RECO Analysis (monthly revenue actuals).

### 5. Packaging viability assessment

Goal: Determine whether M0 Packaging is genuinely low-margin or is an artifact of transfer pricing.
Method: Compare transfer-price COGS basis (7.4% GM in Sales Inquiry) vs AMSP basis (Speedset 9.6%, Print Engi 95.9% in AMSP file). The divergence between these two margin views needs explanation.
Files needed: AMSP Contribution + Detailed Sales Inquiry.

### 6. Hardware ASP by family

Goal: Compute average selling price per unit per equipment family for FY 2025.
Method: Take Budget Class Turnover EUR from Sales Details (filtered to equipment-only Product Families — exclude service/ink/option PFs) ÷ RR unit count from Order Intake SSOT sheet for the same family and period.
Files needed: Sales Details + Order Intake (SSOT RR 2025).

### 7. FX impact on revenue

Goal: Quantify how much of the revenue vs prior year change is FX-driven vs operational.
Method: RECO Analysis has Act YTD 2025 @ AC rate vs Act YTD 2025 @ PY rate. Difference = FX translation impact. Current year at PY rates = EUR 385.1M @ AC vs revenue @ PY rate available in col 14.
File needed: RECO Analysis.
