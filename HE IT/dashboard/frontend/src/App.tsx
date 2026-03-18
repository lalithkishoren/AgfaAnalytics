import React, { useState } from 'react';
import { Box, Tabs, Tab, useMediaQuery, useTheme } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ListAltIcon from '@mui/icons-material/ListAlt';
import Header from './components/Header';
import GlobalFilters from './components/GlobalFilters';
import { FilterProvider } from './context/FilterContext';
import ExecutiveOverview from './tabs/ExecutiveOverview';
import OrderIntake from './tabs/OrderIntake';
import OrderBook from './tabs/OrderBook';
import TACO from './tabs/TACO';
import RevenueLifecycle from './tabs/RevenueLifecycle';
import BacklogProjects from './tabs/BacklogProjects';
import DataOverviewTab from './tabs/DataOverviewTab';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const TABS = [
  { label: 'Executive Overview', icon: <DashboardIcon fontSize="small" /> },
  { label: 'Order Intake', icon: <TrendingUpIcon fontSize="small" /> },
  { label: 'Order Book', icon: <AccountBalanceWalletIcon fontSize="small" /> },
  { label: 'TACO', icon: <BarChartIcon fontSize="small" /> },
  { label: 'Revenue Lifecycle', icon: <AccountTreeIcon fontSize="small" /> },
  { label: 'Backlog & Projects', icon: <ListAltIcon fontSize="small" /> },
  { label: 'Project Overview', icon: <InfoOutlinedIcon fontSize="small" /> },
];

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && children}
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <FilterProvider>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#F0F2F5' }}>
        {/* App header */}
        <Header />

        {/* Global filters */}
        <GlobalFilters />

        {/* Navigation tabs */}
        <Box
          sx={{
            bgcolor: '#ffffff',
            borderBottom: '1px solid #E0E3E7',
            px: { xs: 0, md: 2 },
            position: 'sticky',
            top: 64,
            zIndex: 100,
            boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            variant={isMobile ? 'scrollable' : 'scrollable'}
            scrollButtons="auto"
            allowScrollButtonsMobile
            TabIndicatorProps={{
              style: { backgroundColor: '#003C7E', height: 3, borderRadius: '3px 3px 0 0' },
            }}
            sx={{
              minHeight: 46,
              '& .MuiTab-root': {
                minHeight: 46,
                textTransform: 'none',
                fontSize: { xs: '0.78rem', sm: '0.82rem' },
                fontWeight: 500,
                color: '#637381',
                px: { xs: 1.5, sm: 2 },
                gap: 0.5,
                '&.Mui-selected': {
                  color: '#003C7E',
                  fontWeight: 600,
                },
              },
            }}
          >
            {TABS.map((tab, i) => (
              <Tab
                key={i}
                label={tab.label}
                icon={tab.icon}
                iconPosition="start"
              />
            ))}
          </Tabs>
        </Box>

        {/* Tab content */}
        <Box sx={{ flex: 1 }}>
          <TabPanel value={activeTab} index={0}>
            <ExecutiveOverview />
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
            <OrderIntake />
          </TabPanel>
          <TabPanel value={activeTab} index={2}>
            <OrderBook />
          </TabPanel>
          <TabPanel value={activeTab} index={3}>
            <TACO />
          </TabPanel>
          <TabPanel value={activeTab} index={4}>
            <RevenueLifecycle />
          </TabPanel>
          <TabPanel value={activeTab} index={5}>
            <BacklogProjects />
          </TabPanel>
          <TabPanel value={activeTab} index={6}>
            <DataOverviewTab />
          </TabPanel>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            bgcolor: '#ffffff',
            borderTop: '1px solid #E0E3E7',
            py: 1.5,
            px: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ fontSize: '0.72rem', color: '#90A4AE' }}>
            AGFA HE IT Analytics Platform · Confidential · Internal Use Only
          </Box>
          <Box sx={{ fontSize: '0.72rem', color: '#90A4AE' }}>
            Built with React 18 + MUI v5 + Recharts
          </Box>
        </Box>
      </Box>
    </FilterProvider>
  );
}
