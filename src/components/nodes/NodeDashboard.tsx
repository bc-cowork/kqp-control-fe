'use client';

import { Grid, CircularProgress, Typography } from '@mui/material';

import { useGetNodeInfo } from 'src/actions/nodes';

import { NodeStatusBig } from '../node-dashboard/NodeStatusBig';
import { NodeGraphsBig } from '../node-dashboard/NodeGraphsBig';

// ----------------------------------------------------------------------

type Props = {
  selectedNodeId: string;
};

export function NodeDashboard({ selectedNodeId }: Props) {
  const { nodeInfo, nodeInfoLoading, nodeInfoError } = useGetNodeInfo(selectedNodeId);

  const selectedNode = nodeInfo || {
    id: selectedNodeId,
    name: '',
    desc: '',
    emittable: false,
    emit_count: 0,
    online_status: false,
  };


  if (nodeInfoLoading) {
    return <CircularProgress />;
  }

  if (nodeInfoError) {
    return <Typography color="error">Failed to load node info</Typography>;
  }

  return (
    <Grid container>
      <Grid
        xs={12}
        md={3}
        sx={{
          paddingRight: { xs: 0, md: '10px' },
          marginBottom: { xs: '20px', md: 0 },
        }}
      >
        <NodeStatusBig selectedNodeParam={selectedNodeId} selectedNode={selectedNode} nodeStatusLoading={nodeInfoLoading} nodeStatusError={nodeInfoError} />
      </Grid>

      <Grid
        xs={12}
        md={9}
        sx={{
          paddingLeft: { xs: 0, md: '10px' },
          height: 'auto'
        }}
      >
        <NodeGraphsBig selectedNodeParam={selectedNodeId} />
      </Grid>
    </Grid>
  );
}