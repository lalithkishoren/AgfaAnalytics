# Analytics Lifecycle Coverage Map
**AGFA Digital Radiology — Order Intake → Revenue → Margin**
**Date:** 2026-03-26

---

## The Full Financial Lifecycle

A complete analytics stack for a capital equipment business like AGFA DR must cover 5 layers:

```
LAYER 1        LAYER 2        LAYER 3        LAYER 4        LAYER 5
─────────      ─────────      ─────────      ─────────      ─────────
PIPELINE   ──► ORDER      ──► ORDER      ──► REVENUE    ──► MARGIN &
& FUNNEL       INTAKE         BOOK           RECO           CASH
               (OIT)          (Backlog)      (Recognition)

"What will    "What did    "What have    "What have    "What did
 we win?"      we win?"     we won but    we invoiced?" we earn?"
                            not yet
                            delivered?"
```

Each layer answers a different management question. A CFO needs all 5. A KAM only needs layers 1 and 2.

---

## Where the 6 Existing Reports Actually Sit

```
LAYER 1        LAYER 2        LAYER 3        LAYER 4        LAYER 5
PIPELINE       ORDER INTAKE   ORDER BOOK     RECO           MARGIN
─────────────────────────────────────────────────────────────────────

Report 1       Report 1       ❌ EMPTY       ❌ EMPTY        ❌ EMPTY
(Weekly FC     (Won deals,
Tracker)       12 pages)

Report 4       Report 4       ❌ EMPTY       ❌ EMPTY        Report 4
(OIT Margin    (OIT vs                                      (CRM margin
& Mix)         budget)                                       estimates
                                                             ONLY — not
                                                             SAP actual)

Report 5       ❌             ❌ EMPTY        ❌ EMPTY        ❌ EMPTY
(Funnel
Evolution)

Report 6       Report 6       ❌ EMPTY        ❌ EMPTY        ❌ EMPTY
(OI Cockpit)   (OIT running
               totals +
               prediction)

❌             Report 2       ❌ EMPTY        ❌ EMPTY        Report 2
               (Partner       (Order Book                   (Actuals —
               Dashboard —    not tracked)                   SAP cost,
               SAP posted                                    Margin page
               revenue)                                      P10 only,
                                                             Goods only)

❌             Report 3       ❌ EMPTY        ❌ EMPTY        Report 3
               (Price         (No backlog                   (Standard
               Margin —       view)                          margin from
               realised                                      Sofon cost+,
               revenue)                                      NOT actual)
```

---

## Honest Assessment by Layer

### Layer 1 — Pipeline & Funnel
**Coverage: STRONG ✅**
- 4 reports cover this layer (R1, R4, R5, R6)
- Weekly snapshots, funnel by flag, region, KAM
- Weighted and unweighted views
- Quarter-over-quarter evolution
- Prediction models (4Q avg, prior quarter, same quarter)

**What's missing even here:**
- Win/loss analysis (pipeline exit analysis)
- Stage conversion rates (funnel efficiency)
- Deal velocity (time per stage)
- 2× Upside rule as a tracked KPI

---

### Layer 2 — Order Intake (OIT)
**Coverage: STRONG ✅**
- All 6 reports contribute to this layer
- OIT vs Budget / Forecast / PY
- Product mix at equipment type level
- Regional breakdown at country level
- Partner/channel split (Dealer vs Direct)
- Price realization on closed orders

**What's missing:**
- OIT split by New Business vs Expansion vs Renewal (field exists in CRM: `agfa_maintypecodename` — not surfaced)
- OIT by end-customer segment (Hospital size, Greenfield vs Replacement)

---

### Layer 3 — Order Book (Backlog)
**Coverage: EMPTY ❌**
- Not a single page across all 6 reports tracks the Order Book
- Won orders that have not yet been delivered/installed/invoiced are completely invisible
- Implementation progress is not tracked anywhere
- Delivery milestone tracking is absent

**Business impact:** If an order is Won in Q1 but requires 6 months of implementation before revenue can be recognised, that 6-month gap is a black hole. Management cannot see:
- How much is sitting in the backlog?
- When is it expected to convert to revenue?
- Which orders are delayed or at risk of slipping out of the quarter?

**Data that exists to fill this:**
- `agfa_saporderid` on the CRM opportunity (links to SAP order)
- `agfa_plannedrevenuerecognitiondate` in D365 (present in Report 4 data model but unused)
- SAP order status and delivery milestones (not yet extracted into Power BI)

---

### Layer 4 — Revenue Recognition (Reco)
**Coverage: EMPTY ❌**
- No report tracks planned vs actual revenue recognition dates
- No report shows the monthly phasing of revenue to be recognised
- No report shows which Won orders have been invoiced vs still open
- The revenue walk (OIT → Reco → Closing OB) is not built anywhere

**Business impact:** This is the number the CFO signs off on every quarter. It is currently managed entirely in manual Excel files outside of Power BI. Finance controllers are hand-building the Reco schedule every month for the MPR.

**Data that exists to fill this:**
- `agfa_plannedrevenuerecognitiondate` — already loaded in Report 4's data model, never used
- SAP posting date on invoices — available in Report 2's FeedFile
- These two together give planned vs actual Reco at deal level

---

### Layer 5 — Margin & Cash
**Coverage: PARTIAL ⚠️ — and what IS there is unreliable**

This layer exists in 3 reports but each covers a different part with different quality:

| Report | What it shows | Reliability |
|--------|--------------|-------------|
| Report 4 | CRM-entered margin % by deal (hardware/impl/license/service) | LOW — KAM estimate at deal creation, not verified against cost actuals |
| Report 3 | Standard margin (Sofon Cost+ vs Net Turnover) | MEDIUM — standard cost is auditable, but standard ≠ actual |
| Report 2 P10 | SAP actual margin (Net Turnover EUR vs Calculated Cost APX) | HIGH — actual posted cost, but Goods only, no implementation/service margin |

**The result:** There are 3 different margin numbers for the same business, none of them reconciled:
```
CRM margin (Report 4)  ≠  Standard margin (Report 3)  ≠  Actual SAP margin (Report 2)
     ~40%                       ~38%                           ~35%

KAM estimate              Sofon standard cost            SAP actual posted cost
at deal creation          at time of quote                after delivery
```

**What's completely missing:**
- Margin bridge: Volume effect / Mix effect / Price effect / Cost variance / FX effect
- Implementation margin: Report 2 shows Goods margin only — implementation service profitability is invisible
- Support/Maintenance margin: Recurring revenue margin is not tracked anywhere
- CRM estimate vs SAP actual reconciliation: Has the deal we thought was 40% margin actually posted at 35%? Nobody knows.

**Cash/NWC:** Not covered at all in any report. Not in scope yet but listed in the playbook.

---

## The Real Picture — Layer Coverage Diagram

```
         LAYER 1      LAYER 2      LAYER 3      LAYER 4      LAYER 5
         PIPELINE     OIT          ORDER BOOK   RECO         MARGIN

         ████████     ████████     ░░░░░░░░     ░░░░░░░░     ████░░░░
         STRONG       STRONG       EMPTY        EMPTY        PARTIAL
         ✅           ✅           ❌            ❌           ⚠️

Reports  R1,R4,R5,R6  R1-R6        —            —            R2,R3,R4
         (36 pages)   (43 pages    (0 pages)    (0 pages)    (partial,
                       touch OIT)               unreliable)
```

---

## Why the Imbalance Exists

The 6 reports were built **organically by the commercial team** to answer the question they were asked most: *"How is the funnel performing this week?"*

They were NOT designed as a financial lifecycle stack. Each report was built to solve one operational problem:

| Report | Original Purpose | Built For |
|--------|-----------------|-----------|
| R1 Weekly FC Tracker | Friday sales meeting | Sales team |
| R2 Partner Dashboard | Monthly channel review | Channel managers |
| R3 Price Margin | Pricing discipline checks | Pricing/Finance |
| R4 OIT Margin & Mix | Budget tracking (CY only) | Commercial Finance |
| R5 Funnel Evolution | Quarterly funnel review | Commercial Director |
| R6 OI Cockpit | Monday revenue walk | VP Commercial |

Nobody built from the CFO's perspective: "give me one place to see the full financial journey from pipeline to recognised margin."

---

## What the EDW + New Dashboard Adds

```
         LAYER 1      LAYER 2      LAYER 3      LAYER 4      LAYER 5
         PIPELINE     OIT          ORDER BOOK   RECO         MARGIN

EXISTING ████████     ████████     ░░░░░░░░     ░░░░░░░░     ████░░░░
         STRONG       STRONG       EMPTY        EMPTY        PARTIAL

NEW EDW  ████████     ████████     ████████     ████████     ████████
         + Win/Loss   + New/Expand + Aging       + Monthly    + Bridge
         + Velocity   + Segment    + By region    phasing      (Vol/Mix
         + 2× Rule    + B&B        + Milestone   + Overdue     /Price
                                    tracking      alerts       /Cost/FX)
```

The EDW closes all 5 layers into a single connected story.

---

## Lifecycle Connectivity — The Key Joins the EDW Must Build

The reason Layers 3, 4, and 5 are empty is not because the data doesn't exist — it's because the joins between source systems have never been built in Power BI:

```
CRM Opportunity (Won)
        │
        │ agfa_saporderid  ◄── THIS JOIN IS THE KEY
        │
        ▼
SAP Sales Order
        │
        ├── Delivery Status ──────────────────► Layer 3: Order Book
        │   (open / in delivery / invoiced)
        │
        ├── Invoice Date ────────────────────► Layer 4: Revenue Reco
        │   (= Posting Date in FeedFile)        (planned vs actual)
        │
        └── Calculated Cost APX ─────────────► Layer 5: Actual Margin
            (from FeedFile)                     (CRM estimate vs actual)
```

**One join** (`agfa_saporderid` → SAP order) unlocks all three missing layers simultaneously. This is the single most important technical dependency in the EDW design.

---

## Summary for Business Users

| Question | Can current reports answer it? | Can new dashboard answer it? |
|----------|-------------------------------|------------------------------|
| What is in our funnel this week? | ✅ Yes (5 reports) | ✅ Yes |
| How much did we win this month vs budget? | ✅ Yes | ✅ Yes |
| What is sitting in our backlog waiting to be delivered? | ❌ No | ✅ Yes (new) |
| How much revenue will we recognise this quarter? | ❌ No | ✅ Yes (new) |
| Which Won orders are at risk of slipping out of the quarter? | ❌ No | ✅ Yes (new) |
| What is our actual (not estimated) gross margin? | ⚠️ Partially (Report 2, Goods only) | ✅ Yes (new) |
| Why is our margin different from budget? | ❌ No | ✅ Yes (new bridge) |
| Are we going to make our revenue commitment for this quarter? | ❌ No | ✅ Yes (new) |

---

*Lifecycle Coverage Map v1.0 — AGFA Digital Radiology | 2026-03-26*
