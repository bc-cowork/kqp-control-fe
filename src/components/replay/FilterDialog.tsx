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

// Assuming FilterDialog props include handleConfirm
export const FilterDialog = ({
    open,
    onClose,
    mode,
    setMode,
    expression,
    setExpression,
    handleReset,
    handleConfirm, // This is the function we need to use
    // Assuming FilterDialog receives errorMessage as well
    errorMessage,
}: any) => {

    const handleClearExpression = () => {
        setExpression('');
    };
    if (!open) {
        return null;
    }

    // New function to handle confirmation in "No Typing" mode
    const handleApplyNoTyping = () => {
        // 1. Set the expression to 'All' (or equivalent for No Typing/View All)
        // Note: We don't need to manually set it to 'All' here if the parent
        // handleFilterConfirm logic determines 'All' when dialogMode is 'All' (No Typing).
        // Let's ensure the parent component's logic handles it, which it does based on `dialogMode`.

        // 2. We explicitly set the expression to the empty string here
        // so that the placeholder logic holds true for "All".
        setExpression('');

        // 3. Call the parent's confirmation handler.
        // The parent logic (handleFilterConfirm) will see that `dialogMode` is 'No Typing' (or 'All' mode)
        // and set the final state (`head` or `channel`) to 'All'.
        handleConfirm();
    }

    // Ensure the mode state uses 'All' and 'Typing' if that's what the parent uses.
    // Based on the parent code's initialization: `setFilterMode('All')` and `dialogMode` is used.
    // We will use 'All' and 'Typing' here for consistency.

    return (
        <Box
            sx={{
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
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                }}
            >
                {/* 1. Mode Toggle Buttons (All / Typing) - Renamed for clarity */}
                <Box
                    sx={{
                        alignSelf: 'stretch',
                        padding: '2px',
                        background: customColors.backgroundTertiary,
                        borderRadius: '6px',
                        display: 'flex',
                        gap: '4px',
                    }}
                >
                    {['No Typing', 'Typing'].map((btnMode) => (
                        <Button
                            key={btnMode}
                            onClick={() => setMode(btnMode)}
                            sx={{
                                flex: '1 1 0',
                                height: 32,
                                padding: '4px 12px',
                                borderRadius: '4px',
                                backgroundColor:
                                    mode === btnMode
                                        ? customColors.buttonTertiaryDefault
                                        : 'transparent',
                                color: customColors.textPrimary,
                                fontSize: 15,
                                fontWeight: 400,
                                lineHeight: '22.50px',
                                textTransform: 'none',
                                boxShadow:
                                    mode === btnMode
                                        ? '0px 4px 4px rgba(10, 14, 21, 0.10)'
                                        : 'none',
                                '&:hover': {
                                    backgroundColor: customColors.buttonTertiaryDefault,
                                }
                            }}
                        >
                            {/* Display 'No Typing' but use 'All' for the state value */}
                            {btnMode === 'No Typing' ? 'No Typing' : 'Typing'}
                        </Button>
                    ))}
                </Box>

                {/* 2. Expression Input Field */}
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
                        placeholder={mode === 'All' ? "" : "Enter expression..."}
                        disabled={mode === 'All'} // Disabled when in 'All' mode
                        InputProps={{
                            // Changed logic to check mode === 'All'
                            startAdornment: mode === 'No Typing' ? (<Box
                                sx={{
                                    width: 120
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: '#7AA2FF'
                                    }}
                                >
                                    View All |
                                </Typography>
                            </Box>) :
                                (<Box
                                    sx={{
                                        width: 90
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            color: '#667085'
                                        }}
                                    >
                                        Typing |
                                    </Typography>
                                </Box>)
                            ,
                            endAdornment: mode === 'Typing' ? (
                                <IconButton
                                    onClick={handleClearExpression}
                                    size="small"
                                    sx={{ color: customColors.graysGray5, p: 0 }}
                                >
                                    <CancelIcon sx={{ width: 20, height: 20 }} />
                                </IconButton>
                            ) : (
                                // Use the standardized confirmation handler for 'All' mode
                                <Button
                                    onClick={handleApplyNoTyping} // <-- FIXED: Use the wrapper function
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
                                    Apply
                                </Button>
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
                    {/* Display error message if needed */}
                    {errorMessage && (
                        <Typography variant="caption" color="error" sx={{ px: 1 }}>
                            {errorMessage}
                        </Typography>
                    )}
                </Box>

                {/* 3. Action Buttons (Reset / 확인) */}
                {
                    mode === 'Typing' && (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Button
                                onClick={handleReset}
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
                    )
                }

            </Box>
        </Box>
    );
};