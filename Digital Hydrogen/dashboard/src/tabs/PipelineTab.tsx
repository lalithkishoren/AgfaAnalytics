import React, { useMemo } from 'react';
import { Grid, Typography, Card, CardContent, Box, Chip } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { DashboardData, GlobalFilters, NavigateAction } from '../types';
import { fmtEur, fmtPct, fmtNum } from '../utils/formatters';
import { PRODUCT_COLORS, CHART_COLORS } from '../theme';
import { DataConfidenceLegend } from '../components/DataConfidenceLegend';

interface Props {
  data: DashboardData;
  filters: GlobalFilters;
  onNavigate?: (nav: NavigateAction) => void;
}

const PipelineTab: React.FC<Props> = ({ data, filters, onNavigate }) => {
  const { quotations } = data;

  // Filtered quotations
  const filtered = useMemo(() => {
    return quotations.filter(q => {
      if (filters.year !== 'all' && q.year !== filters.year) return false;
      if (filters.product !== 'all' && q.product !== filters.product) return false;
      if (filters.region !== 'all' && q.region !== filters.region) return false;
      if (filters.customer !== 'all' && q.customer !== filters.customer) return false;
      return true;
    });
  }, [quotations, filters]);

  // Conversion funnel
  const funnel = useMemo(() => {
    const total = filtered.length;
    const ordered = filtered.filter(q => q.isOrdered).length;
    const withAmount = filtered.filter(q => q.totalAmount > 0).length;
    return [
      { stage: 'Quotes Sent', count: total, pct: 100, fill: '#1565C0' },
      { stage: 'With Amount', count: withAmount, pct: total > 0 ? (withAmount / total) * 100 : 0, fill: '#42A5F5' },
      { stage: 'Converted', count: ordered, pct: total > 0 ? (ordered / total) * 100 : 0, fill: '#2E7D32' },
    ];
  }, [filtered]);

  // Conversion by year
  const convByYear = useMemo(() => {
    const byYear: Record<number, { total: number; ordered: number }> = {};
    quotations.forEach(q => {
      if (!q.year) return;
      if (!byYear[q.year]) byYear[q.year] = { total: 0, ordered: 0 };
      byYear[q.year].total++;
      if (q.isOrdered) byYear[q.year].ordered++;
    });
    return Object.entries(byYear)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([year, d]) => ({
        year,
        rate: d.total > 0 ? (d.ordered / d.total) * 100 : 0,
        total: d.total,
        ordered: d.ordered,
      }));
  }, [quotations]);

  // Conversion by product
  const convByProduct = useMemo(() => {
    const byProd: Record<string, { total: number; ordered: number }> = {};
    filtered.forEach(q => {
      if (!q.product) return;
      if (!byProd[q.product]) byProd[q.product] = { total: 0, ordered: 0 };
      byProd[q.product].total++;
      if (q.isOrdered) byProd[q.product].ordered++;
    });
    return Object.entries(byProd)
      .map(([product, d]) => ({
        product,
        rate: d.total > 0 ? (d.ordered / d.total) * 100 : 0,
        total: d.total,
        ordered: d.ordered,
        fill: PRODUCT_COLORS[product] || CHART_COLORS.neutral,
      }))
      .sort((a, b) => b.rate - a.rate);
  }, [filtered]);

  // Deal size vs conversion
  const dealSizeScatter = useMemo(() => {
    const buckets = [
      { label: '<€10K', min: 0, max: 10000 },
      { label: '€10-50K', min: 10000, max: 50000 },
      { label: '€50-100K', min: 50000, max: 100000 },
      { label: '€100-500K', min: 100000, max: 500000 },
      { label: '>€500K', min: 500000, max: Infinity },
    ];
    return buckets.map(b => {
      const inBucket = filtered.filter(q => q.totalAmount >= b.min && q.totalAmount < b.max);
      const ordered = inBucket.filter(q => q.isOrdered).length;
      return {
        bucket: b.label,
        count: inBucket.length,
        conversionRate: inBucket.length > 0 ? (ordered / inBucket.length) * 100 : 0,
        avgAmount: inBucket.length > 0 ? inBucket.reduce((s, q) => s + q.totalAmount, 0) / inBucket.length : 0,
      };
    }).filter(d => d.count > 0);
  }, [filtered]);

  // Top quoting countries
  const convByCountry = useMemo(() => {
    const byCountry: Record<string, { total: number; ordered: number; value: number }> = {};
    filtered.forEach(q => {
      const c = q.country || 'Unknown';
      if (!byCountry[c]) byCountry[c] = { total: 0, ordered: 0, value: 0 };
      byCountry[c].total++;
      byCountry[c].value += q.totalAmount || 0;
      if (q.isOrdered) byCountry[c].ordered++;
    });
    return Object.entries(byCountry)
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 12)
      .map(([country, d]) => ({
        country: country.length > 15 ? country.slice(0, 13) + '...' : country,
        rate: d.total > 0 ? (d.ordered / d.total) * 100 : 0,
        total: d.total,
        value: d.value,
      }));
  }, [filtered]);

  // Pipeline value (open quotes)
  const pipeline = useMemo(() => {
    const open = filtered.filter(q => !q.isOrdered);
    return {
      count: open.length,
      value: open.reduce((s, q) => s + (q.totalAmount || 0), 0),
    };
  }, [filtered]);

  // DataGrid columns
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Quote #', width: 130 },
    { field: 'sentDate', headerName: 'Sent Date', width: 110 },
    { field: 'customer', headerName: 'Customer', width: 180 },
    { field: 'country', headerName: 'Country', width: 120 },
    { field: 'product', headerName: 'Product', width: 100 },
    { field: 'totalSqm', headerName: 'Total m²', width: 100, type: 'number', valueFormatter: (params: any) => fmtNum(params) },
    { field: 'eurPerM2', headerName: '€/m²', width: 90, type: 'number', valueFormatter: (params: any) => `€${fmtNum(params, 0)}` },
    { field: 'totalAmount', headerName: 'Total €', width: 120, type: 'number', valueFormatter: (params: any) => fmtEur(params, false) },
    {
      field: 'isOrdered', headerName: 'Status', width: 110,
      renderCell: (params: any) => (
        <Chip
          label={params.value ? 'Converted' : 'Open'}
          size="small"
          color={params.value ? 'success' : 'default'}
          variant="outlined"
          sx={{ fontSize: '0.7rem' }}
        />
      ),
    },
    { field: 'year', headerName: 'Year', width: 70 },
  ];

  return (
    <Box>
      <DataConfidenceLegend />

      {/* Summary row */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card sx={{ bgcolor: '#E3F2FD' }}>
            <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Typography variant="subtitle2">Total Quotes</Typography>
              <Typography variant="h5" fontWeight={700}>{fmtNum(filtered.length)}</Typography>
              <Typography variant="caption" sx={{ color: '#2E7D32', fontSize: '0.6rem' }}>✅ Verified: Quotation.xlsx</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card sx={{ bgcolor: '#E8F5E9' }}>
            <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Typography variant="subtitle2">Converted</Typography>
              <Typography variant="h5" fontWeight={700}>{fmtNum(funnel[2]?.count || 0)}</Typography>
              <Typography variant="caption" sx={{ color: '#2E7D32', fontSize: '0.6rem' }}>✅ Verified: Order=yes flag</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card sx={{ bgcolor: '#FFF3E0', border: '2px dashed #FFCC80' }}>
            <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Typography variant="subtitle2">Pipeline Value</Typography>
              <Typography variant="h5" fontWeight={700}>{fmtEur(pipeline.value)}</Typography>
              <Typography variant="caption" sx={{ color: '#D32F2F', fontSize: '0.6rem', fontWeight: 600 }}>⚠ Proxy: ALL open quotes (incl. stale 2023). No expiry date — real value much lower.</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card sx={{ bgcolor: '#F3E5F5' }}>
            <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Typography variant="subtitle2">Conversion Rate</Typography>
              <Typography variant="h5" fontWeight={700}>{filtered.length > 0 ? fmtPct(funnel[2]?.pct || 0) : '—'}</Typography>
              <Typography variant="caption" sx={{ color: '#2E7D32', fontSize: '0.6rem' }}>✅ Verified: Quotation.xlsx</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* Conversion by Year */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontSize: '0.9rem' }} gutterBottom>Conversion Rate by Year</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={convByYear}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="year" fontSize={12} />
                  <YAxis tickFormatter={(v: number) => `${v}%`} fontSize={12} />
                  <Tooltip formatter={(v: any) => `${v.toFixed(1)}%`} />
                  <Bar dataKey="rate" name="Conversion %" fill="#1565C0" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Conversion by Product */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontSize: '0.9rem' }} gutterBottom>Conversion Rate by Product</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={convByProduct} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis type="number" tickFormatter={(v: number) => `${v}%`} fontSize={12} />
                  <YAxis type="category" dataKey="product" width={80} fontSize={12} />
                  <Tooltip formatter={(v: any) => `${v.toFixed(1)}%`} />
                  <Bar dataKey="rate" name="Conversion %" radius={[0, 6, 6, 0]}>
                    {convByProduct.map((e, i) => <Cell key={i} fill={e.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Deal Size vs Conversion */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontSize: '0.9rem' }} gutterBottom>Deal Size vs Conversion Rate</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dealSizeScatter}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="bucket" fontSize={11} />
                  <YAxis tickFormatter={(v: number) => `${v}%`} fontSize={12} />
                  <Tooltip formatter={(v: any) => `${v.toFixed(1)}%`} />
                  <Bar dataKey="conversionRate" name="Conversion %" fill="#00897B" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Country conversion */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontSize: '0.9rem' }} gutterBottom>Top Quoting Countries (by count, with conversion rate)</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={convByCountry}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="country" fontSize={11} angle={-20} textAnchor="end" height={50} />
                  <YAxis yAxisId="left" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(v: number) => `${v}%`} fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="total" name="Quote Count" fill="#1565C0" radius={[6, 6, 0, 0]} />
                  <Bar yAxisId="right" dataKey="rate" name="Conversion %" fill="#2E7D32" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Data Grid */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ fontSize: '0.9rem' }} gutterBottom>Quotation Detail</Typography>
          <Typography variant="caption" sx={{ display: 'block', mb: 1, fontSize: '0.65rem', color: '#1565C0', fontStyle: 'italic' }}>
            ✅ Source: Quotation.xlsx — 1,337 quotes. ⚠ Customer names are free-text (no SAP ID). Country names not standardized. Quote-to-Order link based on "Order" flag only — no SAP order reference tracked.
          </Typography>
          <Box sx={{ height: 400 }}>
            <DataGrid
              rows={filtered.map((q, i) => ({ ...q, _id: i }))}
              columns={columns}
              getRowId={(row) => row._id}
              density="compact"
              pageSizeOptions={[25, 50, 100]}
              initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
              sx={{ fontSize: '0.8rem' }}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PipelineTab;
