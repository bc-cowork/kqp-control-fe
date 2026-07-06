'use client';

import type { NavSectionProps } from 'src/components/nav-section';
import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useTheme } from '@mui/material/styles';

import { useGetNodes } from 'src/actions/dashboard';

import { useSettingsContext } from 'src/components/settings';

import { Main } from './main';
import { HeaderV5 } from './header-v5';
import { layoutClasses } from '../classes';
import { useNavColorVars } from './styles';
import { NavVerticalV5 } from './nav-vertical-v5';
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

  const settings = useSettingsContext();

  const navColorVars = useNavColorVars(theme, settings);

  const { nodes } = useGetNodes();

  const layoutQuery: Breakpoint = 'xs';

  const isNavMini = settings.navLayout === 'mini';
  const isNavHorizontal = settings.navLayout === 'horizontal';
  const isNavVertical = isNavMini || settings.navLayout === 'vertical';

  return (
    <LayoutSection
      /** **************************************
       * Header
       *************************************** */
      headerSection={<HeaderV5 />}
      /** **************************************
       * Sidebar
       *************************************** */
      sidebarSection={<NavVerticalV5 nodes={nodes || []} />}
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
        '--layout-nav-vertical-width': '268px',
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
        backgroundColor: '#161420',
      }}
    >
      <Main isNavHorizontal={isNavHorizontal}>{children}</Main>
    </LayoutSection>
  );
}
