import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

export const metadata = { title: `Process - ${CONFIG.appName}` };

export default function Page({ params }: { params: { node: string } }) {
  return <div>Process for Node {params.node}</div>;
}
