import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

export const metadata = { title: `Channels:Inbound - ${CONFIG.appName}` };

export default function Page({ params }: { params: { node: string } }) {
  return <div>Channels:Inbound for Node {params.node}</div>;
}
