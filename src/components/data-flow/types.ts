import type { Node } from '@xyflow/react';

// ----------------------------------------------------------------------

// --- API JSON Structure ---

export type DataFlowEntityDef = {
  description?: string;
  actions: string[];
};

export type DataFlowRelations = Record<string, { to: string[] }>;

export type DataFlowDefinition = {
  [key: string]: DataFlowEntityDef | DataFlowRelations;
  relations: DataFlowRelations;
};

// --- Node Data ---

export type DataFlowNodeData = {
  label: string;
  actions?: string[];
  [key: string]: unknown;
};

export type DataFlowNodeInstance = Node<DataFlowNodeData>;
