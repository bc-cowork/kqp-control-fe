import type { Node, Edge } from '@xyflow/react';

// ----------------------------------------------------------------------

export type FlowEntityData = Record<string, unknown>;

export type FlowRelation = {
  to: string | string[];
};

export type FlowRelations = Record<string, FlowRelation>;

export type FlowDocument = {
  [key: string]: FlowEntityData | FlowRelations;
  relations: FlowRelations;
};

export type EntityNodeData = {
  label: string;
  entityKey: string;
  entityData: FlowEntityData;
  [key: string]: unknown;
};

export type EntityNodeType = Node<EntityNodeData>;

export type ValidationResult = {
  valid: boolean;
  errors: string[];
};

export type FlowGraphState = {
  nodes: EntityNodeType[];
  edges: Edge[];
};
