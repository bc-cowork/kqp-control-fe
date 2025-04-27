import { CONFIG } from 'src/config-global';

import { RuleDetailView } from 'src/sections/nodes/rules/item/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Rule Detail- ${CONFIG.appName}` };

export default function Page({ params }: { params: { node: string; id: string } }) {
  return <RuleDetailView nodeId={params.node} code={params.id} />;
}
