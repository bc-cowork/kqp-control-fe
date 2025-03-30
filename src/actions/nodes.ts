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
  const url = kind ? [endpoints.nodes.channelInbound.list(node), { params: { kind } }] : '';

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
  const url = kind ? [endpoints.nodes.auditLog.list(node), { params: { kind } }] : '';

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
  page: number,
  limit: number,
  offset: number,
  sort: 'asc' | 'desc'
) {
  const url = file
    ? [
        endpoints.nodes.auditLog.frameList(node),
        { params: { file, page, limit, 'last-offset': offset, sort } },
      ]
    : '';

  const { data, isLoading, error, isValidating } = useSWR<AuditFrameListData>(
    url,
    fetcher,
    swrOptions
  );

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
    desc: string;
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

  if (side || cond || count) {
    url = file
      ? [endpoints.nodes.auditLog.frame(node), { params: { file, seq, side, count, cond } }]
      : '';
  } else {
    url = file ? [endpoints.nodes.auditLog.frame(node), { params: { file, seq } }] : '';
  }

  const { data, isLoading, error, isValidating } = useSWR<AuditLogFrameData>(
    url,
    fetcher,
    swrOptions
  );

  const memoizedValue = useMemo(() => {
    const processedData = { desc: data?.data?.desc, ...data?.data?.spec };
    return {
      auditFrame: processedData,
      auditFrameLoading: isLoading,
      auditFrameFragsEmpty: !isLoading && !data?.data?.spec?.frags?.length,
      auditFrameError: error,
      auditFrameValidating: isValidating,
    };
  }, [data?.data?.desc, data?.data?.spec, error, isLoading, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

/** **************************************
 * Issues - Memory page
 *************************************** */

type IssueData = {
  ok: boolean;
  msg: string;
  data: {
    nodeId: string;
    max_issue_count: number;
    compet_count: number;
    issueList: any; // TODO: define type
  };
  meta: {
    current_page: number;
    has_next_page: boolean;
    has_previous_page: boolean;
    total_pages: number;
  };
};

export function useGetIssues(node: string, offset: number, limit: number, q?: string) {
  const url =
    node && offset && limit
      ? q
        ? [endpoints.nodes.issues.search(node), { params: { offset, limit, q } }]
        : [endpoints.nodes.issues.list(node), { params: { offset, limit } }]
      : '';

  const { data, isLoading, error, isValidating } = useSWR<IssueData>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(() => {
    const defaultIssues = {
      nodeId: node,
      max_issue_count: 0,
      compet_count: 0,
      issueList: [],
      current_page: 1,
      has_next_page: true,
      has_previous_page: false,
      total_pages: 0,
    };

    return {
      issues: data ? { ...data.data, ...data.meta } : defaultIssues,
      issuesLoading: isLoading,
      issuesError: error,
      issuesValidating: isValidating,
      issuesEmpty: !isLoading && !data?.data?.issueList?.length,
    };
  }, [data, node, error, isLoading, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

type IssueItemInfoData = {
  ok: boolean;
  msg: string;
  data: {
    nodeId: string;
    issueInfo: any; // TODO: define type
  };
};

export function useGetIssueItemInfo(node: string, code: string) {
  const url = node && code ? [endpoints.nodes.issues.info(node), { params: { code } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<IssueItemInfoData>(
    url,
    fetcher,
    swrOptions
  );

  const memoizedValue = useMemo(
    () => ({
      issueInfo: data?.data?.issueInfo || {},
      issueInfoLoading: isLoading,
      issueInfoError: error,
      issueInfoValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type IssueItemQuoteData = {
  ok: boolean;
  msg: string;
  data: any;
};

export function useGetIssueItemQuotes(node: string, code: string) {
  const url = node && code ? [endpoints.nodes.issues.quote(node), { params: { code } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<IssueItemQuoteData>(
    url,
    fetcher,
    swrOptions
  );

  // console.log('useGetIssueItemQuotes', data);

  const memoizedValue = useMemo(
    () => ({
      issueQuotesAsk: data?.data?.issueQuote?.order_book?.ask || {},
      issueQuotesBid: data?.data?.issueQuote?.order_book?.bid || {},
      issueQuotesLoading: isLoading,
      issueQuotesError: error,
      issueQuotesValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
