'use client';

import type { LanguageValue } from 'src/locales';

import React from 'react';
import NextLink from 'next/link';

import { Box, Link, Stack, Button, SvgIcon, Typography, IconButton } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { grey, common } from 'src/theme/core';
import { EnFlagIcon } from 'src/assets/icons/en-flag-icon';
import { KoFlagIcon } from 'src/assets/icons/ko-flag-icon';

// ----------------------------------------------------------------------

type Page = {
  pageName: string;
  link?: string; // Optional link property
};

type Props = {
  node?: string;
  pages?: Page[];
};

export function Breadcrumb({ node, pages }: Props) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Stack direction="row" alignItems="center">
        <ArrowSelector />
        {node && (
          <Box
            sx={{
              backgroundColor: '#212447',
              px: 1,
              borderRadius: '4px',
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              ml: 1,
            }}
          >
            <Typography
              display="inline"
              sx={{
                fontSize: 17,
                color: (theme) => theme.palette.common.white,
              }}
            >
              {node}
            </Typography>
          </Box>
        )}

        {/* Pages array */}
        {pages &&
          pages.map((page, index) => {
            const isLast = index === pages.length - 1;

            return (
              <Stack component="span" key={index} direction="row" alignItems="center">
                <SvgIcon sx={{ width: 16, height: 16, mx: 1 }}>
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
                      d="M5.6037 13.1563C5.80074 13.3752 6.13797 13.393 6.35691 13.1959L11.6902 8.39611C11.8026 8.29497 11.8668 8.15089 11.8668 7.99969C11.8668 7.8485 11.8026 7.70441 11.6903 7.60327L6.35693 2.80294C6.138 2.60589 5.80078 2.62363 5.60372 2.84256C5.40667 3.06149 5.42441 3.39871 5.64334 3.59577L10.5362 7.99966L5.64336 12.4031C5.42442 12.6001 5.40666 12.9373 5.6037 13.1563Z"
                      fill="#667085"
                    />
                  </svg>
                </SvgIcon>
                {!isLast && page?.link ? (
                  <Link
                    component={NextLink}
                    href={page.link}
                    sx={{
                      color: (theme) => theme.palette.grey[50],
                      fontWeight: 400,
                      fontSize: 17,
                      textDecoration: 'none',
                      padding: '0px 4px',
                      borderRadius: '8px',
                      // height: '28px',
                      '&:hover': { backgroundColor: grey[600], textDecoration: 'none' },
                    }}
                  >
                    {page.pageName}
                  </Link>
                ) : (
                  <Typography
                    display="inline"
                    sx={{
                      color: (theme) => theme.palette.grey[50],
                      fontWeight: 400,
                      fontSize: 17,
                      padding: '0px 4px',
                    }}
                  >
                    {page.pageName}
                  </Typography>
                )}
              </Stack>
            );
          })}
      </Stack>
      <LanguageToggle />
    </Stack>
  );
}

const ArrowSelector = () => {
  const router = useRouter();

  // Colors for different states
  const bgColors = {
    default: common.white,
    hover: grey[200],
    pressed: grey[300],
    selected: grey[400],
  };

  const colors = {
    default: grey[400],
    hover: grey[400],
    pressed: grey[400],
    selected: common.white,
  };

  const handlePrevClick = () => {
    router.back();
  };

  const handleNextClick = () => {
    router.forward();
  };

  return (
    <Box>
      {/* Left Arrow (Prev) */}
      <IconButton
        onClick={handlePrevClick}
        sx={{
          padding: '4px',
          width: 32,
          height: 32,
          borderRadius: '4px',
          mr: 0.5,
          color: (theme) => theme.palette.grey[50],
          backgroundColor: (theme) => theme.palette.grey[600],
          '&:hover': {
            color: colors.hover,
            backgroundColor: bgColors.hover,
          },
          '&:active': {
            color: colors.pressed,
            backgroundColor: bgColors.pressed,
          },
        }}
      >
        <SvgIcon sx={{ width: 16, height: 16 }}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1.66699 10.0013C1.66699 10.1826 1.74087 10.3562 1.87159 10.4819L6.20492 14.6485C6.47032 14.9037 6.89235 14.8954 7.14755 14.63C7.40274 14.3646 7.39447 13.9426 7.12907 13.6874L3.98884 10.668L17.6663 10.668C18.0345 10.668 18.333 10.3695 18.333 10.0013C18.333 9.63311 18.0345 9.33464 17.6663 9.33464L3.98884 9.33464L7.12907 6.31519C7.39447 6.06 7.40274 5.63797 7.14755 5.37256C6.89235 5.10716 6.47032 5.09889 6.20492 5.35408L1.87159 9.52075C1.74087 9.64644 1.66699 9.81996 1.66699 10.0013Z"
              fill={'white'}
            />
          </svg>
        </SvgIcon>
      </IconButton>

      {/* Right Arrow (Next) */}
      <IconButton
        onClick={handleNextClick}
        sx={{
          padding: '4px',
          width: 32,
          height: 32,
          borderRadius: '4px',
          color: colors.default,
          backgroundColor: (theme) => theme.palette.grey[600],
          '&:hover': {
            color: colors.hover,
            backgroundColor: bgColors.hover,
          },
          '&:active': {
            color: colors.pressed,
            backgroundColor: bgColors.pressed,
          },
        }}
      >
        <SvgIcon sx={{ width: 16, height: 16 }}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M18.333 10.0013C18.333 10.1826 18.2591 10.3562 18.1284 10.4819L13.7951 14.6485C13.5297 14.9037 13.1076 14.8954 12.8525 14.63C12.5973 14.3646 12.6055 13.9426 12.8709 13.6874L16.0112 10.668L2.33366 10.668C1.96547 10.668 1.66699 10.3695 1.66699 10.0013C1.66699 9.63311 1.96547 9.33464 2.33366 9.33464L16.0112 9.33464L12.8709 6.31519C12.6055 6.06 12.5973 5.63797 12.8525 5.37256C13.1076 5.10716 13.5297 5.09889 13.7951 5.35408L18.1284 9.52075C18.2591 9.64644 18.333 9.81996 18.333 10.0013Z"
              fill={'white'}
            />
          </svg>
        </SvgIcon>
      </IconButton>
    </Box>
  );
};

const LanguageToggle = () => {
  const { currentLang, onChangeLang } = useTranslate();

  const targetLang = currentLang?.value === 'en' ? 'ko' : 'en';
  const displayLabel = currentLang?.value === 'en' ? 'ENG' : 'KOR';

  const handleToggle = () => {
    onChangeLang(targetLang as LanguageValue);
  };

  return (
    <Button
      onClick={handleToggle}
      sx={{
        display: 'flex',
        alignItems: 'center',
        borderRadius: '4px',
        padding: '4px 8px',
        backgroundColor: (theme) => theme.palette.grey[800],
        border: (theme) => `1px solid ${theme.palette.grey[700]}`,
        '&:hover': {
          backgroundColor: grey[50],
          border: `1px solid ${grey[200]}`,
        },
        '&:active': {
          backgroundColor: grey[200],
        },
      }}
    >
      <SvgIcon
        sx={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '8px',
        }}
      >
        {displayLabel === 'ENG' ? <EnFlagIcon /> : <KoFlagIcon />}
      </SvgIcon>
      <Typography sx={{ fontSize: 15, fontWeight: 400, color: grey[50] }}>
        {displayLabel}
      </Typography>
    </Button>
  );
};
