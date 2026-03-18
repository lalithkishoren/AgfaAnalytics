// ─── Data Types ───────────────────────────────────────────────

export interface Customer {
  customerId: string;
  customerName: string;
  customerGroup: string;
  country: string;
  region: string;
  subRegion: string;
  address: string;
  paymentTerms: string;
  paymentGroup: string;
  icFlag: boolean;
}

export interface Quotation {
  id: string;
  sentDate: string;
  customer: string;
  country: string;
  region: string;
  product: string;
  totalSqm: number;
  eurPerM2: number;
  totalAmount: number;
  isOrdered: boolean;
  orderDate: string | null;
  year: number;
  daysToConvert: number | null;
  standardPricing: boolean;
}

export interface Order {
  orderId: string;
  customer: string;
  country: string;
  region: string;
  product: string;
  sqm: number;
  eurPerM2: number;
  amount: number;
  currency: string;
  status: number;
  date: string;
  sapOrderNum: string;
  invoiceNum: string;
  amountPaid: number | null;
  quotationRef: string;
  year: number;
}

export interface RevenueSummary {
  period: string;
  year: number;
  month: string;
  monthNum: number;
  product: string;
  customer: string;
  country: string;
  region: string;
  netTurnover: number;
  salesQty: number;
  stdCost: number;
  grossMargin: number;
  grossMarginPct: number;
  forType: string;
  thirdPartyOrIco: string;
}

export interface Forecast {
  forType: string;
  year: number;
  month: string;
  monthNum: number;
  customer: string;
  product: string;
  country: string;
  forecastEur: number;
  forecastM2: number;
}

export interface ForecastRevision {
  rfcCycle: string;
  month: string;
  monthNum: number;
  forecastValue: number;
  year: number;
}

export interface MarginData {
  month: string;
  monthNum: number;
  year: number;
  product: string;
  turnover: number;
  stdCost: number;
  grossMargin: number;
  gmPct: number;
  enpPerM2: number;
}

export interface LongTermPlan {
  year: number;
  revenue: number;
  volume: number;
  eurPerM2: number;
  type: 'actual' | 'forecast' | 'plan' | 'budget';
}

export interface KPIs {
  ytdRevenue: number;
  fullYearForecast: number;
  budgetTotal: number;
  budgetVariancePct: number;
  lyTotal: number;
  lyVariancePct: number;
  grossMarginPct: number;
  conversionRate: number;
  conversionRateByYear: Record<string, number>;
  pipelineValue: number;
  pipelineCount: number;
  openOrdersCount: number;
  openOrdersValue: number;
  topCustomerConcentration: { top5: number; top10: number };
  forecastComposition: {
    actuals: number;
    committed: number;
    uncommitted: number;
    unidentified: number;
  };
  revenueByYear: Record<string, number>;
  marginByProduct: Record<string, number>;
}

// ─── Filter Types ─────────────────────────────────────────────

export interface GlobalFilters {
  year: number | 'all';
  quarter: string | 'all';
  product: string | 'all';
  region: string | 'all';
  customer: string | 'all';
  forType: string | 'all';
  thirdPartyOrIco: string | 'all';
}

export type FilterAction =
  | { type: 'SET_YEAR'; payload: number | 'all' }
  | { type: 'SET_QUARTER'; payload: string | 'all' }
  | { type: 'SET_PRODUCT'; payload: string | 'all' }
  | { type: 'SET_REGION'; payload: string | 'all' }
  | { type: 'SET_CUSTOMER'; payload: string | 'all' }
  | { type: 'SET_FOR_TYPE'; payload: string | 'all' }
  | { type: 'SET_THIRD_PARTY'; payload: string | 'all' }
  | { type: 'SET_MULTIPLE'; payload: Partial<GlobalFilters> }
  | { type: 'RESET_ALL' };

// ─── Dashboard State ──────────────────────────────────────────

export interface DashboardData {
  customers: Customer[];
  quotations: Quotation[];
  orders: Order[];
  revenueSummary: RevenueSummary[];
  forecasts: Forecast[];
  forecastRevisions: ForecastRevision[];
  marginData: MarginData[];
  longTermPlans: LongTermPlan[];
  kpis: KPIs;
  loading: boolean;
  error: string | null;
}

export const TAB_LABELS = [
  'Overview',
  'Executive Summary',
  'Pipeline & Conversion',
  'Revenue & Orders',
  'Margin & Profitability',
  'Forecast & Plans',
  'Customer 360°',
] as const;

export type TabLabel = (typeof TAB_LABELS)[number];

// ─── Navigation ──────────────────────────────────────────────

export interface NavigateAction {
  tab: number;
  filters?: Partial<GlobalFilters>;
}
