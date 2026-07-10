'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { T } from 'src/theme/tokens';

// ----------------------------------------------------------------------
// Disk usage widget — ditto of k-control-fe-ui's DiskUsage + DiskBar.
// ----------------------------------------------------------------------

const DISK_COLOR = '#4A3BFF';

function DiskBar({ pct, color = DISK_COLOR }: { pct: number; color?: string }) {
  const total = 40;
  const exact = Math.max(0, Math.min(1, pct)) * total;
  const full = Math.floor(exact);
  const frac = exact - full;

  return (
    <Box sx={{ display: 'flex', gap: '2px', mb: '4px' }}>
      {Array.from({ length: total }, (_, i) => {
        const fill = i < full ? 1 : i === full ? frac : 0;
        return (
          <Box
            key={i}
            sx={{ height: 14, flex: 1, borderRadius: '2px', bgcolor: T.bgHover, opacity: fill > 0 ? 1 : 0.4, overflow: 'hidden', position: 'relative' }}
          >
            {fill > 0 && (
              <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${fill * 100}%`, bgcolor: color, opacity: 0.85 }} />
            )}
          </Box>
        );
      })}
    </Box>
  );
}

export function DiskUsage({ used, total }: { used: number; total: number }) {
  const pct = total > 0 ? used / total : 0;
  const label = (pct * 100).toFixed(1);

  return (
    <>
      <Typography sx={{ fontSize: 32, fontWeight: 600, fontFamily: 'Roboto', letterSpacing: '-0.03em', lineHeight: 1, mt: 1, color: T.textPrim }}>
        {label}%
      </Typography>
      <Typography sx={{ fontSize: 14, fontFamily: 'Roboto', color: T.textSec, m: '4px 0 10px' }}>
        <Box component="span" sx={{ color: DISK_COLOR, fontWeight: 500, fontFamily: 'Roboto' }}>{used} GB</Box> / {total} GB
      </Typography>
      <DiskBar pct={pct} />
      <Stack direction="row" justifyContent="space-between" sx={{ fontFamily: 'Roboto', fontSize: 13, color: T.textDim, mt: '4px' }}>
        <span>0</span>
        <span>50</span>
        <span>90</span>
      </Stack>
    </>
  );
}
