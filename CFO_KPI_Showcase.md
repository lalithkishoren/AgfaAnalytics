# CFO / Financial Practitioner — KPI Showcase Table

> **Purpose:** Reference table of the 25 most CFO-relevant KPIs across all 4 Agfa dashboards.
> Designed for executive-level presentations and mockup feature showcases.

---

## Status Key

| Symbol | Meaning |
|--------|---------|
| ✅ Live | Available in the dashboard today |
| 🟡 Ready | Data exists — build effort < 1 sprint |
| 🔵 Planned | Partially available — needs data join or new extract |
| 🔴 Gap | Not available — requires EDW / SAP FI investment |

---

## P1 — P&L Performance

| # | KPI | Definition | CFO Question Answered | DR | DH | DPS | HE IT |
|---|-----|-----------|----------------------|----|----|----|-------|
| 1 | **Revenue vs Budget %** | (Actual Revenue – Budget) / Budget × 100 | Are we hitting our annual revenue plan? | ✅ | ✅ | ✅ | ✅ |
| 2 | **Revenue YoY Growth %** | (Current Year – Prior Year) / Prior Year × 100 | Is the business growing year-on-year? | ✅ | ✅ | ✅ | ✅ |
| 3 | **Gross Margin %** | (Net Revenue – Cost of Goods) / Net Revenue × 100 | What is the profitability on each euro of revenue? | 🔵 | ✅ | ✅ | ✅ |
| 4 | **EBIT / Operating Contribution** | Revenue – Direct Costs – Allocated SG&A | What is the bottom-line operating result per BU? | 🔴 | 🔴 | ✅ | ✅ |
| 5 | **Price Realisation Waterfall** | List Price → Discount → Net TO → Cost → Gross Margin | How much margin is lost at deal level vs list price? | ✅ | 🟡 | 🔴 | 🔴 |

---

## P2 — Order Intake & Commercial

| # | KPI | Definition | CFO Question Answered | DR | DH | DPS | HE IT |
|---|-----|-----------|----------------------|----|----|----|-------|
| 6 | **Order Intake YTD vs Budget** | SUM(Won deals YTD) vs phased annual OI budget | Are we booking enough new business to hit the full-year plan? | ✅ | ✅ | 🔵 | ✅ |
| 7 | **Pipeline Coverage Ratio** | Open Pipeline / (OIT YTD annualised). Target ≥ 2.5× | Do we have enough in the funnel to secure the forecast? | ✅ | ✅ | 🔴 | 🔵 |
| 8 | **Win Rate %** | COUNT(Won) / COUNT(Won + Lost) × 100 | How effective is the sales force at converting opportunities? | 🟡 | 🟡 | 🔴 | 🔴 |
| 9 | **Average Deal Size** | Total OIT EUR / Count of Won Deals | Is deal quality improving or are we trading volume for size? | ✅ | ✅ | 🔴 | ✅ |
| 10 | **Large Deal Tracker (>500 kEUR)** | List of deals above threshold by stage and region | What are the make-or-break deals this quarter? | 🟡 | ✅ | 🔴 | 🔴 |
| 11 | **2× Upside Rule Compliance** | Upside EUR ÷ Included with Risk EUR per region (target ≥ 2.0) | Is sales maintaining enough upside to protect against slippage? | 🟡 | 🔴 | 🔴 | 🔴 |

---

## P3 — Order Book & Backlog

| # | KPI | Definition | CFO Question Answered | DR | DH | DPS | HE IT |
|---|-----|-----------|----------------------|----|----|----|-------|
| 12 | **Order Book Value** | SUM(Won deal value) WHERE SAP order exists AND not yet invoiced | What is the contracted revenue still to be delivered? | 🔴 | 🔵 | 🔵 | ✅ |
| 13 | **Overdue Revenue (>6 months)** | Backlog bucket where planned reco date is >6 months past due | Which contracts are at risk of never being recognised? | 🔵 | 🔴 | 🔵 | ✅ |
| 14 | **Book & Bill %** | Deals where OIT and revenue recognition occur in the same period | How much of what we book today turns into revenue this month? | 🔵 | 🔵 | 🔵 | ✅ |
| 15 | **Order Book by Risk Bucket** | Backlog split: Planned CY / Planned Next Year / Overdue / Not Planned | How much of the backlog is reliably scheduled vs at risk? | 🔴 | 🔴 | 🔵 | ✅ |

---

## P4 — Forecast Reliability

| # | KPI | Definition | CFO Question Answered | DR | DH | DPS | HE IT |
|---|-----|-----------|----------------------|----|----|----|-------|
| 16 | **Full-Year Forecast vs Budget** | FY (Actuals + Remaining Forecast) vs annual budget | Will we land on budget by year-end? | ✅ | ✅ | ✅ | ✅ |
| 17 | **Weighted Pipeline (DS% × DH%)** | SUM(Deal Value × Deal Sign% × Deal Happen%) | What is the risk-adjusted view of what will actually close? | ✅ | 🔴 | 🔴 | 🔴 |
| 18 | **Forecast Category Snapshot** | Pipeline split: Won / Secured / Included / At Risk / Upside | What is the confidence breakdown of the remaining forecast? | ✅ | 🔴 | 🔴 | 🔴 |
| 19 | **Planned Revenue Reco by Month** | SUM(Won deal value) grouped by planned recognition month | What is the expected monthly revenue curve for the rest of the year? | 🟡 | ✅ | 🟡 | ✅ |
| 20 | **Forecast Revision History** | Budget → RFC1 → RFC2 → Current — change tracking over time | How many times have we revised the forecast and by how much? | ✅ | ✅ | 🔵 | 🔵 |

---

## P5 — Cash & Working Capital

| # | KPI | Definition | CFO Question Answered | DR | DH | DPS | HE IT |
|---|-----|-----------|----------------------|----|----|----|-------|
| 21 | **DSO — Days Sales Outstanding** | AR Balance / (Annual Revenue / 365) | How long does it take to collect cash after we invoice? | 🔴 | 🔴 | 🔴 | 🔴 |
| 22 | **Net Working Capital (NWC)** | Current Assets (AR) – Current Liabilities (AP) | How much capital is tied up in the operating cycle? | 🔴 | 🔴 | 🔴 | 🔴 |
| 23 | **Order-to-Invoice Cycle Time** | Avg days from SAP order creation to invoice posting | How efficient is the delivery and billing process? | 🔵 | 🟡 | 🟡 | 🔵 |

---

## P6 — Operational Efficiency

| # | KPI | Definition | CFO Question Answered | DR | DH | DPS | HE IT |
|---|-----|-----------|----------------------|----|----|----|-------|
| 24 | **Quote Conversion Rate** | COUNT(Won) / COUNT(Total Quotations) × 100 | How efficiently is the sales funnel converting effort to revenue? | 🟡 | ✅ | 🔴 | 🔴 |
| 25 | **Delayed Order Impact** | COUNT(orders where revised RR > original RR) and EUR exposure | How many orders are slipping and what is the revenue risk? | 🔵 | 🟡 | ✅ | 🔵 |

---

## Summary by Program

| Program | ✅ Live | 🟡 Ready to Build | 🔵 Planned | 🔴 Gap | Live % |
|---------|--------|------------------|-----------|--------|--------|
| **Digital Radiology (DR)** | 9 | 6 | 5 | 5 | 36% |
| **Digital Hydrogen (DH)** | 9 | 4 | 4 | 8 | 36% |
| **DPS** | 5 | 3 | 9 | 8 | 20% |
| **HE IT** | 10 | 0 | 6 | 9 | 40% |

---

## Top 10 for CFO Showcase (Best Features)

| Rank | KPI | Why it resonates with a CFO |
|------|-----|----------------------------|
| 1 | Revenue vs Budget % | The single most-asked question in any business review |
| 2 | Full-Year Forecast vs Budget | Shows whether year-end delivery is on track |
| 3 | Gross Margin % | Connects commercial performance to profitability |
| 4 | Order Intake YTD vs Budget | Leading indicator — today's bookings are next quarter's revenue |
| 5 | Pipeline Coverage Ratio | Shows whether there is enough in the funnel to de-risk the forecast |
| 6 | Planned Revenue Reco by Month | Gives a month-by-month revenue curve — critical for cash planning |
| 7 | Order Book by Risk Bucket | Highlights execution risk in the contracted backlog |
| 8 | Weighted Pipeline (DS% × DH%) | Quality-adjusted funnel — separates real pipeline from wishful thinking |
| 9 | Price Realisation Waterfall | Shows where margin is leaking between list price and actual invoice |
| 10 | Overdue Revenue | Flags contracts that are booked but never billing — a cash risk signal |
