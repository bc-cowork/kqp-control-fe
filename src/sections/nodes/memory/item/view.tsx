'use client';

import { MemoryItem } from 'src/components/nodes/MemoryItem';

// ----------------------------------------------------------------------

type Props = {
  nodeId: string;
  code: string;
};

export function MemoryItemView({ nodeId, code }: Props) {
  return (
    <MemoryItem selectedNodeId={nodeId} code={code} />
  );
}
