'use client';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { signOut } from 'src/auth/context/jwt/action';
import { useAuthContext } from 'src/auth/hooks';

import { KIcon } from 'src/components/k-icons';

import type { KIconName } from 'src/components/k-icons';

import { T } from 'src/theme/tokens';

// ----------------------------------------------------------------------

function useClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      let h = d.getHours();
      const m = d.getMinutes().toString().padStart(2, '0');
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      setTime(`${h.toString().padStart(2, '0')}:${m} ${ampm}`);
    };
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

// ----------------------------------------------------------------------

export function HeaderV5() {
  const router = useRouter();
  const clock = useClock();
  const { onChangeLang, currentLang } = useTranslate();
  const { user, checkUserSession } = useAuthContext();

  const [userAnchor, setUserAnchor] = useState<HTMLElement | null>(null);
  const [bellAnchor, setBellAnchor] = useState<HTMLElement | null>(null);

  const displayName = (user?.displayName ||
    user?.name ||
    user?.email?.split('@')[0] ||
    user?.id ||
    user?.user?.id ||
    'User') as string;
  const teamName = (user?.role || user?.user?.role || user?.team || 'Team') as string;
  const initials = displayName
    .split(' ')
    .map((s: string) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const isKo = currentLang?.value === 'ko';

  const handleLogout = useCallback(async () => {
    try {
      setUserAnchor(null);
      await signOut();
      await checkUserSession?.();
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }, [checkUserSession, router]);

  return (
    <Box
      sx={{
        height: 52,
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        zIndex: 'var(--layout-header-zIndex)',
        bgcolor: T.bgPanel,
        borderBottom: `1px solid ${T.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
      }}
    >
      {/* Nav arrows */}
      <Stack direction="row" spacing="2px">
        <ArrowBtn icon="back" onClick={() => router.back()} />
        <ArrowBtn icon="fwd" onClick={() => router.forward()} />
      </Stack>

      {/* Search */}
      <Box
        sx={{
          flex: 1,
          maxWidth: 320,
          height: 36,
          bgcolor: T.bgCard,
          border: `1px solid ${T.border}`,
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 1.25,
        }}
      >
        <Box sx={{ color: T.textDim, display: 'flex', flexShrink: 0 }}>
          <KIcon name="search" size={16} />
        </Box>
        <Box
          component="input"
          placeholder={isKo ? '노드 검색, 페이지 이동 ...' : 'Search nodes, pages ...'}
          sx={{
            flex: 1,
            border: 'none',
            outline: 'none',
            bgcolor: 'transparent',
            color: T.textPrim,
            fontSize: 15,
            fontFamily: 'inherit',
            '&::placeholder': { color: T.textFaint },
          }}
        />
        <Box
          sx={{
            width: 22,
            height: 22,
            borderRadius: '3px',
            bgcolor: T.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Box sx={{ color: '#fff', display: 'flex' }}>
            <KIcon name="arrowRight" size={12} />
          </Box>
        </Box>
      </Box>

      <Box sx={{ flex: 1 }} />

      {/* Meta cluster */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ color: T.textSec, fontSize: 14 }}>
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <KIcon name="monitor" size={13} />
          <span>{isKo ? '로컬' : 'Local'}</span>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: T.on }} />
          <span>{isKo ? '본사' : 'HQ'}</span>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <KIcon name="clock" size={13} />
          <span>{clock}</span>
        </Stack>
      </Stack>

      {/* Locale toggle */}
      <Box
        onClick={() => onChangeLang(isKo ? 'en' : 'ko')}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          px: 0.75,
          py: 0.5,
          borderRadius: '4px',
          color: T.textSec,
          fontSize: 14,
          cursor: 'pointer',
          '&:hover': { bgcolor: T.bgHover, color: T.textPrim },
        }}
      >
        <KIcon name="globe" size={13} />
        {isKo ? 'KOR' : 'ENG'}
      </Box>

      {/* Notifications */}
      <Box
        onClick={(e) => setBellAnchor(e.currentTarget)}
        sx={{
          width: 30,
          height: 30,
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: T.textSec,
          cursor: 'pointer',
          '&:hover': { bgcolor: T.bgHover, color: T.textPrim },
        }}
      >
        <KIcon name="bell" size={15} />
      </Box>

      {/* User chip */}
      <Box
        onClick={(e) => setUserAnchor(e.currentTarget)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 1.25,
          py: 0.5,
          borderRadius: '4px',
          cursor: 'pointer',
          '&:hover': { bgcolor: T.bgHover },
        }}
      >
        <Box
          sx={{
            width: 26,
            height: 26,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${T.primary}, ${T.primary})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 500,
            color: T.onFill,
          }}
        >
          {initials}
        </Box>
        <Box sx={{ lineHeight: 1.2 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: T.textPrim, lineHeight: 1.2 }}>
            {displayName}
          </Typography>
          <Typography sx={{ fontSize: 12, color: T.textSec, lineHeight: 1.2 }}>{teamName}</Typography>
        </Box>
        <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: T.on }} />
      </Box>

      {/* Bell popover — no fabricated notifications */}
      <Popover
        open={!!bellAnchor}
        anchorEl={bellAnchor}
        onClose={() => setBellAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { mt: 1, width: 300, bgcolor: T.bgCard, border: `1px solid ${T.border}`, borderRadius: '8px', boxShadow: '0 12px 32px rgba(0,0,0,0.45)' } } }}
      >
        <Box sx={{ px: 1.75, py: 1.5, borderBottom: `1px solid ${T.borderSub}` }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: T.textPrim }}>Notifications</Typography>
        </Box>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography sx={{ fontSize: 14, color: T.textSec }}>No notifications</Typography>
        </Box>
      </Popover>

      {/* User menu popover */}
      <Popover
        open={!!userAnchor}
        anchorEl={userAnchor}
        onClose={() => setUserAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { mt: 0.75, minWidth: 180, bgcolor: T.bgCard, border: `1px solid ${T.border}`, borderRadius: '8px', boxShadow: '0 12px 32px rgba(0,0,0,0.45)', p: 0.75 } } }}
      >
        <Box sx={{ px: 1.25, py: 1, borderBottom: `1px solid ${T.borderSub}`, mb: 0.5 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: T.textPrim }}>{displayName}</Typography>
          <Typography sx={{ fontSize: 12, color: T.textSec }}>{teamName}</Typography>
        </Box>
        <MenuRow
          icon="settings"
          label="Settings"
          onClick={() => {
            setUserAnchor(null);
            router.push('/dashboard/settings');
          }}
        />
        <MenuRow icon="logout" label={isKo ? '로그아웃' : 'Logout'} danger onClick={handleLogout} />
      </Popover>
    </Box>
  );
}

// ----------------------------------------------------------------------

function ArrowBtn({ icon, onClick }: { icon: KIconName; onClick: () => void }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        width: 26,
        height: 26,
        border: `1px solid ${T.border}`,
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: T.textSec,
        cursor: 'pointer',
        '&:hover': { bgcolor: T.bgHover, color: T.textPrim },
      }}
    >
      <KIcon name={icon} size={13} />
    </Box>
  );
}

function MenuRow({ icon, label, danger, onClick }: { icon: KIconName; label: string; danger?: boolean; onClick: () => void }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        px: 1.25,
        py: 1,
        borderRadius: '6px',
        fontSize: 14,
        color: danger ? T.off : T.textSec,
        cursor: 'pointer',
        '&:hover': { bgcolor: danger ? T.offBg : T.bgHover, color: danger ? T.off : T.textPrim },
      }}
    >
      <KIcon name={icon} size={15} />
      {label}
    </Box>
  );
}
