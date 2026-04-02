import React from 'react';
import {
  Grid, Typography, Box, Card, CardContent,
  Table, TableHead, TableRow, TableCell, TableBody, Chip,
} from '@mui/material';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
} from 'recharts';
import StorageIcon from '@mui/icons-material/Storage';
import WarehouseIcon from '@mui/icons-material/Warehouse';
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

const obCompositionData = [
  { name: 'Planned CY', value: 52, fill: '#1565C0' },
  { name: 'Planned Next Yr', value: 28, fill: '#42A5F5' },
  { name: 'Overdue ≤6m', value: 11, fill: '#EF5350' },
  { name: 'Not Planned', value: 9, fill: '#BDBDBD' },
];

const backlogAgingData = [
  { bucket: '< 3 months', eurM: 18.4 },
  { bucket: '3–6 months', eurM: 12.6 },
  { bucket: '6–12 months', eurM: 10.1 },
  { bucket: '> 12 months', eurM: 4.9 },
  { bucket: 'Overdue', eurM: 3.2 },
];

const obEvolutionData = [
  { month: "Jan'25", eurM: 38.1 },
  { month: "Feb'25", eurM: 39.4 },
  { month: "Mar'25", eurM: 41.2 },
  { month: "Apr'25", eurM: 40.8 },
  { month: "May'25", eurM: 42.1 },
  { month: "Jun'25", eurM: 43.5 },
  { month: "Jul'25", eurM: 41.9 },
  { month: "Aug'25", eurM: 43.2 },
  { month: "Sep'25", eurM: 44.8 },
  { month: "Oct'25", eurM: 45.1 },
  { month: "Nov'25", eurM: 46.2 },
  { month: "Dec'25", eurM: 47.8 },
  { month: "Jan'26", eurM: 47.3 },
];

const overdueOrders = [
  { opp: 'OPP-2024-0891', customer: "St. Mary's Hospital", region: 'North America', equip: 'DR 800', value: '€485k', planned: '2026-01-15', days: 65 },
  { opp: 'OPP-2024-0923', customer: 'Clinica Barcelona', region: 'Europe South', equip: 'DR 600', value: '€312k', planned: '2026-02-10', days: 39 },
  { opp: 'OPP-2024-0956', customer: 'General Hospital KL', region: 'Intercontinental', equip: 'DR 400', value: '€198k', planned: '2026-02-28', days: 26 },
  { opp: 'OPP-2024-0977', customer: 'Munich Radiologie', region: 'Europe North', equip: 'DR 100e', value: '€145k', planned: '2026-03-05', days: 21 },
  { opp: 'OPP-2024-1002', customer: 'Toronto Medical', region: 'North America', equip: 'Retrofit', value: '€89k', planned: '2026-03-10', days: 16 },
];

const implLagData = [
  { type: 'DR 100e', avgDays: 45 },
  { type: 'DR 400', avgDays: 62 },
  { type: 'DR 600', avgDays: 78 },
  { type: 'DR 800', avgDays: 95 },
  { type: 'Retrofit', avgDays: 38 },
  { type: 'Valory', avgDays: 55 },
];

const SAP_SOURCE = 'SAP Order delivery status — agfa_saporderid → SAP join';

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography variant="h6" sx={{ mb: 1, mt: 3, fontWeight: 700, color: '#1565C0', borderBottom: '2px solid #E3F2FD', pb: 0.5 }}>
    {children}
  </Typography>
);

const OrderBookTab: React.FC<Props> = ({ data }) => {
  const { kpis } = data;

  return (
    <Box>
      <DataConfidenceLegend />

      {/* ── Page 3.1 — Order Book Overview ───────────────────────────────────── */}
      <SectionHeader>Order Book Overview (Page 3.1)</SectionHeader>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <KpiCard title="Total Order Backlog"
            value="€47.3M"
            subtitle="Full SAP order backlog — illustrative"
            icon={<WarehouseIcon />}
            dataConfidence="proxy"
            dataNote="Proxy — illustrative. SAP EDW Phase 3 required." />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <KpiCard title="Overdue Orders"
            value="€3.2M"
            subtitle="Orders past planned delivery — illustrative"
            icon={<WarehouseIcon />}
            dataConfidence="proxy"
            dataNote="Proxy — illustrative. SAP EDW Phase 3 required." />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <KpiCard title="Book & Bill This Quarter"
            value="€8.5M"
            subtitle="Same-quarter OIT → Reco — illustrative"
            icon={<StorageIcon />}
            dataConfidence="proxy"
            dataNote="Proxy — illustrative. Requires SAP OIT + invoice same-period match." />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Order Book Composition</Typography>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={obCompositionData}
                    cx="50%" cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, value }) => `${name}: ${value}%`}
                    labelLine
                  >
                    {obCompositionData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`${v}%`]} />
                </PieChart>
              </ResponsiveContainer>
              <DataUnavailableNote source={SAP_SOURCE} />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Backlog Aging by Bucket (€M)</Typography>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={backlogAgingData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 90, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tickFormatter={(v: any) => `€${v}M`} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="bucket" tick={{ fontSize: 10 }} width={90} />
                  <Tooltip formatter={(v: any) => [`€${v}M`, 'Backlog']} />
                  <Bar dataKey="eurM" name="Backlog (€M)" radius={[0, 4, 4, 0]}>
                    {backlogAgingData.map((entry, i) => (
                      <Cell key={i} fill={entry.bucket === 'Overdue' ? '#EF5350' : '#1565C0'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <DataUnavailableNote source={SAP_SOURCE} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Order Book Evolution — 13 Months (€M)</Typography>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={obEvolutionData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tickFormatter={(v: any) => `€${v}M`} domain={[35, 50]} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: any) => [`€${v}M`, 'Order Book']} />
              <Area type="monotone" dataKey="eurM" name="Order Book (€M)" stroke="#1565C0" fill="#E3F2FD" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          <DataUnavailableNote source={SAP_SOURCE} />
        </CardContent>
      </Card>

      {/* ── Page 3.2 — Backlog Aging & Risk ──────────────────────────────────── */}
      <SectionHeader>Backlog Aging &amp; Risk (Page 3.2)</SectionHeader>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Overdue Orders</Typography>
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#F5F7FA' }}>
                  {['Opportunity ID', 'Customer', 'Region', 'Equipment', 'Value', 'Planned Delivery', 'Days Overdue'].map(h => (
                    <TableCell key={h}><Typography variant="caption" fontWeight={700}>{h}</Typography></TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {overdueOrders.map((row, i) => (
                  <TableRow key={i} hover>
                    <TableCell><Typography variant="body2" sx={{ fontSize: '0.72rem', fontFamily: 'monospace' }}>{row.opp}</Typography></TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{row.customer}</Typography></TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontSize: '0.72rem', color: '#5A6872' }}>{row.region}</Typography></TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontSize: '0.72rem' }}>{row.equip}</Typography></TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{row.value}</Typography></TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontSize: '0.72rem' }}>{row.planned}</Typography></TableCell>
                    <TableCell>
                      <Chip
                        label={`${row.days}d`}
                        size="small"
                        sx={{
                          height: 20, fontSize: '0.65rem', fontWeight: 700,
                          bgcolor: row.days >= 60 ? '#B71C1C' : row.days >= 30 ? '#EF5350' : '#FF8A65',
                          color: '#fff',
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          <DataUnavailableNote source={SAP_SOURCE} />
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Implementation Lag by Equipment Type (Avg Days)</Typography>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={implLagData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="type" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v: any) => `${v}d`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: any) => [`${v} days`, 'Avg Lag']} />
              <Bar dataKey="avgDays" name="Avg Days" fill="#F57C00" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <ChartNote note="⚠ Illustrative: Implementation lag from OIT date to planned Reco date. Requires SAP delivery milestone data." />
          <DataUnavailableNote source={SAP_SOURCE} />
        </CardContent>
      </Card>

      {/* Proxy note retained for context */}
      <Box sx={{ mt: 2, p: 2, bgcolor: '#FFF3E0', borderRadius: 1, border: '1px solid #FFCC80' }}>
        <Typography variant="body2" sx={{ color: '#E65100', fontWeight: 500 }}>
          Currently available proxy: {fmtNum(kpis.sapOrderCount)} Won deals have SAP Order IDs in CRM (agfa_saporderid field).
          These can be used to join to SAP once EDW connectivity is established.
        </Typography>
      </Box>
    </Box>
  );
};

export default OrderBookTab;
