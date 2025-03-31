'use client';

import { Box, Stack, SvgIcon, Typography } from '@mui/material'; // Import Next.js Link for routing

// ----------------------------------------------------------------------

type Props = {
  name: string;
  lastPrice: number;
  lastVolume: number;
  volumeAccum: number;
  amountAccum: number;
  open: number;
  high: number;
  low: number;
};

export function MemoryStockItem({
  name,
  lastPrice,
  lastVolume,
  volumeAccum,
  amountAccum,
  open,
  high,
  low,
}: Props) {
  return (
    <Box sx={{ mt: '-24px' }}>
      <Stack direction="row" justifyContent="flex-end">
        <Box
          sx={{
            width: 0,
            height: 0,
            borderBottom: '24px solid white',
            borderLeft: '24px solid transparent',
          }}
        />
        <Box
          sx={{
            width: '44px',
            height: '24px',
            backgroundColor: (theme) => theme.palette.common.white,
            borderTopRightRadius: '8px',
          }}
        >
          <Typography
            sx={{
              color: (theme) => theme.palette.primary.main,
              fontWeight: 400,
              fontSize: 15,
              textAlign: 'center',
              mt: 0.2,
            }}
          >
            {name}
          </Typography>
        </Box>
      </Stack>
      <Box
        sx={{
          width: '100%',
          backgroundColor: (theme) => theme.palette.common.white,
          borderTopLeftRadius: '8px',
          mb: 1,
          pb: 1.5,
          pt: 2,
          pr: 1,
          textAlign: 'right',
        }}
      >
        <Typography
          variant="body2"
          sx={{ mb: 0.5, color: (theme) => theme.palette.grey[600], fontWeight: 500 }}
        >
          {lastPrice.toLocaleString()}
        </Typography>
        <Typography
          variant="body2"
          sx={{ mb: 0.5, color: (theme) => theme.palette.grey[600], fontWeight: 500 }}
        >
          {lastVolume.toLocaleString()}
        </Typography>
        <Typography
          variant="body2"
          sx={{ mb: 0.5, color: (theme) => theme.palette.grey[600], fontWeight: 500 }}
        >
          {volumeAccum.toLocaleString()}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: (theme) => theme.palette.grey[600], fontWeight: 500 }}
        >
          {amountAccum.toLocaleString()}
        </Typography>
      </Box>
      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.common.white,
          pt: 1.5,
          pb: 2,
          pr: 1,
          textAlign: 'right',
          borderBottomLeftRadius: '8px',
          borderBottomRightRadius: '8px',
        }}
      >
        <Typography
          variant="body2"
          sx={{ mb: 0.5, color: (theme) => theme.palette.grey[600], fontWeight: 500 }}
        >
          {open.toLocaleString()}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 0.5,
            width: '100%',
            justifyContent: 'end',
          }}
        >
          <SvgIcon sx={{ mr: 0.5, height: 16, width: 16 }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.25384 4.29372L13.2609 10.1159C13.4467 10.332 13.2932 10.6665 13.0082 10.6665L2.99316 10.6665C2.7081 10.6665 2.55456 10.332 2.74045 10.1158L7.7484 4.2937C7.88141 4.13907 8.12085 4.13908 8.25384 4.29372Z"
                fill="#5E66FF"
              />
            </svg>
          </SvgIcon>
          <Typography
            variant="body2"
            sx={{ color: (theme) => theme.palette.grey[600], fontWeight: 500 }}
          >
            {high.toLocaleString()}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'end' }}>
          <SvgIcon sx={{ mr: 0.5, height: 16, width: 16 }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.74747 11.7068L2.74043 5.88466C2.55457 5.66855 2.70812 5.33398 2.99316 5.33398H13.0082C13.2932 5.33398 13.4467 5.66858 13.2609 5.88469L8.25291 11.7068C8.1199 11.8615 7.88046 11.8614 7.74747 11.7068Z"
                fill="#FF3D4A"
              />
            </svg>
          </SvgIcon>
          <Typography
            variant="body2"
            sx={{ color: (theme) => theme.palette.grey[600], fontWeight: 500 }}
          >
            {low.toLocaleString()}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
