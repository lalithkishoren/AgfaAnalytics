import React, { useMemo } from 'react';
import { Grid, Typography, Box, Card, CardContent } from '@mui/material';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PieChartIcon from '@mui/icons-material/PieChart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PercentIcon from '@mui/icons-material/Percent';
import InventoryIcon from '@mui/icons-material/Inventory';
import { KpiCard } from '../components/KpiCard';
import { DataConfidenceLegend } from '../components/DataConfidenceLegend';
import { AlertsPanel } from '../components/AlertsPanel';
import { DashboardData, GlobalFilters, NavigateAction } from '../types';
import { fmtEur, fmtPct, fmtNum } from '../utils/formatters';
import { FOR_TYPE_COLORS } from '../theme';

interface Props {
  data: DashboardData;
  filters: GlobalFilters;
  onNavigate: (nav: NavigateAction) => void;
}

const TREEMAP_COLORS = ['#1565C0', '#0D47A1', '#1976D2', '#42A5F5', '#64B5F6', '#90CAF9', '#00897B', '#00695C', '#4DB6AC', '#80CBC4'];

const ChartNote: React.FC<{ note: string }> = ({ note }) => (
  <Typography variant="caption" sx={{ display: 'block', mt: 1, fontSize: '0.65rem', color: '#E65100', fontStyle: 'italic', bgcolor: '#FFF8E1', px: 1, py: 0.5, borderRadius: 0.5 }}>
    {note}
  </Typography>
);

const OverviewTab: React.FC<Props> = ({ data, filters, onNavigate }) => {
  const { kpis, orders, longTermPlans } = data;

  // Apply global filters to orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      if (filters.year !== 'all' && o.year !== filters.year) return false;
      if (filters.product !== 'all' && o.product !== filters.product) return false;
      if (filters.region !== 'all' && o.region !== filters.region) return false;
      if (filters.customer !== 'all' && o.customer !== filters.customer) return false;
      return true;
    });
  }, [orders, filters]);

  // Filtered KPIs — recalculate from filtered orders where possible
  const filteredKpis = useMemo(() => {
    const eurCompleted = filteredOrders.filter(o => o.currency === 'EUR' && o.status === 2);
    const eurOpen = filteredOrders.filter(o => o.currency === 'EUR' && o.status === 1);
    const ytdRevenue = eurCompleted
      .filter(o => o.year === 2026)
      .reduce((s, o) => s + o.amount, 0);
    const openOrdersValue = eurOpen.reduce((s, o) => s + o.amount, 0);
    const openOrdersCount = eurOpen.length;

    return { ytdRevenue, openOrdersValue, openOrdersCount };
  }, [filteredOrders]);

  const isFiltered = filters.year !== 2026 || filters.product !== 'all' || filters.region !== 'all' || filters.customer !== 'all';

  // Revenue trend by year — VERIFIED: directly from Sales Zirfon GHS
  const revenueTrend = useMemo(() => {
    const byYear: Record<number, number> = {};
    filteredOrders.forEach(o => {
      if (o.currency === 'EUR' && o.status === 2) {
        byYear[o.year] = (byYear[o.year] || 0) + o.amount;
      }
    });
    const years = Object.keys(byYear).map(Number).sort();
    return years.map(y => ({
      year: String(y),
      revenue: byYear[y],
      label: fmtEur(byYear[y]),
    }));
  }, [filteredOrders]);

  // Forecast composition — ESTIMATED: hardcoded from manual reading of Feb2026 file
  const forecastComp = useMemo(() => {
    const { forecastComposition: fc } = kpis;
    return [
      { name: 'Actuals', value: fc.actuals, fill: FOR_TYPE_COLORS['Actuals'] },
      { name: 'Committed', value: fc.committed, fill: FOR_TYPE_COLORS['Committed'] },
      { name: 'Uncommitted', value: fc.uncommitted, fill: FOR_TYPE_COLORS['Uncommitted'] },
      { name: 'Unidentified', value: fc.unidentified, fill: FOR_TYPE_COLORS['Unidentified'] },
    ].filter(d => d.value > 0);
  }, [kpis]);

  // Customer concentration — VERIFIED from Sales Zirfon GHS
  const customerTreemap = useMemo(() => {
    const byCustomer: Record<string, number> = {};
    filteredOrders.forEach(o => {
      if (o.currency === 'EUR' && o.status === 2) {
        byCustomer[o.customer] = (byCustomer[o.customer] || 0) + o.amount;
      }
    });
    return Object.entries(byCustomer)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([name, value]) => ({
        name: name.length > 20 ? name.slice(0, 18) + '...' : name,
        fullName: name,
        value,
        label: fmtEur(value),
      }));
  }, [filteredOrders]);

  // Long-term plan chart — MIXED: 2022-2025 actual, 2026+ estimated/hardcoded
  const planChart = useMemo(() => {
    return longTermPlans.map(p => ({
      year: String(p.year),
      revenue: p.revenue / 1e6,
      volume: p.volume / 1000,
      type: p.type,
    }));
  }, [longTermPlans]);

  // Click handlers for drill-down
  const goToRevenue = () => onNavigate({ tab: 3, filters: { year: 2026 } });
  const goToForecast = () => onNavigate({ tab: 5 });
  const goToMargin = () => onNavigate({ tab: 4 });
  const goToPipeline = () => onNavigate({ tab: 2 });

  return (
    <Box>
      {/* Data Confidence Legend */}
      <DataConfidenceLegend />

      {/* KPI Row 1 */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box onClick={goToRevenue} sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-2px)', transition: 'transform 0.15s' } }}>
            <KpiCard
              title="YTD Revenue"
              value={fmtEur(isFiltered ? filteredKpis.ytdRevenue : kpis.ytdRevenue)}
              subtitle={isFiltered ? 'Filtered — FY2026 (EUR, completed)' : 'FY2026 Year-to-Date (EUR, completed)'}
              status={(isFiltered ? filteredKpis.ytdRevenue : kpis.ytdRevenue) < 2_000_000 ? 'red' : 'amber'}
              icon={<AssessmentIcon sx={{ fontSize: 32 }} />}
              dataConfidence="verified"
              dataNote="Click to drill down → Revenue & Orders. Source: Sales Zirfon GHS — EUR orders, Status=2, Year=2026"
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box onClick={goToForecast} sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-2px)', transition: 'transform 0.15s' } }}>
            <KpiCard
              title="Forecast vs Budget (FY)"
              value={fmtPct(kpis.budgetVariancePct)}
              subtitle={`FY FOR €6.2M vs FY BUD ${fmtEur(kpis.budgetTotal)}`}
              trend={kpis.budgetVariancePct}
              trendLabel="Full-Year Forecast vs Budget"
              status={kpis.budgetVariancePct > -10 ? 'green' : kpis.budgetVariancePct > -30 ? 'amber' : 'red'}
              icon={<TrendingDownIcon sx={{ fontSize: 32 }} />}
              dataConfidence="estimated"
              dataNote="Click to drill down → Forecast & Plans. ⚠ Full-year forecast (€6.2M) vs full-year budget (€17.3M) — NOT YTD."
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box onClick={goToForecast} sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-2px)', transition: 'transform 0.15s' } }}>
            <KpiCard
              title="Forecast vs Prior Year (FY)"
              value={fmtPct(kpis.lyVariancePct)}
              subtitle={`FY FOR €6.2M vs FY2025 ${fmtEur(kpis.lyTotal)}`}
              trend={kpis.lyVariancePct}
              trendLabel="Full-Year Forecast vs LY Actual"
              status={kpis.lyVariancePct > 0 ? 'green' : kpis.lyVariancePct > -20 ? 'amber' : 'red'}
              icon={<AccountBalanceWalletIcon sx={{ fontSize: 32 }} />}
              dataConfidence="estimated"
              dataNote="Click to drill down → Forecast & Plans. ⚠ Full-year forecast vs FY2025 actual — NOT YTD vs YTD."
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box onClick={goToMargin} sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-2px)', transition: 'transform 0.15s' } }}>
            <KpiCard
              title="Gross Margin"
              value={kpis.grossMarginPct > 0 ? fmtPct(kpis.grossMarginPct) : '—'}
              subtitle="FY2025 full-year (SAP BI CO-PA)"
              status={kpis.grossMarginPct > 58 ? 'green' : kpis.grossMarginPct > 50 ? 'amber' : 'red'}
              icon={<PercentIcon sx={{ fontSize: 32 }} />}
              dataConfidence="derived"
              dataNote="Click to drill down → Margin & Profitability. Calculated from FY2025 SAP BI raw data."
            />
          </Box>
        </Grid>
      </Grid>

      {/* KPI Row 2 */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box onClick={goToForecast} sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-2px)', transition: 'transform 0.15s' } }}>
            <KpiCard
              title="Full Year Forecast"
              value={fmtEur(kpis.fullYearForecast)}
              subtitle={`${((kpis.fullYearForecast / (kpis.budgetTotal || 1)) * 100).toFixed(0)}% of Budget`}
              status={kpis.fullYearForecast < 10_000_000 ? 'red' : 'amber'}
              icon={<ReceiptLongIcon sx={{ fontSize: 32 }} />}
              dataConfidence="estimated"
              dataNote="Click to drill down → Forecast & Plans. ⚠ Hardcoded €6.2M from FOR Summary sheet."
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box onClick={goToPipeline} sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-2px)', transition: 'transform 0.15s' } }}>
            <KpiCard
              title="Pipeline Value"
              value={fmtEur(kpis.pipelineValue)}
              subtitle={`${fmtNum(kpis.pipelineCount)} open quotes (all years)`}
              status="blue"
              icon={<PieChartIcon sx={{ fontSize: 32 }} />}
              dataConfidence="proxy"
              dataNote="Click to drill down → Pipeline & Conversion. ⚠ Includes ALL non-ordered quotes from 2023–2025 — many are stale."
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box onClick={goToPipeline} sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-2px)', transition: 'transform 0.15s' } }}>
            <KpiCard
              title="Conversion Rate"
              value={fmtPct(kpis.conversionRate)}
              subtitle="Quote-to-Order (overall 2023–2025)"
              trend={1}
              trendLabel="Improving YoY"
              status="green"
              icon={<ShoppingCartIcon sx={{ fontSize: 32 }} />}
              dataConfidence="verified"
              dataNote="Click to drill down → Pipeline & Conversion. Source: Quotation.xlsx — 240 ordered / 1,337 total = 18.0%."
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box onClick={goToRevenue} sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-2px)', transition: 'transform 0.15s' } }}>
            <KpiCard
              title="Open Orders"
              value={fmtEur(isFiltered ? filteredKpis.openOrdersValue : kpis.openOrdersValue)}
              subtitle={`${isFiltered ? filteredKpis.openOrdersCount : kpis.openOrdersCount} orders (Status=1${isFiltered ? ', filtered' : ', all years'})`}
              status={(isFiltered ? filteredKpis.openOrdersCount : kpis.openOrdersCount) < 130 ? 'amber' : 'green'}
              icon={<InventoryIcon sx={{ fontSize: 32 }} />}
              dataConfidence="derived"
              dataNote="Click to drill down → Revenue & Orders. Status=1 orders, EUR currency."
            />
          </Box>
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* Revenue Trend */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontSize: '0.95rem' }}>
                Revenue Trend (EUR, completed orders)
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={revenueTrend} onClick={(e: any) => {
                  if (e?.activeLabel) onNavigate({ tab: 3, filters: { year: Number(e.activeLabel) } });
                }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="year" fontSize={12} />
                  <YAxis tickFormatter={(v: number) => `€${(v/1e6).toFixed(0)}M`} fontSize={12} />
                  <Tooltip formatter={(v: any) => fmtEur(v)} />
                  <Area type="monotone" dataKey="revenue" stroke="#1565C0" fill="#E3F2FD" strokeWidth={2} style={{ cursor: 'pointer' }} />
                </AreaChart>
              </ResponsiveContainer>
              <ChartNote note="✅ Verified: Sales Zirfon GHS — EUR orders with Status=2. Click a year to drill down to Revenue & Orders tab." />
            </CardContent>
          </Card>
        </Grid>

        {/* Forecast Composition */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ cursor: 'pointer' }} onClick={goToForecast}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontSize: '0.95rem' }}>
                FY2026 Forecast Composition ({fmtEur(kpis.fullYearForecast)})
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={forecastComp} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis type="number" tickFormatter={(v: number) => fmtEur(v)} fontSize={12} />
                  <YAxis type="category" dataKey="name" width={100} fontSize={12} />
                  <Tooltip formatter={(v: any) => fmtEur(v)} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {forecastComp.map((entry, idx) => (
                      <Cell key={idx} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <ChartNote note="⚠ Estimated: Click to drill down to Forecast & Plans. Values hardcoded from Feb2026 FOR Summary." />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Customer Treemap + Long-Term Plans */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontSize: '0.95rem' }}>
                Customer Concentration (EUR Revenue{isFiltered ? ' — Filtered' : ' — All Years'})
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={customerTreemap} layout="vertical" onClick={(e: any) => {
                  if (e?.activePayload?.[0]?.payload?.fullName) {
                    onNavigate({ tab: 6, filters: { customer: e.activePayload[0].payload.fullName } });
                  }
                }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis type="number" tickFormatter={(v: any) => fmtEur(v)} fontSize={11} />
                  <YAxis type="category" dataKey="name" width={120} fontSize={10} />
                  <Tooltip formatter={(v: any) => fmtEur(v)} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} style={{ cursor: 'pointer' }}>
                    {customerTreemap.map((_, idx) => (
                      <Cell key={idx} fill={TREEMAP_COLORS[idx % TREEMAP_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <ChartNote note="⚠ Derived: Click a customer to view their 360° profile. Customer names NOT consolidated." />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontSize: '0.95rem' }}>
                Revenue: Actuals & Long-Term Plans (EUR M)
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={planChart} onClick={(e: any) => {
                  if (e?.activeLabel) onNavigate({ tab: 5 });
                }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="year" fontSize={12} />
                  <YAxis tickFormatter={(v: number) => `€${v}M`} fontSize={12} />
                  <Tooltip formatter={(v: any) => `€${v.toFixed(1)}M`} />
                  <Legend />
                  <Bar dataKey="revenue" name="Revenue (€M)" radius={[6, 6, 0, 0]} style={{ cursor: 'pointer' }}>
                    {planChart.map((entry, idx) => (
                      <Cell
                        key={idx}
                        fill={entry.type === 'actual' ? '#1565C0' : entry.type === 'forecast' ? '#F57C00' : entry.type === 'budget' ? '#78909C' : '#7B1FA2'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <ChartNote note="⚠ Mixed: Click to drill down to Forecast & Plans. 2022–2025 verified, 2026+ estimated/hardcoded." />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontSize: '0.95rem' }}>
            Key Alerts & Findings
          </Typography>
          <AlertsPanel kpis={kpis} />
        </CardContent>
      </Card>
    </Box>
  );
};

export default OverviewTab;
