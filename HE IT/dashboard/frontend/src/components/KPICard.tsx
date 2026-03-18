import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
  Tooltip,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import DataQualityBadge from './DataQualityBadge';
import { DataQuality } from '../types';

interface Props {
  title: string;
  value: number | null;
  unit?: string;
  targetValue?: number | null;
  subtitle?: string;
  quality?: DataQuality | 'live' | 'partial' | 'gap' | 'derived';
  loading?: boolean;
  tooltipText?: string;
}

function formatKEUR(value: number | null): string {
  if (value === null || isNaN(value)) return '—';
  return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function getRAGColor(actual: number, target: number): { bg: string; text: string; border: string } {
  if (target === 0) return { bg: '#E3F2FD', text: '#1565C0', border: '#90CAF9' };
  const pct = actual / target;
  if (pct >= 0.95) return { bg: '#E8F5E9', text: '#2E7D32', border: '#A5D6A7' };
  if (pct >= 0.80) return { bg: '#FFF3E0', text: '#E65100', border: '#FFCC80' };
  return { bg: '#FFEBEE', text: '#C62828', border: '#FFCDD2' };
}

function getTrendPct(actual: number, target: number): number {
  if (target === 0) return 0;
  return ((actual - target) / Math.abs(target)) * 100;
}

export default function KPICard({
  title,
  value,
  unit = 'kEUR',
  targetValue,
  subtitle,
  quality = 'live',
  loading = false,
  tooltipText,
}: Props) {
  const hasTarget = targetValue !== null && targetValue !== undefined;
  const trendPct = hasTarget && value !== null ? getTrendPct(value, targetValue!) : null;
  const ragColors =
    hasTarget && value !== null
      ? getRAGColor(value, targetValue!)
      : { bg: '#F5F7FA', text: '#003C7E', border: '#E0E3E7' };

  const TrendIcon =
    trendPct === null ? null : trendPct > 2 ? TrendingUpIcon : trendPct < -2 ? TrendingDownIcon : TrendingFlatIcon;

  const cardContent = (
    <Card
      sx={{
        height: '100%',
        border: `1px solid ${ragColors.border}`,
        bgcolor: ragColors.bg,
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: 4 },
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        {/* Header row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              color: '#637381',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontSize: '0.68rem',
              lineHeight: 1.3,
              flex: 1,
              pr: 1,
            }}
          >
            {title}
          </Typography>
          {quality && <DataQualityBadge quality={quality} size="small" />}
        </Box>

        {/* Value */}
        {loading ? (
          <Skeleton variant="text" width="70%" height={48} />
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: ragColors.text,
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                lineHeight: 1.1,
              }}
            >
              {formatKEUR(value)}
            </Typography>
            <Typography variant="caption" sx={{ color: ragColors.text, fontWeight: 500, opacity: 0.8 }}>
              {unit}
            </Typography>
          </Box>
        )}

        {/* Trend vs target */}
        {!loading && hasTarget && trendPct !== null && TrendIcon && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
            <TrendIcon
              sx={{
                fontSize: 16,
                color: trendPct >= 0 ? '#2E7D32' : '#C62828',
              }}
            />
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: trendPct >= 0 ? '#2E7D32' : '#C62828',
                fontSize: '0.72rem',
              }}
            >
              {trendPct >= 0 ? '+' : ''}{trendPct.toFixed(1)}% vs target
            </Typography>
          </Box>
        )}

        {/* Target row */}
        {!loading && hasTarget && (
          <Typography variant="caption" sx={{ color: '#90A4AE', display: 'block', mt: 0.3 }}>
            Target: {formatKEUR(targetValue!)} {unit}
          </Typography>
        )}

        {/* Subtitle */}
        {subtitle && !loading && (
          <Typography variant="caption" sx={{ color: '#90A4AE', display: 'block', mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  if (tooltipText) {
    return <Tooltip title={tooltipText} placement="top">{cardContent}</Tooltip>;
  }
  return cardContent;
}
