import React, { useMemo } from 'react';
import {
  Grid, Typography, Box, Card, CardContent,
  Table, TableHead, TableRow, TableCell, TableBody,
  Chip,
} from '@mui/material';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, PieChart, Pie,
  LineChart, Line,
} from 'recharts';
import { KpiCard } from '../components/KpiCard';
import { DataConfidenceLegend } from '../components/DataConfidenceLegend';
import { DataUnavailableNote } from '../components/DataUnavailableNote';
import { ChartNote } from './OverviewTab';
import { DashboardData, GlobalFilters, NavigateAction } from '../types';
import { fmtEur, fmtPct, fmtNum } from '../utils/formatters';

interface Props {
  data: DashboardData;
  filters: GlobalFilters;
  onNavigate: (nav: NavigateAction) => void;
}

const PIE_COLORS = ['#2E7D32', '#1565C0', '#42A5F5', '#F57C00', '#78909C', '#BDBDBD'];

// ── Dummy data ─────────────────────────────────────────────────────────────────

const stageConversionData = [
  { stage: 'Identifying → Qualifying', rate: 68 },
  { stage: 'Qualifying → Quoting',     rate: 54 },
  { stage: 'Quoting → Negotiating',    rate: 41 },
  { stage: 'Negotiating → Won',        rate: 37 },
];

const largeDealRows = [
  { id: 'OPP-2025-1847', customer: 'University Hospital System', region: 'North America',    value: 2.1, equipment: 'DR 800 × 3', stage: 'Negotiating', forecast: 'Included',               closeQ: 'Q2 2026', ds: 70, margin: '39.5%' },
  { id: 'OPP-2025-1923', customer: 'Clinica Nacional',           region: 'Europe South',     value: 1.4, equipment: 'DR 600 × 2', stage: 'Quoting',     forecast: 'Included with Risk',     closeQ: 'Q3 2026', ds: 50, margin: '36.2%' },
  { id: 'OPP-2025-2014', customer: 'Regional Health Network',    region: 'Intercontinental', value: 0.9, equipment: 'DR 400 × 4', stage: 'Identifying', forecast: 'Upside',                 closeQ: 'Q4 2026', ds: 30, margin: '41.0%' },
  { id: 'OPP-2026-0045', customer: 'Metro Medical Centre',       region: 'Europe North',     value: 1.7, equipment: 'DR 800 × 2', stage: 'Quoting',     forecast: 'Included',               closeQ: 'Q2 2026', ds: 70, margin: '38.8%' },
  { id: 'OPP-2026-0112', customer: 'Pacific Imaging Group',      region: 'North America',    value: 0.8, equipment: 'Valory × 1', stage: 'Negotiating', forecast: 'Included and Secured',   closeQ: 'Q2 2026', ds: 90, margin: '43.1%' },
  { id: 'OPP-2026-0198', customer: 'National Diagnostic Lab',    region: 'Intercontinental', value: 1.2, equipment: 'DR 600 × 3', stage: 'Qualifying',  forecast: 'Upside',                 closeQ: 'Q4 2026', ds: 30, margin: '35.7%' },
];

const lossReasonData = [
  { reason: 'Price / Budget',      pct: 38 },
  { reason: 'Competitor Win',      pct: 27 },
  { reason: 'No Budget Approved',  pct: 18 },
  { reason: 'Timing / Delay',      pct: 11 },
  { reason: 'Other',               pct: 6  },
];

const forecastFillMap: Record<string, string> = {
  'Included and Secured': '#1565C0',
  'Included':             '#42A5F5',
  'Included with Risk':   '#F57C00',
  'Upside':               '#78909C',
};

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography variant="h6" sx={{ mb: 1, mt: 3, fontWeight: 700, color: '#1565C0', borderBottom: '2px solid #E3F2FD', pb: 0.5 }}>
    {children}
  </Typography>
);

const CommercialTab: React.FC<Props> = ({ data }) => {
  const { kpis, equipmentMix, regionBreakdown, winLoss, pipelineFunnel, funnelHealth } = data;

  const avgDealSize = kpis.wonDeals2026 > 0 ? kpis.oitYTD2026 / kpis.wonDeals2026 : 0;

  // Equipment mix comparison 2024/2025/2026
  const equipmentData = useMemo(() => {
    const types = new Set([
      ...equipmentMix.oit2026Q1.map(e => e.type),
      ...equipmentMix.oit2025FY.map(e => e.type),
      ...equipmentMix.oit2024FY.map(e => e.type),
    ]);
    const m26: Record<string, number> = {};
    const m25: Record<string, number> = {};
    const m24: Record<string, number> = {};
    equipmentMix.oit2026Q1.forEach(e => { m26[e.type] = e.eurM; });
    equipmentMix.oit2025FY.forEach(e => { m25[e.type] = e.eurM; });
    equipmentMix.oit2024FY.forEach(e => { m24[e.type] = e.eurM; });
    return Array.from(types).map(t => ({
      type: t.length > 18 ? t.slice(0, 16) + '..' : t,
      fullType: t,
      oit2026: m26[t] ?? 0,
      oit2025: m25[t] ?? 0,
      oit2024: m24[t] ?? 0,
    })).sort((a, b) => b.oit2025 - a.oit2025).slice(0, 8);
  }, [equipmentMix]);

  // Region waterfall 2025→2026
  const regionWaterfall = useMemo(() => {
    const m26: Record<string, number> = {};
    regionBreakdown.oitByRegion2026.forEach(r => { m26[r.region] = r.eurM; });
    return regionBreakdown.oitByRegion2025
      .slice(0, 8)
      .map(r => ({
        region: r.region.length > 18 ? r.region.slice(0, 16) + '..' : r.region,
        oit2025: r.eurM,
        oit2026: m26[r.region] ?? 0,
        delta: (m26[r.region] ?? 0) - r.eurM,
      }))
      .sort((a, b) => b.oit2025 - a.oit2025);
  }, [regionBreakdown]);

  // Forecast flag distribution (W12 snapshot)
  const forecastFlagData = useMemo(() =>
    pipelineFunnel.snapshot
      .filter(s => s.amountEUR > 0)
      .map((s, i) => ({ name: s.flag, value: parseFloat((s.amountEUR / 1_000_000).toFixed(2)), fill: PIE_COLORS[i % PIE_COLORS.length] })),
    [pipelineFunnel.snapshot]);

  // Win/loss by equipment
  const winLossEquip = winLoss.byEquipment.slice(0, 8);

  // OIT Running Total from real funnelHealth data (rtCY/rtBT/rtPY are already cumulative)
  const runningTotal = useMemo(() =>
    funnelHealth.filter(d => d.week <= 12).map(d => ({
      week: `W${String(d.week).padStart(2, '0')}`,
      rtCY: parseFloat(d.rtCY.toFixed(2)),
      rtBT: parseFloat(d.rtBT.toFixed(2)),
      rtPY: parseFloat(d.rtPY.toFixed(2)),
    })),
    [funnelHealth]);

  return (
    <Box>
      <DataConfidenceLegend />

      {/* ── KPI cards (existing) ────────────────────────────────────────────── */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard title="OIT 2026 Q1" value={fmtEur(kpis.oitYTD2026)} subtitle={`${kpis.wonDeals2026} won deals`}
            dataConfidence="verified" dataNote="msd data CRM - Won deals Year_Actual=2026 Quarter_Actual=Q1" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard title="Won Deals 2026" value={fmtNum(kpis.wonDeals2026)} subtitle="Q1 2026 closes"
            dataConfidence="verified" dataNote="msd data CRM - Won deal count" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard title="Avg Deal Size" value={fmtEur(avgDealSize)} subtitle="2026 won deals average"
            dataConfidence="derived" dataNote="Derived: oitYTD2026 / wonDeals2026" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard title="Win Rate (Overall)" value={fmtPct(winLoss.overall.winRate / 100)} subtitle={`${fmtNum(winLoss.overall.won)} won / ${fmtNum(winLoss.overall.lost)} lost`}
            dataConfidence="verified" dataNote="opportunity.csv — Won / (Won + Lost) all time" />
        </Grid>
      </Grid>

      {/* ── Existing charts ────────────────────────────────────────────────── */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Equipment Mix 2024/2025/2026</Typography>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={equipmentData} margin={{ top: 5, right: 20, left: 10, bottom: 45 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="type" tick={{ fontSize: 9 }} angle={-30} textAnchor="end" />
                  <YAxis tickFormatter={(v: any) => `€${v}M`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: any) => [`€${v}M`]} />
                  <Legend />
                  <Bar dataKey="oit2024" name="2024 FY" fill="#90CAF9" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="oit2025" name="2025 FY" fill="#42A5F5" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="oit2026" name="2026 Q1" fill="#1565C0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <ChartNote note="✅ Verified: msd data — Won deals by Equipment type (agfa_maintypecodename)" />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>W12 Forecast Flag Distribution</Typography>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={forecastFlagData} cx="50%" cy="50%" outerRadius={90}
                    dataKey="value" nameKey="name" label={({ name, value }) => `${name}: €${value}M`} labelLine>
                    {forecastFlagData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`€${v}M`]} />
                </PieChart>
              </ResponsiveContainer>
              <ChartNote note="✅ Verified: DataWeek W12 snapshot — forecast flag amounts" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>OIT by Region 2025 → 2026</Typography>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={regionWaterfall} margin={{ top: 5, right: 20, left: 10, bottom: 45 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="region" tick={{ fontSize: 9 }} angle={-30} textAnchor="end" />
                  <YAxis tickFormatter={(v: any) => `€${v}M`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: any) => [`€${v}M`]} />
                  <Legend />
                  <Bar dataKey="oit2025" name="2025 FY" fill="#90CAF9" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="oit2026" name="2026 Q1" fill="#1565C0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <ChartNote note="✅ Verified: msd data — Won deals by REGION" />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Win/Loss by Equipment Type</Typography>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={winLossEquip} layout="vertical" margin={{ top: 5, right: 30, left: 120, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="equipment" tick={{ fontSize: 9 }} width={120} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="won" name="Won" fill="#2E7D32" stackId="a" />
                  <Bar dataKey="lost" name="Lost" fill="#EF5350" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
              <ChartNote note="✅ Verified: msd data + opportunity.csv — Win/loss counts by equipment" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Win/Loss by Deal Size Band</Typography>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#F5F7FA' }}>
                <TableCell><Typography variant="caption" fontWeight={700}>Deal Size</Typography></TableCell>
                <TableCell align="right"><Typography variant="caption" fontWeight={700}>Won</Typography></TableCell>
                <TableCell align="right"><Typography variant="caption" fontWeight={700}>Lost</Typography></TableCell>
                <TableCell align="right"><Typography variant="caption" fontWeight={700}>Win Rate</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {winLoss.byDealSize.map((row, i) => (
                <TableRow key={i} hover>
                  <TableCell><Typography variant="body2">{row.band}</Typography></TableCell>
                  <TableCell align="right"><Typography variant="body2" color="success.main">{fmtNum(row.won)}</Typography></TableCell>
                  <TableCell align="right"><Typography variant="body2" color="error.main">{fmtNum(row.lost)}</Typography></TableCell>
                  <TableCell align="right">
                    <Chip label={`${row.winRate}%`} size="small"
                      sx={{ bgcolor: row.winRate >= 50 ? '#E8F5E9' : '#FFEBEE', color: row.winRate >= 50 ? '#2E7D32' : '#D32F2F', fontWeight: 700, fontSize: '0.7rem' }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ChartNote note="✅ Verified: opportunity.csv — deal size from estimatedvalue_base / actualvalue_base" />
        </CardContent>
      </Card>

      {/* ── Section: OIT Running Total (Weekly) ───────────────────────────── */}
      <SectionHeader>OIT Running Total — Weekly W01–W12</SectionHeader>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={runningTotal} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v: any) => `€${v}M`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: any) => [`€${v}M`]} />
              <Legend />
              <Line type="monotone" dataKey="rtCY" name="RT CY 2026" stroke="#1565C0" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="rtBT" name="RT Budget" stroke="#EF5350" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              <Line type="monotone" dataKey="rtPY" name="RT PY 2025" stroke="#9E9E9E" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <ChartNote note="✅ Verified: T funnel health — cumulative RT CY/BT/PY through W12" />
        </CardContent>
      </Card>

      {/* ── Section: Stage Conversion Rates ───────────────────────────────── */}
      <SectionHeader>Stage Conversion Rates</SectionHeader>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={stageConversionData}
              layout="vertical"
              margin={{ top: 5, right: 60, left: 180, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tickFormatter={(v: any) => `${v}%`} domain={[0, 100]} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="stage" tick={{ fontSize: 10 }} width={180} />
              <Tooltip formatter={(v: any) => [`${v}%`, 'Conversion Rate']} />
              <Bar dataKey="rate" name="Conversion %" fill="#1565C0" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <DataUnavailableNote source="CRM stage transition history — stage timestamps required" />
        </CardContent>
      </Card>

      {/* ── Section: Large & Strategic Deal Tracker ────────────────────────── */}
      <SectionHeader>Large &amp; Strategic Deal Tracker (Page 2.4)</SectionHeader>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small" sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: '#F5F7FA' }}>
                  {['Customer', 'Region', 'Value', 'Equipment', 'Stage', 'Forecast', 'Close Q', 'DS%', 'Est. Margin'].map(h => (
                    <TableCell key={h}><Typography variant="caption" fontWeight={700}>{h}</Typography></TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {largeDealRows.map((row, i) => (
                  <TableRow key={i} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{row.customer}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', fontFamily: 'monospace' }}>{row.id}</Typography>
                    </TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontSize: '0.72rem' }}>{row.region}</Typography></TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 700 }}>€{row.value}M</Typography></TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontSize: '0.72rem' }}>{row.equipment}</Typography></TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontSize: '0.72rem' }}>{row.stage}</Typography></TableCell>
                    <TableCell>
                      <Chip
                        label={row.forecast}
                        size="small"
                        sx={{
                          height: 18, fontSize: '0.6rem', fontWeight: 600,
                          bgcolor: forecastFillMap[row.forecast] ?? '#78909C',
                          color: '#fff',
                        }}
                      />
                    </TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontSize: '0.72rem' }}>{row.closeQ}</Typography></TableCell>
                    <TableCell>
                      <Chip
                        label={`${row.ds}%`}
                        size="small"
                        sx={{
                          height: 18, fontSize: '0.65rem', fontWeight: 700,
                          bgcolor: row.ds >= 70 ? '#E8F5E9' : row.ds >= 50 ? '#FFF3E0' : '#FFEBEE',
                          color: row.ds >= 70 ? '#2E7D32' : row.ds >= 50 ? '#E65100' : '#D32F2F',
                        }}
                      />
                    </TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{row.margin}</Typography></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          <DataUnavailableNote source="Large deal tracker requires CRM filter >€500k — available once CRM connected to EDW" />
        </CardContent>
      </Card>

      {/* ── Section: Loss Reason Pareto ───────────────────────────────────── */}
      <SectionHeader>Loss Reason Pareto</SectionHeader>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={lossReasonData}
              layout="vertical"
              margin={{ top: 5, right: 60, left: 150, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tickFormatter={(v: any) => `${v}%`} domain={[0, 50]} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="reason" tick={{ fontSize: 10 }} width={150} />
              <Tooltip formatter={(v: any) => [`${v}%`, 'Share of Losses']} />
              <Bar dataKey="pct" name="% of Losses" fill="#EF5350" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <DataUnavailableNote source="CRM Loss Reason field — requires loss reason to be consistently entered by KAMs" />
        </CardContent>
      </Card>
    </Box>
  );
};

export default CommercialTab;
