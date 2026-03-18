// OI (Order Intake) records
export interface OIRecord {
  snapshot: string;       // e.g. "2025-01"
  bu: string;             // e.g. "S1"
  region: string;
  fa_code: string;
  fa_desc: string;
  business_type: string;
  key_figure: string;     // MONTH ACT, MONTH FOR, MONTH LY, MONTH BUD, YTD ACT, YTD BUD, YTD LY, QTD ACT, QTD BUD, FY BUD, FY (A+F)
  value_keur: number;
}

// OI YTD aggregates
export interface OIYTDRecord {
  snapshot: string;
  bu: string;
  key_figure: string;
  value_keur: number;
}

// OI by business type
export interface OIBusinessTypeRecord {
  snapshot: string;
  bu: string;
  business_type: string;
  value_keur: number;
}

// OB (Order Book) timeline
export interface OBTimelineRecord {
  period: string;         // e.g. "2025-01"
  year: number;
  month: number;
  bu: string;
  bucket: string;
  value_keur: number;
}

// OB regional
export interface OBRegionalRecord {
  period: string;
  bu: string;
  region: string;
  bucket: string;
  value_keur: number;
}

// OB by FA group
export interface OBFARecord {
  period: string;
  bu: string;
  fa_grp2: string;
  value_keur: number;
}

// OB top customers
export interface OBTopCustomerRecord {
  customer: string;
  value_keur: number;
}

// OB recognition schedule
export interface OBScheduleRecord {
  pl_year: number;
  pl_qtr: number;
  bu: string;
  fa_desc: string;
  line_item: string;
  value_keur: number;
}

// OB detailed grid
export interface OBGridRecord {
  customer: string;
  project_code: string;
  project_desc: string;
  bu: string;
  region: string;
  fa_code: string;
  fa_desc: string;
  crm_id: string;
  pl_year: number;
  pl_qtr: number;
  line_item: string;
  rep_year: number;
  rep_month: number;
  value_keur: number;
}

// TACO monthly
export interface TacoMonthlyRecord {
  month: string;          // string '2','3'...'12'
  bu: string;
  fa_ranked: string;
  fa_detail: string;
  fa_line: string;
  actuals_keur: number;
  budget_keur: number;
  actuals_ly_keur: number;
}

// TACO by month and BU
export interface TacoByMonthBURecord {
  month: string;          // string '2','3'...'12'
  bu: string;
  actuals_keur: number;
  budget_keur: number;
  actuals_ly_keur: number;
}

// TACO key lines
export interface TacoKeyLinesRecord {
  month: string;
  bu: string;
  fa_ranked: string;
  fa_line: string;
  actuals_keur: number;
  budget_keur: number;
  actuals_ly_keur: number;
}

// TACO regional
export interface TacoRegionalRecord {
  month: string;
  bu: string;
  region: string;
  actuals_keur: number;
  budget_keur: number;
  actuals_ly_keur: number;
}

// Metadata
export interface Metadata {
  bu_options: string[];
  region_options: string[];
  snapshot_options: string[];
  period_options: string[];
  year_options: string[];
}

// Filter state
export interface FilterState {
  selectedBU: string[];
  selectedRegion: string[];   // high-level group: EMEA / Americas / APAC
  selectedCountry: string[];  // specific country/sub-region (cascades from selectedRegion)
  selectedYear: string;
  selectedPeriod: string;
  selectedSnapshot: string;
}

// Data quality enum
export enum DataQuality {
  LIVE = 'live',
  PARTIAL = 'partial',
  GAP = 'gap',
  DERIVED = 'derived',
}

// Generic async data wrapper
export interface AsyncData<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
