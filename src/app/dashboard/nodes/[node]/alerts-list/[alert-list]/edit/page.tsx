'use client';

import { AlertFormView } from 'src/sections/nodes/alert-list/alert-form-view';

type Props = {
  params: {
    node: string;
    'alert-list': string;
  };
};

export default function Page({ params }: Props) {
  const { node, 'alert-list': alertId } = params;
  return <AlertFormView nodeId={node} alertId={decodeURIComponent(alertId)} />;
}
