import React from 'react';
import { Chip } from '@mui/material';
import { DataQuality } from '../types';

interface Props {
  quality: DataQuality | 'live' | 'partial' | 'gap' | 'derived';
  size?: 'small' | 'medium';
}

const QUALITY_CONFIG = {
  live: {
    label: 'LIVE',
    bgcolor: '#2E7D32',
    color: '#ffffff',
  },
  partial: {
    label: 'PARTIAL',
    bgcolor: '#ED6C02',
    color: '#ffffff',
  },
  gap: {
    label: 'GAP',
    bgcolor: '#D32F2F',
    color: '#ffffff',
  },
  derived: {
    label: 'DERIVED',
    bgcolor: '#1565C0',
    color: '#ffffff',
  },
};

export default function DataQualityBadge({ quality, size = 'small' }: Props) {
  const key = (typeof quality === 'string' ? quality : String(quality)) as keyof typeof QUALITY_CONFIG;
  const config = QUALITY_CONFIG[key] ?? QUALITY_CONFIG.gap;

  return (
    <Chip
      label={config.label}
      size={size}
      sx={{
        bgcolor: config.bgcolor,
        color: config.color,
        fontWeight: 700,
        fontSize: size === 'small' ? '0.65rem' : '0.75rem',
        height: size === 'small' ? 18 : 24,
        letterSpacing: '0.06em',
        '& .MuiChip-label': {
          px: size === 'small' ? 0.8 : 1.2,
        },
      }}
    />
  );
}
