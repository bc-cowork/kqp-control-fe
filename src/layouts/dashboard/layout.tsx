'use client';

import type { NavSectionProps } from 'src/components/nav-section';
import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useTheme } from '@mui/material/styles';

import { useBoolean } from 'src/hooks/use-boolean';

import { useGetNodes } from 'src/actions/dashboard';

import { useSettingsContext } from 'src/components/settings';
import { useTranslate } from 'src/locales';

import { Main } from './main';
import { layoutClasses } from '../classes';
import { useNavColorVars } from './styles';
import { NavVertical } from './nav-vertical';
import { getNavData } from '../config-nav-dashboard';
import { LayoutSection } from '../core/layout-section';

// ----------------------------------------------------------------------

export type DashboardLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  header?: {
    sx?: SxProps<Theme>;
  };
  data?: {
    nav?: NavSectionProps['data'];
  };
};

export function DashboardLayout({ sx, children, header, data }: DashboardLayoutProps) {
  const theme = useTheme();
  const { t } = useTranslate('sidebar');

  const mobileNavOpen = useBoolean();

  const settings = useSettingsContext();

  const navColorVars = useNavColorVars(theme, settings);

  const { nodes, nodesLoading, nodesEmpty, nodesError } = useGetNodes();

  const layoutQuery: Breakpoint = 'lg';

  const navData = data?.nav ?? getNavData(t, nodes?.map((node: any) => node.id) || []);

  const isNavMini = settings.navLayout === 'mini';
  const isNavHorizontal = settings.navLayout === 'horizontal';
  const isNavVertical = isNavMini || settings.navLayout === 'vertical';

  return (
    <LayoutSection
      /** **************************************
       * Header
       *************************************** */
      headerSection={null}
      /** **************************************
       * Sidebar
       *************************************** */
      sidebarSection={
        <NavVertical
          data={navData}
          isNavMini={isNavMini}
          layoutQuery={layoutQuery}
          cssVars={navColorVars.section}
          onToggleNav={() =>
            settings.onUpdateField(
              'navLayout',
              settings.navLayout === 'vertical' ? 'mini' : 'vertical'
            )
          }
        />
      }
      /** **************************************
       * Footer
       *************************************** */
      footerSection={null}
      /** **************************************
       * Style
       *************************************** */
      cssVars={{
        ...navColorVars.layout,
        '--layout-transition-easing': 'linear',
        '--layout-transition-duration': '120ms',
        '--layout-nav-mini-width': '88px',
        '--layout-nav-vertical-width': '260px',
        '--layout-nav-horizontal-height': '64px',
        '--layout-dashboard-content-pt': theme.spacing(1),
        '--layout-dashboard-content-pb': theme.spacing(8),
        '--layout-dashboard-content-px': theme.spacing(5),
      }}
      sx={{
        [`& .${layoutClasses.hasSidebar}`]: {
          [theme.breakpoints.up(layoutQuery)]: {
            transition: theme.transitions.create(['padding-left'], {
              easing: 'var(--layout-transition-easing)',
              duration: 'var(--layout-transition-duration)',
            }),
            pl: isNavMini ? 'var(--layout-nav-mini-width)' : 'var(--layout-nav-vertical-width)',
          },
        },

        ...sx,
        backgroundColor: theme.palette.grey[50],
      }}
    >
      <Main isNavHorizontal={isNavHorizontal}>{children}</Main>
    </LayoutSection>
  );
}
