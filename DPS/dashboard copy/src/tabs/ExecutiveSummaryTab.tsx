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
import { KpiCard } from '../components/KpiCard';
import { DataConfidenceLegend } from '../components/DataConfidenceLegend';
import { GlobalFilters } from '../types';
import { revenueReconciliation } from '../data/dpsData';

interface Props {
  filters: GlobalFilters;
}

export const ExecutiveSummaryTab: React.FC<Props> = ({ filters: _filters }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#1A2027' }}>
        Executive Summary — FY2025 DPS Performance
      </Typography>
      <DataConfidenceLegend />

      {/* Row 1: Revenue & Margin KPIs */}
      <Box sx={{ mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <MonetizationOnIcon sx={{ color: '#1565C0', fontSize: 18 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1565C0' }}>
            Revenue & Margin
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              title="FY2025 Net Revenue (3rdP)"
              value="EUR 190.6M"
              subtitle="AMSP Contribution — 3rd party net sales"
              dataConfidence="verified"
              dataNote="AMSP Contribution file, 3rdP net sales"
              status="info"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              title="vs Budget Variance"
              value="-EUR 83.7M (-17.9%)"
              subtitle="Actual vs BP1 budget"
              trend={-1}
              trendLabel="-17.9% below plan"
              dataConfidence="derived"
              dataNote="RECO Analysis vs BP1 budget — kEUR basis"
              status="error"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              title="AMSP Margin %"
              value="61.9%"
              subtitle="FY2025 full year average"
              dataConfidence="verified"
              dataNote="AMSP Contribution FY2025 — 3rdP only"
              status="success"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              title="CO-PA Gross Margin"
              value="38.9%"
              subtitle="AGFA NV only — COGS TP basis (previously shown as 25.9% — corrected)"
              dataConfidence="verified"
              dataNote="CO-PA GMPCOPA_1, AGFA NV only — not full DPS"
              status="info"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Row 1b: RECO P&L Summary */}
      <Box sx={{ mb: 1, mt: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <AccountBalanceIcon sx={{ color: '#4527A0', fontSize: 18 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#4527A0' }}>
            RECO P&L Summary
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              title="EBIT FY2025"
              value="EUR 205.1M (53.3%)"
              subtitle="vs FY2024: EUR 219.6M (-EUR 14.5M)"
              dataConfidence="verified"
              dataNote="RECO Analysis — EBIT line, verified from P&L summary"
              status="info"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              title="SG&A Favorability"
              value="+EUR 9M vs Budget"
              subtitle="Actual -85M vs budget -94M — positive story"
              dataConfidence="verified"
              dataNote="RECO Analysis — SG&A variance vs BP1"
              status="success"
              icon={<TrendingUpIcon sx={{ fontSize: 16 }} />}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              title="Non-recurring Cost"
              value="EUR 6.2M (unfav.)"
              subtitle="vs budget EUR 0.4M — EUR 5.8M overshoot"
              dataConfidence="verified"
              dataNote="RECO Analysis — non-recurring items vs BP1 budget"
              status="error"
              icon={<TrendingDownIcon sx={{ fontSize: 16 }} />}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              title="Revenue vs Budget"
              value="-EUR 83.7M (-17.9%)"
              subtitle="Actual vs BP1 budget"
              trend={-1}
              trendLabel="-17.9% below plan"
              dataConfidence="derived"
              dataNote="RECO Analysis vs BP1 budget — kEUR basis"
              status="error"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Row 2: Order Pipeline KPIs */}
      <Box sx={{ mb: 1, mt: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <InventoryIcon sx={{ color: '#00897B', fontSize: 18 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#00897B' }}>
            Order Pipeline — FY2025
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              title="FY2025 OIT Units"
              value="195 units"
              subtitle="Full year order intake"
              dataConfidence="verified"
              dataNote="Order follow-up file — master OIT sheet"
              status="info"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              title="vs FY2024"
              value="-1 unit (-0.5%)"
              subtitle="FY2024: 196 units"
              trend={-1}
              trendLabel="Flat vs prior year — effectively unchanged"
              dataConfidence="derived"
              dataNote="FY2025 195 vs FY2024 196 — derived from OIT sheets"
              status="warning"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              title="Delayed Orders"
              value="12 units"
              subtitle="6.2% of FY2025 cohort delayed"
              dataConfidence="verified"
              dataNote="Delayed tracker tab — all from FY2025 cohort"
              status="warning"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              title="OIT EUR Value"
              value="Not Available"
              subtitle="Units tracked only"
              dataConfidence="proxy"
              dataNote="EUR value requires SAP SD module link — not in current files"
              status="error"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Row 2b: FY2026 YTD Pipeline */}
      <Box sx={{ mb: 1, mt: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <TimelineIcon sx={{ color: '#00695C', fontSize: 18 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#00695C' }}>
            FY2026 YTD Pipeline
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              title="FY2026 OIT YTD"
              value="22 units"
              subtitle="Jan=11, Feb=10, Mar=3 MTD"
              dataConfidence="verified"
              dataNote="Order follow-up file — FY2026 OIT tracker, Jan–Mar MTD"
              status="info"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              title="FY2026 RR YTD"
              value="16 units"
              subtitle="Revenue Recognition: Jan=9, Feb=7 invoiced units"
              dataConfidence="verified"
              dataNote="Order follow-up file — FY2026 RR tracker, Jan–Feb invoiced"
              status="info"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              title="Backlog End-Feb"
              value="46 units"
              subtitle="Rising (End-Jan was 43)"
              dataConfidence="verified"
              dataNote="Derived from OIT minus RR cumulative — end-of-February position"
              status="warning"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              title="YTD Pace vs FY2025"
              value="+12% ahead"
              subtitle="22 units vs 18 units same period FY2025"
              trend={1}
              trendLabel="+12% ahead of prior year pace"
              dataConfidence="derived"
              dataNote="FY2026 YTD 22 vs FY2025 same period 18 — derived comparison"
              status="success"
              icon={<TrendingUpIcon sx={{ fontSize: 16 }} />}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Row 3: Product Mix KPIs */}
      <Box sx={{ mb: 1, mt: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <CategoryIcon sx={{ color: '#6A1B9A', fontSize: 18 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#6A1B9A' }}>
            Product Mix
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              title="Top Margin Product"
              value="95.9%"
              subtitle="Packaging Print Engineering"
              dataConfidence="verified"
              dataNote="AMSP Contribution — highest AMSP margin by budget class"
              status="success"
              icon={<TrendingUpIcon sx={{ fontSize: 16 }} />}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              title="Lowest Margin Product"
              value="9.6%"
              subtitle="Packaging Speedset"
              dataConfidence="verified"
              dataNote="AMSP Contribution — lowest AMSP margin by budget class"
              status="error"
              icon={<TrendingDownIcon sx={{ fontSize: 16 }} />}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              title="No AMSP Rate"
              value="EUR 64M at risk"
              subtitle="33.6% of net sales — margin unknown"
              dataConfidence="estimated"
              dataNote="Net sales without AMSP rate assigned; actual margin is unknown"
              status="warning"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              title="Dec Margin Anomaly"
              value="46.4%"
              subtitle="vs 61.9% full-year avg"
              dataConfidence="verified"
              dataNote="December AMSP margin drop — year-end anomaly requires investigation"
              status="warning"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Row 4: Data Quality KPIs */}
      <Box sx={{ mb: 2, mt: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <AssessmentIcon sx={{ color: '#5A6872', fontSize: 18 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#5A6872' }}>
            Data Quality Summary
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              title="Files Analyzed"
              value="7 files"
              subtitle="Excel exports from SAP BW / Manual"
              dataConfidence="verified"
              dataNote="4 financial files + 2 order book files + 1 OIT tracker"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              title="KPIs Verified"
              value="18 KPIs"
              subtitle="Direct from source data"
              dataConfidence="derived"
              dataNote="Count of KPIs with verified or derived confidence level"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              title="Data Gaps"
              value="6 gaps"
              subtitle="KPIs not available in current files"
              dataConfidence="verified"
              dataNote="See Data Overview tab for full gap analysis"
              status="error"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              title="IC Revenue in Scope"
              value="EUR 270.6M"
              subtitle="Intercompany — must be eliminated"
              dataConfidence="verified"
              dataNote="RECO Analysis — IC elimination required for external view"
              status="warning"
            />
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
                  <TableRow
                    key={i}
                    hover
                    sx={{ bgcolor: isBase ? '#E8F5E9' : 'inherit' }}
                  >
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
                        <Typography
                          variant="caption"
                          sx={{ color: diff > 0 ? '#2E7D32' : '#D32F2F', fontWeight: 600 }}
                        >
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
