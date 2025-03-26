'use client';

import { Box, SvgIcon, Typography } from '@mui/material'; // Import Next.js Link for routing

// ----------------------------------------------------------------------

export function MemoryStockHead() {
  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.primary.darker,
        borderRadius: '8px',
        px: 1,
        py: 2,
      }}
    >
      <Box
        sx={{
          // backgroundColor: (theme) => theme.palette.primary.light,
          mb: 1,
          pb: 1.5,
        }}
      >
        <Typography variant="body2" sx={{ mb: 0.5, color: (theme) => theme.palette.grey[300] }}>
          Last. Price
        </Typography>
        <Typography variant="body2" sx={{ mb: 0.5, color: (theme) => theme.palette.grey[300] }}>
          Last. Vol
        </Typography>
        <Typography variant="body2" sx={{ mb: 0.5, color: (theme) => theme.palette.grey[300] }}>
          Vol. Accum
        </Typography>
        <Typography variant="body2" sx={{ color: (theme) => theme.palette.grey[300] }}>
          Amt. Accum
        </Typography>
      </Box>
      <Box
        sx={{
          // backgroundColor: (theme) => theme.palette.primary.light,
          pt: 1.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <SvgIcon sx={{ mr: 0.5, height: 16, width: 16 }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="16" height="16" rx="4" fill="#DDF4DA" />
              <circle cx="8" cy="8" r="3" fill="#00A41E" />
            </svg>
          </SvgIcon>
          <Typography variant="body2" sx={{ color: (theme) => theme.palette.grey[300] }}>
            Open
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <SvgIcon sx={{ mr: 0.5, height: 16, width: 16 }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="16" height="16" rx="4" fill="#C7DBFF" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1.64645 11.8536C1.45118 11.6583 1.45118 11.3417 1.64645 11.1464L6.64645 6.14645C6.84171 5.95118 7.15829 5.95118 7.35355 6.14645L9.5 8.29289L13.1464 4.64645C13.3417 4.45118 13.6583 4.45118 13.8536 4.64645C14.0488 4.84171 14.0488 5.15829 13.8536 5.35355L9.85355 9.35355C9.65829 9.54882 9.34171 9.54882 9.14645 9.35355L7 7.20711L2.35355 11.8536C2.15829 12.0488 1.84171 12.0488 1.64645 11.8536Z"
                fill="#5E66FF"
              />
            </svg>
          </SvgIcon>
          <Typography variant="body2" sx={{ color: (theme) => theme.palette.grey[300] }}>
            High
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SvgIcon sx={{ mr: 0.5, height: 16, width: 16 }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="16" height="16" rx="4" fill="#FFD8D8" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1.64645 4.64645C1.45118 4.84171 1.45118 5.15829 1.64645 5.35355L6.64645 10.3536C6.84171 10.5488 7.15829 10.5488 7.35355 10.3536L9.5 8.20711L13.1464 11.8536C13.3417 12.0488 13.6583 12.0488 13.8536 11.8536C14.0488 11.6583 14.0488 11.3417 13.8536 11.1464L9.85355 7.14645C9.65829 6.95118 9.34171 6.95118 9.14645 7.14645L7 9.29289L2.35355 4.64645C2.15829 4.45118 1.84171 4.45118 1.64645 4.64645Z"
                fill="#F01B3E"
              />
            </svg>
          </SvgIcon>
          <Typography variant="body2" sx={{ color: (theme) => theme.palette.grey[300] }}>
            Low
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
