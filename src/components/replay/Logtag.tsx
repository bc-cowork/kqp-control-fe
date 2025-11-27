import { Box, Typography } from "@mui/material";
import {
    CancelOutlined as KeyboardArrowRightIcon,
} from '@mui/icons-material';

const customTagColors = {
    background: '#212447',
    outlineBorder: '#1D2654',
    textPrimary: '#7AA2FF',
    iconPrimary: '#6B89FF',
};

export const LogTag = ({ text = '수신로그', onClose }: { text?: string, onClose: any }) =>
(
    <Box
        sx={{
            width: 'fit-content',
            padding: '4px',
            paddingLeft: '8px',
            paddingRight: '8px',
            backgroundColor: customTagColors.background,
            borderRadius: '4px',
            border: `1px solid ${customTagColors.outlineBorder}`,
            display: 'inline-flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: '4px',
            minWidth: 'fit-content',
        }}
    >
        {/* Log Status Text (수신로그) */}
        <Typography
            sx={{
                color: customTagColors.textPrimary,
                fontSize: 15,
                fontFamily: 'Roboto',
                fontWeight: 400,
                lineHeight: '22.50px',
                // Your original styles for text:
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
            }}
        >
            {text}
        </Typography>

        {/* Icon Element (The directional shape) */}
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
            }}
            onClick={onClose}
        >
            <KeyboardArrowRightIcon
                sx={{
                    width: 16,
                    height: 16,
                    color: customTagColors.iconPrimary,
                }}
            />
        </Box>
    </Box>
);
