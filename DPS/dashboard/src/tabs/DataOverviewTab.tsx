import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Card,
  CardContent,
  Alert,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import StorageIcon from '@mui/icons-material/Storage';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BugReportIcon from '@mui/icons-material/BugReport';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { dataSources, kpiDefinitions, dataGaps, openQuestions } from '../data/dpsData';
import { DataConfidence } from '../types';

const CONFIDENCE_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  verified: { bg: '#E8F5E9', color: '#2E7D32', label: 'Verified' },
  derived: { bg: '#E3F2FD', color: '#1565C0', label: 'Derived' },
  estimated: { bg: '#FFF3E0', color: '#E65100', label: 'Estimated' },
  proxy: { bg: '#FFFBF5', color: '#D32F2F', label: 'Data Gap' },
};

const ConfidenceChip: React.FC<{ level: string }> = ({ level }) => {
  const style = CONFIDENCE_COLORS[level] || CONFIDENCE_COLORS.estimated;
  return (
    <Chip
      label={style.label}
      size="small"
      sx={{ bgcolor: style.color, color: '#fff', fontSize: '0.68rem', height: 20 }}
    />
  );
};

const DataSourcesSubTab: React.FC = () => (
  <Box>
    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
      Analyzed Data Files — FY2025 AGFA DPS
    </Typography>
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>File Name</TableCell>
            <TableCell>System</TableCell>
            <TableCell>Period</TableCell>
            <TableCell>Entity</TableCell>
            <TableCell>Scope</TableCell>
            <TableCell>Rows</TableCell>
            <TableCell>Unit</TableCell>
            <TableCell>Last Refreshed</TableCell>
            <TableCell>Confidence</TableCell>
            <TableCell>Key Metrics</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dataSources.map((ds, i) => (
            <TableRow key={i} hover>
              <TableCell>
                <Typography variant="caption" sx={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.72rem' }}>
                  {ds.file}
                </Typography>
              </TableCell>
              <TableCell><Typography variant="caption">{ds.system}</Typography></TableCell>
              <TableCell><Typography variant="caption">{ds.period}</Typography></TableCell>
              <TableCell><Typography variant="caption">{ds.entity}</Typography></TableCell>
              <TableCell><Typography variant="caption">{ds.scope}</Typography></TableCell>
              <TableCell><Typography variant="caption">{ds.rows}</Typography></TableCell>
              <TableCell><Typography variant="caption">{ds.unit}</Typography></TableCell>
              <TableCell><Typography variant="caption">{ds.lastRefreshed}</Typography></TableCell>
              <TableCell><ConfidenceChip level={ds.confidence} /></TableCell>
              <TableCell><Typography variant="caption" color="text.secondary">{ds.keyMetrics}</Typography></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <Box sx={{ mt: 2 }}>
      <Alert severity="info" sx={{ fontSize: '0.8rem' }}>
        <strong>Note:</strong> All files are Excel-based exports from SAP BW / SAP CO-PA. No direct database connectivity — data reflects point-in-time extractions. The Order Follow-up file is a manually maintained Excel (not SAP-sourced).
      </Alert>
    </Box>
  </Box>
);

const DataModelSubTab: React.FC = () => (
  <Box>
    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
      Data Flow & Architecture
    </Typography>
    <Grid container spacing={2}>
      <Grid size={12}>
        <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', bgcolor: '#FAFAFA' }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 700, color: '#1565C0' }}>
            Data Flow Diagram
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 2 }}>
            {[
              { label: 'SAP ECC / SD', color: '#1565C0', desc: 'Source transactions' },
              { label: '→', color: '#999', desc: '' },
              { label: 'SAP BW', color: '#0D47A1', desc: 'Data warehouse' },
              { label: '→', color: '#999', desc: '' },
              { label: 'BEx Queries', color: '#00897B', desc: 'KRECO20, GMPCOPA_1' },
              { label: '→', color: '#999', desc: '' },
              { label: 'Access MDB', color: '#6A1B9A', desc: 'Intermediate layer' },
              { label: '→', color: '#999', desc: '' },
              { label: 'Excel Pivots', color: '#E65100', desc: 'Manual refresh' },
              { label: '→', color: '#999', desc: '' },
              { label: 'This Dashboard', color: '#2E7D32', desc: 'Hardcoded snapshot' },
            ].map((item, i) => (
              item.label === '→'
                ? <Typography key={i} sx={{ color: item.color, fontWeight: 700, fontSize: '1.2rem' }}>→</Typography>
                : (
                  <Box key={i} sx={{ textAlign: 'center' }}>
                    <Box sx={{
                      bgcolor: item.color, color: '#fff', px: 2, py: 1, borderRadius: 1,
                      fontSize: '0.8rem', fontWeight: 600, minWidth: 100
                    }}>
                      {item.label}
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                      {item.desc}
                    </Typography>
                  </Box>
                )
            ))}
          </Box>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Paper elevation={0} sx={{ p: 2, border: '1px solid #ffcc02', bgcolor: '#FFFDE7' }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 700, color: '#F57C00' }}>
            Known Data Model Issues
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2 }}>
            {[
              'BU code mismatch: "DP" (legacy) vs "M0" (current SAP org code) for Packaging BU — join keys differ across files',
              'Entity scope differs: RECO uses all DPS entities; CO-PA and Sales Details use AGFA NV only',
              'AMSP Contribution file has EUR 64M "no AMSP rate" — margin unknown for 33.6% of net sales',
              'OIT file is manually maintained — no automated SAP link, prone to refresh delays',
              'IC flows not excluded in RECO by default — requires manual EUR 270.6M elimination',
              'Currency: RECO is kEUR; Sales Details and CO-PA are full EUR — division by 1000 needed when joining',
            ].map((issue, i) => (
              <Typography key={i} component="li" variant="caption" sx={{ mb: 1, display: 'list-item' }}>
                {issue}
              </Typography>
            ))}
          </Box>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Paper elevation={0} sx={{ p: 2, border: '1px solid #c8e6c9', bgcolor: '#F1F8E9' }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 700, color: '#2E7D32' }}>
            Data Refresh Cadence
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>File</TableCell>
                  <TableCell>Refresh Freq.</TableCell>
                  <TableCell>Owner</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  { file: 'AMSP Contribution', freq: 'Monthly', owner: 'FP&A / Controlling' },
                  { file: 'Sales Details', freq: 'Monthly', owner: 'FP&A / Controlling' },
                  { file: 'RECO Analysis', freq: 'Monthly', owner: 'FP&A / Controlling' },
                  { file: 'CO-PA GMPCOPA_1', freq: 'Monthly', owner: 'SAP Controlling' },
                  { file: 'Order Follow-up', freq: 'Weekly / Ad hoc', owner: 'Sales Operations' },
                  { file: 'Order Book (BRM)', freq: 'Monthly', owner: 'Business Review' },
                ].map((row, i) => (
                  <TableRow key={i}>
                    <TableCell><Typography variant="caption">{row.file}</Typography></TableCell>
                    <TableCell><Typography variant="caption">{row.freq}</Typography></TableCell>
                    <TableCell><Typography variant="caption">{row.owner}</Typography></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  </Box>
);

const KpiDefinitionsSubTab: React.FC = () => (
  <Box>
    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
      KPI Definitions & Sources
    </Typography>
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>KPI Name</TableCell>
            <TableCell>Formula / Definition</TableCell>
            <TableCell>Source File</TableCell>
            <TableCell>Unit</TableCell>
            <TableCell>Confidence</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {kpiDefinitions.map((kpi, i) => (
            <TableRow key={i} hover sx={{ bgcolor: kpi.confidence === 'proxy' ? '#FFFBF5' : 'inherit' }}>
              <TableCell>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>{kpi.kpi}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="caption" sx={{ fontFamily: 'monospace', fontSize: '0.72rem' }}>
                  {kpi.formula}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="caption" color={kpi.confidence === 'proxy' ? 'error' : 'text.secondary'}>
                  {kpi.source}
                </Typography>
              </TableCell>
              <TableCell><Typography variant="caption">{kpi.unit}</Typography></TableCell>
              <TableCell><ConfidenceChip level={kpi.confidence as DataConfidence} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

const DataGapsSubTab: React.FC = () => (
  <Box>
    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
      Data Gaps — Items Not Available in Current Files
    </Typography>
    <Alert severity="error" sx={{ mb: 2, fontSize: '0.82rem' }}>
      <strong>6 data gaps identified.</strong> These KPIs cannot be computed from the currently analyzed files and require additional data sourcing.
    </Alert>
    <Grid container spacing={2}>
      {dataGaps.map((gap, i) => (
        <Grid size={{ xs: 12, md: 6 }} key={i}>
          <Card sx={{
            border: '2px dashed #EF9A9A',
            bgcolor: '#FFFBF5',
            borderRadius: '12px',
            height: '100%',
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <ErrorOutlineIcon sx={{ color: '#D32F2F', fontSize: 20 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#D32F2F' }}>
                  {gap.kpi}
                </Typography>
                <Chip label="Data Gap" size="small" sx={{ bgcolor: '#D32F2F', color: '#fff', fontSize: '0.65rem', height: 18, ml: 'auto' }} />
              </Box>
              <Divider sx={{ mb: 1.5 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#5A6872', textTransform: 'uppercase', fontSize: '0.65rem' }}>
                    Reason
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.82rem', mt: 0.3 }}>{gap.reason}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#5A6872', textTransform: 'uppercase', fontSize: '0.65rem' }}>
                    Business Impact
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.82rem', mt: 0.3, color: '#D32F2F' }}>{gap.impact}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#5A6872', textTransform: 'uppercase', fontSize: '0.65rem' }}>
                    Recommendation
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.82rem', mt: 0.3, color: '#2E7D32' }}>{gap.recommendation}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

const SEVERITY_COLOR: Record<string, string> = {
  high: '#D32F2F',
  medium: '#F57C00',
  low: '#2E7D32',
};

const OpenQuestionsSubTab: React.FC = () => (
  <Box>
    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
      Open Questions & Analytical Uncertainties
    </Typography>
    <Alert severity="warning" sx={{ mb: 2, fontSize: '0.82rem' }}>
      These questions arose during data analysis and require clarification from FP&A / data owners before conclusions can be finalized.
    </Alert>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {openQuestions.map((q) => (
        <Paper key={q.id} elevation={0} sx={{ p: 2.5, border: `1px solid ${SEVERITY_COLOR[q.severity]}30`, borderLeft: `4px solid ${SEVERITY_COLOR[q.severity]}` }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
            <QuestionMarkIcon sx={{ color: SEVERITY_COLOR[q.severity], fontSize: 18, mt: 0.2, flexShrink: 0 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: SEVERITY_COLOR[q.severity], flex: 1 }}>
              Q{q.id}: {q.question}
            </Typography>
            <Chip
              label={q.severity.toUpperCase()}
              size="small"
              sx={{
                bgcolor: SEVERITY_COLOR[q.severity],
                color: '#fff',
                fontSize: '0.65rem',
                height: 18,
                flexShrink: 0,
              }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ pl: 3, fontSize: '0.83rem', lineHeight: 1.6 }}>
            {q.answer}
          </Typography>
        </Paper>
      ))}
    </Box>
  </Box>
);

const SUB_TABS = [
  { label: 'Data Sources', icon: <StorageIcon sx={{ fontSize: 16 }} /> },
  { label: 'Data Model', icon: <AccountTreeIcon sx={{ fontSize: 16 }} /> },
  { label: 'KPI Definitions', icon: <AssessmentIcon sx={{ fontSize: 16 }} /> },
  { label: 'Data Gaps', icon: <BugReportIcon sx={{ fontSize: 16 }} /> },
  { label: 'Open Questions', icon: <QuestionMarkIcon sx={{ fontSize: 16 }} /> },
];

export const DataOverviewTab: React.FC = () => {
  const [subTab, setSubTab] = useState(0);

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#1A2027' }}>
        Data Overview
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Complete inventory of analyzed data files, data model architecture, KPI definitions, identified gaps, and open analytical questions.
      </Typography>

      <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: '12px', overflow: 'hidden' }}>
        <Tabs
          value={subTab}
          onChange={(_, v) => setSubTab(v)}
          sx={{
            borderBottom: '1px solid #e0e0e0',
            bgcolor: '#F5F7FA',
            '& .MuiTab-root': { fontSize: '0.82rem', minHeight: 44 },
            '& .Mui-selected': { color: '#1565C0', fontWeight: 600 },
            '& .MuiTabs-indicator': { bgcolor: '#1565C0' },
          }}
        >
          {SUB_TABS.map((t, i) => (
            <Tab key={i} label={t.label} icon={t.icon} iconPosition="start" />
          ))}
        </Tabs>

        <Box sx={{ p: 3 }}>
          {subTab === 0 && <DataSourcesSubTab />}
          {subTab === 1 && <DataModelSubTab />}
          {subTab === 2 && <KpiDefinitionsSubTab />}
          {subTab === 3 && <DataGapsSubTab />}
          {subTab === 4 && <OpenQuestionsSubTab />}
        </Box>
      </Paper>
    </Box>
  );
};
