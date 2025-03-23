'use client';

import type { INodeItem } from 'src/types/dashboard';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import {
  Chip,
  Table,
  Stack,
  Divider,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  CircularProgress,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { ChipDeleteIcon } from 'src/theme/core/components/chip';
import { useGetNodes, useGetStatus } from 'src/actions/dashboard';

import { ProcessDetail } from 'src/components/nodes/ProcessDetail';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
};

export function DashboardView({ title = 'Main' }: Props) {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<INodeItem | undefined>(undefined);
  const { nodes, nodesLoading, nodesEmpty, nodesError } = useGetNodes();
  const { status, statusLoading, statusError } = useGetStatus(selectedNodeId);

  useEffect(() => {
    if (!nodesLoading && !nodesEmpty && !nodesError && !selectedNode && !selectedNodeId) {
      setSelectedNodeId(nodes[0].id);
      setSelectedNode(nodes[0]);
    }
  }, [nodes, nodesLoading, nodesEmpty, nodesError, selectedNode, selectedNodeId]);

  const onCloseInfo = () => {
    setSelectedNode(undefined);
  };

  const onSelectedNode = (node: INodeItem) => {
    setSelectedNode(node);
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography
        sx={{ fontSize: 28, fontWeight: 500, color: (theme) => theme.palette.grey[600], mt: 2 }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          mt: 3,
          width: 1,
        }}
      >
        <Grid container>
          <Grid md={selectedNode ? 8 : 12} sx={{ minHeight: '200px' }}>
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: 400,
                color: (theme) => theme.palette.grey[600],
                mb: 1,
              }}
            >
              Nodes
            </Typography>
            <Table
              size="small"
              sx={{
                borderCollapse: 'separate',
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Emittable</TableCell>
                  <TableCell>Emit Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {nodesLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : nodesEmpty ? (
                  <TableRow>
                    <TableCell colSpan={6}>No Nodes Found</TableCell>
                  </TableRow>
                ) : nodesError ? (
                  <TableRow>
                    <TableCell colSpan={6}>Error Fetching Nodes</TableCell>
                  </TableRow>
                ) : (
                  nodes.map((node: INodeItem) => (
                    <TableRow
                      key={node.id}
                      selected={selectedNodeId === node.id}
                      onClick={() => onSelectedNode(node)}
                    >
                      <TableCell>{node.id}</TableCell>
                      <TableCell>{node.name}</TableCell>
                      <TableCell>{node.desc}</TableCell>
                      <TableCell>
                        {node.emittable ? (
                          <Chip label="Yes" color="success" size="small" variant="soft" />
                        ) : (
                          <Chip label="No" color="error" size="small" variant="soft" />
                        )}
                      </TableCell>
                      <TableCell>{node.emit_count}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Grid>
          {selectedNode && (
            <Grid
              md={4}
              sx={{
                minHeight: '200px',
                minWidth: '200px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}
            >
              {statusLoading ? (
                <CircularProgress />
              ) : statusError ? (
                <Typography>Error Fetching Status</Typography>
              ) : (
                <Box sx={{ width: '100%', px: 4 }}>
                  <Typography
                    sx={{
                      fontSize: 20,
                      fontWeight: 400,
                      color: (theme) => theme.palette.grey[600],
                      mb: 1,
                    }}
                  >
                    <Box component="span" sx={{ fontWeight: 300 }}>{`Nodes > `}</Box>
                    Info
                  </Typography>

                  <Box>
                    <Box
                      sx={{
                        border: 1,
                        borderColor: '#C7DBFF',
                        borderRadius: 1,
                        bgcolor: (theme) => theme.palette.common.white,
                      }}
                    >
                      <Box sx={{ p: 1 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Chip
                            label={status?.service_status?.okay ? '• Online' : '• Offline'}
                            color={status?.service_status?.okay ? 'success' : 'error'}
                            size="medium"
                            variant="soft"
                          />
                          <ChipDeleteIcon onClick={onCloseInfo} />
                        </Stack>
                      </Box>
                      <Divider sx={{ borderColor: '#C7DBFF' }} />
                      <Box sx={{ p: 1 }}>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                          <Typography variant="subtitle2">ID</Typography>
                          <Typography variant="body2">{selectedNode.id}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                          <Typography variant="subtitle2">Name</Typography>
                          <Typography variant="body2">{selectedNode.name}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                          <Typography variant="subtitle2">Desc.</Typography>
                          <Typography variant="body2">{selectedNode.desc}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                          <Typography variant="subtitle2">Emittable</Typography>
                          <Typography variant="body2">
                            {selectedNode.emittable ? (
                              <Chip label="True" color="success" size="small" variant="soft" />
                            ) : (
                              <Chip label="False" color="error" size="small" variant="soft" />
                            )}
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                          <Typography variant="subtitle2">Emit Count</Typography>
                          <Typography variant="body2">{selectedNode.emit_count}</Typography>
                        </Stack>
                      </Box>
                    </Box>
                  </Box>

                  {/* <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 1,
                        mt: 2,
                        width: '100%',
                        backgroundColor: status?.service_status?.okay ? '#22C55E' : '#FF5630',
                      }}
                    >
                      <Typography variant="h4">
                        {status?.service_status?.okay ? 'ONLINE' : 'OFFLINE'}
                      </Typography>
                    </Box> */}
                </Box>
              )}
            </Grid>
          )}

          <Grid md={12} sx={{ minHeight: '250px', mt: 5 }}>
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: 400,
                color: (theme) => theme.palette.grey[600],
                mb: 1,
              }}
            >
              Process List
            </Typography>
            {selectedNode ? (
              <ProcessDetail selectedNodeId={selectedNodeId} />
            ) : (
              <Typography variant="h5">Select a node to see process list</Typography>
            )}
          </Grid>
        </Grid>
      </Box>
    </DashboardContent>
  );
}
