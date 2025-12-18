import React from 'react';
import { Grid, Box, Typography, Button } from '@mui/material';
import { PlayArrowOutlined, ChevronRight, ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import { CONFIG } from 'src/config-global';

const Time = (props: any) => <Box component="img" src={`${CONFIG.assetsDir}/assets/icons/custom/time.svg`} alt="time" {...props} />;
const Archive = (props: any) => <Box component="img" src={`${CONFIG.assetsDir}/assets/icons/custom/archive.svg`} alt="archive" {...props} />;
const Calendar = (props: any) => <Box component="img" src={`${CONFIG.assetsDir}/assets/icons/custom/calendar.svg`} alt="calendar" {...props} />;
const AuditLogIcon = (props: any) => <Box component="img" src={`${CONFIG.assetsDir}/assets/icons/custom/audit-log.svg`} alt="audit-log" {...props} />;

export const AuditLogGrid = ({ data, actions, styles, t }: { data: any, actions: any, styles: any, t: any }) => {
    const { darkColors } = styles;
    const [collapsed, setCollapsed] = React.useState(false);

    const toggleDropDown = () => {
        setCollapsed(!collapsed);
    }

    // Reusable Replay Button Component to avoid duplication
    const ReplayButton = ({ isFullWidth = false }: { isFullWidth: boolean }) => (
        <Button
            disabled={!actions.canReplay}
            endIcon={<ChevronRight sx={{ fontSize: 24 }} />}
            sx={{
                color: actions.canReplay ? darkColors.textPrimary : darkColors.textDisabled,
                backgroundColor: actions.canReplay ? '#5E66FF' : 'transparent',
                fontSize: 17,
                py: 1,
                px: 2,
                width: isFullWidth ? '100%' : 'auto',
                '&.Mui-disabled': { color: darkColors.textDisabled },
                "&:hover": { backgroundColor: actions.canReplay ? '#4E57E5' : 'transparent' },
            }}
            onClick={actions.handleReplay}
        >
            {t('audit_log.replay')}
        </Button>
    );

    return (
        <Box sx={{
            display: { xs: 'block', xl: 'none' }
        }}>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, paddingBottom: '12px', }}>
                <Box sx={{
                    display: 'flex'
                }}>
                    <AuditLogIcon />
                    <Typography variant="body1" sx={{ color: darkColors.textPrimary, fontFamily: 'Roboto, sans-serif !important', fontSize: '15px' }}>
                        {t('audit_log.title')}
                    </Typography>
                </Box>
                <Box sx={{ display: { xs: 'none', lg: 'block', xl: "none" }, alignSelf: 'flex-start !important', }}>
                    <ReplayButton isFullWidth={false} />
                </Box>
            </Box>
            <Grid container spacing={2} sx={{ mt: 1.5, position: 'relative' }}>
                {
                    collapsed ? (
                        <ArrowDropUp
                            onClick={toggleDropDown}
                            sx={{
                                position: 'absolute',
                                right: 0,
                                top: 0,
                                color: '#373F4E'
                            }} />
                    ) : (
                        <ArrowDropDown
                            onClick={toggleDropDown}

                            sx={{
                                position: 'absolute',
                                right: 0,
                                top: 0,
                                color: '#373F4E'
                            }} />
                    )
                }

                {/* COLUMN 1: Log Info & Date */}
                <Grid item xs={12}>
                    <Box sx={{
                        display: 'flex', flexDirection: 'row', gap: 1.5, justifyContent: 'space-between',
                        borderBottom: '1px solid',
                        borderImageSlice: 1,
                        borderImageSource: 'linear-gradient(to right, #181819ff 0%, #667085 50%, #181819ff 100%)',

                    }}>
                        <Typography variant="body1" sx={{ color: darkColors.textPrimary, fontWeight: 900, fontSize: '20px', width: '50%' }}>
                            {data.logType || '-'}{' : '}{data.file || '-'}
                        </Typography>
                        <AuditLogDetailItem
                            icon={Calendar}
                            label={t('audit_log.date')}
                            value={data.date}
                            darkColors={darkColors}
                        />
                    </Box>
                </Grid>
                {(collapsed) && (
                    <>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1.5, justifyContent: 'space-between' }}>
                                <AuditLogDetailItem borderFlag icon={Time} label={t('audit_log.start_time')} value={data.startTime} darkColors={darkColors} />
                                <AuditLogDetailItem borderFlag icon={Time} label={t('audit_log.end_time')} value={data.endTime} darkColors={darkColors} />
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1.5, justifyContent: 'space-between' }}>
                                <AuditLogDetailItem borderFlag icon={Archive} label={t('audit_log.head')} value={data.head} darkColors={darkColors} />
                                <AuditLogDetailItem borderFlag icon={Archive} label={t('audit_log.channel_number')} value={data.channel} darkColors={darkColors} />
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid justifyContent="space-between">
                                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1.5, justifyContent: 'space-between' }}>
                                    <AuditLogDetailItem
                                        icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8.00019 1.33337C5.28495 1.33337 3.23828 2.35718 3.23828 3.71433L3.23828 12.2858C3.23828 13.6429 5.28495 14.6667 8.00019 14.6667C10.7154 14.6667 12.7621 13.6429 12.7621 12.2858L12.7621 3.71433C12.7621 2.35718 10.7154 1.33337 8.00019 1.33337ZM8.00019 2.28576C10.3249 2.28576 11.8097 3.13147 11.8097 3.71433C11.8097 4.29718 10.3249 5.1429 8.00019 5.1429C5.67542 5.1429 4.19066 4.29718 4.19066 3.71433C4.19066 3.13147 5.67447 2.28576 8.00019 2.28576ZM8.00019 13.7143C5.67447 13.7143 4.19066 12.8677 4.19066 12.2858L4.19066 5.1629C5.34671 5.82788 6.6677 6.15119 8.00019 6.09528C9.33267 6.15119 10.6537 5.82788 11.8097 5.1629L11.8097 12.2858C11.8097 12.8677 10.3249 13.7143 8.00019 13.7143Z" fill="#F4F4F8" /></svg>}
                                        label={t('audit_log.destination_to')}
                                        value={data.outboundExpression}
                                        darkColors={darkColors}
                                    />
                                    <AuditLogDetailItem
                                        icon={PlayArrowOutlined}
                                        label={t('audit_log.speed')}
                                        value={data.currentSpeed}
                                        darkColors={darkColors}
                                    />
                                </Box>

                                <Box sx={{ alignSelf: 'flex-end', display: { xs: 'none', xl: 'inline-block' } }}>
                                    <ReplayButton isFullWidth />
                                </Box>
                            </Grid>
                        </Grid>
                    </>
                )}


                {/* Mobile/Tablet Button Row */}
                <Grid item xs={12} sx={{ display: { xs: 'block', lg: 'none' }, textAlign: { xs: 'left', md: 'right', lg: 'center' } }}>
                    <ReplayButton isFullWidth />
                </Grid>
            </Grid>
        </Box>

    );
};

const AuditLogDetailItem = ({ icon: Icon, label, value, darkColors, borderFlag = false }: any) => {
    // Check if Icon is a component (function or memo object) or an element (SVG/Box)
    const renderIcon = () => {
        if (!Icon) return null;
        // If it's a valid React element (like your <svg> or <Box component="img">)
        if (React.isValidElement(Icon)) return Icon;
        // If it's a component (function or object like MUI icons)
        return <Icon sx={{ fontSize: 18, color: darkColors.textPrimary }} />;
    };

    return (
        <Box sx={{
            display: 'flex', width: '48%', gap: 1.5, alignItems: 'center',
            paddingBottom: '8px',
            ...(borderFlag && {
                borderBottom: '0.5px solid',
                borderImageSlice: 0.5,
                borderImageSource: 'linear-gradient(to right, #181819ff 0%, #667085 50%, #181819ff 100%)',
            })
        }}>
            {renderIcon()}

            {
                label && (
                    <Typography
                        variant="body1"
                        sx={{
                            color: darkColors.textPrimary,
                            fontWeight: 600,
                            fontFamily: 'Roboto, sans-serif !important',
                            fontSize: '15px',
                            // Optional: Hide label on mobile if it gets too crowded
                            display: { xs: 'none', md: 'block' }
                        }}
                    >
                        {label}
                    </Typography>
                )
            }

            <Typography
                variant="body1"
                sx={{
                    color: darkColors.textPrimary,
                    fontFamily: 'Roboto, sans-serif !important',
                    fontSize: '15px'
                }}
            >
                {value || '-'}
            </Typography>
        </Box >
    );
};