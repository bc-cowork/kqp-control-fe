'use client';

import type { INodeItem } from 'src/types/dashboard';

import { useState } from 'react';

import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { useTabs } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

import { NodeList } from 'src/components/dashboard/NodeList';
import { NodeStatus } from 'src/components/dashboard/NodeStatus';
import { NodeGraphs } from 'src/components/dashboard/NodeGraphs';
import { ProcessDetail } from 'src/components/nodes/ProcessDetail';
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
  const [selectedNodeId, setSelectedNodeId] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState<number>(1);
  const viewTabs = useTabs(VIEW_TABS[0].value);
  const [selectedNode, setSelectedNode] = useState<INodeItem | undefined>(undefined);
  const selectedNodeParam = selectedNode?.id || selectedNodeId;

  const theme = useTheme();

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
            />
          </Grid>
        </Grid>

        <Grid container sx={{ mt: 3 }}>
          <Grid
            md={6}
            sx={{
              pr: 1.25,
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
                <Grid container spacing={1.5}>
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
            </Box>
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
              <Typography
                sx={{
                  fontSize: 17,
                  fontWeight: 500,
                  color: theme.palette.grey[600],
                  mb: 1,
                }}
              >
                Process List
              </Typography>
              {selectedNode ? (
                <ProcessDetail selectedNodeId={selectedNodeParam} page="dashboard" />
              ) : (
                <Typography variant="h5">Select a node to see process list</Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </DashboardContent>
  );
}
