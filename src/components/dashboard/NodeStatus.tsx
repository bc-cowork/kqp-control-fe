'use client';

import type { INodeItem } from 'src/types/dashboard';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Chip, Stack, SvgIcon, LinearProgress, CircularProgress } from '@mui/material';

import { useTranslate } from 'src/locales';
import { useGetStatus } from 'src/actions/dashboard';
import { grey, error, common, success } from 'src/theme/core';

// ----------------------------------------------------------------------

type Props = {
  selectedNodeParam: string;
  selectedNode: INodeItem;
};

export function NodeStatus({
  selectedNodeParam,
  selectedNode,
}: Props) {
  const { status, statusLoading, statusError } = useGetStatus(selectedNodeParam);

  const { t } = useTranslate('dashboard');
  const theme = useTheme();

  const isOnline = status?.service_status?.okay;

  return (
    <Box
      sx={{
        borderRadius: 1,
        backgroundColor: theme.palette.grey[900],
        height: '505px',
        p: 0.5,
      }}
    >
      {statusLoading ? (
        <CircularProgress />
      ) : statusError ? (
        <Typography>Error Fetching Status</Typography>
      ) : (
        <Box>
          <Box
            sx={{
              p: 2,
              background: `radial-gradient(100% 100% at 0% 100%, ${isOnline ? success.dark : error.dark} 0%, ${isOnline ? '#1D2F20' : '#331B1E'} 100%)`,
              mb: 0.5,
              borderRadius: '8px',
            }}
          >
            <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
              <Chip
                label={isOnline ? t('info.online') : t('info.offline')}
                color={isOnline ? 'success' : 'error'}
                size="small"
                variant="status"
                sx={{
                  fontSize: 17,
                  border: `1px solid ${isOnline ? '#DDF4DA' : '#F4D8D8'}`,
                  backgroundColor: isOnline ? '#EBFBE9' : '#FFF2F4',
                }}
                icon={
                  <SvgIcon>
                    <svg
                      width="12"
                      height="13"
                      viewBox="0 0 12 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="6"
                        cy="6.30078"
                        r="4"
                        fill={isOnline ? theme.palette.success.main : theme.palette.error.main}
                      />
                    </svg>
                  </SvgIcon>
                }
              />
            </Stack>

            <Stack direction="row" alignItems="center" sx={{ mb: 0.5 }}>
              <Typography sx={{ fontSize: 19, fontWeight: 500, color: common.white }}>
                {selectedNode.id}
              </Typography>
              <SvgIcon sx={{ width: '1px', height: '12px', mx: 1 }}>
                <svg
                  width="1"
                  height="12"
                  viewBox="0 0 1 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="1" height="12" fill={isOnline ? success.lighter : error.lighter} />
                </svg>
              </SvgIcon>
              <Typography variant="body2" sx={{ color: common.white }}>
                {selectedNode.name}
              </Typography>
            </Stack>

            <Typography variant="body2" sx={{ color: common.white }}>
              {selectedNode.desc}
            </Typography>
          </Box>

          <Box
            sx={{
              p: 2,
              mb: 0.5,
              borderRadius: '8px',
              backgroundColor: grey[800],
              height: '198px',
            }}
          >
            <Stack direction="row" sx={{ mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ width: '60%', color: grey[400] }}>
                {t('info.emittable')}
              </Typography>
              <Typography variant="body2">
                {selectedNode.emittable ? (
                  <Chip label={t('info.true')} color="success" size="small" variant="outlined"
                    sx={{
                      backgroundColor: '#1D2F20',
                    }}
                  />
                ) : (
                  <Chip label={t('info.false')} color="error" size="small" variant="outlined" sx={{
                    backgroundColor: '#331B1E'
                  }} />
                )}
              </Typography>
            </Stack>
            <Stack direction="row" sx={{ mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ width: '60%', color: grey[400] }}>
                {t('info.emit_count')}
              </Typography>
              <Typography variant="body2" sx={{ color: grey[50] }}>
                {selectedNode.emit_count.toLocaleString()}
              </Typography>
            </Stack>
          </Box>

          <Box sx={{ p: 2, borderRadius: '8px', backgroundColor: grey[800] }}>
            <Typography sx={{ fontSize: 17, fontWeight: 500, color: '#AFB7C8' }}>
              {t('disk.disk')}
            </Typography>
            <Typography sx={{ fontSize: 28, fontWeight: 500, color: grey[50] }}>21%</Typography>
            <Typography sx={{ fontSize: 16, fontWeight: 400, color: '#AFB7C8' }}>
              <Box component="span" sx={{ fontWeight: 500, color: grey[50] }}>
                853 GB
              </Box>{' '}
              of 952 GB
            </Typography>

            {/* Progress Bar */}
            <Box sx={{ position: 'relative', width: '100%' }}>
              {/* Main Progress Bar */}
              <LinearProgress
                variant="determinate"
                value={21}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: '#e0e0e0', // Gray unfilled section
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#4A3BFF', // Blue filled section
                    borderRadius: 5,
                  },
                }}
              />

              {/* Red Warning Section at 90% */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: '90%',
                  width: '10%',
                  height: 10,
                  backgroundColor: '#FFEBEE', // Light red for warning
                  borderRadius: '0 5px 5px 0',
                }}
              />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
