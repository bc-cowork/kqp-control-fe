import styled from "@emotion/styled";
import { ToggleButton, SvgIcon, useTheme } from "@mui/material";

const StyledToggleButton = styled(ToggleButton)(({ theme }: any) => ({
    fontSize: 15,
    fontWeight: 400,
    color: theme.palette.primary.contrastText,
    border: theme.palette.mode === 'dark' ? '2px solid black' : '2px solid #E0E4EB',
    height: 32,
    width: 32,
    padding: '3px 12px',
    '&.Mui-selected': {
        backgroundColor: theme.palette.mode === 'dark' ? '#373F4E' : '#FFFFFF',
        boxShadow: theme.palette.mode === 'dark' ? '0px 2px 4px rgba(0, 0, 0, 0.1)' : '0px 2px 4px rgba(255, 255, 255, 0.1)',
        '&:hover': {
            backgroundColor: theme.palette.grey[400],
            color: 'black',
        },
    },
    '&:not(.Mui-selected)': {
        backgroundColor: theme.palette.mode === 'dark' ? '#373F4E' : '#FFFFFF',
        '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? '#4E576A' : '#FFFFFF',
        },
    },
}));


export const RrefreshButton = ({ onRefresh }: { onRefresh: () => void }) => {
    const theme = useTheme();
    const fillColor = theme.palette.mode === 'dark' ? 'white' : '#667085'
    return (
        <StyledToggleButton
            value="refresh"
            aria-label="refresh option"
            onClick={() => onRefresh?.()}
            sx={{ px: '5px' }}
        >
            <SvgIcon
                sx={{
                    height: 24,
                    width: 24,
                    p: 0.5,
                }}
            >
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M1.79811 7.00104C1.79811 4.13197 4.13783 1.80104 7.03031 1.80104C8.99489 1.80104 10.7061 2.87693 11.6008 4.46777H9.53301C9.23846 4.46777 8.99967 4.70656 8.99967 5.00111C8.99967 5.29566 9.23846 5.53444 9.53301 5.53444H12.8663C13.1609 5.53444 13.3997 5.29566 13.3997 5.00111V1.66777C13.3997 1.37322 13.1609 1.13444 12.8663 1.13444C12.5718 1.13444 12.333 1.37322 12.333 1.66777V3.61761C11.2127 1.88315 9.25609 0.734375 7.03031 0.734375C3.55436 0.734375 0.731445 3.53724 0.731445 7.00104C0.731445 10.4648 3.55436 13.2677 7.03031 13.2677C10.186 13.2677 12.8023 10.9584 13.2588 7.94082C13.3028 7.64958 13.1025 7.37777 12.8112 7.33371C12.52 7.28965 12.2482 7.49003 12.2041 7.78127C11.826 10.2807 9.65511 12.201 7.03031 12.201C4.13783 12.201 1.79811 9.87009 1.79811 7.00104Z"
                        fill={fillColor}
                    />
                </svg>
            </SvgIcon>
        </StyledToggleButton>
    )
}