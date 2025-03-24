import type { IconButtonProps } from '@mui/material/IconButton';

import SvgIcon from '@mui/material/SvgIcon';
import IconButton from '@mui/material/IconButton';

// ----------------------------------------------------------------------

export type NavToggleButtonProps = IconButtonProps & {
  isNavMini: boolean;
};

export function NavToggleButton({ isNavMini, sx, ...other }: NavToggleButtonProps) {
  return (
    <IconButton
      size="small"
      sx={{
        // p: 0.5,
        top: 42,
        position: 'fixed',
        color: 'action.active',
        bgcolor: (theme) => theme.palette.grey[500],
        transform: 'translateX(-50%)',
        zIndex: 'var(--layout-nav-zIndex)',
        left: isNavMini ? 'var(--layout-nav-mini-width)' : '230px',
        border: (theme) => `1px solid ${theme.palette.grey[400]}`,
        borderRadius: '8px',
        transition: (theme) =>
          theme.transitions.create(['left'], {
            easing: 'var(--layout-transition-easing)',
            duration: 'var(--layout-transition-duration)',
          }),
        '&:hover': {
          color: 'text.primary',
          bgcolor: 'background.neutral',
        },
        ...sx,
      }}
      {...other}
    >
      <SvgIcon
        sx={{
          width: 22,
          height: 22,
          p: 0.45,
        }}
      >
        {isNavMini ? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M14.8118 0.578125C15.18 0.578125 15.4785 0.876602 15.4785 1.24479V7.91146C15.4785 8.27965 15.18 8.57812 14.8118 8.57812C14.4437 8.57812 14.1452 8.27965 14.1452 7.91146V2.84041L2.60164 14.2432H7.81185C8.18004 14.2432 8.47852 14.5416 8.47852 14.9098C8.47852 15.278 8.18004 15.5765 7.81185 15.5765H1.14518C0.776992 15.5765 0.478516 15.278 0.478516 14.9098V8.24316C0.478516 7.87497 0.776992 7.5765 1.14518 7.5765C1.51337 7.5765 1.81185 7.87497 1.81185 8.24316V13.1492L13.1883 1.91146H8.14518C7.77699 1.91146 7.47852 1.61298 7.47852 1.24479C7.47852 0.876602 7.77699 0.578125 8.14518 0.578125H14.8118Z"
              fill="#F0F1F5"
            />
          </svg>
        ) : (
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.64572 8.74414C9.27753 8.74414 8.97906 8.44566 8.97906 8.07747L8.97906 1.41081C8.97906 1.04262 9.27753 0.744141 9.64572 0.744141C10.0139 0.744141 10.3124 1.04262 10.3124 1.41081L10.3124 6.48186L16.0366 1.10291C16.2986 0.844158 16.7207 0.846748 16.9794 1.10869C17.2382 1.37063 17.2356 1.79273 16.9737 2.05148L11.2693 7.41081L16.3124 7.41081C16.6806 7.41081 16.9791 7.70929 16.9791 8.07748C16.9791 8.44567 16.6806 8.74414 16.3124 8.74414L9.64572 8.74414ZM8.1716 9.0778C8.53979 9.0778 8.83827 9.37628 8.83827 9.74447L8.83827 16.4111C8.83827 16.7793 8.53979 17.0778 8.1716 17.0778C7.80341 17.0778 7.50493 16.7793 7.50493 16.4111L7.50493 11.3401L1.78068 16.719C1.51874 16.9778 1.09664 16.9752 0.837887 16.7133C0.579139 16.4513 0.581729 16.0292 0.843672 15.7705L6.54806 10.4111H1.50493C1.13675 10.4111 0.838268 10.1127 0.838268 9.74447C0.838268 9.37628 1.13675 9.0778 1.50493 9.0778L8.1716 9.0778Z"
              fill="#F0F1F5"
            />
          </svg>
        )}
      </SvgIcon>
      {/* <SvgColor src={isNavMini ? `${CONFIG.assetsDir}/assets/icons/navbar/nav-expand.svg` : `${CONFIG.assetsDir}/assets/icons/navbar/nav-collapse.svg`} /> */}
    </IconButton>
  );
}
