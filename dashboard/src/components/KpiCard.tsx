import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Tooltip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import VerifiedIcon from '@mui/icons-material/Verified';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { STATUS_COLORS } from '../theme';

/**
 * dataConfidence: controls the visual data-trust indicator
 *   'verified'   — green badge, data comes directly from source system (SAP / Excel)
 *   'derived'    — amber badge, calculated or aggregated from source data
 *   'estimated'  — orange outline, hardcoded or manually estimated from analysis
 *   'proxy'      — red dashed outline, no direct data — using a proxy metric
 *   undefined    — no badge shown (backward compatible)
 *
 * dataNote: tooltip text explaining how the value was sourced / calculated
 */
export type DataConfidence = 'verified' | 'derived' | 'estimated' | 'proxy';

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: number;
  trendLabel?: string;
  status?: 'green' | 'amber' | 'red' | 'blue';
  icon?: React.ReactNode;
  dataConfidence?: DataConfidence;
  dataNote?: string;
}

const CONFIDENCE_CONFIG: Record<DataConfidence, { label: string; color: string; bg: string; borderStyle?: string; Icon: React.ElementType }> = {
  verified: { label: 'Verified', color: '#2E7D32', bg: '#E8F5E9', Icon: VerifiedIcon },
  derived:  { label: 'Derived', color: '#1565C0', bg: '#E3F2FD', Icon: VerifiedIcon },
  estimated:{ label: 'Estimated', color: '#E65100', bg: '#FFF3E0', Icon: WarningAmberIcon },
  proxy:    { label: 'Proxy', color: '#D32F2F', bg: '#FFEBEE', borderStyle: '2px dashed #EF9A9A', Icon: HelpOutlineIcon },
};

export const KpiCard: React.FC<KpiCardProps> = ({
  title, value, subtitle, trend, trendLabel, status, icon, dataConfidence, dataNote,
}) => {
  const statusStyle = status ? STATUS_COLORS[status] : undefined;
  const TrendIcon = trend !== undefined
    ? (trend > 0 ? TrendingUpIcon : trend < 0 ? TrendingDownIcon : TrendingFlatIcon)
    : null;
  const trendColor = trend !== undefined
    ? (trend > 0 ? '#2E7D32' : trend < 0 ? '#D32F2F' : '#78909C')
    : '#78909C';

  const conf = dataConfidence ? CONFIDENCE_CONFIG[dataConfidence] : null;

  const card = (
    <Card sx={{
      height: '100%',
      borderLeft: statusStyle ? `4px solid ${statusStyle.border}` : undefined,
      border: conf?.borderStyle || undefined,
      position: 'relative',
      overflow: 'visible',
      ...(dataConfidence === 'proxy' ? { bgcolor: '#FFFBF5' } : {}),
      ...(dataConfidence === 'estimated' ? { bgcolor: '#FFFDF6' } : {}),
    }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        {/* Data confidence badge — top-right */}
        {conf && (
          <Box sx={{ position: 'absolute', top: 6, right: 6 }}>
            <Chip
              icon={<conf.Icon sx={{ fontSize: '14px !important', color: `${conf.color} !important` }} />}
              label={conf.label}
              size="small"
              sx={{
                height: 20, fontSize: '0.6rem', fontWeight: 700,
                bgcolor: conf.bg, color: conf.color,
                '& .MuiChip-icon': { ml: '4px' },
              }}
            />
          </Box>
        )}

        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box sx={{ maxWidth: conf ? 'calc(100% - 80px)' : '100%' }}>
            <Typography variant="subtitle2" sx={{ mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
              {title}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, color: statusStyle?.text || 'text.primary' }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          {icon && (
            <Box sx={{ color: 'primary.light', opacity: 0.6 }}>
              {icon}
            </Box>
          )}
        </Box>
        {(trend !== undefined || trendLabel) && (
          <Box display="flex" alignItems="center" mt={1} gap={0.5}>
            {TrendIcon && <TrendIcon sx={{ fontSize: 16, color: trendColor }} />}
            {trendLabel && (
              <Chip
                label={trendLabel}
                size="small"
                sx={{
                  height: 20, fontSize: '0.65rem', fontWeight: 600,
                  backgroundColor: trend !== undefined ? (trend >= 0 ? '#E8F5E9' : '#FFEBEE') : '#E3F2FD',
                  color: trendColor,
                }}
              />
            )}
          </Box>
        )}
        {/* Data source note */}
        {dataNote && (
          <Typography variant="caption" sx={{ display: 'block', mt: 1, fontSize: '0.6rem', color: conf?.color || '#78909C', fontStyle: 'italic', lineHeight: 1.3 }}>
            {dataNote}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return dataNote ? (
    <Tooltip title={dataNote} arrow placement="top">
      {card}
    </Tooltip>
  ) : card;
};
