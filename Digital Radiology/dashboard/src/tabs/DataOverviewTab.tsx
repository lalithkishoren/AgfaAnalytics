import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Chip, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Accordion, AccordionSummary, AccordionDetails, Alert, AlertTitle,
  Tabs, Tab, List, ListItem, ListItemIcon, ListItemText,
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
import CloudOffIcon from '@mui/icons-material/CloudOff';

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; subtitle?: string }> = ({ icon, title, subtitle }) => (
  <Box display="flex" alignItems="center" gap={1.5} mb={2}>
    <Box sx={{ color: '#1565C0', display: 'flex' }}>{icon}</Box>
    <Box>
      <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 700 }}>{title}</Typography>
      {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
    </Box>
  </Box>
);

const SystemChip: React.FC<{ system: string }> = ({ system }) => {
  const config: Record<string, { bg: string; color: string }> = {
    'D365 CRM': { bg: '#E3F2FD', color: '#1565C0' },
    'SAP BW': { bg: '#FFF3E0', color: '#E65100' },
    'SAP SD/FI': { bg: '#FFF8E1', color: '#F57F17' },
    'Manual / SharePoint': { bg: '#F3E5F5', color: '#7B1FA2' },
    'Power BI Transform': { bg: '#E8F5E9', color: '#2E7D32' },
    'DirectQuery': { bg: '#FFEBEE', color: '#B71C1C' },
    'EDW Required': { bg: '#FFEBEE', color: '#B71C1C' },
  };
  const c = config[system] ?? { bg: '#F5F5F5', color: '#616161' };
  return <Chip label={system} size="small" sx={{ fontSize: '0.68rem', bgcolor: c.bg, color: c.color, fontWeight: 600 }} />;
};

const DataOverviewTab: React.FC = () => {
  const [subTab, setSubTab] = useState(0);
  const subTabs = ['Data Sources', 'Data Model', 'KPI Definitions', 'Data Gaps', 'Open Questions'];

  return (
    <Box>
      {/* Header Banner */}
      <Card sx={{ mb: 2, background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 50%, #00897B 100%)', color: '#fff' }}>
        <CardContent sx={{ py: 3 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Data Overview — How This Dashboard Was Built
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, maxWidth: 900 }}>
            This tab documents every data source, the data model, KPI definitions, identified gaps, and open questions
            from the analysis of AGFA Digital Radiology's existing Power BI reports. It serves as a transparent
            methodology reference for the business review team and the EDW build team.
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1.5} mt={2}>
            <Chip label="6 Power BI Reports" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }} />
            <Chip label="17 Import-Mode CSV Tables" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }} />
            <Chip label="2 DirectQuery Tables (SAP BW)" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }} />
            <Chip label="~2M rows extracted" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }} />
            <Chip label="10 JSON outputs" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }} />
            <Chip label="3 Source Systems" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }} />
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
    <SectionHeader icon={<StorageIcon />} title="Data Sources" subtitle="6 Power BI reports → 17 import-mode tables + 2 DirectQuery tables" />

    {/* Source Systems Overview */}
    <Grid container spacing={2} sx={{ mb: 2 }}>
      {[
        { system: 'Microsoft Dynamics 365 CRM', icon: '🏢', desc: 'Core CRM — opportunity pipeline, account master, product lines, margin estimates, DS%/DH%/Feasibility scores', color: '#E3F2FD', border: '#1565C0', tables: '4 tables extracted' },
        { system: 'SAP (AP2 + AP5 Systems)', icon: '⚙️', desc: 'Posted actuals — Net Turnover EUR, Calculated Cost APX, channel, product family. FeedFile is the SAP sales document ledger.', color: '#FFF3E0', border: '#E65100', tables: 'FeedFile + DirectQuery (BP5/BP2)' },
        { system: 'Manual Excel / SharePoint', icon: '📊', desc: 'Reference and master data files maintained manually — dealer lists, targets, product family mapping, region hierarchies.', color: '#F3E5F5', border: '#7B1FA2', tables: '7 reference files' },
        { system: 'Power BI Calculated Tables', icon: '🔄', desc: 'Tables built inside Power BI using M query transformations of CRM data — weekly snapshots, funnel tracking, running totals.', color: '#E8F5E9', border: '#2E7D32', tables: '3 calculated tables' },
      ].map((s) => (
        <Grid size={{ xs: 12, md: 3 }} key={s.system}>
          <Card sx={{ height: '100%', border: `1px solid ${s.border}`, bgcolor: s.color }}>
            <CardContent>
              <Typography variant="h4" sx={{ mb: 1 }}>{s.icon}</Typography>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>{s.system}</Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>{s.desc}</Typography>
              <Chip label={s.tables} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.7)', fontSize: '0.65rem' }} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>

    {/* Power BI Reports and their extracted tables */}
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Power BI Reports — Extract Summary</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#F5F7FA' }}>
                <TableCell sx={{ fontWeight: 700 }}>PBIX Report</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Folder</TableCell>
                <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Tables</TableCell>
                <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Rows</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Mode</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Primary Source</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                { report: 'Commercial Analytics — OIT Margin & Product Mix 2026', folder: 'Dashboards1', tables: 14, rows: '338,624', mode: 'Import', source: 'D365 CRM + SAP BW' },
                { report: 'Partner Dashboard', folder: 'Dashboards2', tables: 9, rows: '1,088,511', mode: 'Import', source: 'SAP SD/FI (FeedFile) + Manual Excel' },
                { report: 'Commercial Analytics — Weekly FC Tracker', folder: 'Dashboards2', tables: 2, rows: '34,919', mode: 'Import', source: 'D365 CRM → Power BI Transform' },
                { report: 'Price Margin Modalities', folder: 'Dashboards2', tables: 0, rows: '—', mode: 'DirectQuery', source: 'SAP BW (AP5/BP5 + AP2/BP2)' },
                { report: 'Commercial Analytics — Funnel Evolution Tracker', folder: 'Dashboards3', tables: 1, rows: '499,796', mode: 'Import', source: 'D365 CRM → Power BI Transform' },
                { report: 'Commercial Analytics — OI & Funnel Health Cockpit', folder: 'Dashboards3', tables: 3, rows: '26,466', mode: 'Import', source: 'D365 CRM → Power BI Transform' },
              ].map((r) => (
                <TableRow key={r.report} hover>
                  <TableCell sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{r.report}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', fontFamily: 'monospace', color: '#1565C0' }}>{r.folder}</TableCell>
                  <TableCell sx={{ textAlign: 'right', fontSize: '0.8rem' }}>{r.tables}</TableCell>
                  <TableCell sx={{ textAlign: 'right', fontSize: '0.8rem' }}>{r.rows}</TableCell>
                  <TableCell>
                    <Chip label={r.mode} size="small" sx={{
                      fontSize: '0.68rem', fontWeight: 600,
                      bgcolor: r.mode === 'DirectQuery' ? '#FFEBEE' : '#E8F5E9',
                      color: r.mode === 'DirectQuery' ? '#B71C1C' : '#2E7D32',
                    }} />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{r.source}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>

    {/* Import Mode Tables Detail */}
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Import-Mode CSV Files (17 tables — data cached in PBIX)</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#F5F7FA' }}>
                <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>File</TableCell>
                <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Rows</TableCell>
                <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Cols</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Upstream Source</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>System</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Used For</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                { n: 1, file: 'msd data.csv', rows: '28,902', cols: 55, source: 'D365 opportunity + joins', system: 'D365 CRM', use: 'OIT fact — Won + Open deals, margins, equipment type, region' },
                { n: 2, file: 'opportunity.csv', rows: '46,523', cols: 46, source: 'D365 opportunity (full history)', system: 'D365 CRM', use: 'Win/loss analysis, DS%/DH%/Feasibility scores, pipeline history' },
                { n: 3, file: 'opportunityproduct.csv', rows: '135,177', cols: 12, source: 'D365 opportunityproduct', system: 'D365 CRM', use: 'Line-level product detail per opportunity, budget class' },
                { n: 4, file: 'account.csv', rows: '76,481', cols: 3, source: 'D365 cr57c_crm_account', system: 'D365 CRM', use: 'Account master — SAP customer ID (cr57c_agfa_saprecordid), country' },
                { n: 5, file: 'raw data.csv', rows: '22,144', cols: 44, source: 'SAP BW extract (budget/price)', system: 'SAP BW', use: 'Price, budget, list price, min price by config level and region' },
                { n: 6, file: 'DataWeek.csv', rows: '34,918', cols: 51, source: 'D365 CRM → PBI M query', system: 'Power BI Transform', use: 'Weekly snapshot W03–W12 of open pipeline by flag, KAM, subregion' },
                { n: 7, file: 'T funnel health.csv', rows: '26,464', cols: 31, source: 'D365 CRM → PBI M query', system: 'Power BI Transform', use: 'Weekly running totals RT CY/BT/PY/FC by destination/region' },
                { n: 8, file: 'T funnel evolution tracker.csv', rows: '499,796', cols: 60, source: 'D365 CRM → PBI M query', system: 'Power BI Transform', use: 'Full funnel evolution — deal-level weekly snapshots for trend analysis' },
                { n: 9, file: 'FeedFile.csv', rows: '1,082,674', cols: 44, source: 'SAP SD/FI posted documents', system: 'SAP SD/FI', use: 'SAP actuals — Net Turnover EUR, Calculated Cost APX, channel, partner revenue 2023–2026' },
                { n: 10, file: 'DealerList xl.csv', rows: '754', cols: 10, source: 'Manual Excel on SharePoint', system: 'Manual / SharePoint', use: 'Dealer master — SAP Bill-to ID, channel manager, dealer type' },
                { n: 11, file: 'DealerList_TargetSetting xl.csv', rows: '3,928', cols: 12, source: 'Manual Excel on SharePoint', system: 'Manual / SharePoint', use: 'Monthly dealer targets and forecasts by SAP ID' },
                { n: 12, file: 'ProductFamilyList xl.csv', rows: '94', cols: 11, source: 'Manual Excel on SharePoint', system: 'Manual / SharePoint', use: 'Product family → budget class → modality → main equipment mapping' },
                { n: 13, file: 'Region partner dashboard xl.csv', rows: '278', cols: 8, source: 'Manual Excel on SharePoint', system: 'Manual / SharePoint', use: 'Country code → Report Group Region hierarchy for Partner Dashboard' },
                { n: 14, file: 'mapping.csv', rows: '271', cols: 6, source: 'Manual reference in Power BI', system: 'Manual / SharePoint', use: 'Master country → Subregion → Region hierarchy (271 destinations)' },
                { n: 15, file: 'msd data sub-region.csv', rows: '39', cols: 4, source: 'Manual reference in Power BI', system: 'Manual / SharePoint', use: 'SubRegion → Area → Region → Cluster lookup' },
                { n: 16, file: 'New Cluster/Region Table.csv', rows: '41', cols: 4, source: 'Manual reference in Power BI', system: 'Manual / SharePoint', use: 'Country → Region → Cluster → Area mapping' },
                { n: 17, file: 'Budget Quarter.csv', rows: '4', cols: 3, source: 'Entered in Power BI', system: 'Manual / SharePoint', use: '2026 quarter slicer reference (Q1–Q4)' },
              ].map((r) => (
                <TableRow key={r.n} hover>
                  <TableCell sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>{r.n}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 600, color: '#1565C0' }}>{r.file}</TableCell>
                  <TableCell sx={{ textAlign: 'right', fontSize: '0.75rem' }}>{r.rows}</TableCell>
                  <TableCell sx={{ textAlign: 'right', fontSize: '0.75rem' }}>{r.cols}</TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>{r.source}</TableCell>
                  <TableCell><SystemChip system={r.system} /></TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', color: 'text.secondary', maxWidth: 220 }}>{r.use}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>

    {/* DirectQuery Tables */}
    <Card sx={{ mb: 2, border: '1px solid #EF9A9A', bgcolor: '#FFFBFB' }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1.5} mb={2}>
          <CloudOffIcon sx={{ color: '#B71C1C' }} />
          <Box>
            <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#B71C1C' }}>DirectQuery Tables — No Data Cached (Price Margin Modalities)</Typography>
            <Typography variant="caption" color="text.secondary">These tables query SAP BW live at report runtime. No data is stored in the PBIX file — cannot be extracted statically.</Typography>
          </Box>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#FFEBEE' }}>
                <TableCell sx={{ fontWeight: 700 }}>Table</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>SAP System</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>BW Query</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Key Fields</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Key Measures</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: 600 }}>Q price realisation extra</TableCell>
                <TableCell><Chip label="SAP AP5 (BP5)" size="small" sx={{ bgcolor: '#FFF3E0', color: '#E65100', fontSize: '0.68rem' }} /></TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>BP5 — YTD Actuals, BU = K4/DR Solutions</TableCell>
                <TableCell sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>Posting Date, Destination, Product Family, Material, Sales Document, Opportunity (CRM link), Bill-to party, Ship-to party, Functional Area</TableCell>
                <TableCell sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>Net Turnover EUR, Sales Quantity, Sofon Cost+, Gross Margin, Discount, Regional List Price, ENP</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: 600 }}>Q price realisation extra 2</TableCell>
                <TableCell><Chip label="SAP AP2 (BP2)" size="small" sx={{ bgcolor: '#FFF3E0', color: '#E65100', fontSize: '0.68rem' }} /></TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>BP2 — Actuals, BU = K4/DR Solutions</TableCell>
                <TableCell sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>Posting Date, SAP Destination, Sales Organization, Product Family, Material, Customer, Ship-to Party</TableCell>
                <TableCell sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>Net Turnover (ENP prefix), Sales Quantity (alt. UoM)</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Alert severity="warning" sx={{ mt: 2 }}>
          <AlertTitle>Why BP5 and BP2 are separate queries</AlertTitle>
          BP5 (AP5 system) includes the <strong>Syracuse/SalesOne Opportunity ID</strong> — enabling drill-through from price realization to individual CRM opportunities.
          BP2 (AP2 system) has the <strong>ENP (Effective Net Price)</strong> metric used in the Goods Waterfall.
          Both are required for the full price realization analysis.
        </Alert>
      </CardContent>
    </Card>

    {/* Skipped Columns Note */}
    <Card>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Skipped Columns — Extraction Limitation</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          Free-text "name" columns with high cardinality fail to extract due to a compressed dictionary page bug in pbixray 0.5.0.
          All numeric, date, and categorical columns extract correctly — KPIs and measures are unaffected.
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#F5F7FA' }}>
                <TableCell sx={{ fontWeight: 700 }}>Column Pattern</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Affected Tables</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Business Impact</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                { pattern: 'Opportunity / Account names', tables: 'opportunity, msd data, DataWeek, T funnel evolution tracker', impact: 'Deals shown by ID only. Customer names require EDW CRM connection.' },
                { pattern: 'Sold-to / Bill-to / Ship-to party names', tables: 'FeedFile, DealerList xl, DataWeek', impact: 'Top dealers shown by SAP ID only — not resolved to partner name.' },
                { pattern: 'Product / Material names', tables: 'opportunityproduct, FeedFile', impact: 'Product shown by code. ProductFamilyList xl resolves families, not materials.' },
                { pattern: 'Channel Manager Name', tables: 'FeedFile', impact: 'Channel manager analysis requires SAP/CRM name lookup.' },
                { pattern: 'Address fields (city, postal code)', tables: 'account', impact: 'Sub-country geographic analysis not available from import-mode data.' },
              ].map((r, i) => (
                <TableRow key={i} hover>
                  <TableCell sx={{ fontSize: '0.78rem', fontWeight: 600 }}>{r.pattern}</TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#1565C0' }}>{r.tables}</TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>{r.impact}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  </Box>
);

// ─── SUB-TAB 2: Data Model ───────────────────────────────────────

const DataModelSection: React.FC = () => (
  <Box>
    <SectionHeader icon={<SchemaIcon />} title="Data Model" subtitle="How the 3 source systems connect — and where the joins are missing" />

    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Entity Relationship — Current State (Power BI Import Mode)</Typography>
        <Box sx={{ p: 2, bgcolor: '#F5F7FA', borderRadius: 2, fontFamily: 'monospace', fontSize: '0.72rem', lineHeight: 1.8, overflowX: 'auto' }}>
          <Box component="pre" sx={{ margin: 0, whiteSpace: 'pre-wrap' }}>
{`  D365 CRM (Dataverse)                          SAP SD / FI
  ─────────────────────                          ───────────
  cr57c_crm_account                              FeedFile.csv
  (account.csv — 76k rows)                       (1,082,674 rows — SAP posted actuals)
  PK: cr57c_accountid                            Fields: Posting Date, Net Turnover EUR,
  Has: cr57c_agfa_saprecordid ──────────────────► Calculated Cost APX, Channel,
         (SAP Customer ID)                        Bill-to party (SAP ID), Product Family
         ✅ Link exists in data                   source_ = AP2 or AP5
         ❌ Not used in any current report
         │
         ▼
  opportunity.csv (46,523 rows)                  SAP BW — DirectQuery only
  PK: opportunityid                              ─────────────────────────
  Has: agfa_saporderid ──────────────────────── ► Q price realisation extra (BP5/AP5)
         ✅ Set on Won deals (1,716 found)          Net Turnover, Sofon Cost+, Gross Margin
         ❌ SAP order not yet joined in PBI         Discount, Opportunity link (CRM ID)
                                                 ► Q price realisation extra 2 (BP2/AP2)
  opportunityproduct.csv (135,177 rows)            ENP, Net Turnover
  FK: opportunityid → opportunity                ❌ Both are DirectQuery — no local data
  Has: agfa_budgetclass, margin %, product

  ── Power BI Calculated Tables ──
  DataWeek.csv (34,918 rows)         ← M query on opportunity
  T funnel health.csv (26,464 rows)  ← M query aggregation
  T funnel evolution tracker.csv (499,796 rows) ← M query on opportunity

  ── Manual Reference Files ──
  mapping.csv (271 rows)             country → subregion → region hierarchy
  DealerList xl.csv (754 rows)       dealer SAP ID → channel manager
  ProductFamilyList xl.csv (94 rows) budget class → product family → modality
  Region partner dashboard xl.csv    country code → report region (Partner Dashboard)
  msd data sub-region.csv (39 rows)  subregion → area → region → cluster`}
          </Box>
        </Box>
      </CardContent>
    </Card>

    <Card sx={{ mb: 2, border: '2px solid #1565C0', bgcolor: '#E3F2FD' }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ color: '#1565C0' }}>The Critical Join — What the EDW Must Build</Typography>
        <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 2, fontFamily: 'monospace', fontSize: '0.72rem', lineHeight: 2, overflowX: 'auto' }}>
          <Box component="pre" sx={{ margin: 0, whiteSpace: 'pre-wrap' }}>
{`  CRM opportunity (Won)
         │
         │  agfa_saporderid  ◄── THIS JOIN IS THE KEY
         │  (field exists in CRM data — 1,716 Won deals have a value)
         │  (never joined to SAP in any current Power BI report)
         ▼
  SAP Sales Order
         │
         ├── Delivery Status ──────────────────► Layer 3: Order Book (backlog)
         │   (Open / In Delivery / Invoiced)      WHO ordered? WHEN expected?
         │
         ├── Invoice Posting Date ────────────► Layer 4: Revenue Reco
         │   (= Posting Date in FeedFile)         WHEN was it invoiced?
         │
         └── Calculated Cost APX ─────────────► Layer 5: Actual Margin
             (already in FeedFile — but not        CRM estimate vs SAP actual
              joined back to CRM deal level)`}
          </Box>
        </Box>
        <Typography variant="body2" sx={{ mt: 1, color: '#1565C0', fontWeight: 500 }}>
          One join unlocks Layers 3, 4, and 5 simultaneously. This is the single most important technical dependency in the EDW design.
        </Typography>
      </CardContent>
    </Card>

    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>Join Quality — Current State</Typography>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#F5F7FA' }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Join</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Match Rate</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  { join: 'opportunity → account (accountid)', match: '~90%+', status: 'Used', ok: true },
                  { join: 'opportunityproduct → opportunity (opportunityid)', match: '~100%', status: 'Used', ok: true },
                  { join: 'opportunity.agfa_saporderid → SAP order', match: '1,716 / Won deals', status: '❌ Not built', ok: false },
                  { join: 'account.cr57c_agfa_saprecordid → FeedFile Bill-to', match: 'Unknown', status: '❌ Not built', ok: false },
                  { join: 'FeedFile → DealerList xl (Bill-to party)', match: 'Partial', status: '⚠ Name missing', ok: false },
                  { join: 'opportunity → Q price realisation (SalesOne ID)', match: 'Possible via BP5', status: '❌ DirectQuery only', ok: false },
                ].map((r, i) => (
                  <TableRow key={i} hover>
                    <TableCell sx={{ fontSize: '0.72rem', fontFamily: 'monospace' }}>{r.join}</TableCell>
                    <TableCell sx={{ fontSize: '0.72rem' }}>{r.match}</TableCell>
                    <TableCell>
                      <Chip label={r.status} size="small" sx={{
                        fontSize: '0.65rem',
                        bgcolor: r.ok ? '#E8F5E9' : '#FFEBEE',
                        color: r.ok ? '#2E7D32' : '#B71C1C',
                      }} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>Geography Hierarchy</Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
              Two slightly different hierarchies exist across the 6 reports — both map to the same 3 Group of Regions.
            </Typography>
            <Box sx={{ p: 1.5, bgcolor: '#F5F7FA', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.7rem', lineHeight: 1.8 }}>
              <Box component="pre" sx={{ margin: 0 }}>
{`Group of Regions (3)
  Europe-Pacific
  Intercontinental
  North America
    └── Subregion (22)
          DACH, Europe North, Europe East & South,
          Iberia, Africa, Middle East, N.LATAM,
          S.LATAM, Brazil, India, ASEAN, HK,
          Oceania, USA, Canada, Mexico...
            └── Region / Destination (271 entries)
                  Country codes + aliases
                  (e.g. CZECH REPUBLIC = BOHEMIA-HERZ.)`}
              </Box>
            </Box>
            <Alert severity="info" sx={{ mt: 1.5, fontSize: '0.75rem' }}>
              mapping.csv (OIT reports) and Region partner dashboard xl.csv (Partner Dashboard) are two separate geography files — they must be unified in the EDW.
            </Alert>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

// ─── SUB-TAB 3: KPI Definitions ─────────────────────────────────

const KpiDefinitionsSection: React.FC = () => (
  <Box>
    <SectionHeader icon={<BarChartIcon />} title="KPI Definitions" subtitle="What each metric means, how it is calculated, and its data confidence level" />

    {[
      {
        category: 'Order Intake (OIT)', color: '#E3F2FD', border: '#1565C0',
        kpis: [
          { name: 'OIT YTD', formula: 'SUM(actualvalue_base) WHERE statecodename=Won AND Year_Actual=2026', source: 'msd data.csv', confidence: 'Verified ✅', note: 'Excludes SMA (Service & Maintenance Agreements) per agfa_estordervalueexcludingsmaamount_base field' },
          { name: 'Won Deals Count', formula: 'COUNT(opportunityid) WHERE statecodename=Won AND Year_Actual=2026', source: 'msd data.csv', confidence: 'Verified ✅', note: 'W12 2026 = 200 deals' },
          { name: 'Avg Deal Size', formula: 'OIT YTD / Won Deals Count', source: 'Derived', confidence: 'Derived 🔵', note: 'Simple average — not weighted by equipment type or margin' },
          { name: 'OIT vs Budget', formula: '(OIT YTD / Budget YTD) – 1', source: 'msd data.csv + Budget Quarter.csv', confidence: 'Estimated ⚠', note: 'Budget loaded as quarterly totals only — monthly phasing not available in import mode' },
        ]
      },
      {
        category: 'Pipeline & Funnel', color: '#E8F5E9', border: '#2E7D32',
        kpis: [
          { name: 'Open Pipeline Total', formula: 'SUM(estimatedvalue_base) WHERE statecodename=Open (all forecast flags)', source: 'opportunity.csv', confidence: 'Verified ✅', note: 'W12 2026 = €343.5M across 2,499 open opportunities' },
          { name: 'Pipeline Coverage', formula: 'Open Pipeline Total / (OIT YTD × 4)', source: 'Derived', confidence: 'Derived 🔵', note: 'Annualises Q1 OIT as proxy for full-year run rate. Playbook target = 2.5×' },
          { name: 'RT CY / RT BT / RT PY', formula: 'Cumulative weekly OIT actual / budget / prior year', source: 'T funnel health.csv', confidence: 'Verified ✅', note: 'RT = Running Total. CY=Current Year, BT=Budget, PY=Prior Year. W12 RT CY = €7.4M' },
          { name: 'Weighted Amount', formula: 'SUM(agfa_weightedamountexcludingsma_base)', source: 'DataWeek.csv / opportunity.csv', confidence: 'Verified ✅', note: 'Weighted by DS% × DH% × Feasibility%. Client-calculated scores treated as reliable inputs.' },
          { name: '2× Upside Rule', formula: 'Upside / Included with Risk ≥ 2.0 per region', source: 'DataWeek.csv', confidence: 'Estimated ⚠', note: 'Playbook rule: Upside must always be ≥2× Included with Risk. Not tracked in current reports.' },
        ]
      },
      {
        category: 'Deal Scoring', color: '#F3E5F5', border: '#7B1FA2',
        kpis: [
          { name: 'DS% (Deal Sign)', formula: 'agfa_dsdealsigncodename — CRM field', source: 'msd data.csv / opportunity.csv', confidence: 'Verified ✅', note: 'Client-calculated score — probability deal will be signed. Reliable input per playbook.' },
          { name: 'DH% (Deal Happen)', formula: 'agfa_dhdealhappencodename — CRM field', source: 'msd data.csv / opportunity.csv', confidence: 'Verified ✅', note: 'Client-calculated score — probability the opportunity happens at all (vs not buying).' },
          { name: 'Feasibility %', formula: 'agfa_feasibilitycode — CRM field (0–90)', source: 'msd data.csv / opportunity.csv', confidence: 'Verified ✅', note: 'Technical feasibility score. All three scores are used in Weighted Amount calculation.' },
          { name: 'Forecast Flag', formula: 'msdyn_forecastcategoryname — D365 forecast module', source: 'DataWeek.csv / msd data.csv', confidence: 'Verified ✅', note: 'Values: Won / Included and Secured / Included / Included with Risk / Upside / Excluded' },
        ]
      },
      {
        category: 'Margin (Estimated / Proxy)', color: '#FFF3E0', border: '#E65100',
        kpis: [
          { name: 'CRM Margin %', formula: 'agfa_margincostpercentagetotal — KAM-entered at deal creation', source: 'msd data.csv', confidence: 'Estimated ⚠', note: 'NOT actual SAP margin. KAM estimate at time of deal — wide variance expected. ~40% average.' },
          { name: 'HW / Impl / License / Service Margin %', formula: 'agfa_margincostpercentage[hardware/implementation/internallicenses/servicecontracts]', source: 'msd data.csv', confidence: 'Estimated ⚠', note: 'Component margins entered by KAM in Sofon. Sofon standard ≠ SAP actual.' },
          { name: 'Actual SAP Margin', formula: '(Net Turnover EUR – Calculated Cost APX) / Net Turnover EUR', source: 'FeedFile.csv (aggregated)', confidence: 'Verified ✅ (Goods only)', note: 'SAP actual posted cost. Available in FeedFile but at channel/product level — not joined to CRM deal.' },
          { name: 'Standard Margin (Sofon)', formula: '(Net Turnover – Sofon Cost+) / Net Turnover', source: 'Q price realisation extra (DirectQuery)', confidence: 'Proxy 🔴 (not connected)', note: 'Sofon Cost+ = standard cost from quoting tool. More reliable than CRM estimate but not SAP actual.' },
        ]
      },
      {
        category: 'Revenue (Order Book / Reco)', color: '#FFEBEE', border: '#B71C1C',
        kpis: [
          { name: 'Won with SAP Order ID', formula: 'COUNT(opportunityid) WHERE agfa_saporderid IS NOT NULL AND statecodename=Won', source: 'msd data.csv', confidence: 'Derived 🔵', note: '1,716 Won deals have a SAP Order ID. This is the bridge to SAP but join is not built yet.' },
          { name: 'Planned Reco Count', formula: 'COUNT(opportunityid) WHERE agfa_plannedrevenuerecognitiondate IS NOT NULL AND statecodename=Open', source: 'msd data.csv', confidence: 'Estimated ⚠', note: '2,451 open deals with a planned reco date set. SAP delivery confirmation not yet linked.' },
          { name: 'Order Book (Backlog)', formula: 'SUM(value) WHERE Won AND not yet invoiced in SAP', source: 'Requires EDW', confidence: 'EDW Required 🔴', note: 'Not available in any current report. Requires agfa_saporderid → SAP order delivery status join.' },
          { name: 'Actual Revenue Reco', formula: 'SUM(Net Turnover EUR) by Invoice Posting Date', source: 'Requires EDW', confidence: 'EDW Required 🔴', note: 'FeedFile has posting dates but cannot be joined back to CRM deal-level planned reco dates without EDW.' },
        ]
      },
    ].map((cat) => (
      <Accordion key={cat.category} defaultExpanded sx={{ mb: 1, border: `1px solid ${cat.border}` }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: cat.color }}>
          <Typography variant="subtitle1" fontWeight={700}>{cat.category}</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#F5F7FA' }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>KPI</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Formula / Definition</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Source</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Confidence</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cat.kpis.map((k, i) => (
                  <TableRow key={i} hover>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.78rem' }}>{k.name}</TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#1565C0' }}>{k.formula}</TableCell>
                    <TableCell sx={{ fontSize: '0.72rem' }}>{k.source}</TableCell>
                    <TableCell sx={{ fontSize: '0.72rem', whiteSpace: 'nowrap' }}>{k.confidence}</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>{k.note}</TableCell>
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
    <SectionHeader icon={<WarningAmberIcon />} title="Data Gaps" subtitle="What the current reports cannot answer — and what the EDW must fix" />

    {/* Lifecycle Layer Coverage */}
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Financial Lifecycle Layer Coverage</Typography>
        <Box sx={{ p: 2, bgcolor: '#F5F7FA', borderRadius: 2, fontFamily: 'monospace', fontSize: '0.72rem', lineHeight: 2, overflowX: 'auto' }}>
          <Box component="pre" sx={{ margin: 0 }}>
{`         LAYER 1      LAYER 2      LAYER 3      LAYER 4      LAYER 5
         PIPELINE     OIT          ORDER BOOK   RECO         MARGIN

CURRENT  ████████     ████████     ░░░░░░░░     ░░░░░░░░     ████░░░░
         STRONG ✅    STRONG ✅    EMPTY ❌      EMPTY ❌     PARTIAL ⚠

Reports  R1,R4,R5,R6  R1–R6        — (0 pages)  — (0 pages)  R2,R3,R4
         36 pages     43 pages     not tracked  not tracked  3 sources,
                      touch OIT                              unreliable

NEW EDW  ████████     ████████     ████████     ████████     ████████
         + Win/Loss   + New/Expand + Aging       + Phasing    + Bridge
         + Velocity   + Segment    + Milestones  + Overdue    + Actual
         + 2× Rule    + B&B        + By region   + Alerts     vs Standard`}
          </Box>
        </Box>
      </CardContent>
    </Card>

    {/* Gap Detail Table */}
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Gap Register — 12 Identified Gaps</Typography>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#F5F7FA' }}>
              <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Layer</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Gap</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Business Impact</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Data Required</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Severity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              { n: 1, layer: 'Layer 3', gap: 'Order Book / Backlog not tracked', impact: 'Won orders between OIT and Reco are completely invisible. Management cannot see delivery pipeline.', data: 'agfa_saporderid → SAP order delivery status', severity: 'Critical' },
              { n: 2, layer: 'Layer 4', gap: 'Revenue Recognition not tracked', impact: 'Reco schedule managed in manual Excel. CFO cannot see planned vs actual invoicing.', data: 'SAP invoice posting date joined to CRM planned reco date', severity: 'Critical' },
              { n: 3, layer: 'Layer 5', gap: 'Three unreconciled margin numbers', impact: 'CRM ~40% ≠ Standard ~38% ≠ SAP actual ~35%. Nobody knows which is right.', data: 'SAP Calculated Cost APX joined to CRM deal level', severity: 'Critical' },
              { n: 4, layer: 'Layer 5', gap: 'Implementation margin invisible', impact: 'FeedFile shows Goods margin only. Implementation service profitability not tracked.', data: 'FeedFile by Budget Class (Goods vs Implementation)', severity: 'High' },
              { n: 5, layer: 'Layer 5', gap: 'Margin bridge not built', impact: 'Cannot explain why margin differs from budget (Volume/Mix/Price/Cost/FX effects).', data: 'SAP BW actuals + budget data joined via EDW', severity: 'High' },
              { n: 6, layer: 'Layer 2', gap: 'New Business vs Expansion vs Renewal split missing', impact: 'agfa_maintypecodename field exists in CRM but not surfaced in any report.', data: 'msd data.csv already has this field — just needs a visual', severity: 'Medium' },
              { n: 7, layer: 'Layer 1', gap: 'Win/loss reason not tracked', impact: 'Cannot identify why deals are lost or which competitor wins. Loss reason field in CRM not used.', data: 'CRM loss reason field — requires KAM discipline to enter', severity: 'Medium' },
              { n: 8, layer: 'Layer 1', gap: 'Stage conversion rates not tracked', impact: 'Cannot measure funnel efficiency — no stage timestamp history.', data: 'CRM opportunity stage history (audit trail)', severity: 'Medium' },
              { n: 9, layer: 'Layer 1', gap: '2× Upside Rule not tracked as KPI', impact: 'Playbook rule: Upside ≥ 2× Included with Risk per region. Currently not visible anywhere.', data: 'DataWeek.csv — Upside and Included with Risk by region', severity: 'Medium' },
              { n: 10, layer: 'Layers 3–5', gap: 'Price Margin Modalities is DirectQuery — no data', impact: 'Report 3 (Price Realization) cannot be analysed without live SAP BW connection.', data: 'SAP BW BP5 (AP5) and BP2 (AP2) direct connections', severity: 'High' },
              { n: 11, layer: 'Layer 2', gap: 'Dealer names not resolved in FeedFile', impact: 'Top 15 dealers shown as SAP Bill-to IDs. DealerList xl has names but join is incomplete.', data: 'FeedFile Bill-to party → DealerList xl Dealer SAP ID join', severity: 'Low' },
              { n: 12, layer: 'All', gap: 'Two geography hierarchies not unified', impact: 'mapping.csv (CRM reports) and Region partner dashboard xl (FeedFile) are separate lookups.', data: 'Single master geography dimension in EDW', severity: 'Medium' },
            ].map((r) => (
              <TableRow key={r.n} hover>
                <TableCell sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>{r.n}</TableCell>
                <TableCell><Chip label={r.layer} size="small" sx={{ fontSize: '0.65rem', bgcolor: '#FFEBEE', color: '#B71C1C' }} /></TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.78rem' }}>{r.gap}</TableCell>
                <TableCell sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>{r.impact}</TableCell>
                <TableCell sx={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#1565C0' }}>{r.data}</TableCell>
                <TableCell>
                  <Chip label={r.severity} size="small" sx={{
                    fontSize: '0.65rem', fontWeight: 700,
                    bgcolor: r.severity === 'Critical' ? '#FFEBEE' : r.severity === 'High' ? '#FFF3E0' : r.severity === 'Medium' ? '#FFF8E1' : '#F5F5F5',
                    color: r.severity === 'Critical' ? '#B71C1C' : r.severity === 'High' ? '#E65100' : r.severity === 'Medium' ? '#F57F17' : '#616161',
                  }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    {/* EDW Phase Plan */}
    <Card>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>EDW Build Priority — Phases</Typography>
        <Grid container spacing={2}>
          {[
            {
              phase: 'Phase 1', title: 'SAP BW Connection', color: '#FFEBEE', border: '#EF5350',
              items: ['SAP BW BP5 (AP5) direct connection for Price Margin Modalities', 'SAP BW BP2 (AP2) ENP data', 'Replaces 2 DirectQuery tables with managed EDW layer', 'Unlocks: actual margin, price realization waterfall, Sofon vs actual delta'],
            },
            {
              phase: 'Phase 2', title: 'CRM → SAP Order Join', color: '#FFF3E0', border: '#FF9800',
              items: ['Build agfa_saporderid → SAP Sales Order join', 'Extract: delivery status, planned delivery date, goods issue date', 'Unlocks: Order Book backlog, delivery risk register, implementation lag'],
            },
            {
              phase: 'Phase 3', title: 'Revenue Recognition', color: '#E8F5E9', border: '#4CAF50',
              items: ['SAP invoice posting date → Revenue period mapping', 'Planned reco date (CRM) vs actual posting date (SAP) comparison', 'Revenue walk: Opening OB + OIT − Reco = Closing OB', 'Unlocks: Reco dashboard, risk register, Book & Bill tracker'],
            },
            {
              phase: 'Phase 4', title: 'Unified Data Model', color: '#E3F2FD', border: '#2196F3',
              items: ['Single geography dimension (unified mapping.csv + Region partner xl)', 'Dealer name resolution (FeedFile Bill-to → DealerList)', 'CRM → SAP cost join at deal level (actual margin per deal)', 'Margin bridge: Volume/Mix/Price/Cost/FX/Channel effects'],
            },
          ].map((ph) => (
            <Grid size={{ xs: 12, md: 3 }} key={ph.phase}>
              <Card sx={{ height: '100%', border: `1px solid ${ph.border}`, bgcolor: ph.color }}>
                <CardContent>
                  <Chip label={ph.phase} size="small" sx={{ bgcolor: ph.border, color: '#fff', fontWeight: 700, mb: 1 }} />
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>{ph.title}</Typography>
                  <List dense disablePadding>
                    {ph.items.map((item, i) => (
                      <ListItem key={i} disablePadding sx={{ mb: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 20 }}><InfoIcon sx={{ fontSize: 12, color: ph.border }} /></ListItemIcon>
                        <ListItemText primary={item} primaryTypographyProps={{ fontSize: '0.7rem', color: 'text.secondary' }} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  </Box>
);

// ─── SUB-TAB 5: Open Questions ───────────────────────────────────

const OpenQuestionsSection: React.FC = () => (
  <Box>
    <SectionHeader icon={<HelpOutlineIcon />} title="Open Questions" subtitle="Items requiring clarification from AGFA stakeholders before EDW build" />

    <Grid container spacing={2}>
      {[
        {
          category: 'SAP Connectivity', icon: <LinkIcon />, color: '#FFF3E0', border: '#E65100',
          questions: [
            { q: 'What SAP system do we connect to for the Order Book?', detail: 'FeedFile shows source_ = AP2 or AP5. Which system holds the Sales Order with delivery status? Is it the same AP5 as Price Margin BP5 query?', owner: 'IT / SAP Team' },
            { q: 'Is agfa_saporderid the same document number as in FeedFile Sale Document Nr.?', detail: 'This is the key join. If the format matches (e.g. both are 10-digit SO numbers), the join is straightforward.', owner: 'Finance / SAP Team' },
            { q: 'Can we get SAP delivery milestone dates (Goods Issue, Installation Complete)?', detail: 'These are needed for implementation lag analysis and Order Book aging buckets.', owner: 'SAP Team / Operations' },
            { q: 'Who owns the BP5 and BP2 BW queries — can they be promoted to a managed dataset?', detail: 'Currently DirectQuery from a Power BI report. EDW would consume these via a scheduled extract.', owner: 'BI Team / IT' },
          ]
        },
        {
          category: 'CRM Data Quality', icon: <ErrorIcon />, color: '#FFEBEE', border: '#EF5350',
          questions: [
            { q: 'Is agfa_plannedrevenuerecognitiondate consistently entered for all Won deals?', detail: '2,451 open deals have this field set, but we cannot verify coverage for Won deals without a full CRM extract.', owner: 'Commercial Finance' },
            { q: 'Is Loss Reason (CRM field) being used? What are the valid values?', detail: 'Win/loss analysis requires consistent loss reason entry. If KAMs are not filling this in, the analysis will be incomplete.', owner: 'Sales Management' },
            { q: 'What does agfa_maintypecodename contain exactly?', detail: 'Values: "New Business", "New machine sales", "Expand existing business". Is "Renewal" tracked separately?', owner: 'Commercial Team' },
            { q: 'Are DS% / DH% scores updated over the life of an opportunity or set once?', detail: 'If scores are set once at creation and never updated, they cannot be used as reliable predictors for closed deals.', owner: 'Sales Management' },
          ]
        },
        {
          category: 'Reference Data', icon: <InfoIcon />, color: '#E3F2FD', border: '#1565C0',
          questions: [
            { q: 'Where are DealerList xl and DealerList_TargetSetting xl maintained?', detail: 'These are loaded as manual Excel files in Power BI. Who owns and updates them? Should they be in a SharePoint list?', owner: 'Channel Management' },
            { q: 'Is there a single authoritative country → region mapping?', detail: 'Two slightly different hierarchies exist: mapping.csv (CRM reports) vs Region partner dashboard xl (FeedFile). Which is authoritative?', owner: 'Commercial Finance / IT' },
            { q: 'What is the "Fixed Destination" concept in the region mapping?', detail: 'Many countries have both a Destination and Fixed Destination (e.g. CZECH REPUBLIC = BOHEMIA-HERZ.). Is Fixed Destination the SAP field?', owner: 'SAP / Finance Team' },
            { q: 'Are dealer names intentionally excluded from FeedFile?', detail: 'Bill-to Party Name, Ship-to Party Name, Channel Manager Name columns exist in Power BI but failed to extract (pbixray limitation). Are these GDPR-restricted?', owner: 'Legal / IT' },
          ]
        },
        {
          category: 'Business Logic', icon: <CheckCircleIcon />, color: '#E8F5E9', border: '#4CAF50',
          questions: [
            { q: 'What is "Book & Bill" exactly — same-quarter OIT and invoice on the same order?', detail: 'The playbook mentions B&B as an end-of-quarter mechanism. Is this defined as: OIT date and Invoice date both fall in the same quarter?', owner: 'Commercial Finance' },
            { q: 'Should SMA (Service & Maintenance Agreements) be included or excluded from OIT?', detail: 'Reports use agfa_estordervalueexcludingsmaamount_base (excluding SMA). Is there a separate SMA OIT target?', owner: 'Commercial Finance' },
            { q: 'What defines a "Large Deal" for the tracker? Is €500k the right threshold?', detail: 'Design plan uses >€500k. Playbook mentions "strategic" deals as a separate category. What is the business definition?', owner: 'Commercial Director' },
            { q: 'How is the Forecast Confidence hierarchy ordered?', detail: 'Current sort order: Won=1, Incl & Secured=2, Included=3, Incl w/Risk=4, Upside=5, Excluded=6. Should Pipeline/Funnel be 7 or separate?', owner: 'Sales Management' },
          ]
        },
      ].map((section) => (
        <Grid size={{ xs: 12, md: 6 }} key={section.category}>
          <Card sx={{ height: '100%', border: `1px solid ${section.border}` }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2} sx={{ color: section.border }}>
                {section.icon}
                <Typography variant="subtitle1" fontWeight={700}>{section.category}</Typography>
              </Box>
              <List disablePadding>
                {section.questions.map((item, i) => (
                  <React.Fragment key={i}>
                    <ListItem disablePadding alignItems="flex-start" sx={{ flexDirection: 'column', mb: 1.5 }}>
                      <Box display="flex" alignItems="flex-start" gap={1} width="100%">
                        <HelpOutlineIcon sx={{ fontSize: 16, color: section.border, flexShrink: 0, mt: 0.2 }} />
                        <Box>
                          <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.8rem' }}>{item.q}</Typography>
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>{item.detail}</Typography>
                          <Chip label={`Owner: ${item.owner}`} size="small" sx={{ mt: 0.5, fontSize: '0.62rem', bgcolor: '#F5F5F5' }} />
                        </Box>
                      </Box>
                    </ListItem>
                    {i < section.questions.length - 1 && <Divider sx={{ mb: 1.5 }} />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default DataOverviewTab;
