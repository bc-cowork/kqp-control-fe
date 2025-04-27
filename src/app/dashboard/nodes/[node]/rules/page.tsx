import { CONFIG } from 'src/config-global';

import { RuleListView } from 'src/sections/nodes/rules/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Rule List - ${CONFIG.appName}` };

export default function Page({ params }: { params: { node: string } }) {
  return <RuleListView nodeId={params.node} />;
}
