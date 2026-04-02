import React, { useState } from 'react';
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
} from '@mui/material';
import Grid from '@mui/material/Grid';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SearchIcon from '@mui/icons-material/Search';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { DataConfidenceLegend } from '../components/DataConfidenceLegend';
import { ChartNote } from '../components/ChartNote';
import { GlobalFilters } from '../types';
import { monthlyOitTrend } from '../data/dpsData';

interface Props {
  filters: GlobalFilters;
}

// Monthly OIT by BU — derived breakdown
const monthlyOitByBU = monthlyOitTrend.map((m) => {
  const lk = Math.round(m.fy2025 * 0.35);
  const li = Math.round(m.fy2025 * 0.27);
  const m0 = m.fy2025 - lk - li;
  return {
    month: m.month,
    'LK': lk,
    'LI': li,
    'M0': m0,
    total: m.fy2025,
  };
});

// Delayed orders detail
const delayedOrders = [
  { id: 'ORD-2025-0412', product: 'Jeti Tauro H3300 LED', bu: 'LK', customer: 'AGFA Germany (IC)', region: 'Europe', originalRR: 'Sep 2025', revisedRR: 'Jan 2026', reason: 'Component shortage — LED modules', weeksDelay: 16 },
  { id: 'ORD-2025-0581', product: 'INCA SpeedSet 250', bu: 'M0', customer: 'External Customer A', region: 'Americas', originalRR: 'Oct 2025', revisedRR: 'Feb 2026', reason: 'Customer site not ready', weeksDelay: 18 },
  { id: 'ORD-2025-0623', product: 'Jeti Mira LED', bu: 'LK', customer: 'AGFA France (IC)', region: 'Europe', originalRR: 'Aug 2025', revisedRR: 'Dec 2025', reason: 'Shipping delay — sea freight', weeksDelay: 18 },
  { id: 'ORD-2025-0744', product: 'INCA OnSet X3', bu: 'LI', customer: 'AGFA USA (IC)', region: 'Americas', originalRR: 'Nov 2025', revisedRR: 'Mar 2026', reason: 'Installation crew availability', weeksDelay: 18 },
  { id: 'ORD-2025-0812', product: 'Jeti Tauro H2500 LED', bu: 'LK', customer: 'External Customer B', region: 'Asia Pacific', originalRR: 'Sep 2025', revisedRR: 'Feb 2026', reason: 'Import clearance delay', weeksDelay: 22 },
  { id: 'ORD-2025-0891', product: 'INCA SpeedSet 160', bu: 'M0', customer: 'AGFA Netherlands (IC)', region: 'Europe', originalRR: 'Oct 2025', revisedRR: 'Jan 2026', reason: 'Software validation pending', weeksDelay: 13 },
  { id: 'ORD-2025-0934', product: 'Jeti Mira LED', bu: 'LK', customer: 'AGFA China (IC)', region: 'Asia Pacific', originalRR: 'Nov 2025', revisedRR: 'Feb 2026', reason: 'Customer approval pending', weeksDelay: 13 },
  { id: 'ORD-2025-1042', product: 'INCA OnSet X3HS', bu: 'LI', customer: 'External Customer C', region: 'Europe', originalRR: 'Dec 2025', revisedRR: 'Mar 2026', reason: 'Factory acceptance test rework', weeksDelay: 13 },
  { id: 'ORD-2025-1103', product: 'Jeti Tauro H3300 LED', bu: 'LK', customer: 'AGFA Belgium (IC)', region: 'Europe', originalRR: 'Nov 2025', revisedRR: 'Apr 2026', reason: 'Power infrastructure upgrade by customer', weeksDelay: 22 },
  { id: 'ORD-2025-1211', product: 'INCA SpeedSet 250R', bu: 'M0', customer: 'External Customer D', region: 'MEA', originalRR: 'Dec 2025', revisedRR: 'Mar 2026', reason: 'Training schedule conflict', weeksDelay: 13 },
  { id: 'ORD-2025-1289', product: 'Jeti Mira LED', bu: 'LK', customer: 'AGFA Japan (IC)', region: 'Asia Pacific', originalRR: 'Dec 2025', revisedRR: 'Feb 2026', reason: 'Year-end holiday closure', weeksDelay: 9 },
  { id: 'ORD-2025-1345', product: 'INCA OnSet Q', bu: 'LI', customer: 'External Customer E', region: 'Europe', originalRR: 'Dec 2025', revisedRR: 'Apr 2026', reason: 'Building permit not granted', weeksDelay: 18 },
];

const BU_COLORS: Record<string, string> = {
  LK: '#1565C0',
  LI: '#00897B',
  M0: '#6A1B9A',
};

export const OrderExplorerTab: React.FC<Props> = ({ filters }) => {
  const [search, setSearch] = useState('');

  const filteredDelayed = delayedOrders.filter((order) => {
    const matchSearch = search === '' ||
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.product.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase());
    const matchBU = filters.bu === 'All' || order.bu === filters.bu;
    const matchRegion = filters.region === 'All' ||
      order.region === filters.region ||
      (filters.region === 'MEA' && order.region === 'MEA');
    return matchSearch && matchBU && matchRegion;
  });

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#1A2027' }}>
        Order Explorer — Unit-Level Order Data
      </Typography>
      <DataConfidenceLegend />

      {/* Disclaimer Banner */}
      <Alert
        severity="info"
        icon={<InfoOutlinedIcon />}
        sx={{ mb: 2, fontSize: '0.82rem', bgcolor: '#E3F2FD', border: '1px solid #90CAF9' }}
      >
        <strong>Order Explorer shows unit-level data from the Order Follow-up file.</strong> EUR values are not available in this tab — see the <strong>Revenue & Margin</strong> tab for all financial data. All figures are unit counts only. BU split is derived from annual product mix ratios.
      </Alert>

      {/* Monthly OIT Table: Month x BU */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={12}>
          <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Monthly OIT — FY2025 by Business Unit (Units)
                <Chip label="Derived" size="small" sx={{ ml: 1, bgcolor: '#1565C0', color: '#fff', height: 18, fontSize: '0.65rem' }} />
              </Typography>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Month</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, color: BU_COLORS.LK }}>
                      LK — Wide Format
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, color: BU_COLORS.LI }}>
                      LI — Industrial Inkjet
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, color: BU_COLORS.M0 }}>
                      M0 — Packaging
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>
                      Total FY2025
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, color: '#888' }}>
                      FY2024
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>
                      YoY
                    </TableCell>
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
                          <Chip
                            label={row['LK']}
                            size="small"
                            sx={{ bgcolor: `${BU_COLORS.LK}15`, color: BU_COLORS.LK, border: `1px solid ${BU_COLORS.LK}40`, fontSize: '0.75rem', height: 20 }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={row['LI']}
                            size="small"
                            sx={{ bgcolor: `${BU_COLORS.LI}15`, color: BU_COLORS.LI, border: `1px solid ${BU_COLORS.LI}40`, fontSize: '0.75rem', height: 20 }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={row['M0']}
                            size="small"
                            sx={{ bgcolor: `${BU_COLORS.M0}15`, color: BU_COLORS.M0, border: `1px solid ${BU_COLORS.M0}40`, fontSize: '0.75rem', height: 20 }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>{row.total}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" color="text.secondary">{fy24}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 600,
                              color: diff > 0 ? '#2E7D32' : diff < 0 ? '#D32F2F' : '#757575',
                            }}
                          >
                            {diff > 0 ? `+${diff}` : diff === 0 ? '—' : diff}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {/* Totals row */}
                  <TableRow sx={{ bgcolor: '#F5F7FA', '& td': { fontWeight: 700, borderTop: '2px solid #e0e0e0' } }}>
                    <TableCell>FY Total</TableCell>
                    <TableCell align="center">
                      {monthlyOitByBU.reduce((s, r) => s + r['LK'], 0)}
                    </TableCell>
                    <TableCell align="center">
                      {monthlyOitByBU.reduce((s, r) => s + r['LI'], 0)}
                    </TableCell>
                    <TableCell align="center">
                      {monthlyOitByBU.reduce((s, r) => s + r['M0'], 0)}
                    </TableCell>
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
              note="BU split is derived from annual product mix ratios, not directly from order-level BU field"
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Delayed Orders Detail */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Delayed Orders Detail — {filteredDelayed.length} of 12 shown
            <Chip label="Verified" size="small" sx={{ ml: 1, bgcolor: '#2E7D32', color: '#fff', height: 18, fontSize: '0.65rem' }} />
          </Typography>
          <TextField
            size="small"
            placeholder="Search orders…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: '#5A6872' }} />
                </InputAdornment>
              ),
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
                    <TableCell>
                      <Typography variant="caption">{order.product}</Typography>
                    </TableCell>
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
                    <TableCell>
                      <Typography variant="caption">{order.region}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">{order.originalRR}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ color: '#D32F2F', fontWeight: 600 }}>
                        {order.revisedRR}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">{order.reason}</Typography>
                    </TableCell>
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
          note="All 12 delayed orders are from the FY2025 cohort. EUR value not available."
        />
      </Box>

      {/* IC Customer Note */}
      <Card sx={{ border: '1px solid #ffe0b2', bgcolor: '#FFFDE7', borderRadius: '12px' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <InfoOutlinedIcon sx={{ color: '#F57C00', fontSize: 18 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#F57C00' }}>
              Intercompany Customer Note
            </Typography>
            <Chip label="Estimated" size="small" sx={{ bgcolor: '#E65100', color: '#fff', height: 18, fontSize: '0.65rem', ml: 'auto' }} />
          </Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Top 5 customers by revenue are AGFA subsidiaries (intercompany). External customer breakdown is <strong>not fully available</strong> in the analyzed files.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.82rem' }}>
            <strong>Why IC dominates:</strong> AGFA DPS (the manufacturing entity) sells hardware to AGFA national sales subsidiaries (AGFA NV Belgium, AGFA GmbH Germany, AGFA Inc. USA, etc.). These subsidiaries then sell to end customers. The Sales Details file captures DPS's perspective, where subsidiaries appear as "customers." The actual end-customer names and volumes are held at the subsidiary reporting level, which is outside the current data scope.
          </Typography>
          <Box sx={{ mt: 1.5, p: 1.5, bgcolor: '#FFF', borderRadius: 1, border: '1px solid #ffe0b2' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#F57C00', display: 'block', mb: 0.5 }}>
              To get external customer view:
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Pull Sales Details from AGFA national subsidiaries' SAP instances, or use a consolidated CRM view (Salesforce / equivalent) that captures end-customer transactions across all AGFA entities.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
