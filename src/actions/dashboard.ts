import type { INodeItem } from 'src/types/dashboard';

import useSWR from 'swr';

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
  nodes: INodeItem[];
};

export function useGetNodes() {
  const url = endpoints.dashboard.nodeList;

  const { data, isLoading, error, isValidating } = useSWR<NodeData>(url, fetcher, swrOptions);

  console.log('useGetNodes', data, isLoading, error, isValidating);

  // const memoizedValue = useMemo(
  //   () => ({
  //     nodes: data?.posts || [],
  //     nodesLoading: isLoading,
  //     nodesError: error,
  //     nodesValidating: isValidating,
  //     nodesEmpty: !isLoading && !data?.nodes.length,
  //   }),
  //   [data?.nodes, error, isLoading, isValidating]
  // );

  return null;
}

/** **************************************
 * Process List of a Node
 *************************************** */
type ProcessData = {
  ok: boolean;
  msg: string;
  data: any;
};

export function useGetProcesses(node: string) {
  const url = node ? [endpoints.dashboard.processList, { params: { node } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<ProcessData>(url, fetcher, swrOptions);

  console.log('useGetProcesses', data, isLoading, error, isValidating);

  // const memoizedValue = useMemo(
  //   () => ({
  //     nodes: data?.posts || [],
  //     nodesLoading: isLoading,
  //     nodesError: error,
  //     nodesValidating: isValidating,
  //     nodesEmpty: !isLoading && !data?.nodes.length,
  //   }),
  //   [data?.nodes, error, isLoading, isValidating]
  // );

  return null;
}
