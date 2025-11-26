'use client';

import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Divider, IconButton, InputAdornment } from '@mui/material';
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
    Grid,
    Stack,
} from '@mui/material';
import {
    PlayArrow as PlayIcon,
    Schedule as TimeIcon,
    Event as DateIcon,
    Settings as SetttingsIcon,
    ZoomIn as ZoomInIcon,
    ChevronRight as ChevronRightIcon,
    ErrorOutline as ErrorOutlineIcon,
} from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { useTranslate } from 'src/locales';
import { grey } from '@mui/material/colors';
import { Breadcrumb } from 'src/components/common/Breadcrumb';
import { DashboardContent } from 'src/layouts/dashboard';
import { endpoints, fetcher } from 'src/utils/axios';
import useSWR from 'swr';
import { LoadingScreen } from 'src/components/loading-screen';
import { extractFileOptions } from 'src/utils/extractFileOptions';
import { CustomTextField, darkColors, DateTimeMuiField, SelectField, WideTextField } from 'src/components/replay';
import { FilterDialog } from 'src/components/replay/FilterDialog';

type Props = { params: { node: string } };


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

    const logTypeList = data?.data?.replay_interface?.log_type_list || [];
    const fileTreeList = extractFileOptions(data?.data?.replay_interface?.file_tree) || [];


    const [logType, setLogType] = React.useState('');
    const [file, setFile] = React.useState('');
    const [date, setDate] = React.useState('0000-00-00');
    const [startTime, setStartTime] = React.useState('00:00:00');
    const [endTime, setEndTime] = React.useState('00:00:00');
    const [head, setHead] = React.useState('all');
    const [channel, setChannel] = React.useState('all');

    const [toolPid, setToolPid] = React.useState('');
    const [killDialogOpen, setKillDialogOpen] = React.useState(false);

    // Filter Dialog State
    const [filterDialogOpen, setFilterDialogOpen] = React.useState(false);
    const [filterTarget, setFilterTarget] = React.useState<'HEAD' | 'CHANNEL' | null>(null);
    const [filterMode, setFilterMode] = React.useState('all');

    const handleOpenFilterDialog = (target) => {
        setFilterTarget(target);
        setFilterDialogOpen(true);
        setFilterMode('all');
    };

    const handleCloseFilterDialog = () => {
        setFilterDialogOpen(false);
        setFilterTarget(null);
    };

    const handleFilterChange = (newExpression) => {
        if (filterTarget === 'HEAD') {
            setHead(newExpression);
        } else if (filterTarget === 'CHANNEL') {
            setChannel(newExpression);
        }
    };

    const handleFilterReset = () => {
        if (filterTarget === 'HEAD') {
            setHead('all');
        } else if (filterTarget === 'CHANNEL') {
            setChannel('all');
        }
    };

    const currentExpression = filterTarget === 'HEAD' ? head : channel;
    const setCurrentExpression = filterTarget === 'HEAD' ? setHead : setChannel;


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
                                                            cursor: 'pointer',
                                                        }}
                                                        onClick={() => setToolPid(row.pid)}
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
                                                Kill
                                            </Button>
                                            <CustomDialog
                                                open={killDialogOpen}
                                                handleClose={() => setKillDialogOpen(false)}
                                                pid={toolPid}
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
                                                        options={fileTreeList as never[]}
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
                                                        onClick={() => handleOpenFilterDialog('HEAD')}
                                                    />
                                                    <FilterDialog
                                                        open={filterDialogOpen}
                                                        onClose={handleCloseFilterDialog}
                                                        mode={filterMode}
                                                        setMode={setFilterMode}
                                                        expression={currentExpression}
                                                        setExpression={setCurrentExpression}
                                                        handleReset={handleFilterReset}
                                                        handleConfirm={handleCloseFilterDialog}
                                                    />
                                                    <WideTextField
                                                        label="Channel Number"
                                                        value={channel}
                                                        onChange={(e) => setChannel(e.target.value)}
                                                        placeholder="all"
                                                        onClick={() => handleOpenFilterDialog('CHANNEL')}
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

const CustomDialog = ({ open, handleClose, pid }) => {
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
                    팝업 메세지
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
                    종료 하시겠습니까?
                </Typography>
            </DialogContent>

            <DialogActions
                sx={{
                    padding: '20px 12px',
                    justifyContent: 'flex-end',
                    gap: '10px',
                }}
            >
                <Button
                    onClick={handleClose}
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
                    }}
                >
                    확인
                </Button>

                <Button
                    onClick={handleClose}
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
                    }}
                >
                    취소
                </Button>
            </DialogActions>
        </Dialog>
    );
};

