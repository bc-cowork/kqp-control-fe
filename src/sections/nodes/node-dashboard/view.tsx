'use client';

import { useTranslate } from 'src/locales';

import { PageShell } from 'src/components/v5';

import { NodeDashboard } from 'src/components/nodes/NodeDashboard';

// ----------------------------------------------------------------------

type Props = {
  nodeId: string;
};

export function NodeDashboardView({ nodeId }: Props) {
  const { t } = useTranslate('node-dashboard');

  return (
    <PageShell
      node={nodeId}
      crumbs={[{ label: t('top.node_dashboard') }]}
      title={t('top.node_dashboard')}
    >
      <NodeDashboard selectedNodeId={nodeId} />
    </PageShell>
  );
}
