import type { Node } from '@xyflow/react';

// ----------------------------------------------------------------------

// --- API JSON Structure ---

export type DataFlowAction = {
  act: string;
  params: Record<string, string>;
  comment?: string;
};

export type DataFlowEntityDef = {
  description?: string;
  recv2r?: number[];
  topics?: {
    inbound?: DataFlowAction[];
  };
};

export type DataFlowGroup = {
  description?: string;
  nodes: Record<string, DataFlowEntityDef>;
};

export type DataFlowDefinition = Record<string, DataFlowGroup>;

// --- Node Types ---

export type DataFlowNodeType = 'entity' | 'recv' | 'route' | 'log' | 'emit';

export type DataFlowNodeData = {
  nodeType: DataFlowNodeType;
  label: string;
  desc?: string;
  actions?: DataFlowAction[];
  channels?: number[];
  channelCount?: number;
  [key: string]: unknown;
};

export type DataFlowNodeInstance = Node<DataFlowNodeData>;

// --- Edge Types ---

export type DataFlowEdgeType = 'receive' | 'routing' | 'logging' | 'emit';
