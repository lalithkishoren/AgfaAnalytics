import { useState, useEffect } from 'react';
import {
  DashboardData, KPIs, OitTrendPoint, PipelineFunnel, EquipmentMix,
  RegionBreakdown, KamScorecard, FunnelHealthPoint, WinLoss,
  FeedfileSummary, DealerTarget,
} from '../types';

const DEFAULT_KPIS: KPIs = {
  currentWeek: 'W12',
  lastRefreshed: '2026-03-21',
  oitYTD2026: 0,
  oitFY2025: 0,
  oitFY2024: 0,
  openPipelineTotal: 0,
  openPipelineCount: 0,
  wonDeals2026: 0,
  rtCY_W12: 0,
  rtBT_W12: 0,
  rtPY_W12: 0,
  plannedRecoCount: 0,
  sapOrderCount: 0,
};

const DEFAULT_WIN_LOSS: WinLoss = {
  overall: { won: 0, lost: 0, open: 0, winRate: 0 },
  byRegion: [],
  byEquipment: [],
  byDealSize: [],
  closedByQuarter: [],
};

const DEFAULT_FEEDFILE: FeedfileSummary = {
  revenueByYear: [],
  revenueByYearAndType: [],
  topDealers: [],
  channelMix: [],
};

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${process.env.PUBLIC_URL}/data/${path}`);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.statusText}`);
  return res.json();
}

export function useDataLoader(): DashboardData {
  const [data, setData] = useState<DashboardData>({
    kpis: DEFAULT_KPIS,
    oitTrend: [],
    pipelineFunnel: { snapshot: [], weeklyTrend: [] },
    equipmentMix: { oit2026Q1: [], oit2025FY: [], oit2024FY: [] },
    regionBreakdown: { oitByRegion2026: [], oitByRegion2025: [], pipelineW12: [] },
    kamScorecard: { weeks: [], kams: [] },
    funnelHealth: [],
    winLoss: DEFAULT_WIN_LOSS,
    feedfileSummary: DEFAULT_FEEDFILE,
    dealerTargets: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [
          kpis, oitTrend, pipelineFunnel, equipmentMix,
          regionBreakdown, kamScorecard, funnelHealth,
          winLoss, feedfileSummary, dealerTargets,
        ] = await Promise.all([
          fetchJson<KPIs>('kpis.json'),
          fetchJson<OitTrendPoint[]>('oit_trend.json'),
          fetchJson<PipelineFunnel>('pipeline_funnel.json'),
          fetchJson<EquipmentMix>('equipment_mix.json'),
          fetchJson<RegionBreakdown>('region_breakdown.json'),
          fetchJson<KamScorecard>('kam_scorecard.json'),
          fetchJson<FunnelHealthPoint[]>('funnel_health.json'),
          fetchJson<WinLoss>('win_loss.json'),
          fetchJson<FeedfileSummary>('feedfile_summary.json'),
          fetchJson<DealerTarget[]>('dealer_targets.json'),
        ]);

        if (!cancelled) {
          setData({
            kpis, oitTrend, pipelineFunnel, equipmentMix,
            regionBreakdown, kamScorecard, funnelHealth,
            winLoss, feedfileSummary, dealerTargets,
            loading: false,
            error: null,
          });
        }
      } catch (err: any) {
        if (!cancelled) {
          setData((prev) => ({ ...prev, loading: false, error: err.message }));
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return data;
}
