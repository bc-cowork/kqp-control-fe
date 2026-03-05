'use client';

import { AlertFormView } from 'src/sections/nodes/alert-list/alert-form-view';

type Props = { params: { node: string } };

export default function Page({ params }: Props) {
  const { node } = params;
  return <AlertFormView nodeId={node} />;
}
