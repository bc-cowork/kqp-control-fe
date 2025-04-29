import type { Theme, SxProps } from '@mui/material';

import { Box } from '@mui/material';

import { grey } from 'src/theme/core';

type FadingDividerProps = {
  color?: string;
  fadingColor?: string;
  sx?: SxProps<Theme>;
};

export default function FadingDivider({
  color = grey[400],
  fadingColor = grey[600],
  sx,
}: FadingDividerProps) {
  return (
    <Box
      sx={{
        height: '1px',
        backgroundImage: `linear-gradient(to right, ${fadingColor} 0%, ${color} 25%, ${color} 75%, ${fadingColor} 100%)`,
        margin: '12px 0',
        ...sx,
      }}
    />
  );
}
