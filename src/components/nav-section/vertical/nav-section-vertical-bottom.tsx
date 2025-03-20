import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { Box, Avatar, Typography } from '@mui/material';

import { CONFIG } from 'src/config-global';
import { getBottomNavData } from 'src/layouts/config-nav-dashboard';

import { useAuthContext } from 'src/auth/hooks';

import { NavList } from './nav-list';
import { NavUl, NavLi } from '../styles';
import { navSectionClasses } from '../classes';
import { navSectionCssVars } from '../css-vars';

import type { NavGroupProps } from '../types';

// ----------------------------------------------------------------------

export function NavSectionVerticalBottom({
  sx,
  render,
  slotProps,
  enabledRootRedirect,
  cssVars: overridesVars,
}: any) {
  const theme = useTheme();
  const { user } = useAuthContext();

  const cssVars = {
    ...navSectionCssVars.vertical(theme),
    ...overridesVars,
  };

  const data = getBottomNavData();

  return (
    <Stack
      component="nav"
      className={navSectionClasses.vertical.root}
      sx={{ ...cssVars, ...sx, mb: 3 }}
    >
      <NavUl sx={{ flex: '1 1 auto', gap: 'var(--nav-item-gap)' }}>
        {data.map((group) => (
          <Group
            key={group.items[0].title}
            items={group.items}
            render={render}
            slotProps={slotProps}
            enabledRootRedirect={enabledRootRedirect}
          />
        ))}
      </NavUl>
      <NavUl sx={{ flex: '1 1 auto', gap: 'var(--nav-item-gap)', mt: 2 }}>
        <NavLi>
          <NavUl sx={{ gap: 'var(--nav-item-gap)' }}>
            <Box sx={{ p: 2, border: 1, borderColor: theme.palette.grey[500], borderRadius: 2 }}>
              <Stack direction="row" alignItems="center" gap={2}>
                {/* <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/ic_user_image.svg`} /> */}
                <Avatar
                  alt="user avatar"
                  src={`${CONFIG.assetsDir}/assets/icons/navbar/ic_user.svg`}
                  sx={{
                    zIndex: 1,
                    width: `45px`,
                    height: `45px`,
                    backgroundColor: theme.palette.grey[500],
                    p: 1.6,
                  }}
                />
                <Stack>
                  <Typography variant="subtitle1" noWrap sx={{ color: theme.palette.common.white }}>
                    {user?.id}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.common.white }} noWrap>
                    {user?.role}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </NavUl>
        </NavLi>
      </NavUl>
    </Stack>
  );
}

// ----------------------------------------------------------------------

function Group({ items, render, slotProps, enabledRootRedirect }: NavGroupProps) {
  const renderContent = (
    <NavUl sx={{ gap: 'var(--nav-item-gap)' }}>
      {items.map((list) => (
        <NavList
          key={list.title}
          data={list}
          render={render}
          depth={1}
          slotProps={slotProps}
          enabledRootRedirect={enabledRootRedirect}
        />
      ))}
    </NavUl>
  );

  return <NavLi>{renderContent}</NavLi>;
}
