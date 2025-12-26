'use client';

import React, { useRef, useState } from 'react';

import { Box, Grid, Stack, Button, Popover, SvgIcon, Typography, useTheme } from '@mui/material';

import { useTranslate } from 'src/locales';
import { grey, primary } from 'src/theme/core';

import ArrowSelector from '../audit-log-page/ArrowSelector';
import { CustomTextField } from '../audit-log-page/CustomTextField';

export type Filter = {
  [key: string]: string | boolean;
};

type AddFilterProps = {
  page: 'Memory' | 'Audit Frame List' | 'Audit Frame';
  filters: Filter | null;
  setFilters: React.Dispatch<React.SetStateAction<Filter | null>>;
  onApply: (filters: Filter) => void;
  onCodeEnter?: (code?: string | boolean) => void;
  count?: number;
  popoverWidth?: string;
  onResetClick?: () => void;
  onRemovePillClick?: (key: string) => void;
};

const AddFilter: React.FC<AddFilterProps> = ({
  page,
  filters,
  setFilters,
  onApply,
  onCodeEnter,
  count,
  popoverWidth,
  onResetClick,
  onRemovePillClick,
}) => {
  const { t } = useTranslate('memory');
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const theme = useTheme();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleApply = () => {
    if (filters) {
      onApply(filters);
    }
    handleClose();
  };

  const handleReset = () => {
    setFilters(null);
    onResetClick?.();
    handleClose();
  };

  const handleRemoveFilter = (key: string) => () => {
    setFilters((prev) => {
      if (!prev) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
    onRemovePillClick?.(key);
  };

  const onEnter = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onCodeEnter?.(filters?.code);
      handleClose();
    }
  };

  // Render the appropriate filter component based on page
  const renderFilterInputs = () => {
    switch (page) {
      case 'Audit Frame':
        return <AuditFrameFilters filters={filters} setFilters={setFilters} />;
      case 'Audit Frame List':
        return <AuditFrameListFilters filters={filters} setFilters={setFilters} />;
      case 'Memory':
        return <MemoryFilters filters={filters} setFilters={setFilters} onEnterPress={onEnter} />;
      default:
        return null;
    }
  };

  const fillColor = theme.palette.mode === 'dark' ? grey[50] : '#667085'

  return (
    <Box
      sx={{
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px',
        backgroundColor: theme.palette.mode === 'dark' ? "#212447" : '#EFF6FF',
        border: theme.palette.mode === 'dark' ? "1px solid #212447" : '1px solid #DFEAFF',
        p: 1,
        pt: 1.5,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Button
            variant="outlined"
            onClick={handleOpen}
            ref={buttonRef}
            sx={{
              mr: 1,
              textTransform: 'none',
              borderRadius: '4px',
              fontWeight: 400,
              borderColor: theme.palette.mode === 'dark' ? '#4E576A' : '#E0E4EB',
              color: theme.palette.mode === 'dark' ? grey[300] : "#667085",
              backgroundColor: theme.palette.mode === 'dark' ? "#202838" : "white",
              fontSize: 15,
              height: '32px',
            }}
            endIcon={
              <SvgIcon sx={{ height: 16, width: 16 }}>
                {open ? (
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12.3924 9.91012C12.5892 9.73296 12.6052 9.42976 12.428 9.2329L8.11271 4.43757C8.02178 4.33652 7.89222 4.27882 7.75628 4.27881C7.62033 4.27881 7.49077 4.33651 7.39983 4.43755L3.08404 9.23288C2.90687 9.42973 2.92283 9.73293 3.11968 9.9101C3.31654 10.0873 3.61974 10.0713 3.79691 9.87446L7.75624 5.47519L11.7151 9.87444C11.8923 10.0713 12.1955 10.0873 12.3924 9.91012Z"
                      fill={(grey[50] as string)}
                    />
                  </svg>
                ) : (
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
                      d="M13.1566 5.60174C13.3755 5.79877 13.3933 6.13599 13.1963 6.35494L8.39677 11.6883C8.29563 11.8007 8.15154 11.8648 8.00034 11.8648C7.84915 11.8649 7.70505 11.8007 7.60391 11.6883L2.80391 6.35496C2.60686 6.13602 2.62461 5.7988 2.84355 5.60176C3.06249 5.40471 3.39971 5.42246 3.59675 5.6414L8.00031 10.5342L12.4034 5.64142C12.6004 5.42247 12.9376 5.40471 13.1566 5.60174Z"
                      fill={fillColor}
                    />
                  </svg>
                )}
              </SvgIcon>
            }
          >
            {t('search_ui.add_filter')}
          </Button>
          {filters &&
            Object.entries(filters)
              .filter(([, value]) => value !== '' && value !== false) // Only show non-empty/non-false filters
              .map(([key, value]) => (
                <Button
                  key={key}
                  variant="outlined"
                  size="small"
                  sx={{
                    height: '32px',
                    borderRadius: '4px',
                    textTransform: 'none',
                    color: primary.main,
                    borderColor: '#DFEAFF',
                    '&:hover': { backgroundColor: '#e3f2fd' },
                  }}
                  endIcon={
                    <SvgIcon sx={{ height: '16px', width: '16px', ml: -0.5 }}>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="14.666"
                          y="1.33203"
                          width="13.3333"
                          height="13.3333"
                          rx="6.66667"
                          transform="rotate(90 14.666 1.33203)"
                          fill="#6B89FF"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.37628 4.62105C5.168 4.41277 4.83031 4.41277 4.62203 4.62105C4.41375 4.82933 4.41375 5.16702 4.62203 5.3753L7.24543 7.9987L4.62307 10.6211C4.41479 10.8293 4.41479 11.167 4.62307 11.3753C4.83135 11.5836 5.16904 11.5836 5.37732 11.3753L7.99967 8.75295L10.622 11.3753C10.8303 11.5836 11.168 11.5836 11.3763 11.3753C11.5846 11.167 11.5846 10.8293 11.3763 10.6211L8.75392 7.9987L11.3773 5.3753C11.5856 5.16702 11.5856 4.82933 11.3773 4.62105C11.169 4.41277 10.8314 4.41277 10.6231 4.62105L7.99967 7.24445L5.37628 4.62105Z"
                          fill="#EFF7FF"
                        />
                      </svg>
                    </SvgIcon>
                  }
                  onClick={handleRemoveFilter(key)}
                >
                  <Box component="span" sx={{ fontWeight: 400 }}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                  </Box>
                  &nbsp; {value?.toString()}
                </Button>
              ))}
        </Box>
        <Stack direction="row" alignItems="center">
          {filters && (
            <Typography sx={{ fontSize: 15, color: grey[400] }}>Total: {count}</Typography>
          )}
          <Button
            sx={{
              ml: 1,
              textTransform: 'none',
              borderRadius: '4px',
              fontWeight: 400,
              fontSize: 15,
              border: `1px solid ${grey[200]}`,
              height: '32px',
              px: 1,
              borderColor: theme.palette.mode === 'dark' ? 'white' : '#E0E4EB',
              color: theme.palette.mode === 'dark' ? 'white' : "#667085",
              backgroundColor: theme.palette.mode === 'dark' ? "#373F4E" : "white",
            }}
            onClick={handleReset}
            size="small"
            startIcon={
              <SvgIcon sx={{ height: '16px', width: '16px' }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="14.666"
                    y="1.33203"
                    width="13.3333"
                    height="13.3333"
                    rx="6.66667"
                    transform="rotate(90 14.666 1.33203)"
                    fill="#D1D6E0"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.37628 4.62105C5.168 4.41277 4.83031 4.41277 4.62203 4.62105C4.41375 4.82933 4.41375 5.16702 4.62203 5.3753L7.24543 7.9987L4.62307 10.6211C4.41479 10.8293 4.41479 11.167 4.62307 11.3753C4.83135 11.5836 5.16904 11.5836 5.37732 11.3753L7.99967 8.75295L10.622 11.3753C10.8303 11.5836 11.168 11.5836 11.3763 11.3753C11.5846 11.167 11.5846 10.8293 11.3763 10.6211L8.75392 7.9987L11.3773 5.3753C11.5856 5.16702 11.5856 4.82933 11.3773 4.62105C11.169 4.41277 10.8314 4.41277 10.6231 4.62105L7.99967 7.24445L5.37628 4.62105Z"
                    fill="#373F4E"
                  />
                </svg>
              </SvgIcon>
            }
          >
            {t('search_ui.reset')}
          </Button>
        </Stack>
      </Stack>
      <Popover
        open={open}
        anchorEl={buttonRef.current}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            width: popoverWidth || '300px',
            p: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            borderRadius: '8px',
            mt: 1,
            backgroundImage: 'none',
            backgroundColor: '#212447',
          },
        }}
      >
        {renderFilterInputs()}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
          <Button
            sx={{
              mr: 1,
              textTransform: 'none',
              borderRadius: '4px',
              color: grey[100],
              fontWeight: 400,
              fontSize: 15,
              border: `1px solid ${grey[200]}`,
              backgroundColor: 'transparent',
              height: '32px',
              px: 1,
            }}
            onClick={handleReset}
            size="small"
            startIcon={
              <SvgIcon sx={{ height: '16px', width: '16px' }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="14.666"
                    y="1.33203"
                    width="13.3333"
                    height="13.3333"
                    rx="6.66667"
                    transform="rotate(90 14.666 1.33203)"
                    fill="#D1D6E0"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.37628 4.62105C5.168 4.41277 4.83031 4.41277 4.62203 4.62105C4.41375 4.82933 4.41375 5.16702 4.62203 5.3753L7.24543 7.9987L4.62307 10.6211C4.41479 10.8293 4.41479 11.167 4.62307 11.3753C4.83135 11.5836 5.16904 11.5836 5.37732 11.3753L7.99967 8.75295L10.622 11.3753C10.8303 11.5836 11.168 11.5836 11.3763 11.3753C11.5846 11.167 11.5846 10.8293 11.3763 10.6211L8.75392 7.9987L11.3773 5.3753C11.5856 5.16702 11.5856 4.82933 11.3773 4.62105C11.169 4.41277 10.8314 4.41277 10.6231 4.62105L7.99967 7.24445L5.37628 4.62105Z"
                    fill="#373F4E"
                  />
                </svg>
              </SvgIcon>
            }
          >
            {t('search_ui.reset')}
          </Button>
          <Button
            onClick={handleApply}
            variant="contained"
            size="small"
            sx={{ borderRadius: '4px', height: '32px' }}
          >
            {t('search_ui.search')}
          </Button>
        </Box>
      </Popover>
    </Box>
  );
};

// Sub-component for Audit Frame filters
type FilterProps = {
  filters: Filter | null;
  setFilters: React.Dispatch<React.SetStateAction<Filter | null>>;
  // eslint-disable-next-line react/no-unused-prop-types
  onEnterPress?: (event: React.KeyboardEvent) => void;
};

const AuditFrameFilters: React.FC<FilterProps> = ({ filters, setFilters }) => {
  const handleInputChange = (key: string, value: string | boolean) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <>
      {/* <Box sx={{ mt: 1 }}>
        <Typography sx={{ fontSize: 15, color: grey[400] }}>Time</Typography>
        <TextField
          value={filters?.time || ''}
          onChange={(e) => handleInputChange('time', e.target.value)}
          fullWidth
          size="small"
          sx={{ mt: 0.5 }}
        />
      </Box>
      <Box sx={{ mt: 1 }}>
        <Typography sx={{ fontSize: 15, color: grey[400] }}>Frame Seq</Typography>
        <CustomTextField
          label="Frame seq"
          value={filters?.frameSeq || ''}
          setValue={(e) => handleInputChange('seq', e)}
        />
      </Box> */}
      <Box sx={{ mt: 1 }}>
        <Typography sx={{ fontSize: 15, color: grey[400] }}>Cond / Count / Scan</Typography>

        <CustomTextField
          value={filters?.cond || ''}
          setValue={(e) => handleInputChange('cond', e)}
          label="Cond"
          sx={{ mb: 0.5, width: '100%' }}
        />

        <Grid container>
          <Grid md={8} sx={{ pr: 0.5 }}>
            <CustomTextField
              value={filters?.count || ''}
              setValue={(e) => handleInputChange('count', e)}
              label="Count"
              type="number"
            />
          </Grid>
          <Grid md={4}>
            <ArrowSelector
              value={filters?.side || 'next'}
              setValue={(e) => handleInputChange('side', e)}
              label="Scan"
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

// Sub-component for Audit Frame List filters
const AuditFrameListFilters: React.FC<FilterProps> = ({ filters, setFilters }) => {
  const handleInputChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <>
      <Box sx={{ mt: 1 }}>
        <Typography sx={{ fontSize: 15, color: grey[400] }}>TBD</Typography>
        {/* <TextField
          value={filters?.time || ''}
          onChange={(e) => handleInputChange('time', e.target.value)}
          fullWidth
          size="small"
          sx={{ mt: 0.5 }}
        /> */}
      </Box>
      {/* <Box sx={{ mt: 1 }}>
        <Typography sx={{ fontSize: 15, color: grey[400] }}>Frame Seq</Typography>
        <TextField
          value={filters?.frameSeq || ''}
          onChange={(e) => handleInputChange('frameSeq', e.target.value)}
          fullWidth
          size="small"
          sx={{ mt: 0.5 }}
        />
      </Box> */}
    </>
  );
};

// Sub-component for Memory filters
const MemoryFilters: React.FC<FilterProps> = ({ filters, setFilters, onEnterPress }) => {
  const { t } = useTranslate('memory');
  const handleInputChange = (key: string, value: string | boolean) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Box>
      <Typography sx={{ fontSize: 15, color: grey[400] }}>{t('search_ui.code')}</Typography>
      <CustomTextField
        label={t('search_ui.code')}
        value={filters?.code || ''}
        setValue={(e) => handleInputChange('code', e)}
        onKeyDown={onEnterPress}
      />
    </Box>
  );
};

export default AddFilter;
