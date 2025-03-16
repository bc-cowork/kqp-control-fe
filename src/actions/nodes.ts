import type { IChannelItem, IAuditLogItem } from 'src/types/node';

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

/** **************************************
 * Channel Inbound
 *************************************** */
type ChannelData = {
  ok: boolean;
  msg: string;
  data: {
    nodeId: string;
    kind: string;
    list: IChannelItem[];
  };
};

export function useGetChannelList(node: string, kind: string = 'inbound') {
  const url = node ? [endpoints.nodes.channelInbound.list, { params: { node, kind } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<ChannelData>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      channels: data?.data?.list || [],
      channelsLoading: isLoading,
      channelsError: error,
      channelsValidating: isValidating,
      channelsEmpty: !isLoading && !data?.data?.list?.length,
    }),
    [data?.data?.list, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

/** **************************************
 * Audit Log
 *************************************** */

type AuditLogData = {
  ok: boolean;
  msg: string;
  data: {
    nodeId: string;
    auditLogList: IAuditLogItem[];
  };
};

export function useAuditLogList(node: string, kind: string) {
  const url = node ? [endpoints.nodes.auditLog.list, { params: { node, kind } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<AuditLogData>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      auditLogs: data?.data?.auditLogList || [],
      auditLogsLoading: isLoading,
      auditLogsError: error,
      auditLogsValidating: isValidating,
      auditLogsEmpty: !isLoading && !data?.data?.auditLogList?.length,
    }),
    [data?.data?.auditLogList, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type AuditFrameListData = {
  ok: boolean;
  msg: string;
  data: any; // TODO: define type
};

export function useAuditFrameList(
  node: string,
  file: string,
  limit: number,
  offset: number,
  sort: 'asc' | 'desc'
) {
  const url = node
    ? [endpoints.nodes.auditLog.frameList, { params: { node, file, limit, offset, sort } }]
    : '';

  const { data, isLoading, error, isValidating } = useSWR<AuditFrameListData>(
    url,
    fetcher,
    swrOptions
  );

  console.log('useAuditFrameList', data);

  const memoizedValue = useMemo(
    () => ({
      auditFrameList: data?.data || [],
      auditFrameListLoading: isLoading,
      auditFrameListError: error,
      auditFrameListValidating: isValidating,
      auditFrameListEmpty: !isLoading && !data?.data?.frame_list?.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type AuditLogFrameData = {
  ok: boolean;
  msg: string;
  data: {
    nodeId: string;
    file: string;
    spec: any; // TODO: define type
  };
};

export function useGetAuditLogFrame(
  node: string,
  file: string,
  seq: number,
  side?: 'prev' | 'next',
  count?: number,
  cond?: string
) {
  let url;

  if (side && count) {
    url = node
      ? [endpoints.nodes.auditLog.frame, { params: { node, file, seq, side, count, cond } }]
      : '';
  } else {
    url = node ? [endpoints.nodes.auditLog.frame, { params: { node, file, seq } }] : '';
  }

  const { data, isLoading, error, isValidating } = useSWR<AuditLogFrameData>(
    url,
    fetcher,
    swrOptions
  );

  console.log('useGetAuditLogFrame', data);

  const memoizedValue = useMemo(
    () => ({
      auditFrame: data?.data?.spec || {},
      auditFrameLoading: isLoading,
      auditFrameError: error,
      auditFrameValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
