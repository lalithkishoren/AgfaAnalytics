import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Chip, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Accordion, AccordionSummary, AccordionDetails, Alert, AlertTitle,
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
import { DashboardData } from '../types';
import { fmtNum } from '../utils/formatters';

interface Props {
  data: DashboardData;
}

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; subtitle?: string }> = ({ icon, title, subtitle }) => (
  <Box display="flex" alignItems="center" gap={1.5} mb={2}>
    <Box sx={{ color: '#1565C0', display: 'flex' }}>{icon}</Box>
    <Box>
      <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 700 }}>{title}</Typography>
      {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
    </Box>
  </Box>
);

const DataOverviewTab: React.FC<Props> = ({ data }) => {
  const [subTab, setSubTab] = useState(0);

  const subTabs = ['Data Sources', 'Data Model', 'KPI Definitions', 'Data Gaps', 'Open Questions'];

  return (
    <Box>
      {/* Header Banner */}
      <Card sx={{ mb: 2, background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 50%, #00897B 100%)', color: '#fff' }}>
        <CardContent sx={{ py: 3 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Project Overview — How We Built This Dashboard
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, maxWidth: 900 }}>
            This tab documents the data sources, data model, KPI definitions, identified data gaps, and open questions
            discovered during the analysis of Agfa Digital Hydrogen's Zirfon membrane business data. It serves as a
            transparent methodology reference for the review team.
          </Typography>
          <Box display="flex" gap={1.5} mt={2}>
            <Chip label={`${fmtNum(data.orders.length)} Orders`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }} />
            <Chip label={`${fmtNum(data.quotations.length)} Quotations`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }} />
            <Chip label={`${fmtNum(data.customers.length)} Customers`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }} />
            <Chip label="7 Excel Sources" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }} />
            <Chip label="9 JSON Datasets" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }} />
          </Box>
        </CardContent>
      </Card>

      {/* Sub-tab Navigation */}
      <Box sx={{ bgcolor: 'white', borderRadius: 2, mb: 2, border: '1px solid #E0E0E0' }}>
        <Tabs
          value={subTab}
          onChange={(_, v) => setSubTab(v)}
          variant="fullWidth"
          sx={{ '& .MuiTab-root': { py: 1.5, fontSize: '0.85rem', fontWeight: 600 } }}
        >
          {subTabs.map((label, i) => (
            <Tab key={i} label={label} icon={
              [<StorageIcon fontSize="small" />, <SchemaIcon fontSize="small" />, <BarChartIcon fontSize="small" />,
               <WarningAmberIcon fontSize="small" />, <HelpOutlineIcon fontSize="small" />][i]
            } iconPosition="start" />
          ))}
        </Tabs>
      </Box>

      {/* Sub-tab Content */}
      {subTab === 0 && <DataSourcesSection />}
      {subTab === 1 && <DataModelSection />}
      {subTab === 2 && <KpiDefinitionsSection />}
      {subTab === 3 && <DataGapsSection />}
      {subTab === 4 && <OpenQuestionsSection />}
    </Box>
  );
};

// ─── SUB-TAB 1: Data Sources ─────────────────────────────────────

const DataSourcesSection: React.FC = () => (
  <Box>
    <SectionHeader icon={<StorageIcon />} title="Data Sources" subtitle="7 Excel files processed into 9 JSON datasets" />

    {/* Source Files Table */}
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Source Excel Files</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#F5F7FA' }}>
                <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>File</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Sheets</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Rows</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Period</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Purpose</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                { n: 1, file: 'Customer Master.xlsx', sheets: '1', rows: '304', period: 'Static', purpose: 'Customer dimension / master data', role: 'Dimension' },
                { n: 2, file: 'Quotation.xlsx', sheets: '2', rows: '1,423', period: '2023–2025', purpose: 'Quote pipeline & conversion tracking', role: 'Fact' },
                { n: 3, file: 'Sales Zirfon GHS.xlsx', sheets: '6', rows: '920', period: '2023–2026', purpose: 'THE CENTRAL SALES LEDGER — order tracking, invoicing, payments', role: 'Fact (Hub)' },
                { n: 4, file: 'AP1 SAP Extract 2026.xlsx', sheets: '1', rows: '46', period: 'Jan–Mar 2026', purpose: 'Confirmed SAP sales orders', role: 'Fact' },
                { n: 5, file: 'FY 2025.xls', sheets: '25', rows: '3,167', period: '2022–2025', purpose: "Controller's main workbook — SAP BI extracts, pivots, margins", role: 'Analytics' },
                { n: 6, file: 'ACTFY2025_Forecasting.xlsx', sheets: '44', rows: '1,095', period: 'FY2025', purpose: 'FY2025 RFC forecasting workbook', role: 'Forecast' },
                { n: 7, file: 'Sales Forecast Feb2026.xlsx', sheets: '49', rows: '1,095', period: 'FY2026', purpose: 'FY2026 RFC forecasting workbook — CRISIS DATA', role: 'Forecast' },
              ].map((r) => (
                <TableRow key={r.n} hover>
                  <TableCell>{r.n}</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>{r.file}</TableCell>
                  <TableCell>{r.sheets}</TableCell>
                  <TableCell>{r.rows}</TableCell>
                  <TableCell>{r.period}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem' }}>{r.purpose}</TableCell>
                  <TableCell>
                    <Chip label={r.role} size="small" sx={{
                      fontSize: '0.7rem',
                      bgcolor: r.role === 'Fact (Hub)' ? '#E3F2FD' : r.role === 'Dimension' ? '#E8F5E9' :
                        r.role === 'Forecast' ? '#FFF3E0' : r.role === 'Analytics' ? '#F3E5F5' : '#F5F5F5',
                      color: r.role === 'Fact (Hub)' ? '#1565C0' : r.role === 'Dimension' ? '#2E7D32' :
                        r.role === 'Forecast' ? '#E65100' : r.role === 'Analytics' ? '#7B1FA2' : '#616161',
                    }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>

    {/* Output JSON Files */}
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Generated JSON Datasets (public/data/)</Typography>
        <Grid container spacing={1.5}>
          {[
            { file: 'orders.json', records: '920', source: 'Sales Zirfon GHS (4 yearly sheets)', desc: 'Full order history 2023–2026' },
            { file: 'quotations.json', records: '1,363', source: 'Quotation.xlsx', desc: 'Quote pipeline with conversion flags' },
            { file: 'customers.json', records: '299', source: 'Customer Master.xlsx', desc: 'Enriched customer dimension with regions' },
            { file: 'revenue_summary.json', records: '3,167', source: 'FY 2025.xls (raw data sheet)', desc: 'SAP BI CO-PA extract — actuals, budget, forecast' },
            { file: 'margin_data.json', records: '174', source: 'FY 2025.xls (margin pivots)', desc: 'Monthly margin by product with std costs' },
            { file: 'forecast.json', records: '12', source: 'Forecasting files (fallback)', desc: 'FY2026 forecast by FOR Type' },
            { file: 'forecast_revisions.json', records: '3', source: 'Known data points', desc: 'BUD → RFC2 → Current revision history' },
            { file: 'long_term_plans.json', records: '8', source: 'Feb2026 Revenue Overview', desc: '2022–2029 actuals + plans' },
            { file: 'kpis.json', records: '1', source: 'Calculated from all sources', desc: 'Pre-computed KPI metrics' },
          ].map((f) => (
            <Grid size={{ xs: 12, md: 4 }} key={f.file}>
              <Box sx={{ p: 1.5, bgcolor: '#F5F7FA', borderRadius: 1.5, height: '100%' }}>
                <Typography variant="subtitle2" sx={{ fontFamily: 'monospace', color: '#1565C0' }}>{f.file}</Typography>
                <Typography variant="caption" color="text.secondary" display="block">{f.records} records — {f.desc}</Typography>
                <Typography variant="caption" sx={{ color: '#78909C', fontSize: '0.65rem' }}>Source: {f.source}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>

    {/* Data Processing Pipeline */}
    <Card>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Data Processing Pipeline</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Python script (<code>process_data.py</code>) using Pandas + openpyxl transforms 7 Excel files into 9 JSON datasets.
        </Typography>
        <Box sx={{ p: 2, bgcolor: '#263238', borderRadius: 2, color: '#E0E0E0', fontFamily: 'monospace', fontSize: '0.75rem', lineHeight: 1.8, overflowX: 'auto' }}>
          <Box component="pre" sx={{ margin: 0, whiteSpace: 'pre-wrap' }}>
{`7 Excel Files
  │
  ├─ Customer Master.xlsx ──────→ Region mapping, payment term grouping,
  │                                 dedup, column fix ──→ customers.json
  │
  ├─ Quotation.xlsx ────────────→ Product standardization, conversion
  │                                 flags, date parsing ──→ quotations.json
  │
  ├─ Sales Zirfon GHS.xlsx ────→ 4 yearly sheets merged, currency cleanup,
  │   (CENTRAL HUB)               status parsing ──→ orders.json
  │
  ├─ FY 2025.xls ──────────────→ raw data sheet (3,167 rows) parsed with
  │   (25 sheets)                  mapping tables applied ──→ revenue_summary.json
  │                              → margin pivots ──→ margin_data.json
  │
  ├─ ACTFY2025_Forecasting ────→ Forecast composition, committed/
  │                                uncommitted split ──→ forecast.json
  │
  └─ Sales Forecast Feb2026 ───→ Long-term plans (2027-2029),
                                   revision history ──→ long_term_plans.json
                                                      → forecast_revisions.json

All outputs ──→ Calculated KPIs ──→ kpis.json`}
          </Box>
        </Box>
      </CardContent>
    </Card>
  </Box>
);

// ─── SUB-TAB 2: Data Model ───────────────────────────────────────

const DataModelSection: React.FC = () => (
  <Box>
    <SectionHeader icon={<SchemaIcon />} title="Data Model" subtitle="Dimensions, Facts, Aggregated Tables & Join Keys" />

    {/* Entity Relationship Diagram */}
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Entity Relationship — How Files Connect</Typography>
        <Box sx={{ p: 2, bgcolor: '#F5F7FA', borderRadius: 2, fontFamily: 'monospace', fontSize: '0.72rem', lineHeight: 1.7, overflowX: 'auto' }}>
          <Box component="pre" sx={{ margin: 0, whiteSpace: 'pre-wrap' }}>
{`                              ┌──────────────────────────┐
                              │   DIM: Customer Master    │
                              │   (296 SAP IDs)           │
                              │   PK: SAP Customer ID     │
                              │   Country, Payment Terms   │
                              └────────────┬──────────────┘
                                           │
                   Sold-To Pt = Customer ID │ ✅ CLEAN JOIN (100%)
                                           │
┌───────────────────┐   Quotation    ┌─────┴────────────────────┐    SAP Order    ┌──────────────────┐
│  FACT: Quotation   │───reference───→│  FACT: Sales Zirfon GHS  │←───number──────│  FACT: SAP Orders │
│  (1,337 quotes)    │  39.9% match  │  (920 orders) — THE HUB   │  74% match     │  (46 orders 2026) │
│  PK: Quote number  │               │  PK: Agfa Order Ref        │                │  PK: Document     │
│  Customer (text)   │               │  Has: SAP Order, Invoice,  │                │  Sold-To Pt (FK)  │
│  ❌ No SAP ID      │               │  Quote Ref, Payment        │                │  ✅ Has SAP ID    │
└───────────────────┘               └────────────┬──────────────┘                └──────────────────┘
                                                 │
                              Enriched by mapping tables from FY 2025.xls:
                              • Mapping Customers (111→78 standardized)
                              • Mapping Type (85 SAP codes→6 products)
                              • Mapping Standard Costprices (margin calc)
                              • Mapping Company Code (3 legal entities)
                                                 │
                              ┌──────────────────┴──────────────┐
                              │  AGG: Revenue Summary (SAP BI)   │
                              │  3,167 rows — CO-PA extract      │
                              │  7 periods: ACT, BUD, FOR, LY    │
                              │  Measures: Turnover, Std Cost,   │
                              │  Gross Margin, Sales Qty          │
                              └─────────────────────────────────┘`}
          </Box>
        </Box>
      </CardContent>
    </Card>

    {/* Dimension Tables */}
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Dimension Tables</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#E8F5E9' }}>
                <TableCell sx={{ fontWeight: 700 }}>Dimension</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Source</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Hierarchy Levels</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Cardinality</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Join Key</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                { dim: 'DIM_Customer', source: 'Customer Master + Mapping Customers', levels: 'Customer Group → Legal Entity → Ship-to', card: '296 IDs → ~200 groups', key: 'SAP Customer ID / Customer Name (fuzzy)' },
                { dim: 'DIM_Geography', source: 'Country fields + Region Mapping', levels: 'Region → Sub-Region → Country', card: '4 regions, 10 sub-regions, 54 countries', key: 'Country (standardized)' },
                { dim: 'DIM_Product', source: 'Mapping Type (85 SAP→6 types)', levels: 'Family → Type → Variant (dimensions)', card: '4 types: UTP500, UTP220, UTP500+, UTP500A', key: 'Type perl / Zirfon Type' },
                { dim: 'DIM_Time', source: 'Date fields + Mapping Months', levels: 'Year → Quarter → Month', card: '2022–2029 (8 years)', key: 'Year, MonthNum' },
                { dim: 'DIM_Channel', source: '3rd P or ICO flag', levels: 'Third-Party (20) / Intercompany (10)', card: '3 company codes: BE, JP, KR', key: 'Company Code / 3rd P or ICO' },
                { dim: 'DIM_Payment', source: 'Customer Master + Sales Zirfon', levels: 'Payment Group (Advance/Net30/Net60+)', card: '17 raw terms → 6 groups', key: 'Payment Terms (standardized)' },
                { dim: 'DIM_FOR_Type', source: 'Forecast files (FOR Type)', levels: 'Actuals / Committed / Uncommitted / Unidentified', card: '4 categories', key: 'FOR Type' },
              ].map((r) => (
                <TableRow key={r.dim} hover>
                  <TableCell sx={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.8rem', color: '#2E7D32' }}>{r.dim}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem' }}>{r.source}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem' }}>{r.levels}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem' }}>{r.card}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem' }}>{r.key}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>

    {/* Fact Tables */}
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Fact & Aggregated Tables</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#E3F2FD' }}>
                <TableCell sx={{ fontWeight: 700 }}>Table</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Grain</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Records</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Key Measures</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                { table: 'orders', type: 'Fact', grain: 'One row per order line per year', records: '920', measures: 'Amount (EUR/JPY/KRW), SQM, EUR/m², Status' },
                { table: 'quotations', type: 'Fact', grain: 'One row per quotation', records: '1,363', measures: 'Total Amount, Total SQM, EUR/m², isOrdered flag' },
                { table: 'revenue_summary', type: 'Aggregated', grain: 'Period × Month × Customer × Product', records: '3,167', measures: 'Net Turnover, Sales Qty, Std Cost, Gross Margin' },
                { table: 'margin_data', type: 'Aggregated', grain: 'Year × Month × Product', records: '174', measures: 'Turnover, Std Cost, Gross Margin, GM%, ENP/m²' },
                { table: 'forecast', type: 'Fact', grain: 'FOR Type × Month × Customer × Product', records: '12', measures: 'Forecast EUR, Forecast M²' },
                { table: 'forecast_revisions', type: 'Snapshot', grain: 'RFC Cycle', records: '3', measures: 'Forecast Value (BUD→RFC2→Current)' },
                { table: 'long_term_plans', type: 'Plan', grain: 'Year', records: '8', measures: 'Revenue, Volume, EUR/m², Type (actual/forecast/plan)' },
                { table: 'kpis', type: 'Pre-computed', grain: 'Single record', records: '1', measures: 'All dashboard KPIs pre-calculated' },
              ].map((r) => (
                <TableRow key={r.table} hover>
                  <TableCell sx={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.8rem', color: '#1565C0' }}>{r.table}</TableCell>
                  <TableCell>
                    <Chip label={r.type} size="small" sx={{
                      fontSize: '0.65rem',
                      bgcolor: r.type === 'Fact' ? '#E3F2FD' : r.type === 'Aggregated' ? '#FFF3E0' :
                        r.type === 'Pre-computed' ? '#F3E5F5' : '#F5F5F5',
                    }} />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8rem' }}>{r.grain}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem' }}>{r.records}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem' }}>{r.measures}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>

    {/* Join Quality */}
    <Card>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Join Quality Assessment</Typography>
        <Grid container spacing={2}>
          {[
            { from: 'Sales Zirfon → Customer Master', key: 'Customer Name (fuzzy match)', rate: '~99/370 exact', icon: <LinkIcon />, color: '#F57C00', status: 'Needs fuzzy matching' },
            { from: 'SAP Orders → Customer Master', key: 'Sold-To Pt = Customer ID', rate: '26/26 (100%)', icon: <LinkIcon />, color: '#2E7D32', status: 'Perfect join' },
            { from: 'Sales Zirfon → SAP Orders (2026)', key: 'SAP Order Number', rate: '34/46 (74%)', icon: <LinkIcon />, color: '#2E7D32', status: 'Good' },
            { from: 'Sales Zirfon → Quotation', key: 'Quotation Reference', rate: '182/278 (65%)', icon: <LinkIcon />, color: '#F57C00', status: 'Partial' },
            { from: 'Quotation → Customer Master', key: 'Customer Name (fuzzy)', rate: '65/568 (11%)', icon: <LinkOffIcon />, color: '#D32F2F', status: 'Broken — no SAP ID' },
          ].map((j) => (
            <Grid size={{ xs: 12, md: 6 }} key={j.from}>
              <Box sx={{ p: 2, bgcolor: '#F5F7FA', borderRadius: 2, borderLeft: `4px solid ${j.color}` }}>
                <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                  <Box sx={{ color: j.color }}>{j.icon}</Box>
                  <Typography variant="subtitle2" fontWeight={700}>{j.from}</Typography>
                </Box>
                <Typography variant="caption" display="block" color="text.secondary">Key: {j.key}</Typography>
                <Box display="flex" gap={1} mt={0.5}>
                  <Chip label={j.rate} size="small" sx={{ fontSize: '0.65rem' }} />
                  <Chip label={j.status} size="small" sx={{ fontSize: '0.65rem', bgcolor: j.color, color: '#fff' }} />
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  </Box>
);

// ─── SUB-TAB 3: KPI Definitions ──────────────────────────────────

const KpiDefinitionsSection: React.FC = () => (
  <Box>
    <SectionHeader icon={<BarChartIcon />} title="KPI Definitions" subtitle="Definitions of all metrics used across dashboard tabs" />

    {[
      {
        module: 'Revenue & Orders',
        tab: 'Executive Summary + Revenue & Orders tabs',
        kpis: [
          { name: 'YTD Revenue', def: 'Sum of Amount where Currency=EUR, Status=2 (completed), Year=2026', source: 'orders.json' },
          { name: 'Full Year Forecast', def: 'Total FY2026 forecast across all FOR Types (Actuals + Committed + Uncommitted + Unidentified)', source: 'kpis.json → from forecast files' },
          { name: 'vs Budget %', def: '(Full Year Forecast − Budget Total) / Budget Total × 100', source: 'BUD 2026 from forecasting file' },
          { name: 'vs Prior Year %', def: '(Full Year Forecast − LY Total) / LY Total × 100', source: 'ACT LY from FY 2025.xls' },
          { name: 'Revenue by Product', def: 'EUR revenue split by Zirfon Type (UTP500/220/500+)', source: 'orders.json grouped by product' },
          { name: 'Customer Concentration', def: 'Top 5 and Top 10 customers as % of total EUR revenue (all years)', source: 'orders.json' },
          { name: 'Open Orders', def: 'Count and EUR value of orders with Status=1 (open/in-progress)', source: 'orders.json' },
          { name: 'Average Order Value', def: 'Total EUR Revenue / Number of Completed Orders', source: 'orders.json' },
        ],
      },
      {
        module: 'Pipeline & Conversion',
        tab: 'Pipeline & Conversion tab',
        kpis: [
          { name: 'Quote Conversion Rate', def: 'Quotations with Order=yes / Total Quotations (overall: 18.0%)', source: 'quotations.json' },
          { name: 'Pipeline Value', def: 'Sum of Total Amount for open (non-ordered) quotations', source: 'quotations.json filtered by isOrdered=false' },
          { name: 'Pipeline Count', def: 'Count of open (non-ordered) quotations', source: 'quotations.json' },
          { name: 'Conversion by Year', def: 'Conversion rate calculated per quotation year (2023: 8.8%, 2024: 24.1%, 2025: 24.8%)', source: 'quotations.json' },
          { name: 'Conversion by Product', def: 'Conversion rate per product type (UTP220: 22.9%, UTP500+: 16.5%, UTP500: 16.2%)', source: 'quotations.json' },
          { name: 'Avg Quote Size', def: 'Total quoted amount / Quote count — Ordered avg: €20,856 vs Non-ordered avg: €197,046', source: 'quotations.json' },
        ],
      },
      {
        module: 'Margin & Profitability',
        tab: 'Margin & Profitability tab',
        kpis: [
          { name: 'Gross Margin %', def: '(Net Turnover − Standard Cost Total) / Net Turnover × 100', source: 'revenue_summary.json / margin_data.json' },
          { name: 'Gross Margin (absolute)', def: 'Net Turnover − Standard Cost Total (EUR)', source: 'margin_data.json' },
          { name: 'Standard Cost Prices', def: 'UTP500: €115.86/m², UTP220: €95.47/m², UTP500+: €115.86/m² (FY2025)', source: 'Mapping Standard Costprices in FY 2025.xls' },
          { name: 'MSP 2026', def: 'UTP220: €111.07/m², UTP500: €102.10/m² (Manufacturing Standard Price FY2026)', source: 'Revenue Overview in Feb2026 file' },
          { name: 'Average Selling Price', def: 'EUR Revenue / Total m² sold, by product and year', source: 'orders.json' },
        ],
      },
      {
        module: 'Forecast & Plans',
        tab: 'Forecast & Plans tab',
        kpis: [
          { name: 'Forecast Composition', def: 'Breakdown of FY2026 forecast: Actuals (€1.7M, 27%) + Committed (€2.2M, 35%) + Uncommitted (€0.8M, 13%) + Unidentified (€1.6M, 25%)', source: 'forecast.json' },
          { name: 'Budget Gap', def: 'FY2026 Forecast (€6.2M) − Budget (€17.3M) = −€11.1M (−64.3%)', source: 'forecast files' },
          { name: 'Forecast Revision History', def: 'BUD 2026: €17.3M → RFC2 (Jul): €31.2M → Current (Sep): €6.2M — €25M downward revision', source: 'forecast_revisions.json' },
          { name: 'Long-Term Plans', def: '2027: €38.6M, 2028: €51.4M, 2029: €69.9M — with declining EUR/m² (209→197→186)', source: 'long_term_plans.json' },
          { name: 'Scenario Analysis', def: 'Base Case = (Committed + Pipeline×ConvRate + TK Batches×€949K) × PriceAdj; Bear=70%, Bull=120%', source: 'Calculated from sliders' },
          { name: 'TK Nucera NEOM Batches', def: 'PO 32017233 — Batches #6-#25, ~€949K each — total remaining ~€19M', source: 'ACTFY2025 TK Nucera sheet' },
        ],
      },
      {
        module: 'Customer 360°',
        tab: 'Customer 360° tab',
        kpis: [
          { name: 'Lifetime Revenue', def: 'Sum of EUR revenue across all years for selected customer (Status=2)', source: 'orders.json filtered by customer' },
          { name: 'Quotation Conversion', def: 'Converted quotes / Total quotes for selected customer', source: 'quotations.json filtered by customer' },
          { name: 'Product Mix', def: 'Revenue distribution by product type for selected customer', source: 'orders.json' },
        ],
      },
    ].map((module) => (
      <Accordion key={module.module} defaultExpanded={module.module === 'Revenue & Orders'}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>{module.module}</Typography>
            <Typography variant="caption" color="text.secondary">{module.tab}</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#F5F7FA' }}>
                  <TableCell sx={{ fontWeight: 700, width: 200 }}>KPI</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Definition / Formula</TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 200 }}>Data Source</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {module.kpis.map((k) => (
                  <TableRow key={k.name} hover>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>{k.name}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{k.def}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', color: '#78909C', fontFamily: 'monospace' }}>{k.source}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
    ))}
  </Box>
);

// ─── SUB-TAB 4: Data Gaps ────────────────────────────────────────

const DataGapsSection: React.FC = () => (
  <Box>
    <SectionHeader icon={<WarningAmberIcon />} title="Identified Data Gaps & Quality Issues" subtitle="What we found and what still needs resolution" />

    {/* Resolved Gaps */}
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} color="success.main" gutterBottom>
          Resolved Gaps (found in FY 2025.xls & Forecasting files)
        </Typography>
        <List dense>
          {[
            { gap: 'G1: No cost/COGS data', resolution: 'Standard cost prices found in Mapping Standard Costprices — UTP500: €115.86/m², UTP220: €95.47/m²' },
            { gap: 'G5: No FX rates', resolution: 'SAP BI data already converted to EUR within SAP — no external FX needed' },
            { gap: 'G6: No budget/target data', resolution: 'BUD 2024 (€34.4M), BUD 2025 (€36.2M), BUD 2026 (€17.3M) all available' },
            { gap: 'G12: Intercompany not flagged', resolution: '3rd P or ICO flag exists (10=Intercompany, 20=Third-party) in SAP BI data' },
          ].map((g) => (
            <ListItem key={g.gap} sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <CheckCircleIcon fontSize="small" color="success" />
              </ListItemIcon>
              <ListItemText
                primary={<Typography variant="body2" fontWeight={600}>{g.gap}</Typography>}
                secondary={g.resolution}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>

    {/* Partially Resolved */}
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#F57C00' }} gutterBottom>
          Partially Resolved Gaps
        </Typography>
        <List dense>
          {[
            { gap: 'G2: No unified Customer ID across files', status: 'Mapping Customers provides 111→78 standardization, but Quotation file still has no SAP ID (568 free-text names)' },
            { gap: 'G7: Customer segmentation missing', status: '3rd P or ICO flag exists; further segment (OEM/End-User/Research) still needed' },
          ].map((g) => (
            <ListItem key={g.gap} sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <InfoIcon fontSize="small" sx={{ color: '#F57C00' }} />
              </ListItemIcon>
              <ListItemText
                primary={<Typography variant="body2" fontWeight={600}>{g.gap}</Typography>}
                secondary={g.status}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>

    {/* Still Open */}
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} color="error.main" gutterBottom>
          Still Open Gaps (Blocking or Limiting Analytics)
        </Typography>
        <List dense>
          {[
            { gap: 'G3: No Quotation ID in SAP Orders', impact: 'Cannot trace which specific quote became which order — win/loss analysis incomplete', severity: 'HIGH' },
            { gap: 'G4: Amount paid only 23% populated', impact: 'Cannot compute actual DSO, AR aging, or cash conversion cycle', severity: 'HIGH' },
            { gap: 'G8: Sales rep / account owner not captured', impact: 'Cannot attribute revenue to sales team — no performance tracking', severity: 'MEDIUM' },
            { gap: 'G9: Lost reason for unconverted quotes', impact: '82% of quotes don\'t convert — no insight into why (competition? pricing? project cancelled?)', severity: 'MEDIUM' },
            { gap: 'G10: Invoice-level detail missing', impact: 'Invoice amounts exist but no line-level breakout for revenue recognition', severity: 'LOW' },
            { gap: 'G11: Credit limit data absent', impact: 'Cannot assess customer credit risk exposure', severity: 'LOW' },
            { gap: 'G13: No delivery actual vs requested', impact: 'Cannot measure on-time delivery KPI accurately', severity: 'MEDIUM' },
            { gap: 'G14: Forecast vs Actual not structured', impact: 'Forecast info is a free-form grid, not easily joinable to actuals for accuracy measurement', severity: 'MEDIUM' },
          ].map((g) => (
            <ListItem key={g.gap} sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <ErrorIcon fontSize="small" color={g.severity === 'HIGH' ? 'error' : 'warning'} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2" fontWeight={600}>{g.gap}</Typography>
                    <Chip label={g.severity} size="small" sx={{
                      fontSize: '0.6rem', height: 18,
                      bgcolor: g.severity === 'HIGH' ? '#FFEBEE' : g.severity === 'MEDIUM' ? '#FFF3E0' : '#F5F5F5',
                      color: g.severity === 'HIGH' ? '#D32F2F' : g.severity === 'MEDIUM' ? '#E65100' : '#757575',
                    }} />
                  </Box>
                }
                secondary={g.impact}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>

    {/* Data Quality Issues */}
    <Card>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Data Quality Issues Found</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#FFF3E0' }}>
                <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Issue</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>File(s)</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Records</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Severity</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Fix Effort</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                { n: 'Q1', issue: 'Customer name variants (Sunfire GmbH/SE/Switzerland, ThyssenKrupp/Thyssenkrupp)', files: 'All files', records: '~50-80 groups', sev: 'HIGH', effort: 'Medium' },
                { n: 'Q2', issue: 'Country naming inconsistent ("Netherlands"/"Nederland"/"NL")', files: 'All files', records: '~30 countries', sev: 'MEDIUM', effort: 'Low' },
                { n: 'Q3', issue: 'Payment terms: 41+ free-text variants for ~6 categories', files: 'Sales Zirfon, Customer Master', records: '~760 rows', sev: 'MEDIUM', effort: 'Low' },
                { n: 'Q4', issue: 'Product type typos (" UTP500", "utp220")', files: 'Sales Zirfon, Quotation', records: '~10 rows', sev: 'LOW', effort: 'Low' },
                { n: 'Q5', issue: 'Shipping method variants ("courier"/"courrier")', files: 'Sales Zirfon', records: '~270 rows', sev: 'LOW', effort: 'Low' },
                { n: 'Q6', issue: 'Invalid currency codes ("40O", "40S")', files: 'Sales Zirfon', records: '2 rows', sev: 'LOW', effort: 'Low' },
                { n: 'Q7', issue: 'Status field has text legends mixed with numeric codes', files: 'Sales Zirfon', records: '~20 rows', sev: 'LOW', effort: 'Low' },
                { n: 'Q8', issue: 'SAP Customer ID stored as float (precision loss)', files: 'Customer Master', records: '296 rows', sev: 'LOW', effort: 'Low' },
                { n: 'Q9', issue: 'Column mislabeling ("Customer" = SAP ID, "Cust. nr." = Name)', files: 'Customer Master', records: 'All', sev: 'LOW', effort: 'Low' },
                { n: 'Q10', issue: 'Duplicate customer rows (Fortescue, Mecrotech, LONGi)', files: 'Customer Master', records: '6 rows', sev: 'LOW', effort: 'Low' },
              ].map((r) => (
                <TableRow key={r.n} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{r.n}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem' }}>{r.issue}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem' }}>{r.files}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem' }}>{r.records}</TableCell>
                  <TableCell>
                    <Chip label={r.sev} size="small" sx={{
                      fontSize: '0.6rem', height: 18,
                      bgcolor: r.sev === 'HIGH' ? '#FFEBEE' : r.sev === 'MEDIUM' ? '#FFF3E0' : '#F5F5F5',
                      color: r.sev === 'HIGH' ? '#D32F2F' : r.sev === 'MEDIUM' ? '#E65100' : '#757575',
                    }} />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8rem' }}>{r.effort}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  </Box>
);

// ─── SUB-TAB 5: Open Questions ───────────────────────────────────

const OpenQuestionsSection: React.FC = () => (
  <Box>
    <SectionHeader icon={<HelpOutlineIcon />} title="Open Questions" subtitle="Questions for the business / controller to validate our findings" />

    {/* Critical Questions */}
    <Alert severity="error" sx={{ mb: 2 }}>
      <AlertTitle sx={{ fontWeight: 700 }}>Critical — FY2026 Forecast Crisis</AlertTitle>
      <Typography variant="body2">
        The September 2025 forecast revision dropped FY2026 from €31.2M to €6.2M — a €25M downward revision in 2 months.
        Understanding the root cause is the #1 priority for this review.
      </Typography>
    </Alert>

    {/* Data & Systems Questions */}
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Data & Systems Questions</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#F5F7FA' }}>
                <TableCell sx={{ fontWeight: 700, width: 50 }}>#</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Question</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Why It Matters</TableCell>
                <TableCell sx={{ fontWeight: 700, width: 100 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                { n: 'Q1', q: 'Is there cost/COGS data available per product (standard cost per m²)?', why: 'Unlocks margin analysis — the #1 gap', status: 'RESOLVED', note: 'Found in Mapping Standard Costprices' },
                { n: 'Q2', q: 'Are Sunfire GmbH, Sunfire SE, and Sunfire Switzerland the same customer group?', why: 'Accurate concentration — could change top customer ranking', status: 'OPEN' },
                { n: 'Q3', q: 'Are Agfa Materials Japan and Korea intercompany? Should revenue be eliminated?', why: 'Affects "true external revenue" calculation', status: 'RESOLVED', note: '3rd P or ICO flag confirms' },
                { n: 'Q4', q: 'Is there a revenue budget/target for FY2025 and FY2026?', why: 'Budget variance analysis', status: 'RESOLVED', note: 'BUD data in forecasting files' },
                { n: 'Q5', q: 'What FX rates for JPY/KRW conversion?', why: 'Consolidated reporting', status: 'RESOLVED', note: 'SAP BI converts to EUR' },
                { n: 'Q6', q: 'Is payment data tracked in SAP FI/AR?', why: 'Cash flow analytics, DSO calculation', status: 'OPEN' },
                { n: 'Q7', q: 'Status field: 1=Open, 2=Complete — is that correct?', why: 'Accurate backlog reporting', status: 'OPEN' },
                { n: 'Q8', q: 'SAP order types ZETA, ZATA, ZACC, ZBVZ, ZARE — meanings?', why: 'Order channel classification', status: 'OPEN' },
              ].map((r) => (
                <TableRow key={r.n} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{r.n}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem' }}>{r.q}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem' }}>{r.why}</TableCell>
                  <TableCell>
                    <Chip label={r.status} size="small" sx={{
                      fontSize: '0.6rem',
                      bgcolor: r.status === 'RESOLVED' ? '#E8F5E9' : '#FFF3E0',
                      color: r.status === 'RESOLVED' ? '#2E7D32' : '#E65100',
                    }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>

    {/* Business Context Questions */}
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Business Context Questions</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#F5F7FA' }}>
                <TableCell sx={{ fontWeight: 700, width: 50 }}>#</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Question</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Why It Matters</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                { n: 'Q9', q: 'What is the typical production lead time for Zirfon membranes?', why: 'Order-to-delivery KPI benchmarking' },
                { n: 'Q10', q: 'Is there a capacity constraint? Max production volume in m²/year?', why: 'Forecasting ceiling, capacity utilization KPI' },
                { n: 'Q11', q: 'Are there framework/blanket agreements with TK Nucera, Sunfire?', why: 'Separating committed vs at-risk revenue in forecasts' },
                { n: 'Q12', q: 'What drove the 2023→2024 revenue jump (€11.5M → €33.4M)?', why: 'Was it one-time (NEOM) or structural? — 2026 forecast calibration' },
                { n: 'Q13', q: 'Why is 2025 growth only 7.1% after 191% in 2024?', why: 'Market saturation, capacity constraint, or pipeline timing?' },
                { n: 'Q14', q: 'What happened between July and September 2025 to cause the FY2026 forecast crash?', why: 'Root cause: contracts cancelled/delayed? Market downturn? — THE #1 QUESTION' },
                { n: 'Q15', q: 'Is the H₂ electrolyser market in a downturn, or is this Zirfon-specific?', why: 'Differentiates market risk from company-specific risk' },
                { n: 'Q16', q: 'Are known large deals expected for 2026-2027 beyond current forecast?', why: 'Revenue visibility and forecast completeness' },
                { n: 'Q17', q: 'Why do 82% of quotations NOT convert?', why: 'Competition, pricing, project cancellation? — Conversion improvement strategy' },
                { n: 'Q18', q: 'Are Credit Notes related to quality issues, pricing adjustments, or returns?', why: 'Revenue quality and customer satisfaction insight' },
              ].map((r) => (
                <TableRow key={r.n} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{r.n}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem' }}>{r.q}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem' }}>{r.why}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>

    {/* Reporting Preferences */}
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Reporting Preferences to Confirm</Typography>
        <Grid container spacing={2}>
          {[
            { q: 'Fiscal year = Calendar year?', note: 'Currently assuming Jan–Dec' },
            { q: 'Currency reporting preference?', note: 'Dashboard shows EUR only — multi-currency needed?' },
            { q: 'Detail level required?', note: 'Executive KPIs + drill-down to customer/order? Both?' },
            { q: 'Reporting cadence?', note: 'Monthly? Weekly? Real-time? Determines data refresh strategy' },
          ].map((r) => (
            <Grid size={{ xs: 12, md: 3 }} key={r.q}>
              <Box sx={{ p: 2, bgcolor: '#F5F7FA', borderRadius: 2, height: '100%' }}>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>{r.q}</Typography>
                <Typography variant="caption" color="text.secondary">{r.note}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>

    {/* Key Discoveries Summary */}
    <Card>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>6 Key Discoveries from Data Analysis</Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {[
            { n: 1, title: 'FY2026 Forecast Crisis', desc: '€6.2M vs €31.2M prior forecast — €25M downward revision between July and September 2025. Only 36% of budget.', color: '#D32F2F' },
            { n: 2, title: 'Long-Term Plans Disconnect', desc: 'PLAN 2027=€38.6M requires 6.2x growth from FY2026 in one year. Plans may not be updated post-crash.', color: '#F57C00' },
            { n: 3, title: 'Margin Compression in 2026', desc: 'Q1 2026 GM: 51.4% — down from 58-68% in FY2025. UTP220 dropped to 42.8%. Cost inflation or price erosion.', color: '#F57C00' },
            { n: 4, title: 'TK Nucera NEOM — Key Variable', desc: '20 batches remaining × €949K = ~€19M. Whether these deliver or not drives the entire forecast outlook.', color: '#1565C0' },
            { n: 5, title: 'Systematic Forecast Optimism Bias', desc: 'FY2025 missed budget by 15.1%. Each RFC cycle revises downward. Need bias correction in models.', color: '#7B1FA2' },
            { n: 6, title: 'Entirely Manual Forecasting', desc: 'Controller assembles from SAP BI + Ann Bals order file + last 3 months quotes + manual TK Nucera. High error risk.', color: '#78909C' },
          ].map((d) => (
            <Grid size={{ xs: 12, md: 4 }} key={d.n}>
              <Box sx={{ p: 2, borderRadius: 2, border: `2px solid ${d.color}20`, bgcolor: `${d.color}08`, height: '100%' }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Chip label={`#${d.n}`} size="small" sx={{ bgcolor: d.color, color: '#fff', fontWeight: 700, fontSize: '0.7rem' }} />
                  <Typography variant="subtitle2" fontWeight={700}>{d.title}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>{d.desc}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  </Box>
);

export default DataOverviewTab;
