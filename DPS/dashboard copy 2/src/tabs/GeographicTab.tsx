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
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { DataConfidenceLegend } from '../components/DataConfidenceLegend';
import { ChartNote } from '../components/ChartNote';
import { GlobalFilters } from '../types';
import { geographicData, regionalSummary, topCustomers, oitBySalesOrg } from '../data/dpsData';
import { CHART_COLORS } from '../theme';

interface Props {
  filters: GlobalFilters;
}

const formatEur = (val: number) => `€${(val / 1000000).toFixed(1)}M`;

const REGION_COLORS: Record<string, string> = {
  'Europe': CHART_COLORS[0],
  'Americas': CHART_COLORS[1],
  'Asia Pacific': CHART_COLORS[2],
  'Middle East & Africa': CHART_COLORS[4],
  'Other': '#9E9E9E',
};

const OIT_SO_COLORS: Record<string, string> = {
  'Europe': CHART_COLORS[0],
  'Americas': CHART_COLORS[1],
  'Asia Pacific': CHART_COLORS[2],
  'Middle East & Africa': CHART_COLORS[4],
  'Other': '#9E9E9E',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Paper sx={{ p: 1.5, border: '1px solid #e0e0e0', fontSize: '0.8rem' }}>
        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>{label}</Typography>
        {payload.map((p: any) => (
          <Typography key={p.name} variant="caption" sx={{ display: 'block', color: p.color }}>
            {p.name}: {formatEur(p.value)} ({((p.value / 190600000) * 100).toFixed(1)}%)
          </Typography>
        ))}
      </Paper>
    );
  }
  return null;
};

const PieCustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <Paper sx={{ p: 1.5, border: '1px solid #e0e0e0', fontSize: '0.8rem' }}>
        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>{payload[0].name}</Typography>
        <Typography variant="caption" sx={{ display: 'block' }}>
          {formatEur(payload[0].value)} ({payload[0].payload.pct}%)
        </Typography>
      </Paper>
    );
  }
  return null;
};

const OitSoTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Paper sx={{ p: 1.5, border: '1px solid #e0e0e0', fontSize: '0.8rem' }}>
        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>{label}</Typography>
        {payload.map((p: any) => (
          <Typography key={p.dataKey} variant="caption" sx={{ display: 'block', color: p.color }}>
            {p.name}: {p.value} units
          </Typography>
        ))}
        {payload.length === 2 && payload[0].value !== undefined && payload[1].value !== undefined && (
          <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: payload[0].value >= payload[1].value ? '#2E7D32' : '#D32F2F', fontWeight: 600 }}>
            YoY: {payload[0].value >= payload[1].value ? '+' : ''}{payload[0].value - payload[1].value} units
          </Typography>
        )}
      </Paper>
    );
  }
  return null;
};

export const GeographicTab: React.FC<Props> = ({ filters: _filters }) => {
  // Top 10 sales orgs by FY2025 OIT
  const top10SalesOrgs = [...(oitBySalesOrg || [])]
    .sort((a, b) => b.oitFY2025 - a.oitFY2025)
    .slice(0, 10);

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#1A2027' }}>
        Geographic Analysis — Net Sales by Country & Region
      </Typography>
      <DataConfidenceLegend />

      {/* Regional Summary Bar + Pie */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
              Net Sales by Region — FY2025
              <Chip label="Verified" size="small" sx={{ ml: 1, bgcolor: '#2E7D32', color: '#fff', height: 18, fontSize: '0.65rem' }} />
            </Typography>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={regionalSummary} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="region" tick={{ fontSize: 10 }} />
                <YAxis tickFormatter={(v) => `€${(v / 1000000).toFixed(0)}M`} tick={{ fontSize: 11 }} width={55} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="netSales" name="Net Sales" radius={[4, 4, 0, 0]}>
                  {regionalSummary.map((entry) => (
                    <Cell key={entry.region} fill={REGION_COLORS[entry.region] || '#9E9E9E'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <ChartNote
              source="Detailed Sales Inquiry AGFA NV (DPS_BP2_Detailed Sales Inquiry AGFA NV_FY2025.xls)"
              note="AGFA NV entity only — third-party customer transactions"
            />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', height: '100%' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
              Revenue Share by Region
              <Chip label="Derived" size="small" sx={{ ml: 1, bgcolor: '#1565C0', color: '#fff', height: 18, fontSize: '0.65rem' }} />
            </Typography>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={regionalSummary}
                  dataKey="netSales"
                  nameKey="region"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={40}
                  paddingAngle={2}
                >
                  {regionalSummary.map((entry) => (
                    <Cell key={entry.region} fill={REGION_COLORS[entry.region] || '#9E9E9E'} />
                  ))}
                </Pie>
                <Tooltip content={<PieCustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '0.75rem' }}
                  formatter={(value) => {
                    const reg = regionalSummary.find(r => r.region === value);
                    return `${value} (${reg?.pct}%)`;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <ChartNote source="Sales Details file — region grouping derived from country" />
          </Paper>
        </Grid>
      </Grid>

      {/* Country Detail Table */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
              Top 10 Countries — Net Sales FY2025
              <Chip label="Verified" size="small" sx={{ ml: 1, bgcolor: '#2E7D32', color: '#fff', height: 18, fontSize: '0.65rem' }} />
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Country</TableCell>
                    <TableCell>Region</TableCell>
                    <TableCell align="right">Net Sales</TableCell>
                    <TableCell align="right">% of Total</TableCell>
                    <TableCell sx={{ minWidth: 100 }}>Share</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...geographicData]
                    .sort((a, b) => b.netSales - a.netSales)
                    .map((row, i) => (
                      <TableRow key={i} hover>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">{i + 1}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>{row.country}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.region}
                            size="small"
                            sx={{
                              bgcolor: `${REGION_COLORS[row.region] || '#9E9E9E'}20`,
                              color: REGION_COLORS[row.region] || '#9E9E9E',
                              border: `1px solid ${REGION_COLORS[row.region] || '#9E9E9E'}50`,
                              fontSize: '0.65rem',
                              height: 18,
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                            {formatEur(row.netSales)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="caption">{row.pct}%</Typography>
                        </TableCell>
                        <TableCell>
                          <LinearProgress
                            variant="determinate"
                            value={(row.pct / 28.4) * 100}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              bgcolor: '#f0f0f0',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: REGION_COLORS[row.region] || '#9E9E9E',
                              },
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <ChartNote
              source="Detailed Sales Inquiry AGFA NV — country dimension from sales order header"
            />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
            {/* Top Customers — IC Note */}
            <Paper elevation={0} sx={{ p: 2, border: '1px solid #fff3e0', bgcolor: '#FFFDE7', flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <InfoOutlinedIcon sx={{ color: '#F57C00', fontSize: 18 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#F57C00' }}>
                  Top Customers — All Intercompany
                </Typography>
                <Chip label="Estimated" size="small" sx={{ bgcolor: '#E65100', color: '#fff', height: 18, fontSize: '0.65rem', ml: 'auto' }} />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: '0.82rem' }}>
                Top 5 revenue customers are AGFA subsidiaries (IC). Customer names partially visible in analyzed files — DPS sells to AGFA national entities which re-sell to end customers.
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontSize: '0.72rem' }}>Customer</TableCell>
                      <TableCell align="right" sx={{ fontSize: '0.72rem' }}>Net Sales</TableCell>
                      <TableCell align="right" sx={{ fontSize: '0.72rem' }}>%</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topCustomers.map((cust, i) => (
                      <TableRow key={i} hover sx={{ bgcolor: cust.isIC ? '#FFF9F0' : 'inherit' }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography variant="caption" sx={{ fontWeight: cust.isIC ? 500 : 400 }}>
                              {cust.name}
                            </Typography>
                            {cust.isIC && (
                              <Chip label="IC" size="small" sx={{ bgcolor: '#F57C0030', color: '#F57C00', border: '1px solid #F57C00', fontSize: '0.58rem', height: 14 }} />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                            {formatEur(cust.netSales)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="caption">{cust.pct}%</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Regional Budget Gap Card */}
            <Card sx={{ border: '2px dashed #EF9A9A', bgcolor: '#FFFBF5', borderRadius: '12px' }}>
              <CardContent sx={{ pb: '12px !important' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <ErrorOutlineIcon sx={{ color: '#D32F2F', fontSize: 18 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#D32F2F', flex: 1, fontSize: '0.85rem' }}>
                    Regional Budget — Data Gap
                  </Typography>
                  <Chip label="Data Gap" size="small" sx={{ bgcolor: '#D32F2F', color: '#fff', height: 16, fontSize: '0.62rem' }} />
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  <strong>Reason:</strong> Geographic budget allocation not present in any analyzed file
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', color: '#D32F2F', mb: 0.5 }}>
                  <strong>Impact:</strong> Cannot benchmark actual regional performance vs plan
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', color: '#2E7D32' }}>
                  <strong>Fix:</strong> Extract from SAP BW BEx query with budget key figure by country
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>

      {/* OIT by Sales Organization — FY2025 vs FY2024 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: '#1A2027' }}>
          OIT by Sales Organization — FY2025 vs FY2024
        </Typography>

        {/* Bar chart: grouped FY2025 vs FY2024 per sales org */}
        <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            OIT Units — Top 10 Sales Organizations
            <Chip label="Verified" size="small" sx={{ ml: 1, bgcolor: '#2E7D32', color: '#fff', height: 18, fontSize: '0.65rem' }} />
          </Typography>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={top10SalesOrgs}
              margin={{ top: 5, right: 20, left: 10, bottom: 55 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="salesOrg"
                tick={{ fontSize: 10 }}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis
                tickFormatter={(v) => `${v}`}
                tick={{ fontSize: 11 }}
                width={32}
                label={{ value: 'OIT Units', angle: -90, position: 'insideLeft', offset: 10, fontSize: 11, fill: '#5A6872' }}
              />
              <Tooltip content={<OitSoTooltip />} />
              <Legend wrapperStyle={{ fontSize: '0.75rem', paddingTop: 8 }} />
              <Bar dataKey="oitFY2025" name="FY2025" fill={CHART_COLORS[0]} radius={[3, 3, 0, 0]} />
              <Bar dataKey="oitFY2024" name="FY2024" fill={CHART_COLORS[1]} radius={[3, 3, 0, 0]} opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
          <ChartNote
            source="Order follow-up file — OIT tracker by sales organization"
            note="Top 10 sales orgs by FY2025 OIT shown. 58 total DPS sales organizations."
          />
        </Paper>

        {/* Detail table */}
        <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
            Sales Organization Detail — FY2025 vs FY2024
            <Chip label="Verified" size="small" sx={{ ml: 1, bgcolor: '#2E7D32', color: '#fff', height: 18, fontSize: '0.65rem' }} />
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Sales Organization</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Region</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>FY2025 OIT</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>FY2024 OIT</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>YoY Change</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {top10SalesOrgs.map((row, i) => {
                  const yoy = row.oitFY2025 - row.oitFY2024;
                  const isPositive = yoy > 0;
                  const isFlat = yoy === 0;
                  return (
                    <TableRow key={i} hover>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">{i + 1}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>{row.salesOrg}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={row.region}
                          size="small"
                          sx={{
                            bgcolor: `${OIT_SO_COLORS[row.region] || '#9E9E9E'}20`,
                            color: OIT_SO_COLORS[row.region] || '#9E9E9E',
                            border: `1px solid ${OIT_SO_COLORS[row.region] || '#9E9E9E'}50`,
                            fontSize: '0.65rem',
                            height: 18,
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 700 }}>
                          {row.oitFY2025}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                          {row.oitFY2024}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 700,
                            color: isFlat ? '#5A6872' : isPositive ? '#2E7D32' : '#D32F2F',
                            fontFamily: 'monospace',
                          }}
                        >
                          {isFlat ? '—' : `${isPositive ? '+' : ''}${yoy}`}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5, fontStyle: 'italic' }}>
            58 total DPS sales organizations — top 10 shown. OIT unit counts from Order follow-up file.
          </Typography>
        </Paper>
      </Box>

      <Alert severity="info" sx={{ fontSize: '0.82rem' }}>
        <strong>Interpretation note:</strong> Belgium appears as #1 country (EUR 28.4M, 14.9%) because AGFA NV is headquartered in Belgium and many intercompany transactions are booked there. The actual end-customer geographic distribution would differ significantly if viewed from the AGFA subsidiary level.
      </Alert>
    </Box>
  );
};
