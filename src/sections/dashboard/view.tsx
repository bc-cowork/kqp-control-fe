'use client';

import type { INodeItem } from 'src/types/dashboard';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import {
  Chip,
  Table,
  Stack,
  Divider,
  SvgIcon,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  CircularProgress,
} from '@mui/material';

import { grey } from 'src/theme/core';
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
  const { status, statusLoading, statusError } = useGetStatus(selectedNode?.id || selectedNodeId);

  const theme = useTheme();

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
          <Grid md={selectedNode ? 8 : 12} sx={{ minHeight: '200px' }}>
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: 400,
                color: theme.palette.grey[600],
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
                  <TableCell>State</TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Emittable</TableCell>
                  <TableCell align="right">Emit Count</TableCell>
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
                      selected={selectedNode?.id === node.id}
                      onClick={() => onSelectedNode(node)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>
                        <Chip
                          label={node.online_status ? 'Online' : 'Offline'}
                          color="success"
                          size="small"
                          variant="status"
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
                                    node.online_status
                                      ? theme.palette.success.main
                                      : theme.palette.error.main
                                  }
                                />
                              </svg>
                            </SvgIcon>
                          }
                        />
                      </TableCell>
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
                      <TableCell align="right">{node.emit_count.toLocaleString()}</TableCell>
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
                <Box sx={{ width: '100%', height: '100%', pl: 3 }}>
                  <Typography
                    sx={{
                      fontSize: 20,
                      fontWeight: 400,
                      color: theme.palette.grey[600],
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
                        bgcolor: theme.palette.common.white,
                      }}
                    >
                      <Box sx={{ p: 1 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
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
                          <ChipDeleteIcon onClick={onCloseInfo} />
                        </Stack>
                      </Box>
                      <Divider sx={{ borderColor: '#C7DBFF' }} />
                      <Box sx={{ p: 1, pb: 2 }}>
                        <Stack direction="row" sx={{ mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ width: '120px' }}>
                            ID
                          </Typography>
                          <Typography variant="body2" sx={{ color: grey[400] }}>
                            {selectedNode.id}
                          </Typography>
                        </Stack>
                        <Stack direction="row" sx={{ mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ width: '120px' }}>
                            Name
                          </Typography>
                          <Typography variant="body2" sx={{ color: grey[400] }}>
                            {selectedNode.name}
                          </Typography>
                        </Stack>
                        <Stack direction="row" sx={{ mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ width: '120px' }}>
                            Desc.
                          </Typography>
                          <Typography variant="body2" sx={{ color: grey[400] }}>
                            {selectedNode.desc}
                          </Typography>
                        </Stack>
                        <Stack direction="row" sx={{ mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ width: '120px' }}>
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
                        <Stack direction="row" sx={{ mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ width: '120px' }}>
                            Emit Count
                          </Typography>
                          <Typography variant="body2" sx={{ color: grey[400] }}>
                            {selectedNode.emit_count.toLocaleString()}
                          </Typography>
                        </Stack>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
            </Grid>
          )}

          <Grid md={12} sx={{ minHeight: '250px', mt: 5 }}>
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: 400,
                color: theme.palette.grey[600],
                mb: 1,
              }}
            >
              Process List
            </Typography>
            {selectedNode ? (
              <ProcessDetail selectedNodeId={selectedNode?.id || selectedNodeId} />
            ) : (
              <Typography variant="h5">Select a node to see process list</Typography>
            )}
          </Grid>
        </Grid>
      </Box>
    </DashboardContent>
  );
}
