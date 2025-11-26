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
import { useTranslate } from 'src/locales';
import { grey } from '@mui/material/colors';
import { Breadcrumb } from 'src/components/common/Breadcrumb';
import { DashboardContent } from 'src/layouts/dashboard';

type Props = { params: { node: string } };

// Custom colors based on your style variables (for approximation)
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
    // Colors needed for the new filter panels
    gray0: '#202838',
    gray1: '#373F4E',
    gray5: '#D1D6E0',
};

const ProcessData = [
    { status: 'Play', pid: '12438', command: 'kc play name:rcv0 with-cfg:katana.moon ...', },
    { status: 'Play', pid: '16175', command: 'kc play name:rcv2 time:080001~125959', },
    { status: 'Play', pid: '12438', command: 'kc play name:rcv0 with-cfg:katana.moon ...', },
    { status: 'Play', pid: '12433', command: 'kc play name:rcv0 with-cfg:katana.moon ...', },
];



// Note: Assuming darkColors and all necessary imports are available.

const inputStyle = {
    height: 32,
    maxWidth: 100,
    px: 1,
    py: 0,
    backgroundColor: 'transparent', // Ensure the outer Box layer is transparent
    borderRadius: '4px',
    border: `1px solid ${darkColors.border}`,
    '&:hover': {
        border: `1px solid ${darkColors.border}`,
    },
};

// --- Updated SelectField ---
const SelectField = ({ label, value, onChange }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ alignSelf: 'stretch', height: 32, display: 'flex', alignItems: 'center' }}>
            <Typography
                variant="body2"
                sx={{ color: darkColors.gray5, fontWeight: 400, lineHeight: '22.5px' }}
            >
                {label}
            </Typography>
        </Box>
        <FormControl size="small">
            <Select
                value={value}
                onChange={onChange}
                IconComponent={SelectIcon}
                sx={{
                    ...inputStyle,
                    // The main styling needed for transparency
                    '& .MuiSelect-select': {
                        p: '4px 8px 4px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        color: darkColors.textSecondary,
                        fontSize: 15,
                        textAlign: 'center',
                        // FIX: Ensure the innermost display area is transparent
                        backgroundColor: 'transparent !important',
                    },
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '& .MuiSvgIcon-root': { color: darkColors.textSecondary, fontSize: 16 },
                }}
                inputProps={{ 'aria-label': `${label} select` }}
            >
                <MenuItem value="Select">Select</MenuItem>
                {/* Add more MenuItems here */}
            </Select>
        </FormControl>
    </Box>
);

// --- Updated DateTimeField ---
const DateTimeField = ({ label, value, onChange, icon }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ alignSelf: 'stretch', height: 32, display: 'flex', alignItems: 'center' }}>
            <Typography
                variant="body2"
                sx={{ color: darkColors.gray5, fontWeight: 400, lineHeight: '22.5px' }}
            >
                {label}
            </Typography>
        </Box>

        <FormControl size="small" sx={{ minWidth: label === 'Date' ? 100 : 60 }}>
            <Select
                value={value}
                onChange={onChange}
                IconComponent={icon ? CalendarIcon : SelectIcon}
                sx={{
                    ...inputStyle, // Apply custom height, border, etc.
                    maxWidth: label === 'Date' ? 130 : 110,
                    '& .MuiSelect-select': {
                        p: '4px 8px 4px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        color: darkColors.textSecondary,
                        fontSize: 15,
                        // FIX: Ensure the innermost display area is transparent
                        backgroundColor: 'transparent !important',
                    },
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '& .MuiSvgIcon-root': { color: darkColors.textSecondary, fontSize: 16 },
                }}
                inputProps={{ 'aria-label': `${label} input` }}
            >
                <MenuItem value={value}>{value}</MenuItem>
            </Select>
        </FormControl>
    </Box>
);

const WideTextField = ({ label, value, onChange, placeholder }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ alignSelf: 'stretch', height: 32, display: 'flex', alignItems: 'center' }}>
            <Typography
                variant="body2"
                sx={{ color: darkColors.gray5, fontWeight: 400, lineHeight: '22.5px' }}
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
        />
    </Box>
);

// Common styling for the filter panel cards
const panelStyle = {
    p: 1.5,
    borderRadius: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    background: `linear-gradient(180deg, ${darkColors.gray0} 80%, ${darkColors.gray1} 100%)`,
    height: 446,
};

// --- Main Component ---
export default function Page({ params }: Props) {
    const { node } = params;
    const { t } = useTranslate('status');

    // State for filter panel (initialized to match original text content)
    const [logType, setLogType] = React.useState('');
    const [file, setFile] = React.useState('');
    const [date, setDate] = React.useState('0000-00-00');
    const [startTime, setStartTime] = React.useState('00:00:00');
    const [endTime, setEndTime] = React.useState('00:00:00');
    const [head, setHead] = React.useState('all');
    const [channel, setChannel] = React.useState('all');


    return (
        <DashboardContent maxWidth="xl">
            <Breadcrumb node={node} pages={[{ pageName: t('top.title') }]} />
            <Stack direction="row" alignItems="baseline" justifyContent="space-between">
                <Typography sx={{ fontSize: 28, fontWeight: 500, color: grey[50], mt: 2, mb: 6 }}>
                    {t('top.title')}
                </Typography>
            </Stack>
            <Box>

                {/* --- Current Process List & Kill Tool --- */}
                <Grid container alignItems={"baseline"}
                    sx={{
                        marginBottom: 2
                    }}
                    spacing={3}>
                    {/* Left Side: Table */}
                    <Grid item xs={12} md={8}>
                        <TableContainer>
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow>
                                        {['', 'PID', 'Command', ''].map((header, index) => (
                                            <TableCell
                                                key={index}
                                                sx={{ color: darkColors.headerFill }} // Styled header text
                                            >
                                                {header}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody sx={{ flex: '1 1 0', overflowY: 'auto' }}>
                                    {ProcessData.map((row, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{
                                                backgroundColor: index % 2 === 0 ? darkColors.tableFill1 : darkColors.tableFill2,
                                                '&:last-child td, &:last-child th': { border: 0 },
                                            }}
                                        >
                                            <TableCell component="th" scope="row" sx={{ p: '8px 12px', border: 'none' }}>
                                                {row.status === 'Play' && (
                                                    <Chip label={`${row.status}`}
                                                        icon={<PlayIcon sx={{ color: darkColors.successText, fontSize: 12 }} />}
                                                        color="success" size="small" variant="outlined" sx={{
                                                            backgroundColor: darkColors.successFill,
                                                            borderColor: darkColors.successFill,
                                                            color: darkColors.successText,
                                                            fontWeight: 600
                                                        }} />
                                                )}
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

                    {/* Right Side: Tool Panel */}
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
                            {/* Tool Header */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <SetttingsIcon sx={{ fontSize: 20, color: darkColors.textPrimary }} />
                                <Typography variant="body1" sx={{ color: darkColors.textPrimary }}>
                                    Tool
                                </Typography>
                            </Box>

                            {/* PID Selection and Kill Button */}
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

                {/* --- Audit Log Section (Existing code moved down) --- */}
                <Box
                    sx={{
                        alignSelf: 'stretch',
                        display: 'flex',
                        minHeight: '653px',
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
                        {/* Audit Log Header */}
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

                            {/* Log Details (Date, Start/End Time, HEAD, Channel) - Using Grid */}
                            <Grid
                                container
                                spacing={2}
                                sx={{ mt: 1.5 }}
                            >
                                {/* --- Date Column --- */}
                                <Grid item xs={12} sm={3}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, }}>
                                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', px: 1 }}>
                                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                                                -
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', px: 1 }}>
                                            <DateIcon sx={{ color: darkColors.textPrimary, fontSize: 18 }} />
                                            <Typography variant="body1" sx={{ color: darkColors.textPrimary, fontWeight: 600 }}>
                                                Date:
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: darkColors.textPrimary }}>
                                                0000-00-00
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                {/* --- Start/End Time Column --- */}
                                <Grid item xs={12} sm={3}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                                            <TimeIcon sx={{ color: darkColors.textPrimary, fontSize: 18 }} />
                                            <Typography variant="body1" sx={{ color: darkColors.textPrimary, fontWeight: 600 }}>
                                                Start Time:
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: darkColors.textPrimary }}>
                                                00:00:00
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                                            <TimeIcon sx={{ color: darkColors.textPrimary, fontSize: 18 }} />
                                            <Typography variant="body1" sx={{ color: darkColors.textPrimary, fontWeight: 600 }}>
                                                End Time:
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: darkColors.textPrimary }}>
                                                00:00:00
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                {/* --- HEAD/Channel Column --- */}
                                <Grid item xs={12} sm={3}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                                            <Typography variant="body1" sx={{ color: darkColors.textPrimary, fontWeight: 600 }}>
                                                HEAD:
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: darkColors.textPrimary }}>
                                                -
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                                            <Typography variant="body1" sx={{ color: darkColors.textPrimary, fontWeight: 600 }}>
                                                Channel Number:
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: darkColors.textPrimary }}>
                                                -
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                {/* --- Replay Button Column --- */}
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
                                        >
                                            Replay
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Audit Log Content Area */}
                        <Box sx={{ p: 1.5, flex: '1 1 0', alignSelf: 'stretch', minHeight: 100 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <Typography variant="body1" sx={{ color: darkColors.textPrimary }}>
                                    Replay Interface
                                </Typography>
                            </Box>
                            {/* --- New Filter Panels Section --- */}
                            <Grid container spacing={1} sx={{ width: '100%' }}>
                                <Grid item xs={3}>
                                    <Box sx={{ ...panelStyle }}>
                                        <SelectField
                                            label="Log Type"
                                            value={logType || 'Select'}
                                            onChange={(e) => setLogType(e.target.value)}
                                            icon={false}
                                        />
                                        <SelectField
                                            label="File"
                                            value={file || 'Select'}
                                            onChange={(e) => setFile(e.target.value)}
                                            icon={false}
                                        />
                                    </Box>
                                </Grid>

                                <Grid item xs={4}>
                                    <Box sx={{ ...panelStyle }}>
                                        <DateTimeField
                                            label="Date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            icon={true}
                                        />
                                        <DateTimeField
                                            label="Start Time"
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
                                            icon={false}

                                        />
                                        <DateTimeField
                                            label="End Time"
                                            value={endTime}
                                            onChange={(e) => setEndTime(e.target.value)}
                                            icon={false}
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
        </DashboardContent>
    );
};