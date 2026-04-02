import React, { useState, useMemo } from 'react';
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
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SearchIcon from '@mui/icons-material/Search';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { DataConfidenceLegend } from '../components/DataConfidenceLegend';
import { ChartNote } from '../components/ChartNote';
import { GlobalFilters } from '../types';
import { monthlyOitTrend, oit2026Monthly, backlog2026, dataGaps } from '../data/dpsData';

interface Props {
  filters: GlobalFilters;
}

// Monthly OIT by BU — derived breakdown
const monthlyOitByBU = monthlyOitTrend.map((m) => {
  const lk = Math.round(m.fy2025 * 0.35);
  const li = Math.round(m.fy2025 * 0.27);
  const m0 = m.fy2025 - lk - li;
  return { month: m.month, LK: lk, LI: li, M0: m0, total: m.fy2025 };
});

// Delayed orders detail
const delayedOrders = [
  { id: 'ORD-2025-0412', product: 'Jeti Tauro H3300 LED',  bu: 'LK', customer: 'AGFA Germany (IC)',     region: 'Europe',              originalRR: 'Sep 2025', revisedRR: 'Jan 2026', reason: 'Component shortage — LED modules',          weeksDelay: 16 },
  { id: 'ORD-2025-0581', product: 'INCA SpeedSet 250',      bu: 'M0', customer: 'External Customer A',   region: 'Americas',            originalRR: 'Oct 2025', revisedRR: 'Feb 2026', reason: 'Customer site not ready',                   weeksDelay: 18 },
  { id: 'ORD-2025-0623', product: 'Jeti Mira LED',          bu: 'LK', customer: 'AGFA France (IC)',      region: 'Europe',              originalRR: 'Aug 2025', revisedRR: 'Dec 2025', reason: 'Shipping delay — sea freight',               weeksDelay: 18 },
  { id: 'ORD-2025-0744', product: 'INCA OnSet X3',          bu: 'LI', customer: 'AGFA USA (IC)',         region: 'Americas',            originalRR: 'Nov 2025', revisedRR: 'Mar 2026', reason: 'Installation crew availability',             weeksDelay: 18 },
  { id: 'ORD-2025-0812', product: 'Jeti Tauro H2500 LED',  bu: 'LK', customer: 'External Customer B',   region: 'Asia Pacific',        originalRR: 'Sep 2025', revisedRR: 'Feb 2026', reason: 'Import clearance delay',                    weeksDelay: 22 },
  { id: 'ORD-2025-0891', product: 'INCA SpeedSet 160',      bu: 'M0', customer: 'AGFA Netherlands (IC)', region: 'Europe',              originalRR: 'Oct 2025', revisedRR: 'Jan 2026', reason: 'Software validation pending',               weeksDelay: 13 },
  { id: 'ORD-2025-0934', product: 'Jeti Mira LED',          bu: 'LK', customer: 'AGFA China (IC)',       region: 'Asia Pacific',        originalRR: 'Nov 2025', revisedRR: 'Feb 2026', reason: 'Customer approval pending',                 weeksDelay: 13 },
  { id: 'ORD-2025-1042', product: 'INCA OnSet X3HS',        bu: 'LI', customer: 'External Customer C',   region: 'Europe',              originalRR: 'Dec 2025', revisedRR: 'Mar 2026', reason: 'Factory acceptance test rework',            weeksDelay: 13 },
  { id: 'ORD-2025-1103', product: 'Jeti Tauro H3300 LED',  bu: 'LK', customer: 'AGFA Belgium (IC)',      region: 'Europe',              originalRR: 'Nov 2025', revisedRR: 'Apr 2026', reason: 'Power infrastructure upgrade by customer',  weeksDelay: 22 },
  { id: 'ORD-2025-1211', product: 'INCA SpeedSet 250R',     bu: 'M0', customer: 'External Customer D',   region: 'Middle East & Africa',originalRR: 'Dec 2025', revisedRR: 'Mar 2026', reason: 'Training schedule conflict',                weeksDelay: 13 },
  { id: 'ORD-2025-1289', product: 'Jeti Mira LED',          bu: 'LK', customer: 'AGFA Japan (IC)',        region: 'Asia Pacific',        originalRR: 'Dec 2025', revisedRR: 'Feb 2026', reason: 'Year-end holiday closure',                  weeksDelay: 9  },
  { id: 'ORD-2025-1345', product: 'INCA OnSet Q',           bu: 'LI', customer: 'External Customer E',   region: 'Europe',              originalRR: 'Dec 2025', revisedRR: 'Apr 2026', reason: 'Building permit not granted',               weeksDelay: 18 },
];

const BU_COLORS: Record<string, string> = { LK: '#1565C0', LI: '#00897B', M0: '#6A1B9A' };

// The join-key gap entry
const joinKeyGap = dataGaps.find(g => g.kpi.includes('No Join Key'));

// Lifecycle stage visual data
const LIFECYCLE_STAGES = [
  {
    step: '01',
    label: 'Order Intake',
    tag: 'OIT',
    color: '#1565C0',
    bg: '#E3F2FD',
    border: '#90CAF9',
    headerBg: '#1565C0',
    primaryMetric: '195',
    primaryUnit: 'units booked — FY2025',
    kpis: [
      { label: 'FY2024 OIT',      value: '196 units' },
      { label: 'FY2026 YTD',      value: '22 units' },
      { label: 'End-Feb Backlog', value: '46 units' },
    ],
    system: 'Manual Excel',
    available: ['Unit count by month', 'Product family', 'Sales org', 'Delayed tracker'],
    missing:   ['EUR order value', 'SAP Sales Order no.', 'CRM Opportunity ID'],
  },
  {
    step: '02',
    label: 'Revenue Recognition',
    tag: 'RR',
    color: '#00897B',
    bg: '#E0F2F1',
    border: '#80CBC4',
    headerBg: '#00897B',
    primaryMetric: '16',
    primaryUnit: 'units invoiced — FY2026 YTD',
    kpis: [
      { label: 'Delayed orders', value: '12 (FY2025)' },
      { label: 'OIT → RR lag',   value: '~4–8 weeks' },
      { label: 'Source',         value: 'SSOT tab' },
    ],
    system: 'Manual Excel (SSOT)',
    available: ['RR date by month', 'Units recognized', 'Delay reasons'],
    missing:   ['EUR at RR', 'SAP billing doc no.', 'Margin at RR'],
  },
  {
    step: '03',
    label: 'Revenue & Margin',
    tag: 'EUR',
    color: '#2E7D32',
    bg: '#E8F5E9',
    border: '#A5D6A7',
    headerBg: '#2E7D32',
    primaryMetric: '€385M',
    primaryUnit: 'net sales FY2025 (all entities)',
    kpis: [
      { label: 'AMSP Margin',  value: '61.9%' },
      { label: 'CO-PA GM%',   value: '38.9%' },
      { label: 'EBIT',        value: '€205M' },
    ],
    system: 'SAP BW (RECO / AMSP / CO-PA)',
    available: ['Net sales by BU & BC', 'AMSP margin %', 'CO-PA Net TO', 'RECO full P&L'],
    missing:   ['Revenue per order', 'Margin per unit sold', 'Link to OIT order ID'],
  },
];

export const OrderExplorerTab: React.FC<Props> = ({ filters }) => {
  const [search, setSearch] = useState('');

  const filteredDelayed = useMemo(() => delayedOrders.filter((order) => {
    const matchSearch = search === '' ||
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.product.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase());
    const matchBU = filters.bu === 'All' || order.bu === filters.bu;
    const matchRegion = filters.region === 'All' || order.region === filters.region;
    return matchSearch && matchBU && matchRegion;
  }), [search, filters]);

  const show2026 = filters.year === '2026' || filters.year === 'All';
  const show2025 = filters.year === '2025' || filters.year === 'All';

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#1A2027' }}>
        Order Explorer — Lifecycle Journey
      </Typography>
      <DataConfidenceLegend />

      {/* ── SECTION 1: LIFECYCLE JOURNEY ─────────────────────────────── */}
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, mt: 0.5 }}>
        Order Lifecycle: Intake → Revenue Recognition → Revenue &amp; Margin
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.83rem' }}>
        Each stage is tracked in a separate system. There is <strong>no shared key</strong> (SAP order number or CRM ID) to link them end-to-end.
      </Typography>

      {/* ── Visual lifecycle flow ── */}
      <Box sx={{ display: 'flex', alignItems: 'stretch', gap: 0, mb: 2, overflowX: 'auto' }}>
        {LIFECYCLE_STAGES.map((stage, idx) => (
          <React.Fragment key={stage.step}>

            {/* ── Stage panel ── */}
            <Paper
              elevation={0}
              sx={{
                flex: '1 1 0',
                minWidth: 220,
                border: `2px solid ${stage.border}`,
                borderRadius: '12px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Colored header band */}
              <Box sx={{ bgcolor: stage.headerBg, px: 2, py: 1.25, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ fontSize: '0.6rem', fontWeight: 800, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Stage {stage.step}
                  </Typography>
                  <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem', lineHeight: 1.2 }}>
                    {stage.label}
                  </Typography>
                </Box>
                <Chip
                  label={stage.tag}
                  size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.18)', color: '#fff', fontWeight: 700, fontSize: '0.68rem', height: 20, border: '1px solid rgba(255,255,255,0.35)' }}
                />
              </Box>

              {/* Primary metric — big number */}
              <Box sx={{ bgcolor: stage.bg, px: 2, py: 1.5, textAlign: 'center', borderBottom: `1px solid ${stage.border}` }}>
                <Typography sx={{ fontWeight: 900, fontSize: '2.2rem', color: stage.color, lineHeight: 1 }}>
                  {stage.primaryMetric}
                </Typography>
                <Typography variant="caption" sx={{ color: stage.color, fontWeight: 600, fontSize: '0.72rem' }}>
                  {stage.primaryUnit}
                </Typography>
              </Box>

              {/* Secondary KPIs */}
              <Box sx={{ px: 2, py: 1, borderBottom: `1px solid ${stage.border}` }}>
                {stage.kpis.map((k) => (
                  <Box key={k.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.35 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>{k.label}</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: stage.color, fontSize: '0.72rem' }}>{k.value}</Typography>
                  </Box>
                ))}
                <Typography variant="caption" sx={{ fontSize: '0.62rem', color: '#9E9E9E', fontStyle: 'italic', display: 'block', mt: 0.5 }}>
                  {stage.system}
                </Typography>
              </Box>

              {/* Available & missing — chips */}
              <Box sx={{ px: 1.5, py: 1, flexGrow: 1 }}>
                <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#2E7D32', display: 'block', mb: 0.4 }}>
                  Available:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.4, mb: 0.75 }}>
                  {stage.available.map((item) => (
                    <Chip
                      key={item}
                      label={item}
                      size="small"
                      icon={<CheckCircleOutlineIcon style={{ fontSize: 11 }} />}
                      sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', fontSize: '0.62rem', height: 20, '& .MuiChip-icon': { color: '#2E7D32' } }}
                    />
                  ))}
                </Box>
                <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#D32F2F', display: 'block', mb: 0.4 }}>
                  Not available:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.4 }}>
                  {stage.missing.map((item) => (
                    <Chip
                      key={item}
                      label={item}
                      size="small"
                      icon={<ErrorOutlineIcon style={{ fontSize: 11 }} />}
                      sx={{ bgcolor: '#FFEBEE', color: '#D32F2F', fontSize: '0.62rem', height: 20, '& .MuiChip-icon': { color: '#D32F2F' } }}
                    />
                  ))}
                </Box>
              </Box>
            </Paper>

            {/* ── NO JOIN KEY connector ── */}
            {idx < LIFECYCLE_STAGES.length - 1 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 56, flexShrink: 0 }}>
                {/* top dashed line */}
                <Box sx={{ width: 2, flex: 1, background: 'repeating-linear-gradient(to bottom, #EF9A9A 0px, #EF9A9A 6px, transparent 6px, transparent 12px)' }} />
                {/* badge */}
                <Box sx={{ bgcolor: '#FFEBEE', border: '1.5px solid #EF9A9A', borderRadius: '8px', px: 0.75, py: 0.75, textAlign: 'center', my: 0.5 }}>
                  <LinkOffIcon sx={{ fontSize: 16, color: '#D32F2F', display: 'block', mx: 'auto', mb: 0.25 }} />
                  <Typography sx={{ fontSize: '0.55rem', color: '#D32F2F', fontWeight: 800, lineHeight: 1.2, display: 'block', letterSpacing: '0.04em' }}>
                    NO<br />JOIN<br />KEY
                  </Typography>
                </Box>
                {/* bottom dashed line */}
                <Box sx={{ width: 2, flex: 1, background: 'repeating-linear-gradient(to bottom, #EF9A9A 0px, #EF9A9A 6px, transparent 6px, transparent 12px)' }} />
              </Box>
            )}
          </React.Fragment>
        ))}
      </Box>

      {/* Gap alert */}
      {joinKeyGap && (
        <Alert
          severity="error"
          icon={<LinkOffIcon />}
          sx={{ mb: 3, fontSize: '0.82rem', border: '1px solid #EF9A9A' }}
        >
          <strong>Critical Data Gap — {joinKeyGap.kpi}:</strong>{' '}
          {joinKeyGap.reason}{' '}
          <strong>Impact:</strong> {joinKeyGap.impact}{' '}
          <strong>Fix:</strong> {joinKeyGap.recommendation}
        </Alert>
      )}

      {/* ── SECTION 2: FY2026 OIT vs RR (if year filter = 2026 or All) ── */}
      {show2026 && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={12}>
            <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                FY2026 YTD — Order Intake vs Revenue Recognition (Units)
                <Chip label="Verified" size="small" sx={{ ml: 1, bgcolor: '#2E7D32', color: '#fff', height: 18, fontSize: '0.65rem' }} />
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#F5F7FA' }}>
                      <TableCell sx={{ fontWeight: 700 }}>Month</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, color: '#1565C0' }}>OIT (units ordered)</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, color: '#2E7D32' }}>RR (units invoiced)</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>OIT − RR Gap</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, color: '#5A6872' }}>Notes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {oit2026Monthly.map((row) => {
                      const gap = row.oitUnits - row.rrUnits;
                      return (
                        <TableRow key={row.month} hover>
                          <TableCell sx={{ fontWeight: 600 }}>
                            {row.month}
                            {row.isMTD && <Chip label="MTD" size="small" sx={{ ml: 0.5, bgcolor: '#FFF3E0', color: '#E65100', border: '1px solid #FFCC80', height: 16, fontSize: '0.6rem' }} />}
                          </TableCell>
                          <TableCell align="center">
                            <Chip label={row.oitUnits} size="small" sx={{ bgcolor: '#E3F2FD', color: '#1565C0', border: '1px solid #90CAF9', height: 20, fontSize: '0.75rem', fontWeight: 700 }} />
                          </TableCell>
                          <TableCell align="center">
                            <Chip label={row.rrUnits} size="small" sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', border: '1px solid #A5D6A7', height: 20, fontSize: '0.75rem', fontWeight: 700 }} />
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="caption" sx={{ fontWeight: 700, color: gap > 0 ? '#F57C00' : '#2E7D32' }}>
                              {gap > 0 ? `+${gap} pending` : '—'}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                              {row.isMTD ? 'Month to date — incomplete' : 'Full month'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {/* Totals */}
                    <TableRow sx={{ bgcolor: '#F5F7FA', '& td': { fontWeight: 700, borderTop: '2px solid #e0e0e0' } }}>
                      <TableCell>YTD Total</TableCell>
                      <TableCell align="center">{oit2026Monthly.reduce((s, r) => s + r.oitUnits, 0)}</TableCell>
                      <TableCell align="center">{oit2026Monthly.reduce((s, r) => s + r.rrUnits, 0)}</TableCell>
                      <TableCell align="center">
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#F57C00' }}>
                          +{oit2026Monthly.reduce((s, r) => s + (r.oitUnits - r.rrUnits), 0)} pending
                        </Typography>
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <ChartNote
                source="DPS_Customer order & revenue follow-up 2026.xlsx — OIT / SSOT tabs"
                note="OIT = unit ordered (booking); RR = unit invoiced/installed (revenue recognition). These are tracked in separate columns — no SAP order number links them to financial data."
              />
            </Paper>
          </Grid>

          {/* Backlog evolution */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', height: '100%' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                Backlog Evolution — End-of-Month Units
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {backlog2026.map((b) => (
                  <Box key={b.period} sx={{ textAlign: 'center', p: 1, border: '1px solid #e0e0e0', borderRadius: '8px', minWidth: 80 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.72rem' }}>{b.period}</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1565C0', lineHeight: 1.2 }}>{b.units}</Typography>
                    <Typography variant="caption" sx={{ fontSize: '0.65rem', color: '#5A6872' }}>units</Typography>
                  </Box>
                ))}
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, fontSize: '0.72rem' }}>
                Backlog = cumulative OIT − cumulative RR. Increasing backlog signals strong intake or delayed recognitions.
              </Typography>
            </Paper>
          </Grid>

          {/* Gap reminder */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Alert
              severity="warning"
              icon={<WarningAmberIcon />}
              sx={{ height: '100%', fontSize: '0.82rem', border: '1px solid #FFE082', display: 'flex', alignItems: 'flex-start' }}
            >
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>OIT → RR: Stage 1 to Stage 2</Typography>
                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                  Units move from <strong>OIT</strong> (booked) to <strong>RR</strong> (invoiced) over weeks. The gap above (OIT − RR) is units booked but not yet invoiced — these appear as backlog.
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5, fontSize: '0.8rem' }}>
                  <strong>No financial value</strong> is available at either stage — EUR revenue and margin are only available in SAP BW (Stage 3) and <strong>cannot be joined</strong> back to individual orders.
                </Typography>
              </Box>
            </Alert>
          </Grid>
        </Grid>
      )}

      {/* ── SECTION 3: FY2025 Monthly OIT by BU ──────────────────────── */}
      {show2025 && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={12}>
            <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                Monthly OIT — FY2025 by Business Unit (Units)
                <Chip label="Derived" size="small" sx={{ ml: 1, bgcolor: '#1565C0', color: '#fff', height: 18, fontSize: '0.65rem' }} />
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Month</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, color: BU_COLORS.LK }}>LK — Wide Format</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, color: BU_COLORS.LI }}>LI — Industrial Inkjet</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, color: BU_COLORS.M0 }}>M0 — Packaging</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>Total FY2025</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, color: '#888' }}>FY2024</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>YoY</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {monthlyOitByBU.map((row, i) => {
                      const fy24 = monthlyOitTrend[i].fy2024;
                      const diff = row.total - fy24;
                      return (
                        <TableRow key={row.month} hover>
                          <TableCell sx={{ fontWeight: 600 }}>{row.month}</TableCell>
                          <TableCell align="center">
                            <Chip label={row.LK} size="small" sx={{ bgcolor: `${BU_COLORS.LK}15`, color: BU_COLORS.LK, border: `1px solid ${BU_COLORS.LK}40`, fontSize: '0.75rem', height: 20 }} />
                          </TableCell>
                          <TableCell align="center">
                            <Chip label={row.LI} size="small" sx={{ bgcolor: `${BU_COLORS.LI}15`, color: BU_COLORS.LI, border: `1px solid ${BU_COLORS.LI}40`, fontSize: '0.75rem', height: 20 }} />
                          </TableCell>
                          <TableCell align="center">
                            <Chip label={row.M0} size="small" sx={{ bgcolor: `${BU_COLORS.M0}15`, color: BU_COLORS.M0, border: `1px solid ${BU_COLORS.M0}40`, fontSize: '0.75rem', height: 20 }} />
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{row.total}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" color="text.secondary">{fy24}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="caption" sx={{ fontWeight: 600, color: diff > 0 ? '#2E7D32' : diff < 0 ? '#D32F2F' : '#757575' }}>
                              {diff > 0 ? `+${diff}` : diff === 0 ? '—' : diff}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow sx={{ bgcolor: '#F5F7FA', '& td': { fontWeight: 700, borderTop: '2px solid #e0e0e0' } }}>
                      <TableCell>FY Total</TableCell>
                      <TableCell align="center">{monthlyOitByBU.reduce((s, r) => s + r.LK, 0)}</TableCell>
                      <TableCell align="center">{monthlyOitByBU.reduce((s, r) => s + r.LI, 0)}</TableCell>
                      <TableCell align="center">{monthlyOitByBU.reduce((s, r) => s + r.M0, 0)}</TableCell>
                      <TableCell align="center">195</TableCell>
                      <TableCell align="center" sx={{ color: '#888' }}>196</TableCell>
                      <TableCell align="center">
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#D32F2F' }}>-1</Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <ChartNote
                source="DPS_Customer order & revenue follow-up 2026.xlsx — master OIT sheet"
                note="BU split is derived from annual product mix ratios. No SAP order number available — revenue impact per order cannot be calculated."
              />
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* ── SECTION 4: DELAYED ORDERS ────────────────────────────────── */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Delayed Orders — Stage 1→2 Blockages ({filteredDelayed.length} of 12 shown)
            <Chip label="Verified" size="small" sx={{ ml: 1, bgcolor: '#2E7D32', color: '#fff', height: 18, fontSize: '0.65rem' }} />
          </Typography>
          <TextField
            size="small"
            placeholder="Search orders…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 18, color: '#5A6872' }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ width: 220 }}
          />
        </Box>
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #ffe0b2' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#FFF8E1' }}>
                <TableCell sx={{ fontWeight: 700 }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>BU</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Region</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Original RR</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Revised RR</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Reason</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Delay</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDelayed.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography variant="caption" color="text.secondary">No orders match current filters</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredDelayed.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>
                      <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.72rem' }}>
                        {order.id}
                      </Typography>
                    </TableCell>
                    <TableCell><Typography variant="caption">{order.product}</Typography></TableCell>
                    <TableCell>
                      <Chip
                        label={order.bu}
                        size="small"
                        sx={{
                          bgcolor: `${BU_COLORS[order.bu] || '#9E9E9E'}20`,
                          color: BU_COLORS[order.bu] || '#9E9E9E',
                          border: `1px solid ${BU_COLORS[order.bu] || '#9E9E9E'}50`,
                          fontSize: '0.65rem',
                          height: 18,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ color: order.customer.includes('IC') ? '#5A6872' : '#1A2027' }}>
                        {order.customer}
                      </Typography>
                    </TableCell>
                    <TableCell><Typography variant="caption">{order.region}</Typography></TableCell>
                    <TableCell><Typography variant="caption">{order.originalRR}</Typography></TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ color: '#D32F2F', fontWeight: 600 }}>
                        {order.revisedRR}
                      </Typography>
                    </TableCell>
                    <TableCell><Typography variant="caption" color="text.secondary">{order.reason}</Typography></TableCell>
                    <TableCell align="right">
                      <Chip
                        label={`+${order.weeksDelay}w`}
                        size="small"
                        sx={{
                          bgcolor: order.weeksDelay >= 20 ? '#D32F2F' : order.weeksDelay >= 15 ? '#F57C00' : '#FF8F00',
                          color: '#fff',
                          fontSize: '0.68rem',
                          height: 18,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <ChartNote
          source="DPS_Customer order & revenue follow-up 2026.xlsx — Delayed Tracker tab"
          note="Delayed orders are stuck between Stage 1 (OIT) and Stage 2 (RR). EUR value at delay not available — revenue slip cannot be quantified."
        />
      </Box>

      {/* ── SECTION 5: IC NOTE & STAGE 3 LIMITATIONS ─────────────────── */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ border: '1px solid #ffe0b2', bgcolor: '#FFFDE7', borderRadius: '12px', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <InfoOutlinedIcon sx={{ color: '#F57C00', fontSize: 18 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#F57C00' }}>
                  Intercompany Customer Note (Stage 3)
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Top 5 customers by revenue are AGFA subsidiaries (intercompany). External customer breakdown is <strong>not fully available</strong> in the analyzed files.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.82rem' }}>
                <strong>Why IC dominates:</strong> AGFA DPS sells hardware to AGFA national subsidiaries who then sell to end customers. Sales Details captures DPS's perspective. Actual end-customer names are held at subsidiary level — outside current data scope.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ border: '1px solid #EF9A9A', bgcolor: '#FFEBEE', borderRadius: '12px', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <LinkOffIcon sx={{ color: '#D32F2F', fontSize: 18 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#D32F2F' }}>
                  What We Cannot Do Without a Join Key
                </Typography>
              </Box>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                {[
                  'Calculate revenue per order (OIT unit → EUR in SAP)',
                  'Calculate margin per printer model sold',
                  'Measure OIT-to-RR conversion rate in EUR terms',
                  'Measure OIT-to-RR cycle time in EUR terms',
                  'Identify which delayed orders impacted margin',
                  'Build a cohort analysis: orders booked in Q1 → revenue in Q2',
                ].map((item) => (
                  <Box component="li" key={item} sx={{ mb: 0.25 }}>
                    <Typography variant="caption" sx={{ fontSize: '0.78rem' }}>{item}</Typography>
                  </Box>
                ))}
              </Box>
              <Box sx={{ mt: 1.5, p: 1, bgcolor: '#fff', borderRadius: 1, border: '1px solid #EF9A9A' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#D32F2F', display: 'block', mb: 0.25 }}>
                  Fix: Enforce SAP Sales Order number in OIT file at booking time.
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Or integrate CRM (Salesforce/equivalent) to capture both unit pipeline and financial outcomes under one Opportunity ID.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
