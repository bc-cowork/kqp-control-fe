'use client';

import { useGetIssueItemInfo, useGetIssueItemQuotes } from 'src/actions/nodes';

// ----------------------------------------------------------------------

type Props = {
  selectedNodeId: string;
  code: string;
};

export function MemoryItem({ selectedNodeId, code }: Props) {
  const data = useGetIssueItemInfo(selectedNodeId, code);

  const dataa = useGetIssueItemQuotes(selectedNodeId, code);
  return <>hey</>;
}
