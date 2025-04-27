import { CONFIG } from 'src/config-global';

import { NodeDashboardView } from 'src/sections/nodes/node-dashboard/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Node Dashboard - ${CONFIG.appName}` };

export default function Page({ params }: { params: { node: string } }) {
  return <NodeDashboardView nodeId={params.node} />;
}
