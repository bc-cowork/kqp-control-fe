import React from 'react';
import {
    Box,
    Typography,
    Select,
    MenuItem,
    FormControl,
    useTheme,
    useColorScheme,
} from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';
import { grey } from 'src/theme/core';
import { useTranslate } from 'src/locales';

export const DisplaySettings = () => {
    const theme = useTheme();
    const { t } = useTranslate('settings');
    const { mode, setMode } = useColorScheme();


    const handleChange = (event: any) => {
        setMode(event.target.value)
    };

    return (
        <Box
            sx={{
                width: '60%',
                height: '100%',
                p: 1.5,
                alignSelf: 'center',
                bgcolor: theme.palette.mode === 'dark' ? '#202838' : 'background.paper',
                borderRadius: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: 32,
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        color: theme.palette.mode === 'dark' ? '#B3B3B3' : 'text.primary',
                        fontWeight: 500,
                        fontSize: 24,
                        lineHeight: '32px',
                    }}
                >
                    Display
                </Typography>
            </Box>

            <Box
                sx={{
                    px: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        height: 32,
                    }}
                >
                    <Typography
                        sx={{
                            color: theme.palette.mode === 'dark' ? '#B3B3B3' : 'text.primary',
                            fontSize: 15,
                            fontWeight: 400,
                            lineHeight: '22.5px',
                        }}
                    >
                        {t('screen_mode')}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        minWidth: 116,
                        minHeight: 32,
                        p: 1.5,
                        bgcolor: 'transparent',
                        borderRadius: 1,
                        border: theme.palette.mode === 'dark' ? '0.1px solid #000000' : '0.2px solid #E0E4EB',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    <Typography
                        sx={{
                            flex: 1,
                            color: (theme) => theme.palette.mode === 'dark' ? '#D1D6E0' : '#667085',
                            fontSize: 15,
                            fontWeight: 400,
                            lineHeight: '22.5px',
                        }}
                    >

                        {t('dark_light')}
                    </Typography>

                    <FormControl sx={{ minWidth: 116 }}>
                        <Select
                            value={mode}
                            onChange={handleChange}
                            displayEmpty
                            IconComponent={KeyboardArrowDown}
                            sx={{
                                height: 44,
                                fontSize: 17,
                                lineHeight: '25.5px',
                                bgcolor: (theme) => theme.palette.mode === 'dark' ? '#202838' : 'white',
                                color: (theme) => theme.palette.mode === 'dark' ? 'white' : 'green',

                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: (theme) => theme.palette.mode === 'dark' ? "#4E576A !important" : '#E0E4EB !important', // Keep it the same as the default border color
                                    borderWidth: "1px",
                                },

                                "& .MuiSelect-select:focus": {
                                    outline: "none",
                                    border: 'none'
                                },

                                "& .MuiSelect-select": {
                                    backgroundColor: "transparent !important",
                                    color: (theme) => theme.palette.mode === 'dark' ? '#D1D6E0' : '#667085',
                                    padding: "4px 8px",
                                },
                                "& fieldset": {
                                    borderColor: (theme) => theme.palette.mode === 'dark' ? "#4E576A !important" : '#E0E4EB !important',
                                },
                                "&:hover fieldset": {
                                    borderColor: (theme) => theme.palette.mode === 'dark' ? "#4E576A !important" : `#E0E4EB !important`, // Force hover color
                                },
                            }}
                        >
                            <MenuItem
                                sx={{
                                    backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#202838' : 'white',
                                    ":hover": {
                                        backgroundColor: (theme) => theme.palette.mode === 'dark' ? grey[400] : '#E0E4EB',
                                    },
                                }}

                                value="dark">{t('dark')}</MenuItem>
                            <MenuItem
                                sx={{
                                    backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#202838' : 'white',
                                    ":hover": {
                                        backgroundColor: (theme) => theme.palette.mode === 'dark' ? grey[400] : '#E0E4EB',
                                    },
                                }}
                                value="light">{t('light')}</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>
        </Box>
    );
}