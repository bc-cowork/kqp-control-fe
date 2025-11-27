import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    Button
} from '@mui/material';
import {
    HelpOutline as HelpOutlineIcon
} from '@mui/icons-material';

const customDialogColors = {
    backgroundBlack: '#0A0E15',
    borderGray: '#4E576A',
    textPrimary: '#F0F1F5',
    contentBackground: '#161C25',
    buttonPrimaryDefault: '#5E66FF',
    buttonSecondaryBackground: '#EFF6FF',
    buttonSecondaryBorder: '#DFEAFF',
    buttonSecondaryText: '#6B89FF',
};

type AddReplayDialogProps = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message?: string;
    title?: string;
};

export const AddReplayDialog = ({
    open,
    onClose,
    onConfirm,
    message = '재생 하시겠습니까?',
    title = '팝업 메세지',
}: AddReplayDialogProps) => {

    const handleConfirm = () => {
        onConfirm();
        onClose(); // Assuming confirmation closes the dialog
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                // Styling for the main dialog paper (the entire box)
                sx: {
                    backgroundColor: customDialogColors.backgroundBlack,
                    borderRadius: '8px',
                    border: `1px solid ${customDialogColors.borderGray}`,
                    color: customDialogColors.textPrimary,
                    width: '100%',
                    maxWidth: 400, // Added a reasonable max width for a popup
                    p: '12px', // Matches outer padding
                    boxShadow: 'none', // Remove default Material UI shadow
                },
            }}
        >
            {/* 1. Title/Header Section */}
            <DialogTitle
                sx={{
                    // Corresponds to the inner `alignSelf: 'stretch'` div
                    p: 0,
                    m: 0, // Reset default padding/margin
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    height: 32,
                    alignSelf: 'stretch',
                }}
            >
                {/* Icon Placeholder */}
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <HelpOutlineIcon
                        sx={{
                            width: 20,
                            height: 20,
                            color: customDialogColors.textPrimary, // Use primary text color
                        }}
                    />
                </Box>

                {/* Title Text */}
                <Typography
                    variant="body1"
                    sx={{
                        color: customDialogColors.textPrimary,
                        fontSize: 15,
                        fontWeight: 400,
                        lineHeight: '22.50px',
                    }}
                >
                    {title}
                </Typography>
            </DialogTitle>

            {/* 2. Content/Message Area */}
            <DialogContent
                sx={{
                    // Corresponds to the message background box
                    p: 0, // Reset default padding
                    mt: '8px', // Gap between title and content
                    alignSelf: 'stretch',
                    minHeight: 108, // Fixed height from original
                    backgroundColor: customDialogColors.contentBackground,
                    borderRadius: '8px',
                    border: `1px solid ${customDialogColors.borderGray}`,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    // Inner padding from original styles
                    px: '12px',
                    py: 0,
                }}
            >
                <Typography
                    variant="body1"
                    sx={{
                        color: customDialogColors.textPrimary,
                        fontSize: 15,
                        fontWeight: 400,
                        lineHeight: '22.50px',
                        textAlign: 'center',
                    }}
                >
                    {message}
                </Typography>
            </DialogContent>

            {/* 3. Actions/Buttons */}
            <DialogActions
                sx={{
                    // Corresponds to the action button container
                    p: 0, // Reset default padding
                    mt: '8px', // Gap between content and actions
                    alignSelf: 'stretch',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: '10px',
                    // The padding for top/bottom (20px) is applied here as vertical padding
                    pt: '20px',
                    pb: '20px',
                }}
            >
                {/* Confirm (확인) Button */}
                <Button
                    onClick={handleConfirm}
                    sx={{
                        padding: '4px 12px',
                        backgroundColor: customDialogColors.buttonPrimaryDefault,
                        borderRadius: '4px',
                        color: 'white',
                        fontSize: 15,
                        fontWeight: 400,
                        lineHeight: '22.50px',
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: '#4E57E5', // Slightly darker hover
                        }
                    }}
                >
                    확인
                </Button>

                {/* Cancel (취소) Button */}
                <Button
                    onClick={onClose}
                    sx={{
                        padding: '4px 12px',
                        backgroundColor: customDialogColors.buttonSecondaryBackground,
                        borderRadius: '4px',
                        border: `1px solid ${customDialogColors.buttonSecondaryBorder}`,
                        color: customDialogColors.buttonSecondaryText,
                        fontSize: 15,
                        fontWeight: 400,
                        lineHeight: '22.50px',
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: '#E0E8FF', // Slightly darker hover
                        }
                    }}
                >
                    취소
                </Button>
            </DialogActions>
        </Dialog>
    );
};