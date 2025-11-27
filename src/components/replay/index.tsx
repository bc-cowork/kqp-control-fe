import { Box, Typography, FormControl, Select, MenuItem, Chip, TextField, IconButton, InputAdornment } from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {
    KeyboardArrowDown as SelectIcon,
    Cancel as CancelIcon,
} from '@mui/icons-material';

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

export const SelectField = ({ label, value, onChange, options = [], setValue }: any) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ alignSelf: 'stretch', height: 32, display: 'flex', alignItems: 'center' }}>
            <Typography
                variant="body2"
                sx={{ color: darkColors.gray5, fontWeight: 400, lineHeight: '22.5px' }}
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
                    sx={{
                        ...inputStyle,
                        '& .MuiSelect-select': {
                            p: '4px 4px 4px 4px',
                            display: 'flex',
                            alignItems: 'center',
                            color: darkColors.textSecondary,
                            fontSize: 15,
                            textAlign: 'left',
                            backgroundColor: 'transparent !important',
                            ml: '-4px'
                        },
                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        '& .MuiSvgIcon-root': { color: darkColors.textSecondary, fontSize: 16 },
                    }}
                    inputProps={{ 'aria-label': `${label} select` }}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                backgroundColor: darkColors.tableFill1,
                                color: darkColors.textPrimary,
                            },
                        },
                    }}
                >
                    <MenuItem
                        disabled
                        value=""
                    >
                        Select
                    </MenuItem>
                    {/* ✨ END OF PLACEHOLDER */}
                    {options.map((option: any) => (
                        <MenuItem
                            key={option.key}
                            value={option.label}
                            sx={{
                                color: darkColors.textPrimary,
                                backgroundColor: 'transparent',
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
                <Chip
                    label={value}
                    variant="soft"
                    onDelete={() => {
                        setValue('');
                    }}
                    sx={{
                        width: 100,
                        backgroundColor: '#212447',
                        color: '#7AA2FF !important',
                        border: '1px solid #1D2654',
                        "& .MuiChip-label": {
                            color: '#7AA2FF !important',
                        },
                        "& .MuiChip-deleteIcon": {
                            zIndex: 100,
                            color: '#7AA2FF !important',
                        }
                    }}
                    deleteIcon={
                        <CancelIcon />
                    }
                />
            )
        }
    </Box>
);

export const DateTimeMuiField = ({ label, type, value, onChange }: any) => {
    const PickerComponent = type === 'date' ? DatePicker : TimePicker;
    const placeholderValue = type === 'date' ? '0000-00-00' : '00:00:00';
    const minWidth = type === 'date' ? 126 : 110;

    const customInputProps = {
        sx: {
            ...inputStyle,
            minWidth,
            maxWidth: minWidth,
            height: 32,
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
            '& .MuiInputBase-input': {
                p: '4px 0px 4px 0px',
                display: 'flex',
                alignItems: 'center',
                color: darkColors.textSecondary,
                fontSize: 15,
                backgroundColor: 'transparent !important',
                height: 'auto',
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

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ alignSelf: 'stretch', height: 32, display: 'flex', alignItems: 'center' }}>
                <Typography
                    variant="body2"
                    sx={{ color: darkColors.gray5, fontWeight: 400, lineHeight: '22.5px' }}
                >
                    {label}
                </Typography>
            </Box>

            <PickerComponent
                value={dayjs(value, type === 'date' ? 'YYYY-MM-DD' : 'HH:mm:ss')}
                onChange={(newValue) => {
                    const formattedValue = newValue ? newValue.format(type === 'date' ? 'YYYY-MM-DD' : 'HH:mm:ss') : placeholderValue;
                    onChange({ target: { value: formattedValue } });
                }}
                slotProps={{
                    textField: {
                        size: "small",
                        placeholder: placeholderValue,
                        variant: "outlined",
                        InputProps: customInputProps,
                    },
                    popper: customPopperProps,
                    openPickerButton: {
                        sx: {
                            color: darkColors.textSecondary,
                            '& .MuiSvgIcon-root': { fontSize: 16 }
                        }
                    }
                }}
            />
        </Box>
    );
};

export const WideTextField = ({ label, value, onChange, placeholder, onClick }: any) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ alignSelf: 'stretch', height: 32, display: 'flex', alignItems: 'center' }}>
            <Typography
                variant="body2"
                sx={{ color: darkColors.gray5, fontWeight: 400, lineHeight: '22.5px' }}
            >
                {label}
            </Typography>
        </Box>
        <Box onClick={onClick} sx={{ cursor: 'pointer' }}>
            <TextField
                fullWidth
                variant="outlined"
                size="small"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                InputProps={{
                    readOnly: true,
                    sx: {
                        height: 32,
                        color: darkColors.textSecondary,
                        border: `1px solid ${darkColors.border}`,
                        '& fieldset': { border: 'none' },
                    },
                }}
                sx={{
                    flex: '1 1 0',
                    '& .MuiOutlinedInput-root': {
                        paddingLeft: '12px',
                        paddingRight: '8px',
                        borderRadius: '4px',
                    },
                }}
            />
        </Box>
    </Box>
);

export const CustomTextField = ({ toolPid, setToolPid }: any) => {
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
            placeholder="Tap the list"
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
                            PID |
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