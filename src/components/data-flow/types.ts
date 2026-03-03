import type { Node } from '@xyflow/react';

// ----------------------------------------------------------------------

// --- API JSON Structure ---

export type ActionParam = Record<string, unknown>;

export type DataFlowAction = {
  act: string;
  param: ActionParam;
};

export type DataFlowEntityDef = {
  desc?: string;
  recv2r?: number[];
  actions?: DataFlowAction[];
};

export type DataFlowRelations = Record<string, { to: string[] }>;

export type DataFlowDefinition = {
  [key: string]: DataFlowEntityDef | DataFlowRelations;
  relations: DataFlowRelations;
};

// --- Node Data ---

export type DataFlowNodeData = {
  label: string;
  nodeType: 'recv' | 'entity';
  channels?: number[];
  actions?: DataFlowAction[];
  [key: string]: unknown;
};

export type DataFlowNodeInstance = Node<DataFlowNodeData>;
