import React from 'react';
import Grid from '@mui/material/Grid';
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
  Alert,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  ComposedChart,
  Cell,
} from 'recharts';
import { DataConfidenceLegend } from '../components/DataConfidenceLegend';
import { ChartNote } from '../components/ChartNote';
import { GlobalFilters } from '../types';
import {
  monthlyRevenueTrend,
  amspByBudgetClass,
  plWaterfall,
  revenueReconciliation,
  revenueData,
  recoPnL,
  topProductFamilies,
  copaByBU,
} from '../data/dpsData';
import { CHART_COLORS } from '../theme';

interface Props {
  filters: GlobalFilters;
}

const formatEur = (val: number) => `€${(val / 1000000).toFixed(1)}M`;
const formatKeur = (val: number) => `€${(val / 1000).toFixed(0)}K`;

const BU_COLORS: Record<string, string> = {
  LK: '#1565C0',
  LI: '#00695C',
  M0: '#E65100',
  MIX: '#757575',
};

const CustomTooltipRevenue = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Paper sx={{ p: 1.5, border: '1px solid #e0e0e0', fontSize: '0.8rem' }}>
        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>{label}</Typography>
        {payload.map((p: any) => (
          <Typography key={p.name} variant="caption" sx={{ display: 'block', color: p.color }}>
            {p.name}: {typeof p.value === 'number' && p.name === 'Net Sales' ? formatEur(p.value) : `${p.value}%`}
          </Typography>
        ))}
      </Paper>
    );
  }
  return null;
};

const CustomTooltipWaterfall = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const val = payload.find((p: any) => p.name === 'value' || p.dataKey === 'display');
    return (
      <Paper sx={{ p: 1.5, border: '1px solid #e0e0e0', fontSize: '0.8rem' }}>
        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>{label}</Typography>
        {payload.map((p: any) => (
          <Typography key={p.name} variant="caption" sx={{ display: 'block', color: p.color }}>
            {p.name}: {p.value.toLocaleString()} kEUR
          </Typography>
        ))}
      </Paper>
    );
  }
  return null;
};

const CustomTooltipProductFamilies = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Paper sx={{ p: 1.5, border: '1px solid #e0e0e0', fontSize: '0.8rem' }}>
        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>{label}</Typography>
        {payload.map((p: any) => (
          <Typography key={p.name} variant="caption" sx={{ display: 'block', color: p.color }}>
            Net Sales: {p.value.toLocaleString()} kEUR
          </Typography>
        ))}
      </Paper>
    );
  }
  return null;
};

export const RevenueMarginTab: React.FC<Props> = ({ filters: _filters }) => {
  const waterfallData = [
    { name: 'Gross Sales', value: 220000, fill: CHART_COLORS[0] },
    { name: 'Rebates', value: -60400, fill: CHART_COLORS[3] },
    { name: 'Net TO', value: 159600, fill: CHART_COLORS[1] },
    { name: 'COGS TP', value: -118200, fill: CHART_COLORS[3] },
    { name: 'Gross Margin', value: 41400, fill: CHART_COLORS[2] },
  ];

  const waterfallDisplay = waterfallData.map((d) => ({
    ...d,
    absValue: Math.abs(d.value),
    label: d.value < 0 ? `(${Math.abs(d.value).toLocaleString()})` : d.value.toLocaleString(),
  }));

  const topFamiliesFiltered = topProductFamilies.filter((f) => f.family !== 'OTHER').slice(0, 9);

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#1A2027' }}>
        Revenue & Margin Analysis — FY2025
      </Typography>
      <DataConfidenceLegend />

      {/* KPI Cards Row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', height: '100%', bgcolor: '#F3F8FF' }}>
            <Typography variant="caption" sx={{ color: '#546E7A', display: 'block', mb: 0.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              RECO Revenue
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#1565C0', lineHeight: 1.1 }}>
              EUR 385.1M
            </Typography>
            <Typography variant="caption" sx={{ color: '#D32F2F', fontWeight: 600, display: 'block', mt: 0.5 }}>
              -17.9% vs budget
            </Typography>
            <Chip label="Verified" size="small" sx={{ mt: 0.5, bgcolor: '#2E7D32', color: '#fff', height: 16, fontSize: '0.6rem' }} />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', height: '100%', bgcolor: '#F1F8E9' }}>
            <Typography variant="caption" sx={{ color: '#546E7A', display: 'block', mb: 0.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              EBIT FY2025
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#2E7D32', lineHeight: 1.1 }}>
              EUR 205.1M
            </Typography>
            <Typography variant="caption" sx={{ color: '#2E7D32', fontWeight: 700, display: 'block' }}>
              53.3% margin
            </Typography>
            <Typography variant="caption" sx={{ color: '#546E7A', display: 'block', mt: 0.5 }}>
              vs FY2024: EUR 219.6M
            </Typography>
            <Chip label="Verified" size="small" sx={{ mt: 0.5, bgcolor: '#2E7D32', color: '#fff', height: 16, fontSize: '0.6rem' }} />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', height: '100%', bgcolor: '#FFFDE7' }}>
            <Typography variant="caption" sx={{ color: '#546E7A', display: 'block', mb: 0.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              SG&A vs Budget
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#F57F17', lineHeight: 1.1 }}>
              +EUR 9M Favorable
            </Typography>
            <Typography variant="caption" sx={{ color: '#546E7A', display: 'block', mt: 0.5 }}>
              Actual -85M vs Budget -94M
            </Typography>
            <Chip label="Verified" size="small" sx={{ mt: 0.5, bgcolor: '#2E7D32', color: '#fff', height: 16, fontSize: '0.6rem' }} />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', height: '100%', bgcolor: '#E0F2F1' }}>
            <Typography variant="caption" sx={{ color: '#546E7A', display: 'block', mb: 0.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              AMSP Margin
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#00695C', lineHeight: 1.1 }}>
              61.9%
            </Typography>
            <Typography variant="caption" sx={{ color: '#546E7A', display: 'block', mt: 0.5 }}>
              Full-year AMSP contribution rate
            </Typography>
            <Chip label="Verified" size="small" sx={{ mt: 0.5, bgcolor: '#2E7D32', color: '#fff', height: 16, fontSize: '0.6rem' }} />
          </Paper>
        </Grid>
      </Grid>

      {/* RECO Full P&L Section */}
      <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
          RECO Full P&L — FY2025 vs BP1 Budget
          <Chip label="Verified" size="small" sx={{ ml: 1, bgcolor: '#2E7D32', color: '#fff', height: 18, fontSize: '0.65rem' }} />
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
          Source: RECO financial system. All values in kEUR.
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#F5F5F5' }}>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.78rem' }}>Metric</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.78rem' }}>Actual (kEUR)</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.78rem' }}>Budget (kEUR)</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.78rem' }}>vs PY (kEUR)</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.78rem' }}>Margin %</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recoPnL.map((row, i) => {
                const isEbitRow = row.metric === 'EBIT';
                const isNonRecurring = row.metric === 'Non-recurring / Restructuring';
                const rowBg = row.isTotal ? '#F5F5F5' : 'transparent';
                return (
                  <TableRow key={i} sx={{ bgcolor: rowBg }}>
                    <TableCell sx={{ pl: row.indent ? row.indent * 2 + 1 : 1 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: row.isTotal ? 700 : 400,
                          color: isNonRecurring ? '#D32F2F' : 'inherit',
                        }}
                      >
                        {row.metric}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="caption"
                        sx={{ fontFamily: 'monospace', fontWeight: row.isTotal ? 700 : 400 }}
                      >
                        {row.actual !== null ? row.actual.toLocaleString() : '—'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: 'monospace',
                          fontWeight: row.isTotal ? 700 : 400,
                          color: isNonRecurring ? '#D32F2F' : 'inherit',
                        }}
                      >
                        {row.budget !== null ? row.budget.toLocaleString() : '—'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      {isEbitRow ? (
                        <Typography
                          variant="caption"
                          sx={{
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: '#1565C0',
                            bgcolor: '#E3F2FD',
                            px: 0.75,
                            py: 0.25,
                            borderRadius: 0.5,
                            display: 'inline-block',
                          }}
                        >
                          FY24: 219,600
                        </Typography>
                      ) : (
                        <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#9E9E9E' }}>
                          {row.py !== null ? row.py.toLocaleString() : '—'}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: 'monospace',
                          fontWeight: row.isTotal ? 700 : 400,
                          color: row.pct !== null && row.pct < 0 ? '#D32F2F' : 'inherit',
                        }}
                      >
                        {row.pct !== null ? `${row.pct}%` : '—'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Alert severity="success" sx={{ flex: 1, minWidth: 260, fontSize: '0.78rem', py: 0.5 }}>
            <strong>SG&A EUR 9M favorable vs budget</strong> (actual -85M, budget -94M) is a key positive story.
          </Alert>
          <Alert severity="error" sx={{ flex: 1, minWidth: 260, fontSize: '0.78rem', py: 0.5 }}>
            <strong>Non-recurring:</strong> actual -6,191 kEUR vs budget -400 kEUR — unfavorable by ~5.8M (restructuring overrun).
          </Alert>
        </Box>
      </Paper>

      {/* Row 1: Monthly Revenue + AMSP Margin Trend */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', height: '100%' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
              Monthly Net Sales — FY2025
              <Chip label="Verified" size="small" sx={{ ml: 1, bgcolor: '#2E7D32', color: '#fff', height: 18, fontSize: '0.65rem' }} />
            </Typography>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyRevenueTrend} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis
                  tickFormatter={(v) => `€${(v / 1000000).toFixed(0)}M`}
                  tick={{ fontSize: 11 }}
                  width={55}
                />
                <Tooltip
                  formatter={(value: number) => [`€${(value / 1000000).toFixed(1)}M`, 'Net Sales']}
                  labelStyle={{ fontWeight: 700 }}
                />
                <Bar dataKey="netSales" name="Net Sales" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]}>
                  {monthlyRevenueTrend.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.month === 'Dec' ? CHART_COLORS[2] : CHART_COLORS[0]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <ChartNote
              source="AMSP Contribution file (DPS_BP1_AMSP Contribution FY2025.xls)"
              note="Dec highlighted in orange due to anomaly — highest revenue, lowest margin month"
            />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', height: '100%' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
              Monthly AMSP Margin % — FY2025
              <Chip label="Verified" size="small" sx={{ ml: 1, bgcolor: '#2E7D32', color: '#fff', height: 18, fontSize: '0.65rem' }} />
            </Typography>
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart data={monthlyRevenueTrend} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis
                  domain={[40, 70]}
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fontSize: 11 }}
                  width={40}
                />
                <Tooltip
                  formatter={(value: number) => [`${value}%`, 'AMSP Margin']}
                  labelStyle={{ fontWeight: 700 }}
                />
                <Line
                  type="monotone"
                  dataKey="amspMargin"
                  name="AMSP Margin %"
                  stroke={CHART_COLORS[1]}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: CHART_COLORS[1] }}
                  activeDot={{ r: 6 }}
                />
                {/* Reference line at 61.9% avg */}
                <Line
                  type="monotone"
                  dataKey={() => 61.9}
                  name="FY Avg (61.9%)"
                  stroke="#999"
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
            <ChartNote
              source="AMSP Contribution file"
              note="Dashed line = FY2025 avg 61.9%. Dec anomaly at 46.4% requires investigation"
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Row 2: Top CO-PA Product Families + Two-Margin Comparison */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', height: '100%' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
              Top CO-PA Product Families by Net Sales
              <Chip label="Verified" size="small" sx={{ ml: 1, bgcolor: '#2E7D32', color: '#fff', height: 18, fontSize: '0.65rem' }} />
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={topFamiliesFiltered}
                layout="vertical"
                margin={{ top: 5, right: 50, left: 140, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  type="number"
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}M`}
                  tick={{ fontSize: 10 }}
                />
                <YAxis
                  type="category"
                  dataKey="family"
                  tick={{ fontSize: 10 }}
                  width={135}
                />
                <Tooltip content={<CustomTooltipProductFamilies />} />
                <Bar dataKey="netSalesKeur" name="Net Sales (kEUR)" radius={[0, 4, 4, 0]}>
                  {topFamiliesFiltered.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={BU_COLORS[entry.buCode] ?? '#757575'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <ChartNote
              source="CO-PA GMPCOPA_1 — AGFA NV entity only"
              note="Service revenue (Jeti+Onset+Anapurna Service) = ~EUR 46M. Color = BU: Blue=LK, Teal=LI, Orange=M0"
            />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', height: '100%' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
              Two-Margin Comparison
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 1,
                  border: '2px solid #A5D6A7',
                  bgcolor: '#F1F8E9',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 900, color: '#2E7D32', lineHeight: 1 }}>
                  61.9%
                </Typography>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#2E7D32' }}>
                    AMSP Margin
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    AMSP Contribution / Net Sales 3rdP
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: '#546E7A', fontSize: '0.7rem' }}>
                    Includes transfer pricing benefit. Full DPS view.
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 1,
                  border: '2px solid #80CBC4',
                  bgcolor: '#E0F2F1',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 900, color: '#00695C', lineHeight: 1 }}>
                  38.9%
                </Typography>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#00695C' }}>
                    CO-PA GM%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Gross Margin at COGS Transfer Price
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: '#546E7A', fontSize: '0.7rem' }}>
                    AGFA NV entity only (company 0898).
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ p: 1.5, bgcolor: '#FFF8E1', borderRadius: 1, border: '1px solid #FFE082' }}>
                <Typography variant="caption" sx={{ color: '#5D4037', lineHeight: 1.5 }}>
                  <strong>Why they differ:</strong> AMSP margin measures contribution after internal transfer prices that allocate manufacturing profit to the selling entity, inflating the apparent margin vs. external COGS. CO-PA GM% reflects actual transfer price paid at AGFA NV, which is set closer to market cost and therefore shows a lower gross margin.
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Row 3: AMSP by Budget Class + P&L Waterfall */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
              AMSP Margin % by Budget Class
              <Chip label="Verified" size="small" sx={{ ml: 1, bgcolor: '#2E7D32', color: '#fff', height: 18, fontSize: '0.65rem' }} />
            </Typography>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={[...amspByBudgetClass].sort((a, b) => b.margin - a.margin)}
                layout="vertical"
                margin={{ top: 5, right: 40, left: 130, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} domain={[0, 100]} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={125} />
                <Tooltip
                  formatter={(value: number, name: string) => [`${value}%`, name]}
                  labelStyle={{ fontWeight: 700 }}
                />
                <Bar dataKey="margin" name="AMSP Margin %" radius={[0, 4, 4, 0]}>
                  {[...amspByBudgetClass].sort((a, b) => b.margin - a.margin).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.margin > 60 ? CHART_COLORS[1] : entry.margin > 30 ? CHART_COLORS[2] : CHART_COLORS[3]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <ChartNote
              source="AMSP Contribution file"
              note="Margin = AMSP Contribution / Net Sales 3rdP. Green >60%, Orange >30%, Red <30%"
            />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
              CO-PA P&L Summary — FY2025
              <Chip label="Verified" size="small" sx={{ ml: 1, bgcolor: '#2E7D32', color: '#fff', height: 18, fontSize: '0.65rem' }} />
            </Typography>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={waterfallDisplay} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis
                  tickFormatter={(v) => `€${(v / 1000).toFixed(0)}K`}
                  tick={{ fontSize: 10 }}
                  width={55}
                />
                <Tooltip
                  formatter={(value: number, _name: string, props: any) => [
                    `${props.payload.label} kEUR`,
                    props.payload.name,
                  ]}
                  labelStyle={{ fontWeight: 700 }}
                />
                <Bar dataKey="absValue" name="Amount (kEUR)" radius={[4, 4, 0, 0]}>
                  {waterfallDisplay.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <ChartNote
              source="CO-PA GMPCOPA_1, AGFA NV only"
              note="This is NOT full DPS P&L — AGFA NV entity only. Red bars = reductions"
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Row 4: Budget Class Detail Table + Revenue Reconciliation */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
              Budget Class Performance Detail
              <Chip label="Verified" size="small" sx={{ ml: 1, bgcolor: '#2E7D32', color: '#fff', height: 18, fontSize: '0.65rem' }} />
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Budget Class</TableCell>
                    <TableCell align="right">Net Sales</TableCell>
                    <TableCell align="right">AMSP Margin</TableCell>
                    <TableCell sx={{ minWidth: 100 }}>Margin Bar</TableCell>
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
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 700,
                            color: row.margin > 60 ? '#2E7D32' : row.margin > 30 ? '#F57C00' : '#D32F2F',
                          }}
                        >
                          {row.margin}%
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <LinearProgress
                          variant="determinate"
                          value={row.margin}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: '#f0f0f0',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: row.margin > 60 ? '#2E7D32' : row.margin > 30 ? '#F57C00' : '#D32F2F',
                              borderRadius: 4,
                            },
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Alert severity="warning" sx={{ mt: 2, fontSize: '0.78rem' }}>
              <strong>No AMSP Rate:</strong> EUR 64M (33.6% of net sales) has no AMSP rate assigned — actual margin unknown for this portion.
            </Alert>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
              Revenue Figures Across Files — Reconciliation
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Source</TableCell>
                    <TableCell align="right">kEUR</TableCell>
                    <TableCell>Note</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {revenueReconciliation.map((row, i) => (
                    <TableRow key={i} hover>
                      <TableCell>
                        <Typography variant="caption" sx={{ fontWeight: 500 }}>{row.source}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 700 }}>
                          {row.value.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">{row.note}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 2, p: 2, bgcolor: '#E8F5E9', borderRadius: 1, border: '1px solid #c8e6c9' }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#2E7D32', display: 'block', mb: 0.5 }}>
                P&L Summary (CO-PA, AGFA NV, kEUR)
              </Typography>
              {[
                { label: 'Gross Sales', val: revenueData.copaFY2025.grossSales / 1000, sign: '' },
                { label: 'Rebates & Discounts', val: revenueData.copaFY2025.rebates / 1000, sign: '-' },
                { label: 'Net TO', val: revenueData.copaFY2025.netTO / 1000, sign: '=' },
                { label: 'COGS TP', val: revenueData.copaFY2025.cogsTP / 1000, sign: '-' },
                { label: 'Gross Margin (25.9%)', val: revenueData.copaFY2025.grossMargin / 1000, sign: '=' },
              ].map((row, i) => (
                <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3, borderBottom: i < 4 ? '1px solid #e0e0e0' : 'none' }}>
                  <Typography variant="caption" sx={{ fontWeight: i === 2 || i === 4 ? 700 : 400 }}>
                    {row.sign} {row.label}
                  </Typography>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: i === 2 || i === 4 ? 700 : 400 }}>
                    {row.val.toLocaleString()}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
