import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';
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
          p: '20px',
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
        }}
      >
        <ErrorOutlineIcon sx={{ color: T.textSec, fontSize: 18, display: 'block' }} />
        <Typography
          variant="body1"
          sx={{
            color: T.textSec,
            fontSize: 16,
            fontWeight: 400,
            lineHeight: '20px',
          }}
        >
          {t('sandbox.save_confirm_title')}
        </Typography>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 0,
          mt: '18px',
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
            color: T.link,
            fontSize: 15,
            fontWeight: 300,
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
          mt: '18px',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '11px',
          // Theme's MuiDialogActions adds marginLeft to non-first children — reset so gap alone controls spacing.
          '& > :not(:first-of-type)': { ml: 0 },
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
            '&:hover': { backgroundColor: T.bgHover, color: T.textSec },
          }}
        >
          {t('sandbox.save_cancel_btn')}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isSaving}
          disableRipple
          startIcon={isSaving ? <CircularProgress size={14} color="inherit" /> : undefined}
          sx={{
            height: 32,
            px: '14px',
            minWidth: 0,
            backgroundColor: T.bgCard,
            border: `1px solid ${T.border}`,
            borderRadius: '6px',
            color: T.link,
            fontSize: 15,
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { backgroundColor: T.bgHover, color: T.link },
            '&.Mui-disabled': { color: T.textDim, backgroundColor: T.bgCard },
          }}
        >
          {isSaving ? t('sandbox.saving') : t('sandbox.save_confirm_btn')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
