import { CONFIG } from 'src/config-global';

import { ChannelOutboundView } from 'src/sections/nodes/channels-outbound/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Channels:Outbound - ${CONFIG.appName}` };

export default function Page({ params }: { params: { node: string } }) {
  return <ChannelOutboundView nodeId={params.node} />;
}
