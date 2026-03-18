import React, { useCallback, useMemo, useState } from 'react';
import { ThemeProvider, CssBaseline, Box, AppBar, Toolbar, Typography, Tabs, Tab, CircularProgress, Alert } from '@mui/material';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import theme from './theme';
import { useDataLoader } from './hooks/useDataLoader';
import { useFilters } from './hooks/useFilters';
import { FilterBar } from './components/FilterBar';
import { TAB_LABELS, NavigateAction } from './types';
import DataOverviewTab from './tabs/DataOverviewTab';
import OverviewTab from './tabs/OverviewTab';
import PipelineTab from './tabs/PipelineTab';
import RevenueTab from './tabs/RevenueTab';
import MarginTab from './tabs/MarginTab';
import ForecastTab from './tabs/ForecastTab';
import CustomerTab from './tabs/CustomerTab';

function App() {
  const data = useDataLoader();
  const { filters, actions } = useFilters();
  const [activeTab, setActiveTab] = useState(0);

  // Drill-down navigation: switch tab + optionally apply filters
  const handleNavigate = useCallback((nav: NavigateAction) => {
    if (nav.filters) {
      actions.setMultiple(nav.filters);
    }
    setActiveTab(nav.tab);
  }, [actions]);

  // Extract unique filter values from data
  const filterOptions = useMemo(() => {
    const years = new Set<number>();
    const products = new Set<string>();
    const regions = new Set<string>();
    const customers = new Set<string>();

    data.orders.forEach(o => {
      if (o.year) years.add(o.year);
      if (o.product) products.add(o.product);
      if (o.region) regions.add(o.region);
      if (o.customer) customers.add(o.customer);
    });
    data.quotations.forEach(q => {
      if (q.year) years.add(q.year);
      if (q.product) products.add(q.product);
      if (q.region) regions.add(q.region);
    });

    return {
      years: Array.from(years).sort().reverse(),
      products: Array.from(products).sort(),
      regions: Array.from(regions).filter(Boolean).sort(),
      customers: Array.from(customers).sort(),
    };
  }, [data.orders, data.quotations]);

  if (data.loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" flexDirection="column" gap={2}>
          <CircularProgress size={48} />
          <Typography variant="h6" color="text.secondary">Loading Digital Hydrogen Dashboard...</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  if (data.error) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box p={4}>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="h6">Failed to load data</Typography>
            <Typography variant="body2">{data.error}</Typography>
          </Alert>
          <Typography variant="body2" color="text.secondary">
            Make sure the data JSON files exist in <code>public/data/</code>. Run <code>python process_data.py</code> to generate them.
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* App Bar */}
        <AppBar position="static" elevation={0} sx={{ bgcolor: '#0D47A1' }}>
          <Toolbar variant="dense">
            <WaterDropIcon sx={{ mr: 1, color: '#4DB6AC' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '0.02em' }}>
              AGFA Digital Hydrogen
            </Typography>
            <Typography variant="subtitle2" sx={{ ml: 1, color: 'rgba(255,255,255,0.7)', fontWeight: 400 }}>
              Zirfon Business Intelligence
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              Data as of Mar 2026
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Tab Navigation */}
        <Box sx={{ bgcolor: 'white', borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': { py: 1.5 },
              '& .Mui-selected': { fontWeight: 600 },
            }}
          >
            {TAB_LABELS.map((label, i) => (
              <Tab key={i} label={label} />
            ))}
          </Tabs>
        </Box>

        {/* Filter Bar (shown on all tabs except DataOverview) */}
        <Box sx={{ px: 2, pt: 2 }}>
          {activeTab !== 0 && (
            <FilterBar
              filters={filters}
              actions={actions}
              years={filterOptions.years}
              products={filterOptions.products}
              regions={filterOptions.regions}
              customers={filterOptions.customers}
            />
          )}
        </Box>

        {/* Tab Content */}
        <Box sx={{ px: 2, pb: 3, flexGrow: 1 }}>
          {activeTab === 0 && <DataOverviewTab data={data} />}
          {activeTab === 1 && <OverviewTab data={data} filters={filters} onNavigate={handleNavigate} />}
          {activeTab === 2 && <PipelineTab data={data} filters={filters} onNavigate={handleNavigate} />}
          {activeTab === 3 && <RevenueTab data={data} filters={filters} onNavigate={handleNavigate} />}
          {activeTab === 4 && <MarginTab data={data} filters={filters} onNavigate={handleNavigate} />}
          {activeTab === 5 && <ForecastTab data={data} filters={filters} onNavigate={handleNavigate} />}
          {activeTab === 6 && <CustomerTab data={data} filters={filters} onNavigate={handleNavigate} />}
        </Box>

        {/* Footer */}
        <Box sx={{ px: 2, py: 1, bgcolor: 'white', borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">
            Digital Hydrogen Analytics — Agfa Zirfon Membrane Business
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {data.orders.length} orders | {data.quotations.length} quotations | {data.customers.length} customers
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
