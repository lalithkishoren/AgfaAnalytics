import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export const DataConfidenceLegend: React.FC = () => (
  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', px: 1, py: 0.75, bgcolor: '#FAFAFA', borderRadius: 1, border: '1px solid #E0E0E0', mb: 2 }}>
    <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.65rem', color: '#616161', mr: 0.5 }}>DATA TRUST:</Typography>
    <Chip icon={<VerifiedIcon sx={{ fontSize: '12px !important', color: '#2E7D32 !important' }} />} label="Verified — from source" size="small"
      sx={{ height: 20, fontSize: '0.6rem', bgcolor: '#E8F5E9', color: '#2E7D32', '& .MuiChip-icon': { ml: '4px' } }} />
    <Chip icon={<VerifiedIcon sx={{ fontSize: '12px !important', color: '#1565C0 !important' }} />} label="Derived — calculated" size="small"
      sx={{ height: 20, fontSize: '0.6rem', bgcolor: '#E3F2FD', color: '#1565C0', '& .MuiChip-icon': { ml: '4px' } }} />
    <Chip icon={<WarningAmberIcon sx={{ fontSize: '12px !important', color: '#E65100 !important' }} />} label="Estimated — hardcoded from analysis" size="small"
      sx={{ height: 20, fontSize: '0.6rem', bgcolor: '#FFF3E0', color: '#E65100', '& .MuiChip-icon': { ml: '4px' } }} />
    <Chip icon={<HelpOutlineIcon sx={{ fontSize: '12px !important', color: '#D32F2F !important' }} />} label="Proxy — no direct data" size="small"
      sx={{ height: 20, fontSize: '0.6rem', bgcolor: '#FFEBEE', color: '#D32F2F', '& .MuiChip-icon': { ml: '4px' } }} />
  </Box>
);
