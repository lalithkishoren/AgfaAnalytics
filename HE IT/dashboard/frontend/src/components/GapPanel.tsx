import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface Props {
  severity: 'gap' | 'partial';
  title: string;
  description: string;
}

export default function GapPanel({ severity, title, description }: Props) {
  const isGap = severity === 'gap';
  const borderColor = isGap ? '#D32F2F' : '#ED6C02';
  const bgColor = isGap ? '#FFF5F5' : '#FFFBF0';
  const iconColor = borderColor;
  const Icon = isGap ? ErrorOutlineIcon : WarningAmberIcon;
  const badgeLabel = isGap ? 'DATA GAP' : 'PARTIAL DATA';
  const badgeBg = isGap ? '#D32F2F' : '#ED6C02';

  return (
    <Paper
      elevation={0}
      sx={{
        borderLeft: `4px solid ${borderColor}`,
        bgcolor: bgColor,
        p: 2.5,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        border: `1px solid ${borderColor}22`,
        borderLeftColor: borderColor,
        borderLeftWidth: 4,
      }}
    >
      <Icon sx={{ color: iconColor, mt: 0.2, flexShrink: 0 }} />
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1A2027' }}>
            {title}
          </Typography>
          <Box
            sx={{
              bgcolor: badgeBg,
              color: '#fff',
              px: 0.8,
              py: 0.1,
              borderRadius: 0.5,
              fontSize: '0.62rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
            }}
          >
            {badgeLabel}
          </Box>
        </Box>
        <Typography variant="body2" sx={{ color: '#637381', lineHeight: 1.5 }}>
          {description}
        </Typography>
      </Box>
    </Paper>
  );
}
