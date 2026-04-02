import React, { useMemo } from 'react';
import {
  Box, Typography, Card, CardContent,
  Alert, AlertTitle, Chip, Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AssessmentIcon from '@mui/icons-material/Assessment';
import InventoryIcon from '@mui/icons-material/Inventory';
import PercentIcon from '@mui/icons-material/Percent';
import TimelineIcon from '@mui/icons-material/Timeline';
import {
  AreaChart, Area,
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts';
import { KpiCard } from '../components/KpiCard';
import { DataConfidenceLegend } from '../components/DataConfidenceLegend';
import { ChartNote } from '../components/ChartNote';
import { GlobalFilters } from '../types';
import {
  monthlyRevenueTrend,
  monthlyOitTrend,
  amspByBudgetClass,
  productMixData,
  oit2026Monthly,
  backlog2026,
  recoPnL,
} from '../data/dpsData';
import { CHART_COLORS } from '../theme';

interface Props {
  filters: GlobalFilters;
  onNavigate?: (tab: number) => void;
}

const PNL_TOTALS = recoPnL.filter(r => r.isTotal && r.actual !== null);

export const ExecutiveSummaryTab: React.FC<Props> = ({ filters, onNavigate }) => {
  const filteredBCs = useMemo(() =>
    amspByBudgetClass
      .filter(d => filters.bu === 'All' || d.bu === filters.bu)
      .filter(d => filters.budgetClass === 'All' || d.name === filters.budgetClass),
    [filters.bu, filters.budgetClass]
  );

  const filteredBuMargin = useMemo(() =>
    productMixData
      .filter(d => ['LK', 'LI', 'M0'].includes(d.bu))
      .filter(d => filters.bu === 'All' || d.bu === filters.bu),
    [filters.bu]
  );

  const showFY2024 = filters.year === 'All' || filters.year === '2024';
  const showFY2025 = filters.year === 'All' || filters.year === '2025';
  const show2026   = filters.year === '2026';

  const filterContext = [
    filters.year !== 'All' && `FY${filters.year}`,
    filters.bu !== 'All' && filters.bu,
    filters.budgetClass !== 'All' && filters.budgetClass,
    filters.region !== 'All' && filters.region,
  ].filter(Boolean).join(' · ');

  const goTo = (tab: number) => () => onNavigate?.(tab);

  // Dynamic AMSP subtitle — shows filtered BC margin if one BC selected
  const amspSubtitle = useMemo(() => {
    if (filters.budgetClass !== 'All' && filteredBCs.length === 1) {
      return `${filteredBCs[0].name}: ${filteredBCs[0].margin}%`;
    }
    if (filters.bu !== 'All' && filteredBCs.length > 0) {
      const avg = (filteredBCs.reduce((s, d) => s + d.margin, 0) / filteredBCs.length).toFixed(1);
      return `${filters.bu} avg: ~${avg}% · CO-PA GM: 38.9%`;
    }
    return 'FY2025 full year · CO-PA GM basis: 38.9%';
  }, [filters.bu, filters.budgetClass, filteredBCs]);

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A2027', lineHeight: 1.3 }}>
          Executive Summary — FY2025 DPS Performance
        </Typography>
        <Typography variant="body2" sx={{ color: '#637381', mt: 0.5 }}>
          Digital Printing Solutions · RECO + AMSP + CO-PA + Order Follow-up · Data as of Feb 2026
          {filterContext && (
            <Chip
              label={`Filtered: ${filterContext}`}
              size="small"
              sx={{ ml: 1.5, bgcolor: '#1565C020', color: '#1565C0', border: '1px solid #1565C040', fontSize: '0.72rem' }}
            />
          )}
        </Typography>
      </Box>

      <DataConfidenceLegend />

      {/* ── KPI ROW 1: Primary P&L + order metrics ── */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Box onClick={goTo(2)} sx={{ cursor: onNavigate ? 'pointer' : 'default', '&:hover': { transform: onNavigate ? 'translateY(-2px)' : 'none', transition: 'transform 0.15s' } }}>
            <KpiCard
              title="EBIT FY2025"
              value="EUR 205.1M"
              subtitle="53.3% margin · vs FY2024: -EUR 14.5M (-6.6%)"
              trend={-1}
              trendLabel="-6.6% vs FY2024 (EUR 219.6M)"
              dataConfidence="verified"
              dataNote="RECO Analysis — all DPS entities, kEUR basis"
              status="info"
              icon={<AssessmentIcon sx={{ fontSize: 18 }} />}
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Box onClick={goTo(2)} sx={{ cursor: onNavigate ? 'pointer' : 'default', '&:hover': { transform: onNavigate ? 'translateY(-2px)' : 'none', transition: 'transform 0.15s' } }}>
            <KpiCard
              title="Net Revenue (3rdP)"
              value="EUR 190.6M"
              subtitle="vs budget: -EUR 83.7M (-17.9%)"
              trend={-1}
              trendLabel="-17.9% below BP1 plan"
              dataConfidence="verified"
              dataNote="AMSP Contribution — 3rd party net sales"
              status="error"
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Box onClick={goTo(2)} sx={{ cursor: onNavigate ? 'pointer' : 'default', '&:hover': { transform: onNavigate ? 'translateY(-2px)' : 'none', transition: 'transform 0.15s' } }}>
            <KpiCard
              title="AMSP Margin %"
              value="61.9%"
              subtitle={amspSubtitle}
              dataConfidence="verified"
              dataNote="AMSP Contribution file — 3rdP only"
              status="success"
              icon={<PercentIcon sx={{ fontSize: 18 }} />}
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Box onClick={goTo(3)} sx={{ cursor: onNavigate ? 'pointer' : 'default', '&:hover': { transform: onNavigate ? 'translateY(-2px)' : 'none', transition: 'transform 0.15s' } }}>
            <KpiCard
              title="FY2026 OIT YTD"
              value="22 units"
              subtitle="Jan=11 · Feb=10 · Mar=3 MTD · +12% vs FY2025 pace"
              trend={1}
              trendLabel="+12% ahead of FY2025 same-period pace"
              dataConfidence="verified"
              dataNote="Order follow-up file — FY2026 OIT tracker"
              status="success"
              icon={<TimelineIcon sx={{ fontSize: 18 }} />}
            />
          </Box>
        </Grid>
      </Grid>

      {/* ── KPI ROW 2: Supporting metrics ── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <KpiCard
            title="SG&A vs Budget"
            value="+EUR 9M Favorable"
            subtitle="Actual -85M vs budget -94M"
            dataConfidence="verified"
            dataNote="RECO Analysis — SG&A variance vs BP1"
            status="success"
            icon={<TrendingUpIcon sx={{ fontSize: 18 }} />}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <KpiCard
            title="Non-recurring Cost"
            value="EUR 6.2M (unfav.)"
            subtitle="vs budget EUR 0.4M — EUR 5.8M overshoot"
            dataConfidence="verified"
            dataNote="RECO Analysis — non-recurring items vs BP1"
            status="error"
            icon={<TrendingDownIcon sx={{ fontSize: 18 }} />}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Box onClick={goTo(3)} sx={{ cursor: onNavigate ? 'pointer' : 'default', '&:hover': { transform: onNavigate ? 'translateY(-2px)' : 'none', transition: 'transform 0.15s' } }}>
            <KpiCard
              title="Backlog End-Feb 2026"
              value="46 units"
              subtitle="Rising: 40 → 43 → 46 (OIT > RR each month)"
              dataConfidence="verified"
              dataNote="Derived from cumulative OIT minus RR"
              status="warning"
              icon={<InventoryIcon sx={{ fontSize: 18 }} />}
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <KpiCard
            title="No AMSP Rate Risk"
            value="EUR 64M"
            subtitle="33.6% of net sales — margin unknown"
            dataConfidence="estimated"
            dataNote="AMSP file — net sales without AMSP rate assigned"
            status="warning"
          />
        </Grid>
      </Grid>

      {/* ── CHART ROW 1: Revenue area + RECO P&L ── */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card elevation={1}>
            <CardContent sx={{ pb: '12px !important' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.92rem' }}>Monthly Net Sales — FY2025</Typography>
                <Chip label="Verified" size="small" sx={{ bgcolor: '#2E7D32', color: '#fff', height: 16, fontSize: '0.6rem' }} />
              </Box>
              <ResponsiveContainer width="100%" height={230}>
                <AreaChart data={monthlyRevenueTrend} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={CHART_COLORS[0]} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tickFormatter={v => `€${(v / 1e6).toFixed(0)}M`} tick={{ fontSize: 10 }} width={44} />
                  <Tooltip formatter={(v: number | undefined) => [`€${((v ?? 0) / 1e6).toFixed(1)}M`, 'Net Sales']} labelStyle={{ fontWeight: 700 }} />
                  <Area type="monotone" dataKey="netSales" name="Net Sales" stroke={CHART_COLORS[0]} strokeWidth={2} fill="url(#revGrad)" dot={{ r: 3, fill: CHART_COLORS[0] }} activeDot={{ r: 5 }} />
                </AreaChart>
              </ResponsiveContainer>
              <ChartNote source="AMSP Contribution file" note="Dec €30.6M = highest revenue, 46.4% margin (anomaly). Jun €20.9M secondary peak." />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card elevation={1}>
            <CardContent sx={{ pb: '12px !important' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.92rem' }}>RECO P&L — Key Lines (kEUR)</Typography>
                <Chip label="Verified" size="small" sx={{ bgcolor: '#2E7D32', color: '#fff', height: 16, fontSize: '0.6rem' }} />
              </Box>
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={PNL_TOTALS} margin={{ top: 4, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="metric" tick={{ fontSize: 8.5 }} interval={0} />
                  <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}M`} tick={{ fontSize: 10 }} width={38} />
                  <Tooltip formatter={(v: number | undefined) => [`${(v ?? 0).toLocaleString()} kEUR`, 'Actual']} labelStyle={{ fontWeight: 700 }} />
                  <Bar dataKey="actual" name="Actual (kEUR)" radius={[3, 3, 0, 0]}>
                    {PNL_TOTALS.map((e, i) => (
                      <Cell key={i} fill={
                        e.metric === 'EBIT' ? '#2E7D32'
                        : e.metric === 'Overall Result' ? '#1565C0'
                        : CHART_COLORS[i % CHART_COLORS.length]
                      } />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <ChartNote source="RECO Analysis (KRECO20) — all DPS entities" note="Revenue 385M → Gross Margin 299M → Adj. EBIT 211M → EBIT 205M → Overall 78M." />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ── CHART ROW 2: OIT trend + AMSP by BU + backlog ── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card elevation={1}>
            <CardContent sx={{ pb: '12px !important' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.92rem' }}>
                  {show2026 ? 'FY2026 Monthly OIT vs RR' : 'Monthly OIT — FY2024 vs FY2025'}
                </Typography>
                <Chip label="Verified" size="small" sx={{ bgcolor: '#2E7D32', color: '#fff', height: 16, fontSize: '0.6rem' }} />
              </Box>
              <ResponsiveContainer width="100%" height={230}>
                {show2026 ? (
                  <BarChart data={oit2026Monthly} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} domain={[0, 15]} width={28} />
                    <Tooltip formatter={(v: number | undefined, n: string | undefined) => [(v ?? 0), n === 'oitUnits' ? 'OIT' : 'RR (invoiced)']} labelStyle={{ fontWeight: 700 }} />
                    <Legend wrapperStyle={{ fontSize: '0.75rem' }} formatter={v => v === 'oitUnits' ? 'OIT (order intake)' : 'RR (revenue recognition)'} />
                    <Bar dataKey="oitUnits" name="oitUnits" fill={CHART_COLORS[0]} radius={[3, 3, 0, 0]} />
                    <Bar dataKey="rrUnits"  name="rrUnits"  fill={CHART_COLORS[1]} radius={[3, 3, 0, 0]} />
                  </BarChart>
                ) : (
                  <BarChart data={monthlyOitTrend} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} domain={[0, 25]} width={28} />
                    <Tooltip labelStyle={{ fontWeight: 700 }} />
                    <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                    {showFY2024 && <Bar dataKey="fy2024" name="FY2024" fill={CHART_COLORS[0]} opacity={0.55} radius={[2, 2, 0, 0]} />}
                    {showFY2025 && <Bar dataKey="fy2025" name="FY2025" fill={CHART_COLORS[1]} radius={[2, 2, 0, 0]} />}
                  </BarChart>
                )}
              </ResponsiveContainer>
              <ChartNote
                source="Order follow-up file — OIT sheets"
                note={show2026 ? 'OIT > RR each month = backlog building. Mar is MTD.' : 'FY2025 flat vs FY2024 (195 vs 196 units). No clear seasonal pattern.'}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card elevation={1}>
            <CardContent sx={{ pb: '12px !important' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.92rem' }}>AMSP by BU · Backlog 2026</Typography>
                <Chip label="Verified" size="small" sx={{ bgcolor: '#2E7D32', color: '#fff', height: 16, fontSize: '0.6rem' }} />
              </Box>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart
                  data={filteredBuMargin}
                  layout="vertical"
                  margin={{ top: 2, right: 35, left: 70, bottom: 2 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tickFormatter={v => `${v}%`} tick={{ fontSize: 9 }} domain={[0, 100]} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={65} />
                  <Tooltip formatter={(v: number | undefined) => [`${v ?? 0}%`, 'AMSP Margin']} />
                  <ReferenceLine x={61.9} stroke="#aaa" strokeDasharray="3 3" label={{ value: '61.9%', position: 'top', fontSize: 8, fill: '#999' }} />
                  <Bar dataKey="amspMargin" name="AMSP Margin" radius={[0, 3, 3, 0]}>
                    {filteredBuMargin.map((e, i) => (
                      <Cell key={i} fill={e.amspMargin >= 61.9 ? CHART_COLORS[1] : CHART_COLORS[2]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              <Divider sx={{ my: 1.5 }} />

              <Typography variant="caption" sx={{ fontWeight: 600, color: '#5A6872', textTransform: 'uppercase', fontSize: '0.65rem' }}>
                Backlog Evolution — FY2026
              </Typography>
              <ResponsiveContainer width="100%" height={90}>
                <LineChart data={backlog2026} margin={{ top: 6, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="period" tick={{ fontSize: 8 }} />
                  <YAxis tick={{ fontSize: 9 }} domain={[35, 52]} width={26} />
                  <Tooltip formatter={(v: number | undefined) => [(v ?? 0), 'Backlog units']} />
                  <Line type="monotone" dataKey="units" stroke={CHART_COLORS[2]} strokeWidth={2.5} dot={{ r: 4, fill: CHART_COLORS[2] }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
              <ChartNote source="AMSP file + Order follow-up" note="LK (62%) above avg, LI (54.9%) below. Backlog 40→43→46 = healthy build." />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ── KEY INSIGHTS (3-column alert panel, like HE IT) ── */}
      <Card elevation={1}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5, color: '#1A2027', fontSize: '0.92rem' }}>
            Key Insights & Alerts
          </Typography>
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Alert severity="error" sx={{ fontSize: '0.8rem' }}>
                <AlertTitle sx={{ fontSize: '0.82rem', fontWeight: 700 }}>Revenue Miss — -17.9% vs Budget</AlertTitle>
                RECO revenue EUR 385.1M vs BP1 EUR 468.8M (gap: -EUR 83.7M). SG&A savings of EUR 9M partially offset but insufficient to close the gap.
              </Alert>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Alert severity="success" sx={{ fontSize: '0.8rem' }}>
                <AlertTitle sx={{ fontSize: '0.82rem', fontWeight: 700 }}>SG&A EUR 9M Favorable</AlertTitle>
                Actual SG&A -EUR 85M vs budget -EUR 94M. Cost discipline is a real positive — partially offsetting the revenue shortfall and often overlooked.
              </Alert>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Alert severity="warning" sx={{ fontSize: '0.8rem' }}>
                <AlertTitle sx={{ fontSize: '0.82rem', fontWeight: 700 }}>December AMSP Anomaly — 46.4%</AlertTitle>
                Highest revenue month (EUR 30.6M) but lowest AMSP margin 46.4% vs 61.9% avg. Likely year-end mix shift or true-up. Requires investigation.
              </Alert>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Alert severity="warning" sx={{ fontSize: '0.8rem' }}>
                <AlertTitle sx={{ fontSize: '0.82rem', fontWeight: 700 }}>Non-recurring EUR 5.8M Overshoot</AlertTitle>
                Non-recurring costs EUR 6.2M vs budget EUR 0.4M. Reduced Adjusted EBIT (EUR 211M) to reported EBIT (EUR 205M). Also drove YoY EBIT decline vs FY2024.
              </Alert>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Alert severity="info" sx={{ fontSize: '0.8rem' }}>
                <AlertTitle sx={{ fontSize: '0.82rem', fontWeight: 700 }}>FY2026 Order Pace +12% Ahead</AlertTitle>
                22 units OIT YTD (Jan–Mar MTD) vs 18 same period FY2025. Backlog rising 40→43→46 units. RR 16 units Jan–Feb — healthy pipeline entering Q2.
              </Alert>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Alert severity="warning" sx={{ fontSize: '0.8rem' }}>
                <AlertTitle sx={{ fontSize: '0.82rem', fontWeight: 700 }}>EUR 64M No AMSP Rate — Data Gap</AlertTitle>
                33.6% of net sales has no AMSP rate — margin for this portion is unknown. The reported 61.9% AMSP margin may be under- or over-stated until resolved.
              </Alert>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};
