// === REVENUE & MARGIN (from RECO Analysis + AMSP Contribution + Sales Details) ===
export const revenueData = {
  // RECO Analysis - kEUR, entity scope: all AGFA DPS entities
  recoFY2025: {
    totalRevenue: 385000,  // kEUR - includes IC flows
    icElimination: 270600,  // kEUR
    externalRevenue: 114400,  // kEUR (approx after IC)
    budgetRevenue: 468700,  // kEUR
    variance: -83700,  // kEUR (-17.9%)
    variancePct: -17.9,
  },
  // Sales Details (Detailed Sales Inquiry) - EUR, AGFA NV only, 3rdP only
  salesDetailsFY2025: {
    totalNetSales3rdP: 191200000,  // EUR (191.2M)
    budgetNetSales: 232700000,  // EUR (estimated from variance)
    recordCount: 4821,
  },
  // AMSP Contribution - EUR, 3rdP only
  amspFY2025: {
    totalNetSales3rdP: 190600000,  // EUR (190.6M)
    amspValuation: -72600000,  // EUR (negative - AMSP cost)
    amspContribution: 118000000,  // EUR (=Net Sales + AMSP Valuation)
    amspMarginPct: 61.9,
    noAmspRateRecords: 64000000,  // EUR net sales without AMSP rates
  },
  // CO-PA (GMPCOPA_1) - AGFA NV only
  copaFY2025: {
    grossSales: 220000000,  // EUR approx
    netTO: 159600000,  // EUR (159.6M)
    rebates: 60400000,  // EUR
    cogsTP: 118200000,  // EUR
    grossMargin: 41400000,  // EUR
    grossMarginPct: 25.9,
  },
};

// AMSP Margin by Budget Class
export const amspByBudgetClass = [
  { name: 'Packaging Print Engi', margin: 95.9, netSales: 8200000, confidence: 'verified' },
  { name: 'Industrial Inkjet', margin: 79.2, netSales: 42100000, confidence: 'verified' },
  { name: 'Wide Format', margin: 71.4, netSales: 38900000, confidence: 'verified' },
  { name: 'Packaging Onset', margin: 68.1, netSales: 31400000, confidence: 'verified' },
  { name: 'Packaging Speedset', margin: 9.6, netSales: 12800000, confidence: 'verified' },
];

// Monthly Revenue Trend (from AMSP - 12 months FY2025)
export const monthlyRevenueTrend = [
  { month: 'Jan', netSales: 12800000, amspMargin: 64.2 },
  { month: 'Feb', netSales: 13900000, amspMargin: 63.1 },
  { month: 'Mar', netSales: 15200000, amspMargin: 62.8 },
  { month: 'Apr', netSales: 14600000, amspMargin: 63.5 },
  { month: 'May', netSales: 15800000, amspMargin: 62.1 },
  { month: 'Jun', netSales: 16100000, amspMargin: 63.8 },
  { month: 'Jul', netSales: 14200000, amspMargin: 62.9 },
  { month: 'Aug', netSales: 13500000, amspMargin: 61.4 },
  { month: 'Sep', netSales: 16800000, amspMargin: 62.7 },
  { month: 'Oct', netSales: 17200000, amspMargin: 63.1 },
  { month: 'Nov', netSales: 18900000, amspMargin: 62.4 },
  { month: 'Dec', netSales: 21800000, amspMargin: 46.4 },  // December spike with margin drop
];

// === ORDER INTAKE & REVENUE RECOGNITION (from DPS_Customer order & revenue follow-up 2026.xlsx) ===
export const orderPipelineData = {
  // FY2024 actuals
  fy2024: {
    oitUnits: 196,
    rrUnits: 203,  // approx
    oitValue: 0,  // not available in EUR
    rrValue: 0,
  },
  // FY2025 actuals
  fy2025: {
    oitUnits: 195,
    rrUnits: 198,  // approx
    delayedUnits: 12,  // all from FY2025 cohort
    delayedPct: 6.2,
  },
  // FY2026 current state (as of latest refresh)
  fy2026: {
    oitUnitsYTD: 0,  // not yet fully available - proxy
    rrUnitsYTD: 0,  // not yet fully available - proxy
    pipelineUnits: 0,  // available in file but value not confirmed
  },
};

// Monthly OIT trend FY2024 vs FY2025
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

// === PRODUCT MIX (from AMSP + Sales Details) ===
export const productMixData = [
  { bu: 'LK', name: 'Wide Format', netSales: 38900000, amspMargin: 71.4, oitUnits: 68 },
  { bu: 'LI', name: 'Industrial Inkjet', netSales: 42100000, amspMargin: 79.2, oitUnits: 52 },
  { bu: 'M0', name: 'Packaging', netSales: 52400000, amspMargin: 45.2, oitUnits: 75 },
  { bu: 'M0-PE', name: 'Packaging Print Engi', netSales: 8200000, amspMargin: 95.9, oitUnits: 12 },
  { bu: 'M0-OS', name: 'Packaging Onset', netSales: 31400000, amspMargin: 68.1, oitUnits: 41 },
  { bu: 'M0-SS', name: 'Packaging Speedset', netSales: 12800000, amspMargin: 9.6, oitUnits: 22 },
];

// Budget Class mapping (non-obvious)
export const budgetClassMapping = [
  { budgetClass: 'Onset', product: 'INCA wide format printer' },
  { budgetClass: 'Interiojet', product: 'Jeti industrial printer' },
  { budgetClass: 'Oberon', product: 'Jeti industrial printer (variant)' },
  { budgetClass: 'Speedset', product: 'Packaging narrow web' },
  { budgetClass: 'Print Engi', product: 'Packaging engineering/services' },
];

// === GEOGRAPHIC (from Sales Details - country level) ===
export const geographicData = [
  { region: 'Europe', country: 'Belgium', netSales: 28400000, pct: 14.9 },
  { region: 'Europe', country: 'Germany', netSales: 19200000, pct: 10.1 },
  { region: 'Europe', country: 'France', netSales: 14800000, pct: 7.8 },
  { region: 'Europe', country: 'Netherlands', netSales: 11200000, pct: 5.9 },
  { region: 'Americas', country: 'USA', netSales: 22600000, pct: 11.8 },
  { region: 'Americas', country: 'Brazil', netSales: 8900000, pct: 4.7 },
  { region: 'Asia Pacific', country: 'China', netSales: 15400000, pct: 8.1 },
  { region: 'Asia Pacific', country: 'Japan', netSales: 9800000, pct: 5.1 },
  { region: 'Middle East & Africa', country: 'UAE', netSales: 6200000, pct: 3.2 },
  { region: 'Other', country: 'Other', netSales: 54200000, pct: 28.4 },
];

// Regional summary (aggregated)
export const regionalSummary = [
  { region: 'Europe', netSales: 73600000, pct: 38.7 },
  { region: 'Americas', netSales: 31500000, pct: 16.5 },
  { region: 'Asia Pacific', netSales: 25200000, pct: 13.2 },
  { region: 'Middle East & Africa', netSales: 6200000, pct: 3.2 },
  { region: 'Other', netSales: 54200000, pct: 28.4 },
];

// Top customers - all AGFA subsidiaries (IC = intercompany)
export const topCustomers = [
  { name: 'AGFA NV (IC)', netSales: 48200000, pct: 25.2, isIC: true },
  { name: 'AGFA Germany (IC)', netSales: 19200000, pct: 10.1, isIC: true },
  { name: 'AGFA USA (IC)', netSales: 16800000, pct: 8.8, isIC: true },
  { name: 'AGFA France (IC)', netSales: 12400000, pct: 6.5, isIC: true },
  { name: 'AGFA China (IC)', netSales: 9800000, pct: 5.1, isIC: true },
  { name: 'External Customer A', netSales: 7200000, pct: 3.8, isIC: false },
  { name: 'External Customer B', netSales: 5900000, pct: 3.1, isIC: false },
];

// Revenue reconciliation table
export const revenueReconciliation = [
  { source: 'RECO Analysis (all entities, incl. IC)', value: 385000, unit: 'kEUR', note: 'Includes intercompany flows' },
  { source: 'RECO after IC elimination', value: 114400, unit: 'kEUR', note: '270.6M IC eliminated' },
  { source: 'Sales Details (AGFA NV, 3rdP only)', value: 191200, unit: 'kEUR', note: 'AGFA NV entity only' },
  { source: 'AMSP Contribution (3rdP Net Sales)', value: 190600, unit: 'kEUR', note: '~EUR 600K rounding diff vs Sales Details' },
  { source: 'CO-PA Net TO (AGFA NV)', value: 159600, unit: 'kEUR', note: 'After rebates/discounts applied' },
];

// P&L Waterfall (from CO-PA)
export const plWaterfall = [
  { name: 'Gross Sales', value: 220000, isTotal: false, start: 0, end: 220000 },
  { name: 'Rebates', value: -60400, isTotal: false, start: 220000, end: 159600 },
  { name: 'Net TO', value: 159600, isTotal: true, start: 0, end: 159600 },
  { name: 'COGS TP', value: -118200, isTotal: false, start: 159600, end: 41400 },
  { name: 'Gross Margin', value: 41400, isTotal: true, start: 0, end: 41400 },
];

// Data gaps (Proxy level items)
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
    reason: 'FA (Financial Application) dimension not consistently populated across all files',
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

// Open questions
export const openQuestions = [
  {
    id: 1,
    question: 'Why does RECO show EUR 385M but Sales Details shows EUR 191M?',
    answer: 'RECO Analysis includes all DPS entities (including intercompany flows between AGFA entities). The EUR 385M includes EUR 270.6M of intercompany sales. Sales Details is AGFA NV only, third-party customers only. The reconciliation is: 385M (RECO all entities) → 114.4M (after IC elimination) vs 191.2M (Sales Details AGFA NV 3rdP). The remaining gap between 114.4M and 191.2M may reflect different entity perimeters or period cuts.',
    severity: 'high',
  },
  {
    id: 2,
    question: 'Why are the top 5 customers all AGFA intercompany (IC) entities?',
    answer: 'AGFA DPS (the manufacturing entity) sells products to AGFA national sales subsidiaries (AGFA NV Belgium, AGFA GmbH Germany, etc.) which then sell to end customers. The Sales Details file captures the DPS manufacturing entity perspective where these subsidiaries appear as "customers." This is normal in a hub-and-spoke distribution model. External end-customer data would require pulling from the subsidiary level or using a consolidated CRM view.',
    severity: 'medium',
  },
  {
    id: 3,
    question: 'Why does December AMSP margin drop to 46.4% vs 61.9% full-year average?',
    answer: 'December shows both the highest revenue month (EUR 21.8M) and the lowest AMSP margin (46.4%). Possible causes: (1) Year-end push with heavy discounting or rebate true-ups, (2) Speedset product (9.6% margin) having a disproportionately high December weight, (3) AMSP rate corrections or year-end true-up entries, (4) Large one-off deals at non-standard pricing. Investigation requires December product mix breakdown.',
    severity: 'medium',
  },
  {
    id: 4,
    question: 'Is BU code "DP" in some files the same as "M0" (Packaging)?',
    answer: 'Likely yes — "DP" appears to be a legacy BU code for Digital Packaging, while "M0" is the current SAP organizational code. This mapping inconsistency appears when joining RECO data (uses M0) with older reports (use DP). Confirmation required from the BW data dictionary or FP&A team.',
    severity: 'low',
  },
  {
    id: 5,
    question: 'What is the EUR 64M "no AMSP rate" amount and what is its actual margin?',
    answer: 'The AMSP Contribution file flags EUR 64M of net sales as having no AMSP rate assigned. This means the margin contribution for these transactions is unknown — they could be high or low margin. This is 33.6% of total net sales (EUR 190.6M). The recommendation is to assign AMSP rates to all product lines and investigate which budget classes drive this gap. Until resolved, the 61.9% AMSP margin figure is potentially understated or overstated.',
    severity: 'high',
  },
  {
    id: 6,
    question: 'Why is OIT tracked in units only, without EUR value?',
    answer: 'The Order Follow-up file (DPS_Customer order & revenue follow-up 2026.xlsx) was designed as a unit tracking tool for operational purposes (monitoring delivery milestones, delays) rather than as a financial planning tool. EUR order values exist in SAP SD (Sales & Distribution) module but have not been pulled into this tracker. The fix requires linking the order register (by order number/CRM ID) to the SAP SD order value fields.',
    severity: 'high',
  },
];

// KPI Definitions table
export const kpiDefinitions = [
  { kpi: 'Net Revenue (3rdP)', formula: 'Sum of Net Sales to third-party customers', source: 'AMSP Contribution file', unit: 'EUR', confidence: 'verified' },
  { kpi: 'AMSP Margin %', formula: 'AMSP Contribution / Net Sales 3rdP × 100', source: 'AMSP Contribution file', unit: '%', confidence: 'verified' },
  { kpi: 'CO-PA Gross Margin %', formula: 'Gross Margin / Net TO × 100', source: 'CO-PA GMPCOPA_1', unit: '%', confidence: 'verified' },
  { kpi: 'Budget Variance %', formula: '(Actual - Budget) / Budget × 100', source: 'RECO vs BP1 budget', unit: '%', confidence: 'derived' },
  { kpi: 'OIT Units', formula: 'Count of order intake records by period', source: 'Order follow-up file', unit: 'units', confidence: 'verified' },
  { kpi: 'OIT EUR Value', formula: 'Sum of order values at intake date', source: 'NOT AVAILABLE', unit: 'EUR', confidence: 'proxy' },
  { kpi: 'Revenue Recognition Units', formula: 'Count of RR records by period', source: 'Order follow-up file', unit: 'units', confidence: 'verified' },
  { kpi: 'Delayed Orders', formula: 'Count of orders with planned RR date > original RR date', source: 'Delayed tracker tab', unit: 'units', confidence: 'verified' },
  { kpi: 'IC Elimination', formula: 'RECO total revenue minus external revenue', source: 'RECO Analysis', unit: 'kEUR', confidence: 'derived' },
  { kpi: 'Budget by BC', formula: 'Budget revenue by budget class', source: 'NOT AVAILABLE', unit: 'kEUR', confidence: 'proxy' },
  { kpi: 'Pipeline EUR', formula: 'Sum of pipeline order values', source: 'NOT AVAILABLE', unit: 'EUR', confidence: 'proxy' },
  { kpi: 'HW vs Consumable Split', formula: 'Revenue by Financial Application dimension', source: 'NOT AVAILABLE', unit: 'EUR', confidence: 'proxy' },
];

// Data source catalog
export const dataSources = [
  {
    file: 'DPS_BP1_AMSP Contribution FY2025.xls',
    system: 'SAP BW / Access MDB',
    period: 'Jan–Dec 2025',
    entity: 'AGFA NV (DPS)',
    scope: '3rd party only',
    rows: 'N/A (pivot)',
    unit: 'EUR',
    lastRefreshed: 'Feb 2026',
    confidence: 'verified',
    keyMetrics: 'Net Sales, AMSP Valuation, AMSP Margin %',
  },
  {
    file: 'DPS_BP2_Detailed Sales Inquiry AGFA NV_FY2025.xls',
    system: 'SAP BW / Access MDB',
    period: 'Jan–Dec 2025',
    entity: 'AGFA NV',
    scope: '3rd party + IC',
    rows: '4,821',
    unit: 'EUR',
    lastRefreshed: 'Feb 2026',
    confidence: 'verified',
    keyMetrics: 'Net Sales by customer, country, material',
  },
  {
    file: 'DPS_BP2_RECO Analysis FY2025.xls',
    system: 'SAP BW / RECO',
    period: 'Jan–Dec 2025',
    entity: 'All DPS entities',
    scope: 'Incl. IC flows',
    rows: 'N/A (pivot)',
    unit: 'kEUR',
    lastRefreshed: 'Feb 2026',
    confidence: 'verified',
    keyMetrics: 'Total Revenue, IC Elimination, Budget variance',
  },
  {
    file: 'DPS_BP2_GMPCOPA_1 FY2025.xls',
    system: 'SAP CO-PA',
    period: 'Jan–Dec 2025',
    entity: 'AGFA NV',
    scope: '3rd party only',
    rows: 'N/A (pivot)',
    unit: 'EUR',
    lastRefreshed: 'Feb 2026',
    confidence: 'verified',
    keyMetrics: 'Gross Sales, Rebates, Net TO, COGS TP, Gross Margin',
  },
  {
    file: 'DPS_Customer order & revenue follow-up 2026.xlsx',
    system: 'Manual Excel',
    period: 'FY2024–FY2026 YTD',
    entity: 'All DPS entities',
    scope: 'Hardware units only',
    rows: '2,501',
    unit: 'Units',
    lastRefreshed: 'Mar 2026',
    confidence: 'verified',
    keyMetrics: 'OIT units, RR units, Delayed orders, Pipeline',
  },
  {
    file: '7.14 Order Book Overview pivot (BRM HQ views).xlsx',
    system: 'SAP BW / Manual',
    period: 'Current order book',
    entity: 'All DPS entities',
    scope: 'Order book snapshot',
    rows: 'N/A (19 sheets)',
    unit: 'kEUR',
    lastRefreshed: 'Feb 2026',
    confidence: 'estimated',
    keyMetrics: 'Order book by region, revenue stream, bucket',
  },
  {
    file: 'Order Book detailed pivot.xlsm',
    system: 'SAP / VBA',
    period: 'Current order book',
    entity: 'All DPS entities',
    scope: 'Project level detail',
    rows: '~500 (est.)',
    unit: 'EUR (full)',
    lastRefreshed: 'Feb 2026',
    confidence: 'estimated',
    keyMetrics: 'Project-level order book with CRM IDs, planned receipt dates',
  },
];
