import { Box, Button, TextField, IconButton, Typography } from "@mui/material";
import {
    Cancel as CancelIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material';

const customColors = {
    backgroundField: '#202838',
    backgroundTertiary: '#0A0E15',
    buttonTertiaryDefault: '#373F4E',
    textPrimary: '#F0F1F5',
    textEmphasized: '#7AA2FF',
    buttonPrimaryDefault: '#5E66FF',
    graysGray5: '#D1D6E0',
};

export const FilterDialog = ({
    open,
    onClose,
    mode,
    setMode,
    expression,
    setExpression,
    handleReset,
    handleConfirm,
    errorMessage,
    setValue
}: any) => {

    const handleClearExpression = () => {
        setExpression('');
    };

    if (!open) {
        return null;
    }

    return (
        <Box
            sx={{
                // Main dialog container styling
                backgroundColor: '#202838',
                borderRadius: 1,
                padding: '8px',
                boxShadow: '0px 4px 20px rgba(10, 14, 21, 0.20)',
                width: '100%',
                maxWidth: '400px',
            }}
        >
            <Box
                sx={{
                    // Content wrapper
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                }}
            >

                <Box
                    sx={{
                        alignSelf: 'stretch',
                        paddingBottom: 1.5,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                    }}
                >

                    <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={expression}
                        onChange={(e) => setExpression(e.target.value)}
                        placeholder="Enter expression..."
                        disabled={mode === 'All'}
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    onClick={handleClearExpression}
                                    size="small"
                                    sx={{ color: customColors.graysGray5, p: 0 }}
                                >
                                    <CancelIcon sx={{ width: 20, height: 20 }} />
                                </IconButton>
                            ),
                            sx: {
                                height: 42,
                                padding: '0 8px 0 12px',
                                backgroundColor: customColors.backgroundField,
                                color: customColors.textEmphasized,
                                fontSize: 15,
                                lineHeight: '22.50px',
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: customColors.textEmphasized,
                                    borderWidth: '1px',
                                },
                                '&:not(.Mui-focused) .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'transparent',
                                },
                                borderRadius: '2px',
                            },
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                border: `1px solid #4E576A`,
                                outlineOffset: '-1px',
                                borderRadius: '8px',
                            }
                        }}
                    />
                    {errorMessage && (
                        <Typography variant="caption" color="error" sx={{ px: 1 }}>
                            {errorMessage}
                        </Typography>
                    )}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button
                        onClick={() => {
                            handleReset();
                            onClose();
                        }}
                        startIcon={
                            <RefreshIcon sx={{ color: customColors.graysGray5, width: 16, height: 16 }} />
                        }
                        sx={{
                            height: 32,
                            padding: '4px 12px 4px 8px',
                            background: customColors.buttonTertiaryDefault,
                            border: `1px solid ${customColors.textPrimary}`,
                            color: customColors.textPrimary,
                            fontSize: 15,
                            fontWeight: 400,
                            lineHeight: '22.50px',
                            textTransform: 'none',
                            borderRadius: 1,
                            '&:hover': {
                                backgroundColor: '#47505F',
                            }
                        }}
                    >
                        Reset
                    </Button>

                    <Button
                        onClick={handleConfirm}
                        sx={{
                            height: 32,
                            padding: '4px 12px',
                            background: customColors.buttonPrimaryDefault,
                            color: 'white',
                            fontSize: 15,
                            fontWeight: 400,
                            lineHeight: '22.50px',
                            textTransform: 'none',
                            borderRadius: 1,
                            '&:hover': {
                                backgroundColor: '#4E57E5',
                            }
                        }}
                    >
                        확인
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};