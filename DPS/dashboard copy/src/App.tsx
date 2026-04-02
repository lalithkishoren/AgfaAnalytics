import React, { useState } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Tabs,
  Tab,
} from '@mui/material';
import { theme } from './theme';
import { GlobalFilters, TAB_LABELS } from './types';
import { FilterBar } from './components/FilterBar';
import { DataOverviewTab } from './tabs/DataOverviewTab';
import { ExecutiveSummaryTab } from './tabs/ExecutiveSummaryTab';
import { RevenueMarginTab } from './tabs/RevenueMarginTab';
import { OrderPipelineTab } from './tabs/OrderPipelineTab';
import { ProductMixTab } from './tabs/ProductMixTab';
import { GeographicTab } from './tabs/GeographicTab';
import { OrderExplorerTab } from './tabs/OrderExplorerTab';

const App: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [filters, setFilters] = useState<GlobalFilters>({
    year: 'All',
    bu: 'All',
    budgetClass: 'All',
    region: 'All',
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* AppBar */}
        <AppBar position="static" sx={{ bgcolor: '#0D47A1', boxShadow: 2 }}>
          <Toolbar sx={{ minHeight: '52px !important' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: '#64B5F6',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  color: '#0D47A1',
                  flexShrink: 0,
                }}
              >
                DPS
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.5, lineHeight: 1.2 }}>
                  DPS Analytics Dashboard
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7, lineHeight: 1 }}>
                  Digital Printing Solutions · FY2025 · Data as of Feb 2026
                </Typography>
              </Box>
            </Box>
          </Toolbar>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              bgcolor: '#0D47A1',
              minHeight: 40,
              '& .MuiTab-root': {
                color: 'rgba(255,255,255,0.65)',
                fontSize: '0.78rem',
                minHeight: 40,
                py: 0.5,
                px: 1.5,
                textTransform: 'none',
              },
              '& .Mui-selected': {
                color: '#fff !important',
                fontWeight: 600,
              },
              '& .MuiTabs-indicator': {
                bgcolor: '#64B5F6',
                height: 3,
              },
            }}
          >
            {TAB_LABELS.map((label, i) => (
              <Tab key={i} label={label} />
            ))}
          </Tabs>
        </AppBar>

        {/* FilterBar — not shown on Data Overview tab */}
        {tab !== 0 && (
          <FilterBar filters={filters} onChange={setFilters} />
        )}

        {/* Tab Content */}
        <Box sx={{ flex: 1, p: 3, overflowX: 'hidden' }}>
          {tab === 0 && <DataOverviewTab />}
          {tab === 1 && <ExecutiveSummaryTab filters={filters} />}
          {tab === 2 && <RevenueMarginTab filters={filters} />}
          {tab === 3 && <OrderPipelineTab filters={filters} />}
          {tab === 4 && <ProductMixTab filters={filters} />}
          {tab === 5 && <GeographicTab filters={filters} />}
          {tab === 6 && <OrderExplorerTab filters={filters} />}
        </Box>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            p: 2,
            textAlign: 'center',
            borderTop: '1px solid #e0e0e0',
            bgcolor: '#FAFAFA',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            DPS Analytics &nbsp;·&nbsp; Data sourced from AGFA Excel reports (SAP BW / CO-PA / Manual) &nbsp;·&nbsp;
            Built with Digital Hydrogen standards &nbsp;·&nbsp; Last updated: Mar 2026 &nbsp;·&nbsp;
            <Box component="span" sx={{ color: '#D32F2F', fontWeight: 600 }}>
              All data is a snapshot — not real-time
            </Box>
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
