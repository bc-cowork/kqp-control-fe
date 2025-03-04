'use client';

import type { INodeItem, IProcessItem } from 'src/types/dashboard';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Table, Button, TableRow, TableBody, TableCell, TableHead } from '@mui/material';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetNodes, useGetStatus, useGetProcesses } from 'src/actions/dashboard';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
};

export function DashboardView({ title = 'Main' }: Props) {
  const [selectedNode, setSelectedNode] = useState('prod1');
  const { nodes, nodesLoading, nodesEmpty, nodesError } = useGetNodes();
  const { status, statusLoading, statusError } = useGetStatus(selectedNode);
  const { processes, processLoading, processesEmpty, processError } = useGetProcesses(selectedNode);

  const processedProcessList =
    processes && Array.isArray(processes)
      ? processes.map((process: { data: any }) => process.data).flat()
      : [];

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4"> {title} </Typography>
      <Box
        sx={{
          mt: 5,
          width: 1,
          // height: 320,
          borderRadius: 2,
          bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.04),
          border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
        }}
      >
        <Grid container>
          <Grid md={9} sx={{ minHeight: '200px' }}>
            <Table>
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
                {nodes.map((node: INodeItem) => (
                  <TableRow key={node.id}>
                    <TableCell>{node.id}</TableCell>
                    <TableCell>{node.name}</TableCell>
                    <TableCell>{node.desc}</TableCell>
                    <TableCell>{node.emittable ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{node.emit_count}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => setSelectedNode(node.id)}
                        sx={{
                          backgroundColor: '#F4F6F8',
                          '&:hover': { backgroundColor: '#637381', color: '#F4F6F8' },
                        }}
                      >
                        Status
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
          <Grid
            md={3}
            sx={{
              minHeight: '200px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 2,
                backgroundColor: status?.serviceStatus?.okay ? 'blue' : 'red',
              }}
            >
              <Typography>{status?.serviceStatus?.okay ? 'ON' : 'OFF'}</Typography>
            </Box>
          </Grid>
          <Grid md={12} sx={{ minHeight: '250px', mt: 10 }}>
            <Table>
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
                {processedProcessList.map((process: IProcessItem, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{process.PID}</TableCell>
                    <TableCell>{process.NAME}</TableCell>
                    <TableCell>{process.PARAM}</TableCell>
                    <TableCell>{process.CPU}</TableCell>
                    <TableCell>{process.MEM}</TableCell>
                    <TableCell>{process.PPID}</TableCell>
                    <TableCell>{process.COMMAND}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </Box>
    </DashboardContent>
  );
}
