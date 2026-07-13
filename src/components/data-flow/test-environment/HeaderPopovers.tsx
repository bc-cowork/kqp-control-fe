import type { UsePopoverReturn } from 'src/components/custom-popover';

import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { useTranslate } from 'src/locales';
import { T, ACCENT2 } from 'src/theme/tokens';

import { CustomPopover } from 'src/components/custom-popover';

import { VerticalViewIcon, HorizontalViewIcon } from './icons';

// ----------------------------------------------------------------------

type ViewMode = 'horizontal' | 'vertical';

const DARK_POPOVER_PAPER_SX = {
  bgcolor: T.bgPanel,
  border: `1px solid ${T.border}`,
  boxShadow: '0 12px 32px rgba(0,0,0,0.45)',
  '& .MuiMenuItem-root': {
    color: T.textSec,
    marginBottom: 1,
  },
  '& .MuiMenuItem-root:hover': { bgcolor: T.bgHover },
  // Scoped override of the app-wide solid-primary selected style: a subtle indigo
  // tint + bright-indigo text/icon, lighter on this dark popover. The already-
  // selected item gets no extra hover emphasis (it's already the current mode).
  '& .MuiMenuItem-root.Mui-selected': {
    backgroundColor: `${T.primary}26`,
    color: ACCENT2,
    '&:hover': { backgroundColor: `${T.primary}26` },
    '& .MuiListItemIcon-root': { color: ACCENT2 },
  },
  '& .MuiListItemIcon-root': { color: T.textSec, minWidth: 28 },
  '& .MuiListItemText-primary': { fontSize: 14, fontWeight: 400 },
};

// ----------------------------------------------------------------------

type HeaderPopoversProps = {
  viewMode: ViewMode;
  viewModePopover: UsePopoverReturn;
  onViewModeChange: (mode: ViewMode) => void;
};

// View-mode popover — opened by the "vertical view" control in the toolbar.
export function HeaderPopovers({
  viewMode,
  viewModePopover,
  onViewModeChange,
}: HeaderPopoversProps) {
  const { t } = useTranslate('data-flow');
  const isHorizontal = viewMode === 'horizontal';

  return (
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
  );
}
