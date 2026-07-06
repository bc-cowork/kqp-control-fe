'use client';

import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';

import { PageShell } from 'src/components/v5';
import { AuditLogFrameList } from 'src/components/nodes/AuditLogFrameList';

// ----------------------------------------------------------------------

type Props = {
  nodeId: string;
  file: string;
};

export function AuditFrameListView({ nodeId, file }: Props) {
  const { t } = useTranslate('audit-frame-list');
  const router = useRouter();
  return (
    <PageShell
      node={nodeId}
      crumbs={[
        {
          label: t('top.audit_logs'),
          onClick: () => router.push(`/dashboard/nodes/${nodeId}/audit-log`),
        },
        { label: file },
      ]}
      title={file}
      scroll={false}
    >
      <AuditLogFrameList selectedNodeId={nodeId} selectedFile={file} />
    </PageShell>
  );
}
