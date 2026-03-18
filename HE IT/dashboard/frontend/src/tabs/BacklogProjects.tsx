import { useMemo, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Skeleton,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import GapPanel from '../components/GapPanel';
import { useOBTopCustomers, useOBSchedule, useOBGrid } from '../hooks/useData';
import { useFilters, matchBU, matchOBRegion } from '../context/FilterContext';

function fmtK(v: number) {
  return v.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

// Unique colors for schedule line items
const LINE_COLORS = [
  '#003C7E', '#E63312', '#2196F3', '#4CAF50', '#FF9800', '#9C27B0',
  '#00BCD4', '#795548', '#F44336', '#3F51B5',
];

export default function BacklogProjects() {
  const { data: topCustData, loading: tcLoading } = useOBTopCustomers();
  const { data: scheduleData, loading: schLoading } = useOBSchedule();
  const { data: gridData, loading: gridLoading } = useOBGrid();

  const { filters } = useFilters();
  const { selectedBU, selectedRegion } = filters;

  const [searchText, setSearchText] = useState('');

  // Top 20 customers
  const top20Customers = useMemo(() => {
    if (!topCustData) return [];
    return [...topCustData]
      .sort((a, b) => b.value_keur - a.value_keur)
      .slice(0, 20)
      .map((r) => ({
        name: r.customer,
        value: Math.round(r.value_keur),
      }));
  }, [topCustData]);

  // Recognition schedule — group by year+qtr, stacked by line_item, BU filtered
  const schedChartData = useMemo(() => {
    if (!scheduleData) return { data: [], lineItems: [] };
    const filtered = scheduleData.filter((r) => matchBU(r.bu, selectedBU));

    // Get unique line items sorted by total value
    const lineItemTotals: Record<string, number> = {};
    filtered.forEach((r) => {
      const key = r.line_item || r.fa_desc || 'Other';
      lineItemTotals[key] = (lineItemTotals[key] ?? 0) + r.value_keur;
    });
    const lineItems = Object.entries(lineItemTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([k]) => k);

    // Group by year+qtr
    const groups: Record<string, Record<string, number>> = {};
    filtered.forEach((r) => {
      const key = `${r.pl_year} Q${r.pl_qtr}`;
      if (!groups[key]) groups[key] = {};
      const li = r.line_item || r.fa_desc || 'Other';
      if (lineItems.includes(li)) {
        groups[key][li] = (groups[key][li] ?? 0) + r.value_keur;
      }
    });

    const data = Object.entries(groups)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([period, vals]) => ({
        name: period,
        ...Object.fromEntries(lineItems.map((li) => [li, Math.round(vals[li] ?? 0)])),
      }));

    return { data, lineItems };
  }, [scheduleData, selectedBU]);

  // DataGrid rows — BU + region filtered
  const gridRows = useMemo(() => {
    if (!gridData) return [];
    return gridData
      .filter((r) => matchBU(r.bu, selectedBU) && matchOBRegion(r.region, selectedRegion))
      .map((r, i) => ({
      id: i,
      customer: r.customer,
      project_code: r.project_code,
      bu: r.bu,
      region: r.region,
      fa_desc: r.fa_desc,
      pl_year: r.pl_year !== undefined ? Number(r.pl_year) : null,
      pl_qtr: r.pl_qtr ? `Q${r.pl_qtr}` : '',
      value_keur: r.value_keur,
    }));
  }, [gridData, selectedBU, selectedRegion]);

  // Filtered rows
  const filteredRows = useMemo(() => {
    if (!searchText) return gridRows;
    const q = searchText.toLowerCase();
    return gridRows.filter(
      (r) =>
        r.customer?.toLowerCase().includes(q) ||
        r.project_code?.toLowerCase().includes(q) ||
        r.fa_desc?.toLowerCase().includes(q) ||
        r.bu?.toLowerCase().includes(q) ||
        r.region?.toLowerCase().includes(q)
    );
  }, [gridRows, searchText]);

  const columns: GridColDef[] = [
    { field: 'customer', headerName: 'Customer', flex: 1.8, minWidth: 160 },
    { field: 'project_code', headerName: 'Project Code', flex: 1, minWidth: 110 },
    { field: 'bu', headerName: 'BU', width: 70 },
    { field: 'region', headerName: 'Region', width: 90 },
    { field: 'fa_desc', headerName: 'FA Group', flex: 1.2, minWidth: 130 },
    { field: 'pl_year', headerName: 'PL Year', width: 80, type: 'number' },
    { field: 'pl_qtr', headerName: 'Quarter', width: 80 },
    {
      field: 'value_keur',
      headerName: 'Value (kEUR)',
      width: 120,
      type: 'number',
      valueFormatter: (params) => fmtK(params.value as number),
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Backlog & Projects</Typography>
        <Typography variant="body2" sx={{ color: '#637381', mt: 0.5 }}>
          Customer-level backlog analysis, recognition schedule, and detailed project grid.
          Source: Order Book Detailed file. Top 50 customers available.
        </Typography>
      </Box>

      {/* Charts Row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Top 20 Customers */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Top 20 Customers by Backlog (kEUR)
            </Typography>
            {tcLoading ? (
              <Skeleton variant="rectangular" height={480} />
            ) : (
              <ResponsiveContainer width="100%" height={480}>
                <BarChart
                  data={top20Customers}
                  layout="vertical"
                  margin={{ top: 0, right: 20, left: 8, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E3E7" horizontal={false} />
                  <XAxis type="number" tickFormatter={(v) => fmtK(v)} tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" width={170} tick={{ fontSize: 10 }} />
                  <ReTooltip
                    formatter={(val: number) => [`${fmtK(val)} kEUR`]}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Bar dataKey="value" name="Backlog (kEUR)" fill="#003C7E" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        {/* Recognition Schedule */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
              Recognition Schedule (Stacked by Line Item, kEUR)
            </Typography>
            <Typography variant="caption" sx={{ color: '#637381', display: 'block', mb: 1.5 }}>
              Year / Quarter precision only — month-level data not available
            </Typography>
            {schLoading ? (
              <Skeleton variant="rectangular" height={460} />
            ) : schedChartData.data.length === 0 ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 460 }}>
                <Typography variant="body2" color="text.secondary">No schedule data available</Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={460}>
                <BarChart data={schedChartData.data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E3E7" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}M`} tick={{ fontSize: 11 }} width={52} />
                  <ReTooltip
                    formatter={(val: number, name: string) => [`${fmtK(val)} kEUR`, name]}
                    contentStyle={{ fontSize: 11 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  {schedChartData.lineItems.map((li, i) => (
                    <Bar
                      key={li}
                      dataKey={li}
                      stackId="a"
                      fill={LINE_COLORS[i % LINE_COLORS.length]}
                      radius={i === schedChartData.lineItems.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Gap notices */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <GapPanel
            severity="partial"
            title="Customer Data Source Limitation"
            description="Customer-level backlog data is sourced from the OB Detailed file only (top 50 customers). Customer-level revenue from TACO is not available — TACO has no customer dimension in its source extract."
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <GapPanel
            severity="partial"
            title="Recognition Schedule Precision"
            description="The recognition schedule has Year/Quarter precision only. Month-level planned recognition dates are not available in the Order Book source. Schedule data is aggregated to Year + Quarter granularity."
          />
        </Grid>
      </Grid>

      {/* DataGrid */}
      <Paper sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Project Detail Grid
          </Typography>
          <TextField
            size="small"
            placeholder="Search customer, project, FA group…"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: '#90A4AE' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        {gridLoading ? (
          <Skeleton variant="rectangular" height={400} />
        ) : (
          <DataGrid
            rows={filteredRows}
            columns={columns}
            initialState={{
              pagination: { paginationModel: { pageSize: 25 } },
              sorting: { sortModel: [{ field: 'value_keur', sort: 'desc' }] },
            }}
            pageSizeOptions={[10, 25, 50, 100]}
            density="compact"
            disableRowSelectionOnClick
            sx={{
              height: 500,
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: '#F0F4FF',
                fontWeight: 600,
                fontSize: '0.78rem',
              },
              '& .MuiDataGrid-row:nth-of-type(even)': {
                bgcolor: '#FAFAFA',
              },
              '& .MuiDataGrid-cell': {
                fontSize: '0.78rem',
              },
            }}
          />
        )}
      </Paper>
    </Box>
  );
}
