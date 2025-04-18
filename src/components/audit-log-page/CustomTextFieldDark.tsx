import { Box, SvgIcon, TextField, IconButton, InputAdornment } from '@mui/material';

import { grey, primary } from 'src/theme/core';

type CustomTextFieldProps = {
  label: string;
  value: any;
  setValue: (value: any) => void;
} & React.ComponentProps<typeof TextField>;

export const CustomTextFieldDark = ({ label, value, setValue, ...other }: CustomTextFieldProps) => {
  const displayValue = value ?? '';

  const handleClear = () => {
    setValue(undefined);
  };

  return (
    <TextField
      value={displayValue}
      onChange={(e) => setValue(e.target.value || undefined)}
      sx={{
        width: '100%',
        // Root input container
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
          backgroundColor: '#fff !important',
          padding: '0 8px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
        },
        // Input text styling
        '& .MuiInputBase-input': {
          padding: '8px 0',
          fontSize: '15px',
          color: grey[400],
          textAlign: 'left',
        },
      }}
      InputProps={{
        // Custom start adornment for "Count" label and divider
        startAdornment: (
          <InputAdornment position="start" sx={{ marginRight: 0 }}>
            <Box
              component="span"
              sx={{
                fontSize: '15px',
                color: grey[400],
                marginRight: '8px',
              }}
            >
              {label}
            </Box>
            <Box
              component="div"
              sx={{
                width: '1px',
                height: '12px',
                backgroundColor: grey[500],
                marginRight: '8px',
              }}
            />
          </InputAdornment>
        ),
        // Custom end adornment for the clear button
        endAdornment: value && (
          <InputAdornment position="end">
            <IconButton
              onClick={handleClear}
              sx={{
                padding: '4px',
              }}
            >
              <SvgIcon width={20} height={20}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="18.334"
                    y="1.66797"
                    width="16.6667"
                    height="16.6667"
                    rx="8.33333"
                    transform="rotate(90 18.334 1.66797)"
                    fill={grey[500]}
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.72108 5.7812C6.46073 5.52085 6.03862 5.52085 5.77827 5.7812C5.51792 6.04155 5.51792 6.46366 5.77827 6.72401L9.05752 10.0033L5.77957 13.2812C5.51922 13.5415 5.51922 13.9637 5.77957 14.224C6.03992 14.4844 6.46203 14.4844 6.72238 14.224L10.0003 10.9461L13.2783 14.224C13.5386 14.4844 13.9607 14.4844 14.2211 14.224C14.4814 13.9637 14.4814 13.5415 14.2211 13.2812L10.9431 10.0033L14.2224 6.72401C14.4827 6.46366 14.4827 6.04155 14.2224 5.7812C13.962 5.52085 13.5399 5.52085 13.2796 5.7812L10.0003 9.06045L6.72108 5.7812Z"
                    fill={primary.darker}
                  />
                </svg>
              </SvgIcon>
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...other}
    />
  );
};
