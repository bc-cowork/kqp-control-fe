'use client';

import type { IChannelItem } from 'src/types/node';

import { Table, TableRow, TableBody, TableCell, TableHead, CircularProgress } from '@mui/material';

import { useGetChannelList } from 'src/actions/nodes';

// ----------------------------------------------------------------------

type Props = {
  selectedNodeId: string;
};

export function ChannelOutbound({ selectedNodeId }: Props) {
  const { channels, channelsLoading, channelsEmpty, channelsError } = useGetChannelList(
    selectedNodeId,
    'outbound'
  );

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell align="right">ID</TableCell>
          <TableCell>NAME</TableCell>
          <TableCell>Topic</TableCell>
          <TableCell>TYPE</TableCell>
          <TableCell>UTYPE</TableCell>
          <TableCell align="right">PORT</TableCell>
          <TableCell align="right">IP</TableCell>
          <TableCell align="right">NIC</TableCell>
          <TableCell align="right">Count</TableCell>
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
              <TableCell align="right">{channel.id}</TableCell>
              <TableCell>{channel.name}</TableCell>
              <TableCell>{channel.topic}</TableCell>
              <TableCell>{channel.type}</TableCell>
              <TableCell>{channel.utype}</TableCell>
              <TableCell align="right">{channel.port}</TableCell>
              <TableCell align="right">{channel.mip}</TableCell>
              <TableCell align="right">{channel.nic}</TableCell>
              <TableCell align="right">{channel.count}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
