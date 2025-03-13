import { CONFIG } from 'src/config-global';

import { AuditFrameListView } from 'src/sections/nodes/audit-log/file/list/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Audit Frame List - ${CONFIG.appName}` };

export default function Page({ params }: { params: { node: string; file: string } }) {
  return <AuditFrameListView nodeId={params.node} file={params.file} />;
}
