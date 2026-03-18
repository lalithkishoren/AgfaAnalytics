# Digital Hydrogen (Zirfon) — Data Analysis Findings

> **Project**: Agfa Digital Hydrogen Business Analytics
> **Objective**: Quotation-to-Order, Order-to-Revenue, Margin & Forecasting
> **Date**: 2026-03-17
> **Files Analyzed**: 4 of 4 (All complete)

---

## 1. Data Inventory

| # | File | Sheet(s) | Rows | Cols | Period | Purpose |
|---|------|----------|------|------|--------|---------|
| 1 | Customer Master.xlsx | Customer info | 304 | 6 | Static | Customer dimension / master data |
| 2 | Quotation.xlsx | 5657-8081, Pricing | 1,423 + 3 | 29 + 3 | 2023–2025 | Quote pipeline & conversion tracking |
| 3 | AP1 SAP extract on sales orders 2026.xlsx | Blad1 | 97 (46 orders) | 22 | Jan–Mar 2026 | Confirmed sales orders from SAP |
| 4 | Sales zirfon GHS.xlsx | 2023, 2024, 2025, 2026, Stock overview, Forecast info | 1,082 (920 real) | 29 | 2023–2026 | **THE CENTRAL SALES LEDGER** — order tracking, invoicing, payments |

### Additional files (in Sales & Margin analysis folder)
- ACTFY2025_Forecasting file.xlsx
- FY 2025.xls
- Sales Forecast February2026.xlsx

---

## 2. File-by-File Analysis

### 2.1 Customer Master.xlsx

**Structure**: 304 rows, 6 columns, single sheet "Customer info"

| Column | Actual Content | Type | Nulls | Unique |
|--------|---------------|------|-------|--------|
| Country | Customer country | text | 5 | 51 |
| Customer | SAP Customer ID (numeric) | float64 | 5 | 296 |
| Cust. nr. | Customer NAME (mislabeled!) | text | 4 | 293 |
| Adress | Full postal address | text | 5 | 292 |
| # ship-to adress | Alternate shipping address | text | 273 | 31 |
| Payment terms | Payment conditions (free text) | text | 91 | 17 |

**Geographic Distribution (Top 10)**:
- China (37), Germany (37), USA (26), India (22), Spain (20)
- Netherlands (13), Italy (13), Australia (12), UK (10), Poland (9)
- Total: 51 countries

**Payment Terms** (need standardization):
| Standardized Group | Raw Variants | Count |
|-------------------|-------------|-------|
| Advance | "advance payment", "Advance payment" | 95 |
| Net 30 | "30 days after invoice date", "payable 30 days", "payable 30 days after invoice date", "payable at 30 days" | 106 |
| Net 45 | "45 days after invoice date, end of month", "payable 45 days", "45 days end of month" | 3 |
| Net 60 | "60 days after invoice date, end of month", "60 days net" | 2 |
| Net 90 | "90 days after invoice date" | 2 |
| Net 120 | "120 days after invoice date" | 1 |
| Split | "50% advance, 50% payable at 30 days" | 1 |
| Net 14 | "payable 14 days" | 1 |
| Unknown/Null | — | 91 |

**Data Quality Issues**:
1. Column naming swap: "Customer" holds SAP ID, "Cust. nr." holds customer name
2. SAP ID stored as float64 — loses precision (e.g., 3.315003e+09)
3. 6 duplicate rows (Fortescue x2, Mecrotech x2, LONGi x2)
4. 5 completely blank rows at the end
5. Encoding issues: ü, ß characters showing as garbled text
6. Only 31 of 304 customers have ship-to addresses (~10%)

---

### 2.2 Quotation.xlsx

**Structure**:
- Main sheet "5657-8081": 1,423 rows, 29 columns
- "Pricing" sheet: 3 rows — special pricing for GeoPura, Indefol Solar, John Cockerill

**Key Columns**:

| Column | Description | Nulls | Unique |
|--------|-------------|-------|--------|
| Quotation number | Unique ID (format: 5657-YY-NNN) | 60 | 1,337 |
| Sent date | Date quote was sent | 74 | 462 |
| Customer | Customer name (free text) | 37 | 568 |
| Country | Customer country | 37 | 71 |
| Type perl | Membrane product type | 16 | 10 |
| Length / Width / qty | Physical dimensions & quantity | ~28 | — |
| Total sqm | Total square meters quoted | 14 | 462 |
| Eur /m2 | Price per square meter | 22 | 525 |
| F P H | Freight/Packing/Handling charges | 246 | 292 |
| Total amount quote: | Total quote value (EUR) | 75 | 731 |
| Standard pricing? | Yes/No flag | 229 | 2 |
| Approved | Approval status | 1,325 | 2 |
| Volume request | Volume discount requested | 1,387 | 2 |
| Order | "yes" if converted to order | 1,172 | 2 |
| Order date | Date order was placed | 1,178 | 177 |
| DC ok? | Delivery confirmation status | 1,333 | 3 |
| year | Year of quotation | 157 | 3 (2023/2024/2025) |

**Products — Zirfon Membrane Types**:
| Product | Lines | Share | Description |
|---------|-------|-------|-------------|
| UTP500 | 688 | 49% | Standard separator membrane |
| UTP220 | 381 | 27% | Thinner membrane variant |
| UTP500+ | 330 | 23% | Enhanced separator membrane |
| Other | 7 | <1% | UTP500A, ZT220, etc. |

**Quotation-to-Order Conversion**:

| Metric | Value |
|--------|-------|
| Total unique quotations | 1,337 |
| Converted to orders | 240 |
| **Overall conversion rate** | **18.0%** |

| Year | Quoted | Ordered | Conversion Rate |
|------|--------|---------|----------------|
| 2023 | 452 | 40 | 8.8% |
| 2024 | 415 | 100 | 24.1% |
| 2025 | 331 | 82 | 24.8% |

| Product | Conversion Rate |
|---------|----------------|
| UTP220 | 22.9% (best) |
| UTP500+ | 16.5% |
| UTP500 | 16.2% |

**Deal Size Insight**:
- Ordered quotes avg: **EUR 20,856**
- Non-ordered quotes avg: **EUR 197,046**
- Conclusion: Large project quotes have much lower conversion; smaller operational orders convert well

**Pricing Statistics (Eur/m²)**:
- Mean: EUR 401/m² | Median: EUR 400/m² | Range: EUR 0–623/m²
- P25: EUR 323/m² | P75: EUR 493/m²

**Top 10 Customers by Quote Frequency**:
1. Tianjin Risby (20), McPhy (18), Next Hydrogen (17)
2. Jiangsu Qiucheng (16), John Cockerill (14)
3. Industrie De Nora (12), Thermax (12), Shanghai Electric (12), Envision Energy (12)
4. De Nora Italy (11)

**Top 10 Countries by Quote Volume**:
China (173), Korea (158), India (147), Germany (136), Italy (97), USA (76), Japan (59), Spain (55), Netherlands (40), Belgium/Australia (31 each)

**Data Quality Issues**:
1. No SAP Customer ID — only free-text customer names (568 unique)
2. Case inconsistency: "yes" vs "Yes" in Approved and Volume request
3. 5 unnamed/garbage columns (24–28) — likely Excel artifacts
4. Encoding issues: "m²" displays as "m�"
5. Duplicate price column: "Eur /m2" + "Eur /m²" (original vs updated pricing)
6. 60 rows with no quotation number (continuation lines for multi-line quotes)
7. Standard pricing: 92% yes, 8% non-standard (99 quotes need approval)

---

### 2.3 AP1 SAP Extract on Sales Orders 2026

**Structure**: 97 rows, 22 columns, single sheet "Blad1"
**Effective data**: 46 unique sales orders (rows come in pairs)

**Key Columns**:

| Column | Description | Nulls | Unique |
|--------|-------------|-------|--------|
| Document | SAP Sales Order number | 0 | 46 |
| SaTy | Sales order type code | 0 | 5 |
| PO Number | Customer PO reference | 0 | 42 |
| Sold-To Pt | SAP Customer ID (integer) | 0 | 26 |
| DstC | Destination country code (2-letter) | 0 | 17 |
| Name 1 | Customer name | 0 | 26 |
| Item | Line item number (10, 20, 30) | 0 | 3 |
| Material | SAP Material code | 0 | 20 |
| Description | Product description | 0 | 27 |
| Plant | Production plant (always A600) | 0 | 1 |
| ShPt | Shipping point | 0 | 3 |
| Status | Completed / Not delivered | 0 | 2 |
| Doc. Date | Order document date | 0 | 25 |
| Deliv. date | Delivery/ship date | 0 | 48 |
| Order qty | Ordered quantity | 0 | 19 |
| ConfirmQty | Confirmed/shipped quantity | 0 | 19 |
| SU | Sales unit (PC or M2) | 0 | 2 |
| Net price | Unit price | 0 | 41 |
| Net Value | Total order line value | 0 | 42 |
| Curr. | Currency (EUR/JPY/KRW) | 0 | 3 |
| DlBl / BB | Always null — unused columns | 97 | 0 |

**Row Pairing Pattern**:
Each order line appears as TWO rows:
- Row 1: `Order qty > 0, ConfirmQty = 0` → original order request
- Row 2: `Order qty = 0, ConfirmQty > 0` → confirmed shipment with actual delivery date
- Exception: 3 rows have both > 0 (single-row orders)

**SAP Order Types**:
| Code | Orders | Inferred Meaning |
|------|--------|-----------------|
| ZETA | 20 | Export/international sales |
| ZATA | 17 | Domestic/EU direct sales |
| ZACC | 5 | Account/framework orders |
| ZBVZ | 3 | Special/consignment sales |
| ZARE | 1 | Returns/credit note |

**Order Status**:
- Completed: 87 rows (90%)
- Not delivered: 10 rows (10%) — deliveries scheduled through May 2026

**Revenue by Currency (confirmed lines only)**:
| Currency | Lines | Total Value | Notes |
|----------|-------|-------------|-------|
| EUR | 36 | 1,838,678 | Primary reporting currency |
| JPY | 7 | 7,316,343 | Via AGFA Japan (intercompany) |
| KRW | 7 | 111,899,238 | Via AGFA Korea (intercompany) |

**Top Customers by Order Lines**:
| Customer | Lines | Type |
|----------|-------|------|
| AGFA MATERIALS JAPAN | 14 | Intercompany distributor |
| AGFA MATERIALS KOREA | 13 | Intercompany distributor |
| ThyssenKrupp Nucera | 8 | Largest direct EUR customer |
| John Cockerill | 6 | Key EU customer |
| HGen | 6 | — |
| FRAUNHOFER IFAM | 6 | Research institute |
| WEW GmbH | 4 | — |
| Hysata | 4 | Australian customer |

**Top EUR Orders**:
1. ThyssenKrupp Nucera — EUR 354,315 (UTP220 large format)
2. ThyssenKrupp Nucera — EUR 343,365 (UTP220 large format)
3. John Cockerill — EUR 314,127 (UTP500 large circular)
4. ThyssenKrupp Nucera — EUR 171,683 (UTP220)
5. ThyssenKrupp Nucera — EUR 122,630 (UTP220)

**Delivery Timeline (2026)**:
| Month | Unique Orders | Lines |
|-------|--------------|-------|
| January | 15 | 17 |
| February | 17 | 18 |
| March | 7 | 7 |
| April | 4 | 4 |
| May | 3 | 4 |

**Shipping Points**:
- BEBN: 57 rows (main warehouse)
- BEG5: 32 rows (secondary)
- BEVE: 8 rows (third)

---

## 3. Cross-File Relationships

### 3.1 Customer Master ↔ SAP Orders: CLEAN LINK ✅

| Metric | Value |
|--------|-------|
| SAP Sold-To Pt IDs | 26 |
| Matched to Customer Master | **26 (100%)** |
| Join Key | `Sold-To Pt` = `Customer` (SAP ID) |

This is the **only reliable foreign key** across all datasets.

### 3.2 Customer Master ↔ Quotation: BROKEN LINK ❌

| Metric | Value |
|--------|-------|
| Quotation unique customers | 568 |
| Customer Master unique customers | 293 |
| Exact name matches | **65 (11%)** |
| In Quotation only (prospects) | 503 |
| In Master only (no quotes in data) | 228 |

**Root cause**: Quotation file has no SAP Customer ID — only free-text names that don't match the Customer Master names.

### 3.3 SAP Orders ↔ Quotation: WEAK LINK ⚠️

| Metric | Value |
|--------|-------|
| SAP order customers | 26 |
| Exact name match to Quotation | **10 (38%)** |
| Shared reference number | **NONE** |

The Quotation "Order = yes" flag indicates conversion, but there is **no quotation number stored in SAP** and **no SAP order number stored in Quotation**.

### 3.4 Country Code Mismatches

- 24 countries in Quotation have no match in Customer Master
- Mixed naming: "Nederland" vs "the Nederlands" vs "Netherlands", "Denemarken" vs "Denmark"
- Quotation uses full names; SAP uses 2-letter ISO codes (DE, JP, KR, etc.)

### 3.5 Data Model Summary

```
┌─────────────────────┐
│   Customer Master    │  (SAP ID = Primary Key, 296 customers)
│   - SAP Customer ID  │
│   - Customer Name    │
│   - Country          │
│   - Address          │
│   - Payment Terms    │
└────────┬────────────┘
         │
         │  Sold-To Pt = Customer ID  ✅ CLEAN JOIN
         ▼
┌─────────────────────┐
│   SAP Sales Orders   │  (Document = PK, 46 orders, Jan-Mar 2026)
│   - Document         │
│   - Sold-To Pt (FK)  │
│   - Material/Product │
│   - Qty, Price, Value│
│   - Status, Dates    │
└─────────────────────┘

┌─────────────────────┐
│     Quotation        │  (Quotation number = PK, 1,337 quotes, 2023-2025)
│   - Quotation number │
│   - Customer (text)  │──── ❌ NO FK to Customer Master
│   - Product/Qty/Price│
│   - Order flag (y/n) │──── ⚠️ NO reference to SAP Order Document
│   - Country (text)   │
└─────────────────────┘
```

---

## 4. Data Quality Summary

| Issue | File | Severity | Impact |
|-------|------|----------|--------|
| No shared key between Quotation & Customer Master | Quotation | **HIGH** | Cannot trace quote-to-order reliably |
| No shared key between Quotation & SAP Orders | Both | **HIGH** | Quote-to-cash traceability broken |
| Payment terms not standardized | Customer Master | MEDIUM | Impacts DSO/cash flow analysis |
| Country naming inconsistent across files | All | MEDIUM | Geographic reporting unreliable |
| Column mislabeling (Customer vs Cust. nr.) | Customer Master | LOW | Confusion risk |
| SAP ID stored as float | Customer Master | LOW | Precision loss in joins |
| Case inconsistency (yes/Yes) | Quotation | LOW | Filtering errors |
| Duplicate customer rows | Customer Master | LOW | 6 rows affected |
| Garbage columns (Unnamed 24–28) | Quotation | LOW | Can be dropped |

---

## 5. Proposed Analytics Hierarchies

### 5.1 Geography Hierarchy
```
Region (to be created: Europe / APAC / Americas / MEA)
  └── Country (standardized naming needed)
       └── Customer
```

### 5.2 Product Hierarchy
```
Product Family: Zirfon
  └── Product Type: UTP500 / UTP220 / UTP500+
       └── Product Variant: dimensions, format (sheet/circular/roll)
```

### 5.3 Customer Hierarchy
```
Customer Segment (to be created: Intercompany / OEM / End-User / Research)
  └── Customer (SAP ID)
       └── Ship-to Address
```

### 5.4 Time Hierarchy
```
Fiscal Year
  └── Quarter
       └── Month
            └── Week / Day
```

### 5.5 Sales Process Hierarchy
```
Quote Stage: Sent → Approved → Ordered → Delivered → Invoiced
  └── Order Type: ZETA / ZATA / ZACC / ZBVZ / ZARE
       └── Status: Completed / Not delivered
```

---

## 6. Proposed KPIs

### Pipeline & Conversion
| KPI | Formula | Source |
|-----|---------|--------|
| Quote Conversion Rate | Orders / Quotations | Quotation |
| Quote-to-Cash Cycle Time | Order Date - Sent Date | Quotation |
| Pipeline Value | Sum of open (non-ordered) quotes | Quotation |
| Avg Quote Size | Total amount / # quotes | Quotation |
| Win Rate by Product | Conversion by Type perl | Quotation |
| Win Rate by Geography | Conversion by Country | Quotation |

### Revenue & Orders
| KPI | Formula | Source |
|-----|---------|--------|
| Revenue (EUR) | Sum of Net Value (EUR-converted) | SAP Orders |
| Order Count | Distinct Document numbers | SAP Orders |
| Avg Order Value | Revenue / Order Count | SAP Orders |
| Revenue by Channel | Intercompany vs Direct | SAP Orders |
| Revenue by Product | By Material/Description | SAP Orders |

### Customer
| KPI | Formula | Source |
|-----|---------|--------|
| Customer Concentration | Top 10 customers % of revenue | SAP Orders |
| New vs Repeat Customers | First order date analysis | SAP + Quotation |
| Customer Lifetime Value | Cumulative revenue per customer | SAP Orders |
| DSO (Days Sales Outstanding) | Based on Payment Terms | Customer Master |

### Operational
| KPI | Formula | Source |
|-----|---------|--------|
| On-Time Delivery Rate | Delivered on/before Deliv. date | SAP Orders |
| Order Fulfillment Rate | ConfirmQty / Order qty | SAP Orders |
| Avg Lead Time | Deliv. date - Doc. Date | SAP Orders |
| Pricing Variance | Actual vs Standard pricing | Quotation |

---

### 2.4 Sales Zirfon GHS.xlsx — THE CENTRAL SALES LEDGER

**Structure**: 6 sheets total
- **4 yearly sheets** (2023, 2024, 2025, 2026): 29 columns each, identical structure
- **Stock overview per 30.09**: 10 rows — pending stock/backlog items (L&T UTP500+, Light Bridge UTP220, De Nora UTP220, GHS UTP500)
- **Forecast info**: 42 rows x 95 cols — monthly forecast grid (May 2025 → Jul 2026) with customer-level expected revenue

**This is the MOST IMPORTANT file** — it bridges Quotation → SAP Order → Invoice → Payment, and contains all the references needed for end-to-end traceability.

**Combined Data**: 1,082 rows total, **920 real data rows** (with Customer populated)

**Key Columns**:

| Column | Description | Coverage | Unique |
|--------|-------------|----------|--------|
| Status | 1=Open/In-progress, 2=Completed/Invoiced | 88% | 2 main |
| Agfa Order reference | Internal order ref (YY-NNN format) | 81% | 586 |
| Client Order reference | Customer PO number | 82% | 717 |
| Date | Order date | 82% | 424 |
| Customer | Customer name (free text) | 100%* | 370 |
| Country | Customer country | 100%* | 54 |
| Req. Delivery date | Requested delivery date | 73% | 430 |
| Type perl | Product type (UTP500/220/500+) | 81% | 9 |
| Length / Width / qty | Dimensions & quantity | ~80% | — |
| Total sqm | Total square meters | 82% | 330 |
| Eur /m2 | Price per m² | 78% | 237 |
| DC ok? / OC ok? | Delivery/Order confirmation | 72% / 54% | — |
| **SAP order number** | SAP Document ID | **76.5%** | 643 |
| Amount | Order/invoice value | 67% | 476 |
| Currency | EUR/KRW/JPY | 66% | 6 |
| Payment term | Payment conditions | 65% | 41 |
| Shipping method | courier/pick-up/VW/VL/truck | 49% | 11 |
| **Invoice** | Invoice number | **69.7%** | 587 |
| Dd. | Invoice date | 62% | 408 |
| **Amount paid** | Payment received | **23.4%** | 144 |
| Dd. .1 | Payment date | 19% | 167 |
| **Quotation reference** | Link to Quotation file | **39.9%** | 278 |
| Packing details | Packaging info | 4% | 8 |
| CN - DN? | Credit/Debit note flag | 3% | 6 |

*of real data rows

**Status Meaning**:
| Status | Rows | Has Invoice | Has SAP Order | Meaning |
|--------|------|-------------|---------------|---------|
| 2 | 756 | 640 (85%) | 650 (86%) | Completed / Invoiced |
| 1 | 164 | 1 (0.6%) | 54 (33%) | Open / In Progress |

**EUR Revenue by Year**:
| Year | Orders | Total EUR | Avg EUR | YoY Growth |
|------|--------|-----------|---------|------------|
| 2023 | 181 | 11,496,524 | 66,072 | — |
| 2024 | 206 | 33,434,995 | 162,306 | **+190.8%** |
| 2025 | 203 | 35,818,289 | 177,318 | +7.1% |
| 2026 | 50 | 3,295,009 | 65,900 | (partial year, Jan–Mar) |

**Multi-Currency Revenue**:
| Year | EUR | JPY | KRW |
|------|-----|-----|-----|
| 2023 | 11,496,524 | 26,485,592 | 104,804,981 |
| 2024 | 33,434,995 | 39,680,147 | 162,755,981 |
| 2025 | 35,818,289 | 41,630,253 | 717,815,782 |
| 2026 | 3,295,009 | 19,660,830 | 97,456,906 |

**Revenue by Product (EUR, all years)**:
| Product | Total EUR | Orders | Avg EUR | Share |
|---------|-----------|--------|---------|-------|
| UTP500 | 40,603,993 | 281 | 144,498 | 48.3% |
| UTP220 | 28,959,583 | 213 | 135,960 | 34.5% |
| UTP500+ | 13,914,457 | 120 | 115,954 | 16.6% |
| UTP500A | 549,443 | 12 | 45,787 | 0.7% |

**Revenue by Country (EUR, top 10)**:
| Country | Total EUR | Orders | Share |
|---------|-----------|--------|-------|
| Germany | 51,996,215 | 147 | **61.9%** |
| India | 7,288,744 | 30 | 8.7% |
| Italy | 4,690,893 | 71 | 5.6% |
| Belgium | 4,666,834 | 36 | 5.6% |
| Denmark | 4,298,934 | 39 | 5.1% |
| China | 2,336,883 | 49 | 2.8% |
| Switzerland | 2,309,120 | 9 | 2.7% |
| France | 1,824,308 | 28 | 2.2% |
| Netherlands | 854,404 | 17 | 1.0% |
| Australia | 582,019 | 24 | 0.7% |

**Customer Concentration (EUR)**:
| Metric | Value |
|--------|-------|
| Total EUR revenue (2023–2026) | 84,044,817 |
| Top 5 customers share | **72.8%** |
| Top 10 customers share | **86.1%** |
| Total unique customers | 286 |

**Top 10 Customers by EUR Revenue**:
| Customer | Total EUR | Orders |
|----------|-----------|--------|
| ThyssenKrupp | 24,256,290 | 23 |
| Sunfire GmbH | 22,943,700 | 29 |
| L&T Electrolysers | 6,790,840 | 11 |
| John Cockerill | 3,991,830 | 12 |
| McPhy | 3,229,321 | 29 |
| Sunfire SE | 3,095,210 | 4 |
| Green Hydrogen Systems | 2,554,869 | 16 |
| Sunfire Switzerland | 2,306,170 | 8 |
| Stiesdal | 1,626,603 | 11 |
| McPhy Energy (France) | 1,554,799 | 11 |

Note: Sunfire appears under 3 names (GmbH, SE, Switzerland) — combined ~EUR 28.3M = **largest customer**.

**Shipping Methods**:
| Method | Count |
|--------|-------|
| courier/courrier | 262 |
| pick-up | 151 |
| VW (road freight) | 81 |
| VL (air freight) | 69 |
| truck | 43 |

**Stock Overview (as of 30.09.2024)**:
Pending/backlog items in stock:
- L&T (India): 1,389 sqm UTP500+ — EUR 381,961
- Light Bridge (Korea): 35 sqm UTP220 — KRW 28,523,903
- De Nora (Italy): 24 sqm UTP220 — EUR 13,974
- Anhui Fueiceel (China): 20 sqm UTP220 — EUR 12,517
- Green Hydrogen Systems (Denmark): 1,217 sqm UTP500 — EUR 273,900

**Forecast Info Sheet**:
Monthly forecast grid covering May 2025 → July 2026 with customer-level expected EUR amounts per month. Key forecasted customers include ThyssenKrupp (NEOM project tranches), Sunfire, L&T, John Cockerill, McPhy, Hysata, De Nora.

**Data Quality Issues**:
1. Customer names not standardized — Sunfire appears as "Sunfire GmbH", "Sunfire SE", "Sunfire Switzerland" (3 entities or same?)
2. ThyssenKrupp appears as "ThyssenKrupp" and "Thyssenkrupp Nucera" — likely same customer
3. Shipping method inconsistency: "courier" vs "courrier" vs "pick up" vs "pick-up"
4. Payment terms: 41 variants (same standardization issue as Customer Master)
5. Status field has text annotations mixed with numeric codes (legends, warnings about bad payers)
6. Amount paid only 23.4% populated — incomplete payment tracking
7. Currency codes "40O" and "40S" are invalid
8. Type perl: "utp220" vs "UTP220", " UTP500" (leading space)

---

## 4. UPDATED Cross-File Relationships

### 4.1 The Complete Picture — Sales Zirfon is the HUB

```
                           ┌─────────────────────┐
                           │   Customer Master    │
                           │   (296 SAP IDs)      │
                           └────────┬────────────┘
                                    │ Sold-To Pt = Customer ID ✅
                                    ▼
┌──────────────┐    SAP order    ┌─────────────────────┐    Quotation    ┌──────────────┐
│  Quotation   │───reference────►│  Sales Zirfon GHS   │◄───reference───│  Quotation   │
│  (1,337 IDs) │  182 matches   │   (920 orders)      │   182 matches  │  (1,337 IDs) │
│              │    (39.9%)     │   ** CENTRAL HUB **  │    (13.6%)     │              │
└──────────────┘                └────────┬────────────┘                └──────────────┘
                                        │ SAP order number
                                        ▼
                               ┌─────────────────────┐
                               │   AP1 SAP Extract    │
                               │   (46 orders, 2026)  │
                               └─────────────────────┘
                                    34 matched (74%)
```

### 4.2 Linkage Summary

| From → To | Key | Match Rate | Quality |
|-----------|-----|------------|---------|
| Sales Zirfon → Customer Master | Customer name (fuzzy) | ~99 exact / 370 | ⚠️ Needs fuzzy matching |
| Sales Zirfon → SAP Orders (2026) | SAP order number | 34/46 (74%) | ✅ Good |
| Sales Zirfon → Quotation | Quotation reference | 182/278 (65%) | ⚠️ Partial |
| SAP Orders → Customer Master | Sold-To Pt = Customer ID | 26/26 (100%) | ✅ Perfect |
| Quotation → Customer Master | Customer name (fuzzy) | 65/568 (11%) | ❌ Poor |

### Key Insight
**Sales Zirfon GHS is the CENTRAL file** that the controller maintains manually. It's the only file that contains:
- Quotation reference (linking back to Quotation.xlsx)
- SAP order number (linking to AP1 SAP extract)
- Invoice number and payment tracking
- Full order lifecycle status (1=open, 2=complete)

---

## 5. KEY BUSINESS INSIGHTS

### 5.1 Revenue Story
- **3x growth** from 2023 (EUR 11.5M) to 2024 (EUR 33.4M) — breakout year
- 2025 plateaued at EUR 35.8M (+7.1%) — still growing but normalizing
- 2026 on track: EUR 3.3M in first ~2.5 months

### 5.2 Extreme Customer Concentration — RISK
- **Top 2 customers (ThyssenKrupp + Sunfire) = ~56% of all EUR revenue**
- Top 5 = 72.8%, Top 10 = 86.1%
- Loss of either ThyssenKrupp or Sunfire would be devastating

### 5.3 Geographic Concentration — RISK
- **Germany alone = 61.9% of EUR revenue**
- Top 3 countries (Germany, India, Italy) = 76.2%

### 5.4 Product Mix
- UTP500 dominates (48.3% of EUR revenue) with highest avg deal size (EUR 144K)
- UTP220 growing (34.5%), especially via ThyssenKrupp (large format NEOM project)
- UTP500+ is the smallest segment (16.6%) with lowest avg deal (EUR 116K)

### 5.5 Quote-to-Order Improvement
- Conversion rate improved from 8.8% (2023) → 24.8% (2025)
- Smaller quotes convert much better (avg EUR 21K vs EUR 197K for non-converted)

---

## 7. Pending Work

- [x] Analyze File 4: Sales zirfon GHS.xlsx ✓
- [x] Analyze supplementary files in Sales & Margin analysis folder ✓ → see Existing_Reports_Analysis.md
- [x] Margin analysis — COST DATA FOUND: UTP500 EUR 115.86/m², UTP220 EUR 95.47/m², UTP500+ EUR 115.86/m² ✓
- [x] Currency conversion — SAP BI data already in EUR (converted in SAP) ✓
- [ ] Build customer name fuzzy-matching logic (Quotation ↔ Customer Master) — partially addressed by Mapping Customers (111→78)
- [ ] Create standardized country mapping across all files
- [ ] Standardize payment terms into groups
- [ ] Build region mapping (Country → Region)
- [ ] Create unified data model / dashboard
- [ ] Forecasting model based on pipeline + historical conversion rates
