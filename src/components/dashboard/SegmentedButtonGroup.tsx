'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { T, ACCENT2 } from 'src/theme/tokens';

// ----------------------------------------------------------------------
// Info-panel view toggle (2×2 / 1×4) — matches k-control-fe-ui exactly:
// active tile uses the lavender gradient + accent text.
// ----------------------------------------------------------------------

type SegmentedButtonGroupProps = {
  tabs: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
};

export function SegmentedButtonGroup({ tabs, value, onChange }: SegmentedButtonGroupProps) {
  return (
    <Stack direction="row" spacing="6px" alignItems="center">
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <Box
            component="button"
            key={tab.value}
            onClick={() => onChange(tab.value)}
            sx={{
              height: 24,
              px: 1,
              borderRadius: '4px',
              fontSize: 15,
              fontWeight: 400,
              fontFamily: 'inherit',
              cursor: 'pointer',
              border: `1px solid ${T.border}`,
              background: active ? `linear-gradient(to top, ${ACCENT2}55, ${ACCENT2}14)` : T.bgCard,
              color: active ? ACCENT2 : T.textSec,
            }}
          >
            {tab.label}
          </Box>
        );
      })}
    </Stack>
  );
}
