import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

export const metadata = { title: `Channels:Outbound - ${CONFIG.appName}` };

export default function Page({ params }: { params: { node: string } }) {
  return <div>Channels:Outbound for Node {params.node}</div>;
}
