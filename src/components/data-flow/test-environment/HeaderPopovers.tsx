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
  '& .MuiMenuItem-root': { color: '#E0E4EB' },
  '& .MuiMenuItem-root:hover': { bgcolor: '#2A3344' },
  '& .MuiListItemIcon-root': { color: '#AFB7C8', minWidth: 28 },
  '& .MuiListItemText-primary': { fontSize: 12 },
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
              <Iconify icon="solar:monitor-outline" width={18} />
            </ListItemIcon>
            <ListItemText sx={{ flex: 'none' }}>{t('sandbox.view_screen')}</ListItemText>
            <Iconify icon="eva:chevron-right-fill" width={16} sx={{ ml: 'auto', color: '#AFB7C8' }} />
          </MenuItem>

          <MenuItem
            onClick={(e) => {
              onScaleAnchorChange(e.currentTarget);
              onViewScreenAnchorChange(null);
            }}
            sx={{ backgroundColor: 'transparent' }}
          >
            <ListItemIcon>
              <Iconify icon="solar:magnifer-outline" width={18} />
            </ListItemIcon>
            <ListItemText sx={{ flex: 'none' }}>{t('sandbox.interface_scale')}</ListItemText>
            <Iconify icon="eva:chevron-right-fill" width={16} sx={{ ml: 'auto', color: '#AFB7C8' }} />
          </MenuItem>

          <MenuItem onClick={onToggleFullscreen} sx={{ backgroundColor: 'transparent' }}>
            <ListItemIcon>
              <Iconify
                icon={
                  isFullscreen
                    ? 'solar:quit-full-screen-square-outline'
                    : 'solar:full-screen-square-outline'
                }
                width={18}
              />
            </ListItemIcon>
            <ListItemText>
              {t(isFullscreen ? 'sandbox.exit_fullscreen' : 'sandbox.enter_fullscreen')}
            </ListItemText>
          </MenuItem>

          <MenuItem onClick={onExit} sx={{ backgroundColor: 'transparent' }}>
            <ListItemIcon>
              <Iconify icon="solar:logout-2-outline" width={18} />
            </ListItemIcon>
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
