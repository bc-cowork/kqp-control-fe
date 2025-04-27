import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  home: icon('ic_home'),
  nodes: icon('ic_nodes'),
  notification: icon('ic_notification'),
  settings: icon('ic_settings'),
};

// ----------------------------------------------------------------------

export function getNavData(nodes: string[] = []) {
  return [
    {
      items: [
        { title: 'Dashboard', path: paths.dashboard.root, icon: ICONS.home },
        {
          title: 'Nodes',
          path: paths.dashboard.nodes.root,
          icon: ICONS.nodes,
          children: nodes.map((node) => ({
            title: `${node}`,
            path: paths.dashboard.nodes.node(node),
            children: [
              {
                title: 'Node Dashboard',
                path: paths.dashboard.nodes.dashboard(node),
              },
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
              {
                title: 'Rule List',
                path: paths.dashboard.nodes.rules(node),
              },
            ],
          })),
        },
      ],
    },
  ];
}

export function getBottomNavData() {
  return [
    {
      items: [{ title: 'Settings', path: '#', icon: ICONS.settings }],
    },
  ];
}
