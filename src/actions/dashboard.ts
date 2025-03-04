import type { IStatus, INodeItem, IProcessResponse } from 'src/types/dashboard';

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

export type SelectedNodeParams = {
  id: string;
};

// ----------------------------------------------------------------------

/** **************************************
 * Node List
 *************************************** */
type NodeData = {
  ok: boolean;
  msg: string;
  data: {
    nodeList: INodeItem[];
  };
};

export function useGetNodes() {
  const url = endpoints.dashboard.nodeList;

  const { data, isLoading, error, isValidating } = useSWR<NodeData>(url, fetcher, swrOptions);

  console.log('useGetNodes', data, isLoading, error, isValidating);

  const memoizedValue = useMemo(
    () => ({
      nodes: data?.data?.nodeList || [],
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
type ProcessData = {
  ok: boolean;
  msg: string;
  data: IProcessResponse;
};

export function useGetProcesses(node: string) {
  const url = node ? [endpoints.dashboard.processList, { params: { node } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<ProcessData>(url, fetcher, swrOptions);

  console.log('useGetProcesses', data, isLoading, error, isValidating);

  const processedProcessList =
    data?.data?.processList && Array.isArray(data?.data?.processList)
      ? data?.data?.processList.map((process: { data: any }) => process.data).flat()
      : [];

  const memoizedValue = useMemo(
    () => ({
      processes: data?.data?.processList || [],
      processLoading: isLoading,
      processError: error,
      processesValidating: isValidating,
      processesEmpty: !isLoading && !processedProcessList?.length,
    }),
    [data?.data?.processList, error, isLoading, isValidating, processedProcessList?.length]
  );

  return memoizedValue;
}

/** **************************************
 * Process List of a Node
 *************************************** */
type StatusData = {
  ok: boolean;
  msg: string;
  data: IStatus;
};

export function useGetStatus(node: string) {
  const url = node ? [endpoints.dashboard.serviceStatus, { params: { node } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<StatusData>(url, fetcher, swrOptions);

  console.log('useGetStatus', data, isLoading, error, isValidating);

  const memoizedValue = useMemo(
    () => ({
      status: data?.data,
      statusLoading: isLoading,
      statusError: error,
      statusValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
