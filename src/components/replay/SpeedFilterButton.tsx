import { Box, Button, Typography, Menu, MenuItem } from "@mui/material";
// Using the specific icons you defined
import { ArrowDropUp as ArrowUpwardIcon, ArrowDropDown as ArrowDownwardIcon } from '@mui/icons-material';
import React, { useState } from 'react';

// Define the colors based on the dark theme style visible in the screenshots
const buttonColors = {
    background: '#1D2432', // Used for the button's background
    hover: '#2A3345',      // Hover state for both button and menu
    text: '#F0F1F5',
    icon: '#7AA2FF',
    border: '#4E576A',
    menuBackground: '#2A3345', // Dark background for the dropdown menu
};

// Define the available options (as requested)
const SPEED_OPTIONS = [
    '1.0',
    '1.25',
    '1.5',
    '1.75'
];

export const SpeedSelectFilter = ({ currentSpeed, setCurrentSpeed }: {
    currentSpeed: any;
    setCurrentSpeed: any;
}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelect = (speed: any) => {
        setCurrentSpeed(speed);
        handleClose();
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {/* 1. Label ("Speed") */}
            <Box sx={{ alignSelf: 'stretch', height: 32, display: 'flex', alignItems: 'center' }}>
                <Typography
                    variant="body2"
                    sx={{ color: '#D1D6E0', fontWeight: 400, lineHeight: '22.5px', fontSize: 15 }}
                >
                    Speed
                </Typography>
            </Box>

            {/* 2. Styled Select Button */}
            <Button
                id="speed-select-button"
                aria-controls={open ? 'speed-select-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                variant="contained"
                disableRipple // Optional: disable ripple effect for a flatter look
                endIcon={
                    // Stacked Up/Down Arrow Icons using your compact styling
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        lineHeight: 0,
                        padding: 0,
                        height: 16,
                        justifyContent: 'center',
                        // Ensure icons match the icon color
                        color: 'white',
                    }}>
                        <ArrowUpwardIcon sx={{
                            width: 16,
                            height: 16,
                        }} />
                        <ArrowDownwardIcon sx={{
                            width: 16,
                            height: 16,
                            marginTop: '-10px',
                        }} />
                    </Box>
                }
                sx={{
                    // Button Container Styles
                    height: 32,
                    width: 'fit-content',
                    padding: '4px 12px',
                    backgroundColor: 'transparent !important', // Use defined background color
                    color: 'white !important',
                    fontSize: 15,
                    fontWeight: 400,
                    lineHeight: '22.50px',
                    textTransform: 'none',
                    borderRadius: '4px',
                    border: `1px solid ${buttonColors.border}`,

                    // Hover State
                    '&:hover': {
                        backgroundColor: buttonColors.hover,
                    },
                    // End Icon Slot Styling
                    '& .MuiButton-endIcon': {
                        marginLeft: '4px',
                        marginRight: '-4px',
                        display: 'flex',
                        alignItems: 'center',
                    }
                }}
            >
                {currentSpeed}
            </Button>

            {/* 3. The Dropdown Menu */}
            <Menu
                id="speed-select-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'speed-select-button',
                }}
            >
                {SPEED_OPTIONS.map((speed) => (
                    <MenuItem
                        key={speed}
                        onClick={() => handleSelect(speed)}
                        selected={speed === currentSpeed}
                        sx={{
                            color: buttonColors.text,
                            backgroundColor: buttonColors.menuBackground,
                            fontSize: 15,
                            minHeight: 32,
                            '&:hover': {
                                backgroundColor: '#5E66FF !important', // Hover color for menu items
                            },
                            '&.Mui-selected': {
                                backgroundColor: buttonColors.hover,
                                '&:hover': {
                                    backgroundColor: buttonColors.hover,
                                },
                            }
                        }}
                    >
                        {speed}
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
};