import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';
import { useTranslate } from 'src/locales';

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
  const { t } = useTranslate('sidebar');
  return [
    {
      items: [
        { title: t('side_bar.dashboard'), path: paths.dashboard.root, icon: ICONS.home },
        {
          title: t('side_bar.nodes'),
          path: paths.dashboard.nodes.root,
          icon: ICONS.nodes,
          children: nodes.map((node) => ({
            title: `${node}`,
            path: paths.dashboard.nodes.node(node),
            children: [
              {
                title: t('tab_option.node_dashboard'),
                path: paths.dashboard.nodes.dashboard(node),
              },
              {
                title: t('tab_option.process'),
                path: paths.dashboard.nodes.process(node),
              },
              {
                title: t('tab_option.memory'),
                path: paths.dashboard.nodes.memory(node),
              },
              {
                title: t('tab_option.audit_log'),
                path: paths.dashboard.nodes.auditLog(node),
              },
              {
                title: t('tab_option.channels_inbound'),
                path: paths.dashboard.nodes.channelsInbound(node),
              },
              {
                title: t('tab_option.channels_outbound'),
                path: paths.dashboard.nodes.channelsOutbound(node),
              },
              {
                title: t('tab_option.rule_list'),
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
  const { t } = useTranslate('sidebar');

  return [
    {
      items: [{ title: t('side_bar.settings'), path: '#', icon: ICONS.settings }],
    },
  ];
}
