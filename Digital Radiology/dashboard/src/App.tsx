import React, { useCallback, useState } from 'react';
import {
  ThemeProvider, CssBaseline, Box, AppBar, Toolbar, Typography,
  Tabs, Tab, CircularProgress, Alert,
} from '@mui/material';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import theme from './theme';
import { useDataLoader } from './hooks/useDataLoader';
import { useFilters } from './hooks/useFilters';
import { FilterBar } from './components/FilterBar';
import { TAB_LABELS, NavigateAction } from './types';

import OverviewTab from './tabs/OverviewTab';
import CommercialTab from './tabs/CommercialTab';
import SalesOpsTab from './tabs/SalesOpsTab';
import OrderBookTab from './tabs/OrderBookTab';
import RecoTab from './tabs/RecoTab';
import MarginTab from './tabs/MarginTab';
import ChannelTab from './tabs/ChannelTab';
import DataOverviewTab from './tabs/DataOverviewTab';

function App() {
  const data = useDataLoader();
  const { filters, actions } = useFilters();
  const [activeTab, setActiveTab] = useState(0);

  const handleNavigate = useCallback((nav: NavigateAction) => {
    if (nav.filters) {
      actions.setMultiple(nav.filters);
    }
    setActiveTab(nav.tab);
  }, [actions]);

  if (data.loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" flexDirection="column" gap={2}>
          <CircularProgress size={48} />
          <Typography variant="h6" color="text.secondary">Loading Digital Radiology Dashboard...</Typography>
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
            <MonitorHeartIcon sx={{ mr: 1, color: '#90CAF9' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '0.02em' }}>
              AGFA Digital Radiology
            </Typography>
            <Typography variant="subtitle2" sx={{ ml: 1, color: 'rgba(255,255,255,0.7)', fontWeight: 400 }}>
              Commercial Analytics Dashboard
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              Week {data.kpis.currentWeek} | Data as of {data.kpis.lastRefreshed}
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

        {/* Filter Bar */}
        <Box sx={{ px: 2, pt: 2 }}>
          {activeTab !== 3 && activeTab !== 4 && (
            <FilterBar filters={filters} actions={actions} />
          )}
        </Box>

        {/* Tab Content */}
        <Box sx={{ px: 2, pb: 3, flexGrow: 1 }}>
          {activeTab === 0 && <OverviewTab data={data} filters={filters} onNavigate={handleNavigate} />}
          {activeTab === 1 && <CommercialTab data={data} filters={filters} onNavigate={handleNavigate} />}
          {activeTab === 2 && <SalesOpsTab data={data} filters={filters} onNavigate={handleNavigate} />}
          {activeTab === 3 && <OrderBookTab data={data} filters={filters} onNavigate={handleNavigate} />}
          {activeTab === 4 && <RecoTab data={data} filters={filters} onNavigate={handleNavigate} />}
          {activeTab === 5 && <MarginTab data={data} filters={filters} onNavigate={handleNavigate} />}
          {activeTab === 6 && <ChannelTab data={data} filters={filters} onNavigate={handleNavigate} />}
          {activeTab === 7 && <DataOverviewTab />}
        </Box>

        {/* Footer */}
        <Box sx={{ px: 2, py: 1, bgcolor: 'white', borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">
            Digital Radiology Analytics — Agfa Healthcare
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {data.kpis.openPipelineCount} open opps | {data.kpis.wonDeals2026} won 2026 | {data.kpis.sapOrderCount} SAP orders
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
