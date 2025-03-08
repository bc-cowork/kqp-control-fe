import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

export const metadata = { title: `Nodes - ${CONFIG.appName}` };

export default function Page({ params }: { params: { node: string } }) {
  return <div>Nodes Overview for Node {params.node}</div>;
}
