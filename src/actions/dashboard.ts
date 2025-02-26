import type { INodeItem } from 'src/types/dashboard';

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
  posts: INodeItem[];
};

export function useGetNodes() {
  const url = endpoints.post.list;

  const { data, isLoading, error, isValidating } = useSWR<NodeData>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      posts: data?.posts || [],
      postsLoading: isLoading,
      postsError: error,
      postsValidating: isValidating,
      postsEmpty: !isLoading && !data?.posts.length,
    }),
    [data?.posts, error, isLoading, isValidating]
  );

  return memoizedValue;
}
