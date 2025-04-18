import type { IChannelItem, IAuditLogItem } from 'src/types/node';
import type {
  GetIssuesResponse,
  MemoryGraphResponse,
  GetChannelListResponse,
  GetAuditLogListResponse,
  GetAuditLogFrameResponse,
  GetIssueItemInfoResponse,
  GetAuditFrameListResponse,
  GetIssueItemQuotesResponse,
} from 'src/types/api';

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  dedupingInterval: 0,
};

// ----------------------------------------------------------------------

/** **************************************
 * Channel Inbound
 *************************************** */
export function useGetChannelList(node: string, kind: string = 'inbound') {
  const url = kind ? [endpoints.nodes.channelInbound.list(node), { params: { kind } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<GetChannelListResponse>(
    url,
    fetcher,
    swrOptions
  );

  // if (data) console.log('useGetChannelList Response:', JSON.stringify(data, null, 2));

  const memoizedValue = useMemo(
    () => ({
      channels: (data?.data?.list || []) as IChannelItem[],
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
export function useAuditLogList(node: string, kind: string) {
  const url = kind ? [endpoints.nodes.auditLog.list(node), { params: { kind } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<GetAuditLogListResponse>(
    url,
    fetcher,
    swrOptions
  );

  // if (data) console.log('useAuditLogList Response:', JSON.stringify(data, null, 2));

  const memoizedValue = useMemo(
    () => ({
      auditLogs: (data?.data?.auditLogList || []) as IAuditLogItem[],
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

export function useAuditFrameList(
  node: string,
  file: string,
  page: number,
  limit: number,
  offset: number,
  sort: 'asc' | 'desc',
  refreshKey: number
) {
  const url = file
    ? [
        endpoints.nodes.auditLog.frameList(node),
        { params: { file, page, limit, 'last-offset': offset, sort, refreshKey } },
      ]
    : '';

  const { data, isLoading, error, isValidating } = useSWR<GetAuditFrameListResponse>(
    url,
    fetcher,
    swrOptions
  );

  // if (data) console.log('useAuditFrameList Response:', JSON.stringify(data, null, 2));

  const memoizedValue = useMemo(
    () => ({
      auditFrameList: data?.data || null,
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

export function useGetAuditLogFrame(
  node: string,
  file: string,
  seq: number,
  side?: 'prev' | 'next',
  count?: number,
  cond?: string,
  refreshKey?: number
) {
  let url;

  if (side || cond || count) {
    url = file
      ? [
          endpoints.nodes.auditLog.frame(node),
          { params: { file, seq, side, count, cond, refreshKey } },
        ]
      : '';
  } else {
    url = file ? [endpoints.nodes.auditLog.frame(node), { params: { file, seq, refreshKey } }] : '';
  }

  const { data, isLoading, error, isValidating } = useSWR<GetAuditLogFrameResponse>(
    url,
    fetcher,
    swrOptions
  );

  // if (data) console.log('useGetAuditLogFrame Response:', JSON.stringify(data, null, 2));

  const processedData = { desc: data?.data?.desc, ...data?.data?.spec };

  return {
    auditFrame: processedData,
    auditFrameLoading: isLoading,
    auditFrameFragsEmpty: !isLoading && !data?.data?.spec?.frags?.length,
    auditFrameError: data?.okay === false || error,
    auditFrameValidating: isValidating,
  };
}

// ----------------------------------------------------------------------

/** **************************************
 * Issues - Memory page
 *************************************** */
export function useGetIssues(node: string, offset: number, limit: number, q?: string) {
  const url =
    node && offset && limit
      ? q
        ? [endpoints.nodes.issues.search(node), { params: { offset, limit, q } }]
        : [endpoints.nodes.issues.list(node), { params: { offset, limit } }]
      : '';

  const { data, isLoading, error, isValidating } = useSWR<GetIssuesResponse>(
    url,
    fetcher,
    swrOptions
  );

  // if (data) console.log('useGetIssues Response:', JSON.stringify(data, null, 2));

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

const DEFAULT_ISSUE_INFO = {
  code: '',
  vol_accum: { nxt: 0, uni: 0, krx: 0 },
  amt_accum: { nxt: 0, uni: 0, krx: 0 },
  seq: 0,
  high: { nxt: 0, uni: 0, krx: 0 },
  compet: 0,
  last_price: { nxt: 0, uni: 0, krx: 0 },
  last_vol: { nxt: 0, uni: 0, krx: 0 },
  g1_ssn_id: [null, null, null],
  open: { nxt: 0, uni: 0, krx: 0 },
  name: '',
  low: { nxt: 0, uni: 0, krx: 0 },
};

export function useGetIssueItemInfo(node: string, code: string) {
  const url = node && code ? [endpoints.nodes.issues.info(node), { params: { code } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<GetIssueItemInfoResponse>(
    url,
    fetcher,
    swrOptions
  );

  // if (data) console.log('useGetIssueItemInfo Response:', JSON.stringify(data, null, 2));

  const memoizedValue = useMemo(
    () => ({
      issueInfo: data?.data?.issueInfo || DEFAULT_ISSUE_INFO,
      issueInfoLoading: isLoading,
      issueInfoError: error,
      issueInfoValidating: isValidating,
    }),
    [data?.data?.issueInfo, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

const DEFAULT_ISSUE_QUOTES_ASK = {
  '1': { uni: 0, price: 0, nxt: 0, krx: 0 },
  sum: { uni: 0, price: 0, nxt: 0, krx: 0 },
};

const DEFAULT_ISSUE_QUOTES_BID = {
  '1': { uni: 0, price: 0, nxt: 0, krx: 0 },
  sum: { uni: 0, price: 0, nxt: 0, krx: 0 },
};

export function useGetIssueItemQuotes(node: string, code: string) {
  const url = node && code ? [endpoints.nodes.issues.quote(node), { params: { code } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<GetIssueItemQuotesResponse>(
    url,
    fetcher,
    swrOptions
  );

  // if (data) console.log('useGetIssueItemQuotes Response:', JSON.stringify(data, null, 2));

  const memoizedValue = useMemo(
    () => ({
      issueQuotesAsk: data?.data?.issueQuote?.order_book?.ask || DEFAULT_ISSUE_QUOTES_ASK,
      issueQuotesBid: data?.data?.issueQuote?.order_book?.bid || DEFAULT_ISSUE_QUOTES_BID,
      issueQuotesLoading: isLoading,
      issueQuotesError: error,
      issueQuotesValidating: isValidating,
    }),
    [data?.data?.issueQuote?.order_book, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------------

export function useGetIssueGraph(node: string) {
  const url = node && endpoints.nodes.issues.graph(node);

  const { data, isLoading, error, isValidating } = useSWR<MemoryGraphResponse>(
    url,
    fetcher,
    swrOptions
  );

  if (data) console.log('useGetIssueGraph Response:', data);

  const memoizedValue = useMemo(
    () => ({
      issueGraphData: data?.data?.metrics,
      issueGraphDataLoading: isLoading,
      issueGraphDataError: error,
      issueGraphDataValidating: isValidating,
    }),
    [data?.data?.metrics, error, isLoading, isValidating]
  );

  return memoizedValue;
}
