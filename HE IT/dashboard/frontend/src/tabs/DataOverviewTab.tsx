import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Chip, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Accordion, AccordionSummary, AccordionDetails, Alert, AlertTitle,
  List, ListItem, ListItemIcon, ListItemText, Tabs, Tab,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StorageIcon from '@mui/icons-material/Storage';
import SchemaIcon from '@mui/icons-material/Schema';
import BarChartIcon from '@mui/icons-material/BarChart';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import AssessmentIcon from '@mui/icons-material/Assessment';

// ── Sub-components ────────────────────────────────────────────────────────────

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; subtitle?: string }> = ({ icon, title, subtitle }) => (
  <Box display="flex" alignItems="center" gap={1.5} mb={2}>
    <Box sx={{ color: '#003C7E', display: 'flex' }}>{icon}</Box>
    <Box>
      <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 700 }}>{title}</Typography>
      {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
    </Box>
  </Box>
);

// ── 0. Dashboard Coverage ─────────────────────────────────────────────────────

const DashboardCoverageSection: React.FC = () => {
  const dashboardTabs = [
    {
      tab: 'Executive Overview',
      covers: 'High-level OI + OB + TACO KPIs, trend charts, OB bucket pie',
      source: 'OI monthly + OB regional + TACO by-month',
      filters: 'BU + Region + Country + Year',
      ppt: 'Summary view',
    },
    {
      tab: 'Order Intake',
      covers: 'Monthly OI trend, regional breakdown, business type mix, YTD KPIs',
      source: 'oi_monthly.json + oi_ytd.json',
      filters: 'BU + Region + Country + Year',
      ppt: 'N/A',
    },
    {
      tab: 'Order Book',
      covers: 'OB evolution stacked bar, regional & FA group breakdown, KPIs by bucket',
      source: 'ob_timeline + ob_regional + ob_fa',
      filters: 'BU + Region + Country + Year',
      ppt: 'N/A',
    },
    {
      tab: 'TACO (P&L)',
      covers: 'Net Sales / TACO Margin / Contribution KPIs, monthly revenue chart, BU comparison, P&L key lines bar chart',
      source: 'taco_key_lines + taco_regional',
      filters: 'BU + Region (Net Sales only) + Year',
      ppt: 'Slides 1 & 6 (partial)',
    },
    {
      tab: 'Revenue Lifecycle',
      covers: 'Side-by-side OI → OB → TACO trend, no conversion funnel (no shared key)',
      source: 'All three sources',
      filters: 'BU + Region + Year',
      ppt: 'N/A',
    },
    {
      tab: 'Backlog & Projects',
      covers: 'Project-level OB schedule, recognition timeline, top customers',
      source: 'ob_schedule + ob_grid + ob_top_customers',
      filters: 'BU + Region',
      ppt: 'Slide 3 (partial)',
    },
    {
      tab: 'P&L Report',
      covers: '5 PPT-aligned pivots: OI quarterly, P&L summary, OI by region, revenue coverage, project pipeline',
      source: 'OI monthly + TACO key lines + OB grid + OB timeline',
      filters: 'BU + Region + Country + Year',
      ppt: 'Slides 1, 3, 4, 5, 6',
    },
  ];

  const pptSlides = [
    {
      slide: 'Slide 1',
      title: 'Region Outlook Q1\'26 (combined P&L)',
      location: 'TACO tab + P&L Report Pivot 2',
      status: 'Partial — ACT/BUD/LY only, no FOR',
      gap: 'FOR column pending for TACO',
    },
    {
      slide: 'Slide 2',
      title: 'Orders Details (project-level OI)',
      location: 'P&L Report Pivot 5 (OB proxy)',
      status: 'Partial — OB used as proxy, no Risk/Comments',
      gap: 'No project-level OI data',
    },
    {
      slide: 'Slide 3',
      title: 'Revenue Details (project-level revenue)',
      location: 'P&L Report Pivot 5',
      status: 'Partial — OB recognition schedule',
      gap: 'No Risk Level, no Comments field',
    },
    {
      slide: 'Slide 4',
      title: 'Total Year OI Quarterly Outlook',
      location: 'P&L Report Pivots 1 & 3',
      status: 'Partial — ACT/BUD/LY, FOR available in data not yet shown',
      gap: 'FOR column ready to add',
    },
    {
      slide: 'Slide 5',
      title: 'Revenue Coverage %',
      location: 'P&L Report Pivot 4',
      status: 'Partial — OI used as proxy for revenue target',
      gap: 'TACO 2026 budget not yet available',
    },
    {
      slide: 'Slide 6',
      title: 'Total Year P&L Outlook',
      location: 'P&L Report Pivot 2',
      status: 'Partial — ACT/BUD/LY, quarterly phasing pending',
      gap: 'TACO FOR + quarterly breakdown pending',
    },
  ];

  const assumptions = [
    'OI 2025 full-year budget used as revenue target proxy in Revenue Coverage (Slide 5) — 2026 revenue budget not yet available',
    'OB 2026 recognition schedule (ob_grid.json) used as proxy for project-level revenue pipeline (Slide 3)',
    'TACO Net Sales KPI uses taco_regional.json when region filter is active; Margin/Contribution remain BU-level',
    'Revenue stream FA desc groupings: Hardware / Own Licenses / 3rd Party Licenses / Impl. Services / AMS',
    'OI MONTH FOR already available in data (13 snapshots) — not yet surfaced in P&L Report charts pending UX review',
  ];

  return (
    <Box>
      <SectionHeader
        icon={<AssessmentIcon />}
        title="Dashboard Coverage"
        subtitle="What each tab covers, PPT slide mapping, and key assumptions"
      />

      {/* Dashboard Tabs Table */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            Current Dashboard Tabs (7)
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            All filters (BU, Region, Country, Year) are now fully wired and apply across all tabs.
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#F5F7FA' }}>
                  {['Tab', 'What It Covers', 'Key Data Source', 'Filter Support', 'PPT Equivalent'].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.75rem' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {dashboardTabs.map((r, i) => (
                  <TableRow key={i} hover>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.78rem', whiteSpace: 'nowrap', color: '#003C7E' }}>
                      {r.tab}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', maxWidth: 260 }}>{r.covers}</TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#5C6BC0', maxWidth: 200 }}>
                      {r.source}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.74rem', whiteSpace: 'nowrap' }}>{r.filters}</TableCell>
                    <TableCell>
                      <Chip
                        label={r.ppt}
                        size="small"
                        sx={{
                          fontSize: '0.65rem',
                          bgcolor: r.ppt === 'N/A' ? '#F5F5F5' : '#E8F5E9',
                          color: r.ppt === 'N/A' ? '#9E9E9E' : '#2E7D32',
                          fontWeight: r.ppt === 'N/A' ? 400 : 600,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* PPT Slides → Dashboard Mapping */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            PPT Slides → Dashboard Mapping
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            Shows which part of the dashboard corresponds to each slide in the regional PPT report structure.
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#F5F7FA' }}>
                  {['PPT Slide', 'Title', 'Dashboard Location', 'Status', 'Key Gap'].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.75rem' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {pptSlides.map((r, i) => (
                  <TableRow key={i} hover>
                    <TableCell>
                      <Chip
                        label={r.slide}
                        size="small"
                        sx={{ bgcolor: '#E3F2FD', color: '#1565C0', fontWeight: 700, fontSize: '0.68rem' }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.76rem', maxWidth: 200 }}>{r.title}</TableCell>
                    <TableCell sx={{ fontSize: '0.74rem', color: '#1565C0', maxWidth: 200 }}>{r.location}</TableCell>
                    <TableCell>
                      <Chip
                        label="Partial"
                        size="small"
                        sx={{ bgcolor: '#FFF3E0', color: '#E65100', fontWeight: 700, fontSize: '0.65rem', mr: 0.5 }}
                      />
                      <Typography variant="caption" sx={{ fontSize: '0.72rem', color: '#546E7A' }}>
                        {r.status.replace('Partial — ', '')}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.73rem', color: '#C62828', maxWidth: 200 }}>{r.gap}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Key Assumptions */}
      <Card>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            Key Assumptions Made
          </Typography>
          <Alert severity="info" sx={{ mt: 0.5 }}>
            <AlertTitle sx={{ fontSize: '0.85rem' }}>These assumptions underpin the current dashboard implementation</AlertTitle>
            <List dense disablePadding>
              {assumptions.map((a, i) => (
                <ListItem key={i} disablePadding sx={{ mb: 0.5, alignItems: 'flex-start' }}>
                  <ListItemIcon sx={{ minWidth: 22, mt: 0.3 }}>
                    <InfoIcon sx={{ fontSize: 13, color: '#0277BD' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={a}
                    primaryTypographyProps={{ fontSize: '0.78rem', lineHeight: 1.5 }}
                  />
                </ListItem>
              ))}
            </List>
          </Alert>
        </CardContent>
      </Card>
    </Box>
  );
};

// ── 1. Data Sources ───────────────────────────────────────────────────────────

const DataSourcesSection: React.FC = () => {
  const sourceFiles = [
    {
      n: 1, file: 'OI HEC view pivot table (1).xlsx', sheets: 15, rows: '132,953',
      period: 'Jun 2021 – Jan 2026', db: '02-OI Database.accdb',
      purpose: 'Order Intake — monthly snapshots by BU, Region, FA, Business Type, Customer',
      role: 'OI Source',
    },
    {
      n: 2, file: '7.14 Order Book Overview pivot (BRM HQ views).xlsx', sheets: 19, rows: '20,595',
      period: 'Feb 2025 – Feb 2026', db: 'OB Data for pivot.mdb',
      purpose: 'Order Book snapshots — 4 backlog buckets by BU, Region, FA Group. Already in kEUR.',
      role: 'OB Summary',
    },
    {
      n: 3, file: 'Order Book detailed pivot.xlsm', sheets: 3, rows: '45,091',
      period: 'Latest OB snapshot', db: 'Detailed Order Book.mdb',
      purpose: 'Project & customer level OB — CRM IDs, SAP doc numbers, planned receipt Year/Quarter, FA codes. VBA macros.',
      role: 'OB Detail',
    },
    {
      n: 4, file: '20-TACO pivot 2025 Selectable x-rate.xlsm', sheets: 4, rows: '69,922',
      period: 'Feb – Dec 2025', db: '10-TACO database.mdb',
      purpose: 'Full P&L (85 lines) — Net Sales → COGS → TACO Margin → TACO Contribution. ACT/BUD/LY. Selectable FX rates.',
      role: 'P&L Source',
    },
  ];

  const roleColor = (role: string) => {
    if (role === 'OI Source')  return { bg: '#E3F2FD', color: '#1565C0' };
    if (role === 'OB Summary') return { bg: '#E8F5E9', color: '#2E7D32' };
    if (role === 'OB Detail')  return { bg: '#F3E5F5', color: '#6A1B9A' };
    return { bg: '#FFF3E0', color: '#E65100' };
  };

  return (
    <Box>
      <SectionHeader icon={<StorageIcon />} title="Data Sources" subtitle="4 Excel source files connected to 3 Microsoft Access databases" />

      {/* Source Files Table */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>Source Excel Files (4)</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            All files are Excel pivot workbooks. Upstream source is Microsoft Access (.mdb/.accdb) → SAP (no direct SAP access).
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#F5F7FA' }}>
                  {['#', 'File', 'Sheets', 'Rows (cache)', 'Period', 'Access DB', 'Purpose', 'Role'].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.75rem' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {sourceFiles.map((r) => {
                  const rc = roleColor(r.role);
                  return (
                    <TableRow key={r.n} hover>
                      <TableCell>{r.n}</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.78rem', maxWidth: 200 }}>{r.file}</TableCell>
                      <TableCell>{r.sheets}</TableCell>
                      <TableCell>{r.rows}</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{r.period}</TableCell>
                      <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#5C6BC0' }}>{r.db}</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', maxWidth: 280 }}>{r.purpose}</TableCell>
                      <TableCell>
                        <Chip label={r.role} size="small" sx={{ bgcolor: rc.bg, color: rc.color, fontWeight: 600, fontSize: '0.65rem' }} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

    </Box>
  );
};

// ── 2. Data Model ─────────────────────────────────────────────────────────────

const DataModelSection: React.FC = () => (
  <Box>
    <SectionHeader icon={<SchemaIcon />} title="Data Model" subtitle="How the 4 source files relate and what connects them" />

    {/* Revenue lifecycle */}
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Revenue Lifecycle — 3 Datasets, No Shared Key</Typography>
        <Box sx={{ bgcolor: '#F5F7FA', borderRadius: 1, p: 2, fontFamily: 'monospace', fontSize: '0.78rem', lineHeight: 2 }}>
          {`ORDER INTAKE (OI)          ORDER BOOK (OB)           TACO P&L
  ──────────────────          ─────────────────           ─────────────
  Source: 02-OI Database      Source: OB Data pivot       Source: 10-TACO database
  Granularity: Snapshot        Granularity: Snapshot       Granularity: Month
  × BU × Region × FA           × BU × Region × FA Grp      × BU × Region × FA Line
  Key fig: ACT/BUD/LY/FOR      Bucket: Plan/OD/NP          ACT / BUD / LY

  ↕ NO SHARED KEY              ↕ NO SHARED KEY              ↕ NO SHARED KEY
  ─────────────────────────────────────────────────────────────────────────────
  Cannot connect OI → OB → TACO without an EDW providing a common project/opportunity ID`}
        </Box>
        <Alert severity="error" sx={{ mt: 1.5, py: 0.5 }}>
          <AlertTitle sx={{ fontSize: '0.82rem' }}>Critical Architecture Gap</AlertTitle>
          <span style={{ fontSize: '0.78rem' }}>
            The three analytical datasets (Order Intake, Order Book, TACO) come from three separate Microsoft Access databases
            with no common key. A Revenue Lifecycle funnel (OI booked → OB backlog → TACO recognised) cannot be built
            without an EDW that resolves the identity across sources.
          </span>
        </Alert>
      </CardContent>
    </Card>

    {/* Dimension alignment */}
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Dimension Alignment Across Files</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#F5F7FA' }}>
                {['Dimension', 'OI (HEC view)', 'OB Overview', 'OB Detailed', 'TACO'].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.75rem' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ['BU',            'S1 only',          'S1/S2/S3/S4/J0/JA/K1/K2/K4', 'BU field',     'S1/S2/S4/JB'],
                ['Region',        'Full name (AsPac)', 'Full name',                   'Full name',    'Code (ASEA, BNLU…)'],
                ['FA / Rev Stream','FA code (010H…)',  'FA Grp, FA Grp2',             'FA code+desc', 'FA ranked (85 lines)'],
                ['Time',          'Snapshot YYYY-MM',  'Period YYYY-MM',             'Rep. month',   'Month integer 1–12'],
                ['Business Type', 'YES (Type Bus D)',  'NO — not available',          'NO',           'NO'],
                ['Customer',      'In raw cache only', 'NO',                          'YES (name)',   'NO'],
                ['Project / CRM', 'NO',                'NO',                          'YES',          'NO'],
                ['Unit',          'Full EUR ÷ 1,000',  'Already kEUR',               'Full EUR ÷ 1,000','Full EUR ÷ 1,000'],
              ].map(([dim, ...vals]) => (
                <TableRow key={dim} hover>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.78rem' }}>{dim}</TableCell>
                  {vals.map((v, i) => (
                    <TableCell key={i} sx={{ fontSize: '0.76rem' }}>
                      {v.includes('NO') ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#C62828' }}>
                          <LinkOffIcon sx={{ fontSize: 13 }} />{v}
                        </Box>
                      ) : v.includes('YES') ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#2E7D32' }}>
                          <LinkIcon sx={{ fontSize: 13 }} />{v}
                        </Box>
                      ) : v}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>

    {/* EDW Target model */}
    <Card>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Target EDW Data Model (Future State)</Typography>
        <Box sx={{ bgcolor: '#1A2027', color: '#E8F5E9', borderRadius: 1, p: 2, fontFamily: 'monospace', fontSize: '0.73rem', lineHeight: 1.9 }}>
          {`DIM_TIME          DIM_BU           DIM_REGION         DIM_FA
  date_key (PK)     bu_code (PK)     region_code (PK)   fa_code (PK)
  year              bu_desc          region_desc        fa_desc
  quarter           segment          geo_fin            fa_group
  month                                                 fa_ranked_line

DIM_CUSTOMER        DIM_PROJECT
  customer_key (PK)  project_key (PK)
  customer_name      project_code
  crm_id             crm_opportunity_id
  region_key (FK)    customer_key (FK)
                     bu_key (FK)

FACT_OI             FACT_OB             FACT_TACO
  snapshot_key       period_key          month_key
  bu_key             bu_key              bu_key
  region_key         region_key          region_key
  fa_key             fa_key              fa_key
  customer_key(!)    customer_key(!)     fa_ranked_line
  oi_act_keur        ob_value_keur       actuals_keur
  oi_bud_keur        bucket              budget_keur
  oi_ly_keur         line_item           actuals_ly_keur
  business_type

  (!) customer_key requires OI→CRM→Project→OB linkage — only possible in EDW`}
        </Box>
      </CardContent>
    </Card>
  </Box>
);

// ── 3. KPI Definitions ────────────────────────────────────────────────────────

const KpiDefinitionsSection: React.FC = () => {
  const oiKpis = [
    { kpi: 'MONTH ACT',  def: 'Monthly Order Intake — actual value booked in the snapshot month', source: 'Key Figure = "MONTH ACT"', unit: 'kEUR' },
    { kpi: 'MONTH BUD',  def: 'Monthly OI — budget (annual plan divided into monthly targets)', source: 'Key Figure = "MONTH BUD"', unit: 'kEUR' },
    { kpi: 'MONTH LY',   def: 'Monthly OI — prior year actual (same calendar month, prior year)', source: 'Key Figure = "MONTH LY"', unit: 'kEUR' },
    { kpi: 'MONTH FOR',  def: 'Monthly OI — latest forecast (combines actuals YTD + forecast balance)', source: 'Key Figure = "MONTH FOR"', unit: 'kEUR' },
    { kpi: 'YTD ACT',    def: 'Year-to-date cumulative OI actuals from Jan to reporting month', source: 'Key Figure = "YTD ACT"', unit: 'kEUR' },
    { kpi: 'YTD BUD',    def: 'Year-to-date OI budget cumulated to same period', source: 'Key Figure = "YTD BUD"', unit: 'kEUR' },
    { kpi: 'YTD LY',     def: 'Year-to-date OI prior year cumulated to same period', source: 'Key Figure = "YTD LY"', unit: 'kEUR' },
    { kpi: 'FY (A+F)',   def: 'Full-year Actual + Forecast — actuals YTD plus forecast for remaining months', source: 'Key Figure = "FY (A+F)"', unit: 'kEUR' },
    { kpi: 'FY BUD',     def: 'Full-year OI budget (static annual plan)', source: 'Key Figure = "FY BUD"', unit: 'kEUR' },
  ];

  const obBuckets = [
    { bucket: 'Planned Current Year', def: 'Orders already in backlog, planned for revenue recognition in the current fiscal year', risk: 'Low — committed for CY recognition' },
    { bucket: 'Planned Next Years',   def: 'Backlog planned for recognition beyond the current fiscal year (multi-year contracts)', risk: 'Medium — timeline may shift' },
    { bucket: 'Rev Overdue ≤ 6 mths', def: 'Revenue that was planned for a past period but not yet recognised — overdue up to 6 months', risk: 'High — delivery or billing delay' },
    { bucket: 'Rev overdue > 6 mths', def: 'Revenue overdue for more than 6 months — significant delivery or contract risk', risk: 'Critical — escalation required' },
    { bucket: 'Not Planned sales order', def: 'Sales orders received but not yet scheduled for revenue recognition', risk: 'Medium — planning lag' },
    { bucket: 'Not Planned Opportunity ≤ 3 mths', def: 'Opportunity-stage orders (not confirmed sales orders) with near-term horizon', risk: 'Variable' },
    { bucket: 'Not Planned Opportunity 4–6 mths', def: 'Mid-range unplanned opportunities in the order book', risk: 'Variable' },
    { bucket: 'Not Planned Opportunity 7–24 mths', def: 'Longer-horizon unplanned opportunities', risk: 'Variable' },
  ];

  const tacoKpis = [
    { line: '02', label: 'Net Sales Hardware / Equi', def: 'Revenue from hardware equipment sales (net of returns/discounts)' },
    { line: '07', label: 'Net Sales Own Licenses',    def: 'Revenue from proprietary software licenses' },
    { line: '09', label: 'Net Sales subs. Own IP',    def: 'Subscription revenue for own IP software' },
    { line: '11', label: 'Net Sales 3rd Party Lic.',  def: 'Revenue from reselling third-party software licenses' },
    { line: '26', label: 'Net Sales Total',           def: 'Total revenue across all categories (sum of lines 02–25)' },
    { line: '55', label: 'TACO Margin',               def: 'Gross profit after direct costs. TACO Margin % = Line 55 / Line 26' },
    { line: '63', label: 'Product Contribution',      def: 'TACO Margin minus product-specific overheads' },
    { line: '85', label: 'TACO Contribution',         def: 'Operating result after all allocated expenses (equivalent to EBIT contribution)' },
  ];

  return (
    <Box>
      <SectionHeader icon={<BarChartIcon />} title="KPI Definitions" subtitle="How each metric is calculated from source data" />

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Order Intake KPIs (from OI HEC view pivot)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Alert severity="info" sx={{ mb: 1.5, py: 0.5 }}>
            <span style={{ fontSize: '0.78rem' }}>All OI Key Figures are pre-computed in the Access DB query and stored as labelled rows. Each record = one combination of snapshot × BU × Region × FA × Business Type × Key Figure × Value. Values in full EUR — divided by 1,000 to normalise to kEUR.</span>
          </Alert>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#F5F7FA' }}>
                  {['Key Figure', 'Definition', 'Source Field', 'Unit'].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.75rem' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {oiKpis.map((r) => (
                  <TableRow key={r.kpi} hover>
                    <TableCell><Chip label={r.kpi} size="small" sx={{ fontFamily: 'monospace', bgcolor: '#E3F2FD', color: '#1565C0', fontSize: '0.7rem' }} /></TableCell>
                    <TableCell sx={{ fontSize: '0.76rem' }}>{r.def}</TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#546E7A' }}>{r.source}</TableCell>
                    <TableCell>{r.unit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Order Book Buckets (from OB Overview pivot)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#F5F7FA' }}>
                  {['Bucket (Key Fig Detail2)', 'Definition', 'Risk Level'].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.75rem' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {obBuckets.map((r) => (
                  <TableRow key={r.bucket} hover>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.76rem' }}>{r.bucket}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{r.def}</TableCell>
                    <TableCell>
                      <Chip label={r.risk} size="small" sx={{
                        fontSize: '0.65rem',
                        bgcolor: r.risk.includes('Critical') ? '#FFEBEE' : r.risk.includes('High') ? '#FFF3E0' : r.risk.includes('Low') ? '#E8F5E9' : '#F5F5F5',
                        color: r.risk.includes('Critical') ? '#C62828' : r.risk.includes('High') ? '#E65100' : r.risk.includes('Low') ? '#2E7D32' : '#546E7A',
                      }} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>TACO P&amp;L Key Lines (from TACO pivot, 85-line P&amp;L)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Alert severity="info" sx={{ mb: 1.5, py: 0.5 }}>
            <span style={{ fontSize: '0.78rem' }}>Full P&L has 85 FA ranked detail lines. Dashboard uses 8 key lines for summary KPIs. Source: query "Data source pivot queries" in 10-TACO database.mdb — NOT a raw table (pre-aggregated in Access). Values in full EUR ÷ 1,000 = kEUR. January 2025 is absent from source.</span>
          </Alert>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#F5F7FA' }}>
                  {['Line', 'Label', 'Definition'].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.75rem' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tacoKpis.map((r) => (
                  <TableRow key={r.line} hover>
                    <TableCell><Chip label={r.line} size="small" sx={{ fontFamily: 'monospace', bgcolor: '#FFF3E0', color: '#E65100', fontSize: '0.7rem' }} /></TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.76rem' }}>{r.label}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{r.def}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

// ── 4. Data Gaps ──────────────────────────────────────────────────────────────

const DataGapsSection: React.FC = () => {
  const gaps = [
    {
      id: 'G1', severity: 'error' as const, impact: 'Critical',
      status: 'PARTIAL' as const,
      title: 'OI → OB → Revenue Conversion Funnel',
      gap: 'No shared key between the OI source (02-OI Database.accdb), OB source (OB Data for pivot.mdb), and TACO source (10-TACO database.mdb).',
      affected: 'Revenue Lifecycle tab — funnel chart cannot be drawn',
      workaround: 'Three datasets shown independently side-by-side. Cannot calculate conversion rates.',
      currentStatus: 'Dashboard shows Revenue Coverage proxy (OI budget vs OB pipeline). Direct OI→OB→TACO linkage not possible without EDW.',
      edwFix: 'EDW resolves this by adding opportunity_id / project_key as a common FK across all three fact tables.',
    },
    {
      id: 'G2', severity: 'error' as const, impact: 'Critical',
      status: 'PARTIAL' as const,
      title: 'TACO Forecast (FOR Column)',
      gap: 'The TACO source query (10-TACO database.mdb → "Data source pivot queries") contains three measure columns: Actuals, Budget, Actuals LY. No Forecast (FOR) column exists.',
      affected: 'TACO tab — cannot show FOR vs ACT variance. P&L forecasting not possible.',
      workaround: 'Budget used as proxy for target in TACO KPI cards.',
      currentStatus: 'OI MONTH FOR data is available in oi_monthly.json across all 13 snapshots. TACO FOR still pending from controlling team. P&L Report currently shows ACT/BUD/LY only.',
      edwFix: 'Request TACO FOR extract from controlling team, or add FOR to Access query.',
    },
    {
      id: 'G3', severity: 'warning' as const, impact: 'High',
      status: 'OPEN' as const,
      title: 'Business Type Dimension Missing from OB and TACO',
      gap: 'The "Type Bus D" field (Net New / Cross Selling / Feature Upselling / Volume Upselling / Transition / Upgrade & Updates) exists only in the OI source table. OB and TACO have no equivalent dimension.',
      affected: 'Cannot analyse backlog or revenue quality by business type. No "Net New vs Renewal" split in P&L.',
      workaround: 'Business type analysis limited to Order Intake tab only.',
      currentStatus: 'Business type analysis remains limited to Order Intake tab. OB and TACO have no equivalent dimension.',
      edwFix: 'Tag OB records with business type at ingestion using the OI→CRM opportunity link.',
    },
    {
      id: 'G4', severity: 'warning' as const, impact: 'High',
      status: 'PARTIAL' as const,
      title: 'Customer Dimension Missing from TACO',
      gap: 'TACO source table aggregates at BU × Region × FA level. No customer or company code dimension present at the record level (only Comp c — legal entity, not customer).',
      affected: 'Customer 360° tab cannot show customer-level P&L or margin. Customer revenue only available from OB Detailed.',
      workaround: 'Customer analysis uses OB Detailed only (backlog). TACO shows BU/region/FA split only.',
      currentStatus: 'P&L Report Pivot 5 shows project-level revenue pipeline using OB Detailed as proxy. No TACO customer breakdown.',
      edwFix: 'Use SAP CO-PA customer-level extract as TACO replacement in EDW.',
    },
    {
      id: 'G5', severity: 'warning' as const, impact: 'Medium',
      status: 'HANDLED' as const,
      title: 'TACO January 2025 Missing',
      gap: 'The TACO pivot cache contains months 2–12 (February–December 2025). Month 1 (January) is absent from the source extract.',
      affected: 'TACO YTD figures represent Feb–Dec 2025 (11 months), not full FY2025.',
      workaround: 'All TACO cards and charts are annotated as "Feb–Dec 2025". Dashboard shows partial badge.',
      currentStatus: 'All TACO displays annotated "Feb–Dec 2025". PARTIAL badge on all TACO KPI cards. Jan 2025 excluded consistently.',
      edwFix: 'Re-extract TACO source with full FY2025 data including January.',
    },
    {
      id: 'G6', severity: 'warning' as const, impact: 'Medium',
      status: 'OPEN' as const,
      title: 'FX Rates — Selectable Default = 1',
      gap: 'The TACO file has selectable x-rate inputs (10 ActiveX controls in VBA). All three x-rate fields (ACT, BUD, LY) default to 1.0 — effectively reporting in local currency without conversion.',
      affected: 'All TACO figures are in local currency (EUR for European entities). Multi-currency reporting not available.',
      workaround: 'All TACO values treated as EUR. Partial badge shown on TACO tab.',
      currentStatus: 'GapPanel shown on TACO tab. All values reported as EUR as extracted. No FX conversion applied.',
      edwFix: 'Use consistent ECB/SAP exchange rates in EDW FX dimension.',
    },
    {
      id: 'G7', severity: 'info' as const, impact: 'Low',
      status: 'PARTIAL' as const,
      title: 'OI Customer Data — Raw Cache Only',
      gap: 'Customer names (Cust c, Cust d) exist in the OI pivot cache (Cache 2, 132,953 rows) but are NOT exposed in the standard pivot views — pivot tables group by BU/Region/FA only.',
      affected: 'OI cannot be broken down by customer in the dashboard without custom parsing.',
      workaround: 'Customer analysis uses OB Detailed source for backlog. OI customer data not surfaced.',
      currentStatus: 'P&L Report Pivot 5 (Revenue Pipeline) uses OB project-level data to show top 25 customer projects. OI customer still not directly surfaced.',
      edwFix: 'Include customer dimension in OI fact table during EDW ETL.',
    },
    {
      id: 'G8', severity: 'info' as const, impact: 'Low',
      status: 'HANDLED' as const,
      title: 'OB Recognition Schedule — Quarter Precision Only',
      gap: 'The OB Detailed pivot records planned receipt year (Pl Rec Year) and quarter (Pl Rec Qtr) but not month. Month-level recognition scheduling is not available.',
      affected: 'Revenue recognition schedule shown at Q/Y granularity only. Monthly cash flow projection not possible.',
      workaround: 'Schedule chart shows Year × Quarter buckets.',
      currentStatus: 'P&L Report Pivot 5 shows Q1/Q2/Q3/Q4 planned recognition from OB Detailed. Quarter precision retained as designed.',
      edwFix: 'Require month-level planned receipt date from SAP PS module in EDW.',
    },
  ];

  const impactColor = (impact: string) => {
    if (impact === 'Critical') return { bg: '#FFEBEE', color: '#C62828' };
    if (impact === 'High')     return { bg: '#FFF3E0', color: '#E65100' };
    if (impact === 'Medium')   return { bg: '#FFF8E1', color: '#F9A825' };
    return { bg: '#E8F5E9', color: '#2E7D32' };
  };

  const statusBadge = (status: 'PARTIAL' | 'OPEN' | 'HANDLED') => {
    if (status === 'HANDLED') return { bg: '#E8F5E9', color: '#2E7D32', label: 'HANDLED' };
    if (status === 'PARTIAL') return { bg: '#FFF3E0', color: '#E65100', label: 'PARTIAL' };
    return { bg: '#FFEBEE', color: '#C62828', label: 'OPEN' };
  };

  return (
    <Box>
      <SectionHeader icon={<WarningAmberIcon />} title="Data Gaps" subtitle="8 known gaps — 2 Handled, 4 Partial, 2 Open" />

      <Alert severity="info" sx={{ mb: 2 }}>
        <AlertTitle>How gaps are handled in the dashboard</AlertTitle>
        Every chart or KPI affected by a gap shows a coloured badge (GAP = red, PARTIAL = amber) and a tooltip explaining the limitation.
        Gap panels (red-bordered cards) replace charts where data is entirely unavailable. The EDW build resolves all Critical and High gaps.
      </Alert>

      <Grid container spacing={2}>
        {gaps.map((g) => {
          const ic = impactColor(g.impact);
          const sb = statusBadge(g.status);
          return (
            <Grid item xs={12} md={6} key={g.id}>
              <Card sx={{ height: '100%', border: `1px solid ${g.severity === 'error' ? '#FFCDD2' : g.severity === 'warning' ? '#FFE0B2' : '#B3E5FC'}` }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      {g.severity === 'error' ? <ErrorIcon color="error" fontSize="small" /> : g.severity === 'warning' ? <WarningAmberIcon color="warning" fontSize="small" /> : <InfoIcon color="info" fontSize="small" />}
                      <Typography variant="subtitle2" fontWeight={700}>{g.id} — {g.title}</Typography>
                    </Box>
                    <Box display="flex" gap={0.5} alignItems="center">
                      <Chip label={sb.label} size="small" sx={{ bgcolor: sb.bg, color: sb.color, fontWeight: 700, fontSize: '0.65rem' }} />
                      <Chip label={g.impact} size="small" sx={{ bgcolor: ic.bg, color: ic.color, fontWeight: 700, fontSize: '0.65rem' }} />
                    </Box>
                  </Box>
                  <Divider sx={{ mb: 1 }} />
                  <List dense disablePadding>
                    {[
                      { icon: <ErrorIcon sx={{ fontSize: 13, color: '#C62828' }} />, label: 'Gap', text: g.gap },
                      { icon: <WarningAmberIcon sx={{ fontSize: 13, color: '#E65100' }} />, label: 'Affected', text: g.affected },
                      { icon: <CheckCircleIcon sx={{ fontSize: 13, color: '#2E7D32' }} />, label: 'Workaround', text: g.workaround },
                      { icon: <InfoIcon sx={{ fontSize: 13, color: '#1565C0' }} />, label: 'Current Status', text: g.currentStatus },
                      { icon: <SchemaIcon sx={{ fontSize: 13, color: '#1565C0' }} />, label: 'EDW Fix', text: g.edwFix },
                    ].map(({ icon, label, text }) => (
                      <ListItem key={label} disablePadding sx={{ mb: 0.5, alignItems: 'flex-start' }}>
                        <ListItemIcon sx={{ minWidth: 22, mt: 0.3 }}>{icon}</ListItemIcon>
                        <ListItemText
                          primary={<><strong>{label}:</strong> {text}</>}
                          primaryTypographyProps={{ fontSize: '0.75rem', lineHeight: 1.4 }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

// ── 5. Open Questions ─────────────────────────────────────────────────────────

const OpenQuestionsSection: React.FC = () => {
  const questions = [
    {
      cat: 'Data Architecture',
      severity: 'error' as const,
      qs: [
        { q: 'The TACO source uses a pre-aggregated Access query ("Data source pivot queries"), not a raw table. What aggregation logic does this query apply — are there filters or transformations that might exclude records?', why: 'If records are filtered out upstream, our dashboard is missing data without knowing it.' },
        { q: 'Can the controlling team provide a TACO FOR (forecast) extract in the same format as the TACO ACT/BUD/LY file?', why: 'TACO forecast visibility is currently a Critical gap — without it, forward-looking P&L analysis is not possible.' },
        { q: 'What is the exact refresh cadence for all 4 source files? Are they all refreshed at the same time (end of month) or staggered?', why: 'OI latest snapshot is Jan 2026, OB is Feb 2026, TACO is Dec 2025 — the misalignment may be normal or may indicate stale data.' },
      ],
    },
    {
      cat: 'Business Type / Deal Classification',
      severity: 'warning' as const,
      qs: [
        { q: 'The "Type Bus D" dimension (Net New, Cross Selling, Feature Upselling, etc.) exists in OI but not in OB or TACO. Is this field maintained downstream in SAP or Access? Can it be linked to the OB and TACO records?', why: 'Business type is the most valuable dimension for revenue quality analysis (new vs renewal). Currently limited to OI only.' },
        { q: 'What is the definition of "Transition" as a business type? It appears alongside Net New and Cross Selling but its business meaning is unclear from the data alone.', why: 'Correct categorisation of OI quality depends on this definition.' },
      ],
    },
    {
      cat: 'Order Book Interpretation',
      severity: 'warning' as const,
      qs: [
        { q: 'The OB contains both "Not Planned sales order" and multiple "Not Planned Opportunity" buckets. What distinguishes a "Not Planned sales order" from a confirmed order that is planned — is this an unbooked order or a booked order with no recognition date?', why: 'The dashboard currently groups all "Not Planned" into one bucket. Splitting confirmed orders from opportunities changes the risk assessment.' },
        { q: 'OB Detailed shows Dedalus HealthCare entities appearing alongside AGFA HealthCare in Comp descr. Are these legacy entries from a carve-out that should be excluded from current OB analysis?', why: 'Including divested entities inflates the OB figures and misrepresents the current business.' },
        { q: 'The OB Detailed pivot cache has a 8,000 record limit (Excel pivot cache constraint). Is the actual OB database larger? Are records being truncated?', why: 'If the Access DB has more than 8,000 unique customers/projects, we are missing the long tail of the OB in this dashboard.' },
      ],
    },
    {
      cat: 'TACO / P&L',
      severity: 'info' as const,
      qs: [
        { q: 'January 2025 is absent from the TACO source extract. Was January excluded intentionally (year-end close not complete?) or is this a data extraction issue?', why: 'If it is intentional, all TACO YTD figures need a disclaimer. If it is a bug, the extract should be re-run.' },
        { q: 'The TACO file covers BU S1, S2, S4, and JB. BU S3 appears in OI data but not TACO. Is S3 excluded from TACO intentionally (different P&L reporting entity?) or is it a data gap?', why: 'S3 revenue in OI cannot be matched to any TACO revenue — reconciliation gap.' },
        { q: 'The selectable x-rate feature defaults to 1 (effectively no FX conversion). What is the intended use case — is the dashboard expected to show EUR-only values, or should actual SAP FX rates be applied?', why: 'If multi-currency reporting is required, a dedicated FX rate table needs to be sourced from SAP.' },
      ],
    },
    {
      cat: 'EDW & Future Analytics',
      severity: 'info' as const,
      qs: [
        { q: 'For the EDW build, is there a CRM system (Salesforce/SAP CRM) that holds the opportunity-to-order linkage between OI and OB? The CRM Opportunity ID field exists in OB Detailed but not in the OI source.', why: 'The CRM is the critical bridge that connects OI → OB → TACO and unlocks the full revenue lifecycle funnel.' },
        { q: 'What is the preferred reporting currency for the EDW dashboard — kEUR only, or should multi-currency (local currency + EUR at fixed/spot rates) be supported?', why: 'Determines the FX architecture in the EDW data model.' },
        { q: 'Are there any other analytical workbooks or reports used by the team that were not included in the 4 files analyzed? For example, a margin bridge workbook, a forecasting file, or a customer-level tracking sheet?', why: 'Incomplete source identification means gaps may be larger than currently mapped.' },
      ],
    },
  ];

  return (
    <Box>
      <SectionHeader icon={<HelpOutlineIcon />} title="Open Questions" subtitle="15 questions for the business team — review call agenda" />

      <Alert severity="warning" sx={{ mb: 2 }}>
        <AlertTitle>These questions should be answered before the EDW build begins</AlertTitle>
        The answers will directly shape the data model design, ETL transformation rules, and dashboard scope. Questions marked Critical / High impact architecture decisions that cannot easily be changed later.
      </Alert>

      {questions.map((section, si) => (
        <Accordion key={si} defaultExpanded={si < 2}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display="flex" alignItems="center" gap={1}>
              {section.severity === 'error' ? <ErrorIcon color="error" fontSize="small" /> : section.severity === 'warning' ? <WarningAmberIcon color="warning" fontSize="small" /> : <InfoIcon color="info" fontSize="small" />}
              <Typography fontWeight={600}>{section.cat}</Typography>
              <Chip label={`${section.qs.length} question${section.qs.length > 1 ? 's' : ''}`} size="small" sx={{ ml: 1, bgcolor: '#F5F7FA' }} />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <List dense disablePadding>
              {section.qs.map((item, qi) => (
                <ListItem key={qi} disablePadding sx={{ mb: 1.5, flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Box display="flex" gap={1} mb={0.5}>
                    <Chip label={`Q${si * 10 + qi + 1}`} size="small" sx={{ fontFamily: 'monospace', bgcolor: '#E3F2FD', color: '#1565C0', fontSize: '0.65rem' }} />
                    <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{item.q}</Typography>
                  </Box>
                  <Box sx={{ pl: 4 }}>
                    <Typography variant="caption" sx={{ color: '#E65100', fontStyle: 'italic' }}>
                      Why it matters: {item.why}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

// ── Main Tab ──────────────────────────────────────────────────────────────────

const SUB_TABS = [
  'Dashboard Coverage',
  'Data Sources',
  'Data Model',
  'KPI Definitions',
  'Data Gaps',
  'Open Questions',
];

const DataOverviewTab: React.FC = () => {
  const [subTab, setSubTab] = useState(0);

  return (
    <Box>
      {/* Header Banner */}
      <Card sx={{ mb: 2, background: 'linear-gradient(135deg, #003C7E 0%, #1565C0 50%, #00695C 100%)', color: '#fff' }}>
        <CardContent sx={{ py: 3 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Project Overview — How This Dashboard Was Built
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, maxWidth: 900 }}>
            Documents the data sources, data model, KPI definitions, identified gaps, and open questions discovered
            during analysis of AGFA HE IT analytical Excel workbooks. Serves as a transparent methodology reference
            and a structured agenda for the business review call.
          </Typography>
          <Box display="flex" gap={1.5} mt={2} flexWrap="wrap">
            {[
              '4 Excel Source Files',
              '3 Microsoft Access DBs',
              '8 Dashboard Tabs',
              '5 PPT-Aligned Pivots',
              '8 Data Gaps (2 Handled, 4 Partial, 2 Open)',
              '15 Open Questions',
            ].map((label) => (
              <Chip key={label} label={label} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '0.72rem' }} />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Sub-tab Navigation */}
      <Box sx={{ bgcolor: 'white', borderRadius: 2, mb: 2, border: '1px solid #E0E0E0' }}>
        <Tabs
          value={subTab}
          onChange={(_, v) => setSubTab(v)}
          variant="fullWidth"
          sx={{ '& .MuiTab-root': { py: 1.5, fontSize: '0.82rem', fontWeight: 600, textTransform: 'none' } }}
        >
          {SUB_TABS.map((label, i) => (
            <Tab
              key={i}
              label={label}
              icon={
                [
                  <AssessmentIcon fontSize="small" />,
                  <StorageIcon fontSize="small" />,
                  <SchemaIcon fontSize="small" />,
                  <BarChartIcon fontSize="small" />,
                  <WarningAmberIcon fontSize="small" />,
                  <HelpOutlineIcon fontSize="small" />,
                ][i]
              }
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Box>

      {/* Sub-tab Content */}
      <Box>
        {subTab === 0 && <DashboardCoverageSection />}
        {subTab === 1 && <DataSourcesSection />}
        {subTab === 2 && <DataModelSection />}
        {subTab === 3 && <KpiDefinitionsSection />}
        {subTab === 4 && <DataGapsSection />}
        {subTab === 5 && <OpenQuestionsSection />}
      </Box>
    </Box>
  );
};

export default DataOverviewTab;
