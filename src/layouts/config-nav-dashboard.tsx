import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
};

// ----------------------------------------------------------------------

export function getNavData(nodes: string[] = []) {
  return [
    {
      items: [
        { title: 'Dashboard', path: paths.dashboard.root, icon: ICONS.dashboard },
        {
          title: 'Nodes',
          path: paths.dashboard.nodes.root,
          icon: ICONS.menuItem,
          children: nodes.map((node) => ({
            title: `${node}`,
            path: paths.dashboard.nodes.node(node),
            children: [
              {
                title: 'Process',
                path: paths.dashboard.nodes.process(node),
              },
              {
                title: 'Memory',
                path: paths.dashboard.nodes.memory(node),
              },
              {
                title: 'Audit Log',
                path: paths.dashboard.nodes.auditLog(node),
              },
              {
                title: 'Channels Inbound',
                path: paths.dashboard.nodes.channelsInbound(node),
              },
              {
                title: 'Channels Outbound',
                path: paths.dashboard.nodes.channelsOutbound(node),
              },
            ],
          })),
        },
      ],
    },
  ];
}
