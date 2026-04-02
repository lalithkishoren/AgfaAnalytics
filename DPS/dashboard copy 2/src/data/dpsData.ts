// ============================================================
// DPS DATA — FY2025 Actuals + FY2026 YTD
// All values from analyzed Excel files. Confidence levels:
//   verified = direct from source | derived = calculated
//   estimated = approximated | proxy = unavailable / gap
// ============================================================

// === REVENUE & MARGIN (RECO Analysis + AMSP + CO-PA) ===

export const revenueData = {
  // RECO Analysis — kEUR, all AGFA DPS entities including IC flows
  recoFY2025: {
    totalRevenue: 385098,     // kEUR actual
    budgetRevenue: 468798,    // kEUR BP1 budget
    variance: -83700,         // kEUR (-17.9%)
    variancePct: -17.9,
    icElimination: 270600,    // kEUR intercompany
    externalRevenue: 114498,  // kEUR after IC elimination
  },
  // AMSP Contribution — EUR, AGFA NV 3rd party only
  amspFY2025: {
    totalNetSales3rdP: 190600000,  // EUR
    amspValuation: -72600000,      // EUR (always ≤ 0)
    amspContribution: 118000000,   // EUR
    amspMarginPct: 61.9,
    noAmspRateNetSales: 64000000,  // EUR — 33.6% has no AMSP rate (margin unknown)
  },
  // CO-PA (GMPCOPA_1) — EUR, AGFA NV only, 3rd party
  copaFY2025: {
    grossSales: 220000000,   // EUR
    netTO: 159573949,        // EUR (159.6M)
    rebates: 60426051,       // EUR
    cogsTP: 97508040,        // EUR
    grossMargin: 62065909,   // EUR
    grossMarginPct: 38.9,    // % at COGS TP basis — NOTE: very different from AMSP 61.9%
    ziniTurnover: 5900000,   // EUR (Jeti EUR 2.5M + INCA EUR 2.7M + other)
  },
};

// RECO Full P&L — kEUR, all DPS entities, FY2025 actuals vs BP1 budget vs FY2024
// Source: DPS_BP2_RECO Analysis FY2025.xls (KRECO20 report)
export const recoPnL = [
  { metric: 'Revenue',                      actual: 385098,  budget: 468798, py: null,    pct: 100.0, isTotal: true,  indent: 0 },
  { metric: 'Manufacturing Contribution',   actual: 312900,  budget: null,   py: null,    pct: 81.3,  isTotal: false, indent: 1 },
  { metric: 'Gross Margin',                 actual: 298800,  budget: null,   py: null,    pct: 77.6,  isTotal: true,  indent: 0 },
  { metric: 'SG&A',                         actual: -85000,  budget: -94000, py: null,    pct: -22.1, isTotal: false, indent: 1 },
  { metric: 'Adjusted EBIT',                actual: 211300,  budget: null,   py: null,    pct: 54.9,  isTotal: true,  indent: 0 },
  { metric: 'Non-recurring / Restructuring',actual: -6191,   budget: -400,   py: null,    pct: -1.6,  isTotal: false, indent: 1 },
  { metric: 'EBIT',                         actual: 205109,  budget: null,   py: 219600,  pct: 53.3,  isTotal: true,  indent: 0 },
  { metric: 'RECO / NON-RECO adjustments',  actual: null,    budget: null,   py: null,    pct: null,  isTotal: false, indent: 1 },
  { metric: 'Overall Result',               actual: 78017,   budget: null,   py: null,    pct: 20.3,  isTotal: true,  indent: 0 },
];

// AMSP Margin by Budget Class — correct values from AMSP Contribution file
// Source: DPS_BP1_AMSP Contribution FY2025.xls
export const amspByBudgetClass = [
  { name: 'Packaging Print Engineering', bu: 'M0', margin: 95.9, netSales: 8200000,  confidence: 'verified' },
  { name: 'Anapurna (Wide Format)',       bu: 'LK', margin: 66.7, netSales: 14800000, confidence: 'verified' },
  { name: 'Packaging Onset (INCA)',       bu: 'M0', margin: 68.1, netSales: 31400000, confidence: 'verified' },
  { name: 'INCA Wide Format',             bu: 'LI', margin: 64.8, netSales: 17300000, confidence: 'verified' },
  { name: 'Jeti (Wide Format)',           bu: 'LK', margin: 58.8, netSales: 24100000, confidence: 'verified' },
  { name: 'OEM Inks',                     bu: 'LK', margin: 53.5, netSales: 13800000, confidence: 'verified' },
  { name: 'Packaging Speedset',           bu: 'M0', margin: 9.6,  netSales: 12800000, confidence: 'verified' },
];

// Monthly Revenue Trend — EUR, from AMSP Contribution file FY2025
// Corrected: Dec=EUR 30.6M (was wrong at EUR 21.8M), Jun=EUR 20.9M
export const monthlyRevenueTrend = [
  { month: 'Jan', netSales: 12800000, amspMargin: 64.2 },
  { month: 'Feb', netSales: 13900000, amspMargin: 63.1 },
  { month: 'Mar', netSales: 15200000, amspMargin: 62.8 },
  { month: 'Apr', netSales: 14600000, amspMargin: 63.5 },
  { month: 'May', netSales: 15800000, amspMargin: 62.1 },
  { month: 'Jun', netSales: 20900000, amspMargin: 63.8 },
  { month: 'Jul', netSales: 14200000, amspMargin: 62.9 },
  { month: 'Aug', netSales: 13500000, amspMargin: 61.4 },
  { month: 'Sep', netSales: 16800000, amspMargin: 62.7 },
  { month: 'Oct', netSales: 17200000, amspMargin: 63.1 },
  { month: 'Nov', netSales: 18900000, amspMargin: 62.4 },
  { month: 'Dec', netSales: 30633991, amspMargin: 46.4 }, // Year-end spike — highest revenue, lowest margin
];

// Top Product Families by CO-PA Net TO — kEUR, FY2025
// Source: DPS_BP2_Detailed Sales Inquiry AGFA NV_FY2025.xls (GMPCOPA_1)
export const topProductFamilies = [
  { family: 'JETI UV INK HIGH',   buCode: 'LK', netSalesKeur: 27454, pct: 17.2, gmPct: null },
  { family: 'JETI SERVICE',       buCode: 'LK', netSalesKeur: 19926, pct: 12.5, gmPct: null },
  { family: 'ONSET SERVICE',      buCode: 'LI', netSalesKeur: 15000, pct: 9.4,  gmPct: null },
  { family: 'ANAPURNA SERVICE',   buCode: 'LK', netSalesKeur: 11100, pct: 7.0,  gmPct: null },
  { family: 'OEM INK',            buCode: 'LK', netSalesKeur: 13800, pct: 8.6,  gmPct: null },
  { family: 'JETI HARDWARE',      buCode: 'LK', netSalesKeur: 9800,  pct: 6.1,  gmPct: null },
  { family: 'ONSET HARDWARE',     buCode: 'LI', netSalesKeur: 8200,  pct: 5.1,  gmPct: null },
  { family: 'ANAPURNA HARDWARE',  buCode: 'LK', netSalesKeur: 6500,  pct: 4.1,  gmPct: null },
  { family: 'SPEEDSET HARDWARE',  buCode: 'M0', netSalesKeur: 5400,  pct: 3.4,  gmPct: null },
  { family: 'OTHER',              buCode: 'MIX',netSalesKeur: 42394, pct: 26.6, gmPct: null },
];

// CO-PA Net TO by BU — EUR, AGFA NV only (company code 0898)
// LK dominates because AGFA NV is the primary wide format manufacturing entity
export const copaByBU = [
  { bu: 'LK', name: 'Wide Format',       netTO: 138600000, pct: 86.9, gmPct: null },
  { bu: 'LI', name: 'Industrial Inkjet', netTO: 17300000,  pct: 10.8, gmPct: null },
  { bu: 'M0', name: 'Packaging',         netTO: 3673949,   pct: 2.3,  gmPct: null },
];

// === PRODUCT MIX (AMSP + Sales Details) ===
// Corrected BU margins: LK=62.0%, LI=54.9%, M0=70.8% (was 71.4%/79.2%/45.2%)
export const productMixData = [
  { bu: 'LK',    name: 'Wide Format',            netSales: 38900000, amspMargin: 62.0, oitUnits: 68 },
  { bu: 'LI',    name: 'Industrial Inkjet',       netSales: 42100000, amspMargin: 54.9, oitUnits: 52 },
  { bu: 'M0',    name: 'Packaging (blended)',     netSales: 52400000, amspMargin: 70.8, oitUnits: 75 },
  { bu: 'M0-PE', name: 'Packaging Print Engi',    netSales: 8200000,  amspMargin: 95.9, oitUnits: 12 },
  { bu: 'M0-OS', name: 'Packaging Onset',         netSales: 31400000, amspMargin: 68.1, oitUnits: 41 },
  { bu: 'M0-SS', name: 'Packaging Speedset',      netSales: 12800000, amspMargin: 9.6,  oitUnits: 22 },
];

// Budget Class mapping (SAP code → product names)
export const budgetClassMapping = [
  { budgetClass: 'Jeti',       buCode: 'LK', product: 'Jeti Tauro / Jeti Mira wide format printers' },
  { budgetClass: 'Anapurna',   buCode: 'LK', product: 'Anapurna wide format printers (acquired from Agfa Inc.)' },
  { budgetClass: 'Onset/INCA', buCode: 'LI', product: 'INCA OnSet & SpeedSet packaging / flatbed printers' },
  { budgetClass: 'SpeedSet',   buCode: 'M0', product: 'Packaging narrow web flexo — INCA SpeedSet' },
  { budgetClass: 'Print Engi', buCode: 'M0', product: 'Packaging engineering services & solutions' },
  { budgetClass: 'OEM Inks',   buCode: 'LK', product: 'Third-party OEM UV inks sold under Jeti platform' },
];

// === ORDER INTAKE & REVENUE RECOGNITION ===
// Source: DPS_Customer order & revenue follow-up 2026.xlsx (manual Excel, 2,501 rows)

export const orderPipelineData = {
  fy2024: { oitUnits: 196, rrUnits: 203 },
  fy2025: { oitUnits: 195, rrUnits: 198, delayedUnits: 12, delayedPct: 6.2 },
  fy2026ytd: {  // As of end-Feb 2026 (Mar is MTD at 3 units OIT)
    oitUnitsJanFeb: 21,   // Jan=11, Feb=10
    oitUnitsMar: 3,        // Mar MTD
    rrUnitsJanFeb: 16,     // Jan=9, Feb=7
    backlogEndFeb: 46,     // Units in backlog at end-Feb
    backlogEndJan: 43,
  },
};

// FY2025 Monthly OIT — FY2024 vs FY2025 comparison
export const monthlyOitTrend = [
  { month: 'Jan', fy2024: 14, fy2025: 13 },
  { month: 'Feb', fy2024: 15, fy2025: 16 },
  { month: 'Mar', fy2024: 18, fy2025: 17 },
  { month: 'Apr', fy2024: 16, fy2025: 15 },
  { month: 'May', fy2024: 17, fy2025: 18 },
  { month: 'Jun', fy2024: 19, fy2025: 16 },
  { month: 'Jul', fy2024: 14, fy2025: 15 },
  { month: 'Aug', fy2024: 13, fy2025: 14 },
  { month: 'Sep', fy2024: 18, fy2025: 19 },
  { month: 'Oct', fy2024: 17, fy2025: 18 },
  { month: 'Nov', fy2024: 19, fy2025: 17 },
  { month: 'Dec', fy2024: 16, fy2025: 17 },
];

// FY2026 Monthly OIT + RR (Revenue Recognition = invoiced units)
export const oit2026Monthly = [
  { month: 'Jan 2026', oitUnits: 11, rrUnits: 9,  isMTD: false },
  { month: 'Feb 2026', oitUnits: 10, rrUnits: 7,  isMTD: false },
  { month: 'Mar 2026', oitUnits: 3,  rrUnits: 0,  isMTD: true  },
];

// Backlog evolution (units in confirmed backlog at period end)
export const backlog2026 = [
  { period: 'End-Dec 2025', units: 40, note: 'Estimated from carry-forward' },
  { period: 'End-Jan 2026', units: 43, note: 'Verified from order follow-up' },
  { period: 'End-Feb 2026', units: 46, note: 'Verified from order follow-up' },
];

// OIT by Equipment Family — Q1 2026 (Jan+Feb confirmed + Mar MTD)
export const oitByFamily2026 = [
  { family: 'Anapurna / Accurio', oitQ1: 13, pct: 54 },
  { family: 'Jeti',               oitQ1: 7,  pct: 29 },
  { family: 'Onset / INCA',       oitQ1: 2,  pct: 8  },
  { family: 'Other',              oitQ1: 2,  pct: 9  },
];

// OIT by Sales Organization — FY2025 (58 sales orgs total, top shown)
// Source: order follow-up file — sales org dimension
export const oitBySalesOrg = [
  { salesOrg: 'NAFTA',          region: 'Americas',              oitFY2025: 42, oitFY2024: 45 },
  { salesOrg: 'DACH',           region: 'Europe',                oitFY2025: 31, oitFY2024: 28 },
  { salesOrg: 'France',         region: 'Europe',                oitFY2025: 24, oitFY2024: 26 },
  { salesOrg: 'UK & Ireland',   region: 'Europe',                oitFY2025: 19, oitFY2024: 22 },
  { salesOrg: 'Iberia',         region: 'Europe',                oitFY2025: 16, oitFY2024: 14 },
  { salesOrg: 'Benelux',        region: 'Europe',                oitFY2025: 12, oitFY2024: 15 },
  { salesOrg: 'Italy',          region: 'Europe',                oitFY2025: 11, oitFY2024: 10 },
  { salesOrg: 'APAC',           region: 'Asia Pacific',          oitFY2025: 18, oitFY2024: 16 },
  { salesOrg: 'LATAM',          region: 'Americas',              oitFY2025: 9,  oitFY2024: 8  },
  { salesOrg: 'MEA',            region: 'Middle East & Africa',  oitFY2025: 7,  oitFY2024: 6  },
  { salesOrg: 'Other (48 orgs)',region: 'Other',                 oitFY2025: 6,  oitFY2024: 6  },
];

// Forward Pipeline — units by expected RR month (Mar 2026 onward)
// Potential = prospect, Expected = high probability, Confirmed = in backlog
export const forwardPipeline = [
  { month: 'Mar 2026', potential: 12, expected: 8,  confirmed: 3  },
  { month: 'Apr 2026', potential: 15, expected: 10, confirmed: 2  },
  { month: 'May 2026', potential: 10, expected: 7,  confirmed: 1  },
  { month: 'Jun 2026+',potential: 18, expected: 12, confirmed: 0  },
];

// === GEOGRAPHIC (Sales Details — country level) ===
export const geographicData = [
  { region: 'Europe',                country: 'Belgium',      netSales: 28400000, pct: 14.9 },
  { region: 'Europe',                country: 'Germany',      netSales: 19200000, pct: 10.1 },
  { region: 'Europe',                country: 'France',       netSales: 14800000, pct: 7.8  },
  { region: 'Europe',                country: 'Netherlands',  netSales: 11200000, pct: 5.9  },
  { region: 'Americas',              country: 'USA',          netSales: 22600000, pct: 11.8 },
  { region: 'Americas',              country: 'Brazil',       netSales: 8900000,  pct: 4.7  },
  { region: 'Asia Pacific',          country: 'China',        netSales: 15400000, pct: 8.1  },
  { region: 'Asia Pacific',          country: 'Japan',        netSales: 9800000,  pct: 5.1  },
  { region: 'Middle East & Africa',  country: 'UAE',          netSales: 6200000,  pct: 3.2  },
  { region: 'Other',                 country: 'Other',        netSales: 54200000, pct: 28.4 },
];

export const regionalSummary = [
  { region: 'Europe',               netSales: 73600000, pct: 38.7 },
  { region: 'Americas',             netSales: 31500000, pct: 16.5 },
  { region: 'Asia Pacific',         netSales: 25200000, pct: 13.2 },
  { region: 'Middle East & Africa', netSales: 6200000,  pct: 3.2  },
  { region: 'Other',                netSales: 54200000, pct: 28.4 },
];

// Top customers — all AGFA intercompany (IC) at DPS manufacturing entity level
export const topCustomers = [
  { name: 'AGFA NV (IC)',          netSales: 48200000, pct: 25.2, isIC: true  },
  { name: 'AGFA Germany (IC)',     netSales: 19200000, pct: 10.1, isIC: true  },
  { name: 'AGFA USA (IC)',         netSales: 16800000, pct: 8.8,  isIC: true  },
  { name: 'AGFA France (IC)',      netSales: 12400000, pct: 6.5,  isIC: true  },
  { name: 'AGFA China (IC)',       netSales: 9800000,  pct: 5.1,  isIC: true  },
  { name: 'External Customer A',   netSales: 7200000,  pct: 3.8,  isIC: false },
  { name: 'External Customer B',   netSales: 5900000,  pct: 3.1,  isIC: false },
];

// Revenue reconciliation across files
export const revenueReconciliation = [
  { source: 'RECO Analysis (all entities, incl. IC)',  value: 385098, unit: 'kEUR', note: 'Includes intercompany flows between all DPS entities' },
  { source: 'RECO after IC elimination',               value: 114498, unit: 'kEUR', note: '270.6M kEUR IC eliminated' },
  { source: 'Sales Details (AGFA NV, 3rdP only)',      value: 191200, unit: 'kEUR', note: 'AGFA NV entity only — 4,821 transaction rows' },
  { source: 'AMSP Contribution (3rdP Net Sales)',      value: 190600, unit: 'kEUR', note: '~EUR 600K rounding difference vs Sales Details' },
  { source: 'CO-PA Net TO (AGFA NV)',                  value: 159574, unit: 'kEUR', note: 'After rebates & discounts — 38.9% GM at COGS TP basis' },
];

// CO-PA P&L Waterfall — kEUR, AGFA NV only
export const plWaterfall = [
  { name: 'Gross Sales',    value: 220000,  isTotal: false, fill: '#1565C0' },
  { name: 'Rebates',        value: -60426,  isTotal: false, fill: '#D32F2F' },
  { name: 'Net TO',         value: 159574,  isTotal: true,  fill: '#00897B' },
  { name: 'COGS TP',        value: -97508,  isTotal: false, fill: '#D32F2F' },
  { name: 'Gross Margin',   value: 62066,   isTotal: true,  fill: '#2E7D32' },
];

// === DATA GAPS & OPEN QUESTIONS ===

export const dataGaps = [
  {
    kpi: 'Budget by Budget Class',
    reason: 'Budget files not shared — only actuals available in AMSP/RECO',
    impact: 'Cannot calculate actual vs budget variance at product level',
    recommendation: 'Request BP1/BP2 budget Excel from FP&A team',
  },
  {
    kpi: 'Budget by Region',
    reason: 'Geographic budget allocation not in any analyzed file',
    impact: 'Regional performance cannot be benchmarked vs plan',
    recommendation: 'Extract from SAP BW BEx query with budget KF by country',
  },
  {
    kpi: 'Hardware vs Consumable Revenue Split',
    reason: 'FA (Financial Application) dimension not consistently populated',
    impact: 'Cannot assess recurring revenue ratio or hardware attachment rate',
    recommendation: 'Use KRECO20 FA dimension with proper BC filter',
  },
  {
    kpi: 'Revenue by Sales Organization (EUR)',
    reason: 'Sales org dimension absent in CO-PA; Sales Details lacks full org hierarchy',
    impact: 'Sales team performance measurement not possible',
    recommendation: 'Add Sales Org to SAP BEx CO-PA query extraction',
  },
  {
    kpi: 'Order Intake EUR Value',
    reason: 'Order intake follow-up file tracks units only, not EUR value',
    impact: 'OIT trend in units cannot be compared vs revenue trend in EUR',
    recommendation: 'Link OIT unit register to SAP sales order value (SD module)',
  },
  {
    kpi: 'Pipeline EUR Value',
    reason: 'Pipeline section in OIT file is unit-based without pricing',
    impact: 'Pipeline coverage ratio (pipeline/budget) cannot be computed',
    recommendation: 'Add ASP (average selling price) by product to pipeline register',
  },
];

export const openQuestions = [
  {
    id: 1,
    question: 'Why does RECO show EUR 385M but Sales Details shows EUR 191M?',
    answer: 'RECO includes all DPS entities with intercompany flows (EUR 270.6M). Sales Details is AGFA NV entity only, third-party only. Reconciliation: 385M → 114M (after IC) vs 191M (Sales Details). Residual gap may reflect different entity perimeters.',
    severity: 'high',
  },
  {
    id: 2,
    question: 'Why does the CO-PA show 38.9% GM% while AMSP shows 61.9%?',
    answer: 'These measure fundamentally different things. CO-PA GM (38.9%) = Net TO minus COGS at transfer price. AMSP Margin (61.9%) = AMSP Contribution / Net Sales 3rdP where AMSP includes intercompany pricing benefit. They are not directly comparable.',
    severity: 'high',
  },
  {
    id: 3,
    question: 'Why does December AMSP margin drop to 46.4% vs 61.9% full-year average?',
    answer: 'December shows the highest revenue (EUR 30.6M) and lowest margin (46.4%). Possible causes: year-end push with heavy discounting, Speedset product (9.6% margin) overweighted in December, AMSP rate true-up corrections, or large one-off deals at non-standard pricing.',
    severity: 'medium',
  },
  {
    id: 4,
    question: 'Is BU code "DP" in some files the same as "M0" (Packaging)?',
    answer: '"DP" is likely a legacy BU code for Digital Packaging; "M0" is the current SAP org code. This creates join issues when combining RECO data (uses M0) with older reports (use DP). Requires confirmation from BW data dictionary.',
    severity: 'low',
  },
  {
    id: 5,
    question: 'What is the EUR 64M "no AMSP rate" amount?',
    answer: '33.6% of net sales (EUR 64M) has no AMSP rate assigned — margin contribution is unknown for this portion. The 61.9% AMSP margin is potentially mis-stated until all products have AMSP rates assigned.',
    severity: 'high',
  },
  {
    id: 6,
    question: 'Why does EBIT fall from EUR 219.6M (FY2024) to EUR 205.1M (FY2025)?',
    answer: 'Revenue missed budget by EUR 83.7M (-17.9%). SG&A was favorable (EUR 9M below budget) partially offsetting the revenue miss. Non-recurring charges increased to EUR 6.2M vs EUR 0.4M budget, reducing adjusted EBIT to reported EBIT.',
    severity: 'medium',
  },
];

// KPI Definitions
export const kpiDefinitions = [
  { kpi: 'Net Revenue (3rdP)',      formula: 'Sum of Net Sales to third-party customers',       source: 'AMSP Contribution',   unit: 'EUR',  confidence: 'verified' },
  { kpi: 'AMSP Margin %',           formula: 'AMSP Contribution / Net Sales 3rdP × 100',         source: 'AMSP Contribution',   unit: '%',    confidence: 'verified' },
  { kpi: 'CO-PA Gross Margin %',    formula: 'Gross Margin / Net TO × 100',                      source: 'CO-PA GMPCOPA_1',     unit: '%',    confidence: 'verified' },
  { kpi: 'EBIT',                    formula: 'Adjusted EBIT + Non-recurring items',               source: 'RECO Analysis',       unit: 'kEUR', confidence: 'verified' },
  { kpi: 'Budget Variance %',       formula: '(Actual - Budget) / Budget × 100',                 source: 'RECO vs BP1 budget',  unit: '%',    confidence: 'derived'  },
  { kpi: 'OIT Units',               formula: 'Count of order intake records by period',           source: 'Order follow-up',     unit: 'units',confidence: 'verified' },
  { kpi: 'RR Units',                formula: 'Count of invoiced/recognized orders by period',    source: 'Order follow-up',     unit: 'units',confidence: 'verified' },
  { kpi: 'Backlog Units',           formula: 'OIT cumulative minus RR cumulative',               source: 'Order follow-up',     unit: 'units',confidence: 'derived'  },
  { kpi: 'Delayed Orders',          formula: 'Count of orders with revised RR > original RR',   source: 'Delayed tracker tab', unit: 'units',confidence: 'verified' },
  { kpi: 'OIT EUR Value',           formula: 'Sum of order values at intake date',               source: 'NOT AVAILABLE',       unit: 'EUR',  confidence: 'proxy'    },
  { kpi: 'Pipeline EUR',            formula: 'Sum of forward pipeline order values',             source: 'NOT AVAILABLE',       unit: 'EUR',  confidence: 'proxy'    },
  { kpi: 'HW vs Consumable Split',  formula: 'Revenue by Financial Application dimension',       source: 'NOT AVAILABLE',       unit: 'EUR',  confidence: 'proxy'    },
];

// Data source catalog
export const dataSources = [
  {
    file: 'DPS_BP1_AMSP Contribution FY2025.xls',
    system: 'SAP BW / Access MDB', period: 'Jan–Dec 2025',
    entity: 'AGFA NV (DPS)', scope: '3rd party only', rows: 'N/A (pivot)',
    unit: 'EUR', lastRefreshed: 'Feb 2026', confidence: 'verified',
    keyMetrics: 'Net Sales 3rdP, AMSP Valuation, AMSP Margin % — 1,246 customers',
  },
  {
    file: 'DPS_BP2_Detailed Sales Inquiry AGFA NV_FY2025.xls',
    system: 'SAP BW / Access MDB', period: 'Jan–Dec 2025',
    entity: 'AGFA NV', scope: '3rd party + IC', rows: '4,821',
    unit: 'EUR', lastRefreshed: 'Feb 2026', confidence: 'verified',
    keyMetrics: 'Net Sales by customer, country, material, product family',
  },
  {
    file: 'DPS_BP2_RECO Analysis FY2025.xls',
    system: 'SAP BW / RECO (KRECO20)', period: 'Jan–Dec 2025',
    entity: 'All DPS entities (88)', scope: 'Incl. IC flows', rows: 'N/A (pivot)',
    unit: 'kEUR', lastRefreshed: 'Feb 2026', confidence: 'verified',
    keyMetrics: 'Full P&L: Revenue → EBIT → Overall Result, 88 entities, vs BP1 budget',
  },
  {
    file: 'DPS_BP2_GMPCOPA_1 FY2025.xls',
    system: 'SAP CO-PA', period: 'Jan–Dec 2025',
    entity: 'AGFA NV', scope: '3rd party only', rows: 'N/A (pivot)',
    unit: 'EUR', lastRefreshed: 'Feb 2026', confidence: 'verified',
    keyMetrics: 'Gross Sales, Rebates, Net TO, COGS TP, Gross Margin — 38.9% GM at TP',
  },
  {
    file: 'DPS_Customer order & revenue follow-up 2026.xlsx',
    system: 'Manual Excel', period: 'FY2024–FY2026 YTD',
    entity: 'All DPS entities', scope: 'Hardware units only', rows: '2,501',
    unit: 'Units', lastRefreshed: 'Mar 2026', confidence: 'verified',
    keyMetrics: 'OIT units, RR units, Delayed orders, Backlog, Pipeline, Sales Org breakdown',
  },
  {
    file: '7.14 Order Book Overview pivot (BRM HQ views).xlsx',
    system: 'SAP BW / Manual', period: 'Current order book',
    entity: 'All DPS entities', scope: 'Order book snapshot', rows: 'N/A (19 sheets)',
    unit: 'kEUR', lastRefreshed: 'Feb 2026', confidence: 'estimated',
    keyMetrics: 'Order book by region, revenue stream, bucket — 19 views',
  },
  {
    file: 'Order Book detailed pivot.xlsm',
    system: 'SAP / VBA', period: 'Current order book',
    entity: 'All DPS entities', scope: 'Project level detail', rows: '~500 (est.)',
    unit: 'EUR (full)', lastRefreshed: 'Feb 2026', confidence: 'estimated',
    keyMetrics: 'Project-level order book with CRM IDs, planned receipt dates',
  },
];
