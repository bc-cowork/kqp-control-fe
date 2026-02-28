import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { ErrorOutline as ErrorOutlineIcon } from '@mui/icons-material';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

type SaveConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSaving: boolean;
};

export function SaveConfirmDialog({ open, onClose, onConfirm, isSaving }: SaveConfirmDialogProps) {
  const { t } = useTranslate('data-flow');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: '#0A0E15',
          borderRadius: '8px',
          border: '1px solid #4E576A',
          color: '#F0F1F5',
          width: '100%',
          maxWidth: 400,
          p: '12px',
          boxShadow: 'none',
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 0,
          m: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          height: 32,
        }}
      >
        <ErrorOutlineIcon />
        <Typography
          variant="body1"
          sx={{
            color: '#F0F1F5',
            fontSize: 15,
            fontWeight: 400,
            lineHeight: '22.50px',
          }}
        >
          {t('sandbox.save_confirm_title')}
        </Typography>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 0,
          mt: '8px',
          minHeight: 108,
          backgroundColor: '#161C25',
          borderRadius: '8px',
          border: '1px solid #4E576A',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          px: '12px',
          py: 0,
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: '#F0F1F5',
            fontSize: 15,
            fontWeight: 400,
            lineHeight: '22.50px',
            textAlign: 'center',
          }}
        >
          {t('sandbox.save_confirm_message')}
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          p: 0,
          mt: '8px',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '10px',
          pt: '20px',
          pb: '20px',
        }}
      >
        <Button
          onClick={onConfirm}
          disabled={isSaving}
          sx={{
            padding: '4px 12px',
            backgroundColor: '#5E66FF',
            borderRadius: '4px',
            color: 'white',
            fontSize: 15,
            fontWeight: 400,
            lineHeight: '22.50px',
            textTransform: 'none',
            '&:hover': { backgroundColor: '#4E57E5' },
          }}
        >
          {isSaving ? t('sandbox.saving') : t('sandbox.save_confirm_btn')}
        </Button>
        <Button
          onClick={onClose}
          sx={{
            padding: '4px 12px',
            backgroundColor: '#EFF6FF',
            borderRadius: '4px',
            border: '1px solid #DFEAFF',
            color: '#6B89FF',
            fontSize: 15,
            fontWeight: 400,
            lineHeight: '22.50px',
            textTransform: 'none',
            '&:hover': { backgroundColor: '#E0E8FF' },
          }}
        >
          {t('sandbox.save_cancel_btn')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
