import React from 'react';
import {
  Grid, Typography, Box, Card, CardContent,
  Table, TableHead, TableRow, TableCell, TableBody,
  Chip,
} from '@mui/material';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, ComposedChart,
} from 'recharts';
import InventoryIcon from '@mui/icons-material/Inventory';
import PowerIcon from '@mui/icons-material/Power';
import { KpiCard } from '../components/KpiCard';
import { DataConfidenceLegend } from '../components/DataConfidenceLegend';
import { DataUnavailableNote } from '../components/DataUnavailableNote';
import { ChartNote } from './OverviewTab';
import { DashboardData, GlobalFilters, NavigateAction } from '../types';
import { fmtNum } from '../utils/formatters';

interface Props {
  data: DashboardData;
  filters: GlobalFilters;
  onNavigate: (nav: NavigateAction) => void;
}

// ── Dummy data ─────────────────────────────────────────────────────────────────

const recoPhasingData = [
  { month: 'Jan-26', actual: 3.8,  planned: 3.5, budget: 4.2 },
  { month: 'Feb-26', actual: 4.2,  planned: 4.0, budget: 4.2 },
  { month: 'Mar-26', actual: null, planned: 4.8, budget: 4.5 },
  { month: 'Apr-26', actual: null, planned: 5.1, budget: 4.8 },
  { month: 'May-26', actual: null, planned: 4.6, budget: 4.5 },
  { month: 'Jun-26', actual: null, planned: 5.4, budget: 5.0 },
];

// Waterfall data: running totals for a proper waterfall display
// We'll represent as ComposedChart with stacked bar (invisible base + visible delta)
const waterfallRaw = [
  { label: 'Opening OB Q1', value: 45.2, delta: 45.2, base: 0, color: '#1565C0' },
  { label: '+ OIT Won Q1',  value:  8.3, delta:  8.3, base: 45.2, color: '#2E7D32' },
  { label: '– Reco Recog.', value: -8.0, delta:  8.0, base: 37.2, color: '#EF5350' },
  { label: 'Closing OB Q2', value: 45.5, delta: 45.5, base: 0, color: '#1565C0' },
];

const riskRegister = [
  { opp: 'OPP-2025-1721', customer: 'Northern Regional Hospital', region: 'Europe North',     equip: 'DR 800',  value: '€520k', planned: 'Apr-26', risk: 'Installation delay >30d',    confidence: 'Low' },
  { opp: 'OPP-2025-1834', customer: 'Sao Paulo Imaging',          region: 'Intercontinental', equip: 'DR 600',  value: '€290k', planned: 'Apr-26', risk: 'Customer site not ready',    confidence: 'Low' },
  { opp: 'OPP-2025-1956', customer: 'Boston Medical',             region: 'North America',    equip: 'DR 400',  value: '€185k', planned: 'May-26', risk: 'Permitting delays',           confidence: 'Medium' },
  { opp: 'OPP-2026-0023', customer: 'Paris Clinique',             region: 'Europe South',     equip: 'Retrofit',value: '€95k',  planned: 'May-26', risk: 'Hardware supply',             confidence: 'Medium' },
];

const recoConfidenceCards = [
  { label: 'High Confidence (SAP confirmed)', value: '€12.4M' },
  { label: 'Medium (In delivery)',             value: '€8.1M' },
  { label: 'Low (Date set, not started)',      value: '€6.8M' },
  { label: 'No Date Set ⚠',                   value: '€4.2M' },
];

const bbData = [
  { month: 'Jan-26', bb: 1.8, totalReco: 3.8, bbPct: 47.4 },
  { month: 'Feb-26', bb: 2.1, totalReco: 4.2, bbPct: 50.0 },
  { month: 'Mar-26', bb: 1.4, totalReco: null, bbPct: null },
  { month: 'Apr-26', bb: 1.9, totalReco: null, bbPct: null },
];

const confidenceBadge = (conf: string) => ({
  height: 20, fontSize: '0.65rem', fontWeight: 700,
  bgcolor: conf === 'Low' ? '#FFEBEE' : conf === 'Medium' ? '#FFF3E0' : '#E8F5E9',
  color:   conf === 'Low' ? '#D32F2F' : conf === 'Medium' ? '#E65100' : '#2E7D32',
});

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography variant="h6" sx={{ mb: 1, mt: 3, fontWeight: 700, color: '#1565C0', borderBottom: '2px solid #E3F2FD', pb: 0.5 }}>
    {children}
  </Typography>
);

const RecoTab: React.FC<Props> = ({ data }) => {
  const { kpis } = data;

  return (
    <Box>
      <DataConfidenceLegend />

      {/* ── 3 KPI cards (kept from original) ───────────────────────────────── */}
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

      {/* ── Page 4.1 — Reco Phasing Monthly ────────────────────────────────── */}
      <SectionHeader>Reco Phasing — Monthly (Page 4.1)</SectionHeader>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={recoPhasingData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v: any) => `€${v}M`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: any) => v !== null ? [`€${v}M`] : ['—']} />
              <ReferenceLine y={4.2} stroke="#D32F2F" strokeDasharray="4 4"
                label={{ value: 'Budget avg', position: 'insideTopRight', fontSize: 10, fill: '#D32F2F' }} />
              <Bar dataKey="planned" name="Planned" fill="#F57C00" opacity={0.6} radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual"  name="Actual"  fill="#1565C0" radius={[4, 4, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
          <ChartNote note="⚠ Illustrative: Jan–Feb actual shown; Mar–Jun planned only. Budget line = monthly average." />
          <DataUnavailableNote source="SAP invoice posting date for actual. Planned from CRM agfa_plannedrevenuerecognitiondate." />
        </CardContent>
      </Card>

      {/* ── Revenue Waterfall ────────────────────────────────────────────────── */}
      <SectionHeader>Revenue Waterfall — Q1 2026</SectionHeader>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={waterfallRaw} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} />
              <YAxis tickFormatter={(v: any) => `€${v}M`} domain={[0, 56]} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(v: any, name: any) => name === 'Base (hidden)' ? undefined : [`€${v}M`]}
              />
              {/* Invisible base bar for stacking effect */}
              <Bar dataKey="base"  name="Base (hidden)" fill="transparent" stackId="wf" />
              <Bar dataKey="delta" name="Amount (€M)"   stackId="wf" radius={[4, 4, 0, 0]}>
                {waterfallRaw.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
          <DataUnavailableNote source="Opening/closing order book requires SAP order book join. Reco amounts require SAP invoice posting." />
        </CardContent>
      </Card>

      {/* ── Page 4.2 — Reco Risk Register ───────────────────────────────────── */}
      <SectionHeader>Reco Risk Register (Page 4.2)</SectionHeader>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#F5F7FA' }}>
                  {['Opportunity', 'Customer', 'Region', 'Equipment', 'Value', 'Planned Reco', 'Risk', 'Confidence'].map(h => (
                    <TableCell key={h}><Typography variant="caption" fontWeight={700}>{h}</Typography></TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {riskRegister.map((row, i) => (
                  <TableRow key={i} hover>
                    <TableCell><Typography variant="body2" sx={{ fontSize: '0.7rem', fontFamily: 'monospace' }}>{row.opp}</Typography></TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{row.customer}</Typography></TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontSize: '0.72rem', color: '#5A6872' }}>{row.region}</Typography></TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontSize: '0.72rem' }}>{row.equip}</Typography></TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{row.value}</Typography></TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontSize: '0.72rem' }}>{row.planned}</Typography></TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontSize: '0.72rem', color: '#B71C1C' }}>{row.risk}</Typography></TableCell>
                    <TableCell>
                      <Chip label={row.confidence} size="small" sx={confidenceBadge(row.confidence)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          <DataUnavailableNote source="Risk register requires SAP delivery status + CRM site readiness fields. EDW Phase 3." />
        </CardContent>
      </Card>

      {/* ── Reco Confidence Summary ──────────────────────────────────────────── */}
      <SectionHeader>Reco Confidence Summary</SectionHeader>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {recoConfidenceCards.map((card, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              title={card.label}
              value={card.value}
              subtitle="Illustrative — EDW required for actuals"
              icon={<InventoryIcon />}
              dataConfidence="proxy"
              dataNote="Proxy — illustrative. SAP delivery status required." />
          </Grid>
        ))}
      </Grid>
      <DataUnavailableNote source="Confidence classification requires SAP delivery milestone data. EDW Phase 3." />

      {/* ── Page 4.3 — Book & Bill Tracker ──────────────────────────────────── */}
      <SectionHeader>Book &amp; Bill Tracker (Page 4.3)</SectionHeader>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={bbData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v: any) => `€${v}M`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: any) => v !== null ? [`€${v}M`] : ['—']} />
              <Bar dataKey="bb"        name="Book & Bill (€M)" fill="#2E7D32" radius={[4, 4, 0, 0]} />
              <Bar dataKey="totalReco" name="Total Reco (€M)"  fill="#90CAF9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <ChartNote note="⚠ Illustrative: Jan–Feb actuals shown; Mar–Apr projected B&B only. Total Reco not yet available." />
          <DataUnavailableNote source="Book & Bill requires same-period OIT and SAP invoice matching. EDW Phase 1." />
        </CardContent>
      </Card>
    </Box>
  );
};

export default RecoTab;
