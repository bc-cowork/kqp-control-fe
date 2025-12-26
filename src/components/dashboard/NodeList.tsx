'use client';

import type { INodeItem } from 'src/types/dashboard';

import { useEffect } from 'react';

import { useTheme } from '@mui/material/styles';
import {
  Chip,
  Table,
  Paper,
  SvgIcon,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  CircularProgress,
} from '@mui/material';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

type Props = {
  selectedNodeId: string;
  selectedNode: INodeItem | undefined;
  setSelectedNodeId: (id: string) => void;
  setSelectedNode: (node: INodeItem | undefined) => void;
  nodes: INodeItem[];
  nodesLoading: boolean;
  nodesEmpty: boolean;
  nodesError: any;
};

export function NodeList({
  selectedNodeId,
  selectedNode,
  setSelectedNodeId,
  setSelectedNode,
  nodes,
  nodesLoading,
  nodesEmpty,
  nodesError,
}: Props) {
  const theme = useTheme();
  const { t } = useTranslate('dashboard');

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
    <TableContainer component={Paper} sx={{ height: 'calc(100vh - 100px)', backgroundColor: 'transparent' }}>
      <Table
        size="small"
        sx={{
          borderCollapse: 'separate',
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>{t('node.state')}</TableCell>
            <TableCell>{t('node.id')}</TableCell>
            <TableCell>{t('node.name')}</TableCell>
            <TableCell>{t('node.description')}</TableCell>
            <TableCell>{t('node.emittable')}</TableCell>
            <TableCell align="right">{t('node.emit_count')}</TableCell>
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

                sx={{
                  cursor: 'pointer',
                }}
              >
                <TableCell>
                  <Chip
                    label={node.online_status ? 'Online' : 'Offline'}
                    color={node.online_status ? 'success' : 'error'}
                    sx={{
                      backgroundColor: (theme) => theme.palette.mode === 'dark' ? (node.online_status ? '#1D2F20' : '#331B1E') : (node.online_status ? '#EBFBE9' : '#FFF2F4'),
                      border: (theme) => theme.palette.mode === 'dark' ? (node.online_status ? '1px solid #36573C' : '1px solid #4A2C31') : (node.online_status ? '1px solid #DDF4DA' : '1px solid #FFD8D8'),
                    }}
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
                  <Chip label={node.emittable ? "Yes" : "No"} color={node.emittable ? "success" : "error"} size="small" variant="outlined" sx={{
                    backgroundColor: (theme) => theme.palette.mode === 'dark' ? (node.emittable ? '#1D2F20' : '#331B1E') : (node.emittable ? '#EBFBE9' : '#FFF2F4'),
                    border: (theme) => theme.palette.mode === 'dark' ? (node.emittable ? '1px solid #36573C' : '1px solid #4A2C31') : (node.emittable ? '1px solid #DDF4DA' : '1px solid #FFD8D8'),
                  }} />
                </TableCell>
                <TableCell align="right">{node.emit_count.toLocaleString()}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
