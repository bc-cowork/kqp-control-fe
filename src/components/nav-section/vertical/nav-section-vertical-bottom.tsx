import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { Box, Avatar, Button, Divider, Popover, SvgIcon, Typography } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { getBottomNavData } from 'src/layouts/config-nav-dashboard';

import { useAuthContext } from 'src/auth/hooks';
import { signOut } from 'src/auth/context/jwt/action';
import { useTranslate } from 'src/locales';

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
  const { t } = useTranslate('sidebar');
  const theme = useTheme();
  const { user, checkUserSession } = useAuthContext();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const router = useRouter();

  const cssVars = {
    ...navSectionCssVars.vertical(theme),
    ...overridesVars,
  };

  const data = getBottomNavData(t);

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      await checkUserSession?.();

      handleClose();
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }, [checkUserSession, router]);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openMenu = Boolean(anchorEl);
  const userButtonId = openMenu ? 'logout-popover' : undefined;

  return (
    <Stack
      component="nav"
      className={navSectionClasses.vertical.root}
      sx={{ ...cssVars, ...sx, mb: 3 }}
    >
      <Divider sx={{ borderColor: theme.palette.grey[500], mb: 1.5 }} />
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
            <Box
              sx={{
                p: 2,
                border: 1,
                borderColor: theme.palette.grey[500],
                borderRadius: 2,
                cursor: 'pointer',
                backgroundColor: openMenu ? theme.palette.grey[400] : 'inherit',
              }}
              onClick={handleClick}
              aria-describedby={userButtonId}
            >
              <Stack direction="row" alignItems="center" gap={2}>
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

            <Popover
              id={userButtonId}
              open={openMenu}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
              transformOrigin={{ vertical: 'center', horizontal: 'left' }}
              slotProps={{
                paper: {
                  sx: {
                    p: 0,
                    ml: 1,
                  },
                },
              }}
            >
              <Button
                onClick={handleLogout}
                sx={{
                  border: 1,
                  borderColor: '#FFD8D8',
                  backgroundColor: '#FFF2FA',
                  color: theme.palette.error.main,
                  fontWeight: 400,
                  fontSize: 19,
                  height: 50,
                  width: 110,
                }}
                startIcon={
                  <SvgIcon>
                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 19 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0.800021 0.5C0.587844 0.499994 0.384356 0.584277 0.234322 0.734307C0.0842884 0.884337 0 1.08782 0 1.3V17.7028C0 18.1446 0.358172 18.5028 0.8 18.5028H8.19922C8.64105 18.5028 8.99922 18.1446 8.99922 17.7028C8.99922 17.261 8.64105 16.9028 8.19922 16.9028H1.6V2.10002L8.1992 2.1002C8.64103 2.10021 8.99921 1.74204 8.99922 1.30022C8.99923 0.858389 8.64107 0.500207 8.19924 0.500195L0.800021 0.5ZM18.1529 10.0769C18.3098 9.92603 18.3984 9.71781 18.3984 9.5002C18.3984 9.28258 18.3098 9.07436 18.1529 8.92353L12.9529 3.92353C12.6344 3.61729 12.128 3.62722 11.8218 3.94571C11.5155 4.26419 11.5255 4.77063 11.844 5.07686L15.6122 8.7002H6C5.55817 8.7002 5.2 9.05837 5.2 9.5002C5.2 9.94202 5.55817 10.3002 6 10.3002H15.6122L11.844 13.9235C11.5255 14.2298 11.5155 14.7362 11.8218 15.0547C12.128 15.3732 12.6344 15.3831 12.9529 15.0769L18.1529 10.0769Z"
                        fill="#FF3D4A"
                      />
                    </svg>
                  </SvgIcon>
                }
              >{
                  `${t('side_bar.logout')}`
                }
              </Button>
            </Popover>
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
