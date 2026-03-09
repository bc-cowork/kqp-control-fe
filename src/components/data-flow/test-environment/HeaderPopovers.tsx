import type { UsePopoverReturn } from 'src/components/custom-popover';

import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

import { VerticalViewIcon, HorizontalViewIcon } from './icons';

// ----------------------------------------------------------------------

type ViewMode = 'horizontal' | 'vertical';

const SCALE_OPTIONS = [
  { key: 'current', value: 100 },
  { key: 'scale_reset', value: 50 },
  { key: 'scale_larger', value: 125 },
  { key: 'scale_smaller', value: 50 },
] as const;

const DARK_POPOVER_PAPER_SX = {
  bgcolor: '#1A2030',
  border: '1px solid #373F4E',
  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
  '& .MuiMenuItem-root': {
    color: '#E0E4EB',
    marginBottom: 1,
  },
  '& .MuiMenuItem-root:hover': { bgcolor: '#2A3344' },
  '& .MuiListItemIcon-root': { color: '#AFB7C8', minWidth: 28 },
  '& .MuiListItemText-primary': { fontSize: 12, fontWeight: 400 },
};

// ----------------------------------------------------------------------

type HeaderPopoversProps = {
  viewMode: ViewMode;
  interfaceScale: number;
  isFullscreen: boolean;
  viewModePopover: UsePopoverReturn;
  optionsPopover: UsePopoverReturn;
  viewScreenAnchor: HTMLElement | null;
  scaleAnchor: HTMLElement | null;
  onViewModeChange: (mode: ViewMode) => void;
  onScaleChange: (value: number) => void;
  onToggleFullscreen: () => void;
  onOptionsClose: () => void;
  onExit: () => void;
  onViewScreenAnchorChange: (el: HTMLElement | null) => void;
  onScaleAnchorChange: (el: HTMLElement | null) => void;
};

export function HeaderPopovers({
  viewMode,
  interfaceScale,
  isFullscreen,
  viewModePopover,
  optionsPopover,
  viewScreenAnchor,
  scaleAnchor,
  onViewModeChange,
  onScaleChange,
  onToggleFullscreen,
  onOptionsClose,
  onExit,
  onViewScreenAnchorChange,
  onScaleAnchorChange,
}: HeaderPopoversProps) {
  const { t } = useTranslate('data-flow');
  const isHorizontal = viewMode === 'horizontal';

  return (
    <>
      {/* View Mode Popover */}
      <CustomPopover
        open={viewModePopover.open}
        anchorEl={viewModePopover.anchorEl}
        onClose={viewModePopover.onClose}
        slotProps={{ arrow: { hide: true }, paper: { sx: DARK_POPOVER_PAPER_SX } }}
      >
        <MenuList>
          <MenuItem
            selected={isHorizontal}
            onClick={() => onViewModeChange('horizontal')}
            sx={{ backgroundColor: 'transparent' }}
          >
            <ListItemText>{t('sandbox.horizontal')}</ListItemText>
            <ListItemIcon>
              <HorizontalViewIcon />
            </ListItemIcon>
          </MenuItem>
          <MenuItem
            selected={!isHorizontal}
            onClick={() => onViewModeChange('vertical')}
            sx={{ backgroundColor: 'transparent' }}
          >
            <ListItemText>{t('sandbox.vertical')}</ListItemText>
            <ListItemIcon>
              <VerticalViewIcon />
            </ListItemIcon>
          </MenuItem>
        </MenuList>
      </CustomPopover>

      {/* Options Popover */}
      <CustomPopover
        open={optionsPopover.open}
        anchorEl={optionsPopover.anchorEl}
        onClose={onOptionsClose}
        slotProps={{ arrow: { hide: true }, paper: { sx: DARK_POPOVER_PAPER_SX } }}
      >
        <MenuList>
          <MenuItem
            onClick={(e) => {
              onViewScreenAnchorChange(e.currentTarget);
              onScaleAnchorChange(null);
            }}
            sx={{ backgroundColor: 'transparent' }}
          >
            <ListItemIcon>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#E0E4EB" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M3.99995 4.19995C3.00584 4.19995 2.19995 5.00584 2.19995 5.99995V18C2.19995 18.9941 3.00584 19.8 3.99995 19.8H20C20.9941 19.8 21.7999 18.9941 21.7999 18V5.99995C21.7999 5.00584 20.9941 4.19995 20 4.19995H3.99995ZM3.79995 5.99995C3.79995 5.88949 3.88949 5.79995 3.99995 5.79995H8.99998L8.99997 18.2H3.99995C3.88949 18.2 3.79995 18.1104 3.79995 18V5.99995ZM10.6 18.2H20C20.1104 18.2 20.2 18.1104 20.2 18V5.99995C20.2 5.88949 20.1104 5.79995 20 5.79995H10.6L10.6 18.2Z" fill="#E0E4EB" />
              </svg>

            </ListItemIcon>
            <ListItemText sx={{ flex: 'none', marginLeft: '-22px', marginRight: '18px' }}>{t('sandbox.view_screen')}</ListItemText>
            <Iconify icon="eva:chevron-right-fill" width={20} sx={{ ml: 'auto', color: '#AFB7C8' }} />
          </MenuItem>

          <MenuItem
            onClick={(e) => {
              onScaleAnchorChange(e.currentTarget);
              onViewScreenAnchorChange(null);
            }}
            sx={{ backgroundColor: 'transparent' }}
          >
            <ListItemIcon>
              <svg width="10" height="10" viewBox="0 0 18 18" fill="#E0E4EB" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.2002 0C17.6419 0.000105527 17.9999 0.358132 18 0.799805V8.7998C18 9.24157 17.6419 9.5995 17.2002 9.59961C16.7584 9.59961 16.4004 9.24163 16.4004 8.7998V2.71484L2.54785 16.3984H8.7998C9.24163 16.3984 9.59961 16.7564 9.59961 17.1982C9.5995 17.64 9.24157 17.998 8.7998 17.998H0.799805C0.358132 17.9979 0.000105527 17.6399 0 17.1982V9.19824C0 8.75648 0.358067 8.39854 0.799805 8.39844C1.24163 8.39844 1.59961 8.75641 1.59961 9.19824V15.085L15.252 1.59961H9.2002C8.75837 1.59961 8.40039 1.24163 8.40039 0.799805C8.4005 0.358067 8.75843 0 9.2002 0H17.2002Z" fill="#E0E4EB" />
              </svg>
            </ListItemIcon>
            <ListItemText sx={{ flex: 'none', marginLeft: '-22px', marginRight: '18px' }}>{t('sandbox.interface_scale')}</ListItemText>
            <Iconify icon="eva:chevron-right-fill" width={20} sx={{ ml: 'auto', color: '#AFB7C8' }} />
          </MenuItem>

          <MenuItem onClick={onToggleFullscreen} sx={{ backgroundColor: 'transparent' }}>
            <ListItemIcon>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#E0E4EB" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.28571 2C5.14907 2 4.05898 2.45153 3.25526 3.25526C2.45153 4.05898 2 5.14907 2 6.28571V17.7143C2 18.8509 2.45153 19.941 3.25526 20.7447C4.05898 21.5485 5.14907 22 6.28571 22H17.7143C18.8509 22 19.941 21.5485 20.7447 20.7447C21.5485 19.941 22 18.8509 22 17.7143V6.28571C22 5.14907 21.5485 4.05898 20.7447 3.25526C19.941 2.45153 18.8509 2 17.7143 2H6.28571ZM3.42857 6.28571C3.42857 5.52795 3.72959 4.80123 4.26541 4.26541C4.80123 3.72959 5.52795 3.42857 6.28571 3.42857H17.7143C18.472 3.42857 19.1988 3.72959 19.7346 4.26541C20.2704 4.80123 20.5714 5.52795 20.5714 6.28571H3.42857ZM3.42857 7.71429H20.5714V17.7143C20.5714 18.472 20.2704 19.1988 19.7346 19.7346C19.1988 20.2704 18.472 20.5714 17.7143 20.5714H6.28571C5.52795 20.5714 4.80123 20.2704 4.26541 19.7346C3.72959 19.1988 3.42857 18.472 3.42857 17.7143V7.71429Z" fill="#E0E4EB" />
              </svg>
            </ListItemIcon>
            <ListItemText sx={{
              flex: 'none', marginLeft: '-22px', marginRight: '18px',
            }}>
              {t(isFullscreen ? 'sandbox.exit_fullscreen' : 'sandbox.enter_fullscreen')}
            </ListItemText>
          </MenuItem>

          <MenuItem onClick={onExit} sx={{ backgroundColor: 'transparent' }}>
            <ListItemText>{t('sandbox.exit')}</ListItemText>
          </MenuItem>
        </MenuList>
      </CustomPopover>

      {/* View Screen Submenu */}
      <CustomPopover
        open={!!viewScreenAnchor}
        anchorEl={viewScreenAnchor}
        onClose={() => onViewScreenAnchorChange(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          arrow: { hide: true },
          paper: { sx: { ...DARK_POPOVER_PAPER_SX, marginLeft: '-6px' } },
        }}
      >
        <MenuList>
          <MenuItem
            selected={isHorizontal}
            onClick={() => onViewModeChange('horizontal')}
            sx={{
              display: 'flex',
              backgroundColor: 'transparent',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <ListItemText>{t('sandbox.horizontal')}</ListItemText>
            <ListItemIcon sx={{ position: 'relative', right: -24, top: 0 }}>
              <HorizontalViewIcon />
            </ListItemIcon>
          </MenuItem>
          <MenuItem
            selected={!isHorizontal}
            onClick={() => onViewModeChange('vertical')}
            sx={{
              display: 'flex',
              backgroundColor: 'transparent',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <ListItemText>{t('sandbox.vertical')}</ListItemText>
            <ListItemIcon sx={{ position: 'relative', right: -24, top: 0 }}>
              <VerticalViewIcon />
            </ListItemIcon>
          </MenuItem>
        </MenuList>
      </CustomPopover>

      {/* Interface Scale Submenu */}
      <CustomPopover
        open={!!scaleAnchor}
        anchorEl={scaleAnchor}
        onClose={() => onScaleAnchorChange(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          arrow: { hide: true },
          paper: { sx: { ...DARK_POPOVER_PAPER_SX, marginLeft: '-6px' } },
        }}
      >
        <MenuList>
          {SCALE_OPTIONS.map((option) => (
            <MenuItem
              key={option.key}
              selected={interfaceScale === option.value}
              onClick={() => onScaleChange(option.value)}
              sx={{ backgroundColor: 'transparent' }}
            >
              <ListItemText>
                {option.key === 'current' ? `${option.value}%` : t(`sandbox.${option.key}`)}
              </ListItemText>
            </MenuItem>
          ))}
        </MenuList>
      </CustomPopover>
    </>
  );
}
