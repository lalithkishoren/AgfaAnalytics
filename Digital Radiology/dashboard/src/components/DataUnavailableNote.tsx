import React from 'react';
import { Box, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export const DataUnavailableNote: React.FC<{ source?: string }> = ({ source }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, px: 1.5, py: 0.75, bgcolor: '#FFEBEE', borderRadius: 1, border: '1px solid #EF9A9A' }}>
    <ErrorOutlineIcon sx={{ fontSize: 16, color: '#B71C1C', flexShrink: 0 }} />
    <Typography variant="caption" sx={{ color: '#B71C1C', fontWeight: 500, fontSize: '0.68rem' }}>
      Data not available — illustrative data shown for design purposes.{source ? ` Source required: ${source}` : ' Source connection required (EDW).'}
    </Typography>
  </Box>
);
