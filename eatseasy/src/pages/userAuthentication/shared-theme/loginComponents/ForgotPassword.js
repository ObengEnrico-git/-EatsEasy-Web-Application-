import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import axios from 'axios';
import { Alert } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import AlertTitle from '@mui/material/AlertTitle';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

function ForgotPassword({ open, handleClose }) {
  const [alertInfo, setAlertInfo] = React.useState({
    show: false,
    type: '',
    message: ''
  });
  const [loading, setLoading] = React.useState(false);
  const [attempts, setAttempts] = React.useState(0);
  const MAX_ATTEMPTS = 5;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (attempts >= MAX_ATTEMPTS) {
      setAlertInfo({
        show: true,
        type: 'error',
        message: 'Maximum password reset attempts reached. Please try again later.'
      });
      return;
    }

    setLoading(true);
    setAttempts(prev => prev + 1);
    
    const fullNameInput = event.target.querySelector('#fullName');
    const emailInput = event.target.querySelector('#email');
    const currentPassword = event.target.querySelector('#currentPassword');
    const newPassword = event.target.querySelector('#confirmNewPassword');

    if (!fullNameInput || !emailInput || !currentPassword || !newPassword) {
      console.error('Required form fields are missing');
      return;
    }

    const formData = {
      username: fullNameInput.value,
      email: emailInput.value,
      currentPassword: currentPassword.value,
      newPassword: newPassword.value
    };

    try {
      await axios.post('http://localhost:8000/forgotpassword', formData);
      setAlertInfo({
        show: true,
        type: 'success',
        message: 'Password reset successful'
      });
      setTimeout(() => {
        setLoading(false);
        handleClose();
      }, 3000);
    } catch (error) {
      setAlertInfo({
        show: true,
        type: 'error',
        message: `Password reset failed: ${error.response?.data?.error || error.message}`
      });
      setLoading(false);
    }
  };

  const attemptsRemaining = MAX_ATTEMPTS - attempts;

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit,
          sx: { backgroundImage: 'none' },
        }}
      >
        <DialogTitle>Reset password</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
        >
          <DialogContentText>
            Enter your accounts email address, full name and old password, then enter in the new password you want.
            {attemptsRemaining < MAX_ATTEMPTS && (
              <Typography color="warning.main" sx={{ mt: 1 }}>
                Attempts remaining: {attemptsRemaining}
              </Typography>
            )}
          </DialogContentText>
          <OutlinedInput
            autoFocus
            required
            id="fullName"
            name="fullName"
            placeholder="Full Name"
            type="text"
            fullWidth
          />
          <OutlinedInput
            required
            id="email"
            name="email"
            placeholder="Email address"
            type="email"
            fullWidth
          />
          <OutlinedInput
            required
            id="currentPassword"
            name="currentPassword"
            placeholder="Current Password"
            type="password"
            fullWidth
          />
          <OutlinedInput
            required
            id="confirmNewPassword"
            name="confirmNewPassword"
            placeholder="Confirm New Password"
            type="password"
            fullWidth
          />
        </DialogContent>
        <DialogActions sx={{ pb: 3, px: 3 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            variant="contained" 
            type="submit"
            disabled={attempts >= MAX_ATTEMPTS}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.modal + 1 // Ensure it's IN FRONT of the card, not behind
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar
        open={alertInfo.show}
        autoHideDuration={6000}
        onClose={() => setAlertInfo({ show: false, type: '', message: '' })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setAlertInfo({ show: false, type: '', message: '' })}
          severity={alertInfo.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          <AlertTitle>
            {alertInfo.type === 'success' ? 'Success' : 'Error'}
          </AlertTitle>
          {alertInfo.message}
        </Alert>
      </Snackbar>
    </>
  );
}

ForgotPassword.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default ForgotPassword;