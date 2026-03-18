import React, { useMemo } from 'react';
import { Grid, Typography, Card, CardContent, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, LineChart, Line, ComposedChart } from 'recharts';
import { KpiCard } from '../components/KpiCard';
import { DataConfidenceLegend } from '../components/DataConfidenceLegend';
import { DashboardData, GlobalFilters, NavigateAction } from '../types';
import { fmtEur, fmtPct } from '../utils/formatters';
import { PRODUCT_COLORS, CHART_COLORS } from '../theme';

interface Props {
  data: DashboardData;
  filters: GlobalFilters;
  onNavigate?: (nav: NavigateAction) => void;
}

const MarginTab: React.FC<Props> = ({ data, filters, onNavigate }) => {
  const { marginData, orders } = data;

  // Filtered margin data
  const filtered = useMemo(() => {
    return marginData.filter(m => {
      if (filters.year !== 'all' && m.year !== filters.year) return false;
      if (filters.product !== 'all' && m.product !== filters.product) return false;
      return true;
    });
  }, [marginData, filters]);

  // KPIs from margin data
  const marginKpis = useMemo(() => {
    const totals = filtered.reduce((acc, m) => ({
      turnover: acc.turnover + m.turnover,
      stdCost: acc.stdCost + m.stdCost,
      grossMargin: acc.grossMargin + m.grossMargin,
    }), { turnover: 0, stdCost: 0, grossMargin: 0 });
    return {
      totalTurnover: totals.turnover,
      totalStdCost: totals.stdCost,
      totalGM: totals.grossMargin,
      gmPct: totals.turnover > 0 ? (totals.grossMargin / totals.turnover) * 100 : 0,
    };
  }, [filtered]);

  // Margin by product
  const marginByProduct = useMemo(() => {
    const byProd: Record<string, { turnover: number; stdCost: number; gm: number }> = {};
    filtered.forEach(m => {
      if (!byProd[m.product]) byProd[m.product] = { turnover: 0, stdCost: 0, gm: 0 };
      byProd[m.product].turnover += m.turnover;
      byProd[m.product].stdCost += m.stdCost;
      byProd[m.product].gm += m.grossMargin;
    });
    return Object.entries(byProd)
      .map(([product, d]) => ({
        product,
        turnover: d.turnover,
        stdCost: d.stdCost,
        grossMargin: d.gm,
        gmPct: d.turnover > 0 ? (d.gm / d.turnover) * 100 : 0,
        fill: PRODUCT_COLORS[product] || CHART_COLORS.neutral,
      }))
      .sort((a, b) => b.gmPct - a.gmPct);
  }, [filtered]);

  // Monthly margin trend
  const monthlyTrend = useMemo(() => {
    const byKey: Record<string, { turnover: number; stdCost: number; gm: number }> = {};
    filtered.forEach(m => {
      const key = `${m.year}-${String(m.monthNum).padStart(2, '0')}`;
      if (!byKey[key]) byKey[key] = { turnover: 0, stdCost: 0, gm: 0 };
      byKey[key].turnover += m.turnover;
      byKey[key].stdCost += m.stdCost;
      byKey[key].gm += m.grossMargin;
    });
    return Object.entries(byKey)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, d]) => ({
        period: key,
        turnover: d.turnover,
        stdCost: d.stdCost,
        grossMargin: d.gm,
        gmPct: d.turnover > 0 ? (d.gm / d.turnover) * 100 : 0,
      }));
  }, [filtered]);

  // GM% by product over time
  const productGmTrend = useMemo(() => {
    const byKeyProd: Record<string, Record<string, { to: number; gm: number }>> = {};
    marginData.forEach(m => {
      const key = `${m.year}-${String(m.monthNum).padStart(2, '0')}`;
      if (!byKeyProd[key]) byKeyProd[key] = {};
      if (!byKeyProd[key][m.product]) byKeyProd[key][m.product] = { to: 0, gm: 0 };
      byKeyProd[key][m.product].to += m.turnover;
      byKeyProd[key][m.product].gm += m.grossMargin;
    });
    return Object.entries(byKeyProd)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([period, products]) => {
        const row: Record<string, any> = { period };
        Object.entries(products).forEach(([prod, d]) => {
          row[prod] = d.to > 0 ? (d.gm / d.to) * 100 : 0;
        });
        return row;
      });
  }, [marginData]);

  // Pricing trend (EUR/m²) from orders
  const pricingTrend = useMemo(() => {
    const byYearProd: Record<string, Record<string, { amount: number; sqm: number }>> = {};
    orders.filter(o => o.currency === 'EUR' && o.status === 2 && o.sqm > 0).forEach(o => {
      const key = String(o.year);
      if (!byYearProd[key]) byYearProd[key] = {};
      if (!byYearProd[key][o.product]) byYearProd[key][o.product] = { amount: 0, sqm: 0 };
      byYearProd[key][o.product].amount += o.amount;
      byYearProd[key][o.product].sqm += o.sqm;
    });
    return Object.entries(byYearProd)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([year, products]) => {
        const row: Record<string, any> = { year };
        Object.entries(products).forEach(([prod, d]) => {
          row[prod] = d.sqm > 0 ? d.amount / d.sqm : 0;
        });
        return row;
      });
  }, [orders]);

  // Standard cost prices
  const costPrices = [
    { product: 'UTP500', stdCost: 115.86, msp2026: 102.10 },
    { product: 'UTP220', stdCost: 95.47, msp2026: 111.07 },
    { product: 'UTP500+', stdCost: 115.86, msp2026: 115.86 },
  ];

  return (
    <Box>
      <DataConfidenceLegend />

      {/* KPI Row */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <KpiCard title="Gross Margin %" value={fmtPct(marginKpis.gmPct)} subtitle="Selected period" status={marginKpis.gmPct > 58 ? 'green' : marginKpis.gmPct > 50 ? 'amber' : 'red'}
            dataConfidence="derived" dataNote="Derived from SAP BI CO-PA extract (FY 2025.xls raw data). FY2022–2025 verified. FY2026 Q1 margin (51.4%) is approximate." />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <KpiCard title="Gross Margin" value={fmtEur(marginKpis.totalGM)} subtitle="Absolute" status="blue"
            dataConfidence="derived" dataNote="Net Turnover − Standard Cost Total from SAP BI raw data. Standard costs from Mapping Standard Costprices sheet." />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <KpiCard title="Revenue" value={fmtEur(marginKpis.totalTurnover)} subtitle="Net turnover (SAP BI)"
            dataConfidence="verified" dataNote="Source: FY 2025.xls — SAP BI CO-PA Net Turnover. Already converted to EUR within SAP." />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <KpiCard title="Standard Cost" value={fmtEur(marginKpis.totalStdCost)} subtitle="Total std cost"
            dataConfidence="derived" dataNote="Standard cost uses Mapping Standard Costprices: UTP500=€115.86/m², UTP220=€95.47/m². FY2026 MSP differs (UTP500=€102.10, UTP220=€111.07)." />
        </Grid>
      </Grid>

      {/* Margin by Product + Monthly Trend */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontSize: '0.9rem' }} gutterBottom>Gross Margin % by Product</Typography>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={marginByProduct}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="product" fontSize={12} />
                  <YAxis tickFormatter={(v: number) => `${v}%`} fontSize={12} domain={[0, 80]} />
                  <Tooltip formatter={(v: any) => `${v.toFixed(1)}%`} />
                  <Bar dataKey="gmPct" name="GM%" radius={[6, 6, 0, 0]}>
                    {marginByProduct.map((e, i) => <Cell key={i} fill={e.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontSize: '0.9rem' }} gutterBottom>Monthly Margin Trend</Typography>
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="period" fontSize={10} angle={-30} textAnchor="end" height={50} />
                  <YAxis yAxisId="left" tickFormatter={(v: number) => fmtEur(v)} fontSize={11} />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(v: number) => `${v}%`} fontSize={11} domain={[0, 80]} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="turnover" name="Revenue" fill="#E3F2FD" />
                  <Bar yAxisId="left" dataKey="grossMargin" name="Gross Margin" fill="#1565C0" />
                  <Line yAxisId="right" type="monotone" dataKey="gmPct" name="GM%" stroke="#D32F2F" strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* GM% by product over time + Pricing */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontSize: '0.9rem' }} gutterBottom>GM% by Product Over Time</Typography>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={productGmTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="period" fontSize={10} angle={-30} textAnchor="end" height={50} />
                  <YAxis tickFormatter={(v: number) => `${v}%`} fontSize={11} domain={[0, 100]} />
                  <Tooltip formatter={(v: any) => `${(v as number).toFixed(1)}%`} />
                  <Legend />
                  {['UTP500', 'UTP220', 'UTP500+'].map(p => (
                    <Line key={p} type="monotone" dataKey={p} stroke={PRODUCT_COLORS[p]} strokeWidth={2} dot={false} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontSize: '0.9rem' }} gutterBottom>Average Selling Price (€/m²) by Year</Typography>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={pricingTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="year" fontSize={12} />
                  <YAxis tickFormatter={(v: number) => `€${v.toFixed(0)}`} fontSize={12} />
                  <Tooltip formatter={(v: any) => `€${(v as number).toFixed(0)}/m²`} />
                  <Legend />
                  {['UTP500', 'UTP220', 'UTP500+'].map(p => (
                    <Bar key={p} dataKey={p} fill={PRODUCT_COLORS[p]} radius={[4, 4, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Cost Price Reference */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ fontSize: '0.9rem' }} gutterBottom>Standard Cost Price Reference (€/m²)</Typography>
          <Typography variant="caption" sx={{ display: 'block', mb: 1.5, fontSize: '0.65rem', color: '#E65100', fontStyle: 'italic', bgcolor: '#FFF8E1', px: 1, py: 0.5, borderRadius: 0.5 }}>
            ⚠ FY2025 Std Cost from Mapping Standard Costprices sheet. FY2026 MSP (Manufacturing Standard Price) from Revenue Overview — note the change: UTP220 cost INCREASED (€95→€111), UTP500 DECREASED (€116→€102). These affect margin calculations significantly.
          </Typography>
          <Grid container spacing={3}>
            {costPrices.map(cp => (
              <Grid size={{ xs: 12, md: 4 }} key={cp.product}>
                <Box sx={{ p: 2, bgcolor: '#F5F7FA', borderRadius: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">{cp.product}</Typography>
                  <Box display="flex" justifyContent="space-between" mt={1}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">FY2025 Std Cost</Typography>
                      <Typography variant="h6" sx={{ color: PRODUCT_COLORS[cp.product] }}>€{cp.stdCost}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">FY2026 MSP</Typography>
                      <Typography variant="h6" sx={{ color: cp.msp2026 > cp.stdCost ? '#D32F2F' : '#2E7D32' }}>€{cp.msp2026}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MarginTab;
