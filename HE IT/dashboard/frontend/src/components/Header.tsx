import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import DataQualityBadge from './DataQualityBadge';
import { DataQuality } from '../types';

export default function Header() {
  return (
    <AppBar
      position="sticky"
      elevation={2}
      sx={{
        bgcolor: '#003C7E',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, px: { xs: 2, md: 3 } }}>
        {/* AGFA Logo text */}
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                bgcolor: '#E63312',
                color: '#fff',
                fontWeight: 900,
                fontSize: { xs: '1rem', sm: '1.25rem' },
                px: 1.2,
                py: 0.2,
                borderRadius: 0.5,
                letterSpacing: '0.05em',
                fontFamily: '"Roboto", sans-serif',
                lineHeight: 1.3,
              }}
            >
              AGFA
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: '#ffffff',
                  fontSize: { xs: '0.9rem', sm: '1.05rem' },
                  lineHeight: 1.2,
                  letterSpacing: '0.01em',
                }}
              >
                HE IT Business Intelligence Dashboard
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255,255,255,0.65)',
                  fontSize: '0.68rem',
                  letterSpacing: '0.04em',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                Healthcare Enterprise · IT Division · Analytics Platform
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Data quality legend */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 1,
            bgcolor: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 1,
            px: 1.5,
            py: 0.7,
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: 'rgba(255,255,255,0.5)', mr: 0.5, fontSize: '0.65rem', letterSpacing: '0.05em' }}
          >
            DATA QUALITY:
          </Typography>
          <DataQualityBadge quality={DataQuality.LIVE} size="small" />
          <DataQualityBadge quality={DataQuality.PARTIAL} size="small" />
          <DataQualityBadge quality={DataQuality.DERIVED} size="small" />
          <DataQualityBadge quality={DataQuality.GAP} size="small" />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
