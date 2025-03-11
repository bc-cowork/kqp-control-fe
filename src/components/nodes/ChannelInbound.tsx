'use client';

import type { IChannelItem } from 'src/types/node';

import { Table, TableRow, TableBody, TableCell, TableHead, CircularProgress } from '@mui/material';

import { varAlpha } from 'src/theme/styles';
import { useGetChannelList } from 'src/actions/nodes';

// ----------------------------------------------------------------------

type Props = {
  selectedNodeId: string;
};

export function ChannelInbound({ selectedNodeId }: Props) {
  const { channels, channelsLoading, channelsEmpty, channelsError } =
    useGetChannelList(selectedNodeId);

  return (
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
          <TableCell>NAME</TableCell>
          <TableCell>Topic</TableCell>
          <TableCell>TYPE</TableCell>
          <TableCell>UTYPE</TableCell>
          <TableCell>PORT</TableCell>
          <TableCell>IP</TableCell>
          <TableCell>NIC</TableCell>
          <TableCell>Count</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {channelsLoading ? (
          <TableRow>
            <TableCell colSpan={9} align="center">
              <CircularProgress />
            </TableCell>
          </TableRow>
        ) : channelsEmpty ? (
          <TableRow>
            <TableCell colSpan={6}>No Processes Found</TableCell>
          </TableRow>
        ) : channelsError ? (
          <TableRow>
            <TableCell colSpan={6}>Error Fetching Process List</TableCell>
          </TableRow>
        ) : (
          channels.map((channel: IChannelItem, index: number) => (
            <TableRow key={index}>
              <TableCell>{channel.id}</TableCell>
              <TableCell>{channel.name}</TableCell>
              <TableCell>{channel.topic}</TableCell>
              <TableCell>{channel.type}</TableCell>
              <TableCell>{channel.utype}</TableCell>
              <TableCell>{channel.port}</TableCell>
              <TableCell>{channel.mip}</TableCell>
              <TableCell>{channel.nic}</TableCell>
              <TableCell>{channel.count}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
