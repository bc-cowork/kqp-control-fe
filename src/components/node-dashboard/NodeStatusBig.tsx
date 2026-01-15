'use client';

import type { INodeItem } from 'src/types/dashboard';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Chip, Stack, SvgIcon, LinearProgress, CircularProgress } from '@mui/material';

import { useTranslate } from 'src/locales';
import { useGetDiskMetrics, useGetStatus } from 'src/actions/dashboard';
import { grey, error, common, success } from 'src/theme/core';

// ----------------------------------------------------------------------

type Props = {
  selectedNodeParam: string;
  selectedNode: INodeItem;
};

export function NodeStatusBig({ selectedNodeParam, selectedNode }: Props) {
  const { t } = useTranslate('node-dashboard');
  const { status, statusLoading, statusError } = useGetStatus(selectedNodeParam);
  const { diskMetricsData } = useGetDiskMetrics(selectedNodeParam);


  const theme = useTheme();
  const isOnline = status?.service_status?.okay;

  return (
    <Box
      sx={{
        borderRadius: '12px',
        backgroundColor: theme.palette.mode === 'dark' ? 'transparent' : theme.palette.grey[800],
        padding: theme.palette.mode === 'dark' ? '0px' : '4px'
      }}
    >
      {statusLoading ? (
        <CircularProgress />
      ) : statusError ? (
        <Typography>Error Fetching Status</Typography>
      ) : (
        <Box
        >
          <Box
            sx={{
              p: 2,
              background: `radial-gradient(100% 100% at 0% 100%, ${isOnline ? success.dark : error.dark} 0%, ${isOnline ? '#1D2F20' : '#331B1E'} 100%)`,
              mb: theme.palette.mode === 'dark' ? '12px' : '4px',
              borderRadius: '8px',
              border: `1px solid ${isOnline ? '#36573C' : '#4A2C31'}`,
            }}
          >
            <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
              <Chip
                label={isOnline ? t('left_side.online') : t('left_side.offline')}
                color={isOnline ? 'success' : 'error'}
                size="small"
                variant="status"
                sx={{
                  fontSize: 17,
                  border: `1px solid ${isOnline ? '#1D2F20' : '#331B1E'}`,
                  backgroundColor: isOnline ? '#1D2F20' : '#331B1E',
                  boxShadow: isOnline ? '2px 2px 8px 0 rgba(27, 240, 27, 0.50)' : '2px 2px 8px 0 rgba(240, 27, 62, 0.50)'
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

            <Stack direction="row" alignItems="center" sx={{ mb: '12px' }}>
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
              mb: theme.palette.mode === 'dark' ? '12px' : '4px',
              borderRadius: '8px',
              backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.primary.contrastText,
              height: theme.palette.mode === 'dark' ? 'calc(100vh - 475px)' : 'calc(100vh - 464px)'
            }}
          >
            <Stack direction="row" sx={{ mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ width: '60%', color: theme.palette.mode === 'dark' ? grey[400] : grey[800] }}>
                {t('left_side.emitable')}
              </Typography>
              <Typography variant="body2">
                {selectedNode.emittable ? (
                  <Chip label={t('left_side.true')} color="success" size="small" variant="outlined" />
                ) : (
                  <Chip label={t('left_side.false')} color="error" size="small" variant="outlined" />
                )}
              </Typography>
            </Stack>
            <Stack direction="row" sx={{ mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ width: '60%', color: theme.palette.mode === 'dark' ? grey[400] : grey[800] }}>
                {t('left_side.emit_count')}
              </Typography>
              <Typography variant="body2"
                style={{
                  color: theme.palette.mode === 'dark' ? grey[50] : grey[400]
                }}
              >
                {selectedNode.emit_count.toLocaleString()}
              </Typography>
            </Stack>
          </Box>

          <Box sx={{
            p: 2, borderRadius: '8px',
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.primary.contrastText,
          }}>
            <Typography sx={{
              fontSize: 17, fontWeight: 500,
              color: theme.palette.mode === 'dark' ? '#AFB7C8' : grey[800]
            }}>
              {t('left_side.disk')}
            </Typography>
            <Typography sx={{
              fontSize: 28, fontWeight: 500,
              color: theme.palette.mode === 'dark' ? grey[50] : grey[800]
            }}>{diskMetricsData?.disk_usage}%</Typography>
            <Typography sx={{
              fontSize: 16, fontWeight: 400, color: theme.palette.mode === 'dark' ? '#D1D6E0' : '#667085'
            }}>
              <Box component="span" sx={{
                fontWeight: 500,
                color: theme.palette.mode === 'dark' ? grey[50] : grey[400]
              }}>
                {diskMetricsData?.disk_used_size} GB
              </Box>{' '}
              of {diskMetricsData?.disk_total_size} GB
            </Typography>

            {/* Progress Bar */}
            <Box sx={{ position: 'relative', width: '100%' }}>
              {/* Main Progress Bar */}
              <LinearProgress
                variant="determinate"
                value={diskMetricsData?.disk_used_size}
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
