import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TimelineIcon from '@mui/icons-material/Timeline';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  ReferenceLine,
} from 'recharts';
import { KpiCard } from '../components/KpiCard';
import { DataConfidenceLegend } from '../components/DataConfidenceLegend';
import { ChartNote } from '../components/ChartNote';
import { GlobalFilters } from '../types';
import {
  revenueReconciliation,
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
}

// RECO P&L waterfall data for executive view
const recoBridgeData = [
  { name: 'Revenue',       value: 385098, fill: CHART_COLORS[0] },
  { name: 'Budget Miss',   value: -83700,  fill: '#EF5350' },
  { name: 'Mfg Contrib',  value: 312900,  fill: CHART_COLORS[1] },
  { name: 'SG&A',         value: -85000,  fill: '#EF5350' },
  { name: 'Adj. EBIT',    value: 211300,  fill: CHART_COLORS[2] },
  { name: 'Non-recur.',   value: -6191,   fill: '#EF9A9A' },
  { name: 'EBIT',         value: 205109,  fill: '#2E7D32' },
];

const ebitComparison = [
  { year: 'FY2024', ebit: 219600, fill: CHART_COLORS[0] },
  { year: 'FY2025', ebit: 205109, fill: '#F57C00' },
];

const buMarginData = productMixData
  .filter(d => ['LK', 'LI', 'M0'].includes(d.bu))
  .map(d => ({ bu: d.bu, name: d.name.replace(' (blended)', ''), margin: d.amspMargin }));

const CustomTooltipKeur = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <Paper sx={{ p: 1.5, border: '1px solid #e0e0e0', fontSize: '0.78rem' }}>
      <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>{label}</Typography>
      {payload.map((p: any) => (
        <Typography key={p.name} variant="caption" sx={{ display: 'block', color: p.color || p.fill }}>
          {p.name}: {typeof p.value === 'number' ? `${(Math.abs(p.value) / 1000).toFixed(0)}M kEUR` : p.value}
        </Typography>
      ))}
    </Paper>
  );
};

export const ExecutiveSummaryTab: React.FC<Props> = ({ filters: _filters }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#1A2027' }}>
        Executive Summary — FY2025 DPS Performance
      </Typography>
      <DataConfidenceLegend />

      {/* ── REVENUE & MARGIN ── */}
      <Box sx={{ mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <MonetizationOnIcon sx={{ color: '#1565C0', fontSize: 18 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1565C0' }}>Revenue & Margin</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, md: 3 }}>
            <KpiCard title="FY2025 Net Revenue (3rdP)" value="EUR 190.6M" subtitle="AMSP Contribution — 3rd party net sales" dataConfidence="verified" dataNote="AMSP Contribution file, 3rdP net sales" status="info" />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <KpiCard title="vs Budget" value="-EUR 83.7M (-17.9%)" subtitle="Actual vs BP1 budget" trend={-1} trendLabel="-17.9% below plan" dataConfidence="derived" dataNote="RECO Analysis vs BP1 budget — kEUR basis" status="error" />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <KpiCard title="AMSP Margin %" value="61.9%" subtitle="FY2025 full year average" dataConfidence="verified" dataNote="AMSP Contribution FY2025 — 3rdP only" status="success" />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <KpiCard title="CO-PA Gross Margin" value="38.9%" subtitle="AGFA NV only — COGS TP basis" dataConfidence="verified" dataNote="CO-PA GMPCOPA_1, AGFA NV only — not full DPS" status="info" />
          </Grid>
        </Grid>
      </Box>

      {/* Chart Row A: Monthly Revenue + AMSP by BU */}
      <Grid container spacing={2} sx={{ mb: 3, mt: 1 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Monthly Net Sales — FY2025
              <Chip label="Verified" size="small" sx={{ ml: 1, bgcolor: '#2E7D32', color: '#fff', height: 16, fontSize: '0.62rem' }} />
            </Typography>
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={monthlyRevenueTrend} margin={{ top: 4, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tickFormatter={(v) => `€${(v / 1000000).toFixed(0)}M`} tick={{ fontSize: 10 }} width={42} />
                <Tooltip formatter={(v: number) => [`€${(v / 1000000).toFixed(1)}M`, 'Net Sales']} labelStyle={{ fontWeight: 700 }} />
                <Bar dataKey="netSales" name="Net Sales" radius={[3, 3, 0, 0]}>
                  {monthlyRevenueTrend.map((e, i) => (
                    <Cell key={i} fill={e.month === 'Dec' ? CHART_COLORS[2] : e.month === 'Jun' ? CHART_COLORS[1] : CHART_COLORS[0]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <ChartNote source="AMSP Contribution file" note="Dec (orange) = highest revenue €30.6M but lowest margin 46.4%. Jun spike visible." />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', height: '100%' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              AMSP Margin by BU
              <Chip label="Verified" size="small" sx={{ ml: 1, bgcolor: '#2E7D32', color: '#fff', height: 16, fontSize: '0.62rem' }} />
            </Typography>
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={buMarginData} layout="vertical" margin={{ top: 4, right: 30, left: 60, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10 }} domain={[0, 100]} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={55} />
                <Tooltip formatter={(v: number) => [`${v}%`, 'AMSP Margin']} labelStyle={{ fontWeight: 700 }} />
                <ReferenceLine x={61.9} stroke="#999" strokeDasharray="4 3" label={{ value: 'Avg', position: 'top', fontSize: 9, fill: '#999' }} />
                <Bar dataKey="margin" name="AMSP Margin %" radius={[0, 3, 3, 0]}>
                  {buMarginData.map((e, i) => (
                    <Cell key={i} fill={e.margin >= 61.9 ? CHART_COLORS[1] : CHART_COLORS[2]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <ChartNote source="AMSP Contribution file" note="Dashed = 61.9% avg. LK Wide Format (62%) above avg; LI Industrial (54.9%) below." />
          </Paper>
        </Grid>
      </Grid>

      {/* ── RECO P&L SUMMARY ── */}
      <Box sx={{ mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <AccountBalanceIcon sx={{ color: '#4527A0', fontSize: 18 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#4527A0' }}>RECO P&L Summary</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, md: 3 }}>
            <KpiCard title="EBIT FY2025" value="EUR 205.1M (53.3%)" subtitle="vs FY2024: EUR 219.6M (-EUR 14.5M)" dataConfidence="verified" dataNote="RECO Analysis — EBIT line" status="info" />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <KpiCard title="SG&A Favorability" value="+EUR 9M vs Budget" subtitle="Actual -85M vs budget -94M — positive story" dataConfidence="verified" dataNote="RECO Analysis — SG&A variance vs BP1" status="success" icon={<TrendingUpIcon sx={{ fontSize: 16 }} />} />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <KpiCard title="Non-recurring Cost" value="EUR 6.2M (unfav.)" subtitle="vs budget EUR 0.4M — EUR 5.8M overshoot" dataConfidence="verified" dataNote="RECO Analysis — non-recurring items vs BP1" status="error" icon={<TrendingDownIcon sx={{ fontSize: 16 }} />} />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <KpiCard title="Revenue vs Budget" value="-EUR 83.7M (-17.9%)" subtitle="Actual vs BP1 budget" trend={-1} trendLabel="-17.9% below plan" dataConfidence="derived" dataNote="RECO Analysis vs BP1 budget — kEUR basis" status="error" />
          </Grid>
        </Grid>
      </Box>

      {/* Chart Row B: RECO P&L Bridge + EBIT YoY */}
      <Grid container spacing={2} sx={{ mb: 3, mt: 1 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              RECO P&L Key Lines — FY2025 (kEUR)
              <Chip label="Verified" size="small" sx={{ ml: 1, bgcolor: '#2E7D32', color: '#fff', height: 16, fontSize: '0.62rem' }} />
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={recoPnL.filter(r => r.isTotal)}
                margin={{ top: 4, right: 10, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="metric" tick={{ fontSize: 9 }} interval={0} />
                <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}M`} tick={{ fontSize: 10 }} width={40} />
                <Tooltip
                  formatter={(v: number) => [`${v.toLocaleString()} kEUR`, 'Actual']}
                  labelStyle={{ fontWeight: 700 }}
                />
                <Bar dataKey="actual" name="Actual (kEUR)" radius={[3, 3, 0, 0]}>
                  {recoPnL.filter(r => r.isTotal).map((e, i) => (
                    <Cell
                      key={i}
                      fill={
                        e.metric === 'EBIT' ? '#2E7D32'
                        : e.metric === 'Overall Result' ? '#1565C0'
                        : CHART_COLORS[i % CHART_COLORS.length]
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <ChartNote source="RECO Analysis (KRECO20) — all DPS entities, kEUR" note="Only P&L total lines shown. Revenue 385M → Gross Margin 299M → EBIT 205M → Overall Result 78M." />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', height: '100%' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              EBIT — FY2024 vs FY2025
              <Chip label="Verified" size="small" sx={{ ml: 1, bgcolor: '#2E7D32', color: '#fff', height: 16, fontSize: '0.62rem' }} />
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ebitComparison} margin={{ top: 4, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}M`} tick={{ fontSize: 10 }} width={42} domain={[180000, 230000]} />
                <Tooltip formatter={(v: number) => [`${v.toLocaleString()} kEUR`, 'EBIT']} labelStyle={{ fontWeight: 700 }} />
                <Bar dataKey="ebit" name="EBIT (kEUR)" radius={[4, 4, 0, 0]}>
                  {ebitComparison.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <Box sx={{ mt: 1, p: 1.5, bgcolor: '#FFF3E0', borderRadius: 1, border: '1px solid #FFE0B2' }}>
              <Typography variant="caption" sx={{ color: '#E65100', fontWeight: 700, display: 'block' }}>
                YoY: -EUR 14.5M (-6.6%)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Revenue miss (-83.7M) partially offset by SG&A savings (+9M) and prior-year EBIT base included non-recurring tailwinds.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* ── ORDER PIPELINE FY2025 ── */}
      <Box sx={{ mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <InventoryIcon sx={{ color: '#00897B', fontSize: 18 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#00897B' }}>Order Pipeline — FY2025</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, md: 3 }}>
            <KpiCard title="FY2025 OIT Units" value="195 units" subtitle="Full year order intake" dataConfidence="verified" dataNote="Order follow-up file — master OIT sheet" status="info" />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <KpiCard title="vs FY2024" value="-1 unit (-0.5%)" subtitle="FY2024: 196 units" trend={-1} trendLabel="Flat vs prior year" dataConfidence="derived" dataNote="FY2025 195 vs FY2024 196" status="warning" />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <KpiCard title="Delayed Orders" value="12 units" subtitle="6.2% of FY2025 cohort delayed" dataConfidence="verified" dataNote="Delayed tracker tab — all from FY2025 cohort" status="warning" />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <KpiCard title="OIT EUR Value" value="Not Available" subtitle="Units tracked only — see Data Gaps" dataConfidence="proxy" dataNote="EUR value requires SAP SD module link" status="error" />
          </Grid>
        </Grid>
      </Box>

      {/* Chart Row C: OIT FY2024 vs FY2025 monthly + AMSP by BC */}
      <Grid container spacing={2} sx={{ mb: 3, mt: 1 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Monthly OIT — FY2024 vs FY2025
              <Chip label="Verified" size="small" sx={{ ml: 1, bgcolor: '#2E7D32', color: '#fff', height: 16, fontSize: '0.62rem' }} />
            </Typography>
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={monthlyOitTrend} margin={{ top: 4, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} domain={[0, 25]} width={28} />
                <Tooltip labelStyle={{ fontWeight: 700 }} />
                <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                <Bar dataKey="fy2024" name="FY2024" fill={CHART_COLORS[0]} opacity={0.55} radius={[2, 2, 0, 0]} />
                <Bar dataKey="fy2025" name="FY2025" fill={CHART_COLORS[1]} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <ChartNote source="Order follow-up file — OIT sheets" note="FY2025 effectively flat vs FY2024. No significant seasonal shift." />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', height: '100%' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              AMSP Margin by Budget Class
              <Chip label="Verified" size="small" sx={{ ml: 1, bgcolor: '#2E7D32', color: '#fff', height: 16, fontSize: '0.62rem' }} />
            </Typography>
            <ResponsiveContainer width="100%" height={190}>
              <BarChart
                data={[...amspByBudgetClass].sort((a, b) => b.margin - a.margin)}
                layout="vertical"
                margin={{ top: 4, right: 30, left: 135, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10 }} domain={[0, 100]} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={130} />
                <Tooltip formatter={(v: number) => [`${v}%`, 'AMSP Margin']} labelStyle={{ fontWeight: 700 }} />
                <ReferenceLine x={61.9} stroke="#999" strokeDasharray="4 3" />
                <Bar dataKey="margin" name="AMSP Margin %" radius={[0, 3, 3, 0]}>
                  {[...amspByBudgetClass].sort((a, b) => b.margin - a.margin).map((e, i) => (
                    <Cell key={i} fill={e.margin > 60 ? CHART_COLORS[1] : e.margin > 30 ? CHART_COLORS[2] : CHART_COLORS[3]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <ChartNote source="AMSP Contribution file" note="Speedset 9.6% is a margin outlier. Print Engineering 95.9% is the top performer." />
          </Paper>
        </Grid>
      </Grid>

      {/* ── FY2026 YTD PIPELINE ── */}
      <Box sx={{ mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <TimelineIcon sx={{ color: '#00695C', fontSize: 18 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#00695C' }}>FY2026 YTD Pipeline</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, md: 3 }}>
            <KpiCard title="FY2026 OIT YTD" value="22 units" subtitle="Jan=11, Feb=10, Mar=3 MTD" dataConfidence="verified" dataNote="Order follow-up file — FY2026 OIT tracker" status="info" />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <KpiCard title="FY2026 RR YTD" value="16 units" subtitle="Revenue Recognition: Jan=9, Feb=7" dataConfidence="verified" dataNote="Order follow-up file — FY2026 RR tracker" status="info" />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <KpiCard title="Backlog End-Feb" value="46 units" subtitle="Rising (End-Jan was 43)" dataConfidence="verified" dataNote="Derived from cumulative OIT minus RR" status="warning" />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <KpiCard title="YTD Pace vs FY2025" value="+12% ahead" subtitle="22 units vs 18 units same period FY2025" trend={1} trendLabel="+12% ahead" dataConfidence="derived" dataNote="FY2026 YTD 22 vs FY2025 same period 18" status="success" icon={<TrendingUpIcon sx={{ fontSize: 16 }} />} />
          </Grid>
        </Grid>
      </Box>

      {/* Chart Row D: 2026 OIT vs RR monthly + Backlog trend */}
      <Grid container spacing={2} sx={{ mb: 3, mt: 1 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              FY2026 Monthly OIT vs RR
              <Chip label="Verified" size="small" sx={{ ml: 1, bgcolor: '#2E7D32', color: '#fff', height: 16, fontSize: '0.62rem' }} />
            </Typography>
            <ResponsiveContainer width="100%" height={185}>
              <BarChart data={oit2026Monthly} margin={{ top: 4, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} domain={[0, 15]} width={28} />
                <Tooltip
                  formatter={(v: number, name: string) => [v, name === 'oitUnits' ? 'OIT (order intake)' : 'RR (invoiced units)']}
                  labelStyle={{ fontWeight: 700 }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '0.75rem' }}
                  formatter={(v) => v === 'oitUnits' ? 'OIT (order intake)' : 'RR (revenue recognition)'}
                />
                <ReferenceLine y={8.3} stroke="#999" strokeDasharray="4 3" label={{ value: '~100/yr pace', position: 'right', fontSize: 9, fill: '#999' }} />
                <Bar dataKey="oitUnits" name="oitUnits" fill={CHART_COLORS[0]} radius={[3, 3, 0, 0]} />
                <Bar dataKey="rrUnits" name="rrUnits" fill={CHART_COLORS[1]} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <ChartNote source="Order follow-up file — Jan-Feb confirmed, Mar MTD" note="OIT > RR each month = backlog building. RR = revenue recognition (invoiced/installed units)." />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', height: '100%' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Backlog Evolution — 2026
              <Chip label="Verified" size="small" sx={{ ml: 1, bgcolor: '#2E7D32', color: '#fff', height: 16, fontSize: '0.62rem' }} />
            </Typography>
            <ResponsiveContainer width="100%" height={185}>
              <LineChart data={backlog2026} margin={{ top: 4, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="period" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 10 }} domain={[35, 52]} width={28} />
                <Tooltip formatter={(v: number) => [v, 'Backlog (units)']} labelStyle={{ fontWeight: 700 }} />
                <Line
                  type="monotone"
                  dataKey="units"
                  name="Backlog"
                  stroke={CHART_COLORS[2]}
                  strokeWidth={2.5}
                  dot={{ r: 5, fill: CHART_COLORS[2] }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <Box sx={{ mt: 1, p: 1.5, bgcolor: '#E8F5E9', borderRadius: 1, border: '1px solid #c8e6c9' }}>
              <Typography variant="caption" sx={{ color: '#2E7D32', fontWeight: 700, display: 'block' }}>
                Backlog rising: 40 → 43 → 46 units
              </Typography>
              <Typography variant="caption" color="text.secondary">
                OIT pace exceeding RR = healthy order book build entering Q2 2026.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* ── PRODUCT MIX ── */}
      <Box sx={{ mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <CategoryIcon sx={{ color: '#6A1B9A', fontSize: 18 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#6A1B9A' }}>Product Mix</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, md: 3 }}>
            <KpiCard title="Top Margin Product" value="95.9%" subtitle="Packaging Print Engineering" dataConfidence="verified" dataNote="AMSP Contribution — highest AMSP margin by budget class" status="success" icon={<TrendingUpIcon sx={{ fontSize: 16 }} />} />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <KpiCard title="Lowest Margin Product" value="9.6%" subtitle="Packaging Speedset" dataConfidence="verified" dataNote="AMSP Contribution — lowest AMSP margin by budget class" status="error" icon={<TrendingDownIcon sx={{ fontSize: 16 }} />} />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <KpiCard title="No AMSP Rate" value="EUR 64M at risk" subtitle="33.6% of net sales — margin unknown" dataConfidence="estimated" dataNote="Net sales without AMSP rate assigned; actual margin is unknown" status="warning" />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <KpiCard title="Dec Margin Anomaly" value="46.4%" subtitle="vs 61.9% full-year avg" dataConfidence="verified" dataNote="December AMSP margin drop — year-end anomaly" status="warning" />
          </Grid>
        </Grid>
      </Box>

      {/* ── DATA QUALITY ── */}
      <Box sx={{ mb: 2, mt: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <AssessmentIcon sx={{ color: '#5A6872', fontSize: 18 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#5A6872' }}>Data Quality Summary</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, md: 3 }}>
            <KpiCard title="Files Analyzed" value="7 files" subtitle="Excel exports from SAP BW / Manual" dataConfidence="verified" dataNote="4 financial files + 2 order book files + 1 OIT tracker" />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <KpiCard title="KPIs Verified" value="18 KPIs" subtitle="Direct from source data" dataConfidence="derived" dataNote="Count of KPIs with verified or derived confidence level" />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <KpiCard title="Data Gaps" value="6 gaps" subtitle="KPIs not available in current files" dataConfidence="verified" dataNote="See Data Overview tab for full gap analysis" status="error" />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <KpiCard title="IC Revenue in Scope" value="EUR 270.6M" subtitle="Intercompany — must be eliminated" dataConfidence="verified" dataNote="RECO Analysis — IC elimination required for external view" status="warning" />
          </Grid>
        </Grid>
      </Box>

      {/* Revenue Reconciliation Table */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5, color: '#1A2027' }}>
          Revenue Reconciliation — Why Do Different Files Show Different Numbers?
        </Typography>
        <Alert severity="info" sx={{ mb: 2, fontSize: '0.82rem' }}>
          <strong>Key insight:</strong> RECO Analysis (EUR 385M) includes all AGFA entities + intercompany flows. After IC elimination and scoping to AGFA NV third-party, the comparable figure is EUR 190.6M (AMSP). The differences are explained below.
        </Alert>
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Source / Scope</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Value (kEUR)</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Explanation</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>vs AMSP</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {revenueReconciliation.map((row, i) => {
                const diff = row.value - 190600;
                const pct = ((diff / 190600) * 100).toFixed(1);
                const isBase = row.value === 190600;
                return (
                  <TableRow key={i} hover sx={{ bgcolor: isBase ? '#E8F5E9' : 'inherit' }}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: isBase ? 700 : 400 }}>
                        {row.source}
                        {isBase && <Chip label="Base" size="small" sx={{ ml: 1, bgcolor: '#2E7D32', color: '#fff', height: 16, fontSize: '0.65rem' }} />}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                        {row.value.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">{row.note}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      {isBase ? (
                        <Chip label="Reference" size="small" sx={{ bgcolor: '#2E7D32', color: '#fff', height: 16, fontSize: '0.65rem' }} />
                      ) : (
                        <Typography variant="caption" sx={{ color: diff > 0 ? '#2E7D32' : '#D32F2F', fontWeight: 600 }}>
                          {diff > 0 ? '+' : ''}{diff.toLocaleString()} ({diff > 0 ? '+' : ''}{pct}%)
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};
