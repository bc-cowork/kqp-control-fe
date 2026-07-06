'use client';

import { useTranslate } from 'src/locales';

import { PageShell } from 'src/components/v5';
import { AuditLogList } from 'src/components/nodes/AuditLogList';

// ----------------------------------------------------------------------

type Props = {
  nodeId: string;
};

export function AuditLogView({ nodeId }: Props) {
  const { t } = useTranslate('audit-list');
  return (
    <PageShell node={nodeId} crumbs={[{ label: t('top.audit_logs') }]} title={t('top.audit_logs')}>
      <AuditLogList selectedNodeId={nodeId} />
    </PageShell>
  );
}
