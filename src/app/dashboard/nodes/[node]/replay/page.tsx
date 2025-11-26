'use client';

import React from 'react';
import {
    Box,
    Typography,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    TextField,
    Grid,
    Stack,
    FormControl,
    Select,
    MenuItem,
} from '@mui/material';
import {
    PlayArrow as PlayIcon,
    Schedule as TimeIcon,
    Event as DateIcon,
    Settings as SetttingsIcon,
    ZoomIn as ZoomInIcon,
    ChevronRight as ChevronRightIcon,
    KeyboardArrowDown as SelectIcon,
    CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';

import { useTranslate } from 'src/locales';
import { grey } from '@mui/material/colors';
import { Breadcrumb } from 'src/components/common/Breadcrumb';
import { DashboardContent } from 'src/layouts/dashboard';
import { endpoints, fetcher } from 'src/utils/axios';
import useSWR from 'swr';
import { LoadingScreen } from 'src/components/loading-screen';
import { extractFileOptions } from 'src/utils/extractFileOptions';

type Props = { params: { node: string } };

const darkColors = {
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
    maxWidth: 90,
    px: 1,
    py: 0,
    backgroundColor: 'transparent',
    borderRadius: '4px',
    border: `1px solid ${darkColors.border}`,
    '&:hover': {
        border: `1px solid ${darkColors.border}`,
    },
};

// --- FIXED SelectField Component ---
const SelectField = ({ label, value, onChange, options = [], setValue }) => (
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
                    sx={{
                        ...inputStyle,
                        '& .MuiSelect-select': {
                            p: '4px 0px 4px 0px',
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
                    // Custom style for the dropdown menu background
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                backgroundColor: darkColors.tableFill1,
                                color: darkColors.textPrimary,
                            },
                        },
                    }}
                >
                    {/* Map over the provided options (assuming they are strings) */}
                    {options.map((option) => (
                        <MenuItem
                            key={option.key} // Using the string value itself as the key
                            value={option.label} // Using the string value itself as the selected value
                            sx={{
                                color: darkColors.textPrimary,
                                backgroundColor: 'transparent',
                                '&:hover': { backgroundColor: darkColors.buttonTertiary },
                                '&.Mui-selected': {
                                    backgroundColor: darkColors.gray1,
                                    '&:hover': { backgroundColor: darkColors.buttonTertiary }
                                }
                            }}
                        >
                            {option.label} {/* Rendering the string value as the visible label */}
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
                        backgroundColor: "#212447",
                        color: '#7AA2FF',
                        border: '1px solid #1D2654',
                    }}
                />
            )
        }

    </Box>
);

const DateTimeMuiField = ({ label, type, value, onChange }) => {
    const PickerComponent = type === 'date' ? DatePicker : TimePicker;
    const placeholderValue = type === 'date' ? '0000-00-00' : '00:00:00';
    const minWidth = type === 'date' ? 126 : 110;

    const customInputProps = {
        sx: {
            ...inputStyle,
            minWidth: minWidth,
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

const WideTextField = ({ label, value, onChange, placeholder }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ alignSelf: 'stretch', height: 32, display: 'flex', alignItems: 'center' }}>
            <Typography
                variant="body2"
                sx={{ color: darkColors.gray5, fontWeight: 400, lineHeight: '22.5px', }}
            >
                {label}
            </Typography>
        </Box>

        <TextField
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            variant="outlined"
            size="small"
            sx={{
                border: '1px solid #4E576A',
                borderRadius: '8px'

            }}
        />
    </Box>
);

const panelStyle = {
    p: 1.5,
    borderRadius: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    background: `linear-gradient(180deg, ${darkColors.gray0} 80%, ${darkColors.gray1} 100%)`,
    height: 446,
};

export default function Page({ params }: Props) {
    const { node } = params;
    const { t } = useTranslate('status');
    const url = endpoints.replay.info(node);
    const { data, error, isLoading } = useSWR(url, fetcher);

    const processData = data?.data?.replay_status?.process_list || [];

    // --- EXTRACT LOG TYPE AND FILE TREE DATA ---
    const logTypeList = data?.data?.replay_interface?.log_type_list || [];
    const fileTreeList = extractFileOptions(data?.data?.replay_interface?.file_tree) || [];
    // ------------------------------------------

    console.log("fileTreeList", fileTreeList, logTypeList);

    const [logType, setLogType] = React.useState('');
    const [file, setFile] = React.useState('');
    const [date, setDate] = React.useState('0000-00-00');
    const [startTime, setStartTime] = React.useState('00:00:00');
    const [endTime, setEndTime] = React.useState('00:00:00');
    const [head, setHead] = React.useState('all');
    const [channel, setChannel] = React.useState('all');


    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DashboardContent maxWidth="xl">
                <Breadcrumb node={node} pages={[{ pageName: t('top.title') }]} />
                <Stack direction="row" alignItems="baseline" justifyContent="space-between">
                    <Typography sx={{ fontSize: 28, fontWeight: 500, color: grey[50], mt: 2, mb: 6 }}>
                        {t('top.title')}
                    </Typography>
                </Stack>
                {
                    isLoading ? (
                        <LoadingScreen />
                    ) : (
                        <Box>
                            <Grid container alignItems={"baseline"}
                                sx={{
                                    marginBottom: 2
                                }}
                                spacing={3}>
                                <Grid item xs={12} md={8}>
                                    <TableContainer>
                                        <Table stickyHeader size="small">
                                            <TableHead>
                                                <TableRow>
                                                    {['', 'PID', 'Command', ''].map((header, index) => (
                                                        <TableCell
                                                            key={index}
                                                        >
                                                            {header}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody sx={{ flex: '1 1 0', overflowY: 'auto' }}>
                                                {processData.map((row, index) => (
                                                    <TableRow
                                                        key={index}
                                                        sx={{
                                                            backgroundColor: index % 2 === 0 ? darkColors.tableFill1 : darkColors.tableFill2,
                                                            '&:last-child td, &:last-child th': { border: 0 },
                                                        }}
                                                    >
                                                        <TableCell component="th" scope="row" sx={{ p: '8px 12px', border: 'none' }}>
                                                            <Chip label={`Play`}
                                                                icon={<PlayIcon sx={{ color: darkColors.successText, fontSize: 12 }} />}
                                                                color="success" size="small" variant="outlined" sx={{
                                                                    backgroundColor: darkColors.successFill,
                                                                    borderColor: '#36573C',
                                                                    borderRadius: '12px',
                                                                    color: darkColors.successText,
                                                                    fontWeight: 600
                                                                }} />
                                                        </TableCell>
                                                        <TableCell sx={{ color: darkColors.textSecondary, fontSize: 15, p: '8px 12px', border: 'none' }}>
                                                            {row.pid}
                                                        </TableCell>
                                                        <TableCell sx={{ color: darkColors.textSecondary, fontSize: 15, p: '8px 12px', border: 'none' }}>
                                                            {row.command}
                                                        </TableCell>
                                                        <TableCell sx={{ p: '8px 12px', border: 'none' }} align="right"></TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Box
                                        sx={{
                                            height: 189,
                                            borderRadius: 2,
                                            border: `1px solid ${darkColors.border}`,
                                            p: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 1.5,
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <SetttingsIcon sx={{ fontSize: 20, color: darkColors.textPrimary }} />
                                            <Typography variant="body1" sx={{ color: darkColors.textPrimary }}>
                                                Tool
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <TextField
                                                variant="outlined"
                                                size="small"
                                                placeholder="Tap the list"
                                                value="PID"
                                                InputProps={{
                                                    sx: {
                                                        height: 32,
                                                        color: darkColors.textSecondary,
                                                        backgroundColor: darkColors.backgroundScreen,
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
                                            <Button
                                                variant="contained"
                                                disabled
                                                sx={{
                                                    height: 32,
                                                    p: '4px 12px',
                                                    backgroundColor: darkColors.dangerFill,
                                                    border: `2px solid ${darkColors.dangerTextDisabled}`,
                                                    color: darkColors.dangerTextDisabled,
                                                    '&.Mui-disabled': {
                                                        backgroundColor: darkColors.dangerFill,
                                                        color: darkColors.dangerTextDisabled,
                                                        border: `2px solid ${darkColors.dangerTextDisabled}`,
                                                    },
                                                }}
                                            >
                                                Kill
                                            </Button>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>

                            <Box
                                sx={{
                                    alignSelf: 'stretch',
                                    display: 'flex',
                                    minHeight: '673px',
                                    gap: 28,
                                }}
                            >
                                <Box
                                    sx={{
                                        flex: '1 1 0',
                                        backgroundColor: darkColors.black,
                                        borderRadius: 3,
                                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            p: '20px 16px',
                                            borderBottom: `1px solid transparent`,
                                            borderImageSlice: 1,
                                            borderImageSource: `linear-gradient(to right, #373F4E, #667085)`,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 1.5,
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <ZoomInIcon sx={{ fontSize: 20, color: darkColors.textPrimary }} />
                                            <Typography variant="body1" sx={{ color: darkColors.textPrimary }}>
                                                Audit Log
                                            </Typography>
                                        </Box>

                                        <Grid container spacing={2} sx={{ mt: 1.5 }}>
                                            <Grid item xs={12} sm={3}>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, }}>
                                                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', px: 1 }}>
                                                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>-</Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', px: 1 }}>
                                                        <DateIcon sx={{ color: darkColors.textPrimary, fontSize: 18 }} />
                                                        <Typography variant="body1" sx={{ color: darkColors.textPrimary, fontWeight: 600 }}>Date:</Typography>
                                                        <Typography variant="body1" sx={{ color: darkColors.textPrimary }}>0000-00-00</Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={3}>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                                                        <TimeIcon sx={{ color: darkColors.textPrimary, fontSize: 18 }} />
                                                        <Typography variant="body1" sx={{ color: darkColors.textPrimary, fontWeight: 600 }}>Start Time:</Typography>
                                                        <Typography variant="body1" sx={{ color: darkColors.textPrimary }}>00:00:00</Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                                                        <TimeIcon sx={{ color: darkColors.textPrimary, fontSize: 18 }} />
                                                        <Typography variant="body1" sx={{ color: darkColors.textPrimary, fontWeight: 600 }}>End Time:</Typography>
                                                        <Typography variant="body1" sx={{ color: darkColors.textPrimary }}>00:00:00</Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={3}>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                                                        <Typography variant="body1" sx={{ color: darkColors.textPrimary, fontWeight: 600 }}>HEAD:</Typography>
                                                        <Typography variant="body1" sx={{ color: darkColors.textPrimary }}>-</Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                                                        <Typography variant="body1" sx={{ color: darkColors.textPrimary, fontWeight: 600 }}>Channel Number:</Typography>
                                                        <Typography variant="body1" sx={{ color: darkColors.textPrimary }}>-</Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={3}>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                                    <Button
                                                        disabled
                                                        endIcon={<ChevronRightIcon sx={{ fontSize: 24 }} />}
                                                        sx={{
                                                            color: darkColors.textDisabled,
                                                            py: 1,
                                                            px: 2,
                                                            '&.Mui-disabled': {
                                                                color: darkColors.textDisabled,
                                                            }
                                                        }}
                                                    >Replay</Button>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>

                                    <Box sx={{ p: 1.5, flex: '1 1 0', alignSelf: 'stretch', minHeight: 100 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                            <Typography variant="body1" sx={{ color: darkColors.textPrimary }}>
                                                Replay Interface
                                            </Typography>
                                        </Box>
                                        <Grid container spacing={1} sx={{ width: '100%' }}>
                                            <Grid item xs={3}>
                                                <Box sx={{ ...panelStyle }}>
                                                    <SelectField
                                                        label="Log Type"
                                                        value={logType}
                                                        onChange={(e) => setLogType(e.target.value)}
                                                        options={logTypeList}
                                                        setValue={setLogType}
                                                    />
                                                    <SelectField
                                                        label="File"
                                                        value={file}
                                                        onChange={(e) => setFile(e.target.value)}
                                                        options={fileTreeList as string[]}
                                                        setValue={setFile}
                                                    />
                                                </Box>
                                            </Grid>

                                            <Grid item xs={4}>
                                                <Box sx={{ ...panelStyle }}>
                                                    <DateTimeMuiField
                                                        label="Date"
                                                        type="date"
                                                        value={date}
                                                        onChange={(e) => setDate(e.target.value)}
                                                    />
                                                    <DateTimeMuiField
                                                        label="Start Time"
                                                        type="time"
                                                        value={startTime}
                                                        onChange={(e) => setStartTime(e.target.value)}
                                                    />
                                                    <DateTimeMuiField
                                                        label="End Time"
                                                        type="time"
                                                        value={endTime}
                                                        onChange={(e) => setEndTime(e.target.value)}
                                                    />
                                                </Box>
                                            </Grid>

                                            <Grid item xs={5}>
                                                <Box sx={{ ...panelStyle }}>
                                                    <WideTextField
                                                        label="HEAD"
                                                        value={head}
                                                        onChange={(e) => setHead(e.target.value)}
                                                        placeholder="all"
                                                    />
                                                    <WideTextField
                                                        label="Channel Number"
                                                        value={channel}
                                                        onChange={(e) => setChannel(e.target.value)}
                                                        placeholder="all"
                                                    />
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    )
                }

            </DashboardContent >
        </LocalizationProvider >
    );
};