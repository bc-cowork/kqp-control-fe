'use client';

import React, { Component, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import {
    Box,
    Container,
    Typography,
    Button,
    Paper,
    Stack,
    Collapse,
    Alert,
    Avatar,
} from '@mui/material';
import {
    ErrorOutline,
    Refresh,
    Home,
    ExpandMore,
    ExpandLess,
} from '@mui/icons-material';
import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';
import { Breadcrumb } from '../common/Breadcrumb';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
    resetKeys?: Array<string | number>;
    t: (key: string) => string;
}

interface State {
    hasError: boolean;
    error?: Error;
    showDetails: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, showDetails: false };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidUpdate(prevProps: Props) {
        if (
            this.state.hasError &&
            this.props.resetKeys &&
            prevProps.resetKeys &&
            this.props.resetKeys.some((key, index) => key !== prevProps.resetKeys![index])
        ) {
            this.setState({ hasError: false, error: undefined, showDetails: false });
        }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);

        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }

    handleReset = () => {
        this.setState({ hasError: false, error: undefined, showDetails: false });
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    toggleDetails = () => {
        this.setState((prev) => ({ showDetails: !prev.showDetails }));
    };

    render() {
        const { t } = this.props;

        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <DashboardContent maxWidth="xl">
                    <Breadcrumb />
                    <Box
                        sx={{
                            minHeight: '80vh',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            pt: '20px'
                        }}
                    >
                        <Container maxWidth="sm">
                            <Paper
                                elevation={8}
                                sx={{
                                    p: { xs: 3, sm: 5 },
                                    borderRadius: 3,
                                    textAlign: 'center',
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        bgcolor: 'error.light',
                                        mx: 'auto',
                                        mb: 3,
                                    }}
                                >
                                    <ErrorOutline sx={{ fontSize: 48, color: 'error.main' }} />
                                </Avatar>

                                <Typography
                                    variant="h4"
                                    component="h1"
                                    gutterBottom
                                    fontWeight="bold"
                                    color="text.primary"
                                >
                                    {t('errorBoundary.title')}
                                </Typography>

                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    sx={{ mb: 3 }}
                                >
                                    {t('errorBoundary.description')}
                                </Typography>

                                {this.state.error && (
                                    <Box sx={{ mb: 3 }}>
                                        <Button
                                            size="small"
                                            onClick={this.toggleDetails}
                                            endIcon={
                                                this.state.showDetails ? <ExpandLess /> : <ExpandMore />
                                            }
                                            sx={{ mb: 1 }}
                                        >
                                            {t('errorBoundary.technicalDetails')}
                                        </Button>
                                        <Collapse in={this.state.showDetails}>
                                            <Alert severity="error" sx={{ textAlign: 'left' }}>
                                                <Typography
                                                    variant="body2"
                                                    component="code"
                                                    sx={{
                                                        fontFamily: 'monospace',
                                                        wordBreak: 'break-word',
                                                    }}
                                                >
                                                    {this.state.error.message}
                                                </Typography>
                                            </Alert>
                                        </Collapse>
                                    </Box>
                                )}

                                <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    spacing={2}
                                    justifyContent="center"
                                    sx={{ mb: 3 }}
                                >
                                    <Button
                                        variant="contained"
                                        size="large"
                                        startIcon={<Refresh />}
                                        onClick={this.handleReset}
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            px: 4,
                                        }}
                                    >
                                        {t('errorBoundary.tryAgain')}
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        startIcon={<Home />}
                                        onClick={this.handleGoHome}
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            px: 4,
                                        }}
                                    >
                                        {t('errorBoundary.goToHomepage')}
                                    </Button>
                                </Stack>
                            </Paper>
                        </Container>
                    </Box>
                </DashboardContent>
            );
        }

        return this.props.children;
    }
}

function ErrorBoundaryWithRouter(props: Omit<Props, 'resetKeys' | 't'>) {
    const pathname = usePathname();
    const { t } = useTranslate('error-boundary');

    return (
        <ErrorBoundary {...props} resetKeys={[pathname]} t={t} />
    );
}

export default ErrorBoundaryWithRouter;