import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Paper, Chip, Typography } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { GlobalFilters } from '../types';

interface FilterBarProps {
  filters: GlobalFilters;
  onChange: (f: GlobalFilters) => void;
}

// Values must match amspByBudgetClass[].name in dpsData.ts
const BUDGET_CLASS_OPTIONS = [
  { value: 'All',                         label: 'All' },
  { value: 'Jeti (Wide Format)',          label: 'Jeti (Wide Format) — LK' },
  { value: 'Anapurna (Wide Format)',      label: 'Anapurna (Wide Format) — LK' },
  { value: 'OEM Inks',                    label: 'OEM Inks — LK' },
  { value: 'INCA Wide Format',            label: 'INCA Wide Format — LI' },
  { value: 'Packaging Onset (INCA)',      label: 'Packaging Onset — M0' },
  { value: 'Packaging Print Engineering', label: 'Print Engineering — M0' },
  { value: 'Packaging Speedset',          label: 'Packaging Speedset — M0' },
];

// Which BCs belong to each BU — used to auto-reset BC when BU changes
const BU_BC_MAP: Record<string, string[]> = {
  LK: ['Jeti (Wide Format)', 'Anapurna (Wide Format)', 'OEM Inks'],
  LI: ['INCA Wide Format'],
  M0: ['Packaging Onset (INCA)', 'Packaging Print Engineering', 'Packaging Speedset'],
};

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onChange }) => {
  const set = (key: keyof GlobalFilters) => (e: { target: { value: string } }) => {
    const updated = { ...filters, [key]: e.target.value };
    // Auto-reset BC if it doesn't belong to the newly selected BU
    if (key === 'bu' && e.target.value !== 'All') {
      const validBCs = BU_BC_MAP[e.target.value] ?? [];
      if (filters.budgetClass !== 'All' && !validBCs.includes(filters.budgetClass)) {
        updated.budgetClass = 'All';
      }
    }
    onChange(updated);
  };

  const activeCount = [filters.year, filters.bu, filters.budgetClass, filters.region]
    .filter(v => v !== 'All').length;

  const resetAll = () => onChange({ year: 'All', bu: 'All', budgetClass: 'All', region: 'All' });

  // Only show BCs relevant to the selected BU
  const availableBCs = filters.bu === 'All'
    ? BUDGET_CLASS_OPTIONS
    : BUDGET_CLASS_OPTIONS.filter(o => o.value === 'All' || BU_BC_MAP[filters.bu]?.includes(o.value));

  return (
    <Paper elevation={0} sx={{ px: 3, py: 1.5, borderBottom: '1px solid #e0e0e0', bgcolor: '#FAFAFA', borderRadius: 0 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: 0.5 }}>
          <FilterListIcon sx={{ fontSize: 16, color: activeCount > 0 ? '#1565C0' : '#9E9E9E' }} />
          <Typography variant="caption" sx={{ color: activeCount > 0 ? '#1565C0' : '#9E9E9E', fontWeight: activeCount > 0 ? 700 : 400 }}>
            Filters
          </Typography>
          {activeCount > 0 && (
            <Chip label={activeCount} size="small" sx={{ bgcolor: '#1565C0', color: '#fff', height: 16, fontSize: '0.65rem', ml: 0.5 }} />
          )}
        </Box>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Year</InputLabel>
          <Select value={filters.year} label="Year" onChange={set('year')}>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="2026">FY 2026 (YTD)</MenuItem>
            <MenuItem value="2025">FY 2025</MenuItem>
            <MenuItem value="2024">FY 2024</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 175 }}>
          <InputLabel>Business Unit</InputLabel>
          <Select value={filters.bu} label="Business Unit" onChange={set('bu')}>
            <MenuItem value="All">All BUs</MenuItem>
            <MenuItem value="LK">LK — Wide Format</MenuItem>
            <MenuItem value="LI">LI — Industrial Inkjet</MenuItem>
            <MenuItem value="M0">M0 — Packaging</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel>Budget Class</InputLabel>
          <Select value={filters.budgetClass} label="Budget Class" onChange={set('budgetClass')}>
            {availableBCs.map(o => (
              <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 165 }}>
          <InputLabel>Region</InputLabel>
          <Select value={filters.region} label="Region" onChange={set('region')}>
            <MenuItem value="All">All Regions</MenuItem>
            <MenuItem value="Europe">Europe</MenuItem>
            <MenuItem value="Americas">Americas</MenuItem>
            <MenuItem value="Asia Pacific">Asia Pacific</MenuItem>
            <MenuItem value="Middle East & Africa">Middle East & Africa</MenuItem>
          </Select>
        </FormControl>

        {activeCount > 0 && (
          <Chip
            label="Clear all"
            size="small"
            variant="outlined"
            onClick={resetAll}
            sx={{ fontSize: '0.72rem', cursor: 'pointer', color: '#D32F2F', borderColor: '#D32F2F' }}
          />
        )}
      </Box>
    </Paper>
  );
};
