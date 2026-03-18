import { useMemo } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Skeleton,
  Divider,
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
} from 'recharts';
import GapPanel from '../components/GapPanel';
import DataQualityBadge from '../components/DataQualityBadge';
import { DataQuality } from '../types';
import { useOIMonthly, useOBTimeline, useTacoByMonthBU } from '../hooks/useData';
import { useFilters, matchOIRegion, matchBU } from '../context/FilterContext';

function fmtK(v: number) {
  return v.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function monthLabel(m: string): string {
  const names = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const n = parseInt(m, 10);
  return names[n] ?? m;
}

const PERIOD_LABELS: Record<string, string> = {
  '2025-01': 'Jan 25', '2025-02': 'Feb 25', '2025-03': 'Mar 25',
  '2025-04': 'Apr 25', '2025-05': 'May 25', '2025-06': 'Jun 25',
  '2025-07': 'Jul 25', '2025-08': 'Aug 25', '2025-09': 'Sep 25',
  '2025-10': 'Oct 25', '2025-11': 'Nov 25', '2025-12': 'Dec 25',
  '2026-01': 'Jan 26', '2026-02': 'Feb 26',
};

function simplifyBucket(bucket: string): string {
  if (bucket === 'Planned Current Year') return 'Planned CY';
  if (bucket === 'Planned Next Years') return 'Planned NY';
  if (bucket.toLowerCase().includes('overdue')) return 'Overdue';
  return 'Not Planned';
}

const BUCKET_COLORS: Record<string, string> = {
  'Planned CY': '#003C7E',
  'Planned NY': '#2196F3',
  'Overdue': '#E63312',
  'Not Planned': '#FF9800',
};

export default function RevenueLifecycle() {
  const { data: oiData, loading: oiLoading } = useOIMonthly();
  const { data: obData, loading: obLoading } = useOBTimeline();
  const { data: tacoData, loading: tacoLoading } = useTacoByMonthBU();

  const { filters } = useFilters();
  const { selectedBU, selectedRegion, selectedCountry, selectedYear } = filters;

  // OI trend — filtered by BU + region + year
  const oiChartData = useMemo(() => {
    if (!oiData) return [];
    const snaps = [...new Set(oiData.map((r) => r.snapshot))]
      .filter((s) => s.startsWith(selectedYear))
      .sort();
    return snaps.map((snap) => {
      const rows = oiData.filter(
        (r) =>
          r.snapshot === snap &&
          r.key_figure === 'MONTH ACT' &&
          matchBU(r.bu, selectedBU) &&
          matchOIRegion(r.region, selectedRegion, selectedCountry),
      );
      return {
        name: PERIOD_LABELS[snap] ?? snap,
        'OI ACT': Math.round(rows.reduce((s, r) => s + r.value_keur, 0)),
      };
    });
  }, [oiData, selectedBU, selectedRegion, selectedCountry, selectedYear]);

  // OB evolution — filtered by BU + year
  const obChartData = useMemo(() => {
    if (!obData) return [];
    const periods = [...new Set(obData.map((r) => r.period))]
      .filter((p) => p.startsWith(selectedYear))
      .sort();
    return periods.map((period) => {
      const rows = obData.filter((r) => r.period === period && matchBU(r.bu, selectedBU));
      const grouped: Record<string, number> = { 'Planned CY': 0, 'Planned NY': 0, 'Overdue': 0, 'Not Planned': 0 };
      rows.forEach((r) => { grouped[simplifyBucket(r.bucket)] += r.value_keur; });
      return {
        name: PERIOD_LABELS[period] ?? period,
        'Planned CY':  Math.round(grouped['Planned CY']),
        'Planned NY':  Math.round(grouped['Planned NY']),
        'Overdue':     Math.round(grouped['Overdue']),
        'Not Planned': Math.round(grouped['Not Planned']),
      };
    });
  }, [obData, selectedBU, selectedYear]);

  // TACO revenue — filtered by BU (first selected)
  const primaryBU = selectedBU.length > 0 ? selectedBU[0] : 'S1';
  const tacoChartData = useMemo(() => {
    if (!tacoData) return [];
    const rows = tacoData.filter((r) => r.bu === primaryBU);
    const months = [...new Set(rows.map((r) => r.month))].sort((a, b) => parseInt(a) - parseInt(b));
    return months.map((m) => {
      const row = rows.find((r) => r.month === m);
      return {
        name: monthLabel(m) + ' 25',
        Revenue: row ? Math.round(row.actuals_keur) : 0,
        Budget:  row ? Math.round(row.budget_keur) : 0,
      };
    });
  }, [tacoData, primaryBU]);

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Revenue Lifecycle</Typography>
        <Typography variant="body2" sx={{ color: '#637381', mt: 0.5 }}>
          View of the full revenue journey: Order Intake → Order Book → TACO Revenue.
          BU: <strong>{selectedBU.length > 0 ? selectedBU.join('+') : 'All BUs'}</strong>
          {selectedRegion.length > 0 && ` · Region: ${selectedRegion.join(', ')}`}
          {selectedCountry.length > 0 && ` · Country: ${selectedCountry.join(', ')}`}
          {' '}— Each panel is independent; a connected funnel requires EDW integration.
        </Typography>
      </Box>

      {/* Large gap panel */}
      <Box sx={{ mb: 3 }}>
        <GapPanel
          severity="gap"
          title="Revenue Lifecycle Funnel: OI → OB → Revenue Conversion"
          description="The OI → OB → Revenue conversion funnel cannot be drawn — no shared key exists across all three source tables. Order Intake records have no direct link to Order Book projects, and TACO Revenue has no customer or project dimension. These three panels show each metric independently as trend views. An EDW build is required to connect the funnel with a common opportunity or project identifier."
        />
      </Box>

      {/* Three panels side by side */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* Panel 1: Order Intake */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2.5, height: 360 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: '#003C7E',
                  flexShrink: 0,
                }}
              />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                1. Order Intake
              </Typography>
              <DataQualityBadge quality={DataQuality.LIVE} size="small" />
            </Box>
            <Typography variant="caption" sx={{ color: '#637381', display: 'block', mb: 1.5 }}>
              Monthly MONTH ACT — BU S1 (kEUR)
            </Typography>
            <Divider sx={{ mb: 1.5 }} />
            {oiLoading ? (
              <Skeleton variant="rectangular" height={260} />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={oiChartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E3E7" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}M`} tick={{ fontSize: 10 }} width={44} />
                  <ReTooltip formatter={(val: number, name: string) => [`${fmtK(val)} kEUR`, name]} contentStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="OI ACT" stroke="#003C7E" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        {/* Panel 2: Order Book */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2.5, height: 360 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: '#E63312',
                  flexShrink: 0,
                }}
              />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                2. Order Book
              </Typography>
              <DataQualityBadge quality={DataQuality.LIVE} size="small" />
            </Box>
            <Typography variant="caption" sx={{ color: '#637381', display: 'block', mb: 1.5 }}>
              Backlog evolution stacked — BU S1 (kEUR)
            </Typography>
            <Divider sx={{ mb: 1.5 }} />
            {obLoading ? (
              <Skeleton variant="rectangular" height={260} />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={obChartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E3E7" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}M`} tick={{ fontSize: 10 }} width={44} />
                  <ReTooltip formatter={(val: number, name: string) => [`${fmtK(val)} kEUR`, name]} contentStyle={{ fontSize: 11 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="Planned CY" stackId="a" fill={BUCKET_COLORS['Planned CY']} />
                  <Bar dataKey="Planned NY" stackId="a" fill={BUCKET_COLORS['Planned NY']} />
                  <Bar dataKey="Overdue" stackId="a" fill={BUCKET_COLORS['Overdue']} />
                  <Bar dataKey="Not Planned" stackId="a" fill={BUCKET_COLORS['Not Planned']} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        {/* Panel 3: TACO Revenue */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2.5, height: 360 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: '#4CAF50',
                  flexShrink: 0,
                }}
              />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                3. TACO Revenue
              </Typography>
              <DataQualityBadge quality={DataQuality.PARTIAL} size="small" />
            </Box>
            <Typography variant="caption" sx={{ color: '#637381', display: 'block', mb: 1.5 }}>
              Monthly actuals — BU S1 (kEUR) · Jan missing
            </Typography>
            <Divider sx={{ mb: 1.5 }} />
            {tacoLoading ? (
              <Skeleton variant="rectangular" height={260} />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={tacoChartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E3E7" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}M`} tick={{ fontSize: 10 }} width={44} />
                  <ReTooltip formatter={(val: number, name: string) => [`${fmtK(val)} kEUR`, name]} contentStyle={{ fontSize: 11 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="Revenue" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Budget" fill="#FF9800" opacity={0.7} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Connector note */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          bgcolor: '#F0F4FF',
          border: '1px solid #C5D5F0',
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" sx={{ color: '#003C7E', fontWeight: 500 }}>
          These three panels are independent data sources. To enable funnel conversion metrics (OI → Backlog Coverage %, Backlog → Revenue Conversion %), an EDW integration with a shared project/opportunity key is required.
        </Typography>
      </Paper>
    </Box>
  );
}
