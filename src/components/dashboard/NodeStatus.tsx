'use client';

import type { INodeItem } from 'src/types/dashboard';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import { Chip, Stack, Divider, SvgIcon, CircularProgress } from '@mui/material';

import { grey } from 'src/theme/core';
import { useGetStatus } from 'src/actions/dashboard';

// ----------------------------------------------------------------------

const FadingDivider = styled(Divider)(({ theme }) => ({
  height: '1px',
  background: `linear-gradient(to right, transparent, ${theme.palette.grey[200]}, transparent)`,
  border: 'none',
  margin: '16px 0',
  '&:before, &:after': {
    display: 'none',
  },
}));

type Props = {
  selectedNodeParam: string;
  selectedNode: INodeItem;
};

export function NodeStatus({ selectedNodeParam, selectedNode }: Props) {
  const { status, statusLoading, statusError } = useGetStatus(selectedNodeParam);

  const theme = useTheme();

  return (
    <Box
      sx={{
        border: 1,
        borderColor: theme.palette.grey[200],
        borderRadius: 1,
        bgcolor: theme.palette.common.white,
        height: 'calc(100vh - 390px)',
      }}
    >
      {statusLoading ? (
        <CircularProgress />
      ) : statusError ? (
        <Typography>Error Fetching Status</Typography>
      ) : (
        <Box>
          <Box sx={{ p: 1 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Chip
                label={status?.service_status?.okay ? 'Online' : 'Offline'}
                color="success"
                size="small"
                variant="status"
                sx={{ fontSize: 17, border: `1px solid ${theme.palette.success.main}` }}
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
                        fill={
                          status?.service_status?.okay
                            ? theme.palette.success.main
                            : theme.palette.error.main
                        }
                      />
                    </svg>
                  </SvgIcon>
                }
              />
            </Stack>

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1, width: '100%' }}
            >
              <Typography variant="subtitle2" sx={{ fontSize: 19, fontWeight: 500 }}>
                {selectedNode.id}
              </Typography>
              <Typography variant="body2" sx={{ color: grey[600] }}>
                {selectedNode.name}
              </Typography>
            </Stack>

            <Typography variant="body2" sx={{ color: grey[400] }}>
              {selectedNode.desc}
            </Typography>
          </Box>
          <FadingDivider />
          <Box sx={{ px: 1 }}>
            <Stack direction="row" sx={{ mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ width: '60%' }}>
                Emittable
              </Typography>
              <Typography variant="body2">
                {selectedNode.emittable ? (
                  <Chip label="True" color="success" size="small" variant="soft" />
                ) : (
                  <Chip label="False" color="error" size="small" variant="soft" />
                )}
              </Typography>
            </Stack>
            <Stack direction="row" sx={{ mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ width: '60%' }}>
                Emit Count
              </Typography>
              <Typography variant="body2" sx={{ color: grey[400] }}>
                {selectedNode.emit_count.toLocaleString()}
              </Typography>
            </Stack>
          </Box>
        </Box>
      )}
    </Box>
  );
}
