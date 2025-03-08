import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

export const metadata = { title: `Node - ${CONFIG.appName}` };

export default function Page({ params }: { params: { node: string } }) {
  return <div>Node for Node {params.node}</div>;
}
