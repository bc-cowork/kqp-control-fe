import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { ErrorOutline as ErrorOutlineIcon } from '@mui/icons-material';

import { T } from 'src/theme/tokens';

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
          backgroundColor: T.bgPanel,
          borderRadius: '12px',
          border: `1px solid ${T.border}`,
          color: T.textPrim,
          width: '100%',
          maxWidth: 470,
          p: '18px',
          boxShadow: '0 18px 50px rgba(0,0,0,0.5)',
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
        <ErrorOutlineIcon sx={{ color: T.textSec }} />
        <Typography
          variant="body1"
          sx={{
            color: T.textPrim,
            fontSize: 17,
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
          backgroundColor: T.bgCard,
          borderRadius: '8px',
          border: `1px solid ${T.borderSub}`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          px: '18px',
          py: 0,
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: T.textDim,
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
          mt: '20px',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <Button
          onClick={onClose}
          disableRipple
          sx={{
            height: 32,
            px: '14px',
            minWidth: 0,
            backgroundColor: T.bgCard,
            borderRadius: '6px',
            border: `1px solid ${T.border}`,
            color: T.textSec,
            fontSize: 15,
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { backgroundColor: T.bgHover, color: T.textPrim },
          }}
        >
          {t('sandbox.save_cancel_btn')}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isSaving}
          disableRipple
          sx={{
            height: 32,
            px: '14px',
            minWidth: 0,
            backgroundColor: T.primary,
            borderRadius: '6px',
            color: '#fff',
            fontSize: 15,
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { backgroundColor: T.primaryHov },
          }}
        >
          {isSaving ? t('sandbox.saving') : t('sandbox.save_confirm_btn')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
