import { useMemo } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Skeleton,
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import KPICard from '../components/KPICard';
import GapPanel from '../components/GapPanel';
import DataQualityBadge from '../components/DataQualityBadge';
import { DataQuality } from '../types';
import { useOIMonthly, useOIYTD, useOIBusinessType } from '../hooks/useData';
import { useFilters, matchOIRegion, matchBU } from '../context/FilterContext';

const CHART_COLORS = ['#003C7E', '#E63312', '#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#00BCD4'];

const LATEST_SNAPSHOT = '2026-01';

const MONTH_LABELS: Record<string, string> = {
  '2025-01': 'Jan 25', '2025-02': 'Feb 25', '2025-03': 'Mar 25',
  '2025-04': 'Apr 25', '2025-05': 'May 25', '2025-06': 'Jun 25',
  '2025-07': 'Jul 25', '2025-08': 'Aug 25', '2025-09': 'Sep 25',
  '2025-10': 'Oct 25', '2025-11': 'Nov 25', '2025-12': 'Dec 25',
  '2026-01': 'Jan 26',
};

function fmtK(v: number) {
  return v.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

export default function OrderIntake() {
  const { data: oiData, loading: oiLoading } = useOIMonthly();
  const { data: ytdData, loading: ytdLoading } = useOIYTD();
  const { data: btData, loading: btLoading } = useOIBusinessType();

  const { filters } = useFilters();
  const { selectedBU, selectedRegion, selectedCountry, selectedYear } = filters;

  // KPIs — latest snapshot, BU + region filtered
  const kpis = useMemo(() => {
    if (!oiData) return { monthAct: null, monthBud: null, monthLY: null };
    const snap = oiData.filter(
      (r) =>
        r.snapshot === LATEST_SNAPSHOT &&
        matchBU(r.bu, selectedBU) &&
        matchOIRegion(r.region, selectedRegion, selectedCountry),
    );
    const monthAct = snap.filter((r) => r.key_figure === 'MONTH ACT').reduce((s, r) => s + r.value_keur, 0);
    const monthBud = snap.filter((r) => r.key_figure === 'MONTH BUD').reduce((s, r) => s + r.value_keur, 0);
    const monthLY  = snap.filter((r) => r.key_figure === 'MONTH LY').reduce((s, r) => s + r.value_keur, 0);
    return { monthAct, monthBud, monthLY };
  }, [oiData, selectedBU, selectedRegion, selectedCountry]);

  // YTD — latest snapshot, BU filtered (YTD data has no region dimension)
  const { ytdAct, ytdBud } = useMemo(() => {
    if (!ytdData) return { ytdAct: null, ytdBud: null };
    const snap = ytdData.filter(
      (r) => r.snapshot === LATEST_SNAPSHOT && matchBU(r.bu, selectedBU),
    );
    const ytdAct = snap.filter((r) => r.key_figure === 'YTD ACT').reduce((s, r) => s + r.value_keur, 0);
    const ytdBud = snap.filter((r) => r.key_figure === 'YTD BUD').reduce((s, r) => s + r.value_keur, 0);
    return { ytdAct, ytdBud };
  }, [ytdData, selectedBU]);

  // Monthly trend — filtered by BU + region + year
  const trendData = useMemo(() => {
    if (!oiData) return [];
    const snaps = [...new Set(oiData.map((r) => r.snapshot))]
      .filter((s) => s.startsWith(selectedYear))
      .sort();
    return snaps.map((snap) => {
      const rows = oiData.filter(
        (r) =>
          r.snapshot === snap &&
          matchBU(r.bu, selectedBU) &&
          matchOIRegion(r.region, selectedRegion, selectedCountry),
      );
      return {
        name: MONTH_LABELS[snap] ?? snap,
        ACT: Math.round(rows.filter((r) => r.key_figure === 'MONTH ACT').reduce((s, r) => s + r.value_keur, 0)),
        BUD: Math.round(rows.filter((r) => r.key_figure === 'MONTH BUD').reduce((s, r) => s + r.value_keur, 0)),
        LY:  Math.round(rows.filter((r) => r.key_figure === 'MONTH LY').reduce((s, r) => s + r.value_keur, 0)),
      };
    });
  }, [oiData, selectedBU, selectedRegion, selectedCountry, selectedYear]);

  // By FA group — latest snapshot, BU + region filtered
  const faData = useMemo(() => {
    if (!oiData) return [];
    const snap = oiData.filter(
      (r) =>
        r.snapshot === LATEST_SNAPSHOT &&
        r.key_figure === 'MONTH ACT' &&
        matchBU(r.bu, selectedBU) &&
        matchOIRegion(r.region, selectedRegion, selectedCountry),
    );
    const grouped: Record<string, number> = {};
    snap.forEach((r) => {
      const key = r.fa_desc || 'Unknown';
      grouped[key] = (grouped[key] ?? 0) + r.value_keur;
    });
    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 15);
  }, [oiData, selectedBU, selectedRegion, selectedCountry]);

  // Business type pie — latest snapshot, BU filtered
  const btChartData = useMemo(() => {
    if (!btData) return [];
    const snap = btData.filter(
      (r) => r.snapshot === LATEST_SNAPSHOT && matchBU(r.bu, selectedBU),
    );
    return snap
      .map((r) => ({ name: r.business_type, value: Math.round(r.value_keur) }))
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [btData, selectedBU]);

  // By region — latest snapshot, BU + country filtered
  const regionData = useMemo(() => {
    if (!oiData) return [];
    const snap = oiData.filter(
      (r) =>
        r.snapshot === LATEST_SNAPSHOT &&
        r.key_figure === 'MONTH ACT' &&
        matchBU(r.bu, selectedBU) &&
        matchOIRegion(r.region, selectedRegion, selectedCountry),
    );
    const grouped: Record<string, number> = {};
    snap.forEach((r) => {
      if (r.region) grouped[r.region] = (grouped[r.region] ?? 0) + r.value_keur;
    });
    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [oiData, selectedBU, selectedRegion, selectedCountry]);

  const vsBudPct = kpis.monthAct !== null && kpis.monthBud ? ((kpis.monthAct / kpis.monthBud - 1) * 100) : null;
  const vsLYPct  = kpis.monthAct !== null && kpis.monthLY  ? ((kpis.monthAct / kpis.monthLY  - 1) * 100) : null;

  const buLabel = selectedBU.length === 1 ? selectedBU[0] : selectedBU.length > 1 ? selectedBU.join('+') : 'All BUs';

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Order Intake</Typography>
        <Typography variant="body2" sx={{ color: '#637381', mt: 0.5 }}>
          Monthly and YTD order intake performance — BU: <strong>{buLabel}</strong>
          {selectedRegion.length > 0 && ` · Region: ${selectedRegion.join(', ')}`}
          {selectedCountry.length > 0 && ` · Country: ${selectedCountry.join(', ')}`}
          {' '}· OI data covers BU S1 only.
        </Typography>
      </Box>

      {/* KPI Row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title={`Monthly OI ACT (Jan 26, ${buLabel})`}
            value={kpis.monthAct}
            targetValue={kpis.monthBud}
            subtitle="MONTH ACT vs MONTH BUD"
            quality={DataQuality.LIVE}
            loading={oiLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="vs Budget %"
            value={vsBudPct}
            unit="%"
            subtitle={`Budget: ${kpis.monthBud !== null ? fmtK(kpis.monthBud) : '—'} kEUR`}
            quality={DataQuality.DERIVED}
            loading={oiLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="vs Last Year %"
            value={vsLYPct}
            unit="%"
            subtitle={`LY: ${kpis.monthLY !== null ? fmtK(kpis.monthLY) : '—'} kEUR`}
            quality={DataQuality.DERIVED}
            loading={oiLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title={`YTD OI ACT (${buLabel})`}
            value={ytdAct}
            targetValue={ytdBud}
            subtitle="YTD ACT vs YTD BUD"
            quality={DataQuality.LIVE}
            loading={oiLoading || ytdLoading}
          />
        </Grid>
      </Grid>

      {/* Charts Row 1 */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2.5, height: 340 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Monthly OI Trend — {buLabel} ({selectedYear}, kEUR)
            </Typography>
            {oiLoading ? (
              <Skeleton variant="rectangular" height={270} />
            ) : trendData.length === 0 ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 270 }}>
                <Typography variant="body2" color="text.secondary">No data for selected filters</Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={270}>
                <LineChart data={trendData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E3E7" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}M`} tick={{ fontSize: 11 }} width={48} />
                  <ReTooltip formatter={(val: number, name: string) => [`${fmtK(val)} kEUR`, name]} contentStyle={{ fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="ACT" stroke="#003C7E" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="BUD" stroke="#E63312" strokeWidth={1.5} strokeDasharray="5 3" dot={false} />
                  <Line type="monotone" dataKey="LY"  stroke="#9E9E9E" strokeWidth={1.5} strokeDasharray="2 2" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2.5, height: 340 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Business Type Mix (Jan 26, {buLabel})
              </Typography>
              <DataQualityBadge quality={DataQuality.PARTIAL} size="small" />
            </Box>
            {btLoading ? (
              <Skeleton variant="rectangular" height={270} />
            ) : btChartData.length === 0 ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 270 }}>
                <Typography variant="body2" color="text.secondary">No data for selected filters</Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={270}>
                <PieChart>
                  <Pie
                    data={btChartData}
                    cx="50%"
                    cy="48%"
                    outerRadius={95}
                    dataKey="value"
                    nameKey="name"
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    labelLine={true}
                  >
                    {btChartData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <ReTooltip formatter={(val: number, name: string) => [`${fmtK(val)} kEUR`, name]} contentStyle={{ fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Charts Row 2 */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              OI by FA Group (Jan 26, {buLabel}, MONTH ACT)
            </Typography>
            {oiLoading ? (
              <Skeleton variant="rectangular" height={300} />
            ) : faData.length === 0 ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
                <Typography variant="body2" color="text.secondary">No data for selected filters</Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={Math.max(280, faData.length * 24)}>
                <BarChart data={faData} layout="vertical" margin={{ top: 0, right: 20, left: 4, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E3E7" horizontal={false} />
                  <XAxis type="number" tickFormatter={(v) => fmtK(v)} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" width={160} tick={{ fontSize: 11 }} />
                  <ReTooltip formatter={(val: number) => [`${fmtK(val)} kEUR`]} contentStyle={{ fontSize: 12 }} />
                  <Bar dataKey="value" name="MONTH ACT" fill="#003C7E" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              OI by Country / Sub-region (Jan 26, {buLabel})
            </Typography>
            {oiLoading ? (
              <Skeleton variant="rectangular" height={300} />
            ) : regionData.length === 0 ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 280 }}>
                <Typography variant="body2" color="text.secondary">
                  No data for selected filters
                </Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={Math.max(280, regionData.length * 48)}>
                <BarChart data={regionData} layout="vertical" margin={{ top: 0, right: 20, left: 4, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E3E7" horizontal={false} />
                  <XAxis type="number" tickFormatter={(v) => fmtK(v)} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11 }} />
                  <ReTooltip formatter={(val: number) => [`${fmtK(val)} kEUR`]} contentStyle={{ fontSize: 12 }} />
                  <Bar dataKey="value" name="MONTH ACT" fill="#E63312" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      <GapPanel
        severity="partial"
        title="Business Type in OB / TACO"
        description="The 'Business Type' dimension (Net New, Feature Upselling, Cross Selling, etc.) is only available in OI source data. It does not exist in Order Book or TACO source tables, so cross-metric business type analysis is not possible without an EDW enrichment."
      />
    </Box>
  );
}
