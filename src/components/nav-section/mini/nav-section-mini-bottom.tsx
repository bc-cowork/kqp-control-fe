import { Avatar } from '@mui/material';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';

import { CONFIG } from 'src/config-global';
import { getBottomNavData } from 'src/layouts/config-nav-dashboard';

import { NavList } from './nav-list';
import { NavUl, NavLi } from '../styles';
import { navSectionClasses } from '../classes';
import { navSectionCssVars } from '../css-vars';

import type { NavGroupProps } from '../types';

// ----------------------------------------------------------------------

export function NavSectionMiniBottom({
  sx,
  render,
  slotProps,
  enabledRootRedirect,
  cssVars: overridesVars,
}: any) {
  const theme = useTheme();

  const cssVars = {
    ...navSectionCssVars.mini(theme),
    ...overridesVars,
  };

  const data = getBottomNavData();

  return (
    <Stack
      component="nav"
      className={navSectionClasses.mini.root}
      sx={{ ...cssVars, ...sx, backgroundColor: theme.palette.grey[600] }}
    >
      <NavUl sx={{ flex: '1 1 auto', gap: 'var(--nav-item-gap)' }}>
        {data.map((group) => (
          <Group
            key={group.items[0].title}
            render={render}
            cssVars={cssVars}
            items={group.items}
            slotProps={slotProps}
            enabledRootRedirect={enabledRootRedirect}
          />
        ))}
      </NavUl>
    </Stack>
  );
}

// ----------------------------------------------------------------------

function Group({ items, render, slotProps, enabledRootRedirect, cssVars }: NavGroupProps) {
  return (
    <NavLi>
      <NavUl sx={{ gap: 'var(--nav-item-gap)' }}>
        {items.map((list) => (
          <NavList
            key={list.title}
            depth={1}
            data={list}
            render={render}
            cssVars={cssVars}
            slotProps={slotProps}
            enabledRootRedirect={enabledRootRedirect}
          />
        ))}
      </NavUl>

      <NavUl sx={{ alignItems: 'center', mb: 3, mt: 2 }}>
        <Avatar
          alt="user avatar"
          src={`${CONFIG.assetsDir}/assets/icons/navbar/ic_user.svg`}
          sx={{
            zIndex: 1,
            width: `50px`,
            height: `50px`,
            backgroundColor: (theme) => theme.palette.grey[500],
            p: 1.6,
          }}
        />
      </NavUl>
    </NavLi>
  );
}
