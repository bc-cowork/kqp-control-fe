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
import { NodeStatus } from 'src/components/dashboard/NodeStatus';
import { NodeGraphs } from 'src/components/dashboard/NodeGraphs';
import { SegmentedButtonGroup } from 'src/components/dashboard/SegmentedButtonGroup';

// ----------------------------------------------------------------------

const VIEW_TABS = [
  { value: '2x2', label: '2x2' },
  { value: '1x4', label: '1x4' },
];

type Props = {
  title?: string;
};

export function DashboardView({ title = 'Main' }: Props) {
  const { t } = useTranslate('common');
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
    <DashboardContent maxWidth="xl">
      <Typography sx={{ fontSize: 28, fontWeight: 500, color: theme.palette.grey[600] }}>
        {title}
      </Typography>
      <Box
        sx={{
          mt: 3,
          width: 1,
        }}
      >
        <Grid container>
          <Grid md={12}>
            <Box sx={{ backgroundColor: grey[900], width: '100%', borderRadius: '12px', p: '4px' }}>
              <Stack direction="row" justifyContent="start" alignItems="center">
                <Box
                  sx={{
                    height: '140px',
                    width: '140px',
                    borderRadius: '8px',
                    border: `1px solid ${grey[600]}`,
                    background:
                      'radial-gradient(62.05% 21.26% at 50% 100%, #4A3BFF 0%, #202838 100%)',
                    color: theme.palette.common.white,
                    mr: 0.5,
                  }}
                >
                  <Typography sx={{ fontSize: 15, fontWeight: 500, pt: 2, pl: 3 }}>
                    Total
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
                    border: `1px solid ${grey[600]}`,
                    backgroundColor: theme.palette.common.white,
                    color: grey[600],
                    mr: 0.5,
                  }}
                >
                  <Box sx={{ pt: 1.8, pl: 2 }}>
                    <Chip
                      label="ON"
                      color="success"
                      size="small"
                      variant="status"
                      sx={{
                        fontSize: 15,
                        border: `1px solid ${theme.palette.success.main}`,
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
                    sx={{ fontSize: 28, fontWeight: 500, textAlign: 'right', pr: 2, pt: 2 }}
                  >
                    {onlineNodes}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>

        <Grid container sx={{ mt: 3 }}>
          <Grid
            md={6}
            sx={{
              pr: 1.25,
            }}
          >
            <Typography
              sx={{
                fontSize: 17,
                fontWeight: 500,
                color: theme.palette.grey[600],
                mb: 1,
              }}
            >
              Nodes
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
            md={6}
            sx={{
              pl: 1.25,
            }}
          >
            <Box
              sx={{
                py: 2.5,
                px: 1.5,
                borderRadius: 1.5,
                backgroundColor: theme.palette.common.white,
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
                    color: theme.palette.grey[600],
                    mb: 1,
                  }}
                >
                  Info
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
                <Grid container>
                  <Grid md={4}>
                    <NodeStatus selectedNodeParam={selectedNodeParam} selectedNode={selectedNode} />
                  </Grid>
                  <Grid md={8}>
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
                <Grid md={6} sx={{ pr: 0.75 }}>
                  <NavigationBox
                    title="Process List"
                    link={`/dashboard/nodes/${selectedNodeId}/process/`}
                  />
                </Grid>
                <Grid md={6} sx={{ pl: 0.75 }}>
                  <NavigationBox
                    title="Channel Inbound"
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

const NavigationBox = ({ title, link }: { title: string; link: string }) => {
  const router = useRouter();

  return (
    <Box
      sx={{
        py: 2.5,
        px: 1.5,
        width: '100%',
        border: `1px solid ${grey[200]}`,
        borderRadius: '12px',
      }}
      onClick={() => router.push(link)}
    >
      <Stack direction="row" alignItems="center">
        <Typography sx={{ fontSize: 17, fontWeight: 500 }}>{title}</Typography>
        <SvgIcon sx={{ width: 20, height: 20 }}>
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
              fill="#4E576A"
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
