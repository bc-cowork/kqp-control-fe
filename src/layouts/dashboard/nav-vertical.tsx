import type { Breakpoint } from '@mui/material/styles';
import type { NavSectionProps } from 'src/components/nav-section';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import { varAlpha, hideScrollY } from 'src/theme/styles';

import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';
import { NavSectionMini, NavSectionVertical } from 'src/components/nav-section';
import { NavSectionMiniBottom } from 'src/components/nav-section/mini/nav-section-mini-bottom';
import { NavSectionVerticalBottom } from 'src/components/nav-section/vertical/nav-section-vertical-bottom';

import { NavToggleButton } from '../components/nav-toggle-button';

// ----------------------------------------------------------------------

export type NavVerticalProps = NavSectionProps & {
  isNavMini: boolean;
  layoutQuery: Breakpoint;
  onToggleNav: () => void;
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
};

export function NavVertical({
  sx,
  data,
  slots,
  isNavMini,
  layoutQuery,
  onToggleNav,
  ...other
}: NavVerticalProps) {
  const theme = useTheme();
  // const [search, setSearch] = useState('');

  const renderNavVertical = (
    <>
      {slots?.topArea ?? (
        <Box sx={{ pl: 3.5, pt: 6, pb: 5, mb: 0.5, mt: 1 }}>
          <Logo
            id="nav-vertical"
            isSingle={false}
            isWhite
            width={126}
            height={24}
            sx={{ p: 0.2 }}
          />
        </Box>
      )}

      <Scrollbar fillContent>
        <NavSectionVertical data={data} sx={{ pl: 3, pr: 2, flex: '1 1 auto' }} {...other} />

        {slots?.bottomArea}
      </Scrollbar>
      <NavSectionVerticalBottom sx={{ px: 2 }} {...other} />
    </>
  );

  const renderNavMini = (
    <>
      {slots?.topArea ?? (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 6, pb: 5, mb: 0.5, mt: 1 }}>
          <Logo id="nav-vertical-tops" isWhite height={24} width={24} sx={{ p: 0.4 }} />
        </Box>
      )}

      <NavSectionMini
        data={data}
        sx={{
          pb: 2,
          px: 0.5,
          ...hideScrollY,
          flex: '1 1 auto',
          overflowY: 'auto',
          backgroundColor: theme.palette.grey[600],
        }}
        {...other}
      />

      {slots?.bottomArea ?? (
        <NavSectionMiniBottom
          sx={{ px: 0.5, backgroundColor: theme.palette.grey[600] }}
          {...other}
        />
      )}
    </>
  );

  return (
    <Box
      sx={{
        top: 0,
        left: 0,
        height: 1,
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        bgcolor: 'var(--layout-nav-bg)',
        zIndex: 'var(--layout-nav-zIndex)',
        width: isNavMini ? 'var(--layout-nav-mini-width)' : 'var(--layout-nav-vertical-width)',
        borderRight: `1px solid var(--layout-nav-border-color, ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)})`,
        transition: theme.transitions.create(['width'], {
          easing: 'var(--layout-transition-easing)',
          duration: 'var(--layout-transition-duration)',
        }),
        [theme.breakpoints.up(layoutQuery)]: {
          display: 'flex',
        },
        ...sx,
      }}
    >
      <NavToggleButton
        isNavMini={isNavMini}
        onClick={onToggleNav}
        sx={{
          display: 'none',
          [theme.breakpoints.up(layoutQuery)]: {
            display: 'inline-flex',
          },
        }}
      />
      {isNavMini ? renderNavMini : renderNavVertical}
    </Box>
  );
}
