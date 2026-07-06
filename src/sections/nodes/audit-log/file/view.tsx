'use client';

import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';

import { PageShell } from 'src/components/v5';
import { AuditLogFrame } from 'src/components/nodes/AuditLogFrame';

// ----------------------------------------------------------------------

type Props = {
  nodeId: string;
  file: string;
  seq: string;
  head: string;
};

export function AuditLogFileView({ nodeId, file, seq, head }: Props) {
  const { t } = useTranslate('audit-frame-detail');
  const router = useRouter();
  return (
    <PageShell
      node={nodeId}
      crumbs={[
        {
          label: t('top.audit_logs'),
          onClick: () => router.push(`/dashboard/nodes/${nodeId}/audit-log`),
        },
        {
          label: file,
          onClick: () => router.push(`/dashboard/nodes/${nodeId}/audit-log/${file}`),
        },
        { label: head },
      ]}
      title={head}
      scroll={false}
    >
      <AuditLogFrame selectedNodeId={nodeId} selectedFile={file} selectedSeq={seq} head={head} />
    </PageShell>
  );
}
