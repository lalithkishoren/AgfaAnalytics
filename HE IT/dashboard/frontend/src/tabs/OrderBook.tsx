import { useMemo } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Skeleton,
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
} from 'recharts';
import KPICard from '../components/KPICard';
import GapPanel from '../components/GapPanel';
import { DataQuality } from '../types';
import { useOBTimeline, useOBRegional, useOBFA } from '../hooks/useData';
import { useFilters, matchOBFull, matchBU } from '../context/FilterContext';

const PERIOD_LABELS: Record<string, string> = {
  '2025-01': 'Jan 25', '2025-02': 'Feb 25', '2025-03': 'Mar 25',
  '2025-04': 'Apr 25', '2025-05': 'May 25', '2025-06': 'Jun 25',
  '2025-07': 'Jul 25', '2025-08': 'Aug 25', '2025-09': 'Sep 25',
  '2025-10': 'Oct 25', '2025-11': 'Nov 25', '2025-12': 'Dec 25',
  '2026-01': 'Jan 26', '2026-02': 'Feb 26',
};

const BUCKET_COLORS: Record<string, string> = {
  'Planned CY':  '#003C7E',
  'Planned NY':  '#2196F3',
  'Overdue':     '#E63312',
  'Not Planned': '#FF9800',
};

function simplifyBucket(bucket: string): 'Planned CY' | 'Planned NY' | 'Overdue' | 'Not Planned' {
  if (bucket === 'Planned Current Year') return 'Planned CY';
  if (bucket === 'Planned Next Years')   return 'Planned NY';
  if (bucket.toLowerCase().includes('overdue')) return 'Overdue';
  return 'Not Planned';
}

function fmtK(v: number) {
  return v.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

export default function OrderBook() {
  const { data: timelineData, loading: tlLoading } = useOBTimeline();
  const { data: regionalData, loading: regLoading } = useOBRegional();
  const { data: faData, loading: faLoading } = useOBFA();

  const { filters } = useFilters();
  const { selectedBU, selectedRegion, selectedCountry, selectedYear } = filters;

  // Latest period from data
  const latestPeriod = useMemo(() => {
    if (!timelineData) return '2026-02';
    return [...new Set(timelineData.map((r) => r.period))].sort().at(-1) ?? '2026-02';
  }, [timelineData]);

  // KPIs — use regionalData so BU + region + country all filter correctly
  // ob_regional.json has (period, bu, region, bucket, value_keur)
  const kpis = useMemo(() => {
    if (!regionalData) return { total: null, plannedCY: null, overdue: null, notPlanned: null };
    const rows = regionalData.filter(
      (r) =>
        r.period === latestPeriod &&
        matchBU(r.bu, selectedBU) &&
        matchOBFull(r.region, selectedRegion, selectedCountry),
    );
    let total = 0, plannedCY = 0, overdue = 0, notPlanned = 0;
    rows.forEach((r) => {
      const g = simplifyBucket(r.bucket);
      total += r.value_keur;
      if (g === 'Planned CY')       plannedCY  += r.value_keur;
      else if (g === 'Overdue')     overdue     += r.value_keur;
      else if (g === 'Not Planned') notPlanned  += r.value_keur;
    });
    return {
      total:      Math.round(total),
      plannedCY:  Math.round(plannedCY),
      overdue:    Math.round(overdue),
      notPlanned: Math.round(notPlanned),
    };
  }, [regionalData, latestPeriod, selectedBU, selectedRegion, selectedCountry]);

  // OB Evolution stacked bar — filtered by BU + year
  const evolutionData = useMemo(() => {
    if (!timelineData) return [];
    const periods = [...new Set(timelineData.map((r) => r.period))]
      .filter((p) => p.startsWith(selectedYear))
      .sort();
    return periods.map((period) => {
      const rows = timelineData.filter((r) => r.period === period && matchBU(r.bu, selectedBU));
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
  }, [timelineData, selectedBU, selectedYear]);

  // Regional breakdown — latest period, BU + region + country filtered
  const regionChartData = useMemo(() => {
    if (!regionalData) return [];
    const rows = regionalData.filter(
      (r) =>
        r.period === latestPeriod &&
        matchBU(r.bu, selectedBU) &&
        matchOBFull(r.region, selectedRegion, selectedCountry),
    );
    const grouped: Record<string, number> = {};
    rows.forEach((r) => {
      if (r.region) grouped[r.region] = (grouped[r.region] ?? 0) + r.value_keur;
    });
    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [regionalData, latestPeriod, selectedBU, selectedRegion, selectedCountry]);

  // FA group chart — latest period, BU filtered
  const faChartData = useMemo(() => {
    if (!faData) return [];
    const rows = faData.filter(
      (r) => r.period === latestPeriod && matchBU(r.bu, selectedBU),
    );
    const grouped: Record<string, number> = {};
    rows.forEach((r) => {
      const key = r.fa_grp2 || 'Other';
      grouped[key] = (grouped[key] ?? 0) + r.value_keur;
    });
    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 15);
  }, [faData, latestPeriod, selectedBU]);

  const buLabel = selectedBU.length === 1 ? selectedBU[0] : selectedBU.length > 1 ? selectedBU.join('+') : 'All BUs';

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Order Book</Typography>
        <Typography variant="body2" sx={{ color: '#637381', mt: 0.5 }}>
          Order backlog evolution, bucket composition, and regional distribution — BU: <strong>{buLabel}</strong>
          {selectedRegion.length > 0 && ` · Region: ${selectedRegion.join(', ')}`}
          {' '}· Latest period: {latestPeriod}.
        </Typography>
      </Box>

      {/* KPI Row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title={`Total OB ${buLabel} (${latestPeriod})`}
            value={kpis.total}
            subtitle="All buckets combined"
            quality={DataQuality.LIVE}
            loading={tlLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Planned Current Year"
            value={kpis.plannedCY}
            subtitle="Revenue planned for current year"
            quality={DataQuality.LIVE}
            loading={tlLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title={`Overdue Total (${buLabel})`}
            value={kpis.overdue}
            subtitle="≤6 months + >6 months overdue"
            quality={DataQuality.LIVE}
            loading={tlLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title={`Not Planned (${buLabel})`}
            value={kpis.notPlanned}
            subtitle="Opportunity pipeline"
            quality={DataQuality.LIVE}
            loading={tlLoading}
          />
        </Grid>
      </Grid>

      {/* OB Evolution */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2.5, height: 360 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Order Backlog Evolution — {buLabel} ({selectedYear}, Stacked, kEUR)
            </Typography>
            {tlLoading ? (
              <Skeleton variant="rectangular" height={290} />
            ) : evolutionData.length === 0 ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 290 }}>
                <Typography variant="body2" color="text.secondary">No data for selected filters</Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={290}>
                <BarChart data={evolutionData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E3E7" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}M`} tick={{ fontSize: 11 }} width={50} />
                  <ReTooltip formatter={(val: number, name: string) => [`${fmtK(val)} kEUR`, name]} contentStyle={{ fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="Planned CY"  stackId="a" fill={BUCKET_COLORS['Planned CY']} />
                  <Bar dataKey="Planned NY"  stackId="a" fill={BUCKET_COLORS['Planned NY']} />
                  <Bar dataKey="Overdue"     stackId="a" fill={BUCKET_COLORS['Overdue']} />
                  <Bar dataKey="Not Planned" stackId="a" fill={BUCKET_COLORS['Not Planned']} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Regional + FA Group */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              OB by Region — {buLabel} ({latestPeriod})
            </Typography>
            {regLoading ? (
              <Skeleton variant="rectangular" height={260} />
            ) : regionChartData.length === 0 ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 260 }}>
                <Typography variant="body2" color="text.secondary">No regional data for selected filters</Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={Math.max(260, regionChartData.length * 52)}>
                <BarChart data={regionChartData} layout="vertical" margin={{ top: 0, right: 20, left: 4, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E3E7" horizontal={false} />
                  <XAxis type="number" tickFormatter={(v) => fmtK(v)} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} />
                  <ReTooltip formatter={(val: number) => [`${fmtK(val)} kEUR`]} contentStyle={{ fontSize: 12 }} />
                  <Bar dataKey="value" name="Total OB" fill="#003C7E" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              OB by FA Group — {buLabel} ({latestPeriod})
            </Typography>
            {faLoading ? (
              <Skeleton variant="rectangular" height={260} />
            ) : faChartData.length === 0 ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 260 }}>
                <Typography variant="body2" color="text.secondary">No FA group data for selected filters</Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={Math.max(260, faChartData.length * 24)}>
                <BarChart data={faChartData} layout="vertical" margin={{ top: 0, right: 20, left: 4, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E3E7" horizontal={false} />
                  <XAxis type="number" tickFormatter={(v) => fmtK(v)} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" width={175} tick={{ fontSize: 10 }} />
                  <ReTooltip formatter={(val: number) => [`${fmtK(val)} kEUR`]} contentStyle={{ fontSize: 12 }} />
                  <Bar dataKey="value" name="OB Total" fill="#2196F3" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      <GapPanel
        severity="gap"
        title="Business Type Dimension Not Available in Order Book"
        description="The Order Book source does not contain a Business Type dimension. Classification as Net New, Feature Upselling, Cross Selling, etc. is only available in the Order Intake source. Cross-metric business type analysis requires EDW enrichment."
      />
    </Box>
  );
}
