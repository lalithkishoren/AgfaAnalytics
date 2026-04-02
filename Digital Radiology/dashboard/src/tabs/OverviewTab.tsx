import React, { useMemo } from 'react';
import {
  Grid, Typography, Box, Card, CardContent, Chip,
  Table, TableHead, TableRow, TableCell, TableBody,
} from '@mui/material';
import {
  AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, LineChart, Line, ReferenceLine,
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TimelineIcon from '@mui/icons-material/Timeline';
import InventoryIcon from '@mui/icons-material/Inventory';
import { KpiCard } from '../components/KpiCard';
import { DataConfidenceLegend } from '../components/DataConfidenceLegend';
import { DataUnavailableNote } from '../components/DataUnavailableNote';
import { DashboardData, GlobalFilters, NavigateAction } from '../types';
import { fmtEur, fmtPct, fmtNum } from '../utils/formatters';

interface Props {
  data: DashboardData;
  filters: GlobalFilters;
  onNavigate: (nav: NavigateAction) => void;
}

export const ChartNote: React.FC<{ note: string }> = ({ note }) => (
  <Typography variant="caption" sx={{
    display: 'block', mt: 1, fontSize: '0.65rem', color: '#E65100',
    fontStyle: 'italic', bgcolor: '#FFF8E1', px: 1, py: 0.5, borderRadius: 0.5,
  }}>
    {note}
  </Typography>
);

const FUNNEL_COLORS: Record<string, string> = {
  Won: '#2E7D32',
  'Included and Secured': '#1565C0',
  Included: '#42A5F5',
  'Included with Risk': '#F57C00',
  Upside: '#78909C',
  Pipeline: '#BDBDBD',
};

// ── Dummy data for Financial Forecast & Outlook ───────────────────────────────

const upsideRuleRows = [
  { region: 'North America',    inclWithRisk: 4.2, upside: 9.8, ratio: 2.33, status: 'Compliant' },
  { region: 'Europe North',     inclWithRisk: 3.1, upside: 5.1, ratio: 1.65, status: 'Below 2×' },
  { region: 'Europe South',     inclWithRisk: 2.4, upside: 2.9, ratio: 1.21, status: 'Non-Compliant' },
  { region: 'Intercontinental', inclWithRisk: 1.8, upside: 4.1, ratio: 2.28, status: 'Compliant' },
];

const q2OitForecast = [
  { label: 'Won (locked)',    value: 3.2, fill: '#2E7D32' },
  { label: 'Incl & Secured', value: 5.8, fill: '#1565C0' },
  { label: 'Included',       value: 4.1, fill: '#42A5F5' },
  { label: 'Incl with Risk', value: 2.7, fill: '#F57C00' },
  { label: 'Upside',         value: 6.4, fill: '#78909C' },
];

const statusChipSx = (status: string) => ({
  height: 20, fontSize: '0.65rem', fontWeight: 700,
  bgcolor: status === 'Compliant' ? '#E8F5E9' : status === 'Below 2×' ? '#FFF3E0' : '#FFEBEE',
  color:   status === 'Compliant' ? '#2E7D32' : status === 'Below 2×' ? '#E65100' : '#D32F2F',
});

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography variant="h6" sx={{ mb: 1, mt: 3, fontWeight: 700, color: '#1565C0', borderBottom: '2px solid #E3F2FD', pb: 0.5 }}>
    {children}
  </Typography>
);

const OverviewTab: React.FC<Props> = ({ data }) => {
  const { kpis, oitTrend, pipelineFunnel, funnelHealth, regionBreakdown } = data;

  const annualizedOit = kpis.oitYTD2026 * 4;
  const pipelineCoverage = annualizedOit > 0 ? kpis.openPipelineTotal / annualizedOit : 0;
  const rtVsBt = kpis.rtBT_W12 > 0 ? (kpis.rtCY_W12 / kpis.rtBT_W12) * 100 : 0;

  const funnelSnapshot = useMemo(() =>
    pipelineFunnel.snapshot
      .filter(item => item.amountEUR > 0)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(item => ({
        name: item.flag,
        amountM: parseFloat((item.amountEUR / 1_000_000).toFixed(2)),
        fill: FUNNEL_COLORS[item.flag] ?? '#78909C',
      })),
    [pipelineFunnel.snapshot]);

  const oitTrendData = useMemo(() =>
    oitTrend.map(p => ({
      period: p.period,
      oitM: parseFloat((p.oitEUR / 1_000_000).toFixed(2)),
    })),
    [oitTrend]);

  const funnelW12 = useMemo(() => funnelHealth.filter(d => d.week <= 12), [funnelHealth]);

  const regionData = useMemo(() => {
    const r26: Record<string, number> = {};
    regionBreakdown.oitByRegion2026.forEach(r => { r26[r.region] = r.eurM; });
    const r25: Record<string, number> = {};
    regionBreakdown.oitByRegion2025.forEach(r => { r25[r.region] = r.eurM; });
    const allSet = new Set([
      ...regionBreakdown.oitByRegion2026.map(r => r.region),
      ...regionBreakdown.oitByRegion2025.slice(0, 8).map(r => r.region),
    ]);
    return Array.from(allSet).map(reg => ({
      region: reg.length > 16 ? reg.slice(0, 14) + '..' : reg,
      oit2026: r26[reg] ?? 0,
      oit2025: r25[reg] ?? 0,
    })).sort((a, b) => b.oit2025 - a.oit2025).slice(0, 8);
  }, [regionBreakdown]);

  const lifecycleItems = [
    { label: 'OIT Won 2026 Q1',    value: fmtEur(kpis.oitYTD2026), color: '#E8F5E9', border: '#2E7D32', textColor: '#2E7D32', conf: 'verified',  note: 'CRM Won deals',            dashed: false },
    { label: 'Order Book / Backlog', value: '— (EDW)',               color: '#FFEBEE', border: '#EF9A9A', textColor: '#B71C1C', conf: 'EDW',        note: 'Requires SAP EDW Phase 3', dashed: true  },
    { label: 'Reco Planned',        value: `${fmtNum(kpis.plannedRecoCount)} deals`, color: '#FFF3E0', border: '#FFCC80', textColor: '#E65100', conf: 'estimated', note: 'CRM planned reco date', dashed: false },
    { label: 'Margin (Estimated)',  value: '~35–45%',                color: '#FFF3E0', border: '#FFCC80', textColor: '#E65100', conf: 'estimated', note: 'CRM margin field',          dashed: true  },
  ];

  return (
    <Box>
      <DataConfidenceLegend />

      {/* ── KPI cards ──────────────────────────────────────────────────────── */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <KpiCard title="OIT YTD 2026" value={fmtEur(kpis.oitYTD2026)}
            subtitle={`${kpis.wonDeals2026} won deals`}
            trend={kpis.oitYTD2026 > 0 ? 1 : 0}
            trendLabel={`2025 FY: ${fmtEur(kpis.oitFY2025)}`}
            icon={<TrendingUpIcon />}
            dataConfidence="verified"
            dataNote="msd data CRM — Won deals with Year_Actual=2026" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <KpiCard title="Open Pipeline" value={fmtEur(kpis.openPipelineTotal)}
            subtitle={`${fmtNum(kpis.openPipelineCount)} open opportunities`}
            icon={<AssessmentIcon />}
            dataConfidence="verified"
            dataNote="msd data CRM — estimatedvalue_base for Open opportunities" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <KpiCard title="Pipeline Coverage" value={`${pipelineCoverage.toFixed(1)}x`}
            subtitle="Open pipeline vs annualized OIT"
            icon={<TimelineIcon />}
            dataConfidence="derived"
            dataNote="Derived: openPipelineTotal / (oitYTD2026 × 4)" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <KpiCard title="RT CY vs Budget (W12)" value={fmtPct(rtVsBt / 100)}
            subtitle={`CY: ${fmtEur(kpis.rtCY_W12)} | BT: ${fmtEur(kpis.rtBT_W12)}`}
            status={rtVsBt >= 90 ? 'green' : rtVsBt >= 70 ? 'amber' : 'red'}
            icon={<AccountBalanceIcon />}
            dataConfidence="derived"
            dataNote="Derived from T funnel health running totals at W12" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <KpiCard title="Reco Planned" value={fmtNum(kpis.plannedRecoCount)}
            subtitle="Deals with planned reco date"
            icon={<InventoryIcon />}
            dataConfidence="proxy"
            dataNote="EDW required for actual reco amounts — agfa_plannedrevenuerecognitiondate count only" />
        </Grid>
      </Grid>

      {/* ── Existing charts ────────────────────────────────────────────────── */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>OIT Trend by Quarter</Typography>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={oitTrendData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v: any) => `€${v}M`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: any) => [`€${v}M`, 'OIT']} />
                  <Area type="monotone" dataKey="oitM" name="OIT (€M)" stroke="#1565C0" fill="#E3F2FD" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
              <ChartNote note="✅ Verified: msd data CRM — Won deals by close quarter (2024-Q1 to 2026-Q1)" />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>W12 Funnel Snapshot</Typography>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={funnelSnapshot} layout="vertical" margin={{ top: 5, right: 30, left: 110, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tickFormatter={(v: any) => `€${v}M`} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={110} />
                  <Tooltip formatter={(v: any) => [`€${v}M`]} />
                  <Bar dataKey="amountM" name="Amount (€M)" radius={[0, 4, 4, 0]} fill="#1565C0" />
                </BarChart>
              </ResponsiveContainer>
              <ChartNote note="✅ Verified: DataWeek snapshot W12 — all forecast flags" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Weekly OIT Running Total W01–W12</Typography>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={funnelW12} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v: any) => `€${v}M`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: any) => [`€${v}M`]} />
                  <Legend />
                  <Line type="monotone" dataKey="rtCY" name="RT CY 2026" stroke="#1565C0" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="rtBT" name="RT Budget" stroke="#E65100" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  <Line type="monotone" dataKey="rtPY" name="RT PY 2025" stroke="#78909C" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <ChartNote note="✅ Verified: T funnel health — aggregated running totals across all destinations" />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>OIT by Region 2026 vs 2025</Typography>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={regionData} margin={{ top: 5, right: 20, left: 10, bottom: 45 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="region" tick={{ fontSize: 9 }} angle={-30} textAnchor="end" />
                  <YAxis tickFormatter={(v: any) => `€${v}M`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: any) => [`€${v}M`]} />
                  <Legend />
                  <Bar dataKey="oit2026" name="2026 YTD" fill="#1565C0" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="oit2025" name="2025 FY" fill="#90CAF9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <ChartNote note="✅ Verified: msd data — Won deals by REGION field" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Revenue Lifecycle Walk</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            From Order Intake to Recognised Revenue — partial data from CRM, full lifecycle requires EDW
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'stretch' }}>
            {lifecycleItems.map((item, i) => (
              <Box key={i} sx={{ flex: '1 1 180px', minWidth: 155 }}>
                <Box sx={{
                  p: 2, borderRadius: 2, bgcolor: item.color,
                  border: `2px ${item.dashed ? 'dashed' : 'solid'} ${item.border}`,
                  textAlign: 'center', height: '100%',
                  display: 'flex', flexDirection: 'column', gap: 0.5, justifyContent: 'center',
                }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.65rem', textTransform: 'uppercase', color: item.textColor }}>
                    {item.label}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: item.textColor }}>{item.value}</Typography>
                  <Chip size="small" label={item.conf}
                    sx={{ height: 18, fontSize: '0.55rem', fontWeight: 700, bgcolor: '#ffffff50', color: item.textColor, alignSelf: 'center' }} />
                  <Typography variant="caption" sx={{ fontSize: '0.6rem', color: item.textColor, opacity: 0.8 }}>{item.note}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* ── Page 1.2 — Financial Forecast & Outlook ───────────────────────── */}
      <SectionHeader>Financial Forecast &amp; Outlook — Q2 2026</SectionHeader>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>2× Upside Rule Compliance by Region</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#F5F7FA' }}>
                    {['Region', 'Incl w/ Risk (€M)', 'Upside (€M)', 'Ratio', 'Status'].map(h => (
                      <TableCell key={h}><Typography variant="caption" fontWeight={700}>{h}</Typography></TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {upsideRuleRows.map((row, i) => (
                    <TableRow key={i} hover>
                      <TableCell><Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{row.region}</Typography></TableCell>
                      <TableCell><Typography variant="body2" sx={{ fontSize: '0.75rem' }}>€{row.inclWithRisk}M</Typography></TableCell>
                      <TableCell><Typography variant="body2" sx={{ fontSize: '0.75rem' }}>€{row.upside}M</Typography></TableCell>
                      <TableCell><Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{row.ratio.toFixed(2)}×</Typography></TableCell>
                      <TableCell>
                        <Chip label={row.status} size="small" sx={statusChipSx(row.status)} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <DataUnavailableNote source="DataWeek — regional Upside vs Included with Risk breakdown required" />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Q2 OIT Forecast by Flag (€M)</Typography>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={q2OitForecast}
                  layout="vertical"
                  margin={{ top: 5, right: 60, left: 110, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tickFormatter={(v: any) => `€${v}M`} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="label" tick={{ fontSize: 10 }} width={110} />
                  <Tooltip formatter={(v: any) => [`€${v}M`]} />
                  <ReferenceLine
                    x={18.5}
                    stroke="#D32F2F"
                    strokeDasharray="4 4"
                    label={{ value: 'Budget €18.5M', position: 'insideTopRight', fontSize: 10, fill: '#D32F2F' }}
                  />
                  <Bar dataKey="value" name="Forecast (€M)" radius={[0, 4, 4, 0]}>
                    {q2OitForecast.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <DataUnavailableNote source="DataWeek — regional Upside vs Included with Risk breakdown required" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OverviewTab;
