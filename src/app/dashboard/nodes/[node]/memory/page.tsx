import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

export const metadata = { title: `Memory - ${CONFIG.appName}` };

export default function Page({ params }: { params: { node: string } }) {
  return <div>Memory for Node {params.node}</div>;
}
