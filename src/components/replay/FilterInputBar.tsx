import React from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { LogTag } from "./Logtag";
import { useTranslate } from "src/locales";

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
            {expression?.length === 0 ? (<Box
                sx={{
                    width: '100%',
                    paddingBottom: '24px',
                    paddingRight: '8px',
                    paddingLeft: '4px',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: '20px',
                }}
            >

                <Box
                    sx={{
                        flex: '1 1 0',
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
                                            color: customColors.textDisabled,
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
                            sx: {
                                height: 42,
                                paddingLeft: '8px',
                                paddingRight: '8px',
                                background: customColors.backgroundField,
                                borderRadius: '8px',
                                border: `1px solid ${customColors.borderColor}`,

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

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        gap: '8px',
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
                            borderRadius: '4px',
                            fontSize: 17,
                            fontWeight: 400,
                            lineHeight: '25.50px',
                            textTransform: 'none',
                            boxShadow: 'none',
                            '&:hover': {
                                backgroundColor: '#343ecaff !important',
                                boxShadow: 'none',
                            }
                        }}
                    >
                        {t('audit_log.apply')}
                    </Button>
                </Box>
            </Box>) : (
                <LogTag text={expression} onClose={
                    () => {
                        setExpression('');
                    }
                } />
            )}
        </>

    );
};