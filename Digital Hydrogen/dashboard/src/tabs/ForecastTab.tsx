import React, { useMemo, useState } from 'react';
import { Grid, Typography, Card, CardContent, Box, Slider, Divider, Chip, Alert } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, ComposedChart, Line } from 'recharts';
import { KpiCard } from '../components/KpiCard';
import { DataConfidenceLegend } from '../components/DataConfidenceLegend';
import { DashboardData, GlobalFilters, NavigateAction } from '../types';
import { fmtEur, fmtPct, MONTHS } from '../utils/formatters';
import { FOR_TYPE_COLORS } from '../theme';

interface Props {
  data: DashboardData;
  filters: GlobalFilters;
  onNavigate?: (nav: NavigateAction) => void;
}

const ChartNote: React.FC<{ note: string }> = ({ note }) => (
  <Typography variant="caption" sx={{ display: 'block', mt: 1, fontSize: '0.65rem', color: '#E65100', fontStyle: 'italic', bgcolor: '#FFF8E1', px: 1, py: 0.5, borderRadius: 0.5 }}>
    {note}
  </Typography>
);

const ForecastTab: React.FC<Props> = ({ data, filters, onNavigate }) => {
  const { forecasts, forecastRevisions, longTermPlans, kpis } = data;

  const [conversionRate, setConversionRate] = useState(18);
  const [tkBatches, setTkBatches] = useState(10);
  const [priceChange, setPriceChange] = useState(0);

  const monthlyForecast = useMemo(() => {
    const byMonth: Record<number, Record<string, number>> = {};
    forecasts.filter(f => f.year === 2026).forEach(f => {
      const m = f.monthNum;
      if (!byMonth[m]) byMonth[m] = {};
      const ft = f.forType || 'Unidentified';
      byMonth[m][ft] = (byMonth[m][ft] || 0) + f.forecastEur;
    });
    return MONTHS.map((label, i) => {
      const m = byMonth[i + 1] || {};
      return {
        month: label,
        Actuals: m['Actuals'] || m['ACT part'] || 0,
        Committed: m['Committed'] || 0,
        Uncommitted: m['Uncommitted'] || 0,
        Unidentified: m['Unidentified'] || 0,
      };
    });
  }, [forecasts]);

  const revisionData = useMemo(() => {
    if (forecastRevisions.length === 0) {
      return [
        { cycle: 'BUD 2026', total: 17.3 },
        { cycle: 'RFC2 (Jul)', total: 31.2 },
        { cycle: 'Current (Sep)', total: 6.2 },
      ];
    }
    const byCycle: Record<string, number> = {};
    forecastRevisions.forEach(r => {
      byCycle[r.rfcCycle] = (byCycle[r.rfcCycle] || 0) + r.forecastValue;
    });
    return Object.entries(byCycle).map(([cycle, value]) => ({
      cycle,
      total: value / 1e6,
    }));
  }, [forecastRevisions]);

  const planChart = useMemo(() => {
    return longTermPlans.map(p => ({
      year: String(p.year),
      revenue: p.revenue / 1e6,
      volume: p.volume / 1000,
      eurPerM2: p.eurPerM2,
      type: p.type,
    }));
  }, [longTermPlans]);

  const neomBatches = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      batch: `#${i + 6}`,
      value: 949000,
      status: i < 2 ? 'delivered' : i < 5 ? 'in-production' : 'planned',
    }));
  }, []);

  const scenarioResult = useMemo(() => {
    const pipeline = kpis.pipelineValue;
    const pipelineRevenue = pipeline * (conversionRate / 100);
    const tkRevenue = tkBatches * 949000;
    const priceAdj = 1 + priceChange / 100;
    const baseCommitted = kpis.forecastComposition.actuals + kpis.forecastComposition.committed;
    const total = (baseCommitted + pipelineRevenue + tkRevenue) * priceAdj;
    return {
      base: total,
      bull: total * 1.2,
      bear: total * 0.7,
    };
  }, [conversionRate, tkBatches, priceChange, kpis]);

  const { forecastComposition: fc } = kpis;

  return (
    <Box>
      <DataConfidenceLegend />

      {/* KPI Row */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <KpiCard
            title="FY2026 Forecast"
            value={fmtEur(kpis.fullYearForecast)}
            subtitle="Full-year total forecast"
            status="red"
            dataConfidence="estimated"
            dataNote="⚠ Hardcoded €6.2M from FOR Summary in Feb2026 file. Not parsed from structured data."
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <KpiCard
            title="Actuals + Committed"
            value={fmtEur(fc.actuals + fc.committed)}
            subtitle={`${((fc.actuals + fc.committed) / (kpis.fullYearForecast || 1) * 100).toFixed(0)}% of forecast is firm`}
            status="amber"
            dataConfidence="estimated"
            dataNote="⚠ Hardcoded from manual reading: Actuals €1.7M + Committed €2.2M = €3.9M. Needs structured FOR Type data for accuracy."
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <KpiCard
            title="Budget Gap (FY)"
            value={fmtEur(kpis.fullYearForecast - kpis.budgetTotal)}
            subtitle={`FOR ${fmtEur(kpis.fullYearForecast)} vs BUD ${fmtEur(kpis.budgetTotal)}`}
            status="red"
            dataConfidence="estimated"
            dataNote="⚠ Both values hardcoded. FOR=€6.2M, BUD=€17.3M from Feb2026 file. Full-year comparison, NOT YTD."
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <KpiCard
            title="vs Prior Year (FY)"
            value={fmtEur(kpis.fullYearForecast - kpis.lyTotal)}
            subtitle={`FOR ${fmtEur(kpis.fullYearForecast)} vs FY2025 ${fmtEur(kpis.lyTotal)}`}
            status="red"
            dataConfidence="estimated"
            dataNote="⚠ FY forecast vs FY2025 actual. NOT a YTD comparison — LY monthly breakdown not available for true YTD match."
          />
        </Grid>
      </Grid>

      {/* Monthly Forecast + Revision History */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontSize: '0.9rem' }} gutterBottom>
                FY2026 Monthly Forecast by Certainty
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyForecast}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis tickFormatter={(v: number) => fmtEur(v)} fontSize={11} />
                  <Tooltip formatter={(v: any) => fmtEur(v)} />
                  <Legend />
                  <Bar dataKey="Actuals" stackId="a" fill={FOR_TYPE_COLORS['Actuals']} />
                  <Bar dataKey="Committed" stackId="a" fill={FOR_TYPE_COLORS['Committed']} />
                  <Bar dataKey="Uncommitted" stackId="a" fill={FOR_TYPE_COLORS['Uncommitted']} />
                  <Bar dataKey="Unidentified" stackId="a" fill={FOR_TYPE_COLORS['Unidentified']} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <ChartNote note="⚠ Estimated: Monthly distribution is a fallback approximation. Excel FOR Summary parsing extracted limited data — granular monthly breakdown needs structured FOR input." />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontSize: '0.9rem' }} gutterBottom>
                Forecast Revision History (€M)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revisionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="cycle" fontSize={11} />
                  <YAxis tickFormatter={(v: number) => `€${v}M`} fontSize={12} />
                  <Tooltip formatter={(v: any) => `€${(v as number).toFixed(1)}M`} />
                  <Bar dataKey="total" name="Forecast Total" radius={[6, 6, 0, 0]}>
                    {revisionData.map((e, i) => (
                      <Cell key={i} fill={i === revisionData.length - 1 ? '#D32F2F' : '#1565C0'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <ChartNote note="⚠ Estimated: Three known data points hardcoded from manual comparison of FOR vs BUD & LY sheets across FY2025 and Feb2026 files." />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Long-term Plans */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontSize: '0.9rem' }} gutterBottom>
                Revenue: Actuals, Forecast & Long-Term Plans
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={planChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="year" fontSize={12} />
                  <YAxis yAxisId="left" tickFormatter={(v: number) => `€${v}M`} fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(v: number) => `${v}K m²`} fontSize={11} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="revenue" name="Revenue (€M)" radius={[6, 6, 0, 0]}>
                    {planChart.map((e, i) => (
                      <Cell key={i} fill={
                        e.type === 'actual' ? '#1565C0' :
                        e.type === 'forecast' ? '#F57C00' :
                        e.type === 'budget' ? '#78909C' : '#7B1FA2'
                      } />
                    ))}
                  </Bar>
                  <Line yAxisId="right" type="monotone" dataKey="volume" name="Volume (K m²)" stroke="#00897B" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
              <Box display="flex" gap={1.5} mt={1} justifyContent="center">
                <Chip label="Actual ✅" size="small" sx={{ bgcolor: '#1565C0', color: '#fff' }} />
                <Chip label="Forecast ⚠" size="small" sx={{ bgcolor: '#F57C00', color: '#fff' }} />
                <Chip label="Plan ⚠" size="small" sx={{ bgcolor: '#7B1FA2', color: '#fff' }} />
              </Box>
              <ChartNote note="⚠ Mixed: 2022–2025 actuals verified from Sales Zirfon. 2026 forecast + 2027–2029 plans hardcoded from Revenue Overview sheet. Plans may not reflect post-forecast-crash reality." />
            </CardContent>
          </Card>
        </Grid>

        {/* TK Nucera NEOM Tracker */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontSize: '0.9rem' }} gutterBottom>
                TK Nucera NEOM — Batch Tracker
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                PO 32017233 — ~€949K per batch — Batches #6-#25
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={0.5}>
                {neomBatches.map((b, i) => (
                  <Chip
                    key={i}
                    label={b.batch}
                    size="small"
                    sx={{
                      fontSize: '0.7rem',
                      bgcolor: b.status === 'delivered' ? '#E8F5E9' :
                        b.status === 'in-production' ? '#FFF3E0' : '#F5F5F5',
                      color: b.status === 'delivered' ? '#2E7D32' :
                        b.status === 'in-production' ? '#E65100' : '#757575',
                      border: `1px solid ${b.status === 'delivered' ? '#A5D6A7' :
                        b.status === 'in-production' ? '#FFCC80' : '#E0E0E0'}`,
                    }}
                  />
                ))}
              </Box>
              <Box display="flex" gap={1.5} mt={1.5}>
                <Chip label="Delivered" size="small" sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', fontSize: '0.65rem' }} />
                <Chip label="In Production" size="small" sx={{ bgcolor: '#FFF3E0', color: '#E65100', fontSize: '0.65rem' }} />
                <Chip label="Planned" size="small" sx={{ bgcolor: '#F5F5F5', color: '#757575', fontSize: '0.65rem' }} />
              </Box>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="body2">
                Total remaining value: <strong>{fmtEur(neomBatches.filter(b => b.status !== 'delivered').length * 949000)}</strong>
              </Typography>
              <ChartNote note="⚠ Estimated: Batch statuses are illustrative. PO value (€949K/batch) from ACTFY2025 TK Nucera sheet. Actual delivery status needs confirmation from controller." />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Scenario Analysis */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ fontSize: '0.9rem' }} gutterBottom>
            Scenario Analysis — What-If Revenue Estimator
          </Typography>
          <Alert severity="info" sx={{ mb: 2, fontSize: '0.75rem' }}>
            <strong>Note:</strong> Pipeline Value (€{(kpis.pipelineValue / 1e6).toFixed(0)}M) includes ALL open quotes from 2023–2025, many of which are likely stale.
            Realistic pipeline may be 10–20% of this figure. Adjust Conversion Rate slider accordingly.
          </Alert>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ px: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Pipeline Conversion Rate: {conversionRate}%</Typography>
                <Slider value={conversionRate} onChange={(_, v) => setConversionRate(v as number)} min={5} max={40} step={1} valueLabelDisplay="auto" sx={{ color: '#1565C0' }} />

                <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>TK Nucera Batches Delivered: {tkBatches}</Typography>
                <Slider value={tkBatches} onChange={(_, v) => setTkBatches(v as number)} min={0} max={20} step={1} valueLabelDisplay="auto" sx={{ color: '#00897B' }} />

                <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>Price Change: {priceChange > 0 ? '+' : ''}{priceChange}%</Typography>
                <Slider value={priceChange} onChange={(_, v) => setPriceChange(v as number)} min={-20} max={20} step={1} valueLabelDisplay="auto" sx={{ color: '#7B1FA2' }} />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 4 }}>
                  <Box sx={{ p: 2, bgcolor: '#FFEBEE', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="subtitle2" color="error.main">Bear Case</Typography>
                    <Typography variant="h5" fontWeight={700} color="error.main">{fmtEur(scenarioResult.bear)}</Typography>
                    <Typography variant="body2" color="text.secondary">70% of base</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Box sx={{ p: 2, bgcolor: '#E3F2FD', borderRadius: 2, textAlign: 'center', border: '2px solid #1565C0' }}>
                    <Typography variant="subtitle2" color="primary.main">Base Case</Typography>
                    <Typography variant="h5" fontWeight={700} color="primary.main">{fmtEur(scenarioResult.base)}</Typography>
                    <Typography variant="body2" color="text.secondary">Current estimate</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Box sx={{ p: 2, bgcolor: '#E8F5E9', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="subtitle2" color="success.main">Bull Case</Typography>
                    <Typography variant="h5" fontWeight={700} color="success.main">{fmtEur(scenarioResult.bull)}</Typography>
                    <Typography variant="body2" color="text.secondary">120% of base</Typography>
                  </Box>
                </Grid>
              </Grid>
              <ChartNote note="⚠ Scenario model uses inflated pipeline (all open quotes). Formula: (Actuals+Committed + Pipeline×ConvRate + TK×€949K) × PriceAdj. Use low conversion (2-5%) to compensate for stale quotes." />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ForecastTab;
