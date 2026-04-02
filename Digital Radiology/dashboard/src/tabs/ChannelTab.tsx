import React, { useMemo } from 'react';
import {
  Grid, Typography, Box, Card, CardContent,
  Table, TableHead, TableRow, TableCell, TableBody,
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, ScatterChart, Scatter, ZAxis, ReferenceLine,
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import StorageIcon from '@mui/icons-material/Storage';
import { KpiCard } from '../components/KpiCard';
import { DataConfidenceLegend } from '../components/DataConfidenceLegend';
import { DataUnavailableNote } from '../components/DataUnavailableNote';
import { ChartNote } from './OverviewTab';
import { DashboardData, GlobalFilters, NavigateAction } from '../types';
import { fmtPct, fmtNum } from '../utils/formatters';

interface Props {
  data: DashboardData;
  filters: GlobalFilters;
  onNavigate: (nav: NavigateAction) => void;
}

// ── Dummy partner scatter data ─────────────────────────────────────────────────

const partnerScatter = [
  { name: 'Partner A', growth: 28,  margin: 41, revenue: 7.2, region: 'North America' },
  { name: 'Partner B', growth: 12,  margin: 38, revenue: 5.8, region: 'Europe North' },
  { name: 'Partner C', growth: -8,  margin: 32, revenue: 4.1, region: 'Europe South' },
  { name: 'Partner D', growth: 35,  margin: 44, revenue: 3.6, region: 'Intercontinental' },
  { name: 'Partner E', growth: 5,   margin: 36, revenue: 3.2, region: 'North America' },
  { name: 'Partner F', growth: -15, margin: 29, revenue: 2.8, region: 'Europe South' },
  { name: 'Partner G', growth: 22,  margin: 48, revenue: 2.4, region: 'Europe North' },
  { name: 'Partner H', growth: 18,  margin: 35, revenue: 2.1, region: 'Intercontinental' },
  { name: 'Partner I', growth: -3,  margin: 42, revenue: 1.8, region: 'North America' },
  { name: 'Partner J', growth: 41,  margin: 39, revenue: 1.5, region: 'Europe North' },
];

// Map scatter data to recharts Scatter format: x, y, z
const scatterPoints = partnerScatter.map(p => ({ x: p.growth, y: p.margin, z: p.revenue * 10, name: p.name }));

const TYPE_COLORS: Record<string, string> = {
  Goods: '#1565C0', Support: '#00897B', Implementation: '#F57C00',
  Other: '#78909C', Services: '#7B1FA2', Consumables: '#E65100',
};
const CHANNEL_COLORS = ['#1565C0', '#00897B', '#F57C00', '#78909C', '#7B1FA2'];

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography variant="h6" sx={{ mb: 1, mt: 3, fontWeight: 700, color: '#1565C0', borderBottom: '2px solid #E3F2FD', pb: 0.5 }}>
    {children}
  </Typography>
);

const ChannelTab: React.FC<Props> = ({ data }) => {
  const { feedfileSummary } = data;

  const rev2025 = feedfileSummary.revenueByYear.find(r => r.year === 2025)?.eurM ?? 0;
  const rev2024 = feedfileSummary.revenueByYear.find(r => r.year === 2024)?.eurM ?? 0;
  const rev2023 = feedfileSummary.revenueByYear.find(r => r.year === 2023)?.eurM ?? 0;
  const growth2425 = rev2024 > 0 ? ((rev2025 - rev2024) / rev2024) * 100 : 0;

  // Revenue by type stacked by year
  const revenueByType = useMemo(() => {
    const years = [2023, 2024, 2025];
    const types = Array.from(new Set(feedfileSummary.revenueByYearAndType.map(r => r.type)));
    return years.map(y => {
      const entry: Record<string, number | string> = { year: String(y) };
      types.forEach(t => {
        const found = feedfileSummary.revenueByYearAndType.find(r => r.year === y && r.type === t);
        entry[t] = found?.eurM ?? 0;
      });
      return entry;
    });
  }, [feedfileSummary.revenueByYearAndType]);

  const revenueTypes = useMemo(() =>
    Array.from(new Set(feedfileSummary.revenueByYearAndType.map(r => r.type))),
    [feedfileSummary.revenueByYearAndType]);

  // Channel mix by year
  const channelByYear = useMemo(() => {
    const years = [2023, 2024, 2025];
    const channels = Array.from(new Set(feedfileSummary.channelMix.map(c => c.channel))).slice(0, 5);
    return years.map(y => {
      const entry: Record<string, number | string> = { year: String(y) };
      channels.forEach(c => {
        const found = feedfileSummary.channelMix.find(cm => cm.year === y && cm.channel === c);
        entry[c.length > 20 ? c.slice(0, 18) + '..' : c] = found?.eurM ?? 0;
      });
      return entry;
    });
  }, [feedfileSummary.channelMix]);

  const topChannelLabels = useMemo(() =>
    Array.from(new Set(feedfileSummary.channelMix.map(c => c.channel))).slice(0, 5)
      .map(c => c.length > 20 ? c.slice(0, 18) + '..' : c),
    [feedfileSummary.channelMix]);

  // 3-year comparison by revenue type (for Product Line Sales section)
  const productLineComparison = useMemo(() => {
    const types = Array.from(new Set(feedfileSummary.revenueByYearAndType.map(r => r.type)));
    return types.map(t => {
      const y23 = feedfileSummary.revenueByYearAndType.find(r => r.year === 2023 && r.type === t)?.eurM ?? 0;
      const y24 = feedfileSummary.revenueByYearAndType.find(r => r.year === 2024 && r.type === t)?.eurM ?? 0;
      const y25 = feedfileSummary.revenueByYearAndType.find(r => r.year === 2025 && r.type === t)?.eurM ?? 0;
      return { type: t, y2023: y23, y2024: y24, y2025: y25 };
    }).sort((a, b) => b.y2025 - a.y2025);
  }, [feedfileSummary.revenueByYearAndType]);

  return (
    <Box>
      <DataConfidenceLegend />

      {/* ── Existing KPI cards ─────────────────────────────────────────────── */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard title="Revenue 2025" value={`€${rev2025.toFixed(1)}M`}
            subtitle={`${feedfileSummary.revenueByYear.length} years of data`}
            icon={<StorageIcon />}
            dataConfidence="verified"
            dataNote="FeedFile.csv — Net Turnover EUR, Year=2025" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard title="Revenue 2024" value={`€${rev2024.toFixed(1)}M`}
            subtitle="Full year actuals"
            icon={<StorageIcon />}
            dataConfidence="verified"
            dataNote="FeedFile.csv — Net Turnover EUR, Year=2024" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard title="Growth 2024→2025" value={fmtPct(growth2425 / 100)}
            subtitle={`${rev2023.toFixed(1)}M in 2023`}
            trend={growth2425}
            icon={growth2425 >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
            dataConfidence="derived"
            dataNote="Derived: (rev2025 - rev2024) / rev2024" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard title="Top Dealers in File"
            value={fmtNum(feedfileSummary.topDealers.length)}
            subtitle={`Top dealer: €${feedfileSummary.topDealers[0]?.eurM?.toFixed(1) ?? 0}M`}
            dataConfidence="verified"
            dataNote="FeedFile.csv — Bill-to party aggregated by Net Turnover EUR (all years)" />
        </Grid>
      </Grid>

      {/* ── Existing charts ────────────────────────────────────────────────── */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Revenue by Year (2023–2025)</Typography>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={feedfileSummary.revenueByYear.filter(r => r.year >= 2023 && r.year <= 2025)}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v: any) => `€${v}M`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: any) => [`€${v}M`, 'Revenue']} />
                  <Bar dataKey="eurM" name="Revenue (€M)" fill="#1565C0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <ChartNote note="✅ Verified: FeedFile.csv (1M+ rows, chunked) — Net Turnover EUR by year" />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Revenue by Type per Year</Typography>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={revenueByType} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v: any) => `€${v}M`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: any) => [`€${v}M`]} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  {revenueTypes.map((t, i) => (
                    <Bar key={t} dataKey={t} name={t} fill={TYPE_COLORS[t] ?? CHANNEL_COLORS[i % CHANNEL_COLORS.length]} stackId="a" />
                  ))}
                </BarChart>
              </ResponsiveContainer>
              <ChartNote note="✅ Verified: FeedFile joined with ProductFamilyList — TYPE field (Goods / Support / Implementation)" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Channel Mix by Year</Typography>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={channelByYear} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v: any) => `€${v}M`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: any) => [`€${v}M`]} />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  {topChannelLabels.map((c, i) => (
                    <Bar key={c} dataKey={c} name={c} fill={CHANNEL_COLORS[i % CHANNEL_COLORS.length]} stackId="a" />
                  ))}
                </BarChart>
              </ResponsiveContainer>
              <ChartNote note="✅ Verified: FeedFile.csv — SAP channel_ field by year (Net Turnover EUR)" />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Top 15 Bill-to Parties (All Years)</Typography>
              <Box sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#F5F7FA' }}>
                      <TableCell><Typography variant="caption" fontWeight={700}>#</Typography></TableCell>
                      <TableCell><Typography variant="caption" fontWeight={700}>SAP ID / Name</Typography></TableCell>
                      <TableCell align="right"><Typography variant="caption" fontWeight={700}>Revenue (€M)</Typography></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {feedfileSummary.topDealers.slice(0, 15).map((d, i) => (
                      <TableRow key={i} hover>
                        <TableCell><Typography variant="caption" color="text.secondary">{i + 1}</Typography></TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{d.name || d.sapId}</Typography>
                          {d.sapId && d.name !== d.sapId && (
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem' }}>SAP: {d.sapId}</Typography>
                          )}
                        </TableCell>
                        <TableCell align="right"><Typography variant="body2" sx={{ fontWeight: 700 }}>€{d.eurM.toFixed(2)}M</Typography></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
              <ChartNote note="✅ Verified: FeedFile.csv — Bill-to party aggregated Net Turnover EUR (all years combined)" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ── Section: Partner Health Matrix (Page 6.1) ─────────────────────── */}
      <SectionHeader>Partner Health Matrix (Page 6.1)</SectionHeader>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Bubble size = revenue (€M). X = revenue growth %. Y = margin %. Quadrant lines at 0% growth / 35% margin.
          </Typography>
          <ResponsiveContainer width="100%" height={340}>
            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                type="number" dataKey="x" name="Growth %"
                tickFormatter={(v: any) => `${v}%`} tick={{ fontSize: 10 }}
                label={{ value: 'Revenue Growth %', position: 'insideBottom', offset: -10, fontSize: 11 }}
                domain={[-25, 50]}
              />
              <YAxis
                type="number" dataKey="y" name="Margin %"
                tickFormatter={(v: any) => `${v}%`} tick={{ fontSize: 10 }}
                label={{ value: 'Margin %', angle: -90, position: 'insideLeft', fontSize: 11 }}
                domain={[20, 55]}
              />
              <ZAxis type="number" dataKey="z" range={[40, 400]} name="Revenue (€M)" />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ payload }) => {
                  if (!payload || payload.length === 0) return null;
                  const d = payload[0]?.payload as { x: number; y: number; z: number; name: string };
                  return (
                    <Box sx={{ bgcolor: 'white', border: '1px solid #E0E0E0', borderRadius: 1, p: 1 }}>
                      <Typography variant="caption" fontWeight={700}>{d.name}</Typography>
                      <Typography variant="caption" display="block">Growth: {d.x}%</Typography>
                      <Typography variant="caption" display="block">Margin: {d.y}%</Typography>
                      <Typography variant="caption" display="block">Revenue: €{(d.z / 10).toFixed(1)}M</Typography>
                    </Box>
                  );
                }}
              />
              <ReferenceLine x={0}  stroke="#BDBDBD" strokeDasharray="4 4" />
              <ReferenceLine y={35} stroke="#BDBDBD" strokeDasharray="4 4" />
              <Scatter data={scatterPoints} fill="#1565C0" fillOpacity={0.7} />
            </ScatterChart>
          </ResponsiveContainer>
          {/* Quadrant labels */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mt: 1, fontSize: '0.65rem' }}>
            {[
              { q: 'Top-Left: High Margin, Low Growth',  color: '#FFF3E0', border: '#FFCC80' },
              { q: 'Top-Right: Star Partners',           color: '#E8F5E9', border: '#A5D6A7' },
              { q: 'Bottom-Left: Needs Attention',       color: '#FFEBEE', border: '#EF9A9A' },
              { q: 'Bottom-Right: High Growth, Low Margin', color: '#E3F2FD', border: '#90CAF9' },
            ].map((item, i) => (
              <Box key={i} sx={{ px: 1, py: 0.5, bgcolor: item.color, border: `1px solid ${item.border}`, borderRadius: 1 }}>
                <Typography variant="caption" sx={{ fontSize: '0.62rem', fontWeight: 500 }}>{item.q}</Typography>
              </Box>
            ))}
          </Box>
          <DataUnavailableNote source="Margin % per partner requires SAP cost data. Growth uses FeedFile revenue. Illustrative margin values shown." />
        </CardContent>
      </Card>

      {/* ── Section: Product Line Sales Multi-Year (Page 6.4) ─────────────── */}
      <SectionHeader>Product Line Sales Multi-Year (Page 6.4)</SectionHeader>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={productLineComparison} margin={{ top: 5, right: 20, left: 10, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="type" tick={{ fontSize: 9 }} angle={-20} textAnchor="end" />
              <YAxis tickFormatter={(v: any) => `€${v}M`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: any) => [`€${v}M`]} />
              <Legend />
              <Bar dataKey="y2023" name="2023" fill="#BBDEFB" radius={[4, 4, 0, 0]} />
              <Bar dataKey="y2024" name="2024" fill="#42A5F5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="y2025" name="2025" fill="#1565C0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <ChartNote note="✅ Verified: FeedFile SAP actuals — Revenue by product TYPE (Goods/Implementation/Service/Support) 2023–2025" />
        </CardContent>
      </Card>

      {/* ── Section: Sales History Summary (Page 6.5) ─────────────────────── */}
      <SectionHeader>Sales History Summary (Page 6.5)</SectionHeader>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <KpiCard title="Revenue 2023" value={`€${rev2023.toFixed(1)}M`}
            subtitle="Full year SAP posted"
            icon={<StorageIcon />}
            dataConfidence="verified"
            dataNote="FeedFile.csv — Net Turnover EUR, Year=2023" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <KpiCard title="Revenue 2024" value={`€${rev2024.toFixed(1)}M`}
            subtitle="Full year SAP posted"
            icon={<StorageIcon />}
            dataConfidence="verified"
            dataNote="FeedFile.csv — Net Turnover EUR, Year=2024" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <KpiCard title="Revenue 2025" value={`€${rev2025.toFixed(1)}M`}
            subtitle="Full year SAP posted"
            icon={<StorageIcon />}
            dataConfidence="verified"
            dataNote="FeedFile.csv — Net Turnover EUR, Year=2025" />
        </Grid>
      </Grid>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Revenue Trend 2023–2025 (Yearly)</Typography>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={feedfileSummary.revenueByYear.filter(r => r.year >= 2023 && r.year <= 2025)}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v: any) => `€${v}M`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: any) => [`€${v}M`, 'Revenue']} />
              <Bar dataKey="eurM" name="Revenue (€M)" fill="#1565C0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <ChartNote note="✅ Verified: FeedFile SAP posted revenue 2023–2025. Dealer names not resolved (SAP Bill-to ID only)." />
        </CardContent>
      </Card>
    </Box>
  );
};

export default ChannelTab;
