'use client';

import type { INodeItem, IProcessItem } from 'src/types/dashboard';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import {
  Table,
  Stack,
  Button,
  Divider,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  CircularProgress,
} from '@mui/material';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetNodes, useGetStatus, useGetProcesses } from 'src/actions/dashboard';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
};

export function DashboardView({ title = 'Main' }: Props) {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<INodeItem | undefined>(undefined);
  const { nodes, nodesLoading, nodesEmpty, nodesError } = useGetNodes();
  const { status, statusLoading, statusError } = useGetStatus(selectedNodeId);
  const { processes, processLoading, processesEmpty, processError } =
    useGetProcesses(selectedNodeId);

  const processedProcessList =
    processes && Array.isArray(processes)
      ? processes.map((process: { data: any }) => process.data).flat()
      : [];

  useEffect(() => {
    if (!nodesLoading && !nodesEmpty && !nodesError && !selectedNode && !selectedNodeId) {
      setSelectedNodeId(nodes[0].id);
      setSelectedNode(nodes[0]);
    }
  }, [nodes, nodesLoading, nodesEmpty, nodesError, selectedNode, selectedNodeId]);

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h3"> {title} </Typography>
      <Box
        sx={{
          mt: 5,
          width: 1,
        }}
      >
        <Grid container>
          <Grid md={8} sx={{ minHeight: '200px' }}>
            <Typography variant="h6">Nodes</Typography>
            <Table
              size="small"
              sx={{
                borderRadius: 2,
                bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.04),
                border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Emittable</TableCell>
                  <TableCell>Emit Count</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {nodesLoading ? (
                  <CircularProgress />
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
                    <TableRow key={node.id}>
                      <TableCell>{node.id}</TableCell>
                      <TableCell>{node.name}</TableCell>
                      <TableCell>{node.desc}</TableCell>
                      <TableCell>{node.emittable ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{node.emit_count}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => {
                            setSelectedNodeId(node.id);
                            setSelectedNode(node);
                          }}
                          sx={{
                            backgroundColor: '#F4F6F8',
                            '&:hover': { backgroundColor: '#637381', color: '#F4F6F8' },
                          }}
                        >
                          info
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Grid>
          <Grid
            md={4}
            sx={{
              minHeight: '200px',
              minWidth: '200px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 5,
                backgroundColor: status?.serviceStatus?.okay ? '#22C55E' : '#FF5630',
              }}
            > */}
            {selectedNode ? (
              <>
                {statusLoading ? (
                  <CircularProgress />
                ) : statusError ? (
                  <Typography>Error Fetching Status</Typography>
                ) : (
                  <Box sx={{ width: '100%', px: 4 }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography>ID</Typography>
                      <Typography sx={{ fontWeight: 600 }}>{selectedNode.id}</Typography>
                    </Stack>
                    <Divider />
                    <Stack direction="row" justifyContent="space-between">
                      <Typography>Name</Typography>
                      <Typography>{selectedNode.name}</Typography>
                    </Stack>
                    <Divider />
                    <Stack direction="row" justifyContent="space-between">
                      <Typography>Desc.</Typography>
                      <Typography>{selectedNode.desc}</Typography>
                    </Stack>
                    <Divider />
                    <Stack direction="row" justifyContent="space-between">
                      <Typography>Emittable</Typography>
                      <Typography>{selectedNode.emittable ? 'TRUE' : 'FALSE'}</Typography>
                    </Stack>
                    <Divider />
                    <Stack direction="row" justifyContent="space-between">
                      <Typography>Emit Count</Typography>
                      <Typography>{selectedNode.emit_count}</Typography>
                    </Stack>

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 1,
                        mt: 2,
                        width: '100%',
                        backgroundColor: status?.serviceStatus?.okay ? '#22C55E' : '#FF5630',
                      }}
                    >
                      <Typography variant="h4">
                        {status?.serviceStatus?.okay ? 'ONLINE' : 'OFFLINE'}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </>
            ) : (
              <Typography variant="h5">Select a node to see status</Typography>
            )}
            {/* </Box> */}
          </Grid>
          <Grid md={12} sx={{ minHeight: '250px', mt: 5 }}>
            <Typography variant="h6">Process List</Typography>
            {selectedNode ? (
              <Table
                size="small"
                sx={{
                  borderRadius: 2,
                  bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.04),
                  border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>PID</TableCell>
                    <TableCell>NAME</TableCell>
                    <TableCell>PARAM</TableCell>
                    <TableCell>CPU</TableCell>
                    <TableCell>MEM</TableCell>
                    <TableCell>PPID</TableCell>
                    <TableCell>COMMAND</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {processLoading ? (
                    <CircularProgress />
                  ) : processesEmpty ? (
                    <TableRow>
                      <TableCell colSpan={6}>No Processes Found</TableCell>
                    </TableRow>
                  ) : processError ? (
                    <TableRow>
                      <TableCell colSpan={6}>Error Fetching Process List</TableCell>
                    </TableRow>
                  ) : (
                    processedProcessList.map((process: IProcessItem, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{process.PID}</TableCell>
                        <TableCell>{process.NAME}</TableCell>
                        <TableCell>{process.PARAM}</TableCell>
                        <TableCell>{process.CPU}</TableCell>
                        <TableCell>{process.MEM}</TableCell>
                        <TableCell>{process.PPID}</TableCell>
                        <TableCell>{process.COMMAND}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            ) : (
              <Typography variant="h5">Select a node to see process list</Typography>
            )}
          </Grid>
        </Grid>
      </Box>
    </DashboardContent>
  );
}
