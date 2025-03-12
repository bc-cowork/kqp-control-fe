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

  console.log('useAuditLogList', data, isLoading, error, isValidating);

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
