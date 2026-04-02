"""Write all React tab files for the DR dashboard."""
import os

TABS_DIR = 'C:/Users/vajra/OneDrive/Documents/Work/AGFA Analysis/AgfaAnalytics/Digital Radiology/dashboard/src/tabs'

def write(filename, content):
    path = os.path.join(TABS_DIR, filename)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'  Written: {filename} ({len(content)} chars)')

# ─── OverviewTab ──────────────────────────────────────────────────────────────
OVERVIEW = """\
import React, { useMemo } from 'react';
import { Grid, Typography, Box, Card, CardContent, Chip } from '@mui/material';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, LineChart, Line,
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TimelineIcon from '@mui/icons-material/Timeline';
import InventoryIcon from '@mui/icons-material/Inventory';
import { KpiCard } from '../components/KpiCard';
import { DataConfidenceLegend } from '../components/DataConfidenceLegend';
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

const OverviewTab: React.FC<Props> = ({ data, onNavigate }) => {
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
    const all = new Set([
      ...regionBreakdown.oitByRegion2026.map(r => r.region),
      ...regionBreakdown.oitByRegion2025.slice(0, 8).map(r => r.region),
    ]);
    return Array.from(all).map(reg => ({
      region: reg.length > 16 ? reg.slice(0, 14) + '..' : reg,
      oit2026: r26[reg] ?? 0,
      oit2025: r25[reg] ?? 0,
    })).sort((a, b) => b.oit2025 - a.oit2025).slice(0, 8);
  }, [regionBreakdown]);

  const lifecycleItems = [
    { label: 'OIT Won 2026 Q1', value: fmtEur(kpis.oitYTD2026), color: '#E8F5E9', border: '#2E7D32', textColor: '#2E7D32', conf: 'verified', note: 'CRM Won deals', dashed: false },
    { label: 'Order Book / Backlog', value: '— (EDW)', color: '#FFEBEE', border: '#EF9A9A', textColor: '#B71C1C', conf: 'EDW', note: 'Requires SAP EDW Phase 3', dashed: true },
    { label: 'Reco Planned', value: `${fmtNum(kpis.plannedRecoCount)} deals`, color: '#FFF3E0', border: '#FFCC80', textColor: '#E65100', conf: 'estimated', note: 'CRM planned reco date', dashed: false },
    { label: 'Margin (Estimated)', value: '~35–45%', color: '#FFF3E0', border: '#FFCC80', textColor: '#E65100', conf: 'estimated', note: 'CRM margin field', dashed: true },
  ];

  return (
    <Box>
      <DataConfidenceLegend />
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

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>OIT Trend by Quarter</Typography>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={oitTrendData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `€${v}M`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => [`€${v}M`, 'OIT']} />
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
                  <XAxis type="number" tickFormatter={(v) => `€${v}M`} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={110} />
                  <Tooltip formatter={(v: number) => [`€${v}M`]} />
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
                  <YAxis tickFormatter={(v) => `€${v}M`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => [`€${v}M`]} />
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
                  <YAxis tickFormatter={(v) => `€${v}M`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => [`€${v}M`]} />
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
    </Box>
  );
};

export default OverviewTab;
"""

# ─── CommercialTab ────────────────────────────────────────────────────────────
COMMERCIAL = """\
import React, { useMemo } from 'react';
import { Grid, Typography, Box, Card, CardContent, Table, TableHead, TableRow, TableCell, TableBody, Chip } from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell,
} from 'recharts';
import { KpiCard } from '../components/KpiCard';
import { DataConfidenceLegend } from '../components/DataConfidenceLegend';
import { ChartNote } from './OverviewTab';
import { DashboardData, GlobalFilters, NavigateAction } from '../types';
import { fmtEur, fmtPct, fmtNum } from '../utils/formatters';
import { PRODUCT_COLORS } from '../theme';

interface Props {
  data: DashboardData;
  filters: GlobalFilters;
  onNavigate: (nav: NavigateAction) => void;
}

const PIE_COLORS = ['#2E7D32', '#1565C0', '#42A5F5', '#F57C00', '#78909C', '#BDBDBD'];

const CommercialTab: React.FC<Props> = ({ data, filters }) => {
  const { kpis, equipmentMix, regionBreakdown, winLoss, pipelineFunnel } = data;

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

  return (
    <Box>
      <DataConfidenceLegend />

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

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Equipment Mix 2024/2025/2026</Typography>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={equipmentData} margin={{ top: 5, right: 20, left: 10, bottom: 45 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="type" tick={{ fontSize: 9 }} angle={-30} textAnchor="end" />
                  <YAxis tickFormatter={(v) => `€${v}M`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => [`€${v}M`]} />
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
                  <Tooltip formatter={(v: number) => [`€${v}M`]} />
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
                  <YAxis tickFormatter={(v) => `€${v}M`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => [`€${v}M`]} />
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

      <Card>
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
    </Box>
  );
};

export default CommercialTab;
"""

# ─── SalesOpsTab ─────────────────────────────────────────────────────────────
SALESOPS = """\
import React, { useMemo, useState } from 'react';
import { Grid, Typography, Box, Card, CardContent, Table, TableHead, TableRow, TableCell, TableBody, ToggleButton, ToggleButtonGroup, Chip } from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { DataConfidenceLegend } from '../components/DataConfidenceLegend';
import { ChartNote } from './OverviewTab';
import { DashboardData, GlobalFilters, NavigateAction } from '../types';
import { fmtNum } from '../utils/formatters';

interface Props {
  data: DashboardData;
  filters: GlobalFilters;
  onNavigate: (nav: NavigateAction) => void;
}

const SalesOpsTab: React.FC<Props> = ({ data }) => {
  const { kamScorecard, pipelineFunnel } = data;
  const [weighted, setWeighted] = useState(false);

  const weeks = kamScorecard.weeks;

  // W→W Delta for each KAM (W12 - W11)
  const kamsWithDelta = useMemo(() =>
    kamScorecard.kams.map(k => {
      const amounts = weighted ? k.weeklyWeighted : k.weeklyAmounts;
      const w12 = amounts[amounts.length - 1] ?? 0;
      const w11 = amounts[amounts.length - 2] ?? 0;
      return { ...k, amounts, w12, delta: parseFloat((w12 - w11).toFixed(3)) };
    }),
    [kamScorecard.kams, weighted]);

  // Weekly trend by flag from pipeline_funnel
  const weeklyData = pipelineFunnel.weeklyTrend;

  return (
    <Box>
      <DataConfidenceLegend />

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">KAM Pipeline Scorecard — W03 to W12 (Open Opportunities)</Typography>
            <ToggleButtonGroup size="small" value={weighted ? 'weighted' : 'unweighted'} exclusive
              onChange={(_, v) => { if (v) setWeighted(v === 'weighted'); }}>
              <ToggleButton value="unweighted">Unweighted</ToggleButton>
              <ToggleButton value="weighted">Weighted</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small" sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: '#F5F7FA' }}>
                  <TableCell sx={{ fontWeight: 700, minWidth: 150 }}>KAM</TableCell>
                  <TableCell sx={{ fontWeight: 700, minWidth: 110 }}>Region</TableCell>
                  {weeks.map(w => (
                    <TableCell key={w} align="right" sx={{ fontWeight: 700, fontSize: '0.7rem' }}>{w}</TableCell>
                  ))}
                  <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.7rem' }}>W→W Δ</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Flag W12</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {kamsWithDelta.map((kam, i) => (
                  <TableRow key={i} hover>
                    <TableCell sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{kam.name}</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', color: '#5A6872' }}>{kam.region}</TableCell>
                    {kam.amounts.map((v, wi) => (
                      <TableCell key={wi} align="right" sx={{ fontSize: '0.7rem', fontFamily: 'monospace' }}>
                        {v > 0 ? `€${v}M` : '—'}
                      </TableCell>
                    ))}
                    <TableCell align="right">
                      <Chip label={`${kam.delta >= 0 ? '+' : ''}${kam.delta}M`} size="small"
                        sx={{ height: 18, fontSize: '0.6rem', fontWeight: 700,
                          bgcolor: kam.delta > 0 ? '#E8F5E9' : kam.delta < 0 ? '#FFEBEE' : '#F5F5F5',
                          color: kam.delta > 0 ? '#2E7D32' : kam.delta < 0 ? '#D32F2F' : '#78909C',
                        }} />
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: '0.65rem' }}>{kam.flagW12 || '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          <ChartNote note="✅ Verified: DataWeek — Open opportunities by Opportunity Owner, W03-W12 weekly snapshots" />
        </CardContent>
      </Card>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Weekly Open Pipeline by Forecast Flag (€M)</Typography>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={weeklyData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `€${v}M`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => [`€${v}M`]} />
                  <Bar dataKey="IncludedAndSecured" name="Incl & Secured" stackId="a" fill="#1565C0" />
                  <Bar dataKey="Included" name="Included" stackId="a" fill="#42A5F5" />
                  <Bar dataKey="IncludedWithRisk" name="Incl w/ Risk" stackId="a" fill="#F57C00" />
                  <Bar dataKey="Upside" name="Upside" stackId="a" fill="#78909C" />
                  <Bar dataKey="Pipeline" name="Pipeline" stackId="a" fill="#BDBDBD" />
                </BarChart>
              </ResponsiveContainer>
              <ChartNote note="✅ Verified: DataWeek — Open opportunities weekly pipeline by forecast flag" />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>W12 Pipeline Summary</Typography>
              {pipelineFunnel.snapshot.filter(s => s.amountEUR > 0).map((s, i) => (
                <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, borderBottom: '1px solid #f0f0f0' }}>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{s.flag}</Typography>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                      €{(s.amountEUR / 1_000_000).toFixed(1)}M
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem' }}>
                      {fmtNum(s.count)} deals
                    </Typography>
                  </Box>
                </Box>
              ))}
              <ChartNote note="✅ Verified: DataWeek W12 snapshot" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SalesOpsTab;
"""

# ─── OrderBookTab ─────────────────────────────────────────────────────────────
ORDERBOOK = """\
import React from 'react';
import { Grid, Typography, Box, Card, CardContent } from '@mui/material';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import StorageIcon from '@mui/icons-material/Storage';
import PowerIcon from '@mui/icons-material/Power';
import { KpiCard } from '../components/KpiCard';
import { DataConfidenceLegend } from '../components/DataConfidenceLegend';
import { DashboardData, GlobalFilters, NavigateAction } from '../types';
import { fmtNum } from '../utils/formatters';

interface Props {
  data: DashboardData;
  filters: GlobalFilters;
  onNavigate: (nav: NavigateAction) => void;
}

const OrderBookTab: React.FC<Props> = ({ data }) => {
  const { kpis } = data;

  return (
    <Box>
      <DataConfidenceLegend />

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <KpiCard title="Won Deals with SAP Order ID"
            value={fmtNum(kpis.sapOrderCount)}
            subtitle="Won CRM deals linked to a SAP order"
            icon={<StorageIcon />}
            dataConfidence="derived"
            dataNote="Derived: msd data Won — count where agfa_saporderid is not empty" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <KpiCard title="Open Deals with Planned Reco Date"
            value={fmtNum(kpis.plannedRecoCount)}
            subtitle="Open opportunities with planned reco date set in CRM"
            icon={<StorageIcon />}
            dataConfidence="estimated"
            dataNote="Estimated: msd data Open — agfa_plannedrevenuerecognitiondate is not empty. SAP delivery confirmation requires EDW." />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <KpiCard title="Full Backlog / Order Book"
            value="— (EDW)"
            subtitle="Not available without SAP EDW connection"
            icon={<WarehouseIcon />}
            dataConfidence="proxy"
            dataNote="EDW Phase 3: SAP order delivery status join required" />
        </Grid>
      </Grid>

      {/* Main EDW Placeholder */}
      <Card sx={{ border: '2px dashed #EF9A9A', bgcolor: '#FFFBFB', mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
            <WarehouseIcon sx={{ fontSize: 48, color: '#B71C1C', mt: 0.5 }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#B71C1C', mb: 0.5 }}>
                Order Book — Backlog Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                This section requires Direct Query data from the Enterprise Data Warehouse (EDW)
              </Typography>
            </Box>
            <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
              <PowerIcon sx={{ color: '#B71C1C' }} />
              <Typography variant="caption" sx={{ color: '#B71C1C', fontWeight: 700, border: '1px dashed #EF9A9A', px: 1, py: 0.25, borderRadius: 1 }}>
                EDW Phase 3
              </Typography>
            </Box>
          </Box>

          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>What is needed:</Typography>
          <Box component="ul" sx={{ pl: 3, color: 'text.secondary', mb: 3 }}>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>SAP order delivery status (Open / Delivered / Invoiced)</Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>agfa_saporderid → SAP order join (CRM to SAP)</Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>SAP invoice posting dates (actual revenue recognition)</Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>Order backlog aging analysis (days since order date)</Typography>
            <Typography component="li" variant="body2">Revenue recognition waterfall (Order Book → Reco → Invoiced)</Typography>
          </Box>

          {/* Mock chart preview — greyed out */}
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>Preview (data not yet available)</Typography>
          <Grid container spacing={2}>
            {['Order Backlog by Region', 'Delivery Age Buckets', 'OB Trend Monthly', 'SAP Order Status'].map((title, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{
                  height: 120, bgcolor: '#F5F5F5', borderRadius: 2,
                  border: '1px dashed #BDBDBD', display: 'flex',
                  flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1,
                }}>
                  <Box sx={{ width: '60%', height: 40, bgcolor: '#E0E0E0', borderRadius: 1 }} />
                  <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>{title}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 3, p: 2, bgcolor: '#FFF3E0', borderRadius: 1, border: '1px solid #FFCC80' }}>
            <Typography variant="body2" sx={{ color: '#E65100', fontWeight: 500 }}>
              Currently available proxy: {fmtNum(kpis.sapOrderCount)} Won deals have SAP Order IDs in CRM (agfa_saporderid field).
              These can be used to join to SAP once EDW connectivity is established.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrderBookTab;
"""

# ─── RecoTab ─────────────────────────────────────────────────────────────────
RECO = """\
import React, { useMemo } from 'react';
import { Grid, Typography, Box, Card, CardContent } from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import PowerIcon from '@mui/icons-material/Power';
import InventoryIcon from '@mui/icons-material/Inventory';
import { KpiCard } from '../components/KpiCard';
import { DataConfidenceLegend } from '../components/DataConfidenceLegend';
import { ChartNote } from './OverviewTab';
import { DashboardData, GlobalFilters, NavigateAction } from '../types';
import { fmtNum } from '../utils/formatters';

interface Props {
  data: DashboardData;
  filters: GlobalFilters;
  onNavigate: (nav: NavigateAction) => void;
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const RecoTab: React.FC<Props> = ({ data }) => {
  const { kpis, funnelHealth } = data;

  // Mock planned reco by month from funnel health weekly CY (proxy)
  const recoByMonth = useMemo(() => {
    const monthly: Record<number, number> = {};
    funnelHealth.forEach(d => {
      const month = Math.ceil(d.week / 4.33);
      if (month >= 1 && month <= 12) {
        monthly[month] = (monthly[month] ?? 0) + d.weeklyCY;
      }
    });
    return MONTH_LABELS.map((m, i) => ({
      month: m,
      value: parseFloat((monthly[i + 1] ?? 0).toFixed(3)),
    }));
  }, [funnelHealth]);

  return (
    <Box>
      <DataConfidenceLegend />

      {/* Section 1: Available Data */}
      <Typography variant="h6" sx={{ mb: 1, mt: 0.5, fontWeight: 700 }}>Section 1 — Available from CRM (Estimated)</Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <KpiCard title="Deals with Planned Reco Date"
            value={fmtNum(kpis.plannedRecoCount)}
            subtitle="Open CRM deals where agfa_plannedrevenuerecognitiondate is set"
            icon={<InventoryIcon />}
            dataConfidence="estimated"
            dataNote="Estimated: agfa_plannedrevenuerecognitiondate from CRM. SAP actual posting date requires EDW connection." />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <KpiCard title="Won with SAP Order ID"
            value={fmtNum(kpis.sapOrderCount)}
            subtitle="Bridge between CRM and SAP order"
            icon={<InventoryIcon />}
            dataConfidence="derived"
            dataNote="Derived: msd data Won — agfa_saporderid populated. Cannot confirm reco without EDW." />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <KpiCard title="Actual Reco Amounts"
            value="— (EDW)"
            subtitle="SAP invoice posting date required"
            icon={<PowerIcon />}
            dataConfidence="proxy"
            dataNote="EDW Phase 1: SAP BW BP5 query required for actual posting date and revenue amounts" />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>OIT Weekly Intake by Month (CY 2026)</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.75rem' }}>
                Weekly CY OIT intake aggregated to monthly — proxy for reco timing
              </Typography>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={recoByMonth} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `€${v}M`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => [`€${v}M`, 'Weekly CY OIT']} />
                  <Bar dataKey="value" name="Weekly CY (€M)" fill="#F57C00" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <ChartNote note="⚠ Estimated: T funnel health — weekly CY OIT grouped by month. SAP actual posting date requires EDW." />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Revenue Walk Placeholder</Typography>
              {['Opening Order Book', '+ OIT Won', '– Revenue Reco', 'Closing Order Book'].map((label, i) => (
                <Box key={i} sx={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  p: 1.5, mb: 1, borderRadius: 1,
                  bgcolor: i === 0 || i === 3 ? '#F5F5F5' : i === 1 ? '#E8F5E9' : '#FFEBEE',
                  border: '1px dashed #BDBDBD',
                }}>
                  <Typography variant="body2" sx={{ color: '#9E9E9E', fontStyle: 'italic' }}>{label}</Typography>
                  <Typography variant="body2" sx={{ color: '#BDBDBD', fontWeight: 700 }}>— (EDW)</Typography>
                </Box>
              ))}
              <ChartNote note="⚠ Proxy: Opening Order Book and Reco amounts require EDW — SAP invoice posting date join (Phase 1)" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Section 2: EDW Gap */}
      <Card sx={{ border: '2px dashed #EF9A9A', bgcolor: '#FFFBFB', mb: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <PowerIcon sx={{ fontSize: 36, color: '#B71C1C' }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#B71C1C' }}>
                Actual Revenue Recognition — EDW Required
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Actual reco amounts require EDW — SAP invoice posting date join
              </Typography>
            </Box>
          </Box>
          <Box component="ul" sx={{ pl: 3, color: 'text.secondary', m: 0 }}>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>SAP BW BP5 query data (Price Realization extract)</Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>SAP invoice posting date → Revenue period mapping</Typography>
            <Typography component="li" variant="body2">Revenue walk: Opening OB + OIT – Reco = Closing OB</Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RecoTab;
"""

# ─── MarginTab ────────────────────────────────────────────────────────────────
MARGIN = """\
import React, { useMemo } from 'react';
import { Grid, Typography, Box, Card, CardContent, Chip } from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  ScatterChart, Scatter,
} from 'recharts';
import PowerIcon from '@mui/icons-material/Power';
import PercentIcon from '@mui/icons-material/Percent';
import { KpiCard } from '../components/KpiCard';
import { DataConfidenceLegend } from '../components/DataConfidenceLegend';
import { ChartNote } from './OverviewTab';
import { DashboardData, GlobalFilters, NavigateAction } from '../types';
import { fmtPct, fmtNum } from '../utils/formatters';

interface Props {
  data: DashboardData;
  filters: GlobalFilters;
  onNavigate: (nav: NavigateAction) => void;
}

const MarginTab: React.FC<Props> = ({ data }) => {
  const { winLoss, regionBreakdown } = data;

  // Win rate by region as proxy for margin/deal quality
  const regionWinRate = useMemo(() =>
    winLoss.byRegion
      .filter(r => r.region !== 'Unknown' && (r.won + r.lost) > 5)
      .slice(0, 10)
      .map(r => ({
        region: r.region.length > 14 ? r.region.slice(0, 12) + '..' : r.region,
        winRate: r.winRate,
        wonEUR: regionBreakdown.oitByRegion2025.find(rb => rb.region === r.region)?.eurM ?? 0,
      })),
    [winLoss.byRegion, regionBreakdown]);

  // Win rate by equipment
  const equipWinRate = useMemo(() =>
    winLoss.byEquipment
      .filter(e => (e.won + e.lost) > 5)
      .slice(0, 8)
      .map(e => ({
        equipment: e.equipment.length > 16 ? e.equipment.slice(0, 14) + '..' : e.equipment,
        winRate: e.winRate,
      })),
    [winLoss.byEquipment]);

  return (
    <Box>
      <DataConfidenceLegend />

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard title="Avg CRM Margin % (Overall)"
            value="~40%"
            subtitle="CRM agfa_margincostpercentagetotal field"
            icon={<PercentIcon />}
            dataConfidence="estimated"
            dataNote="Estimated: KAM-entered margin % at deal creation — not SAP posted actual. Wide variance expected." />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard title="HW Margin % Range"
            value="30–50%"
            subtitle="agfa_margincostpercentagehardware"
            icon={<PercentIcon />}
            dataConfidence="estimated"
            dataNote="Estimated: CRM hardware margin %. Varies by equipment type and region." />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard title="Actual vs Standard Delta"
            value="— (EDW)"
            subtitle="Requires SAP BW actual cost data"
            icon={<PowerIcon />}
            dataConfidence="proxy"
            dataNote="EDW Phase 1: SAP BW BP5 price realization query required for actual vs standard cost delta" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard title="Overall Win Rate"
            value={fmtPct(winLoss.overall.winRate / 100)}
            subtitle={`${fmtNum(winLoss.overall.won)} won | ${fmtNum(winLoss.overall.lost)} lost`}
            dataConfidence="verified"
            dataNote="opportunity.csv — all-time win/loss ratio" />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Win Rate by Region</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontSize: '0.7rem' }}>
                Regions with 5+ closed opportunities. Win rate is proxy for deal quality.
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={regionWinRate} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tickFormatter={(v) => `${v}%`} domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="region" tick={{ fontSize: 9 }} width={100} />
                  <Tooltip formatter={(v: number) => [`${v}%`, 'Win Rate']} />
                  <Bar dataKey="winRate" name="Win Rate" fill="#1565C0" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <ChartNote note="✅ Verified: opportunity.csv — Win/(Win+Loss) by region from CRM opportunity data" />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Win Rate by Equipment Type</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={equipWinRate} layout="vertical" margin={{ top: 5, right: 30, left: 130, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tickFormatter={(v) => `${v}%`} domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="equipment" tick={{ fontSize: 9 }} width={130} />
                  <Tooltip formatter={(v: number) => [`${v}%`, 'Win Rate']} />
                  <Bar dataKey="winRate" name="Win Rate" fill="#00897B" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <ChartNote note="✅ Verified: msd data — Win/loss count by equipment type" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Win/Loss Closed by Quarter</Typography>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={winLoss.closedByQuarter.slice(-12)}
                  margin={{ top: 5, right: 20, left: 10, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="period" tick={{ fontSize: 9 }} angle={-30} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="won" name="Won" fill="#2E7D32" stackId="a" />
                  <Bar dataKey="lost" name="Lost" fill="#EF5350" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
              <ChartNote note="✅ Verified: opportunity.csv — Won and Lost by actualclosedate quarter" />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ border: '2px dashed #EF9A9A', bgcolor: '#FFFBFB' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <PowerIcon sx={{ color: '#B71C1C', fontSize: 32 }} />
                <Box>
                  <Typography variant="h6" sx={{ color: '#B71C1C', fontWeight: 700 }}>Price Realization Analysis</Typography>
                  <Typography variant="caption" color="text.secondary">EDW Phase 1 Required</Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Full margin waterfall requires SAP BW BP5 query data (Price Realization extract).
                This provides actual vs standard cost, price erosion, and margin bridge by product.
              </Typography>
              <Box component="ul" sx={{ pl: 2.5, color: 'text.secondary', fontSize: '0.8rem', m: 0 }}>
                <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>List price → Net price waterfall</Typography>
                <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>Discount analysis by region / equipment</Typography>
                <Typography component="li" variant="body2">Actual gross margin from SAP posting</Typography>
              </Box>
              <Chip label="EDW Phase 1" size="small" icon={<PowerIcon sx={{ fontSize: '14px !important' }} />}
                sx={{ mt: 2, bgcolor: '#FFEBEE', color: '#B71C1C', border: '1px dashed #EF9A9A', fontWeight: 700 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MarginTab;
"""

# ─── ChannelTab ───────────────────────────────────────────────────────────────
CHANNEL = """\
import React, { useMemo } from 'react';
import { Grid, Typography, Box, Card, CardContent, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import StorageIcon from '@mui/icons-material/Storage';
import { KpiCard } from '../components/KpiCard';
import { DataConfidenceLegend } from '../components/DataConfidenceLegend';
import { ChartNote } from './OverviewTab';
import { DashboardData, GlobalFilters, NavigateAction } from '../types';
import { fmtEur, fmtPct, fmtNum } from '../utils/formatters';

interface Props {
  data: DashboardData;
  filters: GlobalFilters;
  onNavigate: (nav: NavigateAction) => void;
}

const ChannelTab: React.FC<Props> = ({ data }) => {
  const { feedfileSummary } = data;

  const rev2025 = feedfileSummary.revenueByYear.find(r => r.year === 2025)?.eurM ?? 0;
  const rev2024 = feedfileSummary.revenueByYear.find(r => r.year === 2024)?.eurM ?? 0;
  const rev2023 = feedfileSummary.revenueByYear.find(r => r.year === 2023)?.eurM ?? 0;
  const growth2425 = rev2024 > 0 ? ((rev2025 - rev2024) / rev2024) * 100 : 0;

  // Revenue by type stacked by year
  const revenueByType = useMemo(() => {
    const years = [2023, 2024, 2025];
    const types = [...new Set(feedfileSummary.revenueByYearAndType.map(r => r.type))];
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
    [...new Set(feedfileSummary.revenueByYearAndType.map(r => r.type))],
    [feedfileSummary.revenueByYearAndType]);

  // Channel mix by year
  const channelByYear = useMemo(() => {
    const years = [2023, 2024, 2025];
    const channels = [...new Set(feedfileSummary.channelMix.map(c => c.channel))].slice(0, 5);
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
    [...new Set(feedfileSummary.channelMix.map(c => c.channel))].slice(0, 5)
      .map(c => c.length > 20 ? c.slice(0, 18) + '..' : c),
    [feedfileSummary.channelMix]);

  const TYPE_COLORS: Record<string, string> = {
    Goods: '#1565C0', Support: '#00897B', Implementation: '#F57C00', Other: '#78909C',
    Services: '#7B1FA2', Consumables: '#E65100',
  };

  const CHANNEL_COLORS = ['#1565C0', '#00897B', '#F57C00', '#78909C', '#7B1FA2'];

  return (
    <Box>
      <DataConfidenceLegend />

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

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Revenue by Year (2023–2025)</Typography>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={feedfileSummary.revenueByYear.filter(r => r.year >= 2023 && r.year <= 2025)} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `€${v}M`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => [`€${v}M`, 'Revenue']} />
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
                  <YAxis tickFormatter={(v) => `€${v}M`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => [`€${v}M`]} />
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
                  <YAxis tickFormatter={(v) => `€${v}M`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => [`€${v}M`]} />
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
    </Box>
  );
};

export default ChannelTab;
"""

# Write all tabs
write('OverviewTab.tsx', OVERVIEW)
write('CommercialTab.tsx', COMMERCIAL)
write('SalesOpsTab.tsx', SALESOPS)
write('OrderBookTab.tsx', ORDERBOOK)
write('RecoTab.tsx', RECO)
write('MarginTab.tsx', MARGIN)
write('ChannelTab.tsx', CHANNEL)

print('\nAll tabs written successfully.')
