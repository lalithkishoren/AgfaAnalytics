import React, { useMemo, useState } from 'react';
import {
  Grid, Typography, Box, Card, CardContent,
  Table, TableHead, TableRow, TableCell, TableBody,
  ToggleButton, ToggleButtonGroup, Chip,
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { DataConfidenceLegend } from '../components/DataConfidenceLegend';
import { DataUnavailableNote } from '../components/DataUnavailableNote';
import { ChartNote } from './OverviewTab';
import { DashboardData, GlobalFilters, NavigateAction } from '../types';
import { fmtNum } from '../utils/formatters';

interface Props {
  data: DashboardData;
  filters: GlobalFilters;
  onNavigate: (nav: NavigateAction) => void;
}

// ── Dummy SubRegion snapshot data ─────────────────────────────────────────────

const WEEK_HEADERS = ['W07', 'W08', 'W09', 'W10', 'W11', 'W12'];

interface FlagRow { flag: string; weeks: number[] }
interface SubRegionRow { name: string; vsB: string; status: 'green' | 'red'; flags: FlagRow[] }

const subRegionData: SubRegionRow[] = [
  {
    name: 'USA', vsB: '+12%', status: 'green',
    flags: [
      { flag: 'Won',      weeks: [1.2, 1.4, 1.6, 1.8, 2.1, 2.3] },
      { flag: 'Included', weeks: [4.1, 4.3, 4.5, 4.2, 4.8, 5.1] },
      { flag: 'Upside',   weeks: [8.2, 8.5, 8.1, 8.9, 9.2, 9.8] },
    ],
  },
  {
    name: 'Canada', vsB: '–8%', status: 'red',
    flags: [
      { flag: 'Won',      weeks: [0.4, 0.5, 0.4, 0.6, 0.5, 0.6] },
      { flag: 'Included', weeks: [1.8, 1.7, 1.9, 1.6, 1.8, 1.7] },
      { flag: 'Upside',   weeks: [3.1, 2.9, 3.2, 2.8, 3.0, 2.9] },
    ],
  },
  {
    name: 'Germany/Austria/CH', vsB: '+5%', status: 'green',
    flags: [
      { flag: 'Won',      weeks: [0.8, 0.9, 1.0, 1.1, 1.2, 1.3] },
      { flag: 'Included', weeks: [2.4, 2.5, 2.6, 2.4, 2.7, 2.8] },
      { flag: 'Upside',   weeks: [5.2, 5.4, 5.1, 5.6, 5.8, 6.1] },
    ],
  },
];

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography variant="h6" sx={{ mb: 1, mt: 3, fontWeight: 700, color: '#1565C0', borderBottom: '2px solid #E3F2FD', pb: 0.5 }}>
    {children}
  </Typography>
);

const SalesOpsTab: React.FC<Props> = ({ data }) => {
  const { kamScorecard, pipelineFunnel } = data;
  const [weighted, setWeighted] = useState(false);

  const weeks = kamScorecard.weeks;

  // W→W Delta for each KAM (W12 - W11)
  const kamsWithDelta = useMemo(() =>
    kamScorecard.kams.map(k => {
      const amounts = weighted ? k.weeklyWeighted : k.weeklyAmounts;
      const w12 = amounts[amounts.length - 1] ?? 0;
      const w11 = amounts[amounts.length - 2] ?? 0;
      return { ...k, amounts, w12, delta: parseFloat((w12 - w11).toFixed(3)) };
    }),
    [kamScorecard.kams, weighted]);

  // Weekly trend by flag from pipeline_funnel
  const weeklyData = pipelineFunnel.weeklyTrend;

  return (
    <Box>
      <DataConfidenceLegend />

      {/* ── Existing KAM Scorecard ─────────────────────────────────────────── */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">KAM Pipeline Scorecard — W03 to W12 (Open Opportunities)</Typography>
            <ToggleButtonGroup size="small" value={weighted ? 'weighted' : 'unweighted'} exclusive
              onChange={(_, v) => { if (v) setWeighted(v === 'weighted'); }}>
              <ToggleButton value="unweighted">Unweighted</ToggleButton>
              <ToggleButton value="weighted">Weighted</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small" sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: '#F5F7FA' }}>
                  <TableCell sx={{ fontWeight: 700, minWidth: 150 }}>KAM</TableCell>
                  <TableCell sx={{ fontWeight: 700, minWidth: 110 }}>Region</TableCell>
                  {weeks.map(w => (
                    <TableCell key={w} align="right" sx={{ fontWeight: 700, fontSize: '0.7rem' }}>{w}</TableCell>
                  ))}
                  <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.7rem' }}>W→W Δ</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Flag W12</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {kamsWithDelta.map((kam, i) => (
                  <TableRow key={i} hover>
                    <TableCell sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{kam.name}</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', color: '#5A6872' }}>{kam.region}</TableCell>
                    {kam.amounts.map((v, wi) => (
                      <TableCell key={wi} align="right" sx={{ fontSize: '0.7rem', fontFamily: 'monospace' }}>
                        {v > 0 ? `€${v}M` : '—'}
                      </TableCell>
                    ))}
                    <TableCell align="right">
                      <Chip label={`${kam.delta >= 0 ? '+' : ''}${kam.delta}M`} size="small"
                        sx={{
                          height: 18, fontSize: '0.6rem', fontWeight: 700,
                          bgcolor: kam.delta > 0 ? '#E8F5E9' : kam.delta < 0 ? '#FFEBEE' : '#F5F5F5',
                          color: kam.delta > 0 ? '#2E7D32' : kam.delta < 0 ? '#D32F2F' : '#78909C',
                        }} />
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: '0.65rem' }}>{kam.flagW12 || '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          <ChartNote note="✅ Verified: DataWeek — Open opportunities by Opportunity Owner, W03-W12 weekly snapshots" />
        </CardContent>
      </Card>

      {/* ── Existing weekly pipeline chart ────────────────────────────────── */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Weekly Open Pipeline by Forecast Flag (€M)</Typography>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={weeklyData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v: any) => `€${v}M`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: any) => [`€${v}M`]} />
                  <Bar dataKey="IncludedAndSecured" name="Incl & Secured" stackId="a" fill="#1565C0" />
                  <Bar dataKey="Included"           name="Included"        stackId="a" fill="#42A5F5" />
                  <Bar dataKey="IncludedWithRisk"   name="Incl w/ Risk"    stackId="a" fill="#F57C00" />
                  <Bar dataKey="Upside"             name="Upside"          stackId="a" fill="#78909C" />
                  <Bar dataKey="Pipeline"           name="Pipeline"        stackId="a" fill="#BDBDBD" />
                </BarChart>
              </ResponsiveContainer>
              <ChartNote note="✅ Verified: DataWeek — Open opportunities weekly pipeline by forecast flag" />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>W12 Pipeline Summary</Typography>
              {pipelineFunnel.snapshot.filter(s => s.amountEUR > 0).map((s, i) => (
                <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, borderBottom: '1px solid #f0f0f0' }}>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{s.flag}</Typography>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                      €{(s.amountEUR / 1_000_000).toFixed(1)}M
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem' }}>
                      {fmtNum(s.count)} deals
                    </Typography>
                  </Box>
                </Box>
              ))}
              <ChartNote note="✅ Verified: DataWeek W12 snapshot" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ── Section: SubRegion Weekly Snapshot (Page 2.6) ─────────────────── */}
      <SectionHeader>SubRegion Weekly Snapshot (Page 2.6)</SectionHeader>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small" sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: '#F5F7FA' }}>
                  <TableCell sx={{ fontWeight: 700, minWidth: 160 }}>SubRegion / Flag</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>vs Budget</TableCell>
                  {WEEK_HEADERS.map(w => (
                    <TableCell key={w} align="right" sx={{ fontWeight: 700, fontSize: '0.7rem' }}>{w}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {subRegionData.map((region, ri) => (
                  <React.Fragment key={ri}>
                    {/* Region header row */}
                    <TableRow sx={{ bgcolor: '#F0F4FA' }}>
                      <TableCell colSpan={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.78rem' }}>
                            {region.name}
                          </Typography>
                          <Chip
                            label={region.vsB}
                            size="small"
                            sx={{
                              height: 18, fontSize: '0.62rem', fontWeight: 700,
                              bgcolor: region.status === 'green' ? '#E8F5E9' : '#FFEBEE',
                              color: region.status === 'green' ? '#2E7D32' : '#D32F2F',
                            }}
                          />
                        </Box>
                      </TableCell>
                      {WEEK_HEADERS.map(w => (
                        <TableCell key={w} />
                      ))}
                    </TableRow>
                    {/* Flag sub-rows */}
                    {region.flags.map((flag, fi) => (
                      <TableRow key={fi} hover>
                        <TableCell sx={{ pl: 4 }}>
                          <Typography variant="body2" sx={{ fontSize: '0.72rem', color: '#5A6872' }}>
                            {flag.flag}
                          </Typography>
                        </TableCell>
                        <TableCell />
                        {flag.weeks.map((v, wi) => (
                          <TableCell key={wi} align="right" sx={{ fontSize: '0.7rem', fontFamily: 'monospace' }}>
                            €{v}M
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </Box>
          <DataUnavailableNote source="DataWeek — SubRegion dimension mapping required. Region→SubRegion hierarchy needed from CRM account hierarchy." />
        </CardContent>
      </Card>
    </Box>
  );
};

export default SalesOpsTab;
