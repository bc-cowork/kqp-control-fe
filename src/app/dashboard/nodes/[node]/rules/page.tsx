import { CONFIG } from 'src/config-global';

import { RuleListView } from 'src/sections/nodes/rules/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Rules - ${CONFIG.appName}` };

export default function Page({ params }: { params: { node: string } }) {
  return <RuleListView nodeId={params.node} />;
}
