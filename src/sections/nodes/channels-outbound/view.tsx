'use client';

import { Trans } from 'react-i18next';

import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';
import { useGetChannelList } from 'src/actions/nodes';
import { ACCENT2, FONT_MONO } from 'src/theme/tokens';

import { PageShell } from 'src/components/v5';
import { ChannelOutbound } from 'src/components/nodes/ChannelOutbound';

// ----------------------------------------------------------------------

type Props = {
  nodeId: string;
};

export function ChannelOutboundView({ nodeId }: Props) {
  const { t } = useTranslate('channels');
  const { channels } = useGetChannelList(nodeId, 'outbound');
  const count = channels?.length ?? 0;

  return (
    <PageShell
      node={nodeId}
      crumbs={[{ label: t('title.outbound') }]}
      title={t('title.outbound')}
      actions={
        <Typography sx={{ fontSize: 15, color: ACCENT2 }}>
          <Trans
            i18nKey="action_total"
            ns="channels"
            values={{ count }}
            components={{ mono: <span style={{ fontFamily: FONT_MONO, fontWeight: 500 }} /> }}
          />
        </Typography>
      }
    >
      <ChannelOutbound selectedNodeId={nodeId} />
    </PageShell>
  );
}
