import { useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Tooltip,
  IconButton,
  Collapse,
  useMediaQuery,
  useTheme,
  Chip,
  OutlinedInput,
  SelectChangeEvent,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useFilters } from '../context/FilterContext';

export default function GlobalFilters() {
  const { filters, dispatch, buOptions, regionOptions, countryOptions, yearOptions } = useFilters();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expanded, setExpanded] = useState(!isMobile);

  const handleBUChange = (event: SelectChangeEvent<string[]>) => {
    const val = event.target.value;
    dispatch({ type: 'SET_BU', payload: typeof val === 'string' ? val.split(',') : val });
  };

  const handleRegionChange = (event: SelectChangeEvent<string[]>) => {
    const val = event.target.value;
    dispatch({ type: 'SET_REGION', payload: typeof val === 'string' ? val.split(',') : val });
  };

  const handleCountryChange = (event: SelectChangeEvent<string[]>) => {
    const val = event.target.value;
    dispatch({ type: 'SET_COUNTRY', payload: typeof val === 'string' ? val.split(',') : val });
  };

  const handleYearChange = (event: SelectChangeEvent<string>) => {
    dispatch({ type: 'SET_YEAR', payload: event.target.value });
  };

  const now = new Date();
  const lastRefresh = now.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const renderMultiValue = (selected: string[], placeholder = 'All') => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.3 }}>
      {(selected as string[]).length === 0 ? (
        <Typography sx={{ fontSize: '0.78rem', color: '#90A4AE' }}>{placeholder}</Typography>
      ) : (
        (selected as string[]).map((v) => (
          <Chip key={v} label={v} size="small" sx={{ height: 18, fontSize: '0.7rem' }} />
        ))
      )}
    </Box>
  );

  return (
    <Box
      sx={{
        bgcolor: '#ffffff',
        borderBottom: '1px solid #E0E3E7',
        px: { xs: 1.5, md: 3 },
        py: 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {isMobile && (
          <IconButton size="small" onClick={() => setExpanded((e) => !e)} color="primary">
            <FilterListIcon fontSize="small" />
          </IconButton>
        )}

        <Collapse in={expanded || !isMobile} orientation="horizontal" sx={{ flex: 1 }}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1.5,
              alignItems: 'center',
              py: 0.5,
            }}
          >
            {/* Year filter */}
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel sx={{ fontSize: '0.8rem' }}>Year</InputLabel>
              <Select
                value={filters.selectedYear}
                label="Year"
                onChange={handleYearChange}
                sx={{ fontSize: '0.82rem' }}
              >
                {yearOptions.map((y) => (
                  <MenuItem key={y} value={y} sx={{ fontSize: '0.82rem' }}>{y}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* BU multi-select */}
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel sx={{ fontSize: '0.8rem' }}>Business Unit</InputLabel>
              <Select
                multiple
                value={filters.selectedBU}
                onChange={handleBUChange}
                input={<OutlinedInput label="Business Unit" />}
                renderValue={(sel) => renderMultiValue(sel as string[], 'All BUs')}
                sx={{ fontSize: '0.82rem' }}
              >
                {buOptions.map((bu) => (
                  <MenuItem key={bu} value={bu} sx={{ fontSize: '0.82rem' }}>{bu}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Region multi-select (high-level groups) */}
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel sx={{ fontSize: '0.8rem' }}>Region</InputLabel>
              <Select
                multiple
                value={filters.selectedRegion}
                onChange={handleRegionChange}
                input={<OutlinedInput label="Region" />}
                renderValue={(sel) => renderMultiValue(sel as string[], 'All Regions')}
                sx={{ fontSize: '0.82rem' }}
              >
                {regionOptions.map((r) => (
                  <MenuItem key={r} value={r} sx={{ fontSize: '0.82rem' }}>{r}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Country sub-filter (cascades from Region) */}
            <Tooltip
              title={
                filters.selectedRegion.length === 0
                  ? 'Select a region first to filter by country'
                  : 'Filter within the selected region(s)'
              }
              placement="bottom"
            >
              <span> {/* wrapper needed for disabled tooltip */}
                <FormControl
                  size="small"
                  sx={{ minWidth: 160 }}
                >
                  <InputLabel sx={{ fontSize: '0.8rem', color: filters.selectedRegion.length === 0 ? '#90A4AE' : undefined }}>
                    Country / Sub-region
                  </InputLabel>
                  <Select
                    multiple
                    value={filters.selectedCountry}
                    onChange={handleCountryChange}
                    input={<OutlinedInput label="Country / Sub-region" />}
                    renderValue={(sel) => renderMultiValue(sel as string[], 'All Countries')}
                    sx={{
                      fontSize: '0.82rem',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderStyle: filters.selectedRegion.length === 0 ? 'dashed' : 'solid',
                        borderColor: filters.selectedRegion.length === 0 ? '#CFD8DC' : undefined,
                      },
                    }}
                  >
                    {countryOptions.map((c) => (
                      <MenuItem key={c} value={c} sx={{ fontSize: '0.82rem' }}>{c}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </span>
            </Tooltip>

            {/* Reset */}
            <Tooltip title="Reset all filters">
              <IconButton
                size="small"
                onClick={() => dispatch({ type: 'RESET' })}
                sx={{ color: '#90A4AE', '&:hover': { color: '#003C7E' } }}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* Active filter summary */}
            {(filters.selectedRegion.length > 0 || filters.selectedCountry.length > 0 || filters.selectedBU.length > 1) && (
              <Typography variant="caption" sx={{ color: '#1565C0', fontSize: '0.7rem', fontStyle: 'italic' }}>
                Filtered
              </Typography>
            )}

            {/* Last refresh */}
            <Typography
              variant="caption"
              sx={{
                color: '#90A4AE',
                ml: 'auto',
                fontSize: '0.7rem',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Data as of: {lastRefresh}
            </Typography>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
}
