import React from 'react';
import { Box, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface ChartNoteProps {
  source: string;
  note?: string;
}

export const ChartNote: React.FC<ChartNoteProps> = ({ source, note }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, mt: 1, px: 1 }}>
    <InfoOutlinedIcon sx={{ fontSize: 13, color: '#5A6872', mt: '2px', flexShrink: 0 }} />
    <Typography variant="caption" color="text.secondary">
      <strong>Source:</strong> {source}{note && ` — ${note}`}
    </Typography>
  </Box>
);
