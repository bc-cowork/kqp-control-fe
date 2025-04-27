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
      <Grid md={3} sx={{ pr: '10px' }}>
        <NodeStatusBig selectedNodeParam={selectedNodeId} selectedNode={selectedNode} />
      </Grid>
      <Grid md={9} sx={{ pl: '10px' }}>
        <NodeGraphsBig selectedNodeParam={selectedNodeId} />
      </Grid>
    </Grid>
  );
}
