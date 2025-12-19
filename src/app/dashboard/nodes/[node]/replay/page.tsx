'use client';

import React, { useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Divider,
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
    Grid,
    Stack,
    tableRowClasses,
    tableCellClasses,
} from '@mui/material';
import { CONFIG } from 'src/config-global';


import {
    ChevronRight as ChevronRightIcon,
    ErrorOutline as ErrorOutlineIcon,
    PlayArrowOutlined,
} from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// Assuming these imports are correctly defined in your project
import { useTranslate } from 'src/locales';
import { grey } from '@mui/material/colors';
import { Breadcrumb } from 'src/components/common/Breadcrumb';
import { DashboardContent } from 'src/layouts/dashboard';
import { endpoints, fetcher } from 'src/utils/axios';
import useSWR from 'swr';
import { LoadingScreen } from 'src/components/loading-screen';
import { CustomTextField, darkColors, DateTimeMuiField, SelectField, WideTextField } from 'src/components/replay';
import { FilterDialog } from 'src/components/replay/FilterDialog'; // Ensure this is the updated version
import { AddReplayDialog } from 'src/components/replay/AddReplayDialog';
import { FilterInputBar } from 'src/components/replay/FilterInputBar';
import { SpeedInputFilter } from 'src/components/replay/SpeedInputFilter';
import { AuditLogGrid } from 'src/components/replay/AuditLogGrid';

const Gear = (props: any) => <Box component="img" src={`${CONFIG.assetsDir}/assets/icons/settings/gear.svg`} alt="gear" {...props} />;
const Time = (props: any) => <Box component="img" src={`${CONFIG.assetsDir}/assets/icons/custom/time.svg`} alt="time" {...props} />;
const Archive = (props: any) => <Box component="img" src={`${CONFIG.assetsDir}/assets/icons/custom/archive.svg`} alt="archive" {...props} />;
const Calendar = (props: any) => <Box component="img" src={`${CONFIG.assetsDir}/assets/icons/custom/calendar.svg`} alt="calendar" {...props} />;
const AuditLogIcon = (props: any) => <Box component="img" src={`${CONFIG.assetsDir}/assets/icons/custom/audit-log.svg`} alt="audit-log" {...props} />;

// --- TYPE DEFINITIONS (from original code) ---
type Props = { params: { node: string } };

const panelStyle = {
    p: 1.5,
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    background: `linear-gradient(180deg, ${darkColors.gray0} 80%, ${darkColors.gray1} 100%)`,
    height: 446,
};

// --- MAIN PAGE COMPONENT ---
export default function Page({ params }: Props) {
    const { node } = params;
    const { t } = useTranslate('replay');
    const url = endpoints.replay.info(node);
    const { data, error, isLoading, mutate } = useSWR(url, fetcher);

    const processData = Array.isArray(
        data?.data?.replay_status?.process_list
    )
        ? data.data.replay_status.process_list
        : [];

    const logTypeList = data?.data?.replay_interface?.log_type_list || [];

    const [logType, setLogType] = React.useState('');
    const [file, setFile] = React.useState('');
    const [date, setDate] = React.useState('0000-00-00');
    const [startTime, setStartTime] = React.useState('00:00:00');
    const [endTime, setEndTime] = React.useState('00:00:00');
    // Initialize head and channel to 'All' or '' depending on your default filter view
    // Using 'All' makes sense if that's the default state.
    const [head, setHead] = React.useState('All');
    const [channel, setChannel] = React.useState('All');

    const [toolPid, setToolPid] = React.useState('');
    const [killDialogOpen, setKillDialogOpen] = React.useState(false);
    const [replayDialogOpen, setReplayDialogOpen] = React.useState(false);
    const [currentSpeed, setCurrentSpeed] = React.useState('1.0');


    // --- Filter Dialog State Management (FIXED) ---

    // 1. Separate state for dialog input/mode/error (generic to the open dialog)
    const [filterDialogOpen, setFilterDialogOpen] = React.useState(false);
    const [filterTarget, setFilterTarget] = React.useState<'HEAD' | 'CHANNEL' | null>(null);
    const [dialogMode, setDialogMode] = React.useState('Typing');
    const [dialogExpression, setDialogExpression] = React.useState('');
    const [filterError, setFilterError] = React.useState('');
    const [outboundExpression, setOutboundExpression] = React.useState('');
    const [replaying, setReplaying] = React.useState(false);

    // --- END Filter Dialog State Management ---


    const handleOpenFilterDialog = (target: 'HEAD' | 'CHANNEL') => {
        // Toggle: if the same dialog is open, close it; otherwise open and initialize
        if (filterDialogOpen && filterTarget === target) {
            handleCloseFilterDialog();
            return;
        }

        setFilterTarget(target);
        setFilterDialogOpen(true);
        setFilterError('');

        // Use the saved value for initialization
        const savedValue = target === 'HEAD' ? head : channel;

        // 2. Initialize dialog state based on saved value
        if (savedValue === 'All') {
            setDialogMode('Typing');
            setDialogExpression('');
        } else {
            setDialogMode('Typing');
            setDialogExpression(savedValue);
        }
    };

    const handleCloseFilterDialog = () => {
        setFilterDialogOpen(false);
        setFilterTarget(null);
        setFilterError('');
    };

    const handleFilterConfirm = () => {
        // Allow confirming either with a typed expression or 'All' mode.
        // If dialogMode is 'All' or expression is empty, store 'All'.
        const trimmed = dialogExpression.trim();
        const finalValue = dialogMode === 'All' || !trimmed ? 'All' : trimmed;

        if (filterTarget === 'HEAD') {
            setHead(finalValue);
        } else if (filterTarget === 'CHANNEL') {
            setChannel(finalValue);
        }

        // Clear any previous error and close the dialog
        setFilterError('');
        handleCloseFilterDialog();
    };

    const handleFilterReset = () => {
        // Reset dialog internal state to 'All'
        setDialogExpression('');
        setDialogMode('Typing');
        setFilterError('');

        // Optional: Also reset the persistent state to 'All' immediately upon Reset click
        if (filterTarget === 'HEAD') {
            setHead('All');
        } else if (filterTarget === 'CHANNEL') {
            setChannel('All');
        }
    };


    const canReplay = React.useMemo(() =>
    (
        logType && logType !== '' &&
        file && file !== '' &&
        date && date !== '0000-00-00' &&
        startTime && startTime !== '00:00:00' &&
        endTime && endTime !== '00:00:00' &&
        head && head !== '' &&
        channel && channel !== '' &&
        outboundExpression && outboundExpression !== ''
    ), [logType, file, date, startTime, endTime, head, channel, outboundExpression]);


    const handleReplay = () => {
        setReplayDialogOpen(true);
    }

    useEffect(() => {
        if (!logType) {
            setDate('');
            setFile('');
        }
    }, [logType]);

    const revalidateOnKill = () => {
        setToolPid('');
        mutate();
    }

    const borderAtLarge = {
        borderBottom: { xl: '0.5px solid' },
        borderImageSlice: { xl: 0.5 },
        borderImageSource: {
            xl: 'linear-gradient(to right, #1b1c1dff 0%, #667085 50%, #1b1c1dff 100%)'
        },
    }

    return (
        <DashboardContent maxWidth="xl">

            <LocalizationProvider dateAdapter={AdapterDayjs}>

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
                            <Grid container alignItems="baseline"
                                sx={{
                                    marginBottom: 2,
                                }}
                                spacing={3}>
                                <Grid item xs={12} lg={8}
                                    order={{
                                        xs: 1,
                                        lg: 0
                                    }}
                                >
                                    <TableContainer
                                        sx={{
                                            borderRadius: '8px',
                                            height: 174,
                                            backgroundColor: '#373F4E'
                                        }}
                                    >
                                        <Table size="small"
                                            sx={{
                                                [`& .${tableRowClasses.root}:last-child .${tableCellClasses.root}`]: {
                                                    borderBottomLeftRadius: '0px !important',
                                                    borderBottomRightRadius: '0px !important',
                                                },
                                            }}
                                        >
                                            <TableHead >
                                                <TableRow>
                                                    {['', t('top_table.pid'), t('top_table.command'), ''].map((header, index) => (
                                                        <TableCell
                                                            key={index}
                                                            align='left'
                                                        >
                                                            {header}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody sx={{ flex: '1 1 0', overflowY: 'auto' }}>
                                                {
                                                    processData.length === 0 && (
                                                        <TableRow>
                                                            <TableCell colSpan={4}>
                                                                <Typography sx={{ color: darkColors.textSecondary }}>No Processes Found</Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                }
                                                {processData?.map((row: any, index: number) => (
                                                    <TableRow
                                                        key={index}
                                                        sx={{
                                                            backgroundColor: index % 2 === 0 ? darkColors.tableFill1 : darkColors.tableFill2,
                                                            '&:last-child td, &:last-child th': { border: 0 },
                                                            cursor: 'pointer',
                                                        }}
                                                        onClick={() => setToolPid(row.pid)}
                                                    >
                                                        <TableCell sx={{ p: '8px 12px', border: 'none' }}>
                                                            <Chip label="Play"
                                                                icon={<Box sx={{ backgroundColor: darkColors.successText, width: 8, height: 8, borderRadius: 4 }} />}
                                                                color="success" size="small" variant="outlined" sx={{
                                                                    backgroundColor: darkColors.successFill,
                                                                    borderColor: '#36573C',
                                                                    borderRadius: '12px',
                                                                    color: darkColors.successText,
                                                                    fontWeight: 600,
                                                                    padding: '4px 8px',
                                                                }} />
                                                        </TableCell>
                                                        <TableCell align='left' sx={{ color: darkColors.textSecondary, fontSize: 15, border: 'none' }}>
                                                            {row.pid}
                                                        </TableCell>
                                                        <TableCell sx={{
                                                            color: darkColors.textSecondary, fontSize: 15, border: 'none',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            maxWidth: '200px',
                                                        }}>
                                                            {row.command}
                                                        </TableCell>
                                                        <TableCell sx={{ p: '8px 12px', border: 'none' }} align="right" />
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>

                                <Grid item lg={4} xs={12} sm={8} md={6}>
                                    <Box
                                        sx={{
                                            height: 189,
                                            borderRadius: '8px',
                                            border: `1px solid ${darkColors.border}`,
                                            p: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 1.5,
                                            sx: {
                                                minWidth: '300px'
                                            }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Gear />
                                            <Typography variant="body1" sx={{ color: darkColors.textPrimary, fontFamily: 'Roboto, sans-serif !important', fontSize: '15px' }}>
                                                {t('tool_box.tool')}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CustomTextField toolPid={toolPid} setToolPid={setToolPid} />
                                            <Button
                                                variant="contained"
                                                disabled={!toolPid}
                                                sx={{
                                                    height: 32,
                                                    p: '4px 12px',
                                                    backgroundColor: toolPid ? '#4A2C31 !important' : '#331B1E !important',
                                                    border: `2px solid ${toolPid ? '#FF3D4A !important' : '#4A2C31 !important'
                                                        }`,
                                                    color: toolPid ? '#FF3D4A !important' : '#4A2C31 !important',
                                                    "&:hover": {
                                                        backgroundColor: toolPid ? '#5E66FF !important' : '#331B1E !important',
                                                        borderColor: toolPid ? '#4E57E5 !important' : '#4A2C31 !important',
                                                        color: toolPid ? '#FFFFFF !important' : '#4A2C31 !important',
                                                    }
                                                }}
                                                onClick={() => setKillDialogOpen(true)}
                                            >
                                                {t('tool_box.kill')}

                                            </Button>
                                            <TerminatedDialog
                                                open={killDialogOpen}
                                                handleClose={() => setKillDialogOpen(false)}
                                                refresh={revalidateOnKill}
                                                pid={toolPid}
                                                nodeId={node}
                                            />
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
                                        borderRadius: '12px',
                                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            p: '20px 16px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 1.5,
                                        }}
                                    >

                                        <Box sx={{
                                            alignItems: 'center', gap: 1,
                                            display: { xs: 'none', xl: 'flex' }
                                        }}>
                                            <AuditLogIcon />
                                            <Typography variant="body1" sx={{ color: darkColors.textPrimary, fontFamily: 'Roboto, sans-serif !important', fontSize: '15px' }}>
                                                {t('audit_log.title')}
                                            </Typography>
                                        </Box>

                                        <Grid container spacing={2} sx={{
                                            mt: 1.5,
                                            display: { xs: 'none', xl: 'flex' }
                                        }}>
                                            <Grid item xs={12} sm={12} md={6} lg={2.5}>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, }}>

                                                    <Box sx={{
                                                        display: 'flex', gap: 1.5, alignItems: 'center',
                                                    }}>
                                                        <Typography variant="body1" sx={{ color: darkColors.textPrimary, fontWeight: 900, fontSize: '20px', }}>{logType || '-'}{' : '}{file || '-'}</Typography>
                                                    </Box>
                                                    <Box sx={{
                                                        display: 'flex', gap: 1.5, alignItems: 'center',
                                                        ...borderAtLarge,
                                                        paddingBottom: '12px'
                                                    }}>
                                                        <Calendar />
                                                        <Typography variant="body1" sx={{ color: darkColors.textPrimary, fontWeight: 600, fontFamily: 'Roboto, sans-serif !important', fontSize: '15px' }}>{t('audit_log.date')} </Typography>
                                                        <Typography variant="body1" sx={{ color: darkColors.textPrimary, fontFamily: 'Roboto, sans-serif !important', fontSize: '15px' }}>{date || '0000-00-00'}</Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={6} lg={2.5}>
                                                <Box sx={{
                                                    display: 'flex', flexDirection: 'column', gap: 1.5,

                                                }}>
                                                    <Box sx={{
                                                        display: 'flex', gap: 1.5, alignItems: 'center',
                                                        ...borderAtLarge,
                                                        paddingBottom: '12px'

                                                    }}>
                                                        <Time />
                                                        <Typography variant="body1" sx={{ color: darkColors.textPrimary, fontWeight: 600, fontFamily: 'Roboto, sans-serif !important', fontSize: '15px' }}>{t('audit_log.start_time')} </Typography>
                                                        <Typography variant="body1" sx={{ color: darkColors.textPrimary, fontFamily: 'Roboto, sans-serif !important', fontSize: '15px' }}>{startTime || '00:00:00'}</Typography>
                                                    </Box>
                                                    <Box sx={{
                                                        display: 'flex', gap: 1.5, alignItems: 'center',
                                                        ...borderAtLarge,
                                                        paddingBottom: '12px'
                                                    }}>
                                                        <Time />
                                                        <Typography variant="body1" sx={{ color: darkColors.textPrimary, fontWeight: 600, fontFamily: 'Roboto, sans-serif !important', fontSize: '15px' }}>{t('audit_log.end_time')} </Typography>
                                                        <Typography variant="body1" sx={{ color: darkColors.textPrimary, fontFamily: 'Roboto, sans-serif !important', fontSize: '15px' }}>{endTime || '00:00:00'}</Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={6} lg={3.2}>
                                                <Box sx={{
                                                    display: 'flex', flexDirection: 'column', gap: 1.5,
                                                }}>
                                                    <Box sx={{
                                                        display: 'flex', gap: 1.5, alignItems: 'center',
                                                        ...borderAtLarge,
                                                        paddingBottom: '12px'
                                                    }}>
                                                        <Archive />
                                                        <Typography variant="body1" sx={{ color: darkColors.textPrimary, fontWeight: 600, fontFamily: 'Roboto, sans-serif !important', fontSize: '15px' }}>{t('audit_log.head')} </Typography>
                                                        <Typography variant="body1" sx={{ color: darkColors.textPrimary, fontFamily: 'Roboto, sans-serif !important', fontSize: '15px' }}>{head || '-'}</Typography>
                                                    </Box>
                                                    <Box sx={{
                                                        display: 'flex', gap: 1.5, alignItems: 'center',
                                                        ...borderAtLarge,
                                                        paddingBottom: '12px'
                                                    }}>
                                                        <Archive />
                                                        <Typography variant="body1" sx={{ color: darkColors.textPrimary, fontWeight: 600, fontFamily: 'Roboto, sans-serif !important', fontSize: '15px' }}>{t('audit_log.channel_number')} </Typography>
                                                        <Typography variant="body1" sx={{ color: darkColors.textPrimary, fontFamily: 'Roboto, sans-serif !important', fontSize: '15px' }}>{channel || '-'}</Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>

                                            <Grid item xs={12} sm={12} md={6} lg={3.7}>
                                                <Grid sx={{
                                                    display: 'flex',
                                                    direction: 'row',
                                                    justifyContent: 'space-between',
                                                }}>
                                                    <Box sx={{
                                                        display: 'flex', flexDirection: 'column', gap: 1.5,
                                                        minWidth: '257px',
                                                    }}>
                                                        <Box sx={{
                                                            display: 'flex', gap: 1.5, alignItems: 'center',
                                                            ...borderAtLarge,
                                                            paddingBottom: '12px'
                                                        }}>
                                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M8.00019 1.33337C5.28495 1.33337 3.23828 2.35718 3.23828 3.71433L3.23828 12.2858C3.23828 13.6429 5.28495 14.6667 8.00019 14.6667C10.7154 14.6667 12.7621 13.6429 12.7621 12.2858L12.7621 3.71433C12.7621 2.35718 10.7154 1.33337 8.00019 1.33337ZM8.00019 2.28576C10.3249 2.28576 11.8097 3.13147 11.8097 3.71433C11.8097 4.29718 10.3249 5.1429 8.00019 5.1429C5.67542 5.1429 4.19066 4.29718 4.19066 3.71433C4.19066 3.13147 5.67447 2.28576 8.00019 2.28576ZM8.00019 13.7143C5.67447 13.7143 4.19066 12.8677 4.19066 12.2858L4.19066 5.1629C5.34671 5.82788 6.6677 6.15119 8.00019 6.09528C9.33267 6.15119 10.6537 5.82788 11.8097 5.1629L11.8097 12.2858C11.8097 12.8677 10.3249 13.7143 8.00019 13.7143Z" fill="#F4F4F8" />
                                                            </svg>
                                                            <Typography variant="body1" sx={{ color: darkColors.textPrimary, fontWeight: 600, fontFamily: 'Roboto, sans-serif !important', fontSize: '15px' }}>{t('audit_log.destination_to')} </Typography>
                                                            <Typography variant="body1" sx={{ color: darkColors.textPrimary, fontFamily: 'Roboto, sans-serif !important', fontSize: '15px' }}>{outboundExpression || '-'}</Typography>
                                                        </Box>
                                                        <Box sx={{
                                                            display: 'flex', gap: 1.5, alignItems: 'center',
                                                            ...borderAtLarge,
                                                            paddingBottom: '12px'
                                                        }}>
                                                            <PlayArrowOutlined sx={{ color: darkColors.textPrimary, fontSize: 18 }} />
                                                            <Typography variant="body1" sx={{ color: darkColors.textPrimary, fontWeight: 600, fontFamily: 'Roboto, sans-serif !important', fontSize: '15px' }}>{t('audit_log.speed')} </Typography>
                                                            <Typography variant="body1" sx={{ color: darkColors.textPrimary, fontFamily: 'Roboto, sans-serif !important', fontSize: '15px' }}>{currentSpeed || '-'}</Typography>
                                                        </Box>
                                                    </Box>
                                                    <Box sx={{
                                                        alignSelf: 'flex-end',
                                                        display: {
                                                            xs: 'none',
                                                            sm: 'none',
                                                            md: 'none',
                                                            lg: 'none',
                                                            xl: 'inline-flex'
                                                        }
                                                    }}>
                                                        <Button
                                                            // Conditional Activation
                                                            disabled={!canReplay}
                                                            endIcon={<ChevronRightIcon sx={{ fontSize: 24 }} />}
                                                            sx={{
                                                                color: canReplay ? darkColors.textPrimary : darkColors.textDisabled,
                                                                backgroundColor: canReplay ? '#5E66FF' : 'transparent',
                                                                fontSize: 17,
                                                                py: 1,
                                                                px: 2,
                                                                '&.Mui-disabled': {
                                                                    color: darkColors.textDisabled,
                                                                },
                                                                "&:hover": {
                                                                    backgroundColor: canReplay ? '#4E57E5' : 'transparent',
                                                                },

                                                            }}
                                                            onClick={() => handleReplay()}
                                                        >{t('audit_log.replay')}</Button>
                                                        <AddReplayDialog
                                                            replaying={replaying}
                                                            open={replayDialogOpen} onConfirm={async () => {
                                                                setReplaying(true);
                                                                const replayData = {
                                                                    name: file,
                                                                    date: date.replaceAll('-', ''),
                                                                    start_hhmmss: startTime.replaceAll(':', ''),
                                                                    end_hhmmss: endTime.replaceAll(':', ''),
                                                                    throw_to: outboundExpression,
                                                                    head,
                                                                    speed: currentSpeed,
                                                                }
                                                                const BASE_URL = `${CONFIG.serverUrl}/apik/prod1/replay`;

                                                                const paramsLocal = new URLSearchParams(replayData).toString();
                                                                const fullUrl = `${BASE_URL}?${paramsLocal}`;


                                                                try {
                                                                    const response = await fetch(fullUrl, {
                                                                        method: 'GET',
                                                                        headers: {
                                                                            'accept': 'application/json',
                                                                        },
                                                                    });

                                                                    if (!response.ok) {
                                                                        throw new Error(`HTTP error! status: ${response.status}`);
                                                                    }

                                                                    const replayRespData = await response.json();
                                                                    console.log('Replay request successful:', replayRespData);

                                                                    setReplayDialogOpen(false);

                                                                } catch (e) {
                                                                    console.error('Failed to initiate replay request:', e);

                                                                } finally {
                                                                    mutate()
                                                                    setLogType('');
                                                                    setDate("0000-00-00");
                                                                    setStartTime('00:00:00')
                                                                    setEndTime('00:00:00');
                                                                    setOutboundExpression('')
                                                                    setFile('');
                                                                    setReplaying(false);
                                                                }
                                                            }} onClose={() => { setReplayDialogOpen(false) }} />
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <AuditLogGrid
                                            t={t}
                                            styles={{ darkColors }}
                                            data={{
                                                logType, file, date, startTime, endTime,
                                                head, channel, outboundExpression, currentSpeed
                                            }}
                                            actions={{
                                                canReplay,
                                                handleReplay: () => handleReplay(),
                                            }}
                                        />

                                    </Box>

                                    <Box sx={{ p: 1.5, flex: '1 1 0', alignSelf: 'stretch', height: '100%' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                            <Typography variant="body1" sx={{ color: darkColors.textPrimary, fontFamily: 'Roboto, sans-serif !important', fontSize: '15px' }}>
                                                {t('audit_log.replay_interface')}
                                            </Typography>
                                        </Box>
                                        <Grid container spacing={1} sx={{ width: '100%' }}>
                                            <Grid item xs={12} sm={12} md={5.9} lg={2.5}>
                                                <Box sx={{ ...panelStyle }}>
                                                    <SelectField
                                                        label={t('audit_log.log_type')}
                                                        placeholder={t('audit_log.select')}
                                                        value={logType}
                                                        onChange={(e: any) => setLogType(e.target.value)}
                                                        options={logTypeList}
                                                        setValue={setLogType}
                                                    />
                                                    <SelectField
                                                        label={t('audit_log.file')}
                                                        placeholder={t('audit_log.select')}
                                                        value={file}
                                                        onChange={(e: any) => setFile(e.target.value)}
                                                        options={[...getKeysFromSelectedValue(data?.data?.replay_interface?.file_tree, logTypeList, logType)]}
                                                        setValue={setFile}
                                                    />
                                                </Box>
                                            </Grid>

                                            <Grid item xs={12} sm={12} md={5.9} lg={2.5}>
                                                <Box sx={{ ...panelStyle }}>
                                                    <SelectField
                                                        label={t('audit_log.date')}
                                                        placeholder="0000-00-00"
                                                        value={date}
                                                        onChange={(e: any) => setDate(e.target.value)}
                                                        options={[...getDatesFromSelectedValue(data?.data?.replay_interface?.file_tree, logTypeList, logType, file)]}
                                                        setValue={setDate}
                                                        width='120px'
                                                    />
                                                    <DateTimeMuiField
                                                        label={t('audit_log.start_time')}
                                                        type="time"
                                                        value={startTime}
                                                        onChange={(e: any) => setStartTime(e.target.value)}
                                                    />
                                                    <DateTimeMuiField
                                                        label={t('audit_log.end_time')}
                                                        value={endTime}
                                                        type="time"
                                                        onChange={(e: any) => setEndTime(e.target.value)}
                                                    />
                                                </Box>
                                            </Grid>

                                            <Grid item xs={12} sm={12} md={5.9} lg={3.2}>
                                                <Box sx={{ ...panelStyle }}>

                                                    <WideTextField
                                                        label={t('audit_log.head')}
                                                        value={head}
                                                        onClick={() => handleOpenFilterDialog('HEAD')}
                                                        onClose={() => {
                                                            setHead('');
                                                        }}
                                                    />
                                                    {filterTarget === 'HEAD' && (
                                                        <FilterDialog
                                                            open={filterDialogOpen}
                                                            onClose={handleCloseFilterDialog}
                                                            mode={dialogMode}
                                                            setMode={setDialogMode} // This setter updates the generic dialog mode state
                                                            expression={dialogExpression}
                                                            setExpression={setDialogExpression} // This setter updates the generic dialog expression state
                                                            handleReset={handleFilterReset}
                                                            handleConfirm={handleFilterConfirm}
                                                            errorMessage={filterError}
                                                            setValue={setHead}
                                                        />
                                                    )}

                                                    <WideTextField
                                                        label={t('audit_log.channel_number')}
                                                        value={channel}
                                                        onClick={() => handleOpenFilterDialog('CHANNEL')}
                                                        onClose={() => {
                                                            setChannel('')
                                                        }}


                                                    />
                                                    {filterTarget === 'CHANNEL' && (
                                                        <FilterDialog
                                                            open={filterDialogOpen}
                                                            onClose={handleCloseFilterDialog}
                                                            mode={dialogMode}
                                                            setMode={setDialogMode} // This setter updates the generic dialog mode state
                                                            expression={dialogExpression}
                                                            setExpression={setDialogExpression} // This setter updates the generic dialog expression state
                                                            handleReset={handleFilterReset}
                                                            handleConfirm={handleFilterConfirm}
                                                            errorMessage={filterError}
                                                            setValue={setChannel}

                                                        />
                                                    )}
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={5.9} lg={3.7}>
                                                <Box sx={{ ...panelStyle }}>
                                                    <FilterInputBar
                                                        expression={outboundExpression}
                                                        setExpression={setOutboundExpression}
                                                    />
                                                    <SpeedInputFilter
                                                        currentSpeed={currentSpeed}
                                                        setCurrentSpeed={setCurrentSpeed}
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

                {/* 3. Filter Dialog Rendering: Renders only when open, uses generic state */}

            </LocalizationProvider >
        </DashboardContent >

    );
};

// --- TerminatedDialog Component (remains the same) ---
const TerminatedDialog = ({ open, handleClose, pid, nodeId, refresh }: {
    open: boolean;
    handleClose: () => void;
    pid: string | number;
    nodeId: string | number;
    refresh: any
}) => {
    const { t } = useTranslate('replay');
    const [isTerminating, setIsTerminating] = React.useState(false);

    const handleTerminate = async () => {
        setIsTerminating(true);
        const url = `${CONFIG.serverUrl}/apik/${nodeId}/replay/terminate`;

        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pid,
                }),
            });

            if (!response.ok) {
                // Handle non-2xx responses (e.g., server error)
                const errorData = await response.json().catch(() => ({ message: 'No message available' }));
                console.error('Termination failed:', errorData);
                alert(`Error terminating PID ${pid}: ${errorData.message || response.statusText}`);
                return;
            }

            // Handle successful termination
            console.log(`PID ${pid} terminated successfully.`);
            handleClose(); // Close the dialog on success

        } catch (error) {
            // Handle network errors
            console.error('Network or unexpected error during termination:', error);
            alert('A network error occurred. Please try again.');
        } finally {
            // Ensure the button state is reset regardless of success or failure
            refresh()
            setIsTerminating(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="custom-dialog-title"
            PaperProps={{
                style: {
                    backgroundColor: '#0A0E15',
                    borderRadius: 8,
                    border: '1px solid #4E576A',
                    color: '#F0F1F5',
                    minWidth: '400px',
                    minHeight: '220px',
                },
            }}
        >
            <DialogTitle
                id="custom-dialog-title"
                sx={{
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                }}
            >
                <ErrorOutlineIcon />
                <Typography
                    variant="subtitle1"
                    fontWeight="400"
                    lineHeight="22.50px"
                    sx={{ color: 'inherit' }}
                >
                    {t('terminate_dialog.confirm')}
                </Typography>
            </DialogTitle>

            <DialogContent
                sx={{
                    margin: '0 12px',
                    background: '#161C25',
                    borderRadius: '8px',
                    border: '1px solid #4E576A',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        gap: '8px',
                    }}
                >
                    <Typography
                        variant="h6"
                        fontWeight="600"
                        lineHeight="25.50px"
                        textAlign="center"
                        sx={{ color: 'inherit' }}
                    >
                        PID
                    </Typography>
                    <Divider orientation="vertical" flexItem sx={{ width: '1px', height: '12px', backgroundColor: '#4E576A', alignSelf: 'center' }} />
                    <Typography
                        variant="h6"
                        fontWeight="600"
                        lineHeight="25.50px"
                        textAlign="center"
                        sx={{ color: 'inherit' }}
                    >
                        {pid}
                    </Typography>
                </Box>

                <Typography
                    variant="body1"
                    fontWeight="400"
                    lineHeight="22.50px"
                    textAlign="center"
                    sx={{ color: 'inherit' }}
                >
                    {t('terminate_dialog.terminate')}
                </Typography>
            </DialogContent>

            <DialogActions
                sx={{
                    padding: '20px 12px',
                    justifyContent: 'flex-end',
                    gap: '10px',
                }}
            >
                {/* '확인' Button: Calls handleTerminate and shows loading state */}
                <Button
                    onClick={handleTerminate}
                    disabled={isTerminating}
                    sx={{
                        padding: '4px 12px',
                        background: '#5E66FF',
                        borderRadius: '4px',
                        color: 'white',
                        fontSize: '15px',
                        fontFamily: 'Roboto',
                        fontWeight: '400',
                        lineHeight: '22.50px',
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: '#4E57E5',
                        },
                        '&.Mui-disabled': {
                            background: '#5E66FF80',
                            color: 'white',
                        }
                    }}
                >
                    {/* Change button text based on state */}
                    {isTerminating ? t('terminate_dialog.submitting') : t('terminate_dialog.submit')}
                </Button>

                {/* '취소' Button: Disabled while terminating is active */}
                <Button
                    onClick={handleClose}
                    disabled={isTerminating}
                    sx={{
                        padding: '4px 12px',
                        background: '#EFF6FF',
                        borderRadius: '4px',
                        border: '1px solid #DFEAFF',
                        color: '#6B89FF',
                        fontSize: '15px',
                        fontFamily: 'Roboto',
                        fontWeight: '400',
                        lineHeight: '22.50px',
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: '#E0E8FF',
                        },
                        '&.Mui-disabled': {
                            color: '#6B89FF80',
                            border: '1px solid #DFEAFF80',
                        }
                    }}
                >
                    {t('terminate_dialog.cancel')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const getKeysFromSelectedValue = (fileTree: any, log_tree: any, selectedKey: string) => {
    const filteredValue = log_tree.filter((item: any) => item.label === selectedKey);
    if (!fileTree || typeof fileTree !== 'object' || !fileTree[filteredValue[0]?.key]) {
        return [];
    }

    const selectedObject = fileTree[filteredValue[0]?.key];
    const keys = Object.keys(selectedObject);
    const options = keys.map((key) => ({ label: key, value: key }));
    return options;
};

const getDatesFromSelectedValue = (fileTree: any, log_tree: any, selectedKey: any, selectedFile: any) => {
    const filteredValue = log_tree.filter((item: any) => item.label === selectedKey);
    const fileTreeKey = filteredValue[0]?.key;

    if (!fileTree || typeof fileTree !== 'object' || !fileTree[fileTreeKey] || !fileTree[fileTreeKey][selectedFile]) {
        return [];
    }

    const selectedObject = fileTree[fileTreeKey];
    const dateArray = selectedObject[selectedFile];

    const selectedDateOptions = dateArray.map((dateString: any) => {

        const year = dateString.substring(0, 4);
        const month = dateString.substring(4, 6);
        const day = dateString.substring(6, 8);

        const dateObject = `${year}-${month}-${day}`;


        return {
            label: dateObject,
            value: dateObject
        };
    }) || [];

    return selectedDateOptions;
};