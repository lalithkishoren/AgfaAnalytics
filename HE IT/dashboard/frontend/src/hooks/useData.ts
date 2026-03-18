import { useState, useEffect, useRef } from 'react';
import {
  OIRecord,
  OIYTDRecord,
  OIBusinessTypeRecord,
  OBTimelineRecord,
  OBRegionalRecord,
  OBFARecord,
  OBTopCustomerRecord,
  OBScheduleRecord,
  OBGridRecord,
  TacoMonthlyRecord,
  TacoByMonthBURecord,
  TacoKeyLinesRecord,
  TacoRegionalRecord,
  AsyncData,
} from '../types';

// Generic fetch hook with in-memory cache
const cache = new Map<string, unknown>();

function useFetch<T>(url: string): AsyncData<T> {
  const [state, setState] = useState<AsyncData<T>>({
    data: cache.has(url) ? (cache.get(url) as T) : null,
    loading: !cache.has(url),
    error: null,
  });

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (cache.has(url)) {
      setState({ data: cache.get(url) as T, loading: false, error: null });
      return;
    }
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
        return res.json() as Promise<T>;
      })
      .then((data) => {
        if (!cancelled) {
          cache.set(url, data);
          setState({ data, loading: false, error: null });
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setState({ data: null, loading: false, error: err.message });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return state;
}

// ── OI hooks ─────────────────────────────────────────────────────────────────

export function useOIMonthly(): AsyncData<OIRecord[]> {
  return useFetch<OIRecord[]>('/data/oi_monthly.json');
}

export function useOIYTD(): AsyncData<OIYTDRecord[]> {
  return useFetch<OIYTDRecord[]>('/data/oi_ytd.json');
}

export function useOIBusinessType(): AsyncData<OIBusinessTypeRecord[]> {
  return useFetch<OIBusinessTypeRecord[]>('/data/oi_business_type.json');
}

// ── OB hooks ─────────────────────────────────────────────────────────────────

export function useOBTimeline(): AsyncData<OBTimelineRecord[]> {
  return useFetch<OBTimelineRecord[]>('/data/ob_timeline.json');
}

export function useOBRegional(): AsyncData<OBRegionalRecord[]> {
  return useFetch<OBRegionalRecord[]>('/data/ob_regional.json');
}

export function useOBFA(): AsyncData<OBFARecord[]> {
  return useFetch<OBFARecord[]>('/data/ob_fa.json');
}

export function useOBTopCustomers(): AsyncData<OBTopCustomerRecord[]> {
  return useFetch<OBTopCustomerRecord[]>('/data/ob_top_customers.json');
}

export function useOBSchedule(): AsyncData<OBScheduleRecord[]> {
  return useFetch<OBScheduleRecord[]>('/data/ob_schedule.json');
}

export function useOBGrid(): AsyncData<OBGridRecord[]> {
  return useFetch<OBGridRecord[]>('/data/ob_grid.json');
}

// ── TACO hooks ────────────────────────────────────────────────────────────────

export function useTacoMonthly(): AsyncData<TacoMonthlyRecord[]> {
  return useFetch<TacoMonthlyRecord[]>('/data/taco_monthly.json');
}

export function useTacoByMonthBU(): AsyncData<TacoByMonthBURecord[]> {
  return useFetch<TacoByMonthBURecord[]>('/data/taco_by_month_bu.json');
}

export function useTacoKeyLines(): AsyncData<TacoKeyLinesRecord[]> {
  return useFetch<TacoKeyLinesRecord[]>('/data/taco_key_lines.json');
}

export function useTacoRegional(): AsyncData<TacoRegionalRecord[]> {
  return useFetch<TacoRegionalRecord[]>('/data/taco_regional.json');
}

// ── Combined convenience hooks ────────────────────────────────────────────────

export function useOIData() {
  const monthly = useOIMonthly();
  const ytd = useOIYTD();
  const businessType = useOIBusinessType();
  return {
    monthly,
    ytd,
    businessType,
    loading: monthly.loading || ytd.loading || businessType.loading,
    error: monthly.error || ytd.error || businessType.error,
  };
}

export function useOBData() {
  const timeline = useOBTimeline();
  const regional = useOBRegional();
  const fa = useOBFA();
  const topCustomers = useOBTopCustomers();
  const schedule = useOBSchedule();
  const grid = useOBGrid();
  return {
    timeline,
    regional,
    fa,
    topCustomers,
    schedule,
    grid,
    loading:
      timeline.loading ||
      regional.loading ||
      fa.loading ||
      topCustomers.loading ||
      schedule.loading ||
      grid.loading,
    error:
      timeline.error ||
      regional.error ||
      fa.error ||
      topCustomers.error ||
      schedule.error ||
      grid.error,
  };
}

export function useTacoData() {
  const monthly = useTacoMonthly();
  const byMonthBU = useTacoByMonthBU();
  const keyLines = useTacoKeyLines();
  const regional = useTacoRegional();
  return {
    monthly,
    byMonthBU,
    keyLines,
    regional,
    loading: monthly.loading || byMonthBU.loading || keyLines.loading || regional.loading,
    error: monthly.error || byMonthBU.error || keyLines.error || regional.error,
  };
}
