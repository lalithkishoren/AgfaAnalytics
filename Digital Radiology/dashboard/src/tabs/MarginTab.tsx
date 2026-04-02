import React, { useMemo } from 'react';
import {
  Grid, Typography, Box, Card, CardContent, Chip,
  Table, TableHead, TableRow, TableCell, TableBody,
} from '@mui/material';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ComposedChart,
} from 'recharts';
import PowerIcon from '@mui/icons-material/Power';
import PercentIcon from '@mui/icons-material/Percent';
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

// ── Dummy data ─────────────────────────────────────────────────────────────────

const equipmentMarginData = [
  { equipment: 'DR 100e',  crmMargin: 41.2, stdMargin: 38.5 },
  { equipment: 'DR 400',   crmMargin: 38.8, stdMargin: 36.2 },
  { equipment: 'DR 600',   crmMargin: 36.4, stdMargin: 34.1 },
  { equipment: 'DR 800',   crmMargin: 33.9, stdMargin: 31.5 },
  { equipment: 'Valory',   crmMargin: 44.1, stdMargin: 42.0 },
  { equipment: 'Retrofit', crmMargin: 45.2, stdMargin: 43.8 },
  { equipment: 'DX-D 300', crmMargin: 29.5, stdMargin: 27.1 },
];

// Waterfall margin bridge
const marginBridgeRaw = [
  { label: 'Budget Margin',  value: 18.4, delta: 18.4, base: 0,    type: 'base' },
  { label: 'Volume Effect',  value:  1.2, delta:  1.2, base: 18.4, type: 'positive' },
  { label: 'Mix Effect',     value: -0.8, delta:  0.8, base: 18.8, type: 'negative' },
  { label: 'Price Effect',   value:  0.6, delta:  0.6, base: 18.0, type: 'positive' },
  { label: 'Cost Variance',  value: -1.1, delta:  1.1, base: 17.5, type: 'negative' },
  { label: 'FX Effect',      value: -0.4, delta:  0.4, base: 16.5, type: 'negative' },
  { label: 'Channel Mix',    value:  0.3, delta:  0.3, base: 16.2, type: 'positive' },
  { label: 'Actual Margin',  value: 18.2, delta: 18.2, base: 0,    type: 'base' },
];

const dsCalibrationData = [
  { band: 'DS 10–29',  total: 312, won: 42,  actualWin: 13.5, target: 20 },
  { band: 'DS 30–49',  total: 489, won: 112, actualWin: 22.9, target: 40 },
  { band: 'DS 50–69',  total: 634, won: 251, actualWin: 39.6, target: 60 },
  { band: 'DS 70–89',  total: 398, won: 241, actualWin: 60.6, target: 80 },
  { band: 'DS 90–100', total: 187, won: 142, actualWin: 75.9, target: 90 },
];

const sofonComplianceData = [
  { stage: 'Quoting',     total: 124, quoted: 112, pct: 90.3, status: 'Good' },
  { stage: 'Negotiating', total: 89,  quoted: 71,  pct: 79.8, status: 'Watch' },
  { stage: 'Closing',     total: 43,  quoted: 29,  pct: 67.4, status: 'Action' },
];

const calStatus = (actual: number, target: number): { label: string; color: string } => {
  const diff = actual - target;
  if (Math.abs(diff) <= 5)  return { label: '● Good',           color: '#2E7D32' };
  if (diff < -5)             return { label: '✗ Needs attention', color: '#D32F2F' };
  return                            { label: '⚠ Over-confident', color: '#E65100' };
};

const sofonBadge = (status: string) => ({
  height: 20, fontSize: '0.65rem', fontWeight: 700,
  bgcolor: status === 'Good' ? '#E8F5E9' : status === 'Watch' ? '#FFF3E0' : '#FFEBEE',
  color:   status === 'Good' ? '#2E7D32' : status === 'Watch' ? '#E65100' : '#D32F2F',
});

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography variant="h6" sx={{ mb: 1, mt: 3, fontWeight: 700, color: '#1565C0', borderBottom: '2px solid #E3F2FD', pb: 0.5 }}>
    {children}
  </Typography>
);

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

      {/* ── Existing KPI cards ─────────────────────────────────────────────── */}
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

      {/* ── Existing win rate charts ───────────────────────────────────────── */}
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
                  <XAxis type="number" tickFormatter={(v: any) => `${v}%`} domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="region" tick={{ fontSize: 9 }} width={100} />
                  <Tooltip formatter={(v: any) => [`${v}%`, 'Win Rate']} />
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
                  <XAxis type="number" tickFormatter={(v: any) => `${v}%`} domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="equipment" tick={{ fontSize: 9 }} width={130} />
                  <Tooltip formatter={(v: any) => [`${v}%`, 'Win Rate']} />
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
                <BarChart data={winLoss.closedByQuarter.slice(-12)} margin={{ top: 5, right: 20, left: 10, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="period" tick={{ fontSize: 9 }} angle={-30} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="won"  name="Won"  fill="#2E7D32" stackId="a" />
                  <Bar dataKey="lost" name="Lost" fill="#EF5350" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
              <ChartNote note="✅ Verified: opportunity.csv — Won and Lost by actualclosedate quarter" />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }} />
      </Grid>

      {/* ── Section: CRM Margin by Equipment Type (Page 5.1) ──────────────── */}
      <SectionHeader>CRM Margin by Equipment Type (Page 5.1)</SectionHeader>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={equipmentMarginData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tickFormatter={(v: any) => `${v}%`} domain={[25, 50]} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="equipment" tick={{ fontSize: 10 }} width={80} />
              <Tooltip formatter={(v: any) => [`${v}%`]} />
              <Legend />
              <Bar dataKey="stdMargin" name="Standard (Sofon cost+)" fill="#1565C0" radius={[0, 4, 4, 0]} />
              <Bar dataKey="crmMargin" name="CRM Estimate (KAM)"    fill="#F57C00" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <ChartNote note="⚠ Estimated: CRM margin = KAM entered at deal creation. Standard = Sofon cost+. Actual SAP margin requires EDW." />
          <DataUnavailableNote source="SAP BW actual cost data — EDW Phase 1 required for verified margin by product." />
        </CardContent>
      </Card>

      {/* ── Section: Margin Bridge (Page 5.2) ─────────────────────────────── */}
      <SectionHeader>Margin Bridge — Budget vs Actual (Page 5.2)</SectionHeader>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={marginBridgeRaw} margin={{ top: 5, right: 20, left: 10, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 9 }} angle={-20} textAnchor="end" />
              <YAxis tickFormatter={(v: any) => `€${v}M`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: any, name: any) => name === 'Base (hidden)' ? undefined : [`€${v}M`]} />
              {/* Invisible base for waterfall offset */}
              <Bar dataKey="base"  name="Base (hidden)" fill="transparent" stackId="mb" />
              <Bar dataKey="delta" name="Amount (€M)"   stackId="mb" radius={[4, 4, 0, 0]}>
                {marginBridgeRaw.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.type === 'base' ? '#1565C0' : entry.type === 'positive' ? '#2E7D32' : '#EF5350'}
                  />
                ))}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
          <DataUnavailableNote source="Volume/Mix/Price/FX bridges require SAP BW actual data. EDW Phase 1." />
        </CardContent>
      </Card>

      {/* ── Section: DS% Score Calibration (Page 5.3) ─────────────────────── */}
      <SectionHeader>DS% Score Calibration (Page 5.3)</SectionHeader>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#F5F7FA' }}>
                {['DS% Band', 'Total Opps', 'Won', 'Actual Win %', 'Target %', 'Calibration'].map(h => (
                  <TableCell key={h}><Typography variant="caption" fontWeight={700}>{h}</Typography></TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {dsCalibrationData.map((row, i) => {
                const cal = calStatus(row.actualWin, row.target);
                return (
                  <TableRow key={i} hover>
                    <TableCell><Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{row.band}</Typography></TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{row.total}</Typography></TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#2E7D32' }}>{row.won}</Typography></TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{row.actualWin}%</Typography></TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#5A6872' }}>{row.target}%</Typography></TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontSize: '0.72rem', fontWeight: 600, color: cal.color }}>
                        {cal.label}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <ChartNote note="⚠ Estimated: Derived from opportunity.csv DS% field vs closed status. Ranges are approximate." />
          <DataUnavailableNote source="DS% calibration requires CRM DS% field (agfa_ds_pct) matched against win/loss outcomes — available from opportunity.csv but ranges are approximate." />
        </CardContent>
      </Card>

      {/* ── Section: Sofon Quote Compliance ───────────────────────────────── */}
      <SectionHeader>Sofon Quote Compliance</SectionHeader>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#F5F7FA' }}>
                {['CRM Stage', 'Total Deals', 'With Sofon Quote', 'Coverage %', 'Status'].map(h => (
                  <TableCell key={h}><Typography variant="caption" fontWeight={700}>{h}</Typography></TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sofonComplianceData.map((row, i) => (
                <TableRow key={i} hover>
                  <TableCell><Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{row.stage}</Typography></TableCell>
                  <TableCell><Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{row.total}</Typography></TableCell>
                  <TableCell><Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#2E7D32' }}>{row.quoted}</Typography></TableCell>
                  <TableCell><Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{row.pct}%</Typography></TableCell>
                  <TableCell>
                    <Chip label={row.status} size="small" sx={sofonBadge(row.status)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <DataUnavailableNote source="Sofon quote sent status requires CRM-Sofon integration field. EDW Phase 2." />
        </CardContent>
      </Card>
    </Box>
  );
};

export default MarginTab;
