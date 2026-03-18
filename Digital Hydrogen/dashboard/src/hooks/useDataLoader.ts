import { useState, useEffect } from 'react';
import { DashboardData, Customer, Quotation, Order, RevenueSummary, Forecast, ForecastRevision, MarginData, LongTermPlan, KPIs } from '../types';

const DEFAULT_KPIS: KPIs = {
  ytdRevenue: 0,
  fullYearForecast: 0,
  budgetTotal: 0,
  budgetVariancePct: 0,
  lyTotal: 0,
  lyVariancePct: 0,
  grossMarginPct: 0,
  conversionRate: 0,
  conversionRateByYear: {},
  pipelineValue: 0,
  pipelineCount: 0,
  openOrdersCount: 0,
  openOrdersValue: 0,
  topCustomerConcentration: { top5: 0, top10: 0 },
  forecastComposition: { actuals: 0, committed: 0, uncommitted: 0, unidentified: 0 },
  revenueByYear: {},
  marginByProduct: {},
};

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${process.env.PUBLIC_URL}/data/${path}`);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.statusText}`);
  return res.json();
}

export function useDataLoader(): DashboardData {
  const [data, setData] = useState<DashboardData>({
    customers: [],
    quotations: [],
    orders: [],
    revenueSummary: [],
    forecasts: [],
    forecastRevisions: [],
    marginData: [],
    longTermPlans: [],
    kpis: DEFAULT_KPIS,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [customers, quotations, orders, revenueSummary, forecasts, forecastRevisions, marginData, longTermPlans, kpis] = await Promise.all([
          fetchJson<Customer[]>('customers.json'),
          fetchJson<Quotation[]>('quotations.json'),
          fetchJson<Order[]>('orders.json'),
          fetchJson<RevenueSummary[]>('revenue_summary.json'),
          fetchJson<Forecast[]>('forecast.json'),
          fetchJson<ForecastRevision[]>('forecast_revisions.json'),
          fetchJson<MarginData[]>('margin_data.json'),
          fetchJson<LongTermPlan[]>('long_term_plans.json'),
          fetchJson<KPIs>('kpis.json'),
        ]);

        if (!cancelled) {
          setData({
            customers,
            quotations,
            orders,
            revenueSummary,
            forecasts,
            forecastRevisions,
            marginData,
            longTermPlans,
            kpis,
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
