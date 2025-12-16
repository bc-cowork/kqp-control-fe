import React from "react";
import { Box, Button, TextField, Typography, Grid, IconButton } from "@mui/material"; // Ensure Grid is imported
import { useTranslate } from "src/locales";
import {
    Cancel as CancelIcon,
} from '@mui/icons-material';
import { LogTag } from "./Logtag";

const customColors = {
    backgroundField: '#202838',
    backgroundContainer: '#12161f',
    borderColor: '#4E576A',
    textDisabled: '#667085',
    buttonPrimaryDefault: '#5E66FF',
    buttonPrimaryText: 'white',
};

export const FilterInputBar = ({ expression, setExpression }: any) => {
    const { t } = useTranslate('replay');
    const [inputExpression, setInputExpression] = React.useState(expression);
    const handleClearExpression = () => {
        setInputExpression('');
    }

    return (
        <>
            <Box sx={{ alignSelf: 'stretch', height: 32, display: 'flex', alignItems: 'center' }}>
                <Typography
                    variant="body2"
                    sx={{ color: '#D1D6E0', fontWeight: 400, lineHeight: '22.5px', fontSize: 15 }}
                >
                    {t('audit_log.destination_to')}
                </Typography>
            </Box>
            {expression?.length === 0 ? (
                <Grid
                    container
                    spacing={{ xs: 1, md: 2 }}
                    sx={{
                        width: '100%',
                        paddingBottom: '24px',
                        paddingRight: '8px',
                        paddingLeft: '4px',
                        borderRadius: '8px',
                        alignItems: 'center',
                    }}
                >
                    {/* --- Grid Item for TextField (Input) --- */}
                    <Grid
                        item
                        xs={12} // Full width on xs-md (forces button to next line)
                        md // Auto-size on md and up (fills remaining space)
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                gap: '4px',
                            }}
                        >
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={inputExpression}
                                onChange={(e) => setInputExpression(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Typography
                                                sx={{
                                                    color: '#D1D6E0',
                                                    fontSize: 15,
                                                    width: '60px',
                                                    fontWeight: 400,
                                                    lineHeight: '22.50px',
                                                }}
                                            >
                                                {t('audit_log.typing')} |
                                            </Typography>
                                        </Box>
                                    ),
                                    endAdornment:
                                        inputExpression && (<IconButton
                                            onClick={handleClearExpression}
                                            size="small"
                                            sx={{ color: "#D1D6E0", p: 0 }}
                                        >
                                            <CancelIcon sx={{ width: 20, height: 20 }} />
                                        </IconButton>
                                        ),
                                    sx: {
                                        height: 42,
                                        paddingLeft: '8px',
                                        paddingRight: '8px',
                                        background: customColors.backgroundField,
                                        borderRadius: '8px',
                                        border: `1px solid ${customColors.borderColor}`,
                                        color: '#7AA2FF',

                                        '& fieldset': { border: 'none' },

                                        '& .MuiInputBase-input': {
                                            padding: '0',
                                            height: '100%',
                                        }
                                    },
                                }}
                                sx={{
                                    alignSelf: 'stretch',
                                    '& .MuiInputBase-root': {
                                        paddingLeft: '10px',
                                    },
                                }}
                            />
                        </Box>
                    </Grid>

                    {/* --- Grid Item for Button --- */}
                    <Grid
                        item
                        xs={12} // Full width on xs-md (forces button to next line)
                        md={10}
                        lg="auto" // Only takes the space it needs on md and up (side-by-side)
                        sx={{
                            // Ensures the button is left-aligned when on its own line
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={() => {
                                setExpression(inputExpression);
                            }}
                            sx={{
                                height: 42,
                                padding: '8px 16px',
                                backgroundColor: '#5E66FF !important',
                                color: 'white !important',
                                borderRadius: '8px',
                                fontSize: 17,
                                fontWeight: 400,
                                lineHeight: '25.50px',
                                textTransform: 'none',
                                boxShadow: 'none',

                                // *** CRITICAL CHANGE: Removed responsive width ***
                                // The button's width is now determined only by its content and padding.

                                '&:hover': {
                                    backgroundColor: '#343ecaff !important',
                                    boxShadow: 'none',
                                }
                            }}
                        >
                            {t('audit_log.apply')}
                        </Button>
                    </Grid>
                </Grid>
            ) : (
                <LogTag text={expression} onClose={
                    () => {
                        setExpression('');
                    }
                } />
            )}
        </>
    );
};