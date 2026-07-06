'use client';

import { useTranslate } from 'src/locales';

import { PageShell } from 'src/components/v5';
import { Memory } from 'src/components/nodes/Memory';

// ----------------------------------------------------------------------

type Props = {
  nodeId: string;
};

export function MemoryView({ nodeId }: Props) {
  const { t } = useTranslate('memory');

  return (
    <PageShell
      node={nodeId}
      crumbs={[{ label: t('top.memory') }]}
      title={t('top.memory')}
      scroll={false}
    >
      <Memory selectedNodeId={nodeId} />
    </PageShell>
  );
}
