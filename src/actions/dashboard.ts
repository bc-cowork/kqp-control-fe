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
  const url = endpoints.dashboard.processList(node);

  const { data, isLoading, error, isValidating } = useSWR<ProcessData>(url, fetcher, swrOptions);

  const processedProcessList = useMemo(
    () =>
      data?.data?.processList && Array.isArray(data?.data?.processList)
        ? data.data.processList
            .filter(
              (process: { data: any }) => process.data && Object.keys(process.data).length > 0
            )
            .map((process: { data: any }) => process.data)
            .flat()
        : [],
    [data?.data?.processList]
  );

  const memoizedValue = useMemo(
    () => ({
      processes: processedProcessList || [],
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
 * Process List of a Node
 *************************************** */
type StatusData = {
  ok: boolean;
  msg: string;
  data: IStatus;
};

export function useGetStatus(node: string) {
  const url = endpoints.dashboard.serviceStatus(node);

  const { data, isLoading, error, isValidating } = useSWR<StatusData>(url, fetcher, swrOptions);

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

// ----------------------------------------------------------------------
