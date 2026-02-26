import { CONFIG } from 'src/config-global';

import { FlowEditorView } from 'src/sections/nodes/flow-editor/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Message Flow - ${CONFIG.appName}` };

export default function Page({ params }: { params: { node: string } }) {
  return <FlowEditorView nodeId={params.node} />;
}
