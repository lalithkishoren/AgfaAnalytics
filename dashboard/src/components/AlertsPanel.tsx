import React from 'react';
import { Alert, AlertTitle, Stack } from '@mui/material';
import { KPIs } from '../types';

interface AlertsPanelProps {
  kpis: KPIs;
}

interface DashboardAlert {
  severity: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
}

function generateAlerts(kpis: KPIs): DashboardAlert[] {
  const alerts: DashboardAlert[] = [];

  if (kpis.budgetVariancePct < -50) {
    alerts.push({
      severity: 'error',
      title: 'Forecast Crisis',
      message: `FY2026 forecast is ${Math.abs(kpis.budgetVariancePct).toFixed(0)}% below budget (€${(kpis.fullYearForecast/1e6).toFixed(1)}M vs €${(kpis.budgetTotal/1e6).toFixed(1)}M budget)`,
    });
  }

  if (kpis.topCustomerConcentration.top5 > 70) {
    alerts.push({
      severity: 'error',
      title: 'Customer Concentration Risk',
      message: `Top 5 customers account for ${kpis.topCustomerConcentration.top5.toFixed(0)}% of revenue — loss of a major customer would be devastating`,
    });
  }

  if (kpis.grossMarginPct > 0 && kpis.grossMarginPct < 55) {
    alerts.push({
      severity: 'warning',
      title: 'Margin Compression',
      message: `Current gross margin ${kpis.grossMarginPct.toFixed(1)}% is below the FY2025 average of ~61% — investigate cost inflation or price erosion`,
    });
  }

  if (kpis.lyVariancePct < -50) {
    alerts.push({
      severity: 'warning',
      title: 'Revenue Decline',
      message: `Forecast is ${Math.abs(kpis.lyVariancePct).toFixed(0)}% below prior year — demand has significantly contracted`,
    });
  }

  if (kpis.openOrdersCount < 150) {
    alerts.push({
      severity: 'warning',
      title: 'Open Orders Below Historical',
      message: `Only ${kpis.openOrdersCount} open orders vs 212 in prior year — 45% fewer committed orders`,
    });
  }

  if (kpis.conversionRate > 20) {
    alerts.push({
      severity: 'success',
      title: 'Conversion Rate Improving',
      message: `Quote-to-order conversion at ${kpis.conversionRate.toFixed(1)}% — up from 8.8% in 2023`,
    });
  }

  return alerts;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ kpis }) => {
  const alerts = generateAlerts(kpis);

  if (alerts.length === 0) return null;

  return (
    <Stack spacing={1}>
      {alerts.map((alert, i) => (
        <Alert key={i} severity={alert.severity} variant="outlined" sx={{ py: 0.5 }}>
          <AlertTitle sx={{ fontSize: '0.85rem', mb: 0 }}>{alert.title}</AlertTitle>
          <span style={{ fontSize: '0.78rem' }}>{alert.message}</span>
        </Alert>
      ))}
    </Stack>
  );
};
