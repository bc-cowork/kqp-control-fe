'use client';

import { useTranslate } from 'src/locales';

import { PageShell } from 'src/components/v5';
import { RuleList } from 'src/components/nodes/RuleList';

// ----------------------------------------------------------------------

type Props = {
  nodeId: string;
};

export function RuleListView({ nodeId }: Props) {
  const { t } = useTranslate('rule-list');

  return (
    <PageShell node={nodeId} crumbs={[{ label: t('top.title') }]} title={t('top.title')}>
      <RuleList selectedNodeId={nodeId} />
    </PageShell>
  );
}
