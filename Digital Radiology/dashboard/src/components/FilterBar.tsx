import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Button, Paper, SelectChangeEvent } from '@mui/material';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import { GlobalFilters } from '../types';

interface FilterBarProps {
  filters: GlobalFilters;
  actions: {
    setYear: (v: number | 'all') => void;
    setQuarter: (v: string | 'all') => void;
    setEquipment: (v: string | 'all') => void;
    setRegion: (v: string | 'all') => void;
    setMultiple?: (v: Partial<GlobalFilters>) => void;
    resetAll: () => void;
  };
}

const YEARS = [2024, 2025, 2026];
const REGIONS = ['NORTH AMERICA', 'EUROPE', 'INTERCONTINENTAL', 'ASIA PACIFIC'];
const EQUIPMENT_TYPES = [
  'DR 100s', 'DR 100e', 'DR 400', 'DR 600', 'DR 800',
  'Valory', 'Valory Floor', 'Retrofit and Other', 'DX-D 300',
];

export const FilterBar: React.FC<FilterBarProps> = ({ filters, actions }) => {
  const handleYear = (e: SelectChangeEvent) => {
    const v = e.target.value;
    actions.setYear(v === 'all' ? 'all' : parseInt(v));
  };

  return (
    <Paper sx={{ px: 2, py: 1.5, mb: 2, display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
      <FormControl size="small" sx={{ minWidth: 100 }}>
        <InputLabel>Year</InputLabel>
        <Select value={String(filters.year)} onChange={handleYear} label="Year">
          <MenuItem value="all">All Years</MenuItem>
          {YEARS.map(y => <MenuItem key={y} value={String(y)}>{y}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 90 }}>
        <InputLabel>Quarter</InputLabel>
        <Select value={filters.quarter} onChange={(e) => actions.setQuarter(e.target.value)} label="Quarter">
          <MenuItem value="all">All</MenuItem>
          {['Q1','Q2','Q3','Q4'].map(q => <MenuItem key={q} value={q}>{q}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>Region</InputLabel>
        <Select value={filters.region} onChange={(e) => actions.setRegion(e.target.value)} label="Region">
          <MenuItem value="all">All Regions</MenuItem>
          {REGIONS.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel>Equipment</InputLabel>
        <Select value={filters.equipment} onChange={(e) => actions.setEquipment(e.target.value)} label="Equipment">
          <MenuItem value="all">All Types</MenuItem>
          {EQUIPMENT_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </Select>
      </FormControl>

      <Button
        size="small"
        variant="outlined"
        startIcon={<FilterListOffIcon />}
        onClick={actions.resetAll}
        sx={{ ml: 'auto' }}
      >
        Reset
      </Button>
    </Paper>
  );
};
