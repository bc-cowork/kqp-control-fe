'use client';

import type { INodeItem } from 'src/types/dashboard';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Chip, Stack, SvgIcon, LinearProgress } from '@mui/material';

import { useTranslate } from 'src/locales';
import { useGetDiskMetrics } from 'src/actions/dashboard';
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
  const { diskMetricsData } = useGetDiskMetrics(selectedNodeParam);


  const { t } = useTranslate('dashboard');
  const theme = useTheme();

  const isOnline = selectedNode.online_status;

  return (
    <Box
      sx={{
        borderRadius: 1,
        height: '500px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.mode === 'dark' ? 'transparent' : '#F0F1F5',
        padding: theme.palette.mode === 'dark' ? '0px' : '4px'
      }}
    >
      {(
        <>
          {/* First Box - Fixed Height */}
          <Box
            sx={{
              py: 2,
              px: 1,
              background: `radial-gradient(100% 100% at 0% 100%, ${isOnline ? success.dark : error.dark} 0%, ${isOnline ? '#1D2F20' : '#331B1E'} 100%)`,
              mb: theme.palette.mode === 'dark' ? '8px' : '4px',
              borderRadius: '8px',
              border: `1px solid ${isOnline ? '#36573C' : '#4A2C31'}`,
              flexShrink: 0,
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

          {/* Second Box - Flexible (Stretches to Fill Space) */}
          <Box
            sx={{
              py: 2,
              px: 1,
              mb: theme.palette.mode === 'dark' ? '8px' : '4px',
              border: theme.palette.mode === 'dark' ? '1px solid #4E576A' : 'transparent',
              borderRadius: '8px',
              backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.primary.contrastText,
              height: theme.palette.mode === 'dark' ? 'calc(100vh - 475px)' : 'calc(100vh - 464px)'
            }}
          >
            <Stack direction="row" sx={{ mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ width: '60%', color: theme.palette.mode === 'dark' ? grey[400] : grey[800] }}>
                {t('info.emittable')}
              </Typography>
              <Typography variant="body2">
                {selectedNode.emittable ? (
                  <Chip label={t('info.true')} color="success" size="small" variant="outlined" />
                ) : (
                  <Chip label={t('info.false')} color="error" size="small" variant="outlined" />
                )}
              </Typography>
            </Stack>
            <Stack direction="row" sx={{ mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ width: '60%', color: theme.palette.mode === 'dark' ? grey[400] : grey[800] }}>
                {t('info.emit_count')}
              </Typography>
              <Typography variant="body2" sx={{
                color: theme.palette.mode === 'dark' ? grey[50] : grey[400]
              }}>
                {selectedNode.emit_count.toLocaleString()}
              </Typography>
            </Stack>
          </Box>

          {/* Third Box - Fixed Height */}
          <Box sx={{
            py: 2,
            px: 1,
            borderRadius: '8px',
            backgroundColor: theme.palette.mode === 'dark' ? grey[800] : 'white',
            border: theme.palette.mode === 'dark' ? '1px solid #4E576A' : 'transparent',
            height: '150px',
            flexShrink: 0,
          }}>
            <Typography sx={{
              fontSize: 17, fontWeight: 600, color: theme.palette.mode === 'dark' ? '#AFB7C8' : grey[800]
            }}>
              {t('disk.disk')}
            </Typography>
            <Typography sx={{
              fontSize: 28, fontWeight: 500, color: theme.palette.mode === 'dark' ? grey[50] : grey[800]
            }}>{diskMetricsData?.disk_usage}%</Typography>
            <Typography sx={{ fontSize: 16, fontWeight: 400, color: theme.palette.mode === 'dark' ? '#D1D6E0' : '#667085' }}>
              <Box component="span" sx={{
                fontWeight: 500, color: theme.palette.mode === 'dark' ? grey[50] : grey[400]
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
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#4A3BFF',
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
                  backgroundColor: '#FFEBEE',
                  borderRadius: '0 5px 5px 0',
                }}
              />
            </Box>
          </Box>
        </>
      )
      }
    </Box >
  );
}