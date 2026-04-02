import React, { useMemo } from 'react';
import { Grid, Typography, Card, CardContent, Box, Autocomplete, TextField, Chip } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { KpiCard } from '../components/KpiCard';
import { DataConfidenceLegend } from '../components/DataConfidenceLegend';
import { DashboardData, GlobalFilters, NavigateAction } from '../types';
import { fmtEur, fmtPct, fmtNum } from '../utils/formatters';
import { PRODUCT_COLORS, CHART_COLORS } from '../theme';

interface Props {
  data: DashboardData;
  filters: GlobalFilters;
  onNavigate: (nav: NavigateAction) => void;
}


const CustomerTab: React.FC<Props> = ({ data, filters, onNavigate }) => {
  const { orders, quotations, customers } = data;
  const selectedCustomer = filters.customer !== 'all' ? filters.customer : null;

  // Unique customer names from orders
  const customerNames = useMemo(() => {
    const names = new Set<string>();
    orders.forEach(o => { if (o.customer) names.add(o.customer); });
    quotations.forEach(q => { if (q.customer) names.add(q.customer); });
    return Array.from(names).sort();
  }, [orders, quotations]);

  // Filtered data for selected customer
  const custOrders = useMemo(() => {
    if (!selectedCustomer) return [];
    return orders.filter(o => o.customer === selectedCustomer);
  }, [orders, selectedCustomer]);

  const custQuotations = useMemo(() => {
    if (!selectedCustomer) return [];
    return quotations.filter(q => q.customer === selectedCustomer);
  }, [quotations, selectedCustomer]);

  // Customer KPIs
  const custKpis = useMemo(() => {
    const eurOrders = custOrders.filter(o => o.currency === 'EUR');
    const completed = eurOrders.filter(o => o.status === 2);
    const open = eurOrders.filter(o => o.status === 1);
    const totalRevenue = completed.reduce((s, o) => s + o.amount, 0);
    const openValue = open.reduce((s, o) => s + o.amount, 0);
    const totalQuotes = custQuotations.length;
    const convertedQuotes = custQuotations.filter(q => q.isOrdered).length;
    const custMaster = customers.find(c =>
      c.customerName?.toLowerCase() === selectedCustomer?.toLowerCase() ||
      c.customerGroup?.toLowerCase() === selectedCustomer?.toLowerCase()
    );

    return {
      totalRevenue,
      orderCount: completed.length,
      openOrders: open.length,
      openValue,
      totalQuotes,
      convertedQuotes,
      conversionRate: totalQuotes > 0 ? (convertedQuotes / totalQuotes) * 100 : 0,
      country: custOrders[0]?.country || custQuotations[0]?.country || '—',
      paymentTerms: custMaster?.paymentTerms || '—',
    };
  }, [custOrders, custQuotations, customers, selectedCustomer]);

  // Revenue by year
  const revenueByYear = useMemo(() => {
    const byYear: Record<number, number> = {};
    custOrders.filter(o => o.currency === 'EUR' && o.status === 2).forEach(o => {
      byYear[o.year] = (byYear[o.year] || 0) + o.amount;
    });
    return Object.entries(byYear)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([year, revenue]) => ({ year, revenue }));
  }, [custOrders]);

  // Product mix (pie)
  const productMix = useMemo(() => {
    const byProd: Record<string, number> = {};
    custOrders.filter(o => o.currency === 'EUR' && o.status === 2).forEach(o => {
      byProd[o.product] = (byProd[o.product] || 0) + o.amount;
    });
    return Object.entries(byProd)
      .sort((a, b) => b[1] - a[1])
      .map(([product, value]) => ({
        name: product,
        value,
        fill: PRODUCT_COLORS[product] || CHART_COLORS.neutral,
      }));
  }, [custOrders]);

  // Order detail columns
  const orderColumns: GridColDef[] = [
    { field: 'orderId', headerName: 'Order ID', width: 130 },
    { field: 'date', headerName: 'Date', width: 100 },
    { field: 'product', headerName: 'Product', width: 100 },
    { field: 'sqm', headerName: 'm²', width: 90, type: 'number', valueFormatter: (params: any) => fmtNum(params) },
    { field: 'amount', headerName: 'Amount', width: 120, type: 'number', valueFormatter: (params: any) => fmtEur(params, false) },
    { field: 'currency', headerName: 'Cur', width: 60 },
    {
      field: 'status', headerName: 'Status', width: 100,
      renderCell: (params: any) => (
        <Chip label={params.value === 2 ? 'Complete' : 'Open'} size="small"
          color={params.value === 2 ? 'success' : 'warning'} variant="outlined" sx={{ fontSize: '0.7rem' }} />
      ),
    },
    { field: 'invoiceNum', headerName: 'Invoice', width: 110 },
    { field: 'year', headerName: 'Year', width: 65 },
  ];

  // Quote columns
  const quoteColumns: GridColDef[] = [
    { field: 'id', headerName: 'Quote #', width: 130 },
    { field: 'sentDate', headerName: 'Sent', width: 100 },
    { field: 'product', headerName: 'Product', width: 100 },
    { field: 'totalSqm', headerName: 'm²', width: 90, type: 'number' },
    { field: 'totalAmount', headerName: 'Amount', width: 120, type: 'number', valueFormatter: (params: any) => fmtEur(params, false) },
    {
      field: 'isOrdered', headerName: 'Status', width: 100,
      renderCell: (params: any) => (
        <Chip label={params.value ? 'Won' : 'Open'} size="small"
          color={params.value ? 'success' : 'default'} variant="outlined" sx={{ fontSize: '0.7rem' }} />
      ),
    },
    { field: 'year', headerName: 'Year', width: 65 },
  ];

  return (
    <Box>
      <DataConfidenceLegend />
      <Typography variant="caption" sx={{ display: 'block', mb: 1.5, fontSize: '0.65rem', color: '#E65100', fontStyle: 'italic', bgcolor: '#FFF8E1', px: 1, py: 0.5, borderRadius: 0.5 }}>
        ⚠ Customer names are free-text and NOT consolidated. "Sunfire GmbH", "Sunfire SE", "Sunfire Switzerland" appear as separate customers.
        Customer Master join is by name only (no shared SAP ID with Quotation file). Payment terms from Customer Master (91 of 304 missing).
      </Typography>
      {/* Customer Selector */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
          <Autocomplete
            options={customerNames}
            value={selectedCustomer}
            onChange={(_, v) => onNavigate({ tab: 6, filters: { customer: v || 'all' } })}
            renderInput={(params) => (
              <TextField {...params} label="Search Customer" placeholder="Type customer name..." variant="outlined" size="small" />
            )}
            sx={{ maxWidth: 500 }}
          />
        </CardContent>
      </Card>

      {!selectedCustomer ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">Select a customer above to see their 360° view</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {customerNames.length} customers available — includes order and quotation customers
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Customer KPIs */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 6, md: 3 }}>
              <KpiCard title="Lifetime Revenue" value={fmtEur(custKpis.totalRevenue)} subtitle={`${custKpis.orderCount} completed orders`} status="blue"
                dataConfidence="verified" dataNote="EUR orders with Status=2 from Sales Zirfon GHS" />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <KpiCard title="Open Orders" value={fmtEur(custKpis.openValue)} subtitle={`${custKpis.openOrders} pending orders`} status={custKpis.openOrders > 0 ? 'green' : 'amber'}
                dataConfidence="derived" dataNote="Status=1 orders, all years. Some older open orders may be stale." />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <KpiCard title="Quotations" value={String(custKpis.totalQuotes)} subtitle={`${custKpis.convertedQuotes} converted (${fmtPct(custKpis.conversionRate)})`} status="blue"
                dataConfidence="derived" dataNote="Matched by exact customer name. Fuzzy name variants (e.g., 'McPhy' vs 'McPhy Energy') counted separately." />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <KpiCard title="Details" value={custKpis.country} subtitle={`Payment: ${custKpis.paymentTerms}`}
                dataConfidence={custKpis.paymentTerms === '—' ? 'proxy' : 'derived'} dataNote={custKpis.paymentTerms === '—' ? 'No match found in Customer Master (91 of 304 have no payment terms)' : 'From Customer Master — payment terms not standardized'} />
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={7}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontSize: '0.9rem' }} gutterBottom>Revenue by Year</Typography>
                  {revenueByYear.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={revenueByYear}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis dataKey="year" fontSize={12} />
                        <YAxis tickFormatter={(v: number) => fmtEur(v)} fontSize={11} />
                        <Tooltip formatter={(v: any) => fmtEur(v)} />
                        <Bar dataKey="revenue" fill="#1565C0" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>No EUR order data for this customer</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontSize: '0.9rem' }} gutterBottom>Product Mix</Typography>
                  {productMix.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie data={productMix} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                          {productMix.map((e, i) => <Cell key={i} fill={e.fill} />)}
                        </Pie>
                        <Tooltip formatter={(v: any) => fmtEur(v)} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>No product data</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Order History */}
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontSize: '0.9rem' }} gutterBottom>Order History</Typography>
              <Box sx={{ height: 300 }}>
                <DataGrid
                  rows={custOrders.map((o, i) => ({ ...o, _id: i }))}
                  columns={orderColumns}
                  getRowId={(row) => row._id}
                  density="compact"
                  pageSizeOptions={[10, 25]}
                  initialState={{ pagination: { paginationModel: { pageSize: 10 } }, sorting: { sortModel: [{ field: 'date', sort: 'desc' }] } }}
                  sx={{ fontSize: '0.8rem' }}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Quotation History */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontSize: '0.9rem' }} gutterBottom>Quotation History</Typography>
              <Box sx={{ height: 300 }}>
                <DataGrid
                  rows={custQuotations.map((q, i) => ({ ...q, _id: i }))}
                  columns={quoteColumns}
                  getRowId={(row) => row._id}
                  density="compact"
                  pageSizeOptions={[10, 25]}
                  initialState={{ pagination: { paginationModel: { pageSize: 10 } }, sorting: { sortModel: [{ field: 'sentDate', sort: 'desc' }] } }}
                  sx={{ fontSize: '0.8rem' }}
                />
              </Box>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};

export default CustomerTab;
