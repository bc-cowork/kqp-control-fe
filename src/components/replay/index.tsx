import {
    Box, Typography, FormControl, Select, MenuItem, TextField, IconButton, InputAdornment, Button,
} from "@mui/material";
import { DesktopTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {
    KeyboardArrowDown as SelectIcon,
    Cancel as CancelIcon,
    ArrowDropUp as ArrowUpwardIcon, ArrowDropDown as ArrowDownwardIcon,
    KeyboardArrowDownOutlined as KeyboardArrowDownIcon,
} from '@mui/icons-material';
import { useTranslate } from "src/locales";
import { LogTag } from "./Logtag";

export const darkColors = {
    backgroundScreen: '#161C25',
    tableFill1: '#202838',
    tableFill2: '#141C2A',
    headerFill: '#667085',
    textPrimary: '#F0F1F5',
    textSecondary: '#D1D6E0',
    buttonTertiary: '#373F4E',
    border: '#4E576A',
    badgeInfo: '#212447',
    successText: '#7EE081',
    successFill: '#1D2F20',
    dangerFill: '#331B1E',
    dangerTextDisabled: '#4A2C31',
    textDisabled: '#667085',
    black: '#0A0E15',
    gray0: '#202838',
    gray1: '#373F4E',
    gray5: '#D1D6E0',
};

const inputStyle = {
    height: 32,
    maxWidth: 94,
    px: 1,
    py: 0,
    backgroundColor: 'transparent',
    borderRadius: '4px',
    border: `1px solid ${darkColors.border}`,
    '&:hover': {
        border: `1px solid ${darkColors.border}`,
    },
};

export const SelectField = ({ label, value, onChange, options = [], setValue, placeholder, width = '94px' }: any) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ alignSelf: 'stretch', height: 32, display: 'flex', alignItems: 'center' }}>
            <Typography
                variant="body2"
                sx={{ color: '#D1D6E0', fontWeight: 400, lineHeight: '22.5px', fontSize: 15 }}
            >
                {label}
            </Typography>
        </Box>
        {
            value === '' ? (<FormControl size="small">
                <Select
                    value={value}
                    onChange={onChange}
                    IconComponent={SelectIcon}
                    displayEmpty
                    renderValue={(selected) => {
                        if (selected === '') {
                            return <span style={{ color: darkColors.textSecondary, fontSize: 15 }}>{`${placeholder} `}</span>;
                        }
                        return <span style={{ color: darkColors.textPrimary }}>{selected}</span>;
                    }}
                    sx={{
                        ...inputStyle,
                        maxWidth: `${width} !important`,
                        '& .MuiSelect-select': {
                            p: '4px 4px 4px 4px',
                            display: 'flex',
                            alignItems: 'center',
                            color: darkColors.textSecondary,
                            fontSize: 15,
                            textAlign: 'center',
                            backgroundColor: 'transparent !important',
                            ml: '-4px',
                        },
                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        '&.Mui-focused': {
                            border: '1px solid #E0E4EB !important',
                            textAlign: 'center',
                        },
                        '& .MuiSvgIcon-root': {
                            color: darkColors.textSecondary, fontSize: 16,
                        },
                    }}
                    inputProps={{ 'aria-label': `${label} select` }}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                backgroundColor: darkColors.tableFill1,
                                color: darkColors.textPrimary,
                                border: "1px solid #4E576A",
                            },
                        },
                    }}
                >
                    {/* ✨ END OF PLACEHOLDER */}
                    {options.map((option: any) => (
                        <MenuItem
                            key={option.key}
                            value={option.label}
                            sx={{
                                color: darkColors.textPrimary,
                                backgroundColor: 'transparent',
                                textAlign: 'center',
                                justifyContent: 'center',
                                '&:hover': { backgroundColor: '#5E66FF' },
                                '&.Mui-selected': {
                                    backgroundColor: darkColors.gray1,
                                    '&:hover': { backgroundColor: darkColors.buttonTertiary }
                                }
                            }}
                        >
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>) : (
                <LogTag text={value} onClose={
                    () => {
                        setValue('');
                    }
                } />
            )
        }
    </Box>
);
// ------------------------------------------


export const DateTimeMuiField = ({ label, type = 'time', value, onChange }: any) => {

    const placeholderValue = type === 'date' ? '0000-00-00' : '00:00:00';
    const minWidth = type === 'date' ? 120 : 110;
    const format = type === 'date' ? 'YYYY-MM-DD' : 'HH:mm:ss';
    const timeViews = ['hours', 'minutes', 'seconds'] as const;

    const customInputProps = {
        sx: {
            ...inputStyle,
            minWidth,
            maxWidth: minWidth,
            height: 32,
            color: darkColors.textSecondary,
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
            '& .MuiInputBase-input': {
                p: '4px 0px 4px 0px',
                display: 'flex',
                alignItems: 'center',
                fontSize: 15,
                backgroundColor: 'transparent !important',
                height: 'auto',
            },
            '&:hover': {
                border: `1px solid ${darkColors.border}`,
                color: '#7AA2FF !important',

            },
            '&.Mui-focused': {
                border: '1px solid #E0E4EB !important',
                color: '#7AA2FF !important',
            },
            '& .MuiSvgIcon-root': { color: darkColors.textSecondary, fontSize: 16 },
        },
    };

    const customPopperProps = {
        sx: {
            '& .MuiPaper-root': {
                backgroundColor: darkColors.tableFill1,
                color: darkColors.textPrimary,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
            },

            '& .MuiMultiSectionDigitalClock-root': {
                backgroundColor: darkColors.tableFill1,
                justifyContent: 'center',
                alignItems: 'center',



                '& .MuiDigitalClockSection-separator': {
                    color: darkColors.textPrimary,
                },

                '& .MuiButtonBase-root': {
                    color: darkColors.textPrimary,
                    backgroundColor: darkColors.gray1,
                    '&:hover': {
                        backgroundColor: darkColors.buttonTertiary,
                    },

                    '&.Mui-selected': {
                        backgroundColor: darkColors.badgeInfo,
                        color: 'white',
                    },
                },
            },

            '& .MuiDialogActions-root .MuiButton-root': {
                color: darkColors.textPrimary,
            },

            '& .MuiClock-root': {
                backgroundColor: darkColors.tableFill1,
            },
            '& .MuiCalendarPicker-root': {
                backgroundColor: darkColors.tableFill1,
            }
        },
    };

    // 2. Define the new component overrides
    const pickerSlots = {
        openPickerIcon: KeyboardArrowDownIcon,
    };

    // The slotProps for the button itself (re-used for both)
    const openPickerButtonSlotProps = {
        sx: {
            color: darkColors.textSecondary,
            '& .MuiSvgIcon-root': { fontSize: 16 }
        }
    };


    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }} >
            <Box sx={{ alignSelf: 'stretch', height: 32, display: 'flex', alignItems: 'center' }}>
                <Typography
                    variant="body2"
                    sx={{ color: '#D1D6E0', fontWeight: 400, lineHeight: '22.5px', fontSize: 15 }}
                >
                    {label}
                </Typography>
            </Box>

            {
                value ? (
                    <DesktopTimePicker
                        // FIX: Set closeOnSelect to false to prevent the popper from closing on value change
                        closeOnSelect
                        views={timeViews}
                        value={dayjs(value, format)}
                        format={format}
                        onChange={(newValue) => {
                            const formattedValue = newValue ? newValue.format(format) : placeholderValue;
                            onChange({ target: { value: formattedValue } });
                        }}
                        slots={pickerSlots}
                        slotProps={{
                            actionBar: {
                                actions: ['cancel', 'accept']
                            },
                            textField: {
                                size: "small",
                                placeholder: placeholderValue,
                                variant: "outlined",
                                InputProps: customInputProps,
                            },
                            popper: customPopperProps,
                            openPickerButton: openPickerButtonSlotProps
                        }}
                    />
                ) : (
                    <LogTag text={value} onClose={
                        () => {
                            onChange({ target: { value: placeholderValue } });
                        }
                    } />
                )
            }
        </Box >
    );
};

export const WideTextField = ({ label, value, onClick, onClose }: any) => {
    // Show the 'All' button when value is empty or explicitly 'All'.
    // Otherwise display the selected value as a removable tag.
    const showAllButton = value === '' || value === 'All';

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ alignSelf: 'stretch', height: 32, display: 'flex', alignItems: 'center' }}>
                <Typography
                    variant="body2"
                    sx={{ color: '#D1D6E0', fontWeight: 400, lineHeight: '22.5px', fontSize: 15 }}
                >
                    {label}
                </Typography>
            </Box>
            {
                showAllButton ? (
                    <Button
                        onClick={onClick}
                        endIcon={
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                lineHeight: 0,
                                padding: 0,
                                height: 20,
                                justifyContent: 'center',
                            }}>
                                <ArrowUpwardIcon sx={{
                                    color: '#7AA2FF',
                                    width: 18,
                                    height: 18,

                                }} />
                                <ArrowDownwardIcon sx={{ color: '#7AA2FF', height: 18, width: 18, marginTop: '-10px' }} />
                            </Box>
                        }
                        sx={{
                            height: 32,
                            width: 'fit-content',
                            padding: '4px 12px',
                            backgroundColor: '#212447',
                            color: '#7AA2FF',
                            border: '1px solid #1D2654',
                            fontSize: 15,
                            fontWeight: 400,
                            lineHeight: '22.50px',
                            textTransform: 'none',
                            borderRadius: '4px',
                            boxShadow: 'none',
                            '&:hover': {
                                backgroundColor: '#212447',
                                boxShadow: 'none',
                            },
                            '& .MuiButton-endIcon': {
                                marginLeft: '4px',
                                marginRight: '-4px',
                            }
                        }}
                    >
                        All
                    </Button>

                ) : (
                    <LogTag text={value} onClose={onClose} />
                )
            }

        </Box >
    )
};

export const CustomTextField = ({ toolPid, setToolPid }: any) => {

    const { t } = useTranslate('replay')
    // Function to handle clearing the toolPid value
    const handleClearToolPid = () => {
        setToolPid('');
    };

    // The value displayed in the TextField
    const displayValue = toolPid ? `${toolPid}` : '';

    return (
        <TextField
            variant="outlined"
            size="small"
            placeholder={t('tool_box.tab_the_list')}
            value={displayValue}
            InputProps={{
                sx: {
                    height: 32,
                    color: darkColors.textSecondary,
                    backgroundColor: darkColors.backgroundScreen,
                    border: `1px solid ${darkColors.border}`,
                    '& fieldset': { border: 'none' },
                },
                startAdornment: (
                    <InputAdornment position="start">
                        <Typography
                            variant="body2"
                            sx={{ color: darkColors.textSecondary, fontWeight: 400, lineHeight: '22.5px' }}
                        >
                            {t('tool_box.pid')} |
                        </Typography>
                    </InputAdornment>
                ),
                endAdornment: toolPid ? (
                    <InputAdornment position="end">
                        <IconButton
                            onClick={handleClearToolPid}
                            edge="end"
                            size="small"
                            sx={{
                                padding: 0,
                                color: darkColors.textSecondary,
                                '&:hover': { backgroundColor: 'transparent' },
                            }}
                        >
                            <CancelIcon fontSize="small" sx={{
                                width: 20, height: 20, color: 'grey',
                                "&:hover": { color: 'white' }
                            }} />
                        </IconButton>
                    </InputAdornment>
                ) : null,
            }}
            sx={{
                flex: '1 1 0',
                '& .MuiOutlinedInput-root': {
                    paddingLeft: '12px',
                    paddingRight: '8px',
                    borderRadius: '4px',
                },
            }}

            onChange={(e) => setToolPid(e.target.value)}
        />
    );
};