'use client';

import { Grid } from '@mui/material';

import { NodeStatusBig } from '../node-dashboard/NodeStatusBig';
import { NodeGraphsBig } from '../node-dashboard/NodeGraphsBig';

// ----------------------------------------------------------------------

type Props = {
  selectedNodeId: string;
};

export function NodeDashboard({ selectedNodeId }: Props) {
  const selectedNode = {
    id: selectedNodeId,
    name: 'Node 1',
    desc: 'Node 1 Description',
    emittable: true,
    emit_count: 3761797,
    online_status: true,
  };

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
        <NodeStatusBig selectedNodeParam={selectedNodeId} selectedNode={selectedNode} />
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