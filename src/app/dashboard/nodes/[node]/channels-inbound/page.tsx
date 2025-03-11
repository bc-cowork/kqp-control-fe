import { CONFIG } from 'src/config-global';

import { ChannelInboundView } from 'src/sections/nodes/channels-inbound/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Channels:Inbound - ${CONFIG.appName}` };

export default function Page({ params }: { params: { node: string } }) {
  return <ChannelInboundView nodeId={params.node} />;
}
