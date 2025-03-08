import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

export const metadata = { title: `Audit Log - ${CONFIG.appName}` };

export default function Page({ params }: { params: { node: string } }) {
  return <div>Audit Log for Node {params.node}</div>;
}
