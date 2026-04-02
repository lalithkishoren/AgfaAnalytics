import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Paper } from '@mui/material';
import { GlobalFilters } from '../types';

interface FilterBarProps {
  filters: GlobalFilters;
  onChange: (f: GlobalFilters) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onChange }) => {
  const set = (key: keyof GlobalFilters) => (e: { target: { value: string } }) =>
    onChange({ ...filters, [key]: e.target.value });

  return (
    <Paper
      elevation={0}
      sx={{
        px: 3,
        py: 1.5,
        borderBottom: '1px solid #e0e0e0',
        bgcolor: '#FAFAFA',
        borderRadius: 0,
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Year</InputLabel>
          <Select value={filters.year} label="Year" onChange={set('year')}>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="2025">FY 2025</MenuItem>
            <MenuItem value="2024">FY 2024</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Business Unit</InputLabel>
          <Select value={filters.bu} label="Business Unit" onChange={set('bu')}>
            <MenuItem value="All">All BUs</MenuItem>
            <MenuItem value="LK">LK — Wide Format</MenuItem>
            <MenuItem value="LI">LI — Industrial Inkjet</MenuItem>
            <MenuItem value="M0">M0 — Packaging</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Budget Class</InputLabel>
          <Select value={filters.budgetClass} label="Budget Class" onChange={set('budgetClass')}>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Onset">Onset (INCA wide format)</MenuItem>
            <MenuItem value="Interiojet">Interiojet (Jeti)</MenuItem>
            <MenuItem value="Oberon">Oberon (Jeti variant)</MenuItem>
            <MenuItem value="Speedset">Speedset (Packaging narrow web)</MenuItem>
            <MenuItem value="Print Engi">Print Engineering</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Region</InputLabel>
          <Select value={filters.region} label="Region" onChange={set('region')}>
            <MenuItem value="All">All Regions</MenuItem>
            <MenuItem value="Europe">Europe</MenuItem>
            <MenuItem value="Americas">Americas</MenuItem>
            <MenuItem value="Asia Pacific">Asia Pacific</MenuItem>
            <MenuItem value="MEA">Middle East & Africa</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Paper>
  );
};
