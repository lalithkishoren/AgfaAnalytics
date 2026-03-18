import { Fragment, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Skeleton,
} from '@mui/material';
import GapPanel from '../components/GapPanel';
import { useOIMonthly, useTacoKeyLines, useOBGrid, useOBTimeline } from '../hooks/useData';
import { useFilters, matchOIRegion, matchBU, matchOBFull } from '../context/FilterContext';

// ── OI FA desc → revenue stream group ────────────────────────────────────────
const OI_FA_GROUP: Record<string, string> = {
  'Net Sales Hardware /':  'Hardware',
  'Net Sls Recurring HW':  'Hardware',
  'Net Sales Own Licens':  'Own Licenses',
  'Net Sls Recur. Own I':  'Own Licenses',
  'Net Sales - subs. Ow':  'Own Licenses',
  'Net Sales 3rd p. Lic':  '3rd Party Licenses',
  'Net Sls Recurring 3r':  '3rd Party Licenses',
  'Net Sales-subs3rdPSW':  '3rd Party Licenses',
  'Net Sales-subs.3rd':    '3rd Party Licenses',
  'Net Sls Recur. 3rdP':   '3rd Party Licenses',
  'Net Sales Services':    'Impl. Services',
  'Net Sls Recur. Impl.':  'Impl. Services',
  'Net Sales - subs PS':   'Impl. Services',
  'Net Sls Recur. Man.':   'AMS',
};

// OB FA desc → revenue stream group
const OB_FA_GROUP: Record<string, string> = {
  'Net Sales Hardware':                   'Hardware',
  'Net Sls Recur. HW':                    'Hardware',
  'Net Sales Own Licenses':               'Own Licenses',
  'Net Sls Recur. Own IP SW':             'Own Licenses',
  'Net Sales - subs. Ow':                 'Own Licenses',
  'Net Sales 3rd p. Licenses':            '3rd Party Licenses',
  'Net Sls Recur. 3rdP SW':               '3rd Party Licenses',
  'Net Sales-subs3rdPSW':                 '3rd Party Licenses',
  'Net Sales - sub 3rd P Infrastructure': '3rd Party Licenses',
  'Net Sales Services':                   'Impl. Services',
  'Net Sls Recur. Impl. Serv':            'Impl. Services',
  'Net Sls Recur. Man. Serv':             'AMS',
};

const STREAM_GROUPS = ['Hardware', 'Own Licenses', '3rd Party Licenses', 'Impl. Services', 'AMS'];

// Quarter → snapshot months mapping for 2025
const Q_SNAPS: Record<number, string[]> = {
  1: ['2025-01', '2025-02', '2025-03'],
  2: ['2025-04', '2025-05', '2025-06'],
  3: ['2025-07', '2025-08', '2025-09'],
  4: ['2025-10', '2025-11', '2025-12'],
};
const ALL_2025 = Object.values(Q_SNAPS).flat();

// TACO P&L lines
const PL_LINES = [
  { code: '02', label: 'Net Sales Hardware',      section: 'revenue', indent: true  },
  { code: '07', label: 'Net Sales Own Licenses',  section: 'revenue', indent: true  },
  { code: '09', label: 'Net Sales Subscriptions', section: 'revenue', indent: true  },
  { code: '11', label: 'Net Sales 3rd Party',     section: 'revenue', indent: true  },
  { code: '26', label: 'Total Net Sales',         section: 'total',   indent: false },
  { code: '29', label: 'CoGS Hardware',           section: 'cost',    indent: true  },
  { code: '55', label: 'TACO Margin',             section: 'total',   indent: false },
  { code: '63', label: 'Product Contribution',    section: 'total',   indent: false },
  { code: '85', label: 'TACO Contribution',       section: 'total',   indent: false },
] as const;

// ── Formatters ────────────────────────────────────────────────────────────────
function mEUR(v: number) {
  if (Math.abs(v) < 0.05) return <span style={{ color: '#B0BEC5' }}>—</span>;
  return <>{(v / 1000).toFixed(1)}</>;
}
function kEUR(v: number) {
  if (Math.abs(v) < 1) return <span style={{ color: '#B0BEC5' }}>—</span>;
  return <>{v.toLocaleString('en-US', { maximumFractionDigits: 0 })}</>;
}
function pct(v: number) {
  return <span style={{ fontWeight: 600, color: v >= 90 ? '#2E7D32' : v >= 70 ? '#E65100' : '#C62828' }}>{v.toFixed(0)}%</span>;
}
function Delta({ v, meur = false }: { v: number; meur?: boolean }) {
  const thr = meur ? 0.05 : 1;
  if (Math.abs(v) < thr) return <span style={{ color: '#B0BEC5' }}>—</span>;
  const pos = v > 0;
  const str = meur
    ? (pos ? '+' : '') + (v / 1000).toFixed(1)
    : (pos ? '+' : '') + v.toLocaleString('en-US', { maximumFractionDigits: 0 });
  return <span style={{ color: pos ? '#2E7D32' : '#C62828', fontWeight: 600 }}>{str}</span>;
}

// ── Shared sx ─────────────────────────────────────────────────────────────────
const HDR   = { bgcolor: '#003C7E', color: '#fff', fontWeight: 700, fontSize: '0.71rem', py: 0.8, px: 1 };
const SUHDR = { bgcolor: '#E8EEF5', fontWeight: 600, fontSize: '0.71rem', py: 0.6, px: 1, color: '#37474F' };
const CELL  = { fontSize: '0.74rem', py: 0.55, px: 1, textAlign: 'right' as const };
const LABEL = { fontSize: '0.74rem', py: 0.55, px: 1 };
const SECTION_BG: Record<string, string> = { revenue: 'transparent', cost: '#FFF3E0', total: '#E8EEF5' };

// ── Component ─────────────────────────────────────────────────────────────────
export default function PLReport() {
  const { data: oiData,     loading: oiLoading   } = useOIMonthly();
  const { data: tacoData,   loading: tacoLoading } = useTacoKeyLines();
  const { data: obGridData, loading: gridLoading } = useOBGrid();
  const { data: obTimeline, loading: tlLoading   } = useOBTimeline();
  const { filters } = useFilters();
  const { selectedBU, selectedRegion, selectedCountry, selectedYear } = filters;

  const buLabel = selectedBU.length === 1 ? selectedBU[0]
    : selectedBU.length > 1 ? selectedBU.join('+') : 'All BUs';

  // ── Pivot 1: OI Quarterly by Revenue Stream ───────────────────────────────
  const oiTable = useMemo(() => {
    if (!oiData) return null;
    const is2025   = selectedYear !== '2026';
    const quarters = is2025 ? [1, 2, 3, 4] : [1];
    const allSnaps = is2025 ? ALL_2025 : ['2026-01'];

    const pick = (kf: string, snaps: string[], group?: string) =>
      oiData.filter(r =>
        snaps.includes(r.snapshot) && r.key_figure === kf &&
        matchBU(r.bu, selectedBU) &&
        matchOIRegion(r.region, selectedRegion, selectedCountry) &&
        (group === undefined ? OI_FA_GROUP[r.fa_desc] !== undefined : OI_FA_GROUP[r.fa_desc] === group),
      ).reduce((s, r) => s + r.value_keur, 0);

    const rows = STREAM_GROUPS.map(group => ({
      group,
      qData: quarters.map(q => {
        const snaps = is2025 ? Q_SNAPS[q] : ['2026-01'];
        return { act: pick('MONTH ACT', snaps, group), bud: pick('MONTH BUD', snaps, group), ly: pick('MONTH LY', snaps, group) };
      }),
      fy: { act: pick('MONTH ACT', allSnaps, group), bud: pick('MONTH BUD', allSnaps, group), ly: pick('MONTH LY', allSnaps, group) },
    }));
    const totals = {
      qData: quarters.map(q => {
        const snaps = is2025 ? Q_SNAPS[q] : ['2026-01'];
        return { act: pick('MONTH ACT', snaps), bud: pick('MONTH BUD', snaps), ly: pick('MONTH LY', snaps) };
      }),
      fy: { act: pick('MONTH ACT', allSnaps), bud: pick('MONTH BUD', allSnaps), ly: pick('MONTH LY', allSnaps) },
    };
    return { rows, totals, quarters };
  }, [oiData, selectedBU, selectedRegion, selectedCountry, selectedYear]);

  // ── Pivot 2: P&L Summary (TACO) ───────────────────────────────────────────
  const plTable = useMemo(() => {
    if (!tacoData) return null;
    return PL_LINES.map(line => {
      const rows = tacoData.filter(r => r.fa_line === line.code && matchBU(r.bu, selectedBU));
      return {
        ...line,
        act: Math.round(rows.reduce((s, r) => s + r.actuals_keur, 0)),
        bud: Math.round(rows.reduce((s, r) => s + r.budget_keur, 0)),
        ly:  Math.round(rows.reduce((s, r) => s + r.actuals_ly_keur, 0)),
      };
    });
  }, [tacoData, selectedBU]);

  // ── Pivot 3: OI by Region (Slide 4 sub-region rows) ──────────────────────
  const oiByRegion = useMemo(() => {
    if (!oiData) return [];
    const allSnaps = selectedYear !== '2026' ? ALL_2025 : ['2026-01'];
    const regionMap: Record<string, { act: number; bud: number; ly: number }> = {};
    oiData.filter(r =>
      allSnaps.includes(r.snapshot) &&
      OI_FA_GROUP[r.fa_desc] !== undefined &&
      matchBU(r.bu, selectedBU),
    ).forEach(r => {
      if (!regionMap[r.region]) regionMap[r.region] = { act: 0, bud: 0, ly: 0 };
      if (r.key_figure === 'MONTH ACT') regionMap[r.region].act += r.value_keur;
      if (r.key_figure === 'MONTH BUD') regionMap[r.region].bud += r.value_keur;
      if (r.key_figure === 'MONTH LY')  regionMap[r.region].ly  += r.value_keur;
    });
    return Object.entries(regionMap)
      .map(([region, vals]) => ({
        region,
        act: vals.act,
        bud: vals.bud,
        ly:  vals.ly,
      }))
      .filter(r => r.act > 0 || r.bud > 0)
      .sort((a, b) => b.act - a.act);
  }, [oiData, selectedBU, selectedYear]);

  // ── Pivot 4: Revenue / OI Coverage (Slide 5) ─────────────────────────────
  // Assumption: OI 2025 FY actuals and budget by stream as the revenue base.
  // OB 2026 Planned CY (from ob_timeline) as forward pipeline.
  const latestObPeriod = useMemo(() => {
    if (!obTimeline) return '2026-02';
    return [...new Set(obTimeline.map(r => r.period))].sort().at(-1) ?? '2026-02';
  }, [obTimeline]);

  const coverageData = useMemo(() => {
    if (!oiData || !obGridData) return [];
    const allSnaps = ALL_2025;

    // OI 2025 by stream
    const oiAct: Record<string, number> = {};
    const oiBud: Record<string, number> = {};
    oiData.filter(r =>
      allSnaps.includes(r.snapshot) &&
      matchBU(r.bu, selectedBU) &&
      matchOIRegion(r.region, selectedRegion, selectedCountry) &&
      OI_FA_GROUP[r.fa_desc] !== undefined,
    ).forEach(r => {
      const g = OI_FA_GROUP[r.fa_desc];
      if (r.key_figure === 'MONTH ACT') oiAct[g] = (oiAct[g] || 0) + r.value_keur;
      if (r.key_figure === 'MONTH BUD') oiBud[g] = (oiBud[g] || 0) + r.value_keur;
    });

    // OB 2026 pipeline by stream (all quarters)
    const obPipeline: Record<string, number> = {};
    obGridData.filter(r =>
      matchBU(r.bu, selectedBU) &&
      matchOBFull(r.region, selectedRegion, selectedCountry) &&
      OB_FA_GROUP[r.fa_desc] !== undefined,
    ).forEach(r => {
      const g = OB_FA_GROUP[r.fa_desc];
      obPipeline[g] = (obPipeline[g] || 0) + r.value_keur;
    });

    const rows = STREAM_GROUPS.map(group => {
      const act = oiAct[group] || 0;
      const bud = oiBud[group] || 0;
      const pipeline = obPipeline[group] || 0;
      const achievement = bud > 0 ? (act / bud) * 100 : null;
      const coverage    = bud > 0 ? (pipeline / bud) * 100 : null;
      return { group, act, bud, pipeline, achievement, coverage };
    });

    const totAct      = rows.reduce((s, r) => s + r.act, 0);
    const totBud      = rows.reduce((s, r) => s + r.bud, 0);
    const totPipeline = rows.reduce((s, r) => s + r.pipeline, 0);
    rows.push({
      group: 'Total',
      act:      totAct,
      bud:      totBud,
      pipeline: totPipeline,
      achievement: totBud > 0 ? (totAct / totBud) * 100 : null,
      coverage:    totBud > 0 ? (totPipeline / totBud) * 100 : null,
    });

    return rows;
  }, [oiData, obGridData, selectedBU, selectedRegion, selectedCountry]);

  // ── Pivot 5: Revenue Pipeline by Project (Slide 3) ────────────────────────
  // Assumption: OB grid 2026 planned recognition schedule used as revenue pipeline detail.
  const pipelineProjects = useMemo(() => {
    if (!obGridData) return [];
    const filtered = obGridData.filter(r =>
      matchBU(r.bu, selectedBU) &&
      matchOBFull(r.region, selectedRegion, selectedCountry),
    );
    const projectMap: Record<string, {
      customer: string; project: string; bu: string; region: string;
      q: Record<string, number>; total: number;
    }> = {};
    filtered.forEach(r => {
      const key = r.project_code || (r.customer + '|' + r.project_desc);
      if (!projectMap[key]) {
        projectMap[key] = { customer: r.customer, project: r.project_desc, bu: r.bu, region: r.region, q: {}, total: 0 };
      }
      const qk = String(r.pl_qtr);
      projectMap[key].q[qk] = (projectMap[key].q[qk] || 0) + r.value_keur;
      projectMap[key].total += r.value_keur;
    });
    return Object.values(projectMap)
      .sort((a, b) => b.total - a.total)
      .slice(0, 25);
  }, [obGridData, selectedBU, selectedRegion, selectedCountry]);

  const showFY = oiTable && oiTable.quarters.length > 1;

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>P&amp;L Report</Typography>
        <Typography variant="body2" sx={{ color: '#637381', mt: 0.5 }}>
          Quarterly pivot tables aligned to the PPT regional report structure —
          BU: <strong>{buLabel}</strong>
          {selectedRegion.length > 0 && ` · Region: ${selectedRegion.join(', ')}`}
          {selectedCountry.length > 0 && ` · Country: ${selectedCountry.join(', ')}`}
        </Typography>
      </Box>

      {/* ── Pivot 1: OI Quarterly by Revenue Stream (Slide 4) ───────────────── */}
      <Paper sx={{ p: 2.5, mb: 3, overflowX: 'auto' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
          1. Order Intake — Quarterly by Revenue Stream · {buLabel} {selectedYear} (mEUR)
        </Typography>
        <Typography variant="caption" sx={{ color: '#637381', display: 'block', mb: 1.5 }}>
          Slide 4 equivalent · ACT from monthly snapshots · BUD = budget · LY = last year
          {selectedYear === '2026' && ' · Jan 2026 only — Q1 partial'}
        </Typography>
        {oiLoading ? <Skeleton variant="rectangular" height={200} /> : !oiTable ? null : (
          <Table size="small" sx={{ minWidth: 620, '& td, & th': { borderColor: '#E8ECF0' } }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...HDR, textAlign: 'left', minWidth: 150 }}>Revenue Stream</TableCell>
                {oiTable.quarters.map(q => (
                  <Fragment key={q}>
                    <TableCell colSpan={3} align="center" sx={{ ...HDR, borderLeft: '2px solid rgba(255,255,255,0.25)' }}>
                      Q{q} {selectedYear}
                    </TableCell>
                  </Fragment>
                ))}
                {showFY && (
                  <TableCell colSpan={4} align="center" sx={{ ...HDR, borderLeft: '2px solid rgba(255,255,255,0.25)', bgcolor: '#002050' }}>
                    Full Year {selectedYear}
                  </TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell sx={{ ...SUHDR, textAlign: 'left' }} />
                {oiTable.quarters.map(q => (
                  <Fragment key={q}>
                    <TableCell sx={{ ...SUHDR, borderLeft: '2px solid #CFD8DC' }}>ACT</TableCell>
                    <TableCell sx={SUHDR}>BUD</TableCell>
                    <TableCell sx={SUHDR}>LY</TableCell>
                  </Fragment>
                ))}
                {showFY && (
                  <>
                    <TableCell sx={{ ...SUHDR, borderLeft: '2px solid #CFD8DC' }}>ACT</TableCell>
                    <TableCell sx={SUHDR}>BUD</TableCell>
                    <TableCell sx={SUHDR}>LY</TableCell>
                    <TableCell sx={{ ...SUHDR, color: '#1B5E20' }}>Δ BUD</TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {oiTable.rows.map((row, i) => (
                <TableRow key={row.group} sx={{ bgcolor: i % 2 === 0 ? '#FAFAFA' : '#fff', '&:hover': { bgcolor: '#EEF4FB' } }}>
                  <TableCell sx={{ ...LABEL, pl: 2 }}>{row.group}</TableCell>
                  {row.qData.map((q, qi) => (
                    <Fragment key={qi}>
                      <TableCell sx={{ ...CELL, borderLeft: '2px solid #E0E3E7' }}>{mEUR(q.act)}</TableCell>
                      <TableCell sx={{ ...CELL, color: '#78909C' }}>{mEUR(q.bud)}</TableCell>
                      <TableCell sx={{ ...CELL, color: '#78909C' }}>{mEUR(q.ly)}</TableCell>
                    </Fragment>
                  ))}
                  {showFY && (
                    <>
                      <TableCell sx={{ ...CELL, borderLeft: '2px solid #E0E3E7', fontWeight: 600 }}>{mEUR(row.fy.act)}</TableCell>
                      <TableCell sx={{ ...CELL, color: '#78909C' }}>{mEUR(row.fy.bud)}</TableCell>
                      <TableCell sx={{ ...CELL, color: '#78909C' }}>{mEUR(row.fy.ly)}</TableCell>
                      <TableCell sx={CELL}><Delta v={row.fy.act - row.fy.bud} meur /></TableCell>
                    </>
                  )}
                </TableRow>
              ))}
              <TableRow sx={{ bgcolor: '#003C7E' }}>
                <TableCell sx={{ ...LABEL, color: '#fff', fontWeight: 700 }}>Total Orders</TableCell>
                {oiTable.totals.qData.map((q, qi) => (
                  <Fragment key={qi}>
                    <TableCell sx={{ ...CELL, color: '#fff', fontWeight: 700, borderLeft: '2px solid rgba(255,255,255,0.2)' }}>{mEUR(q.act)}</TableCell>
                    <TableCell sx={{ ...CELL, color: '#90CAF9' }}>{mEUR(q.bud)}</TableCell>
                    <TableCell sx={{ ...CELL, color: '#90CAF9' }}>{mEUR(q.ly)}</TableCell>
                  </Fragment>
                ))}
                {showFY && (
                  <>
                    <TableCell sx={{ ...CELL, color: '#fff', fontWeight: 700, borderLeft: '2px solid rgba(255,255,255,0.3)' }}>{mEUR(oiTable.totals.fy.act)}</TableCell>
                    <TableCell sx={{ ...CELL, color: '#90CAF9' }}>{mEUR(oiTable.totals.fy.bud)}</TableCell>
                    <TableCell sx={{ ...CELL, color: '#90CAF9' }}>{mEUR(oiTable.totals.fy.ly)}</TableCell>
                    <TableCell sx={CELL}><Delta v={oiTable.totals.fy.act - oiTable.totals.fy.bud} meur /></TableCell>
                  </>
                )}
              </TableRow>
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* ── Pivot 2: P&L Summary (Slides 1 & 6) ────────────────────────────── */}
      <Paper sx={{ p: 2.5, mb: 3, overflowX: 'auto' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
          2. P&amp;L Summary — {buLabel} YTD 2025 (kEUR, Feb–Dec)
        </Typography>
        <Typography variant="caption" sx={{ color: '#637381', display: 'block', mb: 1.5 }}>
          Slides 1 &amp; 6 equivalent · ACT = actuals · BUD = budget · LY = last year · Jan 2025 excluded (missing from source)
        </Typography>
        {tacoLoading ? <Skeleton variant="rectangular" height={260} /> : !plTable ? null : (
          <Table size="small" sx={{ maxWidth: 720, '& td, & th': { borderColor: '#E8ECF0' } }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...HDR, textAlign: 'left', minWidth: 210 }}>P&amp;L Line</TableCell>
                <TableCell sx={HDR}>ACT</TableCell>
                <TableCell sx={HDR}>BUD</TableCell>
                <TableCell sx={HDR}>LY</TableCell>
                <TableCell sx={{ ...HDR, bgcolor: '#1B5E20' }}>Δ vs BUD</TableCell>
                <TableCell sx={{ ...HDR, bgcolor: '#424242' }}>Δ vs LY</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {plTable.map((row) => {
                const isTotal = row.section === 'total';
                const isCost  = row.section === 'cost';
                return (
                  <TableRow key={row.code} sx={{ bgcolor: SECTION_BG[row.section], '&:hover': { bgcolor: '#EEF4FB' } }}>
                    <TableCell sx={{
                      ...LABEL,
                      pl: row.indent ? 3 : 1.5,
                      fontWeight: isTotal ? 700 : 400,
                      borderLeft: isTotal ? '3px solid #003C7E' : isCost ? '3px solid #E65100' : 'none',
                      color: isCost ? '#E65100' : 'inherit',
                    }}>
                      {row.label}
                    </TableCell>
                    <TableCell sx={{ ...CELL, fontWeight: isTotal ? 700 : 400 }}>{kEUR(row.act)}</TableCell>
                    <TableCell sx={{ ...CELL, color: '#78909C' }}>{kEUR(row.bud)}</TableCell>
                    <TableCell sx={{ ...CELL, color: '#78909C' }}>{kEUR(row.ly)}</TableCell>
                    <TableCell sx={CELL}><Delta v={row.act - row.bud} /></TableCell>
                    <TableCell sx={CELL}><Delta v={row.act - row.ly} /></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* ── Pivot 3: OI by Region (Slide 4 sub-region breakdown) ────────────── */}
      <Paper sx={{ p: 2.5, mb: 3, overflowX: 'auto' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
          3. Order Intake by Region — {buLabel} Full Year {selectedYear} (mEUR)
        </Typography>
        <Typography variant="caption" sx={{ color: '#637381', display: 'block', mb: 1.5 }}>
          Slide 4 sub-region rows · ACT vs BUD with variance · sorted by actuals
        </Typography>
        {oiLoading ? <Skeleton variant="rectangular" height={200} /> : (
          <Table size="small" sx={{ maxWidth: 680, '& td, & th': { borderColor: '#E8ECF0' } }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...HDR, textAlign: 'left', minWidth: 160 }}>Region / Country</TableCell>
                <TableCell sx={HDR}>ACT</TableCell>
                <TableCell sx={HDR}>BUD</TableCell>
                <TableCell sx={HDR}>LY</TableCell>
                <TableCell sx={{ ...HDR, bgcolor: '#1B5E20' }}>Δ vs BUD</TableCell>
                <TableCell sx={{ ...HDR, bgcolor: '#424242' }}>Δ vs LY</TableCell>
                <TableCell sx={{ ...HDR, bgcolor: '#1565C0' }}>ACT %</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {oiByRegion.map((row, i) => {
                const total = oiByRegion.reduce((s, r) => s + r.act, 0);
                const sharePct = total > 0 ? (row.act / total) * 100 : 0;
                return (
                  <TableRow key={row.region} sx={{ bgcolor: i % 2 === 0 ? '#FAFAFA' : '#fff', '&:hover': { bgcolor: '#EEF4FB' } }}>
                    <TableCell sx={{ ...LABEL, pl: 2 }}>{row.region}</TableCell>
                    <TableCell sx={{ ...CELL, fontWeight: 600 }}>{mEUR(row.act)}</TableCell>
                    <TableCell sx={{ ...CELL, color: '#78909C' }}>{mEUR(row.bud)}</TableCell>
                    <TableCell sx={{ ...CELL, color: '#78909C' }}>{mEUR(row.ly)}</TableCell>
                    <TableCell sx={CELL}><Delta v={row.act - row.bud} meur /></TableCell>
                    <TableCell sx={CELL}><Delta v={row.act - row.ly} meur /></TableCell>
                    <TableCell sx={{ ...CELL, color: '#1565C0' }}>{sharePct.toFixed(0)}%</TableCell>
                  </TableRow>
                );
              })}
              {oiByRegion.length > 0 && (
                <TableRow sx={{ bgcolor: '#003C7E' }}>
                  <TableCell sx={{ ...LABEL, color: '#fff', fontWeight: 700 }}>Total</TableCell>
                  <TableCell sx={{ ...CELL, color: '#fff', fontWeight: 700 }}>{mEUR(oiByRegion.reduce((s, r) => s + r.act, 0))}</TableCell>
                  <TableCell sx={{ ...CELL, color: '#90CAF9' }}>{mEUR(oiByRegion.reduce((s, r) => s + r.bud, 0))}</TableCell>
                  <TableCell sx={{ ...CELL, color: '#90CAF9' }}>{mEUR(oiByRegion.reduce((s, r) => s + r.ly, 0))}</TableCell>
                  <TableCell sx={CELL}>
                    <Delta v={oiByRegion.reduce((s, r) => s + r.act - r.bud, 0)} meur />
                  </TableCell>
                  <TableCell sx={CELL}>
                    <Delta v={oiByRegion.reduce((s, r) => s + r.act - r.ly, 0)} meur />
                  </TableCell>
                  <TableCell sx={{ ...CELL, color: '#fff' }}>100%</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* ── Pivot 4: Revenue Coverage (Slide 5) ──────────────────────────────── */}
      <Paper sx={{ p: 2.5, mb: 3, overflowX: 'auto' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
          4. Revenue Coverage — {buLabel} (Slide 5 equivalent)
        </Typography>
        <Typography variant="caption" sx={{ color: '#637381', display: 'block', mb: 1.5 }}>
          <strong>Assumption:</strong> OI 2025 full-year actuals &amp; budget used as revenue base proxy ·
          OB 2026 pipeline = total planned revenue in order book (all quarters) ·
          Coverage % = OB Pipeline ÷ OI Budget · {latestObPeriod} period
        </Typography>
        {oiLoading || gridLoading ? <Skeleton variant="rectangular" height={180} /> : (
          <Table size="small" sx={{ maxWidth: 760, '& td, & th': { borderColor: '#E8ECF0' } }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...HDR, textAlign: 'left', minWidth: 160 }}>Revenue Stream</TableCell>
                <TableCell sx={HDR}>OI 2025 Budget</TableCell>
                <TableCell sx={HDR}>OI 2025 ACT</TableCell>
                <TableCell sx={{ ...HDR, bgcolor: '#1B5E20' }}>Achievement</TableCell>
                <TableCell sx={{ ...HDR, bgcolor: '#1565C0' }}>OB 2026 Pipeline</TableCell>
                <TableCell sx={{ ...HDR, bgcolor: '#6A1B9A' }}>OB Coverage</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ ...SUHDR, textAlign: 'left' }} />
                <TableCell sx={SUHDR}>mEUR</TableCell>
                <TableCell sx={SUHDR}>mEUR</TableCell>
                <TableCell sx={{ ...SUHDR, color: '#1B5E20' }}>ACT / Budget</TableCell>
                <TableCell sx={SUHDR}>mEUR</TableCell>
                <TableCell sx={{ ...SUHDR, color: '#6A1B9A' }}>Pipeline / Budget</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {coverageData.map((row, i) => {
                const isTotal = row.group === 'Total';
                return (
                  <TableRow key={row.group} sx={{
                    bgcolor: isTotal ? '#003C7E' : i % 2 === 0 ? '#FAFAFA' : '#fff',
                    '&:hover': { bgcolor: isTotal ? '#003C7E' : '#EEF4FB' },
                  }}>
                    <TableCell sx={{ ...LABEL, color: isTotal ? '#fff' : 'inherit', fontWeight: isTotal ? 700 : 400 }}>
                      {row.group}
                    </TableCell>
                    <TableCell sx={{ ...CELL, color: isTotal ? '#90CAF9' : '#78909C' }}>{mEUR(row.bud)}</TableCell>
                    <TableCell sx={{ ...CELL, color: isTotal ? '#fff' : 'inherit', fontWeight: isTotal ? 700 : 400 }}>{mEUR(row.act)}</TableCell>
                    <TableCell sx={CELL}>{row.achievement !== null ? pct(row.achievement) : '—'}</TableCell>
                    <TableCell sx={{ ...CELL, color: isTotal ? '#fff' : '#1565C0', fontWeight: isTotal ? 700 : 400 }}>{mEUR(row.pipeline)}</TableCell>
                    <TableCell sx={CELL}>{row.coverage !== null ? pct(row.coverage) : '—'}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* ── Pivot 5: Revenue Pipeline by Project (Slide 3) ───────────────────── */}
      <Paper sx={{ p: 2.5, mb: 3, overflowX: 'auto' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
          5. Revenue Pipeline — Top Projects · {buLabel} 2026 (kEUR)
        </Typography>
        <Typography variant="caption" sx={{ color: '#637381', display: 'block', mb: 1.5 }}>
          Slide 3 equivalent · <strong>Assumption:</strong> 2026 Order Book planned recognition schedule used as revenue pipeline ·
          Columns = planned revenue recognition quarter · Top 25 projects by total value
        </Typography>
        {gridLoading ? <Skeleton variant="rectangular" height={300} /> : (
          <Table size="small" sx={{ minWidth: 700, '& td, & th': { borderColor: '#E8ECF0' } }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...HDR, textAlign: 'left', minWidth: 180 }}>Customer</TableCell>
                <TableCell sx={{ ...HDR, textAlign: 'left', minWidth: 160 }}>Project</TableCell>
                <TableCell sx={HDR}>BU</TableCell>
                <TableCell sx={HDR}>Region</TableCell>
                <TableCell sx={{ ...HDR, borderLeft: '2px solid rgba(255,255,255,0.25)' }}>Q1</TableCell>
                <TableCell sx={HDR}>Q2</TableCell>
                <TableCell sx={HDR}>Q3</TableCell>
                <TableCell sx={HDR}>Q4</TableCell>
                <TableCell sx={{ ...HDR, bgcolor: '#002050' }}>FY Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pipelineProjects.map((proj, i) => (
                <TableRow key={i} sx={{ bgcolor: i % 2 === 0 ? '#FAFAFA' : '#fff', '&:hover': { bgcolor: '#EEF4FB' } }}>
                  <TableCell sx={{ ...LABEL, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {proj.customer}
                  </TableCell>
                  <TableCell sx={{ ...LABEL, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#546E7A' }}>
                    {proj.project}
                  </TableCell>
                  <TableCell sx={{ ...CELL, textAlign: 'center' as const }}>
                    <Chip label={proj.bu} size="small" sx={{ height: 16, fontSize: '0.65rem', bgcolor: '#E8EEF5' }} />
                  </TableCell>
                  <TableCell sx={{ ...CELL, textAlign: 'left' as const, color: '#546E7A' }}>{proj.region}</TableCell>
                  <TableCell sx={{ ...CELL, borderLeft: '2px solid #E0E3E7' }}>{kEUR(proj.q['1'] || 0)}</TableCell>
                  <TableCell sx={CELL}>{kEUR(proj.q['2'] || 0)}</TableCell>
                  <TableCell sx={CELL}>{kEUR(proj.q['3'] || 0)}</TableCell>
                  <TableCell sx={CELL}>{kEUR(proj.q['4'] || 0)}</TableCell>
                  <TableCell sx={{ ...CELL, fontWeight: 700 }}>{kEUR(proj.total)}</TableCell>
                </TableRow>
              ))}
              {pipelineProjects.length > 0 && (
                <TableRow sx={{ bgcolor: '#003C7E' }}>
                  <TableCell colSpan={4} sx={{ ...LABEL, color: '#fff', fontWeight: 700 }}>
                    Total (top {pipelineProjects.length} projects)
                  </TableCell>
                  {[1, 2, 3, 4].map(q => (
                    <TableCell key={q} sx={{ ...CELL, color: '#fff', fontWeight: 700, borderLeft: q === 1 ? '2px solid rgba(255,255,255,0.2)' : undefined }}>
                      {kEUR(pipelineProjects.reduce((s, p) => s + (p.q[String(q)] || 0), 0))}
                    </TableCell>
                  ))}
                  <TableCell sx={{ ...CELL, color: '#fff', fontWeight: 700 }}>
                    {kEUR(pipelineProjects.reduce((s, p) => s + p.total, 0))}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Paper>

      <GapPanel
        severity="gap"
        title="FOR (Forecast) & A+F columns — Pending for TACO"
        description="OI data already contains MONTH FOR (forecast). TACO FOR extract is pending — once available, the P&L Summary (Pivot 2) will gain FOR and A+F columns matching the full PPT structure. Revenue Details project-level drill-down will also show Risk Level and Comments once those fields are available in the source."
      />
    </Box>
  );
}
