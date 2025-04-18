import type { IStatus, INodeItem } from 'src/types/dashboard';
import type {
  GetNodesResponse,
  GetStatusResponse,
  GetProcessesResponse,
  GetGraphDataResponse,
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
 * Node List
 *************************************** */
export function useGetNodes() {
  const url = endpoints.dashboard.nodeList;

  const { data, isLoading, error, isValidating } = useSWR<GetNodesResponse>(
    url,
    fetcher,
    swrOptions
  );

  // if (data) console.log('useGetNodes Response:', JSON.stringify(data, null, 2));

  const memoizedValue = useMemo(
    () => ({
      nodes: (data?.data?.nodeList || []) as INodeItem[],
      nodesLoading: isLoading,
      nodesError: error,
      nodesValidating: isValidating,
      nodesEmpty: !isLoading && !data?.data?.nodeList?.length,
    }),
    [data?.data?.nodeList, error, isLoading, isValidating]
  );

  return memoizedValue;
}

/** **************************************
 * Process List of a Node
 *************************************** */
export function useGetProcesses(node: string) {
  const url = endpoints.dashboard.processList(node);

  const { data, isLoading, error, isValidating } = useSWR<GetProcessesResponse>(
    url,
    fetcher,
    swrOptions
  );

  // if (data) console.log('useGetProcesses Response:', JSON.stringify(data, null, 2));

  const processedProcessList = useMemo(
    () =>
      data?.data?.processList && Array.isArray(data?.data?.processList)
        ? data.data.processList
            .filter((process) => process.data && Object.keys(process.data).length > 0)
            .map((process) => process.data)
            .flat()
        : [],
    [data?.data?.processList]
  );

  const memoizedValue = useMemo(
    () => ({
      processes: processedProcessList,
      processLoading: isLoading,
      processError: error,
      processesValidating: isValidating,
      processesEmpty: !isLoading && !processedProcessList?.length,
    }),
    [error, isLoading, isValidating, processedProcessList]
  );

  return memoizedValue;
}

/** **************************************
 * Service Status of a Node
 *************************************** */
export function useGetStatus(node: string) {
  const url = endpoints.dashboard.serviceStatus(node);

  const { data, isLoading, error, isValidating } = useSWR<GetStatusResponse>(
    url,
    fetcher,
    swrOptions
  );

  // if (data) console.log('useGetStatus Response:', JSON.stringify(data, null, 2));

  const memoizedValue = useMemo(
    () => ({
      status: (data?.data || null) as IStatus | null,
      statusLoading: isLoading,
      statusError: error,
      statusValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

/** **************************************
 * Graph data
 *************************************** */
export function useGetGraphData(node: string, refreshKey: number) {
  const url = refreshKey ? [endpoints.dashboard.graph(node), { params: { refreshKey } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<GetGraphDataResponse>(
    url,
    fetcher,
    swrOptions
  );

  const memoizedValue = useMemo(
    () => ({
      graphData: data?.data || null,
      graphDataLoading: isLoading,
      graphDataError: error,
      graphDataValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
