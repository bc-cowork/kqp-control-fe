'use client';

import type { INodeItem } from 'src/types/dashboard';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Chip, Stack, styled, Divider, SvgIcon } from '@mui/material';

import { useTabs, useRouter } from 'src/routes/hooks';

import { grey } from 'src/theme/core';
import { useTranslate } from 'src/locales';
import { useGetNodes } from 'src/actions/dashboard';
import { DashboardContent } from 'src/layouts/dashboard';

import { NodeList } from 'src/components/dashboard/NodeList';
import { Breadcrumb } from 'src/components/common/Breadcrumb';
import { NodeStatus } from 'src/components/dashboard/NodeStatus';
import { NodeGraphs } from 'src/components/dashboard/NodeGraphs';
import { SegmentedButtonGroup } from 'src/components/dashboard/SegmentedButtonGroup';

// ----------------------------------------------------------------------

const VIEW_TABS = [
  { value: '2x2', label: '2x2' },
  { value: '1x4', label: '1x4' },
];

export function DashboardView() {
  const { t } = useTranslate('dashboard');
  const { nodes, nodesLoading, nodesEmpty, nodesError } = useGetNodes();

  const [selectedNodeId, setSelectedNodeId] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState<number>(1);
  const viewTabs = useTabs(VIEW_TABS[0].value);
  const [selectedNode, setSelectedNode] = useState<INodeItem | undefined>(undefined);
  const selectedNodeParam = selectedNode?.id || selectedNodeId;

  const theme = useTheme();

  const totalNodes = nodes?.length || 0;
  const onlineNodes = nodes?.filter((node) => node.online_status)?.length || 0;

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <DashboardContent maxWidth='xl'>
      <Breadcrumb />
      <Typography sx={{
        fontSize: 28, fontWeight: 600,
        color: (theme) => theme.palette.mode === 'dark' ? grey[50] : '#373F4E',
        mt: 2
      }}>
        {t('top.dashboard')}
      </Typography>
      <Box
        sx={{
          mt: 3,
          width: 1,
        }}
      >
        <Grid container>
          <Grid xs={12}>
            <Box sx={{ backgroundColor: grey[900], width: '100%', borderRadius: '12px', p: '4px' }}>
              <Stack direction="row" justifyContent="start" alignItems="center">
                <Box
                  sx={{
                    height: '140px',
                    width: '140px',
                    borderRadius: '8px',
                    background:
                      'radial-gradient(62.05% 21.26% at 50% 100%, #4A3BFF 0%, #202838 100%)',
                    color: theme.palette.common.white,
                    mr: 0.5,
                  }}
                >
                  <Typography sx={{ fontSize: 15, fontWeight: 500, pt: 2, pl: 3 }}>
                    {t('top.total')}
                  </Typography>
                  <FadingDivider />
                  <Typography
                    sx={{ fontSize: 28, fontWeight: 500, textAlign: 'right', pr: 2, pt: 2 }}
                  >
                    {totalNodes}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    height: '140px',
                    width: '140px',
                    borderRadius: '8px',
                    backgroundColor: '#202838',
                    color: grey[600],
                    mr: 0.5,
                  }}
                >
                  <Box sx={{ pt: 1.8, pl: 2 }}>
                    <Chip
                      label={t('top.on')}
                      color="success"
                      size="small"
                      variant="outlined"
                      sx={{
                        fontSize: 15,
                        backgroundColor: '#202838',
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
                            <circle cx="6" cy="6.30078" r="4" fill={theme.palette.success.main} />
                          </svg>
                        </SvgIcon>
                      }
                    />
                  </Box>
                  <FadingDivider />
                  <Typography
                    sx={{ fontSize: 28, fontWeight: 500, textAlign: 'right', pr: 2, pt: 2, color: theme.palette.grey[50] }}
                  >
                    {onlineNodes}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 3 }}>

          <Grid
            xs={12}
            md={6}
            sx={{
              height: 'auto'
            }}
          >
            <Typography
              sx={{
                fontSize: 17,
                fontWeight: 500,
                color: (theme) => theme.palette.mode === 'dark' ? '#AFB7C8' : '#373F4E',
                mb: 1,
              }}
            >
              {t('node.node')}
            </Typography>
            <NodeList
              selectedNode={selectedNode}
              selectedNodeId={selectedNodeId}
              setSelectedNode={setSelectedNode}
              setSelectedNodeId={setSelectedNodeId}
              nodes={nodes}
              nodesLoading={nodesLoading}
              nodesEmpty={nodesEmpty}
              nodesError={nodesError}
            />
          </Grid>

          <Grid
            xs={12}
            md={6}
          >
            <Box
              sx={{
                py: 2.5,
                px: 1.5,
                borderRadius: 1.5,
                backgroundColor: '#202838',
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <Typography
                  sx={{
                    fontSize: 17,
                    fontWeight: 500,
                    color: '#AFB7C8',
                    mb: 1,
                  }}
                >
                  {t('info.info')}
                </Typography>
                <Box>
                  <SegmentedButtonGroup
                    tabs={VIEW_TABS}
                    value={viewTabs.value}
                    onChange={viewTabs.onChange}
                    onRefresh={handleRefresh}
                  />
                </Box>
              </Stack>
              {selectedNode ? (
                <Grid container spacing={1}>
                  <Grid xs={12} sm={4}>
                    <NodeStatus selectedNodeParam={selectedNodeParam} selectedNode={selectedNode} />
                  </Grid>
                  <Grid xs={12} sm={8}>
                    <NodeGraphs
                      selectedNodeParam={selectedNodeParam}
                      selectedTab={viewTabs.value}
                      refreshKey={refreshKey}
                    />
                  </Grid>
                </Grid>
              ) : (
                <Typography variant="h5">Select a node to see info</Typography>
              )}

              <Grid container sx={{ mt: 1 }}>
                <Grid xs={12} sm={6} sx={{ pr: { xs: 0, sm: 0.75 } }}>
                  <NavigationBox
                    title={t('navigate.process_list')}
                    link={`/dashboard/nodes/${selectedNodeId}/process/`}
                  />
                </Grid>
                <Grid xs={12} sm={6} sx={{ pl: { xs: 0, sm: 0.75 }, mt: { xs: 1, sm: 0 } }}>
                  <NavigationBox
                    title={t('navigate.channel_inbound')}
                    link={`/dashboard/nodes/${selectedNodeId}/channels-inbound/`}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------
// NavigationBox and FadingDivider components remain the same
// ----------------------------------------------------------------------

const NavigationBox = ({ title, link }: { title: string; link: string }) => {
  const router = useRouter();

  return (
    <Box
      sx={{
        py: 2.5,
        px: 1.5,
        width: '100%',
        border: `1px solid ${grey[700]}`,
        borderRadius: '12px',
        cursor: 'pointer',
      }}
      onClick={() => router.push(link)}
    >
      <Stack direction="row" alignItems="center">
        <Typography sx={{ fontSize: 17, fontWeight: 500, color: '#D1D6E0' }}>{title}</Typography>
        <SvgIcon sx={{ width: 20, height: 20, ml: 1 }}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.00414 16.4468C7.25044 16.7205 7.67197 16.7427 7.94565 16.4964L14.6123 10.4966C14.7528 10.3702 14.833 10.1901 14.833 10.0011C14.833 9.81209 14.7528 9.63198 14.6123 9.50555L7.94567 3.50514C7.67201 3.25883 7.25048 3.281 7.00417 3.55466C6.75785 3.82833 6.78002 4.24986 7.05369 4.49617L13.1698 10.001L7.05371 15.5053C6.78004 15.7516 6.75784 16.1731 7.00414 16.4468Z"
              fill="#D1D6E0"
            />
          </svg>
        </SvgIcon>
      </Stack>
    </Box>
  );
};

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