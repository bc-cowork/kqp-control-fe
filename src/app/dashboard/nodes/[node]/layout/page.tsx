import { LayoutListView } from 'src/sections/nodes/layout-list/view';

type Props = { params: { node: string } };

export default function Page({ params }: Props) {
    return <LayoutListView nodeId={params.node} />;
}


