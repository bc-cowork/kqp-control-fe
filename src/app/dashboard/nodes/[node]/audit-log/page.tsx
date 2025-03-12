import { CONFIG } from 'src/config-global';

import { AuditLogView } from 'src/sections/nodes/audit-log/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Audit Log - ${CONFIG.appName}` };

export default function Page({ params }: { params: { node: string } }) {
  return <AuditLogView nodeId={params.node} />;
}
