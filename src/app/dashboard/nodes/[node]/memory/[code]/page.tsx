import { CONFIG } from 'src/config-global';

import { MemoryItemView } from 'src/sections/nodes/memory/item/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Issue Item- ${CONFIG.appName}` };

export default function Page({ params }: { params: { node: string; code: string } }) {
  return <MemoryItemView nodeId={params.node} code={params.code} />;
}
