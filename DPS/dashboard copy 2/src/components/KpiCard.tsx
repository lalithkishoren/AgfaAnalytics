import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Tooltip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { DataConfidence } from '../types';

const CONFIDENCE_STYLES: Record<DataConfidence, { label: string; color: string; bg: string; border: string }> = {
  verified: { label: 'Verified', color: '#2E7D32', bg: '#E8F5E9', border: '1px solid #e0e0e0' },
  derived: { label: 'Derived', color: '#1565C0', bg: '#E3F2FD', border: '1px solid #e0e0e0' },
  estimated: { label: 'Estimated', color: '#E65100', bg: '#FFF3E0', border: '1px solid #e0e0e0' },
  proxy: { label: 'Data Gap', color: '#D32F2F', bg: '#FFFBF5', border: '2px dashed #EF9A9A' },
};

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: number;
  trendLabel?: string;
  status?: 'success' | 'warning' | 'error' | 'info';
  dataConfidence: DataConfidence;
  dataNote?: string;
  icon?: React.ReactNode;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title, value, subtitle, trend, trendLabel, status, dataConfidence, dataNote, icon
}) => {
  const conf = CONFIDENCE_STYLES[dataConfidence];
  const statusColor = status === 'success' ? '#2E7D32'
    : status === 'warning' ? '#F57C00'
    : status === 'error' ? '#D32F2F'
    : '#1565C0';

  return (
    <Card sx={{ height: '100%', background: conf.bg, border: conf.border, borderRadius: '12px' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, flex: 1, mr: 1 }}>
            {title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', flexShrink: 0 }}>
            {icon && <Box sx={{ color: conf.color }}>{icon}</Box>}
            <Chip
              label={conf.label}
              size="small"
              sx={{ fontSize: '0.65rem', height: 18, bgcolor: conf.color, color: '#fff' }}
            />
          </Box>
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 700, color: statusColor, mb: 0.5 }}>
          {value}
        </Typography>

        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}

        {(trend !== undefined || trendLabel) && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
            {trend !== undefined && (
              trend > 0
                ? <TrendingUpIcon sx={{ fontSize: 16, color: '#2E7D32' }} />
                : trend < 0
                ? <TrendingDownIcon sx={{ fontSize: 16, color: '#D32F2F' }} />
                : <TrendingFlatIcon sx={{ fontSize: 16, color: '#757575' }} />
            )}
            {trendLabel && (
              <Typography
                variant="caption"
                sx={{
                  color: trend !== undefined && trend < 0
                    ? '#D32F2F'
                    : trend !== undefined && trend > 0
                    ? '#2E7D32'
                    : '#757575',
                }}
              >
                {trendLabel}
              </Typography>
            )}
          </Box>
        )}

        {dataNote && (
          <Tooltip title={dataNote} arrow>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1, cursor: 'help' }}>
              <InfoOutlinedIcon sx={{ fontSize: 13, color: conf.color }} />
              <Typography
                variant="caption"
                sx={{ color: conf.color, fontStyle: 'italic', fontSize: '0.65rem' }}
              >
                {dataNote.length > 60 ? dataNote.substring(0, 60) + '…' : dataNote}
              </Typography>
            </Box>
          </Tooltip>
        )}
      </CardContent>
    </Card>
  );
};
