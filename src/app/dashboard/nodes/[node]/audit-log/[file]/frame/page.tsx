import { CONFIG } from 'src/config-global';

import { AuditLogFileView } from 'src/sections/nodes/audit-log/file/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Audit Frame - ${CONFIG.appName}` };

export default function Page({ params }: { params: { node: string; file: string } }) {
  return <AuditLogFileView nodeId={params.node} file={params.file} />;
}
