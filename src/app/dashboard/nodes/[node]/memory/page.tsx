import { CONFIG } from 'src/config-global';

import { MemoryView } from 'src/sections/nodes/memory/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Memory - ${CONFIG.appName}` };

export default function Page({ params }: { params: { node: string } }) {
  return <MemoryView nodeId={params.node} />;
}
