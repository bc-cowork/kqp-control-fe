import { CONFIG } from 'src/config-global';

import { ProcessView } from 'src/sections/nodes/process/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Process - ${CONFIG.appName}` };

export default function Page({ params }: { params: { node: string } }) {
  return <ProcessView nodeId={params.node} />;
}
