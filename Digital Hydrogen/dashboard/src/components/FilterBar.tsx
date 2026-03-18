import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Button, Paper, SelectChangeEvent } from '@mui/material';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import { GlobalFilters } from '../types';

interface FilterBarProps {
  filters: GlobalFilters;
  actions: {
    setYear: (v: number | 'all') => void;
    setQuarter: (v: string | 'all') => void;
    setProduct: (v: string | 'all') => void;
    setRegion: (v: string | 'all') => void;
    setCustomer: (v: string | 'all') => void;
    setMultiple?: (v: Partial<import('../types').GlobalFilters>) => void;
    resetAll: () => void;
  };
  years: number[];
  products: string[];
  regions: string[];
  customers: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, actions, years, products, regions, customers }) => {
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
          {years.map(y => <MenuItem key={y} value={String(y)}>{y}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 90 }}>
        <InputLabel>Quarter</InputLabel>
        <Select value={filters.quarter} onChange={(e) => actions.setQuarter(e.target.value)} label="Quarter">
          <MenuItem value="all">All</MenuItem>
          {['Q1','Q2','Q3','Q4'].map(q => <MenuItem key={q} value={q}>{q}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Product</InputLabel>
        <Select value={filters.product} onChange={(e) => actions.setProduct(e.target.value)} label="Product">
          <MenuItem value="all">All Products</MenuItem>
          {products.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>Region</InputLabel>
        <Select value={filters.region} onChange={(e) => actions.setRegion(e.target.value)} label="Region">
          <MenuItem value="all">All Regions</MenuItem>
          {regions.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel>Customer</InputLabel>
        <Select value={filters.customer} onChange={(e) => actions.setCustomer(e.target.value)} label="Customer">
          <MenuItem value="all">All Customers</MenuItem>
          {customers.slice(0, 50).map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
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
