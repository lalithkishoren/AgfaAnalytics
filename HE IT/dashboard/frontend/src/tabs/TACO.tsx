import { useMemo } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from 'recharts';
import KPICard from '../components/KPICard';
import GapPanel from '../components/GapPanel';
import { DataQuality } from '../types';
import { useTacoKeyLines, useTacoByMonthBU, useTacoRegional } from '../hooks/useData';
import { useFilters, matchBU, matchTACOFull } from '../context/FilterContext';

function fmtK(v: number) {
  return v.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function monthLabel(m: string): string {
  const names = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const n = parseInt(m, 10);
  return names[n] ?? m;
}

const KEY_LINES: Record<string, string> = {
  '02': 'Net Sales HW',
  '07': 'Net Sales Own Lic',
  '09': 'Net Sales Subs',
  '11': 'Net Sales 3rd Party',
  '26': 'Net Sales Total',
  '55': 'TACO Margin',
  '63': 'Product Contribution',
  '85': 'TACO Contribution',
};

const WATERFALL_LINES = ['02', '07', '09', '11', '26', '55', '85'];
const BU_COLORS: Record<string, string> = {
  S1: '#003C7E', S2: '#2196F3', S4: '#4CAF50', JB: '#FF9800',
};

export default function TACO() {
  const { data: keyLinesData, loading: klLoading } = useTacoKeyLines();
  const { data: monthBUData, loading: mbLoading } = useTacoByMonthBU();
  const { data: regionalData, loading: regLoading } = useTacoRegional();

  const { filters } = useFilters();
  const { selectedBU, selectedRegion, selectedCountry } = filters;

  const regionActive = selectedRegion.length > 0 || selectedCountry.length > 0;

  // KPIs — filtered by BU only (taco_key_lines has no region field)
  // When region filter is active, KPIs still show BU-level totals with a warning
  const kpis = useMemo(() => {
    if (!keyLinesData) return { netSales: null, tacoMargin: null, tacoContrib: null, marginPct: null, netSalesBud: null };
    const rows = keyLinesData.filter((r) => matchBU(r.bu, selectedBU));
    const findRows = (code: string) => rows.filter((r) => r.fa_line === code);
    const netSalesRows = findRows('26');
    const marginRows   = findRows('55');
    const contribRows  = findRows('85');
    const netSales    = netSalesRows.reduce((s, r) => s + r.actuals_keur, 0);
    const netSalesBud = netSalesRows.reduce((s, r) => s + r.budget_keur, 0);
    const tacoMargin  = marginRows.reduce((s, r) => s + r.actuals_keur, 0);
    const tacoContrib = contribRows.reduce((s, r) => s + r.actuals_keur, 0);
    const marginPct   = netSales !== 0 ? (tacoMargin / netSales) * 100 : null;
    return {
      netSales:    Math.round(netSales),
      tacoMargin:  Math.round(tacoMargin),
      tacoContrib: Math.round(tacoContrib),
      marginPct:   marginPct !== null ? parseFloat(marginPct.toFixed(1)) : null,
      netSalesBud: Math.round(netSalesBud),
    };
  }, [keyLinesData, selectedBU]);

  const primaryBU = selectedBU.length > 0 ? selectedBU[0] : 'S1';

  // Monthly revenue chart:
  // — when region filter active: use taco_regional (has region, no FA line) → total revenue only
  // — when no region filter: use taco_by_month_bu as before
  const monthlyChartData = useMemo(() => {
    if (regionActive && regionalData) {
      const rows = regionalData.filter(
        (r) => r.bu === primaryBU && matchTACOFull(r.region, selectedRegion, selectedCountry),
      );
      const months = [...new Set(rows.map((r) => r.month))].sort((a, b) => parseInt(a) - parseInt(b));
      return months.map((m) => {
        const monthRows = rows.filter((r) => r.month === m);
        return {
          name: monthLabel(m),
          ACT: Math.round(monthRows.reduce((s, r) => s + r.actuals_keur, 0)),
          BUD: Math.round(monthRows.reduce((s, r) => s + r.budget_keur, 0)),
          LY:  Math.round(monthRows.reduce((s, r) => s + r.actuals_ly_keur, 0)),
        };
      });
    }
    if (!monthBUData) return [];
    const rows = monthBUData.filter((r) => r.bu === primaryBU);
    const months = [...new Set(rows.map((r) => r.month))].sort((a, b) => parseInt(a) - parseInt(b));
    return months.map((m) => {
      const row = rows.find((r) => r.month === m);
      return {
        name: monthLabel(m),
        ACT: row ? Math.round(row.actuals_keur) : 0,
        BUD: row ? Math.round(row.budget_keur) : 0,
        LY:  row ? Math.round(row.actuals_ly_keur) : 0,
      };
    });
  }, [monthBUData, regionalData, primaryBU, regionActive, selectedRegion, selectedCountry]);

  // P&L waterfall — BU filtered only (no region in source)
  const plData = useMemo(() => {
    if (!keyLinesData) return [];
    const rows = keyLinesData.filter((r) => matchBU(r.bu, selectedBU));
    return WATERFALL_LINES.map((code) => {
      const lineRows = rows.filter((r) => r.fa_line === code);
      const act = lineRows.reduce((s, r) => s + r.actuals_keur, 0);
      const bud = lineRows.reduce((s, r) => s + r.budget_keur, 0);
      const ly  = lineRows.reduce((s, r) => s + r.actuals_ly_keur, 0);
      return { name: KEY_LINES[code] ?? code, ACT: Math.round(act), BUD: Math.round(bud), LY: Math.round(ly) };
    }).filter((d) => d.ACT !== 0 || d.BUD !== 0);
  }, [keyLinesData, selectedBU]);

  // BU comparison:
  // — when region filter active: use taco_regional summed per BU per month
  // — when no region filter: use taco_by_month_bu
  const displayBUs = selectedBU.length > 0 ? selectedBU : ['S1', 'S2', 'S4'];
  const buCompData = useMemo(() => {
    if (regionActive && regionalData) {
      const months = [...new Set(regionalData.map((r) => r.month))].sort((a, b) => parseInt(a) - parseInt(b));
      return months.map((m) => {
        const entry: Record<string, number | string> = { name: monthLabel(m) };
        displayBUs.forEach((bu) => {
          const buRows = regionalData.filter(
            (r) => r.bu === bu && r.month === m && matchTACOFull(r.region, selectedRegion, selectedCountry),
          );
          entry[bu] = Math.round(buRows.reduce((s, r) => s + r.actuals_keur, 0));
        });
        return entry;
      });
    }
    if (!monthBUData) return [];
    const months = [...new Set(monthBUData.map((r) => r.month))].sort((a, b) => parseInt(a) - parseInt(b));
    return months.map((m) => {
      const entry: Record<string, number | string> = { name: monthLabel(m) };
      displayBUs.forEach((bu) => {
        const row = monthBUData.find((r) => r.bu === bu && r.month === m);
        entry[bu] = row ? Math.round(row.actuals_keur) : 0;
      });
      return entry;
    });
  }, [monthBUData, regionalData, displayBUs, regionActive, selectedRegion, selectedCountry]);

  const buLabel = selectedBU.length === 1 ? selectedBU[0] : selectedBU.length > 1 ? selectedBU.join('+') : 'All BUs';
  const isMonthlyLoading = regionActive ? regLoading : mbLoading;

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>TACO — P&L Analytics</Typography>
        <Typography variant="body2" sx={{ color: '#637381', mt: 0.5 }}>
          Technology and Cost Overview — revenue, margin, and contribution analysis.
          BU: <strong>{buLabel}</strong>. Note: January 2025 data is missing from source.
        </Typography>
      </Box>

      {/* Region limitation notice */}
      {regionActive && (
        <Alert severity="info" sx={{ mb: 2, fontSize: '0.8rem' }}>
          KPI cards and P&amp;L breakdown reflect <strong>BU-level totals</strong> — the TACO source does not include a region breakdown at FA line level. The monthly revenue and BU comparison charts below are filtered by region.
        </Alert>
      )}

      {/* KPI Row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title={`Net Sales Total (${buLabel} YTD)`}
            value={kpis.netSales}
            targetValue={kpis.netSalesBud}
            subtitle="Line 26 — Feb–Dec 2025"
            quality={DataQuality.LIVE}
            loading={klLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title={`TACO Margin (${buLabel} YTD)`}
            value={kpis.tacoMargin}
            subtitle="Line 55"
            quality={DataQuality.LIVE}
            loading={klLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title={`TACO Contribution (${buLabel} YTD)`}
            value={kpis.tacoContrib}
            subtitle="Line 85"
            quality={DataQuality.LIVE}
            loading={klLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title={`TACO Margin % (${buLabel})`}
            value={kpis.marginPct}
            unit="%"
            subtitle="Line 55 / Line 26"
            quality={DataQuality.DERIVED}
            loading={klLoading}
          />
        </Grid>
      </Grid>

      {/* Monthly Revenue + BU Comparison */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2.5, height: 350 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
              Monthly Revenue — {primaryBU} (ACT vs BUD vs LY, kEUR)
            </Typography>
            <Typography variant="caption" sx={{ color: '#E63312', display: 'block', mb: 1.5 }}>
              Jan 2025 missing from source — partial data
            </Typography>
            {isMonthlyLoading ? (
              <Skeleton variant="rectangular" height={270} />
            ) : monthlyChartData.length === 0 ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 270 }}>
                <Typography variant="body2" color="text.secondary">No data for selected BU</Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={270}>
                <ComposedChart data={monthlyChartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E3E7" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}M`} tick={{ fontSize: 11 }} width={50} />
                  <ReTooltip formatter={(val: number, name: string) => [`${fmtK(val)} kEUR`, name]} contentStyle={{ fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="ACT" fill="#003C7E" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="BUD" fill="#E63312" opacity={0.7} radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="LY" stroke="#9E9E9E" strokeWidth={1.5} strokeDasharray="3 3" dot={{ r: 2 }} />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2.5, height: 350 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              BU Comparison — Monthly Actuals (kEUR)
            </Typography>
            {isMonthlyLoading ? (
              <Skeleton variant="rectangular" height={270} />
            ) : (
              <ResponsiveContainer width="100%" height={270}>
                <BarChart data={buCompData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E3E7" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}M`} tick={{ fontSize: 11 }} width={48} />
                  <ReTooltip formatter={(val: number, name: string) => [`${fmtK(val)} kEUR`, name]} contentStyle={{ fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  {displayBUs.map((bu) => (
                    <Bar key={bu} dataKey={bu} fill={BU_COLORS[bu] ?? '#9E9E9E'} radius={[3, 3, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* P&L Key Lines */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2.5, height: 340 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              P&L Key Lines — {buLabel} YTD (kEUR, ACT vs BUD vs LY)
            </Typography>
            {klLoading ? (
              <Skeleton variant="rectangular" height={270} />
            ) : plData.length === 0 ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 270 }}>
                <Typography variant="body2" color="text.secondary">No data for selected filters</Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={270}>
                <BarChart data={plData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E3E7" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}M`} tick={{ fontSize: 11 }} width={52} />
                  <ReTooltip formatter={(val: number, name: string) => [`${fmtK(val)} kEUR`, name]} contentStyle={{ fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="ACT" fill="#003C7E" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="BUD" fill="#E63312" opacity={0.7} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="LY"  fill="#9E9E9E" opacity={0.6} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <GapPanel
            severity="gap"
            title="TACO Forecast (FOR)"
            description="The TACO source extract contains Actuals (ACT), Budget (BUD), and Last Year (LY) columns only. No forecast (FOR) column is available. Forecast data requires a dedicated TACO FOR extract."
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <GapPanel
            severity="partial"
            title="FX Rates"
            description="All TACO values are reported in EUR as extracted. Selectable FX cross-rate is not applied — actual transaction-level FX rates are not available in the current data source."
          />
        </Grid>
      </Grid>
    </Box>
  );
}
