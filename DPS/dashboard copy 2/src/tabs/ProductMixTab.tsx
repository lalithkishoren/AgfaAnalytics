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
  LinearProgress,
  Card,
  CardContent,
  Alert,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  Label,
  BarChart,
  Bar,
  Cell,
  LabelList,
} from 'recharts';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { DataConfidenceLegend } from '../components/DataConfidenceLegend';
import { ChartNote } from '../components/ChartNote';
import { GlobalFilters } from '../types';
import { productMixData, amspByBudgetClass, budgetClassMapping, copaByBU } from '../data/dpsData';
import { CHART_COLORS } from '../theme';

interface Props {
  filters: GlobalFilters;
}

const formatEur = (val: number) => `€${(val / 1000000).toFixed(1)}M`;

const CustomScatterTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0]?.payload;
    if (!d) return null;
    return (
      <Paper sx={{ p: 1.5, border: '1px solid #e0e0e0', fontSize: '0.8rem' }}>
        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>{d.name}</Typography>
        <Typography variant="caption" sx={{ display: 'block' }}>BU: {d.bu}</Typography>
        <Typography variant="caption" sx={{ display: 'block' }}>Net Sales: {formatEur(d.netSales)}</Typography>
        <Typography variant="caption" sx={{ display: 'block' }}>AMSP Margin: {d.amspMargin}%</Typography>
        <Typography variant="caption" sx={{ display: 'block' }}>OIT Units: {d.oitUnits}</Typography>
      </Paper>
    );
  }
  return null;
};

const CopaTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0]?.payload;
    if (!d) return null;
    return (
      <Paper sx={{ p: 1.5, border: '1px solid #e0e0e0', fontSize: '0.8rem' }}>
        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
          {d.bu} — {d.name}
        </Typography>
        <Typography variant="caption" sx={{ display: 'block' }}>
          Net TO: €{d.netTO.toFixed(1)}M
        </Typography>
        <Typography variant="caption" sx={{ display: 'block' }}>
          Share: {d.pct}%
        </Typography>
      </Paper>
    );
  }
  return null;
};

const ProxyGapCard: React.FC<{ title: string; reason: string; impact: string; recommendation: string }> = ({
  title, reason, impact, recommendation,
}) => (
  <Card sx={{ border: '2px dashed #EF9A9A', bgcolor: '#FFFBF5', borderRadius: '12px' }}>
    <CardContent sx={{ pb: '12px !important' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <ErrorOutlineIcon sx={{ color: '#D32F2F', fontSize: 18 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#D32F2F', flex: 1, fontSize: '0.85rem' }}>
          {title}
        </Typography>
        <Chip label="Data Gap" size="small" sx={{ bgcolor: '#D32F2F', color: '#fff', height: 16, fontSize: '0.62rem' }} />
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
        <strong>Reason:</strong> {reason}
      </Typography>
      <Typography variant="caption" sx={{ display: 'block', color: '#D32F2F', mb: 0.5 }}>
        <strong>Impact:</strong> {impact}
      </Typography>
      <Typography variant="caption" sx={{ display: 'block', color: '#2E7D32' }}>
        <strong>Fix:</strong> {recommendation}
      </Typography>
    </CardContent>
  </Card>
);

const SCATTER_COLORS = [CHART_COLORS[0], CHART_COLORS[1], CHART_COLORS[2], CHART_COLORS[4], CHART_COLORS[5], CHART_COLORS[6]];
const COPA_BU_COLORS: Record<string, string> = {
  LK: CHART_COLORS[0],
  LI: CHART_COLORS[1],
  M0: CHART_COLORS[2],
};

export const ProductMixTab: React.FC<Props> = ({ filters: _filters }) => {
  // Only include the detailed BC-level data for scatter (exclude M0 aggregate)
  const scatterData = productMixData.filter((d) => d.bu !== 'M0');

  // CO-PA BU data formatted for horizontal bar chart (values in millions)
  const copaChartData = copaByBU.map((d) => ({
    ...d,
    netTOMillion: d.netTO,
  }));

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#1A2027' }}>
        Product Mix Analysis — BU & Budget Class
      </Typography>
      <DataConfidenceLegend />

      {/* Scatter Plot: Net Sales vs AMSP Margin, bubble = OIT Units */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
              Revenue vs Margin by Product — Bubble Size = OIT Units
              <Chip label="Verified" size="small" sx={{ ml: 1, bgcolor: '#2E7D32', color: '#fff', height: 18, fontSize: '0.65rem' }} />
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
              Ideal position: high net sales (right) + high AMSP margin (top). Speedset is an outlier with very low margin.
            </Typography>
            <ResponsiveContainer width="100%" height={320}>
              <ScatterChart margin={{ top: 10, right: 30, left: 10, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="netSales"
                  type="number"
                  name="Net Sales"
                  tickFormatter={(v) => `€${(v / 1000000).toFixed(0)}M`}
                  tick={{ fontSize: 10 }}
                  domain={[0, 50000000]}
                >
                  <Label value="Net Sales (EUR)" position="insideBottom" offset={-15} fontSize={11} fill="#5A6872" />
                </XAxis>
                <YAxis
                  dataKey="amspMargin"
                  type="number"
                  name="AMSP Margin %"
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fontSize: 10 }}
                  domain={[0, 100]}
                >
                  <Label value="AMSP Margin %" angle={-90} position="insideLeft" offset={10} fontSize={11} fill="#5A6872" />
                </YAxis>
                <ZAxis dataKey="oitUnits" range={[400, 2500]} name="OIT Units" />
                <Tooltip content={<CustomScatterTooltip />} />
                {scatterData.map((d, i) => (
                  <Scatter
                    key={d.bu}
                    name={d.name}
                    data={[d]}
                    fill={SCATTER_COLORS[i % SCATTER_COLORS.length]}
                    fillOpacity={0.75}
                  />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
            <ChartNote
              source="AMSP Contribution (margin) + Sales Details (revenue) + Order follow-up (OIT units)"
              note="M0 aggregate excluded — sub-lines (PE, Onset, Speedset) shown individually. Margins corrected: LK=62%, LI=54.9%, M0=70.8%"
            />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', height: '100%' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
              Budget Class Performance Summary
              <Chip label="Verified" size="small" sx={{ ml: 1, bgcolor: '#2E7D32', color: '#fff', height: 18, fontSize: '0.65rem' }} />
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Net Sales</TableCell>
                    <TableCell align="right">OIT</TableCell>
                    <TableCell sx={{ minWidth: 90 }}>AMSP %</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...amspByBudgetClass].sort((a, b) => b.margin - a.margin).map((row, i) => (
                    <TableRow key={i} hover>
                      <TableCell>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>{row.name}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                          {formatEur(row.netSales)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="caption">
                          {productMixData.find(p => p.name.includes(row.name.replace('Packaging ', '')))?.oitUnits ?? '—'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 700,
                              color: row.margin > 60 ? '#2E7D32' : row.margin > 30 ? '#F57C00' : '#D32F2F',
                              minWidth: 36,
                            }}
                          >
                            {row.margin}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={row.margin}
                            sx={{
                              flex: 1,
                              height: 6,
                              borderRadius: 3,
                              bgcolor: '#f0f0f0',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: row.margin > 60 ? '#2E7D32' : row.margin > 30 ? '#F57C00' : '#D32F2F',
                              },
                            }}
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Budget Class Mapping */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#5A6872', textTransform: 'uppercase', fontSize: '0.65rem', display: 'block', mb: 1 }}>
                Budget Class — Product Mapping
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontSize: '0.72rem' }}>Budget Class</TableCell>
                      <TableCell sx={{ fontSize: '0.72rem' }}>Product</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {budgetClassMapping.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>{row.budgetClass}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">{row.product}</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* CO-PA Net TO by BU */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: '#1A2027' }}>
          CO-PA Net TO by Business Unit
        </Typography>
        <Alert severity="info" sx={{ mb: 2, fontSize: '0.82rem' }}>
          <strong>Scope note:</strong> LK dominates CO-PA Net TO (86.9%) because AGFA NV is the primary Wide Format manufacturing entity. LI and M0 have their own legal entities not included in AGFA NV CO-PA scope.
        </Alert>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Net Turnover by BU — CO-PA Basis (AGFA NV)
                <Chip label="Verified" size="small" sx={{ ml: 1, bgcolor: '#2E7D32', color: '#fff', height: 18, fontSize: '0.65rem' }} />
              </Typography>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart
                  data={copaChartData}
                  layout="vertical"
                  margin={{ top: 5, right: 60, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                  <XAxis
                    type="number"
                    tickFormatter={(v) => `€${v}M`}
                    tick={{ fontSize: 10 }}
                    domain={[0, 160]}
                  />
                  <YAxis
                    type="category"
                    dataKey="bu"
                    tick={{ fontSize: 11, fontWeight: 600 }}
                    width={32}
                  />
                  <Tooltip content={<CopaTooltip />} />
                  <Bar dataKey="netTOMillion" name="Net TO (€M)" radius={[0, 4, 4, 0]}>
                    {copaChartData.map((entry) => (
                      <Cell key={entry.bu} fill={COPA_BU_COLORS[entry.bu] || CHART_COLORS[3]} />
                    ))}
                    <LabelList
                      dataKey="netTOMillion"
                      position="right"
                      formatter={(v: number) => `€${v.toFixed(1)}M (${copaByBU.find(d => d.netTO === v)?.pct ?? ''}%)`}
                      style={{ fontSize: '0.75rem', fontWeight: 600 }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <ChartNote
                source="CO-PA AGFA NV — Net Turnover key figure, BU dimension"
                note="Total CO-PA Net TO: €159.6M (AGFA NV scope only)"
              />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', height: '100%' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                CO-PA BU Breakdown
                <Chip label="Verified" size="small" sx={{ ml: 1, bgcolor: '#2E7D32', color: '#fff', height: 18, fontSize: '0.65rem' }} />
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>BU</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell align="right">Net TO</TableCell>
                      <TableCell align="right">Share</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {copaByBU.map((row, i) => (
                      <TableRow key={i} hover>
                        <TableCell>
                          <Chip
                            label={row.bu}
                            size="small"
                            sx={{
                              bgcolor: `${COPA_BU_COLORS[row.bu] || CHART_COLORS[3]}20`,
                              color: COPA_BU_COLORS[row.bu] || CHART_COLORS[3],
                              border: `1px solid ${COPA_BU_COLORS[row.bu] || CHART_COLORS[3]}60`,
                              fontWeight: 700,
                              fontSize: '0.7rem',
                              height: 20,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">{row.name}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                            €{row.netTO.toFixed(1)}M
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 700, color: row.pct > 50 ? CHART_COLORS[0] : '#5A6872' }}
                          >
                            {row.pct}%
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow sx={{ bgcolor: '#F5F5F5' }}>
                      <TableCell colSpan={2}>
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>Total</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 700 }}>
                          €{copaByBU.reduce((s, r) => s + r.netTO, 0).toFixed(1)}M
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>100%</Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Two-Margin Framework */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: '#1A2027' }}>
          Two-Margin Framework — AMSP vs CO-PA
        </Typography>
        <Paper elevation={0} sx={{ p: 2.5, border: '1px solid #e0e0e0' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.85rem' }}>
            AMSP measures contribution after transfer pricing benefit. CO-PA measures gross margin at COGS transfer price — a more conservative measure used for external reporting.
          </Typography>
          <Grid container spacing={3}>
            {/* AMSP Basis */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ p: 2, bgcolor: '#E8F5E9', borderRadius: 2, border: '1px solid #A5D6A7' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#2E7D32', mb: 1.5 }}>
                  AMSP Basis
                  <Chip label="Verified" size="small" sx={{ ml: 1, bgcolor: '#2E7D32', color: '#fff', height: 18, fontSize: '0.65rem' }} />
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', borderBottom: '1px solid #A5D6A7' }}>BU</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', borderBottom: '1px solid #A5D6A7' }}>Description</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem', borderBottom: '1px solid #A5D6A7' }}>AMSP Margin</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      { bu: 'LK', desc: 'Wide Format', margin: '62.0%' },
                      { bu: 'LI', desc: 'Industrial Inkjet', margin: '54.9%' },
                      { bu: 'M0', desc: 'Packaging', margin: '70.8%' },
                      { bu: 'ALL', desc: 'Overall (weighted avg)', margin: '61.9%', bold: true },
                    ].map((row, i) => (
                      <TableRow key={i} sx={{ bgcolor: row.bold ? '#C8E6C9' : 'transparent' }}>
                        <TableCell sx={{ fontSize: '0.78rem', fontWeight: row.bold ? 700 : 600 }}>{row.bu}</TableCell>
                        <TableCell sx={{ fontSize: '0.78rem' }}>{row.desc}</TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#2E7D32' }}>{row.margin}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5, fontStyle: 'italic' }}>
                  Source: AMSP Contribution file — 3rd party net sales only
                </Typography>
              </Box>
            </Grid>

            {/* CO-PA Basis */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ p: 2, bgcolor: '#E3F2FD', borderRadius: 2, border: '1px solid #90CAF9' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1565C0', mb: 1.5 }}>
                  CO-PA Basis
                  <Chip label="Verified" size="small" sx={{ ml: 1, bgcolor: '#1565C0', color: '#fff', height: 18, fontSize: '0.65rem' }} />
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', borderBottom: '1px solid #90CAF9' }}>BU</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', borderBottom: '1px solid #90CAF9' }}>Description</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem', borderBottom: '1px solid #90CAF9' }}>GM%</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      { bu: 'LK', desc: 'Wide Format', margin: 'N/A' },
                      { bu: 'LI', desc: 'Industrial Inkjet', margin: 'N/A' },
                      { bu: 'M0', desc: 'Packaging', margin: 'N/A' },
                      { bu: 'ALL', desc: 'Overall (AGFA NV)', margin: '38.9%', bold: true },
                    ].map((row, i) => (
                      <TableRow key={i} sx={{ bgcolor: row.bold ? '#BBDEFB' : 'transparent' }}>
                        <TableCell sx={{ fontSize: '0.78rem', fontWeight: row.bold ? 700 : 600 }}>{row.bu}</TableCell>
                        <TableCell sx={{ fontSize: '0.78rem' }}>{row.desc}</TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.78rem', fontWeight: row.bold ? 700 : 400, color: row.bold ? '#1565C0' : '#9E9E9E', fontStyle: row.margin === 'N/A' ? 'italic' : 'normal' }}>
                          {row.margin}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5, fontStyle: 'italic' }}>
                  GM% per BU not available from CO-PA — AGFA NV consolidated only
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#2E7D32' }}>AMSP (62%) — Transfer Price Included</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Reflects economic contribution including TP benefit. Used for internal performance management and incentive calculations.
              </Typography>
            </Box>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#1565C0' }}>CO-PA (38.9%) — TP Basis COGS</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Gross margin after COGS at transfer price. More conservative — closer to external reporting view. ~23pp lower than AMSP.
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Data Gap Cards: Budget by BC, Budget by Region, HW vs Consumable */}
      <Alert severity="warning" sx={{ mb: 2, fontSize: '0.82rem' }}>
        <strong>3 product mix data gaps identified.</strong> Budget benchmarks and hardware/consumable split cannot be computed from current files.
      </Alert>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <ProxyGapCard
            title="Budget by Budget Class"
            reason="BP1/BP2 budget files not shared — only actuals available in AMSP and RECO files"
            impact="Cannot calculate actual vs budget variance at budget class / product level"
            recommendation="Request BP1/BP2 budget Excel with BC dimension from FP&A team"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ProxyGapCard
            title="Budget by Region"
            reason="Geographic budget allocation not present in any analyzed file"
            impact="Regional performance cannot be benchmarked vs plan at country or region level"
            recommendation="Extract from SAP BW BEx query with budget key figure by country/region"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ProxyGapCard
            title="Hardware vs Consumable Split"
            reason="FA (Financial Application) dimension not consistently populated across all files"
            impact="Cannot assess recurring revenue ratio, hardware attachment rate, or consumable dependency"
            recommendation="Use KRECO20 FA dimension with BC filter; validate FA code population in SAP"
          />
        </Grid>
      </Grid>
    </Box>
  );
};
