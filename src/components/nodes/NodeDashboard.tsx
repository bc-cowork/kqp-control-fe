'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useTranslate } from 'src/locales';
import { useGetNodeInfo } from 'src/actions/nodes';

import { T } from 'src/theme/tokens';

import { NodeStatusBig } from '../node-dashboard/NodeStatusBig';
import { NodeGraphsBig } from '../node-dashboard/NodeGraphsBig';

// ----------------------------------------------------------------------

type Props = {
  selectedNodeId: string;
};

export function NodeDashboard({ selectedNodeId }: Props) {
  const { t } = useTranslate('node-dashboard');

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
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress sx={{ color: T.primary }} />
      </Box>
    );
  }

  if (nodeInfoError) {
    return <Typography sx={{ color: T.off }}>{t('errors.load_node_info')}</Typography>;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 1.75,
        flex: 1,
        minHeight: 0,
      }}
    >
      {/* Left column — status + disk */}
      <Box
        sx={{
          width: { xs: '100%', md: 300 },
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          overflowY: 'auto',
        }}
      >
        <NodeStatusBig
          selectedNodeParam={selectedNodeId}
          selectedNode={selectedNode}
          nodeStatusLoading={nodeInfoLoading}
          nodeStatusError={nodeInfoError}
        />
      </Box>

      {/* Right column — 2×2 metrics grid */}
      <Box sx={{ flex: 1, minWidth: 0, minHeight: 0 }}>
        <NodeGraphsBig selectedNodeParam={selectedNodeId} offline={!selectedNode.online_status} />
      </Box>
    </Box>
  );
}
