'use client';

import type { SxProps } from '@mui/material';
import type { Theme } from 'src/theme/types';

import { Box, Stack } from '@mui/material';

import { T } from 'src/theme/tokens';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  page: number;
  count: number;
  rowsPerPage: number;
  onFirst: () => void;
  onLast: () => void;
  onPrev: () => void;
  onNext: () => void;
  firstDisabled?: boolean;
  lastDisabled?: boolean;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  sx?: SxProps<Theme>;
};

// System-standard arrow button (matches v5 `PagerArrow`).
function NavArrow({
  icon,
  disabled,
  onClick,
}: {
  icon: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <Box
      component="button"
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      sx={{
        width: 32,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        bgcolor: 'transparent',
        borderRadius: '4px',
        color: T.textSec,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'default' : 'pointer',
        '&:hover': disabled ? undefined : { bgcolor: T.bgHover, color: T.textPrim },
      }}
    >
      <Iconify icon={icon} width={16} />
    </Box>
  );
}

const TablePaginationCustomShort = ({
  page,
  count,
  rowsPerPage,
  onFirst,
  onLast,
  onPrev,
  onNext,
  firstDisabled = false,
  lastDisabled = false,
  prevDisabled = false,
  nextDisabled = false,
  sx,
}: Props) => {
  const lastPage = Math.ceil(count / rowsPerPage) - 1;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', ...sx }}>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <NavArrow
          icon="eva:arrowhead-left-fill"
          disabled={firstDisabled || page === 0}
          onClick={onFirst}
        />
        <NavArrow
          icon="eva:arrow-ios-back-fill"
          disabled={prevDisabled || page === 0}
          onClick={onPrev}
        />
        <NavArrow
          icon="eva:arrow-ios-forward-fill"
          disabled={nextDisabled || page >= lastPage}
          onClick={onNext}
        />
        <NavArrow
          icon="eva:arrowhead-right-fill"
          disabled={lastDisabled || page >= lastPage}
          onClick={onLast}
        />
      </Stack>
    </Box>
  );
};

export default TablePaginationCustomShort;
