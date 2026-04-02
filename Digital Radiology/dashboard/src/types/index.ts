// ─── DR Data Types ────────────────────────────────────────────────────────────

export interface KPIs {
  currentWeek: string;
  lastRefreshed: string;
  oitYTD2026: number;
  oitFY2025: number;
  oitFY2024: number;
  openPipelineTotal: number;
  openPipelineCount: number;
  wonDeals2026: number;
  rtCY_W12: number;
  rtBT_W12: number;
  rtPY_W12: number;
  plannedRecoCount: number;
  sapOrderCount: number;
}

export interface OitTrendPoint {
  period: string;
  oitEUR: number;
  dealCount: number;
}

export interface FunnelSnapshotItem {
  flag: string;
  sortOrder: number;
  amountEUR: number;
  weightedEUR: number;
  count: number;
}

export interface FunnelWeeklyPoint {
  week: string;
  Won?: number;
  IncludedAndSecured?: number;
  Included?: number;
  IncludedWithRisk?: number;
  Upside?: number;
  Pipeline?: number;
  totalOpen: number;
}

export interface PipelineFunnel {
  snapshot: FunnelSnapshotItem[];
  weeklyTrend: FunnelWeeklyPoint[];
}

export interface EquipmentMixItem {
  type: string;
  eurM: number;
  deals: number;
}

export interface EquipmentMix {
  oit2026Q1: EquipmentMixItem[];
  oit2025FY: EquipmentMixItem[];
  oit2024FY: EquipmentMixItem[];
}

export interface RegionOitItem {
  region: string;
  eurM: number;
  deals: number;
}

export interface RegionPipelineItem {
  region: string;
  wonEUR: number;
  committedEUR: number;
  upsideEUR: number;
}

export interface RegionBreakdown {
  oitByRegion2026: RegionOitItem[];
  oitByRegion2025: RegionOitItem[];
  pipelineW12: RegionPipelineItem[];
}

export interface KamData {
  name: string;
  region: string;
  weeklyAmounts: number[];
  weeklyWeighted: number[];
  w12Amount: number;
  w12Weighted: number;
  flagW12: string;
}

export interface KamScorecard {
  weeks: string[];
  kams: KamData[];
}

export interface FunnelHealthPoint {
  week: number;
  label: string;
  rtCY: number;
  rtBT: number;
  rtPY: number;
  rtFC: number;
  weeklyCY: number;
}

export interface WinLossOverall {
  won: number;
  lost: number;
  open: number;
  winRate: number;
}

export interface WinLossByRegion {
  region: string;
  won: number;
  lost: number;
  winRate: number;
}

export interface WinLossByEquipment {
  equipment: string;
  won: number;
  lost: number;
  winRate: number;
}

export interface WinLossBySize {
  band: string;
  won: number;
  lost: number;
  winRate: number;
}

export interface WinLossQuarter {
  period: string;
  won: number;
  wonEUR: number;
  lost: number;
}

export interface WinLoss {
  overall: WinLossOverall;
  byRegion: WinLossByRegion[];
  byEquipment: WinLossByEquipment[];
  byDealSize: WinLossBySize[];
  closedByQuarter: WinLossQuarter[];
}

export interface FeedfileRevenueByYear {
  year: number;
  eurM: number;
}

export interface FeedfileRevenueByYearType {
  year: number;
  type: string;
  eurM: number;
}

export interface FeedfileDealer {
  name: string;
  sapId: string;
  eurM: number;
}

export interface FeedfileChannelMix {
  channel: string;
  year: number;
  eurM: number;
}

export interface FeedfileSummary {
  revenueByYear: FeedfileRevenueByYear[];
  revenueByYearAndType: FeedfileRevenueByYearType[];
  topDealers: FeedfileDealer[];
  channelMix: FeedfileChannelMix[];
}

export interface DealerTarget {
  dealerMarket: string;
  dealerSapId: string;
  targetYear: number;
  targetQ1: number;
  targetQ2: number;
  targetQ3: number;
  targetQ4: number;
  actualEUR: number;
  forecastEUR: number;
}

// ─── Dashboard Data ───────────────────────────────────────────────────────────

export interface DashboardData {
  kpis: KPIs;
  oitTrend: OitTrendPoint[];
  pipelineFunnel: PipelineFunnel;
  equipmentMix: EquipmentMix;
  regionBreakdown: RegionBreakdown;
  kamScorecard: KamScorecard;
  funnelHealth: FunnelHealthPoint[];
  winLoss: WinLoss;
  feedfileSummary: FeedfileSummary;
  dealerTargets: DealerTarget[];
  loading: boolean;
  error: string | null;
}

// ─── Filter Types ─────────────────────────────────────────────────────────────

export interface GlobalFilters {
  year: number | 'all';
  quarter: string | 'all';
  equipment: string | 'all';
  region: string | 'all';
}

export type FilterAction =
  | { type: 'SET_YEAR'; payload: number | 'all' }
  | { type: 'SET_QUARTER'; payload: string | 'all' }
  | { type: 'SET_EQUIPMENT'; payload: string | 'all' }
  | { type: 'SET_REGION'; payload: string | 'all' }
  | { type: 'SET_MULTIPLE'; payload: Partial<GlobalFilters> }
  | { type: 'RESET_ALL' };

// ─── Navigation ──────────────────────────────────────────────────────────────

export interface NavigateAction {
  tab: number;
  filters?: Partial<GlobalFilters>;
}

// ─── Tab Labels ───────────────────────────────────────────────────────────────

export const TAB_LABELS = [
  'Executive Overview',
  'Commercial & Pipeline',
  'Sales Operations',
  'Order Book',
  'Revenue & Reco',
  'Margin Analysis',
  'Channel & Actuals',
  'Data Overview',
] as const;

export type TabLabel = typeof TAB_LABELS[number];
