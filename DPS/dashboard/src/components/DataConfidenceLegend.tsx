import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import CalculateIcon from '@mui/icons-material/Calculate';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const LEVELS = [
  {
    label: 'Verified',
    desc: 'Direct from source',
    color: '#2E7D32',
    icon: <VerifiedIcon sx={{ fontSize: 14 }} />,
  },
  {
    label: 'Derived',
    desc: 'Calculated from sources',
    color: '#1565C0',
    icon: <CalculateIcon sx={{ fontSize: 14 }} />,
  },
  {
    label: 'Estimated',
    desc: 'Approximated / partial',
    color: '#E65100',
    icon: <WarningAmberIcon sx={{ fontSize: 14 }} />,
  },
  {
    label: 'Data Gap',
    desc: 'Not in current data',
    color: '#D32F2F',
    icon: <HelpOutlineIcon sx={{ fontSize: 14 }} />,
  },
];

export const DataConfidenceLegend: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      flexWrap: 'wrap',
      p: 1.5,
      bgcolor: '#F5F7FA',
      borderRadius: 1,
      border: '1px solid #e0e0e0',
      mb: 2,
    }}
  >
    <Typography variant="caption" sx={{ fontWeight: 600, color: '#5A6872' }}>
      Data Confidence:
    </Typography>
    {LEVELS.map(l => (
      <Box key={l.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Chip
          icon={l.icon}
          label={l.label}
          size="small"
          sx={{
            bgcolor: l.color,
            color: '#fff',
            fontSize: '0.7rem',
            height: 22,
            '& .MuiChip-icon': { color: '#fff' },
          }}
        />
        <Typography variant="caption" color="text.secondary">
          {l.desc}
        </Typography>
      </Box>
    ))}
  </Box>
);
