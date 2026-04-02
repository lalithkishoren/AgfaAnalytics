# Power BI PBIX Extraction Summary
**Generated:** March 2026
**Scope:** Digital Radiology — Dashboards1, Dashboards2, Dashboards3
**Script:** `Dashboards2/extract_pbix_tables.py`

---

## Overview

| PBIX File | Folder | Tables Extracted | Total Rows | DirectQuery Tables | Skipped (System) |
|---|---|---|---|---|---|
| Commercial Analytics - OIT Margin & Product Mix 2026 | Dashboards1 | 14 | 338,624 | — | 11 |
| Partner Dashboard | Dashboards2 | 9 | 1,088,511 | — | 3 |
| Commercial Analytics - Weekly FC Tracker | Dashboards2 | 2 | 34,919 | — | 2 |
| Price Margin Modalities | Dashboards2 | 0 | — | **2 (entire file)** | — |
| Commercial Analytics - Funnel Evolution Tracker | Dashboards3 | 1 | 499,796 | — | — |
| Commercial Analytics - OI & Funnel Health Cockpit | Dashboards3 | 3 | 26,466 | — | 2 |
| **TOTAL** | | **29 tables** | **~1,988,316 rows** | **2 tables** | **18** |

---

## DirectQuery Tables (No Data Cached in PBIX)

These tables have no data stored inside the PBIX file. They query a live data source at report runtime and cannot be extracted statically.

| PBIX File | Table Name | Columns |
|---|---|---|
| Price Margin Modalities | **Q price realisation extra** | posting date, year-month, Year, destination, subregion, region, sales org, sales org name, pf, pf name, material, material name, base unit, sales document nr, sales doc deliv date, sales doc date, opportunity, opportunity name, bill-to party, bill-to party name, ship-to party, ship-to party name, functional area, functional area group, sales quantity, net turnover eur, modality, order, regional list price, discount, sofon cost+, gross margin, enp, quantity, lsp, sales budget, margin budget, qty budget |
| Price Margin Modalities | **Q last refreshed** | Last Refreshed |

> **Impact:** Price Margin Modalities contains no importable data. All analysis for this report must be done by connecting directly to the source system (likely SAP BW or a shared dataset in Power BI Service).

---

## Dashboards1

### Commercial Analytics - OIT Margin & Product Mix 2026
**Output folder:** `Dashboards1/Commercial Analytics - OIT Margin & Product Mix 2026 extracted_tables/`

| File | Rows | Cols | Format | Skipped Columns |
|---|---|---|---|---|
| msd data.csv | 28,902 | 55 | CSV | `Topic` (name column) |
| opportunity.csv | 46,523 | 46 | CSV | `name`, `accountidname` |
| opportunityproduct.csv | 135,177 | 12 | CSV | `productname` |
| account.csv | 76,481 | 3 | CSV | `cr57c_name`, `cr57c_address2_city`, `cr57c_address1_postalcode` |
| raw data.csv | 22,144 | 44 | CSV | `Art Descrip` |
| Topic map.csv | 28,902 | 11 | CSV | `Topic` |
| mapping.csv | 271 | 6 | CSV | `Column7` (empty/DirectQuery column) |
| Quarter Slicer.csv | 71 | 4 | CSV | — |
| Region/ Cluster Slicer.csv | 38 | 4 | CSV | — |
| MSD Quarter.csv | 72 | 3 | CSV | — |
| New Cluster/ Region Table.csv | 41 | 4 | CSV | — |
| msd data sub-region.csv | 39 | 4 | CSV | — |
| raw data sub-region.csv | 33 | 4 | CSV | — |
| Budget Quarter.csv | 4 | 3 | CSV | — |

**System tables skipped (11):** DateTableTemplate + 10 × LocalDateTable (Power BI internal auto-date tables)

---

## Dashboards2

### Partner Dashboard
**Output folder:** `Dashboards2/Partner Dashboard extracted_tables/`

| File | Rows | Cols | Format | Skipped Columns |
|---|---|---|---|---|
| FeedFile.csv | 1,082,674 | 44 | CSV* | `Bill-to Party Name`, `Ship-to Party Name`, `Channel Manager Name`, `Customer ID and Name` |
| DealerList_TargetSetting xl.csv | 3,928 | 12 | CSV | `Dealer Name` |
| DealerList xl.csv | 754 | 10 | CSV | `Dealer Name` |
| Region partner dashboard xl.csv | 278 | 8 | CSV | `Column9` (no dictionary reference) |
| AP2 customers.csv | 603 | 5 | CSV | `Bill-to Party Name` |
| ProductFamilyList xl.csv | 94 | 11 | CSV | — |
| Implementation_HourlyRate xl.csv | 152 | 5 | CSV | — |
| BudgetClassGroup xl.csv | 16 | 2 | CSV | — |
| MonthQuarter xl.csv | 12 | 4 | CSV | — |

> \* FeedFile has 1,082,674 rows and was extracted before the 500K → Excel rule was added. Re-run the script on Partner Dashboard.pbix to generate FeedFile.xlsx if needed.

**System tables skipped (3):** DateTableTemplate + 2 × LocalDateTable

---

### Commercial Analytics - Weekly FC Tracker
**Output folder:** `Dashboards2/Commercial Analytics - Weekly FC Tracker extracted_tables/`

| File | Rows | Cols | Format | Skipped Columns |
|---|---|---|---|---|
| DataWeek.csv | 34,918 | 51 | CSV | `Sold-to party Name`, `Syracuse/SalesOne Opportunity Name` |
| T last refreshed.csv | 1 | 2 | CSV | — |

**System tables skipped (2):** DateTableTemplate + LocalDateTable

---

### Price Margin Modalities
**Output folder:** `Dashboards2/Price Margin Modalities extracted_tables/` *(empty — all DirectQuery)*

No data extracted. See **DirectQuery Tables** section above.

---

## Dashboards3

### Commercial Analytics - Funnel Evolution Tracker
**Output folder:** `Dashboards3/Commercial Analytics - Funnel Evolution Tracker extracted_tables/`

| File | Rows | Cols | Format | Skipped Columns |
|---|---|---|---|---|
| T funnel evolution tracker.csv | 499,796 | 60 | CSV | `Sold-to party Name`, `Syracuse/SalesOne Opportunity Name` |

> 499,796 rows — just under the 500K threshold, saved as CSV.

---

### Commercial Analytics - OI & Funnel Health Cockpit
**Output folder:** `Dashboards3/Commercial Analytics - OI & Funnel Health Cockpit extracted_tables/`

| File | Rows | Cols | Format | Skipped Columns |
|---|---|---|---|---|
| T funnel health.csv | 26,464 | 31 | CSV | — |
| Others.csv | 1 | 3 | CSV | — |
| last refresh.csv | 1 | 3 | CSV | — |

**System tables skipped (2):** DateTableTemplate + LocalDateTable

---

## Known Limitations

### 1. Compressed Dictionary Page Bug (pbixray 0.5.0)
Free-text "name" columns with high cardinality (thousands of unique values stored in compressed Huffman-encoded dictionary pages) fail to parse due to a sentinel byte mismatch (`\xCD\xAB\xCD\xAB` expected, but newer Power BI versions write a different end mark). This affects:

| Column Pattern | Affected Tables |
|---|---|
| Opportunity / account names | opportunity, msd data, T funnel health, DataWeek |
| Party names (sold-to, bill-to, ship-to) | FeedFile, DealerList xl, DataWeek, T funnel evolution tracker |
| Product / material names | opportunityproduct, FeedFile |
| Address fields | account |

**Impact:** These are descriptive label columns. All numeric, date, and categorical/coded columns extract correctly — measures and KPIs are unaffected.
**Fix:** Upgrade pbixray when a version > 0.5.0 is released, or patch the `ColumnDataDictionary` end-mark validation.

### 2. DirectQuery — No Static Data Available
Price Margin Modalities is fully DirectQuery. The data lives in the source system only.

### 3. IDF Format Versions
- **Old format** (Partner Dashboard): `.idfx` files with idfmeta embedded at end of file
- **New format** (all others): `.idf` files with separate `.idfmeta` files
- The extraction script handles both formats automatically

---

## Output Format Rules
| Condition | Format |
|---|---|
| Table rows < 500,000 | CSV (UTF-8 with BOM) |
| Table rows ≥ 500,000 | Excel (.xlsx) |
