'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Table, TableRow, TableBody, TableCell, IconButton } from '@mui/material';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetNodes, useGetStatus, useGetProcesses } from 'src/actions/dashboard';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
};

export function DashboardView({ title = 'Main' }: Props) {
  const [selectedNode, setSelectedNode] = useState('prod1');
  const { nodes, nodesLoading } = useGetNodes();
  const { status, statusLoading } = useGetStatus(selectedNode);
  const { processes, processLoading } = useGetProcesses(selectedNode);
  console.log('nodes', nodes, nodesLoading);
  console.log('processList', processes, processLoading);
  console.log('status', status, statusLoading);

  const processedProcessList =
    processes && Array.isArray(processes) ? processes.map((process) => process.data).flat() : [];

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
          <Grid md={6} sx={{ minHeight: '200px' }}>
            <Table>
              <TableBody>
                {nodes.map((node: any) => (
                  <TableRow key={node.id}>
                    <TableCell>{node.id}</TableCell>
                    <TableCell>{node.name}</TableCell>
                    <TableCell>{node.desc}</TableCell>
                    <TableCell>{node.emittable}</TableCell>
                    <TableCell>{node.emit_count}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => setSelectedNode(node.id)}>
                        <Iconify icon="eva:arrow-ios-forward" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
          <Grid md={6} sx={{ minHeight: '200px' }}>
            {status?.serviceStatus?.okay ? 'ON' : 'OFF'}
          </Grid>
          <Grid md={12} sx={{ minHeight: '250px', mt: 10 }}>
            <Table>
              <TableBody>
                {processedProcessList.map((process: any, index: number) => (
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
