'use client';

import { Trans } from 'react-i18next';

import Typography from '@mui/material/Typography';

import { useGetChannelList } from 'src/actions/nodes';

import { useTranslate } from 'src/locales';
import { ACCENT2, FONT_MONO } from 'src/theme/tokens';
import { PageShell } from 'src/components/v5';

import { ChannelInbound } from 'src/components/nodes/ChannelInbound';

// ----------------------------------------------------------------------

type Props = {
  nodeId: string;
};

export function ChannelInboundView({ nodeId }: Props) {
  const { t } = useTranslate('channels');
  const { channels } = useGetChannelList(nodeId, 'inbound');
  const count = channels?.length ?? 0;

  return (
    <PageShell
      node={nodeId}
      crumbs={[{ label: t('title.inbound') }]}
      title={t('title.inbound')}
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
      <ChannelInbound selectedNodeId={nodeId} />
    </PageShell>
  );
}
