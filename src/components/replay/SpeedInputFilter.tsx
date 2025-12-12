import {
    Box,
    Typography,
    TextField,
    InputAdornment,
} from "@mui/material";
import {
    ArrowDropUp as ArrowUpwardIcon,
    ArrowDropDown as ArrowDownwardIcon
} from '@mui/icons-material';
import React from 'react';

const inputColors = {
    background: '#1D2432',
    hover: '#2A3345',
    text: '#F0F1F5',
    border: '#4E576A',
};

const STEP_VALUE = 0.25;

export const SpeedInputFilter = ({ currentSpeed, setCurrentSpeed }: {
    currentSpeed: string;
    setCurrentSpeed: (speed: string) => void;
}) => {

    const updateSpeed = (newVal: number) => {
        setCurrentSpeed(newVal.toFixed(2).replace(/\.00$/, ''));
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        if (newValue === '' || /^\d*\.?\d*$/.test(newValue)) {
            setCurrentSpeed(newValue);
        }
    };

    const handleIncrement = () => {
        const currentVal = parseFloat(currentSpeed) || 0;
        updateSpeed(currentVal + STEP_VALUE);
    };

    const handleDecrement = () => {
        const currentVal = parseFloat(currentSpeed) || 0;
        const newVal = Math.max(0.1, currentVal - STEP_VALUE);
        updateSpeed(newVal);
    };

    const ArrowControls = (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                lineHeight: 0,
                padding: 0,
                justifyContent: 'center',
                marginRight: '-6px',
            }}
        >
            <ArrowUpwardIcon
                onClick={handleIncrement}
                sx={{
                    width: 18,
                    height: 18,
                    color: 'white',
                    cursor: 'pointer',
                    '&:hover': { opacity: 0.8 },
                }}
            />
            <ArrowDownwardIcon
                onClick={handleDecrement}
                sx={{
                    width: 18,
                    height: 18,
                    cursor: 'pointer',
                    color: 'white',
                    marginTop: '-10px',
                    '&:hover': { opacity: 0.8 },
                }}
            />
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', width: 'fit-content' }}>
            <Box sx={{ alignSelf: 'stretch', height: 32, display: 'flex', alignItems: 'center' }}>
                <Typography
                    variant="body2"
                    sx={{ color: '#D1D6E0', fontWeight: 400, lineHeight: '22.5px', fontSize: 15 }}
                >
                    Speed
                </Typography>
            </Box>

            <TextField
                value={currentSpeed}
                onChange={handleInputChange}
                variant="outlined"
                type="text"
                inputProps={{
                    style: { textAlign: 'center' }
                }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            {ArrowControls}
                        </InputAdornment>
                    ),
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        height: 32,
                        width: '70px',
                        padding: '4px 8px',
                        color: inputColors.text,
                        fontSize: 15,
                        fontWeight: 400,
                        lineHeight: '22.50px',
                        borderRadius: '4px',
                        border: `1px solid ${inputColors.border}`,

                        '& fieldset': {
                            border: 'none',
                        },
                        '&:hover fieldset': {
                            border: 'none',
                        },
                        '&.Mui-focused fieldset': {
                            border: 'none',
                        },

                        '&:hover': {
                            backgroundColor: 'transparent',
                        },
                    },
                    '& .MuiInputBase-input': {
                        padding: '0',
                        height: '100%',
                    },
                }}
            />
        </Box>
    );
};