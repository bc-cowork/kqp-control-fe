'use client';

import type { INodeItem } from 'src/types/dashboard';

import { useEffect } from 'react';

import { useTheme } from '@mui/material/styles';
import {
  Chip,
  Table,
  SvgIcon,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  CircularProgress,
} from '@mui/material';

import { useGetNodes } from 'src/actions/dashboard';

// ----------------------------------------------------------------------

type Props = {
  selectedNodeId: string;
  selectedNode: INodeItem | undefined;
  setSelectedNodeId: (id: string) => void;
  setSelectedNode: (node: INodeItem | undefined) => void;
};

export function NodeList({
  selectedNodeId,
  selectedNode,
  setSelectedNodeId,
  setSelectedNode,
}: Props) {
  const { nodes, nodesLoading, nodesEmpty, nodesError } = useGetNodes();

  const theme = useTheme();

  useEffect(() => {
    if (!nodesLoading && !nodesEmpty && !nodesError && !selectedNode && !selectedNodeId) {
      setSelectedNodeId(nodes[0].id);
      setSelectedNode(nodes[0]);
    }
  }, [
    nodes,
    nodesLoading,
    nodesEmpty,
    nodesError,
    selectedNode,
    selectedNodeId,
    setSelectedNodeId,
    setSelectedNode,
  ]);

  const onSelectedNode = (node: INodeItem) => {
    setSelectedNode(node);
  };

  return (
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
  );
}
