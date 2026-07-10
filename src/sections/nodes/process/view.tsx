'use client';

import { Trans } from 'react-i18next';

import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';
import { ACCENT2, FONT_MONO } from 'src/theme/tokens';
import { useGetProcesses } from 'src/actions/dashboard';

import { PageShell } from 'src/components/v5';
import { ProcessDetail } from 'src/components/nodes/ProcessDetail';

// ----------------------------------------------------------------------

type Props = {
  nodeId: string;
};

export function ProcessView({ nodeId }: Props) {
  const { t } = useTranslate('process');
  const { processes } = useGetProcesses(nodeId) as { processes: any[] };
  const count = processes?.length ?? 0;

  return (
    <PageShell
      node={nodeId}
      crumbs={[{ label: t('top.process') }]}
      title={t('top.process')}
      actions={
        <Typography sx={{ fontSize: 15, color: ACCENT2 }}>
          <Trans
            i18nKey="action_total"
            ns="process"
            values={{ count }}
            components={{ mono: <span style={{ fontFamily: FONT_MONO, fontWeight: 500 }} /> }}
          />
        </Typography>
      }
    >
      <ProcessDetail selectedNodeId={nodeId} />
    </PageShell>
  );
}
