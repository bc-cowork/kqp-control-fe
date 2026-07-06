'use client';

import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';

import { signInWithPassword } from 'src/auth/context/jwt';

import { T } from 'src/theme/tokens';

import { useAuthContext } from '../../hooks';

// ----------------------------------------------------------------------

export type SignInSchemaType = zod.infer<typeof SignInSchema>;

export const SignInSchema = zod.object({
  email: zod.string().min(1, { message: 'ID is required!' }),
  password: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .min(6, { message: 'Password must be at least 6 characters!' }),
});

// ----------------------------------------------------------------------

const inputBase = {
  width: '100%',
  height: 48,
  bgcolor: T.bgCard,
  border: `1px solid ${T.border}`,
  borderRadius: '8px',
  px: 1.75,
  color: T.textPrim,
  fontSize: 15,
  fontFamily: 'inherit',
  outline: 'none',
  transition: 'border-color .15s',
  '&:focus': { borderColor: T.primaryMuted },
  '&::placeholder': { color: T.textFaint },
};

export function JwtSignInView() {
  const router = useRouter();
  const { checkUserSession } = useAuthContext();

  const [errorMsg, setErrorMsg] = useState('');
  const password = useBoolean();

  const methods = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: { email: 'billycrew', password: 'billycrew' },
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signInWithPassword({ id: data.email, password: data.password });
      await checkUserSession?.();
      router.push(paths.dashboard.root);
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : (error as Error).message);
    }
  });

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        bgcolor: T.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <Box sx={{ position: 'absolute', top: 24, left: 28 }}>
        <Logo isSingle={false} isWhite width={110} height={24} disableLink />
      </Box>

      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{
          width: 380,
          bgcolor: T.bgPanel,
          border: `1px solid ${T.borderSub}`,
          borderRadius: '20px',
          p: '40px 36px',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
          animation: 'fadeUp .35s ease both',
        }}
      >
        <Box component="h1" sx={{ fontSize: 18, fontWeight: 600, color: T.textPrim, m: 0 }}>
          Sign in to your account
        </Box>

        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box component="label" sx={{ fontSize: 13, color: T.textDim }}>
              ID
            </Box>
            <Box component="input" placeholder="billycrew" autoComplete="username" {...register('email')} sx={inputBase} />
            {errors.email && (
              <Box sx={{ fontSize: 12, color: T.off }}>{errors.email.message}</Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box component="label" sx={{ fontSize: 13, color: T.textDim }}>
              Password
            </Box>
            <Box sx={{ position: 'relative' }}>
              <Box
                component="input"
                type={password.value ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                {...register('password')}
                sx={{ ...inputBase, pr: 5.5 }}
              />
              <Box
                onClick={password.onToggle}
                sx={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: T.textDim,
                  cursor: 'pointer',
                  display: 'flex',
                }}
              >
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} width={18} />
              </Box>
            </Box>
            {errors.password && (
              <Box sx={{ fontSize: 12, color: T.off }}>{errors.password.message}</Box>
            )}
          </Box>
        </Box>

        <Box
          component="button"
          type="submit"
          disabled={isSubmitting}
          sx={{
            width: '100%',
            height: 48,
            mt: 1,
            bgcolor: T.primary,
            color: T.onFill,
            border: 'none',
            borderRadius: '8px',
            fontSize: 15,
            fontWeight: 700,
            fontFamily: 'inherit',
            cursor: 'pointer',
            transition: 'background .15s',
            '&:hover': { bgcolor: T.primaryHov },
            '&:disabled': { opacity: 0.7, cursor: 'default' },
          }}
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Box>
      </Box>
    </Box>
  );
}
