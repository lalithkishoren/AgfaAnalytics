import { useMemo } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Alert,
  AlertTitle,
  Skeleton,
} from '@mui/material';
import {
  LineChart,
  Line,
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
import { DataQuality } from '../types';
import { useOIMonthly, useOIYTD, useOBTimeline, useOBRegional, useTacoByMonthBU } from '../hooks/useData';
import { useFilters, matchOIRegion, matchOBFull, matchBU } from '../context/FilterContext';

const CHART_COLORS = ['#003C7E', '#E63312', '#2196F3', '#4CAF50', '#FF9800', '#9C27B0'];

function simplifyBucket(bucket: string): string {
  if (bucket === 'Planned Current Year') return 'Planned CY';
  if (bucket === 'Planned Next Years') return 'Planned NY';
  if (bucket.toLowerCase().includes('overdue')) return 'Overdue';
  return 'Not Planned';
}

const LATEST_SNAPSHOT = '2026-01';
const LATEST_PERIOD = '2026-02';

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

export default function ExecutiveOverview() {
  const { data: oiData, loading: oiLoading } = useOIMonthly();
  const { data: ytdData, loading: ytdLoading } = useOIYTD();
  const { data: obData, loading: obLoading } = useOBTimeline();
  const { data: obRegionalData } = useOBRegional();
  const { data: tacoData, loading: tacoLoading } = useTacoByMonthBU();

  const { filters } = useFilters();
  const { selectedBU, selectedRegion, selectedCountry, selectedYear } = filters;

  // KPI 1: OI MONTH ACT for latest snapshot — respects BU + region filters
  const kpiOIMonth = useMemo(() => {
    if (!oiData) return { act: null, bud: null };
    const snap = oiData.filter(
      (r) =>
        r.snapshot === LATEST_SNAPSHOT &&
        matchBU(r.bu, selectedBU) &&
        matchOIRegion(r.region, selectedRegion, selectedCountry),
    );
    const act = snap.filter((r) => r.key_figure === 'MONTH ACT').reduce((s, r) => s + r.value_keur, 0);
    const bud = snap.filter((r) => r.key_figure === 'MONTH BUD').reduce((s, r) => s + r.value_keur, 0);
    return { act, bud };
  }, [oiData, selectedBU, selectedRegion, selectedCountry]);

  // KPI 2: YTD ACT vs YTD BUD latest snapshot — respects BU filter
  const kpiYTD = useMemo(() => {
    if (!ytdData) return { act: null, bud: null };
    const snap = ytdData.filter(
      (r) => r.snapshot === LATEST_SNAPSHOT && matchBU(r.bu, selectedBU),
    );
    const act = snap.filter((r) => r.key_figure === 'YTD ACT').reduce((s, r) => s + r.value_keur, 0);
    const bud = snap.filter((r) => r.key_figure === 'YTD BUD').reduce((s, r) => s + r.value_keur, 0);
    return { act, bud };
  }, [ytdData, selectedBU]);

  const latestOBPeriod = useMemo(() => {
    if (!obData) return LATEST_PERIOD;
    return [...new Set(obData.map((r) => r.period))].sort().at(-1) ?? LATEST_PERIOD;
  }, [obData]);

  // KPI 3: OB total — uses regional data so BU + region + country all filter
  const kpiOB = useMemo(() => {
    if (!obRegionalData) return null;
    return obRegionalData
      .filter(
        (r) =>
          r.period === latestOBPeriod &&
          matchBU(r.bu, selectedBU) &&
          matchOBFull(r.region, selectedRegion, selectedCountry),
      )
      .reduce((s, r) => s + r.value_keur, 0);
  }, [obRegionalData, latestOBPeriod, selectedBU, selectedRegion, selectedCountry]);

  // KPI 4: TACO Revenue YTD — respects BU filter
  const kpiTacoRevenue = useMemo(() => {
    if (!tacoData) return null;
    return tacoData
      .filter((r) => matchBU(r.bu, selectedBU))
      .reduce((s, r) => s + r.actuals_keur, 0);
  }, [tacoData, selectedBU]);

  // OI Monthly trend chart — filtered by BU + region + year
  const oiTrendData = useMemo(() => {
    if (!oiData) return [];
    const snapshots = [...new Set(oiData.map((r) => r.snapshot))]
      .filter((s) => s.startsWith(selectedYear))
      .sort();
    return snapshots.map((snap) => {
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
        LY: Math.round(rows.filter((r) => r.key_figure === 'MONTH LY').reduce((s, r) => s + r.value_keur, 0)),
      };
    });
  }, [oiData, selectedBU, selectedRegion, selectedCountry, selectedYear]);

  // OB pie chart — uses regional data so region + country filter correctly
  const obPieData = useMemo(() => {
    if (!obRegionalData) return [];
    const rows = obRegionalData.filter(
      (r) =>
        r.period === latestOBPeriod &&
        matchBU(r.bu, selectedBU) &&
        matchOBFull(r.region, selectedRegion, selectedCountry),
    );
    const grouped: Record<string, number> = {};
    rows.forEach((r) => {
      const g = simplifyBucket(r.bucket);
      grouped[g] = (grouped[g] ?? 0) + r.value_keur;
    });
    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [obRegionalData, latestOBPeriod, selectedBU, selectedRegion, selectedCountry]);

  const buLabel = selectedBU.length === 1 ? selectedBU[0] : selectedBU.length > 1 ? selectedBU.join('+') : 'All BUs';

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1A2027' }}>
          Executive Overview
        </Typography>
        <Typography variant="body2" sx={{ color: '#637381', mt: 0.5 }}>
          High-level summary of Order Intake, Order Book, and TACO Revenue — BU: <strong>{buLabel}</strong>
          {selectedRegion.length > 0 && ` · Region: ${selectedRegion.join(', ')}`}
          {selectedCountry.length > 0 && ` · Country: ${selectedCountry.join(', ')}`}
        </Typography>
      </Box>

      {/* KPI Row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title={`OI Jan 2026 (${buLabel})`}
            value={kpiOIMonth.act}
            targetValue={kpiOIMonth.bud}
            subtitle="MONTH ACT vs MONTH BUD"
            quality={DataQuality.LIVE}
            loading={oiLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title={`YTD Order Intake (${buLabel})`}
            value={kpiYTD.act}
            targetValue={kpiYTD.bud}
            subtitle="YTD ACT vs YTD BUD"
            quality={DataQuality.LIVE}
            loading={ytdLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title={`Order Backlog ${buLabel} (${latestOBPeriod})`}
            value={kpiOB}
            subtitle="All buckets, latest period"
            quality={DataQuality.LIVE}
            loading={obLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title={`TACO Revenue YTD (${buLabel})`}
            value={kpiTacoRevenue}
            subtitle="Feb–Dec 2025 actuals"
            quality={DataQuality.PARTIAL}
            loading={tacoLoading}
            tooltipText="Jan 2025 data missing from TACO source"
          />
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2.5, height: 340 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              OI Monthly Trend — {buLabel} ({selectedYear}, kEUR)
            </Typography>
            {oiLoading ? (
              <Skeleton variant="rectangular" height={270} />
            ) : oiTrendData.length === 0 ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 270 }}>
                <Typography variant="body2" color="text.secondary">No data for selected filters</Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={270}>
                <LineChart data={oiTrendData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E3E7" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}M`} tick={{ fontSize: 11 }} width={48} />
                  <ReTooltip formatter={(val: number, name: string) => [`${fmtK(val)} kEUR`, name]} contentStyle={{ fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="ACT" stroke="#003C7E" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="BUD" stroke="#E63312" strokeWidth={1.5} strokeDasharray="5 3" dot={false} />
                  <Line type="monotone" dataKey="LY" stroke="#9E9E9E" strokeWidth={1.5} strokeDasharray="2 2" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2.5, height: 340 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Order Backlog by Bucket — {buLabel} ({latestOBPeriod})
            </Typography>
            {obLoading ? (
              <Skeleton variant="rectangular" height={270} />
            ) : obPieData.length === 0 ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 270 }}>
                <Typography variant="body2" color="text.secondary">No data for selected filters</Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={270}>
                <PieChart>
                  <Pie
                    data={obPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={105}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {obPieData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <ReTooltip formatter={(val: number) => [`${fmtK(val)} kEUR`]} contentStyle={{ fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Gap panels */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <GapPanel
            severity="gap"
            title="OI → OB Conversion Funnel"
            description="No shared key exists between Order Intake and Order Book source tables. A cross-dataset conversion funnel requires an EDW build to link records via a common opportunity or project identifier."
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <GapPanel
            severity="gap"
            title="TACO Forecast (FOR)"
            description="The TACO source file contains ACT, BUD, and LY columns only. No forecast column is available. Forecast visibility requires the FOR variant of the TACO extract."
          />
        </Grid>
      </Grid>

      {/* Alerts */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#1A2027' }}>
              Key Insights
            </Typography>
            <Grid container spacing={1.5}>
              <Grid item xs={12} md={4}>
                <Alert severity="info" sx={{ fontSize: '0.8rem' }}>
                  <AlertTitle sx={{ fontSize: '0.82rem' }}>Order Intake</AlertTitle>
                  OI data covers BU S1 only across all snapshots. 13 monthly snapshots available (Jan 2025 – Jan 2026).
                </Alert>
              </Grid>
              <Grid item xs={12} md={4}>
                <Alert severity="warning" sx={{ fontSize: '0.8rem' }}>
                  <AlertTitle sx={{ fontSize: '0.82rem' }}>TACO Revenue</AlertTitle>
                  January 2025 TACO data is missing from the source extract. YTD figures reflect Feb–Dec 2025 only.
                </Alert>
              </Grid>
              <Grid item xs={12} md={4}>
                <Alert severity="success" sx={{ fontSize: '0.8rem' }}>
                  <AlertTitle sx={{ fontSize: '0.82rem' }}>Order Book</AlertTitle>
                  OB data covers 9 BUs with 14 reporting periods. Overdue &gt;6 months bucket is available and tracked.
                </Alert>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
