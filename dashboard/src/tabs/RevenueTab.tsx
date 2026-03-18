import React, { useMemo } from 'react';
import { Grid, Typography, Card, CardContent, Box, Chip } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, Line } from 'recharts';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { DashboardData, GlobalFilters, NavigateAction } from '../types';
import { fmtEur, fmtNum } from '../utils/formatters';
import { PRODUCT_COLORS, CHART_COLORS } from '../theme';
import { DataConfidenceLegend } from '../components/DataConfidenceLegend';

interface Props {
  data: DashboardData;
  filters: GlobalFilters;
  onNavigate?: (nav: NavigateAction) => void;
}

const RevenueTab: React.FC<Props> = ({ data, filters, onNavigate }) => {
  const { orders } = data;

  // Filtered orders (EUR, completed)
  const eurOrders = useMemo(() => {
    return orders.filter(o => {
      if (o.currency !== 'EUR') return false;
      if (filters.product !== 'all' && o.product !== filters.product) return false;
      if (filters.region !== 'all' && o.region !== filters.region) return false;
      if (filters.customer !== 'all' && o.customer !== filters.customer) return false;
      return true;
    });
  }, [orders, filters]);

  // Revenue by year
  const revenueByYear = useMemo(() => {
    const byYear: Record<number, number> = {};
    eurOrders.filter(o => o.status === 2).forEach(o => {
      byYear[o.year] = (byYear[o.year] || 0) + o.amount;
    });
    const years = Object.keys(byYear).map(Number).sort();
    return years.map((y, i) => ({
      year: String(y),
      revenue: byYear[y],
      priorYear: i > 0 ? byYear[years[i - 1]] : 0,
      growth: i > 0 ? ((byYear[y] - byYear[years[i - 1]]) / byYear[years[i - 1]]) * 100 : 0,
    }));
  }, [eurOrders]);

  // Revenue by product over time (stacked)
  const productMix = useMemo(() => {
    const data: Record<string, Record<string, number>> = {};
    eurOrders.filter(o => o.status === 2).forEach(o => {
      const key = String(o.year);
      if (!data[key]) data[key] = {};
      data[key][o.product] = (data[key][o.product] || 0) + o.amount;
    });
    return Object.entries(data)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([year, products]) => ({ year, ...products }));
  }, [eurOrders]);

  // Revenue by country (top 10)
  const revenueByCountry = useMemo(() => {
    const byCountry: Record<string, number> = {};
    eurOrders.filter(o => o.status === 2).forEach(o => {
      byCountry[o.country || 'Unknown'] = (byCountry[o.country || 'Unknown'] || 0) + o.amount;
    });
    const total = Object.values(byCountry).reduce((s, v) => s + v, 0);
    return Object.entries(byCountry)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([country, revenue]) => ({
        country: country.length > 18 ? country.slice(0, 16) + '...' : country,
        revenue,
        share: total > 0 ? (revenue / total) * 100 : 0,
      }));
  }, [eurOrders]);

  // Customer Pareto
  const customerPareto = useMemo(() => {
    const byCustomer: Record<string, number> = {};
    eurOrders.filter(o => o.status === 2).forEach(o => {
      byCustomer[o.customer] = (byCustomer[o.customer] || 0) + o.amount;
    });
    const sorted = Object.entries(byCustomer).sort((a, b) => b[1] - a[1]);
    const total = sorted.reduce((s, [, v]) => s + v, 0);
    let cumulative = 0;
    return sorted.slice(0, 15).map(([customer, revenue]) => {
      cumulative += revenue;
      return {
        customer: customer.length > 20 ? customer.slice(0, 18) + '...' : customer,
        revenue,
        cumPct: total > 0 ? (cumulative / total) * 100 : 0,
      };
    });
  }, [eurOrders]);

  // Order DataGrid
  const columns: GridColDef[] = [
    { field: 'orderId', headerName: 'Order ID', width: 130 },
    { field: 'date', headerName: 'Date', width: 100 },
    { field: 'customer', headerName: 'Customer', width: 180 },
    { field: 'country', headerName: 'Country', width: 110 },
    { field: 'product', headerName: 'Product', width: 100 },
    { field: 'sqm', headerName: 'm²', width: 90, type: 'number', valueFormatter: (params: any) => fmtNum(params) },
    { field: 'eurPerM2', headerName: '€/m²', width: 80, type: 'number', valueFormatter: (params: any) => `€${fmtNum(params, 0)}` },
    { field: 'amount', headerName: 'Amount', width: 120, type: 'number', valueFormatter: (params: any) => fmtEur(params, false) },
    { field: 'currency', headerName: 'Cur', width: 60 },
    {
      field: 'status', headerName: 'Status', width: 100,
      renderCell: (params: any) => (
        <Chip
          label={params.value === 2 ? 'Complete' : 'Open'}
          size="small"
          color={params.value === 2 ? 'success' : 'warning'}
          variant="outlined"
          sx={{ fontSize: '0.7rem' }}
        />
      ),
    },
    { field: 'year', headerName: 'Year', width: 65 },
  ];

  return (
    <Box>
      <DataConfidenceLegend />
      <Typography variant="caption" sx={{ display: 'block', mb: 1.5, fontSize: '0.65rem', color: '#1565C0', fontStyle: 'italic', bgcolor: '#E3F2FD', px: 1, py: 0.5, borderRadius: 0.5 }}>
        ✅ Data source: Sales Zirfon GHS.xlsx — EUR orders with Status=2 (completed). ⚠ Customer names not consolidated (e.g., Sunfire appears as 3 entities). 2026 is partial year (Jan–Mar only).
      </Typography>
      {/* Revenue by Year */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6" sx={{ fontSize: '0.9rem' }}>Revenue by Year (EUR)</Typography>
              </Box>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={revenueByYear}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="year" fontSize={12} />
                  <YAxis tickFormatter={(v: number) => `€${(v / 1e6).toFixed(0)}M`} fontSize={12} />
                  <Tooltip formatter={(v: any) => fmtEur(v)} />
                  <Bar dataKey="revenue" name="Revenue" fill="#1565C0" radius={[6, 6, 0, 0]}>
                    {revenueByYear.map((e, i) => (
                      <Cell key={i} fill={e.growth < 0 ? '#EF5350' : '#1565C0'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Product Mix */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontSize: '0.9rem' }} gutterBottom>Product Mix Over Time</Typography>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={productMix}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="year" fontSize={12} />
                  <YAxis tickFormatter={(v: number) => `€${(v / 1e6).toFixed(0)}M`} fontSize={12} />
                  <Tooltip formatter={(v: any) => fmtEur(v)} />
                  <Legend />
                  {['UTP500', 'UTP220', 'UTP500+', 'UTP500A'].map(p => (
                    <Bar key={p} dataKey={p} stackId="a" fill={PRODUCT_COLORS[p] || CHART_COLORS.neutral} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Country + Pareto */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontSize: '0.9rem' }} gutterBottom>Revenue by Country (Top 10, EUR)</Typography>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={revenueByCountry} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis type="number" tickFormatter={(v: number) => fmtEur(v)} fontSize={11} />
                  <YAxis type="category" dataKey="country" width={110} fontSize={11} />
                  <Tooltip formatter={(v: any) => fmtEur(v)} />
                  <Bar dataKey="revenue" name="Revenue" fill="#1565C0" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontSize: '0.9rem' }} gutterBottom>Customer Pareto (80/20 Rule)</Typography>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={customerPareto}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="customer" fontSize={10} angle={-30} textAnchor="end" height={70} />
                  <YAxis yAxisId="left" tickFormatter={(v: number) => fmtEur(v)} fontSize={11} />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(v: number) => `${v}%`} fontSize={11} domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#1565C0" radius={[4, 4, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="cumPct" name="Cumulative %" stroke="#D32F2F" strokeWidth={2} dot={false} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Data Grid */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ fontSize: '0.9rem' }} gutterBottom>Order Detail (EUR Orders)</Typography>
          <Box sx={{ height: 400 }}>
            <DataGrid
              rows={eurOrders.map((o, i) => ({ ...o, _id: i }))}
              columns={columns}
              getRowId={(row) => row._id}
              density="compact"
              pageSizeOptions={[25, 50, 100]}
              initialState={{
                pagination: { paginationModel: { pageSize: 25 } },
                sorting: { sortModel: [{ field: 'amount', sort: 'desc' }] },
              }}
              sx={{ fontSize: '0.8rem' }}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RevenueTab;
